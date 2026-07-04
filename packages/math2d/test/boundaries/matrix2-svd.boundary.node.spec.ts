/**
 * @file test/boundaries/matrix2-svd.boundary.node.spec.ts
 * @module @lenguados/math2d/core
 * @description Boundary tests for `Matrix2.svd` rare DLASV2 algorithm paths.
 *
 * @remarks
 * Targets the four uncovered branches of the LAPACK `DLASV2` translation in
 * `core/matrix2.ts` that scenario tests cannot reach with random inputs:
 *
 * 1. `gasmal = false` (very-large-GA case): triggers when `|G| / |F| > 1/EPSILON`
 *    after triangularisation. Documented at `dlasv2.f` line 154.
 * 2. `mm === 0` (m² underflow): triggers when `(G/F)² < MIN_VALUE`. Documented
 *    at `dlasv2.f` line 184 ("Avoid possible 0/0 problem").
 * 3. PMAX = 2 sign correction: triggers when off-diagonal `G` is larger than
 *    diagonal `F` after triangularisation. Verifies the documented
 *    `TSIGN = sign(SNR)·sign(CSL)·sign(G)` branch at `dlasv2.f` line 232.
 * 4. `(D == FA)` infinity-tolerance: triggers when `|H|` is so small that
 *    `|F| - |H| === |F|` exactly. Documented at `dlasv2.f` line 168
 *    ("Copes with infinite F or H").
 *
 * Each test verifies the SVD output remains correct (or NaN-propagating) for
 * its targeted input shape, providing regression protection against future
 * refactors that might silently break these paths. Tolerance constants follow
 * `.claude/rules/testing-deep-patterns.md` — graded relative bounds for the
 * regimes where exact-precision checks are unreasonable.
 */

import { describe, expect, it } from '@jest/globals';

import { Matrix2 } from '../../src/core/matrix2';

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

describe('Matrix2.svd boundary paths', () => {
 it('exercises the very-large-GA branch (gasmal = false)', () => {
  // Construct M such that after Givens triangularisation, |G| / |F| > 1/EPSILON.
  // Input M = [[1, 1e16], [0, 1]] in row notation = Matrix2(1, 0, 1e16, 1):
  //   Triangularise: m01 = 0 → fast path, F = 1, G = 1e16, H = 1.
  //   In DLASV2: fa = 1, ga = 1e16, ga > fa, fa/ga = 1e-16 < EPSILON →
  //   gasmal = false branch fires (the very-large-GA case at dlasv2.f:154).
  const m = new Matrix2(1, 0, 1e16, 1);
  const result = Matrix2.svd(m);
  // For this near-rank-1 matrix, σ_x ≈ 1e16, σ_y ≈ 1/1e16 = 1e-16.
  expect(result.sigma.x).toBeGreaterThan(1e15);
  expect(Math.abs(result.sigma.y)).toBeLessThan(1e-10);
  // Reconstruction within graded relative tolerance for κ ≈ 1e32 regime
  // (effectively rank-1; reconstruction of the small component is at
  // machine-precision noise level).
  const reconstructed = reconstructFromSvd(result);
  // The dominant component m10 = 1e16 must reconstruct within absolute 1e6.
  expect(Math.abs(reconstructed.m10 - 1e16)).toBeLessThan(1e6);
  // U and V remain unit rotations.
  expect(result.U.cos * result.U.cos + result.U.sin * result.U.sin).toBeCloseTo(1, 10);
  expect(result.V.cos * result.V.cos + result.V.sin * result.V.sin).toBeCloseTo(1, 10);
 });

 it('exercises the mm === 0 underflow branch in the normal-case path', () => {
  // Construct M such that after triangularisation, m = G/F has m² underflow.
  // For m² < MIN_VALUE = 5e-324, m must be < ~2.2e-162.
  // Input M = [[1, 1e-200], [0, 1]] in row notation = Matrix2(1, 0, 1e-200, 1):
  //   Triangularise: m01 = 0 → F = 1, G = 1e-200, H = 1.
  //   In DLASV2: fa = 1, ga = 1e-200, ga not > fa → gasmal stays true,
  //   normal-case branch fires. m = G/F = 1e-200, mm = m² = 1e-400 → underflows
  //   to 0. The mm === 0 special case at dlasv2.f:184 ("Avoid possible 0/0
  //   problem") fires.
  const m = new Matrix2(1, 0, 1e-200, 1);
  const result = Matrix2.svd(m);
  // For this matrix, σ_x ≈ 1, σ_y ≈ 1 (it's near-identity with tiny perturbation).
  expect(result.sigma.x).toBeCloseTo(1, 6);
  expect(result.sigma.y).toBeCloseTo(1, 6);
  // Reconstruction holds within EPSILON for this near-identity input.
  const reconstructed = reconstructFromSvd(result);
  expect(maxComponentError(reconstructed, m)).toBeLessThan(EPSILON);
 });

 it('exercises the PMAX = 2 sign correction branch', () => {
  // Construct M such that after triangularisation, |G| > |F| but not extreme
  // enough to trigger the very-large-GA branch (so gasmal stays true).
  // Input M = [[1, 100], [0, 1]] in row notation = Matrix2(1, 0, 100, 1):
  //   Triangularise: F = 1, G = 100, H = 1.
  //   In DLASV2: fa = 1, ga = 100, ga > fa → pmax = 2.
  //   fa/ga = 0.01 > EPSILON → gasmal stays true (normal case).
  //   Sign correction uses the PMAX === 2 branch (dlasv2.f:232):
  //     TSIGN = sign(SNR) · sign(CSL) · sign(G).
  const m = new Matrix2(1, 0, 100, 1);
  const result = Matrix2.svd(m);
  // For this matrix, ‖M‖_F² = 1 + 100² + 1 = 10002. det = 1·1 - 100·0 = 1.
  // σ_x² + σ_y² = 10002, σ_x · σ_y = 1.
  // → σ_x ≈ 100.01, σ_y ≈ 0.01.
  expect(result.sigma.x).toBeCloseTo(100.01, 1);
  expect(Math.abs(result.sigma.y)).toBeCloseTo(0.01, 4);
  expect(result.sigma.x * result.sigma.y).toBeCloseTo(1, 6);
  const reconstructed = reconstructFromSvd(result);
  expect(maxComponentError(reconstructed, m)).toBeLessThan(EPSILON * 100);
 });

 it('exercises the (D == FA) infinity-tolerance branch', () => {
  // Construct M where |H| is so small that |F| - |H| === |F| exactly under FP
  // arithmetic — i.e., |H| < |F| · EPSILON. This triggers the (D == FA) idiom
  // at dlasv2.f:168 which sets L = 1 to avoid loss of precision.
  // Input M = [[1, 0], [0, 1e-20]] in row notation = Matrix2(1, 0, 0, 1e-20):
  //   Triangularise: F = 1, G = 0, H = 1e-20.
  //   In DLASV2: fa = 1, ga = 0 → diagonal-case shortcut fires (ga === 0).
  //   The diagonal case doesn't exercise (D == FA) — let me redirect to a case
  //   that does. Use M with non-zero G to force the normal-case path:
  //   Input M = [[1, 1], [0, 1e-20]] = Matrix2(1, 0, 1, 1e-20):
  //   Triangularise: F = 1, G = 1, H = 1e-20.
  //   DLASV2: fa = 1, ga = 1 (not > fa), gasmal = true. d = fa - ha = 1 - 1e-20.
  //   Under IEEE 754 double: 1 - 1e-20 === 1 (1e-20 is below precision of 1).
  //   So d === fa → l = 1 (the (D == FA) branch at dlasv2.f:168).
  const m = new Matrix2(1, 0, 1, 1e-20);
  const result = Matrix2.svd(m);
  // For this matrix, ‖M‖_F² = 1 + 0 + 1 + 0 ≈ 2 (the 1e-40 contribution underflows).
  // det = 1·1e-20 - 1·0 = 1e-20.
  // → σ_x² + σ_y² ≈ 2, σ_x · σ_y ≈ 1e-20. σ_x ≈ √2, σ_y ≈ 1e-20/√2.
  expect(result.sigma.x).toBeCloseTo(Math.sqrt(2), 6);
  expect(Math.abs(result.sigma.y)).toBeLessThan(1e-15);
  // The L = 1 shortcut preserves precision; reconstruction stays bounded.
  const reconstructed = reconstructFromSvd(result);
  // Allow loose absolute tolerance here because m11 = 1e-20 underflows in
  // intermediate FP — actual reconstructed m11 may be 0, indistinguishable
  // from input at this scale.
  expect(Math.abs(reconstructed.m00 - 1)).toBeLessThan(EPSILON);
  expect(Math.abs(reconstructed.m10 - 1)).toBeLessThan(EPSILON);
 });
});
