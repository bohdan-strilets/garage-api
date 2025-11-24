import { Transform } from 'class-transformer';
import { IsString, Matches, MaxLength } from 'class-validator';

import { phoneRegex } from '@app/common/regex';
import { normalizePhone } from '@app/common/utils';

export class UpdatePhoneDto {
  @Transform(({ value }) => normalizePhone(String(value)))
  @IsString()
  @MaxLength(32)
  @Matches(phoneRegex)
  phone: string;
}
