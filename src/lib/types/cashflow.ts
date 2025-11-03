export type RecurrencePattern =
  | { type: 'daily' }
  | { type: 'weekly' }
  | { type: 'bi-weekly' }
  | { type: 'x-weekly'; every: number }
  | { type: 'monthly'; dayOfMonth: number }
  | { type: 'yearly' }
  | { type: 'every-x-days'; every: number };

export interface CashflowEntry {
  id: string;
  label: string;
  amount: number;
  currency: string;
  startDate: string; // ISO string yyyy-mm-dd
  endDate: string | null; // ISO string or null for open-ended
  recurrence: RecurrencePattern;
}

export interface MonthlyForecastPoint {
  monthStart: string; // ISO string
  total: number;
}

export interface CashflowScheduleRow extends MonthlyForecastPoint {
  monthLabel: string;
  runningTotal: number;
}
