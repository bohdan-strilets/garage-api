import { UserType } from './user.type';

export type PublicUser = Pick<UserType, '_id' | 'status' | 'profile' | 'createdAt'> | 'updatedAt';
