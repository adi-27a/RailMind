import type { Alert, AnalyticsOverview, DelaySeriesPoint, NetworkMetrics, Route, Station, SystemHealth, TrainDetail, TrainPosition, ZoneLoad } from '@railmind/contracts';
import { demoAlerts, demoTrains, routes, stations, zoneLoad } from './demo-data.js';
import type { RailwayDataProvider } from './railway-provider.js';

/** Deterministic development feed. It is the only place demo movement is generated. */
export class SimulationRailwayProvider implements RailwayDataProvider {
  readonly mode = 'simulation' as const;
  private tick = 0;
  private readonly trains = demoTrains.map((train) => ({ ...train }));
  async getNetworkMetrics(): Promise<NetworkMetrics> {
    const live = await this.getLiveTrains();
    const delayed = live.filter((train) => train.status === 'delayed').length;
    const atRisk = live.filter((train) => train.status === 'at_risk').length;
    return { activeTrains: 248, onTimePercentage: 91.4, averageDelayMinutes: Math.round(live.reduce((total, train) => total + train.delayMinutes, 0) / live.length * 10) / 10, activeAlerts: demoAlerts.filter((alert) => alert.status === 'open').length, trainsAtRisk: delayed + atRisk, source: this.mode, updatedAt: new Date().toISOString() };
  }
  async getLiveTrains(): Promise<TrainPosition[]> { return this.trains.map((train) => ({ trainRunId:train.trainRunId,trainNumber:train.trainNumber,name:train.name,latitude:train.latitude,longitude:train.longitude,delayMinutes:train.delayMinutes,status:train.status,updatedAt:train.updatedAt,routeName:train.routeName,routeId:train.routeId,speedKph:train.speedKph,source:this.mode })); }
  async getTrain(trainNumber: string): Promise<TrainDetail | undefined> { const train = this.trains.find((item) => item.trainNumber === trainNumber); return train ? { ...train, freshnessSeconds: Math.max(0, Math.round((Date.now() - Date.parse(train.updatedAt)) / 1000)) } : undefined; }
  async getStations(query?: string): Promise<Station[]> { const term = query?.trim().toLowerCase(); return term ? stations.filter((station) => `${station.code} ${station.name} ${station.city}`.toLowerCase().includes(term)) : stations; }
  async getStation(code: string): Promise<Station | undefined> { return stations.find((station) => station.code.toLowerCase() === code.toLowerCase()); }
  async getRoutes(): Promise<Route[]> { return routes; }
  async getRoute(id: string): Promise<Route | undefined> { return routes.find((route) => route.id === id || route.code.toLowerCase() === id.toLowerCase()); }
  async getAlerts(): Promise<Alert[]> { return demoAlerts.map((alert) => ({ ...alert, updatedAt: new Date().toISOString() })); }
  async getAlert(id: string): Promise<Alert | undefined> { return (await this.getAlerts()).find((alert) => alert.id === id); }
  async getZoneLoad(): Promise<ZoneLoad[]> { return zoneLoad; }
  async getAnalyticsOverview(): Promise<AnalyticsOverview> { return { metrics: await this.getNetworkMetrics(), zoneLoad: await this.getZoneLoad(), routePerformance: routes.map((route, index) => ({ route: route.name, otp: [89, 94, 90, 96][index]!, averageDelay: [9.1, 3.8, 7.2, 2.4][index]! })), alertTrend: [{ label: 'Mon', alerts: 3 }, { label: 'Tue', alerts: 5 }, { label: 'Wed', alerts: 2 }, { label: 'Thu', alerts: 4 }, { label: 'Fri', alerts: 3 }, { label: 'Sat', alerts: 1 }] }; }
  async getDelaySeries(): Promise<DelaySeriesPoint[]> { return [{ label:'08:00',otp:92,averageDelay:4.2,delayedTrains:12 },{ label:'10:00',otp:91,averageDelay:5.1,delayedTrains:18 },{ label:'12:00',otp:94,averageDelay:3.7,delayedTrains:9 },{ label:'14:00',otp:90,averageDelay:6.4,delayedTrains:22 },{ label:'16:00',otp:91,averageDelay:5.8,delayedTrains:17 },{ label:'18:00',otp:89,averageDelay:7.3,delayedTrains:26 }]; }
  async getSystemHealth(): Promise<SystemHealth> { const checkedAt = new Date().toISOString(); return { status:'LIVE', dataFreshnessSeconds:0, source:this.mode, services:[{name:'Railway simulation provider',status:'LIVE',detail:'DEMO / SIMULATION DATA',checkedAt},{name:'Weather simulation provider',status:'LIVE',detail:'DEMO / SIMULATION DATA',checkedAt},{name:'PostgreSQL/PostGIS',status:'DEGRADED',detail:'Schema available; demo provider is active',checkedAt},{name:'Redis live cache',status:'DEGRADED',detail:'Cache adapter is not enabled for simulation',checkedAt}] }; }
  /** Advances fixed train paths; never used in frontend code. */
  advance(): TrainPosition[] { this.tick += 1; const time = new Date().toISOString(); return this.trains.map((train, index) => { const route = routes.find((item) => item.id === train.routeId)!; const start = route.coordinates[index % (route.coordinates.length - 1)]!; const end = route.coordinates[(index % (route.coordinates.length - 1)) + 1]!; const progress = ((this.tick + index * 3) % 100) / 100; train.longitude = start[0] + (end[0] - start[0]) * progress; train.latitude = start[1] + (end[1] - start[1]) * progress; train.updatedAt = time; return { trainRunId:train.trainRunId,trainNumber:train.trainNumber,name:train.name,latitude:train.latitude,longitude:train.longitude,delayMinutes:train.delayMinutes,status:train.status,updatedAt:time,routeName:train.routeName,routeId:train.routeId,speedKph:train.speedKph,source:this.mode }; }); }
}
