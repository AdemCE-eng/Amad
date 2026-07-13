from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException

from .features import load_data
from .offer_model import load_bundle as load_offer_bundle
from .purchase_model import load_bundle as load_purchase_bundle
from .recommender import offer_payload, purchase_patterns, recommendations
from .schemas import OfferPredictionRequest
from .settings import APP_ENV, DATA_LABEL, DEMO_AS_OF, OFFER_MODEL_PATH, PURCHASE_MODEL_PATH

STATE = {}


def load_state():
    if not OFFER_MODEL_PATH.exists() or not PURCHASE_MODEL_PATH.exists():
        raise RuntimeError("Model artifacts are missing. Run python -m scripts.train_models")
    catalog, campaigns, transactions = load_data()
    STATE.update({"catalog": catalog, "campaigns": campaigns, "transactions": transactions, "offer": load_offer_bundle(), "purchase": load_purchase_bundle()})


@asynccontextmanager
async def lifespan(_app):
    try:
        load_state()
    except RuntimeError:
        STATE.clear()
    yield


app = FastAPI(title="Namo Personalized Promotion Prediction", version="1.0.0", lifespan=lifespan)


@app.get("/health")
def health():
    models = None if not STATE else {
        "offer": {"name": STATE["offer"].get("modelName"), "version": STATE["offer"].get("modelVersion", "baseline-v2")},
        "purchase": {"name": STATE["purchase"].get("modelName"), "version": STATE["purchase"].get("modelVersion", "baseline-v2")},
    }
    return {"ok": True, "service": "namo-ml", "ready": bool(STATE), "models": models, "dataLabel": DATA_LABEL}


def require_state():
    if not STATE:
        raise HTTPException(status_code=503, detail="models_not_trained")


@app.post("/v1/offers/predict")
def predict_offer_endpoint(request: OfferPredictionRequest):
    require_state()
    matches = STATE["catalog"][STATE["catalog"].merchant_id == request.merchantId]
    if matches.empty:
        raise HTTPException(status_code=404, detail="unknown_merchant")
    merchant = matches.iloc[0].copy()
    if request.city:
        merchant["city"] = request.city
    return offer_payload(STATE["offer"], STATE["campaigns"], merchant, request.asOfDate or DEMO_AS_OF, request.windowDays)[0]


@app.get("/v1/users/{user_id}/purchase-patterns")
def purchase_patterns_endpoint(user_id: str):
    require_state()
    if user_id not in set(STATE["transactions"].user_id):
        raise HTTPException(status_code=404, detail="unknown_user")
    return {"userId": user_id, "patterns": purchase_patterns(STATE["purchase"], STATE["transactions"], STATE["catalog"], user_id, DEMO_AS_OF), "dataLabel": DATA_LABEL}


@app.get("/v1/users/{user_id}/recommendations")
def recommendations_endpoint(user_id: str, includeSuppressed: bool = False):
    require_state()
    if user_id not in set(STATE["transactions"].user_id):
        raise HTTPException(status_code=404, detail="unknown_user")
    ranked = recommendations(STATE["offer"], STATE["purchase"], STATE["campaigns"], STATE["transactions"], STATE["catalog"], user_id, DEMO_AS_OF)
    return {"userId": user_id, "recommendations": ranked if includeSuppressed else [item for item in ranked if item["eligible"]], "ranking": ranked if includeSuppressed else None, "dataLabel": DATA_LABEL}


@app.post("/v1/train")
def train_endpoint():
    if APP_ENV == "production":
        raise HTTPException(status_code=403, detail="retraining_disabled_in_production")
    from scripts.train_models import train
    train()
    load_state()
    return {"ok": True, "retrained": True, "environment": APP_ENV, "dataLabel": DATA_LABEL}

