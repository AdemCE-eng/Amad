// ⚠️ MOCK — merchant campaign history. Synthetic multi-year record used by
// offerEngine.js to "predict" recurring campaigns deterministically (no ML,
// no randomness — the prediction is a stable pattern-match over this table).

export const MOCK_SOURCE = "merchant-campaigns";

// Three consecutive years of the same seasonal pattern → basis for the
// deterministic "Half Million discounts every Saudi National Day" prediction.
export const MOCK_CAMPAIGN_HISTORY = [
  { merchant: "هاف مليون", occasion: "اليوم الوطني السعودي", year: 2023, discountPct: 20, category: "coffee" },
  { merchant: "هاف مليون", occasion: "اليوم الوطني السعودي", year: 2024, discountPct: 20, category: "coffee" },
  { merchant: "هاف مليون", occasion: "اليوم الوطني السعودي", year: 2025, discountPct: 25, category: "coffee" },
  { merchant: "جرير", occasion: "العودة للمدارس", year: 2024, discountPct: 15, category: "shopping" },
  { merchant: "جرير", occasion: "العودة للمدارس", year: 2025, discountPct: 15, category: "shopping" },
];
