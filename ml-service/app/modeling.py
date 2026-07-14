from __future__ import annotations

import time
import numpy as np
from sklearn.base import BaseEstimator
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import ExtraTreesClassifier, GradientBoostingClassifier, HistGradientBoostingClassifier, RandomForestClassifier
from sklearn.isotonic import IsotonicRegression
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import balanced_accuracy_score, brier_score_loss, f1_score, precision_score, recall_score
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.utils.class_weight import compute_sample_weight

from .settings import RANDOM_SEED


class IdentityCalibrator:
    def fit(self, probabilities, targets):
        return self

    def predict(self, probabilities):
        return np.asarray(probabilities, dtype=float)


class SigmoidCalibrator:
    def __init__(self):
        self.model = LogisticRegression(random_state=RANDOM_SEED)

    def fit(self, probabilities, targets):
        clipped = np.clip(np.asarray(probabilities), 1e-6, 1 - 1e-6)
        logits = np.log(clipped / (1 - clipped)).reshape(-1, 1)
        self.model.fit(logits, targets)
        return self

    def predict(self, probabilities):
        clipped = np.clip(np.asarray(probabilities), 1e-6, 1 - 1e-6)
        logits = np.log(clipped / (1 - clipped)).reshape(-1, 1)
        return self.model.predict_proba(logits)[:, 1]


class IsotonicCalibrator:
    def __init__(self):
        self.model = IsotonicRegression(out_of_bounds="clip")

    def fit(self, probabilities, targets):
        self.model.fit(probabilities, targets)
        return self

    def predict(self, probabilities):
        return np.asarray(self.model.predict(probabilities), dtype=float)


def temporal_split(examples):
    dates = np.array(sorted(examples.as_of_date.unique()))
    train_end = dates[max(1, int(len(dates) * .70)) - 1]
    validation_end = dates[max(2, int(len(dates) * .85)) - 1]
    train = examples[examples.as_of_date <= train_end].copy()
    validation = examples[(examples.as_of_date > train_end) & (examples.as_of_date <= validation_end)].copy()
    test = examples[examples.as_of_date > validation_end].copy()
    split = {
        "train": {"start": str(train.as_of_date.min().date()), "end": str(train.as_of_date.max().date()), "rows": len(train), "positiveRate": round(float(train.target.mean()), 4)},
        "validation": {"start": str(validation.as_of_date.min().date()), "end": str(validation.as_of_date.max().date()), "rows": len(validation), "positiveRate": round(float(validation.target.mean()), 4)},
        "test": {"start": str(test.as_of_date.min().date()), "end": str(test.as_of_date.max().date()), "rows": len(test), "positiveRate": round(float(test.target.mean()), 4)},
    }
    return train, validation, test, split


def candidate_estimators():
    return {
        "LogisticRegression": LogisticRegression(C=1.0, max_iter=800, class_weight="balanced", random_state=RANDOM_SEED),
        "RandomForestClassifier": RandomForestClassifier(n_estimators=260, max_depth=20, min_samples_leaf=2, max_features=.65, class_weight="balanced_subsample", random_state=RANDOM_SEED, n_jobs=-1),
        "ExtraTreesClassifier": ExtraTreesClassifier(n_estimators=280, max_depth=22, min_samples_leaf=2, max_features=.85, class_weight="balanced", random_state=RANDOM_SEED, n_jobs=-1),
        "HistGradientBoostingClassifier": HistGradientBoostingClassifier(max_iter=220, learning_rate=.07, max_leaf_nodes=63, min_samples_leaf=15, l2_regularization=.15, class_weight="balanced", random_state=RANDOM_SEED),
        "GradientBoostingClassifier": GradientBoostingClassifier(n_estimators=170, learning_rate=.05, max_depth=4, min_samples_leaf=15, subsample=.85, random_state=RANDOM_SEED),
    }


def build_pipeline(estimator, numeric, categorical):
    preprocess = ColumnTransformer([
        ("numeric", StandardScaler(), numeric),
        ("categorical", OneHotEncoder(handle_unknown="ignore", sparse_output=False, min_frequency=2), categorical),
    ])
    return Pipeline([("preprocess", preprocess), ("classifier", estimator)])


def threshold_search(targets, probabilities):
    rows = []
    for threshold in np.round(np.arange(.10, .901, .02), 2):
        predicted = probabilities >= threshold
        rows.append({
            "threshold": float(threshold), "precision": round(float(precision_score(targets, predicted, zero_division=0)), 4),
            "recall": round(float(recall_score(targets, predicted, zero_division=0)), 4),
            "f1": round(float(f1_score(targets, predicted, zero_division=0)), 4),
            "balancedAccuracy": round(float(balanced_accuracy_score(targets, predicted)), 4),
            "predictedPositiveRate": round(float(np.mean(predicted)), 4),
        })
    constrained = [row for row in rows if row["precision"] >= .75 and row["recall"] >= .75]
    pool = constrained or rows
    selected = max(pool, key=lambda row: (row["f1"], row["balancedAccuracy"], row["precision"]))
    return rows, {**selected, "constraintsSatisfied": bool(constrained)}


def reliability_bins(targets, probabilities, bins=10):
    output = []
    edges = np.linspace(0, 1, bins + 1)
    for index in range(bins):
        mask = (probabilities >= edges[index]) & (probabilities < edges[index + 1] if index < bins - 1 else probabilities <= 1)
        if mask.any():
            output.append({
                "lower": round(float(edges[index]), 2), "upper": round(float(edges[index + 1]), 2),
                "meanPrediction": round(float(probabilities[mask].mean()), 4),
                "observedRate": round(float(np.asarray(targets)[mask].mean()), 4), "count": int(mask.sum()),
            })
    return output


def fit_engine(examples, numeric, categorical):
    train, validation, test, split = temporal_split(examples)
    features = numeric + categorical
    candidate_results, fitted = [], {}
    y_train, y_validation = train.target.to_numpy(), validation.target.to_numpy()
    for name, estimator in candidate_estimators().items():
        pipeline = build_pipeline(estimator, numeric, categorical)
        started = time.perf_counter()
        fit_args = {}
        if name == "GradientBoostingClassifier":
            fit_args["classifier__sample_weight"] = compute_sample_weight("balanced", y_train)
        pipeline.fit(train[features], y_train, **fit_args)
        duration = time.perf_counter() - started
        probabilities = pipeline.predict_proba(validation[features])[:, 1]
        _, selected = threshold_search(y_validation, probabilities)
        candidate_results.append({
            "modelName": name, "validation": selected, "validationRocInputRows": len(validation),
            "trainingDurationSeconds": round(duration, 3), "hyperparameters": estimator.get_params(deep=False),
        })
        fitted[name] = (pipeline, probabilities, duration)
    eligible = [item for item in candidate_results if item["validation"]["constraintsSatisfied"]]
    selection_pool = eligible or candidate_results
    winner = max(selection_pool, key=lambda item: (item["validation"]["f1"], item["validation"]["balancedAccuracy"], item["validation"]["precision"]))
    model, raw_validation_probability, duration = fitted[winner["modelName"]]

    calibrators = {"uncalibrated": IdentityCalibrator(), "sigmoid": SigmoidCalibrator(), "isotonic": IsotonicCalibrator()}
    calibration_results, fitted_calibrators = [], {}
    for method, calibrator in calibrators.items():
        calibrator.fit(raw_validation_probability, y_validation)
        calibrated = np.clip(calibrator.predict(raw_validation_probability), 0, 1)
        brier = float(brier_score_loss(y_validation, calibrated))
        calibration_results.append({"method": method, "validationBrierScore": round(brier, 6), "reliabilityBins": reliability_bins(y_validation, calibrated)})
        fitted_calibrators[method] = (calibrator, calibrated)
    best_calibration = min(calibration_results, key=lambda item: item["validationBrierScore"])
    calibrator, calibrated_validation_probability = fitted_calibrators[best_calibration["method"]]
    threshold_rows, selected_threshold = threshold_search(y_validation, calibrated_validation_probability)
    bundle = {
        "model": model, "calibrator": calibrator, "calibrationMethod": best_calibration["method"],
        "threshold": selected_threshold["threshold"], "features": features, "numericFeatures": numeric,
        "categoricalFeatures": categorical, "modelName": winner["modelName"],
        "hyperparameters": winner["hyperparameters"], "validationMetrics": selected_threshold,
        "candidateResults": candidate_results, "thresholdAnalysis": threshold_rows,
        "calibrationResults": calibration_results, "split": split,
        "trainingDurationSeconds": round(duration, 3), "randomSeed": RANDOM_SEED,
    }
    return bundle, test


def predict_probabilities(bundle, frame):
    raw = bundle["model"].predict_proba(frame[bundle["features"]])[:, 1]
    return np.clip(bundle["calibrator"].predict(raw), 0, 1)
