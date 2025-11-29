import { Vehicle } from '../schemas';

export type VehicleListItem = Pick<Vehicle, '_id' | 'name' | 'brand' | 'model' | 'year'>;
