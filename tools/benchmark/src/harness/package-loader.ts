/**
 * Package loader interface for the benchmark tool.
 *
 * Each benchmarked package implements this interface to provide
 * build artifact paths, module loading, and optional runtime
 * configuration. The harness uses loaders to set up benchmark
 * cells without hardcoding any package-specific paths.
 */

import type { BuildMode } from './dimensions.ts';

export interface PackageLoader {
 /** Package name (e.g., 'math2d', 'physics2d') */
 readonly name: string;

 /** Absolute path to the package root directory */
 readonly root: string;

 /** Build artifact entry points keyed by build mode */
 readonly entryPoints: Record<BuildMode, string>;

 /** Path to the main ESM entry (e.g., 'main.mjs') */
 readonly mainEntry: string;

 /** Load the package module for the given build mode (cached). */
 load(mode: BuildMode): Promise<Record<string, unknown>>;

 /**
  * Access the package's runtime configuration (e.g., determinism toggle).
  * Returns undefined if the package has no configurable runtime behavior.
  */
 getConfig?(mod: Record<string, unknown>): Record<string, unknown> | undefined;
}
