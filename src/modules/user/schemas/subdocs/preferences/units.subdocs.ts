import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument } from 'mongoose';

import { ConsumptionUnit } from '@app/modules/user/enums/consumption-unit.enum';
import { Distance } from '@app/modules/user/enums/distance.enum';
import { Volume } from '@app/modules/user/enums/volume.enum';

@Schema({ _id: false, timestamps: false, versionKey: false })
export class Units {
  @Prop({ enum: Distance, default: Distance.KM })
  distance?: Distance;

  @Prop({ enum: Volume, default: Volume.L })
  volume?: Volume;

  @Prop({ enum: ConsumptionUnit, default: ConsumptionUnit.L100KM })
  consumption?: ConsumptionUnit;
}

export type UnitsDocument = HydratedDocument<Units>;
export const UnitsSchema = SchemaFactory.createForClass(Units);
