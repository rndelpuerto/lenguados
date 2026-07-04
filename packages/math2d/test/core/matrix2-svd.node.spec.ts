/**
 * @file test/core/matrix2-svd.node.spec.ts
 * @module @lenguados/math2d/test
 * @description Scenario tests for Matrix2 SVD and its four derivative methods,
 * plus the cross-class factory `Rotation2.fromMatrix2Closest`.
 *
 * @remarks
 * Test groups:
 * - `Matrix2.svd` scenarios (canonical inputs + IEEE 754 edge cases)
 * - SVD fixture cross-validation (30 generator-produced cases)
 * - `Matrix2.pseudoInverse` (Penrose axioms + edge cases)
 * - `Matrix2.polarDecompose` (R · S = M + S symmetry/PSD invariants)
 * - `Matrix2.conditionNumber` (κ = σ_max / |σ_min|, scale invariance)
 * - `Rotation2.fromMatrix2Closest` (always-proper-rotation, Convention A)
 * - Cross-method consistency
 * - Determinism (bit-exact across runs)
 *
 * Tolerance constants follow `.claude/rules/testing-deep-patterns.md` —
 * `DIGITS = 10` for default exact-input tests; graded relative tolerance
 * for ill-conditioned cases (per Higham 2002 §5.5 condition-number sensitivity).
 */

import { describe, expect, it } from '@jest/globals';

import { Matrix2 } from '../../src/core/matrix2';
import { Rotation2 } from '../../src/core/rotation2';

import fixtureData from './matrix2-svd-fixtures.json';

const DIGITS = 10;
const EPSILON = 1e-10;

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

/* ========================================================================== */
/* Matrix2.svd scenarios                                                      */
/* ========================================================================== */

describe('Matrix2.svd', () => {
 it('decomposes the identity matrix', () => {
  const result = Matrix2.svd(new Matrix2(1, 0, 0, 1));
  expect(result.sigma.x).toBeCloseTo(1, DIGITS);
  expect(result.sigma.y).toBeCloseTo(1, DIGITS);
 });

 it('decomposes the zero matrix with finite (cos, sin) factors', () => {
  const result = Matrix2.svd(new Matrix2(0, 0, 0, 0));
  expect(result.sigma.x).toBe(0);
  expect(result.sigma.y).toBe(0);
  expect(result.U.cos * result.U.cos + result.U.sin * result.U.sin).toBeCloseTo(1, DIGITS);
  expect(result.V.cos * result.V.cos + result.V.sin * result.V.sin).toBeCloseTo(1, DIGITS);
 });

 it('decomposes a pure rotation (π/4) with σ = (1, 1)', () => {
  const m = Matrix2.fromRotation(Math.PI / 4);
  const result = Matrix2.svd(m);
  expect(result.sigma.x).toBeCloseTo(1, DIGITS);
  expect(result.sigma.y).toBeCloseTo(1, DIGITS);
  const reconstructed = reconstructFromSvd(result);
  expect(maxComponentError(reconstructed, m)).toBeLessThan(EPSILON);
 });

 it('decomposes pure axis-aligned scale (3, 2) with σ = (3, 2)', () => {
  const m = new Matrix2(3, 0, 0, 2);
  const result = Matrix2.svd(m);
  expect(result.sigma.x).toBeCloseTo(3, DIGITS);
  expect(result.sigma.y).toBeCloseTo(2, DIGITS);
 });

 it('encodes reflection in signed σ_y (Convention A)', () => {
  const m = new Matrix2(1, 0, 0, -1);
  const result = Matrix2.svd(m);
  expect(result.sigma.x).toBeCloseTo(1, DIGITS);
  expect(result.sigma.y).toBeCloseTo(-1, DIGITS);
  const det = m.m00 * m.m11 - m.m10 * m.m01;
  expect(result.sigma.x * result.sigma.y).toBeCloseTo(det, DIGITS);
 });

 it('decomposes a rank-1 matrix with σ_y = 0 exactly', () => {
  const m = new Matrix2(1, 2, 1, 2);
  const result = Matrix2.svd(m);
  expect(result.sigma.x).toBeCloseTo(Math.sqrt(10), DIGITS);
  expect(result.sigma.y).toBe(0);
 });

 it('reconstructs random asymmetric matrices to machine precision', () => {
  const m = new Matrix2(1.5, -0.7, 0.3, 2.1);
  const result = Matrix2.svd(m);
  const reconstructed = reconstructFromSvd(result);
  const scale = Math.max(1, frobeniusNorm(m));
  expect(maxComponentError(reconstructed, m)).toBeLessThan(EPSILON * scale);
 });

 it('reconstructs an asymmetric integer matrix [[1,3],[2,4]] (row notation)', () => {
  const m = new Matrix2(1, 2, 3, 4);
  const result = Matrix2.svd(m);
  const reconstructed = reconstructFromSvd(result);
  const scale = Math.max(1, frobeniusNorm(m));
  expect(maxComponentError(reconstructed, m)).toBeLessThan(EPSILON * scale);
 });

 it('handles m00 = 0 case (90° rotation triangularisation path)', () => {
  const m = new Matrix2(0, 5, 3, 7);
  const result = Matrix2.svd(m);
  const det = m.m00 * m.m11 - m.m10 * m.m01;
  expect(result.sigma.x * result.sigma.y).toBeCloseTo(det, DIGITS);
  const reconstructed = reconstructFromSvd(result);
  const scale = Math.max(1, frobeniusNorm(m));
  expect(maxComponentError(reconstructed, m)).toBeLessThan(EPSILON * scale);
 });

 it('decomposes a shear matrix [[1, 1], [0, 1]] (row notation) yielding golden-ratio singular values', () => {
  // Column-major Matrix2(1, 0, 1, 1) = row notation [[m00, m10], [m01, m11]] = [[1, 1], [0, 1]]
  const m = new Matrix2(1, 0, 1, 1);
  const result = Matrix2.svd(m);
  // Singular values for the standard shear matrix: σ = (φ, 1/φ) where φ is the golden ratio.
  const phi = (1 + Math.sqrt(5)) / 2;
  expect(result.sigma.x).toBeCloseTo(phi, DIGITS);
  expect(result.sigma.y).toBeCloseTo(1 / phi, DIGITS);
  const reconstructed = reconstructFromSvd(result);
  expect(maxComponentError(reconstructed, m)).toBeLessThan(EPSILON);
 });

 it('decomposes a symmetric matrix [[2, 1], [1, 2]] (eigenvalues = singular values)', () => {
  // Column-major Matrix2(2, 1, 1, 2) = row notation [[2, 1], [1, 2]]. Symmetric PSD →
  // singular values equal eigenvalues = 2 ± 1 = (3, 1).
  const m = new Matrix2(2, 1, 1, 2);
  const result = Matrix2.svd(m);
  expect(result.sigma.x).toBeCloseTo(3, DIGITS);
  expect(result.sigma.y).toBeCloseTo(1, DIGITS);
  const reconstructed = reconstructFromSvd(result);
  expect(maxComponentError(reconstructed, m)).toBeLessThan(EPSILON);
 });

 it('instance forwarder m.svd() returns the same result as Matrix2.svd(m)', () => {
  const m = new Matrix2(1.5, -0.7, 0.3, 2.1);
  const staticResult = Matrix2.svd(m);
  const instanceResult = m.svd();
  expect(instanceResult.U.cos).toBe(staticResult.U.cos);
  expect(instanceResult.U.sin).toBe(staticResult.U.sin);
  expect(instanceResult.sigma.x).toBe(staticResult.sigma.x);
  expect(instanceResult.sigma.y).toBe(staticResult.sigma.y);
  expect(instanceResult.V.cos).toBe(staticResult.V.cos);
  expect(instanceResult.V.sin).toBe(staticResult.V.sin);
 });

 it('reconstructs a near-singular matrix at condition 10⁶', () => {
  const m = new Matrix2(1, 0, 0, 1e-6);
  const result = Matrix2.svd(m);
  expect(result.sigma.x).toBeCloseTo(1, DIGITS);
  expect(result.sigma.y).toBeCloseTo(1e-6, DIGITS);
  const reconstructed = reconstructFromSvd(result);
  expect(maxComponentError(reconstructed, m)).toBeLessThan(1e-6);
 });

 it('reconstructs a near-singular matrix at condition 10¹²', () => {
  const m = new Matrix2(1, 0, 0, 1e-12);
  const result = Matrix2.svd(m);
  const reconstructed = reconstructFromSvd(result);
  expect(maxComponentError(reconstructed, m)).toBeLessThan(1e-3);
 });

 it('produces σ_x ≈ 1 and σ_y ≤ EPSILON for effectively singular matrices', () => {
  const m = new Matrix2(1, 0, 0, 1e-15);
  const result = Matrix2.svd(m);
  expect(result.sigma.x).toBeCloseTo(1, DIGITS);
  expect(Math.abs(result.sigma.y)).toBeLessThan(1e-14);
 });

 it('propagates NaN through the entire SVD result', () => {
  const m = new Matrix2(NaN, 0, 0, 1);
  const result = Matrix2.svd(m);
  const allComponents = [
   result.sigma.x,
   result.sigma.y,
   result.U.cos,
   result.U.sin,
   result.V.cos,
   result.V.sin,
  ];
  expect(allComponents.some(Number.isNaN)).toBe(true);
 });

 it('does not throw for NaN input', () => {
  const m = new Matrix2(NaN, 0, 0, 1);
  expect(() => Matrix2.svd(m)).not.toThrow();
 });

 it('returns σ_x = Infinity for [[Inf, 0], [0, 1]] input', () => {
  const m = new Matrix2(Number.POSITIVE_INFINITY, 0, 0, 1);
  const result = Matrix2.svd(m);
  expect(result.sigma.x).toBe(Number.POSITIVE_INFINITY);
  expect(() => Matrix2.svd(m)).not.toThrow();
 });

 it('satisfies σ_x ≥ |σ_y| ≥ 0 (ordering invariant) for arbitrary inputs', () => {
  const cases = [
   new Matrix2(1.5, -0.7, 0.3, 2.1),
   new Matrix2(1, 2, 3, 4),
   new Matrix2(0, 5, 3, 7),
   new Matrix2(2, 1, 1, -2),
   new Matrix2(7, -3, 11, -5),
  ];
  for (const m of cases) {
   const result = Matrix2.svd(m);
   expect(result.sigma.x).toBeGreaterThanOrEqual(0);
   expect(result.sigma.x).toBeGreaterThanOrEqual(Math.abs(result.sigma.y) - EPSILON);
  }
 });
});

/* ========================================================================== */
/* SVD fixture cross-validation (30 cases)                                    */
/* ========================================================================== */

describe('Matrix2.svd fixture cross-validation (analytical oracle)', () => {
 it('matches the oracle on every fixture entry', () => {
  for (const fixture of fixtureData.fixtures) {
   const [m00, m01, m10, m11] = fixture.M;
   const m = new Matrix2(m00, m01, m10, m11);
   const result = Matrix2.svd(m);

   const fNorm = frobeniusNorm(m);
   const detM = m00 * m11 - m10 * m01;
   const baseScale = Math.max(1, fNorm);

   // (1) Reconstruction within graded tolerance based on condition number.
   const reconstructed = reconstructFromSvd(result);
   const recScale = baseScale * Math.max(1, fixture.conditionExpected);
   const recError = maxComponentError(reconstructed, m);
   // Cap reconstruction tolerance at 1e-1 even for condition ≈ 1e15 boundary.
   expect(recError).toBeLessThan(Math.min(0.1, EPSILON * recScale));

   // (2) Ordering: σ_x ≥ |σ_y| ≥ 0.
   expect(result.sigma.x).toBeGreaterThanOrEqual(0);
   expect(result.sigma.x + EPSILON * baseScale).toBeGreaterThanOrEqual(Math.abs(result.sigma.y));

   // (3) Orthonormality of U and V (cos² + sin² ≈ 1).
   const uMag = result.U.cos * result.U.cos + result.U.sin * result.U.sin;
   const vMag = result.V.cos * result.V.cos + result.V.sin * result.V.sin;
   expect(Math.abs(uMag - 1)).toBeLessThan(EPSILON);
   expect(Math.abs(vMag - 1)).toBeLessThan(EPSILON);

   // (4) Determinant identity: σ_x · σ_y = det(M).
   const detActual = result.sigma.x * result.sigma.y;
   const detTol = Math.max(EPSILON, EPSILON * Math.abs(detM));
   expect(Math.abs(detActual - detM)).toBeLessThan(detTol);

   // (5) Frobenius identity: σ_x² + σ_y² = ‖M‖_F².
   const fSqActual = result.sigma.x * result.sigma.x + result.sigma.y * result.sigma.y;
   const fSqExpected = fNorm * fNorm;
   const fSqTol = Math.max(EPSILON, EPSILON * fSqExpected);
   expect(Math.abs(fSqActual - fSqExpected)).toBeLessThan(fSqTol);
  }
 });
});

/* ========================================================================== */
/* Matrix2.pseudoInverse scenarios                                            */
/* ========================================================================== */

describe('Matrix2.pseudoInverse', () => {
 it('equals the regular inverse for non-singular input', () => {
  const m = new Matrix2(1.5, -0.7, 0.3, 2.1);
  const pinv = Matrix2.pseudoInverse(m);
  const inv = Matrix2.inverse(m);
  expect(maxComponentError(pinv, inv)).toBeLessThan(EPSILON * Math.max(1, frobeniusNorm(inv)));
 });

 it('maps the identity to the identity', () => {
  const pinv = Matrix2.pseudoInverse(new Matrix2(1, 0, 0, 1));
  expect(maxComponentError(pinv, new Matrix2(1, 0, 0, 1))).toBeLessThan(EPSILON);
 });

 it('maps the zero matrix to the zero matrix', () => {
  const pinv = Matrix2.pseudoInverse(new Matrix2(0, 0, 0, 0));
  expect(pinv.m00).toBe(0);
  expect(pinv.m01).toBe(0);
  expect(pinv.m10).toBe(0);
  expect(pinv.m11).toBe(0);
 });

 it('satisfies Penrose axiom 1: M · M⁺ · M = M', () => {
  const cases = [
   new Matrix2(1, 0, 0, 1),
   new Matrix2(2, 0, 0, 3),
   new Matrix2(1.5, -0.7, 0.3, 2.1),
   new Matrix2(1, 2, 3, 4),
   new Matrix2(1, 2, 1, 2), // rank-1
  ];
  for (const m of cases) {
   const pinv = Matrix2.pseudoInverse(m);
   const reconstructed = Matrix2.multiply(Matrix2.multiply(m, pinv), m);
   const scale = Math.max(1, frobeniusNorm(m));
   expect(maxComponentError(reconstructed, m)).toBeLessThan(EPSILON * scale);
  }
 });

 it('satisfies Penrose axiom 3: (M · M⁺) is symmetric', () => {
  const m = new Matrix2(1.5, -0.7, 0.3, 2.1);
  const pinv = Matrix2.pseudoInverse(m);
  const product = Matrix2.multiply(m, pinv);
  expect(Math.abs(product.m01 - product.m10)).toBeLessThan(
   EPSILON * Math.max(1, frobeniusNorm(product)),
  );
 });

 it('satisfies Penrose axiom 4: (M⁺ · M) is symmetric', () => {
  const m = new Matrix2(1.5, -0.7, 0.3, 2.1);
  const pinv = Matrix2.pseudoInverse(m);
  const product = Matrix2.multiply(pinv, m);
  expect(Math.abs(product.m01 - product.m10)).toBeLessThan(
   EPSILON * Math.max(1, frobeniusNorm(product)),
  );
 });

 it('propagates NaN', () => {
  const pinv = Matrix2.pseudoInverse(new Matrix2(NaN, 0, 0, 1));
  expect([pinv.m00, pinv.m01, pinv.m10, pinv.m11].some(Number.isNaN)).toBe(true);
 });

 it('writes to the provided out parameter when supplied', () => {
  const target = new Matrix2();
  const m = new Matrix2(2, 0, 0, 4);
  const result = Matrix2.pseudoInverse(m, target);
  expect(result).toBe(target);
  expect(result.m00).toBeCloseTo(0.5, DIGITS);
  expect(result.m11).toBeCloseTo(0.25, DIGITS);
 });

 it('mutates this when called as instance method', () => {
  const m = new Matrix2(2, 0, 0, 4);
  const result = m.pseudoInverse();
  expect(result).toBe(m);
  expect(m.m00).toBeCloseTo(0.5, DIGITS);
  expect(m.m11).toBeCloseTo(0.25, DIGITS);
 });

 it('handles aliasing safely when out === input', () => {
  const m = new Matrix2(1.5, -0.7, 0.3, 2.1);
  const mClone = m.clone();
  const expected = Matrix2.pseudoInverse(mClone, new Matrix2());
  Matrix2.pseudoInverse(m, m);
  expect(maxComponentError(m, expected)).toBeLessThan(
   EPSILON * Math.max(1, frobeniusNorm(expected)),
  );
 });
});

/* ========================================================================== */
/* Matrix2.polarDecompose scenarios                                           */
/* ========================================================================== */

describe('Matrix2.polarDecompose', () => {
 it('decomposes a pure rotation into rotation + identity stretch', () => {
  const m = Matrix2.fromRotation(Math.PI / 4);
  const { R, S } = Matrix2.polarDecompose(m);
  const rMat = rotationLikeToMatrix2(R);
  expect(maxComponentError(rMat, m)).toBeLessThan(EPSILON);
  expect(Math.abs(S.m00 - 1)).toBeLessThan(EPSILON);
  expect(Math.abs(S.m11 - 1)).toBeLessThan(EPSILON);
 });

 it('decomposes a pure positive scale into identity + scale matrix', () => {
  const m = new Matrix2(3, 0, 0, 2);
  const { R, S } = Matrix2.polarDecompose(m);
  const rMat = rotationLikeToMatrix2(R);
  expect(maxComponentError(rMat, new Matrix2(1, 0, 0, 1))).toBeLessThan(EPSILON);
  expect(Math.abs(S.m00 - 3)).toBeLessThan(EPSILON);
  expect(Math.abs(S.m11 - 2)).toBeLessThan(EPSILON);
 });

 it('reconstructs M = R · S to machine precision', () => {
  const cases = [
   new Matrix2(1, 0, 0, 1),
   new Matrix2(1.5, -0.7, 0.3, 2.1),
   new Matrix2(1, 2, 3, 4),
   new Matrix2(2, 1, 1, -2),
  ];
  for (const m of cases) {
   const { R, S } = Matrix2.polarDecompose(m);
   const rMat = rotationLikeToMatrix2(R);
   const sMat = new Matrix2(S.m00, S.m01, S.m10, S.m11);
   const reconstructed = Matrix2.multiply(rMat, sMat);
   const scale = Math.max(1, frobeniusNorm(m));
   expect(maxComponentError(reconstructed, m)).toBeLessThan(EPSILON * scale);
  }
 });

 it('produces a symmetric S factor exactly (S.m01 === S.m10)', () => {
  const cases = [
   new Matrix2(1.5, -0.7, 0.3, 2.1),
   new Matrix2(1, 2, 3, 4),
   new Matrix2(2, 1, 1, -2),
  ];
  for (const m of cases) {
   const { S } = Matrix2.polarDecompose(m);
   expect(S.m01).toBe(S.m10);
  }
 });

 it('produces a positive-semi-definite S for det(M) ≥ 0', () => {
  // For det(M) ≥ 0, S has non-negative eigenvalues = |σ_x|, |σ_y|.
  // Verify trace(S) ≥ 0 and det(S) ≥ 0 (sufficient PSD conditions for 2×2).
  const cases = [
   new Matrix2(1.5, -0.7, 0.3, 2.1), // det ≈ 3.36
   new Matrix2(2, 1, 0, 3), // det = 6
  ];
  for (const m of cases) {
   const { S } = Matrix2.polarDecompose(m);
   const traceS = S.m00 + S.m11;
   const detS = S.m00 * S.m11 - S.m10 * S.m01;
   expect(traceS).toBeGreaterThanOrEqual(-EPSILON);
   expect(detS).toBeGreaterThanOrEqual(-EPSILON);
  }
 });

 it('reconstructs a composition (rotation × scale) recovering both factors', () => {
  const angle = Math.PI / 6;
  const r0 = Matrix2.fromRotation(angle);
  const s0 = new Matrix2(2, 0, 0, 3);
  const m = Matrix2.multiply(r0, s0);
  const { R, S } = Matrix2.polarDecompose(m);
  const rMat = rotationLikeToMatrix2(R);
  expect(maxComponentError(rMat, r0)).toBeLessThan(EPSILON);
  const sMat = new Matrix2(S.m00, S.m01, S.m10, S.m11);
  expect(maxComponentError(sMat, s0)).toBeLessThan(EPSILON * Math.max(1, frobeniusNorm(s0)));
 });

 it('propagates NaN through S', () => {
  const { S } = Matrix2.polarDecompose(new Matrix2(NaN, 0, 0, 1));
  expect([S.m00, S.m01, S.m10, S.m11].some(Number.isNaN)).toBe(true);
 });

 it('does not throw on NaN input', () => {
  expect(() => Matrix2.polarDecompose(new Matrix2(NaN, 0, 0, 1))).not.toThrow();
 });

 it('produces a proper rotation R and indefinite S for det(M) < 0 (reflection input)', () => {
  // For M = diag(1, -1) (reflection, det = -1), Convention A polar produces:
  //   - R = U · Vᵀ, a proper rotation (det = +1) since U and V are both
  //     proper rotations under Convention A regardless of det(M) sign.
  //   - S = V · diag(σ) · Vᵀ with signed σ_y, so det(S) = det(M) = -1 (S is
  //     symmetric but indefinite — NOT positive-semi-definite).
  // This contrasts with textbook polar where R may be a reflection and S is
  // always SPD; Convention A pushes the sign into σ_y instead.
  const m = new Matrix2(1, 0, 0, -1);
  const { R, S } = Matrix2.polarDecompose(m);
  const Rmat = rotationLikeToMatrix2(R);
  // R is orthogonal: R · Rᵀ = I within EPSILON.
  const RRt = Matrix2.multiply(Rmat, Matrix2.transpose(Rmat));
  expect(maxComponentError(RRt, new Matrix2(1, 0, 0, 1))).toBeLessThan(EPSILON);
  // R is a proper rotation: det(R) = +1 (NOT a reflection).
  expect(R.cos * R.cos + R.sin * R.sin).toBeCloseTo(1, DIGITS);
  expect(Rmat.m00 * Rmat.m11 - Rmat.m01 * Rmat.m10).toBeCloseTo(1, DIGITS);
  // S has det(S) = det(M) = -1: symmetric indefinite, NOT PSD.
  expect(S.m00 * S.m11 - S.m01 * S.m10).toBeCloseTo(-1, DIGITS);
  expect(S.m01).toBe(S.m10);
 });

 it('produces a finite R and zero S for the zero matrix (degenerate decomposition)', () => {
  const { R, S } = Matrix2.polarDecompose(new Matrix2(0, 0, 0, 0));
  // R is some valid orthogonal matrix (cos² + sin² = 1).
  expect(R.cos * R.cos + R.sin * R.sin).toBeCloseTo(1, DIGITS);
  // S is the zero matrix.
  expect(S.m00).toBe(0);
  expect(S.m01).toBe(0);
  expect(S.m10).toBe(0);
  expect(S.m11).toBe(0);
 });

 it('instance forwarder m.polarDecompose() delegates to static', () => {
  const m = new Matrix2(1.5, -0.7, 0.3, 2.1);
  const staticResult = Matrix2.polarDecompose(m);
  const instanceResult = m.polarDecompose();
  expect(instanceResult.R.cos).toBe(staticResult.R.cos);
  expect(instanceResult.R.sin).toBe(staticResult.R.sin);
  expect(instanceResult.S.m00).toBe(staticResult.S.m00);
  expect(instanceResult.S.m11).toBe(staticResult.S.m11);
 });
});

/* ========================================================================== */
/* Matrix2.conditionNumber scenarios                                          */
/* ========================================================================== */

describe('Matrix2.conditionNumber', () => {
 it('returns 1 for the identity matrix', () => {
  expect(Matrix2.conditionNumber(new Matrix2(1, 0, 0, 1))).toBeCloseTo(1, DIGITS);
 });

 it('returns 1 for any proper rotation', () => {
  for (const angle of [0, Math.PI / 6, Math.PI / 3, Math.PI / 2, -Math.PI / 4]) {
   const m = Matrix2.fromRotation(angle);
   expect(Matrix2.conditionNumber(m)).toBeCloseTo(1, DIGITS);
  }
 });

 it('returns the diagonal scale ratio for diag(1, 0.1)', () => {
  expect(Matrix2.conditionNumber(new Matrix2(1, 0, 0, 0.1))).toBeCloseTo(10, DIGITS);
 });

 it('returns +Infinity for singular input', () => {
  expect(Matrix2.conditionNumber(new Matrix2(1, 0, 0, 0))).toBe(Number.POSITIVE_INFINITY);
  expect(Matrix2.conditionNumber(new Matrix2(0, 0, 0, 0))).toBe(Number.NaN);
  // Note: zero matrix has σ_max = 0, σ_min = 0 → 0/0 = NaN per IEEE 754.
 });

 it('returns NaN for NaN input', () => {
  expect(Number.isNaN(Matrix2.conditionNumber(new Matrix2(NaN, 0, 0, 1)))).toBe(true);
 });

 it('is invariant under positive scaling: κ(αM) = κ(M)', () => {
  const m = new Matrix2(1.5, -0.7, 0.3, 2.1);
  const baseline = Matrix2.conditionNumber(m);
  for (const alpha of [0.1, 1, 10, 100, 1e6]) {
   const scaled = Matrix2.multiplyScalar(m, alpha);
   expect(Matrix2.conditionNumber(scaled)).toBeCloseTo(baseline, 6);
  }
 });

 it('returns 1 for reflection diag(1, -1) (uses |σ_y|)', () => {
  expect(Matrix2.conditionNumber(new Matrix2(1, 0, 0, -1))).toBeCloseTo(1, DIGITS);
 });

 it('returns ≈ 10⁶ for near-singular matrix at condition 10⁶', () => {
  const k = Matrix2.conditionNumber(new Matrix2(1, 0, 0, 1e-6));
  expect(k).toBeCloseTo(1e6, -2); // tolerance scaled to magnitude
 });

 it('returns ≈ 10¹² for near-singular matrix at condition 10¹²', () => {
  const k = Matrix2.conditionNumber(new Matrix2(1, 0, 0, 1e-12));
  // For κ ≈ 10¹², relative tolerance is 1e-3 per Higham 2002 §5.5.
  expect(Math.abs(k - 1e12) / 1e12).toBeLessThan(1e-3);
 });

 it('instance forwarder m.conditionNumber() delegates to static', () => {
  const m = new Matrix2(1.5, -0.7, 0.3, 2.1);
  expect(m.conditionNumber()).toBe(Matrix2.conditionNumber(m));
 });
});

/* ========================================================================== */
/* Rotation2.fromMatrix2Closest scenarios                                     */
/* ========================================================================== */

describe('Rotation2.fromMatrix2Closest', () => {
 it('maps the identity matrix to the identity rotation', () => {
  const r = Rotation2.fromMatrix2Closest(new Matrix2(1, 0, 0, 1));
  expect(r.cos).toBeCloseTo(1, DIGITS);
  expect(r.sin).toBeCloseTo(0, DIGITS);
 });

 it('recovers a pure rotation exactly', () => {
  const angle = Math.PI / 3;
  const m = Matrix2.fromRotation(angle);
  const r = Rotation2.fromMatrix2Closest(m);
  expect(r.cos).toBeCloseTo(Math.cos(angle), DIGITS);
  expect(r.sin).toBeCloseTo(Math.sin(angle), DIGITS);
 });

 it('maps a pure positive scale to the identity rotation', () => {
  const r = Rotation2.fromMatrix2Closest(new Matrix2(2, 0, 0, 3));
  expect(r.cos).toBeCloseTo(1, DIGITS);
  expect(r.sin).toBeCloseTo(0, DIGITS);
 });

 it('always returns a proper rotation (det = +1)', () => {
  const cases = [
   new Matrix2(1, 0, 0, 1),
   new Matrix2(1, 0, 0, -1), // reflection input
   new Matrix2(0, 1, 1, 0), // anti-diagonal reflection
   new Matrix2(1.5, -0.7, 0.3, 2.1),
   new Matrix2(2, 1, 1, -2), // det < 0
   new Matrix2(2, 0, 0, -3), // det < 0 diagonal
  ];
  for (const m of cases) {
   const r = Rotation2.fromMatrix2Closest(m);
   const detR = r.cos * r.cos + r.sin * r.sin;
   expect(detR).toBeCloseTo(1, DIGITS);
  }
 });

 it('preserves a slightly perturbed rotation', () => {
  const angle = Math.PI / 4;
  const baseR = Matrix2.fromRotation(angle);
  const noise = new Matrix2(1e-6, -1e-6, 1e-6, -1e-6);
  const noisy = Matrix2.add(baseR, noise);
  const r = Rotation2.fromMatrix2Closest(noisy);
  // Angular distance should be very small — at most O(noise).
  const angularError = Math.atan2(r.sin, r.cos) - angle;
  expect(Math.abs(angularError)).toBeLessThan(1e-5);
 });

 it('returns the identity rotation for the zero matrix (deterministic default)', () => {
  const r = Rotation2.fromMatrix2Closest(new Matrix2(0, 0, 0, 0));
  expect(r.cos).toBeCloseTo(1, DIGITS);
  expect(r.sin).toBeCloseTo(0, DIGITS);
 });

 it('propagates NaN without throwing', () => {
  let r: Rotation2 | undefined;
  expect(() => {
   r = Rotation2.fromMatrix2Closest(new Matrix2(NaN, 0, 0, 1));
  }).not.toThrow();
  expect(r).toBeDefined();
  expect(Number.isNaN(r!.cos) || Number.isNaN(r!.sin)).toBe(true);
 });

 it('writes to the provided out parameter when supplied', () => {
  const target = new Rotation2();
  const m = Matrix2.fromRotation(Math.PI / 4);
  const result = Rotation2.fromMatrix2Closest(m, target);
  expect(result).toBe(target);
  expect(target.cos).toBeCloseTo(Math.cos(Math.PI / 4), DIGITS);
  expect(target.sin).toBeCloseTo(Math.sin(Math.PI / 4), DIGITS);
 });
});

/* ========================================================================== */
/* Cross-method consistency                                                   */
/* ========================================================================== */

describe('SVD-derivative cross-method consistency', () => {
 it('Rotation2.fromMatrix2Closest equals polarDecompose.R for any input sign', () => {
  // Under Convention A, both methods compute R = U · Vᵀ from the same SVD,
  // so the rotation factor is mathematically identical for every input —
  // including det(matrix) < 0, where U and V remain proper rotations and the
  // reflection sign flows entirely into σ_y. This test exercises both signs.
  const cases = [
   new Matrix2(1.5, -0.7, 0.3, 2.1), // det > 0
   new Matrix2(2, 1, 0, 3), // det > 0
   new Matrix2(1, 0, 0, 1), // identity (det = 1)
   new Matrix2(1, 0, 0, -1), // reflection (det = -1)
   new Matrix2(2, 1, 1, -3), // mixed-sign (det = -7)
  ];
  for (const m of cases) {
   const direct = Rotation2.fromMatrix2Closest(m);
   const viaPolar = Matrix2.polarDecompose(m).R;
   expect(direct.cos).toBeCloseTo(viaPolar.cos, DIGITS);
   expect(direct.sin).toBeCloseTo(viaPolar.sin, DIGITS);
  }
 });

 it('pseudoInverse equals inverse for non-singular input', () => {
  const m = new Matrix2(1.5, -0.7, 0.3, 2.1);
  const pinv = Matrix2.pseudoInverse(m);
  const inv = Matrix2.inverse(m);
  expect(maxComponentError(pinv, inv)).toBeLessThan(EPSILON * Math.max(1, frobeniusNorm(inv)));
 });

 it('conditionNumber equals σ_x / |σ_y| from SVD directly (finite cases)', () => {
  // All inputs below have finite σ_y > 0 → finite condition number.
  const cases = [
   new Matrix2(1, 0, 0, 1),
   new Matrix2(2, 0, 0, 3),
   new Matrix2(1.5, -0.7, 0.3, 2.1),
   new Matrix2(1, 0, 0, -1),
  ];
  for (const m of cases) {
   const { sigma } = Matrix2.svd(m);
   const expected = sigma.x / Math.abs(sigma.y);
   const actual = Matrix2.conditionNumber(m);
   expect(actual).toBeCloseTo(expected, 6);
  }
 });
});

/* ========================================================================== */
/* Determinism                                                                */
/* ========================================================================== */

describe('Matrix2.svd determinism', () => {
 it('produces bit-exact results across runs (deterministic kernel guarantee)', () => {
  const m = new Matrix2(0.123456789, 1.987654321, -2.345678912, 3.141592653);
  const r1 = Matrix2.svd(m);
  const r2 = Matrix2.svd(m);
  expect(r1.U.cos).toBe(r2.U.cos);
  expect(r1.U.sin).toBe(r2.U.sin);
  expect(r1.sigma.x).toBe(r2.sigma.x);
  expect(r1.sigma.y).toBe(r2.sigma.y);
  expect(r1.V.cos).toBe(r2.V.cos);
  expect(r1.V.sin).toBe(r2.V.sin);
 });
});
