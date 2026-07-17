// Regression suite for the Rafiqi identity + fairness rules. Pure engine
// functions, zero I/O — runs with `npm test` (Node's built-in runner).
import { test } from "node:test";
import assert from "node:assert/strict";

import {
  initialState,
  applyInstantSave,
  applyPurchase,
  moodFromHealth,
} from "../src/logic/petEngine.js";
import {
  applyGameEffects,
  setIncomeProfile,
  INCOME_PROFILES,
} from "../src/logic/gameEngine.js";
import { healthStateOf, selectVoiceKey, fallbackLine, VOICE } from "../../shared/rafiqIdentity.js";

// Mirror simulate.js's withGame() wiring for a save.
function runSave(state, amount) {
  const next = applyInstantSave(state, amount);
  const c = next._aiContext;
  return applyGameEffects(next, { event: c.event, amount: c.amount });
}

// ── Priority 3a: persona / pet decoupling ────────────────────────────────
test("switching income persona changes ONLY name/income/balance", () => {
  for (const id of Object.keys(INCOME_PROFILES)) {
    const before = initialState();
    const after = setIncomeProfile(before, id);

    // Everything pet-related — including what drives the visual expression —
    // must be byte-identical.
    assert.deepEqual(after.pet, before.pet, `${id}: pet slice changed`);
    assert.deepEqual(after.game, before.game, `${id}: game slice changed`);
    assert.deepEqual(after.emergencyShield, before.emergencyShield, `${id}: shield changed`);
    assert.deepEqual(after.family_goal, before.family_goal, `${id}: family goal changed`);

    // Visual expression is derived purely from pet.health/mood/animationState.
    assert.equal(moodFromHealth(after.pet.health), moodFromHealth(before.pet.health), `${id}: visual state changed`);
    assert.equal(after.pet.animationState, before.pet.animationState, `${id}: animationState changed`);

    // Goal progress (savedAmount / goalAmount) must not move.
    assert.equal(after.user.savedAmount, before.user.savedAmount, `${id}: savedAmount changed`);
    assert.equal(after.user.goalAmount, before.user.goalAmount, `${id}: goalAmount changed`);
    assert.equal(after.user.allTimeHighBalance, before.user.allTimeHighBalance, `${id}: ATH changed`);

    // Only these three may change.
    assert.equal(after.user.name, INCOME_PROFILES[id].name);
    assert.equal(after.user.income, INCOME_PROFILES[id].income);
    assert.equal(after.user.balance, INCOME_PROFILES[id].balance);
  }
});

test("persona switch mid-session leaves an in-progress pet untouched", () => {
  // Drive the pet somewhere non-pristine first (health hit + a save).
  let s = initialState();
  s = applyPurchase(s, { amount: 5000, category: "shopping" }); // over budget → health drops
  s = runSave(s, 500); // some NXP + ATH move
  const before = structuredClone(s);

  const after = setIncomeProfile(s, "executive");
  assert.deepEqual(after.pet, before.pet);
  assert.deepEqual(after.game, before.game);
  assert.equal(after.user.savedAmount, before.user.savedAmount);
  assert.equal(after.user.allTimeHighBalance, before.user.allTimeHighBalance);
});

// ── Priority 0: anti-farming high-water mark ─────────────────────────────
test("redepositing already-counted savings earns 0 NXP", () => {
  const s0 = initialState();
  const base = s0.game.nxp_balance;

  const afterFirst = runSave(s0, 400); // new ground → earns
  assert.ok(afterFirst.game.nxp_balance > base, "first deposit should earn");
  assert.equal(afterFirst.user.allTimeHighBalance, 1600);

  // Simulate a withdrawal (savedAmount back down, ATH stays).
  const withdrawn = { ...afterFirst, user: { ...afterFirst.user, savedAmount: 1200 } };
  const afterRedeposit = runSave(withdrawn, 400);
  assert.equal(afterRedeposit.game.nxp_balance, afterFirst.game.nxp_balance, "redeposit must earn 0");
  assert.equal(afterRedeposit.game.lastSaveReward.nxp, 0);
  assert.equal(afterRedeposit.user.allTimeHighBalance, 1600, "ATH unchanged on redeposit");

  // Beyond the high-water mark earns again.
  const afterBeyond = runSave(afterRedeposit, 100);
  assert.ok(afterBeyond.game.nxp_balance > afterFirst.game.nxp_balance, "beyond ATH earns again");
  assert.equal(afterBeyond.user.allTimeHighBalance, 1700);
});

// ── Priority 1a: exactly 5 health-state bands ────────────────────────────
test("healthStateOf maps the 5 bands at their boundaries", () => {
  const cases = [
    [100, "radiant"], [90, "radiant"], [89, "happy"], [70, "happy"],
    [69, "neutral"], [40, "neutral"], [39, "tired"], [15, "tired"],
    [14, "sick"], [0, "sick"],
  ];
  for (const [h, expect] of cases) assert.equal(healthStateOf(h), expect, `health ${h}`);
});

// ── Priority 1b: goal-secured spending shield ────────────────────────────
test("goal-secured pet takes no health loss from over-budget spending", () => {
  const secured = { ...initialState() };
  secured.user = { ...secured.user, savedAmount: 5000, spentThisMonth: 2900 }; // saved >= goal(5000)
  secured.pet = { ...secured.pet, health: 45 };
  const after = applyPurchase(secured, { amount: 3000, category: "shopping" });
  assert.equal(after.pet.health, 45, "shielded health must not drop");
  assert.ok(after.pet.health >= 40, "must stay >= Neutral");
});

test("not-secured pet still loses health on over-budget spending", () => {
  const open = { ...initialState() };
  open.user = { ...open.user, spentThisMonth: 2900 }; // saved 1200 < goal
  open.pet = { ...open.pet, health: 45 };
  const after = applyPurchase(open, { amount: 3000, category: "shopping" });
  assert.ok(after.pet.health < 45, "unshielded health must drop");
  assert.ok(after.pet.health < 40, "should fall below Neutral");
});

// ── In-budget purchases never cost health (even before the goal is secured) ──
test("not-secured pet takes NO health loss from in-budget purchases", () => {
  let s = { ...initialState() };
  s.user = { ...s.user, savedAmount: 1200, spentThisMonth: 0, monthlyBudget: 3000 }; // 1200 < goal(5000)
  s.pet = { ...s.pet, health: 70 };

  // Several in-budget purchases in a row — total stays under the 3000 budget.
  for (const amount of [50, 100, 200, 300]) {
    s = applyPurchase(s, { amount, category: "coffee" });
    assert.equal(s.pet.health, 70, `in-budget purchase of ${amount} must not move health`);
    assert.equal(s._aiContext.overBudget, false);
    assert.equal(s._aiContext.healthDelta, 0);
  }
  assert.equal(s.user.spentThisMonth, 650); // budget accounting still runs

  // The moment the SAME pet crosses the budget, the penalty still bites.
  const over = applyPurchase(s, { amount: 3000, category: "shopping" });
  assert.ok(over.pet.health < 70, "over-budget must still drop health");
  assert.equal(over._aiContext.overBudget, true);
});

// ── Percentage-based penalty/heal redesign ───────────────────────────────
// Both formulas are now clamp(fraction * K, MIN, MAX), fraction = overage as
// a % of monthlyBudget (penalty) or save amount as a % of goalAmount (heal).

test("purchase penalty scales with overPercentage of monthlyBudget, not a flat number", () => {
  const base = { ...initialState() };
  base.user = { ...base.user, spentThisMonth: base.user.monthlyBudget }; // exactly at budget

  // 20% over budget (600 of a 3000 budget) -> clamp(round(0.2*40), 5, 25) = 8.
  const twentyOver = applyPurchase(base, { amount: 600, category: "shopping" });
  assert.equal(twentyOver._aiContext.healthDelta, -8);

  // Barely over budget -> floors at PURCHASE_PENALTY_MIN (5), never less.
  const barelyOver = applyPurchase(base, { amount: 10, category: "coffee" });
  assert.equal(barelyOver._aiContext.healthDelta, -5);

  // Massive overage caps at PURCHASE_PENALTY_MAX (25) — a single purchase can
  // never zero out health from a healthy starting point.
  const massiveOver = applyPurchase(base, { amount: 100000, category: "shopping" });
  assert.equal(massiveOver._aiContext.healthDelta, -25);
});

test("save heal scales with percentOfGoal, not a flat number", () => {
  const s = initialState(); // goalAmount 5000

  // 20% of goal (1000 SAR) -> clamp(round(0.2*60), 8, 30) = 12.
  const twentyPct = applyInstantSave(s, 1000);
  assert.equal(twentyPct._aiContext.healthDelta, 12);

  // A tiny save floors at SAVE_HEAL_MIN (8), never less.
  const tinySave = applyInstantSave(s, 10);
  assert.equal(tinySave._aiContext.healthDelta, 8);

  // A huge save (more than the whole goal) caps at SAVE_HEAL_MAX (30).
  const hugeSave = applyInstantSave(s, 5000);
  assert.equal(hugeSave._aiContext.healthDelta, 30);
});

test("calibration: saving X% of the goal always heals more than overspending by the same X%", () => {
  const s = initialState(); // goalAmount 5000, monthlyBudget 3000
  const atBudget = { ...s, user: { ...s.user, spentThisMonth: s.user.monthlyBudget } };

  for (const pct of [0.02, 0.05, 0.2, 0.5, 1, 2]) {
    const penalty = Math.abs(
      applyPurchase(atBudget, { amount: pct * s.user.monthlyBudget, category: "shopping" })._aiContext.healthDelta
    );
    const heal = applyInstantSave(s, pct * s.user.goalAmount)._aiContext.healthDelta;
    assert.ok(heal > penalty, `at ${pct * 100}%: heal(${heal}) must exceed penalty(${penalty})`);
  }
});

// ── Sah Sukuk milestone nudge (crosses 1,000 SAR upward, fires once) ────
test("sukuk milestone: fires once on crossing 1,000 SAR, never re-fires", () => {
  let s = initialState();
  s.user = { ...s.user, savedAmount: 400, allTimeHighBalance: 400 };

  // Below the line — no nudge yet.
  s = runSave(s, 300); // 400 -> 700
  assert.equal(s.user.savedAmount, 700);
  assert.equal(s.user.sukukNudgeShown, false);
  assert.equal(s._aiContext.sukukMilestone, undefined);

  // This save crosses 1,000 — nudge fires exactly once.
  s = runSave(s, 400); // 700 -> 1100
  assert.equal(s.user.savedAmount, 1100);
  assert.equal(s.user.sukukNudgeShown, true);
  assert.equal(s._aiContext.sukukMilestone, true);
  assert.equal(selectVoiceKey(s._aiContext), "sukuk_milestone");

  // Further saves above the line never re-fire the nudge.
  s = runSave(s, 500); // 1100 -> 1600
  assert.equal(s.user.sukukNudgeShown, true);
  assert.equal(s._aiContext.sukukMilestone, undefined);
});

test("sukuk milestone: offline fallback line matches the voice bank entry", () => {
  const line = fallbackLine({ sukukMilestone: true });
  assert.ok(VOICE.sukuk_milestone.lines.includes(line));
});

// ── Demo seed: over-budget reachable in <= 2 purchase actions from reset ──
test("fresh Panic Reset: one coffee stays calmly in-budget, a second one tips over", () => {
  let s = initialState();
  assert.equal(s.user.monthlyBudget, 3000);
  assert.equal(s.user.spentThisMonth, 2910); // 90 SAR of headroom

  s = applyPurchase(s, { amount: 50, category: "coffee", label: "قهوة" });
  assert.equal(s.user.spentThisMonth, 2960);
  assert.equal(s._aiContext.overBudget, false);
  assert.equal(s._aiContext.healthDelta, 0);
  assert.equal(s.pet.health, 100);

  s = applyPurchase(s, { amount: 50, category: "coffee", label: "قهوة" });
  assert.equal(s.user.spentThisMonth, 3010);
  assert.equal(s._aiContext.overBudget, true);
  assert.equal(s._aiContext.healthDelta, -5);
  assert.equal(s.pet.health, 95);
});
