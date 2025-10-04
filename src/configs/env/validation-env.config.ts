import * as Joi from 'joi';
import { NodeEnv } from './node-env.enum';

const env = Object.values(NodeEnv);

export const validationEnv = Joi.object({
  NODE_ENV: Joi.string()
    .valid(...env)
    .default(NodeEnv.DEVELOPMENT),
  PORT: Joi.number().integer().min(1).default(3000),
  CORS_ORIGIN: Joi.string().default('*'),
});
