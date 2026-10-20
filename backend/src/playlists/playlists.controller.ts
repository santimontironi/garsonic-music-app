import { BadRequestException, Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import type { Request } from 'express'
import { addSongToPlaylistSchema, createPlaylistSchema, updatePlaylistSchema, type AddSongToPlaylistInput, type CreatePlaylistInput, type UpdatePlaylistInput } from 'shared/schemas/playlist.schema'
import { Roles } from '../auth/decorators/roles.decorator.js'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js'
import { RolesGuard } from '../auth/guards/roles.guard.js'
import { ZodValidationPipe } from '../common/pipes/zod.validation.pipe.js'
import { PlaylistsService } from './playlists.service.js'

@Controller('playlists')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PlaylistsController {
  constructor(private readonly playlistsService: PlaylistsService) {}

  @Get()
  @Roles('USER')
  findMine(@Req() req: Request) {
    return this.playlistsService.findByOwner(req.user!.sub)
  }

  @Get(':id')
  findOne(@Req() req: Request, @Param('id', ParseUUIDPipe) id: string) {
    return this.playlistsService.findById(req.user!.sub, id)
  }

  @Patch(':id')
  @Roles('USER')
  update(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(updatePlaylistSchema)) body: UpdatePlaylistInput
  ) {
    return this.playlistsService.update(req.user!.sub, id, body)
  }

  @Delete(':id')
  @Roles('USER')
  remove(@Req() req: Request, @Param('id', ParseUUIDPipe) id: string) {
    return this.playlistsService.remove(req.user!.sub, id)
  }

  @Delete(':id/songs/:songId')
  @Roles('USER')
  removeSong(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) id: string,
    @Param('songId', ParseUUIDPipe) songId: string
  ) {
    return this.playlistsService.removeSong(req.user!.sub, id, songId)
  }

  @Post(':id/songs')
  @Roles('USER')
  addSong(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(addSongToPlaylistSchema)) body: AddSongToPlaylistInput
  ) {
    return this.playlistsService.addSong(req.user!.sub, id, body)
  }

  @Post()
  @Roles('USER')
  @UseInterceptors(
    FileInterceptor('image', {
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          return cb(new BadRequestException('La imagen debe ser una imagen válida'), false)
        }
        cb(null, true)
      }
    })
  )
  create(
    @Req() req: Request,
    @Body(new ZodValidationPipe(createPlaylistSchema)) body: CreatePlaylistInput,
    @UploadedFile() image?: Express.Multer.File
  ) {
    return this.playlistsService.create(req.user!.sub, body, image)
  }
}
