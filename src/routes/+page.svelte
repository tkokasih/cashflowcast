<section
  class="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-950 px-6 py-16 text-center text-slate-100"
>
  <div class="absolute inset-0 -z-10">
    <svg
      class="h-full w-full"
      viewBox="0 0 1440 960"
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id="cashflowcast-halo" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stop-color="#34d399" stop-opacity="0.35" />
          <stop offset="45%" stop-color="#22d3ee" stop-opacity="0.25" />
          <stop offset="100%" stop-color="#0f172a" stop-opacity="0" />
        </radialGradient>
        <linearGradient id="cashflowcast-wave" x1="0%" x2="100%" y1="0%" y2="0%">
          <stop offset="0%" stop-color="#1d4ed8" stop-opacity="0.75" />
          <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.45" />
        </linearGradient>
      </defs>
      <rect fill="url(#cashflowcast-halo)" height="960" width="1440" />
      <path
        d="M-80 640 Q 360 520 720 680 T 1520 620 V960 H-80 Z"
        fill="url(#cashflowcast-wave)"
        opacity="0.35"
      />
      <path d="M-40 720 Q 360 840 840 700 T 1520 760 V960 H-40 Z" fill="#0ea5e9" opacity="0.15" />
    </svg>
  </div>

  <div class="max-w-2xl space-y-8">
    <div
      class="inline-flex items-center space-x-3 rounded-full border border-slate-800/70 bg-slate-900/60 px-5 py-2 text-sm font-medium uppercase tracking-[0.4em] text-emerald-300/80"
    >
      <span>Progressive Web App</span>
    </div>
    <h1 class="text-4xl font-bold sm:text-5xl md:text-6xl">Welcome to CashflowCast</h1>
    <p class="text-lg leading-relaxed text-slate-300">
      Your hello world experience now ships with an expressive SVG backdrop. Tailor this canvas to
      introduce product updates, dashboards, or forecasts as your project grows.
    </p>
    <div class="flex flex-col items-center justify-center gap-4 sm:flex-row">
      <div
        class="flex items-center space-x-3 rounded-2xl border border-slate-800/60 bg-slate-900/70 px-6 py-4 shadow-lg shadow-emerald-500/10"
      >
        <span class="text-sm uppercase tracking-[0.3em] text-slate-400">Status</span>
        <span class="text-lg font-semibold text-emerald-400">Online</span>
      </div>
      <div
        class="flex items-center space-x-3 rounded-2xl border border-slate-800/60 bg-slate-900/50 px-6 py-4 shadow-lg shadow-sky-500/10"
      >
        <span class="text-sm uppercase tracking-[0.3em] text-slate-400">Mode</span>
        <span class="text-lg font-semibold text-sky-400">PWA Ready</span>
      </div>
    </div>
  </div>
</section>
