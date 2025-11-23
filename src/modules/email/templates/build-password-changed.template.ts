import { buildPlainText } from '@app/common/utils';

import { EmailTemplateResponse } from '../types';
import { PasswordChangedParams } from '../types/templates';
import { renderEmailLayout } from '../utils';

export const buildPasswordChangedEmail = (params: PasswordChangedParams): EmailTemplateResponse => {
  const { userName } = params;

  const subject = 'Your password was updated';
  const greeting = userName ? `Hi, ${userName}!` : 'Hi!';

  const mainTextLines = [
    'The password for your Garage account was changed from your account settings.',
    'If this was you, no further action is needed.',
    'If you did not change your password, reset it immediately using the "Forgot password" option and review your sessions.',
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
    'The password for your Garage account was changed from your account settings.',
    'If this was you, no further action is needed.',
    'If you did not change your password, reset it immediately using the "Forgot password" option.',
  ];

  const text = buildPlainText(textLines);

  return { subject, text, html };
};
