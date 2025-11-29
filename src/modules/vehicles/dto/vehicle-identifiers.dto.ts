import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class VehicleIdentifiersDto {
  @IsString()
  @IsNotEmpty()
  plateNumber: string;

  @IsOptional()
  @IsString()
  vin?: string | null;
}
