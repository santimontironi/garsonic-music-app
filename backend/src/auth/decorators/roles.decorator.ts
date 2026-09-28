import { SetMetadata } from '@nestjs/common' // helper de Nest que adjunta metadata (clave-valor) a una clase o método
import type { Role } from '../../generated/prisma/enums.js' // solo tipo: enum de roles generado por Prisma, no genera código en runtime

export const ROLES_KEY = 'roles' // clave compartida para guardar/leer la metadata (evita magic strings duplicados)
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles) // decorator factory: junta los roles pasados y devuelve el decorator que los guarda como metadata
