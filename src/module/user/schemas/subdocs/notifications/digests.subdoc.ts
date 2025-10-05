import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument } from 'mongoose';

@Schema({ _id: false, versionKey: false })
export class Digests {
  @Prop({ type: Boolean, default: false })
  reminders?: boolean;

  @Prop({ type: Boolean, default: false })
  news?: boolean;

  @Prop({ type: Boolean, default: false })
  documents?: boolean;
}

export type DigestsDocument = HydratedDocument<Digests>;
export const DigestsSchema = SchemaFactory.createForClass(Digests);
