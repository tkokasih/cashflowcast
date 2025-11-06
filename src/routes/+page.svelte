<script lang="ts">
  import DashboardTab from '$lib/components/dashboard/DashboardTab.svelte';
  import EntriesTab from '$lib/components/entries/EntriesTab.svelte';
  import BottomTabs from '$lib/components/navigation/BottomTabs.svelte';
  import AppFooter from '$lib/components/navigation/AppFooter.svelte';
  import ProjectHeader from '$lib/components/project/ProjectHeader.svelte';
  import {
    createBlankFormState,
    entryFromForm,
    formStateFromEntry,
    generateForecast,
    sampleProject,
    summariseForecast,
    type CashflowEntry,
    type EntryFormState,
    type Project
  } from '$lib/cashflow';

  type Tab = 'dashboard' | 'entries';

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', iconPath: 'M3 17l6-6 4 4 8-8M21 21H3V3m0 0h18' },
    {
      id: 'entries',
      label: 'Entries',
      iconPath: 'M9 7h11M9 12h11M9 17h11M4 7h.01M4 12h.01M4 17h.01'
    }
  ];

  const today = new Date().toISOString().slice(0, 10);

  function cloneProject(value: Project): Project {
    return {
      ...value,
      entries: value.entries.map((entry) => ({
        ...entry,
        recurrence: { ...entry.recurrence }
      }))
    };
  }

  let activeTab: Tab = 'dashboard';
  let project: Project = cloneProject(sampleProject);
  let formState: EntryFormState = createBlankFormState(today);

  $: forecastRows = generateForecast(project);
  $: summary = summariseForecast(forecastRows, project.openingBalance);

  function resetForm() {
    formState = createBlankFormState(today);
  }

  function upsertEntry(entry: CashflowEntry) {
    const exists = project.entries.some((current) => current.id === entry.id);
    const entries = exists
      ? project.entries.map((current) => (current.id === entry.id ? entry : current))
      : [...project.entries, entry];
    project = { ...project, entries };
    resetForm();
  }

  function handleEntrySubmit() {
    const entry = entryFromForm(formState, project);
    upsertEntry(entry);
  }

  function handleEntryEdit(event: CustomEvent<{ entry: CashflowEntry }>) {
    formState = formStateFromEntry(event.detail.entry);
    activeTab = 'entries';
  }

  function handleEntryRemove(event: CustomEvent<{ id: string }>) {
    const { id } = event.detail;
    project = { ...project, entries: project.entries.filter((entry) => entry.id !== id) };
    if (formState.id === id) {
      resetForm();
    }
  }

  function handleTabSelect(event: CustomEvent<{ id: string }>) {
    activeTab = event.detail.id as Tab;
  }
</script>

<svelte:head>
  <title>{project.name} · CashflowCast</title>
  <meta
    name="description"
    content="Mobile-first cashflow projection dashboard with editable recurring entries."
  />
</svelte:head>

<div class="flex min-h-screen flex-col bg-slate-950 text-slate-100">
  <ProjectHeader name={project.name} description={project.description} />

  <main class="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-5 pb-28 pt-6">
    {#if activeTab === 'dashboard'}
      <DashboardTab {forecastRows} {summary} currency={project.currency} />
    {:else}
      <EntriesTab
        bind:formState
        entries={project.entries}
        currency={project.currency}
        on:submit={handleEntrySubmit}
        on:reset={resetForm}
        on:edit={handleEntryEdit}
        on:remove={handleEntryRemove}
      />
    {/if}

    <AppFooter className="mt-auto border-t border-slate-800/70 pt-4" />
  </main>

  <BottomTabs items={navigation} activeId={activeTab} on:select={handleTabSelect} />
</div>
