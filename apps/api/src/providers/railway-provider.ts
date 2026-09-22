import type { Alert, AnalyticsOverview, DelaySeriesPoint, NetworkMetrics, Route, Station, SystemHealth, TrainDetail, TrainPosition, ZoneLoad } from '@railmind/contracts';

/** Contract implemented by simulation and future authorized railway providers. */
export interface RailwayDataProvider {
  readonly mode: 'simulation' | 'authorized';
  getNetworkMetrics(): Promise<NetworkMetrics>;
  getLiveTrains(): Promise<TrainPosition[]>;
  getTrain(trainNumber: string): Promise<TrainDetail | undefined>;
  getStations(query?: string): Promise<Station[]>;
  getStation(code: string): Promise<Station | undefined>;
  getRoutes(): Promise<Route[]>;
  getRoute(id: string): Promise<Route | undefined>;
  getAlerts(): Promise<Alert[]>;
  getAlert(id: string): Promise<Alert | undefined>;
  getAnalyticsOverview(): Promise<AnalyticsOverview>;
  getDelaySeries(): Promise<DelaySeriesPoint[]>;
  getZoneLoad(): Promise<ZoneLoad[]>;
  getSystemHealth(): Promise<SystemHealth>;
}
