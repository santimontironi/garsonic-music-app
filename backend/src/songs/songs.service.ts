import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import type { CreateSongBody, UpdateSongAlbumInput } from 'shared/schemas/song.schema'
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
      include: { album: { omit: { coverPublicId: true } }, genre: true }
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
      include: { album: { omit: { coverPublicId: true } }, genre: true }
    })
  }

  async findFavs(userId: string) {
    const favs = await this.prisma.favSong.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        song: {
          omit: { audioPublicId: true, coverPublicId: true },
          include: {
            artist: { select: { id: true, username: true } },
            album: { select: { id: true, title: true, cover: true } },
            genre: true
          }
        }
      }
    })

    return favs.map(({ song }) => song)
  }

  async toggleFav(userId: string, songId: string) {
    const song = await this.prisma.song.findUnique({ where: { id: songId }, select: { id: true } })
    if (!song) throw new NotFoundException('Canción no encontrada')

    const where = { userId_songId: { userId, songId } }
    const fav = await this.prisma.favSong.findUnique({ where })

    if (fav) await this.prisma.favSong.delete({ where })
    else await this.prisma.favSong.create({ data: { userId, songId } })
  }

  async remove(artistId: string, songId: string) {
    const song = await this.prisma.song.findFirst({ where: { id: songId, artistId } })
    if (!song) throw new NotFoundException('Canción no encontrada')

    // Primero la fila: si falla Cloudinary, quedan archivos huérfanos pero no una canción sin audio
    await this.prisma.song.delete({ where: { id: songId } })
    await Promise.allSettled([
      this.cloudinary.remove(song.audioPublicId, 'video'),
      song.coverPublicId && this.cloudinary.remove(song.coverPublicId)
    ])
  }

  // Cada artista sube a su propia subcarpeta, así create() puede comprobar que los archivos son suyos
  getUploadSignature(artistId: string) {
    const timestamp = Math.round(Date.now() / 1000)
    const audioFolder = `songs/audio/${artistId}`
    const coverFolder = `songs/covers/${artistId}`

    return {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      timestamp,
      audio: { folder: audioFolder, signature: this.cloudinary.sign(audioFolder, timestamp) },
      cover: { folder: coverFolder, signature: this.cloudinary.sign(coverFolder, timestamp) }
    }
  }

  async create(artistId: string, { title, albumId, genreId, audioPublicId, coverPublicId }: CreateSongBody) {
    // Antes de tocar nada: si los archivos no son de este artista o ya los usa otra canción, no se borran al fallar
    if (!audioPublicId.startsWith(`songs/audio/${artistId}/`) || (coverPublicId && !coverPublicId.startsWith(`songs/covers/${artistId}/`))) {
      throw new BadRequestException('Los archivos no corresponden a tu cuenta')
    }

    const usedFile = await this.prisma.song.findFirst({
      where: { OR: [{ audioPublicId }, ...(coverPublicId ? [{ coverPublicId }] : [])] }
    })
    if (usedFile) throw new BadRequestException('Los archivos ya pertenecen a otra canción')

    // Desde acá, si algo falla se borran los archivos que el front subió, para no dejarlos huérfanos
    try {
      if (albumId) {
        const album = await this.prisma.album.findFirst({ where: { id: albumId, artistId } })
        if (!album) throw new NotFoundException('Álbum no encontrado')
      }

      const genre = await this.prisma.genre.findUnique({ where: { id: genreId } })
      if (!genre) throw new NotFoundException('Género no encontrado')

      // El front ya subió los archivos: se piden a Cloudinary para validar tipo, tamaño y duración (lo que mande el front no es confiable)
      const [audio, cover] = await Promise.all([
        this.cloudinary.find(audioPublicId, 'video'),
        coverPublicId ? this.cloudinary.find(coverPublicId) : null
      ]).catch(() => {
        throw new BadRequestException('No se encontraron los archivos subidos')
      })

      if (!audio.isAudio || !audio.duration) throw new BadRequestException('El archivo de la canción debe ser un audio')
      if (audio.bytes > 20 * 1024 * 1024) throw new BadRequestException('El audio no puede pesar más de 20 MB')
      if (cover && cover.bytes > 4 * 1024 * 1024) throw new BadRequestException('La portada no puede pesar más de 4 MB')

      return await this.prisma.song.create({
        data: {
          artistId,
          albumId,
          genreId,
          title,
          durationSec: Math.round(audio.duration),
          audioUrl: audio.url,
          audioPublicId,
          cover: cover?.url,
          coverPublicId
        },
        omit: { audioPublicId: true, coverPublicId: true },
        include: { album: { omit: { coverPublicId: true } }, genre: true }
      })
    } catch (error) {
      await Promise.allSettled([
        this.cloudinary.remove(audioPublicId, 'video'),
        coverPublicId && this.cloudinary.remove(coverPublicId)
      ])
      throw error
    }
  }
}
