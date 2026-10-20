import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // En Vercel los requests pasan por su proxy (Edge Network) antes de llegar acá,
  // así que sin esto req.ip sería la IP del proxy y todos los usuarios compartirían
  // el mismo contador del rate limit. Con trust proxy, Express toma la IP real del
  // header X-Forwarded-For. Va 1 y no true: se confía solo en el proxy de Vercel,
  // para que nadie pueda inventar IPs en el header y saltearse el límite.
  // En local no hay proxy y no cambia nada.
  app.set('trust proxy', 1); //Express entiende que ese primer salto (Vercel) es confiable y le cree el header. Entonces req.ip = 181.x.x.x, la IP pública del usuario.

  app.setGlobalPrefix('api');

  app.use(cookieParser());

  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}

await bootstrap();
