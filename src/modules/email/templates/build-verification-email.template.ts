import { buildPlainText } from '@app/common/utils';

import { EmailTemplateResponse } from '../types';
import { VerificationEmailParams } from '../types/templates';
import { renderEmailLayout } from '../utils';

export const buildVerificationEmail = (params: VerificationEmailParams): EmailTemplateResponse => {
  const { userName, verifyUrl } = params;

  const subject = 'Welcome to Garage App – confirm your email';
  const greeting = userName ? `Hi, ${userName}!` : 'Hi!';

  const mainTextLines = [
    'Thanks for signing up for Garage App.',
    'Please confirm your email address to activate your account and start tracking your cars, expenses and reminders.',
    'This helps us keep your account secure and make sure we can reach you about important updates.',
  ];

  const footerText =
    'If you did not create an account with this email, you can safely ignore this message.';

  const html = renderEmailLayout({
    title: subject,
    greeting,
    mainTextLines,
    button: {
      label: 'Verify email',
      url: verifyUrl,
    },
    footerText,
  });

  const textLines = [
    greeting,
    '',
    'Welcome to Garage App!',
    'Please confirm your email address to activate your account:',
    verifyUrl,
    '',
    'If you did not create an account with this email, you can ignore this message.',
  ];

  const text = buildPlainText(textLines);

  return { subject, text, html };
};
