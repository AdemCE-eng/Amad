# Namo personalized promotion models — model card

## Intended use

These models demonstrate explainable personalized promotion ranking for the Saudi market. Engine A estimates whether a synthetic merchant campaign begins in a seven-day window. Engine B estimates whether a pseudonymous demo user purchases from a merchant in the next seven days. The orchestrator requires both signals and suppresses essential purchases.

## Data

All records are **MOCK / SYNTHETIC DEMO DATA — SAUDI MARKET**. Merchant names establish local applicability only; no generated campaign is a factual claim. The generator uses a fixed seed and probabilistic overlapping user and merchant behavior. It contains no account numbers, IBANs, cards, raw banking descriptions, exact locations, or real personal transactions.

## Evaluation protocol

Dates are split chronologically into oldest 70% training, following 15% validation, and newest 15% untouched final test. Model family, hyperparameters, probability calibration, and decision threshold are chosen using validation only. Rolling features read events strictly before the prediction timestamp. Final metrics are written automatically by `scripts.evaluate_models`.

## Limitations

- Reported results use synthetic Saudi-market data and are not production customer performance.
- Higher synthetic metrics do not guarantee real-world accuracy.
- The offer generator deliberately includes stochastic campaign decisions, limiting attainable discrimination.
- Real deployment requires verified historical campaign data and consented behavioral features.
- Production requires monitoring, drift detection, recalibration, threshold governance, access control, and retraining approval.
- A predicted campaign is probabilistic and never guaranteed.

## Safety and privacy

Essential grocery, pharmacy, medicine, health, emergency transport, and mandatory-bill categories cannot receive delay advice. The Node adapter sends only a pseudonymous user ID. An LLM may explain a prediction but cannot calculate its probability.

## Deep Learning Benchmark

### Purpose and frozen protocol

Deep learning was tested to determine whether categorical embeddings or recent transaction order add measurable value beyond strong tabular classifiers. Deep learning is not automatically better, and model complexity was not treated as a benefit by itself.

The benchmark used the existing `synthetic-saudi-v2` CSV files without changing generation logic, candidate rows, labels, or feature cutoffs. SHA-256 manifests freeze 20 merchants, 220 fictional users, 2,047 campaigns, 95,063 transactions, 4,920 offer candidates, and 191,830 purchase candidates. Every family used the same chronological 70% training, 15% validation, and 15% untouched-test partitions. Encoders, scalers, vocabularies, and sequence histories were fitted from training data only; a transaction had to occur strictly before its prediction timestamp.

Validation alone controlled early stopping, hyperparameters, family selection, probability calibration, and thresholds. Each validation-selected family finalist was evaluated once on the frozen test partition. The final test was not used to make model-selection decisions.

### Models evaluated

Both engines included the current baseline, Logistic Regression, Random Forest, Extra Trees, Histogram Gradient Boosting, Gradient Boosting, and CatBoost. The neural benchmark added an Embedding MLP to each engine. The purchase benchmark also added a one-layer GRU over up to 30 strictly prior transactions, joined with candidate and engineered behavioral features. All neural models used CPU PyTorch, deterministic settings where practical, gradient clipping, scheduling, early stopping, and best-checkpoint restoration.

Nineteen bounded configurations were recorded: ten existing scikit-learn configurations, four CatBoost configurations, four Embedding MLP configurations, and one GRU configuration.

### Final selection and untouched-test results

| Engine | Finalist | F1 | Balanced accuracy | Precision | Recall | ROC-AUC | Brier | Mean single inference | Artifact size | Training time |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Offer | RandomForest baseline | 0.6149 | 0.5876 | 0.4778 | 0.8622 | 0.6643 | 0.224972 | 46.7991 ms | 19,371,722 B | 0.509 s |
| Offer | **CatBoost selected** | **0.6215** | **0.5877** | 0.4754 | 0.8974 | 0.6711 | **0.222888** | 1.3953 ms | 70,504 B | 3.107 s |
| Offer | Embedding MLP | 0.6019 | 0.5445 | 0.4465 | 0.9231 | 0.6143 | 0.234572 | 0.4516 ms | 121,247 B | 1.344 s |
| Purchase | **HistGradientBoosting selected** | **0.7291** | **0.7641** | 0.6394 | **0.8480** | **0.8418** | **0.158431** | 9.7951 ms | 806,420 B | 1.854 s |
| Purchase | CatBoost | 0.7240 | 0.7586 | 0.6313 | 0.8485 | 0.8391 | 0.159900 | 1.5008 ms | 152,972 B | 12.873 s |
| Purchase | Embedding MLP | 0.7267 | 0.7635 | **0.6490** | 0.8256 | 0.8397 | 0.159521 | 0.4451 ms | 130,489 B | 52.808 s |
| Purchase | GRU | 0.7240 | 0.7595 | 0.6365 | 0.8395 | 0.8374 | 0.160711 | 1.8150 ms | 94,385 B | 515.732 s |

The Offer Engine selects CatBoost because it had the strongest validation F1 among tabular finalists. It uses validation-selected isotonic calibration and threshold 0.28. The local CatBoost bundle is optional: if its package or artifact is unavailable, the service loads the established RandomForest bundle. The Purchase Engine retains HistGradientBoosting with validation-selected isotonic calibration and threshold 0.34.

Deep-learning experiment completed; tabular model retained. The Offer MLP lost 0.0196 test F1 and 0.0432 balanced accuracy versus CatBoost, with precision lower by 0.0289 and Brier higher by 0.011684. The Purchase MLP lost 0.0024 F1 and 0.0006 balanced accuracy versus HistGradientBoosting, recall fell by 0.0224, and Brier rose by 0.001090. The GRU trailed the simpler purchase MLP on validation F1 and required 515.732 seconds to train, so it was rejected without test-guided selection. Neither neural candidate met the required +0.03 F1 and +0.02 balanced-accuracy margins. Normal FastAPI startup does not import PyTorch.

### Benchmark limitations

- Results use synthetic Saudi-market data and are not production performance.
- High synthetic metrics do not guarantee real-world results or a future promotion.
- Production requires verified campaign history.
- Production requires consented, privacy-preserving transaction features.
- Production requires calibration governance, monitoring, drift detection, and approved retraining.
- The offer task remains difficult and stochastic; its selected balanced accuracy is 0.5877, below the preferred benchmark target.
- CPU measurements describe this local environment and exclude service startup from normal request latency.
