# Namo ML service

Two fitted, explainable scikit-learn classifiers power a seasonal offer probability and a seven-day purchase probability. Their inputs are derived only from **MOCK / SYNTHETIC DEMO DATA — SAUDI MARKET**. Named merchants demonstrate Saudi-market applicability; campaign records are not factual claims.

The offer model is a random forest over seasonal, campaign-history, merchant, location, and calendar features. The purchase model is a random forest over leakage-safe historical RFM, timing, spend-share, and consistency features. Random forests were selected for nonlinear tabular interactions, robustness on mixed synthetic features, deterministic fitting under a fixed seed, and native feature importance. An LLM does not calculate any probability.

## Windows PowerShell setup

From `ml-service`:

```powershell
python -m venv .venv; .\.venv\Scripts\python -m pip install -r requirements.txt; .\.venv\Scripts\python -m scripts.generate_demo_data; .\.venv\Scripts\python -m scripts.train_models; .\.venv\Scripts\python -m scripts.evaluate_models
```

Run individually:

```powershell
python -m scripts.generate_demo_data
python -m scripts.train_models
python -m scripts.evaluate_models
python -m pytest
uvicorn app.main:app --port 8001
```

Endpoints: `GET /health`, `POST /v1/offers/predict`, `GET /v1/users/{user_id}/purchase-patterns`, `GET /v1/users/{user_id}/recommendations`, and development-only `POST /v1/train`. Set `APP_ENV=production` to disable retraining.

The chronological 80/20 holdouts prevent future records from contributing to features. Actual evaluation output is generated into `artifacts/`; it is labeled as experimental Saudi-market data and must not be interpreted as production performance.

