import { IsNotEmpty, IsOptional, IsString, Length, MaxLength } from 'class-validator';

export class VehicleIdentifiersDto {
  @IsString()
  @IsNotEmpty()
  @Length(5, 8)
  plateNumber: string;

  @IsOptional()
  @IsString()
  @MaxLength(17)
  vin?: string;
}
