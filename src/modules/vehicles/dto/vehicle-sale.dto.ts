import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsEnum, IsNumber, IsOptional, Max, Min } from 'class-validator';

import { Currency } from '@app/common/enums';

import { vehicleRules } from '../config';

export class VehicleSaleDto {
  @IsOptional()
  @IsBoolean()
  isSold?: boolean;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  date?: Date;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(vehicleRules.base.price.min)
  @Max(vehicleRules.base.price.max)
  price?: number;

  @IsOptional()
  @IsEnum(Currency)
  currency?: Currency;
}
