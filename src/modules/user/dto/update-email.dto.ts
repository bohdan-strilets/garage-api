import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

import { normalizeEmail } from '@app/common/utils';

export class UpdateEmailDto {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(254)
  @Transform(({ value }: { value: string }) => normalizeEmail(value))
  email: string;
}
