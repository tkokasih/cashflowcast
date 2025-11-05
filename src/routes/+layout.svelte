<script lang="ts">
  import { base } from '$app/paths';
  import { onMount } from 'svelte';
  import '@carbon/charts/styles.css';
  import '../app.css';

  onMount(() => {
    if ('serviceWorker' in navigator) {
      const swPath = `${base}/service-worker.js`;
      navigator.serviceWorker.register(swPath).catch((error) => {
        console.error('Service worker registration failed', error);
      });
    }
  });
</script>

<svelte:head>
  <title>CashflowCast</title>
  <meta
    name="description"
    content="A progressive web app starter powered by SvelteKit and Tailwind CSS."
  />
  <link rel="icon" type="image/svg+xml" href={`${base}/favicon.svg`} />
  <link rel="mask-icon" href={`${base}/icons/icon-maskable.svg`} color="#0f172a" />
  <link rel="apple-touch-icon" sizes="any" type="image/svg+xml" href={`${base}/icons/icon.svg`} />
</svelte:head>

<slot />
