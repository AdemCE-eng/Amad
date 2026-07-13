from fastapi.testclient import TestClient
from app.main import app


def test_health_and_prediction_endpoints():
    with TestClient(app) as client:
        health = client.get("/health")
        assert health.status_code == 200
        assert health.json()["ready"] is True
        offer = client.post("/v1/offers/predict", json={"merchantId": "half_million", "windowDays": 7})
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


def test_unknown_user_and_merchant_are_rejected():
    with TestClient(app) as client:
        assert client.get("/v1/users/unknown/recommendations").status_code == 404
        assert client.post("/v1/offers/predict", json={"merchantId": "unknown"}).status_code == 404

