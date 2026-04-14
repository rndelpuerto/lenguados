/**
 * Suite definition framework.
 *
 * Each benchmark suite is a TypeScript module exporting a defineSuite()
 * function. The runner discovers suites by scanning src/suites/*.bench.ts
 * and executes them across the dimension matrix.
 */

import { readdir } from 'node:fs/promises';
import { join } from 'node:path';

import type { DimensionSpec, ValidationTier, DeterminismMode } from './dimensions.ts';
import type { GcMode } from './runner.ts';

/* ========================================================================== */
/* Types                                                                       */
/* ========================================================================== */

export interface BenchmarkEntry {
 /** Human-readable name (e.g., "Vector2.add (static, out)") */
 name: string;
 /** The function to benchmark. MUST return a value for DCE protection. */
 fn: () => unknown;
 /** Which validation tier this benchmark tests (for tier-parameterized suites) */
 tier?: ValidationTier | undefined;
 /** Which determinism mode this benchmark applies to */
 determinism?: DeterminismMode | undefined;
}

export interface SuiteDefinition {
 /** Suite name (e.g., "Vector2") */
 name: string;
 /** Which dimensions this suite varies over */
 dimensions: DimensionSpec;
 /** GC mode override for all benchmarks in this suite */
 gcMode?: GcMode | undefined;
 /** Called once before all benchmarks. Receives the loaded math2d module. */
 setup?: (math2d: Record<string, unknown>) => void | Promise<void>;
 /** Called once after all benchmarks. */
 teardown?: () => void | Promise<void>;
 /** The benchmark definitions */
 benchmarks: BenchmarkEntry[];
}

export type SuiteFactory = () => SuiteDefinition;

/* ========================================================================== */
/* Benchmark Filtering by Dimension Cell                                       */
/* ========================================================================== */

/**
 * Filter benchmarks to only those relevant to the current dimension cell.
 *
 * Rules:
 * - Benchmarks with no `tier` tag are tier-agnostic: run in EVERY tier cell.
 * - Benchmarks with a `tier` tag run ONLY when the cell's tier matches.
 * - Benchmarks with no `determinism` tag are mode-agnostic: run in every cell.
 * - Benchmarks with a `determinism` tag run ONLY when the cell's determinism matches.
 *
 * This eliminates redundant measurements: normalizeUnchecked only runs in
 * the unchecked tier cell, not in all 3 tier cells.
 */
export function filterBenchmarksForCell(
 benchmarks: BenchmarkEntry[],
 cell: { tier?: string; determinism?: string },
): BenchmarkEntry[] {
 return benchmarks.filter((b) => {
  // Tier filtering: if benchmark has a tier tag, it must match the cell
  if (b.tier !== undefined && cell.tier !== undefined && b.tier !== cell.tier) {
   return false;
  }
  // Determinism filtering: if benchmark has a determinism tag, it must match
  if (b.determinism !== undefined && cell.determinism !== undefined && b.determinism !== cell.determinism) {
   return false;
  }
  return true;
 });
}

/* ========================================================================== */
/* Suite Auto-Discovery                                                        */
/* ========================================================================== */

const SUITES_DIR = new URL('../suites/', import.meta.url).pathname;

/**
 * Discover all suite modules in src/suites/*.bench.ts.
 *
 * Each module must export a `defineSuite` function.
 * Returns an array of SuiteDefinition objects.
 */
export async function discoverSuites(
 filter?: RegExp,
): Promise<SuiteDefinition[]> {
 const files = await readdir(SUITES_DIR);
 const benchFiles = files
  .filter((f) => f.endsWith('.bench.ts') || f.endsWith('.bench.mjs'))
  .sort();

 const suites: SuiteDefinition[] = [];

 for (const file of benchFiles) {
  if (filter && !filter.test(file)) continue;

  const modulePath = join(SUITES_DIR, file);
  const mod = (await import(modulePath)) as { defineSuite?: SuiteFactory };

  if (typeof mod.defineSuite !== 'function') {
   console.warn(`  WARNING: ${file} does not export defineSuite(), skipping.`);
   continue;
  }

  suites.push(mod.defineSuite());
 }

 return suites;
}

/* ========================================================================== */
/* Allocation Tracking                                                         */
/* ========================================================================== */

declare const global: { gc?: () => void };

/**
 * Measure heap allocation for a function over N iterations.
 *
 * Requires --expose-gc flag. If global.gc is unavailable, returns
 * null with a warning instead of crashing.
 *
 * Returns the heap growth in bytes. For zero-allocation paths
 * (out parameter provided), this should be < 1 KB.
 */
export function measureAllocations(
 fn: () => void,
 iterations: number,
): { heapGrowthBytes: number; bytesPerOp: number } | null {
 if (typeof global.gc !== 'function') {
  console.warn(
   '  WARNING: global.gc() not available. Run with --expose-gc for allocation tracking.',
  );
  return null;
 }

 // Warm up
 for (let i = 0; i < 100; i++) fn();

 global.gc();
 const before = process.memoryUsage().heapUsed;

 for (let i = 0; i < iterations; i++) fn();

 global.gc();
 const after = process.memoryUsage().heapUsed;

 const heapGrowthBytes = Math.max(0, after - before);
 return {
  heapGrowthBytes,
  bytesPerOp: heapGrowthBytes / iterations,
 };
}

