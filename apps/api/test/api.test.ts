import { afterEach, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
const apps:Awaited<ReturnType<typeof buildApp>>[] = [];
afterEach(async () => { await Promise.all(apps.splice(0).map((app) => app.close())); });
async function app() { const instance = await buildApp(); apps.push(instance); return instance; }
describe('RailMind API', () => {
  it('labels train data as simulation', async () => { const instance = await app(); const response = await instance.inject({ method:'GET',url:'/api/trains/live' }); expect(response.statusCode).toBe(200); expect(response.json().meta.source).toBe('simulation'); expect(response.json().data[0]).toMatchObject({ trainNumber:'12951',source:'simulation' }); });
  it('returns a typed train detail and 404 for unknown trains', async () => { const instance = await app(); const found = await instance.inject({ method:'GET',url:'/api/trains/12951' }); const missing = await instance.inject({ method:'GET',url:'/api/trains/99999' }); expect(found.statusCode).toBe(200); expect(found.json().data.nextStation.code).toBeDefined(); expect(missing.statusCode).toBe(404); });
  it('validates delay prediction input', async () => { const instance = await app(); const response = await instance.inject({ method:'POST',url:'/api/predictions/delay',payload:{ congestion:200 } }); expect(response.statusCode).toBe(400); });
  it('exposes station, route, analytics and health APIs', async () => { const instance = await app(); const responses = await Promise.all(['/api/stations?','/api/routes','/api/analytics/overview','/api/analytics/delays','/api/system/health','/api/weather/routes/route-delhi-mumbai'].map((url) => instance.inject({ method:'GET',url }))); responses.forEach((response) => expect(response.statusCode).toBe(200)); expect(['LIVE','DEGRADED']).toContain(responses[4]?.json().data.status); expect(responses[5]?.json().data.risk.level).toBeDefined(); });
  it('grounds assistant replies in simulation-backed tools', async () => { const instance = await app(); const response = await instance.inject({ method:'POST',url:'/api/assistant/messages',payload:{ message:'Where is train 12951?' } }); expect(response.statusCode).toBe(200); expect(response.json().data.message.content).toContain('DEMO / SIMULATION DATA'); expect(response.json().data.message.tools).toContain('get_train_status'); });
});
