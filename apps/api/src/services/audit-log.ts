import type { UserRole } from '@railmind/contracts';
export interface AuditEvent { id:string; occurredAt:string; action:string; actorId?:string; actorRole?:UserRole; outcome:'success'|'failure'; detail:string; }
/** Bounded in-memory audit stream for demo mode; replace with system_events persistence in deployment. */
export class AuditLog { private readonly events:AuditEvent[]=[]; constructor(private readonly log:{ info:(value:unknown,message?:string)=>void }){} record(event:Omit<AuditEvent,'id'|'occurredAt'>){const entry={...event,id:crypto.randomUUID(),occurredAt:new Date().toISOString()};this.events.unshift(entry);this.events.splice(200);this.log.info({audit:entry},'audit event');return entry;} list(){return [...this.events];} }
