// Pure-engine unit tests — no Firebase, no network. Run: npm test
import { test } from "node:test";
import assert from "node:assert/strict";

import {
  initialFamilyState,
  memberCapacity,
  generateContributionPlan,
  applyFamilyContribution,
  familyProgressPct,
  validateParentReward,
  rewardId,
} from "../src/logic/familyEngine.js";
import {
  initialOffersState,
  initialLoyaltyState,
  buildPredictedOffers,
  decideOffer,
  settleOffer,
} from "../src/logic/offerEngine.js";
import { applyCheer, initialState } from "../src/logic/petEngine.js";
import { MOCK_FINANCIAL_PROFILES } from "../src/mocks/openBanking.js";

// ── Capacity engine (20% safe-saving rate) ───────────────

test("memberCapacity: safe surplus formula exact", () => {
  const ahmed = memberCapacity(MOCK_FINANCIAL_PROFILES.ahmed);
  assert.equal(ahmed.safeSurplus, 18000 - 8000 - 4500 - 2000); // 3500
  assert.equal(ahmed.savingCapacity, 700); // 3500 * 0.2
  assert.equal(memberCapacity(MOCK_FINANCIAL_PROFILES.sarah).savingCapacity, 400);
  assert.equal(memberCapacity(MOCK_FINANCIAL_PROFILES.rashid).savingCapacity, 100);
});

test("memberCapacity: never negative", () => {
  const { savingCapacity } = memberCapacity({ income: 100, fixedExpenses: 500, essentialExpenses: 0, safetyBuffer: 0 });
  assert.equal(savingCapacity, 0);
});

test("generateContributionPlan: approved demo allocations emerge from inputs", () => {
  const family = initialFamilyState();
  const plan = generateContributionPlan(family, MOCK_FINANCIAL_PROFILES, family.deadline - 7 * 30 * 86_400_000);
  assert.equal(plan.engine, "explainable-saving-capacity");
  assert.equal(plan.monthsRemaining, 7);
  assert.equal(plan.monthlyRequired, 1200); // ceil((12000-3600)/7)
  assert.equal(plan.totalCapacity, 1200);
  assert.equal(plan.allocations.ahmed.amount, 700);
  assert.equal(plan.allocations.sarah.amount, 400);
  assert.equal(plan.allocations.rashid.amount, 100);
  assert.ok(plan.allocations.sarah.explanation.includes("فائض آمن"));
  assert.equal(plan.allocations.sarah.safeSurplus, 2000);
});

test("generateContributionPlan: deterministic — same inputs, same output", () => {
  const family = initialFamilyState();
  const t = family.deadline - 60 * 86_400_000;
  const p1 = generateContributionPlan(family, MOCK_FINANCIAL_PROFILES, t);
  const p2 = generateContributionPlan(family, MOCK_FINANCIAL_PROFILES, t);
  assert.deepEqual(p1.allocations, p2.allocations);
  assert.equal(p1.monthlyRequired, p2.monthlyRequired);
});

// ── Family contributions ─────────────────────────────────

test("applyFamilyContribution: happy path updates member + total", () => {
  const family = initialFamilyState();
  const { family: next, event } = applyFamilyContribution(family, { memberId: "rashid", amount: 15, source: "offer-saving" });
  assert.equal(next.savedAmount, 3615);
  assert.equal(next.members.rashid.contributed, 315);
  assert.equal(event.source, "offer-saving");
});

test("applyFamilyContribution: errors on unknown member / bad amount", () => {
  const family = initialFamilyState();
  assert.equal(applyFamilyContribution(family, { memberId: "ghost", amount: 10 }).error, "unknown_member");
  assert.equal(applyFamilyContribution(family, { memberId: "rashid", amount: -5 }).error, "invalid_amount");
});

test("family goal reached flips status", () => {
  const family = { ...initialFamilyState(), savedAmount: 11990 };
  const { family: next } = applyFamilyContribution(family, { memberId: "ahmed", amount: 10 });
  assert.equal(next.status, "reached");
  assert.equal(familyProgressPct(next), 100);
});

// ── Offer engine ─────────────────────────────────────────

test("buildPredictedOffers: deterministic, no randomness", () => {
  const t = 1_800_000_000_000;
  assert.deepEqual(buildPredictedOffers(t), buildPredictedOffers(t));
});

test("Half Million National-Day offer matches the approved demo scenario", () => {
  const offers = buildPredictedOffers();
  const hm = Object.values(offers).find((o) => o.merchant === "هاف مليون");
  assert.ok(hm, "offer exists");
  assert.match(hm.id, /^offer_[a-z0-9]+$/); // ASCII id — transport/RTDB safe
  assert.equal(hm.probability, 78); // 3 consecutive years
  assert.equal(hm.windowDays, 3);
  assert.equal(hm.potentialSaving, 15);
  assert.ok(hm.occasion.includes("اليوم الوطني"));
  assert.ok(hm.source.includes("MOCK"));
});

test("decideOffer: wait → waiting; double-decide rejected", () => {
  const offers = initialOffersState();
  const id = Object.keys(offers.predicted).find((k) => offers.predicted[k].merchant === "هاف مليون");
  const { offers: next } = decideOffer(offers, { offerId: id, decision: "wait" });
  assert.equal(next.predicted[id].status, "waiting");
  assert.equal(decideOffer(next, { offerId: id, decision: "wait" }).error, "already_decided");
  assert.equal(decideOffer(offers, { offerId: "nope", decision: "wait" }).error, "unknown_offer");
  assert.equal(decideOffer(offers, { offerId: id, decision: "maybe" }).error, "invalid_decision");
});

test("settleOffer: idempotent, no Akthr in outcome", () => {
  let offers = initialOffersState();
  const id = Object.keys(offers.predicted).find((k) => offers.predicted[k].merchant === "هاف مليون");
  assert.equal(settleOffer(offers, { offerId: id }).error, "not_waiting"); // must decide first
  offers = decideOffer(offers, { offerId: id, decision: "wait" }).offers;
  const settled = settleOffer(offers, { offerId: id });
  assert.equal(settled.offers.predicted[id].status, "settled");
  assert.equal(settled.outcome.saving, 15);
  assert.equal(settled.outcome.nxpReward, 10);
  assert.equal(settled.outcome.akthrReward, undefined); // settlement never touches Akthr
  // Second settle on the already-settled state → rejected, nothing duplicated.
  assert.equal(settleOffer(settled.offers, { offerId: id }).error, "not_waiting");
});

// ── Parent reward validation ─────────────────────────────

test("validateParentReward: happy path builds deterministic id", () => {
  const family = initialFamilyState();
  const input = { senderId: "ahmed", recipientId: "rashid", rewardType: "akthr", amount: 25, message: "تستاهل يا بطل" };
  const { reward } = validateParentReward(family, input);
  assert.equal(reward.senderId, "ahmed");
  assert.equal(reward.recipientId, "rashid");
  assert.equal(reward.amount, 25);
  assert.equal(reward.id, rewardId(input)); // same event → same id → idempotent
  assert.equal(rewardId(input), rewardId({ ...input })); // stable
});

test("validateParentReward: explicit eventId wins as idempotency key", () => {
  const family = initialFamilyState();
  const input = {
    eventId: "reward_demo_001",
    senderId: "ahmed", recipientId: "rashid", rewardType: "akthr", amount: 25,
    message: "تستاهل يا بطل، استمريت داخل ميزانيتك 7 أيام.",
  };
  const { reward } = validateParentReward(family, input);
  assert.equal(reward.id, "reward_demo_001");
  // Unsafe RTDB path chars sanitized.
  const { reward: r2 } = validateParentReward(family, { ...input, eventId: "a.b#c$d[e]f/g" });
  assert.equal(r2.id, "a_b_c_d_e_f_g");
});

test("validateParentReward: error paths", () => {
  const family = initialFamilyState();
  const base = { rewardType: "akthr", amount: 25, message: "x" };
  assert.equal(validateParentReward(family, { ...base, senderId: "ahmed", recipientId: "ghost" }).error, "unknown_recipient");
  assert.equal(validateParentReward(family, { ...base, senderId: "ghost", recipientId: "rashid" }).error, "unknown_sender");
  assert.equal(validateParentReward(family, { ...base, senderId: "ahmed", recipientId: "ahmed" }).error, "self_reward");
  assert.equal(validateParentReward(family, { ...base, senderId: "rashid", recipientId: "sarah" }).error, "sender_not_parent");
  assert.equal(validateParentReward(family, { ...base, senderId: "ahmed", recipientId: "rashid", rewardType: "cash" }).error, "unsupported_reward_type");
  assert.equal(validateParentReward(family, { ...base, senderId: "ahmed", recipientId: "rashid", amount: -1 }).error, "invalid_amount");
});

// ── Loyalty / pet ────────────────────────────────────────

test("initialLoyaltyState: Akthr only — NXP lives in game.coins", () => {
  const loyalty = initialLoyaltyState();
  assert.equal(loyalty.akthrPoints, 120);
  assert.equal(loyalty.nxp, undefined); // never stored — no dual source of truth
});

test("initialState: mascot named صقر (Pixel Falcon identity)", () => {
  assert.equal(initialState().user.petName, "صقر");
});

test("applyCheer: heals within bounds, mood follows health", () => {
  const state = { ...initialState() };
  state.pet = { ...state.pet, health: 97 };
  const next = applyCheer(state, { healthDelta: 6, event: "family_goal" });
  assert.equal(next.pet.health, 100); // clamped
  assert.equal(next.pet.mood, "happy");
  assert.equal(next._aiContext.event, "family_goal");
});
