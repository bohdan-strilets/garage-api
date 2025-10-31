import { registerAs } from '@nestjs/config';

import { stringToArray } from '@app/common/utils';

export default registerAs('cors', () => ({
  origins: stringToArray(process.env.CORS_ORIGINS),
  credentials: (process.env.CORS_CREDENTIALS ?? 'false') === 'true',
}));
