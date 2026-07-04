/**
 * @file auxiliary/scalar/constants.ts
 * @module @lenguados/math2d/auxiliary/scalar
 * @description Mathematical constants for scalar operations
 */

/* ========================================================================== */
/* Tolerance Constants                                                        */
/* ========================================================================== */

/**
 * Default epsilon for floating-point comparisons
 *
 * @remarks
 * This value (1e-10) provides a good balance between:
 * - Precision: Can distinguish values differing by more than 1e-10
 * - Robustness: Absorbs typical floating-point rounding errors
 *
 * For physics simulations, this is sufficient for most 2D calculations.
 * Consider using relative tolerance (relativeEquals) for values with
 * widely varying magnitudes.
 *
 * @constant {number}
 * @category Tolerance
 * @since 0.5.0
 */
export const EPSILON = 1e-10;

/* ========================================================================== */
/* Angular Constants                                                          */
/* ========================================================================== */

/**
 * Mathematical constant π (pi) ≈ 3.14159265358979
 *
 * @constant {number}
 * @category Angular
 * @since 0.5.0
 */
export const PI = Math.PI;

/**
 * Mathematical constant τ (tau) = 2π ≈ 6.28318530717959
 *
 * @remarks
 * Tau represents one full rotation in radians. Some consider it
 * more intuitive than π for angular calculations.
 *
 * @constant {number}
 * @category Angular
 * @since 0.5.0
 */
export const TAU = 2 * Math.PI;

/**
 * Half of π ≈ 1.5707963267949 (90 degrees)
 *
 * @constant {number}
 * @category Angular
 * @since 0.5.0
 */
export const HALF_PI = Math.PI / 2;

/**
 * Quarter of π ≈ 0.785398163397448 (45 degrees)
 *
 * @constant {number}
 * @category Angular
 * @since 0.7.0
 */
export const QUARTER_PI = Math.PI / 4;

/* ========================================================================== */
/* Conversion Factors                                                         */
/* ========================================================================== */

/**
 * Conversion factor from degrees to radians
 *
 * @example
 * ```typescript
 * const radians = 90 * DEG_TO_RAD; // 1.5707963267948966 (π/2)
 * ```
 *
 * @constant {number}
 * @category Conversion
 * @since 0.5.0
 */
export const DEG_TO_RAD = Math.PI / 180;

/**
 * Conversion factor from radians to degrees
 *
 * @example
 * ```typescript
 * const degrees = (Math.PI / 2) * RAD_TO_DEG; // 90
 * ```
 *
 * @constant {number}
 * @category Conversion
 * @since 0.5.0
 */
export const RAD_TO_DEG = 180 / Math.PI;

/**
 * Conversion factor from radians to turns (full rotations)
 *
 * @example
 * ```typescript
 * const turns = (2 * Math.PI) * RAD_TO_TURN; // 1 (2π radians = 1 turn)
 * ```
 *
 * @constant {number}
 * @category Conversion
 * @since 0.7.0
 */
export const RAD_TO_TURN = 1 / TAU;

/**
 * Conversion factor from turns to radians
 *
 * @example
 * ```typescript
 * const radians = 1 * TURN_TO_RAD; // 6.283185307179586 (2π; 1 turn)
 * ```
 *
 * @constant {number}
 * @category Conversion
 * @since 0.7.0
 */
export const TURN_TO_RAD = TAU;

/* ========================================================================== */
/* Mathematical Constants                                                     */
/* ========================================================================== */

/**
 * Square root of 2 ≈ 1.41421356237
 *
 * @remarks
 * The diagonal of a unit square. Commonly used in 2D geometry.
 *
 * @constant {number}
 * @category Mathematical
 * @since 0.7.0
 */
export const SQRT_2 = Math.SQRT2;

/**
 * Square root of 1/2 ≈ 0.707106781187
 *
 * @remarks
 * Equals 1/√2 = √2/2. Common in rotation calculations (45° sin/cos).
 *
 * @constant {number}
 * @category Mathematical
 * @since 0.7.0
 */
export const SQRT_HALF = Math.SQRT1_2;

/**
 * Natural logarithm of 2 ≈ 0.693147180559945
 *
 * @constant {number}
 * @category Mathematical
 * @since 0.7.0
 */
export const LN_2 = Math.LN2;

/**
 * Smallest positive normal number in IEEE 754 double precision
 * Numbers smaller than this (but not zero) are denormal/subnormal.
 *
 * @constant {number}
 * @category Numeric Limits
 * @since 0.7.0
 */
export const SMALLEST_NORMAL = 2.2250738585072014e-308; // 2^-1022
