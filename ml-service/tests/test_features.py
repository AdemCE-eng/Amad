import pandas as pd

from app.features import load_data, offer_feature_row, purchase_feature_row
from app.features import OFFER_CATEGORICAL, OFFER_NUMERIC, PURCHASE_CATEGORICAL, PURCHASE_NUMERIC, build_offer_examples, build_purchase_examples
from app.modeling import temporal_split


def test_offer_features_ignore_future_campaigns():
    catalog, campaigns, _ = load_data()
    merchant = catalog.iloc[0]
    as_of = pd.Timestamp("2024-09-01")
    original = offer_feature_row(campaigns, merchant, as_of)
    future = campaigns.iloc[[0]].copy()
    future["merchant_id"] = merchant.merchant_id
    future["start_date"] = as_of + pd.Timedelta(days=60)
    augmented = offer_feature_row(pd.concat([campaigns, future]), merchant, as_of)
    for key in ["campaigns_30d", "campaigns_90d", "campaigns_365d", "same_season_campaigns", "previous_discount_pct"]:
        assert original[key] == augmented[key]


def test_purchase_features_ignore_future_transactions():
    catalog, _, transactions = load_data()
    merchant = catalog[catalog.merchant_id == "half_million"].iloc[0]
    as_of = pd.Timestamp("2025-06-01")
    original = purchase_feature_row(transactions, merchant, "rashid", as_of)
    future = transactions.iloc[[0]].copy()
    future["user_id"], future["merchant_id"] = "rashid", "half_million"
    future["timestamp"] = as_of + pd.Timedelta(days=2)
    augmented = purchase_feature_row(pd.concat([transactions, future]), merchant, "rashid", as_of)
    assert original == augmented


def test_catalog_marks_essential_categories():
    catalog, _, _ = load_data()
    assert catalog[catalog.category.isin(["grocery", "pharmacy"])].is_essential.all()


def test_labels_and_future_fields_are_not_model_features():
    forbidden = {"target", "campaign_id", "start_date", "end_date", "transaction_id", "timestamp"}
    assert forbidden.isdisjoint(OFFER_NUMERIC + OFFER_CATEGORICAL)
    assert forbidden.isdisjoint(PURCHASE_NUMERIC + PURCHASE_CATEGORICAL)


def test_temporal_partitions_do_not_overlap():
    catalog, campaigns, transactions = load_data()
    for examples in [build_offer_examples(campaigns, catalog), build_purchase_examples(transactions, catalog)]:
        train, validation, test, _ = temporal_split(examples)
        assert train.as_of_date.max() < validation.as_of_date.min()
        assert validation.as_of_date.max() < test.as_of_date.min()
