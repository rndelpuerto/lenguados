/**
 * @file core/rotation2.ts
 * @module @lenguados/math2d/core
 * @description Deterministic 2D rotation for physics simulations
 *
 * @remarks
 * ## Design Pattern: Unit Complex Representation
 *
 * This class stores rotation as `(cos θ, sin θ)` — a unit complex number —
 * instead of a raw angle. This representation is standard in 2D physics and
 * robotics because it:
 * - Avoids repeated trigonometric calls
 * - Enables efficient rotation composition via complex multiplication
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
import { sinCos } from '../auxiliary/angle/operations';
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
import type {
 ReadonlyComplexLike,
 ReadonlyMatrix2Like,
 ReadonlyRotation2Like,
 ReadonlyVector2Like,
 Rotation2Like,
} from '../types';
import { assert, assertFinite } from '../validation/assert';

import { Complex } from './complex';
import { Matrix2 } from './matrix2';
import { Vector2 } from './vector2';

// NOTE: ReadonlyRotation2Like is imported from '../types' - do not redefine here

/* ========================================================================== */
/* Type Exports                                                               */
/* ========================================================================== */

/**
 * Readonly view of a {@link Rotation2} instance.
 *
 * @category Types
 * @since 0.7.0
 * @public
 */
export type ReadonlyRotation2 = Readonly<Rotation2>;

export { isRotation2Like } from '../types';

/* ========================================================================== */
/* Helper Functions                                                           */
/* ========================================================================== */

/**
 * Permanently freezes a {@link Rotation2} instance so it can no longer be mutated.
 *
 * @remarks
 * - The returned object keeps its original reference; no new memory is allocated.
 * - In strict mode any subsequent attempt to modify `cos` or `sin` throws a TypeError.
 *
 * @param rotation - The Rotation2 object to freeze
 * @returns The same instance, now typed as ReadonlyRotation2Like
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
export function freezeRotation2(rotation: Rotation2): ReadonlyRotation2 {
 return Object.freeze(rotation);
}

/* ========================================================================== */
/* Class: Rotation2                                                           */
/* ========================================================================== */

/**
 * Deterministic 2D rotation stored as cosine and sine components.
 *
 * @remarks
 * - **Design:** Stored as `(cos, sin)` pair. Instance methods are mutable and chainable;
 *   static methods are pure with alloc-free overloads via `out` parameter.
 * - **Numerics:** Uses deterministic `sin`/`cos`/`atan2` kernels. Renormalization
 *   maintains unit magnitude over accumulated rotations.
 * - **Safety:** "Safe" variants return identity rotation instead of throwing on
 *   zero-magnitude inputs.
 *
 * @example
 * ```typescript
 * // Create from angle
 * const r = Rotation2.fromAngle(Math.PI / 4);
 *
 * // Apply rotation to vector
 * const rotated = Rotation2.apply(r, vector);
 *
 * // Instance (mutable, chainable)
 * rotation.multiply(other).normalize();
 * ```
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

 /**
  * Creates a Rotation2 from cosine and sine components.
  *
  * @remarks
  * **Warning:** This constructor does NOT normalize the (cos, sin) input.
  * A pair like `(2, 0)` will create a degenerate rotation that scales
  * instead of rotating. Use {@link Rotation2.fromAngle | fromAngle} for
  * angle-based construction or call {@link normalize} after construction
  * if the input may not be unit-length.
  *
  * @param cos - Cosine of the rotation angle. @defaultValue `1`
  * @param sin - Sine of the rotation angle. @defaultValue `0`
  */
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
  const inverse = 1 / magnitude;
  return { cos: cos * inverse, sin: sin * inverse };
 }

 /**
  * Assigns cos/sin without normalization. For internal use in arithmetic
  * operations where inputs are guaranteed unit-length (e.g., complex
  * multiplication of two unit rotations).
  *
  * @remarks
  * Composition of unit complex numbers preserves unit length by construction.
  * Normalization is an O(1) maintenance operation that callers invoke
  * periodically via normalize(), not on every arithmetic operation.
  *
  * @param cos - The cosine component
  * @param sin - The sine component
  * @returns This instance for chaining
  * @internal
  */
 private setDirect(cos: number, sin: number): this {
  assert(
   Math.abs(cos * cos + sin * sin - 1) < EPSILON,
   `Rotation2.setDirect: input must be unit-length, got cos²+sin²=${cos * cos + sin * sin}`,
  );
  this.cos = cos;
  this.sin = sin;
  return this;
 }

 private static ensureOut(out?: Rotation2): Rotation2 {
  return out ?? new Rotation2();
 }

 /* ======================================================================== */
 /* Static Constants (Immutable)                                             */
 /* ======================================================================== */

 /**
  * Identity rotation (0°).
  * @category Constant
  * @since 0.7.0
  */
 public static readonly IDENTITY = Object.freeze(new Rotation2(1, 0)) as ReadonlyRotation2;

 /**
  * Number of elements when serialized to an array.
  * @category Constant
  * @since 0.7.0
  */
 public static readonly ELEMENT_COUNT = 2;

 /**
  * 90° counter-clockwise rotation.
  * @category Constant
  * @since 0.7.0
  */
 public static readonly QUARTER_TURN = Object.freeze(new Rotation2(0, 1)) as ReadonlyRotation2;

 /**
  * 180° rotation.
  * @category Constant
  * @since 0.7.0
  */
 public static readonly HALF_TURN = Object.freeze(new Rotation2(-1, 0)) as ReadonlyRotation2;

 /**
  * 270° counter-clockwise rotation (90° clockwise).
  * @see {@link NEGATIVE_QUARTER} - Same rotation, named as clockwise quarter turn
  * @category Constant
  * @since 0.7.0
  */
 public static readonly THREE_QUARTER_TURN = Object.freeze(
  new Rotation2(0, -1),
 ) as ReadonlyRotation2;

 /**
  * 45° rotation (π/4).
  * @category Constant
  * @since 0.7.0
  */
 public static readonly EIGHTH_TURN = Object.freeze(
  Rotation2.fromAngle(PI / 4),
 ) as ReadonlyRotation2;

 /**
  * 30° rotation (π/6).
  * @category Constant
  * @since 0.7.0
  */
 public static readonly TWELFTH_TURN = Object.freeze(
  Rotation2.fromAngle(PI / 6),
 ) as ReadonlyRotation2;

 /**
  * 22.5° rotation (π/8).
  * @category Constant
  * @since 0.7.0
  */
 public static readonly SIXTEENTH_TURN = Object.freeze(
  Rotation2.fromAngle(PI / 8),
 ) as ReadonlyRotation2;

 /**
  * -90° rotation (clockwise quarter turn).
  * @see {@link THREE_QUARTER_TURN} - Same rotation, named as 270° CCW
  * @category Constant
  * @since 0.7.0
  */
 public static readonly NEGATIVE_QUARTER = Object.freeze(new Rotation2(0, -1)) as ReadonlyRotation2;

 /**
  * 60° rotation (π/3).
  * @category Constant
  * @since 0.7.0
  */
 public static readonly SIXTH_TURN = Object.freeze(
  Rotation2.fromAngle(PI / 3),
 ) as ReadonlyRotation2;

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
  // Assign directly: sinCos() returns unit-length values (sin²+cos²=1),
  // so set()'s hypot normalization would be redundant here.
  // Unlike set(), which normalizes arbitrary user input, fromAngle trusts sinCos() output.
  const target = Rotation2.ensureOut(out);
  target.cos = result.cos;
  target.sin = result.sin;
  return target;
 }

 /**
  * Creates a rotation from pre-computed cos/sin values.
  *
  * @remarks
  * Internally calls {@link Rotation2.set | set()}, which normalizes the (cos, sin) pair
  * to unit length. If you need exact cos/sin values without normalization, use the
  * constructor directly: `new Rotation2(cos, sin)`.
  *
  * @param cos - Pre-computed cosine of the angle
  * @param sin - Pre-computed sine of the angle
  * @param out - Optional output rotation
  * @returns Rotation with the given cos/sin
  *
  * @example
  * ```typescript
  * const { cos, sin } = sinCos(Math.PI / 4);
  * const rot = Rotation2.fromCS(cos, sin);         // 45° rotation
  * const reused = Rotation2.fromCS(cos, sin, out); // reuse existing instance
  * ```
  *
  * @category Factory
  * @since 0.7.0
  */
 public static fromCS(cos: number, sin: number, out?: Rotation2): Rotation2 {
  return Rotation2.ensureOut(out).set(cos, sin);
 }

 /**
  * Creates a rotation from a direction vector.
  * @param direction - Direction vector (will be normalized)
  * @param out - Optional output rotation
  * @returns Rotation pointing in the direction of the vector
  *
  * @example
  * ```typescript
  * const dir = { x: 3, y: 4 };
  * const rot = Rotation2.fromVector2(dir);         // rotation toward (3,4)
  * const reused = Rotation2.fromVector2(dir, out); // reuse existing instance
  * ```
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
  // Use hypot for overflow-safe magnitude (handles components > ~1.34e154)
  const inv = 1 / hypot(x, y);
  return Rotation2.ensureOut(out).setDirect(x * inv, y * inv);
 }

 /**
  * Creates a rotation that transforms one direction to another.
  * @param from - Starting direction (Vector2)
  * @param to - Target direction (Vector2)
  * @param out - Optional output rotation
  * @returns Rotation that transforms 'from' to 'to'
  *
  * @example
  * ```typescript
  * const from = { x: 1, y: 0 };
  * const to = { x: 0, y: 1 };
  * const rot = Rotation2.fromVectors2(from, to);         // 90° CCW
  * const reused = Rotation2.fromVectors2(from, to, out); // reuse existing instance
  * ```
  *
  * @category Factory
  * @since 0.7.0
  */
 public static fromVectors2(
  from: ReadonlyVector2Like,
  to: ReadonlyVector2Like,
  out?: Rotation2,
 ): Rotation2 {
  // Inline cross/dot computation to avoid two temporary Rotation2 allocations
  const fx = from.x;
  const fy = from.y;
  const tx = to.x;
  const ty = to.y;

  const fromMagSq = fx * fx + fy * fy;
  const toMagSq = tx * tx + ty * ty;

  if (isNearZero(fromMagSq) || isNearZero(toMagSq)) {
   return Rotation2.ensureOut(out).set(1, 0);
  }

  // Use hypot for overflow-safe magnitude computation
  const fromMag = hypot(fx, fy);
  const toMag = hypot(tx, ty);
  const invScale = 1 / (fromMag * toMag);
  // dot(from, to) = cos of angle, cross(from, to) = sin of angle
  const cos = (fx * tx + fy * ty) * invScale;
  const sin = (fx * ty - fy * tx) * invScale;
  return Rotation2.ensureOut(out).setDirect(cos, sin);
 }

 /**
  * Creates a rotation from a complex number.
  *
  * @remarks
  * Zero-magnitude input produces identity rotation (cos=1, sin=0) after normalization.
  *
  * @param complex - Complex number (will be normalized)
  * @param out - Optional output rotation
  * @returns Rotation from the complex number
  *
  * @example
  * ```typescript
  * const c = new Complex(3, 4);
  * const rot = Rotation2.fromComplex(c);         // normalized to unit rotation
  * const reused = Rotation2.fromComplex(c, out); // reuse existing instance
  * ```
  *
  * @see {@link fromComplexSafe} - Returns identity on zero magnitude
  *
  * @category Factory
  * @since 0.7.0
  */
 public static fromComplex(complex: ReadonlyComplexLike, out?: Rotation2): Rotation2 {
  const target = Rotation2.ensureOut(out);
  target.cos = complex.real;
  target.sin = complex.imag;
  return target.normalize();
 }

 /**
  * Creates a rotation from a complex number (safe).
  * @param complex - Complex number
  * @param out - Optional output rotation
  * @returns Rotation from the complex, or identity if magnitude is near zero
  *
  * @example
  * ```typescript
  * const c = new Complex(3, 4);
  * const rot = Rotation2.fromComplexSafe(c);              // normalized to unit rotation
  *
  * const zero = new Complex(0, 0);
  * const fallback = Rotation2.fromComplexSafe(zero);      // identity (cos=1, sin=0)
  * const reused = Rotation2.fromComplexSafe(c, out);      // reuse existing instance
  * ```
  *
  * @see {@link fromComplex} - Strict variant (also returns identity for zero magnitude)
  *
  * @category Factory
  * @since 0.7.0
  */
 public static fromComplexSafe(complex: ReadonlyComplexLike, out?: Rotation2): Rotation2 {
  const target = Rotation2.ensureOut(out);
  target.cos = complex.real;
  target.sin = complex.imag;
  return target.normalizeSafe();
 }

 /**
  * Creates a rotation from a 2×2 matrix by extracting the rotation components.
  *
  * @remarks
  * Extracts the rotation via `set(m00, m01)` which normalizes using hypot,
  * not atan2. This is the inverse of {@link Rotation2.prototype.toMatrix2}.
  *
  * @param matrix - Source matrix
  * @param out - Optional output rotation
  * @returns Rotation extracted from the matrix
  *
  * @example
  * ```typescript
  * const m = Matrix2.fromRotation(Math.PI / 4);
  * const r = Rotation2.fromMatrix2(m); // ≈ 45° rotation
  * ```
  *
  * @category Factory
  * @since 0.7.0
  */
 public static fromMatrix2(matrix: ReadonlyMatrix2Like, out?: Rotation2): Rotation2 {
  return Rotation2.ensureOut(out).set(matrix.m00, matrix.m01);
 }

 /**
  * Creates a rotation from a plain object.
  * @param object - Object with cos and sin properties
  * @param out - Optional output rotation
  * @returns Rotation from the object
  *
  * @example
  * ```typescript
  * const rot = Rotation2.fromObject({ cos: 0, sin: 1 });         // 90° rotation
  * const reused = Rotation2.fromObject({ cos: 0, sin: 1 }, out); // reuse existing instance
  * ```
  *
  * @category Factory
  * @since 0.7.0
  */
 public static fromObject(object: ReadonlyRotation2Like, out?: Rotation2): Rotation2 {
  // Pure math: no assertions - data storage
  return Rotation2.ensureOut(out).set(object.cos, object.sin);
 }

 /**
  * Creates a rotation from individual cos and sin values.
  *
  * @remarks
  * Internally calls {@link set}, which normalizes the (cos, sin) pair to unit length.
  * For creating a rotation from an angle, use {@link fromAngle}.
  *
  * @param cos - Cosine component
  * @param sin - Sine component
  * @param out - Optional output rotation
  * @returns Rotation from the values
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
  return Rotation2.fromCS(cos, sin, out);
 }

 /**
  * Creates a rotation from a flat array [cos, sin].
  * @param array - Source array
  * @param offset - Index offset. @defaultValue `0`
  * @param out - Optional output rotation
  * @returns Rotation from array
  * @throws {RangeError} If offset is out of bounds
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
  *
  * @remarks
  * Normalizes the cloned values to enforce the unit-length invariant, since the
  * source is a ReadonlyRotation2Like that may not be unit-length. Use instance
  * clone() for bit-identical copies of validated Rotation2 objects.
  *
  * @param source - Rotation to clone
  * @param out - Optional output rotation
  * @returns A Rotation2 with identical values
  *
  * @example
  * ```typescript
  * const original = Rotation2.fromAngle(Math.PI / 4);
  * const cloned = Rotation2.clone(original);         // independent copy
  * const reused = Rotation2.clone(original, out);    // reuse existing instance
  * ```
  *
  * @category Factory
  * @since 0.7.0
  */
 public static clone(source: ReadonlyRotation2Like, out?: Rotation2): Rotation2 {
  return Rotation2.ensureOut(out).set(source.cos, source.sin);
 }

 /**
  * Copies values from source into destination (alloc-free).
  *
  * @remarks
  * Unlike {@link clone} and {@link Rotation2.set | set()}, this method does NOT
  * normalize the input components. The source must already be unit-length.
  * Use {@link fromCS} or {@link Rotation2.set | set()} if normalization is needed.
  *
  * @param source - Source rotation (must be pre-normalized)
  * @param destination - Target rotation to receive the copy
  * @returns The destination rotation
  *
  * @example
  * ```typescript
  * const source = Rotation2.fromAngle(Math.PI / 2);
  * const dest = new Rotation2();
  * Rotation2.copy(source, dest); // dest now matches source
  * ```
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
  *
  * @remarks
  * Unlike other strict-tier operations, this method does not throw for
  * zero-magnitude input. Instead, it returns the identity rotation (cos=1, sin=0),
  * matching the behavior of {@link normalizeSafe}. This is an intentional exception
  * to the triality pattern: for rotations, identity is always a mathematically
  * valid fallback.
  *
  * @param rotation - Rotation to normalize
  * @param out - Optional output rotation
  * @returns Normalized rotation
  *
  * @example
  * ```typescript
  * const drifted = new Rotation2(0.998, 0.065);
  * const unit = Rotation2.normalize(drifted); // cos² + sin² ≈ 1
  * ```
  *
  * @see {@link normalizeSafe} - Functionally identical for zero-magnitude input
  * @see {@link normalizeUnchecked} - No validation
  *
  * @category Transform
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
  *
  * @remarks
  * Both {@link normalize} and `normalizeSafe` return the identity rotation
  * `(cos=1, sin=0)` for zero-magnitude input. The difference is that
  * `normalizeSafe` makes the fallback behavior explicit via its API contract,
  * whereas `normalize` delegates to an internal helper that silently returns identity.
  * The identity rotation is the neutral element for rotation composition —
  * applying it leaves vectors unchanged. This is useful for accumulated
  * rotations that may drift due to floating-point errors.
  *
  * @param rotation - Rotation to normalize
  * @param out - Optional output rotation
  * @returns Normalized rotation, or identity if input has zero magnitude
  *
  * @example
  * ```typescript
  * const drifted = new Rotation2(0.0000001, 0); // Nearly zero
  * const safe = Rotation2.normalizeSafe(drifted); // Returns IDENTITY
  * ```
  *
  * @see {@link normalize} - Strict variant (also returns identity for zero magnitude)
  *
  * @category Transform
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
  *
  * @remarks
  * **Precondition:** Rotation must have non-zero magnitude.
  * Calling with zero-magnitude produces Infinity/NaN.
  *
  * Use in performance-critical code where rotation validity is guaranteed.
  *
  * @param rotation - Rotation to normalize (must have non-zero magnitude)
  * @param out - Optional output rotation
  * @returns Normalized rotation
  *
  * @see {@link normalize} - Strict variant (also returns identity for zero magnitude)
  * @see {@link normalizeSafe} - Returns identity on zero magnitude
  *
  * @category Transform
  * @since 0.7.0
  */
 public static normalizeUnchecked(rotation: ReadonlyRotation2Like, out?: Rotation2): Rotation2 {
  const mag = Math.sqrt(rotation.cos * rotation.cos + rotation.sin * rotation.sin);
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
  *
  * @remarks
  * Repeated multiplication accumulates floating-point drift, causing the
  * result to deviate from unit magnitude. Call {@link normalize} periodically
  * (e.g., every 60–120 frames) in physics loops to maintain accuracy.
  *
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
  return Rotation2.ensureOut(out).setDirect(cos, sin);
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
  return Rotation2.ensureOut(out).setDirect(rotation.cos, -rotation.sin);
 }

 /**
  * Returns the component-wise negation of a rotation.
  *
  * @remarks
  * Negation `(-cos, -sin)` represents rotation by `θ + π` (the opposite
  * direction on the unit circle). This is distinct from {@link inverse}
  * which returns `(cos, -sin)` (rotation by `-θ`).
  *
  * @param rotation - Rotation to negate
  * @param out - Optional output rotation
  * @returns Negated rotation
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 public static negate(rotation: ReadonlyRotation2Like, out?: Rotation2): Rotation2 {
  return Rotation2.ensureOut(out).setDirect(-rotation.cos, -rotation.sin);
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
  return Rotation2.ensureOut(out).setDirect(cos, sin);
 }

 /**
  * Returns the conjugate of a rotation (inverse for unit rotations).
  *
  * @remarks
  * For unit complex numbers in SO(2), the conjugate `(cos, -sin)` is the inverse
  * rotation. Applying a rotation followed by its conjugate yields the identity.
  *
  * @param rotation - Rotation to conjugate
  * @param out - Optional output rotation
  * @returns Conjugated rotation
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 public static conjugate(rotation: ReadonlyRotation2Like, out?: Rotation2): Rotation2 {
  return Rotation2.ensureOut(out).setDirect(rotation.cos, -rotation.sin);
 }

 /* ======================================================================== */
 /* Static Transforms                                                        */
 /* ======================================================================== */

 /**
  * Applies a rotation to a vector.
  *
  * @remarks
  * - Use `Rotation2.apply` for pure rotation (operator semantics).
  * - Use `Matrix2.transformVector` for general linear transformations (spatial semantics).
  * - Mathematically equivalent to `Vector2.rotateCS(vector, rotation.cos, rotation.sin, out)`.
  *
  * @param rotation - Rotation to apply
  * @param vector - Vector to rotate
  * @param out - Optional output vector
  * @returns Rotated vector
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
  *
  * @remarks
  * - Use `Rotation2.applyInverse` for pure rotation (operator semantics).
  * - Use `Matrix2.transformVector` for general linear transformations (spatial semantics).
  * - Mathematically equivalent to rotating by the negated angle.
  *
  * @param rotation - Rotation whose inverse to apply
  * @param vector - Vector to rotate inversely
  * @param out - Optional output vector
  * @returns Inversely rotated vector
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
  *
  * @remarks
  * For unit complex numbers in 2D (SO(2)), lerp via angle interpolation IS
  * equivalent to slerp. Unlike 3D quaternions where lerp and slerp differ,
  * in 2D the shortest-path angular interpolation produces the same result
  * as spherical interpolation on the unit circle.
  *
  * @param a - Start rotation
  * @param b - End rotation
  * @param t - Interpolation factor (not clamped; allows extrapolation which is linear in angle space and may wrap for large |t|)
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
  * Smooth interpolation between two rotations using smoothStep easing.
  *
  * @remarks
  * Uses Hermite smoothStep for ease-in-out effect.
  * Equivalent to `lerp(from, to, smoothStep(0, 1, clamp(t, 0, 1)))`.
  *
  * @param from - Source rotation
  * @param to - Target rotation
  * @param t - Interpolation factor (clamped to [0, 1])
  * @param out - Optional output rotation
  * @returns Smoothly interpolated rotation
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
  return Rotation2.lerp(from, to, smoothStep(0, 1, t), out);
 }

 /* ======================================================================== */
 /* Static Comparison                                                        */
 /* ======================================================================== */

 /**
  * Exact component-wise equality (bit-identical).
  *
  * @remarks
  * Use {@link nearEquals} for comparing results of floating-point operations.
  *
  * @param a - First rotation
  * @param b - Second rotation
  * @returns True if cos and sin are exactly identical
  *
  * @category Comparison
  * @since 0.7.0
  */
 public static exactEquals(a: ReadonlyRotation2Like, b: ReadonlyRotation2Like): boolean {
  return a.cos === b.cos && a.sin === b.sin;
 }

 /**
  * Approximate equality between two rotations using relative tolerance.
  *
  * @remarks
  * First tries fast component comparison with relative tolerance, then falls
  * back to angle comparison for edge cases near ±180°. The angle difference
  * is computed inline using cross/dot products (not via {@link angleDifference}).
  *
  * @param a - First rotation
  * @param b - Second rotation
  * @param epsilon - Relative tolerance. @defaultValue `EPSILON`
  * @returns True if rotations are equivalent within tolerance
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
  // Slow path: compute angle difference via cross/dot products (avoids two atan2 calls)
  // cross = a.cos * b.sin - a.sin * b.cos (sin of angle difference)
  // dot   = a.cos * b.cos + a.sin * b.sin (cos of angle difference)
  const cross = a.cos * b.sin - a.sin * b.cos;
  const dot = a.cos * b.cos + a.sin * b.sin;
  const diff = atan2(cross, dot);
  return isNearZero(diff, epsilon);
 }

 /**
  * Tests if a rotation is the identity.
  *
  * @remarks
  * Uses {@link EPSILON} (1e-10) as default tolerance. Checks cos ≈ 1 and sin ≈ 0.
  *
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
  *
  * @remarks
  * Distinguishes infinity from NaN. Use {@link isFinite} to check for both.
  *
  * @param rotation - Rotation to test
  * @returns True if cos or sin is ±Infinity
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
 /* Static Computed                                                          */
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

 /**
  * Computes the signed angle from rotation `a` to rotation `b`.
  *
  * @remarks
  * Returns the smallest signed angle (in radians) that rotates `a` into `b`.
  * Equivalent to the angle of `b * inverse(a)` but avoids allocating an
  * intermediate {@link Rotation2}.
  *
  * Positive values indicate counter-clockwise rotation, negative values
  * indicate clockwise rotation. The result is in the range (-π, π].
  *
  * @param a - Source rotation
  * @param b - Target rotation
  * @returns Signed angle in radians from a to b
  *
  * @example
  * ```typescript
  * const a = Rotation2.fromAngle(0);
  * const b = Rotation2.fromAngle(Math.PI / 2);
  * Rotation2.angleBetween(a, b); // ≈ π/2
  * ```
  *
  * @category Computed
  * @since 0.7.0
  */
 public static angleBetween(a: ReadonlyRotation2Like, b: ReadonlyRotation2Like): number {
  return atan2(a.cos * b.sin - a.sin * b.cos, a.cos * b.cos + a.sin * b.sin);
 }

 /* ======================================================================== */
 /* Instance Mutators                                                        */
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
  // Normalize inline to avoid intermediate object allocation
  const magnitude = hypot(cos, sin);
  if (isNearZero(magnitude)) {
   this.cos = 1;
   this.sin = 0;
  } else {
   const inv = 1 / magnitude;
   this.cos = cos * inv;
   this.sin = sin * inv;
  }
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
  *
  * @remarks
  * Unlike other strict-tier operations, this method does not throw for
  * zero-magnitude input. Instead, it returns the identity rotation (cos=1, sin=0),
  * matching the behavior of {@link normalizeSafe}. This is an intentional exception
  * to the triality pattern: for rotations, identity is always a mathematically
  * valid fallback, and throwing would force error handling where the only sensible
  * recovery is using identity.
  *
  * @returns This for chaining
  *
  * @example
  * ```typescript
  * const rot = new Rotation2(0.998, 0.065);
  * rot.normalize(); // cos² + sin² ≈ 1
  * ```
  *
  * @see {@link normalizeSafe} - Functionally identical for zero-magnitude input
  * @see {@link normalizeUnchecked} - No validation
  *
  * @category Transform
  * @since 0.7.0
  */
 normalize(): this {
  const mag = hypot(this.cos, this.sin);
  if (isNearZero(mag)) {
   this.cos = 1;
   this.sin = 0;
  } else {
   const inv = 1 / mag;
   this.cos *= inv;
   this.sin *= inv;
  }
  return this;
 }

 /**
  * Safe normalization that handles zero-magnitude rotations.
  *
  * @remarks
  * Both {@link normalize} and `normalizeSafe` return the identity rotation
  * `(cos=1, sin=0)` for zero-magnitude input. The difference is that
  * `normalizeSafe` makes the fallback behavior explicit via its API contract,
  * whereas `normalize` delegates to an internal helper that silently returns identity.
  * This is useful for accumulated rotations that may drift due to floating-point errors.
  *
  * @returns This for chaining
  *
  * @example
  * ```typescript
  * const rot = new Rotation2(0.9999, 0.0001);
  * rot.normalizeSafe(); // Safely normalizes
  * ```
  *
  * @see {@link normalize} - Strict variant (also returns identity for zero magnitude)
  *
  * @category Transform
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
  *
  * @remarks
  * **Precondition:** Rotation must have non-zero magnitude.
  *
  * @returns This for chaining
  *
  * @see {@link normalize} - Strict variant (also returns identity for zero magnitude)
  * @see {@link normalizeSafe} - Returns identity on zero magnitude
  *
  * @category Transform
  * @since 0.7.0
  */
 normalizeUnchecked(): this {
  const mag = Math.sqrt(this.cos * this.cos + this.sin * this.sin);
  const invMag = 1 / mag;
  this.cos *= invMag;
  this.sin *= invMag;
  return this;
 }

 /* ======================================================================== */
 /* Instance Accessors (Angle)                                               */
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
  * @since 0.7.0
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
  * @since 0.7.0
  */
 set angle(value: number) {
  this.setAngle(value);
 }

 /**
  * Gets the angle in degrees.
  * @returns Angle in degrees
  *
  * @example
  * ```typescript
  * const rot = Rotation2.fromAngle(Math.PI / 2);
  * console.log(rot.angleDegrees); // 90
  * ```
  *
  * @category Accessor
  * @since 0.7.0
  */
 get angleDegrees(): number {
  return radiansToDegrees(this.angle);
 }

 /**
  * Sets the angle in degrees.
  *
  * @example
  * ```typescript
  * rot.angleDegrees = 45;
  * ```
  *
  * @category Accessor
  * @since 0.7.0
  */
 set angleDegrees(value: number) {
  this.angle = degreesToRadians(value);
 }

 /**
  * Gets the angle in turns (0-1 = one full rotation).
  * @returns Angle in turns (0-1 range)
  *
  * @example
  * ```typescript
  * const rot = Rotation2.fromAngle(Math.PI); // 180°
  * console.log(rot.angleTurns); // 0.5
  * ```
  *
  * @category Accessor
  * @since 0.7.0
  */
 get angleTurns(): number {
  return radiansToTurns(this.angle);
 }

 /**
  * Sets the angle in turns (0-1 = one full rotation).
  *
  * @example
  * ```typescript
  * rot.angleTurns = 0.25; // 90°
  * ```
  *
  * @category Accessor
  * @since 0.7.0
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
  return this.setDirect(newCos, newSin);
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
  * Negates both components of this rotation in place.
  *
  * @remarks
  * Component-wise negation `(-cos, -sin)` represents rotation by `θ + π`
  * (the opposite direction on the unit circle). This is distinct from
  * {@link inverse} which negates only sin (rotation by `-θ`).
  *
  * @returns This for chaining
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 negate(): this {
  this.cos = -this.cos;
  this.sin = -this.sin;
  return this;
 }

 /**
  * Conjugates this rotation in place (inverse for unit rotations).
  *
  * @remarks
  * For unit complex numbers in SO(2), the conjugate `(cos, -sin)` is the inverse
  * rotation. Applying a rotation followed by its conjugate yields the identity.
  *
  * @returns This for chaining
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 conjugate(): this {
  this.sin = -this.sin;
  return this;
 }

 /**
  * Computes rotation relative to another in place.
  *
  * @remarks
  * Computes the rotation FROM this TO other (equivalent to
  * Rotation2.relative(this, other) = conj(this) * other). The result,
  * when composed with this rotation, produces other:
  * this.multiply(this.relativeTo(other)) ≈ other.
  *
  * @param other - Reference rotation
  * @returns This for chaining
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 relativeTo(other: ReadonlyRotation2Like): this {
  const newCos = this.cos * other.cos + this.sin * other.sin;
  const newSin = this.cos * other.sin - this.sin * other.cos;
  return this.setDirect(newCos, newSin);
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
  *
  * @remarks
  * Mathematically equivalent to `Vector2.rotateCS(vector, this.cos, -this.sin, out)`.
  * Implemented inline for performance in hot paths.
  *
  * @param vector - Vector to rotate inversely
  * @param out - Optional output vector
  * @returns Inversely rotated vector
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
  *
  * @remarks
  * Use {@link nearEquals} for comparing results of floating-point operations.
  *
  * @param other - Rotation to compare
  * @returns True if cos and sin are exactly identical
  *
  * @category Comparison
  * @since 0.7.0
  */
 exactEquals(other: ReadonlyRotation2Like): boolean {
  return Rotation2.exactEquals(this, other);
 }

 /**
  * Approximate equality with wrap-around handling using relative tolerance.
  *
  * @remarks
  * First tries fast component comparison with relative tolerance, then falls
  * back to angle comparison for edge cases near ±180°.
  *
  * @param other - Rotation to compare
  * @param epsilon - Relative tolerance. @defaultValue `EPSILON`
  * @returns True if rotations are equivalent within tolerance
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
  * @category Comparison
  * @since 0.7.0
  */
 isFinite(): boolean {
  return Rotation2.isFinite(this);
 }

 /**
  * Returns true if any component is NaN.
  * @returns True if any NaN value exists
  *
  * @category Comparison
  * @since 0.7.0
  */
 hasNaN(): boolean {
  return Rotation2.hasNaN(this);
 }

 /**
  * Returns true if any component is infinite (±Infinity).
  * @returns True if any ±Infinity value exists
  *
  * @category Comparison
  * @since 0.7.0
  */
 hasInfinity(): boolean {
  return Rotation2.hasInfinity(this);
 }

 /* ======================================================================== */
 /* Instance Accessors                                                       */
 /* ======================================================================== */

 /**
  * Returns the inverse rotation without modifying this one.
  * @returns New inverted rotation
  *
  * @category Accessor
  * @since 0.7.0
  */
 public get inverted(): Rotation2 {
  return new Rotation2(this.cos, -this.sin);
 }

 /**
  * Returns the double of this rotation without modifying it.
  * @returns New rotation with double the angle
  *
  * @category Accessor
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
  * @category Accessor
  * @since 0.7.0
  */
 public get perpendicular(): Rotation2 {
  return new Rotation2(-this.sin, this.cos);
 }

 /**
  * Returns the X-axis direction vector of this rotation.
  * @returns Unit vector pointing in rotation direction
  *
  * @category Accessor
  * @since 0.7.0
  */
 public get xAxis(): Vector2 {
  return new Vector2(this.cos, this.sin);
 }

 /**
  * Returns the Y-axis direction vector of this rotation.
  * @returns Unit vector perpendicular to rotation direction
  *
  * @category Accessor
  * @since 0.7.0
  */
 public get yAxis(): Vector2 {
  return new Vector2(-this.sin, this.cos);
 }

 /**
  * Returns a new Rotation2 with both components negated.
  *
  * @remarks
  * Component-wise negation `(-cos, -sin)` represents rotation by `θ + π`
  * (the opposite direction on the unit circle). This is distinct from
  * {@link inverted} which returns `(cos, -sin)` (rotation by `-θ`).
  *
  * @returns New Rotation2 with both cos and sin negated
  *
  * @category Accessor
  * @since 0.7.0
  */
 public get negated(): Rotation2 {
  return new Rotation2(-this.cos, -this.sin);
 }

 /**
  * Returns a normalized version of this rotation (unit length cos² + sin² = 1).
  *
  * @remarks
  * Since the constructor does not auto-normalize (by design),
  * use this getter to obtain a properly normalized rotation when needed.
  *
  * @returns New normalized rotation
  *
  * @category Accessor
  * @since 0.7.0
  */
 public get normalized(): Rotation2 {
  const n = Rotation2.normalizeComponents(this.cos, this.sin);
  return new Rotation2(n.cos, n.sin);
 }

 /**
  * Compute the signed angle from this rotation to another.
  * @param other - Target rotation
  * @returns Signed angle in radians
  *
  * @example
  * ```typescript
  * const a = Rotation2.fromAngle(0);
  * const b = Rotation2.fromAngle(Math.PI / 2);
  * a.angleTo(b); // ≈ π/2
  * ```
  *
  * @see {@link Rotation2.angleBetween} - Static equivalent
  * @category Computed
  * @since 0.7.0
  */
 angleTo(other: ReadonlyRotation2Like): number {
  return Rotation2.angleBetween(this, other);
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
  return this.lerp(other, smoothStep(0, 1, t));
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

 /**
  * Converts the rotation to a 2×2 rotation matrix.
  * @param out - Optional output matrix
  * @returns Matrix2 representing this rotation
  *
  * @example
  * ```typescript
  * const r = Rotation2.fromAngle(Math.PI / 2);
  * const m = r.toMatrix2();
  * // m ≈ [0, 1, -1, 0]
  * ```
  *
  * @category Conversion
  * @since 0.7.0
  */
 public toMatrix2(out?: Matrix2): Matrix2 {
  return Matrix2.fromRotation(this, out);
 }

 /* ======================================================================== */
 /* Instance Conversion (Serialization)                                      */
 /* ======================================================================== */

 /**
  * Writes to array or typed array.
  *
  * @param out - Optional destination array. If not provided, returns a new tuple
  * @param offset - Write offset. @defaultValue `0`
  * @returns The output array, or a new tuple if no output was provided
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
  * @category Conversion
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
  * @category Conversion
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
  * @category Conversion
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
  * @category Conversion
  * @since 0.7.0
  */
 public toString(precision = 4): string {
  return `Rotation2(${this.angleDegrees.toFixed(precision)}°)`;
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
  * @category Conversion
  * @since 0.7.0
  */
 clone(): Rotation2 {
  return new Rotation2(this.cos, this.sin);
 }

 /**
  * Iterator for array destructuring.
  * @returns Iterator yielding cos then sin
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
