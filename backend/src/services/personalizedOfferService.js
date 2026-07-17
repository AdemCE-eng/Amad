import { buildPredictedOffers } from "../logic/offerEngine.js";

const ESSENTIAL_CATEGORIES = new Set(["pharmacy", "grocery", "medicine", "emergency_transport", "mandatory_bill", "health"]);
const USER_ID_PATTERN = /^[a-z0-9_-]{1,64}$/i;
// Frozen, intentionally distinct offline outputs. These are used only when
// the ML service is unavailable; the live-service path returns model values.
const FROZEN_FALLBACK_OUTPUTS = Object.freeze({
  "هاف مليون": {
    offerProbability: 0.72,
    purchaseProbability: 0.827,
    estimatedSavingSar: 15,
    windowDays: 3,
    explanation: "تكررت حملة اليوم الوطني 3 سنوات، مع ارتفاع الخصم من 20% إلى 25%",
  },
  "نون": {
    offerProbability: 0.70,
    purchaseProbability: 0.7412,
    estimatedSavingSar: 70,
    windowDays: 4,
    explanation: "تكررت عروض الجمعة البيضاء وارتفع الخصم من 20% إلى 25%",
  },
  "بارنز": {
    offerProbability: 0.52,
    purchaseProbability: 0.574,
    estimatedSavingSar: 20,
    windowDays: 8,
    explanation: "تكررت عروض يوم التأسيس موسمين وارتفع الخصم من 12% إلى 18%",
  },
  "إكسترا": {
    offerProbability: 0.61,
    purchaseProbability: 0.6924,
    estimatedSavingSar: 95,
    windowDays: 7,
    explanation: "عادت عروض الإلكترونيات للمدارس وارتفع الخصم من 18% إلى 20%",
  },
  "فوكس سينما": {
    offerProbability: 0.58,
    purchaseProbability: 0.6187,
    estimatedSavingSar: 25,
    windowDays: 6,
    explanation: "تكررت عروض إجازة عيد الفطر وارتفع الخصم من 15% إلى 20%",
  },
});

function deterministicFallback(userId, reason, now = Date.now()) {
  const recommendations = Object.values(buildPredictedOffers(now))
    .filter((offer) => !ESSENTIAL_CATEGORIES.has(offer.category))
    .filter((offer) => Boolean(FROZEN_FALLBACK_OUTPUTS[offer.merchant]))
    .map((offer) => {
      const frozen = FROZEN_FALLBACK_OUTPUTS[offer.merchant];
      return {
        userId,
        merchantId: offer.id,
        merchant: offer.merchant,
        merchantNameAr: offer.merchant,
        category: offer.category,
        offerProbability: frozen.offerProbability,
        purchaseProbability: frozen.purchaseProbability,
        personalizedScore: null,
        windowDays: frozen.windowDays,
        estimatedSavingSar: frozen.estimatedSavingSar,
        occasion: offer.occasion,
        action: "wait_for_offer",
        explanation: frozen.explanation,
        reasons: [frozen.explanation],
        disclaimer: "توقع تجريبي غير مضمون، تعذر استخدام نموذج التخصيص، فعُرض مسار نديم الثابت.",
        dataLabel: "MOCK / SYNTHETIC DEMO DATA · SAUDI MARKET · deterministic fallback",
      };
    })
    .sort((a, b) => b.offerProbability - a.offerProbability || a.merchantId.localeCompare(b.merchantId))
    .slice(0, 5);
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
