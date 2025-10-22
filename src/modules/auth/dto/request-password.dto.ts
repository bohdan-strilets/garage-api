import { Transform } from 'class-transformer';
import { IsEmail } from 'class-validator';

export class RequestPasswordDto {
  @IsEmail({}, { message: 'Email must be a valid address' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;
}
