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
import { healthStateOf } from "../../shared/rafiqIdentity.js";

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
