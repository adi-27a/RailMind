import { timingSafeEqual } from 'node:crypto';
import type { AuthUser, UserRole } from '@railmind/contracts';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import type { AuditLog } from './audit-log.js';
type Credentials={email:string;password:string};
export class AuthService { readonly enabled:boolean; constructor(private readonly app:FastifyInstance,enabled:boolean,private readonly audit:AuditLog){this.enabled=enabled;}
  login(credentials:Credentials){if(!this.enabled)return undefined;const email=process.env.AUTH_DEMO_EMAIL;const password=process.env.AUTH_DEMO_PASSWORD;const role=(process.env.AUTH_DEMO_ROLE ?? 'ADMIN') as UserRole;if(!email||!password)return undefined;if(!safeEqual(credentials.email,email)||!safeEqual(credentials.password,password)){this.audit.record({action:'auth.login',outcome:'failure',detail:'Invalid credentials'});return null;}const user:AuthUser={id:'demo-auth-user',email,role,displayName:'RailMind Demo User'};const token=this.app.jwt.sign(user,{expiresIn:'8h'});this.audit.record({action:'auth.login',actorId:user.id,actorRole:user.role,outcome:'success',detail:'Demo user authenticated'});return {token,user};}
  require(roles:UserRole[]){return async(request:FastifyRequest,reply:FastifyReply)=>{if(!this.enabled)return reply.code(503).send({error:'Authentication is not enabled for this environment.'});try{await request.jwtVerify();const user=request.user as AuthUser;if(!roles.includes(user.role)){this.audit.record({action:'auth.authorize',actorId:user.id,actorRole:user.role,outcome:'failure',detail:'Insufficient role'});return reply.code(403).send({error:'Insufficient permissions.'});}this.audit.record({action:'auth.authorize',actorId:user.id,actorRole:user.role,outcome:'success',detail:'Protected route authorized'});}catch{return reply.code(401).send({error:'Authentication required.'});}};}
  me(request:FastifyRequest){return request.user as AuthUser;}
}
function safeEqual(left:string,right:string){const a=Buffer.from(left);const b=Buffer.from(right);return a.length===b.length&&timingSafeEqual(a,b);}
