import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { CryptoModule } from '../crypto';
import { PasswordModule } from '../password';
import { SessionModule } from '../session';
import { TokensModule } from '../tokens';
import { UserModule } from '../user';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccessTokenGuard, RefreshTokenGuard } from './guards';
import { JwtAccessStrategy, JwtRefreshStrategy } from './strategies';

@Module({
  imports: [
    PassportModule.register({}),
    UserModule,
    SessionModule,
    TokensModule,
    CryptoModule,
    PasswordModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtAccessStrategy,
    JwtRefreshStrategy,
    AccessTokenGuard,
    RefreshTokenGuard,
  ],
  exports: [AuthService],
})
export class AuthModule {}
