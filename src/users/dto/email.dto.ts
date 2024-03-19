import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class EmailDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
