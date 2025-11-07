import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import cookieParser from 'cookie-parser';
import * as express from 'express';
import helmet from 'helmet';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  const NODE_ENV = process.env.NODE_ENV;
  const PORT = process.env.PORT;
  const GLOBAL_PREFIX = process.env.GLOBAL_PREFIX;
  const CORS_ORIGIN = process.env.CORS_ORIGIN;
  const COOKIE_SECRET = process.env.COOKIE_SECRET;
  const BODY_LIMIT_JSON = process.env.BODY_LIMIT_JSON;
  const BODY_LIMIT_URLENCODED = process.env.BODY_LIMIT_URLENCODED;

  app.enableCors({
    origin: CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  app.use(helmet());

  app.use(express.json({ limit: BODY_LIMIT_JSON }));
  app.use(express.urlencoded({ limit: BODY_LIMIT_URLENCODED, extended: true }));

  app.use(cookieParser(COOKIE_SECRET));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.setGlobalPrefix(GLOBAL_PREFIX);

  await app.listen(PORT);
  logger.debug(`🚀 Server running on port ${PORT} in ${NODE_ENV} mode`);
}
bootstrap();
