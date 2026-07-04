/**
 * @file core/interval.ts
 * @module @lenguados/math2d/core
 * @description Deterministic closed-interval arithmetic helpers
 *
 * @remarks
 * Provides the {@link Interval} class for closed-interval `[min, max]` arithmetic,
 * including set operations (union, intersection), arithmetic (add, multiply, reciprocal),
 * and query methods (contains, overlaps, expand). All operations are deterministic.
 */

import { divideSafe, sqrtSafe } from '../auxiliary/numeric/safety';
import { clamp, saturate, sign as scalarSign } from '../auxiliary/scalar/arithmetic';
import {
 isNearZero,
 nearEquals as scalarNearEquals,
 relativeEquals,
} from '../auxiliary/scalar/comparison';
import { EPSILON, TAU } from '../auxiliary/scalar/constants';
import { lerp, smoothStep } from '../auxiliary/scalar/interpolation';
import { pow } from '../deterministic/deterministic-kernels';
import type { IntervalLike, ReadonlyIntervalLike } from '../types';
import { assert, assertNonNegative } from '../validation/assert';

/* ========================================================================== */
/* Type Exports                                                               */
/* ========================================================================== */

/**
 * Readonly view of an {@link Interval} instance
 *
 * @category Types
 * @since 0.7.0
 * @public
 */
export type ReadonlyInterval = Readonly<Interval>;

export { isIntervalLike } from '../types';

/* ========================================================================== */
/* Helper Functions                                                           */
/* ========================================================================== */

/**
 * Permanently freezes an {@link Interval} instance so it can no longer be mutated
 *
 * @remarks
 * - The returned object keeps its original reference; no new memory is allocated.
 * - In strict mode any subsequent attempt to modify `min` or `max` throws a TypeError.
 *
 * @param interval - The Interval object to freeze
 * @returns The same instance, now typed as ReadonlyInterval
 *
 * @example
 * ```typescript
 * const UNIT = freezeInterval(new Interval(0, 1));
 * UNIT.min = 5; // Throws in strict mode
 * ```
 *
 * @category Helpers
 * @since 0.7.0
 */
export function freezeInterval(interval: Interval): ReadonlyInterval {
 return Object.freeze(interval);
}

/* ========================================================================== */
/* Class: Interval                                                            */
/* ========================================================================== */

/**
 * Mutable closed interval with deterministic arithmetic and comparisons
 *
 * @remarks
 * - **Design:** Closed interval `[min, max]` with `min <= max` invariant. Instance
 *   methods are mutable and chainable; static methods are pure with alloc-free
 *   overloads via `out` parameter.
 * - **Numerics:** Set operations (union, intersection) and arithmetic (add, multiply)
 *   use interval arithmetic rules. Reciprocal handles sign-crossing intervals.
 * - **Safety:** "Safe" variants return fallback intervals instead of throwing on
 *   degenerate inputs (e.g., empty intersection → `ZERO`).
 *
 * @example
 * ```typescript
 * // Static (pure, allocation-controlled)
 * const merged = Interval.union(a, b);
 * const overlap = Interval.intersection(a, b);
 *
 * // Instance (mutable, chainable)
 * interval.expand(0.1).clamp(bounds);
 * ```
 *
 * @category Core
 * @since 0.7.0
 */
export class Interval implements IntervalLike {
 /* ======================================================================== */
 /* Instance Properties                                                      */
 /* ======================================================================== */

 public min: number;
 public max: number;

 /* ======================================================================== */
 /* Private Helpers                                                          */
 /* ======================================================================== */

 private static ensureOut(out?: Interval): Interval {
  return out ?? new Interval();
 }

 /**
  * Direct assignment without validation. Used by static methods that
  * have already computed valid min/max values.
  *
  * @param minValue - Lower bound
  * @param maxValue - Upper bound
  * @returns This for chaining
  */
 private setDirect(minValue: number, maxValue: number): this {
  this.min = minValue;
  this.max = maxValue;
  return this;
 }

 /**
  * Validates interval bounds. Allows ±Infinity but rejects NaN
  * @remarks Infinity is valid for intervals like [0, +∞).
  *
  * @param value - Value to validate
  * @param label - Label for error messages
  * @returns The validated value
  */
 private static sanitize(value: number, label: string): number {
  assert(!Number.isNaN(value), `${label} must not be NaN`);
  return value;
 }

 private static assertOrder(minValue: number, maxValue: number, label = 'Interval'): void {
  if (minValue > maxValue) {
   throw new RangeError(`${label}: min (${minValue}) must be <= max (${maxValue})`);
  }
 }

 /* ======================================================================== */
 /* Static Constants (Immutable)                                             */
 /* ======================================================================== */

 /**
  * Zero interval [0, 0]
  * @category Constant
  * @since 0.7.0
  */
 public static readonly ZERO = /* @__PURE__ */ Object.freeze(
  /* @__PURE__ */ new Interval(0, 0),
 ) as ReadonlyInterval;

 /**
  * Number of elements when serialized to an array
  * @category Constant
  * @since 0.7.0
  */
 public static readonly ELEMENT_COUNT = 2;

 /**
  * Unit interval [0, 1]
  * @category Constant
  * @since 0.7.0
  */
 public static readonly UNIT = /* @__PURE__ */ Object.freeze(
  /* @__PURE__ */ new Interval(0, 1),
 ) as ReadonlyInterval;

 /**
  * Symmetric unit interval [-1, 1]
  * @category Constant
  * @since 0.7.0
  */
 public static readonly SYMMETRIC_UNIT = /* @__PURE__ */ Object.freeze(
  /* @__PURE__ */ new Interval(-1, 1),
 ) as ReadonlyInterval;

 /**
  * Positive half-line [0, +∞)
  * @category Constant
  * @since 0.7.0
  */
 public static readonly POSITIVE = /* @__PURE__ */ Object.freeze(
  /* @__PURE__ */ new Interval(0, 1 / 0),
 ) as ReadonlyInterval;

 /**
  * Negative half-line (-∞, 0]
  * @category Constant
  * @since 0.7.0
  */
 public static readonly NEGATIVE = /* @__PURE__ */ Object.freeze(
  /* @__PURE__ */ new Interval(-1 / 0, 0),
 ) as ReadonlyInterval;

 /**
  * Full real line (-∞, +∞)
  * @category Constant
  * @since 0.7.0
  */
 public static readonly FULL = /* @__PURE__ */ Object.freeze(
  /* @__PURE__ */ new Interval(-1 / 0, 1 / 0),
 ) as ReadonlyInterval;

 /**
  * Epsilon interval [-ε, ε]
  *
  * @remarks
  * The literal `±1e-10` initializer is intentional; bit-exactness against
  * `±EPSILON` is verified by test.
  *
  * @category Constant
  * @since 0.7.0
  */
 public static readonly EPSILON_INTERVAL = /* @__PURE__ */ Object.freeze(
  /* @__PURE__ */ new Interval(-1e-10, 1e-10),
 ) as ReadonlyInterval;

 /**
  * Degrees interval [0, 360]
  * @category Constant
  * @since 0.7.0
  */
 public static readonly DEGREES = /* @__PURE__ */ Object.freeze(
  /* @__PURE__ */ new Interval(0, 360),
 ) as ReadonlyInterval;

 /**
  * Radians interval [0, 2π]
  * @category Constant
  * @since 0.7.0
  */
 public static readonly RADIANS = /* @__PURE__ */ Object.freeze(
  /* @__PURE__ */ new Interval(0, TAU),
 ) as ReadonlyInterval;

 /* ======================================================================== */
 /* Constructor                                                              */
 /* ======================================================================== */

 /**
  * Creates a new Interval with the given bounds
  *
  * @param min - Lower bound of the interval. @defaultValue `0`
  * @param max - Upper bound of the interval. @defaultValue `0`
  */
 constructor(min = 0, max = 0) {
  this.min = min;
  this.max = max;
  // Pure math: no assertions — Infinity/NaN are valid IEEE 754 values
 }

 /* ======================================================================== */
 /* Static Factories                                                         */
 /* ======================================================================== */

 /**
  * Creates an interval from a single value [v, v]
  * @param value - Value for both min and max
  * @param out - Optional output interval
  * @returns Degenerate interval
  *
  * @example
  * ```typescript
  * const iv = Interval.fromValue(5);           // → [5, 5]
  * const out = new Interval();
  * Interval.fromValue(3, out);                 // → [3, 3], reuses out
  * ```
  *
  * @category Factory
  * @since 0.7.0
  */
 public static fromValue(value: number, out?: Interval): Interval {
  if (__LENGUADOS_DEV__) {
   Interval.sanitize(value, 'Interval.fromValue:value');
  }
  return this.ensureOut(out).setDirect(value, value);
 }

 /**
  * Creates an interval from center and radius [center - radius, center + radius]
  * @param center - Center value
  * @param radius - Half-width (must be non-negative)
  * @param out - Optional output interval
  * @returns Symmetric interval around center
  * @throws {RangeError} If radius is negative
  *
  * @example
  * ```typescript
  * const iv = Interval.fromCenterRadius(5, 3); // → [2, 8]
  * const out = new Interval();
  * Interval.fromCenterRadius(0, 10, out);      // → [-10, 10], reuses out
  * ```
  *
  * @category Factory
  * @since 0.7.0
  */
 public static fromCenterRadius(center: number, radius: number, out?: Interval): Interval {
  if (__LENGUADOS_DEV__) {
   Interval.sanitize(center, 'Interval.fromCenterRadius:center');
   Interval.sanitize(radius, 'Interval.fromCenterRadius:radius');
   assertNonNegative(radius, 'Interval.fromCenterRadius:radius');
  }
  // Production throw (always enforced)
  if (radius < 0) {
   throw new RangeError('Interval.fromCenterRadius: radius must be non-negative');
  }
  return this.ensureOut(out).setDirect(center - radius, center + radius);
 }

 /**
  * Creates an interval from an array [min, max]
  * @param array - Source array
  * @param offset - Index offset (default: 0)
  * @param out - Optional output interval
  * @returns Interval from array
  * @throws {RangeError} If offset is out of bounds
  * @throws {RangeError} If min > max
  *
  * @example
  * ```typescript
  * const iv = Interval.fromArray([1, 5]);       // → [1, 5]
  * Interval.fromArray([0, 0, 3, 7], 2);         // → [3, 7], offset = 2
  * const out = new Interval();
  * Interval.fromArray([2, 8], 0, out);           // → [2, 8], reuses out
  * ```
  *
  * @category Factory
  * @since 0.7.0
  */
 public static fromArray(array: ArrayLike<number>, offset = 0, out?: Interval): Interval {
  // Development assertions
  if (__LENGUADOS_DEV__) {
   assertNonNegative(offset, 'Interval.fromArray:offset');
   assert(array.length >= 2, 'Interval.fromArray: array must have at least 2 elements');
  }
  // Production bounds check (always enforced)
  if (offset < 0 || offset + Interval.ELEMENT_COUNT > array.length) {
   throw new RangeError(
    `Interval.fromArray: offset ${offset} out of bounds for array length ${array.length}`,
   );
  }
  const minValue = array[offset]!;
  const maxValue = array[offset + 1]!;
  if (__LENGUADOS_DEV__) {
   Interval.sanitize(minValue, 'Interval.fromArray:min');
   Interval.sanitize(maxValue, 'Interval.fromArray:max');
   Interval.assertOrder(minValue, maxValue, 'Interval.fromArray');
  }
  return this.ensureOut(out).setDirect(minValue, maxValue);
 }

 /**
  * Creates an interval from a plain object
  * @param object - Object with min and max properties
  * @param out - Optional output interval
  * @returns Interval from object
  * @throws {RangeError} If min > max
  *
  * @example
  * ```typescript
  * const iv = Interval.fromObject({ min: 0, max: 10 }); // → [0, 10]
  * const out = new Interval();
  * Interval.fromObject({ min: -1, max: 1 }, out);       // → [-1, 1], reuses out
  * ```
  *
  * @category Factory
  * @since 0.7.0
  */
 public static fromObject(object: ReadonlyIntervalLike, out?: Interval): Interval {
  const minValue = object.min;
  const maxValue = object.max;
  if (__LENGUADOS_DEV__) {
   Interval.sanitize(minValue, 'Interval.fromObject:min');
   Interval.sanitize(maxValue, 'Interval.fromObject:max');
   Interval.assertOrder(minValue, maxValue, 'Interval.fromObject');
  }
  return this.ensureOut(out).setDirect(minValue, maxValue);
 }

 /**
  * Creates an interval from individual min and max values
  * @param min - Minimum bound
  * @param max - Maximum bound
  * @param out - Optional output interval
  * @returns Interval from the values
  * @throws {RangeError} If min > max
  *
  * @example
  * ```typescript
  * Interval.fromValues(0, 1);      // Unit interval [0, 1]
  * Interval.fromValues(-5, 5);     // Symmetric interval [-5, 5]
  * Interval.fromValues(10, 10);    // Degenerate interval [10, 10]
  * ```
  *
  * @category Factory
  * @since 0.7.0
  */
 public static fromValues(min: number, max: number, out?: Interval): Interval {
  if (__LENGUADOS_DEV__) {
   Interval.sanitize(min, 'Interval.fromValues:min');
   Interval.sanitize(max, 'Interval.fromValues:max');
   Interval.assertOrder(min, max, 'Interval.fromValues');
  }
  return this.ensureOut(out).setDirect(min, max);
 }

 /**
  * Creates an interval from two values in any order
  *
  * @remarks
  * Unlike {@link fromValues}, this does not require `a ≤ b`.
  *
  * @param a - First bound
  * @param b - Second bound
  * @param out - Optional output interval
  * @returns Interval with min = min(a, b), max = max(a, b)
  *
  * @example
  * ```typescript
  * Interval.fromUnsorted(5, 2); // → [2, 5]
  * Interval.fromUnsorted(2, 5); // → [2, 5]
  * ```
  *
  * @category Factory
  * @since 0.7.0
  */
 public static fromUnsorted(a: number, b: number, out?: Interval): Interval {
  return Interval.fromValues(Math.min(a, b), Math.max(a, b), out);
 }

 /**
  * Creates a deep copy of an interval
  * @param source - Interval to clone
  * @param out - Optional output interval
  * @returns A new Interval with identical values
  *
  * @example
  * ```typescript
  * const original = Interval.fromValues(2, 8);
  * const cloned = Interval.clone(original);     // → [2, 8], new instance
  * const out = new Interval();
  * Interval.clone(original, out);               // → [2, 8], reuses out
  * ```
  *
  * @category Factory
  * @since 0.7.0
  */
 public static clone(source: ReadonlyIntervalLike, out?: Interval): Interval {
  return this.ensureOut(out).setDirect(source.min, source.max);
 }

 /**
  * Copies values from source into destination (alloc-free)
  * @param source - Source interval
  * @param destination - Target interval to receive the copy
  * @returns The destination interval
  *
  * @example
  * ```typescript
  * const src = Interval.fromValues(1, 9);
  * const dst = new Interval();
  * Interval.copy(src, dst); // dst → [1, 9], mutates dst in place
  * ```
  *
  * @category Factory
  * @since 0.7.0
  */
 public static copy(source: ReadonlyIntervalLike, destination: Interval): Interval {
  return destination.setDirect(source.min, source.max);
 }

 /* ======================================================================== */
 /* Static Arithmetic                                                        */
 /* ======================================================================== */

 /**
  * Adds two intervals
  * @param a - First interval
  * @param b - Second interval
  * @param out - Optional output interval
  * @returns Sum interval
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 public static add(a: ReadonlyIntervalLike, b: ReadonlyIntervalLike, out?: Interval): Interval {
  return Interval.ensureOut(out).setDirect(a.min + b.min, a.max + b.max);
 }

 /**
  * Subtracts two intervals
  * @param a - First interval
  * @param b - Second interval
  * @param out - Optional output interval
  * @returns Difference interval
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 public static subtract(
  a: ReadonlyIntervalLike,
  b: ReadonlyIntervalLike,
  out?: Interval,
 ): Interval {
  return Interval.ensureOut(out).setDirect(a.min - b.max, a.max - b.min);
 }

 /**
  * Multiplies two intervals
  * @param a - First interval
  * @param b - Second interval
  * @param out - Optional output interval
  * @returns Product interval
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 public static multiply(
  a: ReadonlyIntervalLike,
  b: ReadonlyIntervalLike,
  out?: Interval,
 ): Interval {
  const p0 = a.min * b.min;
  const p1 = a.min * b.max;
  const p2 = a.max * b.min;
  const p3 = a.max * b.max;
  return Interval.ensureOut(out).setDirect(Math.min(p0, p1, p2, p3), Math.max(p0, p1, p2, p3));
 }

 /**
  * Multiplies an interval's bounds by a scalar
  * @param interval - Input interval
  * @param scalar - Scalar multiplier
  * @param out - Optional output interval
  * @returns Interval with bounds multiplied by scalar
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 public static multiplyScalar(
  interval: ReadonlyIntervalLike,
  scalar: number,
  out?: Interval,
 ): Interval {
  if (scalar >= 0) {
   return Interval.ensureOut(out).setDirect(interval.min * scalar, interval.max * scalar);
  }
  return Interval.ensureOut(out).setDirect(interval.max * scalar, interval.min * scalar);
 }

 /**
  * Divides an interval's bounds by a scalar
  * @param interval - Input interval
  * @param scalar - Scalar divisor (must not be zero)
  * @param out - Optional output interval
  * @returns Interval with bounds divided by scalar
  *
  * @throws {RangeError} If scalar is zero
  *
  * @see {@link divideScalarSafe} - Returns ZERO on zero scalar
  * @see {@link divideScalarUnchecked} - No validation, for hot paths
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 public static divideScalar(
  interval: ReadonlyIntervalLike,
  scalar: number,
  out?: Interval,
 ): Interval {
  if (scalar === 0) {
   throw new RangeError('Interval.divideScalar: cannot divide by zero');
  }
  return Interval.multiplyScalar(interval, 1 / scalar, out);
 }

 /**
  * Divides an interval's bounds by a scalar (safe version)
  * @param interval - Input interval
  * @param scalar - Scalar divisor
  * @param out - Optional output interval
  * @returns Interval with bounds divided by scalar, or ZERO if scalar is zero
  *
  * @see {@link divideScalar} - Throws on zero scalar
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 public static divideScalarSafe(
  interval: ReadonlyIntervalLike,
  scalar: number,
  out?: Interval,
 ): Interval {
  if (scalar === 0) {
   return Interval.ensureOut(out).setDirect(0, 0);
  }
  return Interval.multiplyScalar(interval, 1 / scalar, out);
 }

 /**
  * Divides an interval's bounds by a scalar without validation (for hot paths)
  *
  * @remarks
  * **WARNING:** This method performs no validation.
  * - If scalar is zero, the result will contain Infinity/-Infinity or NaN.
  * - Use only when you can guarantee non-zero scalar.
  *
  * @param interval - Input interval
  * @param scalar - Scalar divisor (must not be zero)
  * @param out - Optional output interval
  * @returns Interval with bounds divided by scalar
  *
  * @see {@link divideScalar} - Throws on zero scalar
  * @see {@link divideScalarSafe} - Returns ZERO on zero scalar
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 public static divideScalarUnchecked(
  interval: ReadonlyIntervalLike,
  scalar: number,
  out?: Interval,
 ): Interval {
  return Interval.multiplyScalar(interval, 1 / scalar, out);
 }

 /**
  * Negates an interval
  * @param interval - Interval to negate
  * @param out - Optional output interval
  * @returns Negated interval
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 public static negate(interval: ReadonlyIntervalLike, out?: Interval): Interval {
  return Interval.ensureOut(out).setDirect(-interval.max, -interval.min);
 }

 /**
  * Returns the absolute value of an interval (Moore's definition)
  *
  * @remarks
  * Three cases:
  * - All positive (`min ≥ 0`): result is `[min, max]`
  * - Crosses zero (`min < 0 < max`): result is `[0, max(|min|, max)]`
  * - All negative (`max ≤ 0`): result is `[|max|, |min|]`
  *
  * @param interval - Interval to take absolute value of
  * @param out - Optional output interval
  * @returns Interval of absolute values
  *
  * @example
  * ```typescript
  * Interval.abs({ min: 2, max: 5 });   // → [2, 5]
  * Interval.abs({ min: -3, max: 5 });  // → [0, 5]
  * Interval.abs({ min: -5, max: -2 }); // → [2, 5]
  * ```
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 public static abs(interval: ReadonlyIntervalLike, out?: Interval): Interval {
  if (interval.min >= 0) {
   return Interval.ensureOut(out).setDirect(interval.min, interval.max);
  }
  if (interval.max <= 0) {
   return Interval.ensureOut(out).setDirect(-interval.max, -interval.min);
  }
  return Interval.ensureOut(out).setDirect(0, Math.max(-interval.min, interval.max));
 }

 /**
  * Returns the square of an interval
  * @param interval - Interval to square
  * @param out - Optional output interval
  * @returns Squared interval
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 public static square(interval: ReadonlyIntervalLike, out?: Interval): Interval {
  if (interval.min >= 0) {
   return Interval.ensureOut(out).setDirect(
    interval.min * interval.min,
    interval.max * interval.max,
   );
  }
  if (interval.max <= 0) {
   return Interval.ensureOut(out).setDirect(
    interval.max * interval.max,
    interval.min * interval.min,
   );
  }
  const extreme = Math.max(interval.min * interval.min, interval.max * interval.max);
  return Interval.ensureOut(out).setDirect(0, extreme);
 }

 /**
  * Returns the square root of an interval
  * @param interval - Interval (must be non-negative)
  * @param out - Optional output interval
  * @returns Square root interval
  * @throws {RangeError} If interval contains negative values
  *
  * @see {@link sqrtSafe} - Clamps negatives, never throws
  * @see {@link sqrtUnchecked} - No validation, for hot paths
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 public static sqrt(interval: ReadonlyIntervalLike, out?: Interval): Interval {
  if (interval.min < 0) {
   throw new RangeError('Interval.sqrt: interval contains negative values');
  }
  // Post-validation: both bounds are non-negative. IEEE 754 Math.sqrt is exact
  // on the validated domain; sqrtSafe would add a redundant negative-guard.
  return Interval.ensureOut(out).setDirect(Math.sqrt(interval.min), Math.sqrt(interval.max));
 }

 /**
  * Returns the square root of an interval (safe version)
  * @param interval - Interval
  * @param out - Optional output interval
  * @returns Square root interval, or `[0, 0]` if fully negative; clamps min to 0 if partially negative
  *
  * @see {@link sqrt} - Throws if interval contains negative values
  * @see {@link sqrtUnchecked} - No validation, for hot paths
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 public static sqrtSafe(interval: ReadonlyIntervalLike, out?: Interval): Interval {
  if (interval.max < 0) {
   return Interval.ensureOut(out).setDirect(0, 0);
  }
  const safeMin = interval.min < 0 ? 0 : sqrtSafe(interval.min);
  return Interval.ensureOut(out).setDirect(safeMin, sqrtSafe(interval.max));
 }

 /**
  * Returns the square root of an interval without validation (for hot paths)
  *
  * @remarks
  * **Precondition:** Interval must be non-negative.
  * If interval contains negative values, result will contain NaN.
  *
  * Use in performance-critical code where interval validity is guaranteed.
  *
  * @param interval - Interval (must be non-negative)
  * @param out - Optional output interval
  * @returns Square root interval
  *
  * @see {@link sqrt} - Throws if interval contains negative values
  * @see {@link sqrtSafe} - Clamps negatives, never throws
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 public static sqrtUnchecked(interval: ReadonlyIntervalLike, out?: Interval): Interval {
  return Interval.ensureOut(out).setDirect(Math.sqrt(interval.min), Math.sqrt(interval.max));
 }

 /**
  * Raises an interval to an integer power (IEEE 1788-2015 §10.5.10)
  *
  * @remarks
  * Even exponents wrap a sign-crossing interval to `[0, mag(iv)^n]`; odd
  * exponents preserve monotonicity. Negative integer exponents require the
  * interval to avoid zero.
  *
  * @param interval - Base interval
  * @param n - Integer exponent
  * @param out - Optional output interval
  * @returns Interval raised to the integer power
  * @throws {TypeError} If `n` is not a finite integer
  * @throws {RangeError} If `n < 0` and the interval contains zero
  *
  * @see {@link powSafe} - Returns fallback instead of throwing
  * @see {@link powUnchecked} - No validation, for hot paths
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 public static pow(interval: ReadonlyIntervalLike, n: number, out?: Interval): Interval {
  if (!Number.isInteger(n)) {
   throw new TypeError(`Interval.pow: exponent must be an integer, got ${n}`);
  }
  if (n < 0 && interval.min <= 0 && interval.max >= 0) {
   throw new RangeError('Interval.pow: negative exponent requires interval not containing zero');
  }
  return Interval.powUnchecked(interval, n, out);
 }

 /**
  * Raises an interval to an integer power with a fallback
  *
  * @remarks
  * Returns `fallback` when the exponent is negative and the interval contains
  * zero, or when the exponent is not a finite integer. Otherwise matches
  * {@link pow}.
  *
  * @param interval - Base interval
  * @param n - Integer exponent
  * @param fallback - Fallback returned on invalid domain. @defaultValue `Interval.ZERO`
  * @param out - Optional output interval
  * @returns Interval raised to the integer power, or fallback
  *
  * @see {@link pow} - Strict variant that throws
  * @see {@link powUnchecked} - No validation, for hot paths
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 public static powSafe(
  interval: ReadonlyIntervalLike,
  n: number,
  fallback: ReadonlyIntervalLike = Interval.ZERO,
  out?: Interval,
 ): Interval {
  if (!Number.isInteger(n)) {
   return Interval.ensureOut(out).setDirect(fallback.min, fallback.max);
  }
  if (n < 0 && interval.min <= 0 && interval.max >= 0) {
   return Interval.ensureOut(out).setDirect(fallback.min, fallback.max);
  }
  return Interval.powUnchecked(interval, n, out);
 }

 /**
  * Raises an interval to an integer power without validation
  *
  * @remarks
  * **Precondition:** `n` is a finite integer; if `n < 0` the interval avoids
  * zero. Handles the even-exponent sign-crossing case.
  *
  * @param interval - Base interval
  * @param n - Integer exponent
  * @param out - Optional output interval
  * @returns Interval raised to the integer power
  *
  * @see {@link pow} - Strict variant that throws
  * @see {@link powSafe} - Returns fallback on invalid domain
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 public static powUnchecked(interval: ReadonlyIntervalLike, n: number, out?: Interval): Interval {
  const target = Interval.ensureOut(out);
  if (n === 0) {
   return target.setDirect(1, 1);
  }
  const min = interval.min;
  const max = interval.max;
  const even = (n & 1) === 0;
  if (even) {
   if (min >= 0) {
    return target.setDirect(pow(min, n), pow(max, n));
   }
   if (max <= 0) {
    return target.setDirect(pow(max, n), pow(min, n));
   }
   // Sign-crossing even power: min of |·|^n is 0; max is the larger |endpoint|^n.
   return target.setDirect(0, Math.max(pow(-min, n), pow(max, n)));
  }
  // Odd exponent preserves monotonicity; positive n keeps bound order, negative inverts.
  const a = pow(min, n);
  const b = pow(max, n);
  return target.setDirect(Math.min(a, b), Math.max(a, b));
 }

 /**
  * Returns the reciprocal of an interval
  * @param interval - Interval (must not contain zero)
  * @param out - Optional output interval
  * @returns Reciprocal interval
  * @throws {RangeError} If interval contains zero
  *
  * @see {@link reciprocalSafe} - Returns ZERO if interval contains zero
  * @see {@link reciprocalUnchecked} - No validation, for hot paths
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 public static reciprocal(interval: ReadonlyIntervalLike, out?: Interval): Interval {
  if (interval.min <= 0 && interval.max >= 0) {
   throw new RangeError('Interval.reciprocal: interval contains zero');
  }
  const recipMin = 1 / interval.min;
  const recipMax = 1 / interval.max;
  return Interval.ensureOut(out).setDirect(
   Math.min(recipMin, recipMax),
   Math.max(recipMin, recipMax),
  );
 }

 /**
  * Returns the reciprocal of an interval (safe version)
  * @param interval - Interval
  * @param out - Optional output interval
  * @returns Reciprocal interval, or ZERO if interval contains zero
  *
  * @see {@link reciprocal} - Throws if interval contains zero
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 public static reciprocalSafe(interval: ReadonlyIntervalLike, out?: Interval): Interval {
  if (interval.min <= 0 && interval.max >= 0) {
   return Interval.ensureOut(out).setDirect(0, 0);
  }
  const recipMin = 1 / interval.min;
  const recipMax = 1 / interval.max;
  return Interval.ensureOut(out).setDirect(
   Math.min(recipMin, recipMax),
   Math.max(recipMin, recipMax),
  );
 }

 /**
  * Returns the reciprocal of an interval without validation (for hot paths)
  *
  * @remarks
  * **Precondition:** Interval must not contain zero.
  * If interval contains zero, result will contain Infinity/-Infinity or NaN.
  *
  * Use in performance-critical code where interval validity is guaranteed.
  *
  * @param interval - Interval (must not contain zero)
  * @param out - Optional output interval
  * @returns Reciprocal interval
  *
  * @see {@link reciprocal} - Throws if interval contains zero
  * @see {@link reciprocalSafe} - Returns ZERO if interval contains zero
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 public static reciprocalUnchecked(interval: ReadonlyIntervalLike, out?: Interval): Interval {
  const recipMin = 1 / interval.min;
  const recipMax = 1 / interval.max;
  return Interval.ensureOut(out).setDirect(
   Math.min(recipMin, recipMax),
   Math.max(recipMin, recipMax),
  );
 }

 /* ======================================================================== */
 /* Static Component-wise                                                    */
 /* ======================================================================== */

 /**
  * Applies Math.floor to both bounds
  * @param interval - Input interval
  * @param out - Optional output interval
  * @returns Interval with floored bounds
  *
  * @category Transform
  * @since 0.7.0
  */
 public static floor(interval: ReadonlyIntervalLike, out?: Interval): Interval {
  return Interval.ensureOut(out).setDirect(Math.floor(interval.min), Math.floor(interval.max));
 }

 /**
  * Applies Math.ceil to both bounds
  * @param interval - Input interval
  * @param out - Optional output interval
  * @returns Interval with ceiled bounds
  *
  * @category Transform
  * @since 0.7.0
  */
 public static ceil(interval: ReadonlyIntervalLike, out?: Interval): Interval {
  return Interval.ensureOut(out).setDirect(Math.ceil(interval.min), Math.ceil(interval.max));
 }

 /**
  * Applies Math.round to both bounds
  * @param interval - Input interval
  * @param out - Optional output interval
  * @returns Interval with rounded bounds
  *
  * @category Transform
  * @since 0.7.0
  */
 public static round(interval: ReadonlyIntervalLike, out?: Interval): Interval {
  return Interval.ensureOut(out).setDirect(Math.round(interval.min), Math.round(interval.max));
 }

 /**
  * Applies Math.trunc to both bounds
  * @param interval - Input interval
  * @param out - Optional output interval
  * @returns Interval with truncated bounds
  *
  * @category Transform
  * @since 0.7.0
  */
 public static trunc(interval: ReadonlyIntervalLike, out?: Interval): Interval {
  return Interval.ensureOut(out).setDirect(Math.trunc(interval.min), Math.trunc(interval.max));
 }

 /**
  * Component-wise sign of both bounds
  * @param interval - Input interval
  * @param out - Optional output interval
  * @returns Interval with sign of each bound (-1, 0, or 1)
  *
  * @category Transform
  * @since 0.7.0
  */
 public static sign(interval: ReadonlyIntervalLike, out?: Interval): Interval {
  return Interval.ensureOut(out).setDirect(scalarSign(interval.min), scalarSign(interval.max));
 }

 /**
  * Component-wise minimum of two intervals
  *
  * @remarks
  * Name clash note: `Interval` has no single-value `min` / `max` accessors
  * (the bounds are exposed via the `min` / `max` instance properties). These
  * static `min` / `max` methods take two intervals and return an interval,
  * unlike the component-wise `Vector2.min` / `Matrix2.min` / `Matrix3.min`
  * which each produce a new instance of their own type. Callers confused
  * with the property-access name should use `interval.min` for the lower
  * bound.
  *
  * @param a - First interval
  * @param b - Second interval
  * @param out - Optional output interval
  * @returns Interval with per-bound minima
  *
  * @category Constraint
  * @since 0.7.0
  */
 public static min(a: ReadonlyIntervalLike, b: ReadonlyIntervalLike, out?: Interval): Interval {
  return Interval.ensureOut(out).setDirect(Math.min(a.min, b.min), Math.min(a.max, b.max));
 }

 /**
  * Component-wise maximum of two intervals
  *
  * @remarks
  * See {@link min} for the naming-clash note against the `max` bound property.
  *
  * @param a - First interval
  * @param b - Second interval
  * @param out - Optional output interval
  * @returns Interval with per-bound maxima
  *
  * @category Constraint
  * @since 0.7.0
  */
 public static max(a: ReadonlyIntervalLike, b: ReadonlyIntervalLike, out?: Interval): Interval {
  return Interval.ensureOut(out).setDirect(Math.max(a.min, b.min), Math.max(a.max, b.max));
 }

 /**
  * Clamps bounds between min and max intervals
  * @param interval - Input interval
  * @param minI - Per-bound minima
  * @param maxI - Per-bound maxima
  * @param out - Optional output interval
  * @returns Clamped interval
  *
  * @category Constraint
  * @since 0.7.0
  */
 public static clamp(
  interval: ReadonlyIntervalLike,
  minI: ReadonlyIntervalLike,
  maxI: ReadonlyIntervalLike,
  out?: Interval,
 ): Interval {
  return Interval.ensureOut(out).setDirect(
   clamp(interval.min, minI.min, maxI.min),
   clamp(interval.max, minI.max, maxI.max),
  );
 }

 /* ======================================================================== */
 /* Static Interpolation                                                     */
 /* ======================================================================== */

 /**
  * Linear interpolation between two intervals (unclamped)
  *
  * @remarks
  * The interpolation factor `t` is NOT clamped — values outside [0, 1] will
  * extrapolate beyond the input intervals. Use {@link lerpClamped} to clamp.
  *
  * @param a - Start interval
  * @param b - End interval
  * @param t - Interpolation factor (unclamped, allows extrapolation)
  * @param out - Optional output interval
  * @returns Interpolated interval
  *
  * @category Interpolation
  * @since 0.7.0
  */
 public static lerp(
  a: ReadonlyIntervalLike,
  b: ReadonlyIntervalLike,
  t: number,
  out?: Interval,
 ): Interval {
  return Interval.ensureOut(out).setDirect(lerp(a.min, b.min, t), lerp(a.max, b.max, t));
 }

 /**
  * Samples a value within an interval using linear interpolation
  *
  * @remarks
  * Samples a point WITHIN the interval, unlike {@link lerp}
  * which interpolates BETWEEN two intervals.
  *
  * @param interval - Interval to sample
  * @param t - Interpolation factor [0, 1], clamped
  * @returns Value within the interval (min when t=0, max when t=1)
  *
  * @category Interpolation
  * @since 0.7.0
  */
 public static sample(interval: ReadonlyIntervalLike, t: number): number {
  const clamped = saturate(t);
  return lerp(interval.min, interval.max, clamped);
 }

 /**
  * Linear interpolation with t clamped to [0, 1]
  * @param a - Start interval
  * @param b - End interval
  * @param t - Interpolation factor (clamped to [0, 1])
  * @param out - Optional output interval
  * @returns Interpolated interval
  *
  * @category Interpolation
  * @since 0.7.0
  */
 public static lerpClamped(
  a: ReadonlyIntervalLike,
  b: ReadonlyIntervalLike,
  t: number,
  out?: Interval,
 ): Interval {
  return Interval.lerp(a, b, saturate(t), out);
 }

 /**
  * Smooth interpolation between two intervals using smoothStep easing
  *
  * @remarks
  * Uses Hermite smoothStep for ease-in-out effect.
  * Equivalent to `lerp(a, b, smoothStep(0, 1, clamp(t, 0, 1)))`.
  *
  * @param a - Source interval
  * @param b - Target interval
  * @param t - Interpolation factor (clamped to [0, 1])
  * @param out - Optional output interval
  * @returns Smoothly interpolated interval
  *
  * @example
  * ```typescript
  * const a = new Interval(0, 10);
  * const b = new Interval(100, 200);
  * const smooth = Interval.smoothStep(a, b, 0.5); // Smooth transition
  * ```
  *
  * @category Interpolation
  * @since 0.7.0
  */
 public static smoothStep(
  a: ReadonlyIntervalLike,
  b: ReadonlyIntervalLike,
  t: number,
  out?: Interval,
 ): Interval {
  const smoothT = smoothStep(0, 1, t);
  return Interval.lerp(a, b, smoothT, out);
 }

 /**
  * Finds where a value falls within an interval, returning normalized position
  *
  * @remarks
  * Inverse of `lerp`: `Interval.inverseLerp(interval, Interval.lerp(interval, t)) ≈ t`.
  *
  * Asymmetry with {@link lerp}: `inverseLerp` has an EPSILON dead-zone on
  * the interval width. When `width = max − min` falls within `EPSILON` of
  * zero (a degenerate interval), the function returns `0` rather than
  * propagating the division-by-zero Infinity. `lerp` has no dead-zone and
  * accepts any `t` (including outside `[0, 1]` for extrapolation). This
  * divergence is intentional: `inverseLerp` is a normalisation accessor,
  * and a degenerate interval cannot meaningfully normalise any value.
  *
  * @param interval - Reference interval
  * @param value - Value to find normalized position of
  *
  * @returns Normalized position [0, 1] for values in [min, max], or 0 if interval is degenerate
  *
  * @example
  * ```typescript
  * const interval = new Interval(0, 100);
  * Interval.inverseLerp(interval, 25);  // 0.25
  * Interval.inverseLerp(interval, 75);  // 0.75
  * Interval.inverseLerp(interval, 150); // 1.5 (extrapolated)
  * ```
  *
  * @see {@link lerp} - Forward interpolation (no dead-zone; allows extrapolation)
  *
  * @category Interpolation
  * @since 0.7.0
  */
 public static inverseLerp(interval: ReadonlyIntervalLike, value: number): number {
  const width = interval.max - interval.min;
  if (scalarNearEquals(width, 0)) {
   return 0;
  }
  return divideSafe(value - interval.min, width);
 }

 /**
  * Clamps a value to the interval bounds
  *
  * @param interval - Reference interval
  * @param value - Value to clamp
  * @returns Value clamped to [min, max]
  *
  * @example
  * ```typescript
  * const interval = new Interval(0, 100);
  * Interval.clampValue(interval, 50);   // 50
  * Interval.clampValue(interval, -10);  // 0
  * Interval.clampValue(interval, 150);  // 100
  * ```
  *
  * @category Interpolation
  * @since 0.7.0
  */
 public static clampValue(interval: ReadonlyIntervalLike, value: number): number {
  return clamp(value, interval.min, interval.max);
 }

 /* ======================================================================== */
 /* Static Comparison                                                        */
 /* ======================================================================== */

 /**
  * Exact equality (bit-identical)
  *
  * @remarks
  * Use {@link nearEquals} for comparing results of floating-point operations.
  *
  * @param a - First interval
  * @param b - Second interval
  * @returns True if exactly identical
  *
  * @category Comparison
  * @since 0.7.0
  */
 public static exactEquals(a: ReadonlyIntervalLike, b: ReadonlyIntervalLike): boolean {
  return a.min === b.min && a.max === b.max;
 }

 /**
  * Approximate equality using relative tolerance
  *
  * @remarks
  * Uses relative tolerance: `|a - b| <= epsilon * max(1, |a|, |b|)` per bound.
  *
  * @param a - First interval
  * @param b - Second interval
  * @param epsilon - Relative tolerance. @defaultValue `EPSILON`
  * @returns True if within scaled epsilon
  *
  * @category Comparison
  * @since 0.7.0
  */
 public static nearEquals(
  a: ReadonlyIntervalLike,
  b: ReadonlyIntervalLike,
  epsilon: number = EPSILON,
 ): boolean {
  return relativeEquals(a.min, b.min, epsilon) && relativeEquals(a.max, b.max, epsilon);
 }

 /**
  * Tests if an interval is degenerate (zero width)
  *
  * @remarks
  * Uses relative tolerance for comparing min and max bounds.
  *
  * @param interval - Interval to test
  * @param epsilon - Relative tolerance (default: EPSILON)
  * @returns True if degenerate
  *
  * @category Comparison
  * @since 0.7.0
  */
 public static isDegenerate(interval: ReadonlyIntervalLike, epsilon: number = EPSILON): boolean {
  return relativeEquals(interval.min, interval.max, epsilon);
 }

 /**
  * Tests if two intervals overlap
  * @param a - First interval
  * @param b - Second interval
  * @returns True if intervals overlap
  *
  * @example
  * ```typescript
  * const a = new Interval(0, 5);
  * const b = new Interval(3, 8);
  * Interval.overlaps(a, b); // true - they share [3, 5]
  * ```
  *
  * @category Set Operations
  * @since 0.7.0
  */
 public static overlaps(a: ReadonlyIntervalLike, b: ReadonlyIntervalLike): boolean {
  return a.min <= b.max && a.max >= b.min;
 }

 /**
  * Tests if an interval contains a value
  * @param interval - Interval
  * @param value - Value to test
  * @returns True if value is within interval
  *
  * @category Set Operations
  * @since 0.7.0
  */
 public static contains(interval: ReadonlyIntervalLike, value: number): boolean {
  return value >= interval.min && value <= interval.max;
 }

 /**
  * Strict containment check (exclusive bounds)
  *
  * @remarks
  * Unlike {@link contains}, this excludes the boundary values.
  *
  * @param interval - Interval to test against
  * @param value - Value to test
  * @returns True if value is strictly inside the interval (min < value < max)
  *
  * @example
  * ```typescript
  * Interval.strictlyContains({ min: 0, max: 10 }, 5);   // true
  * Interval.strictlyContains({ min: 0, max: 10 }, 0);   // false (boundary)
  * Interval.strictlyContains({ min: 0, max: 10 }, 10);  // false (boundary)
  * ```
  *
  * @category Set Operations
  * @since 0.7.0
  */
 public static strictlyContains(interval: ReadonlyIntervalLike, value: number): boolean {
  return value > interval.min && value < interval.max;
 }

 /**
  * Tests if one interval is a subset of another
  *
  * @remarks
  * An interval A is a subset of B if A.min >= B.min AND A.max <= B.max.
  *
  * @param subset - Interval that should be contained
  * @param superset - Interval that should contain the subset
  * @returns True if subset is entirely within superset
  *
  * @example
  * ```typescript
  * Interval.isSubsetOf({ min: 2, max: 8 }, { min: 0, max: 10 });  // true
  * Interval.isSubsetOf({ min: 0, max: 10 }, { min: 2, max: 8 });  // false
  * ```
  *
  * @category Set Operations
  * @since 0.7.0
  */
 public static isSubsetOf(subset: ReadonlyIntervalLike, superset: ReadonlyIntervalLike): boolean {
  return subset.min >= superset.min && subset.max <= superset.max;
 }

 /**
  * Returns the gap distance between two intervals
  *
  * @remarks
  * If the intervals overlap, the distance is zero. Otherwise, the distance
  * is the length of the gap between the closest endpoints.
  *
  * @param a - First interval
  * @param b - Second interval
  * @returns Non-negative distance between intervals (0 if overlapping)
  *
  * @example
  * ```typescript
  * Interval.distance({ min: 0, max: 3 }, { min: 5, max: 8 }); // 2
  * Interval.distance({ min: 0, max: 5 }, { min: 3, max: 8 }); // 0 (overlapping)
  * ```
  *
  * @category Set Operations
  * @since 0.7.0
  */
 public static distance(a: ReadonlyIntervalLike, b: ReadonlyIntervalLike): number {
  return Math.max(0, Math.max(a.min - b.max, b.min - a.max));
 }

 /**
  * Tests if both bounds are finite numbers
  * @param interval - Interval to test
  * @returns True if both bounds are finite
  *
  * @category Comparison
  * @since 0.7.0
  */
 public static isFinite(interval: ReadonlyIntervalLike): boolean {
  return Number.isFinite(interval.min) && Number.isFinite(interval.max);
 }

 /**
  * Tests if both bounds are exactly zero
  * @param interval - Interval to test
  * @returns True if min = 0 and max = 0
  *
  * @category Comparison
  * @since 0.7.0
  */
 public static isZero(interval: ReadonlyIntervalLike): boolean {
  return interval.min === 0 && interval.max === 0;
 }

 /**
  * Tests if both bounds are near zero
  * @param interval - Interval to test
  * @param epsilon - Tolerance. @defaultValue `EPSILON`
  * @returns True if both bounds are within epsilon of zero
  *
  * @category Comparison
  * @since 0.7.0
  */
 public static isNearZero(interval: ReadonlyIntervalLike, epsilon: number = EPSILON): boolean {
  return isNearZero(interval.min, epsilon) && isNearZero(interval.max, epsilon);
 }

 /**
  * Tests if any bound is NaN
  * @param interval - Interval to test
  * @returns True if any bound is NaN
  *
  * @category Comparison
  * @since 0.7.0
  */
 public static hasNaN(interval: ReadonlyIntervalLike): boolean {
  return Number.isNaN(interval.min) || Number.isNaN(interval.max);
 }

 /**
  * Tests if any bound is infinite (±Infinity)
  *
  * @remarks
  * Distinguishes infinity from NaN. Use {@link isFinite} to check for both.
  *
  * @param interval - Interval to test
  * @returns True if any bound is ±Infinity
  *
  * @category Comparison
  * @since 0.7.0
  */
 public static hasInfinity(interval: ReadonlyIntervalLike): boolean {
  return (
   (!Number.isFinite(interval.min) && !Number.isNaN(interval.min)) ||
   (!Number.isFinite(interval.max) && !Number.isNaN(interval.max))
  );
 }

 /* ======================================================================== */
 /* Static Computed                                                          */
 /* ======================================================================== */

 /**
  * Returns the width of an interval
  * @param interval - Interval
  * @returns Width (max - min)
  *
  * @category Computed
  * @since 0.7.0
  */
 public static width(interval: ReadonlyIntervalLike): number {
  return interval.max - interval.min;
 }

 /**
  * Returns the center of an interval
  * @param interval - Interval
  * @returns Center ((min + max) / 2)
  *
  * @category Computed
  * @since 0.7.0
  */
 public static center(interval: ReadonlyIntervalLike): number {
  return interval.min + (interval.max - interval.min) * 0.5;
 }

 /**
  * Returns the radius (half-width) of an interval
  * @param interval - Interval
  * @returns Radius ((max - min) / 2)
  *
  * @category Computed
  * @since 0.7.0
  */
 public static radius(interval: ReadonlyIntervalLike): number {
  return (interval.max - interval.min) * 0.5;
 }

 /**
  * Returns the magnitude `mag([min, max]) = max(|min|, |max|)`
  *
  * @remarks
  * IEEE 1788-2015 §10.5.7 magnitude — the largest absolute value attained on
  * the interval. For a proper interval it equals `max(|min|, |max|)`.
  *
  * @param interval - Interval
  * @returns Magnitude of the interval
  *
  * @see {@link mig} - Mignitude (smallest absolute value)
  *
  * @category Computed
  * @since 0.7.0
  */
 public static mag(interval: ReadonlyIntervalLike): number {
  return Math.max(Math.abs(interval.min), Math.abs(interval.max));
 }

 /**
  * Returns the mignitude `mig([min, max]) = min(|x|) for x ∈ [min, max]`
  *
  * @remarks
  * IEEE 1788-2015 §10.5.7 mignitude — the smallest absolute value attained on
  * the interval. `0` when the interval spans zero, otherwise `min(|min|, |max|)`.
  *
  * @param interval - Interval
  * @returns Mignitude of the interval
  *
  * @see {@link mag} - Magnitude (largest absolute value)
  *
  * @category Computed
  * @since 0.7.0
  */
 public static mig(interval: ReadonlyIntervalLike): number {
  if (interval.min <= 0 && interval.max >= 0) return 0;
  return Math.min(Math.abs(interval.min), Math.abs(interval.max));
 }

 /* ======================================================================== */
 /* Static Set Operations                                                    */
 /* ======================================================================== */

 /**
  * Returns the hull (smallest enclosing interval) of two intervals
  *
  * @remarks
  * The hull is the smallest interval containing both inputs. For an array or
  * variadic set of intervals, use {@link Interval.hullOf} instead.
  *
  * @param a - First interval
  * @param b - Second interval
  * @param out - Optional output interval
  * @returns Hull containing both `a` and `b`
  *
  * @see {@link Interval.hullOf} - array / varargs form
  *
  * @category Set Operations
  * @since 0.7.0
  */
 public static hull(a: ReadonlyIntervalLike, b: ReadonlyIntervalLike, out?: Interval): Interval {
  const minValue = Math.min(a.min, b.min);
  const maxValue = Math.max(a.max, b.max);
  return Interval.ensureOut(out).setDirect(minValue, maxValue);
 }

 /**
  * Returns the hull of an array of intervals or numbers, throwing on empty input
  *
  * @remarks
  * Throws `RangeError` on empty input; callers needing a fallback use
  * {@link Interval.hullOfSafe}. NaN propagates per IEEE 754 §6.2 through
  * `Math.min` / `Math.max`. Numbers in the input are treated as point intervals `[n, n]`.
  *
  * @param values - Array of intervals or numbers to hull
  * @param out - Optional output interval
  * @returns Smallest interval containing every input value
  * @throws {RangeError} If `values` is empty
  *
  * @see {@link Interval.hull} - binary form
  * @see {@link Interval.hullOfSafe} - Safe variant with empty-input fallback
  * @see {@link Interval.hullOfUnchecked} - Unchecked variant (GIGO)
  *
  * @category Set Operations
  * @since 0.7.0
  */
 public static hullOf(values: ArrayLike<number | ReadonlyIntervalLike>, out?: Interval): Interval {
  if (values.length === 0) {
   throw new RangeError('Interval.hullOf: values array cannot be empty');
  }
  let minValue = Number.POSITIVE_INFINITY;
  let maxValue = Number.NEGATIVE_INFINITY;

  for (let index = 0; index < values.length; index++) {
   const entry = values[index]!;
   if (typeof entry === 'number') {
    minValue = Math.min(minValue, entry);
    maxValue = Math.max(maxValue, entry);
   } else {
    minValue = Math.min(minValue, entry.min);
    maxValue = Math.max(maxValue, entry.max);
   }
  }

  return Interval.ensureOut(out).setDirect(minValue, maxValue);
 }

 /**
  * Returns the hull of an array with a fallback for empty input
  *
  * @remarks
  * Safe-tier variant of {@link Interval.hullOf}. Returns the empty-interval sentinel
  * `{min: +Infinity, max: -Infinity}` (or a caller-provided `fallback`) when `values`
  * is empty. NaN propagates per IEEE 754 §6.2 — it is never a domain error.
  *
  * @param values - Array of intervals or numbers to hull
  * @param fallback - Interval to return when `values` is empty; default is the empty sentinel
  * @param out - Optional output interval
  * @returns Hull of inputs, or `fallback` if empty
  *
  * @see {@link Interval.hullOf} - strict variant that throws
  * @see {@link Interval.hullOfUnchecked} - Unchecked variant (GIGO)
  *
  * @category Set Operations
  * @since 0.7.0
  */
 public static hullOfSafe(
  values: ArrayLike<number | ReadonlyIntervalLike>,
  fallback?: ReadonlyIntervalLike,
  out?: Interval,
 ): Interval {
  if (values.length === 0) {
   const emptyMin = fallback?.min ?? Number.POSITIVE_INFINITY;
   const emptyMax = fallback?.max ?? Number.NEGATIVE_INFINITY;
   return Interval.ensureOut(out).setDirect(emptyMin, emptyMax);
  }
  return Interval.hullOf(values, out);
 }

 /**
  * Returns the hull of an array without empty-input validation (GIGO contract)
  *
  * @remarks
  * Unchecked tier of {@link Interval.hullOf}. Empty input produces the degenerate
  * `[+Infinity, -Infinity]` interval (violates `min ≤ max` invariant). Caller
  * guarantees `values.length > 0` for well-formed output.
  *
  * @param values - Array of intervals or numbers to hull (MUST be non-empty)
  * @param out - Optional output interval
  * @returns Hull of inputs; degenerate `[+Infinity, -Infinity]` for empty input
  *
  * @see {@link Interval.hullOf} - strict variant with empty-input validation
  * @see {@link Interval.hullOfSafe} - Safe variant with fallback
  *
  * @category Set Operations
  * @since 0.7.0
  */
 public static hullOfUnchecked(
  values: ArrayLike<number | ReadonlyIntervalLike>,
  out?: Interval,
 ): Interval {
  let minValue = Number.POSITIVE_INFINITY;
  let maxValue = Number.NEGATIVE_INFINITY;
  for (let index = 0; index < values.length; index++) {
   const entry = values[index]!;
   if (typeof entry === 'number') {
    minValue = Math.min(minValue, entry);
    maxValue = Math.max(maxValue, entry);
   } else {
    minValue = Math.min(minValue, entry.min);
    maxValue = Math.max(maxValue, entry.max);
   }
  }
  return Interval.ensureOut(out).setDirect(minValue, maxValue);
 }

 /**
  * Returns the union of two intervals
  * @param a - First interval
  * @param b - Second interval
  * @param out - Optional output interval
  * @returns Union interval (smallest interval containing both)
  *
  * @example
  * ```typescript
  * const a = new Interval(0, 3);
  * const b = new Interval(5, 8);
  * Interval.union(a, b); // [0, 8] - spans both intervals
  * ```
  *
  * @category Set Operations
  * @since 0.7.0
  */
 public static union(a: ReadonlyIntervalLike, b: ReadonlyIntervalLike, out?: Interval): Interval {
  return Interval.ensureOut(out).setDirect(Math.min(a.min, b.min), Math.max(a.max, b.max));
 }

 /**
  * Returns the intersection of two intervals
  *
  * @remarks
  * If the intervals do not overlap, returns `undefined` to represent the
  * empty set (∅). The `out` parameter is not modified in this case.
  *
  * @param a - First interval
  * @param b - Second interval
  * @param out - Optional output interval
  * @returns Intersection interval or undefined if no overlap
  *
  * @example
  * ```typescript
  * const a = new Interval(0, 5);
  * const b = new Interval(3, 8);
  * Interval.intersect(a, b); // [3, 5] - common region
  * Interval.intersect(new Interval(0, 2), new Interval(5, 8)); // undefined
  * ```
  *
  * @category Set Operations
  * @since 0.7.0
  */
 public static intersect(
  a: ReadonlyIntervalLike,
  b: ReadonlyIntervalLike,
  out?: Interval,
 ): Interval | undefined {
  const newMin = Math.max(a.min, b.min);
  const newMax = Math.min(a.max, b.max);
  if (newMin <= newMax) {
   return Interval.ensureOut(out).setDirect(newMin, newMax);
  }
  return undefined;
 }

 /**
  * Expands an interval symmetrically by a delta
  * @param interval - Source interval
  * @param delta - Amount to expand each side (must be non-negative)
  * @param out - Optional output interval
  * @returns Expanded interval [min - delta, max + delta]
  * @throws {RangeError} If delta is negative
  *
  * @category Set Operations
  * @since 0.7.0
  */
 public static expand(interval: ReadonlyIntervalLike, delta: number, out?: Interval): Interval {
  if (delta < 0) {
   throw new RangeError('Interval.expand: delta must be non-negative');
  }
  return Interval.ensureOut(out).setDirect(interval.min - delta, interval.max + delta);
 }

 /**
  * Returns the smallest interval that contains both the original interval and a value
  *
  * @remarks
  * If the value is already within the interval, the result is the original interval
  * unchanged. Otherwise, the interval is expanded on the appropriate side. Name
  * preserved as the gerund `enclosing` (matches `containing`, `intersecting` within
  * the Set Operations category); no `enclose` alias.
  *
  * @param interval - Source interval
  * @param value - Value to enclose
  * @param out - Optional output interval
  * @returns Interval expanded to include the value
  *
  * @example
  * ```typescript
  * Interval.enclosing({ min: 2, max: 5 }, 8);  // [2, 8]
  * Interval.enclosing({ min: 2, max: 5 }, 0);  // [0, 5]
  * Interval.enclosing({ min: 2, max: 5 }, 3);  // [2, 5] (already contained)
  * ```
  *
  * @see {@link hull} - Smallest interval enclosing two intervals
  * @see {@link hullOf} - Smallest interval enclosing an array of values / intervals
  *
  * @category Set Operations
  * @since 0.7.0
  */
 public static enclosing(interval: ReadonlyIntervalLike, value: number, out?: Interval): Interval {
  return Interval.ensureOut(out).setDirect(
   Math.min(interval.min, value),
   Math.max(interval.max, value),
  );
 }

 /**
  * Shrinks an interval symmetrically by a delta
  * If delta exceeds half the interval width, returns the midpoint as a degenerate interval.
  * @param interval - Source interval
  * @param delta - Amount to shrink each side (must be non-negative)
  * @param out - Optional output interval
  * @returns Shrunk interval, or degenerate midpoint interval if fully collapsed
  * @throws {RangeError} If delta is negative
  *
  * @category Set Operations
  * @since 0.7.0
  */
 public static shrink(interval: ReadonlyIntervalLike, delta: number, out?: Interval): Interval {
  if (delta < 0) {
   throw new RangeError('Interval.shrink: delta must be non-negative');
  }
  const newMin = interval.min + delta;
  const newMax = interval.max - delta;
  if (newMin > newMax) {
   // Robust midpoint formula avoids overflow when min + max > MAX_VALUE
   const mid = interval.min + (interval.max - interval.min) * 0.5;
   return Interval.ensureOut(out).setDirect(mid, mid);
  }
  return Interval.ensureOut(out).setDirect(newMin, newMax);
 }

 /* ======================================================================== */
 /* Instance Mutators                                                        */
 /* ======================================================================== */

 /**
  * Sets the min and max bounds
  * @param minValue - Minimum bound
  * @param maxValue - Maximum bound
  * @returns This for chaining
  * @throws {RangeError} If min > max
  *
  * @category Mutator
  * @since 0.7.0
  */
 set(minValue: number, maxValue: number): this {
  if (__LENGUADOS_DEV__) {
   Interval.sanitize(minValue, 'Interval.set:min');
   Interval.sanitize(maxValue, 'Interval.set:max');
   Interval.assertOrder(minValue, maxValue, 'Interval.set');
  }
  this.min = minValue;
  this.max = maxValue;
  return this;
 }

 /**
  * Copies values from another interval
  *
  * @remarks
  * Trusted fast path — does not validate min <= max. Use set() for validated
  * assignment from untrusted sources.
  *
  * @param other - Source interval
  * @returns This for chaining
  *
  * @category Mutator
  * @since 0.7.0
  */
 copy(other: ReadonlyIntervalLike): this {
  return this.setDirect(other.min, other.max);
 }

 /**
  * Sets this interval from array values
  * @param array - Source array [min, max]
  * @param offset - Starting index (default 0)
  * @returns This for chaining
  * @throws {RangeError} If offset is negative or the array lacks two elements from offset
  *
  * @category Mutator
  * @since 0.7.0
  */
 setFromArray(array: ArrayLike<number>, offset = 0): this {
  if (offset < 0 || offset + Interval.ELEMENT_COUNT > array.length) {
   throw new RangeError(
    `Interval.setFromArray: offset ${offset} out of bounds for array length ${array.length}`,
   );
  }
  return this.set(array[offset]!, array[offset + 1]!);
 }

 /**
  * Resets this interval to zero [0, 0]
  * @returns This for chaining
  *
  * @category Mutator
  * @since 0.7.0
  */
 zero(): this {
  this.min = 0;
  this.max = 0;
  return this;
 }

 /* ======================================================================== */
 /* Instance Computed                                                        */
 /* ======================================================================== */

 /**
  * Returns the width of this interval
  * @returns Width (max - min)
  *
  * @category Computed
  * @since 0.7.0
  */
 width(): number {
  return this.max - this.min;
 }

 /**
  * Returns the center of this interval
  * @returns Center ((min + max) / 2)
  *
  * @category Computed
  * @since 0.7.0
  */
 center(): number {
  return this.min + (this.max - this.min) * 0.5;
 }

 /**
  * Returns the radius (half-width) of this interval
  * @returns Radius ((max - min) / 2)
  *
  * @category Computed
  * @since 0.7.0
  */
 radius(): number {
  return (this.max - this.min) * 0.5;
 }

 /**
  * Returns the magnitude `mag([min, max]) = max(|min|, |max|)` (IEEE 1788-2015 §10.5.7)
  *
  * @returns Magnitude of this interval
  *
  * @see {@link mig} - Mignitude (smallest absolute value)
  *
  * @category Computed
  * @since 0.7.0
  */
 mag(): number {
  return Interval.mag(this);
 }

 /**
  * Returns the mignitude `mig([min, max]) = min(|x|) for x ∈ [min, max]` (IEEE 1788-2015 §10.5.7)
  *
  * @returns Mignitude of this interval
  *
  * @see {@link mag} - Magnitude (largest absolute value)
  *
  * @category Computed
  * @since 0.7.0
  */
 mig(): number {
  return Interval.mig(this);
 }

 /* ======================================================================== */
 /* Instance Comparison                                                      */
 /* ======================================================================== */

 /**
  * Tests if this interval is degenerate (zero width)
  *
  * @remarks
  * Uses relative tolerance for comparing min and max bounds.
  *
  * @param epsilon - Relative tolerance (default: EPSILON)
  * @returns True if degenerate
  *
  * @category Comparison
  * @since 0.7.0
  */
 isDegenerate(epsilon: number = EPSILON): boolean {
  return relativeEquals(this.min, this.max, epsilon);
 }

 /* ------ Set Operations ------ */

 /**
  * Tests if this interval contains a value
  * @param value - Value to test
  * @returns True if value is within interval
  *
  * @category Set Operations
  * @since 0.7.0
  */
 contains(value: number): boolean {
  return value >= this.min && value <= this.max;
 }

 /**
  * Tests if this interval strictly contains a value (exclusive bounds)
  * @param value - Value to test
  * @returns True if value is strictly within interval
  *
  * @category Set Operations
  * @since 0.7.0
  */
 strictlyContains(value: number): boolean {
  return value > this.min && value < this.max;
 }

 /**
  * Tests if this interval overlaps another
  * @param other - Other interval
  * @returns True if intervals overlap
  *
  * @category Set Operations
  * @since 0.7.0
  */
 overlaps(other: ReadonlyIntervalLike): boolean {
  return this.min <= other.max && this.max >= other.min;
 }

 /**
  * Tests if this interval is a subset of another
  * @param other - Other interval
  * @returns True if this is contained in other
  *
  * @category Set Operations
  * @since 0.7.0
  */
 isSubsetOf(other: ReadonlyIntervalLike): boolean {
  return this.min >= other.min && this.max <= other.max;
 }

 /* ======================================================================== */
 /* Instance Component-wise                                                  */
 /* ======================================================================== */

 /**
  * Applies Math.floor to both bounds
  * @returns This for chaining
  * @category Transform
  * @since 0.7.0
  */
 floor(): this {
  this.min = Math.floor(this.min);
  this.max = Math.floor(this.max);
  return this;
 }

 /**
  * Applies Math.ceil to both bounds
  * @returns This for chaining
  * @category Transform
  * @since 0.7.0
  */
 ceil(): this {
  this.min = Math.ceil(this.min);
  this.max = Math.ceil(this.max);
  return this;
 }

 /**
  * Applies Math.round to both bounds
  * @returns This for chaining
  * @category Transform
  * @since 0.7.0
  */
 round(): this {
  this.min = Math.round(this.min);
  this.max = Math.round(this.max);
  return this;
 }

 /**
  * Applies Math.trunc to both bounds
  * @returns This for chaining
  * @category Transform
  * @since 0.7.0
  */
 trunc(): this {
  this.min = Math.trunc(this.min);
  this.max = Math.trunc(this.max);
  return this;
 }

 /**
  * Component-wise sign of both bounds
  * @returns This for chaining
  * @category Transform
  * @since 0.7.0
  */
 sign(): this {
  this.min = scalarSign(this.min);
  this.max = scalarSign(this.max);
  return this;
 }

 /**
  * Clamps bounds between min and max intervals
  * @param minI - Per-bound minima
  * @param maxI - Per-bound maxima
  * @returns This for chaining
  * @category Constraint
  * @since 0.7.0
  */
 clamp(minI: ReadonlyIntervalLike, maxI: ReadonlyIntervalLike): this {
  this.min = clamp(this.min, minI.min, maxI.min);
  this.max = clamp(this.max, minI.max, maxI.max);
  return this;
 }

 /* ======================================================================== */
 /* Instance Arithmetic                                                      */
 /* ======================================================================== */

 /**
  * Adds another interval to this one in place
  * @param other - Interval to add
  * @returns This for chaining
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 add(other: ReadonlyIntervalLike): this {
  this.min += other.min;
  this.max += other.max;
  return this;
 }

 /**
  * Subtracts another interval from this one in place
  * @param other - Interval to subtract
  * @returns This for chaining
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 subtract(other: ReadonlyIntervalLike): this {
  const newMin = this.min - other.max;
  const newMax = this.max - other.min;
  this.min = newMin;
  this.max = newMax;
  return this;
 }

 /**
  * Multiplies with another interval in place
  * @param other - Interval to multiply by
  * @returns This for chaining
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 multiply(other: ReadonlyIntervalLike): this {
  const p0 = this.min * other.min;
  const p1 = this.min * other.max;
  const p2 = this.max * other.min;
  const p3 = this.max * other.max;
  this.min = Math.min(p0, p1, p2, p3);
  this.max = Math.max(p0, p1, p2, p3);
  return this;
 }

 /**
  * Divides this interval's bounds by a scalar in place
  * @param scalar - Scalar divisor
  * @returns This for chaining
  * @throws {RangeError} If scalar is zero
  *
  * @see {@link divideScalarSafe} - Returns [0,0] on zero
  * @see {@link divideScalarUnchecked} - No validation, for hot paths
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 divideScalar(scalar: number): this {
  if (scalar === 0) {
   throw new RangeError('Interval.divideScalar: cannot divide by zero');
  }
  const inv = 1 / scalar;
  if (inv >= 0) {
   this.min *= inv;
   this.max *= inv;
  } else {
   const newMin = this.max * inv;
   const newMax = this.min * inv;
   this.min = newMin;
   this.max = newMax;
  }
  return this;
 }

 /**
  * Divides this interval's bounds by a scalar in place, returning [0, 0] on zero scalar
  * @param scalar - Scalar divisor
  * @returns This for chaining
  *
  * @see {@link divideScalar} - Throws on zero
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 divideScalarSafe(scalar: number): this {
  if (scalar === 0) {
   this.min = 0;
   this.max = 0;
   return this;
  }
  const inv = 1 / scalar;
  if (inv >= 0) {
   this.min *= inv;
   this.max *= inv;
  } else {
   const newMin = this.max * inv;
   const newMax = this.min * inv;
   this.min = newMin;
   this.max = newMax;
  }
  return this;
 }

 /**
  * Divides this interval's bounds by a scalar in place without validation
  *
  * @remarks
  * **Precondition:** `scalar ≠ 0`. Calling with zero produces Infinity/NaN.
  *
  * @param scalar - Scalar divisor (must be non-zero)
  * @returns This for chaining
  *
  * @see {@link divideScalar} - Throws on zero
  * @see {@link divideScalarSafe} - Returns [0,0] on zero
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 divideScalarUnchecked(scalar: number): this {
  const inv = 1 / scalar;
  if (inv >= 0) {
   this.min *= inv;
   this.max *= inv;
  } else {
   const newMin = this.max * inv;
   const newMax = this.min * inv;
   this.min = newMin;
   this.max = newMax;
  }
  return this;
 }

 /**
  * Multiplies this interval's bounds by a scalar in place
  * @param scalar - Scalar multiplier
  * @returns This for chaining
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 multiplyScalar(scalar: number): this {
  // NaN propagates per IEEE 754 §6.2; the operation is total so any finite or
  // non-finite scalar flows through IEEE arithmetic directly, matching the static
  // counterpart.
  if (scalar >= 0) {
   this.min *= scalar;
   this.max *= scalar;
  } else {
   const newMin = this.max * scalar;
   const newMax = this.min * scalar;
   this.min = newMin;
   this.max = newMax;
  }
  return this;
 }

 /**
  * Negates this interval in place
  * @returns This for chaining
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 negate(): this {
  const newMin = -this.max;
  const newMax = -this.min;
  this.min = newMin;
  this.max = newMax;
  return this;
 }

 /**
  * Takes the absolute value of this interval in place (Moore's definition)
  * @returns This for chaining
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 abs(): this {
  if (this.min >= 0) {
   return this;
  }
  if (this.max <= 0) {
   const newMin = -this.max;
   const newMax = -this.min;
   this.min = newMin;
   this.max = newMax;
   return this;
  }
  this.max = Math.max(-this.min, this.max);
  this.min = 0;
  return this;
 }

 /**
  * Squares this interval in place
  * @returns This for chaining
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 square(): this {
  const minSq = this.min * this.min;
  const maxSq = this.max * this.max;
  if (this.min >= 0) {
   this.min = minSq;
   this.max = maxSq;
  } else if (this.max <= 0) {
   this.min = maxSq;
   this.max = minSq;
  } else {
   this.min = 0;
   this.max = Math.max(minSq, maxSq);
  }
  return this;
 }

 /**
  * Computes the square root of this interval in place
  * @returns This for chaining
  * @throws {RangeError} If interval contains negative values
  *
  * @see {@link sqrtSafe} - Clamps negatives, never throws
  * @see {@link sqrtUnchecked} - No validation, for hot paths
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 sqrt(): this {
  if (this.min < 0) {
   throw new RangeError('Interval.sqrt: interval contains negative values');
  }
  this.min = sqrtSafe(this.min);
  this.max = sqrtSafe(this.max);
  return this;
 }

 /**
  * Computes the square root of this interval in place (safe version)
  * @returns This for chaining, set to `[0, 0]` if fully negative; clamps min to 0 if partially negative
  *
  * @see {@link sqrt} - Throws if contains negative values
  * @see {@link sqrtUnchecked} - No validation, for hot paths
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 sqrtSafe(): this {
  if (this.max < 0) {
   this.min = 0;
   this.max = 0;
   return this;
  }
  this.min = this.min < 0 ? 0 : sqrtSafe(this.min);
  this.max = sqrtSafe(this.max);
  return this;
 }

 /**
  * Computes the square root of this interval in place without validation (for hot paths)
  *
  * @remarks
  * **Precondition:** Interval must be non-negative.
  * If interval contains negative values, result will contain NaN.
  *
  * @returns This for chaining
  *
  * @see {@link sqrt} - Throws if contains negative values
  * @see {@link sqrtSafe} - Clamps negatives, never throws
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 sqrtUnchecked(): this {
  this.min = Math.sqrt(this.min);
  this.max = Math.sqrt(this.max);
  return this;
 }

 /**
  * Computes the reciprocal of this interval in place
  * @returns This for chaining
  * @throws {RangeError} If interval contains zero
  *
  * @see {@link reciprocalSafe} - Returns ZERO if contains zero
  * @see {@link reciprocalUnchecked} - No validation, for hot paths
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 reciprocal(): this {
  if (this.contains(0)) {
   throw new RangeError('Interval.reciprocal: interval contains zero');
  }
  const recipMin = 1 / this.min;
  const recipMax = 1 / this.max;
  this.min = Math.min(recipMin, recipMax);
  this.max = Math.max(recipMin, recipMax);
  return this;
 }

 /**
  * Computes the reciprocal of this interval in place (safe version)
  * @returns This for chaining, set to ZERO if interval contains zero
  *
  * @see {@link reciprocal} - Throws if contains zero
  * @see {@link reciprocalUnchecked} - No validation, for hot paths
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 reciprocalSafe(): this {
  if (this.contains(0)) {
   this.min = 0;
   this.max = 0;
   return this;
  }
  const recipMin = 1 / this.min;
  const recipMax = 1 / this.max;
  this.min = Math.min(recipMin, recipMax);
  this.max = Math.max(recipMin, recipMax);
  return this;
 }

 /**
  * Computes the reciprocal of this interval in place without validation (for hot paths)
  *
  * @remarks
  * **Precondition:** Interval must not contain zero.
  * If interval contains zero, result will contain Infinity/-Infinity or NaN.
  *
  * @returns This for chaining
  *
  * @see {@link reciprocal} - Throws if contains zero
  * @see {@link reciprocalSafe} - Returns ZERO if contains zero
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 reciprocalUnchecked(): this {
  const recipMin = 1 / this.min;
  const recipMax = 1 / this.max;
  this.min = Math.min(recipMin, recipMax);
  this.max = Math.max(recipMin, recipMax);
  return this;
 }

 /* ======================================================================== */
 /* Instance Set Operations                                                  */
 /* ======================================================================== */

 /**
  * Intersects with another interval in place
  *
  * @remarks
  * If there is no overlap between the intervals, this method returns `undefined`
  * and leaves this interval unchanged. Use the static {@link Interval.intersect}
  * method if you need a new interval for the result. Mathematically, a non-overlapping
  * intersection represents the empty set (∅).
  *
  * @param other - Other interval
  * @returns This for chaining, or undefined if no overlap (interval unchanged)
  *
  * @category Set Operations
  * @since 0.7.0
  */
 intersect(other: ReadonlyIntervalLike): this | undefined {
  const newMin = Math.max(this.min, other.min);
  const newMax = Math.min(this.max, other.max);
  if (newMin <= newMax) {
   this.min = newMin;
   this.max = newMax;
   return this;
  }
  return undefined;
 }

 /**
  * Unions with another interval in place
  * @param other - Other interval
  * @returns This for chaining
  *
  * @category Set Operations
  * @since 0.7.0
  */
 union(other: ReadonlyIntervalLike): this {
  this.min = Math.min(this.min, other.min);
  this.max = Math.max(this.max, other.max);
  return this;
 }

 /**
  * Expands this interval symmetrically by a delta
  * @param delta - Amount to expand each side (must be non-negative)
  * @returns This for chaining
  * @throws {RangeError} If delta is negative
  *
  * @category Set Operations
  * @since 0.7.0
  */
 expand(delta: number): this {
  if (delta < 0) {
   throw new RangeError('Interval.expand: delta must be non-negative');
  }
  this.min -= delta;
  this.max += delta;
  return this;
 }

 /**
  * Shrinks this interval symmetrically by a delta
  * If delta exceeds half the width, collapses to the midpoint.
  * @param delta - Amount to shrink each side (must be non-negative)
  * @returns This for chaining
  * @throws {RangeError} If delta is negative
  *
  * @category Set Operations
  * @since 0.7.0
  */
 shrink(delta: number): this {
  if (delta < 0) {
   throw new RangeError('Interval.shrink: delta must be non-negative');
  }
  const newMin = this.min + delta;
  const newMax = this.max - delta;
  if (newMin > newMax) {
   // Robust midpoint formula avoids overflow when min + max > MAX_VALUE
   const mid = this.min + (this.max - this.min) * 0.5;
   this.min = mid;
   this.max = mid;
  } else {
   this.min = newMin;
   this.max = newMax;
  }
  return this;
 }

 /**
  * Expands this interval to include a value
  *
  * @remarks
  * If the value is already within the interval, this is a no-op.
  *
  * @param value - Value to enclose
  * @returns This for chaining
  *
  * @example
  * ```typescript
  * new Interval(2, 5).enclose(8);  // [2, 8]
  * new Interval(2, 5).enclose(3);  // [2, 5] (no change)
  * ```
  *
  * @category Set Operations
  * @since 0.7.0
  */
 enclose(value: number): this {
  this.min = Math.min(this.min, value);
  this.max = Math.max(this.max, value);
  return this;
 }

 /**
  * Returns the gap distance between this interval and another
  *
  * @remarks
  * If the intervals overlap, the distance is zero.
  *
  * @param other - Other interval
  * @returns Non-negative distance (0 if overlapping)
  *
  * @example
  * ```typescript
  * new Interval(0, 3).distanceTo({ min: 5, max: 8 }); // 2
  * new Interval(0, 5).distanceTo({ min: 3, max: 8 }); // 0
  * ```
  *
  * @category Set Operations
  * @since 0.7.0
  */
 distanceTo(other: ReadonlyIntervalLike): number {
  return Interval.distance(this, other);
 }

 /**
  * Exact equality (bit-identical)
  *
  * @remarks
  * Use {@link nearEquals} for comparing results of floating-point operations.
  *
  * @param other - Interval to compare
  * @returns True if exactly identical
  *
  * @category Comparison
  * @since 0.7.0
  */
 exactEquals(other: ReadonlyIntervalLike): boolean {
  return Interval.exactEquals(this, other);
 }

 /**
  * Approximate equality using relative tolerance
  *
  * @remarks
  * Uses relative tolerance: `|a - b| <= epsilon * max(1, |a|, |b|)` per bound.
  *
  * @param other - Interval to compare
  * @param epsilon - Relative tolerance. @defaultValue `EPSILON`
  * @returns True if within scaled epsilon
  *
  * @category Comparison
  * @since 0.7.0
  */
 nearEquals(other: ReadonlyIntervalLike, epsilon: number = EPSILON): boolean {
  return Interval.nearEquals(this, other, epsilon);
 }

 /**
  * Returns true if all bounds are finite
  * @returns True if no NaN or Infinity values
  *
  * @category Comparison
  * @since 0.7.0
  */
 isFinite(): boolean {
  return Interval.isFinite(this);
 }

 /**
  * Tests if this interval is exactly [0, 0]
  * @returns True if both bounds are exactly zero
  *
  * @category Comparison
  * @since 0.7.0
  */
 isZero(): boolean {
  return Interval.isZero(this);
 }

 /**
  * Tests if this interval is near zero
  * @param epsilon - Tolerance (default: EPSILON)
  * @returns True if both bounds are within epsilon of zero
  *
  * @category Comparison
  * @since 0.7.0
  */
 isNearZero(epsilon: number = EPSILON): boolean {
  return Interval.isNearZero(this, epsilon);
 }

 /**
  * Returns true if any bound is NaN
  * @returns True if any NaN value exists
  *
  * @category Comparison
  * @since 0.7.0
  */
 hasNaN(): boolean {
  return Interval.hasNaN(this);
 }

 /**
  * Returns true if any bound is infinite (±Infinity)
  * @returns True if any ±Infinity value exists
  *
  * @category Comparison
  * @since 0.7.0
  */
 hasInfinity(): boolean {
  return Interval.hasInfinity(this);
 }

 /* ======================================================================== */
 /* Instance Interpolation                                                   */
 /* ======================================================================== */

 /**
  * Samples a value within this interval using linear interpolation
  *
  * @remarks
  * This method samples a point WITHIN the interval, unlike {@link lerp}
  * which interpolates BETWEEN two intervals.
  *
  * @param t - Interpolation factor [0, 1], clamped
  * @returns Value within the interval (min when t=0, max when t=1)
  *
  * @example
  * ```typescript
  * const interval = new Interval(0, 100);
  * interval.sample(0);    // 0
  * interval.sample(0.5);  // 50
  * interval.sample(1);    // 100
  * ```
  *
  * @category Interpolation
  * @since 0.7.0
  */
 sample(t: number): number {
  const clamped = saturate(t);
  return lerp(this.min, this.max, clamped);
 }

 /**
  * Linear interpolation towards another interval in place
  *
  * @remarks
  * Interpolates BETWEEN this interval and another interval,
  * consistent with Vector2.lerp, Complex.lerp, etc.
  *
  * @param other - Target interval
  * @param t - Interpolation factor (not clamped)
  * @returns This for chaining
  *
  * @example
  * ```typescript
  * const a = new Interval(0, 10);
  * const b = new Interval(100, 200);
  * a.lerp(b, 0.5); // a is now [50, 105]
  * ```
  *
  * @category Interpolation
  * @since 0.7.0
  */
 lerp(other: ReadonlyIntervalLike, t: number): this {
  this.min = lerp(this.min, other.min, t);
  this.max = lerp(this.max, other.max, t);
  return this;
 }

 /**
  * Linear interpolation with t clamped to [0, 1]
  * @param other - Target interval
  * @param t - Interpolation factor (clamped to [0, 1])
  * @returns This for chaining
  *
  * @category Interpolation
  * @since 0.7.0
  */
 lerpClamped(other: ReadonlyIntervalLike, t: number): this {
  return this.lerp(other, saturate(t));
 }

 /**
  * Smooth interpolation towards another interval using smoothStep easing
  * @param other - Target interval
  * @param t - Interpolation factor (clamped to [0, 1])
  * @returns This for chaining
  *
  * @category Interpolation
  * @since 0.7.0
  */
 smoothStep(other: ReadonlyIntervalLike, t: number): this {
  const smoothT = smoothStep(0, 1, t);
  return this.lerp(other, smoothT);
 }

 /**
  * Returns the inverse lerp (normalized position of value in interval)
  * @param value - Value to find position of
  * @returns Normalized position [0, 1] (or 0 if degenerate)
  *
  * @category Interpolation
  * @since 0.7.0
  */
 inverseLerp(value: number): number {
  const width = this.width();
  if (scalarNearEquals(width, 0)) {
   return 0;
  }
  return divideSafe(value - this.min, width);
 }

 /**
  * Clamps a value to this interval
  * @param value - Value to clamp
  * @returns Clamped value
  *
  * @category Interpolation
  * @since 0.7.0
  */
 clampValue(value: number): number {
  return clamp(value, this.min, this.max);
 }

 /* ======================================================================== */
 /* Instance Accessors                                                       */
 /* ======================================================================== */

 /**
  * Returns the negated interval without modifying this one
  *
  * @returns New negated interval
  *
  * @category Accessor
  * @since 0.7.0
  */
 public get negated(): Interval {
  return Interval.negate(this);
 }

 /**
  * Returns an expanded interval (by EPSILON) without modifying this one
  * @returns New expanded interval
  *
  * @category Accessor
  * @since 0.7.0
  */
 public get expanded(): Interval {
  return new Interval(this.min - EPSILON, this.max + EPSILON);
 }

 /**
  * Returns the reciprocal interval without modifying this one
  *
  * @returns New reciprocal interval
  * @throws {RangeError} If interval contains zero
  *
  * @category Accessor
  * @since 0.7.0
  */
 public get reciprocated(): Interval {
  return Interval.reciprocal(this);
 }

 /**
  * Returns the squared interval without modifying this one
  *
  * @returns New squared interval
  *
  * @category Accessor
  * @since 0.7.0
  */
 public get squared(): Interval {
  return Interval.square(this);
 }

 /* ======================================================================== */
 /* Instance Conversion                                                      */
 /* ======================================================================== */

 /**
  * Writes to array or typed array
  *
  * @param out - Optional destination array. If not provided, returns a new tuple
  * @param offset - Write offset. @defaultValue `0`
  * @returns The output array, or a new tuple if no output was provided
  * @throws {RangeError} If offset is negative or the output array lacks two elements from offset
  *
  * @example
  * ```typescript
  * const i = new Interval(0, 10);
  * const [min, max] = i.toArray();
  *
  * // Write to existing array
  * const arr = new Float32Array(10);
  * i.toArray(arr, 4); // writes at indices 4, 5
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
   return [this.min, this.max];
  }
  if (offset < 0 || offset + 2 > out.length) {
   throw new RangeError(
    `Interval.toArray: offset ${offset} out of bounds for array length ${out.length}`,
   );
  }
  out[offset] = this.min;
  out[offset + 1] = this.max;
  return out;
 }

 /**
  * Converts the interval to a plain object
  * @returns Object with min and max properties
  *
  * @example
  * ```typescript
  * const i = new Interval(0, 10);
  * const obj = i.toObject();
  * // { min: 0, max: 10 }
  * ```
  *
  * @category Conversion
  * @since 0.7.0
  */
 public toObject(): IntervalLike {
  return { min: this.min, max: this.max };
 }

 /**
  * Converts the interval to a JSON-serializable object
  * Called automatically by JSON.stringify().
  * @returns Object suitable for JSON serialization
  *
  * @example
  * ```typescript
  * const i = new Interval(0, 10);
  * const json = JSON.stringify(i);
  * // '{"min":0,"max":10}'
  * ```
  *
  * @category Conversion
  * @since 0.7.0
  */
 public toJSON(): IntervalLike {
  return this.toObject();
 }

 /**
  * Creates a human-readable string representation
  * Uses mathematical interval notation [min, max].
  * @param precision - Number of decimal places (default: 4)
  * @returns Formatted string
  *
  * @example
  * ```typescript
  * const i = new Interval(0, 10);
  * console.log(i.toString());
  * // "[0.0000, 10.0000]"
  * ```
  *
  * @category Conversion
  * @since 0.7.0
  */
 public toString(precision = 4): string {
  return `[${this.min.toFixed(precision)}, ${this.max.toFixed(precision)}]`;
 }

 /**
  * Creates a deep copy of this interval
  * @returns New Interval with identical bounds
  *
  * @example
  * ```typescript
  * const i = new Interval(0, 10);
  * const copy = i.clone();
  * copy.set(5, 15); // Original unchanged
  * ```
  *
  * @category Conversion
  * @since 0.7.0
  */
 clone(): Interval {
  return new Interval(this.min, this.max);
 }

 /**
  * Iterator for array destructuring
  * @returns Iterator yielding min then max
  *
  * @example
  * ```typescript
  * const [min, max] = new Interval(0, 10);
  * ```
  *
  * @category Conversion
  * @since 0.7.0
  */
 *[Symbol.iterator](): IterableIterator<number> {
  yield this.min;
  yield this.max;
 }
}
