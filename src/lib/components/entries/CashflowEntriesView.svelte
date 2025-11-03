<script lang="ts">
  import CashflowEntryForm from '$lib/components/entries/CashflowEntryForm.svelte';
  import CashflowEntryList from '$lib/components/entries/CashflowEntryList.svelte';
  import { cashflowEntries } from '$lib/stores/cashflow';
  import type { CashflowEntry } from '$lib/types/cashflow';

  let editing: CashflowEntry | null = null;

  function createId() {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }
    return `entry-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function handleSave(event: CustomEvent<CashflowEntry>) {
    const submission = event.detail;
    const id = submission.id || createId();
    const entry: CashflowEntry = { ...submission, id };
    cashflowEntries.update((current) => {
      const index = current.findIndex((item) => item.id === id);
      if (index >= 0) {
        const copy = [...current];
        copy[index] = entry;
        return copy;
      }
      return [...current, entry];
    });
    editing = null;
  }

  function handleEdit(event: CustomEvent<CashflowEntry>) {
    editing = event.detail;
  }

  function handleRemove(event: CustomEvent<string>) {
    const id = event.detail;
    cashflowEntries.update((current) => current.filter((entry) => entry.id !== id));
    if (editing && editing.id === id) {
      editing = null;
    }
  }
</script>

<section class="pb-28 pt-6">
  <div class="space-y-6">
    <div
      class="rounded-3xl border border-slate-800/70 bg-slate-900/70 p-5 shadow-lg shadow-emerald-500/10"
    >
      <header class="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="text-lg font-semibold text-emerald-300">
            {editing ? 'Edit cashflow entry' : 'Add cashflow entry'}
          </h2>
          <p class="text-sm text-slate-400">
            {editing
              ? 'Update the details below and save your changes.'
              : 'Record income or expenses that repeat over time.'}
          </p>
        </div>
        {#if editing}
          <button
            type="button"
            class="self-start rounded-full border border-transparent bg-slate-800/80 px-3 py-1 text-xs font-medium uppercase tracking-wide text-slate-200 transition hover:bg-slate-700/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-200"
            on:click={() => (editing = null)}
          >
            Exit edit mode
          </button>
        {/if}
      </header>
      <CashflowEntryForm
        mode={editing ? 'edit' : 'create'}
        entry={editing}
        on:save={handleSave}
        on:cancel={() => (editing = null)}
      />
    </div>

    <div
      class="rounded-3xl border border-slate-800/70 bg-slate-900/60 p-5 shadow-inner shadow-slate-900/50"
    >
      <header class="mb-4">
        <h3 class="text-base font-semibold text-sky-300">Your cashflow entries</h3>
        <p class="text-sm text-slate-400">
          Track and maintain all of your recurring cashflow items.
        </p>
      </header>
      <CashflowEntryList entries={$cashflowEntries} on:edit={handleEdit} on:remove={handleRemove} />
    </div>
  </div>
</section>
