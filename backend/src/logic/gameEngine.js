// gameEngine.js — the gamification layer. Pure functions, zero I/O, same
// style as petEngine. petEngine owns health math; this owns streaks, coins,
// achievements, evolution stages, the weekly challenge, and the shop.
//
// Demo-clock rule: days advance ONLY via the advance-day endpoint (never
// wall-clock), so a full week plays out in seconds on stage.

// DEFAULT_INCOME powers the income-relative NXP math below; budgetEngine
// provides the auto-rollover settlement used by advanceDay.
import { clamp, DEFAULT_INCOME } from "./petEngine.js";
import { settleBudgets, cadencesClosingOn } from "./budgetEngine.js";

// ── Catalogs ─────────────────────────────────────────────

// Evolution: cumulative savings as a fraction of the goal.
export function stageFromSavings(savedAmount, goalAmount) {
  const r = goalAmount > 0 ? savedAmount / goalAmount : 0;
  return r >= 0.8 ? 2 : r >= 0.3 ? 1 : 0;
}

export const ACHIEVEMENTS = {
  first_save: { title: "أول توفير", desc: "أودعت أول مبلغ في مدخراتك", nxp: 25, icon: "🌱" },
  streak_3: { title: "ثلاثة أيام كفو", desc: "3 أيام متتالية داخل الميزانية", nxp: 30, icon: "🔥" },
  budget_week: { title: "أسبوع منضبط", desc: "أسبوع كامل داخل الميزانية", nxp: 50, icon: "📅" },
  half_goal: { title: "نص الطريق", desc: "وصلت 50٪ من هدف الادخار", nxp: 50, icon: "⛰️" },
  goal_reached: { title: "تحقق الهدف", desc: "وصلت هدف الادخار كاملاً", nxp: 100, icon: "🏆" },
  shield_wise: { title: "درع الحكمة", desc: "استخدمت درع الطوارئ بحكمة", nxp: 25, icon: "🛡️" },
};

export const SHOP_ITEMS = {
  sunglasses: { name: "نظارة شمسية", price: 50, icon: "🕶️" },
  cap: { name: "كاب صقر", price: 100, icon: "🧢" },
  falcon_hood: { name: "تاج الصقر الملكي", price: 150, icon: "✨", description: "تاج ذهبي منحني يثبت بانسيابية فوق الرأس." },
};

// Weekly quest pool — completing one auto-advances to the next (wraps around),
// so activeChallenge never rests at "done". initialState() seeds the first
// entry inline (demo-tuned used=1). Only coffee-shaped quests tick their
// `used` counter automatically (applyGameEffects counts coffee purchases);
// the rest advance via POST /api/demo/complete-challenge.
export const CHALLENGE_POOL = [
  { id: "less_coffee", title: "قهوة أقل هذا الأسبوع", desc: "حافظ على 3 زيارات مقهى أو أقل", limit: 3, reward: 50, icon: "☕" },
  { id: "no_delivery", title: "أسبوع بلا توصيل", desc: "3 طلبات توصيل مطاعم أو أقل هذا الأسبوع", limit: 3, reward: 40, icon: "🛵" },
  { id: "save_thrice", title: "وفّر ثلاث مرات", desc: "أودع في المدخرات الفورية 3 مرات هذا الأسبوع", limit: 3, reward: 60, icon: "💰" },
  { id: "budget_days", title: "خمسة أيام منضبطة", desc: "أنهِ 5 أيام دون تجاوز ميزانيتك الشهرية", limit: 5, reward: 70, icon: "📅" },
];

// Rotation: hand back the pool entry after the one just finished, fresh.
// Unknown ids (legacy DB states) restart from the top: findIndex's -1 + 1 → 0.
function nextChallenge(currentId) {
  const idx = CHALLENGE_POOL.findIndex((c) => c.id === currentId);
  return { ...CHALLENGE_POOL[(idx + 1) % CHALLENGE_POOL.length], used: 0, status: "active" };
}

// Cheat Controller demo personas — same pet/goal/streak, meaningfully
// different incomes, so equivalent-effort saves (same % of income) visibly
// earn equal NXP live on stage.
export const INCOME_PROFILES = {
  student: { name: "نورة (طالبة)", income: 2000, balance: 2500 },
  employee: { name: "آدم (موظف)", income: 8000, balance: 8000 },
  executive: { name: "فيصل (تنفيذي)", income: 25000, balance: 30000 },
};

const STREAK_MILESTONES = { 3: 30, 7: 70, 14: 150 };
const GOOD_DAY_COINS = 10;
const MAX_FREEZES = 2;

// Income-relative NXP — petEngine's relative-effort principle applied to NXP:
// a save earns SAVE_NXP_K per 1% of MONTHLY INCOME saved, so a student saving
// 100 of a 2,000 income earns the same 25 NXP as an executive saving 1,250 of
// 25,000. Clamped so micro-saves still feel rewarded and a full salary
// auto-save doesn't print NXP.
const SAVE_NXP_K = 5;
const SAVE_NXP_MIN = 5;
const SAVE_NXP_MAX = 150;

// NOTE: the old inline mockRetailCalendar / predictive-offer block that lived
// here is gone — offerEngine.js is the canonical sales-prediction engine now
// (deterministic, MOCK-campaign driven). The SRS pitch-trigger tunables that
// sat alongside it went with the applySimulateTrigger functions this branch
// removed; family state is owned by familyEngine.js.

// ── Helpers ──────────────────────────────────────────────

// Firebase RTDB drops nulls/empty objects, so read defensively.
function gameOf(state) {
  const g = state.game || {};
  // Migrate the former shemagh shop key on read. The legacy API identifier
  // remains accepted below, while persisted games now use the cap key.
  const legacyShemaghOwned = Boolean(g.inventory?.shemagh);
  const inventory = legacyShemaghOwned && !g.inventory?.cap
    ? { ...g.inventory, cap: true }
    : (g.inventory || {});
  return {
    day: g.day ?? 1,
    streak: { current: 0, best: 0, freezesLeft: 1, status: "alive", ...(g.streak || {}) },
    // `nxp_balance` is the ONE canonical NXP field. (It replaced the legacy
    // `coins`; reading the old name here is what made saved NXP unspendable.)
    nxp_balance: g.nxp_balance ?? 0,
    stage: g.stage ?? 0,
    today: { spent: 0, saved: 0, overBudget: false, coffees: 0, ...(g.today || {}) },
    achievements: g.achievements || {},
    activeChallenge: g.activeChallenge || null,
    inventory,
    equipped: g.equipped === "shemagh" ? "cap" : (g.equipped ?? null),
    lastCelebration: g.lastCelebration || { type: "none", id: "none", at: 0 },
    lastSaveReward: g.lastSaveReward || { nxp: 0, pctOfIncome: 0, at: 0 },
  };
}

function celebrate(game, type, id) {
  return { ...game, lastCelebration: { type, id, at: Date.now() } };
}

function unlock(game, key) {
  if (game.achievements[key]) return game;
  const a = ACHIEVEMENTS[key];
  return celebrate(
    {
      ...game,
      // a.nxp is the catalog's reward amount; the balance
      // it credits is nxp_balance.
      nxp_balance: game.nxp_balance + a.nxp,
      achievements: { ...game.achievements, [key]: { unlockedAt: Date.now() } },
    },
    "achievement",
    key
  );
}

// ── Per-event effects (piped after every petEngine event) ─
export function applyGameEffects(state, ctx) {
  let game = gameOf(state);
  let user = state.user;

  const today = { ...game.today };
  if (ctx.event === "purchase" || ctx.event === "emergency") today.spent += ctx.amount || 0;
  if (ctx.event === "salary" || ctx.event === "save") today.saved += ctx.savedPortion ?? ctx.amount ?? 0;
  if (ctx.overBudget) today.overBudget = true;
  if (ctx.event === "purchase" && ctx.category === "coffee") today.coffees += 1;
  game = { ...game, today };

  if (game.activeChallenge?.status === "active" && ctx.event === "purchase" && ctx.category === "coffee") {
    game = { ...game, activeChallenge: { ...game.activeChallenge, used: game.activeChallenge.used + 1 } };
  }

  // Income-relative NXP on NEW savings only (anti-farming): the reward
  // applies to the part of this deposit that pushes savedAmount past its
  // all-time high, so deposit→withdraw→redeposit cycles earn nothing.
  // `lastSaveReward` mirrors the lastCelebration pattern — timestamp-keyed
  // so the frontend can surface "+X NXP — Y% of income", or the distinct
  // "back to your best" zero receipt, for exactly this save.
  const saved = ctx.savedPortion ?? ctx.amount ?? 0;
  if ((ctx.event === "save" || ctx.event === "salary") && saved > 0) {
    // savedAmount is already post-event here; legacy DB states without the
    // field treat their pre-event savings as the high-water mark.
    const ath = user.allTimeHighBalance ?? user.savedAmount - saved;
    const rewardableDelta = Math.max(0, user.savedAmount - ath);
    if (rewardableDelta > 0) {
      const income = user.income > 0 ? user.income : DEFAULT_INCOME;
      const pctOfIncome = (rewardableDelta / income) * 100;
      const nxp = clamp(Math.round(pctOfIncome * SAVE_NXP_K), SAVE_NXP_MIN, SAVE_NXP_MAX);
      game = {
        ...game,
        nxp_balance: game.nxp_balance + nxp,
        lastSaveReward: { nxp, pctOfIncome: Math.round(pctOfIncome * 10) / 10, at: Date.now() },
      };
    } else {
      game = { ...game, lastSaveReward: { nxp: 0, pctOfIncome: 0, at: Date.now() } };
      // Let the voice layer know this save refilled old ground (no reward).
      state = { ...state, _aiContext: { ...state._aiContext, redepositZero: true } };
    }
    user = { ...user, allTimeHighBalance: Math.max(ath, user.savedAmount) };
  }

  // Achievements from money events.
  if ((ctx.event === "save" || ctx.event === "salary") && (ctx.savedPortion ?? ctx.amount) > 0) {
    game = unlock(game, "first_save");
  }
  if (user.savedAmount >= user.goalAmount * 0.5) game = unlock(game, "half_goal");
  if (user.savedAmount >= user.goalAmount) game = unlock(game, "goal_reached");
  if (ctx.event === "emergency" && ctx.shielded) game = unlock(game, "shield_wise");

  const newStage = stageFromSavings(user.savedAmount, user.goalAmount);
  if (newStage > game.stage) {
    game = celebrate({ ...game, stage: newStage }, "evolution", `stage${newStage}`);
  } else if (newStage !== game.stage) {
    game = { ...game, stage: newStage };
  }

  return { ...state, user, game };
}

// ── Day advance (the demo-clock heart) ───────────────────
export function advanceDay(state) {
  let game = gameOf(state);
  const goodDay = !game.today.overBudget;
  let streak = { ...game.streak };
  let nxp_balance = game.nxp_balance;
  let frozen = false;

  if (goodDay) {
    streak.current += 1;
    streak.best = Math.max(streak.best, streak.current);
    streak.status = "alive";
    nxp_balance += GOOD_DAY_COINS;
    if (STREAK_MILESTONES[streak.current]) nxp_balance += STREAK_MILESTONES[streak.current];
    // Compassion economy: a freeze shield is EARNED every full week.
    if (streak.current % 7 === 0) streak.freezesLeft = Math.min(MAX_FREEZES, streak.freezesLeft + 1);
  } else if (streak.freezesLeft > 0) {
    streak = { ...streak, freezesLeft: streak.freezesLeft - 1, status: "frozen" };
    frozen = true;
  } else {
    streak.current = streak.current >= 14 ? 7 : streak.current >= 7 ? 3 : 0;
    streak.status = "alive";
  }

  const newDay = game.day + 1;
  game = { ...game, streak, nxp_balance, day: newDay, today: { spent: 0, saved: 0, overBudget: false, coffees: 0 } };

  if (goodDay && STREAK_MILESTONES[streak.current]) {
    game = celebrate(game, "streak", `day${streak.current}`);
  }
  if (streak.current >= 3) game = unlock(game, "streak_3");
  if (streak.current >= 7) game = unlock(game, "budget_week");

  // Auto-rollover: sweep unspent budgets whose period closes on this new day
  // (daily always; weekly on day%7; monthly on day%30) into savings.
  const { user, swept } = settleBudgets(state.user, cadencesClosingOn(newDay));

  // Rolled-over savings can evolve the companion — checked last so it wins the
  // celebration slot over the streak fanfare.
  const newStage = stageFromSavings(user.savedAmount, user.goalAmount);
  if (newStage > game.stage) {
    game = celebrate({ ...game, stage: newStage }, "evolution", `stage${newStage}`);
  } else if (newStage !== game.stage) {
    game = { ...game, stage: newStage };
  }

  const pet = {
    ...state.pet,
    animationState: goodDay || swept > 0 ? "happy" : state.pet.animationState,
    updatedAt: Date.now(),
  };

  return {
    ...state,
    user,
    game,
    pet,
    meta: { lastEvent: "advance-day" },
    _aiContext: {
      category: frozen ? "emergency" : goodDay ? "happy" : "sad",
      event: frozen ? "streak_frozen" : goodDay ? "streak_up" : "streak_lost",
      streakDays: streak.current,
      swept,
      rolloverTotal: user.rolloverTotal ?? 0,
    },
  };
}

// Fast-forward N demo days in one shot (week = 7, month = 30). Applies per-day
// streak + settlement purely, then reports the TOTAL swept across the span.
export function advanceDays(state, n) {
  let s = state;
  let totalSwept = 0;
  for (let i = 0; i < n; i++) {
    s = advanceDay(s);
    totalSwept += s._aiContext?.swept || 0;
  }
  return { ...s, _aiContext: { ...s._aiContext, swept: totalSwept, span: n } };
}

// ── Challenge / shop / profile ───────────────────────────
export function completeChallenge(state) {
  let game = gameOf(state);
  const ch = game.activeChallenge;
  if (!ch || ch.status !== "active") return { ...state, game, _noop: true };
  // Pay out, then rotate straight to the next pool quest — the celebration
  // overlay announces the win, and the card immediately shows the fresh
  // challenge instead of resting at "done" forever.
  game = celebrate(
    { ...game, nxp_balance: game.nxp_balance + ch.reward, activeChallenge: nextChallenge(ch.id) },
    "challenge",
    ch.id
  );
  const pet = { ...state.pet, animationState: "celebrate", updatedAt: Date.now() };
  return {
    ...state,
    game,
    pet,
    meta: { lastEvent: "challenge" },
    _aiContext: { category: "happy", event: "challenge_done", title: ch.title },
  };
}

export function buyItem(state, itemId) {
  let game = gameOf(state);
  const canonicalItemId = itemId === "shemagh" ? "cap" : itemId;
  const item = SHOP_ITEMS[canonicalItemId];
  if (!item) return { error: "unknown_item" };
  if (game.inventory[canonicalItemId]) return { error: "already_owned" };
  // Spends the SAME balance saving/streaks/challenges credit — that identity
  // is the whole point of unifying on nxp_balance.
  if (game.nxp_balance < item.price) return { error: "insufficient_coins" };
  game = celebrate(
    {
      ...game,
      nxp_balance: game.nxp_balance - item.price,
      inventory: { ...game.inventory, [canonicalItemId]: true },
      equipped: canonicalItemId,
    },
    "shop",
    canonicalItemId
  );
  const pet = { ...state.pet, animationState: "celebrate", updatedAt: Date.now() };
  return {
    state: {
      ...state,
      game,
      pet,
      meta: { lastEvent: "shop" },
      _aiContext: { category: "happy", event: "shop", itemName: item.name },
    },
  };
}

export function equipItem(state, itemId) {
  const game = gameOf(state);
  const canonicalItemId = itemId === "shemagh" ? "cap" : itemId;
  if (canonicalItemId && !game.inventory[canonicalItemId]) return { error: "not_owned" };
  return { state: { ...state, game: { ...game, equipped: canonicalItemId || null } } };
}

// Swap the demo income persona — a settings change like setProfile, NOT a
// financial event: pet, streak, goal progress and challenge all survive so
// the operator can flip personas mid-pitch and compare saves live.
export function setIncomeProfile(state, profileId) {
  const p = INCOME_PROFILES[profileId];
  if (!p) return { error: "unknown_profile" };
  return { ...state, user: { ...state.user, name: p.name, income: p.income, balance: p.balance } };
}

export function setProfile(state, { petName, petType, goalAmount }) {
  const user = { ...state.user };
  if (petName) user.petName = String(petName).slice(0, 30);
  if (petType) user.petType = String(petType);
  if (Number.isFinite(goalAmount) && goalAmount > 0) user.goalAmount = Math.round(goalAmount);
  const game = { ...gameOf(state), stage: stageFromSavings(user.savedAmount, user.goalAmount) };
  return { ...state, user, game };
}

export { gameOf, clamp };
