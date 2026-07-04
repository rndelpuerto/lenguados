/**
 * @file core/transform2.ts
 * @module @lenguados/math2d/core
 * @description Deterministic 2D transform combining translation, rotation, and scale
 *
 * @remarks
 * Provides the {@link Transform2} class for decomposed SRT (Scale → Rotate → Translate)
 * 2D transforms. Stores position, rotation, and scale as separate components for
 * efficient composition, interpolation, and inverse computation.
 */

import { sinCos } from '../auxiliary/angle/operations';
import { saturate } from '../auxiliary/scalar/arithmetic';
import {
 isNearZero,
 nearEquals as scalarNearEquals,
 relativeEquals,
} from '../auxiliary/scalar/comparison';
import { EPSILON, RAD_TO_DEG } from '../auxiliary/scalar/constants';
import { lerp, smoothStep } from '../auxiliary/scalar/interpolation';
import type {
 ReadonlyRotation2Like,
 ReadonlyTransform2Like,
 ReadonlyVector2Like,
 Transform2Like,
} from '../types';

import { Matrix3, type ReadonlyMatrix3 } from './matrix3';
import { Rotation2, type ReadonlyRotation2 } from './rotation2';
import { Vector2, type ReadonlyVector2 } from './vector2';

/* ========================================================================== */
/* Type Exports                                                               */
/* ========================================================================== */

/**
 * Structural type describing objects compatible with {@link Transform2}.
 *
 * @category Types
 * @since 0.7.0
 */
export type { Transform2Like } from '../types';

/**
 * Readonly view of a {@link Transform2} instance
 *
 * @category Types
 * @since 0.7.0
 * @public
 */
export type ReadonlyTransform2 = Readonly<Transform2> & {
 readonly position: ReadonlyVector2;
 readonly rotation: ReadonlyRotation2;
 readonly scale: ReadonlyVector2;
};

export { isTransform2Like } from '../types';

/* ========================================================================== */
/* Helper Functions                                                           */
/* ========================================================================== */

/**
 * Permanently freezes a {@link Transform2} instance so it can no longer be mutated
 *
 * @remarks
 * - The returned object keeps its original reference; no new memory is allocated.
 * - In strict mode any subsequent attempt to modify properties throws a TypeError.
 * - Note: This also freezes the nested `position` and `scale` vectors.
 *
 * @param transform - The Transform2 object to freeze
 * @returns The same instance, now typed as ReadonlyTransform2
 *
 * @example
 * ```typescript
 * const IDENTITY = freezeTransform2(new Transform2());
 * IDENTITY.rotation = Math.PI; // Throws in strict mode
 * ```
 *
 * @category Helpers
 * @since 0.7.0
 */
export function freezeTransform2(transform: Transform2): ReadonlyTransform2 {
 Object.freeze(transform.position);
 Object.freeze(transform.rotation);
 Object.freeze(transform.scale);
 return Object.freeze(transform) as ReadonlyTransform2;
}

/* ========================================================================== */
/* Class: Transform2                                                          */
/* ========================================================================== */

/**
 * Decomposed 2D affine transform applied in Scale → Rotate → Translate order
 *
 * @remarks
 * - **Design:** Decomposed SRT (Scale → Rotate → Translate) transform. Stores
 *   `position` (Vector2), `rotation` (Rotation2), and `scale` (Vector2) as separate
 *   components. Instance methods are mutable and chainable; static methods are pure.
 * - **Numerics:** Inverse computation uses the SRT decomposition formula. Non-uniform
 *   scale inverse is an approximation; use `inverseTransformPoint` for exact results.
 * - **Safety:** "Safe" variants return identity transform instead of throwing on
 *   non-invertible transforms (zero scale).
 *
 * @example
 * ```typescript
 * // Create and compose transforms
 * const t = new Transform2();
 * t.position.set(10, 20);
 * t.rotation.setAngle(Math.PI / 4);
 * t.scale.set(2, 2);
 *
 * // Apply to a point
 * const worldPoint = Transform2.transformPoint(t, localPoint);
 * ```
 *
 * @category Core
 * @since 0.7.0
 */
export class Transform2 implements Transform2Like {
 /* ======================================================================== */
 /* Instance Properties                                                      */
 /* ======================================================================== */

 /**
  * The translation component
  *
  * @category Accessor
  * @since 0.7.0
  */
 public readonly position: Vector2;

 /**
  * The rotation component. Use rotation.angle, rotation.angleDegrees, etc.
  * for convenient access, or rotation.cos/sin for direct component access.
  *
  * @remarks
  * The rotation is stored as a separate {@link Rotation2} instance rather than
  * a raw angle. All rotation logic lives in Rotation2, enforcing clean
  * separation of concerns between position and orientation.
  *
  * @example
  * ```typescript
  * // Convenience (delegates to Rotation2)
  * transform.rotation.angle = Math.PI / 4;
  * console.log(transform.rotation.angleDegrees); // 45
  *
  * // Direct component access
  * const { cos, sin } = transform.rotation;
  *
  * // In-place mutations (zero allocation)
  * transform.rotation.setAngle(Math.PI);
  * transform.rotation.multiply(other.rotation);
  * ```
  *
  * @category Accessor
  * @since 0.7.0
  */
 public readonly rotation: Rotation2;

 /**
  * The non-uniform scale component `(sx, sy)`
  *
  * @category Accessor
  * @since 0.7.0
  */
 public readonly scale: Vector2;

 /* ======================================================================== */
 /* Private Helpers                                                          */
 /* ======================================================================== */

 private static ensureOut(out?: Transform2): Transform2 {
  return out ?? new Transform2();
 }

 /* ======================================================================== */
 /* Static Constants (Immutable)                                             */
 /* ======================================================================== */

 /**
  * Identity transform (no transformation)
  * @category Constant
  * @since 0.7.0
  */
 public static readonly IDENTITY = /* @__PURE__ */ freezeTransform2(
  /* @__PURE__ */ new Transform2(),
 );

 /**
  * Number of elements when serialized via toArray() (x, y, angle, sx, sy)
  * See {@link COMPONENT_COUNT} for raw component count from Symbol.iterator.
  * @category Constant
  * @since 0.7.0
  */
 public static readonly ELEMENT_COUNT = 5;

 /**
  * Number of raw components yielded by Symbol.iterator (px, py, cos, sin, sx, sy)
  * @category Constant
  * @since 0.7.0
  */
 public static readonly COMPONENT_COUNT = 6;

 /**
  * Flip horizontally (scale.x = -1)
  * @category Constant
  * @since 0.7.0
  */
 public static readonly FLIP_X = /* @__PURE__ */ freezeTransform2(
  /* @__PURE__ */ new Transform2(undefined, 0, { x: -1, y: 1 }),
 );

 /**
  * Flip vertically (scale.y = -1)
  * @category Constant
  * @since 0.7.0
  */
 public static readonly FLIP_Y = /* @__PURE__ */ freezeTransform2(
  /* @__PURE__ */ new Transform2(undefined, 0, { x: 1, y: -1 }),
 );

 /* ======================================================================== */
 /* Constructor                                                              */
 /* ======================================================================== */

 /**
  * Creates a new Transform2 with the given position, rotation, and scale
  *
  * @param position - Initial translation. @defaultValue `{ x: 0, y: 0 }`
  * @param rotation - Initial rotation angle in radians. @defaultValue `0`
  * @param scale - Initial scale factors. @defaultValue `{ x: 1, y: 1 }`
  */
 constructor(position?: ReadonlyVector2Like, rotation = 0, scale?: ReadonlyVector2Like) {
  // Pure math: no assertions — Infinity/NaN are valid IEEE 754 values
  this.position = new Vector2(position?.x ?? 0, position?.y ?? 0);
  this.rotation = Rotation2.fromAngle(rotation);
  this.scale = new Vector2(scale?.x ?? 1, scale?.y ?? 1);
 }

 /* ======================================================================== */
 /* Static Factories                                                         */
 /* ======================================================================== */

 /**
  * Creates a transform from explicit values
  * @param x - X position
  * @param y - Y position
  * @param rotation - Rotation in radians
  * @param scaleX - X scale
  * @param scaleY - Y scale
  * @param out - Optional output transform
  * @returns Transform with specified values
  *
  * @example
  * ```typescript
  * const t = Transform2.fromValues(10, 20, Math.PI / 2, 2, 3);
  * // position=(10,20), rotation=90°, scale=(2,3)
  *
  * // Reuse existing transform to avoid allocation
  * const out = new Transform2();
  * Transform2.fromValues(5, 5, 0, 1, 1, out);
  * ```
  *
  * @category Factory
  * @since 0.7.0
  */
 public static fromValues(
  x: number,
  y: number,
  rotation: number,
  scaleX: number,
  scaleY: number,
  out?: Transform2,
 ): Transform2 {
  const target = Transform2.ensureOut(out);
  target.position.set(x, y);
  target.rotation.setAngle(rotation);
  target.scale.set(scaleX, scaleY);
  return target;
 }

 /**
  * Creates a transform from a 3x3 matrix
  *
  * @remarks
  * Negative scale is lost during decomposition because Matrix3.getScale()
  * uses hypot which always returns positive values.
  *
  * @param matrix - Source Matrix3
  * @param out - Optional output transform
  * @returns Decomposed transform
  *
  * @example
  * ```typescript
  * const matrix = Matrix3.fromTransform2(someTransform);
  * const t = Transform2.fromMatrix3(matrix);
  *
  * // Reuse existing transform to avoid allocation
  * const out = new Transform2();
  * Transform2.fromMatrix3(matrix, out);
  * ```
  *
  * @category Factory
  * @since 0.7.0
  */
 public static fromMatrix3(matrix: ReadonlyMatrix3, out?: Transform2): Transform2 {
  const target = Transform2.ensureOut(out);
  matrix.getTranslation(target.position);
  matrix.getScale(target.scale);
  target.rotation.setAngle(matrix.getRotation());
  return target;
 }

 /**
  * Creates a transform from components
  *
  * @remarks
  * When passing a `ReadonlyRotation2Like` object, `cos` and `sin` are copied directly
  * to avoid the lossy `atan2 → sinCos` roundtrip. The caller **must** ensure the
  * object is unit-length (`cos² + sin² = 1`); no normalization is performed.
  *
  * @param position - Position vector
  * @param rotation - Rotation (angle in radians, or a unit-length Rotation2Like with cos/sin)
  * @param scale - Scale (vector or uniform scalar)
  * @param out - Optional output transform
  * @returns Transform from components
  *
  * @example
  * ```typescript
  * // Using angle
  * const t1 = Transform2.fromComponents({ x: 0, y: 0 }, Math.PI / 4, 1);
  *
  * // Using Rotation2Like (e.g., from sinCosInto or Rotation2)
  * const rot = { cos: 0.707, sin: 0.707 };
  * const t2 = Transform2.fromComponents({ x: 0, y: 0 }, rot, 1);
  * ```
  *
  * @category Factory
  * @since 0.7.0
  */
 public static fromComponents(
  position: ReadonlyVector2Like,
  rotation: number | ReadonlyRotation2Like,
  scale: ReadonlyVector2Like | number,
  out?: Transform2,
 ): Transform2 {
  const target = Transform2.ensureOut(out);
  target.position.set(position?.x ?? 0, position?.y ?? 0);
  if (typeof rotation === 'number') {
   target.rotation.setAngle(rotation);
  } else {
   // Copy cos/sin directly to avoid lossy atan2→sinCos roundtrip
   target.rotation.cos = rotation.cos;
   target.rotation.sin = rotation.sin;
  }
  if (typeof scale === 'number') {
   target.scale.set(scale, scale);
  } else {
   target.scale.set(scale?.x ?? 1, scale?.y ?? 1);
  }
  return target;
 }

 /**
  * Creates a transform from a 2D pose (position + angle, uniform scale = 1)
  * @param x - Position X
  * @param y - Position Y
  * @param angle - Rotation angle in radians
  * @param out - Optional output transform
  * @returns Transform with given position and rotation, scale (1,1)
  *
  * @example
  * ```typescript
  * const t = Transform2.fromPose(100, 50, Math.PI / 4);
  * // position = (100, 50), rotation = 45°, scale = (1, 1)
  * ```
  *
  * @category Factory
  * @since 0.7.0
  */
 public static fromPose(x: number, y: number, angle: number, out?: Transform2): Transform2 {
  const target = Transform2.ensureOut(out);
  target.position.set(x, y);
  target.rotation.setAngle(angle);
  target.scale.set(1, 1);
  return target;
 }

 /**
  * Creates a transform from a plain object
  * @param object - Object with position, rotation, and scale
  * @param out - Optional output transform
  * @returns Transform from object
  *
  * @example
  * ```typescript
  * const obj = { position: { x: 5, y: 10 }, rotation: { cos: 1, sin: 0 }, scale: { x: 2, y: 2 } };
  * const t = Transform2.fromObject(obj);
  *
  * // Reuse existing transform to avoid allocation
  * const out = new Transform2();
  * Transform2.fromObject(obj, out);
  * ```
  *
  * @category Factory
  * @since 0.7.0
  */
 public static fromObject(object: ReadonlyTransform2Like, out?: Transform2): Transform2 {
  const target = Transform2.ensureOut(out);
  target.position.set(object.position.x, object.position.y);
  target.rotation.copy(object.rotation);
  target.scale.set(object.scale.x, object.scale.y);
  return target;
 }

 /**
  * Creates a deep copy of a transform
  * @param source - Transform to clone
  * @param out - Optional output transform
  * @returns A Transform2 with identical values
  *
  * @example
  * ```typescript
  * const original = Transform2.fromValues(10, 20, Math.PI / 4, 1, 1);
  * const cloned = Transform2.clone(original);
  *
  * // Reuse existing transform to avoid allocation
  * const out = new Transform2();
  * Transform2.clone(original, out);
  * ```
  *
  * @category Factory
  * @since 0.7.0
  */
 public static clone(source: ReadonlyTransform2, out?: Transform2): Transform2 {
  const target = Transform2.ensureOut(out);
  target.position.copy(source.position);
  target.rotation.copy(source.rotation);
  target.scale.copy(source.scale);
  return target;
 }

 /**
  * Creates a transform from a flat array [px, py, rotation, sx, sy]
  * @param array - Source array with at least 5 elements
  * @param offset - Index offset. @defaultValue `0`
  * @param out - Optional output transform
  * @returns Transform from array
  * @throws {RangeError} If offset is out of bounds
  *
  * @example
  * ```typescript
  * Transform2.fromArray([100, 50, Math.PI/4, 2, 2]); // pos=(100,50), rot=45°, scale=(2,2)
  * ```
  *
  * @category Factory
  * @since 0.7.0
  */
 public static fromArray(array: ArrayLike<number>, offset = 0, out?: Transform2): Transform2 {
  if (offset < 0 || offset + Transform2.ELEMENT_COUNT > array.length) {
   throw new RangeError(
    `Transform2.fromArray: offset ${offset} out of bounds for array length ${array.length}`,
   );
  }
  const target = Transform2.ensureOut(out);
  target.position.set(array[offset]!, array[offset + 1]!);
  target.rotation.setAngle(array[offset + 2]!);
  target.scale.set(array[offset + 3]!, array[offset + 4]!);
  return target;
 }

 /**
  * Copies values from source into destination (alloc-free)
  * @param source - Source transform
  * @param destination - Target transform to receive the copy
  * @returns The destination transform
  *
  * @example
  * ```typescript
  * const source = Transform2.fromPose(10, 20, Math.PI / 4);
  * const destination = new Transform2();
  * Transform2.copy(source, destination);
  * // destination now holds the same values as source
  * ```
  *
  * @category Factory
  * @since 0.7.0
  */
 public static copy(source: ReadonlyTransform2, destination: Transform2): Transform2 {
  destination.position.copy(source.position);
  destination.rotation.copy(source.rotation);
  destination.scale.copy(source.scale);
  return destination;
 }

 /* ======================================================================== */
 /* Static Arithmetic                                                        */
 /* ======================================================================== */

 /**
  * Multiplies two transforms: applies b in the local space of a
  *
  * @remarks
  * **⚠️ Non-uniform scale limitation:**
  * This operation assumes no shear in the transforms. When composing
  * transforms with non-uniform scale (scale.x ≠ scale.y) followed by
  * rotation, the mathematical result would include shear, which
  * Transform2 cannot represent (it only stores position, rotation, scale).
  *
  * The resulting transform is an approximation that preserves:
  * - Combined rotation (a.rotation + b.rotation)
  * - Combined scale (a.scale * b.scale)
  * - Correctly transformed position
  *
  * For exact composition with non-uniform scale, use {@link Matrix3} instead:
  * ```typescript
  * const m = Matrix3.multiply(
  *   Matrix3.fromTransform2(a),
  *   Matrix3.fromTransform2(b)
  * );
  * ```
  *
  * This limitation is inherent to SRT decomposition — rigid-body transforms
  * that store only position and rotation (no scale) avoid this issue entirely.
  *
  * @param a - First transform (parent/outer transform)
  * @param b - Second transform (child/inner transform)
  * @param out - Optional output transform
  * @returns Combined transform
  *
  * @see {@link Transform2.hasUniformScale} to check for uniform scaling
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 public static multiply(
  a: ReadonlyTransform2,
  b: ReadonlyTransform2,
  out?: Transform2,
 ): Transform2 {
  const target = Transform2.ensureOut(out);
  // Cache a/b scalars up-front so writes to `target` cannot clobber reads when
  // `out === a` or `out === b` (aliasing-safe pattern).
  const aCos = a.rotation.cos;
  const aSin = a.rotation.sin;
  const aScaleX = a.scale.x;
  const aScaleY = a.scale.y;
  const aPosX = a.position.x;
  const aPosY = a.position.y;
  const scaledX = b.position.x * aScaleX;
  const scaledY = b.position.y * aScaleY;
  const scaleX = aScaleX * b.scale.x;
  const scaleY = aScaleY * b.scale.y;
  // Rotation: delegate to canonical Rotation2.multiplyCS kernel.
  Rotation2.multiplyCS(a.rotation, b.rotation.cos, b.rotation.sin, target.rotation);
  // Position: rotate the scaled `b.position` by a's rotation, then translate by
  // `a.position`. Kept inline to avoid a temporary Vector2 allocation on the
  // hot Transform2 composition path.
  target.position.set(
   scaledX * aCos - scaledY * aSin + aPosX,
   scaledX * aSin + scaledY * aCos + aPosY,
  );
  target.scale.set(scaleX, scaleY);
  return target;
 }

 /**
  * Translates a transform by `(dx, dy)`
  *
  * @remarks
  * Post-translation: adds the world-space offset `(dx, dy)` to `position`;
  * the rotation and scale are unchanged. Distinct from {@link transformPoint}
  * which applies the full transform to a point.
  *
  * @param transform - Source transform
  * @param dx - X offset
  * @param dy - Y offset
  * @param out - Optional output transform
  * @returns Translated transform
  *
  * @category Transform
  * @since 0.7.0
  */
 public static translate(
  transform: ReadonlyTransform2,
  dx: number,
  dy: number,
  out?: Transform2,
 ): Transform2 {
  const target = Transform2.ensureOut(out);
  target.position.set(transform.position.x + dx, transform.position.y + dy);
  target.rotation.cos = transform.rotation.cos;
  target.rotation.sin = transform.rotation.sin;
  target.scale.set(transform.scale.x, transform.scale.y);
  return target;
 }

 /**
  * Composes a transform with an additional rotation
  *
  * @remarks
  * Multiplies the rotation on the right (local rotation). Delegates the
  * rotation multiply to {@link Rotation2.multiplyCS}.
  *
  * @param transform - Source transform
  * @param angle - Additional rotation in radians
  * @param out - Optional output transform
  * @returns Rotated transform
  *
  * @category Transform
  * @since 0.7.0
  */
 public static rotate(transform: ReadonlyTransform2, angle: number, out?: Transform2): Transform2 {
  const target = Transform2.ensureOut(out);
  const { cos, sin } = sinCos(angle);
  target.position.set(transform.position.x, transform.position.y);
  Rotation2.multiplyCS(transform.rotation, cos, sin, target.rotation);
  target.scale.set(transform.scale.x, transform.scale.y);
  return target;
 }

 /**
  * Scales a transform by `sxOrV` (uniform) or `(sxOrV, sy)` (non-uniform)
  *
  * @remarks
  * Component-wise multiplies the source scale. Accepts either a scalar (uniform)
  * or a `ReadonlyVector2Like` (non-uniform); the `sy` parameter applies when
  * `sxOrV` is a number.
  *
  * @param transform - Source transform
  * @param sxOrV - Uniform scalar, or non-uniform scale factor x-component, or scale vector
  * @param sy - Optional y-component when `sxOrV` is a scalar. @defaultValue `sxOrV`
  * @param out - Optional output transform
  * @returns Scaled transform
  *
  * @category Transform
  * @since 0.7.0
  */
 public static scaleBy(
  transform: ReadonlyTransform2,
  sxOrV: number | ReadonlyVector2Like,
  sy?: number,
  out?: Transform2,
 ): Transform2 {
  const target = Transform2.ensureOut(out);
  let fx: number;
  let fy: number;
  if (typeof sxOrV === 'number') {
   fx = sxOrV;
   fy = sy ?? sxOrV;
  } else {
   fx = sxOrV.x;
   fy = sxOrV.y;
  }
  target.position.set(transform.position.x, transform.position.y);
  target.rotation.cos = transform.rotation.cos;
  target.rotation.sin = transform.rotation.sin;
  target.scale.set(transform.scale.x * fx, transform.scale.y * fy);
  return target;
 }

 /**
  * Calculates the inverse of a transform
  *
  * @remarks
  * **Non-uniform scale warning:** This inversion is an APPROXIMATION when
  * `scale.x !== scale.y`. The SRT representation cannot exactly represent
  * the true inverse linear part `(R · S)⁻¹ = S⁻¹ · R⁻¹` because the SRT
  * format forces `R_inv · S_inv = R⁻¹ · S⁻¹`. For exact point inverse
  * transformation, use {@link inverseTransformPoint}. For exact full inverse,
  * convert to Matrix3 via {@link toMatrix3} and use {@link Matrix3.inverse}.
  * This is a well-known SRT decomposition limitation in computer graphics.
  *
  * @param transform - Transform to invert
  * @param out - Optional output transform
  * @returns Inverse transform
  * @throws {RangeError} If scale.x or scale.y is near zero (non-invertible)
  *
  * @see {@link inverseSafe} - Returns identity instead of throwing
  * @see {@link inverseUnchecked} - No validation, for hot paths
  * @see {@link inverseTransformPoint} - Exact point inverse (no SRT approximation)
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 public static inverse(transform: ReadonlyTransform2, out?: Transform2): Transform2 {
  if (isNearZero(transform.scale.x) || isNearZero(transform.scale.y)) {
   throw new RangeError(
    'Transform2.inverse: cannot invert transform with near-zero scale (non-invertible)',
   );
  }

  return Transform2.inverseUnchecked(transform, out);
 }

 /**
  * Calculates the inverse of a transform, returning identity if non-invertible
  *
  * @remarks
  * Uses {@link isNearZero} with default {@link EPSILON} (1e-10) on each scale
  * component. Returns identity when either |scale.x| or |scale.y| ≤ EPSILON.
  *
  * **Non-uniform scale warning:** See {@link inverse} for details on SRT
  * approximation. Use {@link inverseTransformPoint} for exact point inverse.
  *
  * @param transform - Transform to invert
  * @param out - Optional output transform
  * @returns Inverse transform, or identity if scale is near zero
  *
  * @see {@link inverse} - Throws on non-invertible transform
  * @see {@link inverseUnchecked} - No validation, for hot paths
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 public static inverseSafe(transform: ReadonlyTransform2, out?: Transform2): Transform2 {
  if (isNearZero(transform.scale.x) || isNearZero(transform.scale.y)) {
   const target = Transform2.ensureOut(out);
   target.position.set(0, 0);
   target.rotation.identity();
   target.scale.set(1, 1);
   return target;
  }

  return Transform2.inverseUnchecked(transform, out);
 }

 /**
  * Calculates the inverse of a transform without validation
  *
  * @remarks
  * **Precondition:** `transform.scale.x ≠ 0` and `transform.scale.y ≠ 0`.
  * Calling with zero scale produces `Infinity`/`NaN` in the result.
  *
  * **Non-uniform scale warning:** See {@link inverse} for details on SRT
  * approximation. Use {@link inverseTransformPoint} for exact point inverse.
  *
  * @param transform - Transform to invert (must have non-zero scale)
  * @param out - Optional output transform
  * @returns Inverse transform
  *
  * @see {@link inverse} - Throws on non-invertible transform
  * @see {@link inverseSafe} - Returns identity instead of throwing
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 public static inverseUnchecked(transform: ReadonlyTransform2, out?: Transform2): Transform2 {
  const target = Transform2.ensureOut(out);
  const invScaleX = 1 / transform.scale.x;
  const invScaleY = 1 / transform.scale.y;
  // Inline rotation inverse: invCos = cos, invSin = -sin
  const cos = transform.rotation.cos;
  const sin = -transform.rotation.sin;

  // Position: -(S⁻¹ · R⁻¹ · t) — apply inverse rotation first, then inverse scale
  const rotPosX = transform.position.x * cos - transform.position.y * sin;
  const rotPosY = transform.position.x * sin + transform.position.y * cos;
  const invPosX = -(rotPosX * invScaleX);
  const invPosY = -(rotPosY * invScaleY);

  target.rotation.cos = cos;
  target.rotation.sin = sin;
  target.scale.set(invScaleX, invScaleY);
  target.position.set(invPosX, invPosY);
  return target;
 }

 /**
  * Computes the relative transform `a⁻¹ · b`
  *
  * @remarks
  * Returns the transform that, applied to `a`, produces `b`. Equivalent to
  * `inverse(a) · b` but runs as a single pass with a private temp-free fast path.
  *
  * @param a - Base transform (must be invertible)
  * @param b - Target transform
  * @param out - Optional output transform
  * @returns Relative transform `a⁻¹ · b`
  * @throws {RangeError} If `a` has near-zero scale (non-invertible)
  *
  * @see {@link relativeSafe} - Returns identity on non-invertible `a`
  * @see {@link relativeUnchecked} - No validation, for hot paths
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 public static relative(
  a: ReadonlyTransform2,
  b: ReadonlyTransform2,
  out?: Transform2,
 ): Transform2 {
  if (isNearZero(a.scale.x) || isNearZero(a.scale.y)) {
   throw new RangeError('Transform2.relative: cannot invert `a` with near-zero scale');
  }
  return Transform2.relativeUnchecked(a, b, out);
 }

 /**
  * Computes the relative transform `a⁻¹ · b`, returning identity on singular `a`
  *
  * @param a - Base transform
  * @param b - Target transform
  * @param out - Optional output transform
  * @returns Relative transform, or identity if `a` is non-invertible
  *
  * @see {@link relative} - Strict variant that throws
  * @see {@link relativeUnchecked} - No validation, for hot paths
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 public static relativeSafe(
  a: ReadonlyTransform2,
  b: ReadonlyTransform2,
  out?: Transform2,
 ): Transform2 {
  if (isNearZero(a.scale.x) || isNearZero(a.scale.y)) {
   const target = Transform2.ensureOut(out);
   target.position.set(0, 0);
   target.rotation.identity();
   target.scale.set(1, 1);
   return target;
  }
  return Transform2.relativeUnchecked(a, b, out);
 }

 /**
  * Computes the relative transform `a⁻¹ · b` without validation
  *
  * @remarks
  * **Precondition:** `a.scale.x ≠ 0` and `a.scale.y ≠ 0`. Uses
  * {@link inverseUnchecked} + {@link multiply}; the internal inverse allocates
  * no temporary when `out !== a` and `out !== b`.
  *
  * @param a - Base transform (must have non-zero scale)
  * @param b - Target transform
  * @param out - Optional output transform
  * @returns Relative transform `a⁻¹ · b`
  *
  * @see {@link relative} - Strict variant that throws
  * @see {@link relativeSafe} - Returns identity on singular `a`
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 public static relativeUnchecked(
  a: ReadonlyTransform2,
  b: ReadonlyTransform2,
  out?: Transform2,
 ): Transform2 {
  const target = Transform2.ensureOut(out);
  // Cache b's components up-front so `out === b` aliasing is safe through the
  // two-step inverse(a) · b composition below.
  const bCos = b.rotation.cos;
  const bSin = b.rotation.sin;
  const bScaleX = b.scale.x;
  const bScaleY = b.scale.y;
  const bPosX = b.position.x;
  const bPosY = b.position.y;
  // Step 1: a^-1 into target. `inverseUnchecked` reads all of `a` before
  // writing `target`, so aliasing `out === a` is safe.
  Transform2.inverseUnchecked(a, target);
  // Step 2: target (=== a^-1) · b, writing back to target. Inline the
  // composition so the cached b components remain valid even when target === b.
  const aiCos = target.rotation.cos;
  const aiSin = target.rotation.sin;
  const aiScaleX = target.scale.x;
  const aiScaleY = target.scale.y;
  const aiPosX = target.position.x;
  const aiPosY = target.position.y;
  const scaledX = bPosX * aiScaleX;
  const scaledY = bPosY * aiScaleY;
  Rotation2.multiplyCS(target.rotation, bCos, bSin, target.rotation);
  target.position.set(
   scaledX * aiCos - scaledY * aiSin + aiPosX,
   scaledX * aiSin + scaledY * aiCos + aiPosY,
  );
  target.scale.set(aiScaleX * bScaleX, aiScaleY * bScaleY);
  return target;
 }

 /* ======================================================================== */
 /* Static Transforms                                                        */
 /* ======================================================================== */

 /**
  * Transforms a point by a transform (applies scale, rotation, then translation)
  *
  * @remarks
  * Points are affected by all components: scale, rotation, and translation.
  * Order of operations: Scale → Rotate → Translate.
  *
  * @param transform - Transform to apply
  * @param point - Point to transform
  * @param out - Optional output vector
  * @returns Transformed point
  *
  * @example
  * ```typescript
  * const t = new Transform2({ x: 10, y: 0 }, Math.PI / 2, { x: 2, y: 2 });
  * const p = { x: 1, y: 0 };
  * const result = Transform2.transformPoint(t, p); // (10, 2)
  * ```
  *
  * @category Transform
  * @since 0.7.0
  */
 public static transformPoint(
  transform: ReadonlyTransform2Like,
  point: ReadonlyVector2Like,
  out?: Vector2,
 ): Vector2 {
  const scaledX = point.x * transform.scale.x;
  const scaledY = point.y * transform.scale.y;
  const { cos, sin } = transform.rotation;
  return Vector2.fromValues(
   scaledX * cos - scaledY * sin + transform.position.x,
   scaledX * sin + scaledY * cos + transform.position.y,
   out,
  );
 }

 /**
  * Transforms a point using precomputed cos/sin values
  *
  * @remarks
  * Use this method in hot paths where cos/sin are already computed.
  * Avoids redundant trigonometric calculations in loops.
  *
  * @param transform - Transform to apply (position and scale only)
  * @param point - Point to transform
  * @param cos - Precomputed cosine of rotation
  * @param sin - Precomputed sine of rotation
  * @param out - Optional output vector
  * @returns Transformed point
  *
  * @example
  * ```typescript
  * const { cos, sin } = transform.rotation;
  * for (const point of points) {
  *   Transform2.transformPointCS(transform, point, cos, sin, out);
  * }
  * ```
  *
  * @category Transform
  * @since 0.7.0
  */
 public static transformPointCS(
  transform: ReadonlyTransform2Like,
  point: ReadonlyVector2Like,
  cos: number,
  sin: number,
  out?: Vector2,
 ): Vector2 {
  const scaledX = point.x * transform.scale.x;
  const scaledY = point.y * transform.scale.y;
  return Vector2.fromValues(
   scaledX * cos - scaledY * sin + transform.position.x,
   scaledX * sin + scaledY * cos + transform.position.y,
   out,
  );
 }

 /**
  * Transforms a vector by a transform (applies scale and rotation, no translation)
  *
  * @remarks
  * Vectors are NOT affected by translation (they represent directions, not positions).
  * Only scale and rotation are applied.
  *
  * @param transform - Transform to apply
  * @param vector - Vector to transform
  * @param out - Optional output vector
  * @returns Transformed vector
  *
  * @example
  * ```typescript
  * const t = new Transform2({ x: 10, y: 0 }, Math.PI / 2, { x: 2, y: 2 });
  * const v = { x: 1, y: 0 };
  * const result = Transform2.transformVector(t, v); // (0, 2)
  * ```
  *
  * @category Transform
  * @since 0.7.0
  */
 public static transformVector(
  transform: ReadonlyTransform2Like,
  vector: ReadonlyVector2Like,
  out?: Vector2,
 ): Vector2 {
  const scaledX = vector.x * transform.scale.x;
  const scaledY = vector.y * transform.scale.y;
  const { cos, sin } = transform.rotation;
  return Vector2.fromValues(scaledX * cos - scaledY * sin, scaledX * sin + scaledY * cos, out);
 }

 /**
  * Transforms multiple points efficiently (batch operation)
  *
  * @remarks
  * Hoists the transform scalars out of the loop. Points receive the full
  * `Scale → Rotate → Translate` composition. Existing `out[index]` entries are
  * mutated in place; missing slots are allocated.
  *
  * @param transform - Transform to apply
  * @param points - Array of points to transform
  * @param out - Optional output array (filled / extended as needed)
  * @returns Array of transformed points
  *
  * @category Transform
  * @since 0.7.0
  */
 public static transformPoints(
  transform: ReadonlyTransform2Like,
  points: readonly ReadonlyVector2Like[],
  out: Vector2[] = [],
 ): Vector2[] {
  const { cos, sin } = transform.rotation;
  const sx = transform.scale.x;
  const sy = transform.scale.y;
  const px = transform.position.x;
  const py = transform.position.y;
  for (let index = 0; index < points.length; index++) {
   const p = points[index]!;
   const scaledX = p.x * sx;
   const scaledY = p.y * sy;
   const resultX = scaledX * cos - scaledY * sin + px;
   const resultY = scaledX * sin + scaledY * cos + py;
   if (out[index]) {
    out[index]!.set(resultX, resultY);
   } else {
    out[index] = new Vector2(resultX, resultY);
   }
  }
  return out;
 }

 /**
  * Transforms multiple vectors efficiently (batch operation, no translation)
  *
  * @remarks
  * Hoists the transform scalars out of the loop. Vectors receive
  * `Scale → Rotate` composition only (translation is skipped).
  *
  * @param transform - Transform whose rotation and scale to apply
  * @param vectors - Array of vectors to transform
  * @param out - Optional output array (filled / extended as needed)
  * @returns Array of transformed vectors
  *
  * @category Transform
  * @since 0.7.0
  */
 public static transformVectors(
  transform: ReadonlyTransform2Like,
  vectors: readonly ReadonlyVector2Like[],
  out: Vector2[] = [],
 ): Vector2[] {
  const { cos, sin } = transform.rotation;
  const sx = transform.scale.x;
  const sy = transform.scale.y;
  for (let index = 0; index < vectors.length; index++) {
   const v = vectors[index]!;
   const scaledX = v.x * sx;
   const scaledY = v.y * sy;
   const resultX = scaledX * cos - scaledY * sin;
   const resultY = scaledX * sin + scaledY * cos;
   if (out[index]) {
    out[index]!.set(resultX, resultY);
   } else {
    out[index] = new Vector2(resultX, resultY);
   }
  }
  return out;
 }

 /**
  * Transforms a vector using precomputed cos/sin values
  *
  * @remarks
  * Use this method in hot paths where cos/sin are already computed.
  * Avoids redundant trigonometric calculations in loops.
  *
  * @param transform - Transform to apply (scale only)
  * @param vector - Vector to transform
  * @param cos - Precomputed cosine of rotation
  * @param sin - Precomputed sine of rotation
  * @param out - Optional output vector
  * @returns Transformed vector
  *
  * @category Transform
  * @since 0.7.0
  */
 public static transformVectorCS(
  transform: ReadonlyTransform2Like,
  vector: ReadonlyVector2Like,
  cos: number,
  sin: number,
  out?: Vector2,
 ): Vector2 {
  const scaledX = vector.x * transform.scale.x;
  const scaledY = vector.y * transform.scale.y;
  return Vector2.fromValues(scaledX * cos - scaledY * sin, scaledX * sin + scaledY * cos, out);
 }

 /**
  * Transforms a direction by applying rotation only, ignoring scale and translation
  *
  * @remarks
  * Standard linear algebra operation: extracts and applies the orthogonal
  * (rotational) part of an affine transform. Useful for transforming normals
  * and direction vectors that should not be affected by scale or translation.
  *
  * @param transform - Transform whose rotation to apply
  * @param direction - Direction vector to transform
  * @param out - Optional output vector
  * @returns Rotated direction vector
  *
  * @example
  * ```typescript
  * const t = new Transform2({ x: 10, y: 0 }, Math.PI / 2, { x: 2, y: 2 });
  * const dir = { x: 1, y: 0 };
  * Transform2.transformDirection(t, dir); // (0, 1) — rotation only
  * ```
  *
  * @category Transform
  * @since 0.7.0
  */
 public static transformDirection(
  transform: ReadonlyTransform2Like,
  direction: ReadonlyVector2Like,
  out?: Vector2,
 ): Vector2 {
  const { cos, sin } = transform.rotation;
  return Vector2.rotateCS(direction, cos, sin, out);
 }

 /**
  * Transforms a direction using precomputed cos/sin values
  *
  * @remarks
  * Unlike transformPointCS/transformVectorCS, this method omits the transform
  * parameter because direction transforms only use rotation (cos/sin), not
  * position or scale. Accepting an unused transform parameter would violate
  * the Interface Segregation Principle.
  *
  * @param direction - Direction vector to transform
  * @param cos - Precomputed cosine
  * @param sin - Precomputed sine
  * @param out - Optional output vector
  * @returns Rotated direction vector
  *
  * @category Transform
  * @since 0.7.0
  */
 public static transformDirectionCS(
  direction: ReadonlyVector2Like,
  cos: number,
  sin: number,
  out?: Vector2,
 ): Vector2 {
  return Vector2.rotateCS(direction, cos, sin, out);
 }

 /**
  * Inverse transforms a direction by applying inverse rotation only
  *
  * @remarks
  * Applies the conjugate rotation (negated sin) to the direction.
  * Ignores scale and translation.
  *
  * @param transform - Transform whose inverse rotation to apply
  * @param direction - Direction vector to inverse transform
  * @param out - Optional output vector
  * @returns Inverse-rotated direction vector
  *
  * @category Transform
  * @since 0.7.0
  */
 public static inverseTransformDirection(
  transform: ReadonlyTransform2Like,
  direction: ReadonlyVector2Like,
  out?: Vector2,
 ): Vector2 {
  // Inverse rotation = rotation by negated sine (conjugate of the unit rotation).
  return Vector2.rotateCS(direction, transform.rotation.cos, -transform.rotation.sin, out);
 }

 /**
  * Inverse transforms a direction using precomputed cos/sin values
  *
  * @remarks
  * Unlike transformPointCS/transformVectorCS, this method omits the transform
  * parameter because direction transforms only use rotation (cos/sin), not
  * position or scale. Accepting an unused transform parameter would violate
  * the Interface Segregation Principle.
  *
  * @param direction - Direction vector to inverse transform
  * @param cos - Precomputed cosine of the rotation
  * @param sin - Precomputed sine of the rotation (will be negated internally)
  * @param out - Optional output vector
  * @returns Inverse-rotated direction vector
  *
  * @category Transform
  * @since 0.7.0
  */
 public static inverseTransformDirectionCS(
  direction: ReadonlyVector2Like,
  cos: number,
  sin: number,
  out?: Vector2,
 ): Vector2 {
  // Inverse rotation = rotation by negated sine (conjugate of the unit rotation).
  return Vector2.rotateCS(direction, cos, -sin, out);
 }

 /**
  * Inverse transforms a point
  *
  * @remarks
  * Applies the inverse of the transform: Translate⁻¹ → Rotate⁻¹ → Scale⁻¹.
  * Useful for converting world coordinates to local coordinates.
  *
  * @param transform - Transform to apply inversely
  * @param point - Point to inverse transform
  * @param out - Optional output vector
  * @returns Inverse transformed point
  * @throws {RangeError} If scale.x or scale.y is near zero
  *
  * @example
  * ```typescript
  * const t = new Transform2({ x: 10, y: 0 }, 0, { x: 2, y: 2 });
  * const worldPoint = { x: 12, y: 4 };
  * const local = Transform2.inverseTransformPoint(t, worldPoint); // (1, 2)
  * ```
  *
  * @see {@link inverseTransformPointSafe} - Returns (0,0) instead of throwing
  * @see {@link inverseTransformPointCS} - Unchecked tier: pre-computed cos/sin, no validation
  *
  * @category Transform
  * @since 0.7.0
  */
 public static inverseTransformPoint(
  transform: ReadonlyTransform2Like,
  point: ReadonlyVector2Like,
  out?: Vector2,
 ): Vector2 {
  if (isNearZero(transform.scale.x) || isNearZero(transform.scale.y)) {
   throw new RangeError(
    'Transform2.inverseTransformPoint: cannot inverse transform with near-zero scale',
   );
  }
  const tx = point.x - transform.position.x;
  const ty = point.y - transform.position.y;
  const cos = transform.rotation.cos;
  const sin = -transform.rotation.sin;
  const rotatedX = tx * cos - ty * sin;
  const rotatedY = tx * sin + ty * cos;
  const invScaleX = 1 / transform.scale.x;
  const invScaleY = 1 / transform.scale.y;
  return Vector2.fromValues(rotatedX * invScaleX, rotatedY * invScaleY, out);
 }

 /**
  * Inverse transforms a point, returning (0,0) if scale is near zero
  *
  * @remarks
  * Use when transform may have degenerate scale and you want graceful fallback.
  *
  * @param transform - Transform to apply inversely
  * @param point - Point to inverse transform
  * @param out - Optional output vector
  * @returns Inverse transformed point, or (0,0) if scale is near zero
  *
  * @see {@link inverseTransformPoint} - Throws on near-zero scale
  *
  * @category Transform
  * @since 0.7.0
  */
 public static inverseTransformPointSafe(
  transform: ReadonlyTransform2Like,
  point: ReadonlyVector2Like,
  out?: Vector2,
 ): Vector2 {
  if (isNearZero(transform.scale.x) || isNearZero(transform.scale.y)) {
   return Vector2.fromValues(0, 0, out);
  }
  const tx = point.x - transform.position.x;
  const ty = point.y - transform.position.y;
  const cos = transform.rotation.cos;
  const sin = -transform.rotation.sin;
  const rotatedX = tx * cos - ty * sin;
  const rotatedY = tx * sin + ty * cos;
  const invScaleX = 1 / transform.scale.x;
  const invScaleY = 1 / transform.scale.y;
  return Vector2.fromValues(rotatedX * invScaleX, rotatedY * invScaleY, out);
 }

 /**
  * Inverse transforms a point using precomputed cos/sin values (unchecked)
  *
  * @remarks
  * **Precondition:** `transform.scale.x ≠ 0` and `transform.scale.y ≠ 0`.
  *
  * Use this method in hot paths where cos/sin are already computed.
  *
  * @param transform - Transform to apply inversely (position and scale)
  * @param point - Point to inverse transform
  * @param cos - Precomputed cosine of rotation
  * @param sin - Precomputed sine of rotation
  * @param out - Optional output vector
  * @returns Inverse transformed point
  *
  * @category Transform
  * @since 0.7.0
  */
 public static inverseTransformPointCS(
  transform: ReadonlyTransform2Like,
  point: ReadonlyVector2Like,
  cos: number,
  sin: number,
  out?: Vector2,
 ): Vector2 {
  const tx = point.x - transform.position.x;
  const ty = point.y - transform.position.y;
  // Inverse rotation applied via transposition
  const rotatedX = tx * cos + ty * sin;
  const rotatedY = -tx * sin + ty * cos;
  const invScaleX = 1 / transform.scale.x;
  const invScaleY = 1 / transform.scale.y;
  return Vector2.fromValues(rotatedX * invScaleX, rotatedY * invScaleY, out);
 }

 /**
  * Inverse transforms a vector (ignores translation)
  *
  * @remarks
  * Applies the inverse of the transform's rotation and scale only.
  * Useful for converting world directions to local directions.
  *
  * @param transform - Transform to apply inversely
  * @param vector - Vector to inverse transform
  * @param out - Optional output vector
  * @returns Inverse transformed vector
  * @throws {RangeError} If scale.x or scale.y is near zero
  *
  * @example
  * ```typescript
  * const t = new Transform2({ x: 10, y: 0 }, Math.PI / 2, { x: 2, y: 2 });
  * const worldDir = { x: 0, y: 2 };
  * const local = Transform2.inverseTransformVector(t, worldDir); // (1, 0)
  * ```
  *
  * @see {@link inverseTransformVectorSafe} - Returns (0,0) instead of throwing
  * @see {@link inverseTransformVectorCS} - Unchecked tier: pre-computed cos/sin, no validation
  *
  * @category Transform
  * @since 0.7.0
  */
 public static inverseTransformVector(
  transform: ReadonlyTransform2Like,
  vector: ReadonlyVector2Like,
  out?: Vector2,
 ): Vector2 {
  if (isNearZero(transform.scale.x) || isNearZero(transform.scale.y)) {
   throw new RangeError(
    'Transform2.inverseTransformVector: cannot inverse transform with near-zero scale',
   );
  }
  const cos = transform.rotation.cos;
  const sin = -transform.rotation.sin;
  const rotatedX = vector.x * cos - vector.y * sin;
  const rotatedY = vector.x * sin + vector.y * cos;
  const invScaleX = 1 / transform.scale.x;
  const invScaleY = 1 / transform.scale.y;
  return Vector2.fromValues(rotatedX * invScaleX, rotatedY * invScaleY, out);
 }

 /**
  * Inverse transforms a vector, returning (0,0) if scale is near zero
  * @param transform - Transform to apply inversely
  * @param vector - Vector to inverse transform
  * @param out - Optional output vector
  * @returns Inverse transformed vector, or (0,0) if scale is near zero
  *
  * @see {@link inverseTransformVector} - Throws on near-zero scale
  *
  * @category Transform
  * @since 0.7.0
  */
 public static inverseTransformVectorSafe(
  transform: ReadonlyTransform2Like,
  vector: ReadonlyVector2Like,
  out?: Vector2,
 ): Vector2 {
  if (isNearZero(transform.scale.x) || isNearZero(transform.scale.y)) {
   return Vector2.fromValues(0, 0, out);
  }
  const cos = transform.rotation.cos;
  const sin = -transform.rotation.sin;
  const rotatedX = vector.x * cos - vector.y * sin;
  const rotatedY = vector.x * sin + vector.y * cos;
  const invScaleX = 1 / transform.scale.x;
  const invScaleY = 1 / transform.scale.y;
  return Vector2.fromValues(rotatedX * invScaleX, rotatedY * invScaleY, out);
 }

 /**
  * Inverse transforms a vector using precomputed cos/sin values (unchecked)
  *
  * @remarks
  * **Precondition:** `transform.scale.x ≠ 0` and `transform.scale.y ≠ 0`.
  *
  * Use this method in hot paths where cos/sin are already computed.
  *
  * @param transform - Transform to apply inversely (scale only)
  * @param vector - Vector to inverse transform
  * @param cos - Precomputed cosine of rotation
  * @param sin - Precomputed sine of rotation
  * @param out - Optional output vector
  * @returns Inverse transformed vector
  *
  * @category Transform
  * @since 0.7.0
  */
 public static inverseTransformVectorCS(
  transform: ReadonlyTransform2Like,
  vector: ReadonlyVector2Like,
  cos: number,
  sin: number,
  out?: Vector2,
 ): Vector2 {
  // Inverse rotation applied via transposition
  const rotatedX = vector.x * cos + vector.y * sin;
  const rotatedY = -vector.x * sin + vector.y * cos;
  const invScaleX = 1 / transform.scale.x;
  const invScaleY = 1 / transform.scale.y;
  return Vector2.fromValues(rotatedX * invScaleX, rotatedY * invScaleY, out);
 }

 /* ======================================================================== */
 /* Static Interpolation                                                     */
 /* ======================================================================== */

 /**
  * Linear interpolation between two transforms
  * @param a - Start transform
  * @param b - End transform
  * @param t - Interpolation factor [0, 1], not clamped, allows extrapolation
  * @param out - Optional output transform
  * @returns Interpolated transform
  *
  * @category Interpolation
  * @since 0.7.0
  */
 public static lerp(
  a: ReadonlyTransform2,
  b: ReadonlyTransform2,
  t: number,
  out?: Transform2,
 ): Transform2 {
  const target = Transform2.ensureOut(out);
  target.position.set(lerp(a.position.x, b.position.x, t), lerp(a.position.y, b.position.y, t));
  Rotation2.lerp(a.rotation, b.rotation, t, target.rotation);
  target.scale.set(lerp(a.scale.x, b.scale.x, t), lerp(a.scale.y, b.scale.y, t));
  return target;
 }

 /**
  * Linear interpolation with t clamped to [0, 1]
  * @param a - Start transform
  * @param b - End transform
  * @param t - Interpolation factor (clamped to [0, 1])
  * @param out - Optional output transform
  * @returns Interpolated transform
  *
  * @category Interpolation
  * @since 0.7.0
  */
 public static lerpClamped(
  a: ReadonlyTransform2,
  b: ReadonlyTransform2,
  t: number,
  out?: Transform2,
 ): Transform2 {
  return Transform2.lerp(a, b, saturate(t), out);
 }

 /**
  * Smooth interpolation between two transforms using smoothStep easing
  *
  * @remarks
  * Eases the interpolation factor once via Hermite smoothStep (`smoothStep(0, 1, t)`),
  * then delegates uniformly to {@link Transform2.lerp}: position and scale interpolate
  * linearly and rotation via {@link Rotation2.lerp} on the eased factor.
  *
  * @param a - Source transform
  * @param b - Target transform
  * @param t - Interpolation factor (clamped to [0, 1])
  * @param out - Optional output transform
  * @returns Smoothly interpolated transform
  *
  * @example
  * ```typescript
  * const a = Transform2.IDENTITY;
  * const b = new Transform2({ x: 10, y: 0 }, Math.PI / 2, { x: 2, y: 2 });
  * const smooth = Transform2.smoothStep(a, b, 0.5); // Smooth transition
  * ```
  *
  * @category Interpolation
  * @since 0.7.0
  */
 public static smoothStep(
  a: ReadonlyTransform2,
  b: ReadonlyTransform2,
  t: number,
  out?: Transform2,
 ): Transform2 {
  return Transform2.lerp(a, b, smoothStep(0, 1, t), out);
 }

 /* ======================================================================== */
 /* Static Comparison                                                        */
 /* ======================================================================== */

 /**
  * Exact equality (bit-identical)
  *
  * @remarks
  * Use {@link nearEquals} for comparing results of floating-point operations.
  *
  * @param a - First transform
  * @param b - Second transform
  * @returns True if exactly identical
  *
  * @category Comparison
  * @since 0.7.0
  */
 public static exactEquals(a: ReadonlyTransform2, b: ReadonlyTransform2): boolean {
  return (
   a.position.exactEquals(b.position) &&
   a.rotation.exactEquals(b.rotation) &&
   a.scale.exactEquals(b.scale)
  );
 }

 /**
  * Approximate equality using relative tolerance for position and scale
  *
  * @remarks
  * Position and scale use relative tolerance. Rotation uses absolute tolerance
  * since angles are bounded to a fixed range.
  *
  * @param a - First transform
  * @param b - Second transform
  * @param epsilon - Tolerance. @defaultValue `EPSILON`
  * @returns True if within epsilon
  *
  * @category Comparison
  * @since 0.7.0
  */
 public static nearEquals(
  a: ReadonlyTransform2,
  b: ReadonlyTransform2,
  epsilon: number = EPSILON,
 ): boolean {
  return (
   a.position.nearEquals(b.position, epsilon) &&
   Rotation2.nearEquals(a.rotation, b.rotation, epsilon) &&
   a.scale.nearEquals(b.scale, epsilon)
  );
 }

 /**
  * Tests if a transform is the identity
  *
  * @remarks
  * Uses {@link EPSILON} (1e-10) as default tolerance. Checks position ≈ (0,0),
  * rotation ≈ identity, and scale ≈ (1,1).
  *
  * @param transform - Transform to test
  * @param epsilon - Tolerance (default: EPSILON)
  * @returns True if identity
  *
  * @category Comparison
  * @since 0.7.0
  */
 public static isIdentity(transform: ReadonlyTransform2, epsilon: number = EPSILON): boolean {
  return (
   transform.position.isNearZero(epsilon) &&
   Rotation2.nearEquals(transform.rotation, Rotation2.IDENTITY, epsilon) &&
   scalarNearEquals(transform.scale.x, 1, epsilon) &&
   scalarNearEquals(transform.scale.y, 1, epsilon)
  );
 }

 /**
  * Tests if both position and scale components are finite
  * @param transform - Transform to test
  * @returns True if all components are finite
  *
  * @category Comparison
  * @since 0.7.0
  */
 public static isFinite(transform: ReadonlyTransform2): boolean {
  return (
   transform.position.isFinite() &&
   Rotation2.isFinite(transform.rotation) &&
   transform.scale.isFinite()
  );
 }

 /**
  * Tests if any component is NaN
  * @param transform - Transform to test
  * @returns True if any component is NaN
  *
  * @category Comparison
  * @since 0.7.0
  */
 public static hasNaN(transform: ReadonlyTransform2): boolean {
  return (
   transform.position.hasNaN() || Rotation2.hasNaN(transform.rotation) || transform.scale.hasNaN()
  );
 }

 /**
  * Tests if any component is infinite (±Infinity)
  *
  * @remarks
  * Distinguishes infinity from NaN. Use {@link isFinite} to check for both.
  *
  * @param transform - Transform to test
  * @returns True if any component is ±Infinity
  *
  * @category Comparison
  * @since 0.7.0
  */
 public static hasInfinity(transform: ReadonlyTransform2): boolean {
  return (
   transform.position.hasInfinity() ||
   Rotation2.hasInfinity(transform.rotation) ||
   transform.scale.hasInfinity()
  );
 }

 /**
  * Tests if transform is invertible (has non-zero scale)
  *
  * @remarks
  * A transform is invertible when both scale components are non-zero.
  * Uses {@link EPSILON} tolerance for the near-zero check.
  *
  * @param transform - Transform to test
  * @param epsilon - Tolerance. @defaultValue `EPSILON`
  * @returns True if transform can be inverted
  *
  * @category Comparison
  * @since 0.7.0
  */
 public static isInvertible(transform: ReadonlyTransform2, epsilon: number = EPSILON): boolean {
  return !isNearZero(transform.scale.x, epsilon) && !isNearZero(transform.scale.y, epsilon);
 }

 /**
  * Tests if transform has uniform scale
  *
  * @remarks
  * Uses relative tolerance for comparing scale components.
  *
  * @param transform - Transform to test
  * @param epsilon - Tolerance for comparison
  * @returns True if scale.x ≈ scale.y
  *
  * @example
  * ```typescript
  * Transform2.hasUniformScale({ position: ..., rotation: 0, scale: { x: 2, y: 2 } }); // true
  * Transform2.hasUniformScale({ position: ..., rotation: 0, scale: { x: 2, y: 3 } }); // false
  * ```
  *
  * @category Comparison
  * @since 0.7.0
  */
 public static hasUniformScale(
  transform: ReadonlyTransform2Like,
  epsilon: number = EPSILON,
 ): boolean {
  return relativeEquals(transform.scale.x, transform.scale.y, epsilon);
 }

 /**
  * Tests if transform has negative scale components
  * @param transform - Transform to test
  * @returns True if any scale component is negative
  *
  * @example
  * ```typescript
  * Transform2.hasNegativeScale({ position: ..., rotation: 0, scale: { x: -1, y: 1 } }); // true
  * Transform2.hasNegativeScale({ position: ..., rotation: 0, scale: { x: 1, y: 1 } });  // false
  * ```
  *
  * @category Comparison
  * @since 0.7.0
  */
 public static hasNegativeScale(transform: ReadonlyTransform2Like): boolean {
  return transform.scale.x < 0 || transform.scale.y < 0;
 }

 /**
  * Returns the determinant (scale.x * scale.y)
  * @param transform - Transform to compute determinant for
  * @returns Determinant of the transform
  *
  * @example
  * ```typescript
  * Transform2.determinant({ position: ..., rotation: 0, scale: { x: 2, y: 3 } }); // 6
  * ```
  *
  * @category Computed
  * @since 0.7.0
  */
 public static determinant(transform: ReadonlyTransform2Like): number {
  return transform.scale.x * transform.scale.y;
 }

 /* ======================================================================== */
 /* Instance Mutators                                                        */
 /* ======================================================================== */

 /**
  * Sets all transform components
  * @param position - Position vector
  * @param rotation - Rotation in radians
  * @param scale - Scale (vector or uniform scalar)
  * @returns This for chaining
  *
  * @category Mutator
  * @since 0.7.0
  */
 set(position: ReadonlyVector2Like, rotation: number, scale: ReadonlyVector2Like | number): this {
  this.position.set(position.x, position.y);
  this.rotation.setAngle(rotation);
  if (typeof scale === 'number') {
   this.scale.set(scale, scale);
  } else {
   this.scale.set(scale.x, scale.y);
  }
  return this;
 }

 /**
  * Copies values from another transform
  * @param other - Source transform
  * @returns This for chaining
  *
  * @category Mutator
  * @since 0.7.0
  */
 copy(other: ReadonlyTransform2): this {
  this.position.copy(other.position);
  this.rotation.copy(other.rotation);
  this.scale.copy(other.scale);
  return this;
 }

 /**
  * Resets to identity transform
  * @returns This for chaining
  *
  * @category Mutator
  * @since 0.7.0
  */
 identity(): this {
  this.position.set(0, 0);
  this.rotation.identity();
  this.scale.set(1, 1);
  return this;
 }

 /* ======================================================================== */
 /* Instance Computed                                                        */
 /* ======================================================================== */

 /* ------ Comparison ------ */

 /**
  * Tests if scale is uniform (x equals y)
  *
  * @remarks
  * Uses relative tolerance for comparing scale components.
  *
  * @param epsilon - Relative tolerance (default: EPSILON)
  * @returns True if uniform scale
  *
  * @category Comparison
  * @since 0.7.0
  */
 hasUniformScale(epsilon: number = EPSILON): boolean {
  return relativeEquals(this.scale.x, this.scale.y, epsilon);
 }

 /**
  * Tests if scale has negative components
  * @returns True if any scale component is negative
  *
  * @category Comparison
  * @since 0.7.0
  */
 hasNegativeScale(): boolean {
  return this.scale.x < 0 || this.scale.y < 0;
 }

 /**
  * Returns the determinant (scale.x * scale.y)
  * @returns Determinant value
  *
  * @category Computed
  * @since 0.7.0
  */
 determinant(): number {
  return this.scale.x * this.scale.y;
 }

 /* ======================================================================== */
 /* Instance Conversion (Matrix)                                             */
 /* ======================================================================== */

 /**
  * Converts this transform to a 3x3 matrix
  * @param out - Optional output matrix
  * @returns Matrix3 representation
  *
  * @category Conversion
  * @since 0.7.0
  */
 public toMatrix3(out?: Matrix3): Matrix3 {
  return Matrix3.fromTransform2Like(this, out);
 }

 /**
  * Converts this transform's rotation to a Rotation2
  *
  * @remarks
  * Useful for extracting the rotation component for reuse in hot paths,
  * avoiding repeated `sinCos()` calls.
  *
  * @param out - Optional output rotation
  * @returns Rotation2 representation of the transform's angle
  *
  * @example
  * ```typescript
  * const rot = transform.toRotation2();
  * // Reuse rot.cos, rot.sin for multiple operations
  * Vector2.rotateCS(v1, rot.cos, rot.sin, out1);
  * Vector2.rotateCS(v2, rot.cos, rot.sin, out2);
  * ```
  *
  * @category Conversion
  * @since 0.7.0
  */
 public toRotation2(out?: Rotation2): Rotation2 {
  return Rotation2.clone(this.rotation, out);
 }

 /* ------ Mutator ------ */

 /**
  * Sets this transform from a 3x3 matrix
  * @param matrix - Source Matrix3
  * @returns This for chaining
  *
  * @category Mutator
  * @since 0.7.0
  */
 setFromMatrix3(matrix: ReadonlyMatrix3): this {
  Transform2.fromMatrix3(matrix, this);
  return this;
 }

 /* ======================================================================== */
 /* Instance Transforms                                                      */
 /* ======================================================================== */

 /**
  * Transforms a point by applying scale, rotation, and translation
  * @param point - Point to transform
  * @param out - Optional output vector
  * @returns Transformed point
  *
  * @category Transform
  * @since 0.7.0
  */
 transformPoint(point: ReadonlyVector2Like, out?: Vector2): Vector2 {
  const scaledX = point.x * this.scale.x;
  const scaledY = point.y * this.scale.y;
  const { cos, sin } = this.rotation;
  return Vector2.fromValues(
   scaledX * cos - scaledY * sin + this.position.x,
   scaledX * sin + scaledY * cos + this.position.y,
   out,
  );
 }

 /**
  * Transforms a point using precomputed cos/sin values
  * @param point - Point to transform
  * @param cos - Precomputed cosine of rotation
  * @param sin - Precomputed sine of rotation
  * @param out - Optional output vector
  * @returns Transformed point
  *
  * @category Transform
  * @since 0.7.0
  */
 transformPointCS(point: ReadonlyVector2Like, cos: number, sin: number, out?: Vector2): Vector2 {
  return Transform2.transformPointCS(this, point, cos, sin, out);
 }

 /**
  * Transforms a vector (ignores translation)
  * @param vector - Vector to transform
  * @param out - Optional output vector
  * @returns Transformed vector
  *
  * @category Transform
  * @since 0.7.0
  */
 transformVector(vector: ReadonlyVector2Like, out?: Vector2): Vector2 {
  const scaledX = vector.x * this.scale.x;
  const scaledY = vector.y * this.scale.y;
  const { cos, sin } = this.rotation;
  return Vector2.fromValues(scaledX * cos - scaledY * sin, scaledX * sin + scaledY * cos, out);
 }

 /**
  * Transforms a vector using precomputed cos/sin values
  * @param vector - Vector to transform
  * @param cos - Precomputed cosine of rotation
  * @param sin - Precomputed sine of rotation
  * @param out - Optional output vector
  * @returns Transformed vector
  *
  * @category Transform
  * @since 0.7.0
  */
 transformVectorCS(vector: ReadonlyVector2Like, cos: number, sin: number, out?: Vector2): Vector2 {
  return Transform2.transformVectorCS(this, vector, cos, sin, out);
 }

 /**
  * Transforms a direction by applying rotation only, ignoring scale and translation
  * @param direction - Direction vector to transform
  * @param out - Optional output vector
  * @returns Rotated direction vector
  *
  * @category Transform
  * @since 0.7.0
  */
 transformDirection(direction: ReadonlyVector2Like, out?: Vector2): Vector2 {
  return Transform2.transformDirection(this, direction, out);
 }

 /**
  * Transforms a direction using precomputed cos/sin values
  *
  * @remarks
  * Unlike {@link transformPointCS} and {@link transformVectorCS} which take
  * `(data, cos, sin, out)`, this method takes `(cos, sin, data, out)` because
  * direction transforms only use rotation, not position or scale.
  *
  * @param direction - Direction vector to transform
  * @param cos - Precomputed cosine
  * @param sin - Precomputed sine
  * @param out - Optional output vector
  * @returns Rotated direction vector
  *
  * @see {@link transformPointCS} - Point transform with (point, cos, sin, out) order
  * @see {@link transformVectorCS} - Vector transform with (vector, cos, sin, out) order
  *
  * @category Transform
  * @since 0.7.0
  */
 transformDirectionCS(
  direction: ReadonlyVector2Like,
  cos: number,
  sin: number,
  out?: Vector2,
 ): Vector2 {
  return Transform2.transformDirectionCS(direction, cos, sin, out);
 }

 /**
  * Inverse transforms a direction by applying inverse rotation only
  * @param direction - Direction vector to inverse transform
  * @param out - Optional output vector
  * @returns Inverse-rotated direction vector
  *
  * @category Transform
  * @since 0.7.0
  */
 inverseTransformDirection(direction: ReadonlyVector2Like, out?: Vector2): Vector2 {
  return Transform2.inverseTransformDirection(this, direction, out);
 }

 /**
  * Inverse transforms a direction using precomputed cos/sin values
  *
  * @remarks
  * Canonical `*CS` parameter order: `(subject, cos, sin, out?)`.
  *
  * @param direction - Direction vector to inverse transform
  * @param cos - Precomputed cosine
  * @param sin - Precomputed sine
  * @param out - Optional output vector
  * @returns Inverse-rotated direction vector
  *
  * @see {@link inverseTransformPointCS} - Point inverse transform
  * @see {@link inverseTransformVectorCS} - Vector inverse transform
  *
  * @category Transform
  * @since 0.7.0
  */
 inverseTransformDirectionCS(
  direction: ReadonlyVector2Like,
  cos: number,
  sin: number,
  out?: Vector2,
 ): Vector2 {
  return Transform2.inverseTransformDirectionCS(direction, cos, sin, out);
 }

 /**
  * Inverse transforms a point
  * @param point - Point to inverse transform
  * @param out - Optional output vector
  * @returns Inverse transformed point
  * @throws {RangeError} If transform is not invertible
  *
  * @category Transform
  * @since 0.7.0
  */
 inverseTransformPoint(point: ReadonlyVector2Like, out?: Vector2): Vector2 {
  return Transform2.inverseTransformPoint(this, point, out);
 }

 /**
  * Inverse transforms a point, returning (0, 0) if non-invertible
  * @param point - Point to inverse transform
  * @param out - Optional output vector
  * @returns Inverse transformed point, or (0, 0) if non-invertible
  *
  * @see {@link inverseTransformPoint} - Throws on non-invertible
  *
  * @category Transform
  * @since 0.7.0
  */
 inverseTransformPointSafe(point: ReadonlyVector2Like, out?: Vector2): Vector2 {
  return Transform2.inverseTransformPointSafe(this, point, out);
 }

 /**
  * Inverse transforms a point using precomputed cos/sin values
  * @param point - Point to inverse transform
  * @param cos - Precomputed cosine of rotation
  * @param sin - Precomputed sine of rotation
  * @param out - Optional output vector
  * @returns Inverse transformed point
  *
  * @category Transform
  * @since 0.7.0
  */
 inverseTransformPointCS(
  point: ReadonlyVector2Like,
  cos: number,
  sin: number,
  out?: Vector2,
 ): Vector2 {
  return Transform2.inverseTransformPointCS(this, point, cos, sin, out);
 }

 /**
  * Inverse transforms a vector (ignores translation)
  *
  * @remarks
  * Applies the inverse of the transform's rotation and scale only.
  * Useful for converting world directions to local directions.
  *
  * @param vector - Vector to inverse transform
  * @param out - Optional output vector
  * @returns Inverse transformed vector
  * @throws {RangeError} If transform is not invertible
  *
  * @category Transform
  * @since 0.7.0
  */
 inverseTransformVector(vector: ReadonlyVector2Like, out?: Vector2): Vector2 {
  return Transform2.inverseTransformVector(this, vector, out);
 }

 /**
  * Inverse transforms a vector, returning (0, 0) if non-invertible
  * @param vector - Vector to inverse transform
  * @param out - Optional output vector
  * @returns Inverse transformed vector, or (0, 0) if non-invertible
  *
  * @see {@link inverseTransformVector} - Throws on non-invertible
  *
  * @category Transform
  * @since 0.7.0
  */
 inverseTransformVectorSafe(vector: ReadonlyVector2Like, out?: Vector2): Vector2 {
  return Transform2.inverseTransformVectorSafe(this, vector, out);
 }

 /**
  * Inverse transforms a vector using precomputed cos/sin values
  * @param vector - Vector to inverse transform
  * @param cos - Precomputed cosine of rotation
  * @param sin - Precomputed sine of rotation
  * @param out - Optional output vector
  * @returns Inverse transformed vector
  *
  * @category Transform
  * @since 0.7.0
  */
 inverseTransformVectorCS(
  vector: ReadonlyVector2Like,
  cos: number,
  sin: number,
  out?: Vector2,
 ): Vector2 {
  return Transform2.inverseTransformVectorCS(this, vector, cos, sin, out);
 }

 /**
  * Transforms multiple points efficiently (batch operation)
  * Calculates sin/cos once and applies to all points.
  *
  * @remarks
  * More efficient than calling transformPoint multiple times because
  * sin/cos are calculated only once. Internally uses the same math as
  * {@link transformPoint}.
  *
  * @param points - Array of points to transform
  * @param out - Optional output array (will be filled/extended as needed)
  * @returns Array of transformed points
  *
  * @example
  * ```typescript
  * const vertices = [new Vector2(0, 0), new Vector2(1, 0), new Vector2(1, 1)];
  * const worldVertices = transform.transformPoints(vertices);
  * ```
  *
  * @category Transform
  * @since 0.7.0
  */
 transformPoints(points: readonly ReadonlyVector2Like[], out: Vector2[] = []): Vector2[] {
  const { cos, sin } = this.rotation;
  const { x: sx, y: sy } = this.scale;
  const { x: px, y: py } = this.position;

  for (let index = 0; index < points.length; index++) {
   const p = points[index]!;
   const scaledX = p.x * sx;
   const scaledY = p.y * sy;
   const resultX = scaledX * cos - scaledY * sin + px;
   const resultY = scaledX * sin + scaledY * cos + py;

   if (out[index]) {
    out[index]!.set(resultX, resultY);
   } else {
    out[index] = new Vector2(resultX, resultY);
   }
  }

  return out;
 }

 /**
  * Transforms multiple vectors efficiently (batch operation)
  * Calculates sin/cos once and applies to all vectors.
  *
  * @remarks
  * Unlike points, vectors are not affected by translation.
  * More efficient than calling transformVector multiple times.
  *
  * @param vectors - Array of vectors to transform
  * @param out - Optional output array (will be filled/extended as needed)
  * @returns Array of transformed vectors
  *
  * @category Transform
  * @since 0.7.0
  */
 transformVectors(vectors: readonly ReadonlyVector2Like[], out: Vector2[] = []): Vector2[] {
  const { cos, sin } = this.rotation;
  const { x: sx, y: sy } = this.scale;

  for (let index = 0; index < vectors.length; index++) {
   const v = vectors[index]!;
   const scaledX = v.x * sx;
   const scaledY = v.y * sy;
   const resultX = scaledX * cos - scaledY * sin;
   const resultY = scaledX * sin + scaledY * cos;

   if (out[index]) {
    out[index]!.set(resultX, resultY);
   } else {
    out[index] = new Vector2(resultX, resultY);
   }
  }

  return out;
 }

 /* ======================================================================== */
 /* Instance Arithmetic                                                      */
 /* ======================================================================== */

 /**
  * Multiplies with another transform (composition) in place
  * @param other - Transform to multiply by
  * @returns This for chaining
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 multiply(other: ReadonlyTransform2): this {
  // Inline rotation multiply to avoid temp Rotation2 allocation
  const thisCos = this.rotation.cos;
  const thisSin = this.rotation.sin;
  const newCos = thisCos * other.rotation.cos - thisSin * other.rotation.sin;
  const newSin = thisSin * other.rotation.cos + thisCos * other.rotation.sin;

  const newScaleX = this.scale.x * other.scale.x;
  const newScaleY = this.scale.y * other.scale.y;

  // Transform the other's position by this transform
  const scaledX = other.position.x * this.scale.x;
  const scaledY = other.position.y * this.scale.y;
  const newPosX = scaledX * thisCos - scaledY * thisSin + this.position.x;
  const newPosY = scaledX * thisSin + scaledY * thisCos + this.position.y;

  this.rotation.cos = newCos;
  this.rotation.sin = newSin;
  this.scale.set(newScaleX, newScaleY);
  this.position.set(newPosX, newPosY);
  return this;
 }

 /**
  * Premultiplies this transform by another: `this = other × this`
  *
  * @remarks
  * Since transform composition is non-commutative, both multiplication orders
  * are required for algebraic completeness. {@link multiply} computes
  * `this = this × other`, while `premultiply` computes `this = other × this`.
  *
  * Delegates to the aliasing-safe static {@link Transform2.multiply} with
  * `out === this`. No temporary allocation.
  *
  * @param other - Transform to premultiply by
  * @returns This for chaining
  *
  * @see {@link multiply} - Computes `this = this × other`
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 premultiply(other: ReadonlyTransform2): this {
  Transform2.multiply(other, this, this);
  return this;
 }

 /**
  * Adds `(dx, dy)` to the position in place
  *
  * @param dx - X offset
  * @param dy - Y offset
  * @returns This for chaining
  *
  * @category Transform
  * @since 0.7.0
  */
 translate(dx: number, dy: number): this {
  this.position.set(this.position.x + dx, this.position.y + dy);
  return this;
 }

 /**
  * Composes an additional rotation in place
  *
  * @param angle - Additional rotation in radians
  * @returns This for chaining
  *
  * @category Transform
  * @since 0.7.0
  */
 rotate(angle: number): this {
  const { cos, sin } = sinCos(angle);
  Rotation2.multiplyCS(this.rotation, cos, sin, this.rotation);
  return this;
 }

 /**
  * Scales this transform in place
  *
  * @param sxOrV - Uniform scalar, or non-uniform scale x-component, or scale vector
  * @param sy - Optional y-component when `sxOrV` is a scalar. @defaultValue `sxOrV`
  * @returns This for chaining
  *
  * @category Transform
  * @since 0.7.0
  */
 scaleBy(sxOrV: number | ReadonlyVector2Like, sy?: number): this {
  const fx = typeof sxOrV === 'number' ? sxOrV : sxOrV.x;
  const fy = typeof sxOrV === 'number' ? (sy ?? sxOrV) : sxOrV.y;
  this.scale.set(this.scale.x * fx, this.scale.y * fy);
  return this;
 }

 /**
  * Inverts this transform in place
  *
  * @remarks
  * **Non-uniform scale warning:** See static {@link Transform2.inverse} for
  * details on SRT approximation.
  *
  * @returns This for chaining
  * @throws {RangeError} If scale.x or scale.y is near zero
  *
  * @see {@link inverseSafe} - Sets to identity instead of throwing
  * @see {@link inverseUnchecked} - No validation, for hot paths
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 inverse(): this {
  if (isNearZero(this.scale.x) || isNearZero(this.scale.y)) {
   throw new RangeError(
    'Transform2.inverse: cannot invert transform with near-zero scale (non-invertible)',
   );
  }
  return this.inverseUnchecked();
 }

 /**
  * Inverts this transform in place, setting to identity if non-invertible
  * @returns This for chaining
  *
  * @see {@link inverse} - Throws on non-invertible transform
  * @category Arithmetic
  * @since 0.7.0
  */
 inverseSafe(): this {
  if (isNearZero(this.scale.x) || isNearZero(this.scale.y)) {
   this.position.set(0, 0);
   this.rotation.identity();
   this.scale.set(1, 1);
   return this;
  }
  return this.inverseUnchecked();
 }

 /**
  * Inverts this transform in place without validation
  *
  * @remarks
  * **Precondition:** `scale.x ≠ 0` and `scale.y ≠ 0`.
  *
  * @returns This for chaining
  *
  * @see {@link inverse} - Throws on non-invertible transform
  * @see {@link inverseSafe} - Sets to identity instead of throwing
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 inverseUnchecked(): this {
  const invScaleX = 1 / this.scale.x;
  const invScaleY = 1 / this.scale.y;
  // Inline rotation inverse: conjugate (cos, -sin) — avoids Rotation2 allocation
  const cos = this.rotation.cos;
  const sin = -this.rotation.sin;

  // Position: -(S⁻¹ · R⁻¹ · t) — apply inverse rotation first, then inverse scale
  const rotPosX = this.position.x * cos - this.position.y * sin;
  const rotPosY = this.position.x * sin + this.position.y * cos;
  const invPosX = -(rotPosX * invScaleX);
  const invPosY = -(rotPosY * invScaleY);

  this.rotation.cos = cos;
  this.rotation.sin = sin;
  this.scale.set(invScaleX, invScaleY);
  this.position.set(invPosX, invPosY);
  return this;
 }

 /**
  * Replaces this with the relative transform `this⁻¹ · other`
  *
  * @remarks
  * Mutates in place. "Relative to" means: express `other` in the frame of `this`.
  *
  * @param other - Target transform
  * @returns This for chaining
  * @throws {RangeError} If `this` has near-zero scale
  *
  * @see {@link relativeFrom} - Inverse direction (`other⁻¹ · this`)
  * @see {@link Transform2.relative} - Static variant
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 relativeTo(other: ReadonlyTransform2): this {
  Transform2.relative(this, other, this);
  return this;
 }

 /**
  * Replaces this with the relative transform `other⁻¹ · this`
  *
  * @remarks
  * Mutates in place. "Relative from" means: express `this` in the frame of `other`.
  *
  * @param other - Base transform
  * @returns This for chaining
  * @throws {RangeError} If `other` has near-zero scale
  *
  * @see {@link relativeTo} - Inverse direction (`this⁻¹ · other`)
  * @see {@link Transform2.relative} - Static variant
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 relativeFrom(other: ReadonlyTransform2): this {
  Transform2.relative(other, this, this);
  return this;
 }

 /* ======================================================================== */
 /* Instance Comparison                                                      */
 /* ======================================================================== */

 /**
  * Exact equality (bit-identical)
  *
  * @remarks
  * Use {@link nearEquals} for comparing results of floating-point operations.
  *
  * @param other - Transform to compare
  * @returns True if exactly identical
  *
  * @category Comparison
  * @since 0.7.0
  */
 exactEquals(other: ReadonlyTransform2): boolean {
  return Transform2.exactEquals(this, other);
 }

 /**
  * Approximate equality using relative tolerance for position and scale
  *
  * @remarks
  * Position and scale use relative tolerance. Rotation uses absolute tolerance
  * since angles are bounded to a fixed range.
  *
  * @param other - Transform to compare
  * @param epsilon - Tolerance. @defaultValue `EPSILON`
  * @returns True if within epsilon
  *
  * @category Comparison
  * @since 0.7.0
  */
 nearEquals(other: ReadonlyTransform2, epsilon: number = EPSILON): boolean {
  return Transform2.nearEquals(this, other, epsilon);
 }

 /**
  * Returns true if all components are finite
  * @returns True if no NaN or Infinity values
  *
  * @category Comparison
  * @since 0.7.0
  */
 isFinite(): boolean {
  return Transform2.isFinite(this);
 }

 /**
  * Returns true if any component is NaN
  * @returns True if any NaN value exists
  *
  * @category Comparison
  * @since 0.7.0
  */
 hasNaN(): boolean {
  return Transform2.hasNaN(this);
 }

 /**
  * Returns true if any component is infinite (±Infinity)
  * @returns True if any ±Infinity value exists
  *
  * @category Comparison
  * @since 0.7.0
  */
 hasInfinity(): boolean {
  return Transform2.hasInfinity(this);
 }

 /**
  * Tests if this transform is invertible
  * @param epsilon - Tolerance (default: EPSILON)
  * @returns True if transform can be inverted (non-zero scale)
  *
  * @category Comparison
  * @since 0.7.0
  */
 isInvertible(epsilon: number = EPSILON): boolean {
  return Transform2.isInvertible(this, epsilon);
 }

 /**
  * Tests if this transform is identity
  * @param epsilon - Tolerance (default: EPSILON)
  * @returns True if identity
  *
  * @category Comparison
  * @since 0.7.0
  */
 isIdentity(epsilon: number = EPSILON): boolean {
  return Transform2.isIdentity(this, epsilon);
 }

 /* ======================================================================== */
 /* Instance Accessors                                                       */
 /* ======================================================================== */

 /**
  * Returns the inverse transform without modifying this instance
  *
  * @remarks
  * Delegates to {@link Transform2.inverseSafe}. Accessors cannot propagate `throw`
  * safely through property access, so this getter routes through the Safe tier,
  * which returns `Transform2.IDENTITY` for singular inputs (scale with an
  * exact-zero component). Callers that need strict throw-on-singular semantics
  * should call the static {@link Transform2.inverse} directly.
  *
  * @returns New inverse transform (identity fallback if singular)
  *
  * @see {@link Transform2.inverse} - strict static variant (throws on singular)
  * @see {@link Transform2.inverseSafe} - Safe static variant (returns identity fallback)
  *
  * @category Accessor
  * @since 0.7.0
  */
 public get inverted(): Transform2 {
  return Transform2.inverseSafe(this);
 }

 /**
  * Returns the rotation as a unit Vector2 (direction)
  *
  * @returns Direction vector
  *
  * @category Accessor
  * @since 0.7.0
  */
 public get direction(): Vector2 {
  return this.rotation.toVector2();
 }

 /**
  * Returns the rotation in degrees
  *
  * @returns Rotation in degrees
  *
  * @category Accessor
  * @since 0.7.0
  */
 public get rotationDegrees(): number {
  return this.rotation.angleDegrees;
 }

 /* ======================================================================== */
 /* Instance Interpolation                                                   */
 /* ======================================================================== */

 /**
  * Linear interpolation towards another transform in place
  * @param other - Target transform
  * @param t - Interpolation factor (not clamped, allows extrapolation)
  * @returns This for chaining
  *
  * @category Interpolation
  * @since 0.7.0
  */
 lerp(other: ReadonlyTransform2, t: number): this {
  this.position.set(
   lerp(this.position.x, other.position.x, t),
   lerp(this.position.y, other.position.y, t),
  );
  Rotation2.lerp(this.rotation, other.rotation, t, this.rotation);
  this.scale.set(lerp(this.scale.x, other.scale.x, t), lerp(this.scale.y, other.scale.y, t));
  return this;
 }

 /**
  * Linear interpolation with t clamped to [0, 1]
  * @param other - Target transform
  * @param t - Interpolation factor (clamped to [0, 1])
  * @returns This for chaining
  *
  * @category Interpolation
  * @since 0.7.0
  */
 lerpClamped(other: ReadonlyTransform2, t: number): this {
  return this.lerp(other, saturate(t));
 }

 /**
  * Smooth interpolation with another transform in place
  *
  * @remarks
  * Uses Hermite smoothStep for ease-in-out effect.
  *
  * @param other - Target transform
  * @param t - Interpolation factor (clamped to [0, 1])
  * @returns This for chaining
  *
  * @category Interpolation
  * @since 0.7.0
  */
 smoothStep(other: ReadonlyTransform2, t: number): this {
  return this.lerp(other, smoothStep(0, 1, t));
 }

 /* ======================================================================== */
 /* Instance Conversion                                                      */
 /* ======================================================================== */

 /**
  * Converts the transform to a plain object
  * @returns Object with position, rotation, and scale properties
  *
  * @example
  * ```typescript
  * const t = Transform2.fromValues(100, 50, Math.PI / 4, 2, 2);
  * const obj = t.toObject();
  * // {
  * //   position: { x: 100, y: 50 },
  * //   rotation: { cos: 0.707..., sin: 0.707... },
  * //   scale: { x: 2, y: 2 }
  * // }
  * ```
  *
  * @category Conversion
  * @since 0.7.0
  */
 public toObject(): Transform2Like {
  return {
   position: this.position.toObject(),
   rotation: this.rotation.toObject(),
   scale: this.scale.toObject(),
  };
 }

 /**
  * Converts the transform to a flat array [px, py, rotation, sx, sy]
  * @param out - Optional output array
  * @param offset - Write offset. @defaultValue `0`
  * @returns Array with transform values
  * @throws {RangeError} If offset is out of bounds
  *
  * @example
  * ```typescript
  * const t = new Transform2({ x: 100, y: 50 }, Math.PI / 4, { x: 2, y: 2 });
  * const arr = t.toArray();
  * // [100, 50, 0.785..., 2, 2]
  * ```
  *
  * @category Conversion
  * @since 0.7.0
  */
 public toArray<T extends ArrayLike<number> & { [index: number]: number }>(
  out?: T,
  offset = 0,
 ): T | [number, number, number, number, number] {
  if (!out) {
   return [
    this.position.x,
    this.position.y,
    Rotation2.angle(this.rotation),
    this.scale.x,
    this.scale.y,
   ];
  }
  if (offset < 0 || offset + 5 > out.length) {
   throw new RangeError(
    `Transform2.toArray: offset ${offset} out of bounds for array length ${out.length}`,
   );
  }
  out[offset] = this.position.x;
  out[offset + 1] = this.position.y;
  out[offset + 2] = Rotation2.angle(this.rotation);
  out[offset + 3] = this.scale.x;
  out[offset + 4] = this.scale.y;
  return out;
 }

 /**
  * Converts the transform to a JSON-serializable object
  * Called automatically by JSON.stringify().
  * @returns Object suitable for JSON serialization
  *
  * @example
  * ```typescript
  * const t = new Transform2();
  * t.position.set(100, 50);
  * const json = JSON.stringify(t);
  * // '{"position":{"x":100,"y":50},"rotation":{"cos":1,"sin":0},"scale":{"x":1,"y":1}}'
  * ```
  *
  * @category Conversion
  * @since 0.7.0
  */
 public toJSON(): Transform2Like {
  return this.toObject();
 }

 /**
  * Creates a human-readable string representation
  * Shows position, rotation (in degrees), and scale.
  * @param precision - Number of decimal places (default: 4)
  * @returns Formatted string
  *
  * @example
  * ```typescript
  * const t = Transform2.fromPose(100, 50, Math.PI / 4);
  * console.log(t.toString());
  * // "Transform2(pos: (100.0000, 50.0000), rot: 45.0000°, scale: (1.0000, 1.0000))"
  * ```
  *
  * @category Conversion
  * @since 0.7.0
  */
 public toString(precision = 4): string {
  const p = (value: number) => value.toFixed(precision);
  const degrees = Rotation2.angle(this.rotation) * RAD_TO_DEG;
  return `Transform2(pos: (${p(this.position.x)}, ${p(this.position.y)}), rot: ${p(degrees)}°, scale: (${p(this.scale.x)}, ${p(this.scale.y)}))`;
 }

 /**
  * Iterator yielding the 6 numeric components of this transform
  *
  * @remarks
  * Yields components in the order: `[position.x, position.y, rotation.cos, rotation.sin, scale.x, scale.y]`.
  *
  * **Note:** These components represent semantically heterogeneous quantities
  * (position, rotation, scale). This iterator is primarily useful for serialization
  * and array-buffer interop, not for mathematical operations on the raw components.
  *
  * @returns Iterator yielding position.x, position.y, rotation.cos, rotation.sin, scale.x, scale.y
  *
  * @example
  * ```typescript
  * const t = Transform2.fromComponents({ x: 1, y: 2 }, { cos: 0, sin: 1 }, { x: 3, y: 4 });
  * const components = [...t]; // [1, 2, 0, 1, 3, 4]
  * const [px, py, rc, rs, sx, sy] = t;
  * ```
  *
  * @category Conversion
  * @since 0.7.0
  */
 public *[Symbol.iterator](): IterableIterator<number> {
  yield this.position.x;
  yield this.position.y;
  yield this.rotation.cos;
  yield this.rotation.sin;
  yield this.scale.x;
  yield this.scale.y;
 }

 /**
  * Creates a deep copy of this transform
  * @returns New Transform2 with identical values
  *
  * @example
  * ```typescript
  * const t = new Transform2();
  * t.position.set(100, 50);
  * const copy = t.clone();
  * copy.identity(); // Original unchanged
  * ```
  *
  * @category Conversion
  * @since 0.7.0
  */
 clone(): Transform2 {
  return Transform2.clone(this);
 }
}
