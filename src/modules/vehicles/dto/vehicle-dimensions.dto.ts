import { IsNumber, IsOptional, Min } from 'class-validator';

export class VehicleDimensionsDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  lengthMm?: number | null;

  @IsOptional()
  @IsNumber()
  @Min(0)
  widthMm?: number | null;

  @IsOptional()
  @IsNumber()
  @Min(0)
  heightMm?: number | null;

  @IsOptional()
  @IsNumber()
  @Min(0)
  wheelbaseMm?: number | null;

  @IsOptional()
  @IsNumber()
  @Min(0)
  groundClearanceMm?: number | null;
}
