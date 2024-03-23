import { BodyTypeEnum } from '../enums/body-type.enum';
import { ColorTypeEnum } from '../enums/color-type.enum';
import { ColorEnum } from '../enums/color.enum';

export type BodyType = {
  bodyType: BodyTypeEnum;
  numberDoors: number;
  numberSeats: number;
  color: ColorEnum;
  colorType: ColorTypeEnum;
};
