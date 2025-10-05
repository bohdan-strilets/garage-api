import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument } from 'mongoose';

@Schema({ _id: false, versionKey: false })
export class Channels {
  @Prop({ type: Boolean, default: true })
  inApp?: boolean;

  @Prop({ type: Boolean, default: true })
  email?: boolean;

  @Prop({ type: Boolean, default: false })
  push?: boolean;
}

export type ChannelsDocument = HydratedDocument<Channels>;
export const ChannelsSchema = SchemaFactory.createForClass(Channels);
