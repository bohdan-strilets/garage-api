import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

const logger = new Logger('Bootstrap');

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);

  logger.debug('Application is running on: http://localhost:3000');
}

bootstrap().catch((err) => {
  logger.error('Error during bootstrap', err);
  process.exit(1);
});
