export type CreateUserInput = {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  verifyEmailTokenHash: string;
  verifyEmailTokenExpiresAt: Date;
};
