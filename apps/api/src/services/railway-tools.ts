import type { DelayPredictionInput } from '@railmind/contracts';
import type { RailwayDataProvider } from '../providers/railway-provider.js';
import type { WeatherProvider } from '../providers/weather-provider.js';
import { enrichPredictionInput } from './prediction-context.js';
import { requestDelayPrediction } from './ml-client.js';
/** Named tool surface for a future tool-calling LLM. Each reads provider-backed data. */
export class RailwayTools {
  constructor(private readonly railway:RailwayDataProvider,private readonly weather:WeatherProvider) {}
  get_train_status(trainNumber:string) { return this.railway.getTrain(trainNumber); }
  get_train_position(trainNumber:string) { return this.railway.getTrain(trainNumber); }
  get_train_schedule(trainNumber:string) { return this.railway.getTrain(trainNumber); }
  get_station_status(code:string) { return this.railway.getStation(code); }
  get_route_status(routeId:string) { return this.railway.getRoute(routeId); }
  get_network_overview() { return this.railway.getNetworkMetrics(); }
  get_active_alerts() { return this.railway.getAlerts().then((alerts) => alerts.filter((alert) => alert.status==='open')); }
  get_weather_for_route(routeId:string) { return this.weather.getWeatherForRoute(routeId); }
  get_congestion_status() { return this.railway.getRoutes(); }
  async find_alternative_routes(routeId:string) { const route=await this.railway.getRoute(routeId); const all=await this.railway.getRoutes(); return all.filter((item) => item.id!==routeId && (!route || item.destinationCode===route.destinationCode || item.originCode===route.originCode)); }
  async get_delay_prediction(input:DelayPredictionInput) { return requestDelayPrediction(await enrichPredictionInput(input,this.railway,this.weather)); }
}
