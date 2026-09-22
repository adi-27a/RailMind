import { SimulationRailwayProvider } from './simulation-railway-provider.js';
import { SimulationWeatherProvider } from './simulation-weather-provider.js';
/** Explicit selection prevents an unconfigured production provider from silently serving demo data. */
export function createProviders() { const railwayMode = process.env.RAILWAY_PROVIDER ?? 'simulation'; const weatherMode = process.env.WEATHER_PROVIDER ?? 'simulation'; if (railwayMode !== 'simulation' || weatherMode !== 'simulation') throw new Error('Authorized provider selected but not configured. Implement the provider interface and inject credentials server-side.'); return { railway:new SimulationRailwayProvider(), weather:new SimulationWeatherProvider() }; }
