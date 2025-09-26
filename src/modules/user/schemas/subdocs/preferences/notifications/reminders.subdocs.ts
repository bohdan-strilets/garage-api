import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument } from 'mongoose';

@Schema({ _id: false, timestamps: false, versionKey: false })
export class Reminders {
  @Prop({ type: Boolean, default: true })
  documents?: boolean;

  @Prop({ type: Boolean, default: true })
  maintenance?: boolean;
}

export type RemindersDocument = HydratedDocument<Reminders>;
export const RemindersSchema = SchemaFactory.createForClass(Reminders);
