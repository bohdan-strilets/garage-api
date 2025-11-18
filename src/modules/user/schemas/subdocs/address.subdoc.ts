import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { postalCodeRegex } from '@app/common/regex';

@Schema({ _id: false, timestamps: false })
export class Address {
  @Prop({ type: String, trim: true, default: null })
  street?: string | null;

  @Prop({ type: String, trim: true, default: null })
  city?: string | null;

  @Prop({ type: String, trim: true, match: postalCodeRegex, default: null })
  postalCode?: string | null;

  @Prop({ type: String, trim: true, default: 'PL' })
  country?: string | null;

  @Prop({ type: String, trim: true, default: null })
  numberStreet?: string | null;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
