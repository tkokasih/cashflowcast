import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import type { CashflowEntry } from '$lib/types/cashflow';

const STORAGE_KEY = 'cashflowcast.entries.v1';

function loadEntries(): CashflowEntry[] {
  if (!browser) return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CashflowEntry[];
    if (!Array.isArray(parsed)) return [];
    return parsed.map((entry) => ({
      ...entry,
      endDate: entry.endDate ?? null
    }));
  } catch (error) {
    console.warn('Failed to read entries from local storage', error);
    return [];
  }
}

function persist(entries: CashflowEntry[]) {
  if (!browser) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (error) {
    console.warn('Failed to persist entries to local storage', error);
  }
}

export const cashflowEntries = writable<CashflowEntry[]>(loadEntries());

if (browser) {
  cashflowEntries.subscribe((entries) => {
    persist(entries);
  });
}
