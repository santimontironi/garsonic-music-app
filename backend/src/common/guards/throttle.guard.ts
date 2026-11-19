// Traemos de Nest lo justo: la excepción, los códigos HTTP, el decorador para inyectar y los tipos del guard
import { HttpException, HttpStatus, Injectable, type CanActivate, type ExecutionContext } from '@nestjs/common'
// Reflector sirve para leer la metadata que deja el decorador @Throttle(n) en cada ruta
import { Reflector } from '@nestjs/core'
// Tipo del request de Express, solo para que TypeScript sepa que existe req.ip
import type { Request } from 'express'

// Ventana de tiempo: 1 minuto en milisegundos. El contador se resetea cada minuto
const WINDOW_MS = 60_000
// Límite por defecto: 70 pedidos por minuto si la ruta no dice otra cosa
const DEFAULT_LIMIT = 70

// ponytail: contador en memoria por instancia; con varias instancias el límite se reparte (ver spec, Deploy)
// Acá guardamos los contadores: clave "ip:Controlador.método" → cuántos pedidos van y cuándo se resetea
const hits = new Map<string, { count: number; resetAt: number }>()

// Lo marcamos como inyectable para que Nest lo pueda usar como guard global (APP_GUARD en app.module)
@Injectable()
// Un guard es una "patovica": decide si el pedido pasa (true) o lo rebota
export class ThrottleGuard implements CanActivate {
  // Nest nos pasa el Reflector solo, no hay que crearlo a mano
  constructor(private readonly reflector: Reflector) {}

  // Esto corre antes de cada endpoint
  canActivate(context: ExecutionContext): boolean {
    // Buscamos si la ruta (o el controlador entero) tiene @Throttle(n); si no tiene nada, va el 70 por defecto
    const limit = this.reflector.getAllAndOverride<number>('throttle_limit', [context.getHandler(), context.getClass()]) ?? DEFAULT_LIMIT
    // Sacamos el request HTTP del contexto de Nest
    const req = context.switchToHttp().getRequest<Request>()
    // Armamos la clave: misma IP pegándole a la misma ruta = mismo contador. Otra ruta, otro contador
    const key = `${req.ip}:${context.getClass().name}.${context.getHandler().name}`
    // La hora de ahora, para comparar contra los vencimientos
    const now = Date.now()

    // Si el Map se llenó de más de 10 mil claves, barremos las vencidas para que no se coma la memoria
    if (hits.size > 10_000) for (const [k, v] of hits) if (v.resetAt <= now) hits.delete(k)

    // Buscamos el contador de esta IP en esta ruta
    const entry = hits.get(key)
    // Si no hay contador, o ya pasó el minuto, arrancamos de cero
    if (!entry || entry.resetAt <= now) {
      // Primer pedido de la ventana: cuenta 1 y vence dentro de un minuto
      hits.set(key, { count: 1, resetAt: now + WINDOW_MS })
      // Y lo dejamos pasar
      return true
    }

    // Sumamos uno al contador y si se pasó del límite, lo frenamos
    if (++entry.count > limit) {
      // 429 Too Many Requests con un mensaje en criollo para el front
      throw new HttpException('Demasiadas solicitudes, probá de nuevo en un minuto', HttpStatus.TOO_MANY_REQUESTS)
    }
    // Todavía tiene margen: pasa
    return true
  }
}

/*
 * ¿Por qué hicimos este guard y no seguimos con @Throttle de @nestjs/throttler?
 *
 * Antes usábamos la librería oficial @nestjs/throttler (ThrottlerModule + ThrottlerGuard
 * + su @Throttle). En local andaba joya, pero en Vercel se rompía.
 *
 * El drama: @nestjs/throttler viene compilado en CommonJS (require) y nuestro backend
 * usa Nest 12, que es ESM puro (import). En Vercel (Fluid Compute) la librería hacía
 * require de @nestjs/common y @nestjs/core, y Node no puede cargar un paquete ESM
 * así. Resultado: la función reventaba al arrancar y la API no levantaba en producción.
 *
 * La salida más corta fue sacar la dependencia y escribir esto nosotros: son ~40 líneas,
 * hace lo mismo que usábamos de la librería (cuenta por IP y por ruta, 70 por minuto
 * por defecto y límites propios con @Throttle(n), que ahora vive en
 * common/decorators/throttle.decorator.ts) y no depende de nada que no sea Nest.
 *
 * La contra, que ya la teníamos con la librería: los contadores viven en memoria de
 * cada instancia. Si Vercel levanta varias instancias, cada una cuenta por su lado y el
 * límite real se estira. Con poco tráfico casi siempre se reutiliza la misma instancia,
 * así que funciona bien. Si algún día hace falta un límite exacto: guardar los
 * contadores en Redis (Upstash) o usar el rate limit del firewall de Vercel.
 */
