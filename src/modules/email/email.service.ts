import { Inject, Injectable, Logger } from '@nestjs/common';

import { Resend } from 'resend';

import { EmailConfig, emailConfig } from '@app/config/env/name-space';

import { buildResetPasswordEmail } from './templates';
import { buildVerificationEmail } from './templates/build-verification-email.template';
import { SendEmailPayload } from './types';
import { SendResetPasswordParams, SendVerificationEmailParams } from './types/templates';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly resend: Resend;

  constructor(@Inject(emailConfig.KEY) private readonly config: EmailConfig) {
    const apiKey = this.config.apiKey;
    this.resend = new Resend(apiKey);
  }

  private async sendEmailInternal(
    to: string,
    subject: string,
    text: string,
    html?: string,
  ): Promise<void> {
    try {
      await this.resend.emails.send({
        from: this.config.from,
        to,
        subject,
        text,
        html,
      });

      this.logger.debug('Email sent successfully');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.warn(`Failed to send email: ${message}`);
      throw error;
    }
  }

  async sendRawEmail(payload: SendEmailPayload): Promise<void> {
    const { to, subject, text, html } = payload;
    await this.sendEmailInternal(to, subject, text, html);
  }

  async sendResetPasswordEmail(params: SendResetPasswordParams): Promise<void> {
    const { to, token, userName } = params;

    const baseUrl = this.config.frontendBaseUrl;
    const encodedToken = encodeURIComponent(token);
    const resetUrl = `${baseUrl}/reset-password?token=${encodedToken}`;

    const email = buildResetPasswordEmail({ userName, resetUrl });
    const { html, subject, text } = email;

    await this.sendEmailInternal(to, subject, text, html);
  }

  async sendVerificationEmail(params: SendVerificationEmailParams): Promise<void> {
    const { to, token, userName } = params;

    const baseUrl = this.config.frontendBaseUrl;
    const encodedToken = encodeURIComponent(token);
    const verifyUrl = `${baseUrl}/verify-email?token=${encodedToken}`;

    const email = buildVerificationEmail({ userName, verifyUrl });
    const { html, subject, text } = email;

    await this.sendEmailInternal(to, subject, text, html);
  }
}
