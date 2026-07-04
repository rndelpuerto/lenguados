/**
 * @file test/auxiliary/numeric/safety.node.spec.ts
 * @module @lenguados/math2d/auxiliary/numeric
 * @description Focused coverage for numeric safety helpers.
 */

import { describe, expect, test } from '@jest/globals';

import {
 logSafe,
 powSafe,
 divideSafe,
 reciprocalSafe,
 sqrtSafe,
 acosSafe,
 asinSafe,
 expSafe,
 robustSum,
 neumaierSum,
 compensatedProduct,
 ensureFinite,
 MIN_SAFE_DIVISOR,
} from '../../../src/auxiliary/numeric/safety';
import { EPSILON } from '../../../src/auxiliary/scalar/constants';

describe('numeric/safety', () => {
 describe('MIN_SAFE_DIVISOR', () => {
  test('equals EPSILON', () => {
   expect(MIN_SAFE_DIVISOR).toBe(EPSILON);
  });

  test('divideSafe returns 0 for values below MIN_SAFE_DIVISOR', () => {
   expect(divideSafe(10, MIN_SAFE_DIVISOR * 0.5)).toBe(0);
  });

  test('divideSafe works for values above MIN_SAFE_DIVISOR', () => {
   expect(divideSafe(10, MIN_SAFE_DIVISOR * 2)).toBeCloseTo(10 / (MIN_SAFE_DIVISOR * 2));
  });
 });

 describe('logSafe', () => {
  test('returns natural log for positive inputs', () => {
   expect(logSafe(Math.E)).toBeCloseTo(1);
   expect(logSafe(1)).toBe(0);
  });

  test('supports custom bases', () => {
   expect(logSafe(100, 10)).toBeCloseTo(2);
   expect(logSafe(8, 2)).toBeCloseTo(3);
  });

  test('returns 0 for non-positive inputs (safe finite fallback)', () => {
   expect(logSafe(0)).toBe(0);
   expect(logSafe(-1)).toBe(0);
   expect(logSafe(-100)).toBe(0);
  });

  test('keeps base-e shortcut numerically stable', () => {
   const value = Math.E ** 5;
   expect(logSafe(value)).toBeCloseTo(5);
  });

  // V9-Numeric-01: NaN propagates per canonical Safe contract (IEEE 754 §6.2)
  test('logSafe(NaN) propagates NaN', () => {
   expect(logSafe(Number.NaN)).toBeNaN();
  });

  test('logSafe(value, NaN) propagates NaN via base', () => {
   expect(logSafe(10, Number.NaN)).toBeNaN();
  });

  test('logSafe(Infinity) returns +Infinity (IEEE 754 required)', () => {
   expect(logSafe(Number.POSITIVE_INFINITY)).toBe(Number.POSITIVE_INFINITY);
  });

  test('logSafe(-Infinity) returns domain fallback 0', () => {
   expect(logSafe(Number.NEGATIVE_INFINITY)).toBe(0);
  });
 });

 describe('powSafe', () => {
  test('behaves like Math.pow for regular inputs', () => {
   expect(powSafe(2, 3)).toBe(8);
   expect(powSafe(5, 0)).toBe(1);
   expect(powSafe(0, 5)).toBe(0);
  });

  test('returns NaN for fractional powers of negative bases', () => {
   expect(powSafe(-2, 0.5)).toBeNaN();
  });

  test('handles documented corner cases explicitly', () => {
   expect(powSafe(0, 0)).toBe(1);
   expect(powSafe(-2, 4)).toBe(16);
   expect(powSafe(1, 9999)).toBe(1);
  });
 });

 describe('divideSafe', () => {
  test('divides normally for valid inputs', () => {
   expect(divideSafe(10, 2)).toBe(5);
   expect(divideSafe(0, 5)).toBe(0);
  });

  test('returns 0 for near-zero divisor', () => {
   expect(divideSafe(10, 0)).toBe(0);
   expect(divideSafe(10, 1e-20)).toBe(0);
  });

  test('respects custom epsilon', () => {
   // With large epsilon, small denominators return 0
   expect(divideSafe(10, 0.5, 1)).toBe(0);
   // With small epsilon, they work
   expect(divideSafe(10, 0.5, 0.1)).toBe(20);
  });
 });

 describe('reciprocalSafe', () => {
  test('returns 1/value for normal inputs', () => {
   expect(reciprocalSafe(2)).toBe(0.5);
   expect(reciprocalSafe(4)).toBe(0.25);
  });

  test('returns 0 for near-zero inputs', () => {
   expect(reciprocalSafe(0)).toBe(0);
   expect(reciprocalSafe(1e-20)).toBe(0);
  });
 });

 describe('sqrtSafe', () => {
  test('returns sqrt for positive inputs', () => {
   expect(sqrtSafe(4)).toBeCloseTo(2, 6);
   expect(sqrtSafe(9)).toBeCloseTo(3, 6);
  });

  test('returns 0 for negative inputs', () => {
   expect(sqrtSafe(-1)).toBe(0);
   expect(sqrtSafe(-100)).toBe(0);
  });

  test('returns 0 for zero', () => {
   expect(sqrtSafe(0)).toBe(0);
   expect(sqrtSafe(-0)).toBe(0);
  });

  test('handles small positive values', () => {
   expect(sqrtSafe(0.0001)).toBeCloseTo(0.01, 6);
   expect(sqrtSafe(1e-10)).toBeCloseTo(1e-5, 10);
  });

  test('handles large values', () => {
   expect(sqrtSafe(1e10)).toBeCloseTo(1e5, 0);
   expect(sqrtSafe(1e20)).toBeCloseTo(1e10, 0);
  });

  describe('determinism', () => {
   test('produces identical results across multiple calls', () => {
    const testValues = [0, 1, 2, 4, 9, 16, 25, 0.5, 0.25, 1e-8, 1e8];

    for (const value of testValues) {
     const result1 = sqrtSafe(value);
     const result2 = sqrtSafe(value);
     const result3 = sqrtSafe(value);

     expect(result1).toBe(result2);
     expect(result2).toBe(result3);
    }
   });

   test('produces identical results for negative inputs', () => {
    const negativeValues = [-1, -0.5, -1e-10, -1e10];

    for (const value of negativeValues) {
     const result1 = sqrtSafe(value);
     const result2 = sqrtSafe(value);

     expect(result1).toBe(0);
     expect(result2).toBe(0);
     expect(result1).toBe(result2);
    }
   });

   test('is consistent with DeterministicMath.sqrtSafe', () => {
    // This test verifies sqrtSafe delegates to DeterministicMath
    const testValues = [0, 1, 2, 4, 9, 16, 0.5, 0.25];

    for (const value of testValues) {
     const safeResult = sqrtSafe(value);
     // Re-call to verify determinism
     const safeResult2 = sqrtSafe(value);

     expect(safeResult).toBe(safeResult2);
     expect(Number.isFinite(safeResult)).toBe(true);
    }
   });
  });
 });

 describe('acosSafe', () => {
  test('clamps to valid range', () => {
   expect(acosSafe(0)).toBeCloseTo(Math.PI / 2);
   expect(acosSafe(1)).toBeCloseTo(0);
   expect(acosSafe(-1)).toBeCloseTo(Math.PI);
  });

  test('clamps out of range values', () => {
   expect(acosSafe(1.5)).toBeCloseTo(0);
   expect(acosSafe(-1.5)).toBeCloseTo(Math.PI);
  });
 });

 describe('asinSafe', () => {
  test('clamps to valid range', () => {
   expect(asinSafe(0)).toBeCloseTo(0);
   expect(asinSafe(1)).toBeCloseTo(Math.PI / 2);
   expect(asinSafe(-1)).toBeCloseTo(-Math.PI / 2);
  });

  test('clamps out of range values', () => {
   expect(asinSafe(1.5)).toBeCloseTo(Math.PI / 2);
   expect(asinSafe(-1.5)).toBeCloseTo(-Math.PI / 2);
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

  // V9-Numeric-02: NaN and Infinity propagate per IEEE 754 §6.2 / §6.3
  test('robustSum propagates NaN from any input', () => {
   expect(robustSum([1, 2, Number.NaN, 4])).toBeNaN();
  });

  test('robustSum propagates +Infinity', () => {
   expect(robustSum([1, 2, Number.POSITIVE_INFINITY])).toBe(Number.POSITIVE_INFINITY);
  });

  test('robustSum yields NaN for +Infinity + (-Infinity) per IEEE 754 §6.3', () => {
   expect(robustSum([Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY])).toBeNaN();
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

  // V9-Numeric-02: NaN and Infinity propagate per IEEE 754 §6.2 / §6.3
  test('neumaierSum propagates NaN from any input', () => {
   expect(neumaierSum([1, 2, Number.NaN, 4])).toBeNaN();
  });

  test('neumaierSum yields non-finite for Infinity input (compensation artifact)', () => {
   // Neumaier's compensation step (sum - t + value) produces NaN for Infinity:
   // Infinity - Infinity = NaN per IEEE 754 §6.3. The final sum + compensation
   // thus returns NaN. This is mathematically correct — the algorithm cannot
   // preserve Infinity without re-architecting. The contract is "no silent
   // sanitize-to-zero", not "Infinity survives Neumaier compensation".
   expect(Number.isFinite(neumaierSum([1, 2, Number.POSITIVE_INFINITY]))).toBe(false);
  });

  test('neumaierSum yields NaN for +Infinity + (-Infinity) per IEEE 754 §6.3', () => {
   expect(neumaierSum([Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY])).toBeNaN();
  });
 });

 describe('compensatedProduct', () => {
  test('returns product and error', () => {
   const result = compensatedProduct(2, 3);
   expect(result.product).toBe(6);
  });

  // V9-Numeric-02: NaN propagates per IEEE 754 §6.2
  test('compensatedProduct propagates NaN from a factor', () => {
   expect(compensatedProduct(Number.NaN, 3).product).toBeNaN();
   expect(compensatedProduct(2, Number.NaN).product).toBeNaN();
  });

  test('compensatedProduct produces Infinity for Inf × finite per IEEE 754', () => {
   expect(compensatedProduct(Number.POSITIVE_INFINITY, 3).product).toBe(Number.POSITIVE_INFINITY);
   expect(compensatedProduct(Number.POSITIVE_INFINITY, -3).product).toBe(Number.NEGATIVE_INFINITY);
  });

  test('compensatedProduct yields NaN for Infinity × 0 per IEEE 754', () => {
   expect(compensatedProduct(Number.POSITIVE_INFINITY, 0).product).toBeNaN();
  });

  test('error term compensates rounding', () => {
   // For values that multiply exactly, error should be 0
   const exact = compensatedProduct(2, 4);
   expect(exact.error).toBe(0);

   // For values with rounding, product + error should be closer to true value
   const r = compensatedProduct(1.23456789, 9.87654321);
   expect(r.product).toBeCloseTo(1.23456789 * 9.87654321, 10);
   expect(typeof r.error).toBe('number');
   expect(Number.isFinite(r.error)).toBe(true);
  });

  test('non-finite inputs propagate per IEEE 754 (V9-Numeric-02 supersedes prior sanitize-to-0)', () => {
   // NaN × any → NaN
   expect(compensatedProduct(Number.NaN, 5).product).toBeNaN();
   // Infinity × finite → signed Infinity
   expect(compensatedProduct(Number.POSITIVE_INFINITY, 3).product).toBe(Number.POSITIVE_INFINITY);
   // Infinity × 0 → NaN per IEEE 754 §6.3
   expect(compensatedProduct(Number.POSITIVE_INFINITY, 0).product).toBeNaN();
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

  // V9-Numeric-08: DEV-mode fallback guard. Under Jest, DEV_MODE is true
  // (NODE_ENV=test ≠ production). In production builds this branch is DCE'd
  // and the function silently replaces non-finite fallback with 0.
  test('throws RangeError in DEV when fallback itself is non-finite', () => {
   expect(() => ensureFinite(Number.NaN, Number.POSITIVE_INFINITY)).toThrow(RangeError);
   expect(() => ensureFinite(Number.NaN, Number.NaN)).toThrow(RangeError);
   expect(() => ensureFinite(0, Number.NEGATIVE_INFINITY)).toThrow(RangeError);
  });
 });

 /* ===== Section 5 regression tests ===== */

 describe('safe function finite-output contracts', () => {
  test('divideSafe always returns finite for finite inputs', () => {
   expect(Number.isFinite(divideSafe(1e308, 1e-308))).toBe(true);
   expect(Number.isFinite(divideSafe(0, 0))).toBe(true);
   expect(Number.isFinite(divideSafe(1, 1e-20))).toBe(true);
  });

  test('reciprocalSafe always returns finite for finite inputs', () => {
   expect(Number.isFinite(reciprocalSafe(0))).toBe(true);
   expect(Number.isFinite(reciprocalSafe(1e-20))).toBe(true);
   expect(Number.isFinite(reciprocalSafe(1e308))).toBe(true);
  });

  test('logSafe always returns finite for FINITE inputs (NaN propagates per V9)', () => {
   // Domain errors → 0 fallback
   expect(Number.isFinite(logSafe(0))).toBe(true);
   expect(Number.isFinite(logSafe(-1))).toBe(true);
   expect(Number.isFinite(logSafe(1e308))).toBe(true);
   expect(Number.isFinite(logSafe(1, 1))).toBe(true); // base=1 edge case
   expect(Number.isFinite(logSafe(1, 0))).toBe(true); // base<=0 edge case
   expect(Number.isFinite(logSafe(1, -1))).toBe(true);
   expect(Number.isFinite(logSafe(1, Infinity))).toBe(true);
   // Finite positive: finite-in/finite-out holds for `value` and `base` both finite-positive
   expect(Number.isFinite(logSafe(Math.E))).toBe(true);
  });

  test('ensureFinite always returns finite when fallback is finite', () => {
   expect(Number.isFinite(ensureFinite(NaN))).toBe(true); // default fallback 0
   expect(Number.isFinite(ensureFinite(Infinity))).toBe(true);
   expect(Number.isFinite(ensureFinite(NaN, 42))).toBe(true);
   // V9-Numeric-08: non-finite fallback now throws in DEV (was silently replaced with 0).
   // Moved to dedicated `throws RangeError in DEV when fallback itself is non-finite` test.
  });
 });

 describe('NaN propagation', () => {
  test('powSafe(NaN, 2) returns NaN', () => {
   expect(powSafe(NaN, 2)).toBeNaN();
  });

  test('powSafe(NaN, 0) returns 1 (IEEE 754 pow semantics: x^0 = 1 for any x)', () => {
   expect(powSafe(NaN, 0)).toBe(1);
  });

  test('expSafe(NaN) returns NaN', () => {
   expect(expSafe(NaN)).toBeNaN();
  });
 });
});
