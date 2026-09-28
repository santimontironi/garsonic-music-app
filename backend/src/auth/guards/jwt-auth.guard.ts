import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import type { Request } from 'express'
import type { Role } from '../../generated/prisma/enums.js'

declare global {
  namespace Express {
    interface Request {
      user?: { sub: string; role: Role }
    }
  }
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>()
    const token = req.cookies?.auth_token
    if (!token) throw new UnauthorizedException()

    try {
      req.user = await this.jwt.verifyAsync(token)
    } catch {
      throw new UnauthorizedException()
    }
    return true
  }
}
