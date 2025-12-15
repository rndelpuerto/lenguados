/**
 * @file auxiliary/scalar/comparison.ts
 * @module @lenguados/math2d/auxiliary/scalar
 * @description Scalar comparison operations with tolerance
 */

import { EPSILON } from './constants';

/**
 * Tests if two values are approximately equal.
 * @param a - First value
 * @param b - Second value
 * @param epsilon - Tolerance (default: EPSILON)
 * @returns True if |a - b| <= epsilon
 *
 * @example
 * ```typescript
 * nearEquals(1.0, 1.0000000001);          // true (within default epsilon)
 * nearEquals(1.0, 1.01, 0.1);            // true (within custom epsilon)
 * nearEquals(1.0, 2.0);                  // false
 * ```
 *
 * @category Comparison
 * @since 1.0.0
 */
export function nearEquals(a: number, b: number, epsilon: number = EPSILON): boolean {
 return Math.abs(a - b) <= epsilon;
}

/**
 * Tests if value is near zero.
 * @param value - Value to test
 * @param epsilon - Tolerance (default: EPSILON)
 * @returns True if |value| <= epsilon
 *
 * @example
 * ```typescript
 * isNearZero(0.0000000001);   // true (within default epsilon)
 * isNearZero(0.1);           // false
 * isNearZero(0.01, 0.1);     // true (within custom epsilon)
 * ```
 *
 * @category Comparison
 * @since 1.0.0
 */
export function isNearZero(value: number, epsilon: number = EPSILON): boolean {
 return Math.abs(value) <= epsilon;
}

/**
 * Tests if value is near one.
 * @param value - Value to test
 * @param epsilon - Tolerance (default: EPSILON)
 * @returns True if |value - 1| <= epsilon
 *
 * @example
 * ```typescript
 * isNearOne(0.9999999999);   // true (within default epsilon)
 * isNearOne(0.9);           // false
 * isNearOne(1.01, 0.1);     // true (within custom epsilon)
 * ```
 *
 * @category Comparison
 * @since 1.0.0
 */
export function isNearOne(value: number, epsilon: number = EPSILON): boolean {
 return Math.abs(value - 1) <= epsilon;
}

/**
 * Tests relative equality: |a-b| <= epsilon * max(|a|, |b|, 1).
 * Better for large numbers.
 * @param a - First value
 * @param b - Second value
 * @param relativeEpsilon - Relative tolerance fraction
 * @returns True if within the scaled tolerance
 *
 * @example
 * ```typescript
 * // Relative compare: allows 1% difference
 * relativeEquals(100, 101, 0.01);          // true
 * relativeEquals(1000, 1010, 0.01);        // true
 * relativeEquals(0.001, 0.002, 0.01);      // false (100% difference)
 * ```
 *
 * @throws {RangeError} If relativeEpsilon is negative
 *
 * @category Comparison
 * @since 1.0.0
 */
export function relativeEquals(a: number, b: number, relativeEpsilon: number = EPSILON): boolean {
 if (relativeEpsilon < 0) {
  throw new RangeError('relativeEquals: relativeEpsilon must be non-negative');
 }

 const scale = Math.max(1, Math.abs(a), Math.abs(b));
 const threshold = relativeEpsilon * scale;

 return nearEquals(a, b, threshold);
}

/**
 * Tests if a < b with epsilon tolerance.
 * Returns true if a < b - epsilon.
 * @param a - First value
 * @param b - Second value
 * @param epsilon - Tolerance (default: EPSILON)
 * @returns True if a is less than b beyond tolerance
 *
 * @example
 * ```typescript
 * lessThan(1.0, 2.0);                    // true
 * lessThan(1.9999999999, 2.0);           // false (within epsilon)
 * lessThan(1.99, 2.0, 0.1);              // false (within custom epsilon)
 * ```
 *
 * @category Comparison
 * @since 1.0.0
 */
export function lessThan(a: number, b: number, epsilon: number = EPSILON): boolean {
 return a < b - epsilon;
}

/**
 * Tests if a > b with epsilon tolerance.
 * Returns true if a > b + epsilon.
 * @param a - First value
 * @param b - Second value
 * @param epsilon - Tolerance (default: EPSILON)
 * @returns True if a is greater than b beyond tolerance
 *
 * @example
 * ```typescript
 * greaterThan(2.0, 1.0);                 // true
 * greaterThan(2.0, 1.9999999999);        // false (within epsilon)
 * greaterThan(2.0, 1.99, 0.1);           // false (within custom epsilon)
 * ```
 *
 * @category Comparison
 * @since 1.0.0
 */
export function greaterThan(a: number, b: number, epsilon: number = EPSILON): boolean {
 return a > b + epsilon;
}

/**
 * Tests if value is in range [min, max] with epsilon.
 * @param value - Value to test
 * @param min - Lower bound (inclusive)
 * @param max - Upper bound (inclusive)
 * @param epsilon - Tolerance (default: EPSILON)
 * @returns True if value is within range with tolerance
 *
 * @remarks
 * Uses epsilon tolerance at both bounds:
 * - Lower bound: value >= min - epsilon
 * - Upper bound: value <= max + epsilon
 *
 * @example
 * ```typescript
 * inRange(5, 0, 10);                     // true
 * inRange(0, 0, 10);                     // true (on boundary)
 * inRange(-0.0000000001, 0, 10);         // true (within epsilon)
 * inRange(-0.1, 0, 10);                  // false
 * inRange(5, 0, 10, 1);                  // true
 * inRange(-0.5, 0, 10, 1);               // true (within custom epsilon)
 * ```
 *
 * @category Comparison
 * @since 1.0.0
 */
export function inRange(
 value: number,
 min: number,
 max: number,
 epsilon: number = EPSILON,
): boolean {
 return value >= min - epsilon && value <= max + epsilon;
}

/**
 * Compares two values with tolerance.
 *
 * @param a - First value
 * @param b - Second value
 * @param epsilon - Tolerance (default: EPSILON)
 * @returns -1 if a < b (beyond epsilon), 0 if approximately equal, 1 if a > b (beyond epsilon)
 *
 * @remarks
 * This provides a three-way comparison suitable for sorting or ordering.
 * Values within epsilon of each other are considered equal (returns 0).
 *
 * @example
 * ```typescript
 * compare(1.0, 2.0);           // -1
 * compare(2.0, 1.0);           // 1
 * compare(1.0, 1.0000000001);  // 0 (within epsilon)
 * compare(1.0, 1.1);           // -1
 * compare(1.0, 0.9);           // 1
 * ```
 *
 * @category Comparison
 * @since 0.11.0
 */
export function compare(a: number, b: number, epsilon: number = EPSILON): -1 | 0 | 1 {
 if (a < b - epsilon) return -1;
 if (a > b + epsilon) return 1;
 return 0;
}
