import { BadRequestException, Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common'
import { FileFieldsInterceptor } from '@nestjs/platform-express'
import type { Request } from 'express'
import { createSongSchema, updateSongAlbumSchema, type CreateSongInput, type UpdateSongAlbumInput } from 'shared/schemas/song.schema.js'
import { Roles } from '../auth/decorators/roles.decorator.js'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js'
import { RolesGuard } from '../auth/guards/roles.guard.js'
import { ZodValidationPipe } from '../common/pipes/zod.validation.pipe.js'
import { SongsService } from './songs.service.js'

@Controller('songs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ARTIST')
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @Get('me')
  findMine(@Req() req: Request) {
    return this.songsService.findSongsByArtist(req.user!.sub)
  }

  @Patch(':id/album')
  updateAlbum(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(updateSongAlbumSchema)) body: UpdateSongAlbumInput
  ) {
    return this.songsService.updateAlbum(req.user!.sub, id, body)
  }

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'audio', maxCount: 1 }, { name: 'cover', maxCount: 1 }], {
      limits: { fileSize: 20 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        if (file.fieldname === 'audio' && !file.mimetype.startsWith('audio/')) {
          return cb(new BadRequestException('El archivo de la canción debe ser un audio'), false)
        }
        if (file.fieldname === 'cover' && !file.mimetype.startsWith('image/')) {
          return cb(new BadRequestException('La portada debe ser una imagen'), false)
        }
        cb(null, true)
      }
    })
  )

  async create(
    @Req() req: Request,
    @Body(new ZodValidationPipe(createSongSchema)) body: CreateSongInput,
    @UploadedFiles() files: { audio?: Express.Multer.File[]; cover?: Express.Multer.File[] }
  ) {
    const audio = files?.audio?.[0]
    const cover = files?.cover?.[0]

    if (!audio) throw new BadRequestException('El audio es obligatorio')

    if (cover && cover.size > 5 * 1024 * 1024) throw new BadRequestException('La portada no puede superar los 5 MB')

    return this.songsService.create(req.user!.sub, body, audio, cover)
  }
}
