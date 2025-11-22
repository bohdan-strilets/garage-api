import { ConfigType, registerAs } from '@nestjs/config';

export const emailConfig = registerAs('email', () => {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  return {
    apiKey,
    from,
  };
});

export type EmailConfig = ConfigType<typeof emailConfig>;
