import { Injectable } from '@nestjs/common'
import type { CreatePlaylistInput } from 'shared/schemas/playlist.schema'
import { CloudinaryService } from '../cloudinary/cloudinary.service.js'
import { PrismaService } from '../prisma/prisma.service.js'

@Injectable()
export class PlaylistsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService
  ) {}

  findByOwner(ownerId: string) {
    return this.prisma.playlist.findMany({
      where: { ownerId },
      orderBy: { createdAt: 'desc' },
      omit: { imagePublicId: true },
      include: { _count: { select: { songs: true } } }
    })
  }

  async create(ownerId: string, { name, isPublic }: CreatePlaylistInput, image?: Express.Multer.File) {
    const uploaded = image ? await this.cloudinary.upload(image.buffer, 'playlists/images') : null

    try {
      return await this.prisma.playlist.create({
        data: { ownerId, name, isPublic, image: uploaded?.url, imagePublicId: uploaded?.publicId },
        omit: { imagePublicId: true }
      })
    } catch (error) {
      if (uploaded) await this.cloudinary.remove(uploaded.publicId).catch(() => undefined)
      throw error
    }
  }
}
