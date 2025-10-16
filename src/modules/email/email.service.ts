import { BadRequestException, Injectable, Logger } from '@nestjs/common';

import { Locale } from '@modules/user/enums/locale.enum';

import { EmailRenderer } from './email.renderer';
import { EmailTransport } from './email.transport';
import { SendResult } from './types/send-result.type';
import { TemplateId } from './types/template-id.type';
import { recipientSchema } from './validation/recipient.validation';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    private readonly renderer: EmailRenderer,
    private readonly transport: EmailTransport,
  ) {}

  async send(
    templateId: TemplateId,
    recipient: string,
    payload: unknown,
    locale?: string | Locale,
  ): Promise<SendResult> {
    const { value: to, error } = recipientSchema.validate(recipient);

    if (error) {
      throw new BadRequestException('Invalid recipient email');
    }

    const { subject, html, text } = await this.renderer.render(templateId, payload, locale);

    const res = await this.transport.send({ to, subject, html, text });

    this.logger.debug(`Email sent (template=${templateId}, to=${to}, msg=${res.messageId})`);

    return { ok: true };
  }

  async sendRaw(
    toInput: string | string[],
    subject: string,
    html: string,
    text?: string,
  ): Promise<SendResult> {
    const toList = Array.isArray(toInput) ? toInput : [toInput];

    const validated = toList.map((addr) => {
      const { value, error } = recipientSchema.validate(addr);
      if (error) {
        throw new BadRequestException(`Invalid recipient email: ${addr}`);
      }
      return value as string;
    });

    const res = await this.transport.send({
      to: validated.length === 1 ? validated[0] : validated,
      subject,
      html,
      text,
    });

    this.logger.debug(`Raw email sent (to=${validated.join(',')}, msg=${res.messageId})`);

    return { ok: true };
  }
}
