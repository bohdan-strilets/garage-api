import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import {
  DEFAULT_CURRENCY,
  DEFAULT_DATE_FORMAT,
  DEFAULT_LOCALE,
  DEFAULT_TIMEZONE,
} from '../../constants/regional.constants';
import { CurrencyCode } from '../../enums/currency-code.enum';
import { UiLanguage } from '../../enums/ui-language.enum';

@Schema({ _id: false, versionKey: false })
export class UserSettings {
  @Prop({ type: String, enum: UiLanguage, default: UiLanguage.POL })
  uiLanguage: UiLanguage;

  @Prop({ type: String, default: DEFAULT_LOCALE })
  locale: string;

  @Prop({ type: String, default: DEFAULT_TIMEZONE })
  timezone: string;

  @Prop({ type: String, enum: CurrencyCode, default: DEFAULT_CURRENCY })
  currency: CurrencyCode;

  @Prop({ type: String, default: DEFAULT_DATE_FORMAT })
  dateFormat: string;
}
export const UserSettingsSchema = SchemaFactory.createForClass(UserSettings);
