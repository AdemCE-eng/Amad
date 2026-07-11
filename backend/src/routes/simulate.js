// simulate.js — the endpoints the Cheat Controller drives.
// Every mutating route: read state → petEngine (math) → Gemini (message) →
// single Firebase write → return the new state.
import { Router } from "express";
import { db } from "../firebase.js";
import {
  applySalary,
  applyInstantSave,
  applyPurchase,
  applyEmergency,
  initialState,
  hasSufficientFunds,
} from "../logic/petEngine.js";
import { applyGameEffects } from "../logic/gameEngine.js";
import { generatePetMessage } from "../ai/gemini.js";

const router = Router();

// ── Firebase helpers ─────────────────────────────────────
export async function readState() {
  const snap = await db.ref("/").get();
  const val = snap.val() || {};
  // Fall back to a fresh state if the DB is empty (e.g. seed not run yet).
  const fresh = initialState();
  return {
    user: val.user || fresh.user,
    pet: val.pet || fresh.pet,
    emergencyShield: val.emergencyShield || fresh.emergencyShield,
    game: val.game || fresh.game,
    meta: val.meta || fresh.meta,
  };
}

// Gamification layer: streaks/coins/achievements/stage react to the same
// event the health engine just processed.
function withGame(next) {
  const ctx = next._aiContext || {};
  return applyGameEffects(next, {
    event: ctx.event,
    amount: ctx.amount,
    savedPortion: ctx.savedPortion,
    category: ctx.txnCategory || ctx.category,
    overBudget: ctx.overBudget,
    shielded: ctx.event === "emergency", // unshielded emergencies arrive as `purchase`
  });
}

// Persist the engine result, attach the AI message, and log a transaction.
export async function commit(next, txn) {
  const { text: message, source: aiSource } = await generatePetMessage(next._aiContext);
  const pet = { ...next.pet, message, updatedAt: Date.now() };

  const updates = {
    "/user": next.user,
    "/pet": pet,
    "/emergencyShield": next.emergencyShield,
    "/meta": next.meta,
  };
  if (next.game) updates["/game"] = next.game;
  await db.ref("/").update(updates);

  if (txn) await db.ref("/transactions").push({ ...txn, timestamp: Date.now() });

  // aiSource is NOT stored in Firebase (the frontend never needs it) — it's
  // only surfaced in the HTTP response so the Cheat Controller can show
  // whether the message just came from a real Gemini call or a fallback.
  return { user: next.user, pet, emergencyShield: next.emergencyShield, game: next.game, meta: next.meta, aiSource };
}

function insufficientFunds(res, state) {
  res.status(400).json({
    ok: false,
    error: "insufficient_funds",
    message: "الرصيد غير كافٍ لإتمام هذه العملية.",
    user: state.user,
  });
}

// ── Routes ───────────────────────────────────────────────

// POST /api/simulate/salary  { amount, savePercent }
// savePercent (0-100) is optional — how much of the deposit auto-routes to
// Instant Savings. Defaults to the engine's standard rate (20%) if omitted.
router.post("/simulate/salary", async (req, res, next) => {
  try {
    const amount = Number(req.body.amount) || 8000;
    const savePercent = Number(req.body.savePercent);
    const saveRate = Number.isFinite(savePercent) ? savePercent / 100 : undefined;
    const state = await readState();
    const out = await commit(withGame(applySalary(state, amount, saveRate)), {
      type: "salary",
      amount,
      category: "income",
      label: "إيداع راتب",
    });
    res.json({ ok: true, ...out });
  } catch (e) {
    next(e);
  }
});

// POST /api/simulate/save  { amount }  — manual Instant Savings top-up
router.post("/simulate/save", async (req, res, next) => {
  try {
    const amount = Number(req.body.amount) || 300;
    const state = await readState();
    if (!hasSufficientFunds(state, amount)) return insufficientFunds(res, state);
    const out = await commit(withGame(applyInstantSave(state, amount)), {
      type: "save",
      amount,
      category: "savings",
      label: "إيداع في المدخرات الفورية",
    });
    res.json({ ok: true, ...out });
  } catch (e) {
    next(e);
  }
});

// POST /api/simulate/purchase  { amount, category, label }
router.post("/simulate/purchase", async (req, res, next) => {
  try {
    const amount = Number(req.body.amount) || 50;
    const { category = "coffee", label = "قهوة" } = req.body;
    const state = await readState();
    if (!hasSufficientFunds(state, amount)) return insufficientFunds(res, state);
    const out = await commit(withGame(applyPurchase(state, { amount, category, label })), {
      type: "purchase",
      amount,
      category,
      label,
    });
    res.json({ ok: true, ...out });
  } catch (e) {
    next(e);
  }
});

// POST /api/simulate/emergency  { amount, label }
router.post("/simulate/emergency", async (req, res, next) => {
  try {
    const amount = Number(req.body.amount) || 1500;
    const { label = "سحب طارئ" } = req.body;
    const state = await readState();
    if (!hasSufficientFunds(state, amount)) return insufficientFunds(res, state);
    const out = await commit(withGame(applyEmergency(state, { amount, label })), {
      type: "emergency",
      amount,
      category: "emergency",
      label,
    });
    res.json({ ok: true, ...out });
  } catch (e) {
    next(e);
  }
});

// POST /api/user/goal  { goalAmount }  — settings change, not a financial
// event: no health/mood/AI reaction, just updates the target the pet's
// healing math is relative to.
router.post("/user/goal", async (req, res, next) => {
  try {
    const goalAmount = Math.round(Number(req.body.goalAmount));
    if (!Number.isFinite(goalAmount) || goalAmount <= 0) {
      return res.status(400).json({
        ok: false,
        error: "invalid_goal",
        message: "قيمة الهدف يجب أن تكون رقماً أكبر من صفر.",
      });
    }
    const state = await readState();
    const user = { ...state.user, goalAmount };
    await db.ref("/user/goalAmount").set(goalAmount);
    res.json({ ok: true, user, pet: state.pet, emergencyShield: state.emergencyShield });
  } catch (e) {
    next(e);
  }
});

// POST /api/reset  — Panic Reset: wipe everything back to a pristine demo state.
router.post("/reset", async (_req, res, next) => {
  try {
    const fresh = initialState();
    await db.ref("/").set({
      user: fresh.user,
      pet: fresh.pet,
      emergencyShield: fresh.emergencyShield,
      game: fresh.game,
      meta: { ...fresh.meta, lastEvent: "reset" },
      transactions: null,
    });
    res.json({ ok: true, message: "Demo reset.", ...fresh });
  } catch (e) {
    next(e);
  }
});

// GET /api/state  — debug snapshot.
router.get("/state", async (_req, res, next) => {
  try {
    res.json(await readState());
  } catch (e) {
    next(e);
  }
});

export default router;
