<script lang="ts">
  import { onMount } from 'svelte';

  export let name: string;
  export let description: string;

  let isCondensed = false;

  function updateCondensedState() {
    isCondensed = typeof window !== 'undefined' && window.scrollY > 48;
  }

  onMount(() => {
    updateCondensedState();

    const handleScroll = () => {
      updateCondensedState();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });
</script>

<header
  class="sticky top-0 z-30 w-full border-b border-slate-800/80 bg-slate-900/60 backdrop-blur transition-colors duration-200"
>
  <div
    class={`mx-auto w-full max-w-4xl px-5 transition-[padding] duration-200 ${isCondensed ? 'py-3' : 'py-6'}`}
  >
    <div class="flex flex-col gap-2">
      {#if !isCondensed}
        <p class="text-xs uppercase tracking-[0.35em] text-emerald-300/80">Project</p>
      {/if}
      <h1
        class={`font-semibold text-white transition-[font-size] duration-200 ${
          isCondensed ? 'text-lg sm:text-xl' : 'text-2xl sm:text-3xl'
        }`}
      >
        {name}
      </h1>
      {#if !isCondensed}
        <p class="text-sm leading-relaxed text-slate-300">{description}</p>
      {/if}
    </div>
  </div>
</header>
