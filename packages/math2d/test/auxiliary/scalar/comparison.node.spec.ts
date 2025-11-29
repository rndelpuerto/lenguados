/**
 * @file tests/auxiliary/scalar/comparison.spec.ts
 * @module @lenguados/math2d/auxiliary/scalar
 * @description Focused tests for relativeEquals and inRange helpers
 */

import { describe, expect, test } from '@jest/globals';

import { inRange, relativeEquals } from '../../../src/auxiliary/scalar/comparison';

describe('scalar/comparison – focused behaviors', () => {
 describe('relativeEquals', () => {
  test('compares values with relative tolerance', () => {
   expect(relativeEquals(100, 101, 0.01)).toBe(true);
   expect(relativeEquals(100, 102, 0.01)).toBe(false);
   expect(relativeEquals(1000, 1010, 0.01)).toBe(true);
   expect(relativeEquals(1000, 1020, 0.01)).toBe(false);
  });

  test('handles small numbers using minimum scale of 1', () => {
   // scale = max(1, 0.001, 0.002) = 1, threshold = 0.01 * 1 = 0.01
   // diff = 0.001, 0.001 <= 0.01, so true
   expect(relativeEquals(0.001, 0.002, 0.01)).toBe(true);
   expect(relativeEquals(0.001, 0.0010000001, 0.01)).toBe(true);
  });

  test('treats zero epsilon as strict equality', () => {
   expect(relativeEquals(5, 5, 0)).toBe(true);
   expect(relativeEquals(5, 5.0000001, 0)).toBe(false);
  });

  test('scales tolerance with large magnitudes symmetrically', () => {
   const base = 1e8;
   const delta = base * 0.0005;
   expect(relativeEquals(base, base + delta, 0.001)).toBe(true);
   expect(relativeEquals(-base, -(base + delta), 0.001)).toBe(true);
   expect(relativeEquals(base, base + delta * 3, 0.001)).toBe(false);
  });

  test('throws when epsilon is negative', () => {
   expect(() => relativeEquals(1, 2, -0.1)).toThrow(RangeError);
  });
 });

 describe('inRange', () => {
  test('checks inclusion with default epsilon', () => {
   expect(inRange(5, 0, 10)).toBe(true);
   expect(inRange(0, 0, 10)).toBe(true);
   expect(inRange(10, 0, 10)).toBe(true);
   expect(inRange(-0.0000000001, 0, 10)).toBe(true);
   expect(inRange(10.0000000001, 0, 10)).toBe(true);
   expect(inRange(-0.1, 0, 10)).toBe(false);
   expect(inRange(10.1, 0, 10)).toBe(false);
  });

  test('uses custom epsilon when provided', () => {
   expect(inRange(-0.5, 0, 10, 1)).toBe(true);
   expect(inRange(10.5, 0, 10, 1)).toBe(true);
   expect(inRange(-1.5, 0, 10, 1)).toBe(false);
   expect(inRange(11.5, 0, 10, 1)).toBe(false);
  });

  test('returns false when min is greater than max', () => {
   expect(inRange(5, 10, 0)).toBe(false);
  });

  test('fails fast on NaN inputs', () => {
   expect(inRange(NaN, 0, 10)).toBe(false);
   expect(inRange(5, NaN, 10)).toBe(false);
   expect(inRange(5, 0, NaN)).toBe(false);
  });
 });
});
