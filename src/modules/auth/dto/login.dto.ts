import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

import { PasswordPolicy } from '@app/modules/password/validators';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(254)
  @Transform(({ value }: { value: string }) => value?.trim().toLowerCase())
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(64)
  @PasswordPolicy('email')
  password: string;
}
