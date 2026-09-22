# Deployment

## Local Windows / VS Code
1. Install Docker Desktop, Node 22+, and Python 3.12+ (optional for direct ML tests).
2. Copy `.env.example` to `.env`.
3. Run `docker compose up --build`.
4. Open `http://localhost:5173`; API is `http://localhost:3000` and ML is `http://localhost:8000`.

For hot reload: `docker compose up -d postgres redis ml`, then `npm install` and `npm run dev`.

## Production
Build images with CI, publish to Artifact Registry, deploy API/ML as separate Cloud Run services, use Cloud SQL PostgreSQL/PostGIS and Memorystore Redis in private networking, and host the static web image behind TLS/CDN. Inject `DATABASE_URL`, `REDIS_URL`, provider credentials and `JWT_SECRET` from Secret Manager.

Set `AUTH_ENABLED=true`, unique `JWT_SECRET`, explicit `WEB_ORIGIN`, `NODE_ENV=production`, and production rate limits. Do not use the demo account or simulation mode for real operational decisions.
