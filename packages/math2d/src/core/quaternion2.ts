/**
 * @file core/quaternion2.ts
 * @module @lenguados/math2d/core
 * @description Deterministic quaternion wrapper for 2D rotations.
 */

import { sinCos } from '../auxiliary/angle/operations';
import { safeAcos, safeDivide, safeSqrt } from '../auxiliary/numeric/safety';
import { saturate } from '../auxiliary/scalar/arithmetic';
import { isNearZero, nearEquals } from '../auxiliary/scalar/comparison';
import { EPSILON, PI } from '../auxiliary/scalar/constants';
import { lerp } from '../auxiliary/scalar/interpolation';
import { DeterministicMath } from '../deterministic/deterministic-math';
import type { Quaternion2Like } from '../types';
import { NumericalValidator } from '../validation/numerical-validator';

import { Complex, type ReadonlyComplex } from './complex';
import { Matrix2 } from './matrix2';
import { Rotation2, type ReadonlyRotation2 } from './rotation2';

export type ReadonlyQuaternion2 = Readonly<Quaternion2>;

export class Quaternion2 implements Quaternion2Like {
 public w: number;
 public z: number;

 private static ensureOut(out?: Quaternion2): Quaternion2 {
  return out ?? new Quaternion2();
 }

 private static sanitize(value: number, label: string): number {
  return NumericalValidator.validateFinite(value, label);
 }

 /** Identity quaternion (no rotation). */
 static readonly IDENTITY = Object.freeze(new Quaternion2(1, 0)) as ReadonlyQuaternion2;

 /** 90° rotation (quarter turn). */
 static readonly QUARTER_TURN = Object.freeze(Quaternion2.fromAngle(PI / 2)) as ReadonlyQuaternion2;

 /** 180° rotation (half turn). */
 static readonly HALF_TURN = Object.freeze(new Quaternion2(0, 1)) as ReadonlyQuaternion2;

 /** 270° rotation (three quarter turn). */
 static readonly THREE_QUARTER_TURN = Object.freeze(
  Quaternion2.fromAngle((3 * PI) / 2),
 ) as ReadonlyQuaternion2;

 constructor(w = 1, z = 0) {
  this.w = 1;
  this.z = 0;
  this.set(w, z);
 }

 static fromAngle(angle: number, out?: Quaternion2): Quaternion2 {
  const sanitizedAngle = this.sanitize(angle, 'Quaternion2.fromAngle:angle');
  const half = sanitizedAngle * 0.5;
  const { cos, sin } = sinCos(half);
  return this.ensureOut(out).set(cos, sin);
 }

 static fromRotation2(rotation: ReadonlyRotation2, out?: Quaternion2): Quaternion2 {
  return Quaternion2.fromAngle(rotation.angle(), out);
 }

 static fromComplex(complex: ReadonlyComplex, out?: Quaternion2): Quaternion2 {
  return Quaternion2.fromAngle(complex.argument(), out);
 }

 static fromObject(object: Quaternion2Like, out?: Quaternion2): Quaternion2 {
  return Quaternion2.ensureOut(out).set(
   this.sanitize(object.w, 'Quaternion2.fromObject:w'),
   this.sanitize(object.z, 'Quaternion2.fromObject:z'),
  );
 }

 /* ========================================================================== */
 /* Static Operations */
 /* ========================================================================== */

 /**
  * Multiplies two quaternions.
  * @param a - First quaternion
  * @param b - Second quaternion
  * @param out - Optional output quaternion
  * @returns Product
  */
 static multiply(a: ReadonlyQuaternion2, b: ReadonlyQuaternion2, out?: Quaternion2): Quaternion2 {
  return Quaternion2.ensureOut(out).set(a.w * b.w - a.z * b.z, a.w * b.z + a.z * b.w);
 }

 /**
  * Calculates the inverse of a quaternion.
  * @param quaternion - Quaternion to invert
  * @param out - Optional output quaternion
  * @returns Inverse
  */
 static inverse(quaternion: ReadonlyQuaternion2, out?: Quaternion2): Quaternion2 {
  const magSq = quaternion.w * quaternion.w + quaternion.z * quaternion.z;
  if (nearEquals(magSq, 1)) {
   return Quaternion2.ensureOut(out).set(quaternion.w, -quaternion.z);
  }
  const invMagSq = safeDivide(1, magSq);
  return Quaternion2.ensureOut(out).set(quaternion.w * invMagSq, -quaternion.z * invMagSq);
 }

 /**
  * Spherical linear interpolation between two quaternions.
  * Uses deterministic math functions.
  * @param a - Start quaternion
  * @param b - End quaternion
  * @param t - Interpolation factor [0, 1], clamped
  * @param out - Optional output quaternion
  * @returns Interpolated quaternion
  */
 static slerp(
  a: ReadonlyQuaternion2,
  b: ReadonlyQuaternion2,
  t: number,
  out?: Quaternion2,
 ): Quaternion2 {
  const clamped = saturate(t);
  let cosTheta = a.w * b.w + a.z * b.z;
  let targetW = b.w;
  let targetZ = b.z;

  if (cosTheta < 0) {
   cosTheta = -cosTheta;
   targetW = -targetW;
   targetZ = -targetZ;
  }

  // Use linear interpolation for very close quaternions
  if (cosTheta > 0.9999) {
   const w = a.w + clamped * (targetW - a.w);
   const z = a.z + clamped * (targetZ - a.z);
   return Quaternion2.ensureOut(out).set(w, z);
  }

  const theta = safeAcos(cosTheta);
  const sinTheta = DeterministicMath.sin(theta);
  const weightA = DeterministicMath.sin((1 - clamped) * theta) / sinTheta;
  const weightB = DeterministicMath.sin(clamped * theta) / sinTheta;
  const w = a.w * weightA + targetW * weightB;
  const z = a.z * weightA + targetZ * weightB;
  return Quaternion2.ensureOut(out).set(w, z);
 }

 /**
  * Linear interpolation between two quaternions.
  * @param a - Start quaternion
  * @param b - End quaternion
  * @param t - Interpolation factor [0, 1], clamped
  * @param out - Optional output quaternion
  * @returns Interpolated quaternion (normalized)
  */
 static lerp(
  a: ReadonlyQuaternion2,
  b: ReadonlyQuaternion2,
  t: number,
  out?: Quaternion2,
 ): Quaternion2 {
  const clamped = saturate(t);
  const w = lerp(a.w, b.w, clamped);
  const z = lerp(a.z, b.z, clamped);
  return Quaternion2.ensureOut(out).set(w, z);
 }

 /**
  * Tests if two quaternions are approximately equal.
  * @param a - First quaternion
  * @param b - Second quaternion
  * @param epsilon - Tolerance (default: EPSILON)
  * @returns True if equal
  */
 static equals(a: ReadonlyQuaternion2, b: ReadonlyQuaternion2, epsilon: number = EPSILON): boolean {
  if (nearEquals(a.w, b.w, epsilon) && nearEquals(a.z, b.z, epsilon)) {
   return true;
  }
  // Quaternions represent same rotation if negated
  if (nearEquals(a.w, -b.w, epsilon) && nearEquals(a.z, -b.z, epsilon)) {
   return true;
  }
  return false;
 }

 /**
  * Tests if a quaternion is the identity.
  * @param quaternion - Quaternion to test
  * @param epsilon - Tolerance (default: EPSILON)
  * @returns True if identity
  */
 static isIdentity(quaternion: ReadonlyQuaternion2, epsilon: number = EPSILON): boolean {
  return nearEquals(quaternion.w, 1, epsilon) && isNearZero(quaternion.z, epsilon);
 }

 /**
  * Returns the angle in radians.
  * @param quaternion - Quaternion to get angle from
  * @returns Angle in radians
  */
 static angle(quaternion: ReadonlyQuaternion2): number {
  return 2 * DeterministicMath.atan2(quaternion.z, quaternion.w);
 }

 /**
  * Returns the conjugate of a quaternion.
  * @param quaternion - Quaternion to conjugate
  * @param out - Optional output quaternion
  * @returns Conjugate
  */
 static conjugate(quaternion: ReadonlyQuaternion2, out?: Quaternion2): Quaternion2 {
  return Quaternion2.ensureOut(out).set(quaternion.w, -quaternion.z);
 }

 /**
  * Returns the dot product of two quaternions.
  * @param a - First quaternion
  * @param b - Second quaternion
  * @returns Dot product
  */
 static dot(a: ReadonlyQuaternion2, b: ReadonlyQuaternion2): number {
  return a.w * b.w + a.z * b.z;
 }

 /**
  * Returns the squared magnitude of a quaternion.
  * @param quaternion - Quaternion
  * @returns Squared magnitude
  */
 static magnitudeSq(quaternion: ReadonlyQuaternion2): number {
  return quaternion.w * quaternion.w + quaternion.z * quaternion.z;
 }

 /**
  * Returns the magnitude of a quaternion.
  * @param quaternion - Quaternion
  * @returns Magnitude
  */
 static magnitude(quaternion: ReadonlyQuaternion2): number {
  return safeSqrt(Quaternion2.magnitudeSq(quaternion));
 }

 /**
  * Normalizes a quaternion to unit length.
  * @param quaternion - Quaternion
  * @param out - Optional output quaternion
  * @returns Normalized quaternion
  */
 static normalize(quaternion: ReadonlyQuaternion2, out?: Quaternion2): Quaternion2 {
  const mag = Quaternion2.magnitude(quaternion);
  if (isNearZero(mag - 1)) {
   return Quaternion2.ensureOut(out).set(quaternion.w, quaternion.z);
  }
  const invMag = safeDivide(1, mag);
  return Quaternion2.ensureOut(out).set(quaternion.w * invMag, quaternion.z * invMag);
 }

 /**
  * Negates a quaternion.
  * @param quaternion - Quaternion
  * @param out - Optional output quaternion
  * @returns Negated quaternion
  */
 static negate(quaternion: ReadonlyQuaternion2, out?: Quaternion2): Quaternion2 {
  return Quaternion2.ensureOut(out).set(-quaternion.w, -quaternion.z);
 }

 /* ========================================================================== */
 /* Instance Methods */
 /* ========================================================================== */

 set(w: number, z: number): this {
  const sanitizedW = Quaternion2.sanitize(w, 'Quaternion2.set:w');
  const sanitizedZ = Quaternion2.sanitize(z, 'Quaternion2.set:z');
  const magnitude = safeSqrt(sanitizedW * sanitizedW + sanitizedZ * sanitizedZ);
  if (isNearZero(magnitude)) {
   this.w = 1;
   this.z = 0;
   return this;
  }
  const invMag = safeDivide(1, magnitude);
  this.w = sanitizedW * invMag;
  this.z = sanitizedZ * invMag;
  return this;
 }

 setAngle(angle: number): this {
  const half = angle * 0.5;
  const { cos, sin } = sinCos(half);
  this.w = cos;
  this.z = sin;
  return this;
 }

 copy(other: ReadonlyQuaternion2): this {
  this.w = other.w;
  this.z = other.z;
  return this;
 }

 identity(): this {
  this.w = 1;
  this.z = 0;
  return this;
 }

 angle(): number {
  return 2 * DeterministicMath.atan2(this.z, this.w);
 }

 normalize(): this {
  const mag = safeSqrt(this.w * this.w + this.z * this.z);
  if (!isNearZero(mag - 1)) {
   const invMag = safeDivide(1, mag);
   this.w *= invMag;
   this.z *= invMag;
  }
  return this;
 }

 magnitudeSq(): number {
  return this.w * this.w + this.z * this.z;
 }

 magnitude(): number {
  return safeSqrt(this.magnitudeSq());
 }

 /**
  * Multiplies with another quaternion (composition).
  * @param other - Quaternion to multiply by
  * @param out - Optional output quaternion
  * @returns Product quaternion
  */
 multiply(other: ReadonlyQuaternion2, out?: Quaternion2): Quaternion2 {
  return Quaternion2.ensureOut(out).set(
   this.w * other.w - this.z * other.z,
   this.w * other.z + this.z * other.w,
  );
 }

 conjugate(out?: Quaternion2): Quaternion2 {
  return Quaternion2.ensureOut(out).set(this.w, -this.z);
 }

 /**
  * Returns the inverse of this quaternion.
  * @param out - Optional output quaternion
  * @returns Inverse quaternion
  *
  * @remarks
  * Delegates to {@link Quaternion2.inverse} for the computation.
  */
 inverse(out?: Quaternion2): Quaternion2 {
  return Quaternion2.inverse(this, out);
 }

 toRotation2(out?: Rotation2): Rotation2 {
  return Rotation2.fromAngle(this.angle(), out);
 }

 toComplex(out?: Complex): Complex {
  return Complex.fromPolar(1, this.angle(), out);
 }

 /**
  * Converts the quaternion to a 2D rotation matrix.
  * @param out - Optional output matrix
  * @returns Rotation matrix
  */
 toMatrix2(out?: Matrix2): Matrix2 {
  return Matrix2.fromRotation(this.angle(), out);
 }

 equals(other: ReadonlyQuaternion2, epsilon: number = EPSILON): boolean {
  if (nearEquals(this.w, other.w, epsilon) && nearEquals(this.z, other.z, epsilon)) {
   return true;
  }
  if (nearEquals(this.w, -other.w, epsilon) && nearEquals(this.z, -other.z, epsilon)) {
   return true;
  }
  return false;
 }

 isIdentity(epsilon: number = EPSILON): boolean {
  return nearEquals(this.w, 1, epsilon) && isNearZero(this.z, epsilon);
 }

 /* ========================================================================== */
 /* Readonly Getters */
 /* ========================================================================== */

 /**
  * Returns the conjugate without modifying this quaternion.
  * @returns New conjugate quaternion
  */
 public get conjugated(): Quaternion2 {
  return new Quaternion2(this.w, -this.z);
 }

 /**
  * Returns the inverse without modifying this quaternion.
  * @returns New inverse quaternion
  */
 public get inversed(): Quaternion2 {
  const magSq = this.magnitudeSq();
  if (nearEquals(magSq, 1)) {
   return new Quaternion2(this.w, -this.z);
  }
  const invMagSq = safeDivide(1, magSq);
  return new Quaternion2(this.w * invMagSq, -this.z * invMagSq);
 }

 /**
  * Returns the double rotation without modifying this quaternion.
  * @returns New quaternion with double the angle
  */
 public get doubled(): Quaternion2 {
  // q² = (w² - z², 2wz)
  return new Quaternion2(this.w * this.w - this.z * this.z, 2 * this.w * this.z);
 }

 /* ========================================================================== */
 /* Interpolation */
 /* ========================================================================== */

 /**
  * Spherical linear interpolation with another quaternion.
  * Uses deterministic math functions.
  * @param other - Target quaternion
  * @param t - Interpolation factor [0, 1], clamped
  * @param out - Optional output quaternion
  * @returns Interpolated quaternion
  */
 slerp(other: ReadonlyQuaternion2, t: number, out?: Quaternion2): Quaternion2 {
  return Quaternion2.slerp(this, other, t, out);
 }

 /**
  * Linear interpolation with another quaternion.
  * @param other - Target quaternion
  * @param t - Interpolation factor [0, 1], clamped
  * @param out - Optional output quaternion
  * @returns Interpolated quaternion (normalized)
  */
 lerp(other: ReadonlyQuaternion2, t: number, out?: Quaternion2): Quaternion2 {
  return Quaternion2.lerp(this, other, t, out);
 }

 /* ========================================================================== */
 /* Serialization */
 /* ========================================================================== */

 /**
  * Converts the quaternion to a tuple [w, z].
  * @returns Tuple with w and z components
  *
  * @example
  * ```typescript
  * const q = Quaternion2.fromAngle(Math.PI / 2);
  * const [w, z] = q.toArray();
  * ```
  */
 toArray(): [number, number] {
  return [this.w, this.z];
 }

 /**
  * Converts the quaternion to a plain object.
  * @returns Object with w and z properties
  *
  * @example
  * ```typescript
  * const q = Quaternion2.fromAngle(Math.PI / 2);
  * const obj = q.toObject();
  * // { w: 0.7071, z: 0.7071 }
  * ```
  */
 toObject(): Quaternion2Like {
  return { w: this.w, z: this.z };
 }

 /**
  * Converts the quaternion to a JSON-serializable object.
  * Called automatically by JSON.stringify().
  * @returns Object suitable for JSON serialization
  *
  * @example
  * ```typescript
  * const q = Quaternion2.fromAngle(Math.PI / 2);
  * const json = JSON.stringify(q);
  * // '{"w":0.7071,"z":0.7071}'
  * ```
  */
 toJSON(): Quaternion2Like {
  return this.toObject();
 }

 /**
  * Creates a human-readable string representation.
  * Shows angle in degrees and raw w, z components.
  * @param precision - Number of decimal places (default: 4)
  * @returns Formatted string
  *
  * @example
  * ```typescript
  * const q = Quaternion2.fromAngle(Math.PI / 2);
  * console.log(q.toString());
  * // "Quaternion2(90.0000° | w: 0.7071, z: 0.7071)"
  * ```
  */
 toString(precision = 4): string {
  const angle = this.angle() * (180 / Math.PI);
  return `Quaternion2(${angle.toFixed(precision)}° | w: ${this.w.toFixed(precision)}, z: ${this.z.toFixed(precision)})`;
 }

 /**
  * Creates a deep copy of this quaternion.
  * @returns New Quaternion2 with identical values
  *
  * @example
  * ```typescript
  * const q = Quaternion2.fromAngle(Math.PI / 4);
  * const copy = q.clone();
  * copy.identity(); // Original unchanged
  * ```
  */
 clone(): Quaternion2 {
  return new Quaternion2(this.w, this.z);
 }
}
