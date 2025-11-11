import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { DeviceType } from '../../enums';

@Schema({ _id: false, timestamps: false })
export class Device {
  @Prop({ enum: DeviceType, default: DeviceType.Unknown })
  type: DeviceType;

  @Prop({ type: String, maxlength: 64, default: null })
  os?: string | null;

  @Prop({ type: String, maxlength: 64, default: null })
  browser?: string | null;

  @Prop({ type: String, maxlength: 64, default: null })
  model?: string | null;
}

export const DeviceSchema = SchemaFactory.createForClass(Device);
