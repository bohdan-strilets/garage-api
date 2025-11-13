import { ClientSession } from 'mongoose';

import { RevokedBy } from '../enums';

import { CreateSessionInput } from './create-session-input.type';

export type RotateInput = {
  oldJti: string;
  newSession: CreateSessionInput;
  reason?: string | null;
  by: RevokedBy;
  session?: ClientSession | null;
};
