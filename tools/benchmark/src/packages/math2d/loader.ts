/**
 * @file packages/math2d/loader.ts
 * @description Package loader for @lenguados/math2d
 *
 * Implements the PackageLoader interface using shared utilities.
 * This is the ONLY file that knows about math2d's build artifact paths.
 */

import { join } from 'node:path';

import type { PackageLoader } from '../../harness/package-loader.ts';
import { resolvePackageRoot, createModuleCache } from '../../harness/loader-utils.ts';

const root = resolvePackageRoot('math2d');
const { getOrLoad } = createModuleCache();

/**
 * Package loader for @lenguados/math2d build artifacts
 *
 * @remarks
 * Resolves development and production ESM entry points and caches loaded
 * modules. Exposes the runtime configuration object (e.g., `useNativeMath`)
 * for determinism toggling.
 */
export const math2dLoader: PackageLoader = {
 name: 'math2d',
 root,
 entryPoints: {
  development: join(root, 'lib', 'esm', 'index.development.js'),
  production: join(root, 'lib', 'esm', 'module.js'),
 },
 mainEntry: join(root, 'main.mjs'),

 load(mode) {
  return getOrLoad(mode, this.entryPoints[mode]);
 },

 getConfig(mod) {
  const config = mod['config'] as { useNativeMath: boolean } | undefined;
  return config;
 },
};
