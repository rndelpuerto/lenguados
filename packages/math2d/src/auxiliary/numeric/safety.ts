/**
 * @file auxiliary/numeric/safety.ts
 * @module @lenguados/math2d/auxiliary/numeric
 * @description Safe arithmetic operations that handle edge cases gracefully
 *
 * @remarks
 * This module provides operations that substitute a caller-chosen fallback
 * (or zero) for **domain violations** — not for every non-finite input. The
 * Safe contract is "finite-in, finite-out for valid domain; fallback on
 * domain error; NaN propagates through unchanged". Examples:
 *
 * - `divideSafe(1, 0) → fallback` (domain violation: division by zero).
 * - `divideSafe(Infinity, 2) → Infinity` (IEEE 754 arithmetic; not a domain
 *   violation — `Infinity / finite` is well-defined).
 * - `divideSafe(1, NaN) → NaN` (NaN propagates per IEEE 754-2019 §6.2).
 * - `sqrtSafe(-1) → fallback` (domain violation: negative radicand).
 * - `sqrtSafe(NaN) → NaN` (NaN propagates).
 *
 * For boolean predicates (type guards), see {@link ./guards}. For the
 * strict-variant assertions that throw on invalid input, see
 * `validation/assert.ts` and the reciprocal `@see` cross-links.
 *
 * **Determinism Guarantee**: Mathematical operations that could vary across
 * JavaScript engines are delegated to deterministic-kernels.
 *
 * @see {@link ../../validation/assert} - Assertion cousins that throw on invalid input
 */

import { acos, asin, exp, log, pow } from '../../deterministic/deterministic-kernels';
import { HALF_PI, PI } from '../scalar/constants';

/* ========================================================================== */
/* DEV_MODE flag (DCE-friendly)                                                */
/* ========================================================================== */

/**
 * Development-mode flag used by dev-only assertions inside L1 safety functions
 *
 * @remarks
 * Replaced by the build-time constant substitution (configured in `rollup.config.mjs`
 * `jsc.transform.optimizer.globals.vars.__LENGUADOS_DEV__`): `false` in production
 * library bundles, `true` in development library bundles. The minifier
 * eliminates `if (DEV_MODE) { ... }` and `if (!DEV_MODE) { ... }` blocks at
 * library build time, so production library bundles are self-contained and
 * have zero dev-assertion overhead.
 *
 * @internal
 */
declare const __LENGUADOS_DEV__: boolean;
/* istanbul ignore next -- DCE */
const DEV_MODE: boolean = __LENGUADOS_DEV__;
/**
 * Minimum safe value for division operations
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
 * Common values in game engines and graphics libraries range from `1e-8` to
 * `~1.19e-7` (float32 epsilon). The value `1e-10` is more conservative,
 * appropriate for double-precision arithmetic.
 *
 * @constant {number}
 * @category Safety
 * @since 0.7.0
 */
export const MIN_SAFE_DIVISOR = 1e-10;

/**
 * Safe division with fallback to 0
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
 * @see {@link assertNonZero} - Strict assertion variant that throws on zero input
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
 * Safe reciprocal (1/x)
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
 * Safe square root (clamps negative values to 0)
 *
 * @remarks
 * Uses `Math.sqrt` which is IEEE 754 required — correctly rounded and
 * deterministic across all platforms.
 *
 * @param x - Value to compute square root of
 * @returns Square root of x, or 0 for negative values
 *
 * @see {@link assertNonNegative} - Strict assertion variant that throws on negative input
 *
 * @category Safety
 * @since 0.7.0
 */
export function sqrtSafe(x: number): number {
 return x <= 0 ? 0 : Math.sqrt(x);
}

/**
 * Safe deterministic arc cosine (clamps input to [-1, 1])
 *
 * @remarks
 * Uses deterministic math for cross-platform reproducibility.
 * Returns PI for x <= -1, 0 for x >= 1, deterministic acos(x) otherwise.
 *
 * @param x - Any value (will be clamped to [-1, 1])
 * @returns acos(clamp(x, -1, 1))
 *
 * @see {@link acos} from deterministic-kernels — returns NaN for out-of-range inputs
 *
 * @category Safety
 * @since 0.7.0
 */
export function acosSafe(x: number): number {
 if (x <= -1) return PI;
 if (x >= 1) return 0;
 return acos(x);
}

/**
 * Safe deterministic arc sine (clamps input to [-1, 1])
 *
 * @remarks
 * Uses deterministic math for cross-platform reproducibility.
 * Returns -PI/2 for x <= -1, PI/2 for x >= 1, deterministic asin(x) otherwise.
 *
 * @param x - Any value (will be clamped to [-1, 1])
 * @returns asin(clamp(x, -1, 1))
 *
 * @see {@link asin} from deterministic-kernels — returns NaN for out-of-range inputs
 *
 * @category Safety
 * @since 0.7.0
 */
export function asinSafe(x: number): number {
 if (x <= -1) return -HALF_PI;
 if (x >= 1) return HALF_PI;
 return asin(x);
}

/**
 * Computes the natural or base-`b` logarithm, returning `0` as a fallback for non-positive input
 *
 * @remarks
 * NaN propagates per IEEE 754 §6.2: NaN in → NaN out. The `0` fallback triggers
 * only for domain errors (non-positive `value`, invalid `base`), never for NaN.
 * Finite-positive inputs flow through the deterministic `log` kernel. Returns
 * `+Infinity` for `value === +Infinity` per IEEE 754.
 *
 * **References**: IEEE 754-2019 §6.2, C99 Annex F §F.10 ¶11, Kahan 1997.
 *
 * @param value - Value to take logarithm of
 * @param base - Logarithm base (default: Math.E for natural log)
 * @returns Natural or base-`b` log; `NaN` when any input is NaN; `0` for non-positive
 *          `value` or invalid `base`
 *
 * @example
 * ```typescript
 * logSafe(Math.E);         // 1
 * logSafe(10, 10);         // 1
 * logSafe(100, 10);        // 2
 * logSafe(0);              // 0 (domain fallback)
 * logSafe(-1);             // 0 (domain fallback)
 * logSafe(NaN);            // NaN (propagates per IEEE 754 §6.2)
 * logSafe(Infinity);       // Infinity (IEEE 754 required)
 * ```
 *
 * @see {@link log} - deterministic strict kernel
 *
 * @category Safety
 * @since 0.7.0
 */
export function logSafe(value: number, base: number = Math.E): number {
 // NaN short-circuits BEFORE the domain check per the canonical Safe contract (IEEE 754 §6.2).
 if (value !== value || base !== base) return Number.NaN;
 if (value <= 0) return 0;
 if (base <= 0 || base === 1 || !Number.isFinite(base)) return 0;
 return base === Math.E ? log(value) : log(value) / log(base);
}

/**
 * Safe exponential function (handles extreme values gracefully)
 *
 * @remarks
 * Uses deterministic math for cross-platform reproducibility.
 * Returns Number.MAX_VALUE for positive overflow (not Infinity) and 0 for
 * negative overflow, maintaining the Safe contract (finite-in/finite-out).
 *
 * @param x - Exponent value
 * @returns e^x, clamped to finite range
 *
 * @category Safety
 * @since 0.7.0
 */
export function expSafe(x: number): number {
 if (x !== x) return NaN;
 const result = exp(x);
 if (!Number.isFinite(result)) return result > 0 ? Number.MAX_VALUE : 0;
 return result;
}

/**
 * Safe power that handles edge cases
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
 * This matches IEEE 754 §9.2, C99 `pow()`, and every major math library.
 * Returning a finite fallback like 0 would be mathematically misleading
 * and inconsistent with universal convention.
 *
 * Note: 0^(-n) returns 0 (finite fallback per Safe contract, not mathematical Infinity).
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
 // IEEE 754 pow semantics (not powr): x^0 = 1 for ANY x, including NaN
 // See IEEE 754-2019 §9.2.1, C99 §7.12.7.4, ECMAScript Math.pow spec
 if (exponent === 0) return 1; // Including NaN^0 = 1, 0^0 = 1
 // NaN propagation for all non-zero exponents
 if (base !== base) return NaN;
 if (base === 0) return 0;
 if (base === 1) return 1;

 // Check for negative base with fractional exponent
 if (base < 0 && exponent % 1 !== 0) {
  return NaN; // Would result in complex number
 }

 return pow(base, exponent);
}

/**
 * Kahan compensated summation for improved precision
 *
 * @remarks
 * Kahan compensated summation (1965). The branchless inner loop makes it
 * faster than {@link neumaierSum} for hot-path accumulation where all values
 * have similar magnitude. For inputs of varying scale, prefer
 * {@link neumaierSum} which handles mixed magnitudes more accurately.
 *
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
 * @see {@link neumaierSum} - improved variant for varying-magnitude inputs
 * @category Safety
 * @since 0.7.0
 */
export function robustSum(values: readonly number[]): number {
 let sum = 0;
 let compensation = 0;

 // NaN and Infinity propagate per IEEE 754-2019 §6.2 / §6.3: any NaN in the
 // input flows through to the result; `+Infinity + (-Infinity)` yields NaN;
 // pure-`+Infinity` streams yield `+Infinity`.
 for (const value of values) {
  const y = value - compensation;
  const t = sum + y;
  compensation = t - sum - y;
  sum = t;
 }

 return sum;
}

/**
 * Neumaier compensated summation for improved precision
 *
 * @remarks
 * Improved compensated summation (Neumaier, 1974). More accurate than
 * {@link robustSum} for inputs of varying magnitude due to the
 * comparison-based compensation. For uniform-magnitude hot-path
 * accumulation, {@link robustSum} may be marginally faster (branchless).
 *
 * @param values - Array of numbers to sum
 * @returns Sum with minimized error
 *
 * @example
 * ```typescript
 * neumaierSum([1e10, 1, -1e10]); // 1 (exact)
 * // Naive sum might give 0 due to rounding
 * ```
 *
 * @see {@link robustSum} - branchless Kahan variant for uniform-magnitude hot paths
 * @category Safety
 * @since 0.7.0
 */
export function neumaierSum(values: readonly number[]): number {
 let sum = 0;
 let compensation = 0;

 // NaN and Infinity propagate per IEEE 754 §6.2 / §6.3.
 // Matches Python `statistics.fsum` semantics — non-finite inputs flow through.
 for (const value of values) {
  const t = sum + value;

  if (Math.abs(sum) >= Math.abs(value)) {
   // sum is bigger, low-order digits of value are lost
   compensation += sum - t + value;
  } else {
   // value is bigger, low-order digits of sum are lost
   compensation += value - t + sum;
  }

  sum = t;
 }

 return sum + compensation;
}

/**
 * Compensated product using error-free transformation
 *
 * @remarks
 * Veltkamp splitting multiplies inputs by `2^27 + 1` (~1.34e8).
 * This overflows for `|a|` or `|b|` > ~1.34e300 (`MAX_VALUE / 134217729`).
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
 * @example
 * ```typescript
 * // High-precision dot product using compensated multiplication
 * const { product: p1, error: e1 } = compensatedProduct(a.x, b.x);
 * const { product: p2, error: e2 } = compensatedProduct(a.y, b.y);
 * const preciseDot = (p1 + p2) + (e1 + e2);
 * ```
 *
 * @category Safety
 * @since 0.7.0
 */
export function compensatedProduct(a: number, b: number): { product: number; error: number } {
 // NaN and Infinity propagate per IEEE 754-2019 §6.2 / §6.3: the product follows
 // IEEE arithmetic — NaN × anything = NaN; Infinity × 0 = NaN.
 const product = a * b;

 // Veltkamp splitting for error-free multiplication (overflow-unsafe beyond |x| > ~1.34e300).
 const split = 134217729; // 2^27 + 1

 // Split a
 const c = split * a;
 const aHigh = c - (c - a);
 const aLow = a - aHigh;

 // Split b
 const d = split * b;
 const bHigh = d - (d - b);
 const bLow = b - bHigh;

 // Compute error term
 const error1 = product - aHigh * bHigh;
 const error2 = error1 - aLow * bHigh;
 const error3 = error2 - aHigh * bLow;
 const error = aLow * bLow - error3;

 return { product, error };
}

/**
 * Ensures finite value, replaces NaN/Infinity
 *
 * @remarks
 * Use when you need to guarantee a finite result from calculations
 * that might produce NaN or Infinity.
 *
 * If the fallback itself is non-finite, production builds silently replace it
 * with 0; development builds throw a RangeError to surface the caller error.
 *
 * @param value - Value to check
 * @param fallback - Replacement for non-finite values (default: 0)
 * @returns Finite value or fallback
 *
 * @throws {RangeError} In development builds, if fallback is non-finite
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
 * @see {@link assertFinite} - Strict assertion variant that throws on non-finite input
 *
 * @category Safety
 * @since 0.7.0
 */
export function ensureFinite(value: number, fallback: number = 0): number {
 // DEV-mode fallback guard. In production this branch is DCE'd;
 // in development it signals to the caller that the provided `fallback` is itself
 // non-finite (typically a bug in the caller's fallback-computation path).
 /* istanbul ignore next -- DCE */
 if (DEV_MODE && !Number.isFinite(fallback)) {
  throw new RangeError(
   `ensureFinite: fallback must be finite (got ${fallback}); replace the caller-supplied fallback with a finite value`,
  );
 }
 if (!Number.isFinite(fallback)) fallback = 0;
 return Number.isFinite(value) ? value : fallback;
}
