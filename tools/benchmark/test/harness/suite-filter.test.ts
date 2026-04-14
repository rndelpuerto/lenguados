import { describe, expect, it } from '@jest/globals';

import { filterBenchmarksForCell } from '../../src/harness/suite.ts';
import type { BenchmarkEntry } from '../../src/harness/suite.ts';

describe('filterBenchmarksForCell', () => {
 const benchmarks: BenchmarkEntry[] = [
  { name: 'add', fn: () => 1 },
  { name: 'subtract', fn: () => 2 },
  { name: 'normalize', fn: () => 3, tier: 'default' },
  { name: 'normalizeSafe', fn: () => 4, tier: 'safe' },
  { name: 'normalizeUnchecked', fn: () => 5, tier: 'unchecked' },
 ];

 it('tier-agnostic benchmarks run in every tier cell', () => {
  const defaultCell = filterBenchmarksForCell(benchmarks, { tier: 'default' });
  const safeCell = filterBenchmarksForCell(benchmarks, { tier: 'safe' });
  const uncheckedCell = filterBenchmarksForCell(benchmarks, { tier: 'unchecked' });

  // add and subtract have no tier tag → run in all cells
  expect(defaultCell.map((b) => b.name)).toContain('add');
  expect(safeCell.map((b) => b.name)).toContain('add');
  expect(uncheckedCell.map((b) => b.name)).toContain('add');
 });

 it('tier-tagged benchmarks only run in matching tier cell', () => {
  const defaultCell = filterBenchmarksForCell(benchmarks, { tier: 'default' });
  const safeCell = filterBenchmarksForCell(benchmarks, { tier: 'safe' });
  const uncheckedCell = filterBenchmarksForCell(benchmarks, { tier: 'unchecked' });

  expect(defaultCell.map((b) => b.name)).toContain('normalize');
  expect(defaultCell.map((b) => b.name)).not.toContain('normalizeSafe');
  expect(defaultCell.map((b) => b.name)).not.toContain('normalizeUnchecked');

  expect(safeCell.map((b) => b.name)).toContain('normalizeSafe');
  expect(safeCell.map((b) => b.name)).not.toContain('normalize');

  expect(uncheckedCell.map((b) => b.name)).toContain('normalizeUnchecked');
  expect(uncheckedCell.map((b) => b.name)).not.toContain('normalize');
 });

 it('default tier cell gets tier-agnostic + default benchmarks', () => {
  const cell = filterBenchmarksForCell(benchmarks, { tier: 'default' });
  // 2 agnostic + 1 default = 3
  expect(cell).toHaveLength(3);
 });

 it('cell with no tier filters nothing', () => {
  const cell = filterBenchmarksForCell(benchmarks, {});
  expect(cell).toHaveLength(5);
 });

 it('each benchmark runs exactly once across all tier cells', () => {
  const defaultCell = filterBenchmarksForCell(benchmarks, { tier: 'default' });
  const safeCell = filterBenchmarksForCell(benchmarks, { tier: 'safe' });
  const uncheckedCell = filterBenchmarksForCell(benchmarks, { tier: 'unchecked' });

  // Tier-tagged benchmarks appear once total across the 3 cells
  const allNames = [
   ...defaultCell.map((b) => b.name),
   ...safeCell.map((b) => b.name),
   ...uncheckedCell.map((b) => b.name),
  ];
  // normalize: 1 occurrence (in default cell only)
  expect(allNames.filter((n) => n === 'normalize')).toHaveLength(1);
  // add: 3 occurrences (in every cell — tier-agnostic)
  expect(allNames.filter((n) => n === 'add')).toHaveLength(3);
 });
});
