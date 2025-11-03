<script lang="ts">
  import DashboardView from '$lib/components/dashboard/DashboardView.svelte';
  import CashflowEntriesView from '$lib/components/entries/CashflowEntriesView.svelte';
  import BottomNav from '$lib/components/navigation/BottomNav.svelte';
  import { cashflowEntries } from '$lib/stores/cashflow';
  import type {
    CashflowEntry,
    CashflowScheduleRow,
    MonthlyForecastPoint
  } from '$lib/types/cashflow';
  import type { TabId } from '$lib/types/navigation';
  import { generateMonthlyForecast } from '$lib/utils/cashflow';

  let activeTab: TabId = 'dashboard';

  let entries: CashflowEntry[] = [];
  $: entries = $cashflowEntries;

  let points: MonthlyForecastPoint[] = [];
  let schedule: CashflowScheduleRow[] = [];
  $: ({ points, schedule } = generateMonthlyForecast(entries));

  function handleTabChange(event: CustomEvent<TabId>) {
    activeTab = event.detail;
  }
</script>

<svelte:head>
  <title>CashflowCast · Forecast your money with confidence</title>
</svelte:head>

<div
  class="relative min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100"
>
  <div class="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
    <div
      class="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl"
    ></div>
    <div class="absolute right-10 top-24 h-48 w-48 rounded-full bg-sky-500/10 blur-3xl"></div>
  </div>

  <main class="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 pb-32 pt-10 sm:px-6">
    <header class="mb-6 space-y-2 text-center sm:mb-8">
      <p class="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-300/80">
        CashflowCast
      </p>
      <h1 class="text-3xl font-bold sm:text-4xl">Model your cashflow anywhere</h1>
      <p class="text-sm text-slate-300">
        Add recurring income and expenses, then review your rolling forecast on the go.
      </p>
    </header>

    <section class="flex-1">
      {#if activeTab === 'dashboard'}
        <DashboardView {points} {schedule} />
      {:else}
        <CashflowEntriesView />
      {/if}
    </section>
  </main>

  <BottomNav active={activeTab} on:change={handleTabChange} />
</div>
