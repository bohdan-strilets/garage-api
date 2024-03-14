import { Types } from 'mongoose';

export type PayloadType = {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  isActivated: boolean;
};
