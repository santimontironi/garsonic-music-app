import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module.js';
import { CloudinaryModule } from './cloudinary/cloudinary.module.js';
import { MailModule } from './mail/mail.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { SongsModule } from './songs/songs.module.js';
import { AlbumesModule } from './albumes/albumes.module.js';

@Module({
  imports: [PrismaModule, CloudinaryModule, MailModule, AuthModule, SongsModule, AlbumesModule],
})
export class AppModule {}
