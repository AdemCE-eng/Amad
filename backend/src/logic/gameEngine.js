// gameEngine.js — the gamification layer. Pure functions, zero I/O, same
// style as petEngine. petEngine owns health math; this owns streaks, coins,
// achievements, evolution stages, the weekly challenge, and the shop.
//
// Demo-clock rule: days advance ONLY via the advance-day endpoint (never
// wall-clock), so a full week plays out in seconds on stage.

import { clamp } from "./petEngine.js";

// ── Catalogs ─────────────────────────────────────────────

// Evolution: cumulative savings as a fraction of the goal.
// Seed is 1200/5000 = 24% → stage 0, so ONE decent save on stage triggers a
// live evolution (deliberately demo-tuned).
export function stageFromSavings(savedAmount, goalAmount) {
  const r = goalAmount > 0 ? savedAmount / goalAmount : 0;
  return r >= 0.8 ? 2 : r >= 0.3 ? 1 : 0;
}

export const ACHIEVEMENTS = {
  first_save: { title: "أول توفير", desc: "أودعت أول مبلغ في مدخراتك", coins: 25, icon: "🌱" },
  streak_3: { title: "ثلاثة أيام كفو", desc: "٣ أيام متتالية داخل الميزانية", coins: 30, icon: "🔥" },
  budget_week: { title: "أسبوع منضبط", desc: "أسبوع كامل داخل الميزانية", coins: 50, icon: "📅" },
  half_goal: { title: "نص الطريق", desc: "وصلت ٥٠٪ من هدف الادخار", coins: 50, icon: "⛰️" },
  goal_reached: { title: "تحقق الهدف", desc: "وصلت هدف الادخار كاملاً", coins: 100, icon: "🏆" },
  shield_wise: { title: "درع الحكمة", desc: "استخدمت درع الطوارئ بحكمة", coins: 25, icon: "🛡️" },
};

export const SHOP_ITEMS = {
  sunglasses: { name: "نظارة شمسية", price: 50, icon: "🕶️" },
  shemagh: { name: "شماغ وعقال", price: 100, icon: "🔴" },
  falcon_hood: { name: "برقع الصقر", price: 150, icon: "🪶" },
};

const STREAK_MILESTONES = { 3: 30, 7: 70, 14: 150 };
const GOOD_DAY_COINS = 10;
const MAX_FREEZES = 2;

// ── Helpers ──────────────────────────────────────────────

// Firebase RTDB drops nulls/empty objects, so read defensively.
function gameOf(state) {
  const g = state.game || {};
  return {
    day: g.day ?? 1,
    streak: { current: 0, best: 0, freezesLeft: 1, status: "alive", ...(g.streak || {}) },
    coins: g.coins ?? 0,
    stage: g.stage ?? 0,
    today: { spent: 0, saved: 0, overBudget: false, coffees: 0, ...(g.today || {}) },
    achievements: g.achievements || {},
    activeChallenge: g.activeChallenge || null,
    inventory: g.inventory || {},
    equipped: g.equipped ?? null,
    lastCelebration: g.lastCelebration || { type: "none", id: "none", at: 0 },
  };
}

function celebrate(game, type, id) {
  // Timestamp keys the frontend queue; replays are impossible.
  return { ...game, lastCelebration: { type, id, at: Date.now() } };
}

function unlock(game, key) {
  if (game.achievements[key]) return game;
  const a = ACHIEVEMENTS[key];
  return celebrate(
    {
      ...game,
      coins: game.coins + a.coins,
      achievements: { ...game.achievements, [key]: { unlockedAt: Date.now() } },
    },
    "achievement",
    key
  );
}

// ── Per-event effects (piped after every petEngine event) ─

// ctx: { event: salary|save|purchase|emergency, amount, savedPortion?,
//        category?, overBudget?, shielded? }
export function applyGameEffects(state, ctx) {
  let game = gameOf(state);
  const user = state.user;

  // Daily accumulators drive the streak verdict at day end.
  const today = { ...game.today };
  if (ctx.event === "purchase" || ctx.event === "emergency") today.spent += ctx.amount || 0;
  if (ctx.event === "salary" || ctx.event === "save") today.saved += ctx.savedPortion ?? ctx.amount ?? 0;
  if (ctx.overBudget) today.overBudget = true;
  if (ctx.event === "purchase" && ctx.category === "coffee") today.coffees += 1;
  game = { ...game, today };

  // Weekly challenge: count coffees against the limit (fail only at week end).
  if (game.activeChallenge?.status === "active" && ctx.event === "purchase" && ctx.category === "coffee") {
    game = { ...game, activeChallenge: { ...game.activeChallenge, used: game.activeChallenge.used + 1 } };
  }

  // Achievements from money events.
  if ((ctx.event === "save" || ctx.event === "salary") && (ctx.savedPortion ?? ctx.amount) > 0) {
    game = unlock(game, "first_save");
  }
  if (user.savedAmount >= user.goalAmount * 0.5) game = unlock(game, "half_goal");
  if (user.savedAmount >= user.goalAmount) game = unlock(game, "goal_reached");
  if (ctx.event === "emergency" && ctx.shielded) game = unlock(game, "shield_wise");

  // Evolution — checked last so it wins the celebration slot (frontend
  // prioritizes by type anyway, but the latest write is what most judges see).
  const newStage = stageFromSavings(user.savedAmount, user.goalAmount);
  if (newStage > game.stage) {
    game = celebrate({ ...game, stage: newStage }, "evolution", `stage${newStage}`);
  } else if (newStage !== game.stage) {
    game = { ...game, stage: newStage }; // shrunk goal edge case — no fanfare
  }

  return { ...state, game };
}

// ── Day advance (the demo-clock heart) ───────────────────

export function advanceDay(state) {
  let game = gameOf(state);
  const goodDay = !game.today.overBudget;
  let streak = { ...game.streak };
  let coins = game.coins;
  let frozen = false;

  if (goodDay) {
    streak.current += 1;
    streak.best = Math.max(streak.best, streak.current);
    streak.status = "alive";
    coins += GOOD_DAY_COINS;
    if (STREAK_MILESTONES[streak.current]) coins += STREAK_MILESTONES[streak.current];
    // Compassion economy: a freeze shield is EARNED every full week.
    if (streak.current % 7 === 0) streak.freezesLeft = Math.min(MAX_FREEZES, streak.freezesLeft + 1);
  } else if (streak.freezesLeft > 0) {
    streak = { ...streak, freezesLeft: streak.freezesLeft - 1, status: "frozen" }; // streak SURVIVES
    frozen = true;
  } else {
    // Never nuked to zero from a height — fall to the milestone below.
    streak.current = streak.current >= 14 ? 7 : streak.current >= 7 ? 3 : 0;
    streak.status = "alive";
  }

  game = { ...game, streak, coins, day: game.day + 1, today: { spent: 0, saved: 0, overBudget: false, coffees: 0 } };

  if (goodDay && STREAK_MILESTONES[streak.current]) {
    game = celebrate(game, "streak", `day${streak.current}`);
  }
  if (streak.current >= 3) game = unlock(game, "streak_3");
  if (streak.current >= 7) game = unlock(game, "budget_week");

  // Pet reacts to the new day: proud on a good day, reassuring when the
  // shield ate the miss — mood itself stays health-derived in petEngine.
  const pet = {
    ...state.pet,
    animationState: goodDay ? "happy" : state.pet.animationState,
    updatedAt: Date.now(),
  };

  return {
    ...state,
    game,
    pet,
    meta: { lastEvent: "advance-day" },
    _aiContext: {
      category: frozen ? "emergency" : goodDay ? "happy" : "sad",
      event: frozen ? "streak_frozen" : goodDay ? "streak_up" : "streak_lost",
      streakDays: streak.current,
    },
  };
}

// ── Challenge / shop / profile ───────────────────────────

export function completeChallenge(state) {
  let game = gameOf(state);
  const ch = game.activeChallenge;
  if (!ch || ch.status !== "active") return { ...state, game, _noop: true };
  game = celebrate(
    { ...game, coins: game.coins + ch.reward, activeChallenge: { ...ch, status: "done" } },
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
  const item = SHOP_ITEMS[itemId];
  if (!item) return { error: "unknown_item" };
  if (game.inventory[itemId]) return { error: "already_owned" };
  if (game.coins < item.price) return { error: "insufficient_coins" };
  game = celebrate(
    {
      ...game,
      coins: game.coins - item.price,
      inventory: { ...game.inventory, [itemId]: true },
      equipped: itemId,
    },
    "shop",
    itemId
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
  if (itemId && !game.inventory[itemId]) return { error: "not_owned" };
  return { state: { ...state, game: { ...game, equipped: itemId || null } } };
}

export function setProfile(state, { petName, petType, goalAmount }) {
  const user = { ...state.user };
  if (petName) user.petName = String(petName).slice(0, 30);
  if (petType) user.petType = String(petType);
  if (Number.isFinite(goalAmount) && goalAmount > 0) user.goalAmount = Math.round(goalAmount);
  // Re-derive the stage against the (possibly new) goal.
  const game = { ...gameOf(state), stage: stageFromSavings(user.savedAmount, user.goalAmount) };
  return { ...state, user, game };
}

export { gameOf, clamp };
