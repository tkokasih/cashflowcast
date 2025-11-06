<script lang="ts">
  import type { ForecastRow, ForecastSummary } from '$lib/cashflow';
  import { formatCurrency } from '$lib/cashflow';
  import ProjectedBalanceChart from './ProjectedBalanceChart.svelte';

  export let forecastRows: ForecastRow[] = [];
  export let summary: ForecastSummary;
  export let currency: string;
</script>

<section class="space-y-6">
  <ProjectedBalanceChart {forecastRows} {summary} {currency} />

  <div class="space-y-3">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold text-white">Cashflow schedule</h2>
      <span class="text-xs uppercase tracking-[0.25em] text-slate-500"
        >{forecastRows.length} periods</span
      >
    </div>
    <div class="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60">
      <table class="min-w-full divide-y divide-slate-800 text-left text-sm">
        <thead class="bg-slate-900/80 text-xs uppercase tracking-[0.25em] text-slate-400">
          <tr>
            <th scope="col" class="px-4 py-3">Month</th>
            <th scope="col" class="px-4 py-3">Income</th>
            <th scope="col" class="px-4 py-3">Expenses</th>
            <th scope="col" class="px-4 py-3">Net</th>
            <th scope="col" class="px-4 py-3">Balance</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-800/70">
          {#each forecastRows as row}
            <tr class="hover:bg-slate-900/70">
              <td class="px-4 py-3 font-medium text-slate-200">{row.label}</td>
              <td class="px-4 py-3 text-emerald-300">{formatCurrency(row.incomes, currency)}</td>
              <td class="px-4 py-3 text-rose-300">{formatCurrency(row.expenses, currency)}</td>
              <td class="px-4 py-3 text-sky-300">{formatCurrency(row.net, currency)}</td>
              <td class="px-4 py-3 font-semibold text-white"
                >{formatCurrency(row.balance, currency)}</td
              >
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</section>
