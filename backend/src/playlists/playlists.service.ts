import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import type { AddSongToPlaylistInput, CreatePlaylistInput, UpdatePlaylistInput } from 'shared/schemas/playlist.schema'
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
      include: { _count: { select: { songs: true } }, songs: { select: { songId: true } } }
    })
  }

  // El dueño ve cualquiera de sus playlists; el resto, solo las públicas
  async findById(userId: string, playlistId: string) {
    const playlist = await this.prisma.playlist.findFirst({
      where: { id: playlistId, OR: [{ ownerId: userId }, { isPublic: true }] },
      omit: { imagePublicId: true },
      include: {
        owner: { select: { id: true, username: true } },
        songs: {
          orderBy: { position: 'asc' },
          select: {
            position: true,
            addedAt: true,
            song: {
              omit: { audioPublicId: true, coverPublicId: true },
              include: {
                artist: { select: { id: true, username: true } },
                album: { select: { id: true, title: true } },
                genre: true
              }
            }
          }
        }
      }
    })

    if (!playlist) throw new NotFoundException('Playlist no encontrada')

    return playlist
  }

  async addSong(ownerId: string, playlistId: string, { songId }: AddSongToPlaylistInput) {
    const playlist = await this.prisma.playlist.findFirst({ where: { id: playlistId, ownerId } })
    if (!playlist) throw new NotFoundException('Playlist no encontrada')

    const song = await this.prisma.song.findUnique({ where: { id: songId } })
    if (!song) throw new NotFoundException('Canción no encontrada')

    const exists = await this.prisma.songPlaylist.findUnique({ where: { playlistId_songId: { playlistId, songId } } })
    if (exists) throw new ConflictException('La canción ya está en la playlist')

    const { _max } = await this.prisma.songPlaylist.aggregate({ where: { playlistId }, _max: { position: true } })

    return await this.prisma.songPlaylist.create({
      data: { playlistId, songId, position: (_max.position ?? 0) + 1 }
    })
  }

  async removeSong(ownerId: string, playlistId: string, songId: string) {
    const playlist = await this.prisma.playlist.findFirst({ where: { id: playlistId, ownerId } })
    if (!playlist) throw new NotFoundException('Playlist no encontrada')

    const { count } = await this.prisma.songPlaylist.deleteMany({ where: { playlistId, songId } })
    if (count === 0) throw new NotFoundException('La canción no está en la playlist')
  }

  async update(ownerId: string, playlistId: string, { isPublic }: UpdatePlaylistInput) {
    const { count } = await this.prisma.playlist.updateMany({ where: { id: playlistId, ownerId }, data: { isPublic } })
    if (count === 0) throw new NotFoundException('Playlist no encontrada')

    return { isPublic }
  }

  async remove(ownerId: string, playlistId: string) {
    const playlist = await this.prisma.playlist.findFirst({ where: { id: playlistId, ownerId } })
    if (!playlist) throw new NotFoundException('Playlist no encontrada')

    await this.prisma.playlist.delete({ where: { id: playlistId } })
    if (playlist.imagePublicId) await this.cloudinary.remove(playlist.imagePublicId).catch(() => undefined)
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
