// petEngine.js — THE MATH. Pure functions, zero I/O.
// Each event takes the current state and returns the full next state, so routes
// just persist the result in a single Firebase write.
//
// Relative-effort principle: heal amounts scale by the % of the user's PERSONAL
// goal, not absolute SAR — a student and an executive get comparable payoff.

import { initialBudgetFields, trackPurchase } from "./budgetEngine.js";

// ── Tunable constants ────────────────────────────────────
const SAVE_RATE = 0.2; // portion of a salary deposit auto-routed to Instant Savings
const HEAL_K = 2; // scaling factor for goal-relative healing
const HEAL_MIN = 5;
const HEAL_MAX = 25;
const PURCHASE_IN_BUDGET_PENALTY = -3;
// Over-budget penalty scales with HOW FAR over budget this purchase pushes
// you (same relative-effort principle as healing) instead of a flat hit —
// barely crossing the line stings a little, blowing it out stings a lot.
const OVER_BUDGET_PENALTY_K = 0.5;
const OVER_BUDGET_PENALTY_MIN = 10;
const OVER_BUDGET_PENALTY_MAX = 35;

// ── Helpers ──────────────────────────────────────────────
export const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

// Any event that pulls money OUT of balance (purchase, emergency, instant
// save) must check this first — real accounts don't go negative.
export function hasSufficientFunds(state, amount) {
  return amount <= state.user.balance;
}

export function moodFromHealth(health) {
  if (health >= 80) return "happy";
  if (health >= 50) return "neutral";
  if (health >= 20) return "sad";
  return "sick";
}

// The pristine starting state — used by reset and seed.
export function initialState() {
  return {
    user: {
      name: "راشد",
      petName: "صقر",
      petType: "falcon",
      goalAmount: 5000,
      savedAmount: 1200,
      balance: 8000,
      monthlyBudget: 3000,
      spentThisMonth: 1400,
      // Savings-plan + category-budget + auto-rollover fields.
      ...initialBudgetFields(),
    },
    pet: {
      health: 100,
      mood: "happy",
      animationState: "idle",
      message: "أنا بخير وسعيد بوجودك!",
      updatedAt: Date.now(),
    },
    emergencyShield: { usesRemaining: 1 },
    // Demo-tuned: streak 6 (one day from the 7-milestone), 24% of goal (one
    // save from evolution), 60 coins (one milestone from the shemagh), and a
    // live coffee challenge — the 3-minute script hits every payoff.
    game: {
      day: 7,
      streak: { current: 6, best: 6, freezesLeft: 1, status: "alive" },
      coins: 60,
      stage: 0,
      today: { spent: 0, saved: 0, overBudget: false, coffees: 0 },
      achievements: { first_save: { unlockedAt: Date.now() - 5 * 86400000 } },
      activeChallenge: {
        id: "less_coffee",
        title: "قهوة أقل هذا الأسبوع",
        desc: "حافظ على ٣ زيارات مقهى أو أقل",
        limit: 3,
        used: 1,
        reward: 50,
        status: "active",
      },
      inventory: {},
      equipped: null,
      lastCelebration: { type: "none", id: "none", at: 0 },
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
  return mood === "happy" ? "happy" : mood === "sick" ? "sick" : mood === "sad" ? "sad" : "idle";
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
  const healthDelta = clamp(
    Math.round((savedPortion / user.goalAmount) * 100 * HEAL_K),
    HEAL_MIN,
    HEAL_MAX
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
  const healthDelta = clamp(
    Math.round((amount / user.goalAmount) * 100 * HEAL_K),
    HEAL_MIN,
    HEAL_MAX
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

// Purchase → within budget = minor dip; over budget = pet gets sick.
export function applyPurchase(state, { amount, category = "general", label = "عملية شراء" }) {
  const spentThisMonth = state.user.spentThisMonth + amount;
  const overBudget = spentThisMonth > state.user.monthlyBudget;
  // Fold into the matching category's current-period spend so the unspent
  // remainder can roll into savings at the next settlement (time-advance).
  const budgetPeriod = trackPurchase(state.user, category, amount);
  const user = {
    ...state.user,
    balance: state.user.balance - amount,
    spentThisMonth,
    budgetPeriod,
  };
  let healthDelta = PURCHASE_IN_BUDGET_PENALTY;
  if (overBudget) {
    const overagePct = ((spentThisMonth - state.user.monthlyBudget) / state.user.monthlyBudget) * 100;
    healthDelta = -clamp(
      Math.round(overagePct * OVER_BUDGET_PENALTY_K),
      OVER_BUDGET_PENALTY_MIN,
      OVER_BUDGET_PENALTY_MAX
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

// Emergency withdrawal → the Shield protects the pet: no health penalty if a use remains.
export function applyEmergency(state, { amount, label = "سحب طارئ" }) {
  const shielded = state.emergencyShield.usesRemaining > 0;

  if (!shielded) {
    return applyPurchase(state, { amount, category: "emergency", label });
  }

  const user = { ...state.user, balance: state.user.balance - amount };
  const emergencyShield = { usesRemaining: state.emergencyShield.usesRemaining - 1 };
  const pet = withHealth(state.pet, 0, { animationState: "idle" });
  return {
    ...state,
    user,
    pet,
    emergencyShield,
    meta: { lastEvent: "emergency" },
    _aiContext: { category: "emergency", event: "emergency", amount, label },
  };
}
