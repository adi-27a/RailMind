# RailMind architecture

RailMind is a modular control-centre application:

```text
React/Vite + MapLibre + Recharts
        │ REST / WebSocket
Fastify API (validation, auth boundary, rate limits, audit)
        │
RailwayProvider / WeatherProvider / ML client / assistant tools
        │
PostgreSQL + PostGIS | Redis | FastAPI ML service
```

## Boundaries
- `apps/web` never receives provider or LLM credentials.
- `apps/api` owns input validation, provider selection, WebSocket fan-out, auth and tool grounding.
- `services/ml` owns training/inference and its versioned synthetic-development artifact.
- `database` owns migrations and PostGIS schema.
- `packages/contracts` owns shared domain/API types.

## Data modes
Simulation providers are isolated behind provider interfaces. `simulation` is clearly labelled in every API envelope and UI. Selecting an unimplemented authorized provider fails fast rather than silently serving demo data.

## Real-time
The API broadcasts snapshots and typed train, alert, weather and network events. The browser reconnects with backoff and changes from `LIVE` to `DEGRADED` when updates become stale.
