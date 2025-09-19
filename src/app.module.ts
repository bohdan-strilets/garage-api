import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { envValidation } from './configs/env.validation';
import { AuthModule } from './modules/auth/auth.module';
import { HashModule } from './modules/hash/hash.module';
import { SessionsModule } from './modules/sessions/sessions.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validationSchema: envValidation }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI'),
      }),
    }),
    UserModule,
    SessionsModule,
    HashModule,
    AuthModule,
  ],
})
export class AppModule {}
