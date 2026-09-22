# Database

PostgreSQL 16 with PostGIS stores stations, routes, segments, train runs/stops/positions, delays, weather, congestion, alerts, predictions, conversations, data sources and system events.

## Migrations
- `001_initial_schema.sql`: domain schema and PostGIS types/indexes.
- `002_query_indexes.sql`: map, train detail and analytics indexes.
- `003_auth_roles.sql`: `ADMIN`, `OPERATIONS_CONTROLLER`, `ANALYST`, `USER` roles and persistent audit table.

`001_demo_seed.sql` is **DEMO/SIMULATION ONLY**. Docker initializes it with a fresh volume. To reset local data: `docker compose down -v` then `docker compose up --build`.

The simulation provider does not require the database. An authorized ingestion implementation should use the `PostgresRailwayRepository` and `LivePositionCache` adapters, retain source mode, and record data-source freshness.
