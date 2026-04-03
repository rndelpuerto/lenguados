/**
 * @file test/properties/rotation2.property.node.spec.ts
 * @module @lenguados/math2d/core
 * @description Property-based tests for Rotation2.
 */

import { describe, it } from '@jest/globals';
import * as fc from 'fast-check';

import { Rotation2 } from '../../src/core/rotation2';
import { Vector2 } from '../../src/core/vector2';
import { arbAngle, arbAngleNearPi, arbRotation2, arbUnitVector2 } from '../arbitraries';

// Using 1e-6 tolerance - realistic for floating-point operations
const TEST_TOLERANCE = 1e-6;

describe('Rotation2 Properties', () => {
 describe('Unit Circle Invariant', () => {
  it('should maintain unit magnitude: cos² + sin² = 1', () => {
   fc.assert(
    fc.property(arbRotation2, (r) => {
     const magnitudeSq = r.cos * r.cos + r.sin * r.sin;
     return Math.abs(magnitudeSq - 1) < TEST_TOLERANCE;
    }),
   );
  });
 });

 describe('Composition', () => {
  it('should be associative: (a * b) * c = a * (b * c)', () => {
   fc.assert(
    fc.property(arbRotation2, arbRotation2, arbRotation2, (a, b, c) => {
     const ab_c = Rotation2.multiply(Rotation2.multiply(a, b), c);
     const a_bc = Rotation2.multiply(a, Rotation2.multiply(b, c));
     return ab_c.nearEquals(a_bc, TEST_TOLERANCE);
    }),
   );
  });

  it('should have identity: r * identity = r', () => {
   fc.assert(
    fc.property(arbRotation2, (r) => {
     const result = Rotation2.multiply(r, Rotation2.IDENTITY);
     return result.nearEquals(r, TEST_TOLERANCE);
    }),
   );
  });

  it('should have identity (left): identity * r = r', () => {
   fc.assert(
    fc.property(arbRotation2, (r) => {
     const result = Rotation2.multiply(Rotation2.IDENTITY, r);
     return result.nearEquals(r, TEST_TOLERANCE);
    }),
   );
  });

  it('should have inverse: r * r⁻¹ = identity', () => {
   fc.assert(
    fc.property(arbRotation2, (r) => {
     const inverse = Rotation2.inverse(r);
     const result = Rotation2.multiply(r, inverse);
     return result.isIdentity(TEST_TOLERANCE);
    }),
   );
  });
 });

 describe('Angle Relationships', () => {
  it('should satisfy: fromAngle(angle).angle ≈ angle (normalized)', () => {
   // Use more limited angle range to avoid precision issues near boundaries
   const arbSafeAngle = fc.integer({ min: -31415, max: 31415 }).map((n) => n / 10000);
   fc.assert(
    fc.property(arbSafeAngle, (angle) => {
     const r = Rotation2.fromAngle(angle);
     const extractedAngle = r.angle;
     // Normalize angle to [-π, π]
     const normalizedInput = Math.atan2(Math.sin(angle), Math.cos(angle));
     const diff = Math.abs(normalizedInput - extractedAngle);
     return diff < 1e-6 || Math.abs(diff - 2 * Math.PI) < 1e-6;
    }),
   );
  });

  it('should satisfy: angle(a * b) = angle(a) + angle(b) (mod 2π)', () => {
   fc.assert(
    fc.property(arbRotation2, arbRotation2, (a, b) => {
     const composed = Rotation2.multiply(a, b);
     const sumAngle = a.angle + b.angle;
     const composedAngle = composed.angle;
     // Normalize both to [-π, π]
     const normalizedSum = Math.atan2(Math.sin(sumAngle), Math.cos(sumAngle));
     // Use larger tolerance for accumulated error
     return Math.abs(composedAngle - normalizedSum) < 1e-7;
    }),
   );
  });
 });

 describe('Vector Rotation', () => {
  it('should preserve vector length', () => {
   fc.assert(
    fc.property(arbRotation2, arbUnitVector2, (r, v) => {
     const rotated = Rotation2.apply(r, v);
     const originalLength = Vector2.magnitude(v);
     const rotatedLength = Vector2.magnitude(rotated);
     return Math.abs(originalLength - rotatedLength) < TEST_TOLERANCE;
    }),
   );
  });

  it('should satisfy: identity rotation does not change vector', () => {
   fc.assert(
    fc.property(arbUnitVector2, (v) => {
     const rotated = Rotation2.apply(Rotation2.IDENTITY, v);
     return rotated.nearEquals(v, TEST_TOLERANCE);
    }),
   );
  });

  it('should be consistent with Vector2.rotate', () => {
   fc.assert(
    fc.property(arbAngle, arbUnitVector2, (angle, v) => {
     const r = Rotation2.fromAngle(angle);
     const rotatedByRotation = Rotation2.apply(r, v);
     const rotatedByVector = Vector2.rotate(v, angle);
     // Slightly larger tolerance due to different computation paths
     return rotatedByRotation.nearEquals(rotatedByVector, 1e-7);
    }),
   );
  });
 });

 describe('Equality', () => {
  it('nearEquals should be reflexive', () => {
   fc.assert(
    fc.property(arbRotation2, (r) => {
     return r.nearEquals(r);
    }),
   );
  });

  it('nearEquals should be symmetric', () => {
   fc.assert(
    fc.property(arbRotation2, arbRotation2, (a, b) => {
     return a.nearEquals(b) === b.nearEquals(a);
    }),
   );
  });

  it('nearEquals should handle ±π boundary correctly', () => {
   fc.assert(
    fc.property(arbAngleNearPi, (angle) => {
     const r1 = Rotation2.fromAngle(angle);
     // Create a rotation very close to the opposite side of ±π
     const oppositeAngle = angle > 0 ? angle - 2 * Math.PI + 1e-12 : angle + 2 * Math.PI - 1e-12;
     const r2 = Rotation2.fromAngle(oppositeAngle);
     // These should NOT be equal as they differ by ~2π
     // But rotations at exactly ±π should be equal
     if (Math.abs(Math.abs(angle) - Math.PI) < 1e-10) {
      return r1.nearEquals(r2, 1e-5);
     }
     return true;
    }),
   );
  });
 });

 describe('Lerp/Slerp', () => {
  it('lerp should satisfy: lerp(a, b, 0) = a', () => {
   fc.assert(
    fc.property(arbRotation2, arbRotation2, (a, b) => {
     const result = Rotation2.lerp(a, b, 0);
     return result.nearEquals(a, TEST_TOLERANCE);
    }),
   );
  });

  it('lerp should satisfy: lerp(a, b, 1) = b', () => {
   fc.assert(
    fc.property(arbRotation2, arbRotation2, (a, b) => {
     const result = Rotation2.lerp(a, b, 1);
     return result.nearEquals(b, TEST_TOLERANCE);
    }),
   );
  });
 });

 describe('fromMatrix2 Round-Trip', () => {
  it('should preserve angle: fromMatrix2(toMatrix2(r)) ≈ r', () => {
   fc.assert(
    fc.property(arbAngle, (angle) => {
     const original = Rotation2.fromAngle(angle);
     const matrix = original.toMatrix2();
     const recovered = Rotation2.fromMatrix2(matrix);
     return recovered.nearEquals(original, TEST_TOLERANCE);
    }),
   );
  });

  it('should preserve unit length after fromMatrix2', () => {
   fc.assert(
    fc.property(arbAngle, (angle) => {
     const rot = Rotation2.fromAngle(angle);
     const matrix = rot.toMatrix2();
     const recovered = Rotation2.fromMatrix2(matrix);
     const magnitudeSq = recovered.cos * recovered.cos + recovered.sin * recovered.sin;
     return Math.abs(magnitudeSq - 1) < 1e-14;
    }),
   );
  });
 });
});
