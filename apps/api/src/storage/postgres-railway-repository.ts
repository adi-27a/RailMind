import type { Route, Station } from '@railmind/contracts';

type Queryable = { query<T>(sql: string, values?: unknown[]): Promise<{ rows: T[] }> };
type StationRow = { code:string; name:string; city:string; state:string; zone:string; latitude:number; longitude:number; platforms:number | null };
type RouteRow = { id:string; code:string; name:string; origin_code:string; destination_code:string; distance_km:number; congestion_score:number | null; coordinates: Array<[number, number]> | null };
/** PostGIS read repository used by an authorized provider or scheduled ingestion worker. */
export class PostgresRailwayRepository {
  constructor(private readonly db: Queryable) {}
  async listStations(search?: string): Promise<Station[]> { const term = search ? `%${search}%` : null; const result = await this.db.query<StationRow>(`SELECT code,name,city,state,zone,ST_Y(location::geometry) AS latitude,ST_X(location::geometry) AS longitude,platforms FROM stations WHERE ($1::text IS NULL OR code ILIKE $1 OR name ILIKE $1 OR city ILIKE $1) AND is_active = true ORDER BY name`, [term]); return result.rows.map((row) => ({ ...row, platforms:row.platforms ?? undefined, source:'authorized' })); }
  async listRoutes(): Promise<Route[]> { const result = await this.db.query<RouteRow>(`SELECT r.id::text,r.code,r.name,origin.code AS origin_code,destination.code AS destination_code,r.distance_km,COALESCE(AVG(c.congestion_score),0) AS congestion_score,ST_AsGeoJSON(r.geometry::geometry)::json->'coordinates' AS coordinates FROM routes r LEFT JOIN stations origin ON origin.id=r.origin_station_id LEFT JOIN stations destination ON destination.id=r.destination_station_id LEFT JOIN congestion_events c ON c.route_segment_id IN (SELECT id FROM route_segments WHERE route_id=r.id) WHERE r.is_active = true GROUP BY r.id,origin.code,destination.code ORDER BY r.name`); return result.rows.map((row) => ({ id:row.id,code:row.code,name:row.name,originCode:row.origin_code,destinationCode:row.destination_code,distanceKm:Number(row.distance_km),congestionScore:Number(row.congestion_score ?? 0),coordinates:row.coordinates ?? [],source:'authorized' })); }
}
