import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { TransmissionEnum } from '../enums/transmission.enum';
import { DriveUnitEnum } from '../enums/drive-unit.enum';
import { Mileage, MileageDocument } from './mileage.schema';
import { Engine, EngineDocument } from './engine.schema';
import { BodyType, BodyTypeDocument } from './body-type.schema';
import { HistoryDocument, History } from './history.schema';
import { Photo, PhotoDocument } from './photo.schema';

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

  @Prop({ type: Mileage, default: {} })
  mileage?: MileageDocument;

  @Prop({ type: Engine, default: {} })
  engine?: EngineDocument;

  @Prop()
  vin?: string;

  @Prop()
  registrationNumber?: string;

  @Prop({ default: TransmissionEnum.MANUAL, enum: TransmissionEnum })
  transmission?: TransmissionEnum;

  @Prop({ default: DriveUnitEnum.FRONT, enum: DriveUnitEnum })
  driveUnit?: DriveUnitEnum;

  @Prop({ type: BodyType, default: {} })
  body?: BodyTypeDocument;

  @Prop({ type: History, default: {} })
  history?: HistoryDocument;

  @Prop({ type: Photo, default: {} })
  photo?: PhotoDocument;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const CarSchema = SchemaFactory.createForClass(Car);
