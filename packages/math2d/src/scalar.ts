/**
 * @file src/scalar.ts
 * @module math2d/scalar
 * @description Core scalar constants and utility functions for the Lenguado physics-engine family.
 */

/**
 * The mathematical constant π (pi).
 * @constant {number}
 */
export const PI = Math.PI;

/**
 * Half π (π / 2), used for right-angle and axis-aligned calculations.
 * @constant {number}
 */
export const HALF_PI = PI / 2;

/**
 * Tau (2π), representing one full revolution in radians.
 * @constant {number}
 */
export const TAU = PI * 2;

/**
 * Conversion factor from degrees to radians (π / 180).
 * @constant {number}
 */
export const DEG2RAD = PI / 180;

/**
 * Conversion factor from radians to degrees (180 / π).
 * @constant {number}
 */
export const RAD2DEG = 180 / PI;

/**
 * A small tolerance for geometry and physics floating-point comparisons.
 * @constant {number}
 */
export const EPSILON = 1e-6;

/**
 * Clamps a value to the inclusive range [min, max].
 * @param {number} x - The value to clamp.
 * @param {number} min - Lower bound of the range.
 * @param {number} max - Upper bound of the range.
 * @returns {number} The clamped value.
 */
export function clamp(x: number, min: number, max: number): number {
 return x < min ? min : x > max ? max : x;
}

/**
 * Returns the sign of a number: -1 if negative, +1 if positive, 0 if zero.
 * @param {number} x - Input number.
 * @returns {number} Sign of x.
 */
export function sign(x: number): number {
 return x < 0 ? -1 : x > 0 ? 1 : 0;
}

/**
 * Performs linear interpolation between two values.
 * @param {number} a - Start value.
 * @param {number} b - End value.
 * @param {number} t - Interpolation factor in [0, 1].
 * @returns {number} Interpolated value.
 */
export function lerp(a: number, b: number, t: number): number {
 return a + (b - a) * t;
}

/**
 * Maps a value from [min, max] into [0, 1], clamped.
 * @param {number} x - The value to normalize.
 * @param {number} min - Lower bound of the input range.
 * @param {number} max - Upper bound of the input range.
 * @returns {number} Normalized and clamped value in [0, 1].
 */
export function normalize(x: number, min: number, max: number): number {
 return clamp((x - min) / (max - min), 0, 1);
}

/**
 * Performs smoothstep interpolation between two edges.
 * Produces a smooth transition with zero derivatives at the boundaries.
 * Typically used for eased interpolation between 0 and 1.
 *
 * @param {number} edge0 - Lower edge of the interpolation.
 * @param {number} edge1 - Upper edge of the interpolation.
 * @param {number} x - Value to interpolate.
 * @returns {number} Result in [0, 1].
 * @example
 * // Ease in/out from 0 at x = 0 to 1 at x = 1
 * smoothStep(0, 1, 0.5); // → 0.5
 */
export function smoothStep(edge0: number, edge1: number, x: number): number {
 const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);

 return t * t * (3 - 2 * t);
}

/**
 * Checks if two numbers are approximately equal within an absolute tolerance.
 * @param {number} a - First number.
 * @param {number} b - Second number.
 * @param {number} [eps=EPSILON] - Comparison tolerance.
 * @returns {boolean} True if the absolute difference ≤ eps.
 */
export function epsilonEquals(a: number, b: number, eps: number = EPSILON): boolean {
 return Math.abs(a - b) <= eps;
}

/**
 * Determine if two numbers are approximately equal within a relative tolerance.
 *
 * Compares |x - y| against relEps * max(1, |x|, |y|), ensuring stability near zero.
 *
 * @param {number} x - First value to compare.
 * @param {number} y - Second value to compare.
 * @param {number} [relEps=EPSILON] - Relative tolerance fraction.
 * @throws {RangeError} If relEps is negative.
 * @returns {boolean} True if within the scaled tolerance.
 * @see EPSILON
 * @example
 * // Relative compare: allows 1% difference
 * relativeEquals(100, 101, 0.01); // → true
 */
export function relativeEquals(x: number, y: number, relEps: number = EPSILON): boolean {
 if (relEps < 0) {
  throw new RangeError('relativeEquals: relEps must be non-negative');
 }

 const scale = Math.max(1, Math.abs(x), Math.abs(y));
 const threshold = relEps * scale;

 return epsilonEquals(x, y, threshold);
}

/**
 * Restricts a value to the range [0, 1].
 * @param {number} x - Input value.
 * @returns {number} Saturated value.
 * @see clamp
 */
export function saturate(x: number): number {
 return clamp(x, 0, 1);
}
