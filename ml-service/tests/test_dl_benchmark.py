import json
from pathlib import Path

import numpy as np
import pandas as pd
import pytest

torch = pytest.importorskip("torch")

from app.dl.datasets import SequenceHistory, TabularEncoder
from app.features import OFFER_CATEGORICAL, OFFER_NUMERIC, PURCHASE_CATEGORICAL, PURCHASE_NUMERIC
from app.modeling import temporal_split


def test_tabular_encoder_is_train_only_and_unknown_safe():
    train = pd.DataFrame({"merchant_id": ["a", "b"], "value": [1.0, 3.0]})
    encoder = TabularEncoder(["merchant_id"], ["value"]).fit(train)
    cats, nums = encoder.transform(pd.DataFrame({"merchant_id": ["future"], "value": [5.0]}))
    assert cats[0, 0] == 0
    assert encoder.means.tolist() == [2.0]
    assert nums[0, 0] == pytest.approx(3.0)


def test_sequence_history_excludes_events_at_or_after_prediction_time():
    transactions = pd.DataFrame({
        "user_id": ["rashid"] * 3,
        "merchant_id": ["half_million", "barns", "albaik"],
        "category": ["coffee", "coffee", "restaurant"],
        "city": ["Riyadh"] * 3,
        "amount_sar": [20.0, 22.0, 30.0],
        "timestamp": pd.to_datetime(["2026-01-01", "2026-01-02", "2026-01-03"]),
        "time_period": ["evening"] * 3,
        "is_essential": [False] * 3,
    })
    history = SequenceHistory(transactions, pd.Timestamp("2026-01-03"))
    categorical, _, length = history.encode("rashid", pd.Timestamp("2026-01-02"), max_length=5)
    assert length == 1
    assert categorical[0, 0] == history.merchant_vocab.encode("half_million")
    assert not np.any(categorical[:, 0] == history.merchant_vocab.encode("barns"))


def test_temporal_split_is_strict_and_model_inputs_exclude_labels():
    frame = pd.DataFrame({
        "as_of_date": pd.date_range("2025-01-01", periods=20, freq="7D"),
        "target": [0, 1] * 10,
    })
    train, validation, test, _ = temporal_split(frame)
    assert train.as_of_date.max() < validation.as_of_date.min() < test.as_of_date.min()
    assert "target" not in OFFER_NUMERIC + OFFER_CATEGORICAL
    assert "target" not in PURCHASE_NUMERIC + PURCHASE_CATEGORICAL


def test_generated_manifest_freezes_identical_test_hashes_when_available():
    path = Path(__file__).resolve().parents[1] / "artifacts" / "dl-benchmark" / "dataset_manifest.json"
    if not path.exists():
        pytest.skip("benchmark has not been run")
    manifest = json.loads(path.read_text(encoding="utf-8"))
    assert manifest["frozenAcrossFamilies"] is True
    assert len(manifest["engines"]["offer"]["testSha256"]) == 64
    assert len(manifest["engines"]["purchase"]["testSha256"]) == 64


def test_benchmark_selection_artifacts_are_validation_only_and_reproducible():
    root = Path(__file__).resolve().parents[1] / "artifacts" / "dl-benchmark"
    selection = json.loads((root / "model_selection.json").read_text(encoding="utf-8"))
    thresholds = json.loads((root / "threshold_comparison.json").read_text(encoding="utf-8"))
    calibration = json.loads((root / "calibration_comparison.json").read_text(encoding="utf-8"))

    assert selection["finalTestWasNotUsedForSelection"] is True
    assert thresholds["source"] == "validation only"
    for engine in thresholds["engines"].values():
        for model in engine.values():
            selected_threshold = model["selected"]["threshold"]
            assert selected_threshold in [row["threshold"] for row in model["rows"]]

    assert calibration["selectionMetric"] == "validation Brier score"
    for engine in calibration["engines"].values():
        for model in engine.values():
            selected = next(row for row in model["rows"] if row["method"] == model["selected"])
            assert selected["validationBrierScore"] == min(row["validationBrierScore"] for row in model["rows"])

    assert all(selection["savedArtifactProbabilityReproduction"].values())
