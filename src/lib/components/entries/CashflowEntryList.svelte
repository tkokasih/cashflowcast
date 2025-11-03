<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { CashflowEntry } from '$lib/types/cashflow';

  export let entries: CashflowEntry[] = [];

  const dispatch = createEventDispatcher<{
    edit: CashflowEntry;
    remove: string;
  }>();

  function describeRecurrence(entry: CashflowEntry): string {
    const { recurrence } = entry;
    switch (recurrence.type) {
      case 'daily':
        return 'Repeats daily';
      case 'weekly':
        return 'Repeats every week';
      case 'bi-weekly':
        return 'Repeats every 2 weeks';
      case 'x-weekly':
        return `Repeats every ${recurrence.every} week${recurrence.every === 1 ? '' : 's'}`;
      case 'monthly':
        return `Monthly on day ${recurrence.dayOfMonth}`;
      case 'yearly':
        return 'Repeats yearly';
      case 'every-x-days':
        return `Repeats every ${recurrence.every} day${recurrence.every === 1 ? '' : 's'}`;
    }
  }
</script>

<div class="space-y-4">
  {#if entries.length === 0}
    <div
      class="rounded-3xl border border-dashed border-slate-800/60 bg-slate-900/50 p-6 text-center text-sm text-slate-400"
    >
      <p>No entries yet. Add your first recurring cashflow to get started.</p>
    </div>
  {:else}
    {#each entries as entry (entry.id)}
      <article
        class="rounded-3xl border border-slate-800/70 bg-slate-950/70 p-4 shadow-sm shadow-emerald-500/5"
      >
        <div class="flex items-start justify-between gap-3">
          <div>
            <h4 class="text-base font-semibold text-slate-100">{entry.label}</h4>
            <p class="text-sm text-slate-400">{describeRecurrence(entry)}</p>
            <p class="mt-2 text-sm text-slate-400">
              <span class="font-medium text-slate-200">Start:</span>
              {entry.startDate}
              {#if entry.endDate}
                <span class="ml-3 font-medium text-slate-200">End:</span> {entry.endDate}
              {/if}
            </p>
          </div>
          <div class="text-right">
            <p class="text-lg font-semibold text-emerald-200">
              {entry.amount.toLocaleString(undefined, {
                style: 'currency',
                currency: entry.currency
              })}
            </p>
            <div class="mt-3 flex flex-wrap justify-end gap-2 text-xs">
              <button
                type="button"
                class="rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-1 font-medium text-slate-200 transition hover:border-emerald-400 hover:text-emerald-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
                on:click={() => dispatch('edit', entry)}
              >
                Edit
              </button>
              <button
                type="button"
                class="rounded-xl border border-transparent bg-rose-500/90 px-3 py-1 font-medium text-rose-50 transition hover:bg-rose-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-200"
                on:click={() => dispatch('remove', entry.id)}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      </article>
    {/each}
  {/if}
</div>
