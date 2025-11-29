/**
 * @file core/transform2.ts
 * @module @lenguados/math2d/core
 * @description Deterministic 2D transform combining translation, rotation, and scale.
 */

import { lerpAngle } from '../auxiliary/angle/interpolation';
import { normalizeRadians } from '../auxiliary/angle/normalization';
import { sinCos } from '../auxiliary/angle/operations';
import { safeDivide } from '../auxiliary/numeric/safety';
import { saturate } from '../auxiliary/scalar/arithmetic';
import { isNearZero, nearEquals } from '../auxiliary/scalar/comparison';
import { EPSILON } from '../auxiliary/scalar/constants';
import { lerp } from '../auxiliary/scalar/interpolation';
import type { ReadonlyVector2Like, Transform2Like } from '../types';
import { NumericalValidator } from '../validation/numerical-validator';

import { Matrix3, type ReadonlyMatrix3 } from './matrix3';
import { type ReadonlyRotation2 } from './rotation2';
import { Vector2, type ReadonlyVector2 } from './vector2';

export type { Transform2Like } from '../types';

export type ReadonlyTransform2 = Readonly<Transform2> & {
 readonly position: ReadonlyVector2;
 readonly scale: ReadonlyVector2;
};

/**
 * Decomposed 2D affine transform applied in Scale → Rotate → Translate order.
 */
export class Transform2 {
 public readonly position: Vector2;
 public rotation: number;
 public readonly scale: Vector2;

 /** Identity transform (no transformation). */
 static readonly IDENTITY = Object.freeze(new Transform2()) as ReadonlyTransform2;

 /** Flip horizontally (scale.x = -1). */
 static readonly FLIP_X = Object.freeze(
  new Transform2(undefined, 0, { x: -1, y: 1 }),
 ) as ReadonlyTransform2;

 /** Flip vertically (scale.y = -1). */
 static readonly FLIP_Y = Object.freeze(
  new Transform2(undefined, 0, { x: 1, y: -1 }),
 ) as ReadonlyTransform2;

 constructor(position?: ReadonlyVector2Like, rotation = 0, scale?: ReadonlyVector2Like) {
  const initialPosition = Transform2.sanitizeVector(
   position,
   'Transform2.constructor:position',
   0,
   0,
  );
  const initialScale = Transform2.sanitizeVector(scale, 'Transform2.constructor:scale', 1, 1);
  this.position = new Vector2(initialPosition.x, initialPosition.y);
  this.rotation = normalizeRadians(
   NumericalValidator.validateFinite(rotation, 'Transform2.constructor:rotation'),
  );
  this.scale = new Vector2(initialScale.x, initialScale.y);
 }

 private static sanitizeVector(
  vector: ReadonlyVector2Like | undefined,
  label: string,
  fallbackX: number,
  fallbackY: number,
 ): { x: number; y: number } {
  return {
   x: NumericalValidator.validateFinite(vector?.x ?? fallbackX, `${label}.x`),
   y: NumericalValidator.validateFinite(vector?.y ?? fallbackY, `${label}.y`),
  };
 }

 private static sanitizeScalar(value: number, label: string): number {
  return NumericalValidator.validateFinite(value, label);
 }

 /* ========================================================================== */
 /* Factories */
 /* ========================================================================== */

 static fromValues(
  x: number,
  y: number,
  rotation: number,
  scaleX: number,
  scaleY: number,
  out?: Transform2,
 ): Transform2 {
  const target = out ?? new Transform2();
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

 static fromMatrix(matrix: ReadonlyMatrix3, out?: Transform2): Transform2 {
  const target = out ?? new Transform2();
  matrix.getTranslation(target.position);
  matrix.getScale(target.scale);
  target.rotation = normalizeRadians(matrix.getRotation());
  return target;
 }

 static fromComponents(
  position: ReadonlyVector2Like,
  rotation: number | ReadonlyRotation2,
  scale: ReadonlyVector2Like | number,
  out?: Transform2,
 ): Transform2 {
  const target = out ?? new Transform2();
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

 static fromObject(object: Transform2Like, out?: Transform2): Transform2 {
  const target = out ?? new Transform2();
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

 /* ========================================================================== */
 /* Static Operations */
 /* ========================================================================== */

 /**
  * Multiplies two transforms.
  * @param a - First transform
  * @param b - Second transform
  * @param out - Optional output transform
  * @returns Combined transform
  */
 static multiply(a: ReadonlyTransform2, b: ReadonlyTransform2, out?: Transform2): Transform2 {
  const target = out ?? new Transform2();
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
  */
 static inverse(transform: ReadonlyTransform2, out?: Transform2): Transform2 {
  const target = out ?? new Transform2();
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

 /**
  * Linear interpolation between two transforms.
  * @param a - Start transform
  * @param b - End transform
  * @param t - Interpolation factor [0, 1], clamped
  * @param out - Optional output transform
  * @returns Interpolated transform
  */
 static lerp(
  a: ReadonlyTransform2,
  b: ReadonlyTransform2,
  t: number,
  out?: Transform2,
 ): Transform2 {
  const clamped = saturate(t);
  const target = out ?? new Transform2();
  target.position.set(
   lerp(a.position.x, b.position.x, clamped),
   lerp(a.position.y, b.position.y, clamped),
  );
  target.rotation = lerpAngle(a.rotation, b.rotation, clamped);
  target.scale.set(lerp(a.scale.x, b.scale.x, clamped), lerp(a.scale.y, b.scale.y, clamped));
  return target;
 }

 /**
  * Tests if two transforms are approximately equal.
  * @param a - First transform
  * @param b - Second transform
  * @param epsilon - Tolerance (default: EPSILON)
  * @returns True if equal
  */
 static equals(a: ReadonlyTransform2, b: ReadonlyTransform2, epsilon: number = EPSILON): boolean {
  return (
   a.position.nearEquals(b.position, epsilon) &&
   nearEquals(a.rotation, b.rotation, epsilon) &&
   a.scale.nearEquals(b.scale, epsilon)
  );
 }

 /**
  * Tests if a transform is the identity.
  * @param transform - Transform to test
  * @param epsilon - Tolerance (default: EPSILON)
  * @returns True if identity
  */
 static isIdentity(transform: ReadonlyTransform2, epsilon: number = EPSILON): boolean {
  return (
   transform.position.isZero(epsilon) &&
   isNearZero(transform.rotation, epsilon) &&
   nearEquals(transform.scale.x, 1, epsilon) &&
   nearEquals(transform.scale.y, 1, epsilon)
  );
 }

 /* ========================================================================== */
 /* State manipulation */
 /* ========================================================================== */

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

 copy(other: ReadonlyTransform2): this {
  this.position.copy(other.position);
  this.rotation = normalizeRadians(other.rotation);
  this.scale.copy(other.scale);
  return this;
 }

 identity(): this {
  this.position.set(0, 0);
  this.rotation = 0;
  this.scale.set(1, 1);
  return this;
 }

 hasUniformScale(epsilon: number = EPSILON): boolean {
  return nearEquals(this.scale.x, this.scale.y, epsilon);
 }

 hasNegativeScale(): boolean {
  return this.scale.x < 0 || this.scale.y < 0;
 }

 determinant(): number {
  return this.scale.x * this.scale.y;
 }

 /* ========================================================================== */
 /* Matrix conversion */
 /* ========================================================================== */

 toMatrix(out?: Matrix3): Matrix3 {
  return Matrix3.fromTransform(this.position, this.rotation, this.scale, out);
 }

 fromMatrix(matrix: ReadonlyMatrix3): this {
  Transform2.fromMatrix(matrix, this);
  return this;
 }

 /* ========================================================================== */
 /* Transform application */
 /* ========================================================================== */

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

 transformVector(vector: ReadonlyVector2Like, out?: Vector2): Vector2 {
  const scaledX = vector.x * this.scale.x;
  const scaledY = vector.y * this.scale.y;
  const { cos, sin } = sinCos(this.rotation);
  return Vector2.fromValues(scaledX * cos - scaledY * sin, scaledX * sin + scaledY * cos, out);
 }

 inverseTransformPoint(point: ReadonlyVector2Like, out?: Vector2): Vector2 {
  const tx = point.x - this.position.x;
  const ty = point.y - this.position.y;
  const { cos, sin } = sinCos(-this.rotation);
  const rotatedX = tx * cos - ty * sin;
  const rotatedY = tx * sin + ty * cos;
  const invScaleX = safeDivide(1, this.scale.x);
  const invScaleY = safeDivide(1, this.scale.y);
  return Vector2.fromValues(rotatedX * invScaleX, rotatedY * invScaleY, out);
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
  * @category Batch Operations
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
  * @category Batch Operations
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

 /* ========================================================================== */
 /* Operations */
 /* ========================================================================== */

 /**
  * Multiplies with another transform (composition).
  * @param other - Transform to multiply by
  * @param out - Optional output transform
  * @returns Combined transform
  */
 multiply(other: ReadonlyTransform2, out?: Transform2): Transform2 {
  const rotation = normalizeRadians(this.rotation + other.rotation);
  const scaleX = this.scale.x * other.scale.x;
  const scaleY = this.scale.y * other.scale.y;
  const composedPosition = this.transformPoint(other.position, new Vector2());
  const target = out ?? this;
  target.rotation = rotation;
  target.scale.set(scaleX, scaleY);
  target.position.copy(composedPosition);
  return target;
 }

 /**
  * Computes the inverse transform.
  * @param out - Optional output transform
  * @returns Inverse transform
  */
 inverse(out?: Transform2): Transform2 {
  const target = out ?? this;
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

  target.rotation = invRotation;
  target.scale.set(invScaleX, invScaleY);
  target.position.set(invPosX, invPosY);
  return target;
 }

 equals(other: ReadonlyTransform2, epsilon: number = EPSILON): boolean {
  return (
   this.position.nearEquals(other.position, epsilon) &&
   nearEquals(this.rotation, other.rotation, epsilon) &&
   this.scale.nearEquals(other.scale, epsilon)
  );
 }

 isIdentity(epsilon: number = EPSILON): boolean {
  return (
   this.position.isZero(epsilon) &&
   isNearZero(this.rotation, epsilon) &&
   nearEquals(this.scale.x, 1, epsilon) &&
   nearEquals(this.scale.y, 1, epsilon)
  );
 }

 /* ========================================================================== */
 /* Readonly Getters */
 /* ========================================================================== */

 /**
  * Returns the inverse without modifying this transform.
  * @returns New inverse transform
  */
 public get inverted(): Transform2 {
  return Transform2.inverse(this);
 }

 /**
  * Returns the rotation as a unit Vector2 (direction).
  * @returns Direction vector
  */
 public get direction(): Vector2 {
  const { cos, sin } = sinCos(this.rotation);
  return new Vector2(cos, sin);
 }

 /**
  * Returns the rotation in degrees.
  * @returns Rotation in degrees
  */
 public get rotationDegrees(): number {
  return this.rotation * (180 / Math.PI);
 }

 /* ========================================================================== */
 /* Interpolation */
 /* ========================================================================== */

 lerp(other: ReadonlyTransform2, t: number, out?: Transform2): Transform2 {
  const clamped = saturate(t);
  const target = out ?? this;
  target.position.set(
   lerp(this.position.x, other.position.x, clamped),
   lerp(this.position.y, other.position.y, clamped),
  );
  target.rotation = lerpAngle(this.rotation, other.rotation, clamped);
  target.scale.set(
   lerp(this.scale.x, other.scale.x, clamped),
   lerp(this.scale.y, other.scale.y, clamped),
  );
  return target;
 }

 /* ========================================================================== */
 /* Serialization */
 /* ========================================================================== */

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
  */
 toObject(): Transform2Like {
  return {
   position: this.position.toObject(),
   rotation: this.rotation,
   scale: this.scale.toObject(),
  };
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
  */
 toJSON(): Transform2Like {
  return this.toObject();
 }

 /**
  * Creates a human-readable string representation.
  * Shows position, rotation (in degrees), and scale.
  * @param precision - Number of decimal places (default: 2)
  * @returns Formatted string
  *
  * @example
  * ```typescript
  * const t = new Transform2();
  * t.position.set(100, 50);
  * t.rotation = Math.PI / 4;
  * console.log(t.toString());
  * // "Transform2(pos: (100.00, 50.00), rot: 45.00°, scale: (1.00, 1.00))"
  * ```
  */
 toString(precision = 2): string {
  const p = (value: number) => value.toFixed(precision);
  const degrees = this.rotation * (180 / Math.PI);
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
  */
 clone(): Transform2 {
  return new Transform2(this.position, this.rotation, this.scale);
 }
}
