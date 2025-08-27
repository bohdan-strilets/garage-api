import * as Joi from 'joi';

export const envValidation = Joi.object({
  PORT: Joi.number().required(),

  CORS_ORIGINS: Joi.string().uri().required(),

  RATE_TTL: Joi.number().integer().min(1).required(),
  RATE_LIMIT: Joi.number().integer().min(1).required(),
});
