/**
 * @file core/transform2.ts
 * @module @lenguados/math2d/core
 * @description Deterministic 2D transform combining translation, rotation, and scale.
 */

import { saturate } from '../auxiliary/scalar/arithmetic';
import {
 isNearZero,
 nearEquals as scalarNearEquals,
 relativeEquals,
} from '../auxiliary/scalar/comparison';
import { EPSILON, RAD_TO_DEG } from '../auxiliary/scalar/constants';
import { lerp, smoothStep } from '../auxiliary/scalar/interpolation';
import { atan2 } from '../deterministic/deterministic-kernels';
import type {
 ReadonlyRotation2Like,
 ReadonlyTransform2Like,
 ReadonlyVector2Like,
 Transform2Like,
} from '../types';
import { assertFinite } from '../validation/assert';

import { Matrix3, type ReadonlyMatrix3 } from './matrix3';
import { Rotation2 } from './rotation2';
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
 * Readonly view of a {@link Transform2} instance.
 *
 * @category Types
 * @since 0.7.0
 * @public
 */
export type ReadonlyTransform2 = Readonly<Transform2> & {
 readonly position: ReadonlyVector2;
 readonly scale: ReadonlyVector2;
};

export { isTransform2Like } from '../types';

/* ========================================================================== */
/* Helper Functions                                                           */
/* ========================================================================== */

/**
 * Permanently freezes a {@link Transform2} instance so it can no longer be mutated.
 *
 * @param transform - The Transform2 object to freeze.
 * @returns The same instance, now typed as ReadonlyTransform2.
 *
 * @remarks
 * - The returned object keeps its original reference; no new memory is allocated.
 * - In strict mode any subsequent attempt to modify properties throws a TypeError.
 * - Note: This also freezes the nested `position` and `scale` vectors.
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
 * Decomposed 2D affine transform applied in Scale → Rotate → Translate order.
 *
 * @category Core
 * @since 0.7.0
 */
export class Transform2 implements Transform2Like {
 /* ======================================================================== */
 /* Component Fields (SOLID: Transform2 is thin container)                   */
 /* ======================================================================== */

 public readonly position: Vector2;
 /**
  * The rotation component. Use rotation.angle, rotation.angleDegrees, etc.
  * for convenient access, or rotation.cos/sin for direct component access.
  *
  * @remarks
  * ## SOLID Architecture (v3)
  * Transform2 is a thin container. All rotation logic lives in Rotation2.
  * This follows Box2D's b2Transform/b2Rot separation pattern.
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
  * @category Component
  * @since 0.8.0
  */
 public readonly rotation: Rotation2;
 public readonly scale: Vector2;

 /* ======================================================================== */
 /* Private Helpers                                                          */
 /* ======================================================================== */

 private static ensureOut(out?: Transform2): Transform2 {
  return out ?? new Transform2();
 }

 private static extractVector(
  vector: ReadonlyVector2Like | undefined,
  label: string,
  fallbackX: number,
  fallbackY: number,
 ): { x: number; y: number } {
  const x = vector?.x ?? fallbackX;
  const y = vector?.y ?? fallbackY;
  // Pure math: Infinity/NaN are valid IEEE 754 values for position/scale
  return { x, y };
 }
 /* ======================================================================== */
 /* Static Constants (Immutable)                                             */
 /* ======================================================================== */

 /**
  * Identity transform (no transformation).
  * @category Core
  */
 public static readonly IDENTITY = freezeTransform2(new Transform2());

 /**
  * Number of elements when serialized to an array (x, y, angle, sx, sy).
  * @category Constant
  * @since 0.7.0
  */
 public static readonly ELEMENT_COUNT = 5;

 /**
  * Flip horizontally (scale.x = -1).
  * @category Core
  */
 public static readonly FLIP_X = freezeTransform2(new Transform2(undefined, 0, { x: -1, y: 1 }));

 /**
  * Flip vertically (scale.y = -1).
  * @category Core
  */
 public static readonly FLIP_Y = freezeTransform2(new Transform2(undefined, 0, { x: 1, y: -1 }));

 /* ======================================================================== */
 /* Constructor                                                              */
 /* ======================================================================== */

 constructor(position?: ReadonlyVector2Like, rotation = 0, scale?: ReadonlyVector2Like) {
  const initialPosition = Transform2.extractVector(
   position,
   'Transform2.constructor:position',
   0,
   0,
  );
  const initialScale = Transform2.extractVector(scale, 'Transform2.constructor:scale', 1, 1);
  this.position = new Vector2(initialPosition.x, initialPosition.y);
  assertFinite(rotation, 'Transform2.constructor:rotation');
  this.rotation = Rotation2.fromAngle(rotation);
  this.scale = new Vector2(initialScale.x, initialScale.y);
 }

 /* ======================================================================== */
 /* Static Factories                                                         */
 /* ======================================================================== */

 /**
  * Creates a transform from explicit values.
  * @param x - X position
  * @param y - Y position
  * @param rotation - Rotation in radians
  * @param scaleX - X scale
  * @param scaleY - Y scale
  * @param out - Optional output transform
  * @returns Transform with specified values
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
  * Creates a transform from a 3x3 matrix.
  * @param matrix - Source Matrix3
  * @param out - Optional output transform
  * @returns Decomposed transform
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
  * Creates a transform from components.
  * @param position - Position vector
  * @param rotation - Rotation (angle in radians or Rotation2Like object with cos/sin)
  * @param scale - Scale (vector or uniform scalar)
  * @param out - Optional output transform
  * @returns Transform from components
  *
  * @remarks
  * When passing a `ReadonlyRotation2Like` object, the angle is computed using
  * `atan2(rotation.sin, rotation.cos)`.
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
  const positionValues = Transform2.extractVector(
   position,
   'Transform2.fromComponents:position',
   0,
   0,
  );
  target.position.set(positionValues.x, positionValues.y);
  target.rotation.setAngle(
   typeof rotation === 'number' ? rotation : atan2(rotation.sin, rotation.cos),
  );
  if (typeof scale === 'number') {
   const sanitized = scale;
   target.scale.set(sanitized, sanitized);
  } else {
   const scaleValues = Transform2.extractVector(scale, 'Transform2.fromComponents:scale', 1, 1);
   target.scale.set(scaleValues.x, scaleValues.y);
  }
  return target;
 }

 /**
  * Creates a transform from a 2D pose (position + angle, uniform scale = 1).
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
  * @since 0.8.0
  */
 public static fromPose(x: number, y: number, angle: number, out?: Transform2): Transform2 {
  const target = Transform2.ensureOut(out);
  target.position.set(x, y);
  target.rotation.setAngle(angle);
  target.scale.set(1, 1);
  return target;
 }

 /**
  * Creates a transform from a plain object.
  * @param object - Object with position, rotation, and scale
  * @param out - Optional output transform
  * @returns Transform from object
  *
  * @category Factory
  * @since 0.7.0
  */
 public static fromObject(object: Transform2Like, out?: Transform2): Transform2 {
  const target = Transform2.ensureOut(out);
  const positionValues = Transform2.extractVector(
   object.position,
   'Transform2.fromObject:position',
   0,
   0,
  );
  const scaleValues = Transform2.extractVector(object.scale, 'Transform2.fromObject:scale', 1, 1);
  target.position.set(positionValues.x, positionValues.y);
  target.rotation.copy(object.rotation);
  target.scale.set(scaleValues.x, scaleValues.y);
  return target;
 }

 /**
  * Creates a deep copy of a transform.
  * @param source - Transform to clone
  * @param out - Optional output transform
  * @returns A Transform2 with identical values
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
  * Creates a transform from a flat array [px, py, rotation, sx, sy].
  * @param array - Source array with at least 5 elements
  * @param offset - Index offset. @defaultValue `0`
  * @param out - Optional output transform
  * @returns Transform from array
  * @throws {RangeError} If offset is out of bounds.
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
  * Copies values from source into destination (alloc-free).
  * @param source - Source transform
  * @param destination - Target transform to receive the copy
  * @returns The destination transform
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
  * Multiplies two transforms: applies b in the local space of a.
  * @param a - First transform (parent/outer transform)
  * @param b - Second transform (child/inner transform)
  * @param out - Optional output transform
  * @returns Combined transform
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
  * This limitation mirrors Box2D's design, which uses b2Transform with
  * only position and rotation (no scale) to avoid this issue entirely.
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
  const rotation = Rotation2.multiply(a.rotation, b.rotation);
  const scaleX = a.scale.x * b.scale.x;
  const scaleY = a.scale.y * b.scale.y;

  const scaledX = b.position.x * a.scale.x;
  const scaledY = b.position.y * a.scale.y;
  const { cos, sin } = a.rotation;
  const posX = scaledX * cos - scaledY * sin + a.position.x;
  const posY = scaledX * sin + scaledY * cos + a.position.y;

  target.rotation.copy(rotation);
  target.scale.set(scaleX, scaleY);
  target.position.set(posX, posY);
  return target;
 }

 /**
  * Calculates the inverse of a transform.
  * @param transform - Transform to invert
  * @param out - Optional output transform
  * @returns Inverse transform
  * @throws {RangeError} If scale.x or scale.y is near zero (non-invertible).
  *
  * @remarks
  * **Non-uniform scale warning:** This inversion is an APPROXIMATION when
  * `scale.x !== scale.y`. The SRT representation cannot exactly represent
  * the true inverse linear part `(R · S)⁻¹ = S⁻¹ · R⁻¹` because the SRT
  * format forces `R_inv · S_inv = R⁻¹ · S⁻¹`. For exact point inverse
  * transformation, use {@link inverseTransformPoint}. For exact full inverse,
  * convert to Matrix3 via {@link toMatrix3} and use {@link Matrix3.inverse}.
  * This is a common SRT limitation documented by engines such as DigitalRune.
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

  const target = Transform2.ensureOut(out);
  const invScaleX = 1 / transform.scale.x;
  const invScaleY = 1 / transform.scale.y;
  const invRotation = Rotation2.inverse(transform.rotation);
  const { cos, sin } = invRotation;

  // Position: -(S⁻¹ · R⁻¹ · t) — apply inverse rotation first, then inverse scale
  const rotPosX = transform.position.x * cos - transform.position.y * sin;
  const rotPosY = transform.position.x * sin + transform.position.y * cos;
  const invPosX = -(rotPosX * invScaleX);
  const invPosY = -(rotPosY * invScaleY);

  target.rotation.copy(invRotation);
  target.scale.set(invScaleX, invScaleY);
  target.position.set(invPosX, invPosY);
  return target;
 }

 /**
  * Calculates the inverse of a transform, returning identity if non-invertible.
  * @param transform - Transform to invert
  * @param out - Optional output transform
  * @returns Inverse transform, or identity if scale is near zero
  *
  * @remarks
  * Uses {@link isNearZero} with default {@link EPSILON} (1e-10) on each scale
  * component. Returns identity when either |scale.x| or |scale.y| ≤ EPSILON.
  *
  * **Non-uniform scale warning:** See {@link inverse} for details on SRT
  * approximation. Use {@link inverseTransformPoint} for exact point inverse.
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
   target.rotation.setAngle(0);
   target.scale.set(1, 1);
   return target;
  }

  const target = Transform2.ensureOut(out);
  const invScaleX = 1 / transform.scale.x;
  const invScaleY = 1 / transform.scale.y;
  const invRotation = Rotation2.inverse(transform.rotation);
  const { cos, sin } = invRotation;

  // Position: -(S⁻¹ · R⁻¹ · t) — apply inverse rotation first, then inverse scale
  const rotPosX = transform.position.x * cos - transform.position.y * sin;
  const rotPosY = transform.position.x * sin + transform.position.y * cos;
  const invPosX = -(rotPosX * invScaleX);
  const invPosY = -(rotPosY * invScaleY);

  target.rotation.copy(invRotation);
  target.scale.set(invScaleX, invScaleY);
  target.position.set(invPosX, invPosY);
  return target;
 }

 /**
  * Calculates the inverse of a transform without validation.
  * @param transform - Transform to invert (must have non-zero scale)
  * @param out - Optional output transform
  * @returns Inverse transform
  *
  * @remarks
  * **⚠️ Precondition:** `transform.scale.x ≠ 0` and `transform.scale.y ≠ 0`.
  * Calling with zero scale produces `Infinity`/`NaN` in the result.
  *
  * **Non-uniform scale warning:** See {@link inverse} for details on SRT
  * approximation. Use {@link inverseTransformPoint} for exact point inverse.
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
  const invRotation = Rotation2.inverse(transform.rotation);
  const { cos, sin } = invRotation;

  // Position: -(S⁻¹ · R⁻¹ · t) — apply inverse rotation first, then inverse scale
  const rotPosX = transform.position.x * cos - transform.position.y * sin;
  const rotPosY = transform.position.x * sin + transform.position.y * cos;
  const invPosX = -(rotPosX * invScaleX);
  const invPosY = -(rotPosY * invScaleY);

  target.rotation.copy(invRotation);
  target.scale.set(invScaleX, invScaleY);
  target.position.set(invPosX, invPosY);
  return target;
 }

 /* ======================================================================== */
 /* Static Transform Application                                             */
 /* ======================================================================== */

 /**
  * Transforms a point by a transform (applies scale, rotation, then translation).
  * @param transform - Transform to apply
  * @param point - Point to transform
  * @param out - Optional output vector
  * @returns Transformed point
  *
  * @remarks
  * Points are affected by all components: scale, rotation, and translation.
  * Order of operations: Scale → Rotate → Translate.
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
  * Transforms a point using precomputed cos/sin values.
  * @param transform - Transform to apply (position and scale only)
  * @param point - Point to transform
  * @param cos - Precomputed cosine of rotation
  * @param sin - Precomputed sine of rotation
  * @param out - Optional output vector
  * @returns Transformed point
  *
  * @remarks
  * Use this method in hot paths where cos/sin are already computed.
  * Avoids redundant trigonometric calculations in loops.
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
  * Transforms a vector by a transform (applies scale and rotation, no translation).
  * @param transform - Transform to apply
  * @param vector - Vector to transform
  * @param out - Optional output vector
  * @returns Transformed vector
  *
  * @remarks
  * Vectors are NOT affected by translation (they represent directions, not positions).
  * Only scale and rotation are applied.
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
  * Transforms a vector using precomputed cos/sin values.
  * @param transform - Transform to apply (scale only)
  * @param vector - Vector to transform
  * @param cos - Precomputed cosine of rotation
  * @param sin - Precomputed sine of rotation
  * @param out - Optional output vector
  * @returns Transformed vector
  *
  * @remarks
  * Use this method in hot paths where cos/sin are already computed.
  * Avoids redundant trigonometric calculations in loops.
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
  * Inverse transforms a point.
  * @param transform - Transform to apply inversely
  * @param point - Point to inverse transform
  * @param out - Optional output vector
  * @returns Inverse transformed point
  * @throws {RangeError} If scale.x or scale.y is near zero.
  *
  * @remarks
  * Applies the inverse of the transform: Translate⁻¹ → Rotate⁻¹ → Scale⁻¹.
  * Useful for converting world coordinates to local coordinates.
  *
  * @example
  * ```typescript
  * const t = new Transform2({ x: 10, y: 0 }, 0, { x: 2, y: 2 });
  * const worldPoint = { x: 12, y: 4 };
  * const local = Transform2.inverseTransformPoint(t, worldPoint); // (1, 2)
  * ```
  *
  * @see {@link inverseTransformPointSafe} - Returns (0,0) instead of throwing
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
  * Inverse transforms a point, returning (0,0) if scale is near zero.
  * @param transform - Transform to apply inversely
  * @param point - Point to inverse transform
  * @param out - Optional output vector
  * @returns Inverse transformed point, or (0,0) if scale is near zero
  *
  * @remarks
  * Use when transform may have degenerate scale and you want graceful fallback.
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
  * Inverse transforms a point using precomputed cos/sin values (unchecked).
  * @param transform - Transform to apply inversely (position and scale)
  * @param point - Point to inverse transform
  * @param cos - Precomputed cosine of rotation
  * @param sin - Precomputed sine of rotation
  * @param out - Optional output vector
  * @returns Inverse transformed point
  *
  * @remarks
  * **⚠️ Precondition:** `transform.scale.x ≠ 0` and `transform.scale.y ≠ 0`.
  *
  * Use this method in hot paths where cos/sin are already computed.
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
  * Inverse transforms a vector (ignores translation).
  * @param transform - Transform to apply inversely
  * @param vector - Vector to inverse transform
  * @param out - Optional output vector
  * @returns Inverse transformed vector
  * @throws {RangeError} If scale.x or scale.y is near zero.
  *
  * @remarks
  * Applies the inverse of the transform's rotation and scale only.
  * Useful for converting world directions to local directions.
  *
  * @example
  * ```typescript
  * const t = new Transform2({ x: 10, y: 0 }, Math.PI / 2, { x: 2, y: 2 });
  * const worldDir = { x: 0, y: 2 };
  * const local = Transform2.inverseTransformVector(t, worldDir); // (1, 0)
  * ```
  *
  * @see {@link inverseTransformVectorSafe} - Returns (0,0) instead of throwing
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
  * Inverse transforms a vector, returning (0,0) if scale is near zero.
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
  * Inverse transforms a vector using precomputed cos/sin values (unchecked).
  * @param transform - Transform to apply inversely (scale only)
  * @param vector - Vector to inverse transform
  * @param cos - Precomputed cosine of rotation
  * @param sin - Precomputed sine of rotation
  * @param out - Optional output vector
  * @returns Inverse transformed vector
  *
  * @remarks
  * **⚠️ Precondition:** `transform.scale.x ≠ 0` and `transform.scale.y ≠ 0`.
  *
  * Use this method in hot paths where cos/sin are already computed.
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
  * Linear interpolation between two transforms.
  * @param a - Start transform
  * @param b - End transform
  * @param t - Interpolation factor [0, 1], clamped
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
  * Linear interpolation with t clamped to [0, 1].
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
  * Smooth interpolation between two transforms using smoothStep easing.
  * @param a - Source transform
  * @param b - Target transform
  * @param t - Interpolation factor (clamped to [0, 1])
  * @param out - Optional output transform
  * @returns Smoothly interpolated transform
  *
  * @remarks
  * Uses Hermite smoothStep for ease-in-out effect on all components.
  * Position and scale use linear smoothStep, rotation uses angular smoothStep.
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
  const clamped = saturate(t);
  return Transform2.lerp(a, b, smoothStep(0, 1, clamped), out);
 }

 /* ======================================================================== */
 /* Static Comparison & Validation                                           */
 /* ======================================================================== */

 /**
  * Exact equality (bit-identical).
  * @param a - First transform
  * @param b - Second transform
  * @returns True if exactly identical
  *
  * @remarks
  * Use {@link nearEquals} for comparing results of floating-point operations.
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
  * Approximate equality using relative tolerance for position and scale.
  * @param a - First transform
  * @param b - Second transform
  * @param epsilon - Tolerance. @defaultValue `EPSILON`
  * @returns True if within epsilon
  *
  * @remarks
  * Position and scale use relative tolerance. Rotation uses absolute tolerance
  * since angles are bounded to a fixed range.
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
  * Tests if a transform is the identity.
  * @param transform - Transform to test
  * @param epsilon - Tolerance (default: EPSILON)
  * @returns True if identity
  *
  * @remarks
  * Uses {@link EPSILON} (1e-10) as default tolerance. Checks position ≈ (0,0),
  * rotation ≈ identity, and scale ≈ (1,1).
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
  * Tests if both position and scale components are finite.
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
  * Tests if any component is NaN.
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
  * Tests if any component is infinite (±Infinity).
  * @param transform - Transform to test
  * @returns True if any component is ±Infinity
  *
  * @remarks
  * Distinguishes infinity from NaN. Use {@link isFinite} to check for both.
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
  * Tests if transform is invertible (has non-zero scale).
  *
  * @param transform - Transform to test.
  * @param epsilon - Tolerance. @defaultValue `EPSILON`
  * @returns True if transform can be inverted.
  *
  * @remarks
  * A transform is invertible when both scale components are non-zero.
  * This follows the Eigen C++ convention for matrix invertibility.
  *
  * @category Comparison
  * @since 0.7.0
  */
 public static isInvertible(transform: ReadonlyTransform2, epsilon: number = EPSILON): boolean {
  return !isNearZero(transform.scale.x, epsilon) && !isNearZero(transform.scale.y, epsilon);
 }

 /**
  * Tests if transform has uniform scale.
  * @param transform - Transform to test
  * @param epsilon - Tolerance for comparison
  * @returns True if scale.x ≈ scale.y
  *
  * @remarks
  * Uses relative tolerance for comparing scale components.
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
  * Tests if transform has negative scale components.
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
  * Returns the determinant (scale.x * scale.y).
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
 /* Instance Basic Mutators                                                  */
 /* ======================================================================== */

 /**
  * Sets all transform components.
  * @param position - Position vector
  * @param rotation - Rotation in radians
  * @param scale - Scale (vector or uniform scalar)
  * @returns This for chaining
  *
  * @category Mutator
  * @since 0.7.0
  */
 set(position: ReadonlyVector2Like, rotation: number, scale: ReadonlyVector2Like | number): this {
  const positionValues = Transform2.extractVector(position, 'Transform2.set:position', 0, 0);
  this.position.set(positionValues.x, positionValues.y);
  this.rotation.setAngle(rotation);
  if (typeof scale === 'number') {
   const scaleValues = scale;
   this.scale.set(scaleValues, scaleValues);
  } else {
   const scaleValues = Transform2.extractVector(scale, 'Transform2.set:scale', 1, 1);
   this.scale.set(scaleValues.x, scaleValues.y);
  }
  return this;
 }

 /**
  * Copies values from another transform.
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
  * Resets to identity transform.
  * @returns This for chaining
  *
  * @category Mutator
  * @since 0.7.0
  */
 identity(): this {
  this.position.set(0, 0);
  this.rotation.setAngle(0);
  this.scale.set(1, 1);
  return this;
 }

 /* ======================================================================== */
 /* Instance Computed Values                                                 */
 /* ======================================================================== */

 /**
  * Tests if scale is uniform (x equals y).
  * @param epsilon - Relative tolerance (default: EPSILON)
  * @returns True if uniform scale
  *
  * @remarks
  * Uses relative tolerance for comparing scale components.
  *
  * @category Computed
  * @since 0.7.0
  */
 hasUniformScale(epsilon: number = EPSILON): boolean {
  return relativeEquals(this.scale.x, this.scale.y, epsilon);
 }

 /**
  * Tests if scale has negative components.
  * @returns True if any scale component is negative
  *
  * @category Computed
  * @since 0.7.0
  */
 hasNegativeScale(): boolean {
  return this.scale.x < 0 || this.scale.y < 0;
 }

 /**
  * Returns the determinant (scale.x * scale.y).
  * @returns Determinant value
  *
  * @category Computed
  * @since 0.7.0
  */
 determinant(): number {
  return this.scale.x * this.scale.y;
 }

 /* ======================================================================== */
 /* Matrix Conversion                                                        */
 /* ======================================================================== */

 /**
  * Converts this transform to a 3x3 matrix.
  * @param out - Optional output matrix
  * @returns Matrix3 representation
  *
  * @category Conversion
  * @since 0.7.0
  */
 public toMatrix3(out?: Matrix3): Matrix3 {
  return Matrix3.fromTransform2(this.position, Rotation2.angle(this.rotation), this.scale, out);
 }

 /**
  * Converts this transform's rotation to a Rotation2.
  * @param out - Optional output rotation
  * @returns Rotation2 representation of the transform's angle
  *
  * @remarks
  * Useful for extracting the rotation component for reuse in hot paths,
  * avoiding repeated `sinCos()` calls.
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

 /**
  * Sets this transform from a 3x3 matrix.
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
  * Transforms a point (applies translation).
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
  * Transforms a point using precomputed cos/sin values.
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
  * Transforms a vector (ignores translation).
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
  * Transforms a vector using precomputed cos/sin values.
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
  * Inverse transforms a point.
  * @param point - Point to inverse transform
  * @param out - Optional output vector
  * @returns Inverse transformed point
  *
  * @category Transform
  * @since 0.7.0
  */
 inverseTransformPoint(point: ReadonlyVector2Like, out?: Vector2): Vector2 {
  return Transform2.inverseTransformPoint(this, point, out);
 }

 /**
  * Inverse transforms a point using precomputed cos/sin values.
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
  * Inverse transforms a vector (ignores translation).
  * @param vector - Vector to inverse transform
  * @param out - Optional output vector
  * @returns Inverse transformed vector
  *
  * @remarks
  * Applies the inverse of the transform's rotation and scale only.
  * Useful for converting world directions to local directions.
  *
  * @category Transform
  * @since 0.7.0
  */
 inverseTransformVector(vector: ReadonlyVector2Like, out?: Vector2): Vector2 {
  return Transform2.inverseTransformVector(this, vector, out);
 }

 /**
  * Inverse transforms a vector using precomputed cos/sin values.
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
  * Transforms multiple points efficiently (batch operation).
  * Calculates sin/cos once and applies to all points.
  *
  * @param points - Array of points to transform
  * @param out - Optional output array (will be filled/extended as needed)
  * @returns Array of transformed points
  *
  * @remarks
  * More efficient than calling transformPoint multiple times because
  * sin/cos are calculated only once. Internally uses the same math as
  * {@link transformPoint}.
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
  * Transforms multiple vectors efficiently (batch operation).
  * Calculates sin/cos once and applies to all vectors.
  *
  * @param vectors - Array of vectors to transform
  * @param out - Optional output array (will be filled/extended as needed)
  * @returns Array of transformed vectors
  *
  * @remarks
  * Unlike points, vectors are not affected by translation.
  * More efficient than calling transformVector multiple times.
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
  * Multiplies with another transform (composition) in place.
  * @param other - Transform to multiply by
  * @returns This for chaining
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 multiply(other: ReadonlyTransform2): this {
  const newRotation = Rotation2.multiply(this.rotation, other.rotation);
  const newScaleX = this.scale.x * other.scale.x;
  const newScaleY = this.scale.y * other.scale.y;

  // Transform the other's position by this transform
  const { cos, sin } = this.rotation;
  const scaledX = other.position.x * this.scale.x;
  const scaledY = other.position.y * this.scale.y;
  const newPosX = scaledX * cos - scaledY * sin + this.position.x;
  const newPosY = scaledX * sin + scaledY * cos + this.position.y;

  this.rotation.copy(newRotation);
  this.scale.set(newScaleX, newScaleY);
  this.position.set(newPosX, newPosY);
  return this;
 }

 /**
  * Inverts this transform in place.
  * @returns This for chaining
  * @throws {RangeError} If scale.x or scale.y is near zero.
  *
  * @remarks
  * **Non-uniform scale warning:** See static {@link Transform2.inverse} for
  * details on SRT approximation.
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

  const invScaleX = 1 / this.scale.x;
  const invScaleY = 1 / this.scale.y;
  const invRotation = Rotation2.inverse(this.rotation);
  const { cos, sin } = invRotation;

  // Position: -(S⁻¹ · R⁻¹ · t) — apply inverse rotation first, then inverse scale
  const rotPosX = this.position.x * cos - this.position.y * sin;
  const rotPosY = this.position.x * sin + this.position.y * cos;
  const invPosX = -(rotPosX * invScaleX);
  const invPosY = -(rotPosY * invScaleY);

  this.rotation.copy(invRotation);
  this.scale.set(invScaleX, invScaleY);
  this.position.set(invPosX, invPosY);
  return this;
 }

 /**
  * Inverts this transform in place, setting to identity if non-invertible.
  * @returns This for chaining
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 inverseSafe(): this {
  if (isNearZero(this.scale.x) || isNearZero(this.scale.y)) {
   this.position.set(0, 0);
   this.rotation.setAngle(0);
   this.scale.set(1, 1);
   return this;
  }
  return this.inverseUnchecked();
 }

 /**
  * Inverts this transform in place without validation.
  * @returns This for chaining
  *
  * @remarks
  * **⚠️ Precondition:** `scale.x ≠ 0` and `scale.y ≠ 0`.
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 inverseUnchecked(): this {
  const invScaleX = 1 / this.scale.x;
  const invScaleY = 1 / this.scale.y;
  const invRotation = Rotation2.inverse(this.rotation);
  const { cos, sin } = invRotation;

  // Position: -(S⁻¹ · R⁻¹ · t) — apply inverse rotation first, then inverse scale
  const rotPosX = this.position.x * cos - this.position.y * sin;
  const rotPosY = this.position.x * sin + this.position.y * cos;
  const invPosX = -(rotPosX * invScaleX);
  const invPosY = -(rotPosY * invScaleY);

  this.rotation.copy(invRotation);
  this.scale.set(invScaleX, invScaleY);
  this.position.set(invPosX, invPosY);
  return this;
 }

 /* ======================================================================== */
 /* Instance Comparison                                                      */
 /* ======================================================================== */

 /**
  * Exact equality (bit-identical).
  * @param other - Transform to compare
  * @returns True if exactly identical
  *
  * @remarks
  * Use {@link nearEquals} for comparing results of floating-point operations.
  *
  * @category Comparison
  * @since 0.7.0
  */
 exactEquals(other: ReadonlyTransform2): boolean {
  return Transform2.exactEquals(this, other);
 }

 /**
  * Approximate equality using relative tolerance for position and scale.
  * @param other - Transform to compare
  * @param epsilon - Tolerance. @defaultValue `EPSILON`
  * @returns True if within epsilon
  *
  * @remarks
  * Position and scale use relative tolerance. Rotation uses absolute tolerance
  * since angles are bounded to a fixed range.
  *
  * @category Comparison
  * @since 0.7.0
  */
 nearEquals(other: ReadonlyTransform2, epsilon: number = EPSILON): boolean {
  return Transform2.nearEquals(this, other, epsilon);
 }

 /**
  * Returns true if all components are finite.
  * @returns True if no NaN or Infinity values
  *
  * @category Validation
  * @since 0.7.0
  */
 isFinite(): boolean {
  return Transform2.isFinite(this);
 }

 /**
  * Returns true if any component is NaN.
  * @returns True if any NaN value exists
  *
  * @category Validation
  * @since 0.7.0
  */
 hasNaN(): boolean {
  return Transform2.hasNaN(this);
 }

 /**
  * Returns true if any component is infinite (±Infinity).
  * @returns True if any ±Infinity value exists
  *
  * @category Validation
  * @since 0.7.0
  */
 hasInfinity(): boolean {
  return Transform2.hasInfinity(this);
 }

 /**
  * Tests if this transform is invertible.
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
  * Tests if this transform is identity.
  * @param epsilon - Tolerance (default: EPSILON)
  * @returns True if identity
  *
  * @category Comparison
  * @since 0.7.0
  */
 isIdentity(epsilon: number = EPSILON): boolean {
  return (
   this.position.isNearZero(epsilon) &&
   Rotation2.nearEquals(this.rotation, Rotation2.IDENTITY, epsilon) &&
   scalarNearEquals(this.scale.x, 1, epsilon) &&
   scalarNearEquals(this.scale.y, 1, epsilon)
  );
 }

 /* ======================================================================== */
 /* Instance Getters (Derived)                                               */
 /* ======================================================================== */

 /**
  * Returns the inverse without modifying this transform.
  * @returns New inverse transform
  *
  * @category Computed
  * @since 0.7.0
  */
 public get inverted(): Transform2 {
  return Transform2.inverse(this);
 }

 /**
  * Returns the rotation as a unit Vector2 (direction).
  * @returns Direction vector
  *
  * @category Computed
  * @since 0.7.0
  */
 public get direction(): Vector2 {
  const { cos, sin } = this.rotation;
  return new Vector2(cos, sin);
 }

 /**
  * Returns the rotation in degrees.
  * @returns Rotation in degrees
  *
  * @category Computed
  * @since 0.7.0
  */
 public get rotationDegrees(): number {
  return Rotation2.angle(this.rotation) * RAD_TO_DEG;
 }

 /* ======================================================================== */
 /* Instance Interpolation                                                   */
 /* ======================================================================== */

 /**
  * Linear interpolation towards another transform in place.
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
  * Linear interpolation with t clamped to [0, 1].
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
  * Smooth interpolation with another transform in place.
  * @param other - Target transform
  * @param t - Interpolation factor (clamped to [0, 1])
  * @returns This for chaining
  *
  * @remarks
  * Uses Hermite smoothStep for ease-in-out effect.
  *
  * @category Interpolation
  * @since 0.7.0
  */
 smoothStep(other: ReadonlyTransform2, t: number): this {
  const clamped = saturate(t);
  return this.lerp(other, smoothStep(0, 1, clamped));
 }

 /* ======================================================================== */
 /* Instance Conversion                                                      */
 /* ======================================================================== */

 /**
  * Converts the transform to a plain object.
  * @returns Object with position, rotation, and scale properties
  *
  * @example
  * ```typescript
  * const t = new Transform2();
  * t.position.set(100, 50);
  * t.rotation = Math.PI / 4;
  * t.scale.set(2, 2);
  * const obj = t.toObject();
  * // {
  * //   position: { x: 100, y: 50 },
  * //   rotation: 0.785...,
  * //   scale: { x: 2, y: 2 }
  * // }
  * ```
  *
  * @category Serialization
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
  * Converts the transform to a flat array [px, py, rotation, sx, sy].
  * @param out - Optional output array
  * @param offset - Write offset. @defaultValue `0`
  * @returns Array with transform values
  *
  * @example
  * ```typescript
  * const t = new Transform2({ x: 100, y: 50 }, Math.PI / 4, { x: 2, y: 2 });
  * const arr = t.toArray();
  * // [100, 50, 0.785..., 2, 2]
  * ```
  *
  * @category Serialization
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
  out[offset] = this.position.x;
  out[offset + 1] = this.position.y;
  out[offset + 2] = Rotation2.angle(this.rotation);
  out[offset + 3] = this.scale.x;
  out[offset + 4] = this.scale.y;
  return out;
 }

 /**
  * Converts the transform to a JSON-serializable object.
  * Called automatically by JSON.stringify().
  * @returns Object suitable for JSON serialization
  *
  * @example
  * ```typescript
  * const t = new Transform2();
  * t.position.set(100, 50);
  * const json = JSON.stringify(t);
  * // '{"position":{"x":100,"y":50},"rotation":0,"scale":{"x":1,"y":1}}'
  * ```
  *
  * @category Serialization
  * @since 0.7.0
  */
 public toJSON(): Transform2Like {
  return this.toObject();
 }

 /**
  * Creates a human-readable string representation.
  * Shows position, rotation (in degrees), and scale.
  * @param precision - Number of decimal places (default: 4)
  * @returns Formatted string
  *
  * @example
  * ```typescript
  * const t = new Transform2();
  * t.position.set(100, 50);
  * t.rotation = Math.PI / 4;
  * console.log(t.toString());
  * // "Transform2(pos: (100.0000, 50.0000), rot: 45.0000°, scale: (1.0000, 1.0000))"
  * ```
  *
  * @category Serialization
  * @since 0.7.0
  */
 public toString(precision = 4): string {
  const p = (value: number) => value.toFixed(precision);
  const degrees = Rotation2.angle(this.rotation) * RAD_TO_DEG;
  return `Transform2(pos: (${p(this.position.x)}, ${p(this.position.y)}), rot: ${p(degrees)}°, scale: (${p(this.scale.x)}, ${p(this.scale.y)}))`;
 }

 /**
  * Creates a deep copy of this transform.
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
  * @category Serialization
  * @since 0.7.0
  */
 clone(): Transform2 {
  return Transform2.clone(this);
 }
}
