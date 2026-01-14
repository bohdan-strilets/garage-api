import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class VehicleDimensionsDto {
  @IsOptional()
  @IsInt()
  @Min(2000)
  @Max(6000)
  lengthMm?: number;

  @IsOptional()
  @IsInt()
  @Min(1400)
  @Max(2600)
  widthMm?: number;

  @IsOptional()
  @IsInt()
  @Min(1200)
  @Max(2500)
  heightMm?: number;

  @IsOptional()
  @IsInt()
  @Min(1500)
  @Max(3800)
  wheelbaseMm?: number;

  @IsOptional()
  @IsInt()
  @Min(80)
  @Max(350)
  groundClearanceMm?: number;
}
