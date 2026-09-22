import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import type { AuthService } from '../services/auth-service.js';
import type { AuditLog } from '../services/audit-log.js';
const loginSchema=z.object({email:z.string().trim().email().max(254),password:z.string().min(8).max(200)});
export async function registerAuthRoutes(app:FastifyInstance,auth:AuthService,audit:AuditLog){app.post('/api/auth/login',async(request,reply)=>{const parsed=loginSchema.safeParse(request.body);if(!parsed.success)return reply.code(400).send({error:'Invalid login request.'});const result=auth.login(parsed.data);if(result===undefined)return reply.code(503).send({error:'Authentication is not configured for this environment.'});if(result===null)return reply.code(401).send({error:'Invalid email or password.'});return reply.send(result);});app.get('/api/auth/me',{preHandler:auth.require(['ADMIN','OPERATIONS_CONTROLLER','ANALYST','USER'])},async(request)=>auth.me(request));app.get('/api/admin/audit-events',{preHandler:auth.require(['ADMIN'])},async()=>({data:audit.list()}));}
