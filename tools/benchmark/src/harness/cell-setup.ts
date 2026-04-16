/**
 * Per-cell setup/teardown for dimension matrix execution.
 *
 * Handles determinism toggle and build mode switching before
 * each benchmark cell runs, restoring state afterward.
 */

import type { DimensionCell, BuildMode } from './dimensions.ts';
import type { PackageLoader } from './package-loader.ts';

export interface CellContext {
 /** The loaded module for this cell's build mode */
 math2d: Record<string, unknown>;
 /** The cell being executed */
 cell: DimensionCell;
 /** Cleanup function to restore previous state */
 teardown: () => void;
}

/**
 * Set up the environment for a single dimension cell.
 *
 * 1. Loads the correct build (dev or prod) via the package loader
 * 2. Sets determinism config if the package and cell support it
 * 3. Returns a teardown function that restores the previous state
 */
export async function setupCell(cell: DimensionCell, loader: PackageLoader): Promise<CellContext> {
 const mod = await loader.load(cell.buildMode as BuildMode);

 let previousValue: unknown;
 let config: Record<string, unknown> | undefined;

 // Toggle determinism if the package supports it and the cell has a determinism axis
 if (loader.getConfig && cell.determinism !== undefined) {
  config = loader.getConfig(mod);
  if (config && 'useNativeMath' in config) {
   previousValue = config['useNativeMath'];
   config['useNativeMath'] = cell.determinism === 'native';
  }
 }

 return {
  math2d: mod,
  cell,
  teardown() {
   if (config && previousValue !== undefined) {
    config['useNativeMath'] = previousValue;
   }
  },
 };
}
