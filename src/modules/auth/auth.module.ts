import { Module } from '@nestjs/common';

import { PasswordModule } from '@modules/password';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { LocalStrategy } from './strategies/local.strategy';

import { CryptoModule } from '../crypto';
import { SessionsModule } from '../sessions';
import { CookieAdapter, TokenModule } from '../token';
import { UserModule } from '../user';

@Module({
  imports: [UserModule, SessionsModule, CryptoModule, PasswordModule, TokenModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtAccessStrategy,
    JwtRefreshStrategy,
    LocalAuthGuard,
    JwtRefreshGuard,
    CookieAdapter,
  ],
})
export class AuthModule {}
