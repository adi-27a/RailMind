-- Query paths for map, train detail and analytics APIs.
CREATE INDEX IF NOT EXISTS train_runs_status_date_idx ON train_runs(status, service_date DESC);
CREATE INDEX IF NOT EXISTS train_stops_run_sequence_idx ON train_stops(train_run_id, sequence_no);
CREATE INDEX IF NOT EXISTS alerts_open_created_idx ON alerts(status, created_at DESC) WHERE status <> 'resolved';
CREATE INDEX IF NOT EXISTS weather_observations_station_time_idx ON weather_observations(station_id, observed_at DESC);
CREATE INDEX IF NOT EXISTS congestion_events_segment_time_idx ON congestion_events(route_segment_id, observed_at DESC);
CREATE INDEX IF NOT EXISTS delay_events_run_started_idx ON delay_events(train_run_id, started_at DESC);
