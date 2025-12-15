/**
 * @file core/transform2.ts
 * @module @lenguados/math2d/core
 * @description Deterministic 2D transform combining translation, rotation, and scale.
 */

import { lerpAngle } from '../auxiliary/angle/interpolation';
import { normalizeRadians } from '../auxiliary/angle/normalization';
import { angleDifference, sinCos } from '../auxiliary/angle/operations';
import { safeDivide } from '../auxiliary/numeric/safety';
import { saturate } from '../auxiliary/scalar/arithmetic';
import {
 isNearZero,
 nearEquals as scalarNearEquals,
 relativeEquals,
} from '../auxiliary/scalar/comparison';
import { EPSILON, RAD_TO_DEG } from '../auxiliary/scalar/constants';
import { lerp, smoothStep } from '../auxiliary/scalar/interpolation';
import type { ReadonlyTransform2Like, ReadonlyVector2Like, Transform2Like } from '../types';
import { assertFinite } from '../validation/assert';

import { Matrix3, type ReadonlyMatrix3 } from './matrix3';
import { type ReadonlyRotation2 } from './rotation2';
import { Vector2, type ReadonlyVector2 } from './vector2';

export type { Transform2Like } from '../types';

/* ========================================================================== */
/* Type Exports                                                               */
/* ========================================================================== */

/**
 * Readonly view of a {@link Transform2} instance.
 * @public
 */
export type ReadonlyTransform2 = Readonly<Transform2> & {
 readonly position: ReadonlyVector2;
 readonly scale: ReadonlyVector2;
};

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
 * @since 0.9.0
 */
export function freezeTransform2(transform: Transform2): ReadonlyTransform2 {
 Object.freeze(transform.position);
 Object.freeze(transform.scale);
 return Object.freeze(transform) as ReadonlyTransform2;
}

/* ========================================================================== */
/* Class: Transform2                                                          */
/* ========================================================================== */

/**
 * Decomposed 2D affine transform applied in Scale → Rotate → Translate order.
 */
export class Transform2 implements Transform2Like {
 /* ======================================================================== */
 /* Instance Properties                                                      */
 /* ======================================================================== */

 public readonly position: Vector2;
 public rotation: number;
 public readonly scale: Vector2;

 /* ======================================================================== */
 /* Private Helpers                                                          */
 /* ======================================================================== */

 private static ensureOut(out?: Transform2): Transform2 {
  return out ?? new Transform2();
 }

 private static sanitizeVector(
  vector: ReadonlyVector2Like | undefined,
  label: string,
  fallbackX: number,
  fallbackY: number,
 ): { x: number; y: number } {
  const x = vector?.x ?? fallbackX;
  const y = vector?.y ?? fallbackY;
  assertFinite(x, `${label}.x`);
  assertFinite(y, `${label}.y`);
  return { x, y };
 }

 private static sanitizeScalar(value: number, label: string): number {
  assertFinite(value, label);
  return value;
 }

 /* ======================================================================== */
 /* Static Constants (Immutable)                                             */
 /* ======================================================================== */

 /**
  * Identity transform (no transformation).
  * @category Core
  */
 public static readonly IDENTITY = Object.freeze(new Transform2()) as ReadonlyTransform2;

 /**
  * Flip horizontally (scale.x = -1).
  * @category Core
  */
 public static readonly FLIP_X = Object.freeze(
  new Transform2(undefined, 0, { x: -1, y: 1 }),
 ) as ReadonlyTransform2;

 /**
  * Flip vertically (scale.y = -1).
  * @category Core
  */
 public static readonly FLIP_Y = Object.freeze(
  new Transform2(undefined, 0, { x: 1, y: -1 }),
 ) as ReadonlyTransform2;

 /* ======================================================================== */
 /* Constructor                                                              */
 /* ======================================================================== */

 constructor(position?: ReadonlyVector2Like, rotation = 0, scale?: ReadonlyVector2Like) {
  const initialPosition = Transform2.sanitizeVector(
   position,
   'Transform2.constructor:position',
   0,
   0,
  );
  const initialScale = Transform2.sanitizeVector(scale, 'Transform2.constructor:scale', 1, 1);
  this.position = new Vector2(initialPosition.x, initialPosition.y);
  assertFinite(rotation, 'Transform2.constructor:rotation');
  this.rotation = normalizeRadians(rotation);
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
  * @since 0.1.0
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
  target.position.set(
   Transform2.sanitizeScalar(x, 'Transform2.fromValues:x'),
   Transform2.sanitizeScalar(y, 'Transform2.fromValues:y'),
  );
  target.rotation = normalizeRadians(
   Transform2.sanitizeScalar(rotation, 'Transform2.fromValues:rotation'),
  );
  target.scale.set(
   Transform2.sanitizeScalar(scaleX, 'Transform2.fromValues:scaleX'),
   Transform2.sanitizeScalar(scaleY, 'Transform2.fromValues:scaleY'),
  );
  return target;
 }

 /**
  * Creates a transform from a 3x3 matrix.
  * @param matrix - Source matrix
  * @param out - Optional output transform
  * @returns Decomposed transform
  *
  * @category Factory
  * @since 0.1.0
  */
 public static fromMatrix(matrix: ReadonlyMatrix3, out?: Transform2): Transform2 {
  const target = Transform2.ensureOut(out);
  matrix.getTranslation(target.position);
  matrix.getScale(target.scale);
  target.rotation = normalizeRadians(matrix.getRotation());
  return target;
 }

 /**
  * Creates a transform from components.
  * @param position - Position vector
  * @param rotation - Rotation (angle or Rotation2)
  * @param scale - Scale (vector or uniform scalar)
  * @param out - Optional output transform
  * @returns Transform from components
  *
  * @category Factory
  * @since 0.1.0
  */
 public static fromComponents(
  position: ReadonlyVector2Like,
  rotation: number | ReadonlyRotation2,
  scale: ReadonlyVector2Like | number,
  out?: Transform2,
 ): Transform2 {
  const target = Transform2.ensureOut(out);
  const sanitizedPosition = Transform2.sanitizeVector(
   position,
   'Transform2.fromComponents:position',
   0,
   0,
  );
  target.position.set(sanitizedPosition.x, sanitizedPosition.y);
  target.rotation = normalizeRadians(typeof rotation === 'number' ? rotation : rotation.angle());
  if (typeof scale === 'number') {
   const sanitized = Transform2.sanitizeScalar(scale, 'Transform2.fromComponents:scale');
   target.scale.set(sanitized, sanitized);
  } else {
   const sanitizedScale = Transform2.sanitizeVector(scale, 'Transform2.fromComponents:scale', 1, 1);
   target.scale.set(sanitizedScale.x, sanitizedScale.y);
  }
  return target;
 }

 /**
  * Creates a transform from a plain object.
  * @param object - Object with position, rotation, and scale
  * @param out - Optional output transform
  * @returns Transform from object
  *
  * @category Factory
  * @since 0.1.0
  */
 public static fromObject(object: Transform2Like, out?: Transform2): Transform2 {
  const target = Transform2.ensureOut(out);
  const sanitizedPosition = Transform2.sanitizeVector(
   object.position,
   'Transform2.fromObject:position',
   0,
   0,
  );
  const sanitizedScale = Transform2.sanitizeVector(
   object.scale,
   'Transform2.fromObject:scale',
   1,
   1,
  );
  target.position.set(sanitizedPosition.x, sanitizedPosition.y);
  target.rotation = normalizeRadians(
   Transform2.sanitizeScalar(object.rotation, 'Transform2.fromObject:rotation'),
  );
  target.scale.set(sanitizedScale.x, sanitizedScale.y);
  return target;
 }

 /**
  * Creates a deep copy of a transform.
  * @param source - Transform to clone
  * @param out - Optional output transform
  * @returns A Transform2 with identical values
  *
  * @category Factory
  * @since 0.9.0
  */
 public static clone(source: ReadonlyTransform2, out?: Transform2): Transform2 {
  const target = Transform2.ensureOut(out);
  target.position.copy(source.position);
  target.rotation = source.rotation;
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
  * @since 0.9.0
  */
 public static fromArray(array: ArrayLike<number>, offset = 0, out?: Transform2): Transform2 {
  if (offset < 0 || offset + 4 >= array.length) {
   throw new RangeError(
    `Transform2.fromArray: offset ${offset} out of bounds for array length ${array.length}`,
   );
  }
  const target = Transform2.ensureOut(out);
  target.position.set(
   Transform2.sanitizeScalar(array[offset]!, 'Transform2.fromArray:px'),
   Transform2.sanitizeScalar(array[offset + 1]!, 'Transform2.fromArray:py'),
  );
  target.rotation = normalizeRadians(
   Transform2.sanitizeScalar(array[offset + 2]!, 'Transform2.fromArray:rotation'),
  );
  target.scale.set(
   Transform2.sanitizeScalar(array[offset + 3]!, 'Transform2.fromArray:sx'),
   Transform2.sanitizeScalar(array[offset + 4]!, 'Transform2.fromArray:sy'),
  );
  return target;
 }

 /**
  * Copies values from source into destination (alloc-free).
  * @param source - Source transform
  * @param destination - Target transform to receive the copy
  * @returns The destination transform
  *
  * @category Factory
  * @since 0.9.0
  */
 public static copy(source: ReadonlyTransform2, destination: Transform2): Transform2 {
  destination.position.copy(source.position);
  destination.rotation = source.rotation;
  destination.scale.copy(source.scale);
  return destination;
 }

 /* ======================================================================== */
 /* Static Arithmetic                                                        */
 /* ======================================================================== */

 /**
  * Multiplies two transforms.
  * @param a - First transform
  * @param b - Second transform
  * @param out - Optional output transform
  * @returns Combined transform
  *
  * @category Arithmetic
  * @since 0.1.0
  */
 public static multiply(
  a: ReadonlyTransform2,
  b: ReadonlyTransform2,
  out?: Transform2,
 ): Transform2 {
  const target = Transform2.ensureOut(out);
  const rotation = normalizeRadians(a.rotation + b.rotation);
  const scaleX = a.scale.x * b.scale.x;
  const scaleY = a.scale.y * b.scale.y;

  const scaledX = b.position.x * a.scale.x;
  const scaledY = b.position.y * a.scale.y;
  const { cos, sin } = sinCos(a.rotation);
  const posX = scaledX * cos - scaledY * sin + a.position.x;
  const posY = scaledX * sin + scaledY * cos + a.position.y;

  target.rotation = rotation;
  target.scale.set(scaleX, scaleY);
  target.position.set(posX, posY);
  return target;
 }

 /**
  * Calculates the inverse of a transform.
  * @param transform - Transform to invert
  * @param out - Optional output transform
  * @returns Inverse transform
  *
  * @category Arithmetic
  * @since 0.1.0
  */
 public static inverse(transform: ReadonlyTransform2, out?: Transform2): Transform2 {
  const target = Transform2.ensureOut(out);
  const invScaleX = safeDivide(1, transform.scale.x);
  const invScaleY = safeDivide(1, transform.scale.y);
  const invRotation = normalizeRadians(-transform.rotation);
  const { cos, sin } = sinCos(invRotation);

  const scaledPosX = transform.position.x * invScaleX;
  const scaledPosY = transform.position.y * invScaleY;
  const invPosX = -(scaledPosX * cos - scaledPosY * sin);
  const invPosY = -(scaledPosX * sin + scaledPosY * cos);

  target.rotation = invRotation;
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
  * @since 0.10.0
  */
 public static transformPoint(
  transform: ReadonlyTransform2Like,
  point: ReadonlyVector2Like,
  out?: Vector2,
 ): Vector2 {
  const scaledX = point.x * transform.scale.x;
  const scaledY = point.y * transform.scale.y;
  const { cos, sin } = sinCos(transform.rotation);
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
  * @since 0.10.0
  */
 public static transformVector(
  transform: ReadonlyTransform2Like,
  vector: ReadonlyVector2Like,
  out?: Vector2,
 ): Vector2 {
  const scaledX = vector.x * transform.scale.x;
  const scaledY = vector.y * transform.scale.y;
  const { cos, sin } = sinCos(transform.rotation);
  return Vector2.fromValues(scaledX * cos - scaledY * sin, scaledX * sin + scaledY * cos, out);
 }

 /**
  * Inverse transforms a point.
  * @param transform - Transform to apply inversely
  * @param point - Point to inverse transform
  * @param out - Optional output vector
  * @returns Inverse transformed point
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
  * @category Transform
  * @since 0.10.0
  */
 public static inverseTransformPoint(
  transform: ReadonlyTransform2Like,
  point: ReadonlyVector2Like,
  out?: Vector2,
 ): Vector2 {
  const tx = point.x - transform.position.x;
  const ty = point.y - transform.position.y;
  const { cos, sin } = sinCos(-transform.rotation);
  const rotatedX = tx * cos - ty * sin;
  const rotatedY = tx * sin + ty * cos;
  const invScaleX = safeDivide(1, transform.scale.x);
  const invScaleY = safeDivide(1, transform.scale.y);
  return Vector2.fromValues(rotatedX * invScaleX, rotatedY * invScaleY, out);
 }

 /**
  * Inverse transforms a vector (ignores translation).
  * @param transform - Transform to apply inversely
  * @param vector - Vector to inverse transform
  * @param out - Optional output vector
  * @returns Inverse transformed vector
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
  * @category Transform
  * @since 0.10.0
  */
 public static inverseTransformVector(
  transform: ReadonlyTransform2Like,
  vector: ReadonlyVector2Like,
  out?: Vector2,
 ): Vector2 {
  const { cos, sin } = sinCos(-transform.rotation);
  const rotatedX = vector.x * cos - vector.y * sin;
  const rotatedY = vector.x * sin + vector.y * cos;
  const invScaleX = safeDivide(1, transform.scale.x);
  const invScaleY = safeDivide(1, transform.scale.y);
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
  * @since 0.1.0
  */
 public static lerp(
  a: ReadonlyTransform2,
  b: ReadonlyTransform2,
  t: number,
  out?: Transform2,
 ): Transform2 {
  const target = Transform2.ensureOut(out);
  target.position.set(lerp(a.position.x, b.position.x, t), lerp(a.position.y, b.position.y, t));
  target.rotation = lerpAngle(a.rotation, b.rotation, t);
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
  * @since 0.9.0
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
  * const smooth = Transform2.smoothLerp(a, b, 0.5); // Smooth transition
  * ```
  *
  * @category Interpolation
  * @since 0.11.0
  */
 public static smoothLerp(
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
  * @since 0.1.0
  */
 public static exactEquals(a: ReadonlyTransform2, b: ReadonlyTransform2): boolean {
  return (
   a.position.exactEquals(b.position) && a.rotation === b.rotation && a.scale.exactEquals(b.scale)
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
  * @since 0.9.0
  */
 public static nearEquals(
  a: ReadonlyTransform2,
  b: ReadonlyTransform2,
  epsilon: number = EPSILON,
 ): boolean {
  return (
   a.position.nearEquals(b.position, epsilon) &&
   isNearZero(angleDifference(a.rotation, b.rotation), epsilon) &&
   a.scale.nearEquals(b.scale, epsilon)
  );
 }

 /**
  * Tests if a transform is the identity.
  * @param transform - Transform to test
  * @param epsilon - Tolerance (default: EPSILON)
  * @returns True if identity
  *
  * @category Comparison
  * @since 0.1.0
  */
 public static isIdentity(transform: ReadonlyTransform2, epsilon: number = EPSILON): boolean {
  return (
   transform.position.isZero(epsilon) &&
   isNearZero(transform.rotation, epsilon) &&
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
  * @since 0.9.0
  */
 public static isFinite(transform: ReadonlyTransform2): boolean {
  return (
   transform.position.isFinite() &&
   Number.isFinite(transform.rotation) &&
   transform.scale.isFinite()
  );
 }

 /**
  * Tests if any component is NaN.
  * @param transform - Transform to test
  * @returns True if any component is NaN
  *
  * @category Comparison
  * @since 0.9.0
  */
 public static hasNaN(transform: ReadonlyTransform2): boolean {
  return (
   transform.position.hasNaN() || Number.isNaN(transform.rotation) || transform.scale.hasNaN()
  );
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
  * @since 0.11.0
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
  * @since 0.11.0
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
  * @since 0.11.0
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
  * @since 0.1.0
  */
 set(position: ReadonlyVector2Like, rotation: number, scale: ReadonlyVector2Like | number): this {
  const sanitizedPosition = Transform2.sanitizeVector(position, 'Transform2.set:position', 0, 0);
  this.position.set(sanitizedPosition.x, sanitizedPosition.y);
  this.rotation = normalizeRadians(Transform2.sanitizeScalar(rotation, 'Transform2.set:rotation'));
  if (typeof scale === 'number') {
   const sanitizedScale = Transform2.sanitizeScalar(scale, 'Transform2.set:scale');
   this.scale.set(sanitizedScale, sanitizedScale);
  } else {
   const sanitizedScale = Transform2.sanitizeVector(scale, 'Transform2.set:scale', 1, 1);
   this.scale.set(sanitizedScale.x, sanitizedScale.y);
  }
  return this;
 }

 /**
  * Copies values from another transform.
  * @param other - Source transform
  * @returns This for chaining
  *
  * @category Mutator
  * @since 0.1.0
  */
 copy(other: ReadonlyTransform2): this {
  this.position.copy(other.position);
  this.rotation = normalizeRadians(other.rotation);
  this.scale.copy(other.scale);
  return this;
 }

 /**
  * Resets to identity transform.
  * @returns This for chaining
  *
  * @category Mutator
  * @since 0.1.0
  */
 identity(): this {
  this.position.set(0, 0);
  this.rotation = 0;
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
  * @since 0.1.0
  */
 hasUniformScale(epsilon: number = EPSILON): boolean {
  return relativeEquals(this.scale.x, this.scale.y, epsilon);
 }

 /**
  * Tests if scale has negative components.
  * @returns True if any scale component is negative
  *
  * @category Computed
  * @since 0.1.0
  */
 hasNegativeScale(): boolean {
  return this.scale.x < 0 || this.scale.y < 0;
 }

 /**
  * Returns the determinant (scale.x * scale.y).
  * @returns Determinant value
  *
  * @category Computed
  * @since 0.1.0
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
  * @returns Matrix representation
  *
  * @category Conversion
  * @since 0.1.0
  */
 toMatrix(out?: Matrix3): Matrix3 {
  return Matrix3.fromTransform(this.position, this.rotation, this.scale, out);
 }

 /**
  * Sets this transform from a 3x3 matrix.
  * @param matrix - Source matrix
  * @returns This for chaining
  *
  * @category Mutator
  * @since 0.1.0
  */
 fromMatrix(matrix: ReadonlyMatrix3): this {
  Transform2.fromMatrix(matrix, this);
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
  * @since 0.1.0
  */
 transformPoint(point: ReadonlyVector2Like, out?: Vector2): Vector2 {
  const scaledX = point.x * this.scale.x;
  const scaledY = point.y * this.scale.y;
  const { cos, sin } = sinCos(this.rotation);
  return Vector2.fromValues(
   scaledX * cos - scaledY * sin + this.position.x,
   scaledX * sin + scaledY * cos + this.position.y,
   out,
  );
 }

 /**
  * Transforms a vector (ignores translation).
  * @param vector - Vector to transform
  * @param out - Optional output vector
  * @returns Transformed vector
  *
  * @category Transform
  * @since 0.1.0
  */
 transformVector(vector: ReadonlyVector2Like, out?: Vector2): Vector2 {
  const scaledX = vector.x * this.scale.x;
  const scaledY = vector.y * this.scale.y;
  const { cos, sin } = sinCos(this.rotation);
  return Vector2.fromValues(scaledX * cos - scaledY * sin, scaledX * sin + scaledY * cos, out);
 }

 /**
  * Inverse transforms a point.
  * @param point - Point to inverse transform
  * @param out - Optional output vector
  * @returns Inverse transformed point
  *
  * @category Transform
  * @since 0.1.0
  */
 inverseTransformPoint(point: ReadonlyVector2Like, out?: Vector2): Vector2 {
  return Transform2.inverseTransformPoint(this, point, out);
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
  * @since 0.10.0
  */
 inverseTransformVector(vector: ReadonlyVector2Like, out?: Vector2): Vector2 {
  return Transform2.inverseTransformVector(this, vector, out);
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
  * @since 0.9.0
  */
 transformPoints(points: readonly ReadonlyVector2Like[], out: Vector2[] = []): Vector2[] {
  const { cos, sin } = sinCos(this.rotation);
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
  * @since 0.9.0
  */
 transformVectors(vectors: readonly ReadonlyVector2Like[], out: Vector2[] = []): Vector2[] {
  const { cos, sin } = sinCos(this.rotation);
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
  * @since 0.1.0
  */
 multiply(other: ReadonlyTransform2): this {
  const newRotation = normalizeRadians(this.rotation + other.rotation);
  const newScaleX = this.scale.x * other.scale.x;
  const newScaleY = this.scale.y * other.scale.y;

  // Transform the other's position by this transform
  const { cos, sin } = sinCos(this.rotation);
  const scaledX = other.position.x * this.scale.x;
  const scaledY = other.position.y * this.scale.y;
  const newPosX = scaledX * cos - scaledY * sin + this.position.x;
  const newPosY = scaledX * sin + scaledY * cos + this.position.y;

  this.rotation = newRotation;
  this.scale.set(newScaleX, newScaleY);
  this.position.set(newPosX, newPosY);
  return this;
 }

 /**
  * Inverts this transform in place.
  * @returns This for chaining
  *
  * @category Arithmetic
  * @since 0.1.0
  */
 inverse(): this {
  const invScaleX = safeDivide(1, this.scale.x);
  const invScaleY = safeDivide(1, this.scale.y);
  const invRotation = normalizeRadians(-this.rotation);
  const { cos, sin } = sinCos(invRotation);

  // Transform applies: v' = p + R(r) * S(s) * v
  // Inverse should satisfy: T_inv(T(v)) = v
  // T_inv(v) = p_inv + R(-r) * S(1/s) * v
  // Setting T_inv(T(v)) = v requires: p_inv = -R(-r) * S(1/s) * p

  // First scale position by inverse scale
  const scaledPosX = this.position.x * invScaleX;
  const scaledPosY = this.position.y * invScaleY;

  // Then rotate and negate
  const invPosX = -(scaledPosX * cos - scaledPosY * sin);
  const invPosY = -(scaledPosX * sin + scaledPosY * cos);

  this.rotation = invRotation;
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
  * @since 0.1.0
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
  * @since 0.9.0
  */
 nearEquals(other: ReadonlyTransform2, epsilon: number = EPSILON): boolean {
  return Transform2.nearEquals(this, other, epsilon);
 }

 /**
  * Returns true if all components are finite.
  * @returns True if no NaN or Infinity values
  *
  * @category Validation
  * @since 0.9.0
  */
 isFinite(): boolean {
  return Transform2.isFinite(this);
 }

 /**
  * Returns true if any component is NaN.
  * @returns True if any NaN value exists
  *
  * @category Validation
  * @since 0.9.0
  */
 hasNaN(): boolean {
  return Transform2.hasNaN(this);
 }

 /**
  * Tests if this transform is identity.
  * @param epsilon - Tolerance (default: EPSILON)
  * @returns True if identity
  *
  * @category Comparison
  * @since 0.1.0
  */
 isIdentity(epsilon: number = EPSILON): boolean {
  return (
   this.position.isZero(epsilon) &&
   isNearZero(this.rotation, epsilon) &&
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
  * @since 0.1.0
  */
 public get inverted(): Transform2 {
  return Transform2.inverse(this);
 }

 /**
  * Returns the rotation as a unit Vector2 (direction).
  * @returns Direction vector
  *
  * @category Computed
  * @since 0.1.0
  */
 public get direction(): Vector2 {
  const { cos, sin } = sinCos(this.rotation);
  return new Vector2(cos, sin);
 }

 /**
  * Returns the rotation in degrees.
  * @returns Rotation in degrees
  *
  * @category Computed
  * @since 0.1.0
  */
 public get rotationDegrees(): number {
  return this.rotation * RAD_TO_DEG;
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
  * @since 0.1.0
  */
 lerp(other: ReadonlyTransform2, t: number): this {
  this.position.set(
   lerp(this.position.x, other.position.x, t),
   lerp(this.position.y, other.position.y, t),
  );
  this.rotation = lerpAngle(this.rotation, other.rotation, t);
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
  * @since 0.9.0
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
  * @since 0.11.0
  */
 smoothLerp(other: ReadonlyTransform2, t: number): this {
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
  * @since 0.1.0
  */
 toObject(): Transform2Like {
  return {
   position: this.position.toObject(),
   rotation: this.rotation,
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
  * @since 0.9.0
  */
 toArray<T extends ArrayLike<number> & { [index: number]: number }>(
  out?: T,
  offset = 0,
 ): T | [number, number, number, number, number] {
  if (!out) {
   return [this.position.x, this.position.y, this.rotation, this.scale.x, this.scale.y];
  }
  out[offset] = this.position.x;
  out[offset + 1] = this.position.y;
  out[offset + 2] = this.rotation;
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
  * @since 0.1.0
  */
 toJSON(): Transform2Like {
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
  * @since 0.1.0
  */
 toString(precision = 4): string {
  const p = (value: number) => value.toFixed(precision);
  const degrees = this.rotation * RAD_TO_DEG;
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
  * @since 0.1.0
  */
 clone(): Transform2 {
  return new Transform2(this.position, this.rotation, this.scale);
 }
}
