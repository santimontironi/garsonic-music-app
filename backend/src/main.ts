import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Salta del proxy a la IP real del usuario.
  // En Vercel todos los requests pasan por su proxy (compartido, no uno por dispositivo),
  // así que sin esto req.ip sería la IP de Vercel para todos y compartirían el mismo
  // contador del rate limit. Vercel manda la IP real en el header X-Forwarded-For y con
  // trust proxy Express le cree: req.ip pasa a ser la IP pública del usuario (ej. 181.x.x.x).
  // Va 1 y no true: solo se confía en el primer salto (Vercel), así nadie puede inventar
  // IPs en el header para saltearse el límite. En local no hay proxy y no cambia nada.
  app.set('trust proxy', 1);

  // Todas las rutas quedan bajo /api (/auth/login → /api/auth/login).
  app.setGlobalPrefix('api');

  app.use(cookieParser());

  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}

await bootstrap();
