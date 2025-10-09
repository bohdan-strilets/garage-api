import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { DrivingLicense } from '@modules/user/enums/driving-license.enum';

@Schema({ _id: false, versionKey: false })
export class Driver {
  @Prop({ type: String, default: null })
  licenseNumber?: string | null;

  @Prop({ type: [String], enum: DrivingLicense, default: [] })
  categories?: DrivingLicense[];

  @Prop({ type: Date, default: null })
  issuedAt?: Date | null;

  @Prop({ type: Date, default: null })
  expiresAt?: Date | null;
}

export type DriverDocument = HydratedDocument<Driver>;
export const DriverSchema = SchemaFactory.createForClass(Driver);
