import { ConfigType, registerAs } from '@nestjs/config';

export const databaseConfig = registerAs('database', () => {
  return {
    uri: process.env.MONGO_URI,
    dbName: process.env.MONGO_DB_NAME || 'garage-db',
    appName: process.env.MONGO_APP_NAME || 'garage-api-dev',
  };
});

export type DatabaseConfig = ConfigType<typeof databaseConfig>;
