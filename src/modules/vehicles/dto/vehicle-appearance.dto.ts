import { IsEnum, IsOptional } from 'class-validator';

import { VehicleExteriorColor, VehicleInteriorColor } from '../enums';

export class VehicleAppearanceDto {
  @IsOptional()
  @IsEnum(VehicleExteriorColor)
  bodyColor?: VehicleExteriorColor;

  @IsOptional()
  @IsEnum(VehicleInteriorColor)
  interiorColor?: VehicleInteriorColor;
}
