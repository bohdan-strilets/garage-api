import { Type } from 'class-transformer';
import { IsDate, IsDefined, IsEnum, IsNumber, Max, Min } from 'class-validator';

import { Currency } from '@app/common/enums';

import { vehicleRules } from '../config';

export class VehiclePurchaseDto {
  @IsDefined()
  @Type(() => Date)
  @IsDate()
  date: Date;

  @IsDefined()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(vehicleRules.base.price.min)
  @Max(vehicleRules.base.price.max)
  price: number;

  @IsDefined()
  @IsEnum(Currency)
  currency: Currency;
}
