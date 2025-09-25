import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument } from 'mongoose';

@Schema({ _id: false, timestamps: false, versionKey: false })
export class Consents {
  @Prop({ type: Date, required: true })
  termsAcceptedAt: Date;

  @Prop({ type: Date, required: true })
  privacyAcceptedAt: Date;
}

export type ConsentsDocument = HydratedDocument<Consents>;
export const ConsentsSchema = SchemaFactory.createForClass(Consents);
