import { HttpException, HttpStatus, Injectable, type CanActivate, type ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import type { Request } from 'express'

// Reemplaza a @nestjs/throttler: es CommonJS y en Vercel (Fluid) no puede cargar Nest 12, que es ESM.
// Cuenta por IP y por ruta, igual que la librería.

const WINDOW_MS = 60_000
const DEFAULT_LIMIT = 70

// ponytail: contador en memoria por instancia; con varias instancias el límite se reparte (ver spec, Deploy)
const hits = new Map<string, { count: number; resetAt: number }>()

@Injectable()
export class ThrottleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const limit = this.reflector.getAllAndOverride<number>('throttle_limit', [context.getHandler(), context.getClass()]) ?? DEFAULT_LIMIT
    const req = context.switchToHttp().getRequest<Request>()
    const key = `${req.ip}:${context.getClass().name}.${context.getHandler().name}`
    const now = Date.now()

    // Limpia ventanas vencidas para que el Map no crezca sin fin
    if (hits.size > 10_000) for (const [k, v] of hits) if (v.resetAt <= now) hits.delete(k)

    const entry = hits.get(key)
    if (!entry || entry.resetAt <= now) {
      hits.set(key, { count: 1, resetAt: now + WINDOW_MS })
      return true
    }

    if (++entry.count > limit) {
      throw new HttpException('Demasiadas solicitudes, probá de nuevo en un minuto', HttpStatus.TOO_MANY_REQUESTS)
    }
    return true
  }
}
