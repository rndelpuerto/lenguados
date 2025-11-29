/**
 * @file core/interval.ts
 * @module @lenguados/math2d/core
 * @description Deterministic closed-interval arithmetic helpers.
 */

import { safeDivide, safeSqrt } from '../auxiliary/numeric/safety';
import { clamp, saturate } from '../auxiliary/scalar/arithmetic';
import { nearEquals } from '../auxiliary/scalar/comparison';
import { EPSILON, TAU } from '../auxiliary/scalar/constants';
import { lerp } from '../auxiliary/scalar/interpolation';
import type { IntervalLike, ReadonlyIntervalLike } from '../types';
import { NumericalValidator } from '../validation/numerical-validator';

export type ReadonlyInterval = Readonly<Interval>;

export class Interval implements IntervalLike {
 public min: number;
 public max: number;

 private static ensureOut(out?: Interval): Interval {
  return out ?? new Interval();
 }

 private static sanitize(value: number, label: string): number {
  return NumericalValidator.validateFinite(value, label);
 }

 private static assertOrder(minValue: number, maxValue: number, label = 'Interval'): void {
  if (minValue > maxValue) {
   throw new RangeError(`${label}: min (${minValue}) must be <= max (${maxValue})`);
  }
 }

 /** Zero interval [0, 0]. */
 static readonly ZERO = Object.freeze(new Interval(0, 0)) as ReadonlyInterval;

 /** Unit interval [0, 1]. */
 static readonly UNIT = Object.freeze(new Interval(0, 1)) as ReadonlyInterval;

 /** Symmetric unit interval [-1, 1]. */
 static readonly SYMMETRIC_UNIT = Object.freeze(new Interval(-1, 1)) as ReadonlyInterval;

 /** Positive half-line [0, +∞). */
 static readonly POSITIVE = Object.freeze(
  new Interval(0, Number.POSITIVE_INFINITY),
 ) as ReadonlyInterval;

 /** Negative half-line (-∞, 0]. */
 static readonly NEGATIVE = Object.freeze(
  new Interval(Number.NEGATIVE_INFINITY, 0),
 ) as ReadonlyInterval;

 /** Full real line (-∞, +∞). */
 static readonly FULL = Object.freeze(
  new Interval(Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY),
 ) as ReadonlyInterval;

 /** Epsilon interval [-ε, ε]. */
 static readonly EPSILON_INTERVAL = Object.freeze(
  new Interval(-EPSILON, EPSILON),
 ) as ReadonlyInterval;

 /** Percentage interval [0, 100]. */
 static readonly PERCENT = Object.freeze(new Interval(0, 100)) as ReadonlyInterval;

 /** Degrees interval [0, 360]. */
 static readonly DEGREES = Object.freeze(new Interval(0, 360)) as ReadonlyInterval;

 /** Radians interval [0, 2π]. */
 static readonly RADIANS = Object.freeze(new Interval(0, TAU)) as ReadonlyInterval;

 /** Normalized interval [0, 1] (same as UNIT). */
 static readonly NORMALIZED = Object.freeze(new Interval(0, 1)) as ReadonlyInterval;

 constructor(min = 0, max = 0) {
  this.min = 0;
  this.max = 0;
  this.set(min, max);
 }

 static fromValue(value: number, out?: Interval): Interval {
  const sanitized = this.sanitize(value, 'Interval.fromValue:value');
  return this.ensureOut(out).set(sanitized, sanitized);
 }

 static fromCenterRadius(center: number, radius: number, out?: Interval): Interval {
  const sanitizedCenter = this.sanitize(center, 'Interval.fromCenterRadius:center');
  const sanitizedRadius = this.sanitize(radius, 'Interval.fromCenterRadius:radius');
  if (sanitizedRadius < 0) {
   throw new RangeError('Interval.fromCenterRadius: radius must be non-negative');
  }
  return this.ensureOut(out).set(
   sanitizedCenter - sanitizedRadius,
   sanitizedCenter + sanitizedRadius,
  );
 }

 static fromArray(array: ArrayLike<number>, offset = 0, out?: Interval): Interval {
  if (offset < 0 || offset + 1 >= array.length) {
   throw new RangeError(
    `Interval.fromArray: offset ${offset} is out of bounds for array of length ${array.length}`,
   );
  }
  const minValue = this.sanitize(array[offset]!, 'Interval.fromArray:min');
  const maxValue = this.sanitize(array[offset + 1]!, 'Interval.fromArray:max');
  return this.ensureOut(out).set(minValue, maxValue);
 }

 static fromObject(object: IntervalLike, out?: Interval): Interval {
  const minValue = this.sanitize(object.min, 'Interval.fromObject:min');
  const maxValue = this.sanitize(object.max, 'Interval.fromObject:max');
  return this.ensureOut(out).set(minValue, maxValue);
 }

 /* ========================================================================== */
 /* Static Operations */
 /* ========================================================================== */

 /**
  * Adds two intervals.
  * @param a - First interval
  * @param b - Second interval
  * @param out - Optional output interval
  * @returns Sum interval
  */
 static add(a: ReadonlyIntervalLike, b: ReadonlyIntervalLike, out?: Interval): Interval {
  return Interval.ensureOut(out).set(a.min + b.min, a.max + b.max);
 }

 /**
  * Subtracts two intervals.
  * @param a - First interval
  * @param b - Second interval
  * @param out - Optional output interval
  * @returns Difference interval
  */
 static subtract(a: ReadonlyIntervalLike, b: ReadonlyIntervalLike, out?: Interval): Interval {
  return Interval.ensureOut(out).set(a.min - b.max, a.max - b.min);
 }

 /**
  * Multiplies two intervals.
  * @param a - First interval
  * @param b - Second interval
  * @param out - Optional output interval
  * @returns Product interval
  */
 static multiply(a: ReadonlyIntervalLike, b: ReadonlyIntervalLike, out?: Interval): Interval {
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
  */
 static scale(interval: ReadonlyIntervalLike, scalar: number, out?: Interval): Interval {
  if (scalar >= 0) {
   return Interval.ensureOut(out).set(interval.min * scalar, interval.max * scalar);
  }
  return Interval.ensureOut(out).set(interval.max * scalar, interval.min * scalar);
 }

 /**
  * Negates an interval.
  * @param interval - Interval to negate
  * @param out - Optional output interval
  * @returns Negated interval
  */
 static negate(interval: ReadonlyIntervalLike, out?: Interval): Interval {
  return Interval.ensureOut(out).set(-interval.max, -interval.min);
 }

 /**
  * Linear interpolation between two intervals.
  * @param a - Start interval
  * @param b - End interval
  * @param t - Interpolation factor [0, 1], clamped
  * @param out - Optional output interval
  * @returns Interpolated interval
  */
 static lerp(
  a: ReadonlyIntervalLike,
  b: ReadonlyIntervalLike,
  t: number,
  out?: Interval,
 ): Interval {
  const clamped = saturate(t);
  return Interval.ensureOut(out).set(lerp(a.min, b.min, clamped), lerp(a.max, b.max, clamped));
 }

 /**
  * Tests if two intervals are approximately equal.
  * @param a - First interval
  * @param b - Second interval
  * @param epsilon - Tolerance (default: EPSILON)
  * @returns True if equal
  */
 static equals(
  a: ReadonlyIntervalLike,
  b: ReadonlyIntervalLike,
  epsilon: number = EPSILON,
 ): boolean {
  return nearEquals(a.min, b.min, epsilon) && nearEquals(a.max, b.max, epsilon);
 }

 /**
  * Tests if an interval is degenerate (zero width).
  * @param interval - Interval to test
  * @param epsilon - Tolerance (default: EPSILON)
  * @returns True if degenerate
  */
 static isDegenerate(interval: ReadonlyIntervalLike, epsilon: number = EPSILON): boolean {
  return nearEquals(interval.min, interval.max, epsilon);
 }

 /**
  * Returns the width of an interval.
  * @param interval - Interval
  * @returns Width (max - min)
  */
 static width(interval: ReadonlyIntervalLike): number {
  return interval.max - interval.min;
 }

 /**
  * Returns the center of an interval.
  * @param interval - Interval
  * @returns Center ((min + max) / 2)
  */
 static center(interval: ReadonlyIntervalLike): number {
  return (interval.min + interval.max) * 0.5;
 }

 /**
  * Computes the convex hull (smallest enclosing interval) of multiple values/intervals.
  * @param first - Array of values/intervals, or first value
  * @param second - Optional second value or output parameter (when first is array)
  * @param rest - Additional values (when using varargs)
  * @returns Interval enclosing all inputs
  */
 static hull(
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
   throw new Error('Interval.hull: values array cannot be empty');
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
  * Returns the square of an interval.
  * @param interval - Interval to square
  * @param out - Optional output interval
  * @returns Squared interval
  */
 static square(interval: ReadonlyIntervalLike, out?: Interval): Interval {
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
  * @throws {Error} If interval contains negative values
  */
 static sqrt(interval: ReadonlyIntervalLike, out?: Interval): Interval {
  if (interval.min < 0) {
   throw new Error('Interval.sqrt: interval contains negative values');
  }
  return Interval.ensureOut(out).set(safeSqrt(interval.min), safeSqrt(interval.max));
 }

 /**
  * Returns the reciprocal of an interval.
  * @param interval - Interval (must not contain zero)
  * @param out - Optional output interval
  * @returns Reciprocal interval
  * @throws {Error} If interval contains zero
  */
 static reciprocal(interval: ReadonlyIntervalLike, out?: Interval): Interval {
  if (interval.min <= 0 && interval.max >= 0) {
   throw new Error('Interval.reciprocal: interval contains zero');
  }
  const recipMin = safeDivide(1, interval.min);
  const recipMax = safeDivide(1, interval.max);
  return Interval.ensureOut(out).set(Math.min(recipMin, recipMax), Math.max(recipMin, recipMax));
 }

 /**
  * Returns the union of two intervals.
  * @param a - First interval
  * @param b - Second interval
  * @param out - Optional output interval
  * @returns Union interval (smallest interval containing both)
  */
 static union(a: ReadonlyIntervalLike, b: ReadonlyIntervalLike, out?: Interval): Interval {
  return Interval.ensureOut(out).set(Math.min(a.min, b.min), Math.max(a.max, b.max));
 }

 /**
  * Returns the intersection of two intervals.
  * @param a - First interval
  * @param b - Second interval
  * @param out - Optional output interval
  * @returns Intersection interval or undefined if no overlap
  */
 static intersect(
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

 /**
  * Tests if two intervals overlap.
  * @param a - First interval
  * @param b - Second interval
  * @returns True if intervals overlap
  */
 static overlaps(a: ReadonlyIntervalLike, b: ReadonlyIntervalLike): boolean {
  return a.min <= b.max && a.max >= b.min;
 }

 /**
  * Tests if an interval contains a value.
  * @param interval - Interval
  * @param value - Value to test
  * @returns True if value is within interval
  */
 static contains(interval: ReadonlyIntervalLike, value: number): boolean {
  return value >= interval.min && value <= interval.max;
 }

 /**
  * Returns the radius (half-width) of an interval.
  * @param interval - Interval
  * @returns Radius ((max - min) / 2)
  */
 static radius(interval: ReadonlyIntervalLike): number {
  return (interval.max - interval.min) * 0.5;
 }

 set(minValue: number, maxValue: number): this {
  const sanitizedMin = Interval.sanitize(minValue, 'Interval.set:min');
  const sanitizedMax = Interval.sanitize(maxValue, 'Interval.set:max');
  Interval.assertOrder(sanitizedMin, sanitizedMax, 'Interval.set');
  this.min = sanitizedMin;
  this.max = sanitizedMax;
  return this;
 }

 copy(other: ReadonlyInterval): this {
  this.min = other.min;
  this.max = other.max;
  return this;
 }

 width(): number {
  return this.max - this.min;
 }

 center(): number {
  return (this.min + this.max) * 0.5;
 }

 radius(): number {
  return (this.max - this.min) * 0.5;
 }

 isDegenerate(epsilon: number = EPSILON): boolean {
  return nearEquals(this.min, this.max, epsilon);
 }

 contains(value: number): boolean {
  return value >= this.min && value <= this.max;
 }

 strictlyContains(value: number): boolean {
  return value > this.min && value < this.max;
 }

 /**
  * Adds another interval to this one.
  * @param other - Interval to add
  * @param out - Optional output interval
  * @returns Sum interval
  */
 add(other: ReadonlyInterval, out?: Interval): Interval {
  return Interval.ensureOut(out).set(this.min + other.min, this.max + other.max);
 }

 /**
  * Subtracts another interval from this one.
  * @param other - Interval to subtract
  * @param out - Optional output interval
  * @returns Difference interval
  */
 subtract(other: ReadonlyInterval, out?: Interval): Interval {
  return Interval.ensureOut(out).set(this.min - other.max, this.max - other.min);
 }

 /**
  * Multiplies with another interval.
  * @param other - Interval to multiply by
  * @param out - Optional output interval
  * @returns Product interval
  */
 multiply(other: ReadonlyInterval, out?: Interval): Interval {
  const products = [
   this.min * other.min,
   this.min * other.max,
   this.max * other.min,
   this.max * other.max,
  ];
  const newMin = Math.min(products[0]!, products[1]!, products[2]!, products[3]!);
  const newMax = Math.max(products[0]!, products[1]!, products[2]!, products[3]!);
  return Interval.ensureOut(out).set(newMin, newMax);
 }

 /**
  * Divides this interval by another.
  * @param other - Interval to divide by (must not contain zero)
  * @param out - Optional output interval
  * @returns Quotient interval
  * @throws Error if divisor interval contains zero
  */
 divide(other: ReadonlyInterval, out?: Interval): Interval {
  if (other.contains(0)) {
   throw new Error('Interval.divide: divisor interval contains zero');
  }
  const quotients = [
   safeDivide(this.min, other.min),
   safeDivide(this.min, other.max),
   safeDivide(this.max, other.min),
   safeDivide(this.max, other.max),
  ];
  const newMin = Math.min(quotients[0]!, quotients[1]!, quotients[2]!, quotients[3]!);
  const newMax = Math.max(quotients[0]!, quotients[1]!, quotients[2]!, quotients[3]!);
  return Interval.ensureOut(out).set(newMin, newMax);
 }

 scale(scalar: number, out?: Interval): Interval {
  const sanitizedScalar = Interval.sanitize(scalar, 'Interval.scale:scalar');
  if (sanitizedScalar >= 0) {
   return Interval.ensureOut(out).set(this.min * sanitizedScalar, this.max * sanitizedScalar);
  }
  return Interval.ensureOut(out).set(this.max * sanitizedScalar, this.min * sanitizedScalar);
 }

 negate(out?: Interval): Interval {
  return Interval.ensureOut(out).set(-this.max, -this.min);
 }

 /**
  * Returns the squared interval.
  * @param out - Optional output interval
  * @returns Squared interval
  *
  * @remarks
  * Delegates to {@link Interval.square} for the computation.
  */
 square(out?: Interval): Interval {
  return Interval.square(this, out);
 }

 /**
  * Returns the square root of this interval.
  * @param out - Optional output interval
  * @returns Square root interval
  * @throws {Error} If interval contains negative values
  *
  * @remarks
  * Delegates to {@link Interval.sqrt} for the computation.
  */
 sqrt(out?: Interval): Interval {
  return Interval.sqrt(this, out);
 }

 reciprocal(out?: Interval): Interval {
  if (this.contains(0)) {
   throw new Error('Interval.reciprocal: interval contains zero');
  }
  const recipMin = safeDivide(1, this.min);
  const recipMax = safeDivide(1, this.max);
  const newMin = Math.min(recipMin, recipMax);
  const newMax = Math.max(recipMin, recipMax);
  return Interval.ensureOut(out).set(newMin, newMax);
 }

 intersect(other: ReadonlyInterval, out?: Interval): Interval | undefined {
  const newMin = Math.max(this.min, other.min);
  const newMax = Math.max(newMin, Math.min(this.max, other.max));
  if (newMin <= newMax) {
   return Interval.ensureOut(out).set(newMin, newMax);
  }
  return undefined;
 }

 union(other: ReadonlyInterval, out?: Interval): Interval {
  return Interval.ensureOut(out).set(Math.min(this.min, other.min), Math.max(this.max, other.max));
 }

 overlaps(other: ReadonlyInterval): boolean {
  return this.min <= other.max && this.max >= other.min;
 }

 isSubsetOf(other: ReadonlyInterval): boolean {
  return this.min >= other.min && this.max <= other.max;
 }

 equals(other: ReadonlyInterval, epsilon: number = EPSILON): boolean {
  return nearEquals(this.min, other.min, epsilon) && nearEquals(this.max, other.max, epsilon);
 }

 lerp(t: number): number {
  const clamped = saturate(t);
  return lerp(this.min, this.max, clamped);
 }

 inverseLerp(value: number): number {
  const width = this.width();
  if (nearEquals(width, 0)) {
   return 0;
  }
  return safeDivide(value - this.min, width);
 }

 clampValue(value: number): number {
  return clamp(value, this.min, this.max);
 }

 /**
  * Interpolates between two intervals (not within a single interval).
  * @param other - Target interval
  * @param t - Interpolation factor [0, 1], clamped
  * @param out - Optional output interval
  * @returns Interpolated interval
  */
 lerpInterval(other: ReadonlyInterval, t: number, out?: Interval): Interval {
  return Interval.lerp(this, other, t, out);
 }

 /* ========================================================================== */
 /* Readonly Getters */
 /* ========================================================================== */

 /**
  * Returns the negated interval without modifying this one.
  * @returns New negated interval
  */
 public get negated(): Interval {
  return new Interval(-this.max, -this.min);
 }

 /**
  * Returns an expanded interval (by EPSILON) without modifying this one.
  * @returns New expanded interval
  */
 public get expanded(): Interval {
  return new Interval(this.min - EPSILON, this.max + EPSILON);
 }

 /**
  * Returns the reciprocal interval without modifying this one.
  * @returns New reciprocal interval (or throws if contains zero)
  */
 public get reciprocated(): Interval {
  if (this.contains(0)) {
   throw new Error('Interval.reciprocated: interval contains zero');
  }
  const recipMin = safeDivide(1, this.min);
  const recipMax = safeDivide(1, this.max);
  return new Interval(Math.min(recipMin, recipMax), Math.max(recipMin, recipMax));
 }

 /**
  * Returns the squared interval without modifying this one.
  * @returns New squared interval
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

 /* ========================================================================== */
 /* Serialization */
 /* ========================================================================== */

 /**
  * Converts the interval to a tuple [min, max].
  * @returns Tuple with min and max values
  *
  * @example
  * ```typescript
  * const i = new Interval(0, 10);
  * const [min, max] = i.toArray();
  * ```
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
  */
 clone(): Interval {
  return new Interval(this.min, this.max);
 }
}
