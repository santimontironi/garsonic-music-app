import { BadRequestException, Body, Controller, Get, Param, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import type { Request, Response } from 'express'
import { loginSchema, registerSchema, type LoginInput, type RegisterInput } from 'shared/schemas/auth.schema.js'
import { ZodValidationPipe } from '../common/pipes/zod.validation.pipe.js'
import { AuthService } from './auth.service.js'
import { JwtAuthGuard } from './guards/jwt-auth.guard.js'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UseInterceptors(
    FileInterceptor('photo', {
      limits: { fileSize: 5 * 1024 * 1024 },
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

  @Post('login')
  async login(
    @Body(new ZodValidationPipe(loginSchema)) body: LoginInput,
    @Res({ passthrough: true }) res: Response
  ) {
    const { token, user } = await this.authService.login(body)

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    return user
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: Request) {
    return this.authService.me(req.user!.sub)
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('auth_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    })
    return { message: 'Sesión cerrada' }
  }
}
