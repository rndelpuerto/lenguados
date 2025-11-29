/**
 * @file tests/auxiliary/numeric/safety.spec.ts
 * @module @lenguados/math2d/auxiliary/numeric
 * @description Focused coverage for numeric safety helpers.
 */

import { describe, expect, test } from '@jest/globals';

import { safeLog, safeMod, safePow } from '../../../src/auxiliary/numeric/safety';

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
   expect(safeMod(7, 3)).toBe(1);
   expect(safeMod(-7, 3)).toBe(2);
  });

  test('keeps the result aligned with the divisor sign', () => {
   expect(safeMod(7, -3)).toBe(-2);
   expect(safeMod(-7, -3)).toBe(-1);
  });

  test('returns 0 for zero divisors', () => {
   expect(safeMod(10, 0)).toBe(0);
  });

  test('stays within divisor range even after many wraps', () => {
   expect(safeMod(30, 7)).toBe(2);
   expect(safeMod(-30, 7)).toBe(5);
   expect(safeMod(30, -7)).toBe(-5);
  });
 });
});
