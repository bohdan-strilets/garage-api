import { IsEnum, IsNumber, IsOptional, Min } from 'class-validator';

import { EuroStandard } from '../enums';

export class VehicleEconomyDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  cityLPer100Km?: number | null;

  @IsOptional()
  @IsNumber()
  @Min(0)
  highwayLPer100Km?: number | null;

  @IsOptional()
  @IsNumber()
  @Min(0)
  mixedLPer100Km?: number | null;

  @IsOptional()
  @IsNumber()
  @Min(0)
  fuelTankCapacityL?: number | null;

  @IsOptional()
  @IsEnum(EuroStandard)
  euroStandard?: EuroStandard | null;
}
