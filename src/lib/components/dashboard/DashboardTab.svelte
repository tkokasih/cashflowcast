<script lang="ts">
  import type { ForecastRow, ForecastSummary } from '$lib/cashflow';
  import { formatCurrency } from '$lib/cashflow';
  import { LineChart, type ChartTabularData, type LineChartOptions } from '@carbon/charts-svelte';
  import { ScaleTypes, type LineChart as CarbonLineChart } from '@carbon/charts';
  import { tick } from 'svelte';

  export let forecastRows: ForecastRow[] = [];
  export let summary: ForecastSummary;
  export let currency: string;

  const baseChartWidth = 420;
  const chartHeight = 240;
  const pointSpacing = 72;
  const minZoom = 1;
  const maxZoom = 3;
  let zoom = 1;

  const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

  let chartContainer: HTMLDivElement | null = null;
  let pinchStartDistance: number | null = null;
  let pinchStartZoom = zoom;
  let chartInstance: CarbonLineChart | undefined;

  const handleTouchStart = (event: TouchEvent) => {
    if (event.touches.length === 2) {
      const [first, second] = [event.touches[0], event.touches[1]];
      pinchStartDistance = Math.abs(first.clientX - second.clientX);
      pinchStartZoom = zoom;
    } else {
      pinchStartDistance = null;
      pinchStartZoom = zoom;
    }
  };

  const handleTouchMove = async (event: TouchEvent) => {
    if (!chartContainer || event.touches.length !== 2 || pinchStartDistance === null) {
      return;
    }

    const container = chartContainer;
    const [first, second] = [event.touches[0], event.touches[1]];
    const horizontalDistance = Math.abs(first.clientX - second.clientX);

    if (horizontalDistance <= 0) {
      return;
    }

    event.preventDefault();

    const scale = horizontalDistance / pinchStartDistance;
    const nextZoom = clamp(
      Number.parseFloat((pinchStartZoom * scale).toFixed(3)),
      minZoom,
      maxZoom
    );

    if (Math.abs(nextZoom - zoom) < 0.001) {
      return;
    }

    const rect = container.getBoundingClientRect();
    const viewportCenter = (first.clientX + second.clientX) / 2 - rect.left;
    const currentContentWidth = targetWidth * zoom;
    const contentOffset = container.scrollLeft + viewportCenter;
    const ratio = currentContentWidth > 0 ? contentOffset / currentContentWidth : 0;

    const nextContentWidth = targetWidth * nextZoom;
    const maxScroll = Math.max(nextContentWidth - container.clientWidth, 0);
    const desiredScrollLeft = ratio * nextContentWidth - viewportCenter;

    zoom = nextZoom;
    await tick();
    container.scrollLeft = clamp(desiredScrollLeft, 0, maxScroll);

    pinchStartDistance = horizontalDistance;
    pinchStartZoom = zoom;
  };

  const handleTouchEnd = (event: TouchEvent) => {
    if (event.touches.length < 2) {
      pinchStartDistance = null;
      pinchStartZoom = zoom;
    }
  };

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
  $: chartWidth = targetWidth * zoom;

  $: zoom = clamp(zoom, minZoom, maxZoom);

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
          <div
            class="overflow-x-auto"
            bind:this={chartContainer}
            on:touchstart={handleTouchStart}
            on:touchmove={handleTouchMove}
            on:touchend={handleTouchEnd}
            on:touchcancel={handleTouchEnd}
            style="touch-action: pan-y;"
          >
            <div class="h-48" style={`min-width: ${chartWidth}px;`}>
              <LineChart
                data={chartRows}
                options={chartOptions}
                bind:chart={chartInstance}
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
