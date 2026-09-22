-- DEMO/SIMULATION ONLY. This seed must never be represented as official railway data.
INSERT INTO data_sources (name, mode, status, configuration) VALUES ('simulation-railway-provider', 'simulation', 'healthy', '{"label":"DEMO / SIMULATION"}'), ('simulation-weather-provider', 'simulation', 'healthy', '{"label":"DEMO / SIMULATION"}');
INSERT INTO stations (code,name,city,state,zone,location,platforms) VALUES
('NDLS','New Delhi','New Delhi','Delhi','Northern',ST_GeogFromText('POINT(77.2090 28.6139)'),16),('MMCT','Mumbai Central','Mumbai','Maharashtra','Western',ST_GeogFromText('POINT(72.8258 18.9690)'),9),('HWH','Howrah Junction','Howrah','West Bengal','Eastern',ST_GeogFromText('POINT(88.3430 22.5830)'),23),('MAS','Chennai Central','Chennai','Tamil Nadu','Southern',ST_GeogFromText('POINT(80.2707 13.0827)'),12);
INSERT INTO routes (code,name,origin_station_id,destination_station_id,distance_km,geometry) SELECT 'DEMO-NDLS-MMCT','Demo Delhi–Mumbai corridor',a.id,b.id,1384,ST_GeogFromText('LINESTRING(77.2090 28.6139,77.2 23.5,72.8258 18.9690)') FROM stations a CROSS JOIN stations b WHERE a.code='NDLS' AND b.code='MMCT';
INSERT INTO trains (train_number,name,service_type) VALUES ('12951','Mumbai Rajdhani','Express'),('12301','Howrah Rajdhani','Express'),('12621','Tamil Nadu Express','Express');
INSERT INTO train_runs (train_id,route_id,service_date,status,source_id,source_mode)
SELECT t.id,r.id,CURRENT_DATE,'running',s.id,'simulation' FROM trains t JOIN routes r ON (t.train_number='12951' AND r.code='NDLS-MMCT') OR (t.train_number='12301' AND r.code='NDLS-MMCT') OR (t.train_number='12621' AND r.code='NDLS-MMCT') CROSS JOIN data_sources s WHERE s.name='simulation-railway-provider';
INSERT INTO train_positions (train_run_id,observed_at,location,speed_kph,delay_minutes,source_id,source_mode)
SELECT tr.id,now(),ST_GeogFromText('POINT(77.2 22.1)'),92,12,s.id,'simulation' FROM train_runs tr CROSS JOIN data_sources s WHERE s.name='simulation-railway-provider';
