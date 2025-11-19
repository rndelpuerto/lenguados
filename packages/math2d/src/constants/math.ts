/**
 * @file src/core/constants/math.ts
 * @module math2d/core/constants/math
 * @description Mathematical constants for @lenguados/math2d.
 * 
 * @remarks
 * These constants provide commonly used mathematical values with full precision.
 * They follow standard mathematical conventions and naming from libraries like
 * Math.js, NumPy, and other scientific computing packages.
 */

/**
 * The mathematical constant π (pi).
 * The ratio of a circle's circumference to its diameter.
 * @public
 */
export const PI = Math.PI;

/**
 * Half π (π/2).
 * Represents a quarter turn or 90 degrees in radians.
 * Useful for right-angle calculations and quadrant operations.
 * @public
 */
export const HALF_PI = PI / 2;

/**
 * Quarter π (π/4).
 * Represents an eighth turn or 45 degrees in radians.
 * @public
 */
export const QUARTER_PI = PI / 4;

/**
 * Two π (2π), also known as tau (τ).
 * Represents one full turn or 360 degrees in radians.
 * More natural for many circular/periodic calculations.
 * @public
 */
export const TAU = PI * 2;
export const TWO_PI = TAU; // Alias for compatibility

/**
 * Conversion factor from degrees to radians (π/180).
 * Multiply degrees by this to get radians.
 * @public
 */
export const DEG2RAD = PI / 180;

/**
 * Conversion factor from radians to degrees (180/π).
 * Multiply radians by this to get degrees.
 * @public
 */
export const RAD2DEG = 180 / PI;

/**
 * The mathematical constant e (Euler's number).
 * The base of natural logarithms.
 * @public
 */
export const E = Math.E;

/**
 * Natural logarithm of 2.
 * Useful for binary calculations and information theory.
 * @public
 */
export const LN2 = Math.LN2;

/**
 * Natural logarithm of 10.
 * Useful for decimal calculations and scientific notation.
 * @public
 */
export const LN10 = Math.LN10;

/**
 * Base-2 logarithm of e.
 * @public
 */
export const LOG2E = Math.LOG2E;

/**
 * Base-10 logarithm of e.
 * @public
 */
export const LOG10E = Math.LOG10E;

/**
 * Square root of 2.
 * Length of the diagonal of a unit square.
 * @public
 */
export const SQRT2 = Math.SQRT2;

/**
 * Reciprocal of the square root of 2 (1/√2).
 * Also equal to √2/2 or sin(45°) = cos(45°).
 * @public
 */
export const SQRT1_2 = Math.SQRT1_2;

/**
 * The golden ratio φ (phi).
 * (1 + √5) / 2 ≈ 1.618033988749895
 * @public
 */
export const PHI = (1 + Math.sqrt(5)) / 2;

/**
 * Degrees per radian for quick mental math.
 * 180/π ≈ 57.295779513082321
 * @public
 */
export const DEGREES_PER_RADIAN = RAD2DEG;

/**
 * Radians per degree for quick mental math.
 * π/180 ≈ 0.017453292519943295
 * @public
 */
export const RADIANS_PER_DEGREE = DEG2RAD;
