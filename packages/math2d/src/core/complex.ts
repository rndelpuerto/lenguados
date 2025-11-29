/**
 * @file core/complex.ts
 * @module @lenguados/math2d/core
 * @description Deterministic complex number implementation.
 */

import { lerpAngle } from '../auxiliary/angle/interpolation';
import { normalizeRadians } from '../auxiliary/angle/normalization';
import { sinCos } from '../auxiliary/angle/operations';
import { safeDivide, safeSqrt } from '../auxiliary/numeric/safety';
import { saturate } from '../auxiliary/scalar/arithmetic';
import { isNearZero, nearEquals } from '../auxiliary/scalar/comparison';
import { EPSILON } from '../auxiliary/scalar/constants';
import { lerp } from '../auxiliary/scalar/interpolation';
import { DeterministicMath } from '../deterministic/deterministic-math';
import type { ComplexLike } from '../types';
import { NumericalValidator } from '../validation/numerical-validator';

// Forward declaration to avoid circular imports - Matrix2 is used in toRotationMatrix
type Matrix2Type = import('./matrix2').Matrix2;

export type ReadonlyComplex = Readonly<Complex>;

export class Complex implements ComplexLike {
 public real: number;
 public imag: number;

 private static ensureOut(out?: Complex): Complex {
  return out ?? new Complex();
 }

 private static sanitize(value: number, label: string): number {
  return NumericalValidator.validateFinite(value, label);
 }

 /** Zero complex (0 + 0i). */
 static readonly ZERO = Object.freeze(new Complex(0, 0)) as ReadonlyComplex;

 /** Real unit (1 + 0i). */
 static readonly ONE = Object.freeze(new Complex(1, 0)) as ReadonlyComplex;

 /** Imaginary unit (0 + 1i). */
 static readonly I = Object.freeze(new Complex(0, 1)) as ReadonlyComplex;

 /** Negative imaginary unit (0 - 1i). */
 static readonly NEG_I = Object.freeze(new Complex(0, -1)) as ReadonlyComplex;

 /** Negative real unit (-1 + 0i). */
 static readonly NEG_ONE = Object.freeze(new Complex(-1, 0)) as ReadonlyComplex;

 /** Epsilon complex for tolerance comparison. */
 static readonly EPSILON = Object.freeze(new Complex(EPSILON, EPSILON)) as ReadonlyComplex;

 /** Square root of 2 as a real complex (√2 + 0i). */
 static readonly SQRT2 = Object.freeze(new Complex(Math.SQRT2, 0)) as ReadonlyComplex;

 /** Inverse of square root of 2 as a real complex (1/√2 + 0i). */
 static readonly SQRT2_INV = Object.freeze(new Complex(Math.SQRT1_2, 0)) as ReadonlyComplex;

 /** Pi as a real complex (π + 0i). */
 static readonly PI = Object.freeze(new Complex(Math.PI, 0)) as ReadonlyComplex;

 /** Euler's number as a real complex (e + 0i). */
 static readonly E = Object.freeze(new Complex(Math.E, 0)) as ReadonlyComplex;

 constructor(real = 0, imag = 0) {
  this.real = real;
  this.imag = imag;
 }

 static fromPolar(magnitude: number, angle: number, out?: Complex): Complex {
  const sanitizedMagnitude = this.sanitize(magnitude, 'Complex.fromPolar:magnitude');
  const normalized = normalizeRadians(angle);
  const { cos, sin } = sinCos(normalized);
  return this.ensureOut(out).set(sanitizedMagnitude * cos, sanitizedMagnitude * sin);
 }

 static fromArray(array: ArrayLike<number>, offset = 0, out?: Complex): Complex {
  if (offset < 0 || offset + 1 >= array.length) {
   throw new RangeError(
    `Complex.fromArray: offset ${offset} is out of bounds for array of length ${array.length}`,
   );
  }
  const real = this.sanitize(array[offset]!, 'Complex.fromArray:real');
  const imag = this.sanitize(array[offset + 1]!, 'Complex.fromArray:imag');
  return this.ensureOut(out).set(real, imag);
 }

 static fromObject(object: ComplexLike, out?: Complex): Complex {
  const real = this.sanitize(object.real, 'Complex.fromObject:real');
  const imag = this.sanitize(object.imag, 'Complex.fromObject:imag');
  return this.ensureOut(out).set(real, imag);
 }

 /* ========================================================================== */
 /* Static Operations */
 /* ========================================================================== */

 /**
  * Adds two complex numbers.
  * @param a - First complex number
  * @param b - Second complex number
  * @param out - Optional output complex
  * @returns Sum
  */
 static add(a: ReadonlyComplex, b: ReadonlyComplex, out?: Complex): Complex {
  return Complex.ensureOut(out).set(a.real + b.real, a.imag + b.imag);
 }

 /**
  * Subtracts two complex numbers.
  * @param a - First complex number
  * @param b - Second complex number
  * @param out - Optional output complex
  * @returns Difference
  */
 static subtract(a: ReadonlyComplex, b: ReadonlyComplex, out?: Complex): Complex {
  return Complex.ensureOut(out).set(a.real - b.real, a.imag - b.imag);
 }

 /**
  * Multiplies two complex numbers.
  * @param a - First complex number
  * @param b - Second complex number
  * @param out - Optional output complex
  * @returns Product
  */
 static multiply(a: ReadonlyComplex, b: ReadonlyComplex, out?: Complex): Complex {
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
  */
 static divide(a: ReadonlyComplex, b: ReadonlyComplex, out?: Complex): Complex {
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
  */
 static scale(complex: ReadonlyComplex, scalar: number, out?: Complex): Complex {
  return Complex.ensureOut(out).set(complex.real * scalar, complex.imag * scalar);
 }

 /**
  * Returns the conjugate of a complex number.
  * @param complex - Complex number
  * @param out - Optional output complex
  * @returns Conjugate
  */
 static conjugate(complex: ReadonlyComplex, out?: Complex): Complex {
  return Complex.ensureOut(out).set(complex.real, -complex.imag);
 }

 /**
  * Negates a complex number.
  * @param complex - Complex number
  * @param out - Optional output complex
  * @returns Negated complex
  */
 static negate(complex: ReadonlyComplex, out?: Complex): Complex {
  return Complex.ensureOut(out).set(-complex.real, -complex.imag);
 }

 /**
  * Linear interpolation between two complex numbers.
  * @param a - Start complex
  * @param b - End complex
  * @param t - Interpolation factor [0, 1], clamped
  * @param out - Optional output complex
  * @returns Interpolated complex
  */
 static lerp(a: ReadonlyComplex, b: ReadonlyComplex, t: number, out?: Complex): Complex {
  const clamped = saturate(t);
  return Complex.ensureOut(out).set(lerp(a.real, b.real, clamped), lerp(a.imag, b.imag, clamped));
 }

 /**
  * Tests if two complex numbers are approximately equal.
  * @param a - First complex
  * @param b - Second complex
  * @param epsilon - Tolerance (default: EPSILON)
  * @returns True if equal within tolerance
  */
 static equals(a: ReadonlyComplex, b: ReadonlyComplex, epsilon: number = EPSILON): boolean {
  return nearEquals(a.real, b.real, epsilon) && nearEquals(a.imag, b.imag, epsilon);
 }

 /**
  * Returns the magnitude of a complex number.
  * @param complex - Complex number
  * @returns Magnitude
  */
 static magnitude(complex: ReadonlyComplex): number {
  return safeSqrt(complex.real * complex.real + complex.imag * complex.imag);
 }

 /**
  * Returns the argument (phase angle) of a complex number.
  * @param complex - Complex number
  * @returns Angle in radians
  */
 static argument(complex: ReadonlyComplex): number {
  return DeterministicMath.atan2(complex.imag, complex.real);
 }

 /**
  * Returns the squared magnitude of a complex number.
  * @param complex - Complex number
  * @returns Squared magnitude
  */
 static magnitudeSq(complex: ReadonlyComplex): number {
  return complex.real * complex.real + complex.imag * complex.imag;
 }

 /**
  * Normalizes a complex number to unit length.
  * @param complex - Complex number
  * @param out - Optional output complex
  * @returns Normalized complex (or zero if magnitude is near zero)
  */
 static normalize(complex: ReadonlyComplex, out?: Complex): Complex {
  const mag = Complex.magnitude(complex);
  if (isNearZero(mag)) {
   return Complex.ensureOut(out).set(0, 0);
  }
  const invMag = safeDivide(1, mag);
  return Complex.ensureOut(out).set(complex.real * invMag, complex.imag * invMag);
 }

 /**
  * Returns the reciprocal of a complex number.
  * @param complex - Complex number
  * @param out - Optional output complex
  * @returns Reciprocal
  */
 static reciprocal(complex: ReadonlyComplex, out?: Complex): Complex {
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
  */
 static pow(complex: ReadonlyComplex, exponent: number, out?: Complex): Complex {
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
  */
 static sqrt(complex: ReadonlyComplex, out?: Complex): Complex {
  return Complex.pow(complex, 0.5, out);
 }

 /**
  * Tests if a complex number is near zero.
  * @param complex - Complex number
  * @param epsilon - Tolerance (default: EPSILON)
  * @returns True if near zero
  */
 static isZero(complex: ReadonlyComplex, epsilon: number = EPSILON): boolean {
  return isNearZero(complex.real, epsilon) && isNearZero(complex.imag, epsilon);
 }

 /**
  * Tests if a complex number is purely real.
  * @param complex - Complex number
  * @param epsilon - Tolerance (default: EPSILON)
  * @returns True if imaginary part is near zero
  */
 static isReal(complex: ReadonlyComplex, epsilon: number = EPSILON): boolean {
  return isNearZero(complex.imag, epsilon);
 }

 /**
  * Tests if a complex number is purely imaginary.
  * @param complex - Complex number
  * @param epsilon - Tolerance (default: EPSILON)
  * @returns True if real part is near zero
  */
 static isImaginary(complex: ReadonlyComplex, epsilon: number = EPSILON): boolean {
  return isNearZero(complex.real, epsilon);
 }

 /* ========================================================================== */
 /* Instance Methods */
 /* ========================================================================== */

 set(real: number, imag: number): this {
  this.real = real;
  this.imag = imag;
  return this;
 }

 copy(other: ReadonlyComplex): this {
  this.real = other.real;
  this.imag = other.imag;
  return this;
 }

 magnitude(): number {
  return safeSqrt(this.real * this.real + this.imag * this.imag);
 }

 magnitudeSq(): number {
  return this.real * this.real + this.imag * this.imag;
 }

 argument(): number {
  return DeterministicMath.atan2(this.imag, this.real);
 }

 add(other: ReadonlyComplex, out?: Complex): Complex {
  return Complex.ensureOut(out).set(this.real + other.real, this.imag + other.imag);
 }

 /**
  * Subtracts another complex number.
  * @param other - Complex number to subtract
  * @param out - Optional output complex
  * @returns Difference
  */
 subtract(other: ReadonlyComplex, out?: Complex): Complex {
  return Complex.ensureOut(out).set(this.real - other.real, this.imag - other.imag);
 }

 /**
  * Multiplies with another complex number.
  * @param other - Complex number to multiply by
  * @param out - Optional output complex
  * @returns Product
  */
 multiply(other: ReadonlyComplex, out?: Complex): Complex {
  const { real: a, imag: b } = this;
  const { real: c, imag: d } = other;
  return Complex.ensureOut(out).set(a * c - b * d, a * d + b * c);
 }

 /**
  * Divides by another complex number.
  * @param other - Complex number to divide by
  * @param out - Optional output complex
  * @returns Quotient
  */
 divide(other: ReadonlyComplex, out?: Complex): Complex {
  const { real: a, imag: b } = this;
  const { real: c, imag: d } = other;
  const denominator = c * c + d * d;
  const invDenominator = safeDivide(1, denominator);
  return Complex.ensureOut(out).set(
   (a * c + b * d) * invDenominator,
   (b * c - a * d) * invDenominator,
  );
 }

 scale(scalar: number, out?: Complex): Complex {
  return Complex.ensureOut(out).set(this.real * scalar, this.imag * scalar);
 }

 conjugate(out?: Complex): Complex {
  return Complex.ensureOut(out).set(this.real, -this.imag);
 }

 normalize(out?: Complex): Complex {
  const mag = this.magnitude();
  if (isNearZero(mag)) {
   return Complex.ensureOut(out).set(0, 0);
  }
  const invMag = safeDivide(1, mag);
  return Complex.ensureOut(out).set(this.real * invMag, this.imag * invMag);
 }

 reciprocal(out?: Complex): Complex {
  const magSq = this.magnitudeSq();
  const invMagSq = safeDivide(1, magSq);
  return Complex.ensureOut(out).set(this.real * invMagSq, -this.imag * invMagSq);
 }

 pow(exponent: number, out?: Complex): Complex {
  const mag = this.magnitude();
  const angle = this.argument();
  const poweredMagnitude = Math.pow(mag, exponent);
  const targetAngle = angle * exponent;
  return Complex.fromPolar(poweredMagnitude, targetAngle, out);
 }

 sqrt(out?: Complex): Complex {
  return this.pow(0.5, out);
 }

 equals(other: ReadonlyComplex, epsilon: number = EPSILON): boolean {
  return nearEquals(this.real, other.real, epsilon) && nearEquals(this.imag, other.imag, epsilon);
 }

 isZero(epsilon: number = EPSILON): boolean {
  return isNearZero(this.real, epsilon) && isNearZero(this.imag, epsilon);
 }

 isReal(epsilon: number = EPSILON): boolean {
  return isNearZero(this.imag, epsilon);
 }

 isImaginary(epsilon: number = EPSILON): boolean {
  return isNearZero(this.real, epsilon);
 }

 /**
  * Negates this complex number.
  * @param out - Optional output complex
  * @returns Negated complex
  */
 negate(out?: Complex): Complex {
  return Complex.ensureOut(out).set(-this.real, -this.imag);
 }

 /* ========================================================================== */
 /* Readonly Getters */
 /* ========================================================================== */

 /**
  * Returns the conjugate without modifying this number.
  * @returns New conjugate complex
  */
 public get conjugated(): Complex {
  return new Complex(this.real, -this.imag);
 }

 /**
  * Returns the normalized (unit) complex without modifying this number.
  * @returns New unit complex
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
  */
 public get negated(): Complex {
  return new Complex(-this.real, -this.imag);
 }

 /**
  * Returns the reciprocal without modifying this number.
  * @returns New reciprocal complex
  */
 public get reciprocated(): Complex {
  const magSq = this.magnitudeSq();
  const invMagSq = safeDivide(1, magSq);
  return new Complex(this.real * invMagSq, -this.imag * invMagSq);
 }

 /* ========================================================================== */
 /* Interpolation */
 /* ========================================================================== */

 lerp(other: ReadonlyComplex, t: number, out?: Complex): Complex {
  const clamped = saturate(t);
  return Complex.ensureOut(out).set(
   lerp(this.real, other.real, clamped),
   lerp(this.imag, other.imag, clamped),
  );
 }

 slerp(other: ReadonlyComplex, t: number, out?: Complex): Complex {
  const clamped = saturate(t);
  const mag1 = this.magnitude();
  const mag2 = other.magnitude();
  const angle1 = this.argument();
  const angle2 = other.argument();
  const interpMag = lerp(mag1, mag2, clamped);
  const interpAngle = lerpAngle(angle1, angle2, clamped);
  return Complex.fromPolar(interpMag, interpAngle, out);
 }

 /* ========================================================================== */
 /* Serialization */
 /* ========================================================================== */

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
  */
 /**
  * Converts the complex number to a 2D rotation matrix.
  * The complex number is normalized before conversion.
  * @param out - Optional output matrix
  * @returns Rotation matrix
  *
  * @example
  * ```typescript
  * const c = Complex.fromPolar(1, Math.PI / 4);
  * const m = c.toRotationMatrix();
  * // m represents a 45° rotation
  * ```
  */
 toRotationMatrix(out?: Matrix2Type): Matrix2Type {
  // Lazy import to avoid circular dependency
  // eslint-disable-next-line @typescript-eslint/no-require-imports, no-undef
  const { Matrix2 } = require('./matrix2') as typeof import('./matrix2');
  const normalized = this.normalized;
  return Matrix2.fromValues(
   normalized.real,
   normalized.imag,
   -normalized.imag,
   normalized.real,
   out,
  );
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
  */
 clone(): Complex {
  return new Complex(this.real, this.imag);
 }
}
