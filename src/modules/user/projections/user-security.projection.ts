export const userSecurityProjection = {
  _id: 1,
  email: 1,
  isDeleted: 1,
  'security.lockedUntilAt': 1,
  'security.failedLoginAttempts': 1,
};
