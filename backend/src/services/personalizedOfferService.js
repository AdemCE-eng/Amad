import { FROZEN_RECOMMENDATION_OUTPUTS } from "../mocks/frozenRecommendationOutputs.js";

const ESSENTIAL_CATEGORIES = new Set(["pharmacy", "grocery", "medicine", "emergency_transport", "mandatory_bill", "health"]);
const USER_ID_PATTERN = /^[a-z0-9_-]{1,64}$/i;
function deterministicFallback(userId, reason) {
  const recommendations = FROZEN_RECOMMENDATION_OUTPUTS
    .map((item) => ({ ...item, userId }))
    .sort((a, b) => Number(Boolean(b.eligible)) - Number(Boolean(a.eligible))
      || b.personalizedScore - a.personalizedScore
      || a.merchantId.localeCompare(b.merchantId));

  return {
    ok: true,
    userId,
    recommendations,
    source: "deterministic-fallback",
    fallbackReason: reason,
    models: null,
    fixture: { id: "evaluated-recommendations-v1", userId: "rashid" },
  };
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
    .sort((a, b) => Number(Boolean(b.eligible)) - Number(Boolean(a.eligible))
      || b.personalizedScore - a.personalizedScore
      || a.merchantId.localeCompare(b.merchantId));
}

// Safe operator-facing status derived from the same service result used by
// the application. It deliberately excludes recommendations and exceptions:
// the Cheat Controller only needs availability, selected models, and the
// labeled fallback reason.
export function recommendationEngineStatus(result) {
  const online = result?.source === "ml-service";
  return {
    ok: true,
    engine: "recommendation",
    state: online ? "online" : "fallback",
    source: typeof result?.source === "string" ? result.source : "deterministic-fallback",
    fallbackReason: online ? null : (result?.fallbackReason || "ml_unavailable"),
    models: online ? (result?.models || null) : null,
  };
}

export function createPersonalizedOfferService({
  enabled = process.env.USE_ML_SERVICE === "true",
  baseUrl = process.env.ML_SERVICE_URL || "http://127.0.0.1:8001",
  timeoutMs = Number(process.env.ML_SERVICE_TIMEOUT_MS || 10000),
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
      const response = await fetchImpl(`${baseUrl.replace(/\/$/, "")}/v1/users/${encodeURIComponent(userId)}/recommendations?includeSuppressed=true`, {
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
