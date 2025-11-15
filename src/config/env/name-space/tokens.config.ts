import { ConfigType, registerAs } from '@nestjs/config';

export const tokensConfig = registerAs('tokens', () => ({
  issuer: process.env.JWT_ISSUER ?? 'garage-api',
  audience: process.env.JWT_AUDIENCE ?? 'garage-web',

  access: {
    secret: process.env.JWT_ACCESS_SECRET,
    ttlSec: Number(process.env.JWT_ACCESS_TTL_SEC ?? 900),
  },

  refresh: {
    secret: process.env.JWT_REFRESH_SECRET,
    ttlSec: Number(process.env.JWT_REFRESH_TTL_SEC ?? 60 * 60 * 24 * 30),
  },
}));

export type TokensConfig = ConfigType<typeof tokensConfig>;
