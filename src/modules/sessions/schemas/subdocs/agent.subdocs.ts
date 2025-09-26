import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument } from 'mongoose';

@Schema({ _id: false, timestamps: false, versionKey: false })
export class Agent {
  @Prop({ type: String, default: null })
  os?: string | null;

  @Prop({ type: String, default: null })
  browser?: string | null;

  @Prop({ type: String, default: null })
  device?: string | null;
}

export type AgentDocument = HydratedDocument<Agent>;
export const AgentSchema = SchemaFactory.createForClass(Agent);
