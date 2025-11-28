import { User } from './user.type';

export type UserPublic = {
  _id: User['_id'];
  profile: Pick<User['profile'], 'firstName' | 'lastName' | 'nickname'>;
};
