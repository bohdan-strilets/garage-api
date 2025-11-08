import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DatabaseConfig, databaseConfig } from '../env/name-space';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [databaseConfig.KEY],
      useFactory: (databaseCfg: DatabaseConfig) => ({
        uri: databaseCfg.uri,
        dbName: databaseCfg.dbName,
        appName: databaseCfg.appName,
      }),
    }),
  ],
  exports: [MongooseModule],
})
export class MongoModule {}
