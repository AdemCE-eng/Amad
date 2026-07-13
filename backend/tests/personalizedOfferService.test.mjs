import test from "node:test";
import assert from "node:assert/strict";
import { createPersonalizedOfferService, validateMlResponse } from "../src/services/personalizedOfferService.js";

const valid = {
  userId: "rashid", merchantId: "half_million", merchant: "Half Million", merchantNameAr: "هاف مليون",
  category: "coffee", offerProbability: .78, purchaseProbability: .82, personalizedScore: .24,
  windowDays: 7, estimatedSavingSar: 15, occasion: "اليوم الوطني السعودي", reasons: ["سبب تجريبي"],
  disclaimer: "غير مضمون", dataLabel: "SYNTHETIC",
};

function response(payload, ok = true) {
  return { ok, async json() { return payload; } };
}

test("successful ML response is returned and only pseudonymous ID is transmitted", async () => {
  let request;
  const service = createPersonalizedOfferService({ enabled: true, fetchImpl: async (...args) => { request = args; return response({ recommendations: [valid] }); } });
  const result = await service("rashid");
  assert.equal(result.source, "ml-service");
  assert.equal(result.recommendations[0].merchantId, "half_million");
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
  assert.equal((await service("rashid")).fallbackReason, "invalid_or_low_score_ml_response");
});

test("service unavailable falls back", async () => {
  const service = createPersonalizedOfferService({ enabled: true, fetchImpl: async () => { throw new Error("offline"); } });
  assert.equal((await service("rashid")).fallbackReason, "ml_unavailable");
});

test("low-score response falls back", async () => {
  const service = createPersonalizedOfferService({ enabled: true, minimumScore: .2, fetchImpl: async () => response({ recommendations: [{ ...valid, personalizedScore: .1 }] }) });
  assert.equal((await service("rashid")).fallbackReason, "invalid_or_low_score_ml_response");
});

test("essential purchases are suppressed", () => {
  const recommendations = validateMlResponse({ recommendations: [{ ...valid, category: "pharmacy", isEssential: true }] });
  assert.equal(recommendations, null);
});

