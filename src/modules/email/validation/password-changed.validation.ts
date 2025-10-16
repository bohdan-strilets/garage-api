import * as Joi from 'joi';

export const passwordChangedSchema = Joi.object({
  changedAtISO: Joi.string().isoDate(),
  userName: Joi.string().min(1).optional(),
});
