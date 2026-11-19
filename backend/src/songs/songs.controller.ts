import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Req, UseGuards } from '@nestjs/common'
import type { Request } from 'express'
import { createSongBodySchema, updateSongAlbumSchema, type CreateSongBody, type UpdateSongAlbumInput } from 'shared/schemas/song.schema'
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

  @Get('fav')
  @Roles('USER')
  findFavs(@Req() req: Request) {
    return this.songsService.findFavs(req.user!.sub)
  }

  @Patch(':id/album')
  updateAlbum(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(updateSongAlbumSchema)) body: UpdateSongAlbumInput
  ) {
    return this.songsService.updateAlbum(req.user!.sub, id, body)
  }

  @Post(':id/fav')
  @Roles('USER')
  toggleFav(@Req() req: Request, @Param('id', ParseUUIDPipe) id: string) {
    return this.songsService.toggleFav(req.user!.sub, id)
  }

  @Delete(':id')
  remove(@Req() req: Request, @Param('id', ParseUUIDPipe) id: string) {
    return this.songsService.remove(req.user!.sub, id)
  }

  // Los archivos no pasan por acá (Vercel corta los requests de más de 4.5 MB): el front los sube directo a Cloudinary con esta firma
  @Get('upload-signature')
  getUploadSignature(@Req() req: Request) {
    return this.songsService.getUploadSignature(req.user!.sub)
  }

  @Post()
  create(@Req() req: Request, @Body(new ZodValidationPipe(createSongBodySchema)) body: CreateSongBody) {
    return this.songsService.create(req.user!.sub, body)
  }
}
