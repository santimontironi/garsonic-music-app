import { BadRequestException, Body, Controller, Get, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import type { Request } from 'express'
import { createAlbumSchema, type CreateAlbumInput } from 'shared/schemas/album.schema.js'
import { Roles } from '../auth/decorators/roles.decorator.js'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js'
import { RolesGuard } from '../auth/guards/roles.guard.js'
import { ZodValidationPipe } from '../common/pipes/zod.validation.pipe.js'
import { AlbumesService } from './albumes.service.js'

@Controller('albumes')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ARTIST')
export class AlbumesController {
  constructor(private readonly albumesService: AlbumesService) {}

  @Get('me')
  findMine(@Req() req: Request) {
    return this.albumesService.findByArtist(req.user!.sub)
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('cover', {
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          return cb(new BadRequestException('La portada debe ser una imagen'), false)
        }
        cb(null, true)
      }
    })
  )
  create(
    @Req() req: Request,
    @Body(new ZodValidationPipe(createAlbumSchema)) body: CreateAlbumInput,
    @UploadedFile() cover?: Express.Multer.File
  ) {
    return this.albumesService.create(req.user!.sub, body, cover)
  }
}
