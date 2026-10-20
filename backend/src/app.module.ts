import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module.js';
import { CloudinaryModule } from './cloudinary/cloudinary.module.js';
import { MailModule } from './mail/mail.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { SongsModule } from './songs/songs.module.js';
import { AlbumesModule } from './albumes/albumes.module.js';
import { PlaylistsModule } from './playlists/playlists.module.js';
import { GenresModule } from './genres/genres.module.js';
import { UsersModule } from './users/users.module.js';
import { SearchModule } from './search/search.module.js';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60_000, limit: 70 }],
      errorMessage: 'Demasiadas solicitudes, probá de nuevo en un minuto',
    }),
    PrismaModule, CloudinaryModule, MailModule, AuthModule, SongsModule, AlbumesModule, PlaylistsModule, GenresModule, UsersModule, SearchModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
