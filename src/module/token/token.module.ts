import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { CookieAdapter } from './cookie.adapter';
import { TokenService } from './token.service';

@Module({
  imports: [JwtModule.register({})],
  providers: [TokenService, CookieAdapter],
  exports: [TokenService, CookieAdapter],
})
export class TokenModule {}
