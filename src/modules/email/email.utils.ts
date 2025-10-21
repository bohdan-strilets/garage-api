import * as fs from 'node:fs';
import * as path from 'node:path';

import { Locale } from '@modules/user/enums/locale.enum';

import { TemplateId } from './types/template-id.type';

const SHORT_LOCALE_MAP: Record<Locale, string> = {
  [Locale.PL]: 'pl',
  [Locale.UA]: 'ua',
  [Locale.EN]: 'en',
};

const resolveTemplatesDir = (): string => {
  const candidates = [
    path.resolve(process.cwd(), 'src/modules/email/templates'),
    path.resolve(process.cwd(), 'dist/modules/email/templates'),
    path.resolve(__dirname, 'templates'),
  ];

  for (const dir of candidates) {
    if (fs.existsSync(dir)) return dir;
  }

  throw new Error(
    `Email templates directory not found. Tried:\n` + candidates.map((d) => ` - ${d}`).join('\n'),
  );
};

const TEMPLATES_DIR = resolveTemplatesDir();

export const makePathsResolver = (templateId: TemplateId) => {
  return (locale: Locale) => {
    const short = SHORT_LOCALE_MAP[locale] ?? SHORT_LOCALE_MAP[Locale.EN];
    const base = path.resolve(TEMPLATES_DIR, templateId);

    return {
      subjectPath: path.join(base, `subject.${short}.txt`),
      bodyPath: path.join(base, `body.${short}.html`),
    };
  };
};
