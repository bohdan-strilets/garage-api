import { ConfigType, registerAs } from '@nestjs/config';

import { EmailProviders } from '@app/common/enums';

export const emailConfig = registerAs('email', () => {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  const frontendBaseUrl = process.env.EMAIL_FRONTEND_URL;
  const provider = (process.env.EMAIL_PROVIDER as EmailProviders) ?? EmailProviders.RESEND;

  return {
    provider,
    apiKey,
    from,
    frontendBaseUrl,
  };
});

export type EmailConfig = ConfigType<typeof emailConfig>;
