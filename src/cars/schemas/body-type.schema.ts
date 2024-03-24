import { Prop, Schema } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BodyTypeEnum } from '../enums/body-type.enum';
import { ColorEnum } from '../enums/color.enum';
import { ColorTypeEnum } from '../enums/color-type.enum';

export type BodyTypeDocument = HydratedDocument<BodyType>;

@Schema({ versionKey: false, _id: false })
export class BodyType {
  @Prop({ default: BodyTypeEnum.OTHER, enum: BodyTypeEnum })
  bodyType: BodyTypeEnum;

  @Prop({ default: 0 })
  numberDoors: number;

  @Prop({ default: 0 })
  numberSeats: number;

  @Prop({ default: ColorEnum.WHITE, enum: ColorEnum })
  color: ColorEnum;

  @Prop({ default: ColorTypeEnum.METALLIC, enum: ColorTypeEnum })
  colorType: ColorTypeEnum;
}
