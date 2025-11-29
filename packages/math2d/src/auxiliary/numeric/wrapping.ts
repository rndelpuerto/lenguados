/**
 * @file auxiliary/numeric/wrapping.ts
 * @module @lenguados/math2d/auxiliary/numeric
 * @description Value wrapping and modulo operations
 *
 * @remarks
 * This module provides specialized wrapping operations. For basic looping
 * and modulo, see {@link @lenguados/math2d/auxiliary/scalar/arithmetic}.
 */

import { loop, mod } from '../scalar/arithmetic';

/**
 * Wraps a value to [min, max) range.
 * @param value - Value to wrap
 * @param min - Lower bound (inclusive)
 * @param max - Upper bound (exclusive)
 * @returns Wrapped value
 *
 * @remarks
 * Delegates to {@link loop} from scalar/arithmetic for DRY compliance.
 * Use this alias when working in a wrapping/modulo context.
 *
 * @example
 * ```typescript
 * wrap(5, 0, 10);      // 5
 * wrap(15, 0, 10);     // 5
 * wrap(-5, 0, 10);     // 5
 * wrap(10, 0, 10);     // 0
 * wrap(0, -5, 5);      // 0
 * wrap(7, -5, 5);      // -3
 * ```
 *
 * @category Wrapping
 * @since 1.0.0
 */
export function wrap(value: number, min: number, max: number): number {
 return loop(value, min, max);
}

/**
 * Euclidean modulo (always positive).
 * Better than % for negative numbers.
 * @param dividend - Value to divide
 * @param divisor - Divisor (must be positive)
 * @returns Positive remainder
 *
 * @remarks
 * Delegates to {@link mod} from scalar/arithmetic for DRY compliance.
 * Use this alias when working in a wrapping/modulo context.
 *
 * @example
 * ```typescript
 * euclideanMod(7, 3);      // 1
 * euclideanMod(-7, 3);     // 2 (not -1 like %)
 * euclideanMod(0, 3);      // 0
 * euclideanMod(3, 3);      // 0
 * ```
 *
 * @category Wrapping
 * @since 1.0.0
 */
export function euclideanMod(dividend: number, divisor: number): number {
 return mod(dividend, divisor);
}

/**
 * Floored modulo.
 * @param dividend - Value to divide
 * @param divisor - Divisor
 * @returns Floored remainder
 *
 * @example
 * ```typescript
 * flooredMod(7, 3);       // 1
 * flooredMod(-7, 3);      // 2
 * flooredMod(7, -3);      // -2
 * flooredMod(-7, -3);     // -1
 * ```
 *
 * @category Wrapping
 * @since 1.0.0
 */
export function flooredMod(dividend: number, divisor: number): number {
 return ((dividend % divisor) + divisor) % divisor;
}

/**
 * Truncated modulo (same as %).
 * Included for completeness and clarity.
 * @param dividend - Value to divide
 * @param divisor - Divisor
 * @returns Truncated remainder
 *
 * @example
 * ```typescript
 * truncatedMod(7, 3);      // 1
 * truncatedMod(-7, 3);     // -1
 * truncatedMod(7, -3);     // 1
 * truncatedMod(-7, -3);    // -1
 * ```
 *
 * @category Wrapping
 * @since 1.0.0
 */
export function truncatedMod(dividend: number, divisor: number): number {
 return dividend % divisor;
}

/**
 * Mirrors value around center.
 * @param value - Value to mirror
 * @param center - Mirror center (default: 0)
 * @param range - Range from center (default: 1)
 * @returns Mirrored value
 *
 * @remarks
 * Creates a ping-pong effect where values beyond the range
 * are reflected back.
 *
 * @example
 * ```typescript
 * mirror(3, 0, 2);     // -1 (3 reflected around 2 from center 0)
 * mirror(5, 0, 2);     // -1 (same as 3)
 * mirror(1, 5, 2);     // 7 (within range [3,7])
 * mirror(8, 5, 2);     // 6 (reflected back from 7)
 * ```
 *
 * @category Wrapping
 * @since 1.0.0
 */
export function mirror(value: number, center: number = 0, range: number = 1): number {
 const distribution = Math.abs(value - center);
 const cycles = Math.floor(distribution / range);
 const phase = distribution % range;

 if (cycles % 2 === 0) {
  // Even cycle: normal direction
  return value < center ? center - phase : center + phase;
 } else {
  // Odd cycle: reflected direction
  return value < center ? center + phase : center - phase;
 }
}

/**
 * Repeats value in range with smooth blend.
 * @param value - Value to repeat
 * @param length - Period of repetition
 * @returns Repeated value in [0, length)
 *
 * @remarks
 * Similar to modulo but designed for smooth tiling patterns.
 * Always returns positive values.
 *
 * @example
 * ```typescript
 * repeat(3, 2);        // 1
 * repeat(5, 2);        // 1
 * repeat(-1, 2);       // 1
 * repeat(2, 2);        // 0
 * ```
 *
 * @category Wrapping
 * @since 1.0.0
 */
export function repeat(value: number, length: number): number {
 if (length <= 0) return 0;
 return value - Math.floor(value / length) * length;
}
