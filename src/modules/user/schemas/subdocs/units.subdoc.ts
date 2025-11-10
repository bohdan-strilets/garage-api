import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import {
  DistanceUnit,
  FuelEconomyUnit,
  PressureUnit,
  SpeedUnit,
  TemperatureUnit,
  VolumeUnit,
} from '@app/common/enums';

@Schema({ _id: false, timestamps: false })
export class Units {
  @Prop({ enum: DistanceUnit, default: DistanceUnit.KM })
  distance?: DistanceUnit;

  @Prop({ enum: VolumeUnit, default: VolumeUnit.LITER })
  volume?: VolumeUnit;

  @Prop({ enum: SpeedUnit, default: SpeedUnit.KMH })
  speed?: SpeedUnit;

  @Prop({ enum: FuelEconomyUnit, default: FuelEconomyUnit.L_PER_100KM })
  fuelEconomy?: FuelEconomyUnit;

  @Prop({ enum: TemperatureUnit, default: TemperatureUnit.C })
  temperature?: TemperatureUnit;

  @Prop({ enum: PressureUnit, default: PressureUnit.BAR })
  pressure?: PressureUnit;
}

export const UnitsSchema = SchemaFactory.createForClass(Units);
