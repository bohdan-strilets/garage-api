import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { DrivingCategory } from '../../enums';

@Schema({ _id: false, timestamps: false })
export class DrivingLicense {
  @Prop({ type: String, trim: true, default: null })
  number?: string | null;

  @Prop({ type: [String], enum: Object.values(DrivingCategory), default: [] })
  categories?: DrivingCategory[];

  @Prop({ type: Date, default: null })
  issuedAt?: Date | null;

  @Prop({ type: Date, default: null })
  expiresAt?: Date | null;

  @Prop({ type: String, trim: true, default: null })
  documentUrl?: string | null;
}

export const DrivingLicenseSchema = SchemaFactory.createForClass(DrivingLicense);
