import { describe, expect, it } from '@jest/globals';

import {
 clearAdapters,
 getAdapter,
 getRegisteredAdapters,
 registerAdapter,
} from '../../src/harness/library-adapter.ts';
import type { LibraryAdapter } from '../../src/harness/library-adapter.ts';
import { ALL_OPERATIONS, getOperationSpec, OPERATION_NAMES } from '../../src/harness/operation-vocabulary.ts';
import { generateComparisonJson, printComparisonAscii } from '../../src/harness/comparison-reporter.ts';
import type { ComparisonResult, LibraryBenchmarkResult } from '../../src/harness/comparison-runner.ts';
import type { BenchmarkStats } from '../../src/harness/statistics.ts';

function mockStats(mean: number): BenchmarkStats {
 return {
  count: 1000,
  mean,
  median: mean,
  stddev: mean * 0.05,
  variance: (mean * 0.05) ** 2,
  mad: mean * 0.03,
  min: mean * 0.9,
  max: mean * 1.1,
  p50: mean,
  p95: mean * 1.08,
  p99: mean * 1.1,
  ci95: { lo: mean * 0.98, hi: mean * 1.02, confidence: 0.95 },
  outliers: { mildLow: 0, mildHigh: 1, severeLow: 0, severeHigh: 0, totalMild: 1, totalSevere: 0 },
  opsPerSec: 1e9 / mean,
 };
}

describe('LibraryAdapter registry', () => {
 const mockAdapter: LibraryAdapter = {
  name: 'test-lib',
  version: '1.0.0',
  getOperations: () => new Map([['vectorAdd', () => 42]]),
 };

 it('registers and retrieves adapters', () => {
  clearAdapters();
  registerAdapter(mockAdapter);
  expect(getAdapter('test-lib')).toBe(mockAdapter);
 });

 it('returns all registered adapters', () => {
  clearAdapters();
  registerAdapter(mockAdapter);
  const all = getRegisteredAdapters();
  expect(all.size).toBe(1);
 });

 it('returns undefined for unregistered adapter', () => {
  clearAdapters();
  expect(getAdapter('nonexistent')).toBeUndefined();
 });
});

describe('Operation Vocabulary', () => {
 it('contains at least 9 vector ops', () => {
  const vectorOps = ALL_OPERATIONS.filter((o) => o.category === 'vector');
  expect(vectorOps.length).toBeGreaterThanOrEqual(9);
 });

 it('contains at least 8 matrix ops', () => {
  const matrixOps = ALL_OPERATIONS.filter((o) => o.category === 'matrix');
  expect(matrixOps.length).toBeGreaterThanOrEqual(8);
 });

 it('contains at least 3 rotation ops', () => {
  const rotOps = ALL_OPERATIONS.filter((o) => o.category === 'rotation');
  expect(rotOps.length).toBeGreaterThanOrEqual(3);
 });

 it('all operations have unique names', () => {
  expect(OPERATION_NAMES.size).toBe(ALL_OPERATIONS.length);
 });

 it('getOperationSpec returns spec by name', () => {
  const spec = getOperationSpec('vectorAdd');
  expect(spec).toBeDefined();
  expect(spec!.category).toBe('vector');
 });

 it('every operation has a description', () => {
  for (const op of ALL_OPERATIONS) {
   expect(op.description.length).toBeGreaterThan(0);
  }
 });
});

describe('Comparison Reporter', () => {
 function mockComparisonResult(): ComparisonResult {
  const math2dOps = new Map<string, BenchmarkStats>([
   ['vectorAdd', mockStats(2)],
   ['vectorNormalize', mockStats(5)],
   ['matrixMultiply', mockStats(10)],
  ]);

  const glMatrixOps = new Map<string, BenchmarkStats>([
   ['vectorAdd', mockStats(2.5)],
   ['vectorNormalize', mockStats(4)],
   ['matrixMultiply', mockStats(12)],
  ]);

  const libraries: LibraryBenchmarkResult[] = [
   { libraryName: 'math2d', libraryVersion: '0.6.0', operations: math2dOps },
   { libraryName: 'gl-matrix', libraryVersion: '3.4.3', operations: glMatrixOps },
  ];

  return {
   libraries,
   scores: new Map([
    ['math2d', {
     geometricMean: 1.1,
     ratios: [
      { operation: 'vectorAdd', ratio: 1.25, targetOpsPerSec: 5e8, referenceOpsPerSec: 4e8 },
      { operation: 'vectorNormalize', ratio: 0.8, targetOpsPerSec: 2e8, referenceOpsPerSec: 2.5e8 },
      { operation: 'matrixMultiply', ratio: 1.2, targetOpsPerSec: 1e8, referenceOpsPerSec: 8.3e7 },
     ],
     targetName: 'math2d',
     referenceName: 'gl-matrix',
    }],
   ]),
   referenceLibrary: 'gl-matrix',
  };
 }

 it('ASCII table contains library names', () => {
  const result = mockComparisonResult();
  const table = printComparisonAscii(result);
  expect(table).toContain('math2d');
  expect(table).toContain('gl-matrix');
 });

 it('ASCII table contains operation names', () => {
  const result = mockComparisonResult();
  const table = printComparisonAscii(result);
  expect(table).toContain('vectorAdd');
  expect(table).toContain('matrixMultiply');
 });

 it('ASCII table contains geometric mean', () => {
  const result = mockComparisonResult();
  const table = printComparisonAscii(result);
  expect(table).toContain('Geometric Mean');
 });

 it('JSON output has correct structure', () => {
  const result = mockComparisonResult();
  const json = generateComparisonJson(result);
  expect(json.libraries).toHaveLength(2);
  expect(json.operations).toHaveLength(3);
  expect(json.scores).toHaveLength(1);
  expect(json.scores[0]!.geometricMean).toBeCloseTo(1.1, 1);
 });

 it('JSON operations include per-library results', () => {
  const result = mockComparisonResult();
  const json = generateComparisonJson(result);
  const addOp = json.operations.find((o) => o.name === 'vectorAdd');
  expect(addOp).toBeDefined();
  expect(addOp!.results['math2d']).toBeDefined();
  expect(addOp!.results['gl-matrix']).toBeDefined();
 });
});
