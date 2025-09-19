import { Types } from 'mongoose';

export const toObjectId = (id: string | Types.ObjectId): Types.ObjectId => {
  if (id instanceof Types.ObjectId) {
    return id;
  }

  if (typeof id === 'string' && id.length !== 24) {
    throw new Error(`Invalid ObjectId length: ${id}`);
  }

  if (!Types.ObjectId.isValid(id)) {
    throw new Error(`Invalid ObjectId string: ${id}`);
  }

  return new Types.ObjectId(id);
};
