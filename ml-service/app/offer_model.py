import joblib
import pandas as pd

from .features import OFFER_CATEGORICAL, OFFER_NUMERIC, build_offer_examples, offer_feature_row
from .modeling import fit_engine, predict_probabilities
from .settings import OFFER_MODEL_PATH, SELECTED_OFFER_MODEL_PATH


def train_offer_bundle(campaigns, catalog):
    return fit_engine(build_offer_examples(campaigns, catalog), OFFER_NUMERIC, OFFER_CATEGORICAL)


def save_bundle(bundle, path=OFFER_MODEL_PATH):
    path.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(bundle, path)


def load_bundle(path=None):
    if path is not None:
        return joblib.load(path)
    if SELECTED_OFFER_MODEL_PATH.exists():
        try:
            return joblib.load(SELECTED_OFFER_MODEL_PATH)
        except (ImportError, ModuleNotFoundError):
            # CatBoost is an optional benchmark dependency. The stable baseline
            # remains available when the optional package is not installed.
            pass
    return joblib.load(OFFER_MODEL_PATH)


def predict_offer(bundle, campaigns, merchant, as_of, window_days=7):
    row = offer_feature_row(campaigns, merchant, as_of, window_days)
    return row, float(predict_probabilities(bundle, pd.DataFrame([row]))[0])
