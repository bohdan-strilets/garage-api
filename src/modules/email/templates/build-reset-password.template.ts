import { renderEmailLayout } from '../layouts';
import { EmailTemplateResponse } from '../types';
import { ResetPasswordParams } from '../types/templates';

export const buildResetPasswordEmail = (params: ResetPasswordParams): EmailTemplateResponse => {
  const { userName, resetUrl } = params;

  const subject = 'Reset your password';
  const greeting = userName ? `Hi, ${userName}!` : 'Hi!';

  const mainTextLines = [
    'You requested to reset your password for your Garage account.',
    'If it was you, please use the button below to set a new password.',
    'For security reasons, this link may expire after a short time.',
  ];

  const footerText = 'If you did not request a password reset, you can safely ignore this email.';

  const html = renderEmailLayout({
    title: subject,
    greeting,
    mainTextLines,
    button: {
      label: 'Reset password',
      url: resetUrl,
    },
    footerText,
  });

  const textLines = [
    greeting,
    '',
    'You requested to reset your password for your Garage account.',
    'If it was you, open the link below to set a new password:',
    resetUrl,
    '',
    'If you did not request this, you can ignore this email.',
  ];

  const text = textLines.join('\n');

  return { subject, text, html };
};
