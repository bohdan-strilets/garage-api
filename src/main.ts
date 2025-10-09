import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { NodeEnv } from './configs/env/enum/node-env.enum';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const logger = new Logger(bootstrap.name);

  const port = configService.get<number>('PORT', 3000);
  const corsOrigin = configService.get<string>('CORS_ORIGIN', '*');
  const nodeEnv = configService.get<string>('NODE_ENV', NodeEnv.DEVELOPMENT);

  app.setGlobalPrefix('api/v1');
  app.enableCors({ origin: corsOrigin });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: true,
    }),
  );

  await app.listen(port);

  const url = await app.getUrl();

  logger.debug(`🚀 Application is running on: ${url}/api/v1`);
  logger.debug(`🌱 Environment: ${nodeEnv}`);
  logger.debug(`📅 Started at: ${new Date().toLocaleString()}`);
}

bootstrap();
