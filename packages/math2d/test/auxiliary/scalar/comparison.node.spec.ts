/**
 * @file tests/auxiliary/scalar/comparison.spec.ts
 * @module @lenguados/math2d/auxiliary/scalar
 * @description Comprehensive tests for scalar comparison operations
 */

import { describe, expect, test } from '@jest/globals';

import {
 greaterThan,
 inRange,
 isNearOne,
 isNearZero,
 lessThan,
 nearEquals,
 relativeEquals,
} from '../../../src/auxiliary/scalar/comparison';

describe('scalar/comparison', () => {
 describe('nearEquals', () => {
  test('returns true for equal values', () => {
   expect(nearEquals(1.0, 1.0)).toBe(true);
   expect(nearEquals(0, 0)).toBe(true);
   expect(nearEquals(-5, -5)).toBe(true);
  });

  test('returns true for values within default epsilon', () => {
   expect(nearEquals(1.0, 1.0 + 1e-11)).toBe(true);
   expect(nearEquals(0, 1e-11)).toBe(true);
  });

  test('returns false for values outside epsilon', () => {
   expect(nearEquals(1.0, 2.0)).toBe(false);
   expect(nearEquals(0, 0.1)).toBe(false);
  });

  test('uses custom epsilon', () => {
   expect(nearEquals(1.0, 1.01, 0.1)).toBe(true);
   expect(nearEquals(1.0, 1.2, 0.1)).toBe(false);
  });

  test('handles negative values', () => {
   expect(nearEquals(-1.0, -1.0 + 1e-11)).toBe(true);
   expect(nearEquals(-1.0, -2.0)).toBe(false);
  });
 });

 describe('isNearZero', () => {
  test('returns true for zero', () => {
   expect(isNearZero(0)).toBe(true);
  });

  test('returns true for values within default epsilon', () => {
   expect(isNearZero(1e-11)).toBe(true);
   expect(isNearZero(-1e-11)).toBe(true);
  });

  test('returns false for values outside epsilon', () => {
   expect(isNearZero(0.1)).toBe(false);
   expect(isNearZero(-0.1)).toBe(false);
  });

  test('uses custom epsilon', () => {
   expect(isNearZero(0.05, 0.1)).toBe(true);
   expect(isNearZero(0.15, 0.1)).toBe(false);
  });
 });

 describe('isNearOne', () => {
  test('returns true for one', () => {
   expect(isNearOne(1)).toBe(true);
  });

  test('returns true for values within default epsilon of 1', () => {
   expect(isNearOne(1 + 1e-11)).toBe(true);
   expect(isNearOne(1 - 1e-11)).toBe(true);
  });

  test('returns false for values outside epsilon', () => {
   expect(isNearOne(0.9)).toBe(false);
   expect(isNearOne(1.1)).toBe(false);
  });

  test('uses custom epsilon', () => {
   expect(isNearOne(1.05, 0.1)).toBe(true);
   expect(isNearOne(1.15, 0.1)).toBe(false);
  });
 });

 describe('lessThan', () => {
  test('returns true when a is clearly less than b', () => {
   expect(lessThan(1.0, 2.0)).toBe(true);
   expect(lessThan(-5, 0)).toBe(true);
  });

  test('returns false when values are within epsilon', () => {
   expect(lessThan(1.9999999999, 2.0)).toBe(false);
   expect(lessThan(2.0, 2.0)).toBe(false);
  });

  test('returns false when a is greater than b', () => {
   expect(lessThan(3.0, 2.0)).toBe(false);
  });

  test('uses custom epsilon', () => {
   expect(lessThan(1.85, 2.0, 0.1)).toBe(true);
   expect(lessThan(1.95, 2.0, 0.1)).toBe(false);
  });
 });

 describe('greaterThan', () => {
  test('returns true when a is clearly greater than b', () => {
   expect(greaterThan(2.0, 1.0)).toBe(true);
   expect(greaterThan(0, -5)).toBe(true);
  });

  test('returns false when values are within epsilon', () => {
   expect(greaterThan(2.0, 1.9999999999)).toBe(false);
   expect(greaterThan(2.0, 2.0)).toBe(false);
  });

  test('returns false when a is less than b', () => {
   expect(greaterThan(2.0, 3.0)).toBe(false);
  });

  test('uses custom epsilon', () => {
   expect(greaterThan(2.15, 2.0, 0.1)).toBe(true);
   expect(greaterThan(2.05, 2.0, 0.1)).toBe(false);
  });
 });

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
