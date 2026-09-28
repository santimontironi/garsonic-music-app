import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module.js';
import { CloudinaryModule } from './cloudinary/cloudinary.module.js';
import { PrismaModule } from './prisma/prisma.module.js';

@Module({
  imports: [PrismaModule, CloudinaryModule, AuthModule],
})
export class AppModule {}
