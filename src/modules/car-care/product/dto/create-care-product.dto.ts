import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

import { CareUnit } from '../enums';
import { CareProductKind } from '../enums';

export class CreateCareProductDto {
  @IsString()
  @MaxLength(200)
  name: string;

  @IsEnum(CareProductKind)
  kind: CareProductKind;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  quantity?: number;

  @IsOptional()
  @IsEnum(CareUnit)
  unit?: CareUnit;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  currency?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  purchaseDate?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  note?: string;
}
