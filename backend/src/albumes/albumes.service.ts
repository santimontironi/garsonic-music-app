import { Injectable } from '@nestjs/common'
import type { CreateAlbumInput } from 'shared/schemas/album.schema'
import { CloudinaryService } from '../cloudinary/cloudinary.service.js'
import { PrismaService } from '../prisma/prisma.service.js'

@Injectable()
export class AlbumesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService
  ) {}

  findByArtist(artistId: string) {
    return this.prisma.album.findMany({
      where: { artistId },
      orderBy: { createdAt: 'desc' },
      omit: { coverPublicId: true },
      include: { _count: { select: { songs: true } } }
    })
  }

  async create(artistId: string, { title }: CreateAlbumInput, cover?: Express.Multer.File) {
    const uploaded = cover ? await this.cloudinary.upload(cover.buffer, 'albums/covers') : null

    try {
      return await this.prisma.album.create({
        data: { artistId, title, cover: uploaded?.url, coverPublicId: uploaded?.publicId },
        omit: { coverPublicId: true }
      })
    } catch (error) {
      if (uploaded) await this.cloudinary.remove(uploaded.publicId).catch(() => undefined)
      throw error
    }
  }
}
