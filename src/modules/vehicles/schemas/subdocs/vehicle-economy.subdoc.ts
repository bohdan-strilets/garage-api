import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { EuroStandard } from '../../enums';

@Schema({ _id: false, versionKey: false, timestamps: false })
export class VehicleEconomy {
  @Prop({ type: Number, min: 0, default: null })
  cityLPer100Km?: number | null;

  @Prop({ type: Number, min: 0, default: null })
  highwayLPer100Km?: number | null;

  @Prop({ type: Number, min: 0, default: null })
  mixedLPer100Km?: number | null;

  @Prop({ type: Number, min: 0, default: null })
  fuelTankCapacityL?: number | null;

  @Prop({ enum: EuroStandard, default: null })
  euroStandard?: EuroStandard | null;
}

export const VehicleEconomySchema = SchemaFactory.createForClass(VehicleEconomy);
