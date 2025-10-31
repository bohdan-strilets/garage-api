import { registerAs } from '@nestjs/config';
import ms, { StringValue } from 'ms';

import { SameSite } from '@app/common/enums';

export default registerAs('cookies', () => {
  const sameSite = (process.env.COOKIE_SAME_SITE ?? SameSite.LAX).toLowerCase();

  const httpOnly = (process.env.COOKIE_HTTP_ONLY ?? 'true') === 'true';
  const secure = (process.env.COOKIE_SECURE ?? 'false') === 'true';

  const domain = process.env.COOKIE_DOMAIN ?? 'localhost';
  const refreshName = process.env.COOKIE_REFRESH_TOKEN_NAME ?? 'refresh_token';
  const refreshExpiresStr = process.env.COOKIE_REFRESH_TOKEN_EXPIRES ?? '7d';
  const refreshMaxAge = ms(refreshExpiresStr as StringValue);

  return {
    sameSite,
    httpOnly,
    secure,
    domain,
    refresh: {
      name: refreshName,
      maxAge: refreshMaxAge,
      expiresText: refreshExpiresStr,
    },
  };
});
