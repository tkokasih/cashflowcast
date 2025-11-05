<script lang="ts">
  import type { ForecastRow, ForecastSummary } from '$lib/cashflow';
  import { formatCurrency } from '$lib/cashflow';

  export let forecastRows: ForecastRow[] = [];
  export let summary: ForecastSummary;
  export let currency: string;

  const baseChartWidth = 420;
  const chartHeight = 240;
  const margins = {
    top: 16,
    right: 32,
    bottom: 48,
    left: 72
  };
  const baseInnerWidth = baseChartWidth - margins.left - margins.right;
  const innerHeight = chartHeight - margins.top - margins.bottom;
  const yAxisX = margins.left;
  const desiredXTicks = 6;
  const desiredYTicks = 5;
  const pointSpacing = 72;
  const minZoom = 1;
  const maxZoom = 3;
  const zoomStep = 0.25;
  let zoom = 1;

  const axisColor = 'rgb(71 85 105)';
  const gridColor = 'rgba(148, 163, 184, 0.12)';

  const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

  const handleZoomInput = (event: Event) => {
    const { value } = event.currentTarget as HTMLInputElement;
    zoom = clamp(Number.parseFloat(value), minZoom, maxZoom);
  };

  const adjustZoom = (delta: number) => {
    zoom = clamp(Number.parseFloat((zoom + delta).toFixed(2)), minZoom, maxZoom);
  };

  const niceStep = (min: number, max: number, tickCount: number) => {
    const range = max - min;

    if (!Number.isFinite(range) || tickCount <= 1) {
      return {
        min,
        max,
        step: range === 0 ? 1 : range
      };
    }

    if (Math.abs(range) < Number.EPSILON) {
      const offset = Math.max(Math.abs(max) * 0.25, 1);
      const niceMin = min - offset;
      const niceMax = max + offset;
      const step = (niceMax - niceMin) / (tickCount - 1);

      return {
        min: niceMin,
        max: niceMax,
        step
      };
    }

    const roughStep = range / (tickCount - 1);
    const magnitude = Math.pow(10, Math.floor(Math.log10(Math.abs(roughStep))));
    const normalized = roughStep / magnitude;

    const niceNormalized = normalized < 1.5 ? 1 : normalized < 3 ? 2 : normalized < 7 ? 5 : 10;
    const step = niceNormalized * magnitude;
    const niceMin = Math.floor(min / step) * step;
    const niceMax = Math.ceil(max / step) * step;

    return {
      min: niceMin,
      max: niceMax,
      step
    };
  };

  $: chartPoints = forecastRows.map((row, index) => ({ index, balance: row.balance }));
  $: targetInnerWidth = Math.max(
    baseInnerWidth,
    chartPoints.length > 1 ? (chartPoints.length - 1) * pointSpacing : baseInnerWidth
  );
  $: innerWidth = targetInnerWidth * zoom;
  $: chartWidth = margins.left + innerWidth + margins.right;
  $: xAxisY = chartHeight - margins.bottom;
  $: balances = chartPoints.map((point) => point.balance);
  $: minBalance = chartPoints.length
    ? Math.min(summary.openingBalance, ...balances)
    : summary.openingBalance;
  $: maxBalance = chartPoints.length
    ? Math.max(summary.openingBalance, ...balances)
    : summary.openingBalance;

  $: yScaleBounds = niceStep(minBalance, maxBalance, desiredYTicks);
  $: scaledMinBalance = yScaleBounds.min;
  $: scaledMaxBalance = yScaleBounds.max;
  $: yTickStep = yScaleBounds.step;
  $: balanceRange = Math.max(Number.EPSILON, Math.abs(scaledMaxBalance - scaledMinBalance));

  const getX = (index: number) => {
    if (chartPoints.length <= 1) {
      return yAxisX + Math.min(innerWidth, baseInnerWidth) / 2;
    }

    return yAxisX + (index / (chartPoints.length - 1)) * innerWidth;
  };

  const getY = (balance: number) =>
    margins.top + ((scaledMaxBalance - balance) / balanceRange) * innerHeight;

  $: linePath = chartPoints
    .map((point, index) => {
      const x = getX(point.index);
      const y = getY(point.balance);
      return `${index === 0 ? 'M' : 'L'}${x},${y}`;
    })
    .join(' ');

  $: areaPath = chartPoints.length
    ? `${linePath} L${getX(chartPoints[chartPoints.length - 1].index)},${xAxisY} L${getX(
        chartPoints[0].index
      )},${xAxisY} Z`
    : '';

  $: xTicks = chartPoints.length
    ? (() => {
        const ticks = new Set<number>();
        const count = Math.min(desiredXTicks, chartPoints.length);

        if (chartPoints.length <= count) {
          chartPoints.forEach((point) => ticks.add(point.index));
        } else {
          const step = (chartPoints.length - 1) / (count - 1);
          for (let i = 0; i < count; i += 1) {
            const index = Math.round(i * step);
            ticks.add(clamp(index, 0, chartPoints.length - 1));
          }
        }

        return Array.from(ticks)
          .sort((a, b) => a - b)
          .map((index) => ({
            index,
            label: forecastRows[index]?.label ?? `Period ${index + 1}`,
            x: getX(index)
          }));
      })()
    : [];

  $: yTicks = chartPoints.length
    ? (() => {
        const ticks: { value: number; y: number }[] = [];
        if (!Number.isFinite(yTickStep) || yTickStep <= 0) {
          return ticks;
        }

        for (
          let value = scaledMinBalance;
          value <= scaledMaxBalance + yTickStep / 2;
          value += yTickStep
        ) {
          ticks.push({
            value,
            y: getY(value)
          });
        }

        return ticks;
      })()
    : [];
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
        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-2 text-xs text-slate-400">
            <div class="flex items-center justify-between gap-3">
              <span class="uppercase tracking-[0.3em]">Zoom</span>
              <div class="flex items-center gap-2 text-slate-300">
                <button
                  type="button"
                  class="flex h-7 w-7 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-base font-semibold text-slate-200 transition hover:border-slate-500 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 disabled:opacity-40"
                  on:click={() => adjustZoom(-zoomStep)}
                  aria-label="Zoom out"
                  disabled={zoom <= minZoom}
                >
                  −
                </button>
                <span class="w-12 text-right font-semibold text-slate-200 tabular-nums"
                  >{zoom.toFixed(2)}×</span
                >
                <button
                  type="button"
                  class="flex h-7 w-7 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-base font-semibold text-slate-200 transition hover:border-slate-500 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 disabled:opacity-40"
                  on:click={() => adjustZoom(zoomStep)}
                  aria-label="Zoom in"
                  disabled={zoom >= maxZoom}
                >
                  +
                </button>
              </div>
            </div>
            <input
              id="projection-zoom"
              type="range"
              min={minZoom}
              max={maxZoom}
              step={zoomStep}
              value={zoom}
              on:input={handleZoomInput}
              aria-label="Adjust projection chart zoom"
              class="h-1 w-full cursor-pointer accent-sky-400"
            />
          </div>
          <div class="overflow-x-auto">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              class="h-48"
              style={`width: max(${chartWidth}px, 100%);`}
            >
              <defs>
                <linearGradient id="balance-fill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stop-color="rgb(56 189 248)" stop-opacity="0.45" />
                  <stop offset="100%" stop-color="rgb(15 23 42)" stop-opacity="0" />
                </linearGradient>
              </defs>
              <g stroke={gridColor} stroke-width="1">
                {#each yTicks as tick}
                  <line
                    x1={yAxisX}
                    x2={yAxisX + innerWidth}
                    y1={tick.y}
                    y2={tick.y}
                    stroke-dasharray="2 4"
                  />
                {/each}
              </g>
              <path d={areaPath} fill="url(#balance-fill)" stroke="none" />
              <path
                d={linePath}
                fill="none"
                stroke="rgb(56 189 248)"
                stroke-width="2.5"
                stroke-linecap="round"
              />
              <g stroke={axisColor} stroke-width="1.2">
                <line x1={yAxisX} x2={yAxisX} y1={margins.top} y2={xAxisY} />
                <line x1={yAxisX} x2={yAxisX + innerWidth} y1={xAxisY} y2={xAxisY} />
              </g>
              <g>
                {#each yTicks as tick}
                  <text
                    x={yAxisX - 10}
                    y={tick.y}
                    fill="rgb(148 163 184)"
                    font-size="11"
                    text-anchor="end"
                    dominant-baseline="middle"
                  >
                    {formatCurrency(tick.value, currency)}
                  </text>
                {/each}
              </g>
              <g>
                {#each xTicks as tick}
                  <g>
                    <line
                      x1={tick.x}
                      x2={tick.x}
                      y1={xAxisY}
                      y2={xAxisY + 8}
                      stroke={axisColor}
                      stroke-width="1"
                    />
                    <text
                      x={tick.x}
                      y={xAxisY + 22}
                      fill="rgb(148 163 184)"
                      font-size="11"
                      text-anchor="middle"
                    >
                      {tick.label}
                    </text>
                  </g>
                {/each}
              </g>
            </svg>
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
