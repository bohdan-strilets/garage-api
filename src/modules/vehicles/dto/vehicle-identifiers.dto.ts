import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class VehicleIdentifiersDto {
  @IsString()
  @IsNotEmpty()
  @Length(5, 8)
  plateNumber: string;

  @IsOptional()
  @IsString()
  @Length(17, 17)
  vin?: string;
}
