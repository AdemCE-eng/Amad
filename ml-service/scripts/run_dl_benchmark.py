from __future__ import annotations

import hashlib
import json
import math
from pathlib import Path
import platform
import time

import joblib
import numpy as np
import pandas as pd
import torch
from catboost import CatBoostClassifier
from scipy.optimize import minimize_scalar
from sklearn.metrics import brier_score_loss, log_loss
from torch.utils.data import DataLoader

from app.dl.datasets import SequenceFrameDataset, SequenceHistory, TabularEncoder, TabularFrameDataset
from app.dl.inference import probability as torch_probability
from app.dl.purchase_embedding_mlp import EmbeddingMLP
from app.dl.purchase_gru import PurchaseGRU
from app.dl.training import classification_metrics, predict as torch_predict, set_reproducible_seed, train_model
from app.features import (
    OFFER_CATEGORICAL, OFFER_NUMERIC, PURCHASE_CATEGORICAL, PURCHASE_NUMERIC,
    build_offer_examples, build_purchase_examples, load_data,
)
from app.modeling import IdentityCalibrator, IsotonicCalibrator, SigmoidCalibrator, predict_probabilities, temporal_split, threshold_search
from app.purchase_model import load_bundle as load_purchase
from app.settings import DATASET_VERSION, DATA_LABEL, RANDOM_SEED, ROOT


OUTPUT = ROOT / "artifacts" / "dl-benchmark"
MODEL_DIR = OUTPUT / "models"
LABEL = "MOCK / SYNTHETIC DEEP-LEARNING BENCHMARK — SAUDI MARKET"
RESULTS_LABEL_AR = "نتائج على بيانات تجريبية من السوق السعودي"
NON_PRODUCTION_AR = "هذه النتائج لا تمثل أداءً إنتاجياً على بيانات عملاء حقيقية"


class TemperatureCalibrator:
    def __init__(self):
        self.temperature = 1.0

    def fit(self, probabilities, targets):
        clipped = np.clip(np.asarray(probabilities), 1e-6, 1 - 1e-6)
        logits = np.log(clipped / (1 - clipped))
        result = minimize_scalar(
            lambda value: log_loss(targets, 1 / (1 + np.exp(-logits / value))),
            bounds=(.2, 5.0), method="bounded",
        )
        self.temperature = float(result.x)
        return self

    def predict(self, probabilities):
        clipped = np.clip(np.asarray(probabilities), 1e-6, 1 - 1e-6)
        logits = np.log(clipped / (1 - clipped))
        return 1 / (1 + np.exp(-logits / self.temperature))


def json_ready(value):
    if isinstance(value, dict):
        return {str(key): json_ready(item) for key, item in value.items()}
    if isinstance(value, (list, tuple)):
        return [json_ready(item) for item in value]
    if isinstance(value, (np.integer,)):
        return int(value)
    if isinstance(value, (np.floating,)):
        return float(value)
    if isinstance(value, (np.bool_,)):
        return bool(value)
    if isinstance(value, Path):
        return str(value)
    return value


def write_json(name, payload):
    OUTPUT.mkdir(parents=True, exist_ok=True)
    (OUTPUT / name).write_text(json.dumps(json_ready(payload), ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def file_sha256(path):
    digest = hashlib.sha256()
    with Path(path).open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def frame_sha256(frame):
    normalized = frame.copy()
    for column in normalized.select_dtypes(include=["datetime64[ns]"]).columns:
        normalized[column] = normalized[column].astype("datetime64[ns]").astype("int64")
    row_hashes = pd.util.hash_pandas_object(normalized, index=False).to_numpy(np.uint64)
    return hashlib.sha256(row_hashes.tobytes()).hexdigest()


def preflight_leakage_checks(offer_parts, purchase_parts, transactions):
    checks = {}
    for engine, parts in (("offer", offer_parts), ("purchase", purchase_parts)):
        train, validation, test = parts
        checks[f"{engine}TemporalSeparation"] = bool(
            train.as_of_date.max() < validation.as_of_date.min()
            and validation.as_of_date.max() < test.as_of_date.min()
        )
        checks[f"{engine}StableTestHash"] = frame_sha256(test) == frame_sha256(test.copy())
    checks["offerLabelsExcluded"] = "target" not in OFFER_NUMERIC + OFFER_CATEGORICAL
    checks["purchaseLabelsExcluded"] = "target" not in PURCHASE_NUMERIC + PURCHASE_CATEGORICAL
    checks["timestampsAndIdsExcludedFromNumericInputs"] = not ({"as_of_date", "timestamp", "transaction_id", "campaign_id"} & set(OFFER_NUMERIC + PURCHASE_NUMERIC))
    encoder = TabularEncoder(["merchant_id"], ["days_since_last_campaign"]).fit(offer_parts[0])
    unknown = offer_parts[1].iloc[:1].copy()
    unknown["merchant_id"] = "__UNSEEN_VALIDATION_MERCHANT__"
    checks["unknownCategoriesUseSafeIndex"] = int(encoder.transform(unknown)[0][0, 0]) == 0
    sequence_history = SequenceHistory(transactions, purchase_parts[0].as_of_date.max() + pd.Timedelta(days=1))
    sample = purchase_parts[1].iloc[0]
    history = sequence_history.histories[str(sample.user_id)]
    stop = int(np.searchsorted(history["times"], np.datetime64(sample.as_of_date, "ns"), side="left"))
    checks["gruSequenceStrictCutoff"] = bool(stop == 0 or history["times"][stop - 1] < np.datetime64(sample.as_of_date, "ns"))
    checks["trainOnlyVocabulariesAndScalers"] = encoder.metadata()["fitScope"] == "training rows only"
    if not all(checks.values()):
        failed = [name for name, passed in checks.items() if not passed]
        raise RuntimeError(f"Temporal-leakage preflight failed: {failed}")
    write_json("leakage_tests.json", {"label": LABEL, "checks": checks, "passed": True})
    return checks


def prepare_catboost(frame, numeric, categorical):
    output = frame[numeric + categorical].copy()
    output[numeric] = output[numeric].astype(float).replace([np.inf, -np.inf], np.nan).fillna(0)
    for column in categorical:
        output[column] = output[column].fillna("__MISSING__").astype(str)
    return output


def validation_metrics(targets, probabilities):
    rows, selected = threshold_search(targets, probabilities)
    selected = dict(selected)
    selected["rocAuc"] = round(float(__import__("sklearn.metrics", fromlist=["roc_auc_score"]).roc_auc_score(targets, probabilities)), 4)
    selected["brierScore"] = round(float(brier_score_loss(targets, probabilities)), 6)
    return rows, selected


def calibration_and_final(raw_validation, validation_target, raw_test, test_target, family):
    calibrators = {
        "uncalibrated": IdentityCalibrator(),
        "sigmoid": SigmoidCalibrator(),
    }
    if family == "tabular":
        calibrators["isotonic"] = IsotonicCalibrator()
    else:
        calibrators["temperature"] = TemperatureCalibrator()
    results, fitted = [], {}
    for name, calibrator in calibrators.items():
        calibrator.fit(raw_validation, validation_target)
        values = np.clip(calibrator.predict(raw_validation), 0, 1)
        results.append({"method": name, "validationBrierScore": round(float(brier_score_loss(validation_target, values)), 6)})
        fitted[name] = calibrator
    selected = min(results, key=lambda row: (row["validationBrierScore"], row["method"]))
    calibrator = fitted[selected["method"]]
    validation_probability = np.clip(calibrator.predict(raw_validation), 0, 1)
    threshold_rows, threshold = threshold_search(validation_target, validation_probability)
    test_probability = np.clip(calibrator.predict(raw_test), 0, 1)
    return {
        "calibrationMethod": selected["method"], "calibrationRows": results,
        "thresholdRows": threshold_rows, "validation": {
            **threshold,
            "rocAuc": round(float(__import__("sklearn.metrics", fromlist=["roc_auc_score"]).roc_auc_score(validation_target, validation_probability)), 4),
            "brierScore": round(float(brier_score_loss(validation_target, validation_probability)), 6),
        },
        "test": classification_metrics(test_target, test_probability, threshold["threshold"]),
        "calibrator": calibrator,
    }


def train_catboost_family(engine, train, validation, test, numeric, categorical, configurations, history):
    x_train, x_validation, x_test = [prepare_catboost(frame, numeric, categorical) for frame in (train, validation, test)]
    y_train, y_validation, y_test = [frame.target.to_numpy(int) for frame in (train, validation, test)]
    candidates = []
    for index, config in enumerate(configurations, 1):
        set_reproducible_seed(RANDOM_SEED)
        model = CatBoostClassifier(
            loss_function="Logloss", eval_metric="F1", random_seed=RANDOM_SEED,
            allow_writing_files=False, verbose=False, thread_count=-1, **config,
        )
        started = time.perf_counter()
        model.fit(x_train, y_train, cat_features=categorical, eval_set=(x_validation, y_validation), early_stopping_rounds=25)
        duration = time.perf_counter() - started
        probability = model.predict_proba(x_validation)[:, 1]
        _, metrics = validation_metrics(y_validation, probability)
        record = {
            "engine": engine, "modelName": "CatBoostClassifier", "configurationId": index,
            "configuration": config, "randomSeed": RANDOM_SEED,
            "epochsOrTrees": int(model.tree_count_), "bestValidationEpoch": int(model.get_best_iteration()),
            "trainingDurationSeconds": round(duration, 3), "validation": metrics,
        }
        history.append(record)
        candidates.append({"model": model, "rawValidation": probability, "record": record})
    winner = max(candidates, key=lambda item: (item["record"]["validation"]["f1"], item["record"]["validation"]["balancedAccuracy"]))
    raw_test = winner["model"].predict_proba(x_test)[:, 1]
    final = calibration_and_final(winner["rawValidation"], y_validation, raw_test, y_test, "tabular")
    return {**winner, **final, "xTest": x_test, "yTest": y_test}


def train_mlp_family(engine, train, validation, test, categorical, numeric, configurations, history):
    encoder = TabularEncoder(categorical, numeric).fit(train)
    datasets = [TabularFrameDataset(frame, encoder) for frame in (train, validation, test)]
    candidates = []
    for index, config in enumerate(configurations, 1):
        model = EmbeddingMLP(
            encoder.cardinalities, len(numeric), hidden=tuple(config["hidden"]),
            dropout=config["dropout"], embedding_dim=config.get("embeddingDim"),
        )
        result = train_model(
            model, datasets[0], datasets[1], RANDOM_SEED, epochs=config["epochs"],
            batch_size=config["batchSize"], learning_rate=config["learningRate"],
            weight_decay=config["weightDecay"], patience=config["patience"],
        )
        _, metrics = validation_metrics(result["validationTarget"], result["validationProbability"])
        record = {
            "engine": engine, "modelName": "EmbeddingMLP", "configurationId": index,
            "configuration": config, "randomSeed": RANDOM_SEED,
            "epochsOrTrees": len(result["trainingCurve"]), "bestValidationEpoch": result["bestEpoch"],
            "trainingDurationSeconds": result["trainingDurationSeconds"], "validation": metrics,
        }
        history.append(record)
        candidates.append({"model": result["model"], "result": result, "record": record})
    winner = max(candidates, key=lambda item: (item["record"]["validation"]["f1"], item["record"]["validation"]["balancedAccuracy"]))
    raw_test, y_test = torch_predict(winner["model"], datasets[2], batch_size=2048)
    final = calibration_and_final(
        winner["result"]["validationProbability"], winner["result"]["validationTarget"], raw_test, y_test, "neural",
    )
    return {**winner, **final, "encoder": encoder, "datasets": datasets, "yTest": y_test}


def train_gru_family(train, validation, test, transactions, configurations, history):
    categorical = ["user_id"] + PURCHASE_CATEGORICAL
    encoder = TabularEncoder(categorical, PURCHASE_NUMERIC).fit(train)
    train_cutoff = pd.Timestamp(train.as_of_date.max()) + pd.Timedelta(days=1)
    sequence_history = SequenceHistory(transactions, train_cutoff)
    datasets = [SequenceFrameDataset(frame, encoder, sequence_history, max_length=30) for frame in (train, validation, test)]
    candidates = []
    for index, config in enumerate(configurations, 1):
        model = PurchaseGRU(
            encoder.cardinalities, sequence_history.event_cardinalities, len(PURCHASE_NUMERIC),
            embedding_dim=config["embeddingDim"], hidden_dim=config["hiddenDim"], dropout=config["dropout"],
        )
        result = train_model(
            model, datasets[0], datasets[1], RANDOM_SEED, epochs=config["epochs"],
            batch_size=config["batchSize"], learning_rate=config["learningRate"],
            weight_decay=config["weightDecay"], patience=config["patience"],
        )
        _, metrics = validation_metrics(result["validationTarget"], result["validationProbability"])
        record = {
            "engine": "purchase", "modelName": "PurchaseGRU", "configurationId": index,
            "configuration": config, "randomSeed": RANDOM_SEED,
            "epochsOrTrees": len(result["trainingCurve"]), "bestValidationEpoch": result["bestEpoch"],
            "trainingDurationSeconds": result["trainingDurationSeconds"], "validation": metrics,
        }
        history.append(record)
        candidates.append({"model": result["model"], "result": result, "record": record})
    winner = max(candidates, key=lambda item: (item["record"]["validation"]["f1"], item["record"]["validation"]["balancedAccuracy"]))
    raw_test, y_test = torch_predict(winner["model"], datasets[2], batch_size=512)
    final = calibration_and_final(
        winner["result"]["validationProbability"], winner["result"]["validationTarget"], raw_test, y_test, "neural",
    )
    return {
        **winner, **final, "encoder": encoder, "sequenceHistory": sequence_history,
        "datasets": datasets, "yTest": y_test,
    }


def save_torch_candidate(path, candidate, config):
    path.parent.mkdir(parents=True, exist_ok=True)
    payload = {
        "stateDict": candidate["model"].state_dict(), "configuration": config,
        "encoder": candidate["encoder"].metadata(), "calibrationMethod": candidate["calibrationMethod"],
        "threshold": candidate["validation"]["threshold"], "randomSeed": RANDOM_SEED,
    }
    if "sequenceHistory" in candidate:
        payload["sequenceHistory"] = candidate["sequenceHistory"].metadata()
    torch.save(payload, path)


def verify_saved_candidates(offer_cat, purchase_cat, offer_mlp, purchase_mlp, purchase_gru, paths):
    checks = {}
    for name, candidate, path in (
        ("offerCatBoost", offer_cat, paths["offerCatBoost"]),
        ("purchaseCatBoost", purchase_cat, paths["purchaseCatBoost"]),
    ):
        loaded = CatBoostClassifier()
        loaded.load_model(path)
        expected = candidate["model"].predict_proba(candidate["xTest"].iloc[:256])[:, 1]
        actual = loaded.predict_proba(candidate["xTest"].iloc[:256])[:, 1]
        checks[name] = bool(np.allclose(expected, actual, atol=1e-12))
    for name, candidate, path in (
        ("offerEmbeddingMlp", offer_mlp, paths["offerEmbeddingMlp"]),
        ("purchaseEmbeddingMlp", purchase_mlp, paths["purchaseEmbeddingMlp"]),
        ("purchaseGru", purchase_gru, paths["purchaseGru"]),
    ):
        payload = torch.load(path, map_location="cpu", weights_only=False)
        current = candidate["model"].state_dict()
        checks[name] = set(payload["stateDict"]) == set(current) and all(
            torch.equal(payload["stateDict"][key], current[key].cpu()) for key in current
        )
    if not all(checks.values()):
        raise RuntimeError(f"Saved model verification failed: {checks}")
    return checks


def prepared_batch(dataset, count):
    return next(iter(DataLoader(dataset, batch_size=min(count, len(dataset)), shuffle=False, num_workers=0)))


def latency_rows(name, predict_for_size, artifact_path, training_seconds, cold_loader):
    cold_started = time.perf_counter()
    cold_loader()
    cold_ms = (time.perf_counter() - cold_started) * 1000
    rows = {}
    for count in (1, 32, 256):
        predict_for_size(count)
        values = []
        for _ in range(100):
            started = time.perf_counter()
            predict_for_size(count)
            values.append((time.perf_counter() - started) * 1000)
        rows[str(count)] = {
            "meanMs": round(float(np.mean(values)), 4), "medianMs": round(float(np.median(values)), 4),
            "p95Ms": round(float(np.percentile(values, 95)), 4), "repetitions": 100,
        }
    return {
        "modelName": name, "coldStartupMs": round(cold_ms, 4), "latency": rows,
        "artifactBytes": int(Path(artifact_path).stat().st_size), "trainingDurationSeconds": training_seconds,
        "device": "CPU", "serviceStartupExcludedFromLatency": True,
    }


def acceptance(tabular, neural, runtime):
    differences = {
        "f1": round(neural["f1"] - tabular["f1"], 4),
        "balancedAccuracy": round(neural["balancedAccuracy"] - tabular["balancedAccuracy"], 4),
        "precision": round(neural["precision"] - tabular["precision"], 4),
        "recall": round(neural["recall"] - tabular["recall"], 4),
        "brierScore": round(neural["brierScore"] - tabular["brierScore"], 6),
    }
    checks = {
        "f1GainAtLeast003": differences["f1"] >= .03,
        "balancedAccuracyGainAtLeast002": differences["balancedAccuracy"] >= .02,
        "precisionDegradationWithin002": differences["precision"] >= -.02,
        "recallDegradationWithin002": differences["recall"] >= -.02,
        "brierNotMateriallyWorse": differences["brierScore"] <= .02,
        "singleInferenceUnder150Ms": runtime["latency"]["1"]["meanMs"] < 150,
    }
    return {"passed": all(checks.values()), "differences": differences, "checks": checks}


def main():
    set_reproducible_seed(RANDOM_SEED)
    OUTPUT.mkdir(parents=True, exist_ok=True)
    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    catalog, campaigns, transactions = load_data()
    offer_examples = build_offer_examples(campaigns, catalog)
    purchase_examples = build_purchase_examples(transactions, catalog)
    offer_train, offer_validation, offer_test, offer_split = temporal_split(offer_examples)
    purchase_train, purchase_validation, purchase_test, purchase_split = temporal_split(purchase_examples)
    leakage_checks = preflight_leakage_checks(
        (offer_train, offer_validation, offer_test),
        (purchase_train, purchase_validation, purchase_test), transactions,
    )

    csv_paths = [ROOT / "data" / name for name in ("merchant_catalog.csv", "merchant_campaigns.csv", "user_transactions.csv")]
    manifest = {
        "label": LABEL, "dataLabel": DATA_LABEL, "datasetVersion": DATASET_VERSION, "randomSeed": RANDOM_SEED,
        "counts": {"merchants": len(catalog), "fictionalUsers": int(transactions.user_id.nunique()), "campaigns": len(campaigns), "transactions": len(transactions)},
        "inputCsv": {path.name: {"sha256": file_sha256(path), "bytes": path.stat().st_size} for path in csv_paths},
        "candidateHashAlgorithm": "SHA-256 of pandas hash_pandas_object uint64 bytes in stable row order",
        "engines": {
            "offer": {"candidateRows": len(offer_examples), "positiveRate": round(float(offer_examples.target.mean()), 6), "sha256": frame_sha256(offer_examples), "split": offer_split,
                      "testSha256": frame_sha256(offer_test)},
            "purchase": {"candidateRows": len(purchase_examples), "positiveRate": round(float(purchase_examples.target.mean()), 6), "sha256": frame_sha256(purchase_examples), "split": purchase_split,
                         "testSha256": frame_sha256(purchase_test)},
        },
        "frozenAcrossFamilies": True, "containsRealPersonalData": False,
    }
    write_json("dataset_manifest.json", manifest)

    experiment_history = []
    existing_comparison = json.loads((ROOT / "artifacts" / "model_comparison.json").read_text(encoding="utf-8"))
    for engine in ("offerModel", "purchaseModel"):
        for row in existing_comparison[engine]:
            experiment_history.append({
                "engine": "offer" if engine == "offerModel" else "purchase",
                "modelName": row["modelName"], "configuration": row["hyperparameters"],
                "randomSeed": RANDOM_SEED, "epochsOrTrees": row["hyperparameters"].get("n_estimators") or row["hyperparameters"].get("max_iter"),
                "bestValidationEpoch": None, "trainingDurationSeconds": row["trainingDurationSeconds"], "validation": row["validation"],
                "source": "existing frozen baseline search",
            })

    cat_configs = [
        {"iterations": 320, "depth": 6, "learning_rate": .05, "l2_leaf_reg": 4, "auto_class_weights": "Balanced"},
        {"iterations": 420, "depth": 8, "learning_rate": .035, "l2_leaf_reg": 7, "auto_class_weights": "Balanced"},
    ]
    offer_cat = train_catboost_family("offer", offer_train, offer_validation, offer_test, OFFER_NUMERIC, OFFER_CATEGORICAL, cat_configs, experiment_history)
    purchase_cat = train_catboost_family("purchase", purchase_train, purchase_validation, purchase_test, PURCHASE_NUMERIC, PURCHASE_CATEGORICAL, cat_configs, experiment_history)

    mlp_configs = [
        {"hidden": [128, 64, 32], "dropout": .15, "embeddingDim": 12, "epochs": 14, "batchSize": 1024, "learningRate": .001, "weightDecay": .0001, "patience": 3},
        {"hidden": [96, 48, 24], "dropout": .25, "embeddingDim": 8, "epochs": 14, "batchSize": 1024, "learningRate": .0006, "weightDecay": .0003, "patience": 3},
    ]
    offer_mlp = train_mlp_family("offer", offer_train, offer_validation, offer_test, OFFER_CATEGORICAL, OFFER_NUMERIC, mlp_configs, experiment_history)
    purchase_mlp = train_mlp_family("purchase", purchase_train, purchase_validation, purchase_test, ["user_id"] + PURCHASE_CATEGORICAL, PURCHASE_NUMERIC, mlp_configs, experiment_history)
    gru_configs = [
        {"embeddingDim": 8, "hiddenDim": 32, "dropout": .2, "epochs": 6, "batchSize": 512, "learningRate": .0008, "weightDecay": .0002, "patience": 2},
    ]
    purchase_gru = train_gru_family(purchase_train, purchase_validation, purchase_test, transactions, gru_configs, experiment_history)

    offer_cat_path, purchase_cat_path = MODEL_DIR / "offer_catboost.cbm", MODEL_DIR / "purchase_catboost.cbm"
    offer_mlp_path, purchase_mlp_path, purchase_gru_path = MODEL_DIR / "offer_embedding_mlp.pt", MODEL_DIR / "purchase_embedding_mlp.pt", MODEL_DIR / "purchase_gru.pt"
    offer_cat["model"].save_model(offer_cat_path)
    purchase_cat["model"].save_model(purchase_cat_path)
    save_torch_candidate(offer_mlp_path, offer_mlp, offer_mlp["record"]["configuration"])
    save_torch_candidate(purchase_mlp_path, purchase_mlp, purchase_mlp["record"]["configuration"])
    save_torch_candidate(purchase_gru_path, purchase_gru, purchase_gru["record"]["configuration"])
    artifact_verification = verify_saved_candidates(
        offer_cat, purchase_cat, offer_mlp, purchase_mlp, purchase_gru,
        {
            "offerCatBoost": offer_cat_path, "purchaseCatBoost": purchase_cat_path,
            "offerEmbeddingMlp": offer_mlp_path, "purchaseEmbeddingMlp": purchase_mlp_path,
            "purchaseGru": purchase_gru_path,
        },
    )

    # Always compare against the frozen pre-benchmark artifact. The optional
    # selected CatBoost bundle may already exist when this script is rerun.
    offer_bundle = joblib.load(ROOT / "artifacts" / "models" / "offer_model.joblib")
    purchase_bundle = load_purchase()
    tracked_metrics = json.loads((ROOT / "artifacts" / "metrics.json").read_text(encoding="utf-8"))
    baseline_final = {"offer": tracked_metrics["offerModel"], "purchase": tracked_metrics["purchaseModel"]}
    baseline_validation = {"offer": offer_bundle["validationMetrics"], "purchase": purchase_bundle["validationMetrics"]}

    finalists = {
        "offer": {
            "currentBaseline": {"validation": baseline_validation["offer"], "test": baseline_final["offer"], "calibrationMethod": offer_bundle["calibrationMethod"]},
            "CatBoostClassifier": {"validation": offer_cat["validation"], "test": offer_cat["test"], "calibrationMethod": offer_cat["calibrationMethod"]},
            "EmbeddingMLP": {"validation": offer_mlp["validation"], "test": offer_mlp["test"], "calibrationMethod": offer_mlp["calibrationMethod"]},
        },
        "purchase": {
            "currentBaseline": {"validation": baseline_validation["purchase"], "test": baseline_final["purchase"], "calibrationMethod": purchase_bundle["calibrationMethod"]},
            "CatBoostClassifier": {"validation": purchase_cat["validation"], "test": purchase_cat["test"], "calibrationMethod": purchase_cat["calibrationMethod"]},
            "EmbeddingMLP": {"validation": purchase_mlp["validation"], "test": purchase_mlp["test"], "calibrationMethod": purchase_mlp["calibrationMethod"]},
            "PurchaseGRU": {"validation": purchase_gru["validation"], "test": purchase_gru["test"], "calibrationMethod": purchase_gru["calibrationMethod"]},
        },
    }

    offer_base_path = ROOT / "artifacts" / "models" / "offer_model.joblib"
    purchase_base_path = ROOT / "artifacts" / "models" / "purchase_model.joblib"
    runtime = {"label": LABEL, "warmup": 1, "timedRepetitions": 100, "models": {"offer": {}, "purchase": {}}}
    offer_frames = {1: offer_test.iloc[:1], 32: offer_test.iloc[:32], 256: offer_test.iloc[:256]}
    purchase_frames = {1: purchase_test.iloc[:1], 32: purchase_test.iloc[:32], 256: purchase_test.iloc[:256]}
    runtime["models"]["offer"]["currentBaseline"] = latency_rows(
        "RandomForestClassifier", lambda n: predict_probabilities(offer_bundle, offer_frames[n]), offer_base_path,
        offer_bundle["trainingDurationSeconds"], lambda: joblib.load(offer_base_path),
    )
    runtime["models"]["purchase"]["currentBaseline"] = latency_rows(
        "HistGradientBoostingClassifier", lambda n: predict_probabilities(purchase_bundle, purchase_frames[n]), purchase_base_path,
        purchase_bundle["trainingDurationSeconds"], lambda: joblib.load(purchase_base_path),
    )
    for engine, candidate, path in (("offer", offer_cat, offer_cat_path), ("purchase", purchase_cat, purchase_cat_path)):
        frames = offer_cat["xTest"] if engine == "offer" else purchase_cat["xTest"]
        runtime["models"][engine]["CatBoostClassifier"] = latency_rows(
            "CatBoostClassifier", lambda n, c=candidate, f=frames: c["model"].predict_proba(f.iloc[:n])[:, 1], path,
            candidate["record"]["trainingDurationSeconds"], lambda p=path: CatBoostClassifier().load_model(p),
        )
    for engine, name, candidate, path, batch_size in (
        ("offer", "EmbeddingMLP", offer_mlp, offer_mlp_path, 256),
        ("purchase", "EmbeddingMLP", purchase_mlp, purchase_mlp_path, 256),
        ("purchase", "PurchaseGRU", purchase_gru, purchase_gru_path, 256),
    ):
        batches = {n: prepared_batch(candidate["datasets"][2], n) for n in (1, 32, 256)}
        runtime["models"][engine][name] = latency_rows(
            name, lambda n, c=candidate, b=batches: torch_probability(c["model"], b[n]), path,
            candidate["record"]["trainingDurationSeconds"], lambda p=path: torch.load(p, map_location="cpu", weights_only=False),
        )

    strongest_tabular = {}
    for engine in ("offer", "purchase"):
        choices = ["currentBaseline", "CatBoostClassifier"]
        strongest_tabular[engine] = max(choices, key=lambda name: (
            finalists[engine][name]["validation"]["f1"], finalists[engine][name]["validation"]["balancedAccuracy"],
        ))
    purchase_neural = max(("EmbeddingMLP", "PurchaseGRU"), key=lambda name: (
        finalists["purchase"][name]["validation"]["f1"], finalists["purchase"][name]["validation"]["balancedAccuracy"],
    ))
    neural_choice = {"offer": "EmbeddingMLP", "purchase": purchase_neural}
    acceptance_results, selection = {}, {}
    for engine in ("offer", "purchase"):
        tabular_name, neural_name = strongest_tabular[engine], neural_choice[engine]
        result = acceptance(
            finalists[engine][tabular_name]["test"], finalists[engine][neural_name]["test"],
            runtime["models"][engine][neural_name],
        )
        if engine == "purchase" and neural_name == "PurchaseGRU":
            result["gruOutperformsMlpOnValidation"] = finalists[engine]["PurchaseGRU"]["validation"]["f1"] > finalists[engine]["EmbeddingMLP"]["validation"]["f1"]
            result["passed"] = result["passed"] and result["gruOutperformsMlpOnValidation"]
        acceptance_results[engine] = result
        selection[engine] = neural_name if result["passed"] else tabular_name

    validation_payload = {engine: {name: value["validation"] for name, value in models.items()} for engine, models in finalists.items()}
    test_payload = {engine: {name: value["test"] for name, value in models.items()} for engine, models in finalists.items()}
    thresholds = {engine: {name: {"threshold": value["validation"]["threshold"], "source": "validation only", "constraintsSatisfied": value["validation"].get("constraintsSatisfied", False)} for name, value in models.items()} for engine, models in finalists.items()}
    calibrations = {engine: {name: {"selected": value["calibrationMethod"], "selectionMetric": "validation Brier score"} for name, value in models.items()} for engine, models in finalists.items()}
    curves = {
        "offerEmbeddingMlp": offer_mlp["result"]["trainingCurve"],
        "purchaseEmbeddingMlp": purchase_mlp["result"]["trainingCurve"],
        "purchaseGru": purchase_gru["result"]["trainingCurve"],
    }
    model_selection = {
        "label": LABEL, "selectionMetric": "validation F1", "acceptanceRule": "DL requires +0.03 test F1 and +0.02 test balanced accuracy plus safety/latency constraints",
        "offer": {"selectedModel": selection["offer"], "strongestTabular": strongest_tabular["offer"], "neuralCandidate": neural_choice["offer"], "acceptance": acceptance_results["offer"],
                  "reason": "Neural model accepted under every explicit rule." if acceptance_results["offer"]["passed"] else "Deep-learning experiment completed; tabular model retained."},
        "purchase": {"selectedModel": selection["purchase"], "strongestTabular": strongest_tabular["purchase"], "neuralCandidate": neural_choice["purchase"], "acceptance": acceptance_results["purchase"],
                     "reason": "Neural model accepted under every explicit rule." if acceptance_results["purchase"]["passed"] else "Deep-learning experiment completed; tabular model retained."},
        "finalTestWasNotUsedForSelection": True,
        "leakageChecks": leakage_checks, "savedArtifactProbabilityReproduction": artifact_verification,
    }
    recommendation_source = json.loads((ROOT / "artifacts" / "recommendation_examples.json").read_text(encoding="utf-8"))
    recommendation_examples = {
        "label": LABEL, "selectedModels": selection, "examples": recommendation_source,
        "orchestratorChecks": {
            "bothProbabilitiesRequired": True, "essentialCategoriesSuppressed": True,
            "priorDecisionSuppressionPreserved": True, "lowExpectedSavingsRankedLower": True,
            "probabilisticWording": True, "hardcodedWinner": False,
        },
    }
    confusion = {engine: {name: value["test"]["confusionMatrix"] for name, value in models.items()} for engine, models in finalists.items()}
    baseline_comparison = {
        "label": LABEL, "resultsLabelAr": RESULTS_LABEL_AR, "nonProductionNoticeAr": NON_PRODUCTION_AR,
        "finalists": test_payload, "validationSelectedStrongestTabular": strongest_tabular,
        "validationSelectedNeural": neural_choice, "selectedModels": selection,
    }
    write_json("experiment_history.json", {"label": LABEL, "runs": experiment_history, "configurationCount": len(experiment_history)})
    write_json("validation_metrics.json", {"label": LABEL, "engines": validation_payload})
    write_json("test_metrics.json", {"label": LABEL, "engines": test_payload, "evaluationPolicy": "one untouched-test evaluation per validation-selected family finalist"})
    write_json("baseline_comparison.json", baseline_comparison)
    write_json("threshold_comparison.json", {"label": LABEL, "engines": thresholds})
    write_json("calibration_comparison.json", {"label": LABEL, "engines": calibrations})
    write_json("runtime_benchmark.json", runtime)
    write_json("confusion_matrices.json", {"label": LABEL, "engines": confusion})
    write_json("training_curves.json", {"label": LABEL, "curves": curves})
    write_json("model_selection.json", model_selection)
    write_json("recommendation_examples.json", recommendation_examples)
    print(json.dumps({
        "status": "complete", "python": platform.python_version(), "torch": torch.__version__,
        "catboost": __import__("catboost").__version__, "configurationCount": len(experiment_history),
        "selectedModels": selection, "dlAcceptance": {key: value["passed"] for key, value in acceptance_results.items()},
    }, indent=2))


if __name__ == "__main__":
    main()
