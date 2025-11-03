<script lang="ts">
  import CashflowScheduleTable from '$lib/components/dashboard/CashflowScheduleTable.svelte';
  import CashflowSparkline from '$lib/components/dashboard/CashflowSparkline.svelte';
  import type { CashflowScheduleRow, MonthlyForecastPoint } from '$lib/types/cashflow';

  export let points: MonthlyForecastPoint[] = [];
  export let schedule: CashflowScheduleRow[] = [];
</script>

<section class="pb-28 pt-6">
  <div class="space-y-6">
    <CashflowSparkline {points} />
    <CashflowScheduleTable {schedule} />
  </div>
</section>
