import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Distance } from 'src/module/user/enums/distance.enum';
import { FuelConsumption } from 'src/module/user/enums/fuel-consumption.enum';
import { Volume } from 'src/module/user/enums/volume.enum';

@Schema({ _id: false, versionKey: false })
export class Units {
  @Prop({ enum: Distance, default: Distance.KM })
  distance?: Distance;

  @Prop({ enum: FuelConsumption, default: FuelConsumption.L100KM })
  fuelConsumption?: FuelConsumption;

  @Prop({ enum: Volume, default: Volume.L })
  volume?: Volume;
}

export type UnitsDocument = HydratedDocument<Units>;
export const UnitsSchema = SchemaFactory.createForClass(Units);
