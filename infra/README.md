# Deployment notes

`cloudrun-api.yaml` is a Cloud Run service template. Replace `REGION`, `PROJECT_ID` and `TAG`, then inject database, Redis and authorized-provider credentials from Secret Manager. Keep `RAILWAY_PROVIDER=simulation` until an authorized integration has passed review.

For production, use Cloud SQL for PostgreSQL/PostGIS, Memorystore for Redis, Artifact Registry for images, and a managed frontend hosting/CDN service. The containers are stateless; WebSocket scale and session policies should be set for the expected workload.
