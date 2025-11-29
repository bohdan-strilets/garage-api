import { IsNumber, IsOptional, Min } from 'class-validator';

export class VehiclePerformanceDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  topSpeedKph?: number | null;

  @IsOptional()
  @IsNumber()
  @Min(0)
  acceleration0100Sec?: number | null;
}
