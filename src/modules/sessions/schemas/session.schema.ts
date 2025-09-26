import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument, Types } from 'mongoose';

import { SessionStatus } from '../enums/session-status.type';

import { Agent, AgentSchema } from './subdocs/agent.subdocs';

@Schema({ collection: 'sessions', timestamps: true, versionKey: false })
export class Session {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ type: String, required: true, select: false })
  refreshHash: string;

  @Prop({ type: String, required: true })
  fingerprint: string;

  @Prop({ type: String, required: true })
  userAgent: string;

  @Prop({ type: AgentSchema })
  agent: Agent;

  @Prop({ type: String, required: true })
  ip: string;

  @Prop({ type: Date, required: true })
  expiresAt: Date;

  @Prop({ type: Date, default: null })
  lastUsedAt?: Date | null;

  @Prop({ type: Date, default: null })
  revokedAt?: Date | null;

  @Prop({ enum: SessionStatus, default: SessionStatus.ACTIVE })
  status?: SessionStatus;

  createdAt: Date;

  updatedAt: Date;
}

export type SessionDocument = HydratedDocument<Session>;
export const SessionSchema = SchemaFactory.createForClass(Session);

SessionSchema.index({ userId: 1, status: 1, expiresAt: 1 });
SessionSchema.index({ refreshHash: 1 });
