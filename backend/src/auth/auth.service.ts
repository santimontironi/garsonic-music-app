import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import bcrypt from 'bcrypt'
import { CloudinaryService } from '../cloudinary/cloudinary.service.js'
import { MailService } from '../mail/mail.service.js'
import { confirmTemplate } from '../mail/templates/confirm.template.js'
import { PrismaService } from '../prisma/prisma.service.js'
import type { LoginInput, RegisterInput } from 'shared/schemas/auth.schema.js'

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly cloudinary: CloudinaryService,
    private readonly mail: MailService
  ) {}

  async register({ password, ...data }: RegisterInput, photo?: Express.Multer.File) {
    const exists = await this.prisma.user.findFirst({
      where: { OR: [{ email: data.email }, { username: data.username }] }
    })

    if (exists) throw new ConflictException('El email o el nombre de usuario ya está en uso')

    const hashed = await bcrypt.hash(password, 10)
    
    const uploaded = photo ? await this.cloudinary.upload(photo.buffer, 'users') : null

    const user = await this.prisma.user.create({
      data: {
        ...data,
        password: hashed,
        photo: uploaded?.url,
        photoPublicId: uploaded?.publicId
      }
    })

    // secret propio: este token no puede usarse como sesión (auth_token)
    const token = await this.jwt.signAsync({ sub: user.id }, { secret: process.env.JWT_CONFIRM_SECRET, expiresIn: '20m' })

    // no se espera el envío: si falla el mail, el registro igual queda hecho
    const { subject, html } = confirmTemplate(data.name, token)
    await this.mail.send(data.email, subject, html)

    return { message: 'Usuario creado correctamente' }
  }

  async confirm(token: string) {
    let sub: string
    try {
      ({ sub } = await this.jwt.verifyAsync<{ sub: string }>(token, { secret: process.env.JWT_CONFIRM_SECRET }))
    } catch {
      throw new BadRequestException('El enlace de confirmación es inválido o venció')
    }

    await this.prisma.user.update({ where: { id: sub }, data: { emailVerified: true } })

    return { message: 'Email confirmado correctamente' }
  }

  async login({ email, password }: LoginInput) {
    const user = await this.prisma.user.findUnique({ where: { email } })

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Credenciales inválidas')
    }

    // recién después de validar la contraseña, para no revelar qué emails existen
    if (!user.emailVerified) throw new ForbiddenException('Confirmá tu email antes de iniciar sesión')

    const token = await this.jwt.signAsync({ sub: user.id, role: user.role })
    const { id, name, surname, username, email: userEmail, role, photo, bio, createdAt } = user
    
    return { token, user: { id, name, surname, username, email: userEmail, role, photo, bio, createdAt } }
  }

  async me(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } })
    if (!user) throw new NotFoundException('Usuario no encontrado')

    const { id: userId, name, surname, username, email, role, photo, bio, createdAt } = user
    
    return { id: userId, name, surname, username, email, role, photo, bio, createdAt }
  }
}
