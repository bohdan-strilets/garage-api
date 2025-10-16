import { Module } from '@nestjs/common';

import { EmailRenderer } from './email.renderer';
import { EmailService } from './email.service';
import { EmailTemplates } from './email.templates';
import { EmailTransport } from './email.transport';

@Module({
  providers: [EmailService, EmailRenderer, EmailTemplates, EmailTransport],
  exports: [EmailService],
})
export class EmailModule {}
