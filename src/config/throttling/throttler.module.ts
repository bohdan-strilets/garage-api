import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerModuleOptions } from '@nestjs/throttler';

import { secondsToMs } from '@app/common/utils';

import { SecurityConfig, securityConfig } from '../env/name-space';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      inject: [securityConfig.KEY],
      useFactory: (securityCfg: SecurityConfig): ThrottlerModuleOptions => {
        const ttl = secondsToMs(securityCfg.rateLimit?.ttl) ?? 60_000;
        const limit = securityCfg.rateLimit?.limit ?? 100;

        return {
          throttlers: [
            {
              ttl,
              limit,
            },
          ],
        };
      },
    }),
  ],
  exports: [ThrottlerModule],
})
export class ThrottlerConfig {}
