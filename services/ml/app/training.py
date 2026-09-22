"""Training pipeline for a synthetic-development-only interpretable baseline.
The generated records do not represent Indian railway history and must never be used to claim real accuracy.
"""
from datetime import datetime, timezone
import json
from pathlib import Path
import joblib
import numpy as np
from sklearn.linear_model import LogisticRegression, Ridge
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

FEATURES = ["historical_delay_minutes","reliability_gap","time_of_day","day_of_week","weather_severity","rainfall_mm","temperature_extreme","visibility_inverse","congestion","active_alerts","route_distance_km","route_curvature_score"]
ARTIFACT_DIR = Path(__file__).parent / "artifacts"
ARTIFACT_PATH = ARTIFACT_DIR / "delay_baseline.joblib"
METADATA_PATH = ARTIFACT_DIR / "delay_baseline.metadata.json"

def synthetic_training_data(rows: int = 4000, seed: int = 2025):
    rng = np.random.default_rng(seed)
    historical = rng.gamma(2.2, 5, rows); reliability_gap = rng.uniform(0, 45, rows); time = rng.integers(0, 4, rows)
    day = rng.integers(0, 7, rows); weather = rng.integers(0, 4, rows); rain = rng.gamma(1.2, 8, rows)
    temperature_extreme = np.abs(rng.normal(27, 9, rows) - 25); visibility_inverse = 1 / rng.uniform(0.5, 20, rows)
    congestion = rng.uniform(5, 95, rows); alerts = rng.poisson(1.4, rows); distance = rng.uniform(80, 2500, rows); curvature = rng.uniform(5, 90, rows)
    matrix = np.column_stack([historical,reliability_gap,time,day,weather,rain,temperature_extreme,visibility_inverse,congestion,alerts,distance,curvature])
    synthetic_logit = -4.1 + historical*.055 + reliability_gap*.035 + time*.20 + weather*.45 + rain*.018 + visibility_inverse*1.8 + congestion*.027 + alerts*.28 + distance*.00022 + curvature*.012
    probability = 1 / (1 + np.exp(-synthetic_logit)); label = rng.binomial(1, probability)
    delay_minutes = np.maximum(0, historical*.45 + congestion*.12 + rain*.09 + alerts*3 + weather*2 + label*13 + rng.normal(0, 2.5, rows))
    return matrix, label, delay_minutes

def train_and_save() -> dict:
    X, label, delay_minutes = synthetic_training_data()
    classifier = Pipeline([("scale", StandardScaler()), ("model", LogisticRegression(max_iter=1000, random_state=2025))])
    regressor = Pipeline([("scale", StandardScaler()), ("model", Ridge(alpha=2.0))])
    classifier.fit(X, label); regressor.fit(X, delay_minutes)
    metadata = {"model":"synthetic-interpretable-logistic-ridge","model_version":"0.2.0-synthetic-dev","trained_at":datetime.now(timezone.utc).isoformat(),"training_data":"synthetic development data only","accuracy_note":"No real-world accuracy or calibration claim. Validate on authorized historical data before production.","features":FEATURES,"calibration":"uncalibrated synthetic development baseline"}
    ARTIFACT_DIR.mkdir(parents=True, exist_ok=True); joblib.dump({"classifier":classifier,"regressor":regressor,"metadata":metadata}, ARTIFACT_PATH); METADATA_PATH.write_text(json.dumps(metadata, indent=2), encoding="utf-8")
    return metadata
if __name__ == "__main__": train_and_save()
