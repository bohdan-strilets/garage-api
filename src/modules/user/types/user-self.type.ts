import { User } from './user.type';

export type UserSelf = {
  _id: User['_id'];
  email: User['email'];
  phone?: User['phone'];
  roles: User['roles'];
  profile: User['profile'];
  settings: User['settings'];
  verification: {
    email: { isVerified: User['verification']['email']['isVerified'] };
    phone: { isVerified: User['verification']['phone']['isVerified'] };
  };
  vehicles: User['vehicles'];
  createdAt: User['createdAt'];
  updatedAt: User['updatedAt'];
};
