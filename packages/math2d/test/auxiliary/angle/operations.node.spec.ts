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
 angleAverage,
 angleWeightedAverage,
 angleFromVectors,
 isQuadrantAngle,
 sinCosNormalized,
 clampAngle,
 isAngleBetween,
 reflectAngle,
 sinCos,
 sinCosInto,
 principalAngle,
 type SinCos,
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
 });

 describe('sinCosInto', () => {
  test('writes sin and cos into provided object', () => {
   const out: SinCos = { sin: 999, cos: 999 };
   const result = sinCosInto(0, out);

   expect(result).toBe(out); // Same reference
   expect(out.sin).toBeCloseTo(0, 5);
   expect(out.cos).toBeCloseTo(1, 5);
  });

  test('returns same object reference', () => {
   const out: SinCos = { sin: 0, cos: 0 };
   const result = sinCosInto(Math.PI / 2, out);

   expect(result).toBe(out);
   expect(result.sin).toBeCloseTo(1, 5);
   expect(result.cos).toBeCloseTo(0, 5);
  });

  test('can be reused in loops without allocation', () => {
   const out: SinCos = { sin: 0, cos: 0 };
   const angles = [0, Math.PI / 4, Math.PI / 2, Math.PI];

   for (const angle of angles) {
    sinCosInto(angle, out);
    // Verify identity holds for each
    expect(out.sin * out.sin + out.cos * out.cos).toBeCloseTo(1, 5);
   }
  });

  test('produces same results as sinCos', () => {
   const out: SinCos = { sin: 0, cos: 0 };
   const angles = [0, 0.5, 1, Math.PI / 4, Math.PI];

   for (const angle of angles) {
    const fromSinCos = sinCos(angle);
    sinCosInto(angle, out);

    expect(out.sin).toBe(fromSinCos.sin);
    expect(out.cos).toBe(fromSinCos.cos);
   }
  });
 });

 describe('sinCosNormalized', () => {
  test('returns unit length sin/cos', () => {
   const result = sinCosNormalized(Math.PI / 4);
   const lengthSq = result.sin * result.sin + result.cos * result.cos;
   expect(lengthSq).toBeCloseTo(1, 10);
  });
 });

 describe('angleAverage', () => {
  test('averages angles correctly', () => {
   const avg = angleAverage([0, Math.PI / 2]);
   expect(avg).toBeCloseTo(Math.PI / 4, 5);
  });

  test('handles angles across 0/2π boundary', () => {
   const avg = angleAverage([-Math.PI / 4, Math.PI / 4]);
   expect(avg).toBeCloseTo(0, 5);
  });

  test('returns 0 for empty array', () => {
   expect(angleAverage([])).toBe(0);
  });

  test('handles single angle', () => {
   expect(angleAverage([Math.PI / 3])).toBeCloseTo(Math.PI / 3, 5);
  });

  test('handles opposite angles', () => {
   const avg = angleAverage([0, Math.PI]);
   // Average of 0 and π using unit vectors gives π/2
   expect(avg).toBeCloseTo(Math.PI / 2, 5);
  });

  test('handles multiple angles correctly', () => {
   const avg = angleAverage([0, Math.PI / 2, Math.PI]);
   // Using unit vectors: (1,0) + (0,1) + (-1,0) = (0, 1) → π/2
   expect(avg).toBeCloseTo(Math.PI / 2, 5);
  });

  test('handles angles near wrap boundary', () => {
   const avg = angleAverage([-Math.PI * 0.9, Math.PI * 0.9]);
   // Both angles near ±π, average should be near π
   expect(Math.abs(avg)).toBeCloseTo(Math.PI, 2);
  });
 });

 describe('angleWeightedAverage', () => {
  test('weights angles correctly', () => {
   const result = angleWeightedAverage([0, Math.PI], [1, 1]);
   expect(result).toBeCloseTo(Math.PI / 2, 5);
  });

  test('higher weight biases toward that angle', () => {
   const result = angleWeightedAverage([0, Math.PI], [3, 1]);
   expect(result).toBeLessThan(Math.PI / 2);
  });

  test('returns 0 for empty array', () => {
   expect(angleWeightedAverage([], [])).toBe(0);
  });

  test('returns 0 for mismatched array lengths', () => {
   expect(angleWeightedAverage([0, Math.PI], [1])).toBe(0);
   expect(angleWeightedAverage([0], [1, 2])).toBe(0);
  });

  test('zero weight ignores angle', () => {
   const result = angleWeightedAverage([0, Math.PI], [1, 0]);
   expect(result).toBeCloseTo(0, 5);
  });

  test('handles multiple angles', () => {
   const result = angleWeightedAverage([0, Math.PI / 2, Math.PI], [1, 2, 1]);
   // Should be biased toward π/2
   expect(result).toBeGreaterThan(Math.PI / 4);
   expect(result).toBeLessThan((3 * Math.PI) / 4);
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

 describe('isQuadrantAngle', () => {
  test('detects quadrant angles', () => {
   expect(isQuadrantAngle(0)).toBe(true);
   expect(isQuadrantAngle(Math.PI / 2)).toBe(true);
   expect(isQuadrantAngle(Math.PI)).toBe(true);
   expect(isQuadrantAngle((3 * Math.PI) / 2)).toBe(true);
  });

  test('rejects non-quadrant angles', () => {
   expect(isQuadrantAngle(Math.PI / 4)).toBe(false);
   expect(isQuadrantAngle(0.1)).toBe(false);
  });
 });

 describe('principalAngle', () => {
  test('returns 0 for empty array', () => {
   expect(principalAngle([])).toBe(0);
  });

  test('returns the single angle for single-element array', () => {
   expect(principalAngle([Math.PI / 4])).toBeCloseTo(Math.PI / 4, 5);
  });

  test('finds middle angle for symmetric distribution', () => {
   const result = principalAngle([0, Math.PI / 4, Math.PI / 2]);
   expect(result).toBeCloseTo(Math.PI / 4, 3);
  });

  test('handles opposite angles', () => {
   // -π and π are the same angle, so principal should be near π or -π
   const result = principalAngle([-Math.PI, Math.PI]);
   expect(Math.abs(result)).toBeCloseTo(Math.PI, 5);
  });

  test('handles wrap-around cases', () => {
   const result = principalAngle([-Math.PI * 0.9, Math.PI * 0.9]);
   // Both angles are near ±π, so principal should be near π
   expect(Math.abs(result)).toBeCloseTo(Math.PI, 2);
  });

  test('converges for multiple angles', () => {
   const angles = [0, Math.PI / 6, Math.PI / 3, Math.PI / 2];
   const result = principalAngle(angles);
   // Should be somewhere in the middle
   expect(result).toBeGreaterThan(0);
   expect(result).toBeLessThan(Math.PI / 2);
  });
 });
});
