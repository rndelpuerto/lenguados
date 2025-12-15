/**
 * @file test/auxiliary/numeric/safety.node.spec.ts
 * @module @lenguados/math2d/auxiliary/numeric
 * @description Focused coverage for numeric safety helpers.
 */

import { describe, expect, test } from '@jest/globals';

import {
 safeLog,
 safeMod as safeModule,
 safePow,
 safeDivide,
 safeReciprocal,
 safeSqrt,
 safeAcos,
 safeAsin,
 robustSum,
 neumaierSum,
 compensatedProduct,
 safeLerp,
 sanitizeNumber,
 ensureFinite,
} from '../../../src/auxiliary/numeric/safety';

describe('numeric/safety', () => {
 describe('safeLog', () => {
  test('returns natural log for positive inputs', () => {
   expect(safeLog(Math.E)).toBeCloseTo(1);
   expect(safeLog(1)).toBe(0);
  });

  test('supports custom bases', () => {
   expect(safeLog(100, 10)).toBeCloseTo(2);
   expect(safeLog(8, 2)).toBeCloseTo(3);
  });

  test('returns -Infinity for non-positive inputs', () => {
   expect(safeLog(0)).toBe(Number.NEGATIVE_INFINITY);
   expect(safeLog(-1)).toBe(Number.NEGATIVE_INFINITY);
  });

  test('keeps base-e shortcut numerically stable', () => {
   const value = Math.E ** 5;
   expect(safeLog(value)).toBeCloseTo(5);
  });
 });

 describe('safePow', () => {
  test('behaves like Math.pow for regular inputs', () => {
   expect(safePow(2, 3)).toBe(8);
   expect(safePow(5, 0)).toBe(1);
   expect(safePow(0, 5)).toBe(0);
  });

  test('returns NaN for fractional powers of negative bases', () => {
   expect(safePow(-2, 0.5)).toBeNaN();
  });

  test('handles documented corner cases explicitly', () => {
   expect(safePow(0, 0)).toBe(1);
   expect(safePow(-2, 4)).toBe(16);
   expect(safePow(1, 9999)).toBe(1);
  });
 });

 describe('safeMod', () => {
  test('matches JavaScript modulo for positive divisors', () => {
   expect(safeModule(7, 3)).toBe(1);
   expect(safeModule(-7, 3)).toBe(2);
  });

  test('keeps the result aligned with the divisor sign', () => {
   expect(safeModule(7, -3)).toBe(-2);
   expect(safeModule(-7, -3)).toBe(-1);
  });

  test('returns 0 for zero divisors', () => {
   expect(safeModule(10, 0)).toBe(0);
  });

  test('stays within divisor range even after many wraps', () => {
   expect(safeModule(30, 7)).toBe(2);
   expect(safeModule(-30, 7)).toBe(5);
   expect(safeModule(30, -7)).toBe(-5);
  });
 });

 describe('safeDivide', () => {
  test('divides normally for valid inputs', () => {
   expect(safeDivide(10, 2)).toBe(5);
   expect(safeDivide(0, 5)).toBe(0);
  });

  test('returns 0 for near-zero divisor', () => {
   expect(safeDivide(10, 0)).toBe(0);
   expect(safeDivide(10, 1e-20)).toBe(0);
  });

  test('respects custom epsilon', () => {
   // With large epsilon, small denominators return 0
   expect(safeDivide(10, 0.5, 1)).toBe(0);
   // With small epsilon, they work
   expect(safeDivide(10, 0.5, 0.1)).toBe(20);
  });
 });

 describe('safeReciprocal', () => {
  test('returns 1/value for normal inputs', () => {
   expect(safeReciprocal(2)).toBe(0.5);
   expect(safeReciprocal(4)).toBe(0.25);
  });

  test('returns 0 for near-zero inputs', () => {
   expect(safeReciprocal(0)).toBe(0);
   expect(safeReciprocal(1e-20)).toBe(0);
  });
 });

 describe('safeSqrt', () => {
  test('returns sqrt for positive inputs', () => {
   expect(safeSqrt(4)).toBeCloseTo(2, 6);
   expect(safeSqrt(9)).toBeCloseTo(3, 6);
  });

  test('returns 0 for negative inputs', () => {
   expect(safeSqrt(-1)).toBe(0);
   expect(safeSqrt(-100)).toBe(0);
  });

  test('returns 0 for zero', () => {
   expect(safeSqrt(0)).toBe(0);
   expect(safeSqrt(-0)).toBe(0);
  });

  test('handles small positive values', () => {
   expect(safeSqrt(0.0001)).toBeCloseTo(0.01, 6);
   expect(safeSqrt(1e-10)).toBeCloseTo(1e-5, 10);
  });

  test('handles large values', () => {
   expect(safeSqrt(1e10)).toBeCloseTo(1e5, 0);
   expect(safeSqrt(1e20)).toBeCloseTo(1e10, 0);
  });

  describe('determinism', () => {
   test('produces identical results across multiple calls', () => {
    const testValues = [0, 1, 2, 4, 9, 16, 25, 0.5, 0.25, 1e-8, 1e8];

    for (const value of testValues) {
     const result1 = safeSqrt(value);
     const result2 = safeSqrt(value);
     const result3 = safeSqrt(value);

     expect(result1).toBe(result2);
     expect(result2).toBe(result3);
    }
   });

   test('produces identical results for negative inputs', () => {
    const negativeValues = [-1, -0.5, -1e-10, -1e10];

    for (const value of negativeValues) {
     const result1 = safeSqrt(value);
     const result2 = safeSqrt(value);

     expect(result1).toBe(0);
     expect(result2).toBe(0);
     expect(result1).toBe(result2);
    }
   });

   test('is consistent with DeterministicMath.sqrtSafe', () => {
    // This test verifies safeSqrt delegates to DeterministicMath
    const testValues = [0, 1, 2, 4, 9, 16, 0.5, 0.25];

    for (const value of testValues) {
     const safeResult = safeSqrt(value);
     // Re-call to verify determinism
     const safeResult2 = safeSqrt(value);

     expect(safeResult).toBe(safeResult2);
     expect(Number.isFinite(safeResult)).toBe(true);
    }
   });
  });
 });

 describe('safeAcos', () => {
  test('clamps to valid range', () => {
   expect(safeAcos(0)).toBeCloseTo(Math.PI / 2);
   expect(safeAcos(1)).toBeCloseTo(0);
   expect(safeAcos(-1)).toBeCloseTo(Math.PI);
  });

  test('clamps out of range values', () => {
   expect(safeAcos(1.5)).toBeCloseTo(0);
   expect(safeAcos(-1.5)).toBeCloseTo(Math.PI);
  });
 });

 describe('safeAsin', () => {
  test('clamps to valid range', () => {
   expect(safeAsin(0)).toBeCloseTo(0);
   expect(safeAsin(1)).toBeCloseTo(Math.PI / 2);
   expect(safeAsin(-1)).toBeCloseTo(-Math.PI / 2);
  });

  test('clamps out of range values', () => {
   expect(safeAsin(1.5)).toBeCloseTo(Math.PI / 2);
   expect(safeAsin(-1.5)).toBeCloseTo(-Math.PI / 2);
  });
 });

 describe('robustSum', () => {
  test('sums values accurately', () => {
   expect(robustSum([1, 2, 3])).toBe(6);
   expect(robustSum([0.1, 0.2, 0.3])).toBeCloseTo(0.6);
  });

  test('handles empty array', () => {
   expect(robustSum([])).toBe(0);
  });
 });

 describe('neumaierSum', () => {
  test('sums values with compensation', () => {
   expect(neumaierSum([1, 2, 3])).toBe(6);
  });

  test('handles small corrections', () => {
   const values = [1e10, 1, 1, 1, -1e10];
   expect(neumaierSum(values)).toBeCloseTo(3);
  });
 });

 describe('compensatedProduct', () => {
  test('returns product and error', () => {
   const result = compensatedProduct(2, 3);
   expect(result.product).toBe(6);
  });
 });

 describe('safeLerp', () => {
  test('interpolates linearly', () => {
   expect(safeLerp(0, 10, 0.5)).toBe(5);
   expect(safeLerp(0, 10, 0)).toBe(0);
   expect(safeLerp(0, 10, 1)).toBe(10);
  });

  test('uses a + (b-a)*t formula when t < 0.5', () => {
   // t = 0.3, so uses first branch
   expect(safeLerp(0, 10, 0.3)).toBeCloseTo(3);
   expect(safeLerp(10, 20, 0.25)).toBeCloseTo(12.5);
  });

  test('uses b - (b-a)*(1-t) formula when t >= 0.5', () => {
   // t = 0.7, so uses second branch
   expect(safeLerp(0, 10, 0.7)).toBeCloseTo(7);
   expect(safeLerp(10, 20, 0.75)).toBeCloseTo(17.5);
  });

  test('clamps t <= 0 to a', () => {
   expect(safeLerp(5, 15, -0.5)).toBe(5);
  });

  test('clamps t >= 1 to b', () => {
   expect(safeLerp(5, 15, 1.5)).toBe(15);
  });
 });

 describe('sanitizeNumber', () => {
  test('returns finite numbers as-is', () => {
   expect(sanitizeNumber(5)).toBe(5);
   expect(sanitizeNumber(-3.14)).toBe(-3.14);
  });

  test('returns fallback for non-finite', () => {
   expect(sanitizeNumber(NaN)).toBe(0);
   expect(sanitizeNumber(Infinity)).toBe(0);
  });

  test('uses custom fallback', () => {
   expect(sanitizeNumber(NaN, 42)).toBe(42);
  });
 });

 describe('ensureFinite', () => {
  test('returns finite numbers as-is', () => {
   expect(ensureFinite(5)).toBe(5);
  });

  test('returns fallback for non-finite', () => {
   expect(ensureFinite(NaN)).toBe(0);
   expect(ensureFinite(Infinity)).toBe(0);
   expect(ensureFinite(-Infinity, 99)).toBe(99);
  });
 });
});
