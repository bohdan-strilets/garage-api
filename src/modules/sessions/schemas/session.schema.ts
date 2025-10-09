import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

import { Device, DeviceSchema } from './subdocs/device.subdoc';

import { SessionStatus } from '../enums/session-status.enum';

@Schema({ collection: 'sessions', timestamps: true, versionKey: false })
export class Session {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ enum: SessionStatus, required: true, default: SessionStatus.ACTIVE })
  status: SessionStatus;

  @Prop({ type: String, required: true })
  refreshTokenHash: string;

  @Prop({ type: Date, required: true })
  refreshExpiresAt: Date;

  @Prop({ type: String })
  familyId: string;

  @Prop({ type: String })
  replacedBy?: string;

  @Prop({ type: Date, default: null })
  lastSeenAt?: Date | null;

  @Prop({ type: Date, default: null })
  revokedAt?: Date | null;

  @Prop({ type: DeviceSchema, default: {} })
  device: Device;

  createdAt: Date;

  updatedAt: Date;
}

export type SessionDocument = HydratedDocument<Session>;
export const SessionSchema = SchemaFactory.createForClass(Session);

SessionSchema.index({ user: 1, revokedAt: 1, refreshExpiresAt: 1 });
SessionSchema.index({ refreshTokenHash: 1 }, { unique: true });
SessionSchema.index({ refreshExpiresAt: 1 }, { expireAfterSeconds: 0 });
SessionSchema.index({ user: 1, lastSeenAt: -1 });
SessionSchema.index({ familyId: 1 });
