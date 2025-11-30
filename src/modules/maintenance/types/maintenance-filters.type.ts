import { MaintenanceKind, MaintenanceStatus } from '../enums';

export type MaintenanceFilters = {
  kind?: MaintenanceKind;
  status?: MaintenanceStatus;
  dateFrom?: Date;
  dateTo?: Date;
  odometerMin?: number;
  odometerMax?: number;
};
