import { addDays, addMonths, endOfMonth } from './dates';
import type { CashflowEntry, Recurrence } from './types';

export function nextOccurrence(current: Date, recurrence: Recurrence): Date {
  switch (recurrence.kind) {
    case 'daily':
      return addDays(current, 1);
    case 'weekly':
      return addDays(current, 7);
    case 'biweekly':
      return addDays(current, 14);
    case 'x-weekly': {
      const interval = Math.max(1, recurrence.interval);
      return addDays(current, 7 * interval);
    }
    case 'every-x-days': {
      const interval = Math.max(1, recurrence.interval);
      return addDays(current, interval);
    }
    case 'monthly': {
      const targetDay = recurrence.dayOfMonth ?? current.getDate();
      const tentative = addMonths(current, 1);
      const lastDay = endOfMonth(tentative).getDate();
      tentative.setDate(Math.min(targetDay, lastDay));
      return tentative;
    }
    case 'yearly': {
      const tentative = new Date(current);
      tentative.setFullYear(tentative.getFullYear() + 1);
      return tentative;
    }
  }
}

export function describeRecurrence(recurrence: Recurrence): string {
  switch (recurrence.kind) {
    case 'daily':
      return 'Daily';
    case 'weekly':
      return 'Weekly';
    case 'biweekly':
      return 'Every 2 weeks';
    case 'x-weekly':
      return `Every ${Math.max(1, recurrence.interval)} weeks`;
    case 'monthly':
      return `Monthly on day ${recurrence.dayOfMonth ?? 'of start'}`;
    case 'yearly':
      return 'Yearly';
    case 'every-x-days':
      return `Every ${Math.max(1, recurrence.interval)} days`;
  }
}

export function toRecurrence(form: {
  kind: Recurrence['kind'];
  interval?: number;
  dayOfMonth?: number;
}): Recurrence {
  switch (form.kind) {
    case 'daily':
    case 'weekly':
    case 'biweekly':
    case 'yearly':
      return { kind: form.kind };
    case 'x-weekly':
      return { kind: 'x-weekly', interval: Math.max(1, form.interval ?? 1) };
    case 'every-x-days':
      return { kind: 'every-x-days', interval: Math.max(1, form.interval ?? 1) };
    case 'monthly':
    default:
      return {
        kind: 'monthly',
        dayOfMonth:
          form.dayOfMonth && form.dayOfMonth > 0 ? Math.min(31, form.dayOfMonth) : undefined
      };
  }
}

export function normalizeFirstOccurrence(entry: CashflowEntry, start: Date): Date | null {
  const entryStart = new Date(entry.startDate);
  const entryEnd = entry.endDate ? new Date(entry.endDate) : null;

  if (entryEnd && entryEnd.getTime() < start.getTime()) {
    return null;
  }

  let occurrence = entryStart;
  if (entryStart.getTime() < start.getTime()) {
    let guard = 0;
    while (occurrence.getTime() < start.getTime() && guard < 2000) {
      occurrence = nextOccurrence(occurrence, entry.recurrence);
      guard += 1;
    }
  }

  if (entryEnd && occurrence.getTime() > entryEnd.getTime()) {
    return null;
  }

  return occurrence;
}
