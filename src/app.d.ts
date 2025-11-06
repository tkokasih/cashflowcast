// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import 'svelte';
import 'vite/client';

declare global {
  namespace App {
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }

  interface ImportMetaEnv {
    readonly VITE_GITHUB_BRANCH?: string;
    readonly VITE_GITHUB_REPOSITORY?: string;
    readonly VITE_BUILD_SHA?: string;
    readonly VITE_BUILD_BRANCH?: string;
    readonly VITE_BUILD_TIMESTAMP?: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

export {};
