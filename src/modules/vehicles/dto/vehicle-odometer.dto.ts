import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNumber, IsOptional, Min } from 'class-validator';

import { OdometerUnit } from '../enums';

export class VehicleOdometerDto {
  @IsNumber()
  @Min(0)
  initial: number;

  @Type(() => Date)
  @IsDate()
  initialRecordedAt: Date;

  @IsNumber()
  @Min(0)
  current: number;

  @Type(() => Date)
  @IsDate()
  currentRecordedAt: Date;

  @IsEnum(OdometerUnit)
  unit: OdometerUnit;

  @IsOptional()
  @IsNumber()
  @Min(0)
  targetAnnualMileage?: number | null;

  @IsOptional()
  @IsNumber()
  @Min(0)
  serviceInterval?: number | null;

  @IsOptional()
  @IsNumber()
  @Min(0)
  nextServiceMileage?: number | null;
}
