/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-dupe-class-members */
/**
 * @file src/transform2.ts
 * @module math2d/transform2
 * @description 2‑D rigid transformations (SE(2)) composed of a rotation {@link Rot2}
 * and a translation {@link Vector2} for the Lenguado physics-engine family.
 *
 * Conventions
 * ----------
 * - Column vectors.
 * - Counter‑clockwise (CCW) angles are positive.
 * - Rotation matrix: R = [[c, -s], [s, c]] for {@link Rot2} = (c, s).
 * - Apply to a point: x' = R·x + p. Apply to a vector: v' = R·v.
 *
 * Design
 * ------
 * - Instance methods are **mutable** and chainable.
 * - Static helpers are **pure** and provide **alloc‑free** variants via `out` parameters.
 */

import { Mat3, ReadonlyMat3 } from './mat3';
import { Rot2, ReadonlyRot2, Rot2Like, freezeRot2, isRot2Like } from './rot2';
import { EPSILON } from './scalar';
import { LINEAR_EPSILON } from './constants/precision';
import { validateTolerance } from './core-utils/tolerance';
import { Vector2, ReadonlyVector2, Vector2Like, freezeVector2, isVector2Like } from './vector2';

/**
 * Minimal shape of a transform: `{ p: {x, y}, r: {c, s} }`.
 */
export interface Transform2Like {
 /** Translation. */
 p: Vector2Like;
 /** Rotation (unit complex). */
 r: Rot2Like;
}

/**
 * Read‑only view of {@link Transform2}.
 */
export type ReadonlyTransform2 = Readonly<Transform2>;

/* ========================================================================== */
/* Helpers                                                                    */
/* ========================================================================== */

/**
 * Deep‑freezes a {@link Transform2} (and its nested members) to make it immutable.
 *
 * @param transform - Transform to freeze.
 * @returns The **same instance**, typed as {@link ReadonlyTransform2}.
 * @remarks
 * Calls {@link freezeVector2} and {@link freezeRot2} to ensure deep immutability
 * of `p` and `r`, then `Object.freeze` on the container.
 */
export function freezeTransform2(transform: Transform2): ReadonlyTransform2 {
 freezeVector2(transform.p);
 freezeRot2(transform.r);

 return Object.freeze(transform);
}

/**
 * Type guard for a plain object with the shape of {@link Transform2Like}.
 *
 * @param subject - Unknown value to check.
 * @returns `true` if `subject.p` is `Vector2Like` and `subject.r` is `Rot2Like`; otherwise `false`.
 */
export function isTransform2Like(subject: unknown): subject is Readonly<Transform2Like> {
 return (
  typeof subject === 'object' &&
  subject !== null &&
  isVector2Like((subject as any).p) &&
  isRot2Like((subject as any).r)
 );
}

/* ========================================================================== */
/* Class: Transform2                                                          */
/* ========================================================================== */

/**
 * 2‑D rigid transformation (SE(2)) as a pair `(p, r)` with `p: Vector2` and `r: Rot2`.
 *
 * @remarks
 * - Apply to points: `x' = r·x + p`.
 * - Apply to vectors: `v' = r·v` (no translation).
 * - Composition: `(pA, rA) ∘ (pB, rB) = ( pA + rA·pB,  rA·rB )` (apply `B` **first**, then `A`).
 */
export class Transform2 {
 /* ----------------------------------------------------------------------- */
 /* Statics: Constants (immutable)                                          */
 /* ----------------------------------------------------------------------- */

 /**
  * Identity transform: `p = (0, 0)`, `r = I`. Deep‑frozen.
  */
 public static readonly IDENTITY_TRANSFORM = freezeTransform2(new Transform2());

 /* ----------------------------------------------------------------------- */
 /* Statics: Factories                                                      */
 /* ----------------------------------------------------------------------- */

 /**
  * Creates a deep copy of a transform.
  *
  * @param source - Transform to clone.
  * @returns A new {@link Transform2} with the same components.
  */
 public static clone(source: ReadonlyTransform2): Transform2 {
  return new Transform2(source);
 }

 /**
  * Copies `source` into `destination` (**alloc‑free**).
  *
  * @param source - Source transform.
  * @param destination - Destination to overwrite.
  * @returns The `destination` instance, for chaining.
  */
 public static copy(source: ReadonlyTransform2, destination: Transform2): Transform2 {
  destination.p.copy(source.p);
  destination.r.copy(source.r);

  return destination;
 }

 /**
  * Creates a transform from scalar values.
  *
  * @param px - Translation X.
  * @param py - Translation Y.
  * @param c - `cos(θ)`.
  * @param s - `sin(θ)`.
  * @param outTransform - Optional destination (**alloc‑free**).
  * @returns The provided `outTransform`, or a new {@link Transform2} if omitted.
  */
 public static fromValues(
  px: number,
  py: number,
  c: number,
  s: number,
  outTransform: Transform2 = new Transform2(),
 ): Transform2 {
  outTransform.p.set(px, py);
  outTransform.r.set(c, s);

  return outTransform;
 }

 /**
  * Creates a transform from an **angle** and **translation**.
  *
  * @param angle - Angle in radians.
  * @param tx - Translation X.
  * @param ty - Translation Y.
  * @param outTransform - Optional destination (**alloc‑free**).
  * @returns The provided `outTransform`, or a new {@link Transform2} if omitted.
  */
 public static fromAngleTranslation(
  angle: number,
  tx: number,
  ty: number,
  outTransform: Transform2 = new Transform2(),
 ): Transform2 {
  outTransform.p.set(tx, ty);
  outTransform.r.setAngle(angle);

  return outTransform;
 }

 /**
  * Creates a transform from position and rotation (read‑only objects supported).
  *
  * @param position - `Vector2` or `{ x, y }`.
  * @param rotation - `Rot2` or `{ c, s }`.
  * @param outTransform - Optional destination (**alloc‑free**).
  * @returns The provided `outTransform`, or a new {@link Transform2} if omitted.
  */
 public static fromPositionRotation(
  position: ReadonlyVector2 | Vector2Like,
  rotation: ReadonlyRot2 | Rot2Like,
  outTransform: Transform2 = new Transform2(),
 ): Transform2 {
  outTransform.p.set((position as any).x, (position as any).y);
  outTransform.r.set((rotation as any).c, (rotation as any).s);

  return outTransform;
 }

 /**
  * Builds from a flat array `[px, py, c, s]`.
  *
  * @param sourceArray - Array with at least 4 elements starting at `offset`.
  * @param offset - Index of `px`. Defaults to `0`.
  * @param outTransform - Optional destination (**alloc‑free**).
  * @returns The provided `outTransform`.
  * @throws {RangeError} If `offset` is invalid for the given array length.
  */
 public static fromArray(
  sourceArray: ArrayLike<number>,
  offset = 0,
  outTransform: Transform2 = new Transform2(),
 ): Transform2 {
  if (offset < 0 || offset + 3 >= sourceArray.length) {
   throw new RangeError(
    `Transform2.fromArray: invalid offset ${offset} for array length ${sourceArray.length}`,
   );
  }

  return Transform2.fromValues(
   sourceArray[offset]!,
   sourceArray[offset + 1]!,
   sourceArray[offset + 2]!,
   sourceArray[offset + 3]!,
   outTransform,
  );
 }

 /**
  * Builds from a plain object `{ p:{x,y}, r:{c,s} }`.
  *
  * @param object - POJO with numeric `p` and `r` fields.
  * @param outTransform - Optional destination (**alloc‑free**).
  * @returns The provided `outTransform`.
  * @throws {TypeError} If the object is not `Transform2Like`.
  */
 public static fromObject(
  object: Transform2Like,
  outTransform: Transform2 = new Transform2(),
 ): Transform2 {
  if (!isTransform2Like(object)) {
   throw new TypeError('Transform2.fromObject: requires { p:{x,y}, r:{c,s} } with numeric fields');
  }

  return Transform2.fromPositionRotation(object.p, object.r, outTransform);
 }

 /**
  * Create a transform from a 3×3 affine transformation matrix.
  *
  * Extracts the 2D rotation and translation components from the matrix.
  * Ignores scale and shear components (assumes the matrix represents a rigid transformation).
  *
  * @param m - The 3×3 affine transformation matrix.
  * @returns A new {@link Transform2}.
  * @throws {Error} If the rotation part cannot be normalized to a valid Rot2.
  */
 public static fromMatrix3(m: ReadonlyMat3): Transform2;
 /**
  * Create a transform from a 3×3 affine transformation matrix.
  *
  * @param m - The 3×3 affine transformation matrix.
  * @param outTransform - Destination transform.
  * @returns `outTransform` set from the matrix.
  * @throws {Error} If the rotation part cannot be normalized to a valid Rot2.
  */
 public static fromMatrix3(m: ReadonlyMat3, outTransform: Transform2): Transform2;
 public static fromMatrix3(
  m: ReadonlyMat3,
  outTransform: Transform2 = new Transform2(),
 ): Transform2 {
  // Extract translation from last column
  outTransform.p.set(m.m02, m.m12);

  // Extract rotation from upper-left 2×2 submatrix
  // Normalize to remove scale
  const sx = Math.hypot(m.m00, m.m10);
  const sy = Math.hypot(m.m01, m.m11);

  if (sx < EPSILON || sy < EPSILON) {
   throw new Error('Transform2.fromMatrix3: degenerate transformation matrix');
  }

  // Extract pure rotation by removing scale
  const c = m.m00 / sx;
  const s = m.m10 / sx;

  outTransform.r.set(c, s);
  return outTransform;
 }

 /**
  * Convert the transform to a 3×3 affine transformation matrix.
  *
  * The resulting matrix represents the same rigid transformation in homogeneous coordinates.
  *
  * @param t - The transform to convert.
  * @returns A new {@link Mat3} representing the transformation.
  */
 public static toMatrix3(t: ReadonlyTransform2): Mat3;
 /**
  * Convert the transform to a 3×3 affine transformation matrix.
  *
  * @param t - The transform to convert.
  * @param outMatrix - Destination matrix.
  * @returns `outMatrix` set to the transformation matrix.
  */
 public static toMatrix3(t: ReadonlyTransform2, outMatrix: Mat3): Mat3;
 public static toMatrix3(t: ReadonlyTransform2, outMatrix: Mat3 = new Mat3()): Mat3 {
  // Set rotation part
  outMatrix.m00 = t.r.c;
  outMatrix.m01 = -t.r.s;
  outMatrix.m10 = t.r.s;
  outMatrix.m11 = t.r.c;

  // Set translation part
  outMatrix.m02 = t.p.x;
  outMatrix.m12 = t.p.y;

  // Set homogeneous part
  outMatrix.m20 = 0;
  outMatrix.m21 = 0;
  outMatrix.m22 = 1;

  return outMatrix;
 }

 /* ----------------------------------------------------------------------- */
 /* Statics: Application to points and vectors                              */
 /* ----------------------------------------------------------------------- */

 /**
  * Applies `t` to a **point**: `x' = r·x + p`.
  *
  * @param t - Transform.
  * @param point - Source point.
  * @param outPoint - Optional destination (**alloc‑free**).
  * @returns The transformed point reference `outPoint`.
  */
 public static transformPoint(
  t: ReadonlyTransform2,
  point: ReadonlyVector2,
  outPoint: Vector2 = new Vector2(),
 ): Vector2 {
  const c = t.r.c,
   s = t.r.s;

  const x = c * point.x - s * point.y + t.p.x;
  const y = s * point.x + c * point.y + t.p.y;

  return outPoint.set(x, y);
 }

 /**
  * Applies `t` to a **vector** (no translation): `v' = r·v`.
  *
  * @param t - Transform.
  * @param v - Source vector.
  * @param outVector - Optional destination (**alloc‑free**).
  * @returns The transformed vector reference `outVector`.
  */
 public static transformVector(
  t: ReadonlyTransform2,
  v: ReadonlyVector2,
  outVector: Vector2 = new Vector2(),
 ): Vector2 {
  const c = t.r.c,
   s = t.r.s;

  return outVector.set(c * v.x - s * v.y, s * v.x + c * v.y);
 }

 /**
  * Applies the **inverse** of `t` to a **point**: `x' = R⁻¹ (x − p)`.
  *
  * @param t - Transform.
  * @param point - Source point.
  * @param outPoint - Optional destination (**alloc‑free**).
  * @returns The transformed point reference `outPoint`.
  */
 public static inverseTransformPoint(
  t: ReadonlyTransform2,
  point: ReadonlyVector2,
  outPoint: Vector2 = new Vector2(),
 ): Vector2 {
  const dx = point.x - t.p.x;
  const dy = point.y - t.p.y;
  const c = t.r.c,
   s = t.r.s; // R⁻¹ = [ c  s; -s  c ]

  return outPoint.set(c * dx + s * dy, -s * dx + c * dy);
 }

 /**
  * Applies the **inverse** of `t` to a **vector**: `v' = R⁻¹·v`.
  *
  * @param t - Transform.
  * @param v - Source vector.
  * @param outVector - Optional destination (**alloc‑free**).
  * @returns The transformed vector reference `outVector`.
  */
 public static inverseTransformVector(
  t: ReadonlyTransform2,
  v: ReadonlyVector2,
  outVector: Vector2 = new Vector2(),
 ): Vector2 {
  const c = t.r.c,
   s = t.r.s;

  return outVector.set(c * v.x + s * v.y, -s * v.x + c * v.y);
 }

 /* ----------------------------------------------------------------------- */
 /* Statics: Composition, inverse, and relative                             */
 /* ----------------------------------------------------------------------- */

 /**
  * Composition `A ∘ B` (apply `B` **first**, then `A`):
  *
  * - `r = rA · rB`
  * - `p = pA + rA·pB`
  *
  * @param a - Left (outer) transform.
  * @param b - Right (inner) transform.
  * @param outTransform - Optional destination (**alloc‑free**).
  * @returns The composed transform reference `outTransform`.
  * @remarks
  * **Alias‑safe**: captures `a`'s rotation/translation before writing to `outTransform`,
  * so it is safe when `outTransform === a`.
  */
 public static multiply(
  a: ReadonlyTransform2,
  b: ReadonlyTransform2,
  outTransform: Transform2 = new Transform2(),
 ): Transform2 {
  // Capture a's state to be alias‑safe.
  const cA = a.r.c,
   sA = a.r.s;
  const pxA = a.p.x,
   pyA = a.p.y;

  // r = rA * rB
  Rot2.multiply(a.r, b.r, outTransform.r);

  // p = pA + rA * pB
  const x = cA * b.p.x - sA * b.p.y + pxA;
  const y = sA * b.p.x + cA * b.p.y + pyA;

  outTransform.p.set(x, y);

  return outTransform;
 }

 /**
  * Left composition `A × B` (premultiply), equivalent to {@link multiply}(A, B).
  *
  * @param a - Left transform (applied last).
  * @param b - Right transform (applied first).
  * @param outTransform - Optional destination (**alloc‑free**).
  * @returns The composed transform reference `outTransform`.
  */
 public static premultiply(
  a: ReadonlyTransform2,
  b: ReadonlyTransform2,
  outTransform: Transform2 = new Transform2(),
 ): Transform2 {
  return Transform2.multiply(a, b, outTransform);
 }

 /**
  * Inverse of a transform: `T⁻¹ = ( -R⁻¹·p, R⁻¹ )`.
  *
  * @param t - Transform to invert.
  * @param outTransform - Optional destination (**alloc‑free**).
  * @returns The inverted transform reference `outTransform`.
  */
 public static inverse(
  t: ReadonlyTransform2,
  outTransform: Transform2 = new Transform2(),
 ): Transform2 {
  // r⁻¹ = (c, -s)
  outTransform.r.set(t.r.c, -t.r.s);

  // p' = - r⁻¹ · p
  const c = outTransform.r.c,
   s = outTransform.r.s;

  const x = -(c * t.p.x - s * t.p.y);
  const y = -(s * t.p.x + c * t.p.y);

  outTransform.p.set(x, y);

  return outTransform;
 }

 /**
  * Relative transform mapping frame `A` to frame `B`: `T = A⁻¹ ∘ B`.
  *
  * @param a - Origin frame.
  * @param b - Destination frame.
  * @param outTransform - Optional destination (**alloc‑free**).
  * @returns The relative transform reference `outTransform` such that `A ∘ T = B`.
  * @remarks
  * Reuses `outTransform` as temporary storage. Safe due to alias‑safe {@link multiply}.
  */
 public static relative(
  a: ReadonlyTransform2,
  b: ReadonlyTransform2,
  outTransform: Transform2 = new Transform2(),
 ): Transform2 {
  const invA = Transform2.inverse(a, outTransform); // reuse `out` as buffer

  return Transform2.multiply(invA, b, outTransform);
 }

 /* ----------------------------------------------------------------------- */
 /* Statics: Interpolation                                                  */
 /* ----------------------------------------------------------------------- */

 /**
  * Interpolates transforms with **LERP** on translation and **SLERP** on rotation (no clamp).
  *
  * @param a - Start transform.
  * @param b - End transform.
  * @param t - Interpolation factor (not clamped).
  * @param outTransform - Optional destination (**alloc‑free**).
  * @returns The interpolated transform reference `outTransform`.
  */
 public static slerpLerp(
  a: ReadonlyTransform2,
  b: ReadonlyTransform2,
  t: number,
  outTransform: Transform2 = new Transform2(),
 ): Transform2 {
  outTransform.p.set(a.p.x + (b.p.x - a.p.x) * t, a.p.y + (b.p.y - a.p.y) * t);

  Rot2.slerp(a.r, b.r, t, outTransform.r);

  return outTransform;
 }

 /**
  * Clamped variant of {@link slerpLerp}.
  *
  * @param a - Start transform.
  * @param b - End transform.
  * @param t - Interpolation factor, will be clamped to `[0, 1]`.
  * @param outTransform - Optional destination (**alloc‑free**).
  * @returns The interpolated transform reference `outTransform`.
  */
 public static slerpLerpClamped(
  a: ReadonlyTransform2,
  b: ReadonlyTransform2,
  t: number,
  outTransform: Transform2 = new Transform2(),
 ): Transform2 {
  const tt = t <= 0 ? 0 : t >= 1 ? 1 : t;

  return Transform2.slerpLerp(a, b, tt, outTransform);
 }

 /**
  * Interpolates with **NLERP** (rotation) and **LERP** (translation).
  *
  * @param a - Start transform.
  * @param b - End transform.
  * @param t - Interpolation factor (not clamped).
  * @param outTransform - Optional destination (**alloc‑free**).
  * @returns The interpolated transform reference `outTransform`.
  */
 public static nlerpLerp(
  a: ReadonlyTransform2,
  b: ReadonlyTransform2,
  t: number,
  outTransform: Transform2 = new Transform2(),
 ): Transform2 {
  outTransform.p.set(a.p.x + (b.p.x - a.p.x) * t, a.p.y + (b.p.y - a.p.y) * t);

  Rot2.nlerp(a.r, b.r, t, outTransform.r);

  return outTransform;
 }

 /**
  * Clamped variant of {@link nlerpLerp}.
  *
  * @param a - Start transform.
  * @param b - End transform.
  * @param t - Interpolation factor, will be clamped to `[0, 1]`.
  * @param outTransform - Optional destination (**alloc‑free**).
  * @returns The interpolated transform reference `outTransform`.
  */
 public static nlerpLerpClamped(
  a: ReadonlyTransform2,
  b: ReadonlyTransform2,
  t: number,
  outTransform: Transform2 = new Transform2(),
 ): Transform2 {
  const tt = t <= 0 ? 0 : t >= 1 ? 1 : t;

  return Transform2.nlerpLerp(a, b, tt, outTransform);
 }

 /* ====================================================================== */
 /* Instance                                                                */
 /* ====================================================================== */

 /** Translation component. */
 public p: Vector2;
 /** Rotation component. */
 public r: Rot2;

 /* ----------------------------------------------------------------------- */
 /* Constructors                                                            */
 /* ----------------------------------------------------------------------- */

 /**
  * Builds a new transform.
  *
  * Overloads:
  * - `constructor()` → identity.
  * - `constructor(transform: Transform2)` → deep copy.
  * - `constructor(object: Transform2Like)` → from POJO.
  * - `constructor(position: Vector2Like, rotation: Rot2Like)` → from components.
  *
  * @returns A new {@link Transform2} instance.
  * @throws {RangeError} If the provided arguments do not match any supported overload.
  */
 constructor();
 /** Builds from another {@link Transform2}. */
 constructor(transform: Transform2);
 /** Builds from `{ p:{x,y}, r:{c,s} }` (POJO). */
 constructor(object: Transform2Like);
 /** Builds from `position` and `rotation`. */
 constructor(position: Vector2Like | ReadonlyVector2, rotation: Rot2Like | ReadonlyRot2);
 constructor(a?: any, b?: any) {
  if (a === undefined) {
   this.p = new Vector2(0, 0);
   this.r = new Rot2(1, 0);
  } else if (a instanceof Transform2) {
   this.p = new Vector2(a.p);
   this.r = new Rot2(a.r);
  } else if (isTransform2Like(a)) {
   this.p = new Vector2(a.p);
   this.r = new Rot2(a.r);
  } else if (a && b && isVector2Like(a) && isRot2Like(b)) {
   this.p = new Vector2(a);
   this.r = new Rot2(b);
  } else {
   throw new RangeError('Transform2.constructor: invalid constructor arguments for Transform2');
  }
 }

 /* ----------------------------------------------------------------------- */
 /* Mutators                                                                */
 /* ----------------------------------------------------------------------- */

 /**
  * Assigns `p` and `r`.
  *
  * @param position - Translation.
  * @param rotation - Rotation.
  * @returns `this` (for chaining).
  */
 public set(position: ReadonlyVector2 | Vector2Like, rotation: ReadonlyRot2 | Rot2Like): this {
  this.p.set((position as any).x, (position as any).y);
  this.r.set((rotation as any).c, (rotation as any).s);

  return this;
 }

 /**
  * Resets to identity.
  *
  * @returns `this`.
  */
 public identity(): this {
  this.p.set(0, 0);
  this.r.set(1, 0);

  return this;
 }

 /**
  * Deep clone.
  *
  * @returns A new {@link Transform2} with the same components.
  */
 public clone(): Transform2 {
  return new Transform2(this);
 }

 /**
  * Copies from `other`.
  *
  * @param other - Source transform.
  * @returns `this`.
  */
 public copy(other: ReadonlyTransform2): this {
  this.p.copy(other.p);
  this.r.copy(other.r);

  return this;
 }

 /* ----------------------------------------------------------------------- */
 /* Application to points and vectors (instance)                            */
 /* ----------------------------------------------------------------------- */

 /**
  * Applies to a **point**: `x' = r·x + p`.
  *
  * @param point - Source point.
  * @returns A new {@link Vector2} with the transformed point.
  */
 public applyToPoint(point: ReadonlyVector2): Vector2 {
  return Transform2.transformPoint(this, point);
 }

 /**
  * Applies to a **point** (**alloc‑free**).
  *
  * @param point - Source point.
  * @param out - Destination vector to write to.
  * @returns The `out` vector reference.
  */
 public applyToPointInto(point: ReadonlyVector2, out: Vector2): Vector2 {
  return Transform2.transformPoint(this, point, out);
 }

 /**
  * Applies to a **vector**: `v' = r·v`.
  *
  * @param v - Source vector.
  * @returns A new {@link Vector2} with the transformed vector.
  */
 public applyToVector(v: ReadonlyVector2): Vector2 {
  return Transform2.transformVector(this, v);
 }

 /**
  * Applies to a **vector** (**alloc‑free**).
  *
  * @param v - Source vector.
  * @param out - Destination vector to write to.
  * @returns The `out` vector reference.
  */
 public applyToVectorInto(v: ReadonlyVector2, out: Vector2): Vector2 {
  return Transform2.transformVector(this, v, out);
 }

 /**
  * Applies the **inverse** to a **point**.
  *
  * @param point - Source point.
  * @returns A new {@link Vector2} with the transformed point.
  */
 public applyInverseToPoint(point: ReadonlyVector2): Vector2 {
  return Transform2.inverseTransformPoint(this, point);
 }

 /**
  * Applies the **inverse** to a **point** (**alloc‑free**).
  *
  * @param point - Source point.
  * @param out - Destination vector to write to.
  * @returns The `out` vector reference.
  */
 public applyInverseToPointInto(point: ReadonlyVector2, out: Vector2): Vector2 {
  return Transform2.inverseTransformPoint(this, point, out);
 }

 /**
  * Applies the **inverse** to a **vector**.
  *
  * @param v - Source vector.
  * @returns A new {@link Vector2} with the transformed vector.
  */
 public applyInverseToVector(v: ReadonlyVector2): Vector2 {
  return Transform2.inverseTransformVector(this, v);
 }

 /**
  * Applies the **inverse** to a **vector** (**alloc‑free**).
  *
  * @param v - Source vector.
  * @param out - Destination vector to write to.
  * @returns The `out` vector reference.
  */
 public applyInverseToVectorInto(v: ReadonlyVector2, out: Vector2): Vector2 {
  return Transform2.inverseTransformVector(this, v, out);
 }

 /* ----------------------------------------------------------------------- */
 /* Composition, inverse and relative (instance)                            */
 /* ----------------------------------------------------------------------- */

 /**
  * Right‑composition: `this = this ∘ m` (apply `m` **first**, then `this`).
  *
  * @param m - Right transform.
  * @returns `this`.
  * @remarks
  * Alias‑safe because it captures the needed state before overwriting members.
  */
 public multiply(m: ReadonlyTransform2): this {
  const px = this.p.x,
   py = this.p.y;

  const cA = this.r.c,
   sA = this.r.s;

  this.r.multiply(m.r); // r = rA * rB

  // p = pA + rA * pB
  const x = cA * m.p.x - sA * m.p.y + px;
  const y = sA * m.p.x + cA * m.p.y + py;

  this.p.set(x, y);

  return this;
 }

 /**
  * Left‑composition: `this = m ∘ this`.
  *
  * @param m - Left transform.
  * @returns `this`.
  */
 public premultiply(m: ReadonlyTransform2): this {
  this.r.premultiply(m.r); // r = m.r * this.r

  // p = m.p + m.r * this.p
  const c = m.r.c,
   s = m.r.s;

  const x = c * this.p.x - s * this.p.y + m.p.x;
  const y = s * this.p.x + c * this.p.y + m.p.y;

  this.p.set(x, y);

  return this;
 }

 /**
  * Inverts in‑place: `this = this⁻¹`.
  *
  * @returns `this`.
  */
 public inverse(): this {
  this.r.inverse(); // r' = r⁻¹

  // p' = - r' * p_old  (use saved copy)
  const px = this.p.x,
   py = this.p.y;

  const c = this.r.c,
   s = this.r.s;

  this.p.set(-(c * px - s * py), -(s * px + c * py));

  return this;
 }

 /**
  * Makes this transform **relative** to `a`: `this = a⁻¹ ∘ this`.
  *
  * @param a - Reference frame.
  * @returns `this`.
  */
 public makeRelativeTo(a: ReadonlyTransform2): this {
  const temporary = Transform2.inverse(a, new Transform2());

  return this.copy(Transform2.multiply(temporary, this, temporary));
 }

 /* ----------------------------------------------------------------------- */
 /* Interpolation (instance)                                                */
 /* ----------------------------------------------------------------------- */

 /**
  * SLERP (rotation) + LERP (translation) towards `t` by factor `alpha`.
  *
  * @param t - Target transform.
  * @param alpha - Interpolation factor.
  * @returns `this`.
  */
 public slerpLerpTo(t: ReadonlyTransform2, alpha: number): this {
  this.p.lerp(t.p, alpha);
  this.r.slerpTo(t.r, alpha);

  return this;
 }

 /**
  * NLERP (rotation) + LERP (translation) towards `t` by factor `alpha`.
  *
  * @param t - Target transform.
  * @param alpha - Interpolation factor.
  * @returns `this`.
  */
 public nlerpLerpTo(t: ReadonlyTransform2, alpha: number): this {
  this.p.lerp(t.p, alpha);
  this.r.nlerpTo(t.r, alpha);

  return this;
 }

 /* ----------------------------------------------------------------------- */
 /* Normalization, validation and utilities                                 */
 /* ----------------------------------------------------------------------- */

 /**
  * Strictly normalizes the rotation (translation unchanged).
  *
  * @returns `this`.
  * @throws {RangeError} If the rotation has zero norm.
  */
 public normalize(): this {
  this.r.normalize();

  return this;
 }

 /**
  * Normalizes the rotation only if needed (tolerance `epsilon`).
  *
  * @param epsilon - Non‑negative tolerance. Defaults to {@link EPSILON}.
  * @returns `this`.
  */
 public normalizeIfNeeded(epsilon: number = EPSILON): this {
  this.r.normalizeIfNeeded(epsilon);

  return this;
 }

 /**
  * Strict component‑wise equality.
  *
  * @param other - Transform to compare against.
  * @returns `true` if all components are exactly equal; otherwise `false`.
  */
 public equals(other: ReadonlyTransform2): boolean {
  return this.p.equals(other.p) && this.r.equals(other.r);
 }

 /**
  * Approximate equality with tolerance.
  *
  * @param other - Other transform.
  * @param epsilon - Non‑negative tolerance. Defaults to {@link LINEAR_EPSILON}.
  * @returns `true` if both `p` and `r` are within tolerance; otherwise `false`.
  * @throws {RangeError} If `epsilon < 0`.
  */
 public nearEquals(other: ReadonlyTransform2, epsilon: number = LINEAR_EPSILON): boolean {
  validateTolerance(epsilon, 'Transform2.nearEquals');
  return this.p.nearEquals(other.p, epsilon) && this.r.nearEquals(other.r, epsilon);
 }

 /**
  * Checks that all components are finite.
  *
  * @returns `true` iff all components are finite.
  */
 public isFinite(): boolean {
  return this.p.isFinite() && this.r.isFinite();
 }

 /**
  * Checks whether the transform is identity within a tolerance.
  *
  * @param epsilon - Tolerance. Defaults to {@link EPSILON}.
  * @returns `true` if identity within tolerance; otherwise `false`.
  */
 public isIdentity(epsilon: number = EPSILON): boolean {
  return this.p.nearZero(epsilon) && this.r.isIdentity(epsilon);
 }

 /* ----------------------------------------------------------------------- */
 /* Representation                                                          */
 /* ----------------------------------------------------------------------- */

 /**
  * Writes `[px, py, c, s]` into an array or typed array.
  *
  * @typeParam T - `number[]` or `Float32Array`.
  * @param outArray - Destination array. Defaults to a new `number[]`.
  * @param offset - Starting index. Defaults to `0`.
  * @returns The same `outArray` reference.
  */
 public toArray<T extends number[] | Float32Array>(
  outArray: T = [] as unknown as T,
  offset = 0,
 ): T {
  (outArray as any)[offset + 0] = this.p.x;
  (outArray as any)[offset + 1] = this.p.y;
  (outArray as any)[offset + 2] = this.r.c;
  (outArray as any)[offset + 3] = this.r.s;

  return outArray;
 }

 /**
  * Returns a plain object `{ p:{x,y}, r:{c,s} }`.
  *
  * @returns A new POJO representation of this transform.
  */
 public toJSON(): Transform2Like {
  return { p: this.p.toJSON(), r: this.r.toJSON() };
 }

 /**
  * Semantic alias of {@link toJSON}.
  *
  * @returns A new POJO representation of this transform.
  */
 public toObject(): Transform2Like {
  return this.toJSON();
 }

 /**
  * Iterator for destructuring: `[...T] → [px, py, c, s]`.
  *
  * @yields Each component in order: `px`, `py`, `c`, `s`.
  * @returns An iterator over the four numeric components.
  */
 public *[Symbol.iterator](): IterableIterator<number> {
  yield this.p.x;
  yield this.p.y;
  yield this.r.c;
  yield this.r.s;
 }

 /**
  * Text representation `"px,py,c,s"`.
  *
  * @param precision - Optional decimal digits (fixed‑point).
  * @returns A comma‑separated string with four numbers.
  */
 public toString(precision?: number): string {
  if (precision != null) {
   return `${this.p.x.toFixed(precision)},${this.p.y.toFixed(precision)},${this.r.c.toFixed(
    precision,
   )},${this.r.s.toFixed(precision)}`;
  }

  return `${this.p.x},${this.p.y},${this.r.c},${this.r.s}`;
 }
}
