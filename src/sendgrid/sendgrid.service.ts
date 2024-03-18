import { Injectable } from '@nestjs/common';
import * as sendgrid from '@sendgrid/mail';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import { join } from 'path';
import { EmailType } from './types/email.type';
import { HbsVariable } from './types/hbs-variable.type';

@Injectable()
export class SendgridService {
  private readonly rootPath = join(__dirname, '..', '..', 'src', 'sendgrid', 'templates');

  constructor() {
    sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
  }

  private renderTemplate(templatePath: string, variables?: HbsVariable): string {
    const templateSource = fs.readFileSync(templatePath, 'utf8');
    const template = handlebars.compile(templateSource);
    return template(variables);
  }

  async sendEmail(letterToSend: EmailType): Promise<boolean> {
    const email = { ...letterToSend, from: process.env.SENDGRID_OWNER };
    try {
      await sendgrid.send(email);
      return true;
    } catch (error) {
      return false;
    }
  }

  async sendConfirmationEmail(email: string, activationToken: string): Promise<void> {
    const templatePath = join(this.rootPath, 'activation-email.hbs');
    const variables = { API_URL: process.env.API_URL, activationToken };
    const htmlContent = this.renderTemplate(templatePath, variables);

    const mail = {
      to: email,
      subject: 'Welcome! Activate Your Account.',
      html: htmlContent,
    };

    await this.sendEmail(mail);
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    const templatePath = join(this.rootPath, 'reset-password.hbs');
    const htmlContent = this.renderTemplate(templatePath);

    const mail = {
      to: email,
      subject: 'Password Reset Instructions.',
      html: htmlContent,
    };

    await this.sendEmail(mail);
  }
}
