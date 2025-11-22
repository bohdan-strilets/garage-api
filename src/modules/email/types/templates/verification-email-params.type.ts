export type VerificationEmailParams = {
  userName?: string;
  verifyUrl: string;
};

export type SendVerificationEmailParams = {
  to: string;
  token: string;
  userName?: string;
};
