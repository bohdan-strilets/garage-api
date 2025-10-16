import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Locale } from '@modules/user/enums/locale.enum';

import { makePathsResolver } from './email.utils';
import { TemplateId } from './types/template-id.type';
import { TemplateMeta } from './types/template-meta.type';
import { passwordChangedSchema } from './validation/password-changed.validation';
import { passwordResetSchema } from './validation/password-reset.validation';
import { verifyEmailSchema } from './validation/verify-email.validation';

export const SUPPORTED_LOCALES: Locale[] = Object.values(Locale);

const TEMPLATES: Record<TemplateId, TemplateMeta> = {
  'verify-email': {
    id: 'verify-email',
    locales: SUPPORTED_LOCALES,
    schema: verifyEmailSchema,
    pathsResolver: makePathsResolver('verify-email'),
  },
  'password-reset': {
    id: 'password-reset',
    locales: SUPPORTED_LOCALES,
    schema: passwordResetSchema,
    pathsResolver: makePathsResolver('password-reset'),
  },
  'password-changed': {
    id: 'password-changed',
    locales: SUPPORTED_LOCALES,
    schema: passwordChangedSchema,
    pathsResolver: makePathsResolver('password-changed'),
  },
};

@Injectable()
export class EmailTemplates {
  private readonly defaultLocale: Locale;

  constructor(private readonly configService: ConfigService) {
    const localeByEnv = configService.get('MAIL_DEFAULT_LOCALE');

    this.defaultLocale = SUPPORTED_LOCALES.includes(localeByEnv)
      ? (localeByEnv as Locale)
      : Locale.EN;
  }

  getMeta(templateId: TemplateId): TemplateMeta {
    const meta = TEMPLATES[templateId];

    if (!meta) {
      throw new NotFoundException(`Email template "${templateId}" is not supported`);
    }

    return meta;
  }

  ensureSupportedLocale(locale?: string | null): Locale {
    return SUPPORTED_LOCALES.includes(locale as Locale) ? (locale as Locale) : this.defaultLocale;
  }
}
