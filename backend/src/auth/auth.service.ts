import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import bcrypt from 'bcrypt'
import { CloudinaryService } from '../cloudinary/cloudinary.service.js'
import { PrismaService } from '../prisma/prisma.service.js'
import type { LoginInput, RegisterInput } from 'shared/schemas/auth.schema.js'

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly cloudinary: CloudinaryService
  ) {}

  async register({ password, ...data }: RegisterInput, photo?: Express.Multer.File) {
    const exists = await this.prisma.user.findFirst({
      where: { OR: [{ email: data.email }, { username: data.username }] }
    })

    if (exists) throw new ConflictException('El email o el nombre de usuario ya está en uso')

    const hashed = await bcrypt.hash(password, 10)
    
    const uploaded = photo ? await this.cloudinary.upload(photo.buffer, 'users') : null

    await this.prisma.user.create({
      data: {
        ...data,
        password: hashed,
        photo: uploaded?.url,
        photoPublicId: uploaded?.publicId
      }
    })

    return { message: 'Usuario creado correctamente' }
  }

  async login({ email, password }: LoginInput) {
    const user = await this.prisma.user.findUnique({ where: { email } })

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Credenciales inválidas')
    }

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
