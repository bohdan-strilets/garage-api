import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { VehicleExteriorColor, VehicleInteriorColor } from '../../enums';

@Schema({ _id: false, versionKey: false, timestamps: false })
export class VehicleAppearance {
  @Prop({ enum: VehicleExteriorColor, default: VehicleExteriorColor.OTHER })
  bodyColor?: VehicleExteriorColor;

  @Prop({ enum: VehicleInteriorColor, default: VehicleInteriorColor.OTHER })
  interiorColor?: VehicleInteriorColor;
}

export const VehicleAppearanceSchema = SchemaFactory.createForClass(VehicleAppearance);
