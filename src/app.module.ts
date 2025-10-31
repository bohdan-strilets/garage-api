import { Module } from '@nestjs/common';

import { DatabaseModule } from './config/database';
import { ConfigurationModule } from './config/env';

@Module({
  imports: [ConfigurationModule, DatabaseModule],
})
export class AppModule {}
