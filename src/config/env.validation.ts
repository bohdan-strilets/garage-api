import * as joi from 'joi';

export enum NodeEnv {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  TEST = 'test',
}

export const envValidationSchema = joi.object({
  // Server
  NODE_ENV: joi
    .string()
    .valid(...Object.values(NodeEnv))
    .default(NodeEnv.DEVELOPMENT),
  HOST: joi.string().default('0.0.0.0'),
  PORT: joi.number().integer().min(1).max(65535).default(3000),
  API_PREFIX: joi.string().default('v1'),

  // Database
  MONGODB_URI: joi
    .string()
    .uri({ scheme: ['mongodb', 'mongodb+srv'] })
    .required(),

  // JWT
  JWT_ACCESS_SECRET: joi.string().min(32).required(),
  JWT_ACCESS_EXPIRES: joi.string().default('15m'),
  JWT_REFRESH_SECRET: joi.string().min(32).required(),
  JWT_REFRESH_EXPIRES: joi.string().default('7d'),

  // CORS
  ALLOWED_ORIGINS: joi.when('NODE_ENV', {
    is: NodeEnv.PRODUCTION,
    then: joi
      .string()
      .required()
      .invalid('*')
      .custom((value: string): string[] => value.split(',').map((origin) => origin.trim())),
    otherwise: joi.string().default('*'),
  }),

  // Rate Limiting
  RATE_LIMIT_TTL: joi.number().integer().min(1).default(60),
  RATE_LIMIT_MAX: joi.number().integer().min(1).default(100),

  // Uploads
  UPLOAD_MAX_IMAGE_MB: joi.number().integer().min(1).default(10),
  UPLOAD_MAX_PDF_MB: joi.number().integer().min(1).default(20),
});
