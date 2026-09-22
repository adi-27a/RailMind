from datetime import datetime, timezone
from enum import Enum
from pydantic import BaseModel, Field

class Weather(str, Enum): clear="clear"; rain="rain"; fog="fog"; heat="heat"
class Period(str, Enum): morning_peak="morning_peak"; midday="midday"; evening_peak="evening_peak"; night="night"
class PredictionInput(BaseModel):
    origin_code: str = Field(min_length=2, max_length=10)
    destination_code: str = Field(min_length=2, max_length=10)
    weather: Weather
    congestion: float = Field(ge=0, le=100)
    reliability: float = Field(ge=0, le=100)
    departure_period: Period
    historical_delay_minutes: float = Field(default=5, ge=0, le=600)
    day_of_week: int = Field(default=1, ge=0, le=6)
    rainfall_mm: float = Field(default=0, ge=0, le=500)
    temperature_c: float = Field(default=25, ge=-20, le=65)
    visibility_km: float = Field(default=10, ge=0.05, le=100)
    active_alerts: int = Field(default=0, ge=0, le=100)
    route_distance_km: float = Field(default=500, ge=1, le=5000)
    route_curvature_score: float = Field(default=30, ge=0, le=100)

class Factor(BaseModel): name: str; contribution: float; direction: str
class PredictionResponse(BaseModel):
    delay_probability: float
    risk_score: float
    risk_level: str
    estimated_delay_minutes: int
    confidence: float
    calibration: dict[str, object]
    factors: list[Factor]
    model: str
    model_version: str
    predicted_at: datetime
    source: str = "simulation"

def now() -> datetime: return datetime.now(timezone.utc)
