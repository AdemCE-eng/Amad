import joblib
import pandas as pd
import numpy as np
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder
from sklearn.metrics import f1_score

from .features import PURCHASE_CATEGORICAL, PURCHASE_NUMERIC, build_purchase_examples, purchase_feature_row
from .settings import PURCHASE_MODEL_PATH, RANDOM_SEED


def build_pipeline() -> Pipeline:
    preprocess = ColumnTransformer([
        ("numeric", "passthrough", PURCHASE_NUMERIC),
        ("categorical", OneHotEncoder(handle_unknown="ignore", sparse_output=False), PURCHASE_CATEGORICAL),
    ])
    classifier = RandomForestClassifier(n_estimators=260, max_depth=16, min_samples_leaf=2, class_weight="balanced_subsample", random_state=RANDOM_SEED, n_jobs=-1)
    return Pipeline([("preprocess", preprocess), ("classifier", classifier)])


def train_purchase_bundle(transactions: pd.DataFrame, catalog: pd.DataFrame):
    examples = build_purchase_examples(transactions, catalog)
    cutoff = examples.as_of_date.quantile(0.8)
    train, test = examples[examples.as_of_date <= cutoff], examples[examples.as_of_date > cutoff]
    validation_cutoff = train.as_of_date.quantile(0.8)
    fit = train[train.as_of_date <= validation_cutoff]
    validation = train[train.as_of_date > validation_cutoff]
    selector = build_pipeline()
    selector.fit(fit[PURCHASE_NUMERIC + PURCHASE_CATEGORICAL], fit.target)
    validation_probability = selector.predict_proba(validation[PURCHASE_NUMERIC + PURCHASE_CATEGORICAL])[:, 1]
    candidates = np.linspace(0.12, 0.62, 26)
    threshold = round(float(max(candidates, key=lambda value: f1_score(validation.target, validation_probability >= value, zero_division=0))), 2)
    model = build_pipeline()
    model.fit(train[PURCHASE_NUMERIC + PURCHASE_CATEGORICAL], train.target)
    return {"model": model, "threshold": threshold, "cutoff": str(cutoff.date()), "features": PURCHASE_NUMERIC + PURCHASE_CATEGORICAL, "thresholdSelection": "chronological_validation_f1"}, test


def save_bundle(bundle: dict, path=PURCHASE_MODEL_PATH):
    path.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(bundle, path)


def load_bundle(path=PURCHASE_MODEL_PATH):
    return joblib.load(path)


def predict_purchase(bundle, transactions, merchant, user_id, as_of):
    row = purchase_feature_row(transactions, merchant, user_id, as_of)
    probability = bundle["model"].predict_proba(pd.DataFrame([row])[bundle["features"]])[:, 1][0]
    return row, float(probability)
