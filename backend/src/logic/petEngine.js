// petEngine.js — THE MATH. Pure functions, zero I/O.
// Each event takes the current state and returns the full next state, so routes
// just persist the result in a single Firebase write.
//
// Relative-effort principle: heal amounts scale by the % of the user's PERSONAL
// goal, not absolute SAR — a student and an executive get comparable payoff.

import { initialBudgetFields, trackPurchase } from "./budgetEngine.js";
import { healthStateOf } from "../../../shared/rafiqIdentity.js";

// ── Tunable constants ────────────────────────────────────
const SAVE_RATE = 0.2; // portion of a salary deposit auto-routed to Instant Savings
// Seed monthly income (SAR) — NXP save rewards scale relative to this, and
// gameEngine falls back to it when a pre-income DB state has no user.income.
export const DEFAULT_INCOME = 8000;
// Seed savings (SAR) — one constant feeds both savedAmount and its NXP
// high-water mark so they can never disagree at seed time.
const SEED_SAVED_AMOUNT = 1200;
// Save-heal scales with the FRACTION OF THE GOAL this save represents
// (savedAmount and salary auto-saves both feed the same goal), same shape as
// gameEngine's SAVE_NXP_K pattern. Calibrated against PURCHASE_PENALTY_* below
// so that saving X% of the goal always heals more than overspending by the
// same X% hurts (see backend/tests/rafiq.test.mjs calibration test).
const SAVE_HEAL_K = 60;
const SAVE_HEAL_MIN = 8;
const SAVE_HEAL_MAX = 30;
// Savings withdrawals move money back to the spending account. Their health
// impact scales against the personal goal, but stays gentler than the reward
// for building the same amount of savings: with the default 4000 goal,
// 100 SAR = -1 health, 500 SAR = -6, 1000 SAR = -13, capped at -25.
const WITHDRAWAL_PENALTY_K = 50;
const WITHDRAWAL_PENALTY_MIN = 1;
const WITHDRAWAL_PENALTY_MAX = 25;
// In-budget purchases cost NO health: spending inside your own budget is not a
// failure, so Rafiq never punishes it. Health only ever falls from genuine
// over-budget spending (the scaled penalty below).
// Over-budget penalty scales with HOW FAR over budget this purchase pushes
// you, as a FRACTION OF THE MONTHLY BUDGET (same relative-effort principle as
// healing) instead of a flat hit — barely crossing the line stings a little,
// blowing it out stings a lot. K/MIN/MAX deliberately sit below SAVE_HEAL_*'s
// at every matching percentage so spending never out-hurts saving's payoff.
const PURCHASE_PENALTY_K = 40;
const PURCHASE_PENALTY_MIN = 5;
const PURCHASE_PENALTY_MAX = 25;

// ── Helpers ──────────────────────────────────────────────
export const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

// Any event that pulls money OUT of the available account (purchase, instant
// save) must check this first — real accounts don't go negative.
export function hasSufficientFunds(state, amount) {
  return amount <= state.user.balance;
}

export function hasSufficientSavings(state, amount) {
  return amount <= state.user.savedAmount;
}

// The 5-state bands live in shared/rafiqIdentity.js — one source for the
// backend math, the fallback voice, and the frontend visual treatment.
export function moodFromHealth(health) {
  return healthStateOf(health);
}

// The pristine starting state — used by reset and seed.
export function initialState() {
  const petHealth = 100;
  return {
    user: {
      name: "راشد",
      petName: "صقر",
      petType: "falcon",
      income: DEFAULT_INCOME, // SAR/month — swapped live via the Cheat Controller's income profiles
      goalAmount: 4000,
      savedAmount: SEED_SAVED_AMOUNT,
      // NXP high-water mark of savedAmount (anti-farming): deposits earn NXP
      // only on the part that pushes savings past this; withdrawals never
      // lower it. Persona-independent — all personas share the savings pool.
      allTimeHighBalance: SEED_SAVED_AMOUNT,
      balance: 8000,
      monthlyBudget: 3000,
      // Demo-tuned: 90 SAR of headroom left. One 50 SAR coffee stays calmly
      // in-budget (40 left over); a second one tips over budget — the
      // over-budget moment is 2 clicks away from a fresh Panic Reset, not 34.
      spentThisMonth: 2910,
      // Savings-plan + category-budget + auto-rollover fields.
      ...initialBudgetFields(),
    },
    pet: {
      health: petHealth,
      mood: moodFromHealth(petHealth), // always band-derived — never hand-set
      animationState: "idle",
      message: "أنا بخير وسعيد بوجودك!",
      updatedAt: Date.now(),
    },
    emergencyShield: { usesRemaining: 1 },
    // Demo-tuned: streak 6 (one day from the 7-milestone), 24% of goal (one
    // save from evolution), 60 NXP (one milestone from the cap), and a
    // live coffee challenge — the 3-minute script hits every payoff.
    game: {
      day: 7,
      streak: { current: 6, best: 6, freezesLeft: 1, status: "alive" },
      nxp_balance: 60, // canonical NXP field (was the legacy `coins`)
      stage: 0,
      today: { spent: 0, saved: 0, overBudget: false, coffees: 0 },
      achievements: { first_save: { unlockedAt: Date.now() - 5 * 86400000 } },
      // Mirrors gameEngine's CHALLENGE_POOL[0] (kept inline — gameEngine
      // imports from this file, so importing back would be circular), with a
      // demo-tuned used=1 so the progress bar is already alive on stage.
      activeChallenge: {
        id: "less_coffee",
        title: "قهوة أقل هذا الأسبوع",
        desc: "حافظ على 3 زيارات مقهى أو أقل",
        limit: 3,
        used: 1,
        reward: 50,
        icon: "☕",
        status: "active",
      },
      inventory: {},
      equipped: null,
      lastCelebration: { type: "none", id: "none", at: 0 },
      lastSaveReward: { nxp: 0, pctOfIncome: 0, at: 0 },
    },
    meta: { lastEvent: "idle" },
  };
}

// Internal: stamp health/mood/animation onto the pet after a health change.
function withHealth(pet, healthDelta, { animationState } = {}) {
  const health = clamp(Math.round(pet.health + healthDelta), 0, 100);
  const mood = moodFromHealth(health);
  return {
    ...pet,
    health,
    mood,
    animationState: animationState || moodToAnimation(mood),
    updatedAt: Date.now(),
  };
}

function moodToAnimation(mood) {
  // Every state except neutral has its own ambient pose; neutral rests on idle.
  return mood === "neutral" ? "idle" : mood;
}

// ── Events ───────────────────────────────────────────────

// Salary deposit → a slice is auto-saved → pet heals and eats happily.
export function applySalary(state, amount, saveRate = SAVE_RATE) {
  const savedPortion = Math.round(amount * clamp(saveRate, 0, 1));
  const user = {
    ...state.user,
    balance: state.user.balance + amount,
    savedAmount: state.user.savedAmount + savedPortion,
  };
  const percentOfGoal = savedPortion / user.goalAmount;
  const healthDelta = clamp(
    Math.round(percentOfGoal * SAVE_HEAL_K),
    SAVE_HEAL_MIN,
    SAVE_HEAL_MAX
  );
  const pet = withHealth(state.pet, healthDelta, { animationState: "eating" });
  return {
    ...state,
    user,
    pet,
    meta: { lastEvent: "salary" },
    _aiContext: { category: "happy", event: "salary", amount, savedPortion, healthDelta },
  };
}

// Instant Savings → the user manually moves money straight into savings.
export function applyInstantSave(state, amount) {
  const user = {
    ...state.user,
    balance: state.user.balance - amount,
    savedAmount: state.user.savedAmount + amount,
  };
  const percentOfGoal = amount / user.goalAmount;
  const healthDelta = clamp(
    Math.round(percentOfGoal * SAVE_HEAL_K),
    SAVE_HEAL_MIN,
    SAVE_HEAL_MAX
  );
  const pet = withHealth(state.pet, healthDelta, { animationState: "eating" });
  return {
    ...state,
    user,
    pet,
    meta: { lastEvent: "save" },
    _aiContext: { category: "happy", event: "save", amount, healthDelta },
  };
}

// Savings withdrawal → transfer from savings into the available account.
// The high-water mark deliberately does not fall, preventing withdraw/deposit
// loops from farming NXP. A shielded emergency uses the same transfer math
// while suppressing the health impact.
export function applySavingsWithdrawal(
  state,
  { amount, label = "سحب من المدخرات", shielded = false, emergency = false }
) {
  const user = {
    ...state.user,
    savedAmount: state.user.savedAmount - amount,
    balance: state.user.balance + amount,
  };
  const percentOfGoal = state.user.goalAmount > 0 ? amount / state.user.goalAmount : 0;
  const healthDelta = shielded
    ? 0
    : -clamp(
        Math.round(percentOfGoal * WITHDRAWAL_PENALTY_K),
        WITHDRAWAL_PENALTY_MIN,
        WITHDRAWAL_PENALTY_MAX
      );
  const pet = withHealth(state.pet, healthDelta, {
    animationState: shielded ? "idle" : "sad",
  });
  return {
    ...state,
    user,
    pet,
    meta: { lastEvent: emergency ? "emergency" : "withdrawal" },
    _aiContext: {
      category: shielded ? "emergency" : pet.mood,
      event: emergency ? "emergency" : "withdrawal",
      amount,
      label,
      healthDelta,
      shielded,
    },
  };
}

// Purchase → within budget = NO health change; over budget = pet gets sick.
// Goal-secured shield: once savings have met the savings goal, even
// over-budget spending can no longer hurt the pet — health loss is suppressed
// entirely. Budget accounting, streaks and quests still run; only health is
// shielded, and saving can still raise it. Health earned isn't undone by
// spending.
export function applyPurchase(state, { amount, category = "general", label = "عملية شراء" }) {
  const spentThisMonth = state.user.spentThisMonth + amount;
  const overBudget = spentThisMonth > state.user.monthlyBudget;
  // Fold into the matching category's current-period spend so the unspent
  // remainder can roll into savings at the next settlement (time-advance).
  const budgetPeriod = trackPurchase(state.user, category, amount);
  const goalSecured = state.user.savedAmount >= state.user.goalAmount;
  const user = {
    ...state.user,
    balance: state.user.balance - amount,
    spentThisMonth,
    budgetPeriod,
  };
  // Staying inside your budget is never punished.
  let healthDelta = 0;
  if (overBudget && !goalSecured) {
    const overPercentage = (spentThisMonth - state.user.monthlyBudget) / state.user.monthlyBudget;
    healthDelta = -clamp(
      Math.round(overPercentage * PURCHASE_PENALTY_K),
      PURCHASE_PENALTY_MIN,
      PURCHASE_PENALTY_MAX
    );
  }
  const pet = withHealth(state.pet, healthDelta);
  return {
    ...state,
    user,
    pet,
    meta: { lastEvent: "purchase" },
    _aiContext: {
      category: pet.mood,
      event: "purchase",
      amount,
      txnCategory: category,
      label,
      overBudget,
      goalSecured, // voice layer: distinct reassuring tone when the shield ate the hit
      healthDelta,
    },
  };
}

// Small positive nudge from events outside the personal account.
export function applyCheer(state, { healthDelta = 5, event = "cheer", extra = {} } = {}) {
  const pet = withHealth(state.pet, healthDelta, { animationState: "happy" });
  return {
    ...state,
    pet,
    meta: { lastEvent: event },
    _aiContext: { category: "happy", event, ...extra },
  };
}

// Emergency withdrawal transfers savings into the available account. A shield
// protects the pet from the normal savings-withdrawal health penalty.
export function applyEmergency(state, { amount, label = "سحب طارئ" }) {
  const shielded = state.emergencyShield.usesRemaining > 0;
  const transferred = applySavingsWithdrawal(state, {
    amount,
    label,
    shielded,
    emergency: true,
  });
  const emergencyShield = shielded
    ? { usesRemaining: state.emergencyShield.usesRemaining - 1 }
    : state.emergencyShield;
  return {
    ...transferred,
    emergencyShield,
  };
}
