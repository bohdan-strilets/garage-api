import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MaxLength(120)
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @MaxLength(120)
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsEmail()
  @MaxLength(254)
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(64)
  @IsNotEmpty()
  password: string;
}
