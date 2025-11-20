import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';

import { useContainer } from 'class-validator';
import cookieParser from 'cookie-parser';
import * as express from 'express';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/exception';
import { SuccessResponseInterceptor } from './common/http';
import {
  type AppConfig,
  appConfig,
  type CookieConfig,
  cookieConfig,
  type SecurityConfig,
  securityConfig,
} from './config/env/name-space';

const logger = new Logger('Bootstrap');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const reflector = app.get(Reflector);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const appCfg = app.get<AppConfig>(appConfig.KEY);
  const securityCfg = app.get<SecurityConfig>(securityConfig.KEY);
  const cookieCfg = app.get<CookieConfig>(cookieConfig.KEY);

  const NODE_ENV = appCfg.env;
  const PORT = appCfg.port;
  const GLOBAL_PREFIX = appCfg.globalPrefix;
  const CORS_ORIGIN = securityCfg.cors.origins;
  const COOKIE_SECRET = cookieCfg.secret;
  const BODY_LIMIT_JSON = securityCfg.bodyLimit.json;
  const BODY_LIMIT_URLENCODED = securityCfg.bodyLimit.urlencoded;

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

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new SuccessResponseInterceptor(reflector));

  await app.listen(PORT);

  logger.debug(`🚀 Server running on port ${PORT} in ${NODE_ENV} mode`);
}

bootstrap()
  .then()
  .catch((error) => {
    logger.error(`❌ Error occurred during bootstrap: ${error.message}`);
    process.exit(1);
  });
