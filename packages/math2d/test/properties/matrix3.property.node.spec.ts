/**
 * @file test/properties/matrix3.property.node.spec.ts
 * @module @lenguados/math2d/core
 * @description Property-based tests for Matrix3.
 */

import { describe, expect, it } from '@jest/globals';
import * as fc from 'fast-check';

import { Matrix3 } from '../../src/core/matrix3';
import { Vector2 } from '../../src/core/vector2';
import {
 arbMatrix3,
 arbRotationMatrix3,
 arbAffineMatrix3,
 arbAngle,
 arbVector2,
} from '../arbitraries';

const TEST_TOLERANCE = 1e-5;

describe('Matrix3 Property-Based Tests', () => {
 // ========================================================================
 // Identity Properties
 // ========================================================================

 describe('Identity', () => {
  it('should satisfy: A * I = A', () => {
   fc.assert(
    fc.property(arbMatrix3, (a) => {
     const result = Matrix3.multiply(a, Matrix3.IDENTITY);
     return Matrix3.nearEquals(result, a);
    }),
   );
  });

  it('should satisfy: I * A = A', () => {
   fc.assert(
    fc.property(arbMatrix3, (a) => {
     const result = Matrix3.multiply(Matrix3.IDENTITY, a);
     return Matrix3.nearEquals(result, a);
    }),
   );
  });

  it('should satisfy: I * point = point', () => {
   fc.assert(
    fc.property(arbVector2, (v) => {
     const result = Matrix3.transformPoint(Matrix3.IDENTITY, v);
     return Vector2.nearEquals(result, v);
    }),
   );
  });
 });

 // ========================================================================
 // Determinant Properties
 // ========================================================================

 describe('Determinant', () => {
  it('should satisfy: det(I) = 1', () => {
   expect(Matrix3.IDENTITY.determinant()).toBeCloseTo(1, 10);
  });

  it('should satisfy: rotation matrix has det = 1', () => {
   fc.assert(
    fc.property(arbRotationMatrix3, (rot) => {
     return Math.abs(rot.determinant() - 1) < TEST_TOLERANCE;
    }),
   );
  });
 });

 // ========================================================================
 // Transpose Properties
 // ========================================================================

 describe('Transpose', () => {
  it('should satisfy: (Aᵀ)ᵀ = A', () => {
   fc.assert(
    fc.property(arbMatrix3, (a) => {
     const transposed = Matrix3.transpose(a.clone());
     const doubleTransposed = Matrix3.transpose(transposed);
     return Matrix3.exactEquals(doubleTransposed, a);
    }),
   );
  });
 });

 // ========================================================================
 // Affine Transform Properties
 // ========================================================================

 describe('Affine Transforms', () => {
  it('should satisfy: translation(v) * point(p) = p + v', () => {
   fc.assert(
    fc.property(arbVector2, arbVector2, (translation, point) => {
     const mat = Matrix3.fromTranslation(translation);
     const result = Matrix3.transformPoint(mat, point);
     const expected = Vector2.add(point, translation);
     return Vector2.nearEquals(result, expected);
    }),
   );
  });

  it('should satisfy: rotation preserves distance from origin', () => {
   fc.assert(
    fc.property(arbRotationMatrix3, arbVector2, (rot, v) => {
     const result = Matrix3.transformPoint(rot, v);
     const originalDistribution = Vector2.magnitude(v);
     const resultDistribution = Vector2.magnitude(result);
     return (
      Math.abs(originalDistribution - resultDistribution) <
      TEST_TOLERANCE * Math.max(originalDistribution, 1)
     );
    }),
   );
  });

  it('should satisfy: scale(s, s) * point scales uniformly', () => {
   fc.assert(
    fc.property(
     fc.integer({ min: 1, max: 100 }).map((n) => n),
     arbVector2,
     (scale, point) => {
      const mat = Matrix3.fromScale(new Vector2(scale, scale));
      const result = Matrix3.transformPoint(mat, point);
      const expected = new Vector2(point.x * scale, point.y * scale);
      return Vector2.nearEquals(result, expected, TEST_TOLERANCE);
     },
    ),
   );
  });
 });

 // ========================================================================
 // Composition Properties
 // ========================================================================

 describe('Composition', () => {
  it('should satisfy: (A * B) * C = A * (B * C) (associativity)', () => {
   fc.assert(
    fc.property(arbAffineMatrix3, arbAffineMatrix3, arbAffineMatrix3, (a, b, c) => {
     const left = Matrix3.multiply(Matrix3.multiply(a, b), c);
     const right = Matrix3.multiply(a, Matrix3.multiply(b, c));
     return Matrix3.nearEquals(left, right, TEST_TOLERANCE * 100);
    }),
   );
  });

  it('should satisfy: R(θ₁) * R(θ₂) = R(θ₁ + θ₂)', () => {
   fc.assert(
    fc.property(arbAngle, arbAngle, (theta1, theta2) => {
     const r1 = Matrix3.fromRotation(theta1);
     const r2 = Matrix3.fromRotation(theta2);
     const product = Matrix3.multiply(r1, r2);
     const combined = Matrix3.fromRotation(theta1 + theta2);
     return Matrix3.nearEquals(product, combined, TEST_TOLERANCE);
    }),
   );
  });

  it('should satisfy: T(a) * T(b) = T(a + b)', () => {
   fc.assert(
    fc.property(arbVector2, arbVector2, (a, b) => {
     const t1 = Matrix3.fromTranslation(a);
     const t2 = Matrix3.fromTranslation(b);
     const product = Matrix3.multiply(t1, t2);
     const combined = Matrix3.fromTranslation(Vector2.add(a, b));
     return Matrix3.nearEquals(product, combined, TEST_TOLERANCE);
    }),
   );
  });
 });

 // ========================================================================
 // Interpolation Properties
 // ========================================================================

 describe('Interpolation', () => {
  it('should satisfy: lerp(A, B, 0) = A', () => {
   fc.assert(
    fc.property(arbMatrix3, arbMatrix3, (a, b) => {
     const result = Matrix3.lerp(a, b, 0);
     return Matrix3.nearEquals(result, a);
    }),
   );
  });

  it('should satisfy: lerp(A, B, 1) = B', () => {
   fc.assert(
    fc.property(arbMatrix3, arbMatrix3, (a, b) => {
     const result = Matrix3.lerp(a, b, 1);
     return Matrix3.nearEquals(result, b);
    }),
   );
  });

  it('should satisfy: lerp(A, A, t) = A', () => {
   fc.assert(
    fc.property(arbMatrix3, fc.float({ min: -2, max: 2, noNaN: true }), (a, t) => {
     const result = Matrix3.lerp(a, a, t);
     return Matrix3.nearEquals(result, a);
    }),
   );
  });
 });

 // ========================================================================
 // Equality Properties
 // ========================================================================

 describe('Equality', () => {
  it('should satisfy: exactEquals reflexivity', () => {
   fc.assert(
    fc.property(arbMatrix3, (a) => {
     return Matrix3.exactEquals(a, a);
    }),
   );
  });

  it('should satisfy: nearEquals reflexivity', () => {
   fc.assert(
    fc.property(arbMatrix3, (a) => {
     return Matrix3.nearEquals(a, a);
    }),
   );
  });

  it('should satisfy: clone equals original', () => {
   fc.assert(
    fc.property(arbMatrix3, (a) => {
     return Matrix3.exactEquals(a, a.clone());
    }),
   );
  });
 });
});
