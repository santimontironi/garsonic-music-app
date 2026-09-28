import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common' // tipos/decorators base de Nest para armar un guard
import { Reflector } from '@nestjs/core' // servicio de Nest para leer metadata seteada con SetMetadata
import type { Request } from 'express' // solo tipo: request de Express
import type { Role } from '../../generated/prisma/enums.js' // solo tipo: enum de roles de Prisma
import { ROLES_KEY } from '../decorators/roles.decorator.js' // misma clave usada por @Roles() para guardar la metadata

@Injectable() // marca la clase como inyectable en el sistema de DI de Nest
export class RolesGuard implements CanActivate { // guard: Nest lo ejecuta antes del handler y decide si la request pasa
  constructor(private readonly reflector: Reflector) {} // Nest inyecta el Reflector automáticamente

  canActivate(context: ExecutionContext) { // método que Nest llama en cada request para decidir true/false
    const roles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [ // busca metadata 'roles': primero en el método, si no hay cae a la clase
      context.getHandler(), // el método específico que se va a ejecutar (ej. panel())
      context.getClass() // el controller entero, como fallback
    ])
    if (!roles?.length) return true // sin @Roles() puesto en nada → endpoint público (sin restricción de rol) → deja pasar

    const req = context.switchToHttp().getRequest<Request>() // saca el request de Express desde el contexto genérico de Nest
    if (!roles.includes(req.user!.role)) { // req.user lo setea el JwtAuthGuard antes; compara su role contra los permitidos
      throw new ForbiddenException() // rol no autorizado → 403
    }
    return true // rol autorizado → deja pasar
  }
}
