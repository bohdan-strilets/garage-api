export type WelcomeVerificationEmailParams = {
  userName?: string;
  verifyUrl: string;
};

export type SendWelcomeVerificationEmailParams = {
  to: string;
  token: string;
  userName?: string;
};
