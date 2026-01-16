import { ProjectionType } from 'mongoose';

import { Vehicle } from '../schemas';

export const vehicleSelfProjection: ProjectionType<Vehicle> = {
  _id: 1,
  ownerId: 1,
  name: 1,
  brand: 1,
  model: 1,
  generation: 1,
  year: 1,
  identifiers: 1,
  odometer: 1,
  purchase: 1,
  sale: 1,
  technical: 1,
  notes: 1,
  status: 1,
  createdAt: 1,
  updatedAt: 1,
};
