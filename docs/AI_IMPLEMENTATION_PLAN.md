# Personalized promotion prediction implementation plan

## Goals

Build two reproducible tabular classifiers over clearly marked **MOCK / SYNTHETIC DEMO DATA — SAUDI MARKET**, then combine their probabilities in an explainable recommendation orchestrator. Probabilities come only from scikit-learn models; text is templated explanation of model inputs and outputs.

## Model A: seasonal offer prediction

- Unit: merchant-date observation.
- Target: campaign starts within the configured future window.
- Inputs: category, city, occasion, calendar position, days to occasion, recent campaign counts, historic same-season count, interval and discount history, duration, salary-day proximity, and Saudi seasonal indicators.
- Model: `HistGradientBoostingClassifier` behind a `ColumnTransformer` with one-hot categorical encoding.
- Split: chronological; the newest period is held out.
- Output: calibrated-looking model probability (without claiming formal calibration), thresholded confidence, saving estimate, and feature-based reasons.

## Model B: user purchase behavior

- Unit: pseudonymous user/merchant/date observation.
- Target: purchase from that merchant in the next seven days.
- Inputs: recency, 7/30/90-day frequency, average spend, merchant/category spend shares, weekday/time preference, interval consistency, RFM values, seasonal and salary-day behavior, and city.
- Model: `RandomForestClassifier` behind the same explicit categorical/numeric preprocessing pattern. A transparent RFM layer contributes features but is not presented as the model.
- Split: chronological to prevent future transaction leakage.
- Ranking metrics include Precision@3 and HitRate@3.

## Recommendation orchestration

For non-essential merchants only:

`score = normalizedSaving × offerProbability × purchaseProbability7d × budgetRelevance`

Recommendations must pass the offer and personalized-score thresholds, have meaningful expected savings, and not be accepted/dismissed. Ranking is deterministic. High offer probability alone and high affinity alone are both insufficient.

## Integration

- FastAPI exposes health, offer prediction, purchase patterns, recommendations, and development-only retraining.
- Express adds only `/api/ml/recommendations` and an adapter controlled by `USE_ML_SERVICE`, `ML_SERVICE_URL`, and `ML_SERVICE_TIMEOUT_MS`.
- The adapter sends only a pseudonymous user ID and validates all remote data. Every failure mode gracefully falls back to existing deterministic output.

## Evaluation and artifacts

Data generation, training, and evaluation use a fixed seed. Metrics, confusion matrices, feature importance, and recommendation examples are written by scripts, never hand-authored. All results carry the Arabic synthetic-data limitation label. Tests assert time-safe features, actual fitted estimators, deterministic ranking, affinity/offer counterexamples, essential suppression, API behavior, and adapter privacy/fallback behavior.

## Visual outputs

`visual-design/` is an offline RTL component laboratory; `ml-results-showcase/` is a separate offline results dashboard. Both consume generated artifacts. A sync script generates `generated-results.js`; Playwright captures canonical 1920×1080 PNGs. Neither folder is linked from the production frontend.
