import * as Joi from 'joi';

import { EnvMode, SameSite } from '@app/common/enums';

const sameSite = Object.values(SameSite);
const envMode = Object.values(EnvMode);

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid(...envMode)
    .default(EnvMode.DEVELOPMENT),

  APP_NAME: Joi.string().default('garage-api'),
  APP_PORT: Joi.number().port().default(3000),
  APP_GLOBAL_PREFIX: Joi.string().default('api'),

  MONGODB_URI: Joi.string().required(),
  MONGODB_DB_NAME: Joi.string().required(),

  JWT_ACCESS_SECRET: Joi.string().min(12).required(),
  JWT_ACCESS_EXPIRES: Joi.string().default('15m'),
  JWT_REFRESH_SECRET: Joi.string().min(12).required(),
  JWT_REFRESH_EXPIRES: Joi.string().default('7d'),

  CORS_ORIGINS: Joi.string().default('http://localhost:5173'),
  CORS_CREDENTIALS: Joi.boolean().truthy('true').falsy('false').default(true),

  COOKIE_REFRESH_TOKEN_NAME: Joi.string().default('refresh_token'),
  COOKIE_REFRESH_TOKEN_EXPIRES: Joi.string().default('7d'),
  COOKIE_SAME_SITE: Joi.string()
    .valid(...sameSite)
    .default(SameSite.LAX),
  COOKIE_HTTP_ONLY: Joi.boolean().truthy('true').falsy('false').default(true),
  COOKIE_SECURE: Joi.boolean().truthy('true').falsy('false').default(false),
  COOKIE_DOMAIN: Joi.string().default('localhost'),
});
