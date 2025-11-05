import { derivePagesUrl } from '$lib/github';
import type { Project } from './types';

const currency = 'USD';
const today = new Date();
const baseYear = today.getFullYear();
const baseMonth = today.getMonth();

function isoDate(yearOffset: number, monthOffset: number, day: number): string {
  const value = new Date(baseYear + yearOffset, baseMonth + monthOffset, day);
  return value.toISOString().slice(0, 10);
}

export function createSampleProject(): Project {
  return {
    id: 'sample-project',
    name: 'Sample Household Plan',
    description:
      'A starter projection combining payroll, rent, savings, and discretionary spending to demonstrate the forecast.',
    openingBalance: 2500,
    currency,
    horizonMonths: 6,
    githubPagesUrl: derivePagesUrl(),
    lastUpdated: today.toISOString(),
    entries: [
      {
        id: 'income-1',
        label: 'Paycheck',
        type: 'income',
        amount: 2200,
        currency,
        startDate: isoDate(0, 0, 1),
        recurrence: { kind: 'biweekly' },
        notes: 'Net salary after deductions.'
      },
      {
        id: 'expense-1',
        label: 'Rent',
        type: 'expense',
        amount: 1450,
        currency,
        startDate: isoDate(0, 0, 1),
        recurrence: { kind: 'monthly', dayOfMonth: 1 },
        notes: 'Apartment lease payment.'
      },
      {
        id: 'expense-2',
        label: 'Groceries',
        type: 'expense',
        amount: 180,
        currency,
        startDate: isoDate(0, 0, 5),
        recurrence: { kind: 'weekly' },
        notes: 'Household essentials and produce.'
      },
      {
        id: 'income-2',
        label: 'Freelance Retainer',
        type: 'income',
        amount: 600,
        currency,
        startDate: isoDate(0, 0, 15),
        recurrence: { kind: 'monthly', dayOfMonth: 15 },
        notes: 'Contract work billed mid-month.'
      },
      {
        id: 'expense-3',
        label: 'Streaming Bundle',
        type: 'expense',
        amount: 45,
        currency,
        startDate: isoDate(0, 0, 10),
        recurrence: { kind: 'monthly', dayOfMonth: 10 },
        notes: 'Entertainment subscriptions.'
      },
      {
        id: 'income-3',
        label: 'Savings Interest',
        type: 'income',
        amount: 25,
        currency,
        startDate: isoDate(0, 0, 28),
        recurrence: { kind: 'monthly', dayOfMonth: 28 },
        notes: 'High-yield account earnings.'
      },
      {
        id: 'expense-4',
        label: 'Gym Membership',
        type: 'expense',
        amount: 55,
        currency,
        startDate: isoDate(0, 0, 3),
        recurrence: { kind: 'monthly', dayOfMonth: 3 },
        notes: 'Health and wellness.'
      },
      {
        id: 'expense-5',
        label: 'Weekend Activities',
        type: 'expense',
        amount: 90,
        currency,
        startDate: isoDate(0, 0, 6),
        recurrence: { kind: 'x-weekly', interval: 2 },
        notes: 'Every other weekend outings.'
      }
    ]
  };
}

export const sampleProject = createSampleProject();
