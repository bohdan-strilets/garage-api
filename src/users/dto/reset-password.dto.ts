import { IsNotEmpty, IsString, MinLength, MaxLength, IsEmail } from 'class-validator';
import { ValidationEnum } from 'src/common/enums/validation.enum';

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(ValidationEnum.MIN_PASSWORD_LENGTH)
  @MaxLength(ValidationEnum.MAX_PASSWORD_LENGTH)
  password: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
