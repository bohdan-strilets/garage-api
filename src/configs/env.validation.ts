import * as Joi from 'joi';

export const envValidation = Joi.object({
  // Server
  PORT: Joi.number().required(),

  // Security
  CORS_ORIGIN: Joi.string().required(),
  COOKIE_SECRET: Joi.string().min(32).required(),
  BODY_LIMIT: Joi.string().required(),

  // Database
  MONGO_URI: Joi.string().uri().required(),

  //  JWT
  JWT_ACCESS_SECRET: Joi.string().min(32).required(),
  JWT_REFRESH_SECRET: Joi.string().min(32).required(),
  JWT_ACCESS_TTL: Joi.number().min(1).required(),
  JWT_REFRESH_TTL: Joi.number().min(1).required(),
});
