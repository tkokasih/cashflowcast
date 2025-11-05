import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

const base = process.env.BASE_PATH ?? '';

export default defineConfig({
  plugins: [sveltekit()],
  base,
  ssr: {
    noExternal: process.env.NODE_ENV === 'production' ? ['@carbon/charts'] : []
  }
});
