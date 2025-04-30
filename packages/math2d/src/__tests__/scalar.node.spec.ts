/**
 * @file src/__tests__/scalar.node.spec.ts
 * @description Jest tests for the scalar.ts module in the math2d package.
 */

import {
 EPSILON,
 PI,
 HALF_PI,
 TAU,
 DEG2RAD,
 RAD2DEG,
 clamp,
 lerp,
 normalize,
 smoothStep,
 epsilonEquals,
 relativeEquals,
 sign,
 saturate,
} from '../scalar';

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
 });

 describe('normalize', () => {
  it('maps min to 0 and max to 1', () => {
   expect(normalize(0, 0, 10)).toBe(0);
   expect(normalize(10, 0, 10)).toBe(1);
  });

  it('maps midpoint correctly', () => {
   expect(normalize(5, 0, 10)).toBeCloseTo(0.5);
  });

  it('clamps values outside the range', () => {
   expect(normalize(-5, 0, 10)).toBe(0);
   expect(normalize(15, 0, 10)).toBe(1);
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
});
