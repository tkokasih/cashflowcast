<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { TabId } from '$lib/types/navigation';

  const items: { id: TabId; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'entries', label: 'Cashflow', icon: '🧾' }
  ];

  export let active: TabId = 'dashboard';

  const dispatch = createEventDispatcher<{ change: TabId }>();

  function selectTab(id: TabId) {
    if (id === active) return;
    dispatch('change', id);
  }
</script>

<nav class="fixed bottom-0 left-0 right-0 z-20 mx-auto max-w-md pb-4">
  <div
    class="mx-auto mb-4 grid h-16 grid-cols-2 gap-2 rounded-3xl border border-slate-800/80 bg-slate-900/90 px-2 py-2 text-slate-200 shadow-lg shadow-emerald-500/10 backdrop-blur"
  >
    {#each items as item}
      <button
        type="button"
        class={`flex flex-col items-center justify-center rounded-2xl text-xs font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 sm:text-sm ${
          active === item.id
            ? 'bg-gradient-to-br from-emerald-500/10 to-emerald-400/10 text-emerald-200 font-semibold'
            : ''
        }`}
        on:click={() => selectTab(item.id)}
        aria-current={active === item.id ? 'page' : undefined}
      >
        <span class="text-base sm:text-lg">{item.icon}</span>
        <span>{item.label}</span>
      </button>
    {/each}
  </div>
</nav>
