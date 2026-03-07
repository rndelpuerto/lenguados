/**
 * @file test/auxiliary/numeric/guards.node.spec.ts
 * @module @lenguados/math2d/auxiliary/numeric
 * @description Tests for numeric type guards (boolean predicates).
 */

import { describe, expect, test } from '@jest/globals';

import {
 isPositiveInfinity,
 isNegativeInfinity,
 isInfinity,
 isDenormal,
 isInRange,
} from '../../../src/auxiliary/numeric/guards';

describe('numeric/guards', () => {
 describe('isPositiveInfinity', () => {
  test('returns true for positive infinity', () => {
   expect(isPositiveInfinity(Infinity)).toBe(true);
   expect(isPositiveInfinity(1 / 0)).toBe(true);
   expect(isPositiveInfinity(Number.POSITIVE_INFINITY)).toBe(true);
  });

  test('returns false for negative infinity', () => {
   expect(isPositiveInfinity(-Infinity)).toBe(false);
   expect(isPositiveInfinity(-1 / 0)).toBe(false);
  });

  test('returns false for finite numbers', () => {
   expect(isPositiveInfinity(42)).toBe(false);
   expect(isPositiveInfinity(0)).toBe(false);
   expect(isPositiveInfinity(Number.MAX_VALUE)).toBe(false);
  });
 });

 describe('isNegativeInfinity', () => {
  test('returns true for negative infinity', () => {
   expect(isNegativeInfinity(-Infinity)).toBe(true);
   expect(isNegativeInfinity(-1 / 0)).toBe(true);
   expect(isNegativeInfinity(Number.NEGATIVE_INFINITY)).toBe(true);
  });

  test('returns false for positive infinity', () => {
   expect(isNegativeInfinity(Infinity)).toBe(false);
   expect(isNegativeInfinity(1 / 0)).toBe(false);
  });

  test('returns false for finite numbers', () => {
   expect(isNegativeInfinity(-42)).toBe(false);
   expect(isNegativeInfinity(0)).toBe(false);
   expect(isNegativeInfinity(-Number.MAX_VALUE)).toBe(false);
  });
 });

 describe('isInfinity', () => {
  test('returns true for any infinity', () => {
   expect(isInfinity(Infinity)).toBe(true);
   expect(isInfinity(-Infinity)).toBe(true);
   expect(isInfinity(1 / 0)).toBe(true);
   expect(isInfinity(-1 / 0)).toBe(true);
  });

  test('returns false for finite numbers', () => {
   expect(isInfinity(42)).toBe(false);
   expect(isInfinity(0)).toBe(false);
   expect(isInfinity(-42)).toBe(false);
  });

  test('returns false for NaN', () => {
   expect(isInfinity(NaN)).toBe(false);
  });
 });

 describe('isDenormal', () => {
  test('returns true for denormal (subnormal) numbers', () => {
   // Numbers smaller than 2^-1022 ≈ 2.225e-308 are denormal
   expect(isDenormal(5e-324)).toBe(true);
   expect(isDenormal(1e-308)).toBe(true);
   expect(isDenormal(1e-310)).toBe(true);
  });

  test('returns false for normal numbers', () => {
   // Numbers >= 2^-1022 ≈ 2.225e-308 are normal
   expect(isDenormal(1e-300)).toBe(false);
   expect(isDenormal(1e-307)).toBe(false);
   expect(isDenormal(1)).toBe(false);
   expect(isDenormal(42)).toBe(false);
  });

  test('returns false for zero', () => {
   expect(isDenormal(0)).toBe(false);
   expect(isDenormal(-0)).toBe(false);
  });

  test('returns false for negative normal numbers', () => {
   expect(isDenormal(-1e-300)).toBe(false);
   expect(isDenormal(-1)).toBe(false);
  });

  test('returns true for negative denormal numbers', () => {
   expect(isDenormal(-5e-324)).toBe(true);
   expect(isDenormal(-1e-308)).toBe(true);
  });
 });

 describe('isInRange', () => {
  test('returns true for values within range', () => {
   expect(isInRange(5, 0, 10)).toBe(true);
   expect(isInRange(0, 0, 10)).toBe(true);
   expect(isInRange(10, 0, 10)).toBe(true);
   expect(isInRange(5.5, 0, 10)).toBe(true);
  });

  test('returns false for values outside range', () => {
   expect(isInRange(11, 0, 10)).toBe(false);
   expect(isInRange(-1, 0, 10)).toBe(false);
   expect(isInRange(10.001, 0, 10)).toBe(false);
  });

  test('handles negative ranges', () => {
   expect(isInRange(-5, -10, 0)).toBe(true);
   expect(isInRange(-10, -10, 0)).toBe(true);
   expect(isInRange(-11, -10, 0)).toBe(false);
  });

  test('handles single point range', () => {
   expect(isInRange(5, 5, 5)).toBe(true);
   expect(isInRange(4, 5, 5)).toBe(false);
   expect(isInRange(6, 5, 5)).toBe(false);
  });
 });
});
