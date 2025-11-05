<script lang="ts">
  import { buildInfo } from '$lib/buildInfo';
  export let className = '';

  const hasInfo = Boolean(buildInfo.sha || buildInfo.formattedTimestamp || buildInfo.showBranch);
</script>

{#if hasInfo}
  <footer class={`text-xs text-slate-500 ${className}`.trim()}>
    <p class="flex flex-wrap items-center gap-x-1 gap-y-1">
      <span>build</span>
      {#if buildInfo.sha}
        <code
          class="rounded bg-slate-800 px-1 py-px font-mono text-[0.7rem] uppercase tracking-wide"
        >
          {buildInfo.sha}
        </code>
      {/if}
      {#if buildInfo.formattedTimestamp}
        <span>on {buildInfo.formattedTimestamp}</span>
      {/if}
      {#if buildInfo.showBranch && buildInfo.branch}
        <span>
          from branch
          <code
            class="rounded bg-slate-800 px-1 py-px font-mono text-[0.7rem] uppercase tracking-wide"
          >
            {buildInfo.branch}
          </code>
        </span>
      {/if}
    </p>
  </footer>
{/if}
