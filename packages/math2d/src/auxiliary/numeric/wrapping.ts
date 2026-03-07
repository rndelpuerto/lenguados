/**
 * @file auxiliary/numeric/wrapping.ts
 * @module @lenguados/math2d/auxiliary/numeric
 * @description Specialized value wrapping and modulo operations.
 *
 * @remarks
 * This module provides floored modulo (Python-style `%`), where the result
 * has the same sign as the divisor. Available in strict, safe, and unchecked
 * variants via {@link flooredMod}, {@link flooredModSafe}, and
 * {@link flooredModUnchecked}.
 *
 * For basic looping and modulo, use {@link loop} and {@link mod}
 * from {@link @lenguados/math2d/auxiliary/scalar/arithmetic}.
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
