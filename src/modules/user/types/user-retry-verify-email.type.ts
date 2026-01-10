import { User } from './user.type';

export type UserRetryVerifyEmail = {
  email: User['email'];
  profile: Pick<User['profile'], 'firstName' | 'lastName'>;
  verification: {
    email: User['verification']['email'];
  };
};
