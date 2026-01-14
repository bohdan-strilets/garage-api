import { IsNumber, IsOptional, Max, Min } from 'class-validator';

export class VehiclePerformanceDto {
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 0 })
  @Min(60)
  @Max(450)
  topSpeedKph?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(1.5)
  @Max(60)
  acceleration0100Sec?: number;
}
