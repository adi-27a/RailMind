-- RailMind role architecture. Authentication tokens are managed by the API; users and role assignments persist here when database auth is enabled.
INSERT INTO roles (name, description) VALUES
  ('ADMIN', 'Manages configuration, users and audit review'),
  ('OPERATIONS_CONTROLLER', 'Reviews operational alerts and control workflows'),
  ('ANALYST', 'Reads analytics and prediction outputs'),
  ('USER', 'Uses passenger-facing intelligence features')
ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description;

CREATE TABLE IF NOT EXISTS auth_audit_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  action text NOT NULL,
  outcome text NOT NULL CHECK (outcome IN ('success', 'failure')),
  detail text NOT NULL,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  source_ip inet
);
CREATE INDEX IF NOT EXISTS auth_audit_events_time_idx ON auth_audit_events(occurred_at DESC);
