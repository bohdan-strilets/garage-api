import { UserType } from './user.type';

export type SafeUser = Pick<
  UserType,
  | '_id'
  | 'email'
  | 'role'
  | 'status'
  | 'profile'
  | 'preferences'
  | 'notifications'
  | 'consents'
  | 'createdAt'
  | 'updatedAt'
>;
