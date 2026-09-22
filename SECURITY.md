# Security

- `.env`, local virtual environments, node modules and Python caches are ignored. Do not commit credentials.
- Browser code only reads `VITE_API_URL`; provider, ML, database and JWT secrets are server-side environment variables.
- Fastify applies allow-list CORS, rate limiting, Helmet headers, safe errors and WebSocket origin checks.
- All API payloads/parameters are validated with Zod; ML payloads use Pydantic.
- Auth supports JWT roles: `ADMIN`, `OPERATIONS_CONTROLLER`, `ANALYST`, `USER`. Enable it with a 32+ character `JWT_SECRET`; demo credentials are environment-only.
- Protected audit endpoint records authentication/authorization actions in a bounded demo audit stream. Persist to `auth_audit_events` in production.
- Docker API/ML containers run non-root. Set `TRUST_PROXY=true` only behind a trusted proxy.

Before deployment: use Secret Manager, TLS, private database/Redis networking, least-privilege service accounts, password hashing/real identity provider, persistent audit sink, dependency scanning, backups and incident monitoring.
