from app.features import load_data
from app.offer_model import load_bundle as load_offer
from app.purchase_model import load_bundle as load_purchase
from app.recommender import recommendations
from app.settings import DEMO_AS_OF


def get_ranking():
    catalog, campaigns, transactions = load_data()
    return recommendations(load_offer(), load_purchase(), campaigns, transactions, catalog, "rashid", DEMO_AS_OF)


def test_ranking_is_deterministic():
    assert get_ranking() == get_ranking()


def test_essential_purchases_never_receive_delay_advice():
    essential = [item for item in get_ranking() if item["category"] in {"grocery", "pharmacy"}]
    assert essential
    assert all(not item["eligible"] and item["suppressionReason"] == "essential_purchase" for item in essential)


def test_high_offer_low_affinity_does_not_beat_relevant_candidate():
    ranking = get_ranking()
    relevant = next(item for item in ranking if item["merchantId"] == "half_million")
    low_affinity = next(item for item in ranking if item["merchantId"] == "noon_saudi")
    assert relevant["purchaseProbability"] > low_affinity["purchaseProbability"]
    assert relevant["personalizedScore"] > low_affinity["personalizedScore"]


def test_high_affinity_merchant_without_offer_is_not_recommended():
    flynas = next(item for item in get_ranking() if item["merchantId"] == "flynas")
    assert flynas["purchaseProbability"] >= load_purchase()["threshold"]
    assert flynas["offerProbability"] < load_offer()["threshold"]
    assert not flynas["eligible"]


def test_previously_dismissed_recommendation_is_not_repeated():
    catalog, campaigns, transactions = load_data()
    ranking = recommendations(load_offer(), load_purchase(), campaigns, transactions, catalog, "rashid", DEMO_AS_OF, decisions={"half_million"})
    dismissed = next(item for item in ranking if item["merchantId"] == "half_million")
    assert not dismissed["eligible"]
    assert dismissed["suppressionReason"] == "prior_decision"
