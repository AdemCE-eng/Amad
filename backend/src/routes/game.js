// game.js — gamification endpoints: the demo clock, challenge, shop, profile.
// Same pipeline as simulate.js: read state → engine → (AI) → single commit.
import { Router } from "express";
import { db } from "../firebase.js";
import { readState, commit } from "./simulate.js";
import {
  advanceDay,
  advanceDays,
  completeChallenge,
  buyItem,
  equipItem,
  setProfile,
  // setIncomeProfile still backs POST /demo/set-income-profile below.
  // applySimulateTrigger is NOT imported: this branch removed the
  // /game/simulate-trigger endpoint (family/offers routes supersede it).
  setIncomeProfile,
  SHOP_ITEMS,
  ACHIEVEMENTS,
} from "../logic/gameEngine.js";
import { buildNotification } from "../logic/notificationEngine.js";
import {
  markNotificationsReadForRecipient,
  notificationPath,
  readNotificationsForRecipient,
  recipientFromRequest,
} from "../services/notificationService.js";

const router = Router();

// POST /api/demo/advance-day — the demo clock. Resolves the streak for the
// day that just "ended", starts a fresh one, and sweeps unspent daily budgets
// into savings. A week plays out in seconds.
router.post("/demo/advance-day", async (_req, res, next) => {
  try {
    const state = await readState();
    const out = await commit(advanceDay(state));
    res.json({ ok: true, ...out });
  } catch (e) {
    next(e);
  }
});

// POST /api/demo/advance-week — jump 7 demo days; settles daily budgets each
// day AND the weekly budgets, sweeping every unspent remainder into savings.
router.post("/demo/advance-week", async (_req, res, next) => {
  try {
    const state = await readState();
    const out = await commit(advanceDays(state, 7));
    res.json({ ok: true, ...out });
  } catch (e) {
    next(e);
  }
});

// POST /api/demo/advance-month — jump 30 demo days; settles daily + weekly +
// monthly budgets across the span.
router.post("/demo/advance-month", async (_req, res, next) => {
  try {
    const state = await readState();
    const out = await commit(advanceDays(state, 30));
    res.json({ ok: true, ...out });
  } catch (e) {
    next(e);
  }
});

// POST /api/demo/complete-challenge — force-complete the weekly challenge.
router.post("/demo/complete-challenge", async (_req, res, next) => {
  try {
    const state = await readState();
    const result = completeChallenge(state);
    if (result._noop) {
      return res.status(400).json({ ok: false, error: "no_active_challenge" });
    }
    const out = await commit(result);
    res.json({ ok: true, ...out });
  } catch (e) {
    next(e);
  }
});

// POST /api/demo/set-income-profile  { profileId } — Cheat Controller persona
// switch (student | employee | executive). A settings change like
// /api/user/goal, not a financial event: no health/AI reaction, just swaps
// name/income/balance so the next save demonstrates income-relative NXP live.
router.post("/demo/set-income-profile", async (req, res, next) => {
  try {
    const state = await readState();
    const result = setIncomeProfile(state, req.body.profileId);
    if (result.error) {
      return res.status(400).json({ ok: false, error: result.error, message: "بروفايل دخل غير معروف." });
    }
    await db.ref("/user").set(result.user);
    res.json({
      ok: true,
      user: result.user,
      pet: state.pet,
      game: state.game,
      emergencyShield: state.emergencyShield,
    });
  } catch (e) {
    next(e);
  }
});

// POST /api/shop/buy  { itemId } — spend earned coins, auto-equip.
router.post("/shop/buy", async (req, res, next) => {
  try {
    const state = await readState();
    const result = buyItem(state, req.body.itemId);
    if (result.error) {
      return res.status(400).json({
        ok: false,
        error: result.error,
        message:
          result.error === "insufficient_coins"
            ? "عملاتك لا تكفي بعد، واصل الادخار والتحديات!"
            : "لا يمكن شراء هذا العنصر.",
      });
    }
    const out = await commit(result.state);
    res.json({ ok: true, ...out });
  } catch (e) {
    next(e);
  }
});

// POST /api/pet/equip  { itemId | null } — cosmetic toggle, no AI reaction.
router.post("/pet/equip", async (req, res, next) => {
  try {
    const state = await readState();
    const result = equipItem(state, req.body.itemId ?? null);
    if (result.error) return res.status(400).json({ ok: false, error: result.error });
    await db.ref("/game").set(result.state.game);
    res.json({ ok: true, game: result.state.game });
  } catch (e) {
    next(e);
  }
});

// POST /api/user/profile  { petName, petType, goalAmount } — onboarding
// persistence; a settings change, not a financial event.
router.post("/user/profile", async (req, res, next) => {
  try {
    const state = await readState();
    const { petName, petType } = req.body;
    const goalAmount = Number(req.body.goalAmount);
    const nextState = setProfile(state, { petName, petType, goalAmount });
    await db.ref("/").update({ "/user": nextState.user, "/game": nextState.game });
    res.json({ ok: true, user: nextState.user, game: nextState.game });
  } catch (e) {
    next(e);
  }
});

router.post("/user/notifications", async (req, res, next) => {
  try {
    const recipientId = recipientFromRequest(req);
    if (!recipientId) return res.status(400).json({ ok: false, error: "invalid_recipient" });
    const ref = db.ref(notificationPath(recipientId)).push();
    const notification = buildNotification({
      id: ref.key,
      recipientId,
      type: req.body.type || "general",
      title: req.body.title,
      body: req.body.body || req.body.message,
    });
    await ref.set(notification);

    res.json({ ok: true, notification });
  } catch (e) {
    next(e);
  }
});

router.post("/user/mark-all-notifications-read", async (req, res, next) => {
  try {
    const recipientId = recipientFromRequest(req);
    if (!recipientId) return res.status(400).json({ ok: false, error: "invalid_recipient" });
    const marked = await markNotificationsReadForRecipient(recipientId);
    res.json({ ok: true, recipientId, marked });
  } catch (e) {
    next(e);
  }
});

router.get("/user/notifications", async (req, res, next) => {
  try {
    const recipientId = recipientFromRequest(req);
    if (!recipientId) return res.status(400).json({ ok: false, error: "invalid_recipient" });
    const notifications = await readNotificationsForRecipient(recipientId);
    res.json({ ok: true, recipientId, notifications });
  } catch (e) {
    next(e);
  }
});

// GET /api/catalog — achievement + shop catalogs (static, lives in code).
router.get("/catalog", (_req, res) => {
  res.json({ achievements: ACHIEVEMENTS, shop: SHOP_ITEMS });
});

export default router;
