export type HealthSuccess = {
  status: 'ok' | 'error';
  timestamp: string;
  uptime: number;
};
