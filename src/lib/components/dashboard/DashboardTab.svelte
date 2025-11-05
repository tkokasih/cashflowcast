<script lang="ts">
  import type { ForecastRow, ForecastSummary } from '$lib/cashflow';
  import { formatCurrency } from '$lib/cashflow';

  export let forecastRows: ForecastRow[] = [];
  export let summary: ForecastSummary;
  export let currency: string;

  const chartWidth = 320;
  const chartHeight = 160;

  $: chartPoints = forecastRows.map((row, index) => ({ index, balance: row.balance }));
  $: balances = chartPoints.map((point) => point.balance);
  $: minBalance = chartPoints.length
    ? Math.min(summary.openingBalance, ...balances)
    : summary.openingBalance;
  $: maxBalance = chartPoints.length
    ? Math.max(summary.openingBalance, ...balances)
    : summary.openingBalance;
  $: balanceRange = Math.max(1, maxBalance - minBalance);

  $: linePath = chartPoints
    .map((point, index) => {
      const x =
        chartPoints.length > 1 ? (index / (chartPoints.length - 1)) * chartWidth : chartWidth / 2;
      const y = chartHeight - ((point.balance - minBalance) / balanceRange) * chartHeight;
      return `${index === 0 ? 'M' : 'L'}${x},${y}`;
    })
    .join(' ');

  $: areaPath = chartPoints.length
    ? `${linePath} L${chartWidth},${chartHeight} L0,${chartHeight} Z`
    : '';
</script>

<section class="space-y-6">
  <div
    class="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl shadow-slate-900/40"
  >
    <h2 class="text-lg font-semibold text-white">Projected balance</h2>
    <p class="text-sm text-slate-400">
      A simple line chart summarises the cumulative cashflow by month.
    </p>
    <div class="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex gap-6">
        <div>
          <p class="text-xs uppercase tracking-[0.3em] text-slate-400">Total income</p>
          <p class="text-lg font-semibold text-emerald-400">
            {formatCurrency(summary.totalIncome, currency)}
          </p>
        </div>
        <div>
          <p class="text-xs uppercase tracking-[0.3em] text-slate-400">Total expenses</p>
          <p class="text-lg font-semibold text-rose-400">
            {formatCurrency(summary.totalExpense, currency)}
          </p>
        </div>
      </div>
      <div class="text-right">
        <p class="text-xs uppercase tracking-[0.3em] text-slate-400">Ending balance</p>
        <p class="text-lg font-semibold text-sky-400">
          {formatCurrency(summary.endingBalance, currency)}
        </p>
      </div>
    </div>
    <div class="mt-6 rounded-2xl border border-slate-800/60 bg-slate-950/80 p-4">
      {#if chartPoints.length > 0}
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} class="h-48 w-full">
          <defs>
            <linearGradient id="balance-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stop-color="rgb(56 189 248)" stop-opacity="0.45" />
              <stop offset="100%" stop-color="rgb(15 23 42)" stop-opacity="0" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill="url(#balance-fill)" stroke="none" />
          <path
            d={linePath}
            fill="none"
            stroke="rgb(56 189 248)"
            stroke-width="2.5"
            stroke-linecap="round"
          />
        </svg>
      {:else}
        <p class="text-sm text-slate-500">Add entries to see the projection.</p>
      {/if}
    </div>
  </div>

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
