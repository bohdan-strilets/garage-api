export type ResetPasswordParams = {
  userName?: string;
  resetUrl: string;
};

export type SendResetPasswordParams = {
  to: string;
  token: string;
  userName?: string;
};
