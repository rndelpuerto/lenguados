/**
 * @file auxiliary/numeric/wrapping.ts
 * @module @lenguados/math2d/auxiliary/numeric
 * @description Specialized value wrapping and modulo operations
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
