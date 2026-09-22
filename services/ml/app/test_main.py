from fastapi.testclient import TestClient
from .main import app
client = TestClient(app)
BASE = {'origin_code':'NDLS','destination_code':'MMCT','weather':'rain','congestion':70,'reliability':65,'departure_period':'evening_peak'}
def test_predicts_with_synthetic_metadata():
    response = client.post('/v1/predict/delay', json=BASE)
    assert response.status_code == 200
    body = response.json()
    assert 0 <= body['delay_probability'] <= 1
    assert body['calibration']['isSyntheticDevelopmentModel'] is True
    assert body['factors']
def test_rejects_invalid_congestion():
    response = client.post('/v1/predict/delay', json={**BASE,'congestion':101})
    assert response.status_code == 422
