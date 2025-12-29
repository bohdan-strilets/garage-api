export const userRetryVerifyEmailProjection = {
  _id: 1,
  email: 1,
  'profile.firstName': 1,
  'profile.lastName': 1,
  'verification.isEmailVerified': 1,
  'verification.emailVerifyTokenHash': 1,
  'verification.emailVerifyExpiresAt': 1,
};
