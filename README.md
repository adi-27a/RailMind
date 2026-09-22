# RailMind — Railway Intelligence Layer

**SEE. PREDICT. ACT.** RailMind is a professional railway intelligence control-centre application built for a safe demo/hackathon workflow. It uses simulation providers by default and **does not claim a connection to Indian Railways**.

> Every simulation surface is labelled **DEMO / SIMULATION DATA**. Never use it for real operational or passenger decisions.

## What is included
- React/Vite control centre, MapLibre India map, responsive dashboards and analytics.
- Fastify REST/WebSocket API with validation, safe errors, CORS allow-list, rate limits and security headers.
- Simulation railway/weather providers behind future authorized-provider interfaces.
- Python FastAPI synthetic-development delay ML model with metadata and explainable factors.
- Grounded assistant tools, operations signals, health checks, role/JWT architecture and audit stream.
- PostgreSQL/PostGIS migrations, Redis cache adapter, Docker Compose and Cloud Run template.

## Run from VS Code on Windows
### Recommended: all containers
```powershell
Copy-Item .env.example .env
docker compose up --build
```
Open `http://localhost:5173`.

### Hot reload frontend/API
```powershell
docker compose up -d postgres redis ml
npm install
npm run dev
```
Open `http://localhost:5173`.

### Verification
```powershell
npm run typecheck
npm run lint
npm test
python -m pip install -r services/ml/requirements-dev.txt
python -m pytest services/ml/app/test_main.py -q
npm run build
```

## Authentication
Authentication is disabled in the public simulation configuration. For a protected demo set `AUTH_ENABLED=true`, `JWT_SECRET` (32+ characters), `AUTH_DEMO_EMAIL`, and `AUTH_DEMO_PASSWORD` in `.env`; then call `POST /api/auth/login`. No credentials are committed.

## Important environment variables
See `.env.example`. Required production secrets are `DATABASE_URL`, `REDIS_URL`, `JWT_SECRET`, and authorized provider credentials. Never use `VITE_` for secrets.

## Documentation
- [Architecture](ARCHITECTURE.md)
- [API](API.md)
- [Database](DATABASE.md)
- [AI/ML](AI_ML.md)
- [Security](SECURITY.md)
- [Deployment](DEPLOYMENT.md)
- [Demo script](DEMO.md)

## Known limitations
The bundled data, weather, alerts, prediction model and assistant responses are simulations. The ML model has no real-world accuracy claim. Docker verification requires Docker Desktop. Production requires authorized railway/weather data, governed historical records, real identity management and a persistent audit pipeline.
