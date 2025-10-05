import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument } from 'mongoose';

@Schema({ _id: false, versionKey: false })
export class Consents {
  @Prop({ type: Boolean, default: false, required: true })
  terms: boolean;

  @Prop({ type: Boolean, default: false, required: true })
  privacy: boolean;
}

export type ConsentsDocument = HydratedDocument<Consents>;
export const ConsentsSchema = SchemaFactory.createForClass(Consents);
