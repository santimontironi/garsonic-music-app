import { BadRequestException, Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import type { Request } from 'express'
import { updateUserSchema, type UpdateUserInput } from 'shared/schemas/user.schema'
import { Roles } from '../auth/decorators/roles.decorator.js'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js'
import { RolesGuard } from '../auth/guards/roles.guard.js'
import { ZodValidationPipe } from '../common/pipes/zod.validation.pipe.js'
import { UsersService } from './users.service.js'

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me/fav-artists')
  @Roles('USER')
  findFavArtists(@Req() req: Request) {
    return this.usersService.findFavArtists(req.user!.sub)
  }

  @Get(':id')
  findOne(@Req() req: Request, @Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findById(req.user!.sub, id)
  }

  @Post(':id/fav')
  @Roles('USER')
  toggleFavArtist(@Req() req: Request, @Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.toggleFavArtist(req.user!.sub, id)
  }

  @Patch('me')
  @UseInterceptors(
    FileInterceptor('photo', {
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          return cb(new BadRequestException('La foto debe ser una imagen'), false)
        }
        cb(null, true)
      }
    })
  )
  update(
    @Req() req: Request,
    @Body(new ZodValidationPipe(updateUserSchema)) body: UpdateUserInput,
    @UploadedFile() photo?: Express.Multer.File
  ) {
    return this.usersService.update(req.user!.sub, body, photo)
  }
}
