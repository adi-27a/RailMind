"""RailMind ML inference service. All bundled training data is synthetic development data."""
from fastapi import FastAPI
from .model import explain, feature_vector, load_artifact
from .schemas import PredictionInput, PredictionResponse, now
app = FastAPI(title="RailMind ML", version="0.2.0")

@app.get("/health")
def health():
    artifact = load_artifact(); return {"status":"ok","model":artifact["metadata"]["model"],"model_version":artifact["metadata"]["model_version"],"mode":"simulation","training_data":"synthetic development only"}

@app.get("/v1/models/delay/metadata")
def metadata(): return load_artifact()["metadata"]

@app.post("/v1/predict/delay", response_model=PredictionResponse)
def predict(payload: PredictionInput):
    artifact = load_artifact(); vector = feature_vector(payload); probability = float(artifact["classifier"].predict_proba(vector)[0][1]); minutes = max(0, int(round(float(artifact["regressor"].predict(vector)[0])))); level = "high" if probability >= .65 else "moderate" if probability >= .35 else "low"
    return PredictionResponse(delay_probability=round(probability,4),risk_score=round(probability*100,1),risk_level=level,estimated_delay_minutes=minutes,confidence=round(min(.70, .45 + abs(probability-.5)*.5),2),calibration={"method":"uncalibrated synthetic development baseline","note":"No real-world calibration or accuracy claim.","isSyntheticDevelopmentModel":True},factors=explain(artifact,vector),model=artifact["metadata"]["model"],model_version=artifact["metadata"]["model_version"],predicted_at=now())
