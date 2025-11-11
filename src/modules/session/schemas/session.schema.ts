import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument, Types } from 'mongoose';

import { RevokedBy } from '../enums';

import { Device, DeviceSchema } from './subdocs';

@Schema({ collection: 'sessions', versionKey: false, timestamps: true })
export class Session {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: String, required: true })
  familyId: string;

  @Prop({ type: String, required: true })
  tokenId: string;

  @Prop({ type: String, required: true, select: false })
  refreshTokenHash: string;

  @Prop({ type: String, maxlength: 128, default: null })
  fingerprint?: string | null;

  @Prop({ type: String, maxlength: 512, default: null })
  userAgent?: string | null;

  @Prop({ type: String, maxlength: 64, default: null })
  ip?: string | null;

  @Prop({ type: DeviceSchema, default: {} })
  device: Device;

  @Prop({ type: Date, required: true })
  lastUsedAt: Date;

  @Prop({ type: Date, required: true })
  expiresAt: Date;

  @Prop({ type: Boolean, default: false })
  isPersistent: boolean;

  @Prop({ type: Number, default: 0, min: 0 })
  rotationCounter: number;

  @Prop({ type: Date, default: null })
  revokedAt?: Date | null;

  @Prop({ enum: RevokedBy, required: true })
  revokedBy: RevokedBy;

  @Prop({ type: String, maxlength: 256, default: null })
  revokeReason?: string | null;

  @Prop({ type: String, default: null })
  replacedByTokenId?: string | null;

  @Prop({ type: Date, default: null })
  reuseDetectedAt?: Date | null;

  createdAt: Date;

  updatedAt: Date;
}

export type SessionDocument = HydratedDocument<Session>;
export const SessionSchema = SchemaFactory.createForClass(Session);

SessionSchema.index({ userId: 1 });
SessionSchema.index({ familyId: 1 });
SessionSchema.index({ tokenId: 1 }, { unique: true });
SessionSchema.index({ fingerprint: 1 });
SessionSchema.index({ revokedAt: 1 });

SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

SessionSchema.index({ userId: 1, lastUsedAt: -1 });
SessionSchema.index({ userId: 1, fingerprint: 1, revokedAt: 1 });
SessionSchema.index({ familyId: 1, tokenId: 1 });
