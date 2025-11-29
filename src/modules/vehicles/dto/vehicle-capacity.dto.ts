import { IsNumber, IsOptional, Min } from 'class-validator';

export class VehicleCapacityDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  trunkVolumeMinL?: number | null;

  @IsOptional()
  @IsNumber()
  @Min(0)
  trunkVolumeMaxL?: number | null;

  @IsOptional()
  @IsNumber()
  @Min(0)
  curbWeightKg?: number | null;

  @IsOptional()
  @IsNumber()
  @Min(0)
  grossWeightKg?: number | null;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxPayloadKg?: number | null;
}
