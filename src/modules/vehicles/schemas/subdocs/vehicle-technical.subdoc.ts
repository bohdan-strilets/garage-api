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

  @Prop({ enum: Drivetrain, required: true })
  drivetrain: Drivetrain;

  @Prop({ enum: BodyType, required: true })
  bodyType: BodyType;

  @Prop({ type: Number, min: 1, default: null })
  doors?: number | null;

  @Prop({ type: Number, min: 1, default: null })
  seats?: number | null;

  @Prop({ type: VehicleEngineSchema, required: true })
  engine: VehicleEngine;

  @Prop({ type: VehicleEconomySchema, required: true })
  economy: VehicleEconomy;

  @Prop({ type: VehicleDimensionsSchema, required: true })
  dimensions: VehicleDimensions;

  @Prop({ type: VehicleCapacitySchema, required: true })
  capacity: VehicleCapacity;

  @Prop({ type: VehiclePerformanceSchema, required: true })
  performance: VehiclePerformance;

  @Prop({ type: VehicleAppearanceSchema, required: true })
  appearance: VehicleAppearance;
}

export const VehicleTechnicalSchema = SchemaFactory.createForClass(VehicleTechnical);
