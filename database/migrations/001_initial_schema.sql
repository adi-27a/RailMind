-- RailMind foundation schema. All seeded rows are DEMO/SIMULATION data.
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE data_mode AS ENUM ('simulation', 'authorized');
CREATE TYPE train_status AS ENUM ('scheduled', 'running', 'on_time', 'at_risk', 'delayed', 'cancelled', 'completed');
CREATE TYPE severity AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE alert_status AS ENUM ('open', 'acknowledged', 'resolved');

CREATE TABLE roles (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text UNIQUE NOT NULL, description text, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE users (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), email text UNIQUE NOT NULL, display_name text NOT NULL, password_hash text, is_active boolean NOT NULL DEFAULT true, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE user_roles (user_id uuid REFERENCES users(id) ON DELETE CASCADE, role_id uuid REFERENCES roles(id) ON DELETE CASCADE, PRIMARY KEY (user_id, role_id));
CREATE TABLE data_sources (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text UNIQUE NOT NULL, mode data_mode NOT NULL, status text NOT NULL, configuration jsonb NOT NULL DEFAULT '{}', last_success_at timestamptz, created_at timestamptz NOT NULL DEFAULT now());

CREATE TABLE stations (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), code text UNIQUE NOT NULL, name text NOT NULL, city text, state text, zone text, location geography(Point,4326) NOT NULL, platforms smallint, is_active boolean NOT NULL DEFAULT true, created_at timestamptz NOT NULL DEFAULT now());
CREATE INDEX stations_location_idx ON stations USING gist(location);
CREATE TABLE routes (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), code text UNIQUE NOT NULL, name text NOT NULL, origin_station_id uuid REFERENCES stations(id), destination_station_id uuid REFERENCES stations(id), distance_km numeric(8,2), geometry geography(LineString,4326), is_active boolean NOT NULL DEFAULT true, created_at timestamptz NOT NULL DEFAULT now());
CREATE INDEX routes_geometry_idx ON routes USING gist(geometry);
CREATE TABLE route_segments (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), route_id uuid NOT NULL REFERENCES routes(id) ON DELETE CASCADE, sequence_no integer NOT NULL, from_station_id uuid REFERENCES stations(id), to_station_id uuid REFERENCES stations(id), distance_km numeric(8,2), geometry geography(LineString,4326), UNIQUE(route_id, sequence_no));

CREATE TABLE trains (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), train_number text UNIQUE NOT NULL, name text NOT NULL, service_type text, is_active boolean NOT NULL DEFAULT true, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE train_runs (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), train_id uuid NOT NULL REFERENCES trains(id), route_id uuid REFERENCES routes(id), service_date date NOT NULL, scheduled_departure_at timestamptz, scheduled_arrival_at timestamptz, status train_status NOT NULL DEFAULT 'scheduled', source_id uuid REFERENCES data_sources(id), source_mode data_mode NOT NULL DEFAULT 'simulation', UNIQUE(train_id, service_date));
CREATE TABLE train_stops (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), train_run_id uuid NOT NULL REFERENCES train_runs(id) ON DELETE CASCADE, station_id uuid NOT NULL REFERENCES stations(id), sequence_no integer NOT NULL, scheduled_arrival_at timestamptz, scheduled_departure_at timestamptz, actual_arrival_at timestamptz, actual_departure_at timestamptz, platform text, delay_minutes integer NOT NULL DEFAULT 0, UNIQUE(train_run_id, sequence_no));
CREATE TABLE train_positions (id bigserial PRIMARY KEY, train_run_id uuid NOT NULL REFERENCES train_runs(id) ON DELETE CASCADE, observed_at timestamptz NOT NULL, location geography(Point,4326) NOT NULL, speed_kph numeric(6,2), heading numeric(5,2), delay_minutes integer NOT NULL DEFAULT 0, source_id uuid REFERENCES data_sources(id), source_mode data_mode NOT NULL DEFAULT 'simulation');
CREATE INDEX train_positions_run_time_idx ON train_positions(train_run_id, observed_at DESC);
CREATE INDEX train_positions_location_idx ON train_positions USING gist(location);
CREATE TABLE delay_events (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), train_run_id uuid REFERENCES train_runs(id), station_id uuid REFERENCES stations(id), started_at timestamptz NOT NULL, ended_at timestamptz, delay_minutes integer NOT NULL, reason_code text, description text, source_mode data_mode NOT NULL DEFAULT 'simulation');

CREATE TABLE weather_observations (id bigserial PRIMARY KEY, station_id uuid REFERENCES stations(id), observed_at timestamptz NOT NULL, condition text, temperature_c numeric(5,2), precipitation_mm numeric(7,2), wind_kph numeric(6,2), location geography(Point,4326), source_id uuid REFERENCES data_sources(id), source_mode data_mode NOT NULL DEFAULT 'simulation');
CREATE TABLE weather_forecasts (id bigserial PRIMARY KEY, station_id uuid REFERENCES stations(id), forecast_for timestamptz NOT NULL, issued_at timestamptz NOT NULL, condition text, precipitation_probability numeric(5,2), precipitation_mm numeric(7,2), temperature_c numeric(5,2), source_id uuid REFERENCES data_sources(id), source_mode data_mode NOT NULL DEFAULT 'simulation');
CREATE TABLE congestion_events (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), route_segment_id uuid REFERENCES route_segments(id), station_id uuid REFERENCES stations(id), observed_at timestamptz NOT NULL, congestion_score numeric(5,2) NOT NULL CHECK(congestion_score BETWEEN 0 AND 100), description text, source_mode data_mode NOT NULL DEFAULT 'simulation');
CREATE TABLE alerts (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), title text NOT NULL, description text NOT NULL, severity severity NOT NULL, status alert_status NOT NULL DEFAULT 'open', affected_station_id uuid REFERENCES stations(id), affected_route_id uuid REFERENCES routes(id), created_at timestamptz NOT NULL DEFAULT now(), acknowledged_by uuid REFERENCES users(id), resolved_at timestamptz, source_mode data_mode NOT NULL DEFAULT 'simulation');

CREATE TABLE prediction_requests (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), requested_by uuid REFERENCES users(id), requested_at timestamptz NOT NULL DEFAULT now(), input jsonb NOT NULL, model_version text NOT NULL, source_mode data_mode NOT NULL DEFAULT 'simulation');
CREATE TABLE prediction_results (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), request_id uuid NOT NULL REFERENCES prediction_requests(id) ON DELETE CASCADE, risk_score numeric(5,2) NOT NULL, risk_level text NOT NULL, estimated_delay_minutes integer, confidence numeric(5,4), factors jsonb NOT NULL DEFAULT '[]', created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE ai_conversations (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid REFERENCES users(id), created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), source_mode data_mode NOT NULL DEFAULT 'simulation');
CREATE TABLE ai_messages (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), conversation_id uuid NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE, role text NOT NULL CHECK(role IN ('system','user','assistant')), content text NOT NULL, model_name text, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE system_events (id bigserial PRIMARY KEY, event_type text NOT NULL, service_name text NOT NULL, severity severity NOT NULL DEFAULT 'low', payload jsonb NOT NULL DEFAULT '{}', occurred_at timestamptz NOT NULL DEFAULT now());
