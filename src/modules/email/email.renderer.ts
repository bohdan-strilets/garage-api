import * as fs from 'node:fs';

import { BadRequestException, Injectable } from '@nestjs/common';
import Handlebars from 'handlebars';
import { htmlToText } from 'html-to-text';

import { Locale } from '@modules/user/enums/locale.enum';

import { EmailTemplates } from './email.templates';
import { TemplateId } from './types/template-id.type';

type RenderResult = {
  subject: string;
  html: string;
  text: string;
};

@Injectable()
export class EmailRenderer {
  constructor(private readonly templates: EmailTemplates) {}

  async render(
    templateId: TemplateId,
    payload: unknown,
    locale?: string | Locale,
  ): Promise<RenderResult> {
    const effectiveLocale = this.templates.ensureSupportedLocale(locale);

    const meta = this.templates.getMeta(templateId);
    const { error, value } = meta.schema.validate(payload);

    if (error) {
      throw new BadRequestException(`Invalid payload for template "${templateId}": ${error}`);
    }

    const { subjectPath, bodyPath } = meta.pathsResolver(effectiveLocale);

    const [subjectTpl, bodyTpl] = await Promise.all([
      fs.promises.readFile(subjectPath, 'utf8'),
      fs.promises.readFile(bodyPath, 'utf8'),
    ]);

    const subject = Handlebars.compile(subjectTpl)(value).trim();
    const html = Handlebars.compile(bodyTpl)(value);

    const text = htmlToText(html, {
      wordwrap: 100,
      selectors: [{ selector: 'a', options: { hideLinkHrefIfSameAsText: true } }],
    });

    return { subject, html, text };
  }
}
