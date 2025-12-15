/**
 * @file core/rotation2.ts
 * @module @lenguados/math2d/core
 * @description Deterministic 2D rotation for physics simulations.
 *
 * @remarks
 * ## Design Pattern: Box2D b2Rot
 *
 * This class follows the proven design from Box2D physics engine:
 * - Stores rotation as `(cos θ, sin θ)` instead of angle
 * - Avoids repeated trigonometric calls
 * - Enables efficient rotation composition via complex multiplication
 * - Used by: Box2D, Planck.js, Rapier2D
 *
 * ## Why (cos, sin) Instead of Angle?
 *
 * | Operation | With angle | With (cos, sin) |
 * |-----------|------------|-----------------|
 * | Rotate vector | sin/cos call | 2 multiplies |
 * | Compose rotations | angle add + normalize | 4 multiplies |
 * | Get angle | direct | atan2 call |
 *
 * For physics simulations that rotate many vectors per frame,
 * storing (cos, sin) is significantly faster.
 *
 * ## Rotation2 vs Complex
 *
 * {@link Rotation2} is a **unit complex number** optimized for rotations:
 * - Always normalized: `cos² + sin² = 1`
 * - Use Rotation2 for: physics bodies, sprites, transforms
 * - Use {@link Complex} for: Fourier, roots, exponentials
 *
 * @example
 * ```typescript
 * // Create rotation
 * const rot = Rotation2.fromAngle(Math.PI / 4); // 45°
 *
 * // Rotate a vector (efficient: no trig calls)
 * const v = new Vector2(1, 0);
 * const rotated = rot.rotateVector(v); // (0.707, 0.707)
 *
 * // Compose rotations
 * const rot90 = Rotation2.QUARTER_TURN;
 * const combined = rot.multiply(rot90); // 135°
 * ```
 *
 * @see {@link Complex} for general complex number operations
 * @see {@link Transform2} for position + rotation
 */

import {
 degreesToRadians,
 radiansToDegrees,
 radiansToTurns,
 turnsToRadians,
} from '../auxiliary/angle/conversion';
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
import { EPSILON, PI } from '../auxiliary/scalar/constants';
import { smoothStep } from '../auxiliary/scalar/interpolation';
import { hypot } from '../deterministic/deterministic-kernels';
import { atan2 } from '../deterministic/deterministic-kernels';
import type { ReadonlyRotation2Like, ReadonlyVector2Like, Rotation2Like } from '../types';
import { assertFinite } from '../validation/assert';

import { Complex, type ReadonlyComplex } from './complex';
import { Vector2 } from './vector2';

// NOTE: ReadonlyRotation2Like is imported from '../types' - do not redefine here

/* ========================================================================== */
/* Helper Functions                                                           */
/* ========================================================================== */

/**
 * Permanently freezes a {@link Rotation2} instance so it can no longer be mutated.
 *
 * @param rotation - The Rotation2 object to freeze.
 * @returns The same instance, now typed as ReadonlyRotation2Like.
 *
 * @remarks
 * - The returned object keeps its original reference; no new memory is allocated.
 * - In strict mode any subsequent attempt to modify `cos` or `sin` throws a TypeError.
 *
 * @example
 * ```typescript
 * const QUARTER = freezeRotation2(Rotation2.fromAngle(Math.PI / 2));
 * QUARTER.cos = 1; // Throws in strict mode
 * ```
 *
 * @category Helpers
 * @since 0.7.0
 */
export function freezeRotation2(rotation: Rotation2): ReadonlyRotation2Like {
 return Object.freeze(rotation);
}

/* ========================================================================== */
/* Class: Rotation2                                                           */
/* ========================================================================== */

/**
 * Deterministic 2D rotation stored as cosine and sine components.
 *
 * @remarks
 * Instances are normalized to unit magnitude, making them efficient for rotations.
 *
 * @category Core
 * @since 0.7.0
 */
export class Rotation2 implements Rotation2Like {
 /* ======================================================================== */
 /* Instance Properties                                                      */
 /* ======================================================================== */

 public cos: number;
 public sin: number;

 /* ======================================================================== */
 /* Constructor                                                              */
 /* ======================================================================== */

 constructor(cos = 1, sin = 0) {
  this.cos = cos;
  this.sin = sin;
  // Pure math: no assertions - Infinity/NaN are valid IEEE 754 values
 }

 /* ======================================================================== */
 /* Private Helpers                                                          */
 /* ======================================================================== */

 private static normalizeComponents(cos: number, sin: number): Rotation2Like {
  const magnitude = hypot(cos, sin);
  if (isNearZero(magnitude)) {
   return { cos: 1, sin: 0 };
  }
  const inverse = safeDivide(1, magnitude);
  return { cos: cos * inverse, sin: sin * inverse };
 }

 private static ensureOut(out?: Rotation2): Rotation2 {
  return out ?? new Rotation2();
 }

 /* ======================================================================== */
 /* Static Constants (Immutable)                                             */
 /* ======================================================================== */

 /**
  * Identity rotation (0°).
  * @category Core
  */
 public static readonly IDENTITY = Object.freeze(new Rotation2(1, 0)) as ReadonlyRotation2Like;

 /**
  * Number of elements when serialized to an array.
  * @category Constant
  * @since 0.7.0
  */
 public static readonly ELEMENT_COUNT = 2;

 /**
  * 90° counter-clockwise rotation.
  * @category Core
  */
 public static readonly QUARTER_TURN = Object.freeze(new Rotation2(0, 1)) as ReadonlyRotation2Like;

 /**
  * 180° rotation.
  * @category Core
  */
 public static readonly HALF_TURN = Object.freeze(new Rotation2(-1, 0)) as ReadonlyRotation2Like;

 /**
  * 270° counter-clockwise rotation (90° clockwise).
  * @category Core
  */
 public static readonly THREE_QUARTER_TURN = Object.freeze(
  new Rotation2(0, -1),
 ) as ReadonlyRotation2Like;

 /**
  * 45° rotation (π/4).
  * @category Core
  */
 public static readonly EIGHTH_TURN = Object.freeze(
  Rotation2.fromAngle(PI / 4),
 ) as ReadonlyRotation2Like;

 /**
  * 30° rotation (π/6).
  * @category Core
  */
 public static readonly TWELFTH_TURN = Object.freeze(
  Rotation2.fromAngle(PI / 6),
 ) as ReadonlyRotation2Like;

 /**
  * 22.5° rotation (π/8).
  * @category Core
  */
 public static readonly SIXTEENTH_TURN = Object.freeze(
  Rotation2.fromAngle(PI / 8),
 ) as ReadonlyRotation2Like;

 /**
  * -90° rotation (clockwise quarter turn).
  * @category Core
  */
 public static readonly NEGATIVE_QUARTER = Object.freeze(
  new Rotation2(0, -1),
 ) as ReadonlyRotation2Like;

 /**
  * 60° rotation (π/3).
  * @category Core
  */
 public static readonly SIXTH_TURN = Object.freeze(
  Rotation2.fromAngle(PI / 3),
 ) as ReadonlyRotation2Like;

 /* ======================================================================== */
 /* Static Factories                                                         */
 /* ======================================================================== */

 /**
  * Creates a rotation from an angle in radians.
  * @param angle - Angle in radians
  * @param out - Optional output rotation
  * @returns Rotation representing the given angle
  *
  * @example
  * ```typescript
  * const rot90 = Rotation2.fromAngle(Math.PI / 2); // 90° CCW
  * const rot180 = Rotation2.fromAngle(Math.PI);    // 180°
  * ```
  *
  * @category Factory
  * @since 0.7.0
  */
 public static fromAngle(angle: number, out?: Rotation2): Rotation2 {
  assertFinite(angle, 'Rotation2.fromAngle:angle');
  const normalized = normalizeRadians(angle);
  const result = sinCos(normalized);
  return Rotation2.ensureOut(out).set(result.cos, result.sin);
 }

 /**
  * Creates a rotation from a direction vector.
  * @param direction - Direction vector (will be normalized)
  * @param out - Optional output rotation
  * @returns Rotation pointing in the direction of the vector
  *
  * @category Factory
  * @since 0.7.0
  */
 public static fromVector2(direction: ReadonlyVector2Like, out?: Rotation2): Rotation2 {
  // Pure math: no assertions - direction can have Infinity components
  const x = direction.x;
  const y = direction.y;
  const magnitudeSquared = x * x + y * y;
  if (isNearZero(magnitudeSquared)) {
   return Rotation2.ensureOut(out).set(1, 0);
  }
  const inv = 1 / hypot(x, y);
  return Rotation2.ensureOut(out).set(x * inv, y * inv);
 }

 /**
  * Creates a rotation that transforms one direction to another.
  * @param from - Starting direction (Vector2)
  * @param to - Target direction (Vector2)
  * @param out - Optional output rotation
  * @returns Rotation that transforms 'from' to 'to'
  *
  * @category Factory
  * @since 0.7.0
  */
 public static fromVectors2(
  from: ReadonlyVector2Like,
  to: ReadonlyVector2Like,
  out?: Rotation2,
 ): Rotation2 {
  const normFrom = Rotation2.fromVector2(from);
  const normTo = Rotation2.fromVector2(to);
  return Rotation2.relative(normFrom, normTo, out);
 }

 /**
  * Creates a rotation from a complex number.
  * @param complex - Complex number (will be normalized)
  * @param out - Optional output rotation
  * @returns Rotation from the complex number
  *
  * @category Factory
  * @since 0.7.0
  */
 public static fromComplex(complex: ReadonlyComplex, out?: Rotation2): Rotation2 {
  return Rotation2.ensureOut(out).set(complex.real, complex.imag).normalize();
 }

 /**
  * Creates a rotation from a complex number (safe).
  * @param complex - Complex number
  * @param out - Optional output rotation
  * @returns Rotation from the complex, or identity if magnitude is near zero
  *
  * @see {@link fromComplex} - May produce invalid rotation if magnitude is zero
  *
  * @category Factory
  * @since 0.7.0
  */
 public static fromComplexSafe(complex: ReadonlyComplex, out?: Rotation2): Rotation2 {
  return Rotation2.ensureOut(out).set(complex.real, complex.imag).normalizeSafe();
 }

 /**
  * Creates a rotation from a plain object.
  * @param object - Object with cos and sin properties
  * @param out - Optional output rotation
  * @returns Rotation from the object
  *
  * @category Factory
  * @since 0.7.0
  */
 public static fromObject(object: Rotation2Like, out?: Rotation2): Rotation2 {
  // Pure math: no assertions - data storage
  return Rotation2.ensureOut(out).set(object.cos, object.sin);
 }

 /**
  * Creates a rotation from individual cos and sin values.
  * @param cos - Cosine component
  * @param sin - Sine component
  * @param out - Optional output rotation
  * @returns Rotation from the values
  *
  * @remarks
  * The values are used directly without normalization.
  * For normalized rotations, use {@link fromAngle}.
  *
  * @example
  * ```typescript
  * Rotation2.fromValues(1, 0);           // Identity (0°)
  * Rotation2.fromValues(0, 1);           // 90° rotation
  * Rotation2.fromValues(0.707, 0.707);   // ~45° rotation
  * ```
  *
  * @category Factory
  * @since 0.7.0
  */
 public static fromValues(cos: number, sin: number, out?: Rotation2): Rotation2 {
  // Pure math: no assertions - direct assignment
  return Rotation2.ensureOut(out).set(cos, sin);
 }

 /**
  * Creates a rotation from a flat array [cos, sin].
  * @param array - Source array
  * @param offset - Index offset. @defaultValue `0`
  * @param out - Optional output rotation
  * @returns Rotation from array
  * @throws {RangeError} If offset is out of bounds.
  *
  * @example
  * ```typescript
  * Rotation2.fromArray([0.707, 0.707]);     // 45° rotation
  * Rotation2.fromArray([0, 1, 0, -1], 2);   // -90° rotation from offset 2
  * ```
  *
  * @category Factory
  * @since 0.7.0
  */
 public static fromArray(array: ArrayLike<number>, offset = 0, out?: Rotation2): Rotation2 {
  if (offset < 0 || offset + Rotation2.ELEMENT_COUNT > array.length) {
   throw new RangeError(
    `Rotation2.fromArray: offset ${offset} out of bounds for array length ${array.length}`,
   );
  }
  // Pure math: no assertions - data read operation
  return Rotation2.ensureOut(out).set(array[offset]!, array[offset + 1]!);
 }

 /**
  * Creates a deep copy of a rotation.
  * @param source - Rotation to clone
  * @param out - Optional output rotation
  * @returns A Rotation2 with identical values
  *
  * @category Factory
  * @since 0.7.0
  */
 public static clone(source: ReadonlyRotation2Like, out?: Rotation2): Rotation2 {
  return Rotation2.ensureOut(out).set(source.cos, source.sin);
 }

 /**
  * Copies values from source into destination (alloc-free).
  * @param source - Source rotation
  * @param destination - Target rotation to receive the copy
  * @returns The destination rotation
  *
  * @category Factory
  * @since 0.7.0
  */
 public static copy(source: ReadonlyRotation2Like, destination: Rotation2): Rotation2 {
  destination.cos = source.cos;
  destination.sin = source.sin;
  return destination;
 }

 /**
  * Normalizes a rotation to ensure cos² + sin² = 1.
  * @param rotation - Rotation to normalize
  * @param out - Optional output rotation
  * @returns Normalized rotation
  *
  * @category Factory
  * @since 0.7.0
  */
 public static normalize(rotation: ReadonlyRotation2Like, out?: Rotation2): Rotation2 {
  const normalized = Rotation2.normalizeComponents(rotation.cos, rotation.sin);
  const target = Rotation2.ensureOut(out);
  target.cos = normalized.cos;
  target.sin = normalized.sin;
  return target;
 }

 /**
  * Safe normalization that handles zero-magnitude rotations.
  * @param rotation - Rotation to normalize
  * @param out - Optional output rotation
  * @returns Normalized rotation, or identity if input has zero magnitude
  *
  * @remarks
  * Unlike {@link normalize}, this method returns the identity rotation
  * instead of throwing when the input has zero magnitude. This is useful
  * for accumulated rotations that may drift due to floating-point errors.
  *
  * @example
  * ```typescript
  * const drifted = new Rotation2(0.0000001, 0); // Nearly zero
  * const safe = Rotation2.normalizeSafe(drifted); // Returns IDENTITY
  * ```
  *
  * @category Factory
  * @since 0.7.0
  */
 public static normalizeSafe(rotation: ReadonlyRotation2Like, out?: Rotation2): Rotation2 {
  const mag = hypot(rotation.cos, rotation.sin);
  const target = Rotation2.ensureOut(out);
  if (isNearZero(mag)) {
   target.cos = 1;
   target.sin = 0;
   return target;
  }
  const invMag = 1 / mag;
  target.cos = rotation.cos * invMag;
  target.sin = rotation.sin * invMag;
  return target;
 }

 /**
  * Unchecked normalization for hot paths.
  * @param rotation - Rotation to normalize (must have non-zero magnitude)
  * @param out - Optional output rotation
  * @returns Normalized rotation
  *
  * @remarks
  * **⚠️ Precondition:** Rotation must have non-zero magnitude.
  * Calling with zero-magnitude produces Infinity/NaN.
  *
  * Use in performance-critical code where rotation validity is guaranteed.
  *
  * @see {@link normalize} - Throws on zero magnitude
  * @see {@link normalizeSafe} - Returns identity on zero magnitude
  *
  * @category Factory
  * @since 0.7.0
  */
 public static normalizeUnchecked(rotation: ReadonlyRotation2Like, out?: Rotation2): Rotation2 {
  const mag = hypot(rotation.cos, rotation.sin);
  const invMag = 1 / mag;
  const target = Rotation2.ensureOut(out);
  target.cos = rotation.cos * invMag;
  target.sin = rotation.sin * invMag;
  return target;
 }

 /* ======================================================================== */
 /* Static Arithmetic                                                        */
 /* ======================================================================== */

 /**
  * Multiplies two rotations (composition).
  * @param a - First rotation
  * @param b - Second rotation
  * @param out - Optional output rotation
  * @returns Combined rotation (a then b)
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 public static multiply(
  a: ReadonlyRotation2Like,
  b: ReadonlyRotation2Like,
  out?: Rotation2,
 ): Rotation2 {
  const cos = a.cos * b.cos - a.sin * b.sin;
  const sin = a.sin * b.cos + a.cos * b.sin;
  return Rotation2.ensureOut(out).set(cos, sin);
 }

 /**
  * Returns the inverse of a rotation.
  * @param rotation - Rotation to invert
  * @param out - Optional output rotation
  * @returns Inverted rotation
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 public static inverse(rotation: ReadonlyRotation2Like, out?: Rotation2): Rotation2 {
  return Rotation2.ensureOut(out).set(rotation.cos, -rotation.sin);
 }

 /**
  * Computes the relative rotation from a to b.
  * @param a - First rotation
  * @param b - Second rotation
  * @param out - Optional output rotation
  * @returns Relative rotation (b relative to a)
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 public static relative(
  a: ReadonlyRotation2Like,
  b: ReadonlyRotation2Like,
  out?: Rotation2,
 ): Rotation2 {
  const cos = a.cos * b.cos + a.sin * b.sin;
  const sin = a.cos * b.sin - a.sin * b.cos;
  return Rotation2.ensureOut(out).set(cos, sin);
 }

 /**
  * Negates a rotation (same as rotating by -angle).
  * @param rotation - Rotation to negate
  * @param out - Optional output rotation
  * @returns Negated rotation
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 public static negate(rotation: ReadonlyRotation2Like, out?: Rotation2): Rotation2 {
  return Rotation2.ensureOut(out).set(rotation.cos, -rotation.sin);
 }

 /* ======================================================================== */
 /* Static Transform Application                                             */
 /* ======================================================================== */

 /**
  * Applies a rotation to a vector.
  * @param rotation - Rotation to apply
  * @param vector - Vector to rotate
  * @param out - Optional output vector
  * @returns Rotated vector
  *
  * @remarks
  * Mathematically equivalent to `Vector2.rotateCS(vector, rotation.cos, rotation.sin, out)`.
  * Implemented inline for performance in hot paths.
  *
  * @example
  * ```typescript
  * const rot = Rotation2.fromAngle(Math.PI / 4);
  * const v = { x: 1, y: 0 };
  * const rotated = Rotation2.apply(rot, v); // (0.707, 0.707)
  * ```
  *
  * @category Transform
  * @since 0.7.0
  */
 public static apply(
  rotation: ReadonlyRotation2Like,
  vector: ReadonlyVector2Like,
  out?: Vector2,
 ): Vector2 {
  // Delegate to Vector2.rotateCS for DRY principle
  return Vector2.rotateCS(vector, rotation.cos, rotation.sin, out);
 }

 /**
  * Applies the inverse rotation to a vector.
  * @param rotation - Rotation whose inverse to apply
  * @param vector - Vector to rotate inversely
  * @param out - Optional output vector
  * @returns Inversely rotated vector
  *
  * @remarks
  * Mathematically equivalent to rotating by the negated angle.
  * Uses the conjugate: `(cos, -sin)` instead of `(cos, sin)`.
  * Implemented inline for performance in hot paths.
  *
  * @example
  * ```typescript
  * const rot = Rotation2.fromAngle(Math.PI / 4);
  * const v = { x: 0.707, y: 0.707 };
  * const original = Rotation2.applyInverse(rot, v); // ≈ (1, 0)
  * ```
  *
  * @category Transform
  * @since 0.7.0
  */
 public static applyInverse(
  rotation: ReadonlyRotation2Like,
  vector: ReadonlyVector2Like,
  out?: Vector2,
 ): Vector2 {
  // Delegate to Vector2.rotateCS with negated sin for inverse rotation
  // Inverse rotation: cos(-θ) = cos(θ), sin(-θ) = -sin(θ)
  return Vector2.rotateCS(vector, rotation.cos, -rotation.sin, out);
 }

 /* ======================================================================== */
 /* Static Interpolation                                                     */
 /* ======================================================================== */

 /**
  * Linear interpolation between two rotations.
  * @param a - Start rotation
  * @param b - End rotation
  * @param t - Interpolation factor [0, 1], clamped
  * @param out - Optional output rotation
  * @returns Interpolated rotation
  *
  * @category Interpolation
  * @since 0.7.0
  */
 public static lerp(
  a: ReadonlyRotation2Like,
  b: ReadonlyRotation2Like,
  t: number,
  out?: Rotation2,
 ): Rotation2 {
  const angle = lerpAngle(Rotation2.angle(a), Rotation2.angle(b), t);
  return Rotation2.fromAngle(angle, out);
 }

 /**
  * Linear interpolation with t clamped to [0, 1].
  * @param a - Start rotation
  * @param b - End rotation
  * @param t - Interpolation factor (clamped to [0, 1])
  * @param out - Optional output rotation
  * @returns Interpolated rotation
  *
  * @category Interpolation
  * @since 0.7.0
  */
 public static lerpClamped(
  a: ReadonlyRotation2Like,
  b: ReadonlyRotation2Like,
  t: number,
  out?: Rotation2,
 ): Rotation2 {
  return Rotation2.lerp(a, b, saturate(t), out);
 }

 /**
  * Spherical linear interpolation between two rotations.
  * @param from - Start rotation
  * @param to - End rotation
  * @param t - Interpolation factor (not clamped, allows extrapolation)
  * @param out - Optional output rotation
  * @returns Interpolated rotation
  *
  * @category Interpolation
  * @since 0.7.0
  */
 public static slerp(
  from: ReadonlyRotation2Like,
  to: ReadonlyRotation2Like,
  t: number,
  out?: Rotation2,
 ): Rotation2 {
  const angle = lerpAngle(Rotation2.angle(from), Rotation2.angle(to), t);
  return Rotation2.fromAngle(angle, out);
 }

 /**
  * Spherical linear interpolation with t clamped to [0, 1].
  * @param from - Start rotation
  * @param to - End rotation
  * @param t - Interpolation factor (clamped to [0, 1])
  * @param out - Optional output rotation
  * @returns Interpolated rotation
  *
  * @category Interpolation
  * @since 0.7.0
  */
 public static slerpClamped(
  from: ReadonlyRotation2Like,
  to: ReadonlyRotation2Like,
  t: number,
  out?: Rotation2,
 ): Rotation2 {
  return Rotation2.slerp(from, to, saturate(t), out);
 }

 /**
  * Smooth interpolation between two rotations using smoothStep easing.
  * @param from - Source rotation
  * @param to - Target rotation
  * @param t - Interpolation factor (clamped to [0, 1])
  * @param out - Optional output rotation
  * @returns Smoothly interpolated rotation
  *
  * @remarks
  * Uses Hermite smoothStep for ease-in-out effect.
  * Equivalent to `lerp(from, to, smoothStep(0, 1, clamp(t, 0, 1)))`.
  *
  * @example
  * ```typescript
  * const r1 = Rotation2.fromAngle(0);
  * const r2 = Rotation2.fromAngle(Math.PI / 2);
  * const smooth = Rotation2.smoothStep(r1, r2, 0.5); // Smooth interpolation
  * ```
  *
  * @category Interpolation
  * @since 0.7.0
  */
 public static smoothStep(
  from: ReadonlyRotation2Like,
  to: ReadonlyRotation2Like,
  t: number,
  out?: Rotation2,
 ): Rotation2 {
  const clamped = saturate(t);
  return Rotation2.lerp(from, to, smoothStep(0, 1, clamped), out);
 }

 /* ======================================================================== */
 /* Static Comparison & Validation                                           */
 /* ======================================================================== */

 /**
  * Exact component-wise equality (bit-identical).
  * @param a - First rotation
  * @param b - Second rotation
  * @returns True if cos and sin are exactly identical
  *
  * @remarks
  * Use {@link nearEquals} for comparing results of floating-point operations.
  *
  * @category Comparison
  * @since 0.7.0
  */
 public static exactEquals(a: ReadonlyRotation2Like, b: ReadonlyRotation2Like): boolean {
  return a.cos === b.cos && a.sin === b.sin;
 }

 /**
  * Approximate equality between two rotations using relative tolerance.
  * @param a - First rotation
  * @param b - Second rotation
  * @param epsilon - Relative tolerance. @defaultValue `EPSILON`
  * @returns True if rotations are equivalent within tolerance
  *
  * @remarks
  * First tries fast component comparison with relative tolerance, then falls
  * back to angle comparison using {@link angleDifference} for edge cases near ±180°.
  *
  * @category Comparison
  * @since 0.7.0
  */
 public static nearEquals(
  a: ReadonlyRotation2Like,
  b: ReadonlyRotation2Like,
  epsilon: number = EPSILON,
 ): boolean {
  // Fast path: direct component comparison with relative tolerance
  if (relativeEquals(a.cos, b.cos, epsilon) && relativeEquals(a.sin, b.sin, epsilon)) {
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
  *
  * @category Comparison
  * @since 0.7.0
  */
 public static isIdentity(rotation: ReadonlyRotation2Like, epsilon: number = EPSILON): boolean {
  return scalarNearEquals(rotation.cos, 1, epsilon) && isNearZero(rotation.sin, epsilon);
 }

 /**
  * Tests if a rotation is normalized (unit magnitude).
  * @param rotation - Rotation to test
  * @param epsilon - Tolerance (default: EPSILON)
  * @returns True if |cos² + sin² - 1| < epsilon
  *
  * @category Comparison
  * @since 0.7.0
  */
 public static isNormalized(rotation: ReadonlyRotation2Like, epsilon: number = EPSILON): boolean {
  const magnitudeSq = rotation.cos * rotation.cos + rotation.sin * rotation.sin;
  return Math.abs(magnitudeSq - 1) < epsilon;
 }

 /**
  * Tests if both components are finite numbers.
  * @param rotation - Rotation to test
  * @returns True if both cos and sin are finite
  *
  * @category Comparison
  * @since 0.7.0
  */
 public static isFinite(rotation: ReadonlyRotation2Like): boolean {
  return Number.isFinite(rotation.cos) && Number.isFinite(rotation.sin);
 }

 /**
  * Tests if any component is NaN.
  * @param rotation - Rotation to test
  * @returns True if cos or sin is NaN
  *
  * @category Comparison
  * @since 0.7.0
  */
 public static hasNaN(rotation: ReadonlyRotation2Like): boolean {
  return Number.isNaN(rotation.cos) || Number.isNaN(rotation.sin);
 }

 /**
  * Tests if any component is infinite (±Infinity).
  * @param rotation - Rotation to test
  * @returns True if cos or sin is ±Infinity
  *
  * @remarks
  * Distinguishes infinity from NaN. Use {@link isFinite} to check for both.
  *
  * @category Comparison
  * @since 0.7.0
  */
 public static hasInfinity(rotation: ReadonlyRotation2Like): boolean {
  return (
   (!Number.isFinite(rotation.cos) && !Number.isNaN(rotation.cos)) ||
   (!Number.isFinite(rotation.sin) && !Number.isNaN(rotation.sin))
  );
 }

 /* ======================================================================== */
 /* Static Computed Values                                                   */
 /* ======================================================================== */

 /**
  * Returns the angle in radians.
  * @param rotation - Rotation to get angle from
  * @returns Angle in radians
  *
  * @category Computed
  * @since 0.7.0
  */
 public static angle(rotation: ReadonlyRotation2Like): number {
  return atan2(rotation.sin, rotation.cos);
 }

 /* ======================================================================== */
 /* Instance Basic Mutators                                                  */
 /* ======================================================================== */

 /**
  * Sets the cos and sin components (will be normalized).
  * @param cos - Cosine component
  * @param sin - Sine component
  * @returns This for chaining
  *
  * @category Mutator
  * @since 0.7.0
  */
 set(cos: number, sin: number): this {
  // Pure math: no assertions - direct assignment
  const normalized = Rotation2.normalizeComponents(cos, sin);
  this.cos = normalized.cos;
  this.sin = normalized.sin;
  return this;
 }

 /**
  * Sets the rotation from an angle.
  * @param angle - Angle in radians
  * @returns This for chaining
  *
  * @category Mutator
  * @since 0.7.0
  */
 setAngle(angle: number): this {
  const normalized = normalizeRadians(angle);
  const result = sinCos(normalized);
  this.cos = result.cos;
  this.sin = result.sin;
  return this;
 }

 /**
  * Copies values from another rotation.
  * @param other - Source rotation
  * @returns This for chaining
  *
  * @category Mutator
  * @since 0.7.0
  */
 copy(other: ReadonlyRotation2Like): this {
  this.cos = other.cos;
  this.sin = other.sin;
  return this;
 }

 /**
  * Resets to identity rotation (0°).
  * @returns This for chaining
  *
  * @category Mutator
  * @since 0.7.0
  */
 identity(): this {
  this.cos = 1;
  this.sin = 0;
  return this;
 }

 /**
  * Normalizes this rotation to unit length.
  * @returns This for chaining
  *
  * @category Mutator
  * @since 0.7.0
  */
 normalize(): this {
  const normalized = Rotation2.normalizeComponents(this.cos, this.sin);
  this.cos = normalized.cos;
  this.sin = normalized.sin;
  return this;
 }

 /**
  * Safe normalization that handles zero-magnitude rotations.
  * @returns This for chaining
  *
  * @remarks
  * Unlike {@link normalize}, this method sets the rotation to identity
  * instead of throwing when it has zero magnitude. This is useful for
  * accumulated rotations that may drift due to floating-point errors.
  *
  * @example
  * ```typescript
  * const rot = new Rotation2(0.9999, 0.0001);
  * rot.normalizeSafe(); // Safely normalizes
  * ```
  *
  * @category Mutator
  * @since 0.7.0
  */
 normalizeSafe(): this {
  const mag = hypot(this.cos, this.sin);
  if (isNearZero(mag)) {
   this.cos = 1;
   this.sin = 0;
   return this;
  }
  const invMag = 1 / mag;
  this.cos *= invMag;
  this.sin *= invMag;
  return this;
 }

 /**
  * Unchecked normalization for hot paths.
  * @returns This for chaining
  *
  * @remarks
  * **⚠️ Precondition:** Rotation must have non-zero magnitude.
  *
  * @see {@link normalize} - Throws on zero magnitude
  * @see {@link normalizeSafe} - Returns identity on zero magnitude
  *
  * @category Mutator
  * @since 0.7.0
  */
 normalizeUnchecked(): this {
  const mag = hypot(this.cos, this.sin);
  const invMag = 1 / mag;
  this.cos *= invMag;
  this.sin *= invMag;
  return this;
 }

 /* ======================================================================== */
 /* Instance Angle Accessors                                                 */
 /* ======================================================================== */

 /**
  * Gets the angle in radians.
  * @returns Angle in radians
  *
  * @example
  * ```typescript
  * const rot = Rotation2.fromAngle(Math.PI / 4);
  * console.log(rot.angle); // 0.785...
  * ```
  *
  * @category Accessor
  * @since 0.8.0
  */
 get angle(): number {
  return atan2(this.sin, this.cos);
 }

 /**
  * Sets the angle in radians.
  * Zero-allocation: mutates in place.
  *
  * @example
  * ```typescript
  * const rot = new Rotation2();
  * rot.angle = Math.PI / 4;
  * ```
  *
  * @category Accessor
  * @since 0.8.0
  */
 set angle(value: number) {
  this.setAngle(value);
 }

 /**
  * Gets the angle in degrees.
  * Uses auxiliary/angle/conversion for DRY compliance.
  * @returns Angle in degrees
  *
  * @example
  * ```typescript
  * const rot = Rotation2.fromAngle(Math.PI / 2);
  * console.log(rot.angleDegrees); // 90
  * ```
  *
  * @category Accessor
  * @since 0.8.0
  */
 get angleDegrees(): number {
  return radiansToDegrees(this.angle);
 }

 /**
  * Sets the angle in degrees.
  * Uses auxiliary/angle/conversion for DRY compliance.
  *
  * @example
  * ```typescript
  * rot.angleDegrees = 45;
  * ```
  *
  * @category Accessor
  * @since 0.8.0
  */
 set angleDegrees(value: number) {
  this.angle = degreesToRadians(value);
 }

 /**
  * Gets the angle in turns (0-1 = one full rotation).
  * Uses auxiliary/angle/conversion for DRY compliance.
  * @returns Angle in turns (0-1 range)
  *
  * @example
  * ```typescript
  * const rot = Rotation2.fromAngle(Math.PI); // 180°
  * console.log(rot.angleTurns); // 0.5
  * ```
  *
  * @category Accessor
  * @since 0.8.0
  */
 get angleTurns(): number {
  return radiansToTurns(this.angle);
 }

 /**
  * Sets the angle in turns (0-1 = one full rotation).
  * Uses auxiliary/angle/conversion for DRY compliance.
  *
  * @example
  * ```typescript
  * rot.angleTurns = 0.25; // 90°
  * ```
  *
  * @category Accessor
  * @since 0.8.0
  */
 set angleTurns(value: number) {
  this.angle = turnsToRadians(value);
 }

 /* ======================================================================== */
 /* Instance Arithmetic                                                      */
 /* ======================================================================== */

 /**
  * Multiplies with another rotation (composition) in place.
  * @param other - Rotation to multiply by
  * @returns This for chaining
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 multiply(other: ReadonlyRotation2Like): this {
  const newCos = this.cos * other.cos - this.sin * other.sin;
  const newSin = this.sin * other.cos + this.cos * other.sin;
  this.cos = newCos;
  this.sin = newSin;
  return this;
 }

 /**
  * Inverts this rotation in place.
  * @returns This for chaining
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 inverse(): this {
  this.sin = -this.sin;
  return this;
 }

 /**
  * Negates this rotation in place (same as inverse for unit rotations).
  * @returns This for chaining
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 negate(): this {
  this.sin = -this.sin;
  return this;
 }

 /**
  * Computes rotation relative to another in place.
  * @param other - Reference rotation
  * @returns This for chaining
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 relativeTo(other: ReadonlyRotation2Like): this {
  const newCos = this.cos * other.cos + this.sin * other.sin;
  const newSin = this.cos * other.sin - this.sin * other.cos;
  this.cos = newCos;
  this.sin = newSin;
  return this;
 }

 /* ======================================================================== */
 /* Instance Transforms                                                      */
 /* ======================================================================== */

 /**
  * Applies this rotation to a vector.
  * @param vector - Vector to rotate
  * @param out - Optional output vector
  * @returns Rotated vector
  *
  * @category Transform
  * @since 0.7.0
  */
 apply(vector: ReadonlyVector2Like, out?: Vector2): Vector2 {
  return Rotation2.apply(this, vector, out);
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
  *
  * @category Transform
  * @since 0.7.0
  */
 applyInverse(vector: ReadonlyVector2Like, out?: Vector2): Vector2 {
  return Rotation2.applyInverse(this, vector, out);
 }

 /* ======================================================================== */
 /* Instance Comparison                                                      */
 /* ======================================================================== */

 /**
  * Exact equality (bit-identical).
  * @param other - Rotation to compare
  * @returns True if cos and sin are exactly identical
  *
  * @remarks
  * Use {@link nearEquals} for comparing results of floating-point operations.
  *
  * @category Comparison
  * @since 0.7.0
  */
 exactEquals(other: ReadonlyRotation2Like): boolean {
  return Rotation2.exactEquals(this, other);
 }

 /**
  * Approximate equality with wrap-around handling using relative tolerance.
  * @param other - Rotation to compare
  * @param epsilon - Relative tolerance. @defaultValue `EPSILON`
  * @returns True if rotations are equivalent within tolerance
  *
  * @remarks
  * First tries fast component comparison with relative tolerance, then falls
  * back to angle comparison for edge cases near ±180°.
  *
  * @category Comparison
  * @since 0.7.0
  */
 nearEquals(other: ReadonlyRotation2Like, epsilon: number = EPSILON): boolean {
  return Rotation2.nearEquals(this, other, epsilon);
 }

 /**
  * Tests if this rotation is identity (0°).
  * @param epsilon - Tolerance. @defaultValue `EPSILON`
  * @returns True if identity
  *
  * @category Comparison
  * @since 0.7.0
  */
 isIdentity(epsilon: number = EPSILON): boolean {
  return scalarNearEquals(this.cos, 1, epsilon) && isNearZero(this.sin, epsilon);
 }

 /**
  * Tests if this rotation is normalized (unit magnitude).
  * @param epsilon - Tolerance (default: EPSILON)
  * @returns True if cos² + sin² ≈ 1
  *
  * @category Comparison
  * @since 0.7.0
  */
 isNormalized(epsilon: number = EPSILON): boolean {
  return Rotation2.isNormalized(this, epsilon);
 }

 /**
  * Returns true if all components are finite.
  * @returns True if no NaN or Infinity values
  *
  * @category Validation
  * @since 0.7.0
  */
 isFinite(): boolean {
  return Rotation2.isFinite(this);
 }

 /**
  * Returns true if any component is NaN.
  * @returns True if any NaN value exists
  *
  * @category Validation
  * @since 0.7.0
  */
 hasNaN(): boolean {
  return Rotation2.hasNaN(this);
 }

 /**
  * Returns true if any component is infinite (±Infinity).
  * @returns True if any ±Infinity value exists
  *
  * @category Validation
  * @since 0.7.0
  */
 hasInfinity(): boolean {
  return Rotation2.hasInfinity(this);
 }

 /* ======================================================================== */
 /* Instance Getters (Derived)                                               */
 /* ======================================================================== */

 /**
  * Returns the inverse rotation without modifying this one.
  * @returns New inverted rotation
  *
  * @category Computed
  * @since 0.7.0
  */
 public get inversed(): Rotation2 {
  return new Rotation2(this.cos, -this.sin);
 }

 /**
  * Returns the double of this rotation without modifying it.
  * @returns New rotation with double the angle
  *
  * @category Computed
  * @since 0.7.0
  */
 public get doubled(): Rotation2 {
  // cos(2θ) = cos²θ - sin²θ, sin(2θ) = 2·sin·cos
  return new Rotation2(this.cos * this.cos - this.sin * this.sin, 2 * this.sin * this.cos);
 }

 /**
  * Returns the perpendicular rotation (+90°) without modifying this one.
  * @returns New rotation rotated 90° counter-clockwise
  *
  * @category Computed
  * @since 0.7.0
  */
 public get perpendicular(): Rotation2 {
  return new Rotation2(-this.sin, this.cos);
 }

 /**
  * Returns the X-axis direction vector of this rotation.
  * @returns Unit vector pointing in rotation direction
  *
  * @category Computed
  * @since 0.7.0
  */
 public get xAxis(): Vector2 {
  return new Vector2(this.cos, this.sin);
 }

 /**
  * Returns the Y-axis direction vector of this rotation.
  * @returns Unit vector perpendicular to rotation direction
  *
  * @category Computed
  * @since 0.7.0
  */
 public get yAxis(): Vector2 {
  return new Vector2(-this.sin, this.cos);
 }

 /**
  * Returns the negated rotation without modifying this one.
  * Equivalent to rotating by the negative angle.
  * @returns New negated rotation
  *
  * @category Computed
  * @since 0.7.0
  */
 public get negated(): Rotation2 {
  return new Rotation2(this.cos, -this.sin);
 }

 /**
  * Returns a normalized version of this rotation (unit length cos² + sin² = 1).
  *
  * @remarks
  * Since the constructor no longer auto-normalizes (Planck.js aligned),
  * use this getter to obtain a properly normalized rotation when needed.
  *
  * @returns New normalized rotation
  *
  * @category Computed
  * @since 0.7.0
  */
 public get normalized(): Rotation2 {
  const n = Rotation2.normalizeComponents(this.cos, this.sin);
  return new Rotation2(n.cos, n.sin);
 }

 /**
  * Returns the angle in radians without method call.
  * @returns Angle in radians
  *
  * @category Computed
  * @since 0.7.0
  */
 public get angleValue(): number {
  return atan2(this.sin, this.cos);
 }

 /* ======================================================================== */
 /* Instance Interpolation                                                   */
 /* ======================================================================== */

 /**
  * Linear interpolation towards another rotation in place.
  * @param other - Target rotation
  * @param t - Interpolation factor (not clamped, allows extrapolation)
  * @returns This for chaining
  *
  * @category Interpolation
  * @since 0.7.0
  */
 lerp(other: ReadonlyRotation2Like, t: number): this {
  const interpolatedAngle = lerpAngle(this.angle, Rotation2.angle(other), t);
  const result = sinCos(interpolatedAngle);
  this.cos = result.cos;
  this.sin = result.sin;
  return this;
 }

 /**
  * Linear interpolation with t clamped to [0, 1].
  * @param other - Target rotation
  * @param t - Interpolation factor (clamped to [0, 1])
  * @returns This for chaining
  *
  * @category Interpolation
  * @since 0.7.0
  */
 lerpClamped(other: ReadonlyRotation2Like, t: number): this {
  return this.lerp(other, saturate(t));
 }

 /**
  * Smooth step interpolation towards another rotation in place.
  * @param other - Target rotation
  * @param t - Interpolation factor [0, 1], clamped
  * @returns This for chaining
  *
  * @category Interpolation
  * @since 0.7.0
  */
 smoothStep(other: ReadonlyRotation2Like, t: number): this {
  const clamped = saturate(t);
  return this.lerp(other, smoothStep(0, 1, clamped));
 }

 /**
  * Spherical linear interpolation with another rotation in place.
  * @param other - Target rotation
  * @param t - Interpolation factor (not clamped, allows extrapolation)
  * @returns This for chaining
  *
  * @category Interpolation
  * @since 0.7.0
  */
 slerp(other: ReadonlyRotation2Like, t: number): this {
  const interpolatedAngle = lerpAngle(this.angle, Rotation2.angle(other), t);
  const result = sinCos(interpolatedAngle);
  this.cos = result.cos;
  this.sin = result.sin;
  return this;
 }

 /**
  * Spherical linear interpolation with t clamped to [0, 1].
  * @param other - Target rotation
  * @param t - Interpolation factor (clamped to [0, 1])
  * @returns This for chaining
  *
  * @category Interpolation
  * @since 0.7.0
  */
 slerpClamped(other: ReadonlyRotation2Like, t: number): this {
  return this.slerp(other, saturate(t));
 }

 /* ======================================================================== */
 /* Instance Conversion                                                      */
 /* ======================================================================== */

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
  *
  * @category Conversion
  * @since 0.7.0
  */
 public toComplex(out?: Complex): Complex {
  const target = out ?? new Complex();
  return target.set(this.cos, this.sin);
 }

 /**
  * Converts the rotation to a unit vector.
  * @param out - Optional output vector
  * @returns Vector2 pointing in the rotation direction
  *
  * @example
  * ```typescript
  * const r = Rotation2.fromAngle(Math.PI / 2);
  * const v = r.toVector2();
  * // v.x ≈ 0, v.y ≈ 1
  * ```
  *
  * @category Conversion
  * @since 0.7.0
  */
 public toVector2(out?: Vector2): Vector2 {
  return Vector2.fromValues(this.cos, this.sin, out);
 }

 /* ======================================================================== */
 /* Instance Serialization                                                   */
 /* ======================================================================== */

 /**
  * Writes to array or typed array.
  *
  * @param out - Optional destination array. If not provided, returns a new tuple.
  * @param offset - Write offset. @defaultValue `0`
  * @returns The output array, or a new tuple if no output was provided.
  *
  * @example
  * ```typescript
  * const r = Rotation2.fromAngle(Math.PI / 4);
  * const [cos, sin] = r.toArray();
  *
  * // Write to existing array
  * const arr = new Float32Array(10);
  * r.toArray(arr, 4); // writes at indices 4, 5
  * ```
  *
  * @category Serialization
  * @since 0.7.0
  */
 public toArray<T extends ArrayLike<number> & { [index: number]: number }>(
  out?: T,
  offset = 0,
 ): T | [number, number] {
  if (!out) {
   return [this.cos, this.sin];
  }
  out[offset] = this.cos;
  out[offset + 1] = this.sin;
  return out;
 }

 /**
  * Converts the rotation to a plain object.
  * @returns Object with cos and sin properties
  *
  * @example
  * ```typescript
  * const r = Rotation2.fromAngle(Math.PI / 2);
  * const obj = r.toObject();
  * // { cos: 0, sin: 1 }
  * ```
  *
  * @category Serialization
  * @since 0.7.0
  */
 public toObject(): Rotation2Like {
  return { cos: this.cos, sin: this.sin };
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
  * // '{"cos":0,"sin":1}'
  * ```
  *
  * @category Serialization
  * @since 0.7.0
  */
 public toJSON(): Rotation2Like {
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
  *
  * @category Serialization
  * @since 0.7.0
  */
 public toString(precision = 4): string {
  const degrees = this.angle * (180 / PI);
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
  *
  * @category Serialization
  * @since 0.7.0
  */
 clone(): Rotation2 {
  return new Rotation2(this.cos, this.sin);
 }

 /**
  * Iterator for array destructuring.
  * @returns Iterator yielding cos then sin.
  *
  * @example
  * ```typescript
  * const [cos, sin] = Rotation2.fromAngle(Math.PI / 4);
  * ```
  *
  * @category Conversion
  * @since 0.7.0
  */
 *[Symbol.iterator](): IterableIterator<number> {
  yield this.cos;
  yield this.sin;
 }
}
