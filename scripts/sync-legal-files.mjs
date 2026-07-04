#!/usr/bin/env node
/**
 * @file scripts/sync-legal-files.mjs
 * @description
 * Copies the repository LICENSE and NOTICE into the current package root so
 * npm includes them in the published tarball (npm always packs README,
 * LICENSE and NOTICE found at the package root; the repository-level copies
 * are invisible to `npm pack`). Runs as each package's `prepack` hook, so it
 * covers `npm pack`, `npm publish`, and `lerna publish` alike. The copies
 * are gitignored — the repository root remains the single source of truth.
 */

import { copyFileSync, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Anchored to this script's location (scripts/ under the repository root) —
// never to cwd, so a stray invocation cannot resolve a foreign LICENSE.
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

for (const name of ['LICENSE', 'NOTICE']) {
 const source = path.join(repoRoot, name);

 if (!existsSync(source)) {
  console.error(`sync-legal-files: missing ${name} at repository root (${source})`);

  process.exit(1);
 }

 copyFileSync(source, path.join(process.cwd(), name));
}
