<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { CashflowEntry, RecurrencePattern } from '$lib/types/cashflow';

  export let mode: 'create' | 'edit' = 'create';
  export let entry: CashflowEntry | null = null;

  const dispatch = createEventDispatcher<{
    save: CashflowEntry;
    cancel: void;
  }>();

  const today = new Date();
  const defaultDate = `${today.getFullYear()}-${`${today.getMonth() + 1}`.padStart(2, '0')}-${`${today.getDate()}`.padStart(
    2,
    '0'
  )}`;

  let currentId: string | null = null;
  let label = '';
  let amount = 0;
  let startDate = defaultDate;
  let endDate = '';
  let recurrenceType: RecurrencePattern['type'] = 'monthly';
  let everyValue = 2;
  let dayOfMonth = 1;

  const currency = 'USD';

  $: if (entry && entry.id !== currentId) {
    currentId = entry.id;
    label = entry.label;
    amount = entry.amount;
    startDate = entry.startDate;
    endDate = entry.endDate ?? '';
    recurrenceType = entry.recurrence.type;
    if (entry.recurrence.type === 'x-weekly' || entry.recurrence.type === 'every-x-days') {
      everyValue = entry.recurrence.every;
    }
    if (entry.recurrence.type === 'monthly') {
      dayOfMonth = entry.recurrence.dayOfMonth;
    }
  } else if (!entry && currentId !== null) {
    currentId = null;
    label = '';
    amount = 0;
    startDate = defaultDate;
    endDate = '';
    recurrenceType = 'monthly';
    everyValue = 2;
    dayOfMonth = 1;
  }

  function buildRecurrence(): RecurrencePattern {
    switch (recurrenceType) {
      case 'x-weekly':
      case 'every-x-days':
        return {
          type: recurrenceType,
          every: Math.max(1, Number.isFinite(everyValue) ? Math.floor(everyValue) : 1)
        } as RecurrencePattern;
      case 'monthly':
        return {
          type: 'monthly',
          dayOfMonth: Math.min(31, Math.max(1, dayOfMonth))
        };
      default:
        return { type: recurrenceType } as RecurrencePattern;
    }
  }

  function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    if (!label.trim()) return;
    const parsedAmount = Number(amount);
    if (Number.isNaN(parsedAmount)) return;
    if (!startDate) return;

    const recurrence = buildRecurrence();

    dispatch('save', {
      id: entry?.id ?? '',
      label: label.trim(),
      amount: parsedAmount,
      currency,
      startDate,
      endDate: endDate ? endDate : null,
      recurrence
    });
  }
</script>

<form class="space-y-4" on:submit|preventDefault={handleSubmit}>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
    <label class="flex flex-col gap-2 text-sm">
      <span class="text-xs uppercase tracking-wide text-slate-400">Label</span>
      <input
        class="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-base text-slate-100 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
        placeholder="e.g. Paycheck"
        bind:value={label}
        required
      />
    </label>
    <label class="flex flex-col gap-2 text-sm">
      <span class="text-xs uppercase tracking-wide text-slate-400">Amount</span>
      <input
        type="number"
        step="0.01"
        class="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-base text-slate-100 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
        bind:value={amount}
        required
      />
    </label>
  </div>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
    <label class="flex flex-col gap-2 text-sm">
      <span class="text-xs uppercase tracking-wide text-slate-400">Currency</span>
      <input
        class="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-base text-slate-400"
        value={currency}
        readonly
      />
    </label>
    <label class="flex flex-col gap-2 text-sm">
      <span class="text-xs uppercase tracking-wide text-slate-400">Start date</span>
      <input
        type="date"
        class="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-base text-slate-100 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
        bind:value={startDate}
        required
      />
    </label>
    <label class="flex flex-col gap-2 text-sm">
      <span class="text-xs uppercase tracking-wide text-slate-400">End date</span>
      <input
        type="date"
        class="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-base text-slate-100 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
        bind:value={endDate}
      />
    </label>
  </div>

  <div class="space-y-3">
    <span class="block text-xs uppercase tracking-wide text-slate-400">Recurring pattern</span>
    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <label
        class="flex items-center gap-2 rounded-2xl border border-slate-800/80 bg-slate-900/70 px-3 py-2 text-sm"
      >
        <input type="radio" bind:group={recurrenceType} value="daily" />
        <span>Daily</span>
      </label>
      <label
        class="flex items-center gap-2 rounded-2xl border border-slate-800/80 bg-slate-900/70 px-3 py-2 text-sm"
      >
        <input type="radio" bind:group={recurrenceType} value="weekly" />
        <span>Weekly</span>
      </label>
      <label
        class="flex items-center gap-2 rounded-2xl border border-slate-800/80 bg-slate-900/70 px-3 py-2 text-sm"
      >
        <input type="radio" bind:group={recurrenceType} value="bi-weekly" />
        <span>Bi-weekly</span>
      </label>
      <label
        class="flex items-center gap-2 rounded-2xl border border-slate-800/80 bg-slate-900/70 px-3 py-2 text-sm"
      >
        <input type="radio" bind:group={recurrenceType} value="x-weekly" />
        <span>Every x weeks</span>
      </label>
      <label
        class="flex items-center gap-2 rounded-2xl border border-slate-800/80 bg-slate-900/70 px-3 py-2 text-sm"
      >
        <input type="radio" bind:group={recurrenceType} value="monthly" />
        <span>Monthly (day)</span>
      </label>
      <label
        class="flex items-center gap-2 rounded-2xl border border-slate-800/80 bg-slate-900/70 px-3 py-2 text-sm"
      >
        <input type="radio" bind:group={recurrenceType} value="yearly" />
        <span>Yearly</span>
      </label>
      <label
        class="flex items-center gap-2 rounded-2xl border border-slate-800/80 bg-slate-900/70 px-3 py-2 text-sm"
      >
        <input type="radio" bind:group={recurrenceType} value="every-x-days" />
        <span>Every x days</span>
      </label>
    </div>

    {#if recurrenceType === 'x-weekly' || recurrenceType === 'every-x-days'}
      <label class="flex flex-col gap-2 text-sm">
        <span class="text-xs uppercase tracking-wide text-slate-400">
          {recurrenceType === 'x-weekly' ? 'Repeat every (weeks)' : 'Repeat every (days)'}
        </span>
        <input
          type="number"
          min="1"
          class="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-base text-slate-100 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          bind:value={everyValue}
          required
        />
      </label>
    {/if}

    {#if recurrenceType === 'monthly'}
      <label class="flex flex-col gap-2 text-sm">
        <span class="text-xs uppercase tracking-wide text-slate-400">Day of month</span>
        <input
          type="number"
          min="1"
          max="31"
          class="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-base text-slate-100 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          bind:value={dayOfMonth}
          required
        />
      </label>
    {/if}
  </div>

  <div class="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
    {#if mode === 'edit'}
      <button
        type="button"
        class="rounded-2xl border border-transparent bg-slate-800/80 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-700/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-200"
        on:click={() => dispatch('cancel')}
      >
        Cancel
      </button>
    {/if}
    <button
      type="submit"
      class="rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg shadow-emerald-500/25 transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-200"
    >
      {mode === 'edit' ? 'Save changes' : 'Add entry'}
    </button>
  </div>
</form>
