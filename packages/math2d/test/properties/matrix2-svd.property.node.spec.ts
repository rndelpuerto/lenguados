/**
 * @file test/properties/matrix2-svd.property.node.spec.ts
 * @module @lenguados/math2d/core
 * @description Property-based tests for Matrix2 SVD and its derivative methods.
 *
 * @remarks
 * Verifies algebraic invariants over 1000 fast-check samples per property:
 * - SVD reconstruction, ordering, Frobenius / determinant identities, U/V orthonormality
 * - polarDecompose round-trip (R · S = M)
 * - pseudoInverse Moore-Penrose axioms (the four Penrose 1955 conditions)
 * - closestRotation always-proper-rotation guarantee
 * - conditionNumber identities (κ(rotation) = 1, scale invariance, lower bound)
 *
 * Tolerance: `TEST_TOLERANCE = 1e-6` per `.claude/rules/testing-deep-patterns.md`
 * §Tolerance Constants — relaxed bound for property-based random inputs.
 */

import { describe, it } from '@jest/globals';
import * as fc from 'fast-check';

import { Matrix2 } from '../../src/core/matrix2';
import { Rotation2 } from '../../src/core/rotation2';
import { arbInvertibleMatrix2, arbMatrix2, arbRotationMatrix2 } from '../arbitraries';

const TEST_TOLERANCE = 1e-6;

interface RotationLike {
 readonly cos: number;
 readonly sin: number;
}

interface SigmaLike {
 readonly x: number;
 readonly y: number;
}

/**
 * Builds a 2×2 rotation matrix from a (cos, sin) pair (column-major Matrix2)
 *
 * @param r - Rotation expressed as (cos, sin) pair
 * @returns Equivalent Matrix2 in column-major form
 */
function rotationLikeToMatrix2(r: RotationLike): Matrix2 {
 return new Matrix2(r.cos, r.sin, -r.sin, r.cos);
}

/**
 * Reconstructs `M = U · diag(σ) · Vᵀ` from an SVD result
 *
 * @param result - SVD result with U, sigma, V fields
 * @param result.U - Left rotation factor
 * @param result.sigma - Singular values (σ_x, σ_y)
 * @param result.V - Right rotation factor
 * @returns Reconstructed 2×2 matrix
 */
function reconstructFromSvd(result: {
 U: RotationLike;
 sigma: SigmaLike;
 V: RotationLike;
}): Matrix2 {
 const Umat = rotationLikeToMatrix2(result.U);
 const Sigma = new Matrix2(result.sigma.x, 0, 0, result.sigma.y);
 const Vmat = rotationLikeToMatrix2(result.V);
 const Vt = Matrix2.transpose(Vmat);
 return Matrix2.multiply(Matrix2.multiply(Umat, Sigma), Vt);
}

/**
 * Frobenius norm helper
 *
 * @param m - Source matrix
 * @returns Frobenius norm `√(m00² + m01² + m10² + m11²)`
 */
function frobeniusNorm(m: Matrix2): number {
 return Math.sqrt(m.m00 * m.m00 + m.m01 * m.m01 + m.m10 * m.m10 + m.m11 * m.m11);
}

/**
 * Element-wise max-absolute-error helper
 *
 * @param actual - Computed matrix
 * @param expected - Reference matrix
 * @returns Largest `|actual.mᵢⱼ − expected.mᵢⱼ|` across the four components
 */
function maxComponentError(actual: Matrix2, expected: Matrix2): number {
 return Math.max(
  Math.abs(actual.m00 - expected.m00),
  Math.abs(actual.m01 - expected.m01),
  Math.abs(actual.m10 - expected.m10),
  Math.abs(actual.m11 - expected.m11),
 );
}

/**
 * Well-conditioned invertible Matrix2 arbitrary
 *
 * @remarks
 * The global `arbInvertibleMatrix2` filters by |det| > 1e-10 which can yield
 * ill-conditioned matrices that fail TEST_TOLERANCE bounds in property tests.
 * This local variant filters by |det| > 10 for Penrose-axiom and reconstruction
 * tests where condition number must stay moderate. Mirrors the precedent in
 * `matrix2.property.node.spec.ts:17-25`.
 */
const arbWellConditionedMatrix2 = fc
 .tuple(
  fc.integer({ min: -100, max: 100 }),
  fc.integer({ min: -100, max: 100 }),
  fc.integer({ min: -100, max: 100 }),
  fc.integer({ min: -100, max: 100 }),
 )
 .map(([m00, m01, m10, m11]) => new Matrix2(m00, m01, m10, m11))
 .filter((m) => Math.abs(m.determinant()) > 10);

describe('Matrix2 SVD Property-Based Tests', () => {
 /* ======================================================================== */
 /* SVD Invariants                                                           */
 /* ======================================================================== */

 describe('SVD invariants', () => {
  it('should satisfy: U · diag(σ) · Vᵀ ≈ M (reconstruction)', () => {
   fc.assert(
    fc.property(arbMatrix2, (m) => {
     const result = Matrix2.svd(m);
     const reconstructed = reconstructFromSvd(result);
     const scale = Math.max(1, frobeniusNorm(m));
     return maxComponentError(reconstructed, m) < TEST_TOLERANCE * scale;
    }),
   );
  });

  it('should satisfy: σ_x ≥ |σ_y| (ordering)', () => {
   fc.assert(
    fc.property(arbMatrix2, (m) => {
     const { sigma } = Matrix2.svd(m);
     // Skip pathological inputs producing NaN sigma (already covered by scenarios).
     if (Number.isNaN(sigma.x) || Number.isNaN(sigma.y)) return true;
     return sigma.x >= Math.abs(sigma.y) - TEST_TOLERANCE;
    }),
   );
  });

  it('should satisfy: σ_x ≥ 0 (non-negativity)', () => {
   fc.assert(
    fc.property(arbMatrix2, (m) => {
     const { sigma } = Matrix2.svd(m);
     if (Number.isNaN(sigma.x)) return true;
     return sigma.x >= 0;
    }),
   );
  });

  it('should satisfy: σ_x² + σ_y² = ‖M‖_F² (Frobenius identity)', () => {
   fc.assert(
    fc.property(arbMatrix2, (m) => {
     const { sigma } = Matrix2.svd(m);
     if (Number.isNaN(sigma.x) || Number.isNaN(sigma.y)) return true;
     const fNormSq = m.m00 * m.m00 + m.m01 * m.m01 + m.m10 * m.m10 + m.m11 * m.m11;
     const sigmaSq = sigma.x * sigma.x + sigma.y * sigma.y;
     return Math.abs(sigmaSq - fNormSq) < TEST_TOLERANCE * Math.max(1, fNormSq);
    }),
   );
  });

  it('should satisfy: σ_x · σ_y = det(M) (determinant identity, Convention A)', () => {
   fc.assert(
    fc.property(arbMatrix2, (m) => {
     const { sigma } = Matrix2.svd(m);
     if (Number.isNaN(sigma.x) || Number.isNaN(sigma.y)) return true;
     const det = m.m00 * m.m11 - m.m10 * m.m01;
     return Math.abs(sigma.x * sigma.y - det) < TEST_TOLERANCE * Math.max(1, Math.abs(det));
    }),
   );
  });

  it('should satisfy: U and V are unit rotations (cos² + sin² = 1)', () => {
   fc.assert(
    fc.property(arbMatrix2, (m) => {
     const { U, V } = Matrix2.svd(m);
     if (Number.isNaN(U.cos) || Number.isNaN(V.cos)) return true;
     const uMag = U.cos * U.cos + U.sin * U.sin;
     const vMag = V.cos * V.cos + V.sin * V.sin;
     return Math.abs(uMag - 1) < TEST_TOLERANCE && Math.abs(vMag - 1) < TEST_TOLERANCE;
    }),
   );
  });
 });

 /* ======================================================================== */
 /* Polar Decomposition                                                      */
 /* ======================================================================== */

 describe('Polar decomposition', () => {
  it('should satisfy: R · S = M (round-trip)', () => {
   fc.assert(
    fc.property(arbWellConditionedMatrix2, (m) => {
     const { R, S } = Matrix2.polarDecompose(m);
     const Rmat = rotationLikeToMatrix2(R);
     const Smat = new Matrix2(S.m00, S.m01, S.m10, S.m11);
     const reconstructed = Matrix2.multiply(Rmat, Smat);
     const scale = Math.max(1, frobeniusNorm(m));
     return maxComponentError(reconstructed, m) < TEST_TOLERANCE * scale;
    }),
   );
  });
 });

 /* ======================================================================== */
 /* Pseudo-Inverse Penrose Axioms                                            */
 /* ======================================================================== */

 describe('Pseudo-inverse Penrose axioms', () => {
  it('should satisfy axiom 1: M · M⁺ · M = M', () => {
   fc.assert(
    fc.property(arbWellConditionedMatrix2, (m) => {
     const pinv = Matrix2.pseudoInverse(m);
     const reconstructed = Matrix2.multiply(Matrix2.multiply(m, pinv), m);
     const scale = Math.max(1, frobeniusNorm(m));
     return maxComponentError(reconstructed, m) < TEST_TOLERANCE * scale;
    }),
   );
  });

  it('should satisfy axiom 2: M⁺ · M · M⁺ = M⁺', () => {
   fc.assert(
    fc.property(arbWellConditionedMatrix2, (m) => {
     const pinv = Matrix2.pseudoInverse(m);
     const reconstructed = Matrix2.multiply(Matrix2.multiply(pinv, m), pinv);
     const scale = Math.max(1, frobeniusNorm(pinv));
     return maxComponentError(reconstructed, pinv) < TEST_TOLERANCE * scale;
    }),
   );
  });

  it('should satisfy axiom 3: (M · M⁺) is symmetric', () => {
   fc.assert(
    fc.property(arbWellConditionedMatrix2, (m) => {
     const pinv = Matrix2.pseudoInverse(m);
     const product = Matrix2.multiply(m, pinv);
     const scale = Math.max(1, frobeniusNorm(product));
     return Math.abs(product.m01 - product.m10) < TEST_TOLERANCE * scale;
    }),
   );
  });

  it('should satisfy axiom 4: (M⁺ · M) is symmetric', () => {
   fc.assert(
    fc.property(arbWellConditionedMatrix2, (m) => {
     const pinv = Matrix2.pseudoInverse(m);
     const product = Matrix2.multiply(pinv, m);
     const scale = Math.max(1, frobeniusNorm(product));
     return Math.abs(product.m01 - product.m10) < TEST_TOLERANCE * scale;
    }),
   );
  });
 });

 /* ======================================================================== */
 /* Closest Rotation                                                         */
 /* ======================================================================== */

 describe('Closest rotation', () => {
  it('should always produce a proper rotation (cos² + sin² = 1)', () => {
   fc.assert(
    fc.property(arbInvertibleMatrix2, (m) => {
     const r = Rotation2.fromMatrix2Closest(m);
     const detR = r.cos * r.cos + r.sin * r.sin;
     return Math.abs(detR - 1) < TEST_TOLERANCE;
    }),
   );
  });
 });

 /* ======================================================================== */
 /* Condition Number                                                         */
 /* ======================================================================== */

 describe('Condition number', () => {
  it('should satisfy: κ(rotation) = 1', () => {
   fc.assert(
    fc.property(arbRotationMatrix2, (r) => {
     return Math.abs(Matrix2.conditionNumber(r) - 1) < TEST_TOLERANCE;
    }),
   );
  });

  it('should satisfy: κ(αM) = κ(M) for α > 0 (scale invariance)', () => {
   fc.assert(
    fc.property(
     arbWellConditionedMatrix2,
     fc.integer({ min: 1, max: 1000 }).map((n) => n / 10),
     (m, alpha) => {
      const baseline = Matrix2.conditionNumber(m);
      const scaled = Matrix2.conditionNumber(Matrix2.multiplyScalar(m, alpha));
      return Math.abs(baseline - scaled) < TEST_TOLERANCE * Math.max(1, baseline);
     },
    ),
   );
  });

  it('should satisfy: κ(M) ≥ 1 for non-singular M', () => {
   fc.assert(
    fc.property(arbWellConditionedMatrix2, (m) => {
     const kappa = Matrix2.conditionNumber(m);
     return kappa >= 1 - TEST_TOLERANCE;
    }),
   );
  });
 });
});
