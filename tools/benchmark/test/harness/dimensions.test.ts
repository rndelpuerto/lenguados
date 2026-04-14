import { describe, expect, it } from '@jest/globals';

import {
 cartesianProduct,
 cellToKey,
 cellToLabel,
 filterCells,
 parseDimensionFilter,
} from '../../src/harness/dimensions.ts';
import type { DimensionCell, DimensionSpec } from '../../src/harness/dimensions.ts';

describe('cartesianProduct', () => {
 it('computes correct count for 2x3 spec', () => {
  const spec: DimensionSpec = {
   environment: ['node'],
   buildMode: ['development', 'production'],
   determinism: ['fdlibm'],
   tier: ['default', 'safe', 'unchecked'],
   entity: ['Vector2'],
  };
  const cells = cartesianProduct(spec);
  expect(cells).toHaveLength(2 * 3); // 2 buildModes x 3 tiers
 });

 it('produces unique cells', () => {
  const spec: DimensionSpec = {
   environment: ['node'],
   buildMode: ['development', 'production'],
   determinism: ['fdlibm', 'native'],
   tier: ['default'],
   entity: ['Vector2'],
  };
  const cells = cartesianProduct(spec);
  const keys = cells.map(cellToKey);
  expect(new Set(keys).size).toBe(keys.length);
 });

 it('uses defaults for missing axes', () => {
  const spec: DimensionSpec = {
   entity: ['Matrix3'],
  };
  const cells = cartesianProduct(spec);
  // defaults: 1 env * 2 buildModes * 2 determinisms * 1 tier * 1 entity = 4
  expect(cells).toHaveLength(4);
 });

 it('single-value axes produce 1 cell', () => {
  const spec: DimensionSpec = {
   environment: ['node'],
   buildMode: ['production'],
   determinism: ['fdlibm'],
   tier: ['unchecked'],
   entity: ['Vector2'],
  };
  const cells = cartesianProduct(spec);
  expect(cells).toHaveLength(1);
  expect(cells[0]!.tier).toBe('unchecked');
 });
});

describe('filterCells', () => {
 const allCells = cartesianProduct({
  environment: ['node'],
  buildMode: ['development', 'production'],
  determinism: ['fdlibm', 'native'],
  tier: ['default', 'safe', 'unchecked'],
  entity: ['Vector2'],
 });

 it('filters by single axis', () => {
  const filtered = filterCells(allCells, { tier: 'unchecked' });
  expect(filtered.every((c) => c.tier === 'unchecked')).toBe(true);
  // 2 buildModes * 2 determinisms = 4
  expect(filtered).toHaveLength(4);
 });

 it('filters by multiple axes (AND logic)', () => {
  const filtered = filterCells(allCells, {
   tier: 'unchecked',
   determinism: 'fdlibm',
  });
  expect(filtered.every((c) => c.tier === 'unchecked' && c.determinism === 'fdlibm')).toBe(true);
  // 2 buildModes = 2
  expect(filtered).toHaveLength(2);
 });

 it('empty filter returns all cells', () => {
  const filtered = filterCells(allCells, {});
  expect(filtered).toHaveLength(allCells.length);
 });

 it('impossible filter returns empty', () => {
  const filtered = filterCells(allCells, { environment: 'chromium' as 'chromium' });
  expect(filtered).toHaveLength(0);
 });
});

describe('parseDimensionFilter', () => {
 it('parses --key=value flags', () => {
  const filter = parseDimensionFilter(['--tier=unchecked', '--determinism=fdlibm']);
  expect(filter.tier).toBe('unchecked');
  expect(filter.determinism).toBe('fdlibm');
 });

 it('resolves --build alias to buildMode', () => {
  const filter = parseDimensionFilter(['--build=production']);
  expect(filter.buildMode).toBe('production');
 });

 it('ignores unknown flags', () => {
  const filter = parseDimensionFilter(['--unknown=value', '--suite=vector2']);
  expect(Object.keys(filter)).toHaveLength(0);
 });

 it('ignores flags without = separator', () => {
  const filter = parseDimensionFilter(['--tier', 'unchecked']);
  expect(filter.tier).toBeUndefined();
 });
});

describe('cellToKey / cellToLabel', () => {
 const cell: DimensionCell = {
  environment: 'node',
  buildMode: 'production',
  determinism: 'fdlibm',
  tier: 'unchecked',
  entity: 'Vector2',
 };

 it('produces stable key', () => {
  expect(cellToKey(cell)).toBe('node:production:fdlibm:unchecked:Vector2');
 });

 it('produces human-readable label', () => {
  const label = cellToLabel(cell);
  expect(label).toContain('Vector2');
  expect(label).toContain('production');
  expect(label).toContain('fdlibm');
  expect(label).toContain('unchecked');
 });
});
