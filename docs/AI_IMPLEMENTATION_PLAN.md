# Personalized recommendation system

## Objective

Nadeem combines two reproducible tabular models over clearly labeled
**SYNTHETIC Saudi-market data**. The models calculate probabilities; the
application turns those outputs into transparent recommendation text.

## Offer Opportunity Agent

- **Selected model:** CatBoost
- **Unit:** merchant and observation date
- **Target:** whether a merchant campaign starts within the prediction window
- **Signals:** historical campaigns, seasonality, Saudi occasions,
  salary-period proximity, merchant category, campaign intervals, and prior
  discount behavior
- **Output:** probability of a near-term offer plus an estimated saving

## Purchase Behavior Agent

- **Selected model:** HistGradientBoosting
- **Unit:** pseudonymous user, merchant, and observation date
- **Target:** whether the user purchases from that merchant within seven days
- **Signals:** recency, frequency, spending, merchant and category affinity,
  purchase timing, interval consistency, seasonality, and salary periods
- **Output:** probability of near-term purchase

## Recommendation Coordinator

For non-essential merchants, the coordinator combines:

```text
offer probability × purchase probability × estimated saving × budget relevance
```

It then applies eligibility rules, essential-category suppression, and prior
user decisions. High offer probability alone is not enough, and the result is
always presented as probabilistic guidance rather than a guaranteed promotion.

## Model selection

The benchmark compared conventional tabular models with CatBoost and optional
neural candidates, including MLP and GRU experiments. Selection considered F1,
balanced accuracy, calibration, latency, artifact size, and training cost.
Neural models were not selected because they did not provide enough practical
improvement for this dataset and runtime.

Detailed methodology and results are documented in
[the model card](../ml-service/MODEL_CARD.md).

## Integration and fallback

- FastAPI exposes health, prediction, purchase-pattern, and recommendation
  endpoints.
- Express sends only a pseudonymous user identifier to the optional ML service.
- The adapter validates remote results before using them.
- If the ML service is disabled, unavailable, slow, or returns invalid data,
  Nadeem uses deterministic local recommendation logic.

## Reproducibility and safety

Data generation, training, and evaluation use a fixed seed. Generated datasets
and model binaries remain local and are ignored by Git. Evaluation scripts
write metrics and diagnostic artifacts rather than relying on hand-authored
results.

The current dataset is synthetic and does not represent real customer activity.
Production use would require consented data, governance, calibration monitoring,
drift detection, security review, and verified merchant campaign sources.
