import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ValidationEnum } from 'src/common/enums/validation.enum';

export class RegistrationDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(ValidationEnum.MIN_FIRST_NAME_LENGTH)
  @MaxLength(ValidationEnum.MAX_FIRST_NAME_LENGTH)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(ValidationEnum.MIN_LAST_NAME_LENGTH)
  @MaxLength(ValidationEnum.MAX_LAST_NAME_LENGTH)
  lastName: string;

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
