import { buildPredictedOffers } from "../logic/offerEngine.js";

const ESSENTIAL_CATEGORIES = new Set(["pharmacy", "grocery", "medicine", "emergency_transport", "mandatory_bill", "health"]);
const USER_ID_PATTERN = /^[a-z0-9_-]{1,64}$/i;
const CANONICAL_FALLBACK_MERCHANT = "هاف مليون";
const CANONICAL_FALLBACK_PROBABILITY = 0.72;

function deterministicFallback(userId, reason, now = Date.now()) {
  const recommendations = Object.values(buildPredictedOffers(now))
    .filter((offer) => !ESSENTIAL_CATEGORIES.has(offer.category))
    .sort((a, b) => b.probability - a.probability || a.id.localeCompare(b.id))
    .slice(0, 3)
    .map((offer) => ({
      userId,
      merchantId: offer.id,
      merchant: offer.merchant,
      merchantNameAr: offer.merchant,
      category: offer.category,
      offerProbability: offer.merchant === CANONICAL_FALLBACK_MERCHANT
        ? CANONICAL_FALLBACK_PROBABILITY
        : offer.probability / 100,
      purchaseProbability: null,
      personalizedScore: null,
      windowDays: offer.windowDays,
      estimatedSavingSar: offer.potentialSaving,
      occasion: offer.occasion,
      action: "wait_for_offer",
      explanation: offer.basis,
      reasons: [offer.basis],
      disclaimer: "توقع تجريبي غير مضمون — تعذر استخدام نموذج التخصيص، فعُرض مسار نامو الثابت.",
      dataLabel: "MOCK deterministic merchant-campaigns",
    }));
  return { ok: true, userId, recommendations, source: "deterministic-fallback", fallbackReason: reason, models: null };
}

function validRecommendation(value) {
  return value && typeof value === "object"
    && typeof value.merchantId === "string"
    && typeof value.merchant === "string"
    && typeof value.merchantNameAr === "string"
    && Number.isFinite(value.offerProbability) && value.offerProbability >= 0 && value.offerProbability <= 1
    && Number.isFinite(value.purchaseProbability) && value.purchaseProbability >= 0 && value.purchaseProbability <= 1
    && Number.isFinite(value.personalizedScore) && value.personalizedScore >= 0 && value.personalizedScore <= 1
    && Number.isInteger(value.windowDays) && value.windowDays > 0
    && Number.isFinite(value.estimatedSavingSar) && value.estimatedSavingSar >= 0
    && typeof value.occasion === "string"
    && typeof value.action === "string"
    && typeof value.explanation === "string"
    && Array.isArray(value.reasons)
    && typeof value.category === "string";
}

export function validateMlResponse(payload) {
  if (!payload || typeof payload !== "object" || !Array.isArray(payload.recommendations)) return null;
  if (!payload.recommendations.every(validRecommendation)) return null;
  return payload.recommendations
    .filter((item) => !item.isEssential && !ESSENTIAL_CATEGORIES.has(item.category))
    .sort((a, b) => b.personalizedScore - a.personalizedScore || a.merchantId.localeCompare(b.merchantId));
}

export function createPersonalizedOfferService({
  enabled = process.env.USE_ML_SERVICE === "true",
  baseUrl = process.env.ML_SERVICE_URL || "http://127.0.0.1:8001",
  timeoutMs = Number(process.env.ML_SERVICE_TIMEOUT_MS || 3000),
  fetchImpl = globalThis.fetch,
  fallback = deterministicFallback,
} = {}) {
  return async function getRecommendations(userId = "rashid") {
    if (!USER_ID_PATTERN.test(userId)) return fallback("rashid", "invalid_pseudonymous_user_id");
    if (!enabled) return fallback(userId, "ml_disabled");

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), Math.max(50, timeoutMs));
    try {
      // Data minimization: the request contains only the pseudonymous ID in the path.
      const response = await fetchImpl(`${baseUrl.replace(/\/$/, "")}/v1/users/${encodeURIComponent(userId)}/recommendations`, {
        method: "GET",
        headers: { Accept: "application/json" },
        signal: controller.signal,
      });
      if (!response.ok) return fallback(userId, "ml_unavailable");
      let payload;
      try {
        payload = await response.json();
      } catch {
        return fallback(userId, "ml_invalid_response");
      }
      const recommendations = validateMlResponse(payload);
      if (recommendations === null) return fallback(userId, "ml_invalid_response");
      return {
        ok: true,
        userId,
        recommendations,
        source: "ml-service",
        fallbackReason: null,
        models: payload.models || null,
        fixture: payload.fixture || null,
      };
    } catch (error) {
      return fallback(userId, error?.name === "AbortError" ? "ml_timeout" : "ml_unavailable");
    } finally {
      clearTimeout(timer);
    }
  };
}

export const getPersonalizedRecommendations = createPersonalizedOfferService();
