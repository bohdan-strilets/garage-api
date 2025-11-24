import { buildPlainText } from '@app/common/utils';

import { EmailTemplateResponse } from '../types';
import { VerificationEmailParams } from '../types/templates';
import { renderEmailLayout } from '../utils';

export const buildVerificationEmail = (params: VerificationEmailParams): EmailTemplateResponse => {
  const { userName, verifyUrl } = params;

  const subject = 'Confirm your email address';
  const greeting = userName ? `Hi, ${userName}!` : 'Hi!';

  const mainTextLines = [
    'We received a request to use this email address for your Garage account.',
    'To confirm that this email belongs to you, please click the button below.',
    'If you did not request this, you can safely ignore this email.',
  ];

  const footerText =
    'For your security, this confirmation link may expire after a short period. If it stops working, start the email verification process again from your account settings.';

  const html = renderEmailLayout({
    title: subject,
    greeting,
    mainTextLines,
    footerText,
    button: {
      label: 'Verify email',
      url: verifyUrl,
    },
  });

  const textLines = [
    greeting,
    '',
    'We received a request to use this email address for your Garage account.',
    'To confirm that this email belongs to you, open the following link:',
    verifyUrl,
    '',
    'If you did not request this, you can safely ignore this email.',
  ];

  const text = buildPlainText(textLines);

  return { subject, text, html };
};
