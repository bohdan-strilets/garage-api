import { Module } from '@nestjs/common';

import { RefreshCookieService } from './refresh-cookie.service';
import { TokensService } from './tokens.service';

@Module({
  providers: [TokensService, RefreshCookieService],
  exports: [TokensService, RefreshCookieService],
})
export class TokensModule {}
