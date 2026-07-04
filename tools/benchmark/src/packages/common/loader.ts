/**
 * @file packages/common/loader.ts
 * @description Package loader for @lenguados/common
 *
 * Implements the PackageLoader interface using shared utilities.
 * This is the ONLY file that knows about common's build artifact paths.
 *
 * The package's root barrel is intentionally empty (`export {}`), so the
 * entry points target the `utils/parse-json-data` SUBPATH bundles — the
 * surface the package actually publishes.
 */

import { join } from 'node:path';

import type { PackageLoader } from '../../harness/package-loader.ts';
import { resolvePackageRoot, createModuleCache } from '../../harness/loader-utils.ts';

const root = resolvePackageRoot('common');
const { getOrLoad } = createModuleCache();

/**
 * Package loader for @lenguados/common build artifacts
 *
 * @remarks
 * Resolves the development and production subpath bundles of
 * `utils/parse-json-data` and caches loaded modules. The package exposes no
 * runtime configuration object, so `getConfig` is not implemented — the
 * "minimal citizen" shape future packages start from.
 */
export const commonLoader: PackageLoader = {
 name: 'common',
 root,
 entryPoints: {
  development: join(root, 'lib', 'esm', 'utils', 'parse-json-data.development.js'),
  production: join(root, 'lib', 'esm', 'utils', 'parse-json-data.production.js'),
 },
 mainEntry: join(root, 'main.mjs'),

 load(mode) {
  return getOrLoad(mode, this.entryPoints[mode]);
 },
};
