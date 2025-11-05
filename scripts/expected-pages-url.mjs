#!/usr/bin/env node
import { execSync } from 'node:child_process';

function run(command) {
  try {
    return execSync(command, { encoding: 'utf8' }).trim();
  } catch {
    return '';
  }
}

const remoteUrl = run('git config --get remote.origin.url');
let repository = process.env.GITHUB_REPOSITORY ?? '';

if (remoteUrl) {
  const match = remoteUrl.match(/github\.com[:\/]{1,2}([^\/]+)\/([^\/]+?)(?:\.git)?$/i);
  if (match) {
    const ownerPart = match[1];
    const repoPart = match[2].replace(/\.git$/, '');
    repository = `${ownerPart}/${repoPart}`;
  } else {
    console.error('Remote origin is not a GitHub repository.');
    process.exit(1);
  }
}

repository = repository.replace(/\.git$/i, '');

if (!repository) {
  console.error('Unable to determine repository owner. Set remote.origin or GITHUB_REPOSITORY.');
  process.exit(1);
}

const [owner, repo] = repository.split('/');

if (!owner || !repo) {
  console.error('Repository string must follow owner/name format.');
  process.exit(1);
}

const branchRaw = run('git rev-parse --abbrev-ref HEAD') || 'main';

function branchSlug(branch) {
  return (
    branch
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'preview'
  );
}

const slug = branchSlug(branchRaw);
let path = `/${repo}`;
if (branchRaw !== 'main') {
  path += `/${slug}`;
}

const url = `https://${owner}.github.io${path}/`;
console.log(url);
