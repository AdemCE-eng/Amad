// offerEngine.js — predicted saving opportunities. Pure functions, zero I/O.
// Owns ONLY /offers and /loyalty state.
//
// DETERMINISM RULE: no Math.random(), ever. Predictions derive from the MOCK
// campaign-history table by a plain pattern rule (same merchant + occasion in
// ≥2 consecutive years ⇒ predicted to repeat). The demo returns the exact
// same offers on every run.
//
// Currencies (never conflate):
//   NXP          = virtual game points, stored at game.nxp_balance (gameEngine
//                  owns it; /loyalty exposes it read-only for the UI).
//   Akthr points = MOCK campaign-funded loyalty rewards, stored at
//                  /loyalty/akthrPoints (this engine owns it).

import { MOCK_CAMPAIGN_HISTORY } from "../mocks/merchantCampaigns.js";
import { MOCK_AKTHR_STARTING_BALANCE } from "../mocks/akthrPoints.js";

const DAY_MS = 86_400_000;

// Deterministic ASCII id from any (Arabic) key — stable across runs, safe in
// URLs, JSON bodies, and Firebase paths.
function slugId(key) {
  let h = 0;
  for (const ch of key) h = (h * 31 + ch.codePointAt(0)) >>> 0;
  return "offer_" + h.toString(36);
}

// ── Initial state ────────────────────────────────────────

export function initialLoyaltyState() {
  // nxp intentionally NOT stored here — game.nxp_balance is the single source
  // of truth; routes surface it as `nxp` in responses. Storing a copy would
  // create silent drift.
  return { akthrPoints: MOCK_AKTHR_STARTING_BALANCE };
}

export function initialOffersState(now = Date.now()) {
  return {
    predicted: buildPredictedOffers(now),
    history: MOCK_CAMPAIGN_HISTORY,
    decisions: {},
  };
}

// ── Deterministic prediction ─────────────────────────────

// Pattern rule: a merchant+occasion pair appearing in ≥2 consecutive years is
// predicted to repeat. Probability is a fixed function of streak length
// (2 years → 65%, 3+ → 78%) — stable, explainable, zero randomness.
export function buildPredictedOffers(now = Date.now()) {
  const groups = {};
  for (const c of MOCK_CAMPAIGN_HISTORY) {
    const key = `${c.merchant}|${c.occasion}`;
    (groups[key] ||= []).push(c);
  }

  const offers = {};
  for (const [key, campaigns] of Object.entries(groups)) {
    if (campaigns.length < 2) continue;
    const latest = campaigns[campaigns.length - 1];
    const probability = campaigns.length >= 3 ? 78 : 65;
    // ASCII id — Arabic keys break in URL/JSON transport and as RTDB paths.
    const id = slugId(key);
    offers[id] = {
      id,
      merchant: latest.merchant,
      occasion: latest.occasion,
      category: latest.category,
      probability, // %
      windowDays: 3,
      // Demo scenario figure: waiting for the predicted هاف مليون National-Day
      // campaign instead of buying now saves 15 SAR on the planned purchase.
      potentialSaving: latest.category === "coffee" ? 15 : 45,
      basis: `تكرر ${campaigns.length} سنوات متتالية (${campaigns.map((c) => c.year).join("، ")})`,
      source: "MOCK merchant-campaigns",
      expiresAt: now + 3 * DAY_MS,
      status: "pending",
    };
  }
  return offers;
}

// ── Decisions ────────────────────────────────────────────

// decision: "wait" (follow the prediction) | "ignore".
export function decideOffer(offers, { offerId, decision }) {
  const offer = offers.predicted?.[offerId];
  if (!offer) return { error: "unknown_offer" };
  if (offers.decisions?.[offerId]) return { error: "already_decided" };
  if (decision !== "wait" && decision !== "ignore") return { error: "invalid_decision" };

  return {
    offers: {
      ...offers,
      predicted: { ...offers.predicted, [offerId]: { ...offer, status: decision === "wait" ? "waiting" : "ignored" } },
      decisions: { ...(offers.decisions || {}), [offerId]: { decision, at: Date.now() } },
    },
    offer,
  };
}

// Settle a waited offer: the predicted campaign "arrived", the member bought
// at the discount, and the delta becomes a family-goal contribution.
// Idempotent by construction: a settled offer is no longer "waiting", so a
// second settle returns not_waiting and nothing is duplicated.
// Akthr is NOT touched here — parent rewards are a separate explicit action
// (POST /api/family/reward), never an automatic side effect of settlement.
export function settleOffer(offers, { offerId }) {
  const offer = offers.predicted?.[offerId];
  if (!offer) return { error: "unknown_offer" };
  if (offer.status !== "waiting") return { error: "not_waiting" };

  const nextOffers = {
    ...offers,
    predicted: { ...offers.predicted, [offerId]: { ...offer, status: "settled", settledAt: Date.now() } },
  };

  return {
    offers: nextOffers,
    outcome: {
      saving: offer.potentialSaving, // → family goal contribution
      nxpReward: 10, // → game.nxp_balance (the authoritative NXP field)
      merchant: offer.merchant,
      occasion: offer.occasion,
    },
  };
}
