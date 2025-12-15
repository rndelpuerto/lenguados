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
 snapToGrid,
 quantize,
 trunc,
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

 describe('quantize', () => {
  test('quantizes to specified number of levels', () => {
   // 5 levels: 0, 0.25, 0.5, 0.75, 1
   expect(quantize(0.7, 5, 0, 1)).toBe(0.75);
   expect(quantize(0.6, 5, 0, 1)).toBe(0.5);
   expect(quantize(0.1, 5, 0, 1)).toBe(0);
   expect(quantize(0.9, 5, 0, 1)).toBe(1);
  });

  test('quantizes to 3 levels', () => {
   // 3 levels: 0, 0.5, 1
   expect(quantize(0.3, 3, 0, 1)).toBe(0.5);
   expect(quantize(0.2, 3, 0, 1)).toBe(0);
   expect(quantize(0.8, 3, 0, 1)).toBe(1);
  });

  test('works with custom ranges', () => {
   // 5 levels in [0, 10]: 0, 2.5, 5, 7.5, 10
   expect(quantize(7, 5, 0, 10)).toBe(7.5);
   expect(quantize(3, 5, 0, 10)).toBe(2.5);
  });

  test('returns min when levels <= 1', () => {
   expect(quantize(0.5, 1, 0, 1)).toBe(0);
   expect(quantize(0.5, 0, 0, 1)).toBe(0);
   expect(quantize(5, 1, 0, 10)).toBe(0);
  });

  test('clamps values outside range', () => {
   expect(quantize(-0.5, 5, 0, 1)).toBe(0);
   expect(quantize(1.5, 5, 0, 1)).toBe(1);
  });
 });

 describe('trunc', () => {
  test('truncates towards zero', () => {
   expect(trunc(3.7)).toBe(3);
   expect(trunc(3.2)).toBe(3);
   expect(trunc(-3.7)).toBe(-3);
   expect(trunc(-3.2)).toBe(-3);
  });

  test('handles integers', () => {
   expect(trunc(5)).toBe(5);
   expect(trunc(-5)).toBe(-5);
   expect(trunc(0)).toBe(0);
  });

  test('handles small fractional values', () => {
   expect(trunc(0.9)).toBe(0);
   // Note: trunc(-0.9) returns -0 in JavaScript, which equals 0
   expect(trunc(-0.9) === 0).toBe(true);
   expect(trunc(0.1)).toBe(0);
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
});
