from __future__ import annotations

import json
import numpy as np
from sklearn.metrics import confusion_matrix, f1_score, precision_score, recall_score, roc_auc_score

from app.features import OFFER_CATEGORICAL, OFFER_NUMERIC, PURCHASE_CATEGORICAL, PURCHASE_NUMERIC, build_offer_examples, build_purchase_examples, load_data
from app.offer_model import load_bundle as load_offer
from app.purchase_model import load_bundle as load_purchase
from app.recommender import purchase_patterns, recommendations
from app.settings import ARTIFACT_DIR, DATA_LABEL, DEMO_AS_OF, OFFER_THRESHOLD, RESULTS_LABEL_AR, ROOT


def scalar(value):
    return round(float(value), 4)


def classification_metrics(y_true, probabilities, threshold):
    predicted = (probabilities >= threshold).astype(int)
    return {
        "precision": scalar(precision_score(y_true, predicted, zero_division=0)),
        "recall": scalar(recall_score(y_true, predicted, zero_division=0)),
        "f1": scalar(f1_score(y_true, predicted, zero_division=0)),
        "rocAuc": scalar(roc_auc_score(y_true, probabilities)),
        "evaluatedThreshold": round(float(threshold), 4),
        "testRows": int(len(y_true)),
        "positiveRate": scalar(np.mean(y_true)),
    }, confusion_matrix(y_true, predicted).tolist()


def top_k_metrics(test, probabilities, k=3):
    scored = test[["user_id", "as_of_date", "target"]].copy()
    scored["probability"] = probabilities
    precisions, hits = [], []
    for _, group in scored.groupby(["user_id", "as_of_date"]):
        top = group.nlargest(k, "probability")
        precisions.append(float(top.target.sum()) / k)
        if group.target.sum() > 0:
            hits.append(float(top.target.sum() > 0))
    return scalar(np.mean(precisions)), scalar(np.mean(hits) if hits else 0)


def feature_importance(bundle, engine):
    pipeline = bundle["model"]
    names = pipeline.named_steps["preprocess"].get_feature_names_out()
    values = pipeline.named_steps["classifier"].feature_importances_
    pairs = sorted(zip(names, values), key=lambda pair: pair[1], reverse=True)[:14]
    return [{"feature": name.replace("numeric__", "").replace("categorical__", ""), "importance": scalar(value)} for name, value in pairs]


def calibration(probabilities, targets):
    bins = []
    for low in np.arange(0, 1, .2):
        mask = (probabilities >= low) & (probabilities < low + .2 if low < .8 else probabilities <= 1)
        if mask.any():
            bins.append({"range": f"{low:.1f}-{min(1, low + .2):.1f}", "meanPrediction": scalar(probabilities[mask].mean()), "observedRate": scalar(targets[mask].mean()), "count": int(mask.sum())})
    return bins


def sync_showcase(payloads):
    target = ROOT.parent / "ml-results-showcase" / "generated-results.js"
    target.write_text("window.NAMO_RESULTS = " + json.dumps(payloads, ensure_ascii=False, indent=2) + ";\n", encoding="utf-8")


def evaluate():
    ARTIFACT_DIR.mkdir(parents=True, exist_ok=True)
    catalog, campaigns, transactions = load_data()
    offer, purchase = load_offer(), load_purchase()
    offer_examples = build_offer_examples(campaigns, catalog)
    purchase_examples = build_purchase_examples(transactions, catalog)
    offer_test = offer_examples[offer_examples.as_of_date > offer["cutoff"]]
    purchase_test = purchase_examples[purchase_examples.as_of_date > purchase["cutoff"]]
    offer_prob = offer["model"].predict_proba(offer_test[OFFER_NUMERIC + OFFER_CATEGORICAL])[:, 1]
    purchase_prob = purchase["model"].predict_proba(purchase_test[PURCHASE_NUMERIC + PURCHASE_CATEGORICAL])[:, 1]
    offer_metrics, offer_matrix = classification_metrics(offer_test.target.to_numpy(), offer_prob, OFFER_THRESHOLD)
    purchase_metrics, purchase_matrix = classification_metrics(purchase_test.target.to_numpy(), purchase_prob, purchase["threshold"])
    precision3, hit3 = top_k_metrics(purchase_test, purchase_prob)
    purchase_metrics.update({"precisionAt3": precision3, "hitRateAt3": hit3})
    offer_metrics["calibrationSummary"] = calibration(offer_prob, offer_test.target.to_numpy())
    metrics = {"label": RESULTS_LABEL_AR, "dataLabel": DATA_LABEL, "offerModel": offer_metrics, "purchaseModel": purchase_metrics}
    matrices = {"label": RESULTS_LABEL_AR, "offerModel": {"labels": ["no campaign", "campaign"], "matrix": offer_matrix}, "purchaseModel": {"labels": ["no purchase", "purchase"], "matrix": purchase_matrix}}
    importance = {"label": RESULTS_LABEL_AR, "offerModel": feature_importance(offer, "offer"), "purchaseModel": feature_importance(purchase, "purchase")}
    ranked = recommendations(offer, purchase, campaigns, transactions, catalog, "rashid", DEMO_AS_OF)
    patterns = purchase_patterns(purchase, transactions, catalog, "rashid", DEMO_AS_OF)
    examples = {"label": RESULTS_LABEL_AR, "dataLabel": DATA_LABEL, "userId": "rashid", "recommendations": [item for item in ranked if item["eligible"]][:5], "ranking": ranked, "purchasePatterns": patterns[:8]}
    payloads = {"metrics": metrics, "featureImportance": importance, "confusionMatrices": matrices, "recommendationExamples": examples}
    for filename, payload in [("metrics.json", metrics), ("feature_importance.json", importance), ("confusion_matrices.json", matrices), ("recommendation_examples.json", examples)]:
        (ARTIFACT_DIR / filename).write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    sync_showcase(payloads)
    # ASCII-escaped console output is portable on Windows code pages; files remain UTF-8 Arabic.
    print(json.dumps(metrics, ensure_ascii=True, indent=2))


if __name__ == "__main__":
    evaluate()
