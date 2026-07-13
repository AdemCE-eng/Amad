from sklearn.base import is_classifier
import pytest

from app.features import load_data
from app.offer_model import load_bundle as load_offer, predict_offer
from app.purchase_model import load_bundle as load_purchase, predict_purchase
from app.settings import DEMO_AS_OF


def test_saved_artifacts_are_fitted_classifiers():
    assert is_classifier(load_offer()["model"].named_steps["classifier"])
    assert is_classifier(load_purchase()["model"].named_steps["classifier"])


def test_model_probabilities_are_bounded_and_repeatable():
    catalog, campaigns, transactions = load_data()
    merchant = catalog[catalog.merchant_id == "half_million"].iloc[0]
    offer = load_offer()
    purchase = load_purchase()
    first_offer = predict_offer(offer, campaigns, merchant, DEMO_AS_OF)[1]
    second_offer = predict_offer(offer, campaigns, merchant, DEMO_AS_OF)[1]
    first_purchase = predict_purchase(purchase, transactions, merchant, "rashid", DEMO_AS_OF)[1]
    assert 0 <= first_offer <= 1
    assert 0 <= first_purchase <= 1
    assert first_offer == pytest.approx(second_offer, abs=1e-12)
