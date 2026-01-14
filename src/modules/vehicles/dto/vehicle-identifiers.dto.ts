import { IsNotEmpty, IsOptional, IsString, Length, Matches } from 'class-validator';

import { plateNumberRegex, vinRegex } from '../regex';

export class VehicleIdentifiersDto {
  @IsString()
  @IsNotEmpty()
  @Length(5, 8)
  @Matches(plateNumberRegex, { message: 'Invalid Polish plate number format' })
  plateNumber: string;

  @IsOptional()
  @IsString()
  @Length(17, 17)
  @Matches(vinRegex, { message: 'Invalid VIN format' })
  vin?: string;
}
