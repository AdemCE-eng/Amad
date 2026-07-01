// simulate.js — the endpoints the Cheat Controller drives.
// Every mutating route: read state → petEngine (math) → Gemini (message) →
// single Firebase write → return the new state.
import { Router } from "express";
import { db } from "../firebase.js";
import {
  applySalary,
  applyPurchase,
  applyEmergency,
  initialState,
} from "../logic/petEngine.js";
import { generatePetMessage } from "../ai/gemini.js";

const router = Router();

// ── Firebase helpers ─────────────────────────────────────
async function readState() {
  const snap = await db.ref("/").get();
  const val = snap.val() || {};
  // Fall back to a fresh state if the DB is empty (e.g. seed not run yet).
  const fresh = initialState();
  return {
    user: val.user || fresh.user,
    pet: val.pet || fresh.pet,
    emergencyShield: val.emergencyShield || fresh.emergencyShield,
    meta: val.meta || fresh.meta,
  };
}

// Persist the engine result, attach the AI message, and log a transaction.
async function commit(next, txn) {
  const message = await generatePetMessage(next._aiContext);
  const pet = { ...next.pet, message, updatedAt: Date.now() };

  const updates = {
    "/user": next.user,
    "/pet": pet,
    "/emergencyShield": next.emergencyShield,
    "/meta": next.meta,
  };
  await db.ref("/").update(updates);

  if (txn) await db.ref("/transactions").push({ ...txn, timestamp: Date.now() });

  return { user: next.user, pet, emergencyShield: next.emergencyShield, meta: next.meta };
}

// ── Routes ───────────────────────────────────────────────

// POST /api/simulate/salary  { amount }
router.post("/simulate/salary", async (req, res, next) => {
  try {
    const amount = Number(req.body.amount) || 8000;
    const state = await readState();
    const out = await commit(applySalary(state, amount), {
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

// POST /api/simulate/purchase  { amount, category, label }
router.post("/simulate/purchase", async (req, res, next) => {
  try {
    const amount = Number(req.body.amount) || 50;
    const { category = "coffee", label = "قهوة" } = req.body;
    const state = await readState();
    const out = await commit(applyPurchase(state, { amount, category, label }), {
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
    const out = await commit(applyEmergency(state, { amount, label }), {
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

// POST /api/reset  — Panic Reset: wipe everything back to a pristine demo state.
router.post("/reset", async (_req, res, next) => {
  try {
    const fresh = initialState();
    await db.ref("/").set({
      user: fresh.user,
      pet: fresh.pet,
      emergencyShield: fresh.emergencyShield,
      meta: { lastEvent: "reset" },
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
