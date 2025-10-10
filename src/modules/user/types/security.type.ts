import { UserType } from './user.type';

export type SecurityUser = Pick<
  UserType,
  '_id' | 'email' | 'role' | 'status' | 'security' | 'createdAt' | 'updatedAt'
>;
