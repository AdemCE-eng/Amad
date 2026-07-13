import test from "node:test";
import assert from "node:assert/strict";
import { createPersonalizedOfferService, validateMlResponse } from "../src/services/personalizedOfferService.js";

const valid = {
  userId: "rashid", merchantId: "half_million", merchant: "Half Million", merchantNameAr: "هاف مليون",
  category: "coffee", offerProbability: .78, purchaseProbability: .82, personalizedScore: .24,
  windowDays: 3, estimatedSavingSar: 15, occasion: "اليوم الوطني السعودي",
  action: "wait_for_offer", explanation: "تحليل نموذجي تجريبي", reasons: ["سبب تجريبي"],
  disclaimer: "غير مضمون", dataLabel: "SYNTHETIC",
};

function response(payload, ok = true) {
  return { ok, async json() { return payload; } };
}

test("successful ML response is returned and only pseudonymous ID is transmitted", async () => {
  let request;
  const models = { offer: { name: "CatBoostClassifier" }, purchase: { name: "HistGradientBoostingClassifier" } };
  const service = createPersonalizedOfferService({ enabled: true, fetchImpl: async (...args) => { request = args; return response({ recommendations: [valid], models }); } });
  const result = await service("rashid");
  assert.equal(result.source, "ml-service");
  assert.equal(result.recommendations[0].merchantId, "half_million");
  assert.deepEqual(result.models, models);
  assert.match(request[0], /\/v1\/users\/rashid\/recommendations$/);
  assert.equal(request[1].method, "GET");
  assert.equal("body" in request[1], false);
  assert.doesNotMatch(JSON.stringify(request), /account|iban|description|name/i);
});
test("timeout falls back", async () => {
  const service = createPersonalizedOfferService({ enabled: true, timeoutMs: 50, fetchImpl: (_url, options) => new Promise((_resolve, reject) => options.signal.addEventListener("abort", () => reject(Object.assign(new Error("aborted"), { name: "AbortError" })))) });
  assert.equal((await service("rashid")).fallbackReason, "ml_timeout");
});

test("invalid response falls back", async () => {
  const service = createPersonalizedOfferService({ enabled: true, fetchImpl: async () => response({ recommendations: [{ merchantId: "broken" }] }) });
  assert.equal((await service("rashid")).fallbackReason, "ml_invalid_response");
});

test("service unavailable falls back", async () => {
  const service = createPersonalizedOfferService({ enabled: true, fetchImpl: async () => { throw new Error("offline"); } });
  assert.equal((await service("rashid")).fallbackReason, "ml_unavailable");
});

test("valid low-score response remains a live ML result", async () => {
  const service = createPersonalizedOfferService({ enabled: true, fetchImpl: async () => response({ recommendations: [{ ...valid, personalizedScore: .001 }] }) });
  const result = await service("rashid");
  assert.equal(result.source, "ml-service");
  assert.equal(result.fallbackReason, null);
  assert.equal(result.recommendations[0].personalizedScore, .001);
});

test("essential purchases are suppressed", () => {
  const recommendations = validateMlResponse({ recommendations: [{ ...valid, category: "pharmacy", isEssential: true }] });
  assert.deepEqual(recommendations, []);
});

test("ML disabled uses the labeled deterministic fallback", async () => {
  const result = await createPersonalizedOfferService({ enabled: false })("rashid");
  assert.equal(result.source, "deterministic-fallback");
  assert.equal(result.fallbackReason, "ml_disabled");
  assert.equal(result.recommendations[0].merchantNameAr, "هاف مليون");
  assert.equal(result.recommendations[0].offerProbability, .72);
  assert.equal(result.recommendations[0].estimatedSavingSar, 15);
  assert.equal(result.recommendations[0].windowDays, 3);
});

test("deterministic fallback is byte-stable across repeated calls", async () => {
  const service = createPersonalizedOfferService({ enabled: false });
  const results = await Promise.all([service("rashid"), service("rashid"), service("rashid")]);
  assert.deepEqual(results[0], results[1]);
  assert.deepEqual(results[1], results[2]);
});
