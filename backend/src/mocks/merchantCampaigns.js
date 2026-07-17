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
  { merchant: "بارنز", occasion: "يوم التأسيس", year: 2024, discountPct: 12, category: "coffee" },
  { merchant: "بارنز", occasion: "يوم التأسيس", year: 2025, discountPct: 18, category: "coffee" },
  { merchant: "إكسترا", occasion: "العودة للمدارس", year: 2024, discountPct: 18, category: "electronics" },
  { merchant: "إكسترا", occasion: "العودة للمدارس", year: 2025, discountPct: 20, category: "electronics" },
  { merchant: "نون", occasion: "الجمعة البيضاء", year: 2024, discountPct: 20, category: "shopping" },
  { merchant: "نون", occasion: "الجمعة البيضاء", year: 2025, discountPct: 25, category: "shopping" },
  { merchant: "فوكس سينما", occasion: "إجازة عيد الفطر", year: 2024, discountPct: 15, category: "entertainment" },
  { merchant: "فوكس سينما", occasion: "إجازة عيد الفطر", year: 2025, discountPct: 20, category: "entertainment" },
];
