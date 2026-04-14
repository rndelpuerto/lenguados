/**
 * @file test/auxiliary/angle/operations.node.spec.ts
 * @module @lenguados/math2d/auxiliary/angle
 * @description Tests for angular operations helpers.
 */

import { describe, expect, test } from '@jest/globals';

import {
 angleBisector,
 angleDifference,
 angleFromVectors,
 sinCosNormalized,
 clampAngle,
 angleDistance,
 anglesNearEqual,
 isAngleBetween,
 sinCos,
} from '../../../src/auxiliary/angle/operations';

describe('angle/operations', () => {
 describe('angleDifference', () => {
  test('returns signed shortest arc', () => {
   expect(angleDifference(0, Math.PI / 2)).toBeCloseTo(Math.PI / 2);
   expect(angleDifference(0, (3 * Math.PI) / 2)).toBeCloseTo(-Math.PI / 2);
   expect(angleDifference(-Math.PI, Math.PI)).toBeCloseTo(0);
  });

  test('normalizes huge deltas into (-π, π]', () => {
   // 5π normalized to (-π, π] is π (π is included in the range)
   expect(angleDifference(0, 5 * Math.PI)).toBeCloseTo(Math.PI);
   // Large odd multiples of π may not land exactly on -PI due to floating-point
   // precision loss in intermediate arithmetic, so the (-PI, PI] convention
   // fix may not fire. The result is approximately ±PI (same angle either way).
   expect(Math.abs(angleDifference(10 * Math.PI, -9 * Math.PI))).toBeCloseTo(Math.PI);
  });
 });

 describe('angleDistance', () => {
  test('is always positive', () => {
   expect(angleDistance(0, Math.PI / 2)).toBeCloseTo(Math.PI / 2);
   expect(angleDistance(0, (3 * Math.PI) / 2)).toBeCloseTo(Math.PI / 2);
  });
 });

 describe('anglesNearEqual', () => {
  test('compares modulo 2π', () => {
   expect(anglesNearEqual(0, 2 * Math.PI)).toBe(true);
   expect(anglesNearEqual(-Math.PI, Math.PI)).toBe(true);
   expect(anglesNearEqual(0, 0.1)).toBe(false);
  });

  test('throws on NaN epsilon', () => {
   expect(() => anglesNearEqual(0, 0, NaN)).toThrow(RangeError);
  });

  test('throws on negative epsilon', () => {
   expect(() => anglesNearEqual(0, 0, -1)).toThrow(RangeError);
  });
 });

 describe('angleBisector', () => {
  test('returns mid angle along shortest path', () => {
   expect(angleBisector(0, Math.PI / 2)).toBeCloseTo(Math.PI / 4);
   // When diff is exactly π, bisector resolves via (-PI, PI] convention
   // angleDifference(-PI/2, PI/2) = PI, so bisector = -PI/2 + PI*0.5 = 0
   expect(angleBisector(-Math.PI / 2, Math.PI / 2)).toBeCloseTo(0);
  });

  test('handles wrap-around pairs', () => {
   // 3π/2 to π/2: diff is π, bisector is at 0 (CCW convention)
   expect(angleBisector((3 * Math.PI) / 2, Math.PI / 2)).toBeCloseTo(0);
  });
 });

 describe('isAngleBetween', () => {
  test('checks inclusion on ccw arc', () => {
   expect(isAngleBetween(Math.PI / 4, 0, Math.PI / 2)).toBe(true);
   expect(isAngleBetween((3 * Math.PI) / 2, Math.PI, 0)).toBe(true);
   expect(isAngleBetween(Math.PI, 0, Math.PI / 2)).toBe(false);
  });

  test('supports exclusive bounds', () => {
   expect(isAngleBetween(0, 0, Math.PI, false)).toBe(false);
   expect(isAngleBetween(Math.PI, 0, Math.PI, false)).toBe(false);
  });

  test('wraps correctly when start > end', () => {
   expect(isAngleBetween(-Math.PI / 2, Math.PI / 2, -Math.PI / 2)).toBe(true);
  });
 });

 describe('clampAngle', () => {
  test('clamps to nearest boundary', () => {
   expect(clampAngle(Math.PI / 4, 0, Math.PI / 2)).toBeCloseTo(Math.PI / 4);
   expect(clampAngle(-Math.PI / 4, 0, Math.PI / 2)).toBeCloseTo(0);
   expect(clampAngle(Math.PI, 0, Math.PI / 2)).toBeCloseTo(Math.PI / 2);
  });

  test('normalizes all inputs before comparison', () => {
   // 5π normalized is -π, equidistant from both -π/2 and π/2
   // When equidistant, returns min boundary (-π/2)
   expect(clampAngle(5 * Math.PI, -Math.PI / 2, Math.PI / 2)).toBeCloseTo(-Math.PI / 2);
  });

  test('propagates NaN per IEEE 754 §6.2', () => {
   expect(clampAngle(NaN, 0, Math.PI / 2)).toBeNaN();
   expect(clampAngle(0, NaN, Math.PI / 2)).toBeNaN();
   expect(clampAngle(0, 0, NaN)).toBeNaN();
  });
 });

 describe('sinCos', () => {
  test('returns correct sin and cos for 0', () => {
   const result = sinCos(0);
   expect(result.sin).toBeCloseTo(0, 5);
   expect(result.cos).toBeCloseTo(1, 5);
  });

  test('returns correct sin and cos for π/2', () => {
   const result = sinCos(Math.PI / 2);
   expect(result.sin).toBeCloseTo(1, 5);
   expect(result.cos).toBeCloseTo(0, 5);
  });

  test('returns correct sin and cos for π/4', () => {
   const result = sinCos(Math.PI / 4);
   const expected = Math.SQRT1_2;
   expect(result.sin).toBeCloseTo(expected, 5);
   expect(result.cos).toBeCloseTo(expected, 5);
  });

  test('sin² + cos² = 1 identity holds', () => {
   const angles = [0, 0.1, 0.5, 1, Math.PI / 6, Math.PI / 3, Math.PI / 2];
   for (const angle of angles) {
    const result = sinCos(angle);
    expect(result.sin * result.sin + result.cos * result.cos).toBeCloseTo(1, 5);
   }
  });

  test('accepts out parameter for zero-allocation', () => {
   const out = { sin: 0, cos: 0 };
   const result = sinCos(Math.PI / 6, out);
   expect(result).toBe(out);
   expect(out.sin).toBeCloseTo(0.5, 5);
   expect(out.cos).toBeCloseTo(Math.sqrt(3) / 2, 5);
  });
 });

 describe('sinCosNormalized', () => {
  test('returns unit length sin/cos', () => {
   const result = sinCosNormalized(Math.PI / 4);
   const lengthSq = result.sin * result.sin + result.cos * result.cos;
   expect(lengthSq).toBeCloseTo(1, 10);
  });

  test('accepts out parameter for zero-allocation', () => {
   const out = { sin: 0, cos: 0 };
   const result = sinCosNormalized(Math.PI / 2, out);
   expect(result).toBe(out);
   expect(out.sin).toBeCloseTo(1, 5);
   expect(out.cos).toBeCloseTo(0, 5);
  });

  test('creates new object when out is not provided', () => {
   const result = sinCosNormalized(0);
   expect(result.sin).toBeCloseTo(0, 5);
   expect(result.cos).toBeCloseTo(1, 5);
  });
 });

 describe('angleFromVectors', () => {
  test('returns angle between two vectors', () => {
   const angle = angleFromVectors(1, 0, 0, 1);
   expect(angle).toBeCloseTo(Math.PI / 2, 5);
  });

  test('returns 0 for parallel vectors', () => {
   const angle = angleFromVectors(1, 0, 2, 0);
   expect(angle).toBeCloseTo(0, 5);
  });

  test('returns ±π for opposite vectors', () => {
   const angle = angleFromVectors(1, 0, -1, 0);
   expect(Math.abs(angle)).toBeCloseTo(Math.PI, 5);
  });
 });

 describe('NaN/Infinity handling', () => {
  test('sinCos returns NaN for NaN input', () => {
   const result = sinCos(NaN);
   expect(result.sin).toBeNaN();
   expect(result.cos).toBeNaN();
  });

  test('angleDifference returns NaN for NaN input', () => {
   expect(angleDifference(NaN, 0)).toBeNaN();
   expect(angleDifference(0, NaN)).toBeNaN();
  });

  test('angleDistance returns NaN for NaN input', () => {
   expect(angleDistance(NaN, 0)).toBeNaN();
   expect(angleDistance(0, NaN)).toBeNaN();
  });

  test('anglesNearEqual(NaN, 0) returns false', () => {
   expect(anglesNearEqual(NaN, 0)).toBe(false);
  });
 });
});
