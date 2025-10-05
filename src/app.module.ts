import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { validationEnv } from './configs/env/validation-env.config';
import { MongooseConfigService } from './configs/mongoose/mongoose.config';
import { CryptoModule } from './module/crypto';
import { PasswordModule } from './module/password';
import { UserModule } from './module/user';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: validationEnv,
    }),
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
    CryptoModule,
    PasswordModule,
    UserModule,
  ],
})
export class AppModule {}
