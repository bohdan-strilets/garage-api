import { promises as fs } from 'node:fs';

import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
  constructor(
    private readonly configService: ConfigService,
    private readonly templates: EmailTemplates,
  ) {}

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

    const vm: Record<string, any> = { ...value };
    const { subjectPath, bodyPath } = meta.pathsResolver(effectiveLocale);

    const [subjectTpl, bodyTpl] = await Promise.all([
      fs.readFile(subjectPath, 'utf8'),
      fs.readFile(bodyPath, 'utf8'),
    ]);

    const subject = Handlebars.compile(subjectTpl)(vm).trim();
    const html = Handlebars.compile(bodyTpl)(vm);

    const text = htmlToText(html, {
      wordwrap: 100,
      selectors: [{ selector: 'a', options: { hideLinkHrefIfSameAsText: true } }],
    });

    return { subject, html, text };
  }
}
