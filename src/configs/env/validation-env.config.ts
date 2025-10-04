import * as Joi from 'joi';
import { NodeEnv } from './enum/node-env.enum';

const env = Object.values(NodeEnv);

export const validationEnv = Joi.object({
  // Base
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
});
