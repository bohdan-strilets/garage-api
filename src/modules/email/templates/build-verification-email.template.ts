import { renderEmailLayout } from '../layouts';
import { EmailTemplateResponse } from '../types';
import { VerificationEmailParams } from '../types/templates';

export const buildVerificationEmail = (params: VerificationEmailParams): EmailTemplateResponse => {
  const { userName, verifyUrl } = params;

  const subject = 'Confirm your email address';
  const greeting = userName ? `Hi, ${userName}!` : 'Hi!';

  const mainTextLines = [
    'Please confirm your email address for your Garage account.',
    'After verification you will be able to use all features of the app.',
  ];

  const footerText =
    'If you did not create an account with this email, you can ignore this message.';

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
    'Please confirm your email address for your Garage account.',
    'Open the link below to verify your email:',
    verifyUrl,
  ];

  const text = textLines.join('\n');

  return { subject, text, html };
};
