// offers.js — predicted saving opportunities (MOCK-driven, deterministic).
// Settlement closes the saving loop ONLY:
//   offer → settled, family goal +saving, NXP (game.coins) +10, pet cheer,
//   transaction logged — all in ONE atomic multi-location root update.
// Parent rewards / Akthr / notifications are a separate explicit action:
// POST /api/family/reward.
import { Router } from "express";
import { db } from "../firebase.js";
import { readState } from "./simulate.js";
import { readFamilyNodes } from "./family.js";
import { initialOffersState, decideOffer, settleOffer } from "../logic/offerEngine.js";
import { applyFamilyContribution, familyProgressPct } from "../logic/familyEngine.js";
import { applyCheer } from "../logic/petEngine.js";
import { generatePetMessage } from "../ai/gemini.js";

const router = Router();

async function readOffers() {
  const snap = await db.ref("/offers").get();
  return snap.val() || initialOffersState();
}

// GET /api/offers/predicted — deterministic list (same result every run).
router.get("/offers/predicted", async (_req, res, next) => {
  try {
    const offers = await readOffers();
    res.json({ ok: true, predicted: offers.predicted, source: "MOCK merchant-campaigns", history: offers.history });
  } catch (e) {
    next(e);
  }
});

// POST /api/offers/decide  { offerId, decision: "wait" | "ignore" }
// Decision only — no balance moves until settlement.
router.post("/offers/decide", async (req, res, next) => {
  try {
    const offers = await readOffers();
    const result = decideOffer(offers, { offerId: req.body.offerId, decision: req.body.decision });
    if (result.error) return res.status(400).json({ ok: false, error: result.error });
    await db.ref("/offers").set(result.offers);
    res.json({ ok: true, offer: result.offers.predicted[req.body.offerId], decisions: result.offers.decisions });
  } catch (e) {
    next(e);
  }
});

// POST /api/offers/settle  { offerId, memberId? }
// Idempotent: a settled offer is no longer "waiting" → second call = 400
// not_waiting, nothing duplicated. All state computed in memory first, then
// persisted in a single multi-location update (atomic in RTDB).
router.post("/offers/settle", async (req, res, next) => {
  try {
    const memberId = req.body.memberId || "adam";
    const offers = await readOffers();
    const { family } = await readFamilyNodes();

    const settled = settleOffer(offers, { offerId: req.body.offerId });
    if (settled.error) return res.status(400).json({ ok: false, error: settled.error });
    const { outcome } = settled;

    const contributed = applyFamilyContribution(family, {
      memberId,
      amount: outcome.saving,
      source: "offer-saving",
    });
    if (contributed.error) return res.status(400).json({ ok: false, error: contributed.error });

    // Pet cheers (health/mood/message); NXP through the authoritative
    // game.coins field. Evolution stage untouched — it derives from PERSONAL
    // savings only, and /user is not modified here.
    let state = await readState();
    state = applyCheer(state, {
      healthDelta: 6,
      event: "family_goal",
      extra: { saving: outcome.saving, merchant: outcome.merchant },
    });
    const game = { ...state.game, coins: (state.game.coins ?? 0) + outcome.nxpReward };
    const { text: message } = await generatePetMessage(state._aiContext);
    const pet = { ...state.pet, message, updatedAt: Date.now() };

    const txnKey = db.ref("/transactions").push().key;
    await db.ref("/").update({
      "/offers": settled.offers,
      "/family": contributed.family,
      "/pet": pet,
      "/game": game,
      "/meta": { lastEvent: "offer-settled" },
      [`/transactions/${txnKey}`]: {
        type: "save",
        amount: outcome.saving,
        category: "family-goal",
        label: `توفير ذكي — ${outcome.merchant}`,
        timestamp: Date.now(),
      },
    });

    res.json({
      ok: true,
      outcome,
      family: contributed.family,
      progressPct: familyProgressPct(contributed.family),
      loyalty: { nxp: game.coins }, // Akthr untouched by settlement
      pet,
      game,
    });
  } catch (e) {
    next(e);
  }
});

export default router;
