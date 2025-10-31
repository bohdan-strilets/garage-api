import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { databaseConfig } from '../env';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [databaseConfig.KEY],
      useFactory: (db: ConfigType<typeof databaseConfig>) => ({
        uri: db.uri,
        dbName: db.dbName,
      }),
    }),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
