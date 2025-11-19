/**
 * @file src/numeric.ts
 * @module math2d/numeric
 * @description General-purpose numeric utilities for the Lenguado physics-engine family.
 *
 * This module focuses on low-level numeric robustness:
 * - Safe arithmetic (division, reciprocal, square roots)
 * - Rounding & quantization with arbitrary steps/origins
 * - Modulo & wrapping on intervals (with well-defined behavior for negatives)
 * - Finite/NaN guards and epsilon-based predicates
 *
 * It deliberately avoids interpolation and angle-specific helpers, which live in
 * `interp.ts` and `angle.ts` respectively.
 */

import {
 LINEAR_EPSILON as EPSILON,
 MIN_SAFE_LENGTH as PRECISION_MIN_SAFE_LENGTH,
 MAX_SAFE_LENGTH as PRECISION_MAX_SAFE_LENGTH,
} from './constants/precision';
import { isNearZero as coreIsNearZero, isNearOne as coreIsNearOne } from './core-utils/tolerance';

/* =============================================================================
 * Numeric safety constants
 * =============================================================================
 */

/**
 * Minimum length for extreme underflow protection.
 * This is much more conservative than MIN_SAFE_LENGTH from precision.ts (1e-10)
 * and is based on sqrt(Number.MIN_VALUE) to avoid underflow in extreme calculations.
 * Only use for extreme edge cases; prefer PRECISION_MIN_SAFE_LENGTH for normal operations.
 */
export const EXTREME_MIN_LENGTH = 1.0e-154;

/**
 * Maximum length for extreme overflow protection.
 * This is much more conservative than MAX_SAFE_LENGTH from precision.ts (1e10)
 * and is based on sqrt(Number.MAX_VALUE) to avoid overflow in extreme calculations.
 * Only use for extreme edge cases; prefer PRECISION_MAX_SAFE_LENGTH for normal operations.
 */
export const EXTREME_MAX_LENGTH = 1.0e154;

/**
 * Re-export precision constants for convenience
 */
export { PRECISION_MIN_SAFE_LENGTH, PRECISION_MAX_SAFE_LENGTH };

/**
 * Minimum safe value for division operations.
 * Below this value, division results may be unreliable.
 */
export const MIN_SAFE_DIVISOR = Number.EPSILON;

/* =============================================================================
 * Type guards & predicates
 * =============================================================================
 */

/**
 * Checks whether a value is a finite JavaScript number (excludes NaN/Infinity).
 * @param {unknown} x - Value to test.
 * @returns {x is number} True if finite number.
 */
export function isFiniteNumber(x: unknown): x is number {
 return typeof x === 'number' && Number.isFinite(x);
}

/**
 * Checks if a number is (approximately) zero within a tolerance.
 * @param {number} x - Value to test.
 * @param {number} [eps=EPSILON] - Absolute tolerance.
 * @returns {boolean} True if |x| ≤ eps.
 * @deprecated Use isNearZero from core-utils/tolerance instead
 */
export function approxZero(x: number, eps: number = EPSILON): boolean {
 return coreIsNearZero(x, eps);
}

/**
 * Checks if a number is (approximately) one within a tolerance.
 * @param {number} x - Value to test.
 * @param {number} [eps=EPSILON] - Absolute tolerance.
 * @returns {boolean} True if |x - 1| ≤ eps.
 * @deprecated Use isNearOne from core-utils/tolerance instead
 */
export function approxOne(x: number, eps: number = EPSILON): boolean {
 return coreIsNearOne(x, eps);
}

/**
 * Comparison with tolerance. Returns:
 *  -1 if a < b by more than eps,
 *   1 if a > b by more than eps,
 *   0 if |a - b| ≤ eps.
 * @param {number} a
 * @param {number} b
 * @param {number} [eps=EPSILON]
 * @returns {-1|0|1}
 */
export function compare(a: number, b: number, eps: number = EPSILON): -1 | 0 | 1 {
 const d = a - b;

 if (d > eps) return 1;
 if (d < -eps) return -1;

 return 0;
}

/**
 * Returns true if x is inside [min, max] (inclusive by default).
 * If min > max, bounds are internally swapped.
 * @param {number} x
 * @param {number} min
 * @param {number} max
 * @param {boolean} [inclusive=true] - If false, uses (min, max) open interval.
 * @returns {boolean} True if x is inside [min, max] (inclusive by default).
 */
export function within(x: number, min: number, max: number, inclusive: boolean = true): boolean {
 if (min > max) [min, max] = [max, min];

 return inclusive ? x >= min && x <= max : x > min && x < max;
}

/* =============================================================================
 * Safe arithmetic
 * =============================================================================
 */

/**
 * Safe division: returns `fallback` when |denom| ≤ eps.
 * @param {number} numer - Numerator.
 * @param {number} denom - Denominator.
 * @param {number} [fallback=0] - Value to return if denom ~ 0.
 * @param {number} [eps=EPSILON] - Zero threshold.
 * @returns {number} Safe division result.
 */
// eslint-disable-next-line unicorn/prevent-abbreviations
export function safeDiv(
 numer: number,
 denom: number,
 fallback: number = 0,
 eps: number = EPSILON,
): number {
 return Math.abs(denom) <= eps ? fallback : numer / denom;
}

/**
 * Safe reciprocal: returns `fallback` when |x| ≤ eps.
 * @param {number} x
 * @param {number} [fallback=0]
 * @param {number} [eps=EPSILON]
 * @returns {number} Safe reciprocal result.
 */
export function safeReciprocal(x: number, fallback: number = 0, eps: number = EPSILON): number {
 return Math.abs(x) <= eps ? fallback : 1 / x;
}

/**
 * Square helper: x².
 * @param {number} x
 * @returns {number} x²
 */
export function sqr(x: number): number {
 return x * x;
}

/**
 * Clamped square root: sqrt(max(x, floorValue)).
 * Useful when x is slightly negative due to numeric noise.
 * @param {number} x
 * @param {number} [floorValue=0] - Lower bound before sqrt (typically 0).
 * @returns {number} Clamped square root result.
 */
export function sqrtClamped(x: number, floorValue: number = 0): number {
 const v = x < floorValue ? floorValue : x;

 return Math.sqrt(v);
}

/**
 * Hypotenuse helpers (thin wrappers over Math.hypot).
 * @param {number} x
 * @param {number} y
 * @returns {number} sqrt(x^2 + y^2)
 */
export function hypot2(x: number, y: number): number {
 return Math.hypot(x, y);
}

/**
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @returns {number} sqrt(x^2 + y^2 + z^2)
 */
export function hypot3(x: number, y: number, z: number): number {
 return Math.hypot(x, y, z);
}

/* =============================================================================
 * Modulo & wrapping
 * =============================================================================
 */

/**
 * Euclidean modulo with well-defined range in [0, |m|).
 * Degenerates to 0 when |m| ≤ eps.
 * @param {number} x - Dividend.
 * @param {number} m - Modulus (period).
 * @param {number} [eps=EPSILON]
 * @returns {number} Value in [0, |m|) for m > 0.
 */
// eslint-disable-next-line unicorn/prevent-abbreviations
export function euclideanMod(x: number, m: number, eps: number = EPSILON): number {
 const period = Math.abs(m);

 if (period <= eps) return 0;

 const r = x % period;

 return r < 0 ? r + period : r;
}

/**
 * Wraps x into the half-open interval [min, max).
 * If min > max, bounds are internally swapped.
 * If min === max, returns min (degenerate interval).
 * @param {number} x
 * @param {number} min
 * @param {number} max
 * @param {number} [eps=EPSILON]
 * @returns {number} Value in [min, max) for m > 0.
 */
export function wrap(x: number, min: number, max: number, eps: number = EPSILON): number {
 if (min === max) return min;

 if (min > max) [min, max] = [max, min];

 const period = max - min;

 if (period <= eps) return min; // effectively a point

 return min + euclideanMod(x - min, period, eps);
}

/**
 * Wraps x to [0, 1).
 * @param {number} x
 * @param {number} [eps=EPSILON]
 * @returns {number} Value in [0, 1) for m > 0.
 */
export function wrap01(x: number, eps: number = EPSILON): number {
 return euclideanMod(x, 1, eps);
}

/**
 * Wraps x to [offset, offset + period).
 * @param {number} x
 * @param {number} period - Positive or negative; magnitude is used.
 * @param {number} [offset=0]
 * @param {number} [eps=EPSILON]
 * @returns {number} Value in [offset, offset + period) for m > 0.
 */
export function wrapPeriod(
 x: number,
 period: number,
 offset: number = 0,
 eps: number = EPSILON,
): number {
 const p = Math.abs(period);

 if (p <= eps) return offset;

 return offset + euclideanMod(x - offset, p, eps);
}

/* =============================================================================
 * Clamping (unordered) & range helpers
 * =============================================================================
 */

/**
 * Clamps x to the (inclusive) range [a, b] with unordered bounds.
 * If a > b, bounds are internally swapped.
 * @param {number} x
 * @param {number} a
 * @param {number} b
 * @returns {number} Clamped value.
 */
export function clampUnordered(x: number, a: number, b: number): number {
 if (a > b) [a, b] = [b, a];

 return x < a ? a : x > b ? b : x;
}

/* =============================================================================
 * Rounding & quantization
 * =============================================================================
 */

/**
 * Banker's rounding (round half to even).
 * For halves (|frac - 0.5| ≤ eps), chooses the nearest even integer.
 * @param {number} x
 * @param {number} [eps=EPSILON] - Half detection tolerance.
 * @returns {number} Rounded value.
 */
export function roundEven(x: number, eps: number = EPSILON): number {
 const f = Math.floor(x);
 const frac = x - f;

 if (Math.abs(frac - 0.5) <= eps) {
  return f % 2 === 0 ? f : f + 1;
 }

 return Math.round(x);
}

/**
 * Rounds x to a multiple of `step`, around an optional `origin`.
 * If |step| ≤ eps, returns x (no-op).
 * @param {number} x
 * @param {number} step - Quantization step (> 0 recommended).
 * @param {number} [origin=0] - Center/offset of the grid.
 * @param {number} [eps=EPSILON]
 * @returns {number} Rounded value.
 */
export function roundTo(
 x: number,
 step: number,
 origin: number = 0,
 eps: number = EPSILON,
): number {
 const s = Math.abs(step);

 if (s <= eps) return x;

 return origin + Math.round((x - origin) / s) * s;
}

/**
 * Floors x to a multiple of `step`, around an optional `origin`.
 * If |step| ≤ eps, returns x.
 * @param {number} x
 * @param {number} step
 * @param {number} [origin=0]
 * @param {number} [eps=EPSILON]
 * @returns {number} Rounded value.
 */
export function floorTo(
 x: number,
 step: number,
 origin: number = 0,
 eps: number = EPSILON,
): number {
 const s = Math.abs(step);

 if (s <= eps) return x;

 return origin + Math.floor((x - origin) / s) * s;
}

/**
 * Ceils x to a multiple of `step`, around an optional `origin`.
 * If |step| ≤ eps, returns x.
 * @param {number} x
 * @param {number} step
 * @param {number} [origin=0]
 * @param {number} [eps=EPSILON]
 * @returns {number} Rounded value.
 */
export function ceilTo(x: number, step: number, origin: number = 0, eps: number = EPSILON): number {
 const s = Math.abs(step);

 if (s <= eps) return x;

 return origin + Math.ceil((x - origin) / s) * s;
}

/**
 * Truncates x to a multiple of `step` using Math.trunc, around an `origin`.
 * If |step| ≤ eps, returns x.
 * @param {number} x
 * @param {number} step
 * @param {number} [origin=0]
 * @param {number} [eps=EPSILON]
 * @returns {number} Rounded value.
 */
export function truncTo(
 x: number,
 step: number,
 origin: number = 0,
 eps: number = EPSILON,
): number {
 const s = Math.abs(step);

 if (s <= eps) return x;

 return origin + Math.trunc((x - origin) / s) * s;
}

/**
 * Quantizes x to the nearest grid point of size `step`, around `origin`.
 * Alias of `roundTo` provided for semantic clarity.
 * @param {number} x
 * @param {number} step
 * @param {number} [origin=0]
 * @param {number} [eps=EPSILON]
 * @returns {number} Rounded value.
 */
export function quantize(
 x: number,
 step: number,
 origin: number = 0,
 eps: number = EPSILON,
): number {
 return roundTo(x, step, origin, eps);
}

/* =============================================================================
 * Guards & coalescing
 * =============================================================================
 */

/**
 * Returns `x` if it is finite; otherwise returns `fallback`.
 * @param {number} x
 * @param {number} [fallback=0]
 * @returns {number} `x` if it is finite; otherwise returns `fallback`.
 */
export function finiteOr(x: number, fallback: number = 0): number {
 return Number.isFinite(x) ? x : fallback;
}

/**
 * Returns `x` unless it is NaN; in that case returns `fallback`.
 * @param {number} x
 * @param {number} [fallback=0]
 * @returns {number} `x` unless it is NaN; in that case returns `fallback`.
 */
export function nanTo(x: number, fallback: number = 0): number {
 return Number.isNaN(x) ? fallback : x;
}
