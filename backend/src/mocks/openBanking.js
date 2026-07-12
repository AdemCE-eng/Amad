// ⚠️ MOCK — Open Banking data. No real bank connection; static demo profiles
// shaped like an account-aggregation response. Feeds the Explainable Saving
// Capacity Engine in familyEngine.js.
//
// Every figure is synthetic and deterministic — the demo must show the same
// numbers on every run.

export const MOCK_SOURCE = "open-banking";

// Monthly financial profile per family member (SAR).
// Tuned so the Capacity Engine (20% safe-saving rate) naturally yields the
// approved demo allocations 700/400/100 for a 1200 SAR monthly requirement:
//   Ahmed: surplus 3500 → capacity 700
//   Sarah: surplus 2000 → capacity 400
//   Rashid: surplus 500 → capacity 100
export const MOCK_FINANCIAL_PROFILES = {
  ahmed: {
    memberId: "ahmed",
    income: 18000,
    fixedExpenses: 8000, // rent, car, subscriptions
    essentialExpenses: 4500, // groceries, fuel, school
    safetyBuffer: 2000,
  },
  sarah: {
    memberId: "sarah",
    income: 12000,
    fixedExpenses: 5500,
    essentialExpenses: 3000,
    safetyBuffer: 1500,
  },
  rashid: {
    memberId: "rashid",
    income: 800, // allowance
    fixedExpenses: 0,
    essentialExpenses: 200,
    safetyBuffer: 100,
  },
};
