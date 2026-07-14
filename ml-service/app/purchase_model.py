import joblib
import pandas as pd

from .features import PURCHASE_CATEGORICAL, PURCHASE_NUMERIC, build_purchase_examples, purchase_feature_row
from .modeling import fit_engine, predict_probabilities
from .settings import PURCHASE_MODEL_PATH


def train_purchase_bundle(transactions, catalog):
    return fit_engine(build_purchase_examples(transactions, catalog), PURCHASE_NUMERIC, PURCHASE_CATEGORICAL)


def save_bundle(bundle, path=PURCHASE_MODEL_PATH):
    path.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(bundle, path)


def load_bundle(path=PURCHASE_MODEL_PATH):
    return joblib.load(path)


def predict_purchase(bundle, transactions, merchant, user_id, as_of):
    row = purchase_feature_row(transactions, merchant, user_id, as_of)
    return row, float(predict_probabilities(bundle, pd.DataFrame([row]))[0])
