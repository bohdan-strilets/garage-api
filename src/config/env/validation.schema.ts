import * as joi from 'joi';

import { CookieSameSite, NodeEnv } from '@app/common/enums';
import { apiPrefixRegex } from '@app/common/regex';

const nodeEnv = Object.values(NodeEnv);
const sameSite = Object.values(CookieSameSite);

export const validationSchema = joi.object({
  NODE_ENV: joi
    .string()
    .valid(...nodeEnv)
    .default(NodeEnv.DEVELOPMENT),
  PORT: joi.number().integer().min(1).max(65535).default(4000),
  GLOBAL_PREFIX: joi.string().pattern(apiPrefixRegex).default('api'),
  API_BASE_URL: joi.string().uri().default('http://localhost:4000/api'),
  CLIENT_URL: joi.string().uri().default('http://localhost:5173'),

  CORS_ORIGIN: joi.string().required(),
  CORS_CREDENTIALS: joi.boolean().truthy('true').falsy('false').default(true),

  COOKIE_SECRET: joi.string().min(32).required(),
  COOKIE_SECURE: joi.boolean().truthy('true').falsy('false').default(false),
  COOKIE_SAME_SITE: joi
    .string()
    .valid(...sameSite)
    .default(CookieSameSite.LAX),
  COOKIE_DOMAIN: joi.string().default('localhost'),
  COOKIE_PATH: joi.string().default('/auth'),

  BODY_LIMIT_JSON: joi.number().integer().min(1).default(1),
  BODY_LIMIT_URLENCODED: joi.number().integer().min(1).default(1),

  RATE_TTL: joi.number().integer().min(1).default(60),
  RATE_LIMIT: joi.number().integer().min(1).default(100),

  MONGO_URI: joi.string().uri().required(),
  MONGO_DB_NAME: joi.string().default('garage-db'),
  MONGO_APP_NAME: joi.string().default('garage-api-dev'),
});
