/**
 * @file auxiliary/numeric/wrapping.ts
 * @module @lenguados/math2d/auxiliary/numeric
 * @description Specialized value wrapping and modulo operations.
 *
 * @remarks
 * This module provides different modulo and wrapping behaviors:
 *
 * - **`flooredMod`**: Result has same sign as divisor (Python-style)
 * - **`truncatedMod`**: Result has same sign as dividend (JavaScript `%`)
 * - **`mirror`**: Ping-pong reflection around a center point
 * - **`repeat`**: Always positive wrapping for tiling patterns
 *
 * For basic looping and modulo, use {@link loop} and {@link mod}
 * from {@link @lenguados/math2d/auxiliary/scalar/arithmetic}.
 *
 * **Note:** `truncatedMod` is identical to `%` but included for
 * semantic clarity when comparing different modulo behaviors.
 */

import { isNearZero } from '../scalar/comparison';

/* ========================================================================== */
/* Floored Modulo                                                             */
/* ========================================================================== */

/**
 * Floored modulo (strict).
 * @param dividend - Value to divide.
 * @param divisor - Divisor.
 * @returns Floored remainder.
 * @throws {RangeError} If divisor is near zero.
 *
 * @example
 * ```typescript
 * flooredMod(7, 3);       // 1
 * flooredMod(-7, 3);      // 2
 * flooredMod(7, -3);      // -2
 * flooredMod(-7, -3);     // -1
 * ```
 *
 * @see {@link flooredModSafe} - Returns 0 if divisor is zero
 * @see {@link flooredModUnchecked} - No validation
 *
 * @category Wrapping
 * @since 0.7.0
 */
export function flooredMod(dividend: number, divisor: number): number {
 if (isNearZero(divisor)) {
  throw new RangeError('flooredMod: divisor must not be zero');
 }
 return ((dividend % divisor) + divisor) % divisor;
}

/**
 * Floored modulo (safe).
 * @param dividend - Value to divide.
 * @param divisor - Divisor.
 * @returns Floored remainder, or 0 if divisor is zero.
 *
 * @see {@link flooredMod} - Throws if divisor is zero
 *
 * @category Wrapping
 * @since 0.7.0
 */
export function flooredModSafe(dividend: number, divisor: number): number {
 if (isNearZero(divisor)) return 0;
 return ((dividend % divisor) + divisor) % divisor;
}

/**
 * Floored modulo (unchecked).
 * @param dividend - Value to divide.
 * @param divisor - Divisor (must not be zero).
 * @returns Floored remainder.
 *
 * @remarks
 * **⚠️ Precondition:** divisor !== 0. Zero divisor produces NaN.
 *
 * @category Wrapping
 * @since 0.7.0
 */
export function flooredModUnchecked(dividend: number, divisor: number): number {
 return ((dividend % divisor) + divisor) % divisor;
}

/* ========================================================================== */
/* Truncated Modulo                                                           */
/* ========================================================================== */

/**
 * Truncated modulo (same as %).
 * Included for completeness and clarity.
 * @param dividend - Value to divide.
 * @param divisor - Divisor.
 * @returns Truncated remainder.
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
 * @since 0.7.0
 */
export function truncatedMod(dividend: number, divisor: number): number {
 return dividend % divisor;
}

/* ========================================================================== */
/* Mirror                                                                     */
/* ========================================================================== */

/**
 * Mirrors value around center (strict).
 * @param value - Value to mirror.
 * @param center - Mirror center (default: 0).
 * @param range - Range from center (default: 1).
 * @returns Mirrored value.
 * @throws {RangeError} If range is <= 0.
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
 * @see {@link mirrorSafe} - Returns center if range is invalid
 * @see {@link mirrorUnchecked} - No validation
 *
 * @category Wrapping
 * @since 0.7.0
 */
export function mirror(value: number, center: number = 0, range: number = 1): number {
 if (range <= 0) {
  throw new RangeError('mirror: range must be positive');
 }
 return mirrorUnchecked(value, center, range);
}

/**
 * Mirrors value around center (safe).
 * @param value - Value to mirror.
 * @param center - Mirror center (default: 0).
 * @param range - Range from center (default: 1).
 * @returns Mirrored value, or center if range is invalid.
 *
 * @see {@link mirror} - Throws if range is invalid
 *
 * @category Wrapping
 * @since 0.7.0
 */
export function mirrorSafe(value: number, center: number = 0, range: number = 1): number {
 if (range <= 0) return center;
 return mirrorUnchecked(value, center, range);
}

/**
 * Mirrors value around center (unchecked).
 * @param value - Value to mirror.
 * @param center - Mirror center.
 * @param range - Range from center (must be > 0).
 * @returns Mirrored value.
 *
 * @remarks
 * **⚠️ Precondition:** range > 0. Invalid range produces undefined behavior.
 *
 * @category Wrapping
 * @since 0.7.0
 */
export function mirrorUnchecked(value: number, center: number, range: number): number {
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

/* ========================================================================== */
/* Repeat                                                                     */
/* ========================================================================== */

/**
 * Repeats value in range (strict).
 * @param value - Value to repeat.
 * @param length - Period of repetition.
 * @returns Repeated value in [0, length).
 * @throws {RangeError} If length <= 0.
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
 * @see {@link repeatSafe} - Returns 0 if length is invalid
 * @see {@link repeatUnchecked} - No validation
 *
 * @category Wrapping
 * @since 0.7.0
 */
export function repeat(value: number, length: number): number {
 if (length <= 0) {
  throw new RangeError('repeat: length must be positive');
 }
 return value - Math.floor(value / length) * length;
}

/**
 * Repeats value in range (safe).
 * @param value - Value to repeat.
 * @param length - Period of repetition.
 * @returns Repeated value in [0, length), or 0 if length is invalid.
 *
 * @see {@link repeat} - Throws if length is invalid
 *
 * @category Wrapping
 * @since 0.7.0
 */
export function repeatSafe(value: number, length: number): number {
 if (length <= 0) return 0;
 return value - Math.floor(value / length) * length;
}

/**
 * Repeats value in range (unchecked).
 * @param value - Value to repeat.
 * @param length - Period of repetition (must be > 0).
 * @returns Repeated value in [0, length).
 *
 * @remarks
 * **⚠️ Precondition:** length > 0. Invalid length produces NaN/-Infinity.
 *
 * @category Wrapping
 * @since 0.7.0
 */
export function repeatUnchecked(value: number, length: number): number {
 return value - Math.floor(value / length) * length;
}
