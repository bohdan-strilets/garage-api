import { buildPlainText } from '@app/common/utils';

import { EmailTemplateResponse } from '../types';
import { EmailChangedParams } from '../types/templates';
import { renderEmailLayout } from '../utils';

export const buildEmailChangedEmail = (params: EmailChangedParams): EmailTemplateResponse => {
  const { userName, newEmail, oldEmail } = params;

  const subject = 'Your email address was updated';
  const greeting = userName ? `Hi, ${userName}!` : 'Hi!';

  const mainTextLines = [
    'The primary email address for your Garage account was changed in your account settings.',
    oldEmail && newEmail
      ? `Previous email: ${oldEmail}. New email: ${newEmail}.`
      : newEmail
        ? `Your new email address is: ${newEmail}.`
        : 'Your email address has been successfully updated.',
    'If this was you, no further action is needed.',
    'If you did not request this change, please secure your account immediately.',
  ];

  const footerText =
    'If you suspect that someone else has access to your account, reset your password and log out from all devices.';

  const html = renderEmailLayout({
    title: subject,
    greeting,
    mainTextLines,
    footerText,
  });

  const textLines = [
    greeting,
    '',
    'The primary email address for your Garage account was changed in your account settings.',
    oldEmail && newEmail
      ? `Previous email: ${oldEmail}. New email: ${newEmail}.`
      : newEmail
        ? `Your new email address is: ${newEmail}.`
        : 'Your email address has been successfully updated.',
    'If this was you, no further action is needed.',
    'If you did not request this change, please reset your password and review your sessions.',
  ];

  const text = buildPlainText(textLines);

  return { subject, text, html };
};
