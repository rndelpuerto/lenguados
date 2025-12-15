/**
 * @file core/complex.ts
 * @module @lenguados/math2d/core
 * @description Deterministic complex number implementation for advanced mathematics.
 *
 * @remarks
 * ## Complex vs Rotation2: When to Use Each
 *
 * | Use Case | Recommended | Reason |
 * |----------|-------------|--------|
 * | Rotate rigid bodies | {@link Rotation2} | Optimized, always unit magnitude |
 * | Rotate sprites/vectors | {@link Rotation2} | Simple and efficient |
 * | Fourier analysis | **Complex** | Requires variable magnitude |
 * | Polynomial roots | **Complex** | Needs full complex algebra |
 * | Signal processing | **Complex** | Requires exp, log, powers |
 * | Conformal mappings | **Complex** | General complex operations |
 *
 * ## Mathematical Relationship
 *
 * A {@link Rotation2} is a **unit complex number** (|z| = 1):
 * - `Rotation2(cos, sin)` ≡ `Complex(cos, sin)` where `cos² + sin² = 1`
 * - Rotation composition = Complex multiplication
 * - Rotation inverse = Complex conjugate (for unit complex)
 *
 * ## Conversion
 *
 * ```typescript
 * // Complex → Rotation2
 * const c = Complex.fromPolar(1, Math.PI / 4);
 * const r = Rotation2.fromComplex(c);
 *
 * // Rotation2 → Complex
 * const r2 = Rotation2.fromAngle(Math.PI / 4);
 * const c2 = r2.toComplex();
 * ```
 *
 * @see {@link Rotation2} for 2D rotations in physics simulations
 */

import { lerpAngle } from '../auxiliary/angle/interpolation';
import { normalizeRadians } from '../auxiliary/angle/normalization';
import { sinCos } from '../auxiliary/angle/operations';
import { safeDivide, safeSqrt } from '../auxiliary/numeric/safety';
import { saturate } from '../auxiliary/scalar/arithmetic';
import { isNearZero, relativeEquals } from '../auxiliary/scalar/comparison';
import { EPSILON } from '../auxiliary/scalar/constants';
import { lerp, smoothStep } from '../auxiliary/scalar/interpolation';
import { DeterministicMath } from '../deterministic/deterministic-math';
import type { ComplexLike, Matrix2Like, ReadonlyVector2Like } from '../types';
import { assertFinite } from '../validation/assert';

import { Vector2 } from './vector2';

/* ========================================================================== */
/* Type Exports                                                               */
/* ========================================================================== */

/**
 * Readonly view of a {@link Complex} instance.
 * @public
 */
export type ReadonlyComplex = Readonly<Complex>;

/* ========================================================================== */
/* Helper Functions                                                           */
/* ========================================================================== */

/**
 * Permanently freezes a {@link Complex} instance so it can no longer be mutated.
 *
 * @param complex - The Complex object to freeze.
 * @returns The same instance, now typed as ReadonlyComplex.
 *
 * @remarks
 * - The returned object keeps its original reference; no new memory is allocated.
 * - In strict mode any subsequent attempt to modify `real` or `imag` throws a TypeError.
 *
 * @example
 * ```typescript
 * const UNIT = freezeComplex(new Complex(1, 0));
 * UNIT.real = 5; // Throws in strict mode
 * ```
 *
 * @category Helpers
 * @since 0.9.0
 */
export function freezeComplex(complex: Complex): ReadonlyComplex {
 return Object.freeze(complex);
}

/* ========================================================================== */
/* Class: Complex                                                             */
/* ========================================================================== */

export class Complex implements ComplexLike {
 /* ======================================================================== */
 /* Instance Properties                                                      */
 /* ======================================================================== */

 public real: number;
 public imag: number;

 /* ======================================================================== */
 /* Private Helpers                                                          */
 /* ======================================================================== */

 private static ensureOut(out?: Complex): Complex {
  return out ?? new Complex();
 }

 private static sanitize(value: number, label: string): number {
  assertFinite(value, label);
  return value;
 }

 /* ======================================================================== */
 /* Static Constants (Immutable)                                             */
 /* ======================================================================== */

 /**
  * Zero complex (0 + 0i).
  * @category Core
  */
 public static readonly ZERO = Object.freeze(new Complex(0, 0)) as ReadonlyComplex;

 /**
  * Real unit (1 + 0i).
  * @category Core
  */
 public static readonly ONE = Object.freeze(new Complex(1, 0)) as ReadonlyComplex;

 /**
  * Imaginary unit (0 + 1i).
  * @category Core
  */
 public static readonly I = Object.freeze(new Complex(0, 1)) as ReadonlyComplex;

 /**
  * Negative imaginary unit (0 - 1i).
  * @category Core
  */
 public static readonly NEG_I = Object.freeze(new Complex(0, -1)) as ReadonlyComplex;

 /**
  * Negative real unit (-1 + 0i).
  * @category Core
  */
 public static readonly NEG_ONE = Object.freeze(new Complex(-1, 0)) as ReadonlyComplex;

 /**
  * Epsilon complex for tolerance comparison.
  * @category Core
  */
 public static readonly EPSILON_COMPLEX = Object.freeze(
  new Complex(EPSILON, EPSILON),
 ) as ReadonlyComplex;

 /**
  * Square root of 2 as a real complex (√2 + 0i).
  * @category Core
  */
 public static readonly SQRT2 = Object.freeze(new Complex(Math.SQRT2, 0)) as ReadonlyComplex;

 /**
  * Inverse of square root of 2 as a real complex (1/√2 + 0i).
  * @category Core
  */
 public static readonly SQRT2_INV = Object.freeze(new Complex(Math.SQRT1_2, 0)) as ReadonlyComplex;

 /**
  * Pi as a real complex (π + 0i).
  * @category Core
  */
 public static readonly PI = Object.freeze(new Complex(Math.PI, 0)) as ReadonlyComplex;

 /**
  * Euler's number as a real complex (e + 0i).
  * @category Core
  */
 public static readonly E = Object.freeze(new Complex(Math.E, 0)) as ReadonlyComplex;

 /* ======================================================================== */
 /* Constructor                                                              */
 /* ======================================================================== */

 constructor(real = 0, imag = 0) {
  this.real = real;
  this.imag = imag;
 }

 /* ======================================================================== */
 /* Static Factories                                                         */
 /* ======================================================================== */

 /**
  * Creates a complex number from polar coordinates (magnitude and angle).
  * @param magnitude - Length of the complex vector
  * @param angle - Angle in radians
  * @param out - Optional output complex
  * @returns Complex number (magnitude * e^(i*angle))
  *
  * @category Factory
  * @since 0.1.0
  */
 public static fromPolar(magnitude: number, angle: number, out?: Complex): Complex {
  const sanitizedMagnitude = this.sanitize(magnitude, 'Complex.fromPolar:magnitude');
  const normalized = normalizeRadians(angle);
  const { cos, sin } = sinCos(normalized);
  return this.ensureOut(out).set(sanitizedMagnitude * cos, sanitizedMagnitude * sin);
 }

 /**
  * Creates a complex number from an array [real, imag].
  * @param array - Source array
  * @param offset - Index offset (default: 0)
  * @param out - Optional output complex
  * @returns Complex number
  *
  * @category Factory
  * @since 0.1.0
  */
 public static fromArray(array: ArrayLike<number>, offset = 0, out?: Complex): Complex {
  if (offset < 0 || offset + 1 >= array.length) {
   throw new RangeError(
    `Complex.fromArray: offset ${offset} is out of bounds for array of length ${array.length}`,
   );
  }
  const real = this.sanitize(array[offset]!, 'Complex.fromArray:real');
  const imag = this.sanitize(array[offset + 1]!, 'Complex.fromArray:imag');
  return this.ensureOut(out).set(real, imag);
 }

 /**
  * Creates a complex number from an object { real, imag }.
  * @param object - Source object
  * @param out - Optional output complex
  * @returns Complex number
  *
  * @category Factory
  * @since 0.1.0
  */
 public static fromObject(object: ComplexLike, out?: Complex): Complex {
  const real = this.sanitize(object.real, 'Complex.fromObject:real');
  const imag = this.sanitize(object.imag, 'Complex.fromObject:imag');
  return this.ensureOut(out).set(real, imag);
 }

 /**
  * Creates a deep copy of a complex number.
  * @param source - Complex to clone
  * @param out - Optional output complex
  * @returns A Complex with identical values
  *
  * @category Factory
  * @since 0.9.0
  */
 public static clone(source: ReadonlyComplex, out?: Complex): Complex {
  return this.ensureOut(out).set(source.real, source.imag);
 }

 /**
  * Copies values from source into destination (alloc-free).
  * @param source - Source complex
  * @param destination - Target complex to receive the copy
  * @returns The destination complex
  *
  * @category Factory
  * @since 0.9.0
  */
 public static copy(source: ReadonlyComplex, destination: Complex): Complex {
  return destination.set(source.real, source.imag);
 }

 /* ======================================================================== */
 /* Static Arithmetic                                                        */
 /* ======================================================================== */

 /**
  * Adds two complex numbers.
  * @param a - First complex number
  * @param b - Second complex number
  * @param out - Optional output complex
  * @returns Sum
  *
  * @category Arithmetic
  * @since 0.1.0
  */
 public static add(a: ReadonlyComplex, b: ReadonlyComplex, out?: Complex): Complex {
  return Complex.ensureOut(out).set(a.real + b.real, a.imag + b.imag);
 }

 /**
  * Subtracts two complex numbers.
  * @param a - First complex number
  * @param b - Second complex number
  * @param out - Optional output complex
  * @returns Difference
  *
  * @category Arithmetic
  * @since 0.1.0
  */
 public static subtract(a: ReadonlyComplex, b: ReadonlyComplex, out?: Complex): Complex {
  return Complex.ensureOut(out).set(a.real - b.real, a.imag - b.imag);
 }

 /**
  * Multiplies two complex numbers.
  * @param a - First complex number
  * @param b - Second complex number
  * @param out - Optional output complex
  * @returns Product
  *
  * @category Arithmetic
  * @since 0.1.0
  */
 public static multiply(a: ReadonlyComplex, b: ReadonlyComplex, out?: Complex): Complex {
  return Complex.ensureOut(out).set(
   a.real * b.real - a.imag * b.imag,
   a.real * b.imag + a.imag * b.real,
  );
 }

 /**
  * Divides two complex numbers.
  * @param a - Numerator
  * @param b - Denominator
  * @param out - Optional output complex
  * @returns Quotient
  *
  * @remarks
  * Uses safe division internally. Dividing by zero returns (0, 0).
  *
  * @category Arithmetic
  * @since 0.1.0
  */
 public static divide(a: ReadonlyComplex, b: ReadonlyComplex, out?: Complex): Complex {
  const denom = b.real * b.real + b.imag * b.imag;
  const invDenom = safeDivide(1, denom);
  return Complex.ensureOut(out).set(
   (a.real * b.real + a.imag * b.imag) * invDenom,
   (a.imag * b.real - a.real * b.imag) * invDenom,
  );
 }

 /**
  * Scales a complex number.
  * @param complex - Complex number to scale
  * @param scalar - Scale factor
  * @param out - Optional output complex
  * @returns Scaled complex
  *
  * @category Arithmetic
  * @since 0.1.0
  */
 public static scale(complex: ReadonlyComplex, scalar: number, out?: Complex): Complex {
  return Complex.ensureOut(out).set(complex.real * scalar, complex.imag * scalar);
 }

 /**
  * Returns the conjugate of a complex number.
  * @param complex - Complex number
  * @param out - Optional output complex
  * @returns Conjugate
  *
  * @category Arithmetic
  * @since 0.1.0
  */
 public static conjugate(complex: ReadonlyComplex, out?: Complex): Complex {
  return Complex.ensureOut(out).set(complex.real, -complex.imag);
 }

 /**
  * Negates a complex number.
  * @param complex - Complex number
  * @param out - Optional output complex
  * @returns Negated complex
  *
  * @category Arithmetic
  * @since 0.1.0
  */
 public static negate(complex: ReadonlyComplex, out?: Complex): Complex {
  return Complex.ensureOut(out).set(-complex.real, -complex.imag);
 }

 /* ======================================================================== */
 /* Static Interpolation                                                     */
 /* ======================================================================== */

 /**
  * Linear interpolation between two complex numbers.
  * @param a - Start complex
  * @param b - End complex
  * @param t - Interpolation factor [0, 1], clamped
  * @param out - Optional output complex
  * @returns Interpolated complex
  *
  * @category Interpolation
  * @since 0.1.0
  */
 public static lerp(a: ReadonlyComplex, b: ReadonlyComplex, t: number, out?: Complex): Complex {
  return Complex.ensureOut(out).set(lerp(a.real, b.real, t), lerp(a.imag, b.imag, t));
 }

 /**
  * Linear interpolation with t clamped to [0, 1].
  * @param a - Start complex
  * @param b - End complex
  * @param t - Interpolation factor (clamped to [0, 1])
  * @param out - Optional output complex
  * @returns Interpolated complex
  *
  * @category Interpolation
  * @since 0.9.0
  */
 public static lerpClamped(
  a: ReadonlyComplex,
  b: ReadonlyComplex,
  t: number,
  out?: Complex,
 ): Complex {
  return Complex.lerp(a, b, saturate(t), out);
 }

 /**
  * Spherical linear interpolation between two complex numbers.
  * Interpolates both magnitude and angle.
  * @param a - Start complex
  * @param b - End complex
  * @param t - Interpolation factor (not clamped, allows extrapolation)
  * @param out - Optional output complex
  * @returns Interpolated complex
  *
  * @category Interpolation
  * @since 0.9.0
  */
 public static slerp(a: ReadonlyComplex, b: ReadonlyComplex, t: number, out?: Complex): Complex {
  const mag1 = Complex.magnitude(a);
  const mag2 = Complex.magnitude(b);
  const angle1 = Complex.argument(a);
  const angle2 = Complex.argument(b);
  const interpMag = lerp(mag1, mag2, t);
  const interpAngle = lerpAngle(angle1, angle2, t);
  const { cos, sin } = sinCos(interpAngle);
  return Complex.ensureOut(out).set(interpMag * cos, interpMag * sin);
 }

 /**
  * Spherical linear interpolation with t clamped to [0, 1].
  * @param a - Start complex
  * @param b - End complex
  * @param t - Interpolation factor (clamped to [0, 1])
  * @param out - Optional output complex
  * @returns Interpolated complex
  *
  * @category Interpolation
  * @since 0.9.0
  */
 public static slerpClamped(
  a: ReadonlyComplex,
  b: ReadonlyComplex,
  t: number,
  out?: Complex,
 ): Complex {
  return Complex.slerp(a, b, saturate(t), out);
 }

 /**
  * Smooth interpolation between two complex numbers using smoothStep easing.
  * @param a - Source complex number
  * @param b - Target complex number
  * @param t - Interpolation factor (clamped to [0, 1])
  * @param out - Optional output complex
  * @returns Smoothly interpolated complex number
  *
  * @remarks
  * Uses Hermite smoothStep for ease-in-out effect.
  * Equivalent to `lerp(a, b, smoothStep(0, 1, clamp(t, 0, 1)))`.
  *
  * @example
  * ```typescript
  * const a = Complex.fromPolar(1, 0);
  * const b = Complex.fromPolar(1, Math.PI / 2);
  * const smooth = Complex.smoothLerp(a, b, 0.5); // Smooth interpolation
  * ```
  *
  * @category Interpolation
  * @since 0.11.0
  */
 public static smoothLerp(
  a: ReadonlyComplex,
  b: ReadonlyComplex,
  t: number,
  out?: Complex,
 ): Complex {
  const clamped = saturate(t);
  return Complex.lerp(a, b, smoothStep(0, 1, clamped), out);
 }

 /* ======================================================================== */
 /* Static Comparison & Validation                                           */
 /* ======================================================================== */

 /**
  * Exact component-wise equality (bit-identical).
  * @param a - First complex
  * @param b - Second complex
  * @returns True if real and imaginary parts are exactly identical
  *
  * @remarks
  * Use {@link nearEquals} for comparing results of floating-point operations.
  *
  * @category Comparison
  * @since 0.1.0
  */
 public static exactEquals(a: ReadonlyComplex, b: ReadonlyComplex): boolean {
  return a.real === b.real && a.imag === b.imag;
 }

 /**
  * Approximate equality between two complex numbers using relative tolerance.
  * @param a - First complex
  * @param b - Second complex
  * @param epsilon - Relative tolerance. @defaultValue `EPSILON`
  * @returns True if within scaled epsilon
  *
  * @remarks
  * Uses relative tolerance: `|a - b| <= epsilon * max(1, |a|, |b|)` per component.
  *
  * @category Comparison
  * @since 0.9.0
  */
 public static nearEquals(
  a: ReadonlyComplex,
  b: ReadonlyComplex,
  epsilon: number = EPSILON,
 ): boolean {
  return relativeEquals(a.real, b.real, epsilon) && relativeEquals(a.imag, b.imag, epsilon);
 }

 /**
  * Returns the magnitude of a complex number.
  * @param complex - Complex number
  * @returns Magnitude
  *
  * @category Computed
  * @since 0.1.0
  */
 public static magnitude(complex: ReadonlyComplex): number {
  return safeSqrt(complex.real * complex.real + complex.imag * complex.imag);
 }

 /**
  * Returns the argument (phase angle) of a complex number.
  * @param complex - Complex number
  * @returns Angle in radians
  *
  * @category Computed
  * @since 0.1.0
  */
 public static argument(complex: ReadonlyComplex): number {
  return DeterministicMath.atan2(complex.imag, complex.real);
 }

 /**
  * Returns the squared magnitude of a complex number.
  * @param complex - Complex number
  * @returns Squared magnitude
  *
  * @category Computed
  * @since 0.1.0
  */
 public static magnitudeSq(complex: ReadonlyComplex): number {
  return complex.real * complex.real + complex.imag * complex.imag;
 }

 /**
  * Normalizes a complex number to unit length.
  * @param complex - Complex number
  * @param out - Optional output complex
  * @returns Normalized complex
  * @throws {RangeError} If magnitude is near zero
  *
  * @category Transform
  * @since 0.1.0
  */
 public static normalize(complex: ReadonlyComplex, out?: Complex): Complex {
  const mag = Complex.magnitude(complex);
  if (isNearZero(mag)) {
   throw new RangeError('Complex.normalize: cannot normalize zero-magnitude complex number');
  }
  const invMag = safeDivide(1, mag);
  return Complex.ensureOut(out).set(complex.real * invMag, complex.imag * invMag);
 }

 /**
  * Safe normalization that handles zero-magnitude complex numbers.
  * @param complex - Complex number to normalize
  * @param out - Optional output complex
  * @returns Normalized complex, or (1, 0) if input has zero magnitude
  *
  * @remarks
  * Unlike {@link normalize}, this method returns the unit real (1, 0)
  * instead of throwing when the input has zero magnitude.
  *
  * @example
  * ```typescript
  * const zero = Complex.ZERO;
  * const safe = Complex.normalizeSafe(zero); // Returns (1, 0)
  * ```
  *
  * @category Transform
  * @since 0.10.0
  */
 public static normalizeSafe(complex: ReadonlyComplex, out?: Complex): Complex {
  const mag = Complex.magnitude(complex);
  if (isNearZero(mag)) {
   return Complex.ensureOut(out).set(1, 0);
  }
  const invMag = 1 / mag;
  return Complex.ensureOut(out).set(complex.real * invMag, complex.imag * invMag);
 }

 /**
  * Applies a complex number as a rotation to a vector.
  * @param complex - Complex number (will be normalized first)
  * @param vector - Vector to rotate
  * @param out - Optional output vector
  * @returns Rotated vector
  *
  * @remarks
  * The complex number is normalized before applying to ensure
  * a pure rotation without scaling. For unit complex numbers,
  * this is equivalent to complex multiplication.
  *
  * @example
  * ```typescript
  * const c = Complex.fromPolar(1, Math.PI / 4);
  * const v = { x: 1, y: 0 };
  * const rotated = Complex.apply(c, v); // (0.707, 0.707)
  * ```
  *
  * @category Transform
  * @since 0.10.0
  */
 public static apply(
  complex: ReadonlyComplex,
  vector: ReadonlyVector2Like,
  out?: Vector2,
 ): Vector2 {
  const mag = Complex.magnitude(complex);
  if (isNearZero(mag)) {
   return Vector2.clone(vector, out);
  }
  const invMag = 1 / mag;
  const c = complex.real * invMag;
  const s = complex.imag * invMag;
  return Vector2.fromValues(c * vector.x - s * vector.y, s * vector.x + c * vector.y, out);
 }

 /**
  * Returns the reciprocal of a complex number.
  * @param complex - Complex number
  * @param out - Optional output complex
  * @returns Reciprocal
  *
  * @category Transform
  * @since 0.1.0
  */
 public static reciprocal(complex: ReadonlyComplex, out?: Complex): Complex {
  const magSq = Complex.magnitudeSq(complex);
  const invMagSq = safeDivide(1, magSq);
  return Complex.ensureOut(out).set(complex.real * invMagSq, -complex.imag * invMagSq);
 }

 /**
  * Raises a complex number to a power.
  * @param complex - Base complex number
  * @param exponent - Exponent
  * @param out - Optional output complex
  * @returns Complex raised to power
  *
  * @category Transform
  * @since 0.1.0
  */
 public static pow(complex: ReadonlyComplex, exponent: number, out?: Complex): Complex {
  const mag = Complex.magnitude(complex);
  const angle = Complex.argument(complex);
  const poweredMagnitude = Math.pow(mag, exponent);
  const targetAngle = angle * exponent;
  return Complex.fromPolar(poweredMagnitude, targetAngle, out);
 }

 /**
  * Returns the square root of a complex number.
  * @param complex - Complex number
  * @param out - Optional output complex
  * @returns Square root
  *
  * @category Transform
  * @since 0.1.0
  */
 public static sqrt(complex: ReadonlyComplex, out?: Complex): Complex {
  return Complex.pow(complex, 0.5, out);
 }

 /**
  * Tests if a complex number is near zero.
  * @param complex - Complex number
  * @param epsilon - Tolerance (default: EPSILON)
  * @returns True if near zero
  *
  * @category Comparison
  * @since 0.1.0
  */
 public static isZero(complex: ReadonlyComplex, epsilon: number = EPSILON): boolean {
  return isNearZero(complex.real, epsilon) && isNearZero(complex.imag, epsilon);
 }

 /**
  * Tests if a complex number is purely real.
  * @param complex - Complex number
  * @param epsilon - Tolerance (default: EPSILON)
  * @returns True if imaginary part is near zero
  *
  * @category Comparison
  * @since 0.1.0
  */
 public static isReal(complex: ReadonlyComplex, epsilon: number = EPSILON): boolean {
  return isNearZero(complex.imag, epsilon);
 }

 /**
  * Tests if a complex number is purely imaginary.
  * @param complex - Complex number
  * @param epsilon - Tolerance (default: EPSILON)
  * @returns True if real part is near zero
  *
  * @category Comparison
  * @since 0.1.0
  */
 public static isImaginary(complex: ReadonlyComplex, epsilon: number = EPSILON): boolean {
  return isNearZero(complex.real, epsilon);
 }

 /**
  * Tests if both components are finite numbers.
  * @param complex - Complex to test
  * @returns True if both components are finite
  *
  * @category Comparison
  * @since 0.9.0
  */
 public static isFinite(complex: ReadonlyComplex): boolean {
  return Number.isFinite(complex.real) && Number.isFinite(complex.imag);
 }

 /**
  * Tests if any component is NaN.
  * @param complex - Complex to test
  * @returns True if any component is NaN
  *
  * @category Comparison
  * @since 0.9.0
  */
 public static hasNaN(complex: ReadonlyComplex): boolean {
  return Number.isNaN(complex.real) || Number.isNaN(complex.imag);
 }

 /* ======================================================================== */
 /* Instance Basic Mutators                                                  */
 /* ======================================================================== */

 /**
  * Sets the real and imaginary parts.
  * @param real - Real part
  * @param imag - Imaginary part
  * @returns This for chaining
  *
  * @category Mutator
  * @since 0.1.0
  */
 set(real: number, imag: number): this {
  this.real = real;
  this.imag = imag;
  return this;
 }

 /**
  * Copies values from another complex number.
  * @param other - Source complex
  * @returns This for chaining
  *
  * @category Mutator
  * @since 0.1.0
  */
 copy(other: ReadonlyComplex): this {
  this.real = other.real;
  this.imag = other.imag;
  return this;
 }

 /* ======================================================================== */
 /* Instance Computed Values                                                 */
 /* ======================================================================== */

 /**
  * Returns the magnitude of this complex number.
  * @returns Magnitude
  *
  * @category Computed
  * @since 0.1.0
  */
 magnitude(): number {
  return safeSqrt(this.real * this.real + this.imag * this.imag);
 }

 /**
  * Returns the squared magnitude of this complex number.
  * @returns Squared magnitude
  *
  * @category Computed
  * @since 0.1.0
  */
 magnitudeSq(): number {
  return this.real * this.real + this.imag * this.imag;
 }

 /**
  * Returns the argument (phase angle) of this complex number.
  * @returns Angle in radians
  *
  * @category Computed
  * @since 0.1.0
  */
 argument(): number {
  return DeterministicMath.atan2(this.imag, this.real);
 }

 /* ======================================================================== */
 /* Instance Arithmetic                                                      */
 /* ======================================================================== */

 /**
  * Adds another complex number in place.
  * @param other - Complex number to add
  * @returns This for chaining
  *
  * @category Arithmetic
  * @since 0.1.0
  */
 add(other: ReadonlyComplex): this {
  this.real += other.real;
  this.imag += other.imag;
  return this;
 }

 /**
  * Subtracts another complex number in place.
  * @param other - Complex number to subtract
  * @returns This for chaining
  *
  * @category Arithmetic
  * @since 0.1.0
  */
 subtract(other: ReadonlyComplex): this {
  this.real -= other.real;
  this.imag -= other.imag;
  return this;
 }

 /**
  * Multiplies with another complex number in place.
  * @param other - Complex number to multiply by
  * @returns This for chaining
  *
  * @category Arithmetic
  * @since 0.1.0
  */
 multiply(other: ReadonlyComplex): this {
  const a = this.real;
  const b = this.imag;
  const c = other.real;
  const d = other.imag;
  this.real = a * c - b * d;
  this.imag = a * d + b * c;
  return this;
 }

 /**
  * Divides by another complex number in place.
  * @param other - Complex number to divide by
  * @returns This for chaining
  *
  * @remarks
  * Uses safe division internally. Dividing by zero returns (0, 0).
  *
  * @category Arithmetic
  * @since 0.1.0
  */
 divide(other: ReadonlyComplex): this {
  const a = this.real;
  const b = this.imag;
  const c = other.real;
  const d = other.imag;
  const denominator = c * c + d * d;
  const invDenominator = safeDivide(1, denominator);
  this.real = (a * c + b * d) * invDenominator;
  this.imag = (b * c - a * d) * invDenominator;
  return this;
 }

 /**
  * Scales this complex number by a scalar in place.
  * @param scalar - Scale factor
  * @returns This for chaining
  *
  * @category Arithmetic
  * @since 0.1.0
  */
 scale(scalar: number): this {
  this.real *= scalar;
  this.imag *= scalar;
  return this;
 }

 /**
  * Conjugates this complex number in place.
  * @returns This for chaining
  *
  * @category Arithmetic
  * @since 0.1.0
  */
 conjugate(): this {
  this.imag = -this.imag;
  return this;
 }

 /* ======================================================================== */
 /* Instance Transforms                                                      */
 /* ======================================================================== */

 /**
  * Normalizes this complex number to unit length in place.
  * @returns This for chaining
  * @throws {RangeError} If magnitude is near zero
  *
  * @category Transform
  * @since 0.1.0
  */
 normalize(): this {
  const mag = this.magnitude();
  if (isNearZero(mag)) {
   throw new RangeError('Complex.normalize: cannot normalize zero-magnitude complex number');
  }
  const invMag = safeDivide(1, mag);
  this.real *= invMag;
  this.imag *= invMag;
  return this;
 }

 /**
  * Safe normalization. Sets to (1, 0) if magnitude is near zero.
  * @returns This for chaining
  *
  * @category Transform
  * @since 0.9.0
  */
 normalizeSafe(): this {
  const mag = this.magnitude();
  if (isNearZero(mag)) {
   this.real = 1;
   this.imag = 0;
   return this;
  }
  const invMag = safeDivide(1, mag);
  this.real *= invMag;
  this.imag *= invMag;
  return this;
 }

 /**
  * Applies this complex number as a rotation to a vector.
  * @param vector - Vector to rotate
  * @param out - Optional output vector
  * @returns Rotated vector
  *
  * @remarks
  * The complex number is normalized before applying to ensure
  * a pure rotation without scaling.
  *
  * @example
  * ```typescript
  * const c = Complex.fromPolar(1, Math.PI / 4);
  * const v = { x: 1, y: 0 };
  * const rotated = c.apply(v); // (0.707, 0.707)
  * ```
  *
  * @category Transform
  * @since 0.10.0
  */
 apply(vector: ReadonlyVector2Like, out?: Vector2): Vector2 {
  return Complex.apply(this, vector, out);
 }

 /**
  * Computes the reciprocal of this complex number in place.
  * @returns This for chaining
  *
  * @category Transform
  * @since 0.1.0
  */
 reciprocal(): this {
  const magSq = this.magnitudeSq();
  const invMagSq = safeDivide(1, magSq);
  this.real *= invMagSq;
  this.imag = -this.imag * invMagSq;
  return this;
 }

 /**
  * Raises this complex number to a power in place.
  * @param exponent - Exponent
  * @returns This for chaining
  *
  * @category Transform
  * @since 0.1.0
  */
 pow(exponent: number): this {
  const mag = this.magnitude();
  const angle = this.argument();
  const poweredMagnitude = Math.pow(mag, exponent);
  const targetAngle = angle * exponent;
  const { cos, sin } = sinCos(targetAngle);
  this.real = poweredMagnitude * cos;
  this.imag = poweredMagnitude * sin;
  return this;
 }

 /**
  * Computes the square root of this complex number in place.
  * @returns This for chaining
  *
  * @category Transform
  * @since 0.1.0
  */
 sqrt(): this {
  return this.pow(0.5);
 }

 /* ======================================================================== */
 /* Instance Comparison                                                      */
 /* ======================================================================== */

 /**
  * Exact equality (bit-identical).
  * @param other - Complex to compare
  * @returns True if exactly identical
  *
  * @remarks
  * Use {@link nearEquals} for comparing results of floating-point operations.
  *
  * @category Comparison
  * @since 0.1.0
  */
 exactEquals(other: ReadonlyComplex): boolean {
  return Complex.exactEquals(this, other);
 }

 /**
  * Approximate equality using relative tolerance.
  * @param other - Complex to compare
  * @param epsilon - Relative tolerance. @defaultValue `EPSILON`
  * @returns True if within scaled epsilon
  *
  * @remarks
  * Uses relative tolerance: `|a - b| <= epsilon * max(1, |a|, |b|)` per component.
  *
  * @category Comparison
  * @since 0.9.0
  */
 nearEquals(other: ReadonlyComplex, epsilon: number = EPSILON): boolean {
  return Complex.nearEquals(this, other, epsilon);
 }

 /* ======================================================================== */
 /* Instance Predicates                                                      */
 /* ======================================================================== */

 /**
  * Tests if this complex number is near zero.
  * @param epsilon - Tolerance (default: EPSILON)
  * @returns True if near zero
  *
  * @category Predicate
  * @since 0.1.0
  */
 isZero(epsilon: number = EPSILON): boolean {
  return isNearZero(this.real, epsilon) && isNearZero(this.imag, epsilon);
 }

 /**
  * Tests if this complex number is purely real.
  * @param epsilon - Tolerance (default: EPSILON)
  * @returns True if imaginary part is near zero
  *
  * @category Predicate
  * @since 0.1.0
  */
 isReal(epsilon: number = EPSILON): boolean {
  return isNearZero(this.imag, epsilon);
 }

 /**
  * Tests if this complex number is purely imaginary.
  * @param epsilon - Tolerance (default: EPSILON)
  * @returns True if real part is near zero
  *
  * @category Predicate
  * @since 0.1.0
  */
 isImaginary(epsilon: number = EPSILON): boolean {
  return isNearZero(this.real, epsilon);
 }

 /**
  * Tests if both components are finite numbers.
  * @returns True if both components are finite
  *
  * @category Predicate
  * @since 0.9.0
  */
 isFinite(): boolean {
  return Number.isFinite(this.real) && Number.isFinite(this.imag);
 }

 /**
  * Tests if any component is NaN.
  * @returns True if any component is NaN
  *
  * @category Predicate
  * @since 0.9.0
  */
 hasNaN(): boolean {
  return Number.isNaN(this.real) || Number.isNaN(this.imag);
 }

 /**
  * Negates this complex number in place.
  * @returns This for chaining
  *
  * @category Arithmetic
  * @since 0.1.0
  */
 negate(): this {
  this.real = -this.real;
  this.imag = -this.imag;
  return this;
 }

 /**
  * Resets this complex number to zero.
  * @returns This for chaining
  *
  * @category Mutator
  * @since 0.9.0
  */
 zero(): this {
  this.real = 0;
  this.imag = 0;
  return this;
 }

 /* ======================================================================== */
 /* Instance Getters (Derived)                                               */
 /* ======================================================================== */

 /**
  * Returns the conjugate without modifying this number.
  * @returns New conjugate complex
  *
  * @category Computed
  * @since 0.1.0
  */
 public get conjugated(): Complex {
  return new Complex(this.real, -this.imag);
 }

 /**
  * Returns the normalized (unit) complex without modifying this number.
  * @returns New unit complex
  *
  * @category Computed
  * @since 0.1.0
  */
 public get normalized(): Complex {
  const mag = this.magnitude();
  if (isNearZero(mag)) {
   return new Complex(0, 0);
  }
  const invMag = safeDivide(1, mag);
  return new Complex(this.real * invMag, this.imag * invMag);
 }

 /**
  * Returns the negated complex without modifying this number.
  * @returns New negated complex
  *
  * @category Computed
  * @since 0.1.0
  */
 public get negated(): Complex {
  return new Complex(-this.real, -this.imag);
 }

 /**
  * Returns the reciprocal without modifying this number.
  * @returns New reciprocal complex
  *
  * @category Computed
  * @since 0.1.0
  */
 public get reciprocated(): Complex {
  const magSq = this.magnitudeSq();
  const invMagSq = safeDivide(1, magSq);
  return new Complex(this.real * invMagSq, -this.imag * invMagSq);
 }

 /* ======================================================================== */
 /* Instance Interpolation                                                   */
 /* ======================================================================== */

 /**
  * Linear interpolation towards another complex number in place.
  * @param other - Target complex
  * @param t - Interpolation factor [0, 1], clamped
  * @returns This for chaining
  *
  * @category Interpolation
  * @since 0.1.0
  */
 lerp(other: ReadonlyComplex, t: number): this {
  this.real = lerp(this.real, other.real, t);
  this.imag = lerp(this.imag, other.imag, t);
  return this;
 }

 /**
  * Linear interpolation with t clamped to [0, 1].
  * @param other - Target complex
  * @param t - Interpolation factor (clamped to [0, 1])
  * @returns This for chaining
  *
  * @category Interpolation
  * @since 0.9.0
  */
 lerpClamped(other: ReadonlyComplex, t: number): this {
  return this.lerp(other, saturate(t));
 }

 /**
  * Spherical linear interpolation towards another complex number in place.
  * @param other - Target complex
  * @param t - Interpolation factor (not clamped, allows extrapolation)
  * @returns This for chaining
  *
  * @category Interpolation
  * @since 0.1.0
  */
 slerp(other: ReadonlyComplex, t: number): this {
  const mag1 = this.magnitude();
  const mag2 = Complex.magnitude(other);
  const angle1 = this.argument();
  const angle2 = Complex.argument(other);
  const interpMag = lerp(mag1, mag2, t);
  const interpAngle = lerpAngle(angle1, angle2, t);
  const { cos, sin } = sinCos(interpAngle);
  this.real = interpMag * cos;
  this.imag = interpMag * sin;
  return this;
 }

 /**
  * Spherical linear interpolation with t clamped to [0, 1].
  * @param other - Target complex
  * @param t - Interpolation factor (clamped to [0, 1])
  * @returns This for chaining
  *
  * @category Interpolation
  * @since 0.9.0
  */
 slerpClamped(other: ReadonlyComplex, t: number): this {
  return this.slerp(other, saturate(t));
 }

 /**
  * Smooth interpolation with another complex number in place.
  * @param other - Target complex number
  * @param t - Interpolation factor (clamped to [0, 1])
  * @returns This for chaining
  *
  * @remarks
  * Uses Hermite smoothStep for ease-in-out effect.
  *
  * @category Interpolation
  * @since 0.11.0
  */
 smoothLerp(other: ReadonlyComplex, t: number): this {
  const clamped = saturate(t);
  return this.lerp(other, smoothStep(0, 1, clamped));
 }

 /* ======================================================================== */
 /* Instance Conversion                                                      */
 /* ======================================================================== */

 /**
  * Converts the complex number to a 2D rotation matrix.
  * The complex number is normalized before conversion.
  * @param out - Optional output matrix object to populate
  * @returns Rotation matrix as Matrix2Like (plain object or provided out)
  *
  * @remarks
  * Returns a `Matrix2Like` object, not a `Matrix2` instance, to avoid
  * circular dependencies. If you need a full `Matrix2` instance, use:
  * ```typescript
  * const mat = Matrix2.fromObject(complex.toRotationMatrix());
  * ```
  *
  * @example
  * ```typescript
  * const c = Complex.fromPolar(1, Math.PI / 4);
  * const m = c.toRotationMatrix();
  * // m represents a 45° rotation: { m00: cos, m01: sin, m10: -sin, m11: cos }
  * ```
  *
  * @category Serialization
  * @since 0.1.0
  */
 toRotationMatrix(out?: Matrix2Like): Matrix2Like {
  const normalized = this.normalized;
  const result = out ?? { m00: 0, m01: 0, m10: 0, m11: 0 };
  result.m00 = normalized.real;
  result.m01 = normalized.imag;
  result.m10 = -normalized.imag;
  result.m11 = normalized.real;
  return result;
 }

 /**
  * Converts the complex number to a tuple [real, imag].
  * @returns Tuple with real and imaginary parts
  *
  * @example
  * ```typescript
  * const c = new Complex(3, 4);
  * const [real, imag] = c.toArray();
  * // real = 3, imag = 4
  * ```
  *
  * @category Serialization
  * @since 0.1.0
  */
 toArray(): [number, number] {
  return [this.real, this.imag];
 }

 /**
  * Converts the complex number to a plain object.
  * @returns Object with real and imag properties
  *
  * @example
  * ```typescript
  * const c = new Complex(3, 4);
  * const obj = c.toObject();
  * // { real: 3, imag: 4 }
  * ```
  *
  * @category Serialization
  * @since 0.1.0
  */
 toObject(): ComplexLike {
  return { real: this.real, imag: this.imag };
 }

 /**
  * Converts the complex number to a JSON-serializable object.
  * Called automatically by JSON.stringify().
  * @returns Object suitable for JSON serialization
  *
  * @example
  * ```typescript
  * const c = new Complex(3, 4);
  * const json = JSON.stringify(c);
  * // '{"real":3,"imag":4}'
  * ```
  *
  * @category Serialization
  * @since 0.1.0
  */
 toJSON(): ComplexLike {
  return this.toObject();
 }

 /**
  * Creates a human-readable string representation.
  * Uses standard mathematical notation: a + bi or a - bi.
  * @param precision - Number of decimal places (default: 4)
  * @returns Formatted string
  *
  * @example
  * ```typescript
  * const c = new Complex(3, 4);
  * console.log(c.toString());
  * // "3.0000 + 4.0000i"
  *
  * const c2 = new Complex(1, -2);
  * console.log(c2.toString());
  * // "1.0000 - 2.0000i"
  * ```
  *
  * @category Serialization
  * @since 0.1.0
  */
 toString(precision = 4): string {
  const realString = this.real.toFixed(precision);
  const imagString = Math.abs(this.imag).toFixed(precision);
  const sign = this.imag >= 0 ? '+' : '-';
  return `${realString} ${sign} ${imagString}i`;
 }

 /**
  * Creates a deep copy of this complex number.
  * @returns New Complex with identical values
  *
  * @example
  * ```typescript
  * const c = new Complex(3, 4);
  * const copy = c.clone();
  * copy.set(0, 0); // Original unchanged
  * ```
  *
  * @category Serialization
  * @since 0.1.0
  */
 clone(): Complex {
  return new Complex(this.real, this.imag);
 }

 /**
  * Iterator for array destructuring.
  * @returns Iterator yielding real then imag.
  *
  * @example
  * ```typescript
  * const [real, imag] = new Complex(3, 4);
  * ```
  *
  * @category Conversion
  * @since 0.9.0
  */
 *[Symbol.iterator](): IterableIterator<number> {
  yield this.real;
  yield this.imag;
 }
}
