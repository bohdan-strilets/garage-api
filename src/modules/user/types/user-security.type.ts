import { User } from './user.type';

export type UserSecurity = {
  _id: User['_id'];
  email: User['email'];
  roles: User['roles'];
  isDeleted: User['isDeleted'];
  security: Pick<User['security'], 'lockedUntilAt' | 'failedLoginAttempts' | 'password'>;
};
