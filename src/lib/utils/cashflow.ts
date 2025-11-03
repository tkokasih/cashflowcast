import type {
  CashflowEntry,
  CashflowScheduleRow,
  MonthlyForecastPoint,
  RecurrencePattern
} from '$lib/types/cashflow';
import {
  addDays,
  addMonths,
  daysInMonth,
  formatISODate,
  parseLocalDate,
  startOfMonth
} from '$lib/utils/date';

function nextOccurrence(
  current: Date,
  recurrence: RecurrencePattern,
  anchor?: { dayOfMonth?: number }
): Date {
  switch (recurrence.type) {
    case 'daily':
      return addDays(current, 1);
    case 'weekly':
      return addDays(current, 7);
    case 'bi-weekly':
      return addDays(current, 14);
    case 'x-weekly':
      return addDays(current, 7 * Math.max(1, recurrence.every));
    case 'every-x-days':
      return addDays(current, Math.max(1, recurrence.every));
    case 'monthly': {
      const desiredDay = anchor?.dayOfMonth ?? recurrence.dayOfMonth;
      const next = addMonths(current, 1);
      const maxDay = daysInMonth(next.getFullYear(), next.getMonth());
      next.setDate(Math.min(desiredDay, maxDay));
      return next;
    }
    case 'yearly': {
      const next = new Date(current);
      next.setFullYear(next.getFullYear() + 1);
      return next;
    }
  }
}

function advanceOccurrence(current: Date, recurrence: RecurrencePattern): Date {
  if (recurrence.type === 'monthly') {
    return nextOccurrence(current, recurrence, { dayOfMonth: recurrence.dayOfMonth });
  }
  return nextOccurrence(current, recurrence);
}

function firstOccurrence(entry: CashflowEntry, windowStart: Date): Date | null {
  const start = parseLocalDate(entry.startDate);
  if (entry.recurrence.type === 'monthly') {
    const day = entry.recurrence.dayOfMonth;
    const initial = new Date(start);
    initial.setDate(1);
    initial.setHours(0, 0, 0, 0);
    const dayForMonth = Math.min(day, daysInMonth(initial.getFullYear(), initial.getMonth()));
    initial.setDate(dayForMonth);
    if (initial < start) {
      initial.setMonth(initial.getMonth() + 1);
      const maxDay = daysInMonth(initial.getFullYear(), initial.getMonth());
      initial.setDate(Math.min(day, maxDay));
    }
    let occurrence = initial;
    while (occurrence < windowStart) {
      const next = nextOccurrence(occurrence, entry.recurrence, { dayOfMonth: day });
      if (next.getTime() === occurrence.getTime()) break;
      occurrence = next;
    }
    return occurrence;
  }

  let occurrence = new Date(start);
  if (entry.recurrence.type === 'yearly') {
    occurrence.setHours(0, 0, 0, 0);
  }

  while (occurrence < windowStart) {
    const next = advanceOccurrence(occurrence, entry.recurrence);
    if (next.getTime() === occurrence.getTime()) break;
    occurrence = next;
  }
  return occurrence;
}

export function generateMonthlyForecast(
  entries: CashflowEntry[],
  months = 12,
  baseDate = new Date()
): { points: MonthlyForecastPoint[]; schedule: CashflowScheduleRow[] } {
  const monthStart = startOfMonth(baseDate);
  const windowEnd = addMonths(monthStart, months);

  const totalsByMonth = new Map<string, number>();

  for (const entry of entries) {
    const recurrence = entry.recurrence;
    const first = firstOccurrence(entry, monthStart);
    if (!first) continue;

    const endDate = entry.endDate ? parseLocalDate(entry.endDate) : null;
    let occurrence = first;

    while (occurrence < windowEnd) {
      if (endDate && occurrence > endDate) break;
      if (occurrence >= monthStart) {
        const monthKey = `${occurrence.getFullYear()}-${(occurrence.getMonth() + 1)
          .toString()
          .padStart(2, '0')}`;
        totalsByMonth.set(monthKey, (totalsByMonth.get(monthKey) ?? 0) + entry.amount);
      }
      const next = advanceOccurrence(occurrence, recurrence);
      if (next.getTime() === occurrence.getTime()) break;
      occurrence = next;
    }
  }

  const points: MonthlyForecastPoint[] = [];
  const schedule: CashflowScheduleRow[] = [];
  let runningTotal = 0;

  for (let index = 0; index < months; index += 1) {
    const currentMonthStart = addMonths(monthStart, index);
    currentMonthStart.setHours(0, 0, 0, 0);
    const monthKey = `${currentMonthStart.getFullYear()}-${(currentMonthStart.getMonth() + 1)
      .toString()
      .padStart(2, '0')}`;
    const total = totalsByMonth.get(monthKey) ?? 0;
    runningTotal += total;
    const point: MonthlyForecastPoint = {
      monthStart: formatISODate(currentMonthStart),
      total
    };
    points.push(point);

    schedule.push({
      ...point,
      monthLabel: currentMonthStart.toLocaleString(undefined, {
        month: 'short',
        year: 'numeric'
      }),
      runningTotal
    });
  }

  return { points, schedule };
}
