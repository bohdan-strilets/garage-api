export const userSecurityProjection = {
  _id: 1,
  email: 1,
  roles: 1,
  isDeleted: 1,
  'profile.firstName': 1,
  'profile.lastName': 1,
  'security.lockedUntilAt': 1,
  'security.failedLoginAttempts': 1,
  'security.password': 1,
};
