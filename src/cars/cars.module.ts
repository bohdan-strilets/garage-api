import { Module } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CarsController } from './cars.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Car, CarSchema } from './schemas/car.schema';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { ErrorsModule } from 'src/errors/errors.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Car.name, schema: CarSchema }]),
    CloudinaryModule,
    ErrorsModule,
  ],
  controllers: [CarsController],
  providers: [CarsService],
})
export class CarsModule {}
