<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import {
    describeRecurrence,
    formatCurrency,
    type CashflowEntry,
    type EntryFormState
  } from '$lib/cashflow';

  export let entries: CashflowEntry[] = [];
  export let formState: EntryFormState;
  export let currency: string;

  const dispatch = createEventDispatcher<{
    submit: void;
    reset: void;
    edit: { entry: CashflowEntry };
    remove: { id: string };
  }>();

  function updateField<K extends keyof EntryFormState>(key: K, value: EntryFormState[K]) {
    formState = { ...formState, [key]: value };
  }

  function setType(event: Event) {
    const select = event.currentTarget as HTMLSelectElement;
    updateField('type', select.value === 'income' ? 'income' : 'expense');
  }

  function setRecurrenceKind(event: Event) {
    const select = event.currentTarget as HTMLSelectElement;
    updateField('recurrenceKind', select.value as EntryFormState['recurrenceKind']);
  }

  function recurrenceHelp(kind: EntryFormState['recurrenceKind']): string {
    switch (kind) {
      case 'x-weekly':
        return 'Set how many weeks apart the entry repeats.';
      case 'every-x-days':
        return 'Specify the number of days between each occurrence.';
      case 'monthly':
        return 'Choose the calendar day for the monthly event.';
      default:
        return '';
    }
  }
</script>

<section class="space-y-6">
  <div class="space-y-3">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold text-white">Recurring entries</h2>
      <button
        class="rounded-full border border-emerald-400/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300 hover:bg-emerald-400/10"
        type="button"
        on:click={() => dispatch('reset')}
      >
        New entry
      </button>
    </div>
    <div class="grid gap-4">
      {#each entries as entry (entry.id)}
        <article
          class="rounded-3xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg shadow-slate-900/40"
        >
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-xs uppercase tracking-[0.3em] text-slate-400">{entry.type}</p>
              <h3 class="text-lg font-semibold text-white">{entry.label}</h3>
              <p class="text-sm text-slate-400">{describeRecurrence(entry.recurrence)}</p>
            </div>
            <div class="text-right">
              <p
                class={`text-lg font-semibold ${entry.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}
              >
                {formatCurrency(entry.amount, currency)}
              </p>
              <p class="text-xs text-slate-500">
                {entry.startDate}{entry.endDate ? ` → ${entry.endDate}` : ''}
              </p>
            </div>
          </div>
          {#if entry.notes}
            <p class="mt-3 text-sm text-slate-300">{entry.notes}</p>
          {/if}
          <div class="mt-4 flex items-center justify-end gap-3 text-xs">
            <button
              class="rounded-full border border-slate-700 px-4 py-1 font-semibold uppercase tracking-[0.25em] text-slate-300 hover:bg-slate-800/80"
              type="button"
              on:click={() => dispatch('edit', { entry })}
            >
              Edit
            </button>
            <button
              class="rounded-full border border-rose-500/70 px-4 py-1 font-semibold uppercase tracking-[0.25em] text-rose-300 hover:bg-rose-500/10"
              type="button"
              on:click={() => dispatch('remove', { id: entry.id })}
            >
              Remove
            </button>
          </div>
        </article>
      {/each}
      {#if entries.length === 0}
        <p
          class="rounded-3xl border border-dashed border-slate-700 bg-slate-900/30 p-6 text-center text-sm text-slate-400"
        >
          No entries yet. Add your first recurring cashflow above.
        </p>
      {/if}
    </div>
  </div>

  <div
    class="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl shadow-slate-900/40"
  >
    <h3 class="text-lg font-semibold text-white">
      {formState.id ? 'Update entry' : 'Add new entry'}
    </h3>
    <p class="text-sm text-slate-400">
      Capture the schedule so it appears in the forecast immediately.
    </p>
    <form
      class="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2"
      on:submit|preventDefault={() => dispatch('submit')}
    >
      <label class="flex flex-col gap-2 text-sm">
        <span class="text-xs uppercase tracking-[0.3em] text-slate-400">Label</span>
        <input
          class="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-white focus:border-sky-400 focus:outline-none"
          value={formState.label}
          on:input={(event) => updateField('label', event.currentTarget.value)}
          placeholder="e.g. Mortgage"
          required
        />
      </label>

      <label class="flex flex-col gap-2 text-sm">
        <span class="text-xs uppercase tracking-[0.3em] text-slate-400">Type</span>
        <select
          class="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-white focus:border-sky-400 focus:outline-none"
          value={formState.type}
          on:change={setType}
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </label>

      <label class="flex flex-col gap-2 text-sm">
        <span class="text-xs uppercase tracking-[0.3em] text-slate-400">Amount</span>
        <input
          class="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-white focus:border-sky-400 focus:outline-none"
          type="number"
          min="0"
          step="1"
          value={formState.amount}
          on:input={(event) => updateField('amount', Number(event.currentTarget.value))}
        />
      </label>

      <label class="flex flex-col gap-2 text-sm">
        <span class="text-xs uppercase tracking-[0.3em] text-slate-400">Notes</span>
        <input
          class="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-white focus:border-sky-400 focus:outline-none"
          value={formState.notes}
          on:input={(event) => updateField('notes', event.currentTarget.value)}
          placeholder="Optional details"
        />
      </label>

      <label class="flex flex-col gap-2 text-sm">
        <span class="text-xs uppercase tracking-[0.3em] text-slate-400">Start date</span>
        <input
          class="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-white focus:border-sky-400 focus:outline-none"
          type="date"
          value={formState.startDate}
          on:input={(event) => updateField('startDate', event.currentTarget.value)}
        />
      </label>

      <label class="flex flex-col gap-2 text-sm">
        <span class="text-xs uppercase tracking-[0.3em] text-slate-400">End date</span>
        <input
          class="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-white focus:border-sky-400 focus:outline-none"
          type="date"
          value={formState.endDate}
          on:input={(event) => updateField('endDate', event.currentTarget.value)}
        />
      </label>

      <label class="flex flex-col gap-2 text-sm">
        <span class="text-xs uppercase tracking-[0.3em] text-slate-400">Recurring pattern</span>
        <select
          class="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-white focus:border-sky-400 focus:outline-none"
          value={formState.recurrenceKind}
          on:change={setRecurrenceKind}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="biweekly">Bi-weekly</option>
          <option value="x-weekly">Every X weeks</option>
          <option value="every-x-days">Every X days</option>
          <option value="monthly">Monthly on date</option>
          <option value="yearly">Yearly</option>
        </select>
        {#if recurrenceHelp(formState.recurrenceKind)}
          <span class="text-xs text-slate-500">{recurrenceHelp(formState.recurrenceKind)}</span>
        {/if}
      </label>

      {#if formState.recurrenceKind === 'x-weekly' || formState.recurrenceKind === 'every-x-days'}
        <label class="flex flex-col gap-2 text-sm">
          <span class="text-xs uppercase tracking-[0.3em] text-slate-400">Interval</span>
          <input
            class="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-white focus:border-sky-400 focus:outline-none"
            type="number"
            min="1"
            step="1"
            value={formState.interval}
            on:input={(event) => updateField('interval', Number(event.currentTarget.value))}
          />
        </label>
      {/if}

      {#if formState.recurrenceKind === 'monthly'}
        <label class="flex flex-col gap-2 text-sm">
          <span class="text-xs uppercase tracking-[0.3em] text-slate-400">Day of month</span>
          <input
            class="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-white focus:border-sky-400 focus:outline-none"
            type="number"
            min="1"
            max="31"
            step="1"
            value={formState.dayOfMonth}
            on:input={(event) => updateField('dayOfMonth', Number(event.currentTarget.value))}
          />
        </label>
      {/if}

      <div class="flex flex-col gap-2 text-sm sm:col-span-2">
        <span class="text-xs uppercase tracking-[0.3em] text-slate-400">Actions</span>
        <div class="flex flex-wrap gap-3">
          <button
            class="rounded-full bg-sky-500 px-6 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white hover:bg-sky-400"
            type="submit"
          >
            {formState.id ? 'Save changes' : 'Add entry'}
          </button>
          <button
            class="rounded-full border border-slate-600 px-6 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-300 hover:bg-slate-800"
            type="button"
            on:click={() => dispatch('reset')}
          >
            Reset form
          </button>
        </div>
      </div>
    </form>
  </div>
</section>
