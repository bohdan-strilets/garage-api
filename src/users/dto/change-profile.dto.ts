import { IsString, IsDateString, IsIn, MinLength, MaxLength, IsOptional } from 'class-validator';
import { GenderEnum } from '../enums/gender.enum';
import { ValidationEnum } from 'src/common/enums/validation.enum';

export class ChangeProfileDto {
  @IsString()
  @MinLength(ValidationEnum.MIN_FIRST_NAME_LENGTH)
  @MaxLength(ValidationEnum.MAX_FIRST_NAME_LENGTH)
  @IsOptional()
  firstName?: string;

  @IsString()
  @MinLength(ValidationEnum.MIN_LAST_NAME_LENGTH)
  @MaxLength(ValidationEnum.MAX_LAST_NAME_LENGTH)
  @IsOptional()
  lastName?: string;

  @IsDateString()
  @IsOptional()
  dateBirth?: Date;

  @IsString()
  @IsIn([GenderEnum])
  @IsOptional()
  gender?: string;
}
