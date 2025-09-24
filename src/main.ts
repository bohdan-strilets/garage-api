import { ClassSerializerInterceptor, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';

import compression from 'compression';
import helmet from 'helmet';

import { AppModule } from './app.module';

const logger = new Logger('Bootstrap');

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const nodeEnv = configService.get<string>('NODE_ENV');
  const port = configService.get<number>('PORT');
  const host = configService.get<string>('HOST');
  const apiPrefix = configService.get<string>('API_PREFIX');
  const allowedOrigins = configService.get<string>('ALLOWED_ORIGINS');

  app.setGlobalPrefix(apiPrefix);

  app.use(helmet());
  app.use(compression());

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      validationError: { target: false },
    }),
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.enableShutdownHooks();

  await app.listen(port, host);
  const url = await app.getUrl();

  logger.log(`Application is running on: ${url}/${apiPrefix}`);
  logger.log(`Environment: ${nodeEnv}`);
}

bootstrap().catch((err) => {
  logger.error('Error during bootstrap', err);
  process.exit(1);
});
