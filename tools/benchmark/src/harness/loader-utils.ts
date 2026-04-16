/**
 * Shared utility functions for package loaders.
 *
 * Provides path resolution, module caching, and build artifact
 * verification without package-specific knowledge. Each package
 * loader composes these utilities instead of duplicating logic.
 */

import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { BuildMode } from './dimensions.ts';

/**
 * Monorepo root directory — computed once, used by all loaders.
 * All package paths derive from this via join(), avoiding fragile `../` chains.
 */
export const MONOREPO_ROOT = resolve(
 dirname(fileURLToPath(import.meta.url)),
 '..',
 '..',
 '..',
 '..',
);

/**
 * Resolve the absolute path to a package root directory.
 */
export function resolvePackageRoot(packageName: string): string {
 return join(MONOREPO_ROOT, 'packages', packageName);
}

/**
 * Create a module cache for a package loader.
 *
 * Returns a Map that stores loaded modules keyed by BuildMode,
 * and a `getOrLoad` function that checks the cache before importing.
 */
export function createModuleCache(): {
 cache: Map<BuildMode, Record<string, unknown>>;
 getOrLoad: (mode: BuildMode, entryPoint: string) => Promise<Record<string, unknown>>;
} {
 const cache = new Map<BuildMode, Record<string, unknown>>();

 async function getOrLoad(mode: BuildMode, entryPoint: string): Promise<Record<string, unknown>> {
  const cached = cache.get(mode);
  if (cached) return cached;

  const mod = await import(entryPoint);
  cache.set(mode, mod as Record<string, unknown>);
  return mod as Record<string, unknown>;
 }

 return { cache, getOrLoad };
}

/**
 * Verify that build artifacts exist at the given entry point paths.
 *
 * Returns null if all paths exist, or an error message string
 * identifying the first missing artifact.
 */
export async function verifyArtifacts(
 entryPoints: Record<BuildMode, string>,
 packageName: string,
): Promise<string | null> {
 const { access } = await import('node:fs/promises');

 for (const [mode, path] of Object.entries(entryPoints)) {
  try {
   await access(path);
  } catch {
   const command = mode === 'production' ? 'npm run dist' : 'npm run build';
   return (
    `${packageName} ${mode} build artifacts not found at ${path}.\n` +
    `Run \`${command}\` from the repository root first.`
   );
  }
 }

 return null;
}
