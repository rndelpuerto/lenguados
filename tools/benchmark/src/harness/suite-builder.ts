/**
 * Shared benchmark builder for suite definitions.
 *
 * Eliminates the duplicated `add()` helper pattern across 12 suite files.
 */

import type { BenchmarkEntry } from './suite.ts';
import type { ValidationTier, DeterminismMode } from './dimensions.ts';

export interface BenchmarkBuilder {
 /** Add a benchmark. Optional tier/determinism tags for cell filtering. */
 add(name: string, fn: () => unknown, tier?: ValidationTier, determinism?: DeterminismMode): void;
 /** The accumulated benchmark entries. */
 readonly entries: BenchmarkEntry[];
}

/**
 * Create a benchmark builder that accumulates entries.
 *
 * Usage:
 * ```typescript
 * const { add, entries } = createBenchmarkBuilder();
 * add('Vector2.add (out)', () => V2.add(a, b, out));
 * add('Vector2.normalize', () => V2.normalize(a, out), 'default');
 * return { name: 'Vector2', benchmarks: entries, ... };
 * ```
 */
export function createBenchmarkBuilder(): BenchmarkBuilder {
 const entries: BenchmarkEntry[] = [];

 return {
  add(name, fn, tier, determinism) {
   entries.push({ name, fn, tier, determinism });
  },
  get entries() { return entries; },
 };
}
