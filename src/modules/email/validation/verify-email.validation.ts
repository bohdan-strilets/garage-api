import * as Joi from 'joi';

export const verifyEmailSchema = Joi.object({
  verifyUrl: Joi.string().uri().required(),
  userName: Joi.string().min(1).optional(),
});
