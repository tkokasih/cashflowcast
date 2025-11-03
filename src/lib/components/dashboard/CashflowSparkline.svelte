<script lang="ts">
  import type { MonthlyForecastPoint } from '$lib/types/cashflow';

  export let points: MonthlyForecastPoint[] = [];

  const width = 320;
  const height = 160;

  $: totals = points.map((point) => point.total);
  $: maxValue = totals.length ? Math.max(...totals, 0) : 0;
  $: minValue = totals.length ? Math.min(...totals, 0) : 0;
  $: range = maxValue - minValue || 1;

  function getX(index: number): number {
    if (points.length === 1) return width / 2;
    return (index / (points.length - 1)) * width;
  }

  function getY(value: number): number {
    return height - ((value - minValue) / range) * height;
  }

  $: pathData = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${getX(index)} ${getY(point.total)}`)
    .join(' ');

  $: areaPath = points.length
    ? `${pathData} L ${getX(points.length - 1)} ${height} L ${getX(0)} ${height} Z`
    : '';
</script>

<div
  class="rounded-3xl border border-slate-800/70 bg-slate-900/60 p-4 shadow-inner shadow-emerald-500/5"
>
  <div class="mb-3 flex items-center justify-between">
    <h2 class="text-left text-lg font-semibold text-emerald-300">Projected cashflow</h2>
    <span class="text-xs uppercase tracking-widest text-slate-400">Next 12 months</span>
  </div>
  {#if points.length === 0}
    <div class="flex h-32 flex-col items-center justify-center text-sm text-slate-400">
      <span>Start by adding a cashflow entry to preview your forecast.</span>
    </div>
  {:else}
    <svg
      class="h-40 w-full"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      role="img"
      aria-label="Monthly cashflow projection"
    >
      <defs>
        <linearGradient id="sparkline-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="rgb(16 185 129)" stop-opacity="0.35" />
          <stop offset="100%" stop-color="rgb(59 130 246)" stop-opacity="0.1" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#sparkline-fill)" stroke="none" />
      <path
        d={pathData}
        fill="none"
        stroke="rgb(110 231 183)"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
    <div class="mt-4 grid grid-cols-2 gap-3 text-left text-sm">
      <div>
        <span class="block text-xs uppercase tracking-wide text-slate-400">Best month</span>
        <span class="text-base font-semibold text-emerald-200">
          {Math.max(...totals).toLocaleString(undefined, { style: 'currency', currency: 'USD' })}
        </span>
      </div>
      <div>
        <span class="block text-xs uppercase tracking-wide text-slate-400">Toughest month</span>
        <span class="text-base font-semibold text-rose-200">
          {Math.min(...totals).toLocaleString(undefined, { style: 'currency', currency: 'USD' })}
        </span>
      </div>
    </div>
  {/if}
</div>
