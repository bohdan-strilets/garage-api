export const userRetryVerifyEmailProjection = {
  _id: 1,
  email: 1,
  'profile.firstName': 1,
  'profile.lastName': 1,
  'verification.email.isVerified': 1,
  'verification.email.tokenHash': 1,
  'verification.email.expiresAt': 1,
  'verification.email.sentAt': 1,
};
