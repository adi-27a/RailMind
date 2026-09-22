from pathlib import Path
import joblib
import numpy as np
from .schemas import PredictionInput
from .training import ARTIFACT_PATH, FEATURES, train_and_save

def load_artifact():
    if not Path(ARTIFACT_PATH).exists(): train_and_save()
    return joblib.load(ARTIFACT_PATH)

def feature_vector(payload: PredictionInput) -> np.ndarray:
    weather = {"clear":0,"rain":2,"fog":3,"heat":1}[payload.weather.value]
    period = {"morning_peak":2,"midday":1,"evening_peak":3,"night":0}[payload.departure_period.value]
    return np.array([[payload.historical_delay_minutes,100-payload.reliability,period,payload.day_of_week,weather,payload.rainfall_mm,abs(payload.temperature_c-25),1/payload.visibility_km,payload.congestion,payload.active_alerts,payload.route_distance_km,payload.route_curvature_score]])

def explain(artifact, vector: np.ndarray):
    scaler = artifact["classifier"].named_steps["scale"]; model = artifact["classifier"].named_steps["model"]
    contributions = (scaler.transform(vector)[0] * model.coef_[0])
    ranked = sorted(zip(FEATURES, contributions), key=lambda item: abs(item[1]), reverse=True)[:5]
    return [{"name":name.replace("_", " "),"contribution":round(float(abs(value))*100, 1),"direction":"increases_risk" if value >= 0 else "reduces_risk"} for name,value in ranked]
