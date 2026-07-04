/**
 * @file auxiliary/numeric/wrapping.ts
 * @module @lenguados/math2d/auxiliary/numeric
 * @description Specialized value wrapping and modulo operations
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

/* ========================================================================== */
/* Floored Modulo                                                             */
/* ========================================================================== */

/**
 * Computes the floored remainder (Python-style `%`), where the result shares the sign of `divisor`
 *
 * @remarks
 * Uses an exact `=== 0` divisor check per C99 §7.12.10.1. Tiny non-zero divisors
 * like `1e-11` are accepted as valid (the IEEE 754 result is mathematically
 * well-defined). NaN propagates per IEEE 754 §6.2: `flooredMod(x, NaN)` → NaN.
 *
 * @param dividend - Value to divide
 * @param divisor - Divisor; MUST NOT be exactly zero
 * @returns Floored remainder
 * @throws {RangeError} If `divisor === 0` (exactly)
 *
 * @example
 * ```typescript
 * flooredMod(7, 3);       // 1
 * flooredMod(-7, 3);      // 2
 * flooredMod(7, -3);      // -2
 * flooredMod(-7, -3);     // -1
 * flooredMod(5, 1e-11);   // valid: tiny divisor is non-zero
 * flooredMod(5, NaN);     // NaN (IEEE 754 propagation)
 * ```
 *
 * @see {@link flooredModSafe} - Returns 0 if divisor is zero
 * @see {@link flooredModUnchecked} - No validation
 * @see {@link mod} - positive modulo (in `auxiliary/scalar/arithmetic.ts`)
 * @see {@link loop} - range wrapping (in `auxiliary/scalar/arithmetic.ts`)
 *
 * @category Wrapping
 * @since 0.7.0
 */
export function flooredMod(dividend: number, divisor: number): number {
 if (divisor === 0) {
  throw new RangeError('flooredMod: divisor must not be zero');
 }
 return ((dividend % divisor) + divisor) % divisor;
}

/**
 * Computes the floored remainder with a `0` fallback for exact zero divisor
 *
 * @remarks
 * NaN propagates per the canonical Safe contract (IEEE 754 §6.2): NaN in → NaN out.
 * The `0` fallback triggers ONLY when `divisor === 0` exactly.
 *
 * @param dividend - Value to divide
 * @param divisor - Divisor
 * @returns Floored remainder; `0` if `divisor === 0` exactly; `NaN` if any input is NaN
 *
 * @example
 * ```typescript
 * flooredModSafe(7, 3);      // 1
 * flooredModSafe(7, 0);      // 0 (zero divisor fallback)
 * flooredModSafe(7, NaN);    // NaN (propagates)
 * ```
 *
 * @see {@link flooredMod} - Throws if divisor is zero
 *
 * @category Wrapping
 * @since 0.7.0
 */
export function flooredModSafe(dividend: number, divisor: number): number {
 if (divisor === 0) return 0;
 return ((dividend % divisor) + divisor) % divisor;
}

/**
 * Floored modulo (unchecked)
 *
 * @remarks
 * **Precondition:** divisor !== 0. Zero divisor produces NaN.
 *
 * @param dividend - Value to divide
 * @param divisor - Divisor (must not be zero)
 * @returns Floored remainder
 *
 * @see {@link flooredMod} - Throws if divisor is zero
 * @see {@link flooredModSafe} - Returns 0 if divisor is zero
 *
 * @category Wrapping
 * @since 0.7.0
 */
export function flooredModUnchecked(dividend: number, divisor: number): number {
 return ((dividend % divisor) + divisor) % divisor;
}
