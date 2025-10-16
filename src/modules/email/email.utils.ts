import path from 'node:path';

import { Locale } from '@modules/user/enums/locale.enum';

import { TemplateId } from './types/template-id.type';

const SHORT_LOCALE_MAP: Record<Locale, string> = {
  [Locale.PL]: 'pl',
  [Locale.UA]: 'ua',
  [Locale.EN]: 'en',
};

export const makePathsResolver = (templateId: TemplateId) => {
  return (locale: Locale) => {
    const short = SHORT_LOCALE_MAP[locale] ?? SHORT_LOCALE_MAP[Locale.EN];
    const base = path.resolve(__dirname, 'templates', templateId);
    return {
      subjectPath: path.join(base, `subject.${short}.txt`),
      bodyPath: path.join(base, `body.${short}.html`),
    };
  };
};
