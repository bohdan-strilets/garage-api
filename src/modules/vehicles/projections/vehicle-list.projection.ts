import { ProjectionType } from 'mongoose';

import { Vehicle } from '../schemas';

export const vehicleListProjection: ProjectionType<Vehicle> = {
  ownerId: 1,
  name: 1,
  brand: 1,
  model: 1,
  year: 1,
  sale: 1,
  createdAt: 1,
};
