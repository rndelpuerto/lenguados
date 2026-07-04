import { describe, expect, it } from '@jest/globals';

import {
 aggregateScore,
 computeRatios,
 geometricMean,
 nsToOpsPerSec,
} from '../../src/harness/scoring.ts';
import type { OperationResult } from '../../src/harness/scoring.ts';

describe('nsToOpsPerSec', () => {
 it('converts nanoseconds to ops/sec', () => {
  expect(nsToOpsPerSec(1)).toBe(1e9);
  expect(nsToOpsPerSec(1000)).toBe(1e6);
  expect(nsToOpsPerSec(0)).toBe(0);
 });
});

describe('geometricMean', () => {
 it('computes geometric mean correctly', () => {
  expect(geometricMean([4, 9])).toBeCloseTo(6, 10);
  expect(geometricMean([1, 1, 1])).toBe(1);
 });

 it('[2.0, 0.5] → 1.0 (neutral)', () => {
  const result = geometricMean([2.0, 0.5]);
  expect(result).toBeCloseTo(1.0, 10);
 });

 it('single element returns that element', () => {
  expect(geometricMean([3.5])).toBeCloseTo(3.5, 10);
 });

 it('all ratios > 1 produce result > 1', () => {
  const result = geometricMean([1.5, 2.0, 1.2]);
  expect(result).toBeGreaterThan(1);
 });

 it('all ratios < 1 produce result < 1', () => {
  const result = geometricMean([0.5, 0.8, 0.9]);
  expect(result).toBeLessThan(1);
 });

 it('returns 0 for empty array', () => {
  expect(geometricMean([])).toBe(0);
 });

 it('returns 0 if any value is <= 0', () => {
  expect(geometricMean([1, 0, 2])).toBe(0);
  expect(geometricMean([1, -1, 2])).toBe(0);
 });
});

describe('computeRatios', () => {
 const target: OperationResult[] = [
  { operation: 'add', meanNs: 2, opsPerSec: 500e6 },
  { operation: 'normalize', meanNs: 5, opsPerSec: 200e6 },
 ];

 const reference: OperationResult[] = [
  { operation: 'add', meanNs: 2.5, opsPerSec: 400e6 },
  { operation: 'normalize', meanNs: 4, opsPerSec: 250e6 },
 ];

 it('computes per-operation ratios', () => {
  const ratios = computeRatios(target, reference, 'math2d', 'gl-matrix');
  expect(ratios).toHaveLength(2);
  expect(ratios[0]!.operation).toBe('add');
  expect(ratios[0]!.ratio).toBeCloseTo(1.25, 5);
  expect(ratios[1]!.operation).toBe('normalize');
  expect(ratios[1]!.ratio).toBeCloseTo(0.8, 5);
 });

 it('skips operations not present in reference', () => {
  const extra: OperationResult[] = [
   ...target,
   { operation: 'slerp', meanNs: 10, opsPerSec: 100e6 },
  ];
  const ratios = computeRatios(extra, reference, 'math2d', 'gl-matrix');
  expect(ratios).toHaveLength(2);
 });
});

describe('aggregateScore', () => {
 it('computes geometric mean across operations', () => {
  const target: OperationResult[] = [
   { operation: 'add', meanNs: 2, opsPerSec: 500e6 },
   { operation: 'dot', meanNs: 5, opsPerSec: 200e6 },
   { operation: 'norm', meanNs: 10, opsPerSec: 100e6 },
  ];
  const reference: OperationResult[] = [
   { operation: 'add', meanNs: 2.5, opsPerSec: 400e6 },
   { operation: 'dot', meanNs: 3.33, opsPerSec: 300e6 },
   { operation: 'norm', meanNs: 12.5, opsPerSec: 80e6 },
  ];

  const score = aggregateScore(target, reference, 'math2d', 'gl-matrix');

  // Ratios: 500/400=1.25, 200/300≈0.6667, 100/80=1.25
  // Geometric mean: (1.25 * 0.6667 * 1.25)^(1/3)
  const expected = Math.pow(1.25 * (200e6 / 300e6) * 1.25, 1 / 3);
  expect(score.geometricMean).toBeCloseTo(expected, 5);
  expect(score.ratios).toHaveLength(3);
  expect(score.targetName).toBe('math2d');
  expect(score.referenceName).toBe('gl-matrix');
 });

 it('cross-library normalization with mock data', () => {
  const math2d: OperationResult[] = [{ operation: 'vectorAdd', meanNs: 2, opsPerSec: 500e6 }];
  const glMatrix: OperationResult[] = [{ operation: 'vectorAdd', meanNs: 2, opsPerSec: 500e6 }];

  const score = aggregateScore(math2d, glMatrix, 'math2d', 'gl-matrix');
  expect(score.geometricMean).toBeCloseTo(1.0, 10);
 });
});
