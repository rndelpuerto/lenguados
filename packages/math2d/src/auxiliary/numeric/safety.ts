/**
 * @file auxiliary/numeric/safety.ts
 * @module @lenguados/math2d/auxiliary/numeric
 * @description Safe arithmetic operations that handle edge cases gracefully
 *
 * @remarks
 * This module provides operations that return safe numeric values
 * instead of NaN/Infinity. For boolean predicates (type guards),
 * see {@link ./guards}.
 *
 * **Determinism Guarantee**: Mathematical operations that could vary across
 * JavaScript engines are delegated to deterministic-kernels.
 */

import { acosSafe, asinSafe, log, pow } from '../../deterministic/deterministic-kernels';
import { clamp } from '../scalar/arithmetic';
/**
 * Minimum safe value for division operations.
 * Below this value, division results may produce numerically degenerate outputs
 * in geometric contexts (normalization, inverse, projection).
 *
 * @remarks
 * Independently defined at `1e-10`. This value matches {@link EPSILON} by design
 * because both represent the application-level threshold below which quantities
 * are geometrically insignificant for a 2D physics engine. However, they are
 * separate constants serving different purposes:
 * - `EPSILON`: geometric comparison tolerance ("are these values approximately equal?")
 * - `MIN_SAFE_DIVISOR`: division safety threshold ("will dividing by this produce garbage?")
 *
 * For reference, Unreal Engine uses `SMALL_NUMBER = 1e-8` for a similar role,
 * Ogre3D uses `1e-8`, and Box2D uses `FLT_EPSILON` (~1.19e-7, float32).
 * Our value of `1e-10` is more conservative, appropriate for double precision.
 *
 * @constant {number}
 * @category Safety
 * @since 0.7.0
 */
export const MIN_SAFE_DIVISOR = 1e-10;

/**
 * Safe division with fallback to 0.
 *
 * @remarks
 * Default threshold is {@link MIN_SAFE_DIVISOR} (1e-10).
 * Returns 0 when |denominator| < epsilon, preventing Infinity/NaN from
 * near-zero division. Used internally by core types for `inverseSafe` and
 * `normalizeSafe` operations.
 *
 * @param numerator - Dividend
 * @param denominator - Divisor
 * @param epsilon - Minimum safe divisor (default: MIN_SAFE_DIVISOR)
 * @returns Result or 0 if denominator is too small
 *
 * @example
 * ```typescript
 * divideSafe(10, 2);              // 5
 * divideSafe(10, 0);              // 0 (safe fallback)
 * divideSafe(10, 1e-11);          // 0 (below epsilon)
 * divideSafe(10, 0, 0.1);         // 0 (custom epsilon)
 * ```
 *
 * @category Safety
 * @since 0.7.0
 */
export function divideSafe(
 numerator: number,
 denominator: number,
 epsilon: number = MIN_SAFE_DIVISOR,
): number {
 return Math.abs(denominator) < epsilon ? 0 : numerator / denominator;
}

/**
 * Safe reciprocal (1/x).
 *
 * @remarks
 * Default threshold is {@link MIN_SAFE_DIVISOR} (1e-10).
 * Returns 0 when |value| < epsilon, preventing Infinity from near-zero
 * reciprocal. Equivalent to `divideSafe(1, value, epsilon)`.
 *
 * @param value - Value to invert
 * @param epsilon - Minimum safe value (default: MIN_SAFE_DIVISOR)
 * @returns Reciprocal or 0 if value is too small
 *
 * @example
 * ```typescript
 * reciprocalSafe(2);           // 0.5
 * reciprocalSafe(0);           // 0 (safe fallback)
 * reciprocalSafe(1e-11);       // 0 (below epsilon)
 * ```
 *
 * @category Safety
 * @since 0.7.0
 */
export function reciprocalSafe(value: number, epsilon: number = MIN_SAFE_DIVISOR): number {
 return Math.abs(value) < epsilon ? 0 : 1 / value;
}

/* ========================================================================== */
/* Re-exports from deterministic-kernels                                       */
/* ========================================================================== */

/**
 * Safe square root (clamps negative values to 0).
 *
 * @remarks
 * Uses `Math.sqrt` which is IEEE 754 required — correctly rounded and
 * deterministic across all platforms.
 *
 * @param x - Value to compute square root of
 * @returns Square root of x, or 0 for negative values
 *
 * @category Safety
 * @since 0.7.0
 */
export function sqrtSafe(x: number): number {
 return x <= 0 ? 0 : Math.sqrt(x);
}

/**
 * Safe deterministic arc cosine (clamps input to [-1, 1]).
 * Re-exported from deterministic-kernels for convenience.
 *
 * @remarks Uses deterministic math for cross-platform reproducibility.
 *
 * @category Safety
 * @since 0.7.0
 */
export { acosSafe };

/**
 * Safe deterministic arc sine (clamps input to [-1, 1]).
 * Re-exported from deterministic-kernels for convenience.
 *
 * @remarks Uses deterministic math for cross-platform reproducibility.
 *
 * @category Safety
 * @since 0.7.0
 */
export { asinSafe };

/**
 * Safe logarithm (returns 0 for non-positive values).
 *
 * @remarks
 * Uses deterministic math for cross-platform reproducibility.
 * Returns 0 (not -Infinity) for non-positive inputs, consistent
 * with the Safe convention: fallbacks are always finite and usable.
 *
 * @param value - Value to take logarithm of
 * @param base - Logarithm base (default: Math.E for natural log)
 * @returns Logarithm or 0 for non-positive values
 *
 * @example
 * ```typescript
 * logSafe(Math.E);         // 1
 * logSafe(10, 10);         // 1
 * logSafe(100, 10);        // 2
 * logSafe(0);              // 0 (safe fallback)
 * logSafe(-1);             // 0 (safe fallback)
 * ```
 *
 * @category Safety
 * @since 0.7.0
 */
export function logSafe(value: number, base: number = Math.E): number {
 if (value <= 0) {
  return 0;
 }
 if (base <= 0 || base === 1 || !Number.isFinite(base)) {
  return 0;
 }
 return base === Math.E ? log(value) : log(value) / log(base);
}

/**
 * Safe power that handles edge cases.
 *
 * @remarks
 * Uses deterministic math for cross-platform reproducibility.
 * Handles edge cases like:
 * - 0^0 returns 1 (following JavaScript convention)
 * - Negative base with fractional exponent returns NaN
 * - Prevents overflow/underflow where possible
 *
 * **Note on Safe convention exception**: Unlike other `*Safe` functions
 * that always return finite values, `powSafe(-x, frac)` returns NaN because
 * this case is mathematically undefined in ℝ (the result is complex).
 * This matches IEEE 754 §9.2, C99 `pow()`, and every industrial math library
 * (Unity, GLM, Eigen, Three.js). Returning a finite fallback like 0 would be
 * mathematically misleading and inconsistent with universal external convention.
 *
 * @param base - Base value
 * @param exponent - Exponent
 * @returns Result with special case handling
 *
 * @example
 * ```typescript
 * powSafe(2, 3);           // 8
 * powSafe(0, 0);           // 1 (by convention)
 * powSafe(-2, 0.5);        // NaN (complex result)
 * powSafe(10, 1000);       // Infinity (overflow)
 * ```
 *
 * @category Safety
 * @since 0.7.0
 */
export function powSafe(base: number, exponent: number): number {
 // NaN propagation
 if (base !== base) return NaN;
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
 * Kahan summation algorithm for improved precision.
 * Compensates for floating-point errors in large sums.
 * @param values - Array of numbers to sum
 * @returns Sum with reduced rounding error
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
export function robustSum(values: readonly number[]): number {
 let sum = 0;
 let compensation = 0;

 for (const value of values) {
  // Sanitize: non-finite values become 0
  const sanitized = Number.isFinite(value) ? value : 0;
  const y = sanitized - compensation;
  const t = sum + y;
  compensation = t - sum - y;
  sum = t;
 }

 return sum;
}

/**
 * Neumaier summation - improved Kahan algorithm.
 * Even more robust for values of varying magnitudes.
 * @param values - Array of numbers to sum
 * @returns Sum with minimized error
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
export function neumaierSum(values: readonly number[]): number {
 let sum = 0;
 let compensation = 0;

 for (const value of values) {
  // Sanitize: non-finite values become 0
  const sanitized = Number.isFinite(value) ? value : 0;
  const t = sum + sanitized;

  if (Math.abs(sum) >= Math.abs(sanitized)) {
   // sum is bigger, low-order digits of value are lost
   compensation += sum - t + sanitized;
  } else {
   // value is bigger, low-order digits of sum are lost
   compensation += sanitized - t + sum;
  }

  sum = t;
 }

 return sum + compensation;
}

/**
 * Compensated product using error-free transformation.
 *
 * @remarks
 * Veltkamp splitting multiplies inputs by `2^27 + 1` (~1.34e8).
 * This overflows for `|a|` or `|b|` > ~1.34e291 (`MAX_VALUE / 134217729`).
 * For such inputs, the error term will be unreliable (Infinity/NaN).
 *
 * @param a - First factor
 * @param b - Second factor
 * @returns Object with product and error term
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
 // Sanitize: non-finite values become 0
 const sanitizedA = Number.isFinite(a) ? a : 0;
 const sanitizedB = Number.isFinite(b) ? b : 0;
 const product = sanitizedA * sanitizedB;

 // Veltkamp splitting for error-free multiplication
 const split = 134217729; // 2^27 + 1

 // Split a
 const c = split * sanitizedA;
 const aHigh = c - (c - sanitizedA);
 const aLow = sanitizedA - aHigh;

 // Split b
 const d = split * sanitizedB;
 const bHigh = d - (d - sanitizedB);
 const bLow = sanitizedB - bHigh;

 // Compute error term
 const error1 = product - aHigh * bHigh;
 const error2 = error1 - aLow * bHigh;
 const error3 = error2 - aHigh * bLow;
 const error = aLow * bLow - error3;

 return { product, error };
}

/**
 * Safe linear interpolation that avoids overflow.
 * @param a - Start value
 * @param b - End value
 * @param t - Interpolation factor
 * @returns Interpolated value
 *
 * @example
 * ```typescript
 * // Avoids overflow for large values
 * lerpSafe(1e308, 2e308, 0.5); // 1.5e308
 * // Normal lerp might overflow
 * ```
 *
 * @category Safety
 * @since 0.7.0
 */
export function lerpSafe(a: number, b: number, t: number): number {
 // Avoid catastrophic cancellation and overflow
 if (t <= 0) return a;
 if (t >= 1) return b;

 // Distributive form prevents overflow when a and b have opposite signs
 return a * (1 - t) + b * t;
}

/* ========================================================================== */
/* Sanitization Functions (moved from guards.ts for cohesion)                 */
/* ========================================================================== */

/**
 * Validates and cleans numeric value.
 *
 * @remarks
 * Combines validation with clamping. Use when you need to ensure
 * a value is both finite and within a specific range.
 *
 * @param value - Value to sanitize
 * @param fallback - Value to use if input is invalid (default: 0)
 * @param min - Minimum allowed value (default: -Number.MAX_VALUE)
 * @param max - Maximum allowed value (default: Number.MAX_VALUE)
 * @returns Clean value or fallback
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
  return clamp(fallback, min, max);
 }
 return clamp(value, min, max);
}

/**
 * Ensures finite value, replaces NaN/Infinity.
 *
 * @remarks
 * Use when you need to guarantee a finite result from calculations
 * that might produce NaN or Infinity.
 *
 * @param value - Value to check
 * @param fallback - Replacement for non-finite values (default: 0)
 * @returns Finite value or fallback
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
 if (!Number.isFinite(fallback)) fallback = 0;
 return Number.isFinite(value) ? value : fallback;
}
