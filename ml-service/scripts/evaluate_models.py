from __future__ import annotations

import json
import numpy as np
from sklearn.inspection import permutation_importance
from sklearn.metrics import accuracy_score, balanced_accuracy_score, brier_score_loss, confusion_matrix, f1_score, precision_score, recall_score, roc_auc_score

from app.features import build_offer_examples, build_purchase_examples, load_data
from app.modeling import predict_probabilities, reliability_bins, temporal_split
from app.offer_model import load_bundle as load_offer
from app.purchase_model import load_bundle as load_purchase
from app.recommender import purchase_patterns, recommendations
from app.settings import ARTIFACT_DIR, DATASET_VERSION, DATA_LABEL, DEMO_AS_OF, RANDOM_SEED, RESULTS_LABEL_AR, ROOT


def rounded(value):
    return round(float(value), 4)


def metrics_for(bundle, test):
    probabilities = predict_probabilities(bundle, test)
    predicted = probabilities >= bundle["threshold"]
    targets = test.target.to_numpy()
    matrix = confusion_matrix(targets, predicted).tolist()
    return {
        "accuracy": rounded(accuracy_score(targets, predicted)),
        "balancedAccuracy": rounded(balanced_accuracy_score(targets, predicted)),
        "precision": rounded(precision_score(targets, predicted, zero_division=0)),
        "recall": rounded(recall_score(targets, predicted, zero_division=0)),
        "f1": rounded(f1_score(targets, predicted, zero_division=0)),
        "rocAuc": rounded(roc_auc_score(targets, probabilities)),
        "brierScore": round(float(brier_score_loss(targets, probabilities)), 6),
        "evaluatedThreshold": float(bundle["threshold"]),
        "positiveRate": rounded(targets.mean()), "predictedPositiveRate": rounded(predicted.mean()),
        "testRows": int(len(test)), "confusionMatrix": matrix, "modelName": bundle["modelName"],
        "trainingDurationSeconds": bundle["trainingDurationSeconds"], "datasetVersion": DATASET_VERSION,
        "randomSeed": RANDOM_SEED, "calibrationMethod": bundle["calibrationMethod"], "temporalSplit": bundle["split"],
        "reliabilityBins": reliability_bins(targets, probabilities),
    }, probabilities, matrix


def top_k_metrics(test, probabilities, k=3):
    scored = test[["user_id", "as_of_date", "target"]].copy()
    scored["probability"] = probabilities
    precisions, hits = [], []
    for _, group in scored.groupby(["user_id", "as_of_date"]):
        top = group.nlargest(k, "probability")
        precisions.append(float(top.target.sum()) / k)
        if group.target.sum() > 0:
            hits.append(float(top.target.sum() > 0))
    return rounded(np.mean(precisions)), rounded(np.mean(hits) if hits else 0)


def feature_importance(bundle, test):
    sample = test.sample(min(2500, len(test)), random_state=RANDOM_SEED)
    result = permutation_importance(bundle["model"], sample[bundle["features"]], sample.target, scoring="roc_auc", n_repeats=3, random_state=RANDOM_SEED, n_jobs=-1)
    pairs = sorted(zip(bundle["features"], result.importances_mean), key=lambda item: item[1], reverse=True)[:14]
    positive = sum(max(0, value) for _, value in pairs) or 1
    return [{"feature": name, "importance": round(max(0, float(value)) / positive, 4)} for name, value in pairs]


def sync_showcase(payloads):
    target = ROOT.parent / "ml-results-showcase" / "generated-results.js"
    target.write_text("window.NADEEM_RESULTS = " + json.dumps(payloads, ensure_ascii=False, indent=2) + ";\n", encoding="utf-8")


def evaluate():
    ARTIFACT_DIR.mkdir(parents=True, exist_ok=True)
    catalog, campaigns, transactions = load_data()
    offer, purchase = load_offer(), load_purchase()
    offer_examples = build_offer_examples(campaigns, catalog)
    purchase_examples = build_purchase_examples(transactions, catalog)
    _, _, offer_test, _ = temporal_split(offer_examples)
    _, _, purchase_test, _ = temporal_split(purchase_examples)
    offer_metrics, offer_probability, offer_matrix = metrics_for(offer, offer_test)
    purchase_metrics, purchase_probability, purchase_matrix = metrics_for(purchase, purchase_test)
    precision3, hit3 = top_k_metrics(purchase_test, purchase_probability)
    purchase_metrics.update({"precisionAt3": precision3, "hitRateAt3": hit3})
    generation = json.loads((ROOT / "data" / "generation_summary.json").read_text(encoding="utf-8"))
    metrics = {"label": RESULTS_LABEL_AR, "dataLabel": DATA_LABEL, "dataset": generation, "offerModel": offer_metrics, "purchaseModel": purchase_metrics}
    matrices = {"label": RESULTS_LABEL_AR, "offerModel": {"labels": ["no campaign", "campaign"], "matrix": offer_matrix}, "purchaseModel": {"labels": ["no purchase", "purchase"], "matrix": purchase_matrix}}
    importance = {"label": RESULTS_LABEL_AR, "offerModel": feature_importance(offer, offer_test), "purchaseModel": feature_importance(purchase, purchase_test)}
    threshold_analysis = {"label": RESULTS_LABEL_AR, "source": "validation only", "offerModel": {"selected": offer["validationMetrics"], "rows": offer["thresholdAnalysis"]}, "purchaseModel": {"selected": purchase["validationMetrics"], "rows": purchase["thresholdAnalysis"]}}
    calibration = {"label": RESULTS_LABEL_AR, "offerModel": {"selected": offer["calibrationMethod"], "validation": offer["calibrationResults"], "finalTestBrier": offer_metrics["brierScore"], "finalTestReliabilityBins": offer_metrics["reliabilityBins"]}, "purchaseModel": {"selected": purchase["calibrationMethod"], "validation": purchase["calibrationResults"], "finalTestBrier": purchase_metrics["brierScore"], "finalTestReliabilityBins": purchase_metrics["reliabilityBins"]}}
    model_comparison = {"label": RESULTS_LABEL_AR, "selectionPeriod": "validation only", "offerModel": offer["candidateResults"], "purchaseModel": purchase["candidateResults"]}
    ranked = recommendations(offer, purchase, campaigns, transactions, catalog, "rashid", DEMO_AS_OF)
    patterns = purchase_patterns(purchase, transactions, catalog, "rashid", DEMO_AS_OF)
    examples = {"label": RESULTS_LABEL_AR, "dataLabel": DATA_LABEL, "userId": "rashid", "recommendations": [item for item in ranked if item["eligible"]][:5], "ranking": ranked, "purchasePatterns": patterns[:8]}
    cycle1_path = ARTIFACT_DIR / "cycle1_metrics.json"
    cycles = []
    if cycle1_path.exists():
        cycle1 = json.loads(cycle1_path.read_text(encoding="utf-8"))
        cycles.append({
            "cycle": 1, "status": "rejected_below_targets", "dataset": cycle1["dataset"],
            "featureChanges": ["expanded probabilistic dataset", "historical campaign recency and trend", "merchant/category occasion interactions", "purchase interval statistics", "loyalty and affinity", "weekend/salary/seasonal behavior"],
            "modelCandidates": ["LogisticRegression", "RandomForestClassifier", "ExtraTreesClassifier", "HistGradientBoostingClassifier", "GradientBoostingClassifier"],
            "validationResultsSource": "cycle1_model_comparison.json and cycle1_threshold_analysis.json",
            "finalTestResults": {"offer": {key: cycle1["offerModel"][key] for key in ["balancedAccuracy", "precision", "recall", "f1", "rocAuc", "brierScore"]}, "purchase": {key: cycle1["purchaseModel"][key] for key in ["balancedAccuracy", "precision", "recall", "f1", "rocAuc", "brierScore"]}},
            "decisionReason": "Rejected because untouched-test F1 and balanced accuracy remained below target; the dataset and test partition were then frozen.",
        })
    cycles.append({
        "cycle": 2, "status": "accepted_best_honest", "dataset": generation,
        "featureChanges": ["merchant seasonal-focus match", "historical occasion share", "campaign due ratio", "purchase due ratio", "overdue days", "expected purchase proximity", "frequency trend", "weekday preference strength"],
        "modelCandidates": [item["modelName"] for item in offer["candidateResults"]],
        "validationResults": {"offer": offer["validationMetrics"], "purchase": purchase["validationMetrics"]},
        "finalTestResults": {"offer": {key: offer_metrics[key] for key in ["balancedAccuracy", "precision", "recall", "f1", "rocAuc", "brierScore"]}, "purchase": {key: purchase_metrics[key] for key in ["balancedAccuracy", "precision", "recall", "f1", "rocAuc", "brierScore"]}},
        "decisionReason": "Accepted as the best honest validation-selected configuration. A third cycle was not run because validation gains were marginal and changing the generator or test partition after observing results would risk test-driven optimization.",
    })
    history = {"label": RESULTS_LABEL_AR, "cycles": cycles}
    payloads = {"metrics": metrics, "featureImportance": importance, "confusionMatrices": matrices, "recommendationExamples": examples, "thresholdAnalysis": threshold_analysis, "calibration": calibration, "modelComparison": model_comparison}
    outputs = {
        "metrics.json": metrics, "feature_importance.json": importance, "confusion_matrices.json": matrices,
        "recommendation_examples.json": examples, "threshold_analysis.json": threshold_analysis,
        "calibration.json": calibration, "model_comparison.json": model_comparison, "optimization_history.json": history,
    }
    for filename, payload in outputs.items():
        (ARTIFACT_DIR / filename).write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    sync_showcase(payloads)
    print(json.dumps(metrics, ensure_ascii=True, indent=2))


if __name__ == "__main__":
    evaluate()
