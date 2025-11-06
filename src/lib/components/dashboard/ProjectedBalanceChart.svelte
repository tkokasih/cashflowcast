<script lang="ts">
  import { browser } from '$app/environment';
  import { LineChart, type ChartTabularData, type LineChartOptions } from '@carbon/charts-svelte';
  import { ScaleTypes } from '@carbon/charts';
  import { onDestroy } from 'svelte';

  import { formatCurrency, type ForecastRow, type ForecastSummary } from '$lib/cashflow';

  const baseChartWidth = 420;
  const previewPointSpacing = 72;
  const fullscreenPointSpacing = 80;
  const previewChartHeight = 220;
  const fullscreenChartHeight = 360;
  const previewMonths = 6;
  const fullscreenMonths = 24;

  export let forecastRows: ForecastRow[] = [];
  export let summary: ForecastSummary;
  export let currency: string;

  let isExpanded = false;
  let previousBodyOverflow: string | null = null;

  const createChartRows = (rows: ForecastRow[]): ChartTabularData =>
    rows.length
      ? [
          { group: 'Balance', period: 'Opening', value: summary.openingBalance },
          ...rows.map((row) => ({
            group: 'Balance',
            period: row.label,
            value: row.balance
          }))
        ]
      : [];

  $: chartRows = createChartRows(forecastRows);
  $: previewRows = chartRows.slice(0, Math.min(previewMonths + 1, chartRows.length));
  $: fullscreenRows = chartRows.slice(0, Math.min(fullscreenMonths + 1, chartRows.length));

  const computeWidth = (length: number, spacing: number) =>
    length > 1 ? baseChartWidth + (length - 1) * spacing : baseChartWidth;

  $: previewWidth = computeWidth(previewRows.length, previewPointSpacing);
  $: fullscreenWidth = computeWidth(fullscreenRows.length, fullscreenPointSpacing);

  const formatCompactCurrency = (value: number, currencyCode: string) =>
    new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currencyCode,
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(value);

  const shortenLabel = (label: string) => {
    if (!label) return label;
    if (label === 'Opening') return 'Open';
    const parts = label.split(' ');
    if (parts.length === 1) {
      return parts[0].slice(0, 3);
    }
    const [month, ...rest] = parts;
    const year = rest.pop();
    const monthShort = month.slice(0, 3);
    if (!year) {
      return monthShort;
    }
    const yearShort = year.length > 2 ? `'${year.slice(-2)}` : year;
    return `${monthShort} ${yearShort}`;
  };

  const baseOptions = (
    height: number,
    labelFormatter: (value: string) => string,
    valueFormatter: (value: number) => string,
    zoomEnabled: boolean
  ) =>
    ({
      theme: 'g100',
      height: `${height}px`,
      legend: { enabled: false },
      grid: {
        y: { enabled: true },
        x: { enabled: true }
      },
      axes: {
        bottom: {
          mapsTo: 'period',
          scaleType: ScaleTypes.LABELS,
          ticks: {
            formatter: (tick: number | Date) => labelFormatter(String(tick))
          }
        },
        left: {
          mapsTo: 'value',
          scaleType: ScaleTypes.LINEAR,
          ticks: {
            formatter: (tick: number | Date) => valueFormatter(Number(tick))
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
        enabled: zoomEnabled
      }
    }) satisfies LineChartOptions;

  $: previewOptions = baseOptions(
    previewChartHeight,
    shortenLabel,
    (value) => formatCompactCurrency(value, currency),
    false
  );
  $: fullscreenOptions = baseOptions(
    fullscreenChartHeight,
    (label) => label,
    (value) => formatCurrency(value, currency),
    true
  );

  const lockBodyScroll = () => {
    if (!browser || previousBodyOverflow !== null) return;
    previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  };

  const unlockBodyScroll = () => {
    if (!browser || previousBodyOverflow === null) return;
    document.body.style.overflow = previousBodyOverflow;
    previousBodyOverflow = null;
  };

  $: if (isExpanded) {
    lockBodyScroll();
  } else {
    unlockBodyScroll();
  }

  onDestroy(() => {
    unlockBodyScroll();
  });

  const handleExpand = () => {
    if (!chartRows.length) return;
    isExpanded = true;
  };

  const handleCollapse = () => {
    isExpanded = false;
  };
</script>

<div class="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl shadow-slate-900/40">
  <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
    <div>
      <h2 class="text-lg font-semibold text-white">Projected balance</h2>
      <p class="text-sm text-slate-400">
        A simple line chart summarises the cumulative cashflow by month.
      </p>
    </div>
    <button
      type="button"
      class="inline-flex items-center gap-2 self-start rounded-full border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-200 transition hover:border-sky-500 hover:text-sky-300"
      on:click={handleExpand}
      aria-label="Expand projected balance chart"
      disabled={!chartRows.length}
    >
      Expand
      <span aria-hidden="true">⤢</span>
    </button>
  </div>

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
    {#if previewRows.length > 0}
      <div class="flex flex-col gap-4">
        <button
          type="button"
          class="group overflow-hidden rounded-xl border border-transparent transition hover:border-sky-500/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
          style="touch-action: manipulation;"
          on:click={handleExpand}
          aria-label="Expand projected balance chart"
        >
          <div class="pointer-events-none preview-chart">
            <div
              class="w-full"
              style={`height: ${previewChartHeight}px; width: ${previewWidth}px; max-width: 100%;`}
            >
              <LineChart
                data={previewRows}
                options={previewOptions}
                aria-label="Projected balance preview chart"
              />
            </div>
          </div>
        </button>
        <p class="text-center text-xs uppercase tracking-[0.3em] text-slate-500">
          Showing {Math.min(previewMonths, Math.max(previewRows.length - 1, 0))} months preview
        </p>
      </div>
    {:else}
      <p class="text-sm text-slate-500">Add entries to see the projection.</p>
    {/if}
  </div>
</div>

{#if isExpanded && fullscreenRows.length > 0}
  <div class="fixed inset-0 z-50 flex flex-col bg-slate-950/95 backdrop-blur">
    <div class="flex items-center justify-between border-b border-slate-800/70 p-4 sm:p-6">
      <div>
        <h2 class="text-base font-semibold text-white sm:text-lg">Projected balance</h2>
        <p class="text-xs uppercase tracking-[0.35em] text-slate-500">
          Interactive view · Scroll horizontally or pinch to zoom
        </p>
      </div>
      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-200 transition hover:border-sky-500 hover:text-sky-300"
        on:click={handleCollapse}
        aria-label="Collapse projected balance chart"
      >
        Close
        <span aria-hidden="true">⤡</span>
      </button>
    </div>
    <div class="flex-1 overflow-hidden p-4 sm:p-6">
      <div
        class="h-full overflow-x-auto overflow-y-hidden rounded-3xl border border-slate-800/70 bg-slate-950/80 p-4"
      >
        <div
          class="h-full min-h-[320px]"
          style={`min-width: ${fullscreenWidth}px; touch-action: pan-x pinch-zoom;`}
        >
          <LineChart
            data={fullscreenRows}
            options={fullscreenOptions}
            aria-label="Projected balance interactive chart"
          />
        </div>
      </div>
      <p class="mt-4 text-center text-xs uppercase tracking-[0.3em] text-slate-500">
        Displaying up to {Math.min(fullscreenMonths, Math.max(fullscreenRows.length - 1, 0))} months
        · Use mouse wheel or pinch to zoom
      </p>
    </div>
  </div>
{/if}

<style>
  .preview-chart :global(.cds--axis .tick text) {
    font-size: 0.625rem;
  }

  .preview-chart :global(.cds--axis .tick text tspan) {
    font-size: inherit;
  }
</style>
