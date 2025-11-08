import { ThrottlerModule, type ThrottlerModuleOptions } from '@nestjs/throttler';

import { secondsToMs } from '@app/common/utils';

import { SecurityConfig, securityConfig } from '../env/name-space';

export const throttlerConfig = () =>
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
  });
