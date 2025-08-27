import * as Joi from 'joi';

export const envValidation = Joi.object({
  PORT: Joi.number().required(),
  API_PREFIX: Joi.string().required(),

  CORS_ORIGINS: Joi.string().uri().required(),

  RATE_TTL: Joi.number().integer().min(1).required(),
  RATE_LIMIT: Joi.number().integer().min(1).required(),

  BODY_LIMIT_JSON: Joi.string().required(),
  BODY_LIMIT_URLENCODED: Joi.string().required(),

  MONGO_URI: Joi.string().required(),

  JWT_ACCESS_SECRET: Joi.string().required(),
  JWT_ACCESS_TTL: Joi.string().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_REFRESH_TTL: Joi.string().required(),

  REFRESH_COOKIE_NAME: Joi.string().required(),
  COOKIE_DOMAIN: Joi.string().required(),
  COOKIE_SECURE: Joi.boolean().required(),
  COOKIE_SAMESITE: Joi.string().valid('strict', 'lax', 'none').required(),

  PASSWORD_MIN_LENGTH: Joi.number().integer().min(8).required(),
  ARGON_MEMORY: Joi.number().integer().min(8).required(),
  ARGON_ITERATIONS: Joi.number().integer().min(1).required(),
  ARGON_PARALLELISM: Joi.number().integer().min(1).required(),
});
