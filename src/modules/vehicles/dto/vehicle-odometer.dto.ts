import { Type } from 'class-transformer';
import { IsDate, IsDefined, IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';

import { OdometerUnit } from '../enums';

export class VehicleOdometerDto {
  @IsDefined()
  @IsInt()
  @Min(0)
  @Max(2_000_000)
  initial: number;

  @IsDefined()
  @Type(() => Date)
  @IsDate()
  initialRecordedAt: Date;

  @IsDefined()
  @IsInt()
  @Min(0)
  @Max(2_000_000)
  current: number;

  @IsDefined()
  @Type(() => Date)
  @IsDate()
  currentRecordedAt: Date;

  @IsDefined()
  @IsEnum(OdometerUnit)
  unit: OdometerUnit;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(200_000)
  targetAnnualMileage?: number;

  @IsOptional()
  @IsInt()
  @Min(5_000)
  @Max(50_000)
  serviceInterval?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(2_000_000)
  nextServiceMileage?: number;
}
