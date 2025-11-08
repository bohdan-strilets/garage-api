import { ConfigType, registerAs } from '@nestjs/config';

import { CookieSameSite } from '@app/common/enums';
import { parseBoolean } from '@app/common/utils';

export const cookieConfig = registerAs('cookie', () => {
  return {
    secret: process.env.COOKIE_SECRET,
    secure: parseBoolean(process.env.COOKIE_SECURE, false),
    sameSite: process.env.COOKIE_SAME_SITE ?? CookieSameSite.LAX,
    domain: process.env.COOKIE_DOMAIN ?? 'localhost',
    path: process.env.COOKIE_PATH ?? '/auth',
  };
});

export type CookieConfig = ConfigType<typeof cookieConfig>;
