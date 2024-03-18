import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';
import { ValidationEnum } from 'src/common/enums/validation.enum';

export class LoginDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(ValidationEnum.MIN_PASSWORD_LENGTH)
  @MaxLength(ValidationEnum.MAX_PASSWORD_LENGTH)
  password: string;
}
