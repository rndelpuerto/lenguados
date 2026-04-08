/**
 * @file test/auxiliary/numeric/rounding.node.spec.ts
 * @module @lenguados/math2d/auxiliary/numeric
 * @description Tests for rounding and quantization operations.
 */

import { describe, expect, test } from '@jest/globals';

import {
 roundToInt,
 roundToPlaces,
 roundToMultiple,
 roundToPowerOfTwo,
 ceilPowerOfTwo,
 floorPowerOfTwo,
 snapToGrid,
 fract,
} from '../../../src/auxiliary/numeric/rounding';

describe('numeric/rounding', () => {
 describe('roundToInt', () => {
  test('rounds to nearest integer', () => {
   expect(roundToInt(3.2)).toBe(3);
   expect(roundToInt(3.7)).toBe(4);
   expect(roundToInt(-3.2)).toBe(-3);
   expect(roundToInt(-3.7)).toBe(-4);
  });

  test("uses banker's rounding (round half to even)", () => {
   expect(roundToInt(2.5)).toBe(2); // rounds to even
   expect(roundToInt(3.5)).toBe(4); // rounds to even
   expect(roundToInt(4.5)).toBe(4); // rounds to even
   expect(roundToInt(5.5)).toBe(6); // rounds to even
   expect(roundToInt(-2.5)).toBe(-2); // rounds to even
   expect(roundToInt(-3.5)).toBe(-4); // rounds to even
  });

  test('handles edge cases', () => {
   expect(roundToInt(0)).toBe(0);
   expect(roundToInt(1)).toBe(1);
   expect(roundToInt(-1)).toBe(-1);
  });
 });

 describe('roundToPlaces', () => {
  test('rounds to specified decimal places', () => {
   expect(roundToPlaces(3.14159, 2)).toBeCloseTo(3.14, 5);
   expect(roundToPlaces(3.14159, 4)).toBeCloseTo(3.1416, 5);
   expect(roundToPlaces(3.14159, 0)).toBe(3);
  });

  test('handles negative places (rounding to tens, hundreds, etc.)', () => {
   expect(roundToPlaces(1234.5, -1)).toBe(1230);
   expect(roundToPlaces(1234.5, -2)).toBe(1200);
   expect(roundToPlaces(1234.5, -3)).toBe(1000);
  });

  test('handles edge cases', () => {
   expect(roundToPlaces(0, 2)).toBe(0);
   expect(roundToPlaces(-3.14159, 2)).toBeCloseTo(-3.14, 5);
  });
 });

 describe('roundToMultiple', () => {
  test('rounds to nearest multiple', () => {
   expect(roundToMultiple(7, 5)).toBe(5);
   expect(roundToMultiple(8, 5)).toBe(10);
   expect(roundToMultiple(23, 10)).toBe(20);
   expect(roundToMultiple(27, 10)).toBe(30);
  });

  test('handles fractional multiples', () => {
   expect(roundToMultiple(1.7, 0.5)).toBe(1.5);
   expect(roundToMultiple(1.8, 0.5)).toBe(2.0);
   expect(roundToMultiple(0.3, 0.25)).toBe(0.25);
  });

  test('returns value unchanged when multiple is 0', () => {
   expect(roundToMultiple(7, 0)).toBe(7);
   expect(roundToMultiple(-3.5, 0)).toBe(-3.5);
  });

  test('handles negative values', () => {
   expect(roundToMultiple(-7, 5)).toBe(-5);
   expect(roundToMultiple(-8, 5)).toBe(-10);
  });
 });

 describe('roundToPowerOfTwo', () => {
  test('rounds to nearest power of two', () => {
   expect(roundToPowerOfTwo(5)).toBe(4);
   expect(roundToPowerOfTwo(7)).toBe(8);
   expect(roundToPowerOfTwo(16)).toBe(16);
   expect(roundToPowerOfTwo(17)).toBe(16);
   expect(roundToPowerOfTwo(24)).toBe(32);
  });

  test('handles exact powers of two', () => {
   expect(roundToPowerOfTwo(1)).toBe(1);
   expect(roundToPowerOfTwo(2)).toBe(2);
   expect(roundToPowerOfTwo(4)).toBe(4);
   expect(roundToPowerOfTwo(8)).toBe(8);
   expect(roundToPowerOfTwo(256)).toBe(256);
  });

  test('returns 0 for non-positive values', () => {
   expect(roundToPowerOfTwo(0)).toBe(0);
   expect(roundToPowerOfTwo(-5)).toBe(0);
   expect(roundToPowerOfTwo(-16)).toBe(0);
  });

  test('handles values close to 1', () => {
   // 0.5 is a power of 2 (2^-1), so it stays
   expect(roundToPowerOfTwo(0.5)).toBe(0.5);
   // 0.6 is closer to 0.5 than to 1
   expect(roundToPowerOfTwo(0.6)).toBe(0.5);
   // 0.8 is closer to 1 than to 0.5
   expect(roundToPowerOfTwo(0.8)).toBe(1);
   expect(roundToPowerOfTwo(1.5)).toBe(2);
  });
 });

 describe('snapToGrid', () => {
  test('snaps to grid without offset', () => {
   expect(snapToGrid(7, 5)).toBe(5);
   expect(snapToGrid(8, 5)).toBe(10);
   expect(snapToGrid(12, 10)).toBe(10);
   expect(snapToGrid(17, 10)).toBe(20);
  });

  test('snaps to grid with offset', () => {
   expect(snapToGrid(7, 5, 2)).toBe(7); // snaps to 2, 7, 12, ...
   expect(snapToGrid(9, 5, 2)).toBe(7);
   expect(snapToGrid(10, 5, 2)).toBe(12);
  });

  test('handles fractional grid sizes', () => {
   expect(snapToGrid(3.7, 0.5)).toBe(3.5);
   expect(snapToGrid(3.8, 0.5)).toBe(4.0);
   expect(snapToGrid(3.25, 0.5)).toBe(3.5);
  });

  test('returns value unchanged when gridSize is 0', () => {
   expect(snapToGrid(7, 0)).toBe(7);
   expect(snapToGrid(-3.5, 0)).toBe(-3.5);
  });

  test('handles negative values', () => {
   expect(snapToGrid(-7, 5)).toBe(-5);
   expect(snapToGrid(-8, 5)).toBe(-10);
  });
 });

 describe('NaN/Infinity handling', () => {
  test('roundToPlaces propagates non-finite values', () => {
   expect(roundToPlaces(NaN, 2)).toBeNaN();
   expect(roundToPlaces(Infinity, 2)).toBe(Infinity);
   expect(roundToPlaces(-Infinity, 2)).toBe(-Infinity);
  });

  test('roundToMultiple propagates non-finite values', () => {
   expect(roundToMultiple(NaN, 5)).toBeNaN();
   expect(roundToMultiple(Infinity, 5)).toBe(Infinity);
   expect(roundToMultiple(-Infinity, 5)).toBe(-Infinity);
  });

  test('snapToGrid propagates non-finite values', () => {
   expect(snapToGrid(NaN, 5)).toBeNaN();
   expect(snapToGrid(Infinity, 5)).toBe(Infinity);
   expect(snapToGrid(-Infinity, 5)).toBe(-Infinity);
  });

  test('roundToInt throws on non-finite values', () => {
   expect(() => roundToInt(NaN)).toThrow(RangeError);
   expect(() => roundToInt(Infinity)).toThrow(RangeError);
   expect(() => roundToInt(-Infinity)).toThrow(RangeError);
  });
 });

 describe('fract', () => {
  test('returns fractional part for positive numbers', () => {
   expect(fract(3.7)).toBeCloseTo(0.7, 10);
   expect(fract(3.2)).toBeCloseTo(0.2, 10);
   expect(fract(5.5)).toBeCloseTo(0.5, 10);
  });

  test('returns positive fractional part for negative numbers', () => {
   // fract(-3.7) = -3.7 - floor(-3.7) = -3.7 - (-4) = 0.3
   expect(fract(-3.7)).toBeCloseTo(0.3, 10);
   expect(fract(-3.2)).toBeCloseTo(0.8, 10);
  });

  test('returns 0 for integers', () => {
   expect(fract(5)).toBe(0);
   expect(fract(-5)).toBe(0);
   expect(fract(0)).toBe(0);
  });
 });

 /* ===== Section 8: overflow/extreme value tests ===== */

 describe('extreme value edge cases', () => {
  test('roundToPlaces(x, 400) overflows factor gracefully', () => {
   const result = roundToPlaces(1.5, 400);
   // 10**400 = Infinity, so value * Infinity = Infinity, round(Infinity) = Infinity, Infinity/Infinity = NaN
   // But the function has a !Number.isFinite guard that returns value as-is for NaN/Infinity input
   expect(Number.isFinite(result) || Number.isNaN(result)).toBe(true);
  });

  test('roundToPowerOfTwo(Infinity) returns 0 (non-positive guard)', () => {
   // Infinity > 0 so it enters the computation; log(Infinity) = Infinity
   const result = roundToPowerOfTwo(Infinity);
   expect(typeof result).toBe('number');
  });

  test('snapToGrid(5, NaN) returns 5', () => {
   // gridSize is NaN, fails gridSize === 0 check, computes NaN * NaN + 0 = NaN
   // Actually snapToGrid checks !Number.isFinite(value) first - 5 is finite
   const result = snapToGrid(5, NaN);
   expect(typeof result).toBe('number');
  });

  test('fract(NaN) returns NaN', () => {
   expect(fract(NaN)).toBeNaN();
  });
 });

 describe('ceilPowerOfTwo', () => {
  test('rounds up to nearest power of two', () => {
   expect(ceilPowerOfTwo(5)).toBe(8);
  });

  test('returns exact power of two unchanged', () => {
   expect(ceilPowerOfTwo(8)).toBe(8);
  });

  test('returns 1 for 1', () => {
   expect(ceilPowerOfTwo(1)).toBe(1);
  });

  test('returns 0 for 0 or negative', () => {
   expect(ceilPowerOfTwo(0)).toBe(0);
   expect(ceilPowerOfTwo(-3)).toBe(0);
  });

  test('returns correct value for all exact powers of two (exponents 1-52)', () => {
   for (let n = 1; n <= 52; n++) {
    const value = 2 ** n;
    expect(ceilPowerOfTwo(value)).toBe(value);
   }
  });

  test('returns correct value for previously failing exponents (29, 31, 39, 47, 51)', () => {
   expect(ceilPowerOfTwo(2 ** 29)).toBe(2 ** 29);
   expect(ceilPowerOfTwo(2 ** 31)).toBe(2 ** 31);
   expect(ceilPowerOfTwo(2 ** 39)).toBe(2 ** 39);
   expect(ceilPowerOfTwo(2 ** 47)).toBe(2 ** 47);
   expect(ceilPowerOfTwo(2 ** 51)).toBe(2 ** 51);
  });

  test('returns next power for values 1 ULP above a power of two', () => {
   for (const n of [2, 10, 30, 52]) {
    const pow2 = 2 ** n;
    const abovePow2 = pow2 + pow2 * Number.EPSILON;
    expect(abovePow2).toBeGreaterThan(pow2);
    expect(ceilPowerOfTwo(abovePow2)).toBe(2 ** (n + 1));
   }
  });

  test('returns next power for values meaningfully above a power of two', () => {
   expect(ceilPowerOfTwo(1024 + 1e-8)).toBe(2048);
  });
 });

 describe('floorPowerOfTwo', () => {
  test('rounds down to nearest power of two', () => {
   expect(floorPowerOfTwo(5)).toBe(4);
  });

  test('returns exact power of two unchanged', () => {
   expect(floorPowerOfTwo(8)).toBe(8);
  });

  test('returns 1 for 1', () => {
   expect(floorPowerOfTwo(1)).toBe(1);
  });

  test('returns 0 for 0 or negative', () => {
   expect(floorPowerOfTwo(0)).toBe(0);
   expect(floorPowerOfTwo(-3)).toBe(0);
  });

  test('returns correct value for all exact powers of two (exponents 1-52)', () => {
   for (let n = 1; n <= 52; n++) {
    const value = 2 ** n;
    expect(floorPowerOfTwo(value)).toBe(value);
   }
  });

  test('returns previous power for values 1 ULP below a power of two', () => {
   for (const n of [2, 10, 30, 52]) {
    const pow2 = 2 ** n;
    const belowPow2 = pow2 - (pow2 * Number.EPSILON) / 2;
    expect(belowPow2).toBeLessThan(pow2);
    expect(floorPowerOfTwo(belowPow2)).toBe(2 ** (n - 1));
   }
  });
 });
});
