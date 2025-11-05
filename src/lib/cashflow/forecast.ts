import { addMonths, cloneDate, endOfMonth, isAfter, isBefore, startOfMonth } from './dates';
import { nextOccurrence, normalizeFirstOccurrence } from './recurrence';
import type { ForecastRow, ForecastSummary, Project } from './types';

export function generateForecast(project: Project): ForecastRow[] {
  const today = startOfMonth(new Date());
  const minEntryStart = project.entries.reduce<Date | null>((acc, entry) => {
    const entryDate = startOfMonth(new Date(entry.startDate));
    if (acc === null || isBefore(entryDate, acc)) {
      return entryDate;
    }
    return acc;
  }, null);

  const periodStart = minEntryStart && isBefore(minEntryStart, today) ? minEntryStart : today;
  const months = Math.max(1, project.horizonMonths);
  const periods: ForecastRow[] = [];

  for (let i = 0; i < months; i += 1) {
    const monthStart = addMonths(periodStart, i);
    periods.push({
      periodStart: monthStart,
      label: monthStart.toLocaleString(undefined, { month: 'short', year: 'numeric' }),
      incomes: 0,
      expenses: 0,
      net: 0,
      balance: 0
    });
  }

  const periodMap = new Map<string, ForecastRow>();
  for (const period of periods) {
    const key = `${period.periodStart.getFullYear()}-${period.periodStart.getMonth()}`;
    periodMap.set(key, period);
  }

  const horizonEnd = endOfMonth(addMonths(periodStart, months - 1));

  for (const entry of project.entries) {
    const occurrence = normalizeFirstOccurrence(entry, periodStart);
    if (!occurrence) continue;

    let current = cloneDate(occurrence);
    const entryEnd = entry.endDate ? new Date(entry.endDate) : null;

    let guard = 0;
    while (!isAfter(current, horizonEnd) && guard < 5000) {
      if (!entryEnd || !isAfter(current, entryEnd)) {
        const key = `${current.getFullYear()}-${current.getMonth()}`;
        const period = periodMap.get(key);
        if (period) {
          if (entry.type === 'income') {
            period.incomes += entry.amount;
          } else {
            period.expenses += entry.amount;
          }
        }
      }
      current = nextOccurrence(current, entry.recurrence);
      guard += 1;
      if (entryEnd && isAfter(current, entryEnd)) {
        break;
      }
    }
  }

  let runningBalance = project.openingBalance;
  for (const period of periods) {
    period.net = period.incomes - period.expenses;
    runningBalance += period.net;
    period.balance = runningBalance;
  }

  return periods;
}

export function summariseForecast(rows: ForecastRow[], openingBalance: number): ForecastSummary {
  return rows.reduce(
    (acc, row) => {
      acc.totalIncome += row.incomes;
      acc.totalExpense += row.expenses;
      acc.endingBalance = row.balance;
      return acc;
    },
    { openingBalance, totalIncome: 0, totalExpense: 0, endingBalance: openingBalance }
  );
}

export function formatCurrency(amount: number, currencyCode: string): string {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: currencyCode,
    maximumFractionDigits: 0
  }).format(amount);
}
