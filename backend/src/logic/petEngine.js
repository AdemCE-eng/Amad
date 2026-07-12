// petEngine.js — THE MATH. Pure functions, zero I/O.
// Each event takes the current state and returns the full next state, so routes
// just persist the result in a single Firebase write.
//
// Relative-effort principle: heal amounts scale by the % of the user's PERSONAL
// goal, not absolute SAR — a student and an executive get comparable payoff.

import { healthStateOf } from "../../../shared/rafiqIdentity.js";

// ── Tunable constants ────────────────────────────────────
const SAVE_RATE = 0.2; // portion of a salary deposit auto-routed to Instant Savings
// Seed monthly income (SAR) — NXP save rewards scale relative to this, and
// gameEngine falls back to it when a pre-income DB state has no user.income.
export const DEFAULT_INCOME = 8000;
// Seed savings (SAR) — one constant feeds both savedAmount and its NXP
// high-water mark so they can never disagree at seed time.
const SEED_SAVED_AMOUNT = 1200;
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
      goalAmount: 5000,
      savedAmount: SEED_SAVED_AMOUNT,
      // NXP high-water mark of savedAmount (anti-farming): deposits earn NXP
      // only on the part that pushes savings past this; withdrawals never
      // lower it. Persona-independent — all personas share the savings pool.
      allTimeHighBalance: SEED_SAVED_AMOUNT,
      balance: 8000,
      monthlyBudget: 3000,
      spentThisMonth: 1400,
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
    // save from evolution), 60 NXP (one milestone from the shemagh), and a
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
        desc: "حافظ على ٣ زيارات مقهى أو أقل",
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
// `mood` always derives from the resulting health — it must never disagree with
// what the health bar shows. `animationState` can still be overridden per event
// for a one-off Lottie cue (e.g. "eating"), independent of the persistent mood.
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
// Goal-secured shield: once savings have met the savings goal, ordinary
// spending can no longer hurt the pet — health loss is suppressed entirely.
// Budget accounting, streaks and quests still run; only health is shielded,
// and saving can still raise it. Health earned isn't undone by spending.
export function applyPurchase(state, { amount, category = "general", label = "عملية شراء" }) {
  const spentThisMonth = state.user.spentThisMonth + amount;
  const overBudget = spentThisMonth > state.user.monthlyBudget;
  const goalSecured = state.user.savedAmount >= state.user.goalAmount;
  const user = {
    ...state.user,
    balance: state.user.balance - amount,
    spentThisMonth,
  };
  let healthDelta = goalSecured ? 0 : PURCHASE_IN_BUDGET_PENALTY;
  if (overBudget && !goalSecured) {
    const overagePct = ((spentThisMonth - state.user.monthlyBudget) / state.user.monthlyBudget) * 100;
    healthDelta = -clamp(
      Math.round(overagePct * OVER_BUDGET_PENALTY_K),
      OVER_BUDGET_PENALTY_MIN,
      OVER_BUDGET_PENALTY_MAX
    );
  }
  // No animation override: pose derives from the health band, same as mood.
  // The over-budget "hit" feedback is the health drop itself (frontend shakes
  // the screen and flashes red) — the pet only collapses when truly sick.
  const pet = withHealth(state.pet, healthDelta);
  return {
    ...state,
    user,
    pet,
    meta: { lastEvent: "purchase" },
    _aiContext: {
      category: pet.mood, // AI reaction always matches what the health bar shows
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

// Small positive nudge from events outside the personal account (family-goal
// contribution, followed saving plan). Health/mood only — stays in this
// module's domain; family/offer state lives in its own engines.
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
