from fastapi.testclient import TestClient
from app.main import app


def test_health_and_prediction_endpoints():
    with TestClient(app) as client:
        health = client.get("/health")
        assert health.status_code == 200
        assert health.json()["ready"] is True
        assert health.json()["models"]["offer"]["name"] == "CatBoostClassifier"
        assert health.json()["models"]["purchase"]["name"] == "HistGradientBoostingClassifier"
        offer = client.post("/v1/offers/predict", json={"merchantId": "half_million", "windowDays": 3})
        assert offer.status_code == 200
        assert 0 <= offer.json()["offerProbability"] <= 1


def test_rashid_patterns_and_recommendations_use_both_probabilities():
    with TestClient(app) as client:
        patterns = client.get("/v1/users/rashid/purchase-patterns")
        ranked = client.get("/v1/users/rashid/recommendations?includeSuppressed=true")
        assert patterns.status_code == 200 and patterns.json()["patterns"]
        assert ranked.status_code == 200 and ranked.json()["ranking"]
        candidate = ranked.json()["ranking"][0]
        assert "offerProbability" in candidate and "purchaseProbability" in candidate


def test_canonical_recommendation_is_identical_across_three_live_calls():
    with TestClient(app) as client:
        responses = [client.get("/v1/users/rashid/recommendations").json() for _ in range(3)]
        assert responses[0] == responses[1] == responses[2]
        primary = responses[0]["recommendations"][0]
        assert primary["merchantId"] == "half_million"
        assert primary["merchantNameAr"] == "هاف مليون"
        assert primary["occasion"] == "اليوم الوطني السعودي"
        assert primary["action"] == "wait_for_offer"
        assert primary["windowDays"] == 3
        assert primary["estimatedSavingSar"] == 15
        assert primary["offerProbability"] == 0.7222
        assert responses[0]["fixture"] == {"id": "rashid-national-day-v1", "userId": "rashid", "asOfDate": "2026-09-15", "windowDays": 3}


def test_unknown_user_and_merchant_are_rejected():
    with TestClient(app) as client:
        assert client.get("/v1/users/unknown/recommendations").status_code == 404
        assert client.post("/v1/offers/predict", json={"merchantId": "unknown"}).status_code == 404
