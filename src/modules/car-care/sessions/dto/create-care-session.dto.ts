import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

import { CareSessionKind } from '../enums';

export class CreateCareSessionDto {
  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  odometer?: number;

  @IsEnum(CareSessionKind)
  kind: CareSessionKind;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  currency?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  durationMinutes?: number;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  note?: string;
}
