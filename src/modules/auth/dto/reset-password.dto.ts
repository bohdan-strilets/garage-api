import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

import { PasswordPolicy } from '@app/modules/password/validators';

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(64)
  @PasswordPolicy()
  newPassword: string;
}
