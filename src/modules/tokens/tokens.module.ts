import { Module } from '@nestjs/common';

import { CryptoModule } from '../crypto';

import { RefreshCookieService } from './refresh-cookie.service';
import { TokensService } from './tokens.service';

@Module({
  imports: [CryptoModule],
  providers: [TokensService, RefreshCookieService],
  exports: [TokensService, RefreshCookieService],
})
export class TokensModule {}
