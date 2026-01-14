import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class VehicleCapacityDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(1000)
  trunkVolumeMinL?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(4000)
  trunkVolumeMaxL?: number;

  @IsOptional()
  @IsInt()
  @Min(500)
  @Max(3500)
  curbWeightKg?: number;

  @IsOptional()
  @IsInt()
  @Min(500)
  @Max(4500)
  grossWeightKg?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(2000)
  maxPayloadKg?: number;
}
