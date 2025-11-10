import { User } from './user.type';

export type UserSecurity = {
  _id: User['_id'];
  email: User['email'];
  isDeleted: User['isDeleted'];
  security: Pick<User['security'], 'lockedUntil' | 'failedLoginAttempts'>;
};
