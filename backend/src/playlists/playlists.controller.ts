import { BadRequestException, Body, Controller, Get, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import type { Request } from 'express'
import { createPlaylistSchema, type CreatePlaylistInput } from 'shared/schemas/playlist.schema'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js'
import { ZodValidationPipe } from '../common/pipes/zod.validation.pipe.js'
import { PlaylistsService } from './playlists.service.js'

@Controller('playlists')
@UseGuards(JwtAuthGuard)
export class PlaylistsController {
  constructor(private readonly playlistsService: PlaylistsService) {}

  @Get()
  findMine(@Req() req: Request) {
    return this.playlistsService.findByOwner(req.user!.sub)
  }

  @Post()
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
