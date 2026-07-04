/**
 * @file harness/package-loader.ts
 * @description Define the package loader interface for the benchmark tool
 *
 * Each benchmarked package implements this interface to provide
 * build artifact paths, module loading, and optional runtime
 * configuration. The harness uses loaders to set up benchmark
 * cells without hardcoding any package-specific paths.
 */

import type { BuildMode } from './dimensions.ts';

/**
 * Provide build artifact paths, module loading, and optional runtime configuration
 * for a benchmarked package
 *
 * @remarks
 * Each benchmarked package implements this interface so the harness can load
 * the correct build artifacts (dev/prod) and toggle runtime configuration
 * (e.g., determinism mode) without hardcoding package-specific paths.
 *
 * @example
 * ```typescript
 * const loader: PackageLoader = {
 *  name: 'math2d',
 *  root: '/path/to/packages/mypkg',
 *  entryPoints: {
 *   development: '/path/to/packages/mypkg/lib/esm/mypkg.development.js',
 *   production: '/path/to/packages/mypkg/lib/esm/mypkg.production.js',
 *  },
 *  mainEntry: '/path/to/packages/mypkg/main.mjs',
 *  async load(mode) {
 *   return import(this.entryPoints[mode]);
 *  },
 * };
 * ```
 */
export interface PackageLoader {
 /** Package name (e.g., 'math2d', 'physics2d') */
 readonly name: string;

 /** Absolute path to the package root directory */
 readonly root: string;

 /** Build artifact entry points keyed by build mode */
 readonly entryPoints: Record<BuildMode, string>;

 /** Path to the main ESM entry (e.g., 'main.mjs') */
 readonly mainEntry: string;

 /**
  * Load the package module for the given build mode (cached)
  *
  * @param mode - The build mode to load ('development' or 'production')
  * @returns The loaded module namespace object
  */
 load(mode: BuildMode): Promise<Record<string, unknown>>;

 /**
  * Access the package's runtime configuration (e.g., determinism toggle)
  *
  * @param mod - The loaded module namespace object
  * @returns The configuration object, or undefined if the package has no configurable runtime behavior
  */
 getConfig?(mod: Record<string, unknown>): Record<string, unknown> | undefined;
}
