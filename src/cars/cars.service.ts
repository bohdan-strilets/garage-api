import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Car, CarDocument } from './schemas/car.schema';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { ErrorsService } from 'src/errors/errors.service';

@Injectable()
export class CarsService {
  constructor(
    @InjectModel(Car.name) private CarModel: Model<CarDocument>,
    private readonly cloudinaryService: CloudinaryService,
    private readonly errorService: ErrorsService,
  ) {}
}
