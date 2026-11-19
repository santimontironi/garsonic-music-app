import { BadRequestException, Body, Controller, Get, Param, Patch, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { Throttle } from '@nestjs/throttler'
import type { Request, Response } from 'express'
import { changePasswordSchema, forgotPasswordSchema, loginSchema, registerSchema, resetPasswordSchema, type ChangePasswordInput, type ForgotPasswordInput, type LoginInput, type RegisterInput, type ResetPasswordInput } from 'shared/schemas/auth.schema'
import { ZodValidationPipe } from '../common/pipes/zod.validation.pipe.js'
import { AuthService } from './auth.service.js'
import { JwtAuthGuard } from './guards/jwt-auth.guard.js'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Throttle({ default: { ttl: 60_000, limit: 5 } })
  @Post('register')
  @UseInterceptors(
    FileInterceptor('photo', {
      limits: { fileSize: 4 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          return cb(new BadRequestException('La foto debe ser una imagen'), false)
        }
        cb(null, true)
      }
    })
  )
  async register(
    @Body(new ZodValidationPipe(registerSchema)) body: RegisterInput,
    @UploadedFile() photo?: Express.Multer.File
  ) {
    return this.authService.register(body, photo)
  }

  @Post('confirm/:token')
  confirm(@Param('token') token: string) {
    return this.authService.confirm(token)
  }

  @Throttle({ default: { ttl: 60_000, limit: 5 } })
  @Post('forgot-password')
  forgotPassword(@Body(new ZodValidationPipe(forgotPasswordSchema)) body: ForgotPasswordInput) {
    return this.authService.forgotPassword(body)
  }

  @Throttle({ default: { ttl: 60_000, limit: 5 } })
  @Post('forgot-password/:token')
  resetPassword(
    @Param('token') token: string,
    @Body(new ZodValidationPipe(resetPasswordSchema)) body: ResetPasswordInput
  ) {
    return this.authService.resetPassword(token, body)
  }

  @Throttle({ default: { ttl: 60_000, limit: 5 } })
  @Post('login')
  async login(
    @Body(new ZodValidationPipe(loginSchema)) body: LoginInput,
    @Res({ passthrough: true }) res: Response
  ) {
    const { token, user } = await this.authService.login(body)

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    return user
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: Request) {
    return this.authService.me(req.user!.sub)
  }

  @Throttle({ default: { ttl: 60_000, limit: 5 } })
  @UseGuards(JwtAuthGuard)
  @Patch('password')
  changePassword(
    @Req() req: Request,
    @Body(new ZodValidationPipe(changePasswordSchema)) body: ChangePasswordInput
  ) {
    return this.authService.changePassword(req.user!.sub, body)
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('auth_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    })
    return { message: 'Sesión cerrada' }
  }
}
