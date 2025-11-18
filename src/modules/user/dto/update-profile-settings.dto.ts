import { IsBoolean, IsEnum, IsOptional } from 'class-validator';

import { Currency, Locale, Theme, Timezone } from '@app/common/enums';

export class UpdateProfileSettingsDto {
  @IsOptional()
  @IsEnum(Locale)
  locale?: Locale;

  @IsOptional()
  @IsEnum(Timezone)
  timezone?: Timezone;

  @IsOptional()
  @IsEnum(Theme)
  theme?: Theme;

  @IsOptional()
  @IsEnum(Currency)
  currency?: Currency;

  @IsOptional()
  @IsBoolean()
  notificationsEmail?: boolean;

  @IsOptional()
  @IsBoolean()
  notificationsInApp?: boolean;

  @IsOptional()
  @IsBoolean()
  notificationsPush?: boolean;
}
