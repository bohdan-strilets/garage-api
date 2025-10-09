import { Module } from '@nestjs/common';

import { CookieAdapter } from './cookie.adapter';
import { TokenService } from './token.service';

@Module({
  providers: [TokenService, CookieAdapter],
  exports: [TokenService, CookieAdapter],
})
export class TokenModule {}
