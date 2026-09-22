export type DataMode = 'simulation' | 'authorized';
export type TrainStatus = 'on_time' | 'at_risk' | 'delayed';
export type Severity = 'info' | 'low' | 'medium' | 'high' | 'critical';
export type FeedState = 'LIVE' | 'DEGRADED' | 'OFFLINE';
export type WeatherRiskLevel = 'low' | 'moderate' | 'high' | 'severe';
export type UserRole = 'ADMIN' | 'OPERATIONS_CONTROLLER' | 'ANALYST' | 'USER';
export interface AuthUser { id:string; email:string; role:UserRole; displayName:string; }

export interface Station { code:string; name:string; city:string; state:string; zone:string; latitude:number; longitude:number; platforms?:number; source:DataMode; }
export interface Route { id:string; code:string; name:string; originCode:string; destinationCode:string; distanceKm:number; coordinates:Array<[number,number]>; congestionScore:number; source:DataMode; }
export interface TrainPosition { trainRunId:string; trainNumber:string; name:string; latitude:number; longitude:number; delayMinutes:number; status:TrainStatus; updatedAt:string; routeName:string; routeId:string; speedKph?:number; source:DataMode; }
export interface TrainDetail extends TrainPosition { origin:Station; destination:Station; nearestStation?:Station; nextStation?:Station; scheduledEta:string; predictedEta:string; freshnessSeconds:number; weatherRisk?:WeatherRisk; }
export interface NetworkMetrics { activeTrains:number; onTimePercentage:number; averageDelayMinutes:number; activeAlerts:number; trainsAtRisk:number; source:DataMode; updatedAt:string; }
export interface ZoneLoad { zone:string; loadPercent:number; trainCount:number; status:'normal'|'elevated'|'high'; }
export interface Alert { id:string; title:string; description:string; category:'major_delay'|'unusual_delay'|'congestion'|'severe_weather'|'route_disruption'|'station_crowding'|'signal_issue'|'provider_failure'|'high_prediction_risk'|'system_anomaly'; severity:Severity; status:'open'|'acknowledged'|'resolved'; createdAt:string; updatedAt:string; affectedArea?:string; affectedTrainNumbers?:string[]; affectedStationCodes?:string[]; affectedRouteIds?:string[]; recommendedAction:string; latitude?:number; longitude?:number; source:DataMode; }
export interface WeatherObservation { stationCode:string; condition:string; temperatureC:number; precipitationMm:number; windKph:number; visibilityKm:number; severeWeather:boolean; observedAt:string; latitude:number; longitude:number; source:DataMode; }
export interface WeatherForecast extends WeatherObservation { forecastFor:string; precipitationProbability:number; }
export interface WeatherRisk { level:WeatherRiskLevel; score:number; reasons:string[]; source:DataMode; updatedAt:string; }
export interface RouteWeather { routeId:string; observations:WeatherObservation[]; risk:WeatherRisk; forecasts:WeatherForecast[]; }
export interface DelayPredictionInput { originCode:string; destinationCode:string; weather:'clear'|'rain'|'fog'|'heat'; congestion:number; reliability:number; departurePeriod:'morning_peak'|'midday'|'evening_peak'|'night'; historicalDelayMinutes?:number; dayOfWeek?:number; rainfallMm?:number; temperatureC?:number; visibilityKm?:number; activeAlerts?:number; routeDistanceKm?:number; routeCurvatureScore?:number; }
export interface DelayPrediction { delayProbability:number; riskScore:number; riskLevel:'low'|'moderate'|'high'; estimatedDelayMinutes:number; confidence:number; calibration:{ method:string; note:string; isSyntheticDevelopmentModel:boolean }; factors:Array<{name:string; contribution:number; direction:'increases_risk'|'reduces_risk'}>; model:string; modelVersion:string; predictedAt:string; source:DataMode; }
export interface AnalyticsOverview { metrics:NetworkMetrics; zoneLoad:ZoneLoad[]; routePerformance:Array<{route:string;otp:number;averageDelay:number}>; alertTrend:Array<{label:string;alerts:number}>; }
export interface DelaySeriesPoint { label:string; otp:number; averageDelay:number; delayedTrains:number; }
export interface SystemHealth { status:FeedState; services:Array<{name:string;status:FeedState;detail:string;checkedAt:string;lastSuccessfulUpdate?:string;error?:string}>; dataFreshnessSeconds:number; source:DataMode; }
export interface AssistantMessage { id:string; role:'user'|'assistant'; content:string; createdAt:string; source:DataMode; freshnessSeconds:number; tools:string[]; }
export interface AssistantReply { conversationId:string; message:AssistantMessage; suggestedQuestions:string[]; }
export interface ApiEnvelope<T> { data:T; meta:{ source:DataMode; generatedAt:string; freshnessSeconds?:number }; }
export type RealtimeEvent =
  | { type:'train.position.updated'; data:TrainPosition }
  | { type:'train.status.updated'; data:TrainPosition }
  | { type:'network.metrics.updated'; data:NetworkMetrics }
  | { type:'alert.created'; data:Alert }
  | { type:'alert.updated'; data:Alert }
  | { type:'weather.updated'; data:WeatherObservation[] }
  | { type:'snapshot'; data:{ metrics:NetworkMetrics; trains:TrainPosition[]; alerts:Alert[]; weather:WeatherObservation[] } };
