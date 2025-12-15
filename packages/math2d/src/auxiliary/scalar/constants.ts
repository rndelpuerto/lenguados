/**
 * @file auxiliary/scalar/constants.ts
 * @module @lenguados/math2d/auxiliary/scalar
 * @description Mathematical constants for scalar operations
 */

/* ========================================================================== */
/* Tolerance Constants                                                        */
/* ========================================================================== */

/**
 * Default epsilon for floating-point comparisons.
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
 * @since 1.0.0
 */
export const EPSILON = 1e-10;

/**
 * Square of epsilon for area/volume comparisons.
 *
 * @remarks
 * When comparing areas or squared distances, use EPSILON_SQUARED
 * to maintain consistent tolerance behavior.
 *
 * @constant {number}
 * @category Tolerance
 * @since 1.0.0
 */
export const EPSILON_SQUARED = EPSILON * EPSILON;

/**
 * Maximum safe integer in float64 (2^53 - 1).
 *
 * @remarks
 * Beyond this value, integer arithmetic becomes imprecise due to
 * IEEE 754 double precision limitations.
 *
 * @constant {number}
 * @category Numeric Limits
 * @since 1.0.0
 */
export const MAX_SAFE_INTEGER_F64 = Number.MAX_SAFE_INTEGER;

/* ========================================================================== */
/* Angular Constants                                                          */
/* ========================================================================== */

/**
 * Mathematical constant π (pi) ≈ 3.14159265358979.
 *
 * @constant {number}
 * @category Angular
 * @since 1.0.0
 */
export const PI = Math.PI;

/**
 * Mathematical constant τ (tau) = 2π ≈ 6.28318530717959.
 *
 * @remarks
 * Tau represents one full rotation in radians. Some consider it
 * more intuitive than π for angular calculations.
 *
 * @constant {number}
 * @category Angular
 * @since 1.0.0
 */
export const TAU = 2 * Math.PI;

/**
 * Half of π ≈ 1.5707963267949 (90 degrees).
 *
 * @constant {number}
 * @category Angular
 * @since 1.0.0
 */
export const HALF_PI = Math.PI / 2;

/**
 * Quarter of π ≈ 0.785398163397448 (45 degrees).
 *
 * @constant {number}
 * @category Angular
 * @since 1.0.0
 */
export const QUARTER_PI = Math.PI / 4;

/* ========================================================================== */
/* Conversion Factors                                                         */
/* ========================================================================== */

/**
 * Conversion factor from degrees to radians.
 *
 * @example
 * ```typescript
 * const radians = degrees * DEG_TO_RAD;
 * ```
 *
 * @constant {number}
 * @category Conversion
 * @since 1.0.0
 */
export const DEG_TO_RAD = Math.PI / 180;

/**
 * Conversion factor from radians to degrees.
 *
 * @example
 * ```typescript
 * const degrees = radians * RAD_TO_DEG;
 * ```
 *
 * @constant {number}
 * @category Conversion
 * @since 1.0.0
 */
export const RAD_TO_DEG = 180 / Math.PI;

/**
 * Conversion factor from radians to turns (full rotations).
 *
 * @example
 * ```typescript
 * const turns = radians * RAD_TO_TURN;
 * // 2π radians = 1 turn
 * ```
 *
 * @constant {number}
 * @category Conversion
 * @since 1.0.0
 */
export const RAD_TO_TURN = 1 / TAU;

/**
 * Conversion factor from turns to radians.
 *
 * @example
 * ```typescript
 * const radians = turns * TURN_TO_RAD;
 * // 1 turn = 2π radians
 * ```
 *
 * @constant {number}
 * @category Conversion
 * @since 1.0.0
 */
export const TURN_TO_RAD = TAU;

/**
 * Conversion factor from gradians to radians.
 *
 * @remarks
 * Gradians (also called gon or grade) divide a right angle into 100 units.
 * 400 gradians = 2π radians = 360 degrees.
 *
 * @constant {number}
 * @category Conversion
 * @since 1.0.0
 */
export const GRAD_TO_RAD = PI / 200;

/**
 * Conversion factor from radians to gradians.
 *
 * @constant {number}
 * @category Conversion
 * @since 1.0.0
 */
export const RAD_TO_GRAD = 200 / PI;

/* ========================================================================== */
/* Mathematical Constants                                                     */
/* ========================================================================== */

/**
 * Square root of 2 ≈ 1.41421356237.
 *
 * @remarks
 * The diagonal of a unit square. Commonly used in 2D geometry.
 *
 * @constant {number}
 * @category Mathematical
 * @since 1.0.0
 */
export const SQRT_2 = Math.SQRT2;

/**
 * Square root of 1/2 ≈ 0.707106781187.
 *
 * @remarks
 * Equals 1/√2 = √2/2. Common in rotation calculations (45° sin/cos).
 *
 * @constant {number}
 * @category Mathematical
 * @since 1.0.0
 */
export const SQRT_HALF = Math.SQRT1_2;

/**
 * Natural logarithm of 2 ≈ 0.693147180559945.
 *
 * @constant {number}
 * @category Mathematical
 * @since 1.0.0
 */
export const LN_2 = Math.LN2;

/**
 * Natural logarithm of 10 ≈ 2.302585092994.
 *
 * @constant {number}
 * @category Mathematical
 * @since 1.0.0
 */
export const LN_10 = Math.LN10;

/**
 * Golden ratio φ (phi) ≈ 1.6180339887.
 *
 * @remarks
 * φ = (1 + √5) / 2. Appears in art, architecture, and nature.
 * Has the property that φ² = φ + 1.
 *
 * @constant {number}
 * @category Mathematical
 * @since 1.0.0
 */
export const GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2;

/**
 * Euler's number e ≈ 2.718281828459045.
 *
 * @remarks
 * Base of natural logarithms. Fundamental in calculus and exponential growth.
 *
 * @constant {number}
 * @category Mathematical
 * @since 1.0.0
 */
export const E = Math.E;

/* ========================================================================== */
/* Unified Constants Object                                                   */
/* ========================================================================== */

/**
 * Unified constants object for convenient access.
 *
 * @example
 * ```typescript
 * import { Constants } from '@lenguados/math2d';
 * const angle = degrees * Constants.DEG_TO_RAD;
 * ```
 *
 * @constant
 * @category Collection
 * @since 1.0.0
 */
export const Constants = {
 EPSILON,
 EPSILON_SQUARED,
 MAX_SAFE_INTEGER_F64,
 PI,
 TAU,
 HALF_PI,
 QUARTER_PI,
 DEG_TO_RAD,
 RAD_TO_DEG,
 RAD_TO_TURN,
 TURN_TO_RAD,
 GRAD_TO_RAD,
 RAD_TO_GRAD,
 SQRT_2,
 SQRT_HALF,
 LN_2,
 LN_10,
 GOLDEN_RATIO,
 E,
} as const;
