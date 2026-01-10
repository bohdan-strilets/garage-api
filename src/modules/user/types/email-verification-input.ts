export type EmailVerificationInput = {
  tokenHash: string;
  expiresAt: Date;
  sentAt: Date;
};
