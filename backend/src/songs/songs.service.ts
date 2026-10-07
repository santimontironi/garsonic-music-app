import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import type { CreateSongInput, UpdateSongAlbumInput } from 'shared/schemas/song.schema.js'
import { CloudinaryService } from '../cloudinary/cloudinary.service.js'
import { PrismaService } from '../prisma/prisma.service.js'

@Injectable()
export class SongsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService
  ) {}

  async findSongsByArtist(artistId: string) {
    return await this.prisma.song.findMany({
      where: { artistId },
      orderBy: { createdAt: 'desc' },
      omit: { audioPublicId: true, coverPublicId: true },
      include: { album: { omit: { coverPublicId: true } } }
    })
  }

  async updateAlbum(artistId: string, songId: string, { albumId }: UpdateSongAlbumInput) {
    const song = await this.prisma.song.findFirst({ where: { id: songId, artistId } })
    if (!song) throw new NotFoundException('Canción no encontrada')

    if (albumId) {
      const album = await this.prisma.album.findFirst({ where: { id: albumId, artistId } })
      if (!album) throw new NotFoundException('Álbum no encontrado')
    }

    return await this.prisma.song.update({
      where: { id: songId },
      data: { albumId },
      omit: { audioPublicId: true, coverPublicId: true },
      include: { album: { omit: { coverPublicId: true } } }
    })
  }

  async create(artistId: string, { title, albumId }: CreateSongInput, audio: Express.Multer.File, cover?: Express.Multer.File) {
    if (albumId) {
      const album = await this.prisma.album.findFirst({ where: { id: albumId, artistId } })
      if (!album) throw new NotFoundException('Álbum no encontrado')
    }

    // Audio y portada suben en paralelo; allSettled permite limpiar la que sí subió si la otra falla
    const [audioResult, coverResult] = await Promise.allSettled([
      this.cloudinary.upload(audio.buffer, 'songs/audio', 'video'),
      cover ? this.cloudinary.upload(cover.buffer, 'songs/covers') : Promise.resolve(null)
    ])

    try {
      if (audioResult.status === 'rejected') throw audioResult.reason
      if (coverResult.status === 'rejected') throw coverResult.reason

      const uploadedAudio = audioResult.value
      const uploadedCover = coverResult.value

      if (!uploadedAudio.duration) throw new BadRequestException('No se pudo leer la duración del audio')

      return await this.prisma.song.create({
        data: {
          artistId,
          albumId,
          title,
          durationSec: Math.round(uploadedAudio.duration),
          audioUrl: uploadedAudio.url,
          audioPublicId: uploadedAudio.publicId,
          cover: uploadedCover?.url,
          coverPublicId: uploadedCover?.publicId
        },
        omit: { audioPublicId: true, coverPublicId: true },
        include: { album: { omit: { coverPublicId: true } } }
      })
    } catch (error) {
      await Promise.allSettled([
        audioResult.status === 'fulfilled' && this.cloudinary.remove(audioResult.value.publicId, 'video'),
        coverResult.status === 'fulfilled' && coverResult.value && this.cloudinary.remove(coverResult.value.publicId)
      ])
      throw error
    }
  }
}
