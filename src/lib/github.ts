interface PagesUrlOptions {
  origin?: string;
  basePath?: string;
  repository?: string;
  branch?: string;
}

export function branchSlug(branch: string): string {
  const slug = branch
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || 'preview';
}

function computeBasePath(repository: string, branch: string): string {
  const [, repoName = 'cashflowcast'] = repository.split('/');
  if (!branch || branch === 'main') {
    return `/${repoName}`;
  }
  return `/${repoName}/${branchSlug(branch)}`;
}

export function derivePagesUrl(options: PagesUrlOptions = {}): string {
  const repository =
    options.repository ?? import.meta.env.VITE_GITHUB_REPOSITORY ?? 'unknown/cashflowcast';
  const branch = options.branch ?? import.meta.env.VITE_GITHUB_BRANCH ?? 'main';
  const basePath =
    options.basePath ?? import.meta.env.BASE_URL ?? computeBasePath(repository, branch);

  if (typeof window !== 'undefined') {
    const origin = options.origin ?? window.location.origin;
    const normalizedBase = basePath.endsWith('/') ? basePath : `${basePath}/`;
    const prefixedBase = normalizedBase.startsWith('/') ? normalizedBase : `/${normalizedBase}`;
    return new URL(prefixedBase, origin).toString();
  }

  const [owner] = repository.split('/');
  const origin = owner && owner !== 'unknown' ? `https://${owner}.github.io` : 'https://localhost';
  const computedBase = basePath || computeBasePath(repository, branch);
  const normalizedBase = computedBase.endsWith('/') ? computedBase : `${computedBase}/`;
  const prefixedBase = normalizedBase.startsWith('/') ? normalizedBase : `/${normalizedBase}`;
  return `${origin}${prefixedBase}`;
}
