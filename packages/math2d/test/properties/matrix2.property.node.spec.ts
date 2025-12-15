/**
 * @file test/properties/matrix2.property.node.spec.ts
 * @module @lenguados/math2d/core
 * @description Property-based tests for Matrix2.
 */

import { describe, expect, it } from '@jest/globals';
import * as fc from 'fast-check';

import { Matrix2 } from '../../src/core/matrix2';
import { Vector2 } from '../../src/core/vector2';
import { arbMatrix2, arbRotationMatrix2, arbAngle, arbVector2 } from '../arbitraries';

const TEST_TOLERANCE = 1e-6;

// Local arbitrary for invertible matrices with bounded values for numerical stability
const arbInvertibleMatrix2 = fc
 .tuple(
  fc.integer({ min: -100, max: 100 }),
  fc.integer({ min: -100, max: 100 }),
  fc.integer({ min: -100, max: 100 }),
  fc.integer({ min: -100, max: 100 }),
 )
 .map(([m00, m01, m10, m11]) => new Matrix2(m00, m01, m10, m11))
 .filter((m) => Math.abs(m.determinant()) > 10); // Well-conditioned matrices

describe('Matrix2 Property-Based Tests', () => {
 // ========================================================================
 // Identity Properties
 // ========================================================================

 describe('Identity', () => {
  it('should satisfy: A * I = A', () => {
   fc.assert(
    fc.property(arbMatrix2, (a) => {
     const result = Matrix2.multiply(a, Matrix2.IDENTITY);
     return Matrix2.nearEquals(result, a);
    }),
   );
  });

  it('should satisfy: I * A = A', () => {
   fc.assert(
    fc.property(arbMatrix2, (a) => {
     const result = Matrix2.multiply(Matrix2.IDENTITY, a);
     return Matrix2.nearEquals(result, a);
    }),
   );
  });

  it('should satisfy: I * v = v', () => {
   fc.assert(
    fc.property(arbVector2, (v) => {
     const result = Matrix2.transformVector(Matrix2.IDENTITY, v);
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
   expect(Matrix2.IDENTITY.determinant()).toBeCloseTo(1, 10);
  });

  it('should satisfy: det(A * B) = det(A) * det(B)', () => {
   // Use bounded matrices to avoid floating-point overflow in determinant computation
   const arbBoundedMatrix2 = fc
    .tuple(
     fc.integer({ min: -100, max: 100 }),
     fc.integer({ min: -100, max: 100 }),
     fc.integer({ min: -100, max: 100 }),
     fc.integer({ min: -100, max: 100 }),
    )
    .map(([m00, m01, m10, m11]) => new Matrix2(m00, m01, m10, m11));

   fc.assert(
    fc.property(arbBoundedMatrix2, arbBoundedMatrix2, (a, b) => {
     const product = Matrix2.multiply(a, b);
     const detProduct = product.determinant();
     const detA = a.determinant();
     const detB = b.determinant();
     // Relative tolerance for determinants
     const maxDet = Math.max(Math.abs(detA * detB), 1);
     return Math.abs(detProduct - detA * detB) < TEST_TOLERANCE * maxDet;
    }),
   );
  });

  it('should satisfy: rotation matrix has det = 1', () => {
   fc.assert(
    fc.property(arbRotationMatrix2, (rot) => {
     return Math.abs(rot.determinant() - 1) < TEST_TOLERANCE;
    }),
   );
  });
 });

 // ========================================================================
 // Inverse Properties
 // ========================================================================

 describe('Inverse', () => {
  it('should satisfy: A * A⁻¹ = I for invertible A', () => {
   fc.assert(
    fc.property(arbInvertibleMatrix2, (a) => {
     const inv = Matrix2.inverse(a);
     const product = Matrix2.multiply(a, inv);
     return Matrix2.nearEquals(product, Matrix2.IDENTITY, TEST_TOLERANCE * 10);
    }),
   );
  });

  it('should satisfy: (A⁻¹)⁻¹ = A for invertible A', () => {
   fc.assert(
    fc.property(arbInvertibleMatrix2, (a) => {
     const inv = Matrix2.inverse(a);
     const invInv = Matrix2.inverse(inv);
     return Matrix2.nearEquals(invInv, a, TEST_TOLERANCE * 10);
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
    fc.property(arbMatrix2, (a) => {
     const transposed = Matrix2.transpose(a.clone());
     const doubleTransposed = Matrix2.transpose(transposed);
     return Matrix2.exactEquals(doubleTransposed, a);
    }),
   );
  });

  it('should satisfy: (A * B)ᵀ = Bᵀ * Aᵀ', () => {
   fc.assert(
    fc.property(arbMatrix2, arbMatrix2, (a, b) => {
     const productTransposed = Matrix2.transpose(Matrix2.multiply(a, b));
     const bTransposed = Matrix2.transpose(b.clone());
     const aTransposed = Matrix2.transpose(a.clone());
     const transposedProduct = Matrix2.multiply(bTransposed, aTransposed);
     return Matrix2.nearEquals(productTransposed, transposedProduct);
    }),
   );
  });
 });

 // ========================================================================
 // Rotation Matrix Properties
 // ========================================================================

 describe('Rotation Matrices', () => {
  it('should satisfy: rotation matrices are orthogonal (Rᵀ * R = I)', () => {
   fc.assert(
    fc.property(arbRotationMatrix2, (rot) => {
     const transposed = Matrix2.transpose(rot.clone());
     const product = Matrix2.multiply(transposed, rot);
     return Matrix2.nearEquals(product, Matrix2.IDENTITY, TEST_TOLERANCE);
    }),
   );
  });

  it('should satisfy: rotation preserves vector length', () => {
   fc.assert(
    fc.property(arbRotationMatrix2, arbVector2, (rot, v) => {
     const transformed = Matrix2.transformVector(rot, v);
     const originalLength = Vector2.magnitude(v);
     const transformedLength = Vector2.magnitude(transformed);
     return (
      Math.abs(originalLength - transformedLength) < TEST_TOLERANCE * Math.max(originalLength, 1)
     );
    }),
   );
  });

  it('should satisfy: R(θ₁) * R(θ₂) = R(θ₁ + θ₂)', () => {
   fc.assert(
    fc.property(arbAngle, arbAngle, (theta1, theta2) => {
     const r1 = Matrix2.fromRotation(theta1);
     const r2 = Matrix2.fromRotation(theta2);
     const product = Matrix2.multiply(r1, r2);
     const combined = Matrix2.fromRotation(theta1 + theta2);
     return Matrix2.nearEquals(product, combined, TEST_TOLERANCE);
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
    fc.property(arbMatrix2, arbMatrix2, (a, b) => {
     const result = Matrix2.lerp(a, b, 0);
     return Matrix2.nearEquals(result, a);
    }),
   );
  });

  it('should satisfy: lerp(A, B, 1) = B', () => {
   fc.assert(
    fc.property(arbMatrix2, arbMatrix2, (a, b) => {
     const result = Matrix2.lerp(a, b, 1);
     return Matrix2.nearEquals(result, b);
    }),
   );
  });

  it('should satisfy: lerp(A, A, t) = A', () => {
   fc.assert(
    fc.property(arbMatrix2, fc.float({ min: -2, max: 2, noNaN: true }), (a, t) => {
     const result = Matrix2.lerp(a, a, t);
     return Matrix2.nearEquals(result, a);
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
    fc.property(arbMatrix2, (a) => {
     return Matrix2.exactEquals(a, a);
    }),
   );
  });

  it('should satisfy: nearEquals reflexivity', () => {
   fc.assert(
    fc.property(arbMatrix2, (a) => {
     return Matrix2.nearEquals(a, a);
    }),
   );
  });

  it('should satisfy: clone equals original', () => {
   fc.assert(
    fc.property(arbMatrix2, (a) => {
     return Matrix2.exactEquals(a, a.clone());
    }),
   );
  });
 });
});
