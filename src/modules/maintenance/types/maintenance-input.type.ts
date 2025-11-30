import { MaintenanceKind } from '../enums/maintenance-kind.enum';
import { MaintenanceStatus } from '../enums/maintenance-status.enum';

import { MaintenancePartInput } from './maintenance-part-input.type';

export type MaintenanceInput = {
  ownerId: string;
  vehicleId: string;
  kind: MaintenanceKind;
  status?: MaintenanceStatus;
  date: Date;
  odometer: number;
  title: string;
  description?: string;
  totalCost: number;
  currency?: string;
  workshopName?: string;
  serviceType?: string;
  nextServiceOdometer?: number;
  nextServiceDate?: Date;
  repairArea?: string;
  underWarranty?: boolean;
  isAccidentRelated?: boolean;
  parts?: MaintenancePartInput[];
};
