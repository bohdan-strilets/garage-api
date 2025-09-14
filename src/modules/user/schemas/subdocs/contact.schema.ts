import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: false, versionKey: false, _id: false })
export class Contact {
  @Prop({ type: String, default: null })
  phoneNumber?: string | null;

  @Prop({ type: String, default: null })
  locale?: string | null;

  @Prop({ type: String, default: null })
  timezone?: string | null;
}

export type ContactDocument = HydratedDocument<Contact>;
export const ContactSchema = SchemaFactory.createForClass(Contact);
