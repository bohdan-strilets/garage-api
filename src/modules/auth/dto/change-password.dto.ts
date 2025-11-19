import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

import { PasswordPolicy } from '@app/modules/password/validators';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(64)
  @PasswordPolicy()
  newPassword: string;
}
