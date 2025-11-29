import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsEnum, IsNumber, IsOptional, Min } from 'class-validator';

import { Currency } from '@app/common/enums';

export class VehicleSaleDto {
  @IsBoolean()
  isSold: boolean;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  date?: Date | null;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number | null;

  @IsEnum(Currency)
  currency: Currency;
}
