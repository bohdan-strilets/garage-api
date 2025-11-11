import { User } from './user.type';

export type UserSoftDelete = Pick<User, '_id' | 'isDeleted' | 'deletedAt'>;
