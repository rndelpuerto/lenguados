/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-dupe-class-members */
/**
 * @file src/rot2.ts
 * @module math2d/rot2
 * @description Pure 2‑D rotation representation and operations for the Lenguado physics-engine family.
 *
 * @remarks
 * - Representation: unit complex `{ c, s } = { cos(θ), sin(θ) }`.
 * - Composition is complex multiplication; inverse is the conjugate.
 * - **Convention:** angles are in radians with **CCW positive**; vectors are treated
 *   as **column vectors** and the rotation matrix is:
 *     ```
 *     R = [ c  -s
 *           s   c ]
 *     ```
 *   so `v' = R · v` and `R(a)·R(b) = R(a + b)`.
 * - Instance methods are **mutable** and chainable; static helpers are **pure**
 *   and provide **alloc‑free** overloads writing into `out` parameters.
 * - Includes robust normalization to mitigate numerical drift in hot paths.
 */

import { deltaRadians } from './angle';
import { Mat2, ReadonlyMat2 } from './mat2';
import { EPSILON } from './scalar';
import { LINEAR_EPSILON, ANGULAR_EPSILON } from './constants/precision';
import { validateTolerance, areNearEqual } from './core-utils/tolerance';
import { Vector2, ReadonlyVector2 } from './vector2';

/**
 * Minimal structural type for a rotation `{ c, s }`.
 * Use this to interoperate with plain objects when needed.
 * @public
 */
export interface Rot2Like {
 /** Cosine of the angle. */
 c: number;
 /** Sine of the angle. */
 s: number;
}

/** Readonly view of {@link Rot2}. */
export type ReadonlyRot2 = Readonly<Rot2>;

/* ========================================================================== */
/* Helpers                                                                    */
/* ========================================================================== */

/**
 * Permanently freezes a {@link Rot2} instance so it can no longer be mutated.
 *
 * @param rotation - The {@link Rot2} to freeze.
 * @returns The *same* instance, now typed as {@link ReadonlyRot2},
 *          after being frozen with {@link Object.freeze}.
 *
 * @remarks
 * - The returned object keeps its original reference; no new memory is allocated.
 * - In *strict mode* any subsequent attempt to modify fields throws a `TypeError`.
 *   In non‑strict mode the write is silently ignored.
 * - Use this helper to create **truly immutable static constants** such as
 *   {@link Rot2.IDENTITY_ROTATION}, ensuring they cannot be altered at runtime.
 *
 * @example
 * ```ts
 * const I = freezeRot2(new Rot2()); // identity by default
 * // Will throw in strict mode:
 * I.c = 0.5;
 * ```
 */
export function freezeRot2(rotation: Rot2): ReadonlyRot2 {
 return Object.freeze(rotation);
}

/**
 * **Type guard** for a plain object that *looks* like a rotation `{ c, s }`.
 *
 * @param subject - Unknown value to test.
 * @returns `true` if both `c` and `s` are numeric; otherwise `false`.
 */
export function isRot2Like(subject: unknown): subject is Readonly<Rot2Like> {
 return (
  typeof subject === 'object' &&
  subject !== null &&
  typeof (subject as { c?: unknown }).c === 'number' &&
  typeof (subject as { s?: unknown }).s === 'number'
 );
}

/* ========================================================================== */
/* Class: Rot2                                                                */
/* ========================================================================== */

/**
 * Pure 2‑D rotation represented as a unit complex `{ c, s } = { cosθ, sinθ }`.
 *
 * @remarks
 * - **Composition:** `R(a) · R(b) = R(a + b)` via complex multiplication.
 * - **Inverse:** conjugate `{ c, −s }` equals `R(−θ)`.
 * - **Interpolation:** SLERP (constant angular velocity, shortest arc) and
 *   NLERP (linear blend + renormalization).
 * - **Application to vectors:** `v' = R · v` with alloc‑free variants.
 */
export class Rot2 {
 /* ----------------------------------------------------------------------- */
 /* Static: Constants (immutable)                                           */
 /* ----------------------------------------------------------------------- */

 /** Identity rotation (θ = 0). */
 public static readonly IDENTITY_ROTATION = freezeRot2(new Rot2(1, 0));

 /** +90° counter‑clockwise rotation. */
 public static readonly ROT90_CCW_ROTATION = freezeRot2(Rot2.fromAngle(Math.PI / 2));

 /** −90° clockwise rotation. */
 public static readonly ROT90_CW_ROTATION = freezeRot2(Rot2.fromAngle(-Math.PI / 2));

 /** 180° rotation. */
 public static readonly ROT180_ROTATION = freezeRot2(Rot2.fromAngle(Math.PI));

 /* ----------------------------------------------------------------------- */
 /* Static: Factories                                                       */
 /* ----------------------------------------------------------------------- */

 /**
  * Creates a rotation from explicit cosine/sine.
  *
  * @param c - Cosine of the angle.
  * @param s - Sine of the angle.
  * @returns A new {@link Rot2}.
  *
  * @remarks
  * This does **not** enforce unit length. If values are noisy, call
  * {@link Rot2.prototype.normalize} or {@link Rot2.prototype.normalizeSafe}.
  */
 public static fromValues(c: number, s: number): Rot2 {
  return new Rot2(c, s);
 }

 /**
  * Clones a rotation.
  *
  * @param source - Rotation to clone.
  * @returns A new {@link Rot2} with identical components.
  */
 public static clone(source: ReadonlyRot2): Rot2 {
  return new Rot2(source.c, source.s);
 }

 /**
  * Copies components from one rotation into another (alloc‑free).
  *
  * @param source - Rotation to copy from.
  * @param destination - Rotation to copy into.
  * @returns `destination`.
  */
 public static copy(source: ReadonlyRot2, destination: Rot2): Rot2 {
  return destination.set(source.c, source.s);
 }

 /**
  * Creates a rotation from an angle in radians.
  *
  * @overload
  * @param angle - Angle in radians.
  * @returns A new {@link Rot2}.
  */
 public static fromAngle(angle: number): Rot2;
 /**
  * Alloc‑free overload writing into `outRotation`.
  *
  * @overload
  * @param angle - Angle in radians.
  * @param outRotation - Destination rotation.
  * @returns `outRotation`.
  */
 public static fromAngle(angle: number, outRotation: Rot2): Rot2;
 public static fromAngle(angle: number, outRotation: Rot2 = new Rot2()): Rot2 {
  return outRotation.set(Math.cos(angle), Math.sin(angle));
 }

 /**
  * Creates a rotation from a 2×2 matrix (assumed near‑rotation).
  *
  * @overload
  * @param matrix - Source matrix (near orthonormal with `det ≈ 1`).
  * @returns A new {@link Rot2}.
  *
  * @remarks
  * Uses the first column and normalizes it. If the column is zero, returns identity.
  */
 public static fromMat2(matrix: ReadonlyMat2): Rot2;
 /**
  * Alloc‑free overload writing into `outRotation`.
  *
  * @overload
  * @param matrix - Source matrix (near orthonormal with `det ≈ 1`).
  * @param outRotation - Destination rotation.
  * @returns `outRotation`.
  */
 public static fromMat2(matrix: ReadonlyMat2, outRotation: Rot2): Rot2;
 public static fromMat2(matrix: ReadonlyMat2, outRotation: Rot2 = new Rot2()): Rot2 {
  // Column 0 of a pure rotation is [c, s]^T. Normalize it to be robust.
  const x = matrix.m00;
  const y = matrix.m10;
  const length = Math.hypot(x, y);

  if (length === 0) {
   // Fallback: identity (no information reliable in the first column).
   return outRotation.identity();
  }

  return outRotation.set(x / length, y / length);
 }

 /**
  * Creates a rotation from a 2×2 matrix with **tolerance**.
  *
  * @param matrix - Source matrix.
  * @param epsilon - Non‑negative tolerance. @defaultValue {@link ANGULAR_EPSILON}
  * @param outRotation - Destination rotation. @defaultValue `new Rot2()`
  * @returns `outRotation` set to the extracted rotation.
  * @throws {RangeError} If no reliable rotation axis can be extracted (both columns near zero).
  */
 public static fromMat2Tol(
  matrix: ReadonlyMat2,
  epsilon: number = EPSILON,
  outRotation: Rot2 = new Rot2(),
 ): Rot2 {
  const x0 = matrix.m00,
   y0 = matrix.m10;

  let length = Math.hypot(x0, y0);

  if (length > epsilon) return outRotation.set(x0 / length, y0 / length);

  // Fallback: use column 1 **rotated by −90° (CW)** to reconstruct column 0:
  // col1 = [m01, m11]^T ≈ [-s, c]. Rotating by −90° gives [m11, −m01] ≈ [c, s].
  const x1 = matrix.m11;
  const y1 = -matrix.m01;

  length = Math.hypot(x1, y1);

  if (length > epsilon) return outRotation.set(x1 / length, y1 / length);

  throw new RangeError('Rot2.fromMat2Tol: matrix does not contain a reliable rotation axis');
 }

 /**
  * Creates a rotation from a **direction** vector.
  *
  * @overload
  * @param v - Direction vector (not necessarily unit).
  * @returns A new {@link Rot2}. If `|v| == 0`, returns identity.
  */
 public static fromDirection(v: ReadonlyVector2): Rot2;
 /**
  * Alloc‑free overload writing into `outRotation`.
  *
  * @overload
  * @param v - Direction vector (not necessarily unit).
  * @param outRotation - Destination rotation.
  * @returns `outRotation`. If `|v| == 0`, becomes identity.
  */
 public static fromDirection(v: ReadonlyVector2, outRotation: Rot2): Rot2;
 public static fromDirection(v: ReadonlyVector2, outRotation: Rot2 = new Rot2()): Rot2 {
  const length = Math.hypot(v.x, v.y);

  return length === 0 ? outRotation.identity() : outRotation.set(v.x / length, v.y / length);
 }

 /**
  * Creates a rotation from a **direction** vector with tolerance.
  *
  * @param v - Direction vector (not necessarily unit).
  * @param epsilon - Non‑negative tolerance. @defaultValue {@link ANGULAR_EPSILON}
  * @param outRotation - Destination rotation. @defaultValue `new Rot2()`
  * @returns `outRotation` set from the direction.
  * @throws {RangeError} If `|v| ≤ epsilon`.
  */
 public static fromDirectionTol(
  v: ReadonlyVector2,
  epsilon: number = EPSILON,
  outRotation: Rot2 = new Rot2(),
 ): Rot2 {
  const length = Math.hypot(v.x, v.y);

  if (length <= epsilon) {
   throw new RangeError('Rot2.fromDirectionTol: direction vector is near zero');
  }

  return outRotation.set(v.x / length, v.y / length);
 }

 /* ----------------------------------------------------------------------- */
 /* Static: Composition & algebra                                           */
 /* ----------------------------------------------------------------------- */

 /**
  * Composes two rotations: `out = a · b` (equivalently `R(θa + θb)`).
  *
  * @overload
  * @param a - Left rotation.
  * @param b - Right rotation.
  * @returns A new composed {@link Rot2}.
  */
 public static multiply(a: ReadonlyRot2, b: ReadonlyRot2): Rot2;
 /**
  * Alloc‑free overload writing into `outRotation`.
  *
  * @overload
  * @param a - Left rotation.
  * @param b - Right rotation.
  * @param outRotation - Destination rotation.
  * @returns `outRotation`.
  */
 public static multiply(a: ReadonlyRot2, b: ReadonlyRot2, outRotation: Rot2): Rot2;
 public static multiply(a: ReadonlyRot2, b: ReadonlyRot2, outRotation: Rot2 = new Rot2()): Rot2 {
  // Complex multiply: (c,s) ⊗ (C,S) = (cC − sS, sC + cS)
  const c = a.c * b.c - a.s * b.s;
  const s = a.s * b.c + a.c * b.s;

  return outRotation.set(c, s);
 }

 /**
  * Composes two rotations and **renormalizes** the result.
  *
  * @param a - Left rotation.
  * @param b - Right rotation.
  * @param outRotation - Destination rotation. @defaultValue `new Rot2()`
  * @returns `outRotation`.
  */
 public static multiplyRenorm(
  a: ReadonlyRot2,
  b: ReadonlyRot2,
  outRotation: Rot2 = new Rot2(),
 ): Rot2 {
  const c = a.c * b.c - a.s * b.s;
  const s = a.s * b.c + a.c * b.s;

  const length = Math.hypot(c, s);

  return length === 0 ? outRotation.identity() : outRotation.set(c / length, s / length);
 }

 /**
  * Inverse rotation (conjugate): `out = R(−θ)`.
  *
  * @overload
  * @param r - Source rotation.
  * @returns A new inverted {@link Rot2}.
  */
 public static inverse(r: ReadonlyRot2): Rot2;
 /**
  * Alloc‑free overload writing into `outRotation`.
  *
  * @overload
  * @param r - Source rotation.
  * @param outRotation - Destination rotation.
  * @returns `outRotation`.
  */
 public static inverse(r: ReadonlyRot2, outRotation: Rot2): Rot2;
 public static inverse(r: ReadonlyRot2, outRotation: Rot2 = new Rot2()): Rot2 {
  return outRotation.set(r.c, -r.s);
 }

 /**
  * Relative rotation that maps orientation `a` into `b`: `out = b · a⁻¹`.
  *
  * @overload
  * @param a - Start orientation.
  * @param b - End orientation.
  * @returns A new {@link Rot2} such that `out · a = b`.
  */
 public static relative(a: ReadonlyRot2, b: ReadonlyRot2): Rot2;
 /**
  * Alloc‑free overload writing into `outRotation`.
  *
  * @overload
  * @param a - Start orientation.
  * @param b - End orientation.
  * @param outRotation - Destination rotation.
  * @returns `outRotation` set to `b · a⁻¹`.
  */
 public static relative(a: ReadonlyRot2, b: ReadonlyRot2, outRotation: Rot2): Rot2;
 public static relative(a: ReadonlyRot2, b: ReadonlyRot2, outRotation: Rot2 = new Rot2()): Rot2 {
  // b ⊗ a⁻¹ = (bc, bs) ⊗ (ac, -as) = (bc*ac + bs*as, bs*ac - bc*as)
  const c = b.c * a.c + b.s * a.s;
  const s = b.s * a.c - b.c * a.s;

  return outRotation.set(c, s);
 }

 /**
  * Relative rotation with renormalization: `out = normalize(b · a⁻¹)`.
  *
  * @param a - Start orientation.
  * @param b - End orientation.
  * @param outRotation - Destination rotation. @defaultValue `new Rot2()`
  * @returns `outRotation`.
  */
 public static relativeRenorm(
  a: ReadonlyRot2,
  b: ReadonlyRot2,
  outRotation: Rot2 = new Rot2(),
 ): Rot2 {
  const c = b.c * a.c + b.s * a.s;
  const s = b.s * a.c - b.c * a.s;

  const length = Math.hypot(c, s);

  return length === 0 ? outRotation.identity() : outRotation.set(c / length, s / length);
 }

 /**
  * Signed **shortest‑arc** angle from `a` to `b` in radians ∈ `[−π, π)`.
  *
  * @param a - Start rotation.
  * @param b - End rotation.
  * @returns Angle `Δθ = angle(b) ⊖ angle(a)`.
  */
 public static deltaAngle(a: ReadonlyRot2, b: ReadonlyRot2): number {
  const angA = Math.atan2(a.s, a.c);
  const angB = Math.atan2(b.s, b.c);

  return deltaRadians(angA, angB);
 }

 /* ----------------------------------------------------------------------- */
 /* Static: Time integration                                                */
 /* ----------------------------------------------------------------------- */

 /**
  * Advances a rotation by angular velocity `ω` over time `Δt` (exact).
  * Computes `out = r · exp(ω·Δt)`.
  *
  * @overload
  * @param r - Initial rotation.
  * @param angularVelocity - Angular velocity `ω` in radians per second.
  * @param dt - Time step `Δt` in seconds.
  * @returns A new advanced {@link Rot2}.
  */
 public static advance(r: ReadonlyRot2, angularVelocity: number, dt: number): Rot2;
 /**
  * Alloc‑free overload writing into `outRotation`.
  *
  * @overload
  * @param r - Initial rotation.
  * @param angularVelocity - Angular velocity `ω` in radians per second.
  * @param dt - Time step `Δt` in seconds.
  * @param outRotation - Destination rotation.
  * @returns `outRotation`.
  */
 public static advance(
  r: ReadonlyRot2,
  angularVelocity: number,
  dt: number,
  outRotation: Rot2,
 ): Rot2;
 public static advance(
  r: ReadonlyRot2,
  angularVelocity: number,
  dt: number,
  outRotation: Rot2 = new Rot2(),
 ): Rot2 {
  const a = angularVelocity * dt;

  const c = Math.cos(a);
  const s = Math.sin(a);

  // out = r ⊗ exp(a)
  return outRotation.set(r.c * c - r.s * s, r.s * c + r.c * s);
 }

 /**
  * Same as {@link advance} but **renormalizes** the result for robustness.
  *
  * @param r - Initial rotation.
  * @param angularVelocity - Angular velocity `ω` in radians per second.
  * @param dt - Time step `Δt` in seconds.
  * @param outRotation - Destination rotation. @defaultValue `new Rot2()`
  * @returns `outRotation`.
  */
 public static advanceRenorm(
  r: ReadonlyRot2,
  angularVelocity: number,
  dt: number,
  outRotation: Rot2 = new Rot2(),
 ): Rot2 {
  const a = angularVelocity * dt;

  const c = Math.cos(a);
  const s = Math.sin(a);

  const C = r.c * c - r.s * s;
  const S = r.s * c + r.c * s;

  const length = Math.hypot(C, S);

  return length === 0 ? outRotation.identity() : outRotation.set(C / length, S / length);
 }

 /* ----------------------------------------------------------------------- */
 /* Static: Interpolation                                                   */
 /* ----------------------------------------------------------------------- */

 /**
  * Spherical linear interpolation (SLERP) from `a` to `b` by factor `t` (not clamped).
  * Follows the **shortest arc** at **constant angular velocity**.
  *
  * @overload
  * @param a - Start rotation.
  * @param b - End rotation.
  * @param t - Interpolation factor.
  * @returns A new interpolated {@link Rot2}.
  */
 public static slerp(a: ReadonlyRot2, b: ReadonlyRot2, t: number): Rot2;
 /**
  * Alloc‑free overload writing into `outRotation`.
  *
  * @overload
  * @param a - Start rotation.
  * @param b - End rotation.
  * @param t - Interpolation factor (no clamped).
  * @param outRotation - Destination rotation.
  * @returns `outRotation`.
  */
 public static slerp(a: ReadonlyRot2, b: ReadonlyRot2, t: number, outRotation: Rot2): Rot2;
 public static slerp(
  a: ReadonlyRot2,
  b: ReadonlyRot2,
  t: number,
  outRotation: Rot2 = new Rot2(),
 ): Rot2 {
  const angA = Math.atan2(a.s, a.c);
  const d = Rot2.deltaAngle(a, b); // shortest arc
  const ang = angA + d * t;

  return Rot2.fromAngle(ang, outRotation);
 }

 /**
  * SLERP with `t` clamped to `[0, 1]`.
  *
  * @param a - Start rotation.
  * @param b - End rotation.
  * @param t - Interpolation factor.
  * @param outRotation - Destination rotation. @defaultValue `new Rot2()`
  * @returns `outRotation`.
  */
 public static slerpClamped(
  a: ReadonlyRot2,
  b: ReadonlyRot2,
  t: number,
  outRotation: Rot2 = new Rot2(),
 ): Rot2 {
  const tt = t <= 0 ? 0 : t >= 1 ? 1 : t;

  return Rot2.slerp(a, b, tt, outRotation);
 }

 /**
  * Normalized linear interpolation (NLERP): linear blend of `{c,s}` then renormalize.
  * Does not preserve constant angular velocity but is fast and stable.
  *
  * @overload
  * @param a - Start rotation.
  * @param b - End rotation.
  * @param t - Interpolation factor.
  * @returns A new interpolated {@link Rot2}.
  */
 public static nlerp(a: ReadonlyRot2, b: ReadonlyRot2, t: number): Rot2;
 /**
  * Alloc‑free overload writing into `outRotation`.
  *
  * @overload
  * @param a - Start rotation.
  * @param b - End rotation.
  * @param t - Interpolation factor.
  * @param outRotation - Destination rotation.
  * @returns `outRotation`.
  */
 public static nlerp(a: ReadonlyRot2, b: ReadonlyRot2, t: number, outRotation: Rot2): Rot2;
 public static nlerp(
  a: ReadonlyRot2,
  b: ReadonlyRot2,
  t: number,
  outRotation: Rot2 = new Rot2(),
 ): Rot2 {
  const c = a.c + (b.c - a.c) * t;
  const s = a.s + (b.s - a.s) * t;

  const length = Math.hypot(c, s);

  return length === 0 ? outRotation.identity() : outRotation.set(c / length, s / length);
 }

 /**
  * NLERP with `t` clamped to `[0, 1]`.
  *
  * @param a - Start rotation.
  * @param b - End rotation.
  * @param t - Interpolation factor.
  * @param outRotation - Destination rotation. @defaultValue `new Rot2()`
  * @returns `outRotation`.
  */
 public static nlerpClamped(
  a: ReadonlyRot2,
  b: ReadonlyRot2,
  t: number,
  outRotation: Rot2 = new Rot2(),
 ): Rot2 {
  const tt = t <= 0 ? 0 : t >= 1 ? 1 : t;

  return Rot2.nlerp(a, b, tt, outRotation);
 }

 /* ----------------------------------------------------------------------- */
 /* Static: Statistics & averaging                                          */
 /* ----------------------------------------------------------------------- */

 /**
  * Safe circular mean of rotations. If input is empty or the resultant vector
  * has near‑zero magnitude, returns **identity**.
  *
  * @overload
  * @param rotations - Array of rotations.
  * @param weights - Optional non‑negative weights (same length as `rotations`).
  * @returns A new {@link Rot2} with the mean heading (safe).
  * @throws {RangeError} If `weights.length !== rotations.length` or any weight is negative.
  */
 public static meanSafe(rotations: ReadonlyRot2[], weights?: number[]): Rot2;
 /**
  * Alloc‑free overload writing into `outRotation`.
  *
  * @overload
  * @param rotations - Array of rotations.
  * @param weights - Optional non‑negative weights (same length as `rotations`).
  * @param outRotation - Destination rotation.
  * @returns `outRotation` containing the safe mean.
  * @throws {RangeError} If `weights.length !== rotations.length` or any weight is negative.
  */
 public static meanSafe(
  rotations: ReadonlyRot2[],
  weights: number[] | undefined,
  outRotation: Rot2,
 ): Rot2;
 public static meanSafe(
  rotations: ReadonlyRot2[],
  weights?: number[],
  outRotation: Rot2 = new Rot2(),
 ): Rot2 {
  const n = rotations.length;
  if (n === 0) return outRotation.identity();

  let sumC = 0;
  let sumS = 0;

  if (weights) {
   if (weights.length !== n) {
    throw new RangeError('Rot2.meanSafe: weights length mismatch');
   }

   for (let index = 0; index < n; index++) {
    const w = weights[index]!;

    if (w < 0) throw new RangeError('Rot2.meanSafe: weights must be non-negative');
    if (w === 0) continue;

    sumC += rotations[index]!.c * w;
    sumS += rotations[index]!.s * w;
   }
  } else {
   for (let index = 0; index < n; index++) {
    sumC += rotations[index]!.c;
    sumS += rotations[index]!.s;
   }
  }

  const mag = Math.hypot(sumC, sumS);

  if (mag <= EPSILON) return outRotation.identity();

  return outRotation.set(sumC / mag, sumS / mag);
 }

 /**
  * Circular mean of rotations with **tolerance**.
  *
  * @param rotations - Array of rotations.
  * @param weights - Optional non‑negative weights (same length as `rotations`).
  * @param epsilon - Non‑negative tolerance. @defaultValue {@link ANGULAR_EPSILON}
  * @param outRotation - Destination rotation. @defaultValue `new Rot2()`
  * @returns `outRotation` containing the mean.
  * @throws {RangeError} If the input is empty, if weights mismatch or are negative,
  *                      or if the resultant magnitude `≤ epsilon` (ambiguous mean).
  */
 public static meanTol(
  rotations: ReadonlyRot2[],
  weights: number[] | undefined,
  epsilon: number = EPSILON,
  outRotation: Rot2 = new Rot2(),
 ): Rot2 {
  const n = rotations.length;

  if (n === 0) throw new RangeError('Rot2.meanTol: empty input');

  let sumC = 0;
  let sumS = 0;

  if (weights) {
   if (weights.length !== n) {
    throw new RangeError('Rot2.meanTol: weights length mismatch');
   }

   for (let index = 0; index < n; index++) {
    const w = weights[index]!;

    if (w < 0) throw new RangeError('Rot2.meanTol: weights must be non-negative');
    if (w === 0) continue;

    sumC += rotations[index]!.c * w;
    sumS += rotations[index]!.s * w;
   }
  } else {
   for (let index = 0; index < n; index++) {
    sumC += rotations[index]!.c;
    sumS += rotations[index]!.s;
   }
  }

  const mag = Math.hypot(sumC, sumS);

  if (mag <= epsilon) {
   throw new RangeError('Rot2.meanTol: ambiguous mean (resultant near zero)');
  }

  return outRotation.set(sumC / mag, sumS / mag);
 }

 /* ----------------------------------------------------------------------- */
 /* Static: Exponential / logarithm & powers                                */
 /* ----------------------------------------------------------------------- */

 /**
  * Lie algebra **log** map: returns the principal angle in radians.
  *
  * @param r - Rotation.
  * @returns Angle `θ = atan2(s, c)` in `[−π, π]`.
  */
 public static log(r: ReadonlyRot2): number {
  return Math.atan2(r.s, r.c);
 }

 /**
  * Lie group **exp** map: builds a rotation from an angle in radians.
  *
  * @overload
  * @param angle - Angle in radians.
  * @returns A new {@link Rot2}.
  */
 public static exp(angle: number): Rot2;
 /**
  * Alloc‑free overload writing into `outRotation`.
  *
  * @overload
  * @param angle - Angle in radians.
  * @param outRotation - Destination rotation.
  * @returns `outRotation`.
  */
 public static exp(angle: number, outRotation: Rot2): Rot2;
 public static exp(angle: number, outRotation: Rot2 = new Rot2()): Rot2 {
  return Rot2.fromAngle(angle, outRotation);
 }

 /**
  * Raises a rotation to a **scalar power**: `R^k = R(k·θ)`.
  *
  * @overload
  * @param r - Source rotation.
  * @param k - Scalar exponent.
  * @returns A new {@link Rot2} equal to `exp(k * log(r))`.
  */
 public static pow(r: ReadonlyRot2, k: number): Rot2;
 /**
  * Alloc‑free overload writing into `outRotation`.
  *
  * @overload
  * @param r - Source rotation.
  * @param k - Scalar exponent.
  * @param outRotation - Destination rotation.
  * @returns `outRotation`.
  */
 public static pow(r: ReadonlyRot2, k: number, outRotation: Rot2): Rot2;
 public static pow(r: ReadonlyRot2, k: number, outRotation: Rot2 = new Rot2()): Rot2 {
  const ang = Math.atan2(r.s, r.c) * k;

  return Rot2.fromAngle(ang, outRotation);
 }

 /* ----------------------------------------------------------------------- */
 /* Static: Application to vectors                                          */
 /* ----------------------------------------------------------------------- */

 /**
  * Applies a rotation to a vector: `v' = R · v`.
  *
  * @overload
  * @param r - Rotation.
  * @param v - Vector to rotate.
  * @returns A new rotated {@link Vector2}.
  */
 public static apply(r: ReadonlyRot2, v: ReadonlyVector2): Vector2;
 /**
  * Alloc‑free overload writing into `outVector`.
  *
  * @overload
  * @param r - Rotation.
  * @param v - Vector to rotate.
  * @param outVector - Destination vector.
  * @returns `outVector`.
  */
 public static apply(r: ReadonlyRot2, v: ReadonlyVector2, outVector: Vector2): Vector2;
 public static apply(
  r: ReadonlyRot2,
  v: ReadonlyVector2,
  outVector: Vector2 = new Vector2(),
 ): Vector2 {
  // [ c -s; s  c ] · [x; y]
  return outVector.set(r.c * v.x - r.s * v.y, r.s * v.x + r.c * v.y);
 }

 /**
  * Applies the **inverse** rotation to a vector: `v' = R⁻¹ · v`.
  *
  * @overload
  * @param r - Rotation.
  * @param v - Vector to rotate by the inverse rotation.
  * @returns A new rotated {@link Vector2}.
  */
 public static applyInverse(r: ReadonlyRot2, v: ReadonlyVector2): Vector2;
 /**
  * Alloc‑free overload writing into `outVector`.
  *
  * @overload
  * @param r - Rotation.
  * @param v - Vector to rotate by the inverse rotation.
  * @param outVector - Destination vector.
  * @returns `outVector`.
  */
 public static applyInverse(r: ReadonlyRot2, v: ReadonlyVector2, outVector: Vector2): Vector2;
 public static applyInverse(
  r: ReadonlyRot2,
  v: ReadonlyVector2,
  outVector: Vector2 = new Vector2(),
 ): Vector2 {
  // R⁻¹ = Rᵀ = [ c  s; -s  c ]
  return outVector.set(r.c * v.x + r.s * v.y, -r.s * v.x + r.c * v.y);
 }

 /**
  * Converts a rotation to its **direction** vector `(c, s)`.
  *
  * @overload
  * @param r - Rotation.
  * @returns A new {@link Vector2} equal to `(cosθ, sinθ)`.
  */
 public static toDirection(r: ReadonlyRot2): Vector2;
 /**
  * Alloc‑free overload writing into `outVector`.
  *
  * @overload
  * @param r - Rotation.
  * @param outVector - Destination vector.
  * @returns `outVector`.
  */
 public static toDirection(r: ReadonlyRot2, outVector: Vector2): Vector2;
 public static toDirection(r: ReadonlyRot2, outVector: Vector2 = new Vector2()): Vector2 {
  return outVector.set(r.c, r.s);
 }

 /* ----------------------------------------------------------------------- */
 /* Static: Conversion & utilities                                          */
 /* ----------------------------------------------------------------------- */

 /**
  * Converts a rotation to a 2×2 rotation matrix.
  *
  * @overload
  * @param r - Rotation.
  * @returns A new {@link Mat2}.
  */
 public static toMat2(r: ReadonlyRot2): Mat2;
 /**
  * Alloc‑free overload writing into `outMatrix`.
  *
  * @overload
  * @param r - Rotation.
  * @param outMatrix - Destination matrix.
  * @returns `outMatrix`.
  */
 public static toMat2(r: ReadonlyRot2, outMatrix: Mat2): Mat2;
 public static toMat2(r: ReadonlyRot2, outMatrix: Mat2 = new Mat2()): Mat2 {
  return outMatrix.set(r.c, -r.s, r.s, r.c);
 }

 /**
  * Returns the rotation angle in radians ∈ `[−π, π]`.
  *
  * @param r - Rotation.
  * @returns `atan2(s, c)`.
  */
 public static angleOf(r: ReadonlyRot2): number {
  return Math.atan2(r.s, r.c);
 }

 /**
  * Strict component‑wise equality.
  *
  * @param a - First rotation.
  * @param b - Second rotation.
  * @returns `true` if components are identical; otherwise `false`.
  */
 public static equals(a: ReadonlyRot2, b: ReadonlyRot2): boolean {
  return a.c === b.c && a.s === b.s;
 }

 /**
  * Approximate component‑wise equality with tolerance.
  *
  * @param a - First rotation.
  * @param b - Second rotation.
  * @param epsilon - Non‑negative tolerance. @defaultValue {@link ANGULAR_EPSILON}
  * @returns `true` if `|Δc| ≤ epsilon` and `|Δs| ≤ epsilon`.
  * @throws {RangeError} If `epsilon < 0`.
  */
 public static nearEquals(a: ReadonlyRot2, b: ReadonlyRot2, epsilon: number = ANGULAR_EPSILON): boolean {
  validateTolerance(epsilon, 'Rot2.nearEquals');
  return areNearEqual(a.c, b.c, epsilon) && areNearEqual(a.s, b.s, epsilon);
 }

 /**
  * Tests whether `c` and `s` are finite numbers.
  *
  * @param r - Rotation.
  * @returns `true` if both entries are finite; otherwise `false`.
  */
 public static isFinite(r: ReadonlyRot2): boolean {
  return Number.isFinite(r.c) && Number.isFinite(r.s);
 }

 /**
  * Tests whether the rotation is (approximately) identity within tolerance.
  *
  * @param r - Rotation to test.
  * @param epsilon - Non‑negative tolerance. @defaultValue {@link ANGULAR_EPSILON}
  * @returns `true` if `c ≈ 1` and `s ≈ 0`.
  */
 public static isIdentity(r: ReadonlyRot2, epsilon: number = EPSILON): boolean {
  return Math.abs(r.c - 1) <= epsilon && Math.abs(r.s) <= epsilon;
 }

 /**
  * Tests normalization: `|c|² + |s|² ≈ 1` within tolerance.
  *
  * @param r - Rotation to test.
  * @param epsilon - Non‑negative tolerance. @defaultValue {@link ANGULAR_EPSILON}
  * @returns `true` if normalized within tolerance.
  */
 public static isNormalized(r: ReadonlyRot2, epsilon: number = EPSILON): boolean {
  return Math.abs(r.c * r.c + r.s * r.s - 1) <= epsilon;
 }

 /**
  * Returns a copy of `r`; if its norm deviates more than `epsilon` from 1,
  * returns the normalized copy (or identity if zero norm).
  *
  * @param r - Rotation to check.
  * @param epsilon - Non‑negative tolerance. @defaultValue {@link ANGULAR_EPSILON}
  * @param outRotation - Destination rotation. @defaultValue `new Rot2()`
  * @returns `outRotation`.
  * @throws {RangeError} If `epsilon < 0`.
  */
 public static ensureNormalized(
  r: ReadonlyRot2,
  epsilon: number = EPSILON,
  outRotation: Rot2 = new Rot2(),
 ): Rot2 {
  if (epsilon < 0) throw new RangeError('Rot2.ensureNormalized: epsilon must be non-negative');

  const n2 = r.c * r.c + r.s * r.s;

  if (Math.abs(n2 - 1) <= epsilon) return outRotation.set(r.c, r.s);

  const length = Math.hypot(r.c, r.s);

  return length === 0 ? outRotation.identity() : outRotation.set(r.c / length, r.s / length);
 }

 /**
  * Euclidean norm of the `{c, s}` pair.
  *
  * @param r - Rotation.
  * @returns Non‑negative norm `hypot(c, s)`.
  */
 public static norm(r: ReadonlyRot2): number {
  return Math.hypot(r.c, r.s);
 }

 /* ====================================================================== */
 /* Instance                                                                */
 /* ====================================================================== */

 /** cos(θ) */
 public c: number;
 /** sin(θ) */
 public s: number;

 /* ----------------------------------------------------------------------- */
 /* Constructors                                                            */
 /* ----------------------------------------------------------------------- */

 /** Constructs identity rotation `(c=1, s=0)`. */
 constructor();
 /** Constructs from explicit `{ c, s }` values. */
 constructor(c: number, s: number);
 /** Constructs from plain object `{ c, s }`. */
 constructor(object: Rot2Like);
 /** Copy‑constructs from another {@link Rot2}. */
 constructor(rotation: Rot2);
 /**
  * General constructor.
  *
  * @param a - Either numbers `{c,s}`, a POJO `{c,s}`, another {@link Rot2}, or `undefined`.
  * @param b - Sine `s` when `a` is a number (`c`).
  * @throws {RangeError} If POJO fields are non‑numeric or arguments are invalid.
  */
 constructor(a?: number | Rot2Like | Rot2, b?: number) {
  if (typeof a === 'number' && typeof b === 'number') {
   this.c = a;
   this.s = b;
  } else if (a instanceof Rot2) {
   this.c = a.c;
   this.s = a.s;
  } else if (a && typeof a === 'object' && 'c' in a && 's' in a) {
   const { c, s } = a as { c: unknown; s: unknown };

   if (typeof c !== 'number' || typeof s !== 'number') {
    throw new RangeError('Rot2.constructor: c and s must be numbers');
   }

   this.c = c as number;
   this.s = s as number;
  } else if (a === undefined) {
   this.c = 1;
   this.s = 0;
  } else {
   throw new RangeError('Rot2.constructor: invalid constructor arguments for Rot2');
  }
 }

 /* ----------------------------------------------------------------------- */
 /* Basic mutators                                                          */
 /* ----------------------------------------------------------------------- */

 /**
  * Assigns `{ c, s }`.
  *
  * @param c - Cosine.
  * @param s - Sine.
  * @returns `this` for chaining.
  */
 public set(c: number, s: number): this {
  this.c = c;
  this.s = s;

  return this;
 }

 /**
  * Resets to the identity rotation.
  *
  * @returns `this` for chaining.
  */
 public identity(): this {
  this.c = 1;
  this.s = 0;

  return this;
 }

 /**
  * Creates a shallow clone of this rotation.
  *
  * @returns A new {@link Rot2} with the same components.
  */
 public clone(): Rot2 {
  return new Rot2(this.c, this.s);
 }

 /**
  * Copies from another rotation.
  *
  * @param other - Source rotation.
  * @returns `this` for chaining.
  */
 public copy(other: ReadonlyRot2): this {
  return this.set(other.c, other.s);
 }

 /**
  * Sets from an angle in radians.
  *
  * @param angle - Angle in radians.
  * @returns `this` for chaining.
  */
 public setAngle(angle: number): this {
  this.c = Math.cos(angle);
  this.s = Math.sin(angle);

  return this;
 }

 /**
  * Gets the angle of this rotation.
  *
  * @returns The angle in radians `[-π, π]`.
  * @remarks Equivalent to `Rot2.angleOf(this)` or `Math.atan2(this.s, this.c)`.
  */
 public angle(): number {
  return Math.atan2(this.s, this.c);
 }

 /**
  * Sets from a **direction** vector (safe).
  * If `|v| == 0`, becomes identity.
  *
  * @param v - Direction vector (not necessarily unit).
  * @returns `this` for chaining.
  */
 public setFromDirection(v: ReadonlyVector2): this {
  const length = Math.hypot(v.x, v.y);

  if (length === 0) return this.identity();

  this.c = v.x / length;
  this.s = v.y / length;

  return this;
 }

 /**
  * Sets from a **direction** vector with tolerance.
  *
  * @param v - Direction vector (not necessarily unit).
  * @param epsilon - Non‑negative tolerance. @defaultValue {@link ANGULAR_EPSILON}
  * @returns `this` for chaining.
  * @throws {RangeError} If `|v| ≤ epsilon`.
  */
 public setFromDirectionTol(v: ReadonlyVector2, epsilon: number = EPSILON): this {
  const length = Math.hypot(v.x, v.y);

  if (length <= epsilon) throw new RangeError('Rot2.setFromDirectionTol: vector is near zero');

  this.c = v.x / length;
  this.s = v.y / length;

  return this;
 }

 /* ----------------------------------------------------------------------- */
 /* Algebra & composition (instance)                                        */
 /* ----------------------------------------------------------------------- */

 /**
  * Composes on the **right**: `this = this · r`.
  *
  * @param r - Right operand.
  * @returns `this` for chaining.
  */
 public multiply(r: ReadonlyRot2): this {
  const c = this.c * r.c - this.s * r.s;
  const s = this.s * r.c + this.c * r.s;

  this.c = c;
  this.s = s;

  return this;
 }

 /**
  * Composes on the **left**: `this = r · this`.
  *
  * @param r - Left operand.
  * @returns `this` for chaining.
  */
 public premultiply(r: ReadonlyRot2): this {
  const c = r.c * this.c - r.s * this.s;
  const s = r.s * this.c + r.c * this.s;

  this.c = c;
  this.s = s;

  return this;
 }

 /**
  * Pre‑multiplies with renormalization: `this = normalize(r · this)`.
  *
  * @param r - Left operand.
  * @returns `this` for chaining.
  */
 public premultiplyRenorm(r: ReadonlyRot2): this {
  const c = r.c * this.c - r.s * this.s;
  const s = r.s * this.c + r.c * this.s;

  const length = Math.hypot(c, s);

  if (length === 0) return this.identity();

  this.c = c / length;
  this.s = s / length;

  return this;
 }

 /**
  * Composes and **renormalizes** the result (stable against drift).
  *
  * @param r - Right operand.
  * @returns `this` for chaining.
  */
 public multiplyRenorm(r: ReadonlyRot2): this {
  const c = this.c * r.c - this.s * r.s;
  const s = this.s * r.c + this.c * r.s;

  const length = Math.hypot(c, s);

  if (length === 0) return this.identity();

  this.c = c / length;
  this.s = s / length;

  return this;
 }

 /**
  * Inverts this rotation (conjugate): `this = R(−θ)`.
  *
  * @returns `this` for chaining.
  */
 public inverse(): this {
  this.s = -this.s;

  // `c` remains the same
  return this;
 }

 /**
  * Raises this rotation to a **scalar power**: `this = R(k·θ)`.
  *
  * @param k - Scalar exponent.
  * @returns `this` for chaining.
  */
 public pow(k: number): this {
  const ang = Math.atan2(this.s, this.c) * k;

  return this.setAngle(ang);
 }

 /**
  * Advances this rotation by angular velocity `ω` over time `Δt` (exact).
  * Computes `this = this · exp(ω·Δt)`.
  *
  * @param angularVelocity - Angular velocity `ω` in radians per second.
  * @param dt - Time step `Δt` in seconds.
  * @returns `this` for chaining.
  */
 public advance(angularVelocity: number, dt: number): this {
  const a = angularVelocity * dt;

  const c = Math.cos(a);
  const s = Math.sin(a);

  const C = this.c * c - this.s * s;
  const S = this.s * c + this.c * s;

  this.c = C;
  this.s = S;

  return this;
 }

 /**
  * Advances this rotation like {@link advance} but **renormalizes** the result.
  *
  * @param angularVelocity - Angular velocity `ω` in radians per second.
  * @param dt - Time step `Δt` in seconds.
  * @returns `this` for chaining.
  */
 public advanceRenorm(angularVelocity: number, dt: number): this {
  const a = angularVelocity * dt;

  const c = Math.cos(a);
  const s = Math.sin(a);

  const C = this.c * c - this.s * s;
  const S = this.s * c + this.c * s;

  const length = Math.hypot(C, S);

  if (length === 0) return this.identity();

  this.c = C / length;
  this.s = S / length;

  return this;
 }

 /* ----------------------------------------------------------------------- */
 /* Interpolation (instance)                                                */
 /* ----------------------------------------------------------------------- */

 /**
  * SLERP toward `r` by factor `t` (not clamped).
  *
  * @param r - Target rotation.
  * @param t - Interpolation factor.
  * @returns `this` for chaining.
  */
 public slerpTo(r: ReadonlyRot2, t: number): this {
  const ang = this.angle() + Rot2.deltaAngle(this, r) * t;

  return this.setAngle(ang);
 }

 /**
  * SLERP toward `r` with `t` clamped to `[0, 1]`.
  *
  * @param r - Target rotation.
  * @param t - Interpolation factor.
  * @returns `this` for chaining.
  */
 public slerpToClamped(r: ReadonlyRot2, t: number): this {
  const tt = t <= 0 ? 0 : t >= 1 ? 1 : t;

  return this.slerpTo(r, tt);
 }

 /**
  * NLERP toward `r` by factor `t` (blend then renormalize).
  *
  * @param r - Target rotation.
  * @param t - Interpolation factor.
  * @returns `this` for chaining.
  */
 public nlerpTo(r: ReadonlyRot2, t: number): this {
  const c = this.c + (r.c - this.c) * t;
  const s = this.s + (r.s - this.s) * t;

  const length = Math.hypot(c, s);

  if (length === 0) return this.identity();

  this.c = c / length;
  this.s = s / length;

  return this;
 }

 /**
  * NLERP toward `r` with `t` clamped to `[0, 1]`.
  *
  * @param r - Target rotation.
  * @param t - Interpolation factor.
  * @returns `this` for chaining.
  */
 public nlerpToClamped(r: ReadonlyRot2, t: number): this {
  const tt = t <= 0 ? 0 : t >= 1 ? 1 : t;

  return this.nlerpTo(r, tt);
 }

 /* ----------------------------------------------------------------------- */
 /* Application to vectors (instance)                                       */
 /* ----------------------------------------------------------------------- */

 /**
  * Applies this rotation to a vector and returns a **new** vector.
  *
  * @param v - Vector to rotate.
  * @returns A new {@link Vector2}.
  */
 public applyTo(v: ReadonlyVector2): Vector2 {
  return Rot2.apply(this, v);
 }

 /**
  * Applies this rotation to a vector **alloc‑free**, writing into `out`.
  *
  * @param v - Vector to rotate.
  * @param out - Destination vector.
  * @returns `out`.
  */
 public applyToInto(v: ReadonlyVector2, out: Vector2): Vector2 {
  return Rot2.apply(this, v, out);
 }

 /**
  * Applies the **inverse** of this rotation to a vector **alloc‑free**, writing into `out`.
  *
  * @param v - Vector to rotate by the inverse rotation.
  * @param out - Destination vector.
  * @returns `out`.
  */
 public applyInverseToInto(v: ReadonlyVector2, out: Vector2): Vector2 {
  return Rot2.applyInverse(this, v, out);
 }

 /**
  * Returns this rotation as a **direction** vector `(c, s)`.
  *
  * @returns A new {@link Vector2} equal to `(cosθ, sinθ)`.
  */
 public direction(): Vector2 {
  return Rot2.toDirection(this);
 }

 /**
  * Writes this rotation's **direction** vector `(c, s)` into `out`.
  *
  * @param out - Destination vector.
  * @returns `out`.
  */
 public directionInto(out: Vector2): Vector2 {
  return Rot2.toDirection(this, out);
 }

 /* ----------------------------------------------------------------------- */
 /* Queries & normalization (instance)                                      */
 /* ----------------------------------------------------------------------- */

 /**
  * Normalizes strictly to unit length.
  *
  * @returns `this` for chaining.
  * @throws {RangeError} If the length of `{ c, s }` is zero.
  */
 public normalize(): this {
  const length = Math.hypot(this.c, this.s);

  if (length === 0) throw new RangeError('Rot2.normalize: cannot normalize zero-length {c,s}');

  this.c /= length;
  this.s /= length;

  return this;
 }

 /**
  * Normalizes safely. If the length is zero, resets to identity.
  *
  * @returns `this` for chaining.
  */
 public normalizeSafe(tolerance: number = LINEAR_EPSILON): this {
  const length = Math.hypot(this.c, this.s);

  if (length <= tolerance) return this.identity();

  this.c /= length;
  this.s /= length;

  return this;
 }

 /**
  * Normalizes this rotation only if the squared norm deviates more than `epsilon` from 1.
  *
  * @param epsilon - Non‑negative tolerance. @defaultValue {@link ANGULAR_EPSILON}
  * @returns `this` for chaining.
  * @throws {RangeError} If `epsilon < 0`.
  */
 public normalizeIfNeeded(epsilon: number = EPSILON): this {
  if (epsilon < 0) throw new RangeError('Rot2.normalizeIfNeeded: epsilon must be non-negative');

  const n2 = this.c * this.c + this.s * this.s;

  if (Math.abs(n2 - 1) <= epsilon) return this;

  const length = Math.hypot(this.c, this.s);

  if (length === 0) return this.identity();

  this.c /= length;
  this.s /= length;

  return this;
 }

 /**
  * Tests whether this rotation is (approximately) identity within tolerance.
  *
  * @param epsilon - Non‑negative tolerance. @defaultValue {@link ANGULAR_EPSILON}
  * @returns `true` if `this ≈ identity`; otherwise `false`.
  */
 public isIdentity(epsilon: number = EPSILON): boolean {
  return Rot2.isIdentity(this, epsilon);
 }

 /**
  * Tests normalization within tolerance.
  *
  * @param epsilon - Non‑negative tolerance. @defaultValue {@link ANGULAR_EPSILON}
  * @returns `true` if `|c|² + |s|² ≈ 1`; otherwise `false`.
  */
 public isNormalized(epsilon: number = EPSILON): boolean {
  return Rot2.isNormalized(this, epsilon);
 }

 /**
  * Tests whether both components are finite.
  *
  * @returns `true` if finite; otherwise `false`.
  */
 public isFinite(): boolean {
  return Rot2.isFinite(this);
 }

 /**
  * Strict component‑wise equality with another rotation.
  *
  * @param other - Rotation to compare.
  * @returns `true` if components are identical; otherwise `false`.
  */
 public equals(other: ReadonlyRot2): boolean {
  return Rot2.equals(this, other);
 }

 /**
  * Approximate component‑wise equality with tolerance.
  *
  * @param other - Rotation to compare.
  * @param epsilon - Non‑negative tolerance. @defaultValue {@link ANGULAR_EPSILON}
  * @returns `true` if differences are within tolerance; otherwise `false`.
  * @throws {RangeError} If `epsilon < 0`.
  */
 public nearEquals(other: ReadonlyRot2, epsilon: number = ANGULAR_EPSILON): boolean {
  return Rot2.nearEquals(this, other, epsilon);
 }

 /* ----------------------------------------------------------------------- */
 /* Conversion & representation (instance)                                  */
 /* ----------------------------------------------------------------------- */

 /**
  * Converts this rotation to a {@link Mat2} (rotation matrix).
  *
  * @returns A new {@link Mat2}.
  */
 public toMat2(): Mat2 {
  return Rot2.toMat2(this);
 }

 /**
  * Writes `[c, s]` into an array or typed array.
  *
  * @typeParam T - `number[]` or `Float32Array`.
  * @param outArray - Destination array. @defaultValue a new `number[]`
  * @param offset - Index at which to write `c` and `s`. @defaultValue `0`
  * @returns The same `outArray` reference.
  *
  * @example
  * ```ts
  * const r = Rot2.fromAngle(Math.PI / 4);
  * const arr = r.toArray(); // [c, s]
  * ```
  */
 public toArray<T extends number[] | Float32Array>(
  outArray: T = [] as unknown as T,
  offset = 0,
 ): T {
  (outArray as any)[offset] = this.c;
  (outArray as any)[offset + 1] = this.s;

  return outArray;
 }

 /**
  * Returns a plain object for JSON serialization.
  *
  * @returns An object literal `{ c, s }`.
  */
 public toJSON(): Rot2Like {
  return { c: this.c, s: this.s };
 }

 /**
  * Alias for {@link toJSON} with explicit semantics.
  *
  * @returns An object literal `{ c, s }`.
  */
 public toObject(): Rot2Like {
  return this.toJSON();
 }

 /**
  * Enables array destructuring: `[...rotation] → [c, s]`.
  *
  * @returns An iterator yielding `c` then `s`.
  */
 public *[Symbol.iterator](): IterableIterator<number> {
  yield this.c;
  yield this.s;
 }

 /**
  * Returns a string representation `"c,s"`.
  *
  * @param precision - Optional number of decimal places.
  * @returns The formatted string.
  */
 public toString(precision?: number): string {
  if (precision != null) {
   return `${this.c.toFixed(precision)},${this.s.toFixed(precision)}`;
  }

  return `${this.c},${this.s}`;
 }
}
