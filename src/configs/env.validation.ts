import * as Joi from 'joi';

export const envValidation = Joi.object({
  // Server
  PORT: Joi.number().required(),

  // Security
  CORS_ORIGIN: Joi.string().required(),
  COOKIE_SECRET: Joi.string().min(32).required(),
  BODY_LIMIT: Joi.string().required(),
});
