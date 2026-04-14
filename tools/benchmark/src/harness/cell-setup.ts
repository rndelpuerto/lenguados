/**
 * Per-cell setup/teardown for dimension matrix execution.
 *
 * Handles determinism toggle and build mode switching before
 * each benchmark cell runs, restoring state afterward.
 */

import type { DimensionCell } from './dimensions.ts';
import { getConfig, loadMath2d } from './math2d-loader.ts';
import type { BuildMode } from './math2d-loader.ts';

export interface CellContext {
 /** The loaded math2d module for this cell's build mode */
 math2d: Record<string, unknown>;
 /** The cell being executed */
 cell: DimensionCell;
 /** Cleanup function to restore previous state */
 teardown: () => void;
}

/**
 * Set up the environment for a single dimension cell.
 *
 * 1. Loads the correct math2d build (dev or prod)
 * 2. Sets config.useNativeMath based on determinism dimension
 * 3. Returns a teardown function that restores the previous state
 *
 * Per architecture-and-layers.md: "Set once at app startup; never toggle
 * mid-computation." Benchmark cells are isolated runs — each cell sets
 * the toggle before measurement and restores after.
 */
export async function setupCell(cell: DimensionCell): Promise<CellContext> {
 const math2d = await loadMath2d(cell.buildMode as BuildMode);
 const config = getConfig(math2d);
 const previousNativeMath = config.useNativeMath;

 config.useNativeMath = cell.determinism === 'native';

 return {
  math2d,
  cell,
  teardown() {
   config.useNativeMath = previousNativeMath;
  },
 };
}
