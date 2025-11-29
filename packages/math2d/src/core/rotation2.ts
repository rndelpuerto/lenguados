/**
 * @file core/rotation2.ts
 * @module @lenguados/math2d/core
 * @description Deterministic 2D rotation represented as a unit complex number.
 */

import { lerpAngle } from '../auxiliary/angle/interpolation';
import { normalizeRadians } from '../auxiliary/angle/normalization';
import { angleDifference, sinCos } from '../auxiliary/angle/operations';
import { safeDivide, safeSqrt } from '../auxiliary/numeric/safety';
import { saturate } from '../auxiliary/scalar/arithmetic';
import { isNearZero, nearEquals } from '../auxiliary/scalar/comparison';
import { EPSILON, PI, TAU } from '../auxiliary/scalar/constants';
import { smoothStep } from '../auxiliary/scalar/interpolation';
import { DeterministicMath } from '../deterministic/deterministic-math';
import type { ReadonlyVector2Like } from '../types';
import { NumericalValidator } from '../validation/numerical-validator';

import { Complex, type ReadonlyComplex } from './complex';
import { Vector2 } from './vector2';

export interface Rotation2Like {
 c: number;
 s: number;
}

export type ReadonlyRotation2 = Readonly<Rotation2>;

export class Rotation2 implements Rotation2Like {
 public c: number;
 public s: number;

 constructor(c = 1, s = 0) {
  const normalized = Rotation2.normalizeComponents(c, s);
  this.c = normalized.c;
  this.s = normalized.s;
 }

 private static normalizeComponents(c: number, s: number): Rotation2Like {
  const magnitude = safeSqrt(c * c + s * s);
  if (isNearZero(magnitude)) {
   return { c: 1, s: 0 };
  }
  const inverse = safeDivide(1, magnitude);
  return { c: c * inverse, s: s * inverse };
 }

 private static ensureOut(out?: Rotation2): Rotation2 {
  return out ?? new Rotation2();
 }

 /** Identity rotation (0°). */
 static readonly IDENTITY = Object.freeze(new Rotation2(1, 0)) as ReadonlyRotation2;

 /** 90° counter-clockwise rotation. */
 static readonly QUARTER_TURN = Object.freeze(new Rotation2(0, 1)) as ReadonlyRotation2;

 /** 180° rotation. */
 static readonly HALF_TURN = Object.freeze(new Rotation2(-1, 0)) as ReadonlyRotation2;

 /** 270° counter-clockwise rotation (90° clockwise). */
 static readonly THREE_QUARTER_TURN = Object.freeze(new Rotation2(0, -1)) as ReadonlyRotation2;

 /** 45° rotation (π/4). */
 static readonly EIGHTH_TURN = Object.freeze(Rotation2.fromAngle(PI / 4)) as ReadonlyRotation2;

 /** 30° rotation (π/6). */
 static readonly TWELFTH_TURN = Object.freeze(Rotation2.fromAngle(PI / 6)) as ReadonlyRotation2;

 /** 22.5° rotation (π/8). */
 static readonly SIXTEENTH_TURN = Object.freeze(Rotation2.fromAngle(PI / 8)) as ReadonlyRotation2;

 /** -90° rotation (clockwise quarter turn). */
 static readonly NEGATIVE_QUARTER = Object.freeze(new Rotation2(0, -1)) as ReadonlyRotation2;

 /** 60° rotation (π/3). */
 static readonly SIXTH_TURN = Object.freeze(Rotation2.fromAngle(PI / 3)) as ReadonlyRotation2;

 static fromAngle(angle: number, out?: Rotation2): Rotation2 {
  const sanitized = NumericalValidator.validateFinite(angle, 'Rotation2.fromAngle:angle');
  const normalized = normalizeRadians(sanitized);
  const { cos, sin } = sinCos(normalized);
  return Rotation2.ensureOut(out).set(cos, sin);
 }

 static fromVector(direction: ReadonlyVector2Like, out?: Rotation2): Rotation2 {
  const x = NumericalValidator.validateFinite(direction.x, 'Rotation2.fromVector:x');
  const y = NumericalValidator.validateFinite(direction.y, 'Rotation2.fromVector:y');
  const lengthSquared = x * x + y * y;
  if (isNearZero(lengthSquared)) {
   return Rotation2.ensureOut(out).set(1, 0);
  }
  const inverse = 1 / safeSqrt(lengthSquared);
  return Rotation2.ensureOut(out).set(x * inverse, y * inverse);
 }

 static fromVectors(
  from: ReadonlyVector2Like,
  to: ReadonlyVector2Like,
  out?: Rotation2,
 ): Rotation2 {
  const normFrom = Rotation2.fromVector(from);
  const normTo = Rotation2.fromVector(to);
  return Rotation2.relative(normFrom, normTo, out);
 }

 static fromComplex(complex: ReadonlyComplex, out?: Rotation2): Rotation2 {
  return Rotation2.ensureOut(out).set(complex.real, complex.imag).normalize();
 }

 static fromObject(object: Rotation2Like, out?: Rotation2): Rotation2 {
  const c = NumericalValidator.validateFinite(object.c, 'Rotation2.fromObject:c');
  const s = NumericalValidator.validateFinite(object.s, 'Rotation2.fromObject:s');
  return Rotation2.ensureOut(out).set(c, s);
 }

 static multiply(a: ReadonlyRotation2, b: ReadonlyRotation2, out?: Rotation2): Rotation2 {
  const c = a.c * b.c - a.s * b.s;
  const s = a.s * b.c + a.c * b.s;
  return Rotation2.ensureOut(out).set(c, s);
 }

 static inverse(rotation: ReadonlyRotation2, out?: Rotation2): Rotation2 {
  return Rotation2.ensureOut(out).set(rotation.c, -rotation.s);
 }

 static relative(a: ReadonlyRotation2, b: ReadonlyRotation2, out?: Rotation2): Rotation2 {
  const c = a.c * b.c + a.s * b.s;
  const s = a.c * b.s - a.s * b.c;
  return Rotation2.ensureOut(out).set(c, s);
 }

 /**
  * Applies a rotation to a vector.
  * @param rotation - Rotation to apply
  * @param vector - Vector to rotate
  * @param out - Optional output vector
  * @returns Rotated vector
  *
  * @remarks
  * Mathematically equivalent to `Vector2.rotateCS(vector, rotation.c, rotation.s, out)`.
  * Implemented inline for performance in hot paths.
  */
 static applyToVector(
  rotation: ReadonlyRotation2,
  vector: ReadonlyVector2Like,
  out?: Vector2,
 ): Vector2 {
  return Vector2.fromValues(
   rotation.c * vector.x - rotation.s * vector.y,
   rotation.s * vector.x + rotation.c * vector.y,
   out,
  );
 }

 /**
  * Linear interpolation between two rotations.
  * @param a - Start rotation
  * @param b - End rotation
  * @param t - Interpolation factor [0, 1], clamped
  * @param out - Optional output rotation
  * @returns Interpolated rotation
  */
 static lerp(a: ReadonlyRotation2, b: ReadonlyRotation2, t: number, out?: Rotation2): Rotation2 {
  const clamped = saturate(t);
  const angle = lerpAngle(a.angle(), b.angle(), clamped);
  return Rotation2.fromAngle(angle, out);
 }

 /**
  * Tests if two rotations are approximately equal.
  * @param a - First rotation
  * @param b - Second rotation
  * @param epsilon - Tolerance (default: EPSILON)
  * @returns True if rotations are equivalent
  *
  * @remarks
  * First tries fast component comparison, then falls back to angle comparison
  * using {@link angleDifference} for edge cases near ±180°.
  */
 static equals(a: ReadonlyRotation2, b: ReadonlyRotation2, epsilon: number = EPSILON): boolean {
  // Fast path: direct component comparison
  if (nearEquals(a.c, b.c, epsilon) && nearEquals(a.s, b.s, epsilon)) {
   return true;
  }
  // Slow path: compare angles (handles wrap-around)
  const diff = angleDifference(Rotation2.angle(a), Rotation2.angle(b));
  return isNearZero(diff, epsilon);
 }

 /**
  * Tests if a rotation is the identity.
  * @param rotation - Rotation to test
  * @param epsilon - Tolerance (default: EPSILON)
  * @returns True if rotation is identity
  */
 static isIdentity(rotation: ReadonlyRotation2, epsilon: number = EPSILON): boolean {
  return nearEquals(rotation.c, 1, epsilon) && isNearZero(rotation.s, epsilon);
 }

 /**
  * Returns the angle in radians.
  * @param rotation - Rotation to get angle from
  * @returns Angle in radians
  */
 static angle(rotation: ReadonlyRotation2): number {
  return DeterministicMath.atan2(rotation.s, rotation.c);
 }

 /**
  * Negates a rotation (same as rotating by -angle).
  * @param rotation - Rotation to negate
  * @param out - Optional output rotation
  * @returns Negated rotation
  */
 static negate(rotation: ReadonlyRotation2, out?: Rotation2): Rotation2 {
  return Rotation2.ensureOut(out).set(rotation.c, -rotation.s);
 }

 set(c: number, s: number): this {
  const cc = NumericalValidator.validateFinite(c, 'Rotation2.set:c');
  const ss = NumericalValidator.validateFinite(s, 'Rotation2.set:s');
  const normalized = Rotation2.normalizeComponents(cc, ss);
  this.c = normalized.c;
  this.s = normalized.s;
  return this;
 }

 setAngle(angle: number): this {
  const normalized = normalizeRadians(angle);
  const { cos, sin } = sinCos(normalized);
  this.c = cos;
  this.s = sin;
  return this;
 }

 copy(other: ReadonlyRotation2): this {
  this.c = other.c;
  this.s = other.s;
  return this;
 }

 identity(): this {
  this.c = 1;
  this.s = 0;
  return this;
 }

 angle(): number {
  return DeterministicMath.atan2(this.s, this.c);
 }

 normalize(): this {
  const normalized = Rotation2.normalizeComponents(this.c, this.s);
  this.c = normalized.c;
  this.s = normalized.s;
  return this;
 }

 /**
  * Multiplies with another rotation (composition).
  * @param other - Rotation to multiply by
  * @param out - Optional output rotation
  * @returns Combined rotation
  */
 multiply(other: ReadonlyRotation2, out?: Rotation2): Rotation2 {
  const c = this.c * other.c - this.s * other.s;
  const s = this.s * other.c + this.c * other.s;
  const target = out ?? this;
  return target.set(c, s);
 }

 inverse(out?: Rotation2): Rotation2 {
  const target = out ?? this;
  return target.set(this.c, -this.s);
 }

 relativeTo(other: ReadonlyRotation2, out?: Rotation2): Rotation2 {
  const c = this.c * other.c + this.s * other.s;
  const s = this.c * other.s - this.s * other.c;
  const target = out ?? this;
  return target.set(c, s);
 }

 apply(vector: ReadonlyVector2Like, out?: Vector2): Vector2 {
  return Rotation2.applyToVector(this, vector, out);
 }

 /**
  * Applies the inverse rotation to a vector.
  * @param vector - Vector to rotate inversely
  * @param out - Optional output vector
  * @returns Inversely rotated vector
  *
  * @remarks
  * Mathematically equivalent to `Vector2.rotateCS(vector, this.c, -this.s, out)`.
  * Implemented inline for performance in hot paths.
  */
 applyInverse(vector: ReadonlyVector2Like, out?: Vector2): Vector2 {
  return Vector2.fromValues(
   this.c * vector.x + this.s * vector.y,
   -this.s * vector.x + this.c * vector.y,
   out,
  );
 }

 equals(other: ReadonlyRotation2, epsilon: number = EPSILON): boolean {
  if (nearEquals(this.c, other.c, epsilon) && nearEquals(this.s, other.s, epsilon)) {
   return true;
  }

  if (nearEquals(this.c, -other.c, epsilon) && nearEquals(this.s, -other.s, epsilon)) {
   const diff = angleDifference(this.angle(), other.angle());
   return nearEquals(Math.abs(diff), 0, epsilon) || nearEquals(Math.abs(diff), TAU, epsilon);
  }

  return false;
 }

 isIdentity(epsilon: number = EPSILON): boolean {
  return nearEquals(this.c, 1, epsilon) && isNearZero(this.s, epsilon);
 }

 /* ========================================================================== */
 /* Readonly Getters */
 /* ========================================================================== */

 /**
  * Returns the inverse rotation without modifying this one.
  * @returns New inverted rotation
  */
 public get inversed(): Rotation2 {
  return new Rotation2(this.c, -this.s);
 }

 /**
  * Returns the double of this rotation without modifying it.
  * @returns New rotation with double the angle
  */
 public get doubled(): Rotation2 {
  // cos(2θ) = cos²θ - sin²θ, sin(2θ) = 2·sin·cos
  return new Rotation2(this.c * this.c - this.s * this.s, 2 * this.s * this.c);
 }

 /**
  * Returns the perpendicular rotation (+90°) without modifying this one.
  * @returns New rotation rotated 90° counter-clockwise
  */
 public get perpendicular(): Rotation2 {
  return new Rotation2(-this.s, this.c);
 }

 /**
  * Returns the X-axis direction vector of this rotation.
  * @returns Unit vector pointing in rotation direction
  */
 public get xAxis(): Vector2 {
  return new Vector2(this.c, this.s);
 }

 /**
  * Returns the Y-axis direction vector of this rotation.
  * @returns Unit vector perpendicular to rotation direction
  */
 public get yAxis(): Vector2 {
  return new Vector2(-this.s, this.c);
 }

 /**
  * Returns the negated rotation without modifying this one.
  * Equivalent to rotating by the negative angle.
  * @returns New negated rotation
  */
 public get negated(): Rotation2 {
  return new Rotation2(this.c, -this.s);
 }

 /**
  * Returns the normalized rotation without modifying this one.
  * Since Rotation2 is always kept normalized, this returns a clone.
  * @returns New normalized rotation (clone)
  */
 public get normalized(): Rotation2 {
  return new Rotation2(this.c, this.s);
 }

 /**
  * Returns the angle in radians without method call.
  * @returns Angle in radians
  */
 public get angleValue(): number {
  return DeterministicMath.atan2(this.s, this.c);
 }

 /* ========================================================================== */
 /* Interpolation */
 /* ========================================================================== */

 lerp(other: ReadonlyRotation2, t: number, out?: Rotation2): Rotation2 {
  const clamped = saturate(t);
  const interpolatedAngle = lerpAngle(this.angle(), other.angle(), clamped);
  return Rotation2.fromAngle(interpolatedAngle, out);
 }

 smoothLerp(other: ReadonlyRotation2, t: number, out?: Rotation2): Rotation2 {
  const clamped = saturate(t);
  return this.lerp(other, smoothStep(0, 1, clamped), out);
 }

 static slerp(
  from: ReadonlyRotation2,
  to: ReadonlyRotation2,
  t: number,
  out?: Rotation2,
 ): Rotation2 {
  const clamped = saturate(t);
  const angle = lerpAngle(from.angle(), to.angle(), clamped);
  return Rotation2.fromAngle(angle, out);
 }

 /**
  * Spherical linear interpolation with another rotation.
  * @param other - Target rotation.
  * @param t - Interpolation factor [0, 1].
  * @param out - Optional output rotation.
  * @returns Interpolated rotation.
  */
 slerp(other: ReadonlyRotation2, t: number, out?: Rotation2): Rotation2 {
  return Rotation2.slerp(this, other, t, out);
 }

 /* ========================================================================== */
 /* Conversion */
 /* ========================================================================== */

 /**
  * Converts the rotation to a complex number.
  * @param out - Optional output complex number
  * @returns Complex representation of the rotation
  *
  * @example
  * ```typescript
  * const r = Rotation2.fromAngle(Math.PI / 4);
  * const c = r.toComplex();
  * // c.real ≈ 0.7071, c.imag ≈ 0.7071
  * ```
  */
 toComplex(out?: Complex): Complex {
  const target = out ?? new Complex();
  return target.set(this.c, this.s);
 }

 /**
  * Converts the rotation to a unit vector.
  * @param out - Optional output vector
  * @returns Vector2 pointing in the rotation direction
  *
  * @example
  * ```typescript
  * const r = Rotation2.fromAngle(Math.PI / 2);
  * const v = r.toVector();
  * // v.x ≈ 0, v.y ≈ 1
  * ```
  */
 toVector(out?: Vector2): Vector2 {
  return Vector2.fromValues(this.c, this.s, out);
 }

 /* ========================================================================== */
 /* Serialization */
 /* ========================================================================== */

 /**
  * Converts the rotation to a tuple [c, s].
  * @returns Tuple with cosine and sine components
  *
  * @example
  * ```typescript
  * const r = Rotation2.fromAngle(Math.PI / 4);
  * const [c, s] = r.toArray();
  * ```
  */
 toArray(): [number, number] {
  return [this.c, this.s];
 }

 /**
  * Converts the rotation to a plain object.
  * @returns Object with c (cosine) and s (sine) properties
  *
  * @example
  * ```typescript
  * const r = Rotation2.fromAngle(Math.PI / 2);
  * const obj = r.toObject();
  * // { c: 0, s: 1 }
  * ```
  */
 toObject(): Rotation2Like {
  return { c: this.c, s: this.s };
 }

 /**
  * Converts the rotation to a JSON-serializable object.
  * Called automatically by JSON.stringify().
  * @returns Object suitable for JSON serialization
  *
  * @example
  * ```typescript
  * const r = Rotation2.fromAngle(Math.PI / 2);
  * const json = JSON.stringify(r);
  * // '{"c":0,"s":1}'
  * ```
  */
 toJSON(): Rotation2Like {
  return this.toObject();
 }

 /**
  * Creates a human-readable string representation.
  * Shows the angle in degrees for clarity.
  * @param precision - Number of decimal places (default: 4)
  * @returns Formatted string
  *
  * @example
  * ```typescript
  * const r = Rotation2.fromAngle(Math.PI / 2);
  * console.log(r.toString());
  * // "Rotation2(90.0000°)"
  * ```
  */
 toString(precision = 4): string {
  const degrees = this.angle() * (180 / PI);
  return `Rotation2(${degrees.toFixed(precision)}°)`;
 }

 /**
  * Creates a deep copy of this rotation.
  * @returns New Rotation2 with identical values
  *
  * @example
  * ```typescript
  * const r = Rotation2.fromAngle(Math.PI / 4);
  * const copy = r.clone();
  * copy.identity(); // Original unchanged
  * ```
  */
 clone(): Rotation2 {
  return new Rotation2(this.c, this.s);
 }
}
