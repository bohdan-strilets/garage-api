import * as Joi from 'joi';

export const passwordResetSchema = Joi.object({
  resetUrl: Joi.string().uri().required(),
  userName: Joi.string().min(1).optional(),
});
