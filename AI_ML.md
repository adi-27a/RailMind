# AI and ML

## Delay model
`services/ml` trains a deterministic, interpretable Logistic Regression (delay probability) and Ridge regression (estimated minutes) on **synthetic development data only**. The artifact is generated during Docker build or lazily at local service startup.

Features include historical delay, reliability gap, time/day, weather severity, rainfall, temperature deviation, visibility, congestion, alert count, route distance and curvature. Inference returns factors, model version, timestamp and explicit calibration metadata.

There is no real-world accuracy, calibration, or Indian Railways performance claim. Before production, replace synthetic training with authorized, governed history; evaluate by route/time cohort; calibrate probabilities; register a versioned XGBoost/LightGBM artifact; and monitor drift.

## Assistant
The assistant uses named backend tools for train, station, route, weather, alerts, congestion, alternatives and prediction data. The current response composer is deterministic and grounded; it never fabricates provider facts. A future LLM adapter must remain server-side, receive only approved tool results, and preserve source/freshness disclaimers.
