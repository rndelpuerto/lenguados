/**
 * @file core/interval.ts
 * @module @lenguados/math2d/core
 * @description Deterministic closed-interval arithmetic helpers.
 */

import { safeDivide, safeSqrt } from '../auxiliary/numeric/safety';
import { clamp, saturate } from '../auxiliary/scalar/arithmetic';
import {
 isNearZero,
 nearEquals as scalarNearEquals,
 relativeEquals,
} from '../auxiliary/scalar/comparison';
import { EPSILON, TAU } from '../auxiliary/scalar/constants';
import { lerp } from '../auxiliary/scalar/interpolation';
import type { IntervalLike, ReadonlyIntervalLike } from '../types';
import { assert, assertNonNegative } from '../validation/assert';

/* ========================================================================== */
/* Type Exports                                                               */
/* ========================================================================== */

/**
 * Readonly view of an {@link Interval} instance.
 * @public
 */
export type ReadonlyInterval = Readonly<Interval>;

/* ========================================================================== */
/* Helper Functions                                                           */
/* ========================================================================== */

/**
 * Permanently freezes an {@link Interval} instance so it can no longer be mutated.
 *
 * @param interval - The Interval object to freeze.
 * @returns The same instance, now typed as ReadonlyInterval.
 *
 * @remarks
 * - The returned object keeps its original reference; no new memory is allocated.
 * - In strict mode any subsequent attempt to modify `min` or `max` throws a TypeError.
 *
 * @example
 * ```typescript
 * const UNIT = freezeInterval(new Interval(0, 1));
 * UNIT.min = 5; // Throws in strict mode
 * ```
 *
 * @category Helpers
 * @since 0.9.0
 */
export function freezeInterval(interval: Interval): ReadonlyInterval {
 return Object.freeze(interval);
}

/* ========================================================================== */
/* Class: Interval                                                            */
/* ========================================================================== */

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
  * Validates interval bounds. Allows ±Infinity but rejects NaN.
  * @param value - Value to validate
  * @param label - Label for error messages
  * @returns The validated value
  * @remarks Infinity is valid for intervals like [0, +∞).
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
  * Zero interval [0, 0].
  * @category Core
  */
 public static readonly ZERO = Object.freeze(new Interval(0, 0)) as ReadonlyInterval;

 /**
  * Unit interval [0, 1].
  * @category Core
  */
 public static readonly UNIT = Object.freeze(new Interval(0, 1)) as ReadonlyInterval;

 /**
  * Symmetric unit interval [-1, 1].
  * @category Core
  */
 public static readonly SYMMETRIC_UNIT = Object.freeze(new Interval(-1, 1)) as ReadonlyInterval;

 /**
  * Positive half-line [0, +∞).
  * @category Core
  */
 public static readonly POSITIVE = Object.freeze(
  new Interval(0, Number.POSITIVE_INFINITY),
 ) as ReadonlyInterval;

 /**
  * Negative half-line (-∞, 0].
  * @category Core
  */
 public static readonly NEGATIVE = Object.freeze(
  new Interval(Number.NEGATIVE_INFINITY, 0),
 ) as ReadonlyInterval;

 /**
  * Full real line (-∞, +∞).
  * @category Core
  */
 public static readonly FULL = Object.freeze(
  new Interval(Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY),
 ) as ReadonlyInterval;

 /**
  * Epsilon interval [-ε, ε].
  * @category Core
  */
 public static readonly EPSILON_INTERVAL = Object.freeze(
  new Interval(-EPSILON, EPSILON),
 ) as ReadonlyInterval;

 /**
  * Percentage interval [0, 100].
  * @category Core
  */
 public static readonly PERCENT = Object.freeze(new Interval(0, 100)) as ReadonlyInterval;

 /**
  * Degrees interval [0, 360].
  * @category Core
  */
 public static readonly DEGREES = Object.freeze(new Interval(0, 360)) as ReadonlyInterval;

 /**
  * Radians interval [0, 2π].
  * @category Core
  */
 public static readonly RADIANS = Object.freeze(new Interval(0, TAU)) as ReadonlyInterval;

 /**
  * Normalized interval [0, 1] (same as UNIT).
  * @category Core
  */
 public static readonly NORMALIZED = Object.freeze(new Interval(0, 1)) as ReadonlyInterval;

 /* ======================================================================== */
 /* Constructor                                                              */
 /* ======================================================================== */

 constructor(min = 0, max = 0) {
  // Initialize with validated values
  const sanitizedMin = Interval.sanitize(min, 'Interval.constructor:min');
  const sanitizedMax = Interval.sanitize(max, 'Interval.constructor:max');
  Interval.assertOrder(sanitizedMin, sanitizedMax, 'Interval.constructor');
  this.min = sanitizedMin;
  this.max = sanitizedMax;
 }

 /* ======================================================================== */
 /* Static Factories                                                         */
 /* ======================================================================== */

 /**
  * Creates an interval from a single value [v, v].
  * @param value - Value for both min and max
  * @param out - Optional output interval
  * @returns Degenerate interval
  *
  * @category Factory
  * @since 0.1.0
  */
 public static fromValue(value: number, out?: Interval): Interval {
  const sanitized = this.sanitize(value, 'Interval.fromValue:value');
  return this.ensureOut(out).set(sanitized, sanitized);
 }

 /**
  * Creates an interval from center and radius [center - radius, center + radius].
  * @param center - Center value
  * @param radius - Half-width (must be non-negative)
  * @param out - Optional output interval
  * @returns Symmetric interval around center
  *
  * @category Factory
  * @since 0.1.0
  */
 public static fromCenterRadius(center: number, radius: number, out?: Interval): Interval {
  const sanitizedCenter = this.sanitize(center, 'Interval.fromCenterRadius:center');
  const sanitizedRadius = this.sanitize(radius, 'Interval.fromCenterRadius:radius');
  // Development assertion (Box2D pattern: catch errors early)
  assertNonNegative(sanitizedRadius, 'Interval.fromCenterRadius:radius');
  // Production throw (always enforced)
  if (sanitizedRadius < 0) {
   throw new RangeError('Interval.fromCenterRadius: radius must be non-negative');
  }
  return this.ensureOut(out).set(
   sanitizedCenter - sanitizedRadius,
   sanitizedCenter + sanitizedRadius,
  );
 }

 /**
  * Creates an interval from an array [min, max].
  * @param array - Source array
  * @param offset - Index offset (default: 0)
  * @param out - Optional output interval
  * @returns Interval from array
  *
  * @category Factory
  * @since 0.1.0
  */
 public static fromArray(array: ArrayLike<number>, offset = 0, out?: Interval): Interval {
  // Development assertions
  assertNonNegative(offset, 'Interval.fromArray:offset');
  assert(array.length >= 2, 'Interval.fromArray: array must have at least 2 elements');
  // Production bounds check (always enforced)
  if (offset < 0 || offset + 1 >= array.length) {
   throw new RangeError(
    `Interval.fromArray: offset ${offset} is out of bounds for array of length ${array.length}`,
   );
  }
  const minValue = this.sanitize(array[offset]!, 'Interval.fromArray:min');
  const maxValue = this.sanitize(array[offset + 1]!, 'Interval.fromArray:max');
  return this.ensureOut(out).set(minValue, maxValue);
 }

 /**
  * Creates an interval from a plain object.
  * @param object - Object with min and max properties
  * @param out - Optional output interval
  * @returns Interval from object
  *
  * @category Factory
  * @since 0.1.0
  */
 public static fromObject(object: IntervalLike, out?: Interval): Interval {
  const minValue = this.sanitize(object.min, 'Interval.fromObject:min');
  const maxValue = this.sanitize(object.max, 'Interval.fromObject:max');
  return this.ensureOut(out).set(minValue, maxValue);
 }

 /**
  * Creates a deep copy of an interval.
  * @param source - Interval to clone
  * @param out - Optional output interval
  * @returns A new Interval with identical values
  *
  * @category Factory
  * @since 0.9.0
  */
 public static clone(source: ReadonlyIntervalLike, out?: Interval): Interval {
  return this.ensureOut(out).set(source.min, source.max);
 }

 /**
  * Copies values from source into destination (alloc-free).
  * @param source - Source interval
  * @param destination - Target interval to receive the copy
  * @returns The destination interval
  *
  * @category Factory
  * @since 0.9.0
  */
 public static copy(source: ReadonlyIntervalLike, destination: Interval): Interval {
  return destination.set(source.min, source.max);
 }

 /* ======================================================================== */
 /* Static Arithmetic                                                        */
 /* ======================================================================== */

 /**
  * Adds two intervals.
  * @param a - First interval
  * @param b - Second interval
  * @param out - Optional output interval
  * @returns Sum interval
  *
  * @category Arithmetic
  * @since 0.1.0
  */
 public static add(a: ReadonlyIntervalLike, b: ReadonlyIntervalLike, out?: Interval): Interval {
  return Interval.ensureOut(out).set(a.min + b.min, a.max + b.max);
 }

 /**
  * Subtracts two intervals.
  * @param a - First interval
  * @param b - Second interval
  * @param out - Optional output interval
  * @returns Difference interval
  *
  * @category Arithmetic
  * @since 0.1.0
  */
 public static subtract(
  a: ReadonlyIntervalLike,
  b: ReadonlyIntervalLike,
  out?: Interval,
 ): Interval {
  return Interval.ensureOut(out).set(a.min - b.max, a.max - b.min);
 }

 /**
  * Multiplies two intervals.
  * @param a - First interval
  * @param b - Second interval
  * @param out - Optional output interval
  * @returns Product interval
  *
  * @category Arithmetic
  * @since 0.1.0
  */
 public static multiply(
  a: ReadonlyIntervalLike,
  b: ReadonlyIntervalLike,
  out?: Interval,
 ): Interval {
  const products = [a.min * b.min, a.min * b.max, a.max * b.min, a.max * b.max];
  return Interval.ensureOut(out).set(
   Math.min(products[0]!, products[1]!, products[2]!, products[3]!),
   Math.max(products[0]!, products[1]!, products[2]!, products[3]!),
  );
 }

 /**
  * Scales an interval.
  * @param interval - Interval to scale
  * @param scalar - Scale factor
  * @param out - Optional output interval
  * @returns Scaled interval
  *
  * @category Arithmetic
  * @since 0.1.0
  */
 public static scale(interval: ReadonlyIntervalLike, scalar: number, out?: Interval): Interval {
  if (scalar >= 0) {
   return Interval.ensureOut(out).set(interval.min * scalar, interval.max * scalar);
  }
  return Interval.ensureOut(out).set(interval.max * scalar, interval.min * scalar);
 }

 /**
  * Divides an interval by a scalar.
  * @param interval - Interval to divide
  * @param scalar - Scalar to divide by (must not be zero)
  * @param out - Optional output interval
  * @returns Divided interval
  *
  * @throws {RangeError} If scalar is zero
  *
  * @category Arithmetic
  * @since 0.9.0
  */
 public static divide(interval: ReadonlyIntervalLike, scalar: number, out?: Interval): Interval {
  if (isNearZero(scalar)) {
   throw new RangeError('Interval.divide: cannot divide by zero');
  }
  return Interval.scale(interval, 1 / scalar, out);
 }

 /**
  * Negates an interval.
  * @param interval - Interval to negate
  * @param out - Optional output interval
  * @returns Negated interval
  *
  * @category Arithmetic
  * @since 0.1.0
  */
 public static negate(interval: ReadonlyIntervalLike, out?: Interval): Interval {
  return Interval.ensureOut(out).set(-interval.max, -interval.min);
 }

 /**
  * Returns the square of an interval.
  * @param interval - Interval to square
  * @param out - Optional output interval
  * @returns Squared interval
  *
  * @category Arithmetic
  * @since 0.1.0
  */
 public static square(interval: ReadonlyIntervalLike, out?: Interval): Interval {
  if (interval.min >= 0) {
   return Interval.ensureOut(out).set(interval.min * interval.min, interval.max * interval.max);
  }
  if (interval.max <= 0) {
   return Interval.ensureOut(out).set(interval.max * interval.max, interval.min * interval.min);
  }
  const extreme = Math.max(interval.min * interval.min, interval.max * interval.max);
  return Interval.ensureOut(out).set(0, extreme);
 }

 /**
  * Returns the square root of an interval.
  * @param interval - Interval (must be non-negative)
  * @param out - Optional output interval
  * @returns Square root interval
  * @throws {RangeError} If interval contains negative values
  *
  * @category Arithmetic
  * @since 0.1.0
  */
 public static sqrt(interval: ReadonlyIntervalLike, out?: Interval): Interval {
  if (interval.min < 0) {
   throw new RangeError('Interval.sqrt: interval contains negative values');
  }
  return Interval.ensureOut(out).set(safeSqrt(interval.min), safeSqrt(interval.max));
 }

 /**
  * Returns the reciprocal of an interval.
  * @param interval - Interval (must not contain zero)
  * @param out - Optional output interval
  * @returns Reciprocal interval
  * @throws {RangeError} If interval contains zero
  *
  * @category Arithmetic
  * @since 0.1.0
  */
 public static reciprocal(interval: ReadonlyIntervalLike, out?: Interval): Interval {
  if (interval.min <= 0 && interval.max >= 0) {
   throw new RangeError('Interval.reciprocal: interval contains zero');
  }
  const recipMin = safeDivide(1, interval.min);
  const recipMax = safeDivide(1, interval.max);
  return Interval.ensureOut(out).set(Math.min(recipMin, recipMax), Math.max(recipMin, recipMax));
 }

 /* ======================================================================== */
 /* Static Interpolation                                                     */
 /* ======================================================================== */

 /**
  * Linear interpolation between two intervals.
  * @param a - Start interval
  * @param b - End interval
  * @param t - Interpolation factor [0, 1], clamped
  * @param out - Optional output interval
  * @returns Interpolated interval
  *
  * @category Interpolation
  * @since 0.1.0
  */
 public static lerp(
  a: ReadonlyIntervalLike,
  b: ReadonlyIntervalLike,
  t: number,
  out?: Interval,
 ): Interval {
  return Interval.ensureOut(out).set(lerp(a.min, b.min, t), lerp(a.max, b.max, t));
 }

 /**
  * Linear interpolation with t clamped to [0, 1].
  * @param a - Start interval
  * @param b - End interval
  * @param t - Interpolation factor (clamped to [0, 1])
  * @param out - Optional output interval
  * @returns Interpolated interval
  *
  * @category Interpolation
  * @since 0.9.0
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
  * Finds where a value falls within an interval, returning normalized position.
  *
  * @param interval - Reference interval.
  * @param value - Value to find normalized position of.
  * @returns Normalized position [0, 1] for values in [min, max], or 0 if interval is degenerate.
  *
  * @remarks
  * This is the inverse of lerp: `Interval.inverseLerp(interval, Interval.lerp(interval, t)) ≈ t`
  *
  * @example
  * ```typescript
  * const interval = new Interval(0, 100);
  * Interval.inverseLerp(interval, 25);  // 0.25
  * Interval.inverseLerp(interval, 75);  // 0.75
  * Interval.inverseLerp(interval, 150); // 1.5 (extrapolated)
  * ```
  *
  * @category Interpolation
  * @since 0.11.0
  */
 public static inverseLerp(interval: ReadonlyIntervalLike, value: number): number {
  const width = interval.max - interval.min;
  if (scalarNearEquals(width, 0)) {
   return 0;
  }
  return safeDivide(value - interval.min, width);
 }

 /**
  * Clamps a value to the interval bounds.
  *
  * @param interval - Reference interval.
  * @param value - Value to clamp.
  * @returns Value clamped to [min, max].
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
  * @since 0.11.0
  */
 public static clampValue(interval: ReadonlyIntervalLike, value: number): number {
  return clamp(value, interval.min, interval.max);
 }

 /* ======================================================================== */
 /* Static Comparison & Validation                                           */
 /* ======================================================================== */

 /**
  * Exact equality (bit-identical).
  * @param a - First interval
  * @param b - Second interval
  * @returns True if exactly identical
  *
  * @remarks
  * Use {@link nearEquals} for comparing results of floating-point operations.
  *
  * @category Comparison
  * @since 0.1.0
  */
 public static exactEquals(a: ReadonlyIntervalLike, b: ReadonlyIntervalLike): boolean {
  return a.min === b.min && a.max === b.max;
 }

 /**
  * Approximate equality using relative tolerance.
  * @param a - First interval
  * @param b - Second interval
  * @param epsilon - Relative tolerance. @defaultValue `EPSILON`
  * @returns True if within scaled epsilon
  *
  * @remarks
  * Uses relative tolerance: `|a - b| <= epsilon * max(1, |a|, |b|)` per bound.
  *
  * @category Comparison
  * @since 0.9.0
  */
 public static nearEquals(
  a: ReadonlyIntervalLike,
  b: ReadonlyIntervalLike,
  epsilon: number = EPSILON,
 ): boolean {
  return relativeEquals(a.min, b.min, epsilon) && relativeEquals(a.max, b.max, epsilon);
 }

 /**
  * Tests if an interval is degenerate (zero width).
  * @param interval - Interval to test
  * @param epsilon - Relative tolerance (default: EPSILON)
  * @returns True if degenerate
  *
  * @remarks
  * Uses relative tolerance for comparing min and max bounds.
  *
  * @category Comparison
  * @since 0.1.0
  */
 public static isDegenerate(interval: ReadonlyIntervalLike, epsilon: number = EPSILON): boolean {
  return relativeEquals(interval.min, interval.max, epsilon);
 }

 /**
  * Tests if two intervals overlap.
  * @param a - First interval
  * @param b - Second interval
  * @returns True if intervals overlap
  *
  * @category Comparison
  * @since 0.1.0
  */
 public static overlaps(a: ReadonlyIntervalLike, b: ReadonlyIntervalLike): boolean {
  return a.min <= b.max && a.max >= b.min;
 }

 /**
  * Tests if an interval contains a value.
  * @param interval - Interval
  * @param value - Value to test
  * @returns True if value is within interval
  *
  * @category Comparison
  * @since 0.1.0
  */
 public static contains(interval: ReadonlyIntervalLike, value: number): boolean {
  return value >= interval.min && value <= interval.max;
 }

 /**
  * Strict containment check (exclusive bounds).
  * @param interval - Interval to test against
  * @param value - Value to test
  * @returns True if value is strictly inside the interval (min < value < max)
  *
  * @remarks
  * Unlike {@link contains}, this excludes the boundary values.
  *
  * @example
  * ```typescript
  * Interval.strictlyContains({ min: 0, max: 10 }, 5);   // true
  * Interval.strictlyContains({ min: 0, max: 10 }, 0);   // false (boundary)
  * Interval.strictlyContains({ min: 0, max: 10 }, 10);  // false (boundary)
  * ```
  *
  * @category Comparison
  * @since 0.11.0
  */
 public static strictlyContains(interval: ReadonlyIntervalLike, value: number): boolean {
  return value > interval.min && value < interval.max;
 }

 /**
  * Tests if one interval is a subset of another.
  * @param subset - Interval that should be contained
  * @param superset - Interval that should contain the subset
  * @returns True if subset is entirely within superset
  *
  * @remarks
  * An interval A is a subset of B if A.min >= B.min AND A.max <= B.max.
  *
  * @example
  * ```typescript
  * Interval.isSubsetOf({ min: 2, max: 8 }, { min: 0, max: 10 });  // true
  * Interval.isSubsetOf({ min: 0, max: 10 }, { min: 2, max: 8 });  // false
  * ```
  *
  * @category Comparison
  * @since 0.11.0
  */
 public static isSubsetOf(subset: ReadonlyIntervalLike, superset: ReadonlyIntervalLike): boolean {
  return subset.min >= superset.min && subset.max <= superset.max;
 }

 /**
  * Tests if both bounds are finite numbers.
  * @param interval - Interval to test
  * @returns True if both bounds are finite
  *
  * @category Comparison
  * @since 0.9.0
  */
 public static isFinite(interval: ReadonlyIntervalLike): boolean {
  return Number.isFinite(interval.min) && Number.isFinite(interval.max);
 }

 /**
  * Tests if any bound is NaN.
  * @param interval - Interval to test
  * @returns True if any bound is NaN
  *
  * @category Comparison
  * @since 0.9.0
  */
 public static hasNaN(interval: ReadonlyIntervalLike): boolean {
  return Number.isNaN(interval.min) || Number.isNaN(interval.max);
 }

 /* ======================================================================== */
 /* Static Computed Values                                                   */
 /* ======================================================================== */

 /**
  * Returns the width of an interval.
  * @param interval - Interval
  * @returns Width (max - min)
  *
  * @category Computed
  * @since 0.1.0
  */
 public static width(interval: ReadonlyIntervalLike): number {
  return interval.max - interval.min;
 }

 /**
  * Returns the center of an interval.
  * @param interval - Interval
  * @returns Center ((min + max) / 2)
  *
  * @category Computed
  * @since 0.1.0
  */
 public static center(interval: ReadonlyIntervalLike): number {
  return (interval.min + interval.max) * 0.5;
 }

 /**
  * Returns the radius (half-width) of an interval.
  * @param interval - Interval
  * @returns Radius ((max - min) / 2)
  *
  * @category Computed
  * @since 0.1.0
  */
 public static radius(interval: ReadonlyIntervalLike): number {
  return (interval.max - interval.min) * 0.5;
 }

 /* ======================================================================== */
 /* Static Set Operations                                                    */
 /* ======================================================================== */

 /**
  * Computes the convex hull (smallest enclosing interval) of multiple values/intervals.
  * @param first - Array of values/intervals, or first value
  * @param second - Optional second value or output parameter (when first is array)
  * @param rest - Additional values (when using varargs)
  * @returns Interval enclosing all inputs
  *
  * @category Set Operations
  * @since 0.1.0
  */
 public static hull(
  first: ReadonlyArray<number | ReadonlyIntervalLike> | number | ReadonlyIntervalLike,
  second?: number | ReadonlyIntervalLike | Interval,
  ...rest: Array<number | ReadonlyIntervalLike>
 ): Interval {
  if (Array.isArray(first)) {
   return Interval.computeHull(first, second as Interval | undefined);
  }
  const values = [first, second as number | ReadonlyIntervalLike, ...rest].filter(
   (value): value is number | ReadonlyIntervalLike => value !== undefined,
  );
  return Interval.computeHull(values);
 }

 private static computeHull(
  values: ReadonlyArray<number | ReadonlyIntervalLike>,
  out?: Interval,
 ): Interval {
  if (values.length === 0) {
   throw new RangeError('Interval.hull: values array cannot be empty');
  }
  let minValue = Number.POSITIVE_INFINITY;
  let maxValue = Number.NEGATIVE_INFINITY;

  for (const entry of values) {
   if (typeof entry === 'number') {
    const sanitized = this.sanitize(entry, 'Interval.hull:value');
    minValue = Math.min(minValue, sanitized);
    maxValue = Math.max(maxValue, sanitized);
   } else {
    const intervalMin = this.sanitize(entry.min, 'Interval.hull:min');
    const intervalMax = this.sanitize(entry.max, 'Interval.hull:max');
    minValue = Math.min(minValue, intervalMin);
    maxValue = Math.max(maxValue, intervalMax);
   }
  }

  return this.ensureOut(out).set(minValue, maxValue);
 }

 /**
  * Returns the union of two intervals.
  * @param a - First interval
  * @param b - Second interval
  * @param out - Optional output interval
  * @returns Union interval (smallest interval containing both)
  *
  * @category Set Operations
  * @since 0.1.0
  */
 public static union(a: ReadonlyIntervalLike, b: ReadonlyIntervalLike, out?: Interval): Interval {
  return Interval.ensureOut(out).set(Math.min(a.min, b.min), Math.max(a.max, b.max));
 }

 /**
  * Returns the intersection of two intervals.
  * @param a - First interval
  * @param b - Second interval
  * @param out - Optional output interval
  * @returns Intersection interval or undefined if no overlap
  *
  * @remarks
  * If the intervals do not overlap, returns `undefined` to represent the
  * empty set (∅). The `out` parameter is not modified in this case.
  *
  * @category Set Operations
  * @since 0.1.0
  */
 public static intersect(
  a: ReadonlyIntervalLike,
  b: ReadonlyIntervalLike,
  out?: Interval,
 ): Interval | undefined {
  const newMin = Math.max(a.min, b.min);
  const newMax = Math.min(a.max, b.max);
  if (newMin <= newMax) {
   return Interval.ensureOut(out).set(newMin, newMax);
  }
  return undefined;
 }

 /* ======================================================================== */
 /* Instance Basic Mutators                                                  */
 /* ======================================================================== */

 /**
  * Sets the min and max bounds.
  * @param minValue - Minimum bound
  * @param maxValue - Maximum bound
  * @returns This for chaining
  * @throws {RangeError} If min > max
  *
  * @category Mutator
  * @since 0.1.0
  */
 set(minValue: number, maxValue: number): this {
  const sanitizedMin = Interval.sanitize(minValue, 'Interval.set:min');
  const sanitizedMax = Interval.sanitize(maxValue, 'Interval.set:max');
  Interval.assertOrder(sanitizedMin, sanitizedMax, 'Interval.set');
  this.min = sanitizedMin;
  this.max = sanitizedMax;
  return this;
 }

 /**
  * Copies values from another interval.
  * @param other - Source interval
  * @returns This for chaining
  *
  * @category Mutator
  * @since 0.1.0
  */
 copy(other: ReadonlyInterval): this {
  this.min = other.min;
  this.max = other.max;
  return this;
 }

 /**
  * Resets this interval to zero [0, 0].
  * @returns This for chaining
  *
  * @category Mutator
  * @since 0.9.0
  */
 zero(): this {
  this.min = 0;
  this.max = 0;
  return this;
 }

 /* ======================================================================== */
 /* Instance Computed Values                                                 */
 /* ======================================================================== */

 /**
  * Returns the width of this interval.
  * @returns Width (max - min)
  *
  * @category Computed
  * @since 0.1.0
  */
 width(): number {
  return this.max - this.min;
 }

 /**
  * Returns the center of this interval.
  * @returns Center ((min + max) / 2)
  *
  * @category Computed
  * @since 0.1.0
  */
 center(): number {
  return (this.min + this.max) * 0.5;
 }

 /**
  * Returns the radius (half-width) of this interval.
  * @returns Radius ((max - min) / 2)
  *
  * @category Computed
  * @since 0.1.0
  */
 radius(): number {
  return (this.max - this.min) * 0.5;
 }

 /* ======================================================================== */
 /* Instance Comparison                                                      */
 /* ======================================================================== */

 /**
  * Tests if this interval is degenerate (zero width).
  * @param epsilon - Relative tolerance (default: EPSILON)
  * @returns True if degenerate
  *
  * @remarks
  * Uses relative tolerance for comparing min and max bounds.
  *
  * @category Comparison
  * @since 0.1.0
  */
 isDegenerate(epsilon: number = EPSILON): boolean {
  return relativeEquals(this.min, this.max, epsilon);
 }

 /**
  * Tests if this interval contains a value.
  * @param value - Value to test
  * @returns True if value is within interval
  *
  * @category Comparison
  * @since 0.1.0
  */
 contains(value: number): boolean {
  return value >= this.min && value <= this.max;
 }

 /**
  * Tests if this interval strictly contains a value (exclusive bounds).
  * @param value - Value to test
  * @returns True if value is strictly within interval
  *
  * @category Comparison
  * @since 0.1.0
  */
 strictlyContains(value: number): boolean {
  return value > this.min && value < this.max;
 }

 /**
  * Tests if this interval overlaps another.
  * @param other - Other interval
  * @returns True if intervals overlap
  *
  * @category Comparison
  * @since 0.1.0
  */
 overlaps(other: ReadonlyInterval): boolean {
  return this.min <= other.max && this.max >= other.min;
 }

 /**
  * Tests if this interval is a subset of another.
  * @param other - Other interval
  * @returns True if this is contained in other
  *
  * @category Comparison
  * @since 0.1.0
  */
 isSubsetOf(other: ReadonlyInterval): boolean {
  return this.min >= other.min && this.max <= other.max;
 }

 /* ======================================================================== */
 /* Instance Arithmetic                                                      */
 /* ======================================================================== */

 /**
  * Adds another interval to this one in place.
  * @param other - Interval to add
  * @returns This for chaining
  *
  * @category Arithmetic
  * @since 0.1.0
  */
 add(other: ReadonlyInterval): this {
  this.min += other.min;
  this.max += other.max;
  return this;
 }

 /**
  * Subtracts another interval from this one in place.
  * @param other - Interval to subtract
  * @returns This for chaining
  *
  * @category Arithmetic
  * @since 0.1.0
  */
 subtract(other: ReadonlyInterval): this {
  const newMin = this.min - other.max;
  const newMax = this.max - other.min;
  this.min = newMin;
  this.max = newMax;
  return this;
 }

 /**
  * Multiplies with another interval in place.
  * @param other - Interval to multiply by
  * @returns This for chaining
  *
  * @category Arithmetic
  * @since 0.1.0
  */
 multiply(other: ReadonlyInterval): this {
  const products = [
   this.min * other.min,
   this.min * other.max,
   this.max * other.min,
   this.max * other.max,
  ];
  this.min = Math.min(products[0]!, products[1]!, products[2]!, products[3]!);
  this.max = Math.max(products[0]!, products[1]!, products[2]!, products[3]!);
  return this;
 }

 /**
  * Divides this interval by another in place.
  * @param other - Interval to divide by (must not contain zero)
  * @returns This for chaining
  * @throws {RangeError} If divisor interval contains zero
  *
  * @category Arithmetic
  * @since 0.1.0
  */
 divide(other: ReadonlyInterval): this {
  if (other.contains(0)) {
   throw new RangeError('Interval.divide: divisor interval contains zero');
  }
  const quotients = [
   safeDivide(this.min, other.min),
   safeDivide(this.min, other.max),
   safeDivide(this.max, other.min),
   safeDivide(this.max, other.max),
  ];
  this.min = Math.min(quotients[0]!, quotients[1]!, quotients[2]!, quotients[3]!);
  this.max = Math.max(quotients[0]!, quotients[1]!, quotients[2]!, quotients[3]!);
  return this;
 }

 /**
  * Scales this interval by a scalar in place.
  * @param scalar - Scale factor
  * @returns This for chaining
  *
  * @category Arithmetic
  * @since 0.1.0
  */
 scale(scalar: number): this {
  const sanitizedScalar = Interval.sanitize(scalar, 'Interval.scale:scalar');
  if (sanitizedScalar >= 0) {
   this.min *= sanitizedScalar;
   this.max *= sanitizedScalar;
  } else {
   const newMin = this.max * sanitizedScalar;
   const newMax = this.min * sanitizedScalar;
   this.min = newMin;
   this.max = newMax;
  }
  return this;
 }

 /**
  * Negates this interval in place.
  * @returns This for chaining
  *
  * @category Arithmetic
  * @since 0.1.0
  */
 negate(): this {
  const newMin = -this.max;
  const newMax = -this.min;
  this.min = newMin;
  this.max = newMax;
  return this;
 }

 /**
  * Squares this interval in place.
  * @returns This for chaining
  *
  * @category Arithmetic
  * @since 0.1.0
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
  * Computes the square root of this interval in place.
  * @returns This for chaining
  * @throws {RangeError} If interval contains negative values
  *
  * @category Arithmetic
  * @since 0.1.0
  */
 sqrt(): this {
  if (this.min < 0) {
   throw new RangeError('Interval.sqrt: interval contains negative values');
  }
  this.min = safeSqrt(this.min);
  this.max = safeSqrt(this.max);
  return this;
 }

 /**
  * Computes the reciprocal of this interval in place.
  * @returns This for chaining
  * @throws {RangeError} If interval contains zero
  *
  * @category Arithmetic
  * @since 0.1.0
  */
 reciprocal(): this {
  if (this.contains(0)) {
   throw new RangeError('Interval.reciprocal: interval contains zero');
  }
  const recipMin = safeDivide(1, this.min);
  const recipMax = safeDivide(1, this.max);
  this.min = Math.min(recipMin, recipMax);
  this.max = Math.max(recipMin, recipMax);
  return this;
 }

 /* ======================================================================== */
 /* Instance Set Operations                                                  */
 /* ======================================================================== */

 /**
  * Intersects with another interval in place.
  * @param other - Other interval
  * @returns This for chaining, or undefined if no overlap (interval unchanged)
  *
  * @remarks
  * If there is no overlap between the intervals, this method returns `undefined`
  * and leaves this interval unchanged. Use the static {@link Interval.intersect}
  * method if you need a new interval for the result. Mathematically, a non-overlapping
  * intersection represents the empty set (∅).
  *
  * @category Set Operations
  * @since 0.1.0
  */
 intersect(other: ReadonlyInterval): this | undefined {
  const newMin = Math.max(this.min, other.min);
  const newMax = Math.max(newMin, Math.min(this.max, other.max));
  if (newMin <= newMax) {
   this.min = newMin;
   this.max = newMax;
   return this;
  }
  return undefined;
 }

 /**
  * Unions with another interval in place.
  * @param other - Other interval
  * @returns This for chaining
  *
  * @category Set Operations
  * @since 0.1.0
  */
 union(other: ReadonlyInterval): this {
  this.min = Math.min(this.min, other.min);
  this.max = Math.max(this.max, other.max);
  return this;
 }

 /**
  * Exact equality (bit-identical).
  * @param other - Interval to compare
  * @returns True if exactly identical
  *
  * @remarks
  * Use {@link nearEquals} for comparing results of floating-point operations.
  *
  * @category Comparison
  * @since 0.1.0
  */
 exactEquals(other: ReadonlyInterval): boolean {
  return Interval.exactEquals(this, other);
 }

 /**
  * Approximate equality using relative tolerance.
  * @param other - Interval to compare
  * @param epsilon - Relative tolerance. @defaultValue `EPSILON`
  * @returns True if within scaled epsilon
  *
  * @remarks
  * Uses relative tolerance: `|a - b| <= epsilon * max(1, |a|, |b|)` per bound.
  *
  * @category Comparison
  * @since 0.9.0
  */
 nearEquals(other: ReadonlyInterval, epsilon: number = EPSILON): boolean {
  return Interval.nearEquals(this, other, epsilon);
 }

 /**
  * Returns true if all bounds are finite.
  * @returns True if no NaN or Infinity values
  *
  * @category Validation
  * @since 0.9.0
  */
 isFinite(): boolean {
  return Interval.isFinite(this);
 }

 /**
  * Returns true if any bound is NaN.
  * @returns True if any NaN value exists
  *
  * @category Validation
  * @since 0.9.0
  */
 hasNaN(): boolean {
  return Interval.hasNaN(this);
 }

 /* ======================================================================== */
 /* Instance Interpolation                                                   */
 /* ======================================================================== */

 /**
  * Linearly interpolates within this interval.
  * @param t - Interpolation factor [0, 1], clamped
  * @returns Value within the interval
  *
  * @category Interpolation
  * @since 0.1.0
  */
 lerp(t: number): number {
  const clamped = saturate(t);
  return lerp(this.min, this.max, clamped);
 }

 /**
  * Returns the inverse lerp (normalized position of value in interval).
  * @param value - Value to find position of
  * @returns Normalized position [0, 1] (or 0 if degenerate)
  *
  * @category Interpolation
  * @since 0.1.0
  */
 inverseLerp(value: number): number {
  const width = this.width();
  if (scalarNearEquals(width, 0)) {
   return 0;
  }
  return safeDivide(value - this.min, width);
 }

 /**
  * Clamps a value to this interval.
  * @param value - Value to clamp
  * @returns Clamped value
  *
  * @category Interpolation
  * @since 0.1.0
  */
 clampValue(value: number): number {
  return clamp(value, this.min, this.max);
 }

 /**
  * Interpolates between two intervals (not within a single interval).
  * @param other - Target interval
  * @param t - Interpolation factor [0, 1], clamped
  * @param out - Optional output interval
  * @returns Interpolated interval
  *
  * @category Interpolation
  * @since 0.1.0
  */
 lerpInterval(other: ReadonlyInterval, t: number, out?: Interval): Interval {
  return Interval.lerp(this, other, t, out);
 }

 /* ======================================================================== */
 /* Instance Getters (Derived)                                               */
 /* ======================================================================== */

 /**
  * Returns the negated interval without modifying this one.
  * @returns New negated interval
  *
  * @category Computed
  * @since 0.1.0
  */
 public get negated(): Interval {
  return new Interval(-this.max, -this.min);
 }

 /**
  * Returns an expanded interval (by EPSILON) without modifying this one.
  * @returns New expanded interval
  *
  * @category Computed
  * @since 0.1.0
  */
 public get expanded(): Interval {
  return new Interval(this.min - EPSILON, this.max + EPSILON);
 }

 /**
  * Returns the reciprocal interval without modifying this one.
  * @returns New reciprocal interval (or throws if contains zero)
  *
  * @category Computed
  * @since 0.1.0
  */
 public get reciprocated(): Interval {
  if (this.contains(0)) {
   throw new RangeError('Interval.reciprocated: interval contains zero');
  }
  const recipMin = safeDivide(1, this.min);
  const recipMax = safeDivide(1, this.max);
  return new Interval(Math.min(recipMin, recipMax), Math.max(recipMin, recipMax));
 }

 /**
  * Returns the squared interval without modifying this one.
  * @returns New squared interval
  *
  * @category Computed
  * @since 0.1.0
  */
 public get squared(): Interval {
  if (this.min >= 0) {
   return new Interval(this.min * this.min, this.max * this.max);
  }
  if (this.max <= 0) {
   return new Interval(this.max * this.max, this.min * this.min);
  }
  const extreme = Math.max(this.min * this.min, this.max * this.max);
  return new Interval(0, extreme);
 }

 /* ======================================================================== */
 /* Instance Conversion                                                      */
 /* ======================================================================== */

 /**
  * Converts the interval to a tuple [min, max].
  * @returns Tuple with min and max values
  *
  * @example
  * ```typescript
  * const i = new Interval(0, 10);
  * const [min, max] = i.toArray();
  * ```
  *
  * @category Serialization
  * @since 0.1.0
  */
 toArray(): [number, number] {
  return [this.min, this.max];
 }

 /**
  * Converts the interval to a plain object.
  * @returns Object with min and max properties
  *
  * @example
  * ```typescript
  * const i = new Interval(0, 10);
  * const obj = i.toObject();
  * // { min: 0, max: 10 }
  * ```
  *
  * @category Serialization
  * @since 0.1.0
  */
 toObject(): IntervalLike {
  return { min: this.min, max: this.max };
 }

 /**
  * Converts the interval to a JSON-serializable object.
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
  * @category Serialization
  * @since 0.1.0
  */
 toJSON(): IntervalLike {
  return this.toObject();
 }

 /**
  * Creates a human-readable string representation.
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
  * @category Serialization
  * @since 0.1.0
  */
 toString(precision = 4): string {
  return `[${this.min.toFixed(precision)}, ${this.max.toFixed(precision)}]`;
 }

 /**
  * Creates a deep copy of this interval.
  * @returns New Interval with identical bounds
  *
  * @example
  * ```typescript
  * const i = new Interval(0, 10);
  * const copy = i.clone();
  * copy.set(5, 15); // Original unchanged
  * ```
  *
  * @category Serialization
  * @since 0.1.0
  */
 clone(): Interval {
  return new Interval(this.min, this.max);
 }

 /**
  * Iterator for array destructuring.
  * @returns Iterator yielding min then max.
  *
  * @example
  * ```typescript
  * const [min, max] = new Interval(0, 10);
  * ```
  *
  * @category Conversion
  * @since 0.9.0
  */
 *[Symbol.iterator](): IterableIterator<number> {
  yield this.min;
  yield this.max;
 }
}
