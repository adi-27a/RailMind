import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import App from './App';
vi.mock('./lib/use-live-feed', () => ({ useLiveFeed: () => ({ loading:false,state:'LIVE',metrics:{ activeTrains:248,onTimePercentage:91.4,averageDelayMinutes:6.2,activeAlerts:3,trainsAtRisk:1,source:'simulation',updatedAt:'2025-01-01T00:00:00Z' },trains:[],alerts:[],weather:[] }) }));
vi.mock('./lib/use-resource', () => ({ useResource: () => ({ loading:false,data:{ zoneLoad:[] },reload:vi.fn() }) }));
describe('App', () => { it('identifies the dashboard data as demo', () => { render(<App/>); expect(screen.getByText('Network Overview')).toBeInTheDocument(); expect(screen.getByText('DEMO / SIMULATION')).toBeInTheDocument(); }); });
