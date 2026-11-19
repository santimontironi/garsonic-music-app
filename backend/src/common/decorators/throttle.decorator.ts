import { SetMetadata } from '@nestjs/common'

// Límite propio por minuto para una ruta (el resto usa el global de ThrottleGuard)
export const Throttle = (limit: number) => SetMetadata('throttle_limit', limit)
