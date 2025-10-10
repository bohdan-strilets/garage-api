import { Module } from '@nestjs/common';

import { CryptoModule } from '@modules/crypto';

import { CookieAdapter } from './cookie.adapter';
import { TokenService } from './token.service';

@Module({
  imports: [CryptoModule],
  providers: [TokenService, CookieAdapter],
  exports: [TokenService, CookieAdapter],
})
export class TokenModule {}
