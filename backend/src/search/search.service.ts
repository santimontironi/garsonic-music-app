import { Injectable } from '@nestjs/common'
import type { SearchQueryInput } from 'shared/schemas/search.schema'
import type { Role } from '../generated/prisma/enums.js'
import { PrismaService } from '../prisma/prisma.service.js'

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  async search({ q }: SearchQueryInput) {
    const contains = { contains: q, mode: 'insensitive' } as const
    const ref = { select: { id: true, username: true } }

    const [artists, users, songs, albums, playlists] = await Promise.all([ //promise.all hace que se ejecuten todas las promesas al mismo tiempo, en lugar de una por una, lo que hace que la busqueda sea mas rapida. devuelve una unica promesa siempre y cuando todas las promesas se resuelvan correctamente, si alguna falla, la promesa de promise.all falla y devuelve un error.
      this.findPeople('ARTIST', contains),
      this.findPeople('USER', contains),
      this.prisma.song.findMany({
        where: { title: contains },
        take: 5,
        orderBy: { createdAt: 'desc' },
        omit: { audioPublicId: true, coverPublicId: true },
        include: { album: { omit: { coverPublicId: true } }, genre: true, artist: ref }
      }),
      this.prisma.album.findMany({
        where: { title: contains },
        take: 5,
        orderBy: { createdAt: 'desc' },
        omit: { coverPublicId: true },
        include: { artist: ref, _count: { select: { songs: true } } }
      }),
      this.prisma.playlist.findMany({
        where: { isPublic: true, name: contains },
        take: 5,
        orderBy: { createdAt: 'desc' },
        omit: { imagePublicId: true },
        include: { owner: ref, _count: { select: { songs: true } } }
      })
    ])

    return { artists, users, songs, albums, playlists }
  }

  private findPeople(role: Role, contains: { contains: string; mode: 'insensitive' }) { //insensitive es para que no distinga entre mayusculas y minusculas
    return this.prisma.user.findMany({
      where: { role, OR: [{ username: contains }, { name: contains }, { surname: contains }] },
      take: 5,
      orderBy: { username: 'asc' },
      select: { id: true, username: true, name: true, surname: true, photo: true }
    })
  }
}
