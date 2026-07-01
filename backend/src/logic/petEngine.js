// petEngine.js — THE MATH. Pure functions, zero I/O.
// Each event takes the current state and returns the full next state, so routes
// just persist the result in a single Firebase write.
//
// Relative-effort principle: heal amounts scale by the % of the user's PERSONAL
// goal, not absolute SAR — a student and an executive get comparable payoff.

// ── Tunable constants ────────────────────────────────────
const SAVE_RATE = 0.2; // portion of a salary deposit auto-routed to Instant Savings
const HEAL_K = 2; // scaling factor for goal-relative healing
const HEAL_MIN = 5;
const HEAL_MAX = 25;
const PURCHASE_IN_BUDGET_PENALTY = -3;
const PURCHASE_OVER_BUDGET_PENALTY = -20;

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
      name: "Adam",
      goalAmount: 5000,
      savedAmount: 1200,
      balance: 8000,
      monthlyBudget: 3000,
      spentThisMonth: 1400,
    },
    pet: {
      health: 100,
      mood: "happy",
      animationState: "idle",
      message: "أنا بخير وسعيد بوجودك!",
      updatedAt: Date.now(),
    },
    emergencyShield: { usesRemaining: 1 },
    meta: { lastEvent: "idle" },
  };
}

// Internal: stamp health/mood/animation onto the pet after a health change.
function withHealth(pet, healthDelta, { animationState, forceMood } = {}) {
  const health = clamp(Math.round(pet.health + healthDelta), 0, 100);
  return {
    ...pet,
    health,
    mood: forceMood || moodFromHealth(health),
    animationState: animationState || moodToAnimation(moodFromHealth(health)),
    updatedAt: Date.now(),
  };
}

function moodToAnimation(mood) {
  return mood === "happy" ? "happy" : mood === "sick" ? "sick" : mood === "sad" ? "sad" : "idle";
}

// ── Events ───────────────────────────────────────────────

// Salary deposit → a slice is auto-saved → pet heals and eats happily.
// `saveRate` (0-1) is choosable per deposit — defaults to the standard auto-save rate.
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
  const pet = withHealth(state.pet, healthDelta, {
    animationState: "eating",
    forceMood: "happy",
  });
  return {
    ...state,
    user,
    pet,
    meta: { lastEvent: "salary" },
    _aiContext: { category: "happy", event: "salary", amount, savedPortion, healthDelta },
  };
}

// Instant Savings → the user manually moves money straight into savings.
// Unlike a salary deposit (only a slice is auto-saved), the FULL amount counts
// toward the goal here, so it heals proportionally more per SAR.
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
  const pet = withHealth(state.pet, healthDelta, {
    animationState: "eating",
    forceMood: "happy",
  });
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
  const user = {
    ...state.user,
    balance: state.user.balance - amount,
    spentThisMonth,
  };
  const healthDelta = overBudget ? PURCHASE_OVER_BUDGET_PENALTY : PURCHASE_IN_BUDGET_PENALTY;
  const pet = withHealth(state.pet, healthDelta, {
    animationState: overBudget ? "sick" : undefined,
    forceMood: overBudget ? "sick" : undefined,
  });
  return {
    ...state,
    user,
    pet,
    meta: { lastEvent: "purchase" },
    _aiContext: {
      category: overBudget ? "sick" : pet.mood === "sad" ? "sad" : "neutral",
      event: "purchase",
      amount,
      txnCategory: category,
      label,
      overBudget,
      healthDelta,
    },
  };
}

// Emergency withdrawal → the Shield protects the pet: no health penalty if a use remains.
export function applyEmergency(state, { amount, label = "سحب طارئ" }) {
  const shielded = state.emergencyShield.usesRemaining > 0;

  if (!shielded) {
    // No shield left → behaves like a large (likely over-budget) purchase.
    return applyPurchase(state, { amount, category: "emergency", label });
  }

  const user = { ...state.user, balance: state.user.balance - amount };
  const emergencyShield = { usesRemaining: state.emergencyShield.usesRemaining - 1 };
  const pet = withHealth(state.pet, 0, { animationState: "idle" }); // untouched health, calm animation
  return {
    ...state,
    user,
    pet,
    emergencyShield,
    meta: { lastEvent: "emergency" },
    _aiContext: { category: "emergency", event: "emergency", amount, label },
  };
}
