import joblib
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder

from .features import OFFER_CATEGORICAL, OFFER_NUMERIC, build_offer_examples, offer_feature_row
from .settings import OFFER_MODEL_PATH, OFFER_THRESHOLD, RANDOM_SEED


def build_pipeline() -> Pipeline:
    preprocess = ColumnTransformer([
        ("numeric", "passthrough", OFFER_NUMERIC),
        ("categorical", OneHotEncoder(handle_unknown="ignore", sparse_output=False), OFFER_CATEGORICAL),
    ])
    classifier = RandomForestClassifier(n_estimators=260, max_depth=14, min_samples_leaf=3, class_weight="balanced_subsample", random_state=RANDOM_SEED, n_jobs=-1)
    return Pipeline([("preprocess", preprocess), ("classifier", classifier)])


def train_offer_bundle(campaigns: pd.DataFrame, catalog: pd.DataFrame):
    examples = build_offer_examples(campaigns, catalog)
    cutoff = examples.as_of_date.quantile(0.8)
    train, test = examples[examples.as_of_date <= cutoff], examples[examples.as_of_date > cutoff]
    model = build_pipeline()
    model.fit(train[OFFER_NUMERIC + OFFER_CATEGORICAL], train.target)
    return {"model": model, "threshold": OFFER_THRESHOLD, "cutoff": str(cutoff.date()), "features": OFFER_NUMERIC + OFFER_CATEGORICAL}, test


def save_bundle(bundle: dict, path=OFFER_MODEL_PATH):
    path.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(bundle, path)


def load_bundle(path=OFFER_MODEL_PATH):
    return joblib.load(path)


def predict_offer(bundle, campaigns, merchant, as_of, window_days=7):
    row = offer_feature_row(campaigns, merchant, as_of, window_days)
    probability = bundle["model"].predict_proba(pd.DataFrame([row])[bundle["features"]])[:, 1][0]
    return row, float(probability)

