import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import type { UpdateUserInput } from 'shared/schemas/user.schema'
import { CloudinaryService } from '../cloudinary/cloudinary.service.js'
import { PrismaService } from '../prisma/prisma.service.js'

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService
  ) {}

  // Un artista no tiene playlists y un usuario no tiene álbumes ni canciones: lo que no aplica llega vacío
  async findById(viewerId: string, userId: string) {
    const found = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        name: true,
        surname: true,
        photo: true,
        bio: true,
        role: true,
        createdAt: true,
        albums: {
          orderBy: { createdAt: 'desc' },
          omit: { coverPublicId: true },
          include: { _count: { select: { songs: true } } }
        },
        songs: {
          orderBy: { createdAt: 'desc' },
          omit: { audioPublicId: true, coverPublicId: true },
          include: { album: { omit: { coverPublicId: true } }, genre: true }
        },
        playlists: {
          where: { isPublic: true },
          orderBy: { createdAt: 'desc' },
          omit: { imagePublicId: true },
          include: { _count: { select: { songs: true } } }
        },
        fans: { where: { userId: viewerId }, select: { userId: true } }
      }
    })

    if (!found) throw new NotFoundException('Usuario no encontrado')

    const { fans, ...user } = found
    return { ...user, isFav: fans.length > 0 }
  }

  async findFavArtists(userId: string) {
    const favs = await this.prisma.favArtist.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: { artist: { select: { id: true, username: true, name: true, surname: true, photo: true } } }
    })

    return favs.map(({ artist }) => artist)
  }

  async toggleFavArtist(userId: string, artistId: string) {
    const artist = await this.prisma.user.findUnique({ where: { id: artistId }, select: { role: true } })
    if (artist?.role !== 'ARTIST') throw new NotFoundException('Artista no encontrado')

    const where = { userId_artistId: { userId, artistId } }
    const fav = await this.prisma.favArtist.findUnique({ where })

    if (fav) await this.prisma.favArtist.delete({ where })
    else await this.prisma.favArtist.create({ data: { userId, artistId } })
  }

  async update(userId: string, { username }: UpdateUserInput, photo?: Express.Multer.File) {
    if (!username && !photo) throw new BadRequestException('No hay cambios para guardar')

    if (username) {
      const taken = await this.prisma.user.findFirst({ where: { username, NOT: { id: userId } } })
      if (taken) throw new ConflictException('El nombre de usuario ya está en uso')
    }

    const current = await this.prisma.user.findUnique({ where: { id: userId }, select: { photoPublicId: true } })
    if (!current) throw new NotFoundException('Usuario no encontrado')

    const uploaded = photo ? await this.cloudinary.upload(photo.buffer, 'users') : null

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { username, photo: uploaded?.url, photoPublicId: uploaded?.publicId },
      select: { id: true, name: true, surname: true, username: true, email: true, role: true, photo: true, bio: true, createdAt: true }
    }).catch(async (error) => {
      if (uploaded) await this.cloudinary.remove(uploaded.publicId).catch(() => undefined)
      throw error
    })

    // la foto vieja se borra recién con el cambio guardado
    if (uploaded && current.photoPublicId) await this.cloudinary.remove(current.photoPublicId).catch(() => undefined)

    return user
  }
}
