# CashflowCast

CashflowCast is a Progressive Web App scaffold built with [SvelteKit](https://kit.svelte.dev/) and [Tailwind CSS](https://tailwindcss.com/). It currently ships a friendly hello world screen and is configured for static deployment to GitHub Pages.

## Getting Started

```bash
npm install
npm run dev -- --open
```

The development server runs on [Vite](https://vitejs.dev/). The extra `--` is required to forward flags to Vite.

## Scripts

- `npm run dev` – Start the local development server.
- `npm run build` – Create a production build in the `build/` directory.
- `npm run preview` – Preview the production build locally.
- `npm run lint` – Run ESLint with the Svelte and TypeScript rules.
- `npm run format` – Format the codebase using Prettier.
- `npm run format:check` – Check formatting without making changes.
- `npm run check` – Run SvelteKit sync and type checking.

## Deployment

Pushes to the `main` branch trigger the `Build and Deploy` GitHub Actions workflow. The workflow installs dependencies, runs linting, formatting checks, and type checking, builds the site with the appropriate base path for GitHub Pages, and publishes the static assets.
