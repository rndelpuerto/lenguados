/**
 * @file auxiliary/numeric/safety.ts
 * @module @lenguados/math2d/auxiliary/numeric
 * @description Safe arithmetic operations that handle edge cases gracefully.
 *
 * @remarks
 * This module provides operations that return safe numeric values
 * instead of NaN/Infinity. For boolean predicates (type guards),
 * see {@link ./guards}.
 *
 * **Determinism Guarantee**: Mathematical operations that could vary across
 * JavaScript engines are delegated to deterministic-kernels.
 */

import { acosSafe, asinSafe, log, pow, sqrtSafe } from '../../deterministic/deterministic-kernels';
import { PrecisionMath } from '../../deterministic/precision-math';
import { clamp } from '../scalar/arithmetic';
import { EPSILON } from '../scalar/constants';

/**
 * Minimum safe value for division operations.
 * Below this value, division results may be unreliable.
 *
 * @remarks
 * Uses the same EPSILON (1e-10) as {@link isNearZero} for consistency.
 * This ensures that `safeDivide` and `isNearZero` have coherent behavior.
 *
 * @constant {number}
 * @category Safety
 * @since 0.7.0
 */
export const MIN_SAFE_DIVISOR = EPSILON;

/**
 * Safe division with fallback to 0.
 * @param numerator - Dividend.
 * @param denominator - Divisor.
 * @param epsilon - Minimum safe divisor (default: MIN_SAFE_DIVISOR).
 * @returns Result or 0 if denominator is too small.
 *
 * @example
 * ```typescript
 * safeDivide(10, 2);              // 5
 * safeDivide(10, 0);              // 0 (safe fallback)
 * safeDivide(10, 0.0000000001);   // 0 (below epsilon)
 * safeDivide(10, 0, 0.1);         // 0 (custom epsilon)
 * ```
 *
 * @category Safety
 * @since 0.7.0
 */
export function safeDivide(
 numerator: number,
 denominator: number,
 epsilon: number = MIN_SAFE_DIVISOR,
): number {
 return Math.abs(denominator) < epsilon ? 0 : numerator / denominator;
}

/**
 * Safe reciprocal (1/x).
 * @param value - Value to invert.
 * @param epsilon - Minimum safe value (default: MIN_SAFE_DIVISOR).
 * @returns Reciprocal or 0 if value is too small.
 *
 * @example
 * ```typescript
 * safeReciprocal(2);           // 0.5
 * safeReciprocal(0);           // 0 (safe fallback)
 * safeReciprocal(0.00001);     // 0 (below epsilon)
 * ```
 *
 * @category Safety
 * @since 0.7.0
 */
export function safeReciprocal(value: number, epsilon: number = MIN_SAFE_DIVISOR): number {
 return Math.abs(value) < epsilon ? 0 : 1 / value;
}

/* ========================================================================== */
/* Re-exports from deterministic-kernels                                       */
/* ========================================================================== */

/**
 * Safe deterministic square root (clamps negatives to 0).
 * Re-exported from deterministic-kernels for convenience.
 * @see {@link sqrtSafe}
 */
export { sqrtSafe as safeSqrt };

/**
 * Safe deterministic arc cosine (clamps input to [-1, 1]).
 * Re-exported from deterministic-kernels for convenience.
 * @see {@link acosSafe}
 */
export { acosSafe as safeAcos };

/**
 * Safe deterministic arc sine (clamps input to [-1, 1]).
 * Re-exported from deterministic-kernels for convenience.
 * @see {@link asinSafe}
 */
export { asinSafe as safeAsin };

/**
 * Safe logarithm (returns -Infinity for <= 0).
 * @param value - Value to take logarithm of.
 * @param base - Logarithm base (default: Math.E for natural log).
 * @returns Logarithm or -Infinity for non-positive values.
 *
 * @example
 * ```typescript
 * safeLog(Math.E);         // 1
 * safeLog(10, 10);         // 1
 * safeLog(100, 10);        // 2
 * safeLog(0);              // -Infinity
 * safeLog(-1);             // -Infinity
 * ```
 *
 * @category Safety
 * @since 0.7.0
 */
export function safeLog(value: number, base: number = Math.E): number {
 if (value <= 0) {
  return -Infinity;
 }
 return base === Math.E ? log(value) : log(value) / log(base);
}

/**
 * Safe power that handles edge cases.
 * @param base - Base value.
 * @param exponent - Exponent.
 * @returns Result with special case handling.
 *
 * @remarks
 * Handles edge cases like:
 * - 0^0 returns 1 (following JavaScript convention)
 * - Negative base with fractional exponent returns NaN
 * - Prevents overflow/underflow where possible
 *
 * @example
 * ```typescript
 * safePow(2, 3);           // 8
 * safePow(0, 0);           // 1 (by convention)
 * safePow(-2, 0.5);        // NaN (complex result)
 * safePow(10, 1000);       // Infinity (overflow)
 * ```
 *
 * @category Safety
 * @since 0.7.0
 */
export function safePow(base: number, exponent: number): number {
 // Handle special cases
 if (exponent === 0) return 1; // Including 0^0 = 1
 if (base === 0) return 0;
 if (base === 1) return 1;

 // Check for negative base with fractional exponent
 if (base < 0 && exponent % 1 !== 0) {
  return NaN; // Would result in complex number
 }

 return pow(base, exponent);
}

/**
 * Safe modulo that handles negative divisor.
 * @param dividend - Value to divide.
 * @param divisor - Divisor.
 * @returns Modulo result or 0 if divisor is 0.
 *
 * @remarks
 * Unlike the % operator, this ensures the result has the same
 * sign as the divisor (Euclidean modulo).
 *
 * @example
 * ```typescript
 * safeMod(7, 3);       // 1
 * safeMod(-7, 3);      // 2 (not -1)
 * safeMod(7, -3);      // -2 (not 1)
 * safeMod(-7, -3);     // -1
 * safeMod(5, 0);       // 0 (safe fallback)
 * ```
 *
 * @category Safety
 * @since 0.7.0
 */
export function safeMod(dividend: number, divisor: number): number {
 if (divisor === 0) return 0;

 const result = dividend % divisor;

 // Ensure result has same sign as divisor
 if ((result < 0 && divisor > 0) || (result > 0 && divisor < 0)) {
  return result + divisor;
 }

 return result;
}

/**
 * Kahan summation algorithm for improved precision.
 * Compensates for floating-point errors in large sums.
 * @param values - Array of numbers to sum.
 * @returns Sum with reduced rounding error.
 *
 * @example
 * ```typescript
 * // More accurate than naive sum for many small values
 * const values = new Array(1000000).fill(0.1);
 * robustSum(values);  // Closer to 100000 than naive sum
 * ```
 *
 * @category Safety
 * @since 0.7.0
 */
export function robustSum(values: number[]): number {
 return PrecisionMath.kahanSum(values);
}

/**
 * Neumaier summation - improved Kahan algorithm.
 * Even more robust for values of varying magnitudes.
 * @param values - Array of numbers to sum.
 * @returns Sum with minimized error.
 *
 * @example
 * ```typescript
 * neumaierSum([1e10, 1, -1e10]); // 1 (exact)
 * // Naive sum might give 0 due to rounding
 * ```
 *
 * @category Safety
 * @since 0.7.0
 */
export function neumaierSum(values: number[]): number {
 return PrecisionMath.neumaierSum(values);
}

/**
 * Compensated product using error-free transformation.
 * @param a - First factor.
 * @param b - Second factor.
 * @returns Object with product and error term.
 *
 * @example
 * ```typescript
 * const result = compensatedProduct(1.23456789, 9.87654321);
 * // result.product: main product
 * // result.error: rounding error
 * const exact = result.product + result.error;
 * ```
 *
 * @category Safety
 * @since 0.7.0
 */
export function compensatedProduct(a: number, b: number): { product: number; error: number } {
 return PrecisionMath.twoProduct(a, b);
}

/**
 * Safe linear interpolation that avoids overflow.
 * @param a - Start value.
 * @param b - End value.
 * @param t - Interpolation factor.
 * @returns Interpolated value.
 *
 * @example
 * ```typescript
 * // Avoids overflow for large values
 * safeLerp(1e308, 2e308, 0.5); // 1.5e308
 * // Normal lerp might overflow
 * ```
 *
 * @category Safety
 * @since 0.7.0
 */
export function safeLerp(a: number, b: number, t: number): number {
 // Avoid catastrophic cancellation and overflow
 if (t <= 0) return a;
 if (t >= 1) return b;

 // Use different formulas based on t value
 if (t < 0.5) {
  return a + (b - a) * t;
 } else {
  return b - (b - a) * (1 - t);
 }
}

/* ========================================================================== */
/* Sanitization Functions (moved from guards.ts for cohesion)                 */
/* ========================================================================== */

/**
 * Validates and cleans numeric value.
 * @param value - Value to sanitize.
 * @param fallback - Value to use if input is invalid (default: 0).
 * @param min - Minimum allowed value (default: -Number.MAX_VALUE).
 * @param max - Maximum allowed value (default: Number.MAX_VALUE).
 * @returns Clean value or fallback.
 *
 * @remarks
 * Combines validation with clamping. Use when you need to ensure
 * a value is both finite and within a specific range.
 *
 * @example
 * ```typescript
 * sanitizeNumber(42);                    // 42
 * sanitizeNumber(NaN);                   // 0 (fallback)
 * sanitizeNumber(Infinity);              // 0 (fallback)
 * sanitizeNumber(100, 0, 0, 50);         // 50 (clamped to max)
 * sanitizeNumber(-10, 0, 0, 100);        // 0 (clamped to min)
 * sanitizeNumber(NaN, -1);               // -1 (custom fallback)
 * ```
 *
 * @category Safety
 * @since 0.7.0
 */
export function sanitizeNumber(
 value: number,
 fallback: number = 0,
 min: number = -Number.MAX_VALUE,
 max: number = Number.MAX_VALUE,
): number {
 if (!Number.isFinite(value)) {
  return fallback;
 }
 return clamp(value, min, max);
}

/**
 * Ensures finite value, replaces NaN/Infinity.
 * @param value - Value to check.
 * @param fallback - Replacement for non-finite values (default: 0).
 * @returns Finite value or fallback.
 *
 * @remarks
 * Use when you need to guarantee a finite result from calculations
 * that might produce NaN or Infinity.
 *
 * @example
 * ```typescript
 * ensureFinite(42);              // 42
 * ensureFinite(NaN);             // 0
 * ensureFinite(Infinity);        // 0
 * ensureFinite(-Infinity);       // 0
 * ensureFinite(NaN, 1);          // 1 (custom fallback)
 * ```
 *
 * @category Safety
 * @since 0.7.0
 */
export function ensureFinite(value: number, fallback: number = 0): number {
 return Number.isFinite(value) ? value : fallback;
}
