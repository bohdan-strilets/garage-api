import Joi from 'joi';

export const envValidation = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production').required(),
  PORT: Joi.number().port().required(),

  MONGO_URI: Joi.string().required(),
  MONGO_HOST: Joi.string().required(),
  MONGO_DB: Joi.string().required(),
  MONGO_OPTIONS: Joi.string().required(),

  JWT_ACCESS_SECRET: Joi.string().min(40).required(),
  JWT_ACCESS_EXPIRES: Joi.string().required(),
  JWT_REFRESH_SECRET: Joi.string().min(40).required(),
  JWT_REFRESH_EXPIRES: Joi.string().required(),

  CLIENT_URL: Joi.string().uri().required(),
  API_URL: Joi.string().uri().required(),
});
