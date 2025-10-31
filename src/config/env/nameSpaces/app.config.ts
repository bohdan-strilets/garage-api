import { registerAs } from '@nestjs/config';

import { EnvMode } from '@app/common/enums';

export default registerAs('app', () => ({
  name: process.env.APP_NAME ?? 'garage-api',
  env: process.env.NODE_ENV ?? EnvMode.DEVELOPMENT,
  port: parseInt(process.env.APP_PORT ?? '3000', 10),
  globalPrefix: process.env.APP_GLOBAL_PREFIX ?? 'api',
}));
