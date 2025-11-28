import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { BodyType, Drivetrain, FuelType, Transmission } from '../../enums';

import { VehicleAppearance, VehicleAppearanceSchema } from './vehicle-appearance.subdoc';
import { VehicleCapacity, VehicleCapacitySchema } from './vehicle-capacity.subdoc';
import { VehicleDimensions, VehicleDimensionsSchema } from './vehicle-dimensions.subdoc';
import { VehicleEconomy, VehicleEconomySchema } from './vehicle-economy.subdoc';
import { VehicleEngine, VehicleEngineSchema } from './vehicle-engine.subdoc';
import { VehiclePerformance, VehiclePerformanceSchema } from './vehicle-performance.subdoc';

@Schema({ _id: false, versionKey: false, timestamps: false })
export class VehicleTechnical {
  @Prop({ enum: FuelType, required: true })
  fuelType: FuelType;

  @Prop({ enum: Transmission, required: true })
  transmission: Transmission;

  @Prop({ enum: Drivetrain, default: null })
  drivetrain?: Drivetrain | null;

  @Prop({ enum: BodyType, default: null })
  bodyType?: BodyType | null;

  @Prop({ type: Number, min: 1, default: 4 })
  doors?: number;

  @Prop({ type: Number, min: 1, default: 5 })
  seats?: number;

  @Prop({ type: VehicleEngineSchema, default: {} })
  engine: VehicleEngine;

  @Prop({ type: VehicleEconomySchema, default: {} })
  economy: VehicleEconomy;

  @Prop({ type: VehicleDimensionsSchema, default: {} })
  dimensions: VehicleDimensions;

  @Prop({ type: VehicleCapacitySchema, default: {} })
  capacity: VehicleCapacity;

  @Prop({ type: VehiclePerformanceSchema, default: {} })
  performance: VehiclePerformance;

  @Prop({ type: VehicleAppearanceSchema, default: {} })
  appearance: VehicleAppearance;
}

export const VehicleTechnicalSchema = SchemaFactory.createForClass(VehicleTechnical);
