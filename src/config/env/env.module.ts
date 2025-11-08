import { ConfigModule, type ConfigModuleOptions } from '@nestjs/config';

import { resolveEnvFiles } from './env-paths';
import { appConfig, cookieConfig, securityConfig } from './name-space';
import { validationSchema } from './validation.schema';

export const envConfig = (): ReturnType<typeof ConfigModule.forRoot> => {
  const options: ConfigModuleOptions = {
    isGlobal: true,
    envFilePath: resolveEnvFiles(),
    validationSchema,
    load: [appConfig, securityConfig, cookieConfig],
    cache: true,
  };

  return ConfigModule.forRoot(options);
};
