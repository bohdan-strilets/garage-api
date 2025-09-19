import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = new Logger('Bootstrap');
  const reflector = app.get(Reflector);
  const configService = app.get(ConfigService);

  const PORT = configService.get<number>('PORT') || 3000;
  const CORS_ORIGIN = configService.get<string>('CORS_ORIGIN');
  const COOKIE_SECRET = configService.get<string>('COOKIE_SECRET');
  const BODY_LIMIT = configService.get<string>('BODY_LIMIT');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

  app.enableCors({ origin: CORS_ORIGIN, credentials: true });
  app.use(cookieParser(COOKIE_SECRET));
  app.use(helmet());

  app.use(bodyParser.json({ limit: BODY_LIMIT }));
  app.use(bodyParser.urlencoded({ limit: BODY_LIMIT, extended: true }));

  app.setGlobalPrefix('api');

  await app.listen(PORT);
  logger.debug(`Application is running on port: ${PORT}`);
}

bootstrap();
