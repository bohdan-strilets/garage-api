import * as Joi from 'joi';

export const recipientSchema = Joi.string().trim().lowercase().email();
