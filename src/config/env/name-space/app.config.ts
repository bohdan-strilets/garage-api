import { ConfigType, registerAs } from '@nestjs/config';

import { NodeEnv } from '@app/common/enums';

export const appConfig = registerAs('app', () => {
  const port = Number(process.env.PORT ?? 3000);

  return {
    env: process.env.NODE_ENV ?? NodeEnv.DEVELOPMENT,
    port,
    globalPrefix: process.env.APP_GLOBAL_PREFIX ?? 'api',
    baseUrl: process.env.API_BASE_URL ?? `http://localhost:${port}/api`,
    clientUrl: process.env.CLIENT_URL ?? 'http://localhost:5173',
  };
});

export type AppConfig = ConfigType<typeof appConfig>;
