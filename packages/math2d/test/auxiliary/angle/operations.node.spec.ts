/**
 * @file tests/auxiliary/angle/operations.spec.ts
 * @module @lenguados/math2d/auxiliary/angle
 * @description Tests for angular operations helpers.
 */

import { describe, expect, test } from '@jest/globals';

import {
 angleBisector,
 angleDifference,
 angleDistance,
 anglesNearEqual,
 clampAngle,
 isAngleBetween,
 reflectAngle,
} from '../../../src/auxiliary/angle/operations';

describe('angle/operations', () => {
 describe('angleDifference', () => {
  test('returns signed shortest arc', () => {
   expect(angleDifference(0, Math.PI / 2)).toBeCloseTo(Math.PI / 2);
   expect(angleDifference(0, (3 * Math.PI) / 2)).toBeCloseTo(-Math.PI / 2);
   expect(angleDifference(-Math.PI, Math.PI)).toBeCloseTo(0);
  });

  test('normalizes huge deltas into [-π, π)', () => {
   // 5π normalized to [-π, π) is -π (π is excluded from the range)
   expect(angleDifference(0, 5 * Math.PI)).toBeCloseTo(-Math.PI);
   // (10π - (-9π)) = 19π normalized to [-π, π) is -π
   expect(angleDifference(10 * Math.PI, -9 * Math.PI)).toBeCloseTo(-Math.PI);
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
 });

 describe('angleBisector', () => {
  test('returns mid angle along shortest path', () => {
   expect(angleBisector(0, Math.PI / 2)).toBeCloseTo(Math.PI / 4);
   // When diff is exactly π, bisector can be either 0 or ±π (both valid)
   // Implementation returns -π for this case due to normalization convention
   expect(Math.abs(angleBisector(-Math.PI / 2, Math.PI / 2))).toBeCloseTo(Math.PI);
  });

  test('handles wrap-around pairs', () => {
   // 3π/2 to π/2: diff is -π (or π), bisector is at ±π from either
   expect(Math.abs(angleBisector((3 * Math.PI) / 2, Math.PI / 2))).toBeCloseTo(Math.PI);
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
 });

 describe('reflectAngle', () => {
  test('reflects across given axis', () => {
   expect(reflectAngle(Math.PI / 4, 0)).toBeCloseTo(-Math.PI / 4);
   expect(reflectAngle(Math.PI / 4, Math.PI / 2)).toBeCloseTo((3 * Math.PI) / 4);
  });

  test('reflects and normalizes results outside principal range', () => {
   expect(reflectAngle(4 * Math.PI, Math.PI / 4)).toBeCloseTo(Math.PI / 2);
  });
 });
});
