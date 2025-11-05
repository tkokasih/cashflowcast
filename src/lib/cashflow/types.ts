export type CashflowType = 'income' | 'expense';

export type Recurrence =
  | { kind: 'daily' }
  | { kind: 'weekly' }
  | { kind: 'biweekly' }
  | { kind: 'x-weekly'; interval: number }
  | { kind: 'monthly'; dayOfMonth?: number }
  | { kind: 'yearly' }
  | { kind: 'every-x-days'; interval: number };

export interface CashflowEntry {
  id: string;
  label: string;
  type: CashflowType;
  amount: number;
  currency: string;
  startDate: string;
  endDate?: string;
  recurrence: Recurrence;
  notes?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  openingBalance: number;
  currency: string;
  entries: CashflowEntry[];
  horizonMonths: number;
  githubPagesUrl: string;
  lastUpdated: string;
}

export interface ForecastRow {
  periodStart: Date;
  label: string;
  incomes: number;
  expenses: number;
  net: number;
  balance: number;
}

export interface ForecastSummary {
  openingBalance: number;
  totalIncome: number;
  totalExpense: number;
  endingBalance: number;
}
