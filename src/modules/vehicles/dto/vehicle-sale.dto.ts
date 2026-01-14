import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsDefined,
  IsEnum,
  IsNumber,
  IsOptional,
  Max,
  Min,
} from 'class-validator';

import { Currency } from '@app/common/enums';

export class VehicleSaleDto {
  @IsDefined()
  @IsBoolean()
  isSold: boolean;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  date?: Date;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  @Max(10_000_000)
  price?: number;

  @IsDefined()
  @IsEnum(Currency)
  currency: Currency;
}
