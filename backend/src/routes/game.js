// game.js — gamification endpoints: the demo clock, challenge, shop, profile.
// Same pipeline as simulate.js: read state → engine → (AI) → single commit.
import { Router } from "express";
import { db } from "../firebase.js";
import { readState, commit } from "./simulate.js";
import {
  changeDate,
  advanceDay,
  completeChallenge,
  buyItem,
  equipItem,
  setProfile,
  applySimulateTrigger,
  applySettleQattah,
  SHOP_ITEMS,
  ACHIEVEMENTS,
} from "../logic/gameEngine.js";

const router = Router();

// POST /api/demo/advance-day — the demo clock. Resolves the streak for the
// day that just "ended" and starts a fresh one. A week plays out in seconds.
router.post("/demo/advance-day", async (_req, res, next) => {
  try {
    const state = await readState();
    const out = await commit(advanceDay(state));
    res.json({ ok: true, ...out });
  } catch (e) {
    next(e);
  }
});

// POST /api/demo/change-date — used for date calculations
router.post("/demo/change-date", async (req, res, next) => {
  try {
    const state = await readState();
    const out = await commit(changeDate(state, req.body.selectedDate));
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
            ? "عملاتك لا تكفي بعد — واصل الادخار والتحديات!"
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

// GET /api/catalog — achievement + shop catalogs (static, lives in code).
router.get("/catalog", (_req, res) => {
  res.json({ achievements: ACHIEVEMENTS, shop: SHOP_ITEMS });
});

// POST /api/game/simulate-trigger  { actionType, merchantName? }
// The Cheat Controller's 5 SRS pitch buttons: QATTAH_REQUEST, JAMEYA_DEPOSIT,
// SUKUK_PURCHASE, EARLY_LIQUIDATION, PREDICTIVE_OFFER (merchantName required).
// Every trigger logs a stylized mock bank-API payload so judges can inspect
// what a real integration would send.
router.post("/game/simulate-trigger", async (req, res, next) => {
  try {
    const { actionType, merchantName } = req.body;
    const state = await readState();
    const result = applySimulateTrigger(state, actionType, { merchantName });
    if (result.error) {
      const messages = {
        insufficient_savings: "تحتاج ١٠٠٠ ريال في مدخراتك لفتح بوابة الاستثمار.",
        merchant_not_found: "هذا التاجر غير موجود في تقويم العروض.",
        unknown_action: "إجراء غير معروف.",
      };
      return res.status(400).json({ ok: false, error: result.error, message: messages[result.error] });
    }
    console.log(`\n🏦 [MOCK BANK API] ${actionType}`);
    console.log(JSON.stringify(result._mockPayload, null, 2));
    const out = await commit(result);
    res.json({ ok: true, ...out });
  } catch (e) {
    next(e);
  }
});

// POST /api/game/settle-qattah — the debtor pays up: clears pending_qattah,
// deposits +50 NXP, logs the mock SARIE A2A payload.
router.post("/game/settle-qattah", async (_req, res, next) => {
  try {
    const state = await readState();
    const result = applySettleQattah(state);
    console.log(`\n🏦 [MOCK BANK API] SETTLE_QATTAH`);
    console.log(JSON.stringify(result._mockPayload, null, 2));
    const out = await commit(result);
    res.json({ ok: true, ...out });
  } catch (e) {
    next(e);
  }
});

export default router;
