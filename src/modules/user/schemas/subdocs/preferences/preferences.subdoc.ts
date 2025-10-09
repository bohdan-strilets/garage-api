import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { Currency } from '@modules/user/enums/currency.enum';
import { Locale } from '@modules/user/enums/locale.enum';
import { Theme } from '@modules/user/enums/theme.enum';

import { Units, UnitsSchema } from './units.subdoc';

@Schema({ _id: false, versionKey: false })
export class Preferences {
  @Prop({ enum: Locale, default: Locale.EN })
  locale?: Locale;

  @Prop({ enum: Currency, default: Currency.USD })
  currency?: Currency;

  @Prop({ default: 'Europe/Warsaw' })
  timezone?: string;

  @Prop({ type: UnitsSchema, default: {} })
  units?: Units;

  @Prop({ enum: Theme, default: Theme.SYSTEM })
  theme?: Theme;
}

export type PreferencesDocument = HydratedDocument<Preferences>;
export const PreferencesSchema = SchemaFactory.createForClass(Preferences);
