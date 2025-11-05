import { toRecurrence } from './recurrence';
import type { CashflowEntry, Project, Recurrence } from './types';

export interface EntryFormState {
  id: string | null;
  label: string;
  type: CashflowEntry['type'];
  amount: number;
  startDate: string;
  endDate: string;
  recurrenceKind: Recurrence['kind'];
  interval: number;
  dayOfMonth: number;
  notes: string;
}

export function createBlankFormState(
  today: string,
  defaults?: Partial<EntryFormState>
): EntryFormState {
  return {
    id: null,
    label: '',
    type: 'income',
    amount: 0,
    startDate: today,
    endDate: '',
    recurrenceKind: 'monthly',
    interval: 2,
    dayOfMonth: 1,
    notes: '',
    ...defaults
  };
}

export function formStateFromEntry(entry: CashflowEntry): EntryFormState {
  return {
    id: entry.id,
    label: entry.label,
    type: entry.type,
    amount: entry.amount,
    startDate: entry.startDate,
    endDate: entry.endDate ?? '',
    recurrenceKind: entry.recurrence.kind,
    interval:
      entry.recurrence.kind === 'x-weekly' || entry.recurrence.kind === 'every-x-days'
        ? entry.recurrence.interval
        : entry.recurrence.kind === 'biweekly'
          ? 2
          : entry.recurrence.kind === 'weekly'
            ? 1
            : 1,
    dayOfMonth:
      entry.recurrence.kind === 'monthly' && entry.recurrence.dayOfMonth
        ? entry.recurrence.dayOfMonth
        : 1,
    notes: entry.notes ?? ''
  };
}

export function entryFromForm(form: EntryFormState, project: Project): CashflowEntry {
  return {
    id: form.id ?? cryptoId(),
    label: form.label || 'Untitled entry',
    type: form.type,
    amount: Math.max(0, Number(form.amount) || 0),
    currency: project.currency,
    startDate: form.startDate,
    endDate: form.endDate ? form.endDate : undefined,
    recurrence: toRecurrence({
      kind: form.recurrenceKind,
      interval: form.interval,
      dayOfMonth: form.dayOfMonth
    }),
    notes: form.notes ? form.notes : undefined
  };
}

function cryptoId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
}
