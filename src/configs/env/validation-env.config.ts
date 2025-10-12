import * as Joi from 'joi';

import { CookieSameSite } from './enum/cookie-same-site.enum';
import { NodeEnv } from './enum/node-env.enum';

const env = Object.values(NodeEnv);
const sameSite = Object.values(CookieSameSite);

export const validationEnv = Joi.object({
  // ENV
  NODE_ENV: Joi.string()
    .valid(...env)
    .default(NodeEnv.DEVELOPMENT),
  PORT: Joi.number().integer().min(1).default(3000),

  // CORS
  CORS_ORIGIN: Joi.string().default('*'),

  // DB
  MONGO_URI: Joi.string().required(),

  // Argon2
  HASH_MEMORY_COST: Joi.number().integer().min(1).default(65536),
  HASH_TIME_COST: Joi.number().integer().min(1).default(3),
  HASH_PARALLELISM: Joi.number().integer().min(1).default(2),

  //  Password
  PASSWORD_EXPIRATION_DAYS: Joi.number().integer().min(1).default(180),
  PASSWORD_RESET_TOKEN_EXPIRATION_HOURS: Joi.number().integer().min(1).default(1),
  PASSWORD_LENGTH_MIN: Joi.number().integer().min(1).default(8),
  PASSWORD_LENGTH_MAX: Joi.number().integer().min(Joi.ref('PASSWORD_LENGTH_MIN')).default(64),

  // JWT
  JWT_ISSUER: Joi.string().required(),
  JWT_AUDIENCE: Joi.string().required(),
  JWT_TOLERANCE: Joi.number().integer().min(0).default(10),
  JWT_ACCESS_SECRET: Joi.string().required(),
  JWT_ACCESS_EXPIRES_HOURS: Joi.string().default('1h'),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_REFRESH_EXPIRES_DAYS: Joi.string().default('30d'),

  //  COOKIE
  // COOKIE_PATH: Joi.string().default('/'),
  // COOKIE_DOMAIN: Joi.string().default('localhost'),
  COOKIE_SECURE: Joi.boolean().default(false),
  COOKIE_SAME_SITE: Joi.string()
    .valid(...sameSite)
    .default(CookieSameSite.LAX),
  COOKIE_HTTPONLY: Joi.boolean().default(true),
});
