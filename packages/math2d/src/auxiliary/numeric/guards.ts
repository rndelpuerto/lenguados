/**
 * @file auxiliary/numeric/guards.ts
 * @module @lenguados/math2d/auxiliary/numeric
 * @description Numeric type guards (boolean predicates)
 *
 * @remarks
 * This module provides boolean predicates for testing numeric values
 * that are NOT available in the standard library.
 * For safe operations that return numbers, see {@link ./safety}.
 *
 * For basic guards like `isFinite`, `isNaN`, `isSafeInteger`, use
 * `Number.isFinite()`, `Number.isNaN()`, `Number.isSafeInteger()` directly.
 */

import { SMALLEST_NORMAL } from '../scalar/constants';

/**
 * Tests if value is positive infinity.
 * @param value - Value to test
 * @returns True if positive infinity
 *
 * @example
 * ```typescript
 * isPositiveInfinity(Infinity);      // true
 * isPositiveInfinity(1 / 0);         // true
 * isPositiveInfinity(-Infinity);     // false
 * isPositiveInfinity(42);            // false
 * ```
 *
 * @category Guards
 * @since 0.7.0
 */
export function isPositiveInfinity(value: number): boolean {
 return value === Infinity;
}

/**
 * Tests if value is negative infinity.
 * @param value - Value to test
 * @returns True if negative infinity
 *
 * @example
 * ```typescript
 * isNegativeInfinity(-Infinity);     // true
 * isNegativeInfinity(-1 / 0);        // true
 * isNegativeInfinity(Infinity);      // false
 * isNegativeInfinity(-42);           // false
 * ```
 *
 * @category Guards
 * @since 0.7.0
 */
export function isNegativeInfinity(value: number): boolean {
 return value === -Infinity;
}

/**
 * Tests if value is any infinity.
 * @param value - Value to test
 * @returns True if positive or negative infinity
 *
 * @example
 * ```typescript
 * isInfinity(Infinity);      // true
 * isInfinity(-Infinity);     // true
 * isInfinity(42);            // false
 * isInfinity(NaN);           // false
 * ```
 *
 * @category Guards
 * @since 0.7.0
 */
export function isInfinity(value: number): boolean {
 return value === Infinity || value === -Infinity;
}

/**
 * Tests if value is a denormal number.
 *
 * @remarks
 * Denormal (or subnormal) numbers are very small numbers that
 * can cause performance issues on some processors. In IEEE 754
 * double precision, denormals are numbers with absolute value
 * less than 2^-1022 (approximately 2.225e-308) but not zero.
 *
 * @param value - Value to test
 * @returns True if denormal
 *
 * @example
 * ```typescript
 * isDenormal(1e-300);        // false (normal)
 * isDenormal(1e-308);        // true (denormal)
 * isDenormal(5e-324);        // true (denormal, smallest positive number)
 * isDenormal(0);             // false
 * ```
 *
 * @category Guards
 * @since 0.7.0
 */
export function isDenormal(value: number): boolean {
 return value !== 0 && Math.abs(value) < SMALLEST_NORMAL;
}

/**
 * Tests if value is in range [min, max].
 * @param value - Value to test
 * @param min - Lower bound (inclusive)
 * @param max - Upper bound (inclusive)
 * @returns True if value is within range
 *
 * @example
 * ```typescript
 * isInRange(5, 0, 10);       // true
 * isInRange(0, 0, 10);       // true (on boundary)
 * isInRange(11, 0, 10);      // false
 * isInRange(-1, 0, 10);      // false
 * ```
 *
 * @category Guards
 * @since 0.7.0
 */
export function isInRange(value: number, min: number, max: number): boolean {
 return value >= min && value <= max;
}
