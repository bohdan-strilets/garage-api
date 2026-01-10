export type GenerateEmailTokenInput = {
  plain: string;
  hash: string;
  expiresAt: Date;
  sentAt: Date;
};
