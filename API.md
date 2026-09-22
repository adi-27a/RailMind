# RailMind API

Base URL: `http://localhost:3000`. All standard responses are `{ data, meta }`; simulation responses have `meta.source = "simulation"`.

## Core
| Method | Path | Purpose |
|---|---|---|
| GET | `/api/health`, `/api/system/health` | Dependency and platform health |
| GET | `/api/trains`, `/api/trains/live`, `/api/trains/:trainNumber` | Train search, feed, detail |
| GET | `/api/stations`, `/api/stations/:code` | Stations |
| GET | `/api/routes`, `/api/routes/:id` | Routes |
| GET | `/api/alerts`, `/api/alerts/:id` | Provider and derived signals |
| GET | `/api/analytics/overview`, `/api/analytics/delays` | Analytics |
| GET | `/api/weather/current`, `/forecast`, `/stations/:code`, `/routes/:id`, `/regions/:region`, `/location` | Weather intelligence |
| POST | `/api/predictions/delay` | Context-enriched Python ML inference |
| POST | `/api/assistant/messages` | Grounded assistant response |
| GET/DELETE | `/api/assistant/conversations/:id` | Conversation history / clear |

`/ws` emits `snapshot`, train position/status, metrics, alert and weather events.

## Authentication
When `AUTH_ENABLED=true`, `POST /api/auth/login` returns a JWT, `GET /api/auth/me` validates it, and `GET /api/admin/audit-events` requires `ADMIN`. Send `Authorization: Bearer <token>`.

All write/query inputs use Zod validation. Invalid input returns 400, unknown resources return 404, unavailable ML returns 503, and unexpected server errors return a safe 500 body.
