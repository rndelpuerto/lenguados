/**
 * @file core/complex.ts
 * @module @lenguados/math2d/core
 * @description Deterministic complex number implementation for advanced mathematics
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

import {
 degreesToRadians,
 radiansToDegrees,
 radiansToTurns,
 turnsToRadians,
} from '../auxiliary/angle/conversion';
import { lerpAngle } from '../auxiliary/angle/interpolation';
import { sinCos } from '../auxiliary/angle/operations';
import { saturate } from '../auxiliary/scalar/arithmetic';
import {
 isNearZero,
 relativeEquals,
 nearEquals as scalarNearEquals,
} from '../auxiliary/scalar/comparison';
import { EPSILON, SQRT_HALF } from '../auxiliary/scalar/constants';
import { lerp, smoothStep } from '../auxiliary/scalar/interpolation';
import {
 atan2,
 exp as detExp,
 hypot,
 log as detLog,
 pow,
} from '../deterministic/deterministic-kernels';
import type { ComplexLike, Matrix2Like, ReadonlyVector2Like } from '../types';
import { assertFinite } from '../validation/assert';

import { Vector2 } from './vector2';

/* ========================================================================== */
/* Type Exports                                                               */
/* ========================================================================== */

/**
 * Readonly view of a {@link Complex} instance.
 *
 * @category Types
 * @since 0.7.0
 * @public
 */
export type ReadonlyComplex = Readonly<Complex>;

export { isComplexLike } from '../types';

/* ========================================================================== */
/* Helper Functions                                                           */
/* ========================================================================== */

/**
 * Permanently freezes a {@link Complex} instance so it can no longer be mutated.
 *
 * @remarks
 * - The returned object keeps its original reference; no new memory is allocated.
 * - In strict mode any subsequent attempt to modify `real` or `imag` throws a TypeError.
 *
 * @param complex - The Complex object to freeze
 * @returns The same instance, now typed as ReadonlyComplex
 *
 * @example
 * ```typescript
 * const UNIT = freezeComplex(new Complex(1, 0));
 * UNIT.real = 5; // Throws in strict mode
 * ```
 *
 * @category Helpers
 * @since 0.7.0
 */
export function freezeComplex(complex: Complex): ReadonlyComplex {
 return Object.freeze(complex);
}

/* ========================================================================== */
/* Class: Complex                                                             */
/* ========================================================================== */

/**
 * Mutable complex number with deterministic arithmetic and transforms.
 *
 * @remarks
 * - **Design:** Instance methods are mutable and chainable; static methods are pure
 *   with alloc-free overloads via `out` parameter. Uses Smith's algorithm for
 *   robust complex division.
 * - **Numerics:** Uses deterministic `sin`/`cos`/`atan2` kernels for cross-platform
 *   reproducibility. Division handles overflow/underflow via Baudin-Smith pre-scaling.
 * - **Safety:** "Safe" variants return fallback values instead of throwing on
 *   degeneracies (e.g., division by zero → `(0,0)`).
 *
 * @example
 * ```typescript
 * // Static (pure, allocation-controlled)
 * const sum = Complex.add(a, b);
 * const product = Complex.multiply(a, b);
 *
 * // Instance (mutable, chainable)
 * z.add(other).multiply(scalar).conjugate();
 * ```
 *
 * @category Core
 * @since 0.7.0
 */
/**
 * Smith's algorithm for robust complex division (a + bi) / (c + di).
 * Branches on |d| <= |c| vs |d| > |c| to avoid intermediate overflow.
 * Includes Baudin-Smith pre-scaling for extreme underflow cases.
 * @param aRe - Real part of the numerator
 * @param aIm - Imaginary part of the numerator
 * @param bRe - Real part of the denominator
 * @param bIm - Imaginary part of the denominator
 * @returns Tuple [real, imaginary] of the division result
 * @internal
 */
function complexDivideSmith(aRe: number, aIm: number, bRe: number, bIm: number): [number, number] {
 // Baudin-Smith pre-scaling: guard against extreme underflow
 const minValue = Number.MIN_VALUE * 2;
 if (Math.abs(bRe) < minValue && Math.abs(bIm) < minValue) {
  // Pre-scale by 2^53 to bring into normal range
  const scale = 9007199254740992; // 2^53
  bRe *= scale;
  bIm *= scale;
  aRe *= scale;
  aIm *= scale;
 }

 if (Math.abs(bIm) <= Math.abs(bRe)) {
  // |d| <= |c|: divide by c, use r = d/c
  const r = bIm / bRe;
  const denom = bRe + bIm * r;
  return [(aRe + aIm * r) / denom, (aIm - aRe * r) / denom];
 } else {
  // |d| > |c|: divide by d, use r = c/d
  const r = bRe / bIm;
  const denom = bIm + bRe * r;
  return [(aRe * r + aIm) / denom, (aIm * r - aRe) / denom];
 }
}

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

 /* ======================================================================== */
 /* Static Constants (Immutable)                                             */
 /* ======================================================================== */

 /**
  * Zero complex (0 + 0i).
  * @category Constant
  * @since 0.7.0
  */
 public static readonly ZERO = Object.freeze(new Complex(0, 0)) as ReadonlyComplex;

 /**
  * Number of elements when serialized to an array.
  * @category Constant
  * @since 0.7.0
  */
 public static readonly ELEMENT_COUNT = 2;

 /**
  * Real unit (1 + 0i).
  * @category Constant
  * @since 0.7.0
  */
 public static readonly ONE = Object.freeze(new Complex(1, 0)) as ReadonlyComplex;

 /**
  * Imaginary unit (0 + 1i).
  * @category Constant
  * @since 0.7.0
  */
 public static readonly I = Object.freeze(new Complex(0, 1)) as ReadonlyComplex;

 /**
  * Negative imaginary unit (0 - 1i).
  * @category Constant
  * @since 0.7.0
  */
 public static readonly NEG_I = Object.freeze(new Complex(0, -1)) as ReadonlyComplex;

 /**
  * Negative real unit (-1 + 0i).
  * @category Constant
  * @since 0.7.0
  */
 public static readonly NEG_ONE = Object.freeze(new Complex(-1, 0)) as ReadonlyComplex;

 /**
  * Epsilon complex for tolerance comparison.
  * @category Constant
  * @since 0.7.0
  */
 public static readonly EPSILON_COMPLEX = Object.freeze(
  new Complex(EPSILON, EPSILON),
 ) as ReadonlyComplex;

 /**
  * Square root of 2 as a real complex (√2 + 0i).
  * @category Constant
  * @since 0.7.0
  */
 public static readonly SQRT2 = Object.freeze(new Complex(Math.SQRT2, 0)) as ReadonlyComplex;

 /**
  * Inverse of square root of 2 as a real complex (1/√2 + 0i).
  * @category Constant
  * @since 0.7.0
  */
 public static readonly SQRT2_INV = Object.freeze(new Complex(SQRT_HALF, 0)) as ReadonlyComplex;

 /**
  * Pi as a real complex (π + 0i).
  * @category Constant
  * @since 0.7.0
  */
 public static readonly PI = Object.freeze(new Complex(Math.PI, 0)) as ReadonlyComplex;

 /**
  * Euler's number as a real complex (e + 0i).
  * @category Constant
  * @since 0.7.0
  */
 public static readonly E = Object.freeze(new Complex(Math.E, 0)) as ReadonlyComplex;

 /* ======================================================================== */
 /* Constructor                                                              */
 /* ======================================================================== */

 /**
  * Creates a new Complex number from real and imaginary parts.
  *
  * @param real - Real component. @defaultValue `0`
  * @param imag - Imaginary component. @defaultValue `0`
  */
 constructor(real = 0, imag = 0) {
  this.real = real;
  this.imag = imag;
  // Pure math: no assertions - Infinity/NaN are valid IEEE 754 values
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
  * @example
  * ```typescript
  * const z = Complex.fromPolar(1, Math.PI / 2); // → (0, 1)
  *
  * // Reuse an existing instance to avoid allocation
  * const out = new Complex();
  * Complex.fromPolar(2, Math.PI, out); // → (-2, 0)
  * ```
  *
  * @category Factory
  * @since 0.7.0
  */
 public static fromPolar(magnitude: number, angle: number, out?: Complex): Complex {
  assertFinite(angle, 'Complex.fromPolar:angle');
  const { cos, sin } = sinCos(angle);
  return this.ensureOut(out).set(magnitude * cos, magnitude * sin);
 }

 /**
  * Creates a complex number from polar form using pre-computed cos/sin.
  *
  * @remarks
  * Trusts caller-provided cos/sin without normalization or validation,
  * consistent with all *CS methods in the library. Use when trig has
  * been pre-computed (e.g., via {@link sinCos}) to avoid redundant computation.
  *
  * @param magnitude - Distance from origin
  * @param cos - Pre-computed cosine of the angle
  * @param sin - Pre-computed sine of the angle
  * @param out - Optional output complex
  * @returns Complex number `(magnitude * cos, magnitude * sin)`
  *
  * @example
  * ```typescript
  * const { cos, sin } = sinCos(Math.PI / 4);
  * const z = Complex.fromPolarCS(2, cos, sin); // → (√2, √2)
  *
  * // Reuse an existing instance to avoid allocation
  * const out = new Complex();
  * Complex.fromPolarCS(1, cos, sin, out); // → (√2/2, √2/2)
  * ```
  *
  * @category Factory
  * @since 0.7.0
  */
 public static fromPolarCS(magnitude: number, cos: number, sin: number, out?: Complex): Complex {
  return this.ensureOut(out).set(magnitude * cos, magnitude * sin);
 }

 /**
  * Creates a complex number from an array [real, imag].
  * @param array - Source array
  * @param offset - Index offset (default: 0)
  * @param out - Optional output complex
  * @returns Complex number
  * @throws {RangeError} If offset is out of bounds
  *
  * @example
  * ```typescript
  * const z = Complex.fromArray([3, 4]); // → (3, 4)
  *
  * // With offset into a larger array
  * const buf = [0, 0, 5, 6];
  * const z2 = Complex.fromArray(buf, 2); // → (5, 6)
  *
  * // Reuse an existing instance to avoid allocation
  * const out = new Complex();
  * Complex.fromArray([1, 2], 0, out); // → (1, 2)
  * ```
  *
  * @category Factory
  * @since 0.7.0
  */
 public static fromArray(array: ArrayLike<number>, offset = 0, out?: Complex): Complex {
  if (offset < 0 || offset + Complex.ELEMENT_COUNT > array.length) {
   throw new RangeError(
    `Complex.fromArray: offset ${offset} is out of bounds for array of length ${array.length}`,
   );
  }
  return this.ensureOut(out).set(array[offset]!, array[offset + 1]!);
 }

 /**
  * Creates a complex number from an object { real, imag }.
  * @param object - Source object
  * @param out - Optional output complex
  * @returns Complex number
  *
  * @example
  * ```typescript
  * const z = Complex.fromObject({ real: 3, imag: 4 }); // → (3, 4)
  *
  * // Reuse an existing instance to avoid allocation
  * const out = new Complex();
  * Complex.fromObject({ real: 1, imag: -1 }, out); // → (1, -1)
  * ```
  *
  * @category Factory
  * @since 0.7.0
  */
 public static fromObject(object: ComplexLike, out?: Complex): Complex {
  return this.ensureOut(out).set(object.real, object.imag);
 }

 /**
  * Creates a complex number from individual real and imaginary values.
  * @param real - Real component
  * @param imag - Imaginary component
  * @param out - Optional output complex
  * @returns Complex number
  *
  * @example
  * ```typescript
  * Complex.fromValues(1, 0);    // Real unit (1 + 0i)
  * Complex.fromValues(0, 1);    // Imaginary unit (0 + 1i)
  * Complex.fromValues(3, 4);    // 3 + 4i
  * ```
  *
  * @category Factory
  * @since 0.7.0
  */
 public static fromValues(real: number, imag: number, out?: Complex): Complex {
  return this.ensureOut(out).set(real, imag);
 }

 /**
  * Creates a deep copy of a complex number.
  * @param source - Complex to clone
  * @param out - Optional output complex
  * @returns A Complex with identical values
  *
  * @example
  * ```typescript
  * const z = Complex.fromValues(3, 4);
  * const z2 = Complex.clone(z); // → (3, 4), independent copy
  *
  * // Reuse an existing instance to avoid allocation
  * const out = new Complex();
  * Complex.clone(z, out); // → (3, 4)
  * ```
  *
  * @category Factory
  * @since 0.7.0
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
  * @example
  * ```typescript
  * const src = Complex.fromValues(3, 4);
  * const dst = new Complex();
  * Complex.copy(src, dst); // dst → (3, 4)
  * ```
  *
  * @category Factory
  * @since 0.7.0
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
  * @since 0.7.0
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
  * @since 0.7.0
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
  * @example
  * ```typescript
  * const a = new Complex(1, 2); // 1 + 2i
  * const b = new Complex(3, 4); // 3 + 4i
  * const result = Complex.multiply(a, b); // -5 + 10i
  * ```
  *
  * @category Arithmetic
  * @since 0.7.0
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
  * @throws {RangeError} If denominator magnitude is near zero
  *
  * @example
  * ```typescript
  * Complex.divide(new Complex(4, 2), new Complex(1, 1)); // (3, -1)
  * Complex.divide(new Complex(1, 0), Complex.ZERO);      // throws RangeError
  * ```
  *
  * @see {@link divideSafe} - Returns fallback on zero denominator
  * @see {@link divideUnchecked} - No validation
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 public static divide(a: ReadonlyComplex, b: ReadonlyComplex, out?: Complex): Complex {
  const magSq = b.real * b.real + b.imag * b.imag;
  if (isNearZero(magSq)) {
   throw new RangeError('Complex.divide: cannot divide by zero-magnitude complex number');
  }
  const [re, im] = complexDivideSmith(a.real, a.imag, b.real, b.imag);
  return Complex.ensureOut(out).set(re, im);
 }

 /**
  * Divides two complex numbers, returning (0,0) if denominator is near zero.
  * @param a - Numerator
  * @param b - Denominator
  * @param out - Optional output complex
  * @returns Quotient, or (0,0) if denominator magnitude is near zero
  *
  * @example
  * ```typescript
  * Complex.divideSafe(new Complex(4, 2), new Complex(1, 1)); // (3, -1)
  * Complex.divideSafe(new Complex(1, 0), Complex.ZERO);      // (0, 0)
  * ```
  *
  * @see {@link divide} - Throws for zero denominator
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 public static divideSafe(a: ReadonlyComplex, b: ReadonlyComplex, out?: Complex): Complex {
  const magSq = b.real * b.real + b.imag * b.imag;
  if (isNearZero(magSq)) {
   return Complex.ensureOut(out).set(0, 0);
  }
  const [re, im] = complexDivideSmith(a.real, a.imag, b.real, b.imag);
  return Complex.ensureOut(out).set(re, im);
 }

 /**
  * Divides two complex numbers without validation.
  *
  * @remarks
  * **Precondition:** `|b| ≠ 0`. Calling with zero denominator produces Infinity/NaN.
  *
  * @param a - Numerator
  * @param b - Denominator (must have non-zero magnitude)
  * @param out - Optional output complex
  * @returns Quotient
  *
  * @see {@link divide} - Throws on zero denominator
  * @see {@link divideSafe} - Returns fallback on zero denominator
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 public static divideUnchecked(a: ReadonlyComplex, b: ReadonlyComplex, out?: Complex): Complex {
  const [re, im] = complexDivideSmith(a.real, a.imag, b.real, b.imag);
  return Complex.ensureOut(out).set(re, im);
 }

 /**
  * Scales a complex number.
  * @param complex - Complex number to scale
  * @param scalar - Scale factor
  * @param out - Optional output complex
  * @returns Scaled complex
  *
  * @category Arithmetic
  * @since 0.7.0
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
  * @since 0.7.0
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
  * @since 0.7.0
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
  * @param t - Interpolation factor (not clamped, allows extrapolation)
  * @param out - Optional output complex
  * @returns Interpolated complex
  *
  * @category Interpolation
  * @since 0.7.0
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
  * @since 0.7.0
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
  * @since 0.7.0
  */
 public static slerp(a: ReadonlyComplex, b: ReadonlyComplex, t: number, out?: Complex): Complex {
  const mag1 = Complex.magnitude(a);
  const mag2 = Complex.magnitude(b);
  // Fall back to component-wise lerp if either input has near-zero magnitude
  if (isNearZero(mag1) || isNearZero(mag2)) {
   return Complex.lerp(a, b, t, out);
  }
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
  * @since 0.7.0
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
  *
  * @remarks
  * Uses Hermite smoothStep for ease-in-out effect.
  * Equivalent to `lerp(a, b, smoothStep(0, 1, clamp(t, 0, 1)))`.
  *
  * @param a - Source complex number
  * @param b - Target complex number
  * @param t - Interpolation factor (clamped to [0, 1])
  * @param out - Optional output complex
  * @returns Smoothly interpolated complex number
  *
  * @example
  * ```typescript
  * const a = Complex.fromPolar(1, 0);
  * const b = Complex.fromPolar(1, Math.PI / 2);
  * const smooth = Complex.smoothStep(a, b, 0.5); // Smooth interpolation
  * ```
  *
  * @category Interpolation
  * @since 0.7.0
  */
 public static smoothStep(
  a: ReadonlyComplex,
  b: ReadonlyComplex,
  t: number,
  out?: Complex,
 ): Complex {
  return Complex.lerp(a, b, smoothStep(0, 1, t), out);
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
  * @param a - First complex
  * @param b - Second complex
  * @returns True if real and imaginary parts are exactly identical
  *
  * @category Comparison
  * @since 0.7.0
  */
 public static exactEquals(a: ReadonlyComplex, b: ReadonlyComplex): boolean {
  return a.real === b.real && a.imag === b.imag;
 }

 /**
  * Approximate equality between two complex numbers using relative tolerance.
  *
  * @remarks
  * Uses relative tolerance: `|a - b| <= epsilon * max(1, |a|, |b|)` per component.
  *
  * @param a - First complex
  * @param b - Second complex
  * @param epsilon - Relative tolerance. @defaultValue `EPSILON`
  * @returns True if within scaled epsilon
  *
  * @category Comparison
  * @since 0.7.0
  */
 public static nearEquals(
  a: ReadonlyComplex,
  b: ReadonlyComplex,
  epsilon: number = EPSILON,
 ): boolean {
  return relativeEquals(a.real, b.real, epsilon) && relativeEquals(a.imag, b.imag, epsilon);
 }

 /**
  * Tests if a complex number has unit magnitude.
  * @param complex - Complex number to test
  * @param epsilon - Tolerance (default: EPSILON)
  * @returns True if |z| ≈ 1
  *
  * @category Comparison
  * @since 0.7.0
  */
 public static isUnit(complex: ReadonlyComplex, epsilon: number = EPSILON): boolean {
  const magnitudeSq = complex.real * complex.real + complex.imag * complex.imag;
  return Math.abs(magnitudeSq - 1) <= epsilon;
 }

 /**
  * Tests if a complex number is the multiplicative identity (1 + 0i).
  *
  * @remarks
  * The multiplicative identity in ℂ is 1 + 0i, where z * 1 = z for all z.
  * This is equivalent to Rotation2.isIdentity() (0° rotation).
  *
  * @param complex - Complex number to test
  * @param epsilon - Tolerance (default: EPSILON)
  * @returns True if z ≈ 1 + 0i
  *
  * @category Comparison
  * @since 0.7.0
  */
 public static isIdentity(complex: ReadonlyComplex, epsilon: number = EPSILON): boolean {
  return scalarNearEquals(complex.real, 1, epsilon) && isNearZero(complex.imag, epsilon);
 }

 /**
  * Returns the magnitude of a complex number.
  * @param complex - Complex number
  * @returns Magnitude
  *
  * @category Computed
  * @since 0.7.0
  */
 public static magnitude(complex: ReadonlyComplex): number {
  return hypot(complex.real, complex.imag);
 }

 /**
  * Returns the argument (phase angle) of a complex number.
  * @param complex - Complex number
  * @returns Angle in radians
  *
  * @category Computed
  * @since 0.7.0
  */
 public static argument(complex: ReadonlyComplex): number {
  return atan2(complex.imag, complex.real);
 }

 /**
  * Returns the squared magnitude of a complex number.
  * @param complex - Complex number
  * @returns Squared magnitude
  *
  * @category Computed
  * @since 0.7.0
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
  * @example
  * ```typescript
  * Complex.normalize(new Complex(3, 4)); // (0.6, 0.8)
  * Complex.normalize(Complex.ZERO);      // throws RangeError
  * ```
  *
  * @see {@link normalizeSafe} - Returns fallback on zero magnitude
  * @see {@link normalizeUnchecked} - No validation
  *
  * @category Transform
  * @since 0.7.0
  */
 public static normalize(complex: ReadonlyComplex, out?: Complex): Complex {
  const mag = Complex.magnitude(complex);
  if (isNearZero(mag)) {
   throw new RangeError('Complex.normalize: cannot normalize zero-magnitude complex number');
  }
  const invMag = 1 / mag;
  return Complex.ensureOut(out).set(complex.real * invMag, complex.imag * invMag);
 }

 /**
  * Safe normalization that handles zero-magnitude complex numbers.
  *
  * @remarks
  * Unlike {@link normalize}, this method returns the unit real (1, 0)
  * instead of throwing when the input has zero magnitude. The fallback
  * `(1, 0)` is the multiplicative identity for complex numbers, ensuring
  * that downstream multiplication operations remain neutral rather than
  * zeroing out results.
  *
  * @param complex - Complex number to normalize
  * @param out - Optional output complex
  * @returns Normalized complex, or (1, 0) if input has zero magnitude
  *
  * @example
  * ```typescript
  * const zero = Complex.ZERO;
  * const safe = Complex.normalizeSafe(zero); // Returns (1, 0)
  * ```
  *
  * @see {@link normalize} - Throws for zero magnitude
  *
  * @category Transform
  * @since 0.7.0
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
  * Normalizes a complex number without validation (for hot paths).
  *
  * @remarks
  * **WARNING:** This method performs no validation.
  * - If complex has zero magnitude, the result will be (NaN, NaN).
  * - Use only when you can guarantee non-zero magnitude.
  *
  * @param complex - Complex number to normalize (must have non-zero magnitude)
  * @param out - Optional output complex
  * @returns Normalized complex
  *
  * @see {@link normalize} - Throws on zero magnitude
  * @see {@link normalizeSafe} - Returns fallback on zero magnitude
  *
  * @category Transform
  * @since 0.7.0
  */
 public static normalizeUnchecked(complex: ReadonlyComplex, out?: Complex): Complex {
  const magSq = complex.real * complex.real + complex.imag * complex.imag;
  const invMag = 1 / Math.sqrt(magSq);
  return Complex.ensureOut(out).set(complex.real * invMag, complex.imag * invMag);
 }

 /**
  * Applies a complex number as a rotation to a vector.
  *
  * @remarks
  * - Use `Complex.apply` for pure rotation (operator semantics).
  * - Use `Matrix2.transformVector` for general linear transformations (spatial semantics).
  * - The complex number is normalized before applying to ensure a pure rotation.
  * - If the complex number has near-zero magnitude, the original vector is returned
  *   unchanged (no rotation applied) rather than throwing.
  *
  * @param complex - Complex number (will be normalized first)
  * @param vector - Vector to rotate
  * @param out - Optional output vector
  * @returns Rotated vector
  *
  * @example
  * ```typescript
  * const c = Complex.fromPolar(1, Math.PI / 4);
  * const v = { x: 1, y: 0 };
  * const rotated = Complex.apply(c, v); // (0.707, 0.707)
  * ```
  *
  * @category Transform
  * @since 0.7.0
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
  * Applies the inverse rotation of a complex number to a vector.
  *
  * @remarks
  * - Use `Complex.applyInverse` for pure rotation (operator semantics).
  * - Use `Matrix2.transformVector` for general linear transformations (spatial semantics).
  * - Uses the conjugate of the normalized complex number.
  *
  * Relationship: `applyInverse(c, apply(c, v)) ≈ v`
  *
  * @param complex - Complex number (will be normalized first)
  * @param vector - Vector to rotate inversely
  * @param out - Optional output vector
  * @returns Rotated vector (in the opposite direction)
  *
  * @example
  * ```typescript
  * const c = Complex.fromPolar(1, Math.PI / 4); // 45° rotation
  * const v = { x: 1, y: 0 };
  * const rotated = Complex.apply(c, v);        // ≈ (0.707, 0.707)
  * const back = Complex.applyInverse(c, rotated); // ≈ (1, 0)
  * ```
  *
  * @category Transform
  * @since 0.7.0
  */
 public static applyInverse(
  complex: ReadonlyComplex,
  vector: ReadonlyVector2Like,
  out?: Vector2,
 ): Vector2 {
  const mag = Complex.magnitude(complex);
  if (isNearZero(mag)) {
   return Vector2.clone(vector, out);
  }
  const invMag = 1 / mag;
  // Conjugate: use (real, -imag) for inverse rotation
  const c = complex.real * invMag;
  const s = -complex.imag * invMag;
  return Vector2.fromValues(c * vector.x - s * vector.y, s * vector.x + c * vector.y, out);
 }

 /**
  * Returns the reciprocal of a complex number.
  * @param complex - Complex number
  * @param out - Optional output complex
  * @returns Reciprocal
  * @throws {RangeError} If magnitude is near zero
  *
  * @example
  * ```typescript
  * Complex.reciprocal(new Complex(0, 2));  // (0, -0.5)
  * Complex.reciprocal(Complex.ZERO);       // throws RangeError
  * ```
  *
  * @see {@link reciprocalSafe} - Returns fallback on zero magnitude
  * @see {@link reciprocalUnchecked} - No validation
  *
  * @category Transform
  * @since 0.7.0
  */
 public static reciprocal(complex: ReadonlyComplex, out?: Complex): Complex {
  const mag = Complex.magnitude(complex);
  if (isNearZero(mag)) {
   throw new RangeError('Complex.reciprocal: cannot compute reciprocal of zero-magnitude complex');
  }
  const magSq = mag * mag;
  const invMagSq = 1 / magSq;
  return Complex.ensureOut(out).set(complex.real * invMagSq, -complex.imag * invMagSq);
 }

 /**
  * Returns the reciprocal of a complex number, returning (0,0) if magnitude is near zero.
  * @param complex - Complex number
  * @param out - Optional output complex
  * @returns Reciprocal, or (0,0) if input has zero magnitude
  *
  * @example
  * ```typescript
  * Complex.reciprocalSafe(new Complex(0, 2));  // (0, -0.5)
  * Complex.reciprocalSafe(Complex.ZERO);       // (0, 0)
  * ```
  *
  * @see {@link reciprocal} - Throws for zero magnitude
  *
  * @category Transform
  * @since 0.7.0
  */
 public static reciprocalSafe(complex: ReadonlyComplex, out?: Complex): Complex {
  const mag = Complex.magnitude(complex);
  if (isNearZero(mag)) {
   return Complex.ensureOut(out).set(0, 0);
  }
  const magSq = mag * mag;
  const invMagSq = 1 / magSq;
  return Complex.ensureOut(out).set(complex.real * invMagSq, -complex.imag * invMagSq);
 }

 /**
  * Returns the reciprocal of a complex number without validation.
  *
  * @remarks
  * **Precondition:** `|complex| ≠ 0`. Calling with zero produces Infinity/NaN.
  *
  * @param complex - Complex number (must have non-zero magnitude)
  * @param out - Optional output complex
  * @returns Reciprocal
  *
  * @see {@link reciprocal} - Throws on zero magnitude
  * @see {@link reciprocalSafe} - Returns fallback on zero magnitude
  *
  * @category Transform
  * @since 0.7.0
  */
 public static reciprocalUnchecked(complex: ReadonlyComplex, out?: Complex): Complex {
  const magSq = Complex.magnitudeSq(complex);
  const invMagSq = 1 / magSq;
  return Complex.ensureOut(out).set(complex.real * invMagSq, -complex.imag * invMagSq);
 }

 /**
  * Raises a complex number to a power.
  * @param complex - Base complex number
  * @param exponent - Exponent
  * @param out - Optional output complex
  * @returns Complex raised to power
  * @throws {RangeError} If magnitude is zero and exponent is negative
  *
  * @category Transform
  * @since 0.7.0
  */
 public static pow(complex: ReadonlyComplex, exponent: number, out?: Complex): Complex {
  const mag = Complex.magnitude(complex);
  if (mag === 0 && exponent < 0) {
   throw new RangeError('Complex.pow: cannot raise zero to a negative exponent');
  }
  const angle = Complex.argument(complex);
  const poweredMagnitude = pow(mag, exponent);
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
  * @since 0.7.0
  */
 public static sqrt(complex: ReadonlyComplex, out?: Complex): Complex {
  return Complex.pow(complex, 0.5, out);
 }

 /**
  * Computes the complex exponential e^z using Euler's formula.
  * @param z - Complex exponent
  * @param out - Optional output complex
  * @returns e^z = e^re * (cos(im) + i·sin(im))
  *
  * @category Transform
  * @since 0.9.0
  */
 public static exp(z: ReadonlyComplex, out?: Complex): Complex {
  const er = detExp(z.real);
  const sc = sinCos(z.imag);
  return Complex.ensureOut(out).set(er * sc.cos, er * sc.sin);
 }

 /**
  * Computes the principal complex logarithm.
  * @param z - Complex number
  * @param out - Optional output complex
  * @returns log(z) = (ln|z|, arg(z))
  *
  * @category Transform
  * @since 0.9.0
  */
 public static log(z: ReadonlyComplex, out?: Complex): Complex {
  const mag = Complex.magnitude(z);
  const argument = Complex.argument(z);
  return Complex.ensureOut(out).set(detLog(mag), argument);
 }

 /**
  * Converts a complex number to polar coordinates.
  * @param z - Complex number
  * @returns Object with magnitude and angle
  *
  * @category Conversion
  * @since 0.9.0
  */
 public static toPolar(z: ReadonlyComplex): { magnitude: number; angle: number } {
  return { magnitude: Complex.magnitude(z), angle: Complex.argument(z) };
 }

 /**
  * Tests if a complex number is exactly zero.
  *
  * @remarks
  * For tolerance-based comparison, use {@link isNearZero}.
  *
  * @param complex - Complex number to test
  * @returns True if both real and imaginary parts are exactly 0
  *
  * @category Comparison
  * @since 0.7.0
  */
 public static isZero(complex: ReadonlyComplex): boolean {
  return complex.real === 0 && complex.imag === 0;
 }

 /**
  * Tests if a complex number is near zero within tolerance.
  *
  * @param complex - Complex number to test
  * @param epsilon - Tolerance (default: EPSILON)
  * @returns True if both components are within epsilon of zero
  *
  * @category Comparison
  * @since 0.7.0
  */
 public static isNearZero(complex: ReadonlyComplex, epsilon: number = EPSILON): boolean {
  return isNearZero(complex.real, epsilon) && isNearZero(complex.imag, epsilon);
 }

 /**
  * Tests if a complex number is purely real.
  * @param complex - Complex number
  * @param epsilon - Tolerance (default: EPSILON)
  * @returns True if imaginary part is near zero
  *
  * @category Comparison
  * @since 0.7.0
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
  * @since 0.7.0
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
  * @since 0.7.0
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
  * @since 0.7.0
  */
 public static hasNaN(complex: ReadonlyComplex): boolean {
  return Number.isNaN(complex.real) || Number.isNaN(complex.imag);
 }

 /**
  * Tests if any component is infinite (±Infinity).
  *
  * @remarks
  * Distinguishes infinity from NaN. Use {@link isFinite} to check for both.
  *
  * @param complex - Complex to test
  * @returns True if any component is ±Infinity
  *
  * @category Comparison
  * @since 0.7.0
  */
 public static hasInfinity(complex: ReadonlyComplex): boolean {
  return (
   (!Number.isFinite(complex.real) && !Number.isNaN(complex.real)) ||
   (!Number.isFinite(complex.imag) && !Number.isNaN(complex.imag))
  );
 }

 /* ======================================================================== */
 /* Instance Mutators                                                        */
 /* ======================================================================== */

 /**
  * Sets the real and imaginary parts.
  * @param real - Real part
  * @param imag - Imaginary part
  * @returns This for chaining
  *
  * @category Mutator
  * @since 0.7.0
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
  * @since 0.7.0
  */
 copy(other: ReadonlyComplex): this {
  this.real = other.real;
  this.imag = other.imag;
  return this;
 }

 /**
  * Sets from polar coordinates.
  * @param magnitude - Distance from origin
  * @param angle - Angle in radians
  * @returns This for chaining
  *
  * @category Mutator
  * @since 0.7.0
  */
 setFromPolar(magnitude: number, angle: number): this {
  const { cos, sin } = sinCos(angle);
  return this.set(magnitude * cos, magnitude * sin);
 }

 /**
  * Sets from array values.
  * @param array - Source array [real, imag]
  * @param offset - Starting index (default 0)
  * @returns This for chaining
  *
  * @category Mutator
  * @since 0.7.0
  */
 setFromArray(array: ArrayLike<number>, offset = 0): this {
  if (offset < 0 || offset + 2 > array.length) {
   throw new RangeError(
    `Complex.setFromArray: offset ${offset} out of bounds for array length ${array.length}`,
   );
  }
  return this.set(array[offset]!, array[offset + 1]!);
 }

 /**
  * Sets from a Vector2 (x→real, y→imag).
  * @param v - Source vector
  * @returns This for chaining
  *
  * @category Mutator
  * @since 0.7.0
  */
 setFromVector2(v: ReadonlyVector2Like): this {
  return this.set(v.x, v.y);
 }

 /* ======================================================================== */
 /* Instance Computed                                                        */
 /* ======================================================================== */

 /**
  * Returns the magnitude of this complex number.
  * @returns Magnitude
  *
  * @category Computed
  * @since 0.7.0
  */
 magnitude(): number {
  return hypot(this.real, this.imag);
 }

 /**
  * Returns the squared magnitude of this complex number.
  * @returns Squared magnitude
  *
  * @category Computed
  * @since 0.7.0
  */
 magnitudeSq(): number {
  return this.real * this.real + this.imag * this.imag;
 }

 /**
  * Returns the argument (phase angle) of this complex number.
  * @returns Angle in radians
  *
  * @category Computed
  * @since 0.7.0
  */
 argument(): number {
  return atan2(this.imag, this.real);
 }

 /**
  * Gets the phase angle in radians.
  * Symmetric with Rotation2.angle getter.
  * @returns Angle in radians
  *
  * @category Accessor
  * @since 0.7.0
  */
 get angle(): number {
  return this.argument();
 }

 /**
  * Sets the phase angle in radians.
  * Preserves magnitude, only changes angle. Zero-allocation in-place mutation.
  * Symmetric with Rotation2.angle setter.
  *
  * @remarks
  * Unlike immutable libraries (complex.js, math.js), we provide mutable setters
  * for zero-allocation hot paths in game loops and physics simulations.
  *
  * @example
  * ```typescript
  * const c = Complex.fromPolar(2, 0);
  * c.angle = Math.PI / 4;
  * c.magnitude(); // Still 2
  * c.angle;       // ≈ Math.PI / 4
  * ```
  *
  * @category Accessor
  * @since 0.7.0
  */
 set angle(value: number) {
  const mag = this.magnitude();
  const sc = sinCos(value);
  this.real = mag * sc.cos;
  this.imag = mag * sc.sin;
 }

 /**
  * Gets the phase angle in degrees.
  * Symmetric with Rotation2.angleDegrees getter.
  * @returns Angle in degrees
  *
  * @category Accessor
  * @since 0.7.0
  */
 get angleDegrees(): number {
  return radiansToDegrees(this.argument());
 }

 /**
  * Sets the phase angle in degrees.
  * Preserves magnitude, only changes angle. Zero-allocation in-place mutation.
  * Symmetric with Rotation2.angleDegrees setter.
  *
  * @category Accessor
  * @since 0.7.0
  */
 set angleDegrees(value: number) {
  this.angle = degreesToRadians(value);
 }

 /**
  * Gets the phase angle in turns (0-1 = one full rotation).
  * Symmetric with Rotation2.angleTurns getter.
  * @returns Angle in turns (0-1 range)
  *
  * @category Accessor
  * @since 0.7.0
  */
 get angleTurns(): number {
  return radiansToTurns(this.argument());
 }

 /**
  * Sets the phase angle in turns.
  * Preserves magnitude, only changes angle. Zero-allocation in-place mutation.
  * Symmetric with Rotation2.angleTurns setter.
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
  * Adds another complex number in place.
  * @param other - Complex number to add
  * @returns This for chaining
  *
  * @category Arithmetic
  * @since 0.7.0
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
  * @since 0.7.0
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
  * @since 0.7.0
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
  * @throws {RangeError} If denominator magnitude is near zero
  *
  * @example
  * ```typescript
  * new Complex(4, 2).divide(new Complex(1, 1)); // (3, -1)
  * new Complex(1, 0).divide(Complex.ZERO);      // throws RangeError
  * ```
  *
  * @see {@link divideSafe} - Returns fallback on zero denominator
  * @see {@link divideUnchecked} - No validation
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 divide(other: ReadonlyComplex): this {
  Complex.divide(this, other, this);
  return this;
 }

 /**
  * Divides by another complex number in place (safe).
  * @param other - Complex number to divide by
  * @returns This for chaining (sets to (0,0) if denominator near zero)
  *
  * @example
  * ```typescript
  * new Complex(4, 2).divideSafe(new Complex(1, 1)); // (3, -1)
  * new Complex(1, 0).divideSafe(Complex.ZERO);      // (0, 0)
  * ```
  *
  * @see {@link divide} - Throws for zero denominator
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 divideSafe(other: ReadonlyComplex): this {
  Complex.divideSafe(this, other, this);
  return this;
 }

 /**
  * Divides by another complex number in place (unchecked).
  *
  * @remarks
  * **Precondition:** `|other| ≠ 0`.
  *
  * @param other - Complex number to divide by (must have non-zero magnitude)
  * @returns This for chaining
  *
  * @see {@link divide} - Throws on zero denominator
  * @see {@link divideSafe} - Returns fallback on zero denominator
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 divideUnchecked(other: ReadonlyComplex): this {
  Complex.divideUnchecked(this, other, this);
  return this;
 }

 /**
  * Scales this complex number by a scalar in place.
  * @param scalar - Scale factor
  * @returns This for chaining
  *
  * @category Arithmetic
  * @since 0.7.0
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
  * @since 0.7.0
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
  * @example
  * ```typescript
  * new Complex(3, 4).normalize(); // (0.6, 0.8)
  * Complex.ZERO.normalize();      // throws RangeError
  * ```
  *
  * @see {@link normalizeSafe} - Returns fallback on zero magnitude
  * @see {@link normalizeUnchecked} - No validation
  *
  * @category Transform
  * @since 0.7.0
  */
 normalize(): this {
  const mag = this.magnitude();
  if (isNearZero(mag)) {
   throw new RangeError('Complex.normalize: cannot normalize zero-magnitude complex number');
  }
  const invMag = 1 / mag;
  this.real *= invMag;
  this.imag *= invMag;
  return this;
 }

 /**
  * Safe normalization. Sets to (1, 0) if magnitude is near zero.
  * @returns This for chaining
  *
  * @example
  * ```typescript
  * new Complex(3, 4).normalizeSafe(); // (0.6, 0.8)
  * new Complex(0, 0).normalizeSafe(); // (1, 0)
  * ```
  *
  * @see {@link normalize} - Throws for zero magnitude
  *
  * @category Transform
  * @since 0.7.0
  */
 normalizeSafe(): this {
  const mag = this.magnitude();
  if (isNearZero(mag)) {
   this.real = 1;
   this.imag = 0;
   return this;
  }
  const invMag = 1 / mag;
  this.real *= invMag;
  this.imag *= invMag;
  return this;
 }

 /**
  * Normalizes this complex number without validation (for hot paths).
  *
  * @remarks
  * **WARNING:** This method performs no validation.
  * - If magnitude is zero, this will become (NaN, NaN).
  * - Use only when you can guarantee non-zero magnitude.
  *
  * @returns This for chaining
  *
  * @see {@link normalize} - Throws on zero magnitude
  * @see {@link normalizeSafe} - Returns fallback on zero magnitude
  *
  * @category Transform
  * @since 0.7.0
  */
 normalizeUnchecked(): this {
  const magSq = this.real * this.real + this.imag * this.imag;
  const invMag = 1 / Math.sqrt(magSq);
  this.real *= invMag;
  this.imag *= invMag;
  return this;
 }

 /**
  * Applies this complex number as a rotation to a vector.
  *
  * @remarks
  * The complex number is normalized before applying to ensure
  * a pure rotation without scaling.
  *
  * @param vector - Vector to rotate
  * @param out - Optional output vector
  * @returns Rotated vector
  *
  * @example
  * ```typescript
  * const c = Complex.fromPolar(1, Math.PI / 4);
  * const v = { x: 1, y: 0 };
  * const rotated = c.apply(v); // (0.707, 0.707)
  * ```
  *
  * @category Transform
  * @since 0.7.0
  */
 apply(vector: ReadonlyVector2Like, out?: Vector2): Vector2 {
  return Complex.apply(this, vector, out);
 }

 /**
  * Applies the inverse rotation of this complex number to a vector.
  *
  * @remarks
  * Uses the conjugate of the normalized complex number.
  * For a complex representing angle θ, this rotates by -θ.
  *
  * Relationship: `c.applyInverse(c.apply(v)) ≈ v`
  *
  * @param vector - Vector to rotate inversely
  * @param out - Optional output vector
  * @returns Rotated vector (in the opposite direction)
  *
  * @example
  * ```typescript
  * const c = Complex.fromPolar(1, Math.PI / 4);
  * const v = { x: 1, y: 0 };
  * const rotated = c.apply(v);          // ≈ (0.707, 0.707)
  * const back = c.applyInverse(rotated); // ≈ (1, 0)
  * ```
  *
  * @category Transform
  * @since 0.7.0
  */
 applyInverse(vector: ReadonlyVector2Like, out?: Vector2): Vector2 {
  return Complex.applyInverse(this, vector, out);
 }

 /**
  * Computes the reciprocal of this complex number in place.
  * @returns This for chaining
  * @throws {RangeError} If magnitude is near zero
  *
  * @example
  * ```typescript
  * new Complex(0, 2).reciprocal();  // (0, -0.5)
  * new Complex(0, 0).reciprocal();  // throws RangeError
  * ```
  *
  * @see {@link reciprocalSafe} - Returns fallback on zero magnitude
  * @see {@link reciprocalUnchecked} - No validation
  *
  * @category Transform
  * @since 0.7.0
  */
 reciprocal(): this {
  const magSq = this.magnitudeSq();
  if (isNearZero(magSq)) {
   throw new RangeError('Complex.reciprocal: cannot compute reciprocal of zero-magnitude complex');
  }
  const invMagSq = 1 / magSq;
  this.real *= invMagSq;
  this.imag = -this.imag * invMagSq;
  return this;
 }

 /**
  * Computes the reciprocal of this complex number in place (safe).
  * @returns This for chaining (sets to (0,0) if magnitude near zero)
  *
  * @example
  * ```typescript
  * new Complex(0, 2).reciprocalSafe();  // (0, -0.5)
  * new Complex(0, 0).reciprocalSafe();  // (0, 0)
  * ```
  *
  * @see {@link reciprocal} - Throws for zero magnitude
  *
  * @category Transform
  * @since 0.7.0
  */
 reciprocalSafe(): this {
  const magSq = this.magnitudeSq();
  if (isNearZero(magSq)) {
   this.real = 0;
   this.imag = 0;
   return this;
  }
  const invMagSq = 1 / magSq;
  this.real *= invMagSq;
  this.imag = -this.imag * invMagSq;
  return this;
 }

 /**
  * Computes the reciprocal of this complex number in place (unchecked).
  *
  * @remarks
  * **Precondition:** Magnitude must be non-zero.
  *
  * @returns This for chaining
  *
  * @see {@link reciprocal} - Throws on zero magnitude
  * @see {@link reciprocalSafe} - Returns fallback on zero magnitude
  *
  * @category Transform
  * @since 0.7.0
  */
 reciprocalUnchecked(): this {
  const magSq = this.magnitudeSq();
  const invMagSq = 1 / magSq;
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
  * @since 0.7.0
  */
 pow(exponent: number): this {
  const mag = this.magnitude();
  if (mag === 0 && exponent < 0) {
   throw new RangeError('Complex.pow: cannot raise zero to a negative exponent');
  }
  const angle = this.argument();
  const poweredMagnitude = pow(mag, exponent);
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
  * @since 0.7.0
  */
 sqrt(): this {
  return this.pow(0.5);
 }

 /**
  * Computes the complex exponential e^z in place using Euler's formula.
  * @returns This for chaining
  *
  * @category Transform
  * @since 0.9.0
  */
 exp(): this {
  Complex.exp(this, this);
  return this;
 }

 /**
  * Computes the principal complex logarithm in place.
  * @returns This for chaining
  *
  * @category Transform
  * @since 0.9.0
  */
 log(): this {
  Complex.log(this, this);
  return this;
 }

 /**
  * Converts this complex number to polar coordinates.
  * @returns Object with magnitude and angle
  *
  * @category Conversion
  * @since 0.9.0
  */
 toPolar(): { magnitude: number; angle: number } {
  return Complex.toPolar(this);
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
  * @param other - Complex to compare
  * @returns True if exactly identical
  *
  * @category Comparison
  * @since 0.7.0
  */
 exactEquals(other: ReadonlyComplex): boolean {
  return Complex.exactEquals(this, other);
 }

 /**
  * Approximate equality using relative tolerance.
  *
  * @remarks
  * Uses relative tolerance: `|a - b| <= epsilon * max(1, |a|, |b|)` per component.
  *
  * @param other - Complex to compare
  * @param epsilon - Relative tolerance. @defaultValue `EPSILON`
  * @returns True if within scaled epsilon
  *
  * @category Comparison
  * @since 0.7.0
  */
 nearEquals(other: ReadonlyComplex, epsilon: number = EPSILON): boolean {
  return Complex.nearEquals(this, other, epsilon);
 }

 /* ======================================================================== */
 /* Instance Comparison                                                      */
 /* ======================================================================== */

 /**
  * Tests if this complex number is exactly zero.
  * @returns True if both real and imag are exactly 0
  *
  * @category Comparison
  * @since 0.7.0
  */
 isZero(): boolean {
  return this.real === 0 && this.imag === 0;
 }

 /**
  * Tests if this complex number is near zero.
  * @param epsilon - Tolerance (default: EPSILON)
  * @returns True if near zero
  *
  * @category Comparison
  * @since 0.7.0
  */
 isNearZero(epsilon: number = EPSILON): boolean {
  return isNearZero(this.real, epsilon) && isNearZero(this.imag, epsilon);
 }

 /**
  * Tests if this complex number is purely real.
  * @param epsilon - Tolerance (default: EPSILON)
  * @returns True if imaginary part is near zero
  *
  * @category Comparison
  * @since 0.7.0
  */
 isReal(epsilon: number = EPSILON): boolean {
  return isNearZero(this.imag, epsilon);
 }

 /**
  * Tests if this complex number is purely imaginary.
  * @param epsilon - Tolerance (default: EPSILON)
  * @returns True if real part is near zero
  *
  * @category Comparison
  * @since 0.7.0
  */
 isImaginary(epsilon: number = EPSILON): boolean {
  return isNearZero(this.real, epsilon);
 }

 /**
  * Tests if both components are finite numbers.
  * @returns True if both components are finite
  *
  * @category Comparison
  * @since 0.7.0
  */
 isFinite(): boolean {
  return Number.isFinite(this.real) && Number.isFinite(this.imag);
 }

 /**
  * Tests if any component is NaN.
  * @returns True if any component is NaN
  *
  * @category Comparison
  * @since 0.7.0
  */
 hasNaN(): boolean {
  return Number.isNaN(this.real) || Number.isNaN(this.imag);
 }

 /**
  * Tests if any component is infinite (±Infinity).
  * @returns True if any component is ±Infinity
  *
  * @category Comparison
  * @since 0.7.0
  */
 hasInfinity(): boolean {
  return Complex.hasInfinity(this);
 }

 /**
  * Tests if this complex number has unit magnitude.
  * @param epsilon - Tolerance (default: EPSILON)
  * @returns True if |z| ≈ 1
  *
  * @category Comparison
  * @since 0.7.0
  */
 isUnit(epsilon: number = EPSILON): boolean {
  return Complex.isUnit(this, epsilon);
 }

 /**
  * Tests if this complex number is the multiplicative identity (1 + 0i).
  * @param epsilon - Tolerance (default: EPSILON)
  * @returns True if z ≈ 1 + 0i
  *
  * @category Comparison
  * @since 0.7.0
  */
 isIdentity(epsilon: number = EPSILON): boolean {
  return Complex.isIdentity(this, epsilon);
 }

 /* ------ Arithmetic ------ */

 /**
  * Negates this complex number in place.
  * @returns This for chaining
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 negate(): this {
  this.real = -this.real;
  this.imag = -this.imag;
  return this;
 }

 /* ------ Mutator ------ */

 /**
  * Resets this complex number to zero.
  * @returns This for chaining
  *
  * @category Mutator
  * @since 0.7.0
  */
 zero(): this {
  this.real = 0;
  this.imag = 0;
  return this;
 }

 /* ======================================================================== */
 /* Instance Accessors                                                       */
 /* ======================================================================== */

 /**
  * Returns the conjugate without modifying this number.
  * @returns New conjugate complex
  *
  * @category Accessor
  * @since 0.7.0
  */
 public get conjugated(): Complex {
  return new Complex(this.real, -this.imag);
 }

 /**
  * Returns the normalized (unit) complex without modifying this number.
  *
  * @remarks
  * Returns `(1, 0)` (multiplicative identity) for zero-magnitude input,
  * consistent with {@link normalizeSafe}. A zero-magnitude complex number
  * is not a valid element of the multiplicative group C*, so the identity
  * `(1, 0)` is the algebraically correct fallback. This aligns with
  * Rotation2.normalized which also returns identity for zero-magnitude.
  *
  * **BREAKING (v0.6.0 → v0.7.0):** Previously returned `(0, 0)` for
  * zero-magnitude input. Changed to `(1, 0)` to match `normalizeSafe()`
  * and the algebraic identity convention. No deprecated alias is provided.
  *
  * @returns New unit complex
  *
  * @category Accessor
  * @since 0.7.0
  */
 public get normalized(): Complex {
  const mag = this.magnitude();
  if (isNearZero(mag)) {
   return new Complex(1, 0);
  }
  const invMag = 1 / mag;
  return new Complex(this.real * invMag, this.imag * invMag);
 }

 /**
  * Returns the negated complex without modifying this number.
  * @returns New negated complex
  *
  * @category Accessor
  * @since 0.7.0
  */
 public get negated(): Complex {
  return new Complex(-this.real, -this.imag);
 }

 /**
  * Returns the reciprocal without modifying this number.
  * Uses safe behavior: returns (0,0) for zero-magnitude input.
  *
  * @remarks
  * Delegates to {@link Complex.reciprocalSafe}. Cleans up negative zero
  * on the imaginary component when the input is purely real.
  *
  * @returns New reciprocal complex
  *
  * @category Accessor
  * @since 0.7.0
  */
 public get reciprocated(): Complex {
  const result = Complex.reciprocalSafe(this);
  // Clean up -0 imaginary for purely real inputs
  if (this.imag === 0 && Object.is(result.imag, -0)) {
   result.imag = 0;
  }
  return result;
 }

 /* ======================================================================== */
 /* Instance Interpolation                                                   */
 /* ======================================================================== */

 /**
  * Linear interpolation towards another complex number in place.
  * @param other - Target complex
  * @param t - Interpolation factor (not clamped, allows extrapolation)
  * @returns This for chaining
  *
  * @category Interpolation
  * @since 0.7.0
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
  * @since 0.7.0
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
  * @since 0.7.0
  */
 slerp(other: ReadonlyComplex, t: number): this {
  const mag1 = this.magnitude();
  const mag2 = Complex.magnitude(other);
  // Fall back to component-wise lerp if either input has near-zero magnitude
  if (isNearZero(mag1) || isNearZero(mag2)) {
   return this.lerp(other, t);
  }
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
  * @since 0.7.0
  */
 slerpClamped(other: ReadonlyComplex, t: number): this {
  return this.slerp(other, saturate(t));
 }

 /**
  * Smooth interpolation with another complex number in place.
  *
  * @remarks
  * Uses Hermite smoothStep for ease-in-out effect.
  *
  * @param other - Target complex number
  * @param t - Interpolation factor (clamped to [0, 1])
  * @returns This for chaining
  *
  * @category Interpolation
  * @since 0.7.0
  */
 smoothStep(other: ReadonlyComplex, t: number): this {
  const clamped = saturate(t);
  return this.lerp(other, smoothStep(0, 1, clamped));
 }

 /* ======================================================================== */
 /* Instance Conversion                                                      */
 /* ======================================================================== */

 /**
  * Converts the complex number to a 2D rotation matrix.
  * The complex number is normalized before conversion.
  *
  * @remarks
  * Returns a `Matrix2Like` object, not a `Matrix2` instance, to avoid
  * circular dependencies. If you need a full `Matrix2` instance, use:
  * ```typescript
  * const mat = Matrix2.fromObject(complex.toRotationMatrix2());
  * ```
  *
  * @param out - Optional output matrix object to populate
  * @returns Rotation matrix as Matrix2Like (plain object or provided out)
  *
  * @example
  * ```typescript
  * const c = Complex.fromPolar(1, Math.PI / 4);
  * const m = c.toRotationMatrix2();
  * // m represents a 45° rotation: { m00: cos, m01: sin, m10: -sin, m11: cos }
  * ```
  *
  * @category Conversion
  * @since 0.7.0
  */
 public toRotationMatrix2(out?: Matrix2Like): Matrix2Like {
  const normalized = this.normalized;
  const result = out ?? { m00: 0, m01: 0, m10: 0, m11: 0 };
  result.m00 = normalized.real;
  result.m01 = normalized.imag;
  result.m10 = -normalized.imag;
  result.m11 = normalized.real;
  return result;
 }

 /**
  * Converts the complex number to a Vector2 (real → x, imag → y).
  * @param out - Optional output vector
  * @returns Vector2 with x = real, y = imag
  *
  * @example
  * ```typescript
  * const c = new Complex(3, 4);
  * const v = c.toVector2();
  * // v.x === 3, v.y === 4
  * ```
  *
  * @category Conversion
  * @since 0.8.0
  */
 public toVector2(out?: Vector2): Vector2 {
  return Vector2.fromValues(this.real, this.imag, out);
 }

 /**
  * Writes to array or typed array.
  *
  * @param out - Optional destination array. If not provided, returns a new tuple
  * @param offset - Write offset. @defaultValue `0`
  * @returns The output array, or a new tuple if no output was provided
  *
  * @example
  * ```typescript
  * const c = new Complex(3, 4);
  * const [real, imag] = c.toArray();
  *
  * // Write to existing array
  * const arr = new Float32Array(10);
  * c.toArray(arr, 4); // writes at indices 4, 5
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
   return [this.real, this.imag];
  }
  out[offset] = this.real;
  out[offset + 1] = this.imag;
  return out;
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
  * @category Conversion
  * @since 0.7.0
  */
 public toObject(): ComplexLike {
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
  * @category Conversion
  * @since 0.7.0
  */
 public toJSON(): ComplexLike {
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
  * @category Conversion
  * @since 0.7.0
  */
 public toString(precision = 4): string {
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
  * @category Conversion
  * @since 0.7.0
  */
 clone(): Complex {
  return new Complex(this.real, this.imag);
 }

 /**
  * Iterator for array destructuring.
  * @returns Iterator yielding real then imag
  *
  * @example
  * ```typescript
  * const [real, imag] = new Complex(3, 4);
  * ```
  *
  * @category Conversion
  * @since 0.7.0
  */
 *[Symbol.iterator](): IterableIterator<number> {
  yield this.real;
  yield this.imag;
 }
}
