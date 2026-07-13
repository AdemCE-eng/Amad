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
