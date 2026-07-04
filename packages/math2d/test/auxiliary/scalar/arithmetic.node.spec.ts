/**
 * @file test/auxiliary/scalar/arithmetic.node.spec.ts
 * @module @lenguados/math2d/auxiliary/scalar
 * @description Focused tests for loop, clamp, saturate, mod, floorDivide helpers.
 */

import { describe, expect, test } from '@jest/globals';

import {
 clamp,
 floorDivide,
 floorDivideSafe,
 floorDivideUnchecked,
 loop,
 loopSafe,
 loopUnchecked,
 mod as module_,
 modSafe,
 modUnchecked,
 saturate,
 sign,
 step,
} from '../../../src/auxiliary/scalar/arithmetic';

describe('scalar/arithmetic – focused behaviors', () => {
 describe('loop', () => {
  test('wraps values within the specified bounds', () => {
   expect(loop(5, 0, 10)).toBe(5);
   expect(loop(-1, 0, 10)).toBe(9);
   expect(loop(10, 0, 10)).toBe(0);
   expect(loop(15, 0, 10)).toBe(5);
  });

  test('handles ranges that cross zero', () => {
   expect(loop(0, -5, 5)).toBe(0);
   expect(loop(7, -5, 5)).toBe(-3);
   expect(loop(-7, -5, 5)).toBe(3);
  });

  test('throws for collapsed range', () => {
   expect(() => loop(42, 5, 5)).toThrow(RangeError);
   expect(() => loop(-10, 2, -3)).toThrow(RangeError);
  });

  test('keeps results stable for very large magnitudes', () => {
   const huge = 1e9 + 0.25;
   expect(loop(huge, -1, 1)).toBeCloseTo(0.25, 12);
   expect(loop(-huge, -1, 1)).toBeCloseTo(-0.25, 12);
  });
 });

 describe('clamp', () => {
  test('clamps values to range', () => {
   expect(clamp(5, 0, 10)).toBe(5);
   expect(clamp(-5, 0, 10)).toBe(0);
   expect(clamp(15, 0, 10)).toBe(10);
  });
 });

 describe('sign', () => {
  test('returns sign of value', () => {
   expect(sign(5)).toBe(1);
   expect(sign(-5)).toBe(-1);
   expect(sign(0)).toBe(0);
  });
 });

 describe('saturate', () => {
  test('clamps to [0, 1]', () => {
   expect(saturate(0.5)).toBe(0.5);
   expect(saturate(-0.5)).toBe(0);
   expect(saturate(1.5)).toBe(1);
  });
 });

 describe('step', () => {
  test('returns 0 or 1 based on edge', () => {
   expect(step(0.5, 0.3)).toBe(0);
   expect(step(0.5, 0.5)).toBe(1);
   expect(step(0.5, 0.7)).toBe(1);
  });
 });

 // mix() was removed - it was a redundant alias for lerp()
 // See MATH2D_DEEP_AUDIT.md Section 9.1 for details

 describe('mod', () => {
  test('returns positive modulo', () => {
   expect(module_(5, 3)).toBe(2);
   expect(module_(-5, 3)).toBe(1);
  });

  test('throws for non-positive divisor', () => {
   expect(() => module_(5, -3)).toThrow(RangeError);
   expect(() => module_(5, 0)).toThrow(RangeError);
  });
 });

 describe('floorDivide', () => {
  test('returns floor of division', () => {
   expect(floorDivide(7, 3)).toBe(2);
   expect(floorDivide(-7, 3)).toBe(-3);
  });

  test('throws for zero divisor', () => {
   expect(() => floorDivide(7, 0)).toThrow(RangeError);
  });
 });

 describe('floorDivideSafe', () => {
  test('returns floor of division for valid divisor', () => {
   expect(floorDivideSafe(7, 3)).toBe(2);
   expect(floorDivideSafe(-7, 3)).toBe(-3);
  });

  test('returns 0 for zero divisor', () => {
   expect(floorDivideSafe(7, 0)).toBe(0);
  });
 });

 describe('floorDivideUnchecked', () => {
  test('returns floor of division without validation', () => {
   expect(floorDivideUnchecked(7, 3)).toBe(2);
   expect(floorDivideUnchecked(-7, 3)).toBe(-3);
  });
 });

 describe('modUnchecked', () => {
  test('returns positive modulo without validation', () => {
   expect(modUnchecked(7, 3)).toBe(1);
   expect(modUnchecked(-7, 3)).toBe(2);
   expect(modUnchecked(10, 4)).toBe(2);
  });
 });

 describe('loopUnchecked', () => {
  test('wraps value into range without validation', () => {
   expect(loopUnchecked(5, 0, 4)).toBe(1);
   expect(loopUnchecked(-1, 0, 4)).toBe(3);
   expect(loopUnchecked(8, 2, 5)).toBe(2);
  });
 });

 describe('loopSafe', () => {
  test('delegates to loop for valid range', () => {
   expect(loopSafe(5, 0, 10)).toBe(5);
   expect(loopSafe(15, 0, 10)).toBe(5);
  });

  test('returns min for invalid range (max <= min)', () => {
   expect(loopSafe(5, 5, 5)).toBe(5);
   expect(loopSafe(5, 10, 0)).toBe(10);
  });
 });

 describe('modSafe', () => {
  test('returns positive modulo for positive divisor', () => {
   expect(modSafe(7, 3)).toBe(1);
   expect(modSafe(-7, 3)).toBe(2);
  });

  test('returns 0 for non-positive divisor', () => {
   expect(modSafe(7, 0)).toBe(0);
   expect(modSafe(7, -3)).toBe(0);
  });
 });

 /* ===== Section 8: NaN/Infinity edge case tests ===== */

 describe('NaN behavior for scalar functions', () => {
  test('clamp(5, NaN, 10) returns 5 (NaN comparisons are false)', () => {
   expect(clamp(5, NaN, 10)).toBe(5);
  });

  test('sign(NaN) propagates NaN (V9-Scalar-01 per IEEE 754 §6.2)', () => {
   expect(sign(Number.NaN)).toBeNaN();
  });

  test('sign(+Infinity) returns +1', () => {
   expect(sign(Number.POSITIVE_INFINITY)).toBe(1);
  });

  test('sign(-Infinity) returns -1', () => {
   expect(sign(Number.NEGATIVE_INFINITY)).toBe(-1);
  });

  test('sign(-0) returns 0 (IEEE 754 §5.11: -0 == 0)', () => {
   expect(sign(-0)).toBe(0);
  });

  test('step(NaN, 5) returns 1 (5 is not < NaN)', () => {
   expect(step(NaN, 5)).toBe(1);
  });

  test('loop(Infinity, 0, 10) returns NaN', () => {
   expect(loop(Infinity, 0, 10)).toBeNaN();
  });

  test('sign(-0) returns 0', () => {
   expect(sign(-0)).toBe(0);
  });
 });

 describe('degenerate range tests', () => {
  test('clamp with min > max returns min (5 < 10 is true)', () => {
   expect(clamp(5, 10, 0)).toBe(10);
  });
 });
});
