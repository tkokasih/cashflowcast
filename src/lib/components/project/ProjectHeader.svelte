<script lang="ts">
  import { formatCurrency } from '$lib/cashflow';

  export let name: string;
  export let description: string;
  export let openingBalance: number;
  export let currency: string;
  export let horizonMonths: number;
  export let lastUpdated: string;
  export let githubPagesUrl: string | undefined = undefined;
</script>

<header class="w-full border-b border-slate-800/80 bg-slate-900/60 backdrop-blur">
  <div class="mx-auto flex w-full max-w-4xl flex-col gap-3 px-5 py-6">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-xs uppercase tracking-[0.35em] text-emerald-300/80">Project</p>
        <h1 class="text-2xl font-semibold text-white sm:text-3xl">{name}</h1>
      </div>
      <div class="text-right">
        <p class="text-xs uppercase tracking-[0.25em] text-slate-400">Opening balance</p>
        <p class="text-lg font-semibold text-emerald-400">
          {formatCurrency(openingBalance, currency)}
        </p>
      </div>
    </div>
    <p class="text-sm leading-relaxed text-slate-300">{description}</p>
    {#if githubPagesUrl}
      <a
        class="inline-flex w-fit items-center gap-2 rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-slate-300 hover:border-emerald-400/70 hover:text-emerald-200"
        href={githubPagesUrl}
        rel="noopener noreferrer"
        target="_blank"
      >
        View demo
        <svg
          viewBox="0 0 24 24"
          class="h-4 w-4"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M7 17 17 7M10 7h7v7" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M7 7h3M7 7v3" />
        </svg>
      </a>
    {/if}
    <div class="flex items-center gap-3 text-xs text-slate-400">
      <span
        class="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 font-medium uppercase tracking-[0.2em]"
      >
        Forecast {horizonMonths} months
      </span>
      <span class="hidden items-center gap-1 sm:flex">
        <span class="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
        Last updated {new Date(lastUpdated).toLocaleDateString()}
      </span>
    </div>
  </div>
</header>
