import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: false, versionKey: false, _id: false })
export class Address {
  @Prop({ type: String, default: null })
  country?: string | null;

  @Prop({ type: String, default: null })
  city?: string | null;

  @Prop({ type: String, default: null })
  street?: string | null;

  @Prop({ type: String, default: null })
  houseNumber?: string | null;

  @Prop({ type: String, default: null })
  postalCode?: string | null;
}

export type AddressDocument = HydratedDocument<Address>;
export const AddressSchema = SchemaFactory.createForClass(Address);
