// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
/// <reference types="svelte" />
/// <reference types="vite/client" />

declare namespace App {
  // interface Locals {}
  // interface PageData {}
  // interface PageState {}
  // interface Platform {}
}

declare module '@carbon/charts-svelte' {
  import type { SvelteComponentTyped } from 'svelte';

  export type ChartTabularData = Array<Record<string, unknown>>;
  export type LineChartOptions = Record<string, unknown>;

  export class LineChart extends SvelteComponentTyped<
    { data: ChartTabularData; options: LineChartOptions } & Record<string, unknown>
  > {}
}

declare module '@carbon/charts' {
  export const ScaleTypes: Record<string, string>;
}
