/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @file src/linalg.ts
 * @module math2d/linalg
 * @description
 * Small, allocation‑conscious linear algebra helpers and solvers (2×2 and 3×3) optimized
 * for 2‑D engines. Conventions:
 *
 * - Matrices are **row‑major** and vectors are treated as **column vectors** (`A·x = b`).
 * - APIs avoid heap allocations whenever possible via an optional `out` parameter.
 * - Variants:
 *   - “normal” versions throw on singularity,
 *   - `Safe` versions never throw and return a zero vector on failure,
 *   - `Tol` versions throw when a pivot (or determinant) is `|·| ≤ ε`.
 */

import { Mat2, type ReadonlyMat2 } from './mat2';
import { Mat3, type ReadonlyMat3 } from './mat3';
import { LINEAR_EPSILON, MIN_SAFE_LENGTH } from './constants/precision';
import { Vector2, type ReadonlyVector2 } from './vector2';

/* ============================================================================================= */
/* Minimal vector shapes                                                                          */
/* ============================================================================================= */

// Using types from vector2.ts for consistency

/**
 * Minimal 3‑component vector for the 3×3 solvers.
 */
export interface Vec3Like {
 x: number;
 y: number;
 z: number;
}

/**
 * Readonly view of {@link Vec3Like}.
 */
export type ReadonlyVec3 = Readonly<Vec3Like>;

/**
 * Tiny alloc‑free helper to set a 3‑vector in place.
 *
 * @param out - Destination vector to be mutated.
 * @param x - X component.
 * @param y - Y component.
 * @param z - Z component.
 * @returns The same `out` reference, updated.
 */
function setVec3(out: Vec3Like, x: number, y: number, z: number): Vec3Like {
 out.x = x;
 out.y = y;
 out.z = z;
 return out;
}

/* ============================================================================================= */
/* Predicates & validations                                                                      */
/* ============================================================================================= */

/**
 * Checks whether a 3×3 matrix is (approximately) symmetric, i.e. `A ≈ Aᵀ`.
 *
 * @param a - The 3×3 matrix.
 * @param epsilon - Absolute tolerance for pairwise symmetry checks. Defaults to {@link LINEAR_EPSILON}.
 * @returns `true` if `|aᵢⱼ - aⱼᵢ| ≤ epsilon` for the off‑diagonal pairs, otherwise `false`.
 */
export function isSymmetric3(a: ReadonlyMat3, epsilon: number = LINEAR_EPSILON): boolean {
 return (
  Math.abs(a.m01 - a.m10) <= epsilon &&
  Math.abs(a.m02 - a.m20) <= epsilon &&
  Math.abs(a.m12 - a.m21) <= epsilon
 );
}

/**
 * Heuristically checks whether a 3×3 matrix is SPD (symmetric positive definite).
 * The test is: symmetric within `epsilon` and with positive leading principal minors.
 *
 * @param a - The 3×3 matrix.
 * @param epsilon - Tolerance used for symmetry and minor positivity checks. Defaults to {@link LINEAR_EPSILON}.
 * @returns `true` if the matrix passes the SPD heuristics, otherwise `false`.
 */
export function isSPD3(a: ReadonlyMat3, epsilon: number = LINEAR_EPSILON): boolean {
 if (!isSymmetric3(a, epsilon)) return false;

 // Leading principal minors 1×1, 2×2, and det3:
 const m1 = a.m00;
 const m2 = a.m00 * a.m11 - a.m01 * a.m10;
 const det3 = Mat3.determinant(a);

 return m1 > epsilon && m2 > epsilon && det3 > epsilon;
}

/* ============================================================================================= */
/* Solve 2×2 (thin re‑exports for API uniformity)                                                */
/* ============================================================================================= */

/**
 * Solves `A·x = b` for 2×2 systems.
 *
 * Accepts any `{x,y}`‑shaped input and internally adapts it to the vector type
 * expected by `Mat2`. Now returns a proper Vector2 instance.
 *
 * @param a - The 2×2 system matrix.
 * @param b - The 2‑vector right‑hand side `{x,y}`.
 * @param out - Optional destination Vector2; defaults to a new Vector2.
 * @returns A Vector2 containing the solution.
 * @throws {RangeError} If the matrix is singular (see {@link Mat2.solve}).
 */
export function solve2(a: ReadonlyMat2, b: ReadonlyVector2, out: Vector2 = new Vector2()): Vector2 {
 const det = Mat2.determinant(a);

 if (det === 0) {
  throw new RangeError('solve2: singular matrix');
 }

 const invDet = 1 / det;
 const x = (a.m11 * b.x - a.m01 * b.y) * invDet;
 const y = (-a.m10 * b.x + a.m00 * b.y) * invDet;

 return out.set(x, y);
}

/**
 * Safe variant of {@link solve2}. Never throws.
 *
 * Accepts any `{x,y}`‑shaped input and internally adapts it to the vector type
 * expected by `Mat2`. Now returns a proper Vector2 instance.
 *
 * @param a - The 2×2 system matrix.
 * @param b - The 2‑vector right‑hand side `{x,y}`.
 * @param out - Optional destination Vector2; defaults to a new Vector2.
 * @returns Vector2 containing the solution on success, or zero on failure.
 */
export function solve2Safe(
 a: ReadonlyMat2,
 b: ReadonlyVector2,
 out: Vector2 = new Vector2(),
): Vector2 {
 const det = Mat2.determinant(a);

 if (det === 0) {
  return out.zero();
 }

 const invDet = 1 / det;
 const x = (a.m11 * b.x - a.m01 * b.y) * invDet;
 const y = (-a.m10 * b.x + a.m00 * b.y) * invDet;

 return out.set(x, y);
}

/**
 * Tolerance variant of {@link solve2}. Throws if the pivot magnitude is `≤ epsilon`.
 *
 * Accepts any `{x,y}`‑shaped input and internally adapts it to the vector type
 * expected by `Mat2`. Now returns a proper Vector2 instance.
 *
 * @param a - The 2×2 system matrix.
 * @param b - The 2‑vector right‑hand side `{x,y}`.
 * @param epsilon - Pivot tolerance. Defaults to {@link LINEAR_EPSILON}.
 * @param out - Optional destination Vector2; defaults to a new Vector2.
 * @returns Vector2 containing the solution.
 * @throws {RangeError} If the system is near‑singular under the given tolerance.
 */
export function solve2Tol(
 a: ReadonlyMat2,
 b: ReadonlyVector2,
 epsilon: number = LINEAR_EPSILON,
 out: Vector2 = new Vector2(),
): Vector2 {
 if (epsilon < 0) {
  throw new RangeError('solve2Tol: epsilon must be non-negative');
 }

 const det = Mat2.determinant(a);

 if (Math.abs(det) <= epsilon) {
  throw new RangeError('solve2Tol: near-singular matrix');
 }

 const invDet = 1 / det;
 const x = (a.m11 * b.x - a.m01 * b.y) * invDet;
 const y = (-a.m10 * b.x + a.m00 * b.y) * invDet;

 return out.set(x, y);
}

/* ============================================================================================= */
/* Solve 3×3 (GEPP: Gaussian Elimination with Partial Pivoting)                                  */
/* ============================================================================================= */

/**
 * Solves `A·x = b` for 3×3 systems using in‑line GE with partial pivoting.
 *
 * @param A - The 3×3 system matrix.
 * @param b - The 3‑vector right‑hand side.
 * @param out - Optional destination vector; defaults to a zero vector.
 * @returns `out` containing the solution.
 * @throws {RangeError} If the system is singular (zero pivot).
 */
export function solve3(
 A: ReadonlyMat3,
 b: ReadonlyVec3,
 out: Vec3Like = { x: 0, y: 0, z: 0 },
): Vec3Like {
 // Copy rows: [a00 a01 a02 | b0], ...
 let a00 = A.m00,
  a01 = A.m01,
  a02 = A.m02,
  b0 = b.x;

 let a10 = A.m10,
  a11 = A.m11,
  a12 = A.m12,
  b1 = b.y;

 let a20 = A.m20,
  a21 = A.m21,
  a22 = A.m22,
  b2 = b.z;

 // Pivot column 0
 let r0 = Math.abs(a00),
  r1 = Math.abs(a10),
  r2 = Math.abs(a20);

 if (r1 > r0 && r1 >= r2) {
  // swap row0, row1
  [a00, a01, a02, b0, a10, a11, a12, b1] = [a10, a11, a12, b1, a00, a01, a02, b0];
  r0 = r1;
 } else if (r2 > r0 && r2 >= r1) {
  // swap row0, row2
  [a00, a01, a02, b0, a20, a21, a22, b2] = [a20, a21, a22, b2, a00, a01, a02, b0];
  r0 = r2;
 }

 if (a00 === 0) throw new RangeError('solve3: singular (pivot0=0)');

 // Eliminate below (0,0)
 const f10 = a10 / a00;
 a10 = 0;
 a11 -= f10 * a01;
 a12 -= f10 * a02;
 b1 -= f10 * b0;

 const f20 = a20 / a00;
 a20 = 0;
 a21 -= f20 * a01;
 a22 -= f20 * a02;
 b2 -= f20 * b0;

 // Pivot column 1 (rows 1 vs 2)
 if (Math.abs(a21) > Math.abs(a11)) {
  [a11, a12, b1, a21, a22, b2] = [a21, a22, b2, a11, a12, b1];
 }
 if (a11 === 0) throw new RangeError('solve3: singular (pivot1=0)');

 // Eliminate below (1,1)
 const f21 = a21 / a11;
 a21 = 0;
 a22 -= f21 * a12;
 b2 -= f21 * b1;

 if (a22 === 0) throw new RangeError('solve3: singular (pivot2=0)');

 // Back‑substitution
 const xz = b2 / a22;
 const xy = (b1 - a12 * xz) / a11;
 const xx = (b0 - a01 * xy - a02 * xz) / a00;

 return setVec3(out, xx, xy, xz);
}

/**
 * Safe variant of {@link solve3}. Never throws; returns zero on failure.
 *
 * @param A - The 3×3 system matrix.
 * @param b - The 3‑vector right‑hand side.
 * @param out - Optional destination vector; defaults to a zero vector.
 * @returns `out` containing the solution, or zero if the system is singular.
 */
export function solve3Safe(
 A: ReadonlyMat3,
 b: ReadonlyVec3,
 out: Vec3Like = { x: 0, y: 0, z: 0 },
): Vec3Like {
 try {
  return solve3(A, b, out);
 } catch {
  return setVec3(out, 0, 0, 0);
 }
}

/**
 * Tolerance variant of {@link solve3}. Throws if a pivot magnitude is `≤ epsilon`.
 *
 * @param A - The 3×3 system matrix.
 * @param b - The 3‑vector right‑hand side.
 * @param epsilon - Pivot tolerance. Defaults to {@link LINEAR_EPSILON}.
 * @param out - Optional destination vector; defaults to a zero vector.
 * @returns `out` containing the solution.
 * @throws {RangeError} If the system is near‑singular under the given tolerance.
 */
export function solve3Tol(
 A: ReadonlyMat3,
 b: ReadonlyVec3,
 epsilon: number = LINEAR_EPSILON,
 out: Vec3Like = { x: 0, y: 0, z: 0 },
): Vec3Like {
 // Same as solve3 but with tolerances on pivots (abs(pivot) <= ε → throw)
 let a00 = A.m00,
  a01 = A.m01,
  a02 = A.m02,
  b0 = b.x;

 let a10 = A.m10,
  a11 = A.m11,
  a12 = A.m12,
  b1 = b.y;

 let a20 = A.m20,
  a21 = A.m21,
  a22 = A.m22,
  b2 = b.z;

 // Pivot 0
 let r0 = Math.abs(a00),
  r1 = Math.abs(a10),
  r2 = Math.abs(a20);

 if (r1 > r0 && r1 >= r2) {
  [a00, a01, a02, b0, a10, a11, a12, b1] = [a10, a11, a12, b1, a00, a01, a02, b0];
 } else if (r2 > r0 && r2 >= r1) {
  [a00, a01, a02, b0, a20, a21, a22, b2] = [a20, a21, a22, b2, a00, a01, a02, b0];
 }
 if (Math.abs(a00) <= epsilon) throw new RangeError('solve3Tol: near‑singular (pivot0)');

 const f10 = a10 / a00;
 a10 = 0;
 a11 -= f10 * a01;
 a12 -= f10 * a02;
 b1 -= f10 * b0;

 const f20 = a20 / a00;
 a20 = 0;
 a21 -= f20 * a01;
 a22 -= f20 * a02;
 b2 -= f20 * b0;

 // Pivot 1
 if (Math.abs(a21) > Math.abs(a11)) {
  [a11, a12, b1, a21, a22, b2] = [a21, a22, b2, a11, a12, b1];
 }
 if (Math.abs(a11) <= epsilon) throw new RangeError('solve3Tol: near‑singular (pivot1)');

 const f21 = a21 / a11;
 a21 = 0;
 a22 -= f21 * a12;
 b2 -= f21 * b1;

 if (Math.abs(a22) <= epsilon) throw new RangeError('solve3Tol: near‑singular (pivot2)');

 const xz = b2 / a22;
 const xy = (b1 - a12 * xz) / a11;
 const xx = (b0 - a01 * xy - a02 * xz) / a00;

 return setVec3(out, xx, xy, xz);
}

/* ============================================================================================= */
/* Solve 3×3 SPD (in‑line Cholesky)                                                              */
/* ============================================================================================= */

/**
 * Solves `A·x = b` assuming `A` is SPD (symmetric positive definite) using Cholesky (`A = L·Lᵀ`).
 *
 * @param A - The 3×3 SPD matrix.
 * @param b - The 3‑vector right‑hand side.
 * @param out - Optional destination vector; defaults to a zero vector.
 * @returns `out` containing the solution.
 * @throws {RangeError} If `A` is not SPD (any diagonal in the factorization is non‑positive).
 */
export function solve3SPD(
 A: ReadonlyMat3,
 b: ReadonlyVec3,
 out: Vec3Like = { x: 0, y: 0, z: 0 },
): Vec3Like {
 // Factorize L (lower triangular, unit‑free diagonal)
 // l00
 if (A.m00 <= 0) throw new RangeError('solve3SPD: not SPD (l00)');
 const l00 = Math.sqrt(A.m00);
 const l10 = A.m10 / l00;
 const l20 = A.m20 / l00;

 const t11 = A.m11 - l10 * l10;
 if (t11 <= 0) throw new RangeError('solve3SPD: not SPD (l11)');
 const l11 = Math.sqrt(t11);
 const l21 = (A.m21 - l20 * l10) / l11;

 const t22 = A.m22 - l20 * l20 - l21 * l21;
 if (t22 <= 0) throw new RangeError('solve3SPD: not SPD (l22)');
 const l22 = Math.sqrt(t22);

 // Forward: L·y = b
 const y0 = b.x / l00;
 const y1 = (b.y - l10 * y0) / l11;
 const y2 = (b.z - l20 * y0 - l21 * y1) / l22;

 // Backward: Lᵀ·x = y
 const xz = y2 / l22;
 const xy = (y1 - l21 * xz) / l11;
 const xx = (y0 - l10 * xy - l20 * xz) / l00;

 return setVec3(out, xx, xy, xz);
}

/**
 * Safe variant of {@link solve3SPD}. Never throws; returns zero on failure.
 *
 * @param A - The 3×3 matrix expected to be SPD.
 * @param b - The 3‑vector right‑hand side.
 * @param out - Optional destination vector; defaults to a zero vector.
 * @returns `out` containing the solution, or zero if factorization fails.
 */
export function solve3SPDSafe(
 A: ReadonlyMat3,
 b: ReadonlyVec3,
 out: Vec3Like = { x: 0, y: 0, z: 0 },
): Vec3Like {
 try {
  return solve3SPD(A, b, out);
 } catch {
  return setVec3(out, 0, 0, 0);
 }
}

/* ============================================================================================= */
/* LDLᵀ 3×3 (symmetric; allows indefinite matrices) + Tol / Safe / Damped                        */
/* ============================================================================================= */

/**
 * Compact representation of the LDLᵀ factorization for 3×3 symmetric systems.
 *
 * - `L` has unit diagonal and is stored as:
 *   `[ [1, 0, 0], [l10, 1, 0], [l20, l21, 1] ]`
 * - `D` is diagonal: `diag(d0, d1, d2)`.
 */
export interface LDLT3 {
 /** Lower triangular factor (implicit unit diagonal): L[1,0]. */
 l10: number;
 /** Lower triangular factor (implicit unit diagonal): L[2,0]. */
 l20: number;
 /** Lower triangular factor (implicit unit diagonal): L[2,1]. */
 l21: number;
 /** Diagonal factor D[0,0]. */
 d0: number;
 /** Diagonal factor D[1,1]. */
 d1: number;
 /** Diagonal factor D[2,2]. */
 d2: number;
}

/**
 * Computes an LDLᵀ factorization without pivoting.
 *
 * @param A - The 3×3 symmetric matrix to factorize.
 * @param epsilon - Pivot tolerance; if `|d_k| ≤ epsilon`, the factorization fails. Defaults to `0` (strict).
 * @returns The compact {@link LDLT3} factors.
 * @throws {RangeError} If any diagonal pivot is (near) zero under the tolerance.
 */
export function ldlt3(A: ReadonlyMat3, epsilon: number = 0): LDLT3 {
 // k = 0
 const d0 = A.m00;
 if (Math.abs(d0) <= epsilon) throw new RangeError('ldlt3: pivot d0 ~ 0');

 const l10 = A.m10 / d0;
 const l20 = A.m20 / d0;

 // k = 1
 const d1 = A.m11 - l10 * A.m10; // = a11 - l10^2 * d0
 if (Math.abs(d1) <= epsilon) throw new RangeError('ldlt3: pivot d1 ~ 0');

 const number21 = A.m21 - l20 * A.m10; // = a21 - l20*l10*d0
 const l21 = number21 / d1;

 // k = 2
 const d2 = A.m22 - l20 * A.m20 - l21 * number21; // = a22 - l20^2*d0 - l21^2*d1
 if (Math.abs(d2) <= epsilon) throw new RangeError('ldlt3: pivot d2 ~ 0');

 return { l10, l20, l21, d0, d1, d2 };
}

/**
 * Solves a system using a precomputed LDLᵀ factorization.
 *
 * @param F - The {@link LDLT3} factors of `A`.
 * @param b - The 3‑vector right‑hand side.
 * @param out - Optional destination vector; defaults to a zero vector.
 * @returns `out` containing the solution `x`.
 */
export function ldlt3Solve(
 F: LDLT3,
 b: ReadonlyVec3,
 out: Vec3Like = { x: 0, y: 0, z: 0 },
): Vec3Like {
 // L·y = b
 const y0 = b.x;
 const y1 = b.y - F.l10 * y0;
 const y2 = b.z - F.l20 * y0 - F.l21 * y1;

 // D·z = y
 const z0 = y0 / F.d0;
 const z1 = y1 / F.d1;
 const z2 = y2 / F.d2;

 // Lᵀ·x = z
 const x2 = z2;
 const x1 = z1 - F.l21 * x2;
 const x0 = z0 - F.l10 * x1 - F.l20 * x2;

 return setVec3(out, x0, x1, x2);
}

/**
 * Solves `A·x = b` via LDLᵀ with tolerance (throws if any pivot satisfies `|d_k| ≤ ε`).
 *
 * @param A - The 3×3 symmetric matrix.
 * @param b - The 3‑vector right‑hand side.
 * @param epsilon - Pivot tolerance. Defaults to {@link LINEAR_EPSILON}.
 * @param out - Optional destination vector; defaults to a zero vector.
 * @returns `out` containing the solution.
 * @throws {RangeError} If the factorization fails under the tolerance.
 */
export function ldlt3SolveTol(
 A: ReadonlyMat3,
 b: ReadonlyVec3,
 epsilon: number = LINEAR_EPSILON,
 out: Vec3Like = { x: 0, y: 0, z: 0 },
): Vec3Like {
 const F = ldlt3(A, epsilon);
 return ldlt3Solve(F, b, out);
}

/**
 * Safe variant of {@link ldlt3SolveTol}. Never throws; returns zero on failure.
 *
 * @param A - The 3×3 symmetric matrix.
 * @param b - The 3‑vector right‑hand side.
 * @param out - Optional destination vector; defaults to a zero vector.
 * @returns `out` containing the solution, or zero if the factorization fails.
 */
export function ldlt3SolveSafe(
 A: ReadonlyMat3,
 b: ReadonlyVec3,
 out: Vec3Like = { x: 0, y: 0, z: 0 },
): Vec3Like {
 try {
  return ldlt3SolveTol(A, b, LINEAR_EPSILON, out);
 } catch {
  return setVec3(out, 0, 0, 0);
 }
}

/**
 * Damped variant of LDLᵀ: attempts `LDLᵀ` on `A`; on failure, solves `(A + λI)·x = b`.
 *
 * @param A - The 3×3 symmetric (possibly indefinite) matrix.
 * @param b - The 3‑vector right‑hand side.
 * @param lambda - Small positive regularizer added to the diagonal on fallback. Defaults to `MIN_SAFE_LENGTH * 100` (1e-8).
 * @param out - Optional destination vector; defaults to a zero vector.
 * @returns `out` containing the solution.
 * @throws {RangeError} If both the undamped and damped factorizations fail (rare).
 */
export function ldlt3SolveDamped(
 A: ReadonlyMat3,
 b: ReadonlyVec3,
 lambda: number = MIN_SAFE_LENGTH * 100, // 1e-8 for numerical stability
 out: Vec3Like = { x: 0, y: 0, z: 0 },
): Vec3Like {
 try {
  const F = ldlt3(A, LINEAR_EPSILON);
  return ldlt3Solve(F, b, out);
 } catch {
  // A + λI (no allocation of intermediate arrays beyond the Mat3 instance)
  const B = new Mat3(
   A.m00 + lambda,
   A.m01,
   A.m02,
   A.m10,
   A.m11 + lambda,
   A.m12,
   A.m20,
   A.m21,
   A.m22 + lambda,
  );

  // NOTE: use strict tolerance (0) for the damped path so that small λ is not rejected by ε.
  const F = ldlt3(B, 0);
  return ldlt3Solve(F, b, out);
 }
}

/* ============================================================================================= */
/* Mat3 inverse‑based helpers (convenient for tests/debug; not for hot paths)                    */
/* ============================================================================================= */

/**
 * Computes `out = A · v` with `A` 3×3 (row‑major) and `v` a 3×1 column vector `{x,y,z}`.
 * This is a small utility used by the inverse‑based solver wrappers below.
 *
 * @param A - The 3×3 matrix in row‑major layout.
 * @param v - The 3‑vector to multiply.
 * @param out - Optional destination vector; defaults to a new zero vector.
 * @returns `out` containing the product `A·v`.
 */
export function multiplyMat3Vec3(
 A: ReadonlyMat3,
 v: ReadonlyVec3,
 out: Vec3Like = { x: 0, y: 0, z: 0 },
): Vec3Like {
 const x = A.m00 * v.x + A.m01 * v.y + A.m02 * v.z;
 const y = A.m10 * v.x + A.m11 * v.y + A.m12 * v.z;
 const z = A.m20 * v.x + A.m21 * v.y + A.m22 * v.z;
 out.x = x;
 out.y = y;
 out.z = z;
 return out;
}

/**
 * Solves `A·x = b` using `Mat3.inverse(A)` and a matrix‑vector product.
 * This is primarily intended as a **reference/fallback** implementation for tests or debugging.
 *
 * @param A - The 3×3 system matrix.
 * @param b - The 3‑vector right‑hand side.
 * @param out - Optional destination vector; defaults to a zero vector.
 * @returns `out` containing the solution.
 * @throws {RangeError} If `A` is singular (as per {@link Mat3.inverse}).
 */
export function solve3ViaInverse(
 A: ReadonlyMat3,
 b: ReadonlyVec3,
 out: Vec3Like = { x: 0, y: 0, z: 0 },
): Vec3Like {
 const inv = Mat3.inverse(A); // throws if singular
 return multiplyMat3Vec3(inv, b, out);
}

/**
 * Safe variant of {@link solve3ViaInverse}. Uses `Mat3.inverseSafe(A)`.
 * If `A` is singular, `inverseSafe` returns the **zero matrix**, yielding `(0,0,0)` (no NaNs).
 *
 * @param A - The 3×3 system matrix.
 * @param b - The 3‑vector right‑hand side.
 * @param out - Optional destination vector; defaults to a zero vector.
 * @returns `out` containing the solution, or zero if `A` is singular.
 */
export function solve3ViaInverseSafe(
 A: ReadonlyMat3,
 b: ReadonlyVec3,
 out: Vec3Like = { x: 0, y: 0, z: 0 },
): Vec3Like {
 const inv = Mat3.inverseSafe(A); // → zero matrix if singular
 return multiplyMat3Vec3(inv, b, out); // → (0,0,0) if `inv` is zero
}

/**
 * Tolerance variant of the inverse‑based solver: uses `Mat3.inverseTol(A, epsilon)`.
 *
 * @param A - The 3×3 system matrix.
 * @param b - The 3‑vector right‑hand side.
 * @param epsilon - Determinant tolerance used by the inverse routine. Defaults to {@link LINEAR_EPSILON}.
 * @param out - Optional destination vector; defaults to a zero vector.
 * @returns `out` containing the solution.
 * @throws {RangeError} If `|det(A)| ≤ epsilon` (as per {@link Mat3.inverseTol}).
 */
export function solve3ViaInverseTol(
 A: ReadonlyMat3,
 b: ReadonlyVec3,
 epsilon: number = LINEAR_EPSILON,
 out: Vec3Like = { x: 0, y: 0, z: 0 },
): Vec3Like {
 const inv = Mat3.inverseTol(A, epsilon);
 return multiplyMat3Vec3(inv, b, out);
}

/**
 * Affine‑aware inverse‑based solver: if `A` is (approximately) affine, use
 * `Mat3.inverseAffine(A)`; otherwise, fall back to `Mat3.inverse(A)`.
 *
 * This is useful for 2‑D transform stacks where matrices have the canonical affine
 * form. Detection and specialized inverse are feature‑detected to avoid hard
 * dependencies; if the affine helpers are not available in `Mat3`, the function
 * simply falls back to `Mat3.inverse(A)`.
 *
 * @param A - The 3×3 system matrix (often an affine transform).
 * @param b - The 3‑vector right‑hand side.
 * @param out - Optional destination vector; defaults to a zero vector.
 * @returns `out` containing the solution.
 * @throws {RangeError} If inversion fails in the non‑affine path.
 */
export function solve3ViaInverseAffine(
 A: ReadonlyMat3,
 b: ReadonlyVec3,
 out: Vec3Like = { x: 0, y: 0, z: 0 },
): Vec3Like {
 const M: any = Mat3 as any;
 const inv =
  typeof M.isAffine === 'function' && typeof M.inverseAffine === 'function' && M.isAffine(A)
   ? M.inverseAffine(A)
   : Mat3.inverse(A);
 return multiplyMat3Vec3(inv, b, out);
}

/* ============================================================================================= */
/* Schur complement 2×2 by eliminating the third variable (z)                                    */
/* ============================================================================================= */

/**
 * Computes the Schur complement `S = M - (1/s)·v·vᵀ` of a 3×3 block‑partitioned matrix:
 *
 * ```
 * A = [ M(2×2)   v(2×1) ;
 *       vᵀ(1×2)  s     ]
 * ```
 *
 * This is useful to reduce a 3×3 system to 2×2 analytically when the third equation can be
 * eliminated in closed form.
 *
 * @param A - The 3×3 matrix in the block form above.
 * @param epsilon - Tolerance for the scalar pivot `s`. Throws if `|s| ≤ epsilon`. Defaults to {@link LINEAR_EPSILON}.
 * @param out - Optional destination `Mat2`; defaults to a new `Mat2`.
 * @returns `out` containing the 2×2 Schur complement `S`.
 * @throws {RangeError} If the scalar `s = A.m22` is (near) singular under the tolerance.
 */
export function schur2From3(
 A: ReadonlyMat3,
 epsilon: number = LINEAR_EPSILON,
 out: Mat2 = new Mat2(),
): Mat2 {
 const s = A.m22;
 if (Math.abs(s) <= epsilon) throw new RangeError('schur2From3: near‑singular scalar s');

 const invs = 1 / s;
 const v0 = A.m02,
  v1 = A.m12;

 // S = M - invs * [v0; v1] [v0 v1]
 const s00 = A.m00 - invs * v0 * v0;
 const s01 = A.m01 - invs * v0 * v1;
 const s10 = A.m10 - invs * v1 * v0;
 const s11 = A.m11 - invs * v1 * v1;

 return out.set(s00, s01, s10, s11);
}
