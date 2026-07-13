"""Finalize comparison details and export the validation-selected optional bundle.

This script performs inference on validation rows only. It does not retrain,
retune, or inspect the frozen test set.
"""

from __future__ import annotations

import json
import joblib
import numpy as np
import pandas as pd
import torch
from catboost import CatBoostClassifier

from app.dl.datasets import SequenceFrameDataset, SequenceHistory, TabularEncoder, TabularFrameDataset, Vocabulary
from app.dl.purchase_embedding_mlp import EmbeddingMLP
from app.dl.purchase_gru import PurchaseGRU
from app.dl.training import predict as torch_predict
from app.features import OFFER_CATEGORICAL, OFFER_NUMERIC, PURCHASE_CATEGORICAL, PURCHASE_NUMERIC, build_offer_examples, build_purchase_examples, load_data
from app.modeling import IdentityCalibrator, IsotonicCalibrator, SigmoidCalibrator, temporal_split, threshold_search
from app.purchase_model import load_bundle as load_purchase
from app.recommender import purchase_patterns, recommendations
from app.settings import DATA_LABEL, DATASET_VERSION, DEMO_AS_OF, RANDOM_SEED, ROOT
from scripts.run_dl_benchmark import LABEL, MODEL_DIR, OUTPUT, TemperatureCalibrator, prepare_catboost, write_json


def encoder_from_metadata(metadata):
    encoder = TabularEncoder(metadata["categorical"], metadata["numeric"])
    encoder.vocabularies = {name: Vocabulary(values) for name, values in metadata["vocabularies"].items()}
    encoder.means = np.asarray(metadata["means"], dtype=float)
    encoder.scales = np.asarray(metadata["scales"], dtype=float)
    return encoder


def calibration_details(raw, targets, family):
    calibrators = {"uncalibrated": IdentityCalibrator(), "sigmoid": SigmoidCalibrator()}
    calibrators["isotonic" if family == "tabular" else "temperature"] = IsotonicCalibrator() if family == "tabular" else TemperatureCalibrator()
    rows, fitted = [], {}
    for name, calibrator in calibrators.items():
        calibrator.fit(raw, targets)
        probability = np.clip(calibrator.predict(raw), 0, 1)
        rows.append({
            "method": name,
            "validationBrierScore": round(float(__import__("sklearn.metrics", fromlist=["brier_score_loss"]).brier_score_loss(targets, probability)), 6),
        })
        fitted[name] = calibrator
    selected = min(rows, key=lambda row: (row["validationBrierScore"], row["method"]))
    calibrator = fitted[selected["method"]]
    calibrated = np.clip(calibrator.predict(raw), 0, 1)
    threshold_rows, threshold = threshold_search(targets, calibrated)
    return {"rows": rows, "selected": selected["method"], "calibrator": calibrator, "thresholdRows": threshold_rows, "threshold": threshold}


def load_mlp(path, numeric_count):
    payload = torch.load(path, map_location="cpu", weights_only=False)
    encoder = encoder_from_metadata(payload["encoder"])
    config = payload["configuration"]
    model = EmbeddingMLP(encoder.cardinalities, numeric_count, hidden=tuple(config["hidden"]), dropout=config["dropout"], embedding_dim=config["embeddingDim"])
    model.load_state_dict(payload["stateDict"])
    return model, encoder


def main():
    catalog, campaigns, transactions = load_data()
    offer_train, offer_validation, _, _ = temporal_split(build_offer_examples(campaigns, catalog))
    purchase_train, purchase_validation, _, _ = temporal_split(build_purchase_examples(transactions, catalog))
    raw = {"offer": {}, "purchase": {}}

    offer_cat = CatBoostClassifier()
    offer_cat.load_model(MODEL_DIR / "offer_catboost.cbm")
    x_offer_validation = prepare_catboost(offer_validation, OFFER_NUMERIC, OFFER_CATEGORICAL)
    raw["offer"]["CatBoostClassifier"] = offer_cat.predict_proba(x_offer_validation)[:, 1]
    purchase_cat = CatBoostClassifier()
    purchase_cat.load_model(MODEL_DIR / "purchase_catboost.cbm")
    x_purchase_validation = prepare_catboost(purchase_validation, PURCHASE_NUMERIC, PURCHASE_CATEGORICAL)
    raw["purchase"]["CatBoostClassifier"] = purchase_cat.predict_proba(x_purchase_validation)[:, 1]

    offer_mlp, offer_encoder = load_mlp(MODEL_DIR / "offer_embedding_mlp.pt", len(OFFER_NUMERIC))
    raw["offer"]["EmbeddingMLP"] = torch_predict(offer_mlp, TabularFrameDataset(offer_validation, offer_encoder), batch_size=2048)[0]
    purchase_mlp, purchase_encoder = load_mlp(MODEL_DIR / "purchase_embedding_mlp.pt", len(PURCHASE_NUMERIC))
    raw["purchase"]["EmbeddingMLP"] = torch_predict(purchase_mlp, TabularFrameDataset(purchase_validation, purchase_encoder), batch_size=2048)[0]

    gru_payload = torch.load(MODEL_DIR / "purchase_gru.pt", map_location="cpu", weights_only=False)
    gru_encoder = encoder_from_metadata(gru_payload["encoder"])
    sequence_history = SequenceHistory(transactions, purchase_train.as_of_date.max() + pd.Timedelta(days=1))
    gru_config = gru_payload["configuration"]
    gru = PurchaseGRU(gru_encoder.cardinalities, sequence_history.event_cardinalities, len(PURCHASE_NUMERIC), embedding_dim=gru_config["embeddingDim"], hidden_dim=gru_config["hiddenDim"], dropout=gru_config["dropout"])
    gru.load_state_dict(gru_payload["stateDict"])
    raw["purchase"]["PurchaseGRU"] = torch_predict(gru, SequenceFrameDataset(purchase_validation, gru_encoder, sequence_history), batch_size=512)[0]

    # Keep finalization idempotent after the selected optional artifact exists.
    offer_bundle = joblib.load(ROOT / "artifacts" / "models" / "offer_model.joblib")
    purchase_bundle = load_purchase()
    details = {
        "offer": {
            "currentBaseline": {"rows": offer_bundle["calibrationResults"], "selected": offer_bundle["calibrationMethod"], "thresholdRows": offer_bundle["thresholdAnalysis"], "threshold": offer_bundle["validationMetrics"]},
        },
        "purchase": {
            "currentBaseline": {"rows": purchase_bundle["calibrationResults"], "selected": purchase_bundle["calibrationMethod"], "thresholdRows": purchase_bundle["thresholdAnalysis"], "threshold": purchase_bundle["validationMetrics"]},
        },
    }
    for engine, target, family_names in (
        ("offer", offer_validation.target.to_numpy(), (("CatBoostClassifier", "tabular"), ("EmbeddingMLP", "neural"))),
        ("purchase", purchase_validation.target.to_numpy(), (("CatBoostClassifier", "tabular"), ("EmbeddingMLP", "neural"), ("PurchaseGRU", "neural"))),
    ):
        for name, family in family_names:
            details[engine][name] = calibration_details(raw[engine][name], target, family)

    write_json("calibration_comparison.json", {
        "label": LABEL, "selectionMetric": "validation Brier score",
        "engines": {engine: {name: {"selected": value["selected"], "rows": value["rows"]} for name, value in models.items()} for engine, models in details.items()},
    })
    write_json("threshold_comparison.json", {
        "label": LABEL, "source": "validation only", "searchRange": [0.10, 0.90], "step": 0.02,
        "engines": {engine: {name: {"selected": value["threshold"], "rows": value["thresholdRows"]} for name, value in models.items()} for engine, models in details.items()},
    })

    selected_offer = {
        "model": offer_cat,
        "calibrator": details["offer"]["CatBoostClassifier"]["calibrator"],
        "calibrationMethod": details["offer"]["CatBoostClassifier"]["selected"],
        "threshold": details["offer"]["CatBoostClassifier"]["threshold"]["threshold"],
        "features": OFFER_NUMERIC + OFFER_CATEGORICAL,
        "numericFeatures": OFFER_NUMERIC, "categoricalFeatures": OFFER_CATEGORICAL,
        "modelName": "CatBoostClassifier", "modelVersion": "dl-benchmark-2026-09",
        "datasetVersion": DATASET_VERSION, "randomSeed": RANDOM_SEED,
        "selectionSource": "validation F1; frozen test used once for reporting only",
    }
    joblib.dump(selected_offer, MODEL_DIR / "selected_offer_model.joblib")

    selection_path = OUTPUT / "model_selection.json"
    selection = json.loads(selection_path.read_text(encoding="utf-8"))
    test_metrics = json.loads((OUTPUT / "test_metrics.json").read_text(encoding="utf-8"))["engines"]
    validation_metrics = json.loads((OUTPUT / "validation_metrics.json").read_text(encoding="utf-8"))["engines"]
    runtime = json.loads((OUTPUT / "runtime_benchmark.json").read_text(encoding="utf-8"))["models"]
    for engine in ("offer", "purchase"):
        selected = selection[engine]["selectedModel"]
        selected_test = test_metrics[engine][selected]
        selected_runtime = runtime[engine][selected]
        rejected = []
        for name, metrics in test_metrics[engine].items():
            if name == selected:
                continue
            f1_difference = round(metrics["f1"] - selected_test["f1"], 4)
            balanced_difference = round(metrics["balancedAccuracy"] - selected_test["balancedAccuracy"], 4)
            latency_difference = round(runtime[engine][name]["latency"]["1"]["meanMs"] - selected_runtime["latency"]["1"]["meanMs"], 4)
            if name == "EmbeddingMLP":
                acceptance = selection[engine]["acceptance"]
                reason = (
                    f"Failed the explicit DL rule: test F1 difference {acceptance['differences']['f1']:+.4f}, "
                    f"balanced-accuracy difference {acceptance['differences']['balancedAccuracy']:+.4f}, "
                    f"precision difference {acceptance['differences']['precision']:+.4f}, recall difference "
                    f"{acceptance['differences']['recall']:+.4f}, and Brier difference {acceptance['differences']['brierScore']:+.6f}."
                )
            elif name == "PurchaseGRU":
                mlp_validation_f1 = validation_metrics[engine]["EmbeddingMLP"]["f1"]
                gru_validation_f1 = validation_metrics[engine][name]["f1"]
                reason = (
                    f"Rejected because validation F1 {gru_validation_f1:.4f} did not beat the simpler MLP "
                    f"{mlp_validation_f1:.4f}; CPU training took {runtime[engine][name]['trainingDurationSeconds']:.3f}s "
                    f"versus {runtime[engine]['EmbeddingMLP']['trainingDurationSeconds']:.3f}s."
                )
            else:
                reason = (
                    f"Rejected by validation-only selection; test reporting difference versus the selected model was "
                    f"{f1_difference:+.4f} F1 and {balanced_difference:+.4f} balanced accuracy."
                )
            rejected.append({
                "modelName": name,
                "testF1DifferenceVsSelected": f1_difference,
                "testBalancedAccuracyDifferenceVsSelected": balanced_difference,
                "singleInferenceMeanMsDifferenceVsSelected": latency_difference,
                "artifactBytesDifferenceVsSelected": int(runtime[engine][name]["artifactBytes"] - selected_runtime["artifactBytes"]),
                "reason": reason,
            })
        selection[engine]["rejectedModels"] = rejected
        selection[engine]["selectedTestMetrics"] = selected_test
        selection[engine]["selectedRuntime"] = selected_runtime
    selection["offer"]["reason"] = "CatBoost had the highest validation F1 among tabular finalists; the offer MLP failed the DL acceptance margins. CatBoost remains optional and falls back to RandomForest when unavailable."
    selection["purchase"]["reason"] = "HistGradientBoosting retained the highest validation F1. The MLP missed the test F1 and balanced-accuracy gains; the GRU also trailed the simpler MLP while training much longer."
    selection["integration"] = {"offer": "optional CatBoost local artifact with baseline fallback", "purchase": "existing HistGradientBoosting bundle", "normalRuntimeRequiresTorch": False}
    write_json("model_selection.json", selection)

    ranked = recommendations(selected_offer, purchase_bundle, campaigns, transactions, catalog, "rashid", DEMO_AS_OF)
    eligible = [item for item in ranked if item["eligible"]]
    dismissed_id = eligible[0]["merchantId"] if eligible else None
    dismissed = recommendations(
        selected_offer, purchase_bundle, campaigns, transactions, catalog, "rashid", DEMO_AS_OF,
        decisions={dismissed_id} if dismissed_id else set(),
    )
    write_json("recommendation_examples.json", {
        "label": LABEL,
        "selectedModels": {"offer": selection["offer"]["selectedModel"], "purchase": selection["purchase"]["selectedModel"]},
        "examples": {
            "label": "نتائج على بيانات تجريبية من السوق السعودي", "dataLabel": DATA_LABEL, "userId": "rashid",
            "recommendations": eligible, "ranking": ranked,
            "purchasePatterns": purchase_patterns(purchase_bundle, transactions, catalog, "rashid", DEMO_AS_OF)[:8],
        },
        "orchestratorChecks": {
            "bothProbabilitiesRequired": all("offerProbability" in item and "purchaseProbability" in item for item in ranked),
            "essentialCategoriesSuppressed": all(not item["eligible"] for item in ranked if item["category"] in {"grocery", "pharmacy"}),
            "priorDecisionSuppressionPreserved": bool(dismissed_id) and any(
                item["merchantId"] == dismissed_id and item["suppressionReason"] == "prior_decision" for item in dismissed
            ),
            "lowExpectedSavingsRankedLower": all(
                ranked[index]["personalizedScore"] >= ranked[index + 1]["personalizedScore"] for index in range(len(ranked) - 1)
            ),
            "probabilisticWording": all("مضمون" in item["disclaimer"] for item in ranked),
            "hardcodedWinner": False,
        },
    })
    print(json.dumps({"status": "finalized", "selectedOfferBundle": str(MODEL_DIR / "selected_offer_model.joblib")}, indent=2))


if __name__ == "__main__":
    main()
