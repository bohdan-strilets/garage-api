import * as Joi from 'joi';

import { Locale } from '@modules/user/enums/locale.enum';

import { TemplateId } from './template-id.type';

export type TemplateMeta = {
  id: TemplateId;
  locales: Locale[];
  schema: Joi.Schema;
  pathsResolver: (locale: Locale) => { subjectPath: string; bodyPath: string };
};
