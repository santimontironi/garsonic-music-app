import { BadRequestException, Body, Controller, Get, Param, ParseUUIDPipe, Patch, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import type { Request } from 'express'
import { updateUserSchema, type UpdateUserInput } from 'shared/schemas/user.schema'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js'
import { ZodValidationPipe } from '../common/pipes/zod.validation.pipe.js'
import { UsersService } from './users.service.js'

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findById(id)
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
