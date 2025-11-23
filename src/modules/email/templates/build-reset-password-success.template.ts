import { buildPlainText } from '@app/common/utils';

import { EmailTemplateResponse } from '../types';
import { ResetPasswordSuccessParams } from '../types/templates';
import { renderEmailLayout } from '../utils';

export const buildResetPasswordSuccess = (
  params: ResetPasswordSuccessParams,
): EmailTemplateResponse => {
  const { userName } = params;

  const subject = 'Your password has been changed';
  const greeting = userName ? `Hi, ${userName}!` : 'Hi!';

  const mainTextLines = [
    'Your password for your Garage account was successfully changed using the password reset link.',
    'If this was you, no further action is required.',
    'If you did not request a password reset, we strongly recommend that you reset your password again and review your active sessions.',
  ];

  const footerText =
    'If you suspect any suspicious activity, reset your password and log out from all devices.';

  const html = renderEmailLayout({
    title: subject,
    greeting,
    mainTextLines,
    footerText,
  });

  const textLines = [
    greeting,
    '',
    'Your password for your Garage account was successfully changed using the password reset link.',
    'If this was you, no further action is required.',
    'If you did not request a password reset, reset your password again and check your active sessions.',
  ];

  const text = buildPlainText(textLines);

  return { subject, text, html };
};
