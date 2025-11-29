import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNumber, IsOptional, Min } from 'class-validator';

import { Currency } from '@app/common/enums';

export class VehiclePurchaseDto {
  @Type(() => Date)
  @IsDate()
  date: Date;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number | null;

  @IsEnum(Currency)
  currency: Currency;
}
