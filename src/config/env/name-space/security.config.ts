import { ConfigType, registerAs } from '@nestjs/config';

import { parseBoolean, parseOrigins } from '@app/common/utils';

export const securityConfig = registerAs('security', () => {
  return {
    cors: {
      origins: parseOrigins(process.env.CORS_ORIGINS),
      credentials: parseBoolean(process.env.CORS_CREDENTIALS, true),
    },
    rateLimit: {
      ttl: Number(process.env.RATE_TTL ?? 60),
      limit: Number(process.env.RATE_LIMIT ?? 100),
    },
    bodyLimit: {
      json: `${Number(process.env.BODY_LIMIT_JSON ?? 1)}mb`,
      urlencoded: `${Number(process.env.BODY_LIMIT_URLENCODED ?? 1)}mb`,
    },
  };
});

export type SecurityConfig = ConfigType<typeof securityConfig>;
