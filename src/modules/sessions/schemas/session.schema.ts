import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

import { toJSONIdPlugin } from '@/common/mongoose/plugins/tojson-id.plugin.ts';

@Schema({ timestamps: true, versionKey: false })
export class Session {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: String, required: true, index: true })
  refreshTokenHash: string;

  @Prop({ type: String, default: null })
  userAgent?: string | null;

  @Prop({ type: String, default: null })
  ip?: string | null;

  @Prop({ type: Date, default: null })
  expiresAt?: Date | null;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  updatedAt: Date;

  createdAt: Date;
}

export type SessionDocument = HydratedDocument<Session>;
export const SessionSchema = SchemaFactory.createForClass(Session);

SessionSchema.plugin(toJSONIdPlugin);
