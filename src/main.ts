import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { json, urlencoded } from 'express';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const reflector = app.get(Reflector);
  const config = app.get<ConfigService>(ConfigService);
  const logger = new Logger('Bootstrap');

  const port = config.get<number>('PORT') || 3000;
  const corsOrigins = config.get<string>('CORS_ORIGINS');
  const bodyLimitJson = config.get<string>('BODY_LIMIT_JSON');
  const bodyLimitUrlEncoded = config.get<string>('BODY_LIMIT_URLENCODED');

  app.setGlobalPrefix('api/v1');

  app.use(json({ limit: bodyLimitJson }));
  app.use(urlencoded({ limit: bodyLimitUrlEncoded, extended: true }));

  app.use(cookieParser());
  app.use(helmet());
  app.enableCors({ origin: corsOrigins, credentials: true });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));
  app.useGlobalFilters(new GlobalExceptionFilter());

  await app.listen(port);

  logger.debug(`Application is running on: http://localhost:${port}`);
}
bootstrap();
