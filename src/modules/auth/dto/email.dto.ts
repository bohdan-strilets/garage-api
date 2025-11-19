import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

export class EmailDto {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(254)
  @Transform(({ value }: { value: string }) => value?.trim().toLowerCase())
  email: string;
}
