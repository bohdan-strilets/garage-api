import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { MileageType } from '../types/mileage.type';
import { EngineType } from '../types/engine.type';
import { TransmissionEnum } from '../enums/transmission.enum';
import { DriveUnitEnum } from '../enums/drive-unit.enum';
import { BodyType } from '../types/body.type';
import { HistoryType } from '../types/history.type';
import { PhotoType } from '../types/photo.type';

export type CarDocument = HydratedDocument<Car>;

@Schema({ versionKey: false, timestamps: true })
export class Car {
  @Prop({ required: true })
  brandName: string;

  @Prop({ required: true })
  modelName: string;

  @Prop()
  nickname?: string;

  @Prop()
  generation?: string;

  @Prop()
  version?: string;

  @Prop({ required: true })
  productionYear: number;

  @Prop()
  mileage?: MileageType;

  @Prop()
  engine?: EngineType;

  @Prop()
  vin?: string;

  @Prop()
  registrationNumber?: string;

  @Prop()
  transmission?: TransmissionEnum;

  @Prop()
  driveUnit?: DriveUnitEnum;

  @Prop()
  body?: BodyType;

  @Prop()
  history?: HistoryType;

  @Prop()
  photo?: PhotoType;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const CarSchema = SchemaFactory.createForClass(Car);
