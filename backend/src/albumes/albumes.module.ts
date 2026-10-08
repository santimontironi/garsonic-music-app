import { Module } from '@nestjs/common';
import { AlbumesController } from './albumes.controller.js';
import { AlbumesService } from './albumes.service.js';

@Module({
  controllers: [AlbumesController],
  providers: [AlbumesService]
})
export class AlbumesModule {}
