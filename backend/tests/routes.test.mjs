// Route-level tests against a RUNNING backend + Firebase emulator.
// Run: npm run test:routes   (requires: emulator on :9000, backend on :3000)
// Covers the P0 scenario end-to-end plus atomicity/idempotency guarantees.
import { test, before } from "node:test";
import assert from "node:assert/strict";

const B = process.env.API_BASE || "http://localhost:3000";

async function api(method, path, body, recipientId) {
  const res = await fetch(`${B}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(recipientId ? { "X-Namo-Demo-User": recipientId } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  return { status: res.status, data: await res.json() };
}
const get = (p) => api("GET", p);
const post = (p, b) => api("POST", p, b);
const getFor = (p, recipientId) => api("GET", p, undefined, recipientId);
const postFor = (p, b, recipientId) => api("POST", p, b, recipientId);

before(async () => {
  try {
    const { data } = await get("/health");
    assert.equal(data.ok, true);
  } catch {
    throw new Error(`Backend not reachable at ${B} — start emulator + backend first.`);
  }
});

test("P0 scenario: reset → plan → predict → wait → settle → reward", async () => {
  // 1. Reset — deterministic initial state.
  assert.equal((await post("/api/reset")).data.ok, true);
  let fam = (await get("/api/family/state")).data;
  assert.equal(fam.family.savedAmount, 3600);
  assert.equal(fam.loyalty.nxp, 60);
  assert.equal(fam.loyalty.akthrPoints, 120);

  // 2. Existing Home setup flow — apply savings plan, companion, and goal.
  const suggested = (await post("/api/plan/suggest", { monthlyIncome: 8000 })).data.plan;
  await post("/api/plan/apply", {
    monthlyIncome: 8000,
    budgets: suggested.budgets,
    monthlyTarget: suggested.monthlyTarget,
    goalAmount: 19200,
  });
  await post("/api/user/profile", { petName: "صقر", petType: "falcon", goalAmount: 19200 });
  let appState = (await get("/api/state")).data;
  assert.equal(appState.user.savingsAccountOpened, true);
  assert.equal(appState.user.petType, "falcon");
  assert.equal(appState.user.goalAmount, 19200);

  // 3. Family plan — approved allocations emerge from the capacity engine.
  const plan = (await post("/api/contribution-plan/generate")).data.contributionPlan;
  assert.equal(plan.monthlyRequired, 1200);
  assert.equal(plan.allocations.ahmed.amount, 700);
  assert.equal(plan.allocations.sarah.amount, 400);
  assert.equal(plan.allocations.rashid.amount, 100);

  // 4. Operator status is read-only, then fresh customer analysis materializes offers.
  const engineStatus = (await get("/api/ml/status?userId=rashid")).data;
  assert.ok(["online", "fallback"].includes(engineStatus.state));
  assert.ok(["ml-service", "deterministic-fallback"].includes(engineStatus.source));
  if (engineStatus.state === "online") {
    assert.equal(engineStatus.models.offer.name, "CatBoostClassifier");
    assert.equal(engineStatus.models.purchase.name, "HistGradientBoostingClassifier");
  } else {
    assert.equal(typeof engineStatus.fallbackReason, "string");
  }

  // Fresh analysis — Node delegates to ML or its labeled deterministic fallback.
  const analysis = (await get("/api/ml/recommendations?userId=rashid")).data;
  assert.ok(["ml-service", "deterministic-fallback"].includes(analysis.source));
  const predicted = (await get("/api/offers/predicted")).data.predicted;
  const hm = Object.values(predicted).find((o) => o.merchant === "هاف مليون");
  assert.ok(hm.probability >= 70);
  assert.equal(hm.windowDays, 3);
  assert.equal(hm.potentialSaving, 15);

  // 5. Wait — decision only, balances untouched.
  const decided = (await post("/api/offers/decide", { offerId: hm.id, decision: "wait" })).data;
  assert.equal(decided.offer.status, "waiting");
  fam = (await get("/api/family/state")).data;
  assert.equal(fam.family.savedAmount, 3600); // unchanged
  assert.equal(fam.loyalty.nxp, 60);

  // 6. Settle — family +15, NXP +10, Akthr UNTOUCHED.
  const settled = (await post("/api/offers/settle", { offerId: hm.id, memberId: "rashid" })).data;
  assert.equal(settled.family.savedAmount, 3615);
  assert.equal(settled.family.members.rashid.contributed, 315);
  assert.equal(settled.game.nxp_balance, 70); // canonical NXP field (was `coins`)
  assert.equal(settled.loyalty.nxp, 70);
  fam = (await get("/api/family/state")).data;
  assert.equal(fam.loyalty.akthrPoints, 120); // settlement never touches Akthr

  // Idempotency: second settle → 400, nothing duplicated.
  const again = await post("/api/offers/settle", { offerId: hm.id });
  assert.equal(again.status, 400);
  assert.equal(again.data.error, "not_waiting");
  fam = (await get("/api/family/state")).data;
  assert.equal(fam.family.savedAmount, 3615);
  assert.equal(fam.loyalty.nxp, 70);
  let rashidNotifications = (await getFor("/api/user/notifications", "rashid")).data.notifications;
  const settlementNotifications = rashidNotifications.filter((item) => item.type === "offer_settlement");
  assert.equal(settlementNotifications.length, 1);
  assert.equal(settlementNotifications[0].recipientId, "rashid");
  assert.equal(settlementNotifications[0].savingAmountSar, 15);

  // 7. Parent reward — Ahmed → Rashid, Akthr 120 → 145.
  const rewardBody = {
    eventId: "reward_demo_001",
    senderId: "ahmed",
    recipientId: "rashid",
    rewardType: "akthr",
    amount: 25,
    message: "تستاهل يا بطل، استمريت داخل ميزانيتك 7 أيام.",
  };
  const rewarded = (await post("/api/family/reward", rewardBody)).data;
  assert.equal(rewarded.ok, true);
  assert.equal(rewarded.loyalty.akthrPoints, 145);
  assert.equal(rewarded.reward.senderId, "ahmed");
  assert.equal(rewarded.reward.recipientId, "rashid");

  // Notification written to the canonical path (read straight from the
  // emulator's REST surface — no extra backend route needed).
  const EMU = process.env.FIREBASE_DATABASE_EMULATOR_HOST || "127.0.0.1:9000";
  const notif = await (await fetch(`http://${EMU}/notifications/rashid/parentReward.json?ns=amad-demo-default-rtdb`)).json();
  assert.ok(notif, "notification exists at /notifications/rashid/parentReward");
  assert.equal(notif.from, "ahmed");
  assert.equal(notif.akthrPoints, 25);

  // Idempotency: identical reward event → 409, no double credit.
  const dup = await post("/api/family/reward", rewardBody);
  assert.equal(dup.status, 409);
  assert.equal(dup.data.error, "duplicate_reward");
  fam = (await get("/api/family/state")).data;
  assert.equal(fam.loyalty.akthrPoints, 145); // unchanged
  rashidNotifications = (await getFor("/api/user/notifications", "rashid")).data.notifications;
  assert.equal(rashidNotifications.filter((item) => item.type === "parent_reward").length, 1);

  // Reward error paths.
  assert.equal((await post("/api/family/reward", { ...rewardBody, recipientId: "ghost" })).data.error, "unknown_recipient");
  assert.equal((await post("/api/family/reward", { ...rewardBody, recipientId: "ahmed" })).data.error, "self_reward");
  assert.equal((await post("/api/family/reward", { ...rewardBody, senderId: "rashid", recipientId: "sarah" })).data.error, "sender_not_parent");
  assert.equal((await post("/api/family/reward", { ...rewardBody, eventId: "reward_demo_002", amount: -5 })).data.error, "invalid_amount");
});

test("reset restores the exact deterministic initial state", async () => {
  const reset = (await post("/api/reset")).data;
  const fam = (await get("/api/family/state")).data;
  assert.equal(fam.family.savedAmount, 3600);
  assert.equal(fam.family.goalAmount, 12000);
  assert.equal(fam.family.members.rashid.contributed, 300);
  assert.equal(fam.family.members.rashid.name, "راشد");
  // Exactly this fictional family — no stale/duplicate member ids survive reset.
  assert.deepEqual(Object.keys(fam.family.members).sort(), ["ahmed", "rashid", "sarah"]);
  assert.equal(fam.loyalty.nxp, 60);
  assert.equal(fam.loyalty.akthrPoints, 120);
  assert.equal(fam.contributionPlan, null);
  const predicted = (await get("/api/offers/predicted")).data.predicted;
  assert.deepEqual(predicted, {});
  // Mascot name restored to صقر (Pixel Falcon identity).
  const state = (await get("/api/state")).data;
  assert.equal(state.user.petName, "صقر");
  assert.equal(state.user.savingsAccountOpened, false);
  assert.equal(state.user.savingsPlan ?? null, null);
  assert.equal(state.user.balance, 8000);
  assert.equal(state.user.savedAmount, 1200);
  assert.equal(state.pet.health, 100);
  assert.equal(state.game.nxp_balance, 60);
  assert.equal(state.game.streak.current, 6);
  assert.deepEqual(state.game.inventory || {}, {});
  assert.equal(state.game.equipped ?? null, null);
  assert.equal(state.emergencyShield.usesRemaining, 1);
  assert.equal(reset.transactions, null);
  assert.deepEqual(reset.offers.predicted, {});
  assert.deepEqual(reset.offers.decisions, {});
  assert.equal(reset.notifications, null);
});

test("notifications are recipient-aware and mark-all is isolated", async () => {
  await post("/api/reset");
  assert.deepEqual((await getFor("/api/user/notifications", "rashid")).data.notifications, []);
  assert.equal((await postFor("/api/user/mark-all-notifications-read", null, "rashid")).data.marked, 0);

  await postFor("/api/user/notifications", { title: "لراشد", body: "خاص", type: "general" }, "rashid");
  await postFor("/api/user/notifications", { title: "لأحمد", body: "خاص", type: "general" }, "ahmed");
  assert.equal((await getFor("/api/user/notifications", "rashid")).data.notifications.length, 1);
  assert.equal((await getFor("/api/user/notifications", "ahmed")).data.notifications.length, 1);

  await postFor("/api/user/mark-all-notifications-read", null, "rashid");
  assert.equal((await getFor("/api/user/notifications", "rashid")).data.notifications[0].read, true);
  assert.equal((await getFor("/api/user/notifications", "ahmed")).data.notifications[0].read, false);
  assert.equal((await getFor("/api/user/notifications", "ghost")).status, 400);

  const reset = (await post("/api/reset")).data;
  assert.equal(reset.userNotifications, null);
  assert.deepEqual((await getFor("/api/user/notifications", "rashid")).data.notifications, []);
});

test("reset and rerun produces the identical canonical recommendation", async () => {
  const setup = async () => {
    const plan = (await post("/api/plan/suggest", { monthlyIncome: 8000 })).data.plan;
    await post("/api/plan/apply", { monthlyIncome: 8000, budgets: plan.budgets, monthlyTarget: plan.monthlyTarget, goalAmount: 19200 });
    await post("/api/user/profile", { petName: "صقر", petType: "falcon", goalAmount: 19200 });
  };
  const normalize = (result) => result.recommendations.map(({ offerId, merchantId, merchantNameAr, offerProbability, purchaseProbability, personalizedScore, windowDays, estimatedSavingSar, occasion, action, explanation }) => ({
    offerId, merchantId, merchantNameAr, offerProbability, purchaseProbability, personalizedScore, windowDays, estimatedSavingSar, occasion, action, explanation,
  }));

  await post("/api/reset");
  await setup();
  const first = (await get("/api/ml/recommendations?userId=rashid")).data;
  const half = first.recommendations.find((item) => item.merchantNameAr === "هاف مليون");
  await post("/api/offers/decide", { offerId: half.offerId, decision: "wait" });
  await post("/api/offers/settle", { offerId: half.offerId, memberId: "rashid" });

  await post("/api/reset");
  assert.deepEqual((await get("/api/offers/predicted")).data.predicted, {});
  await setup();
  const second = (await get("/api/ml/recommendations?userId=rashid")).data;

  assert.equal(second.source, first.source);
  assert.deepEqual(normalize(second), normalize(first));
  assert.equal(second.recommendations[0].merchantNameAr, "هاف مليون");
});
