import { Vehicle } from '../schemas';

export type VehicleSelf = Pick<
  Vehicle,
  | '_id'
  | 'ownerId'
  | 'name'
  | 'brand'
  | 'model'
  | 'generation'
  | 'year'
  | 'identifiers'
  | 'odometer'
  | 'purchase'
  | 'sale'
  | 'technical'
  | 'notes'
  | 'createdAt'
  | 'updatedAt'
>;
