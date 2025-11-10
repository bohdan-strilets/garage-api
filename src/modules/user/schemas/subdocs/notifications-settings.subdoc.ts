import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false, timestamps: false })
export class NotificationsSettings {
  @Prop({ type: Boolean, default: true })
  email: boolean;

  @Prop({ type: Boolean, default: true })
  inApp: boolean;

  @Prop({ type: Boolean, default: false })
  push: boolean;
}

export const NotificationsSettingsSchema = SchemaFactory.createForClass(NotificationsSettings);
