<script lang="ts">
  import type { ForecastRow, ForecastSummary } from '$lib/cashflow';
  import { formatCurrency } from '$lib/cashflow';
  import { LineChart, type ChartTabularData, type LineChartOptions } from '@carbon/charts-svelte';
  import { ScaleTypes } from '@carbon/charts';

  export let forecastRows: ForecastRow[] = [];
  export let summary: ForecastSummary;
  export let currency: string;

  const baseChartWidth = 420;
  const chartHeight = 240;
  const pointSpacing = 72;
  let chartRows: ChartTabularData = [];
  $: chartRows = forecastRows.length
    ? [
        { group: 'Balance', period: 'Opening', value: summary.openingBalance },
        ...forecastRows.map((row) => ({
          group: 'Balance',
          period: row.label,
          value: row.balance
        }))
      ]
    : [];

  $: targetWidth =
    chartRows.length > 1 ? baseChartWidth + (chartRows.length - 1) * pointSpacing : baseChartWidth;
  $: chartWidth = targetWidth;

  $: chartOptions = {
    theme: 'g100',
    height: `${chartHeight}px`,
    legend: { enabled: false },
    grid: {
      y: { enabled: true },
      x: { enabled: true }
    },
    axes: {
      bottom: {
        mapsTo: 'period',
        scaleType: ScaleTypes.LABELS
      },
      left: {
        mapsTo: 'value',
        scaleType: ScaleTypes.LINEAR,
        ticks: {
          formatter: (tick: number | Date) => formatCurrency(Number(tick), currency)
        }
      }
    },
    points: {
      radius: 3,
      enabled: true
    },
    curve: 'curveMonotoneX',
    tooltip: {
      valueFormatter: (value: unknown) => formatCurrency(Number(value), currency)
    },
    data: {
      groupMapsTo: 'group'
    },
    getIsFilled: () => true,
    getFillColor: () => 'rgba(56, 189, 248, 0.35)',
    getStrokeColor: () => '#38bdf8',
    color: {
      scale: {
        Balance: '#38bdf8'
      }
    },
    canvasZoom: {
      enabled: false
    }
  } satisfies LineChartOptions;
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
      {#if chartRows.length > 0}
        <div class="flex flex-col gap-4">
          <div class="overflow-x-auto overflow-y-hidden" style="touch-action: pan-x;">
            <div class="h-48" style={`width: ${chartWidth}px;`}>
              <LineChart
                data={chartRows}
                options={chartOptions}
                aria-label="Projected balance line chart"
              />
            </div>
          </div>
        </div>
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
