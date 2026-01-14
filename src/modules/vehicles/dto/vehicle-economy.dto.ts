import { IsEnum, IsNumber, IsOptional, Max, Min } from 'class-validator';

import { EuroStandard } from '../enums';

export class VehicleEconomyDto {
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(2)
  @Max(30)
  cityLPer100Km?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(2)
  @Max(20)
  highwayLPer100Km?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(2)
  @Max(25)
  mixedLPer100Km?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 0 })
  @Min(20)
  @Max(120)
  fuelTankCapacityL?: number;

  @IsOptional()
  @IsEnum(EuroStandard)
  euroStandard?: EuroStandard;
}
