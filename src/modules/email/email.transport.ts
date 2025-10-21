import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

import { FromType } from './types/from.type';
import { SendEmailInput } from './types/send-email-input.type';
import { SendEmailResult } from './types/send-email-result.type';

@Injectable()
export class EmailTransport {
  private readonly logger = new Logger(EmailTransport.name);
  private readonly transporter: nodemailer.Transporter;
  private readonly from: FromType;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('MAIL_SMTP_HOST'),
      port: Number(this.configService.get('MAIL_SMTP_PORT')),
      secure: this.configService.get('MAIL_SMTP_SECURE') === 'true',
      auth: {
        user: this.configService.get('MAIL_SMTP_USER'),
        pass: this.configService.get('MAIL_SMTP_PASSWORD'),
      },
    });

    this.from = {
      name: this.configService.get('MAIL_FROM_NAME'),
      email: this.configService.get('MAIL_FROM_EMAIL'),
    };

    this.verifyConnection().catch((err) => {
      this.logger.error(`SMTP connection verification failed (Resend): ${err?.message ?? err}`);
    });
  }

  async verifyConnection(): Promise<void> {
    try {
      await this.transporter.verify();
      this.logger.debug('SMTP connection verified (Resend)');
    } catch (err: any) {
      const reason = err?.message ?? String(err);
      throw new Error(
        `SMTP verification failed: ${reason}. ` +
          `Check RESEND API key, host/port, firewall, and verified sender domain.`,
      );
    }
  }

  async send(input: SendEmailInput): Promise<SendEmailResult> {
    const { to, subject, html, text } = input;

    try {
      const info = await this.transporter.sendMail({
        from: { name: this.from.name, address: this.from.email },
        to,
        subject,
        html,
        text,
      });

      return { ok: true, messageId: info.messageId };
    } catch (err) {
      throw err;
    }
  }
}
