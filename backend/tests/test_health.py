import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_endpoint():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "version" in data


def test_integrations_health_endpoint():
    response = client.get("/api/v1/health/integrations")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "integrations" in data


def test_predictions_endpoint():
    payload = {
        "latitude": 11.6854,
        "longitude": 76.1320,
        "rainfall_24h_mm": 140.0,
        "slope_deg": 36.0,
        "soil_moisture": 0.65
    }
    response = client.post("/api/v1/predictions", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "probability" in data
    assert "risk_level" in data
    assert data["risk_level"] in ["LOW", "MODERATE", "HIGH", "VERY HIGH"]
