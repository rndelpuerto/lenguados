/**
 * @file test/auxiliary/scalar/scalar.node.spec.ts
 * @module @lenguados/math2d/auxiliary/scalar
 * @description Tests for scalar constants and helper functions.
 */

import { describe, expect, it } from '@jest/globals';

import { clamp, saturate, sign } from '../../../src/auxiliary/scalar/arithmetic';
import {
 nearEquals as epsilonEquals,
 relativeEquals,
 compare,
 inRange,
} from '../../../src/auxiliary/scalar/comparison';
import {
 DEG_TO_RAD as DEG2RAD,
 EPSILON,
 GOLDEN_RATIO,
 GOLDEN_RATIO_CONJUGATE,
 PI,
 RAD_TO_DEG as RAD2DEG,
 TAU,
} from '../../../src/auxiliary/scalar/constants';
import {
 inverseLerp,
 inverseLerpSafe,
 inverseLerpUnchecked,
 lerp,
 lerpClamped,
 smoothStep,
 smootherStep,
} from '../../../src/auxiliary/scalar/interpolation';

const HALF_PI = PI / 2;

describe('Scalar constants', () => {
 it('PI equals Math.PI', () => {
  expect(PI).toBeCloseTo(Math.PI);
 });

 it('HALF_PI equals PI / 2', () => {
  expect(HALF_PI).toBeCloseTo(PI / 2);
 });

 it('TAU equals 2 * PI', () => {
  expect(TAU).toBeCloseTo(2 * PI);
 });

 it('DEG2RAD and RAD2DEG are inverse factors', () => {
  const degrees = 45;
  const radians = degrees * DEG2RAD;

  expect(radians).toBeCloseTo(Math.PI / 4);
  expect(radians * RAD2DEG).toBeCloseTo(degrees);
 });

 it('EPSILON is a small positive number', () => {
  expect(EPSILON).toBeGreaterThan(0);
  expect(EPSILON).toBeLessThan(1e-3);
 });

 it('GOLDEN_RATIO equals (1 + sqrt(5)) / 2', () => {
  expect(GOLDEN_RATIO).toBeCloseTo(1.618033988749895, 14);
 });

 it('GOLDEN_RATIO * GOLDEN_RATIO_CONJUGATE equals 1', () => {
  expect(GOLDEN_RATIO * GOLDEN_RATIO_CONJUGATE).toBeCloseTo(1, 14);
 });

 it('GOLDEN_RATIO - 1 equals GOLDEN_RATIO_CONJUGATE', () => {
  expect(GOLDEN_RATIO - 1).toBeCloseTo(GOLDEN_RATIO_CONJUGATE, 14);
 });
});

describe('Scalar functions', () => {
 describe('clamp', () => {
  it('clamps within range', () => {
   expect(clamp(5, 0, 10)).toBe(5);
  });

  it('clamps below min to min', () => {
   expect(clamp(-1, 0, 10)).toBe(0);
  });

  it('clamps above max to max', () => {
   expect(clamp(11, 0, 10)).toBe(10);
  });

  it('clamps edge values', () => {
   expect(clamp(0, 0, 10)).toBe(0);
   expect(clamp(10, 0, 10)).toBe(10);
  });
 });

 describe('sign', () => {
  it('returns -1 for negative', () => {
   expect(sign(-5)).toBe(-1);
  });

  it('returns +1 for positive', () => {
   expect(sign(5)).toBe(1);
  });

  it('returns 0 for zero', () => {
   expect(sign(0)).toBe(0);
  });
 });

 describe('lerp', () => {
  it('lerp at t=0 returns a', () => {
   expect(lerp(10, 20, 0)).toBeCloseTo(10);
  });

  it('lerp at t=1 returns b', () => {
   expect(lerp(10, 20, 1)).toBeCloseTo(20);
  });

  it('lerp at t=0.5 returns midpoint', () => {
   expect(lerp(10, 20, 0.5)).toBeCloseTo(15);
  });

  it('lerp allows extrapolation for t > 1', () => {
   expect(lerp(0, 10, 2)).toBeCloseTo(20);
  });

  it('lerp allows extrapolation for t < 0', () => {
   expect(lerp(0, 10, -0.5)).toBeCloseTo(-5);
  });
 });

 describe('lerpClamped', () => {
  it('lerpClamped at t=0 returns a', () => {
   expect(lerpClamped(10, 20, 0)).toBeCloseTo(10);
  });

  it('lerpClamped at t=1 returns b', () => {
   expect(lerpClamped(10, 20, 1)).toBeCloseTo(20);
  });

  it('lerpClamped at t=0.5 returns midpoint', () => {
   expect(lerpClamped(10, 20, 0.5)).toBeCloseTo(15);
  });

  it('lerpClamped clamps t > 1 to 1', () => {
   expect(lerpClamped(0, 10, 1.5)).toBeCloseTo(10);
   expect(lerpClamped(0, 10, 2)).toBeCloseTo(10);
   expect(lerpClamped(0, 10, 100)).toBeCloseTo(10);
  });

  it('lerpClamped clamps t < 0 to 0', () => {
   expect(lerpClamped(0, 10, -0.5)).toBeCloseTo(0);
   expect(lerpClamped(0, 10, -1)).toBeCloseTo(0);
   expect(lerpClamped(0, 10, -100)).toBeCloseTo(0);
  });

  it('lerpClamped works with negative value ranges', () => {
   expect(lerpClamped(-10, 10, 0.5)).toBeCloseTo(0);
   expect(lerpClamped(-10, 10, 0)).toBeCloseTo(-10);
   expect(lerpClamped(-10, 10, 1)).toBeCloseTo(10);
  });

  it('lerpClamped works with reversed range (b < a)', () => {
   expect(lerpClamped(10, 0, 0.5)).toBeCloseTo(5);
   expect(lerpClamped(10, 0, 0)).toBeCloseTo(10);
   expect(lerpClamped(10, 0, 1)).toBeCloseTo(0);
  });
 });

 describe('inverseLerp', () => {
  it('maps min to 0 and max to 1', () => {
   expect(inverseLerp(0, 10, 0)).toBe(0);
   expect(inverseLerp(0, 10, 10)).toBe(1);
  });

  it('maps midpoint correctly', () => {
   expect(inverseLerp(0, 10, 5)).toBeCloseTo(0.5);
  });

  it('extrapolates outside the range', () => {
   expect(inverseLerp(0, 10, -5)).toBe(-0.5);
   expect(inverseLerp(0, 10, 15)).toBe(1.5);
  });
 });

 describe('smoothStep', () => {
  it('below edge0 returns 0', () => {
   expect(smoothStep(0, 1, -0.5)).toBe(0);
  });

  it('above edge1 returns 1', () => {
   expect(smoothStep(0, 1, 1.5)).toBe(1);
  });

  it('at midpoint returns ~0.5', () => {
   expect(smoothStep(0, 1, 0.5)).toBeCloseTo(0.5);
  });

  it('at edges returns 0 and 1', () => {
   expect(smoothStep(0, 1, 0)).toBe(0);
   expect(smoothStep(0, 1, 1)).toBe(1);
  });

  it('works with custom range', () => {
   expect(smoothStep(0, 10, 5)).toBeCloseTo(0.5);
   expect(smoothStep(0, 10, 0)).toBe(0);
   expect(smoothStep(0, 10, 10)).toBe(1);
  });
 });

 describe('smootherStep', () => {
  it('below edge0 returns 0', () => {
   expect(smootherStep(0, 1, -0.5)).toBe(0);
  });

  it('above edge1 returns 1', () => {
   expect(smootherStep(0, 1, 1.5)).toBe(1);
  });

  it('at midpoint returns ~0.5', () => {
   expect(smootherStep(0, 1, 0.5)).toBeCloseTo(0.5);
  });

  it('at edges returns 0 and 1', () => {
   expect(smootherStep(0, 1, 0)).toBe(0);
   expect(smootherStep(0, 1, 1)).toBe(1);
  });
 });

 describe('epsilonEquals', () => {
  it('returns true for numbers within eps', () => {
   expect(epsilonEquals(1.000001, 1.000002, 1e-5)).toBe(true);
  });

  it('returns false for numbers outside eps', () => {
   expect(epsilonEquals(1.0, 1.1, EPSILON)).toBe(false);
  });

  it('defaults to EPSILON tolerance', () => {
   expect(epsilonEquals(0, EPSILON / 2)).toBe(true);
  });
 });

 describe('relativeEquals', () => {
  it('uses EPSILON as default tolerance', () => {
   expect(relativeEquals(0, EPSILON / 2)).toBe(true);
  });

  it('returns true when difference is within relative threshold', () => {
   expect(relativeEquals(100, 100.5, 0.01)).toBe(true);
  });

  it('returns false when difference exceeds relative threshold', () => {
   expect(relativeEquals(100, 102, 0.01)).toBe(false);
  });

  it('throws if relEps is negative', () => {
   expect(() => relativeEquals(1, 1, -0.1)).toThrow(RangeError);
  });
 });

 describe('compare', () => {
  it('returns -1 when a < b (beyond epsilon)', () => {
   expect(compare(1.0, 2.0)).toBe(-1);
   expect(compare(0, 1)).toBe(-1);
   expect(compare(-5, 5)).toBe(-1);
  });

  it('returns 1 when a > b (beyond epsilon)', () => {
   expect(compare(2.0, 1.0)).toBe(1);
   expect(compare(1, 0)).toBe(1);
   expect(compare(5, -5)).toBe(1);
  });

  it('returns 0 when a ≈ b (within epsilon)', () => {
   expect(compare(1.0, 1.0000000001)).toBe(0);
   expect(compare(1.0, 1.0)).toBe(0);
   expect(compare(0, EPSILON / 2)).toBe(0);
  });

  it('uses custom epsilon', () => {
   expect(compare(1.0, 1.05, 0.1)).toBe(0); // within custom epsilon
   expect(compare(1.0, 1.15, 0.1)).toBe(-1); // outside custom epsilon
   expect(compare(1.0, 0.85, 0.1)).toBe(1); // outside custom epsilon
  });

  it('sorts NaN after everything', () => {
   expect(compare(NaN, 5)).toBe(1); // NaN > finite
   expect(compare(5, NaN)).toBe(-1); // finite < NaN
   expect(compare(NaN, NaN)).toBe(0); // NaN == NaN for sorting stability
  });
 });

 describe('saturate', () => {
  it('saturates values below 0 to 0', () => {
   expect(saturate(-1)).toBe(0);
  });

  it('saturates values above 1 to 1', () => {
   expect(saturate(2)).toBe(1);
  });

  it('preserves values within range', () => {
   expect(saturate(0.5)).toBeCloseTo(0.5);
  });
 });

 describe('inverseLerpSafe', () => {
  it('returns 0 for degenerate range (a === b)', () => {
   expect(inverseLerpSafe(5, 5, 10)).toBe(0);
   expect(inverseLerpSafe(0, 0, 100)).toBe(0);
  });

  it('works like inverseLerp for valid ranges', () => {
   expect(inverseLerpSafe(0, 10, 0)).toBe(0);
   expect(inverseLerpSafe(0, 10, 10)).toBe(1);
   expect(inverseLerpSafe(0, 10, 5)).toBeCloseTo(0.5);
  });

  it('extrapolates outside the range', () => {
   expect(inverseLerpSafe(0, 10, -5)).toBe(-0.5);
   expect(inverseLerpSafe(0, 10, 15)).toBe(1.5);
  });
 });

 describe('inverseLerpUnchecked', () => {
  it('computes inverse lerp without validation', () => {
   expect(inverseLerpUnchecked(0, 10, 0)).toBe(0);
   expect(inverseLerpUnchecked(0, 10, 10)).toBe(1);
   expect(inverseLerpUnchecked(0, 10, 5)).toBeCloseTo(0.5);
  });

  it('extrapolates outside the range', () => {
   expect(inverseLerpUnchecked(0, 10, -5)).toBe(-0.5);
   expect(inverseLerpUnchecked(0, 10, 15)).toBe(1.5);
  });
 });

 describe('NaN/Infinity edge cases', () => {
  it('sign(NaN) returns 0 (NaN is neither > 0 nor < 0)', () => {
   expect(sign(NaN)).toBe(0);
  });

  it('compare(1e308, 1e308) returns 0', () => {
   expect(compare(1e308, 1e308)).toBe(0);
  });

  it('compare(Infinity, Infinity) returns 0', () => {
   expect(compare(Infinity, Infinity)).toBe(0);
  });

  it('inRange(NaN, 0, 1) returns false', () => {
   expect(inRange(NaN, 0, 1)).toBe(false);
  });

  it('inRange(0.5, NaN, 1) returns false', () => {
   expect(inRange(0.5, NaN, 1)).toBe(false);
  });
 });

 describe('Section 7 regression tests', () => {
  it('inverseLerp(0, 1e-10, 5e-11) returns 0.5 (not throw)', () => {
   expect(inverseLerp(0, 1e-10, 5e-11)).toBeCloseTo(0.5);
  });

  it('inverseLerpSafe computes valid result for small non-zero range', () => {
   expect(inverseLerpSafe(0, 1e-20, 5e-21)).toBeCloseTo(0.5);
  });

  it('inverseLerpSafe returns 0 for exact zero range', () => {
   expect(inverseLerpSafe(5, 5, 5)).toBe(0);
  });

  it('lerp(0.1, 0.3, 1.0) returns exactly 0.3', () => {
   expect(lerp(0.1, 0.3, 1.0)).toBe(0.3);
  });

  it('lerp(0, 10, 2.0) returns 20 (extrapolation preserved)', () => {
   expect(lerp(0, 10, 2.0)).toBe(20);
  });

  it('lerp(a, b, 0) returns exactly a (naturally exact, no guard)', () => {
   expect(lerp(0.1, 0.3, 0)).toBe(0.1);
  });

  it('lerpClamped returns exact endpoints', () => {
   expect(lerpClamped(0.1, 0.3, 0)).toBe(0.1);
   expect(lerpClamped(0.1, 0.3, 1)).toBe(0.3);
   expect(lerpClamped(0.1, 0.3, -1)).toBe(0.1);
   expect(lerpClamped(0.1, 0.3, 2)).toBe(0.3);
  });
 });

 describe('degenerate range tests', () => {
  it('smoothStep with edge0 === edge1 uses step function', () => {
   expect(smoothStep(5, 5, 3)).toBe(0);
   expect(smoothStep(5, 5, 7)).toBe(1);
   expect(smoothStep(5, 5, 5)).toBe(1);
  });
 });
});
