import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);
  const port = config.get<number>('PORT');
  const cookieSecret = config.get<string>('COOKIE_SECRET');
  const clientUrl = config.get<string>('CLIENT_URL');

  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.enableCors({
    origin: [clientUrl],
    credentials: true,
  });

  app.use(helmet());
  app.use(cookieParser(cookieSecret));
  app.use(compression());

  await app.listen(port);

  logger.debug(`Application listening on port ${port}`);
}
bootstrap();
