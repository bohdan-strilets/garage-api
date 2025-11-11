import { Types } from 'mongoose';

export const objectIdToString = (id: Types.ObjectId | string): string => {
  if (id instanceof Types.ObjectId) {
    return id.toString();
  }

  return id;
};
