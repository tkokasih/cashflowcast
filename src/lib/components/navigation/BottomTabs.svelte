<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  type TabId = string;

  export let items: { id: TabId; label: string; iconPath: string }[] = [];
  export let activeId: TabId;

  const dispatch = createEventDispatcher<{ select: { id: TabId } }>();
</script>

<nav
  class="fixed bottom-0 left-0 right-0 border-t border-slate-800/80 bg-slate-900/80 backdrop-blur"
>
  <div class="mx-auto flex max-w-4xl items-center justify-around px-6 py-3">
    {#each items as item}
      <button
        type="button"
        class={`flex flex-1 flex-col items-center gap-1 rounded-2xl px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] transition-colors ${
          activeId === item.id
            ? 'bg-slate-800/80 text-emerald-300'
            : 'text-slate-400 hover:text-emerald-200'
        }`}
        on:click={() => dispatch('select', { id: item.id })}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          class="h-5 w-5"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d={item.iconPath} />
        </svg>
        <span>{item.label}</span>
      </button>
    {/each}
  </div>
</nav>
