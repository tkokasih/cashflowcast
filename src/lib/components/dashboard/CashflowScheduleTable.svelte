<script lang="ts">
  import type { CashflowScheduleRow } from '$lib/types/cashflow';

  export let schedule: CashflowScheduleRow[] = [];
</script>

<div
  class="mt-6 rounded-3xl border border-slate-800/70 bg-slate-950/60 p-4 shadow-lg shadow-slate-900/60"
>
  <div class="mb-4 flex items-center justify-between">
    <h3 class="text-left text-base font-semibold text-sky-300">Cashflow schedule</h3>
    <span class="text-xs uppercase tracking-wide text-slate-500">Rolling balance</span>
  </div>
  <div class="overflow-x-auto">
    <table class="min-w-full text-left text-sm">
      <thead class="text-xs uppercase tracking-wide text-slate-400">
        <tr>
          <th class="pb-2 pr-4 font-medium">Month</th>
          <th class="pb-2 pr-4 font-medium text-right">Projected total</th>
          <th class="pb-2 pr-2 font-medium text-right">Running balance</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-800/60 text-slate-200">
        {#if schedule.length === 0}
          <tr>
            <td class="py-3 text-sm text-slate-400" colspan="3">No forecast data yet.</td>
          </tr>
        {:else}
          {#each schedule as row}
            <tr class="transition hover:bg-slate-900/60">
              <td class="py-3 pr-4 font-medium">{row.monthLabel}</td>
              <td class="py-3 pr-4 text-right font-mono">
                {row.total.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}
              </td>
              <td class="py-3 pr-2 text-right font-mono">
                {row.runningTotal.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}
              </td>
            </tr>
          {/each}
        {/if}
      </tbody>
    </table>
  </div>
</div>
