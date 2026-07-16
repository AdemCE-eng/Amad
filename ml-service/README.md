# Nadeem ML service

Two fitted, explainable scikit-learn classifiers power a seasonal offer probability and a seven-day purchase probability. Their inputs are derived only from **MOCK / SYNTHETIC DEMO DATA — SAUDI MARKET**. Named merchants demonstrate Saudi-market applicability; campaign records are not factual claims.

Training compares Logistic Regression, Random Forest, Extra Trees, HistGradientBoosting, and Gradient Boosting pipelines. Candidate selection, calibration choice, and threshold selection use only the chronological validation period. The newest 15% of dates remains untouched until final evaluation. An LLM does not calculate any probability.

## Reproducible setup

From `ml-service`:

```powershell
python -m venv .venv
.\.venv\Scripts\python -m pip install -r requirements.txt
```

Generate the full labeled synthetic datasets, train the models, and regenerate evaluation artifacts in order:

```powershell
.\.venv\Scripts\python -m scripts.generate_demo_data
.\.venv\Scripts\python -m scripts.train_models
.\.venv\Scripts\python -m scripts.evaluate_models
```

The complete generated CSV datasets and fitted `.joblib` files are intentionally ignored by Git. Small deterministic, schema-preserving examples are tracked under `data/samples/`; every row is labeled **MOCK / SYNTHETIC DEMO DATA — SAUDI MARKET**. Running `scripts.generate_demo_data` recreates the complete datasets in `data/`, and `scripts.train_models` recreates both required binaries in `artifacts/models/`.

If the trained binaries are absent, `/health` reports `ready: false` and prediction endpoints return HTTP 503 with `models_not_trained`. Run the generation and training commands above before using ML endpoints. The stable Nadeem application and its deterministic Node fallback do not require Python or these artifacts.

Run verification and the service:

```powershell
.\.venv\Scripts\python -m pytest
.\.venv\Scripts\python -m uvicorn app.main:app --port 8001
```

Endpoints: `GET /health`, `POST /v1/offers/predict`, `GET /v1/users/{user_id}/purchase-patterns`, `GET /v1/users/{user_id}/recommendations`, and development-only `POST /v1/train`. Set `APP_ENV=production` to disable retraining.

The chronological 70/15/15 train/validation/test partitions prevent future records from contributing to features. Actual evaluation output is generated into `artifacts/`; it is labeled as experimental Saudi-market data and must not be interpreted as production performance.

See `MODEL_CARD.md` for dataset scope, temporal splits, actual limitations, and production requirements.

From the repository root, synchronize evaluated JSON results into the offline HTML showcase:

```powershell
npm --prefix ml-results-showcase run sync-results
```
