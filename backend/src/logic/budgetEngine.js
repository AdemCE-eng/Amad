// budgetEngine.js — savings-plan algorithm + category budgets + auto-rollover.
// Pure functions, zero I/O (same discipline as petEngine/gameEngine).
//
// Core mechanic the demo is built around: each spending category has a budget
// for a cadence (daily / weekly / monthly). Whatever the user does NOT spend of
// that budget is swept into their savings account when the matching period
// closes (daily budgets settle every day, weekly every 7 days, monthly every
// 30) — driven by the demo clock, never wall-clock. "20 coffee budget, spent 5"
// → 15 rolls into savings on the next day-advance.

import { clamp } from "./petEngine.js";

const round = (n) => Math.round(n);
const clampRound = (v, min, max) => clamp(round(v), min, max);

// ── Default category budgets ─────────────────────────────
// cadence: daily | weekly | monthly. limit is SAR for ONE period.
// These are the pristine/demo defaults; a savings plan re-derives them from the
// user's monthly income (see suggestSavingsPlan).
export function defaultBudgets() {
  return {
    coffee:        { label: "قهوة يومية", cadence: "daily",   icon: "☕", limit: 20 },
    gas:           { label: "وقود",        cadence: "daily",   icon: "⛽", limit: 30 },
    groceries:     { label: "بقالة",       cadence: "weekly",  icon: "🛒", limit: 300 },
    dining:        { label: "مطاعم",       cadence: "weekly",  icon: "🍽️", limit: 200 },
    entertainment: { label: "ترفيه",       cadence: "weekly",  icon: "🎬", limit: 100 },
    subscriptions: { label: "اشتراكات",    cadence: "monthly", icon: "📱", limit: 80 },
  };
}

// Fresh per-period spend counters, one per budget category.
export function zeroPeriod(budgets = defaultBudgets()) {
  const p = {};
  for (const cat of Object.keys(budgets)) p[cat] = 0;
  return p;
}

// The budget/savings fields merged onto the seed `user`. The savings account
// starts CLOSED — Home shows only the "activate savings" CTA until the user
// opens it (applies a plan), which reveals the pet + budget. coffee starts at
// 5 of 20 so the "15 will roll over" example is live the moment it's revealed.
export function initialBudgetFields() {
  const budgets = defaultBudgets();
  return {
    monthlyIncome: 8000,
    savingsAccountOpened: false,  // Home reveals the pet + budget only AFTER activation
    savingsPlan: null,            // null → Home surfaces the "plan your savings" card
    budgets,
    budgetPeriod: { ...zeroPeriod(budgets), coffee: 5 },
    rolloverTotal: 0,             // lifetime SAR auto-swept into savings
  };
}

// ── Savings-plan algorithm ───────────────────────────────
// Tiered save-rate: the more you earn, the larger the share you can safely
// commit (diminishing marginal need for the next SAR of spending). The plan is
// a modified 50/30/20 — savings first, then category budgets are derived from
// the *spendable* remainder so the numbers always reconcile against income.
function saveRateFor(income) {
  if (income <= 3000) return 0.10;
  if (income <= 6000) return 0.15;
  if (income <= 10000) return 0.20;
  if (income <= 20000) return 0.25;
  return 0.30;
}

export function suggestSavingsPlan(monthlyIncome) {
  const income = Math.max(0, round(Number(monthlyIncome) || 0));
  const rate = saveRateFor(income);
  const monthlyTarget = round(income * rate);      // → savings each month
  const spendable = Math.max(0, income - monthlyTarget);
  const daily = spendable / 30;                    // rough daily allowance
  const weekly = spendable / 4;

  // Category budgets derived from the spendable remainder, each clamped to a
  // sane floor/ceiling so tiny/huge incomes still yield usable numbers.
  const budgets = {
    coffee:        { label: "قهوة يومية", cadence: "daily",   icon: "☕", limit: clampRound(daily * 0.08, 10, 50) },
    gas:           { label: "وقود",        cadence: "daily",   icon: "⛽", limit: clampRound(daily * 0.20, 15, 120) },
    groceries:     { label: "بقالة",       cadence: "weekly",  icon: "🛒", limit: clampRound(weekly * 0.35, 120, 1200) },
    dining:        { label: "مطاعم",       cadence: "weekly",  icon: "🍽️", limit: clampRound(weekly * 0.22, 80, 800) },
    entertainment: { label: "ترفيه",       cadence: "weekly",  icon: "🎬", limit: clampRound(weekly * 0.12, 40, 400) },
    subscriptions: { label: "اشتراكات",    cadence: "monthly", icon: "📱", limit: clampRound(spendable * 0.03, 30, 300) },
  };

  return {
    income,
    rate,                                  // 0-1
    ratePct: Math.round(rate * 100),       // for display
    monthlyTarget,
    method: "خطة 50/30/20 معدّلة حسب دخلك",
    budgets,
  };
}

// Apply a plan to the user: open the account, store income + plan, install the
// budgets (possibly EDITED by the user) and reset the period counters. The
// savings goal is derived from the plan (a year of the monthly target) so the
// companion the user then picks is bound to the plan they made — unless an
// explicit goalAmount is passed. Pure — returns the next user.
export function applyPlanToUser(user, { monthlyIncome, budgets, monthlyTarget, goalAmount } = {}) {
  const plan = suggestSavingsPlan(monthlyIncome);
  const nextBudgets = budgets && Object.keys(budgets).length ? budgets : plan.budgets;
  const requestedTarget = Number.isFinite(monthlyTarget) && monthlyTarget > 0
    ? Math.round(monthlyTarget)
    : plan.monthlyTarget;
  const target = Math.min(plan.income, requestedTarget);
  const goal = Number.isFinite(goalAmount) && goalAmount > 0
    ? Math.round(goalAmount)
    : Math.max(1, target * 12);
  const ratePct = plan.income > 0 ? Math.round((target / plan.income) * 100) : plan.ratePct;
  return {
    ...user,
    income: plan.income,
    monthlyIncome: plan.income,
    balance: plan.income,
    goalAmount: goal,                 // pet growth is measured against this
    savingsAccountOpened: true,
    savingsPlan: {
      ratePct,
      monthlyTarget: target,
      method: plan.method,
      createdAt: Date.now(),
    },
    budgets: nextBudgets,
    budgetPeriod: zeroPeriod(nextBudgets),
  };
}

// ── Purchase tracking ────────────────────────────────────
// Called from petEngine.applyPurchase: fold this purchase into the matching
// category's current-period spend (if the category is budgeted). Non-budgeted
// categories still hit the monthly ceiling (petEngine) but don't roll over.
export function trackPurchase(user, category, amount) {
  if (!user.budgets || !user.budgets[category]) return user.budgetPeriod || {};
  const period = { ...(user.budgetPeriod || {}) };
  period[category] = (period[category] || 0) + amount;
  return period;
}

// ── Settlement / auto-rollover ───────────────────────────
// For every budget whose cadence is in `cadences`, sweep the UNSPENT remainder
// (limit − spent, floored at 0) into savings, then reset that category's spend.
// Returns { user, swept } — swept is the total SAR moved this settlement.
export function settleBudgets(user, cadences) {
  const budgets = user.budgets || {};
  const period = { ...(user.budgetPeriod || {}) };
  let swept = 0;

  for (const [cat, cfg] of Object.entries(budgets)) {
    if (!cadences.includes(cfg.cadence)) continue;
    const spent = period[cat] || 0;
    const leftover = Math.max(0, round(cfg.limit) - round(spent));
    swept += leftover;
    period[cat] = 0; // period closed → counter resets
  }

  if (swept <= 0) {
    return { user: { ...user, budgetPeriod: period }, swept: 0 };
  }

  const nextUser = {
    ...user,
    budgetPeriod: period,
    savedAmount: (user.savedAmount || 0) + swept,
    rolloverTotal: (user.rolloverTotal || 0) + swept,
  };
  return { user: nextUser, swept };
}

// Which cadences close when the demo clock lands on `day`?
// day-advance → daily always; +weekly on every 7th day; +monthly on every 30th.
export function cadencesClosingOn(day) {
  const c = ["daily"];
  if (day % 7 === 0) c.push("weekly");
  if (day % 30 === 0) c.push("monthly");
  return c;
}
