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
 * @since 0.7.0
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
 * @since 0.7.0
 */
export const EPSILON_SQUARED = EPSILON * EPSILON;

/**
 * Tolerance for iterative angle algorithms.
 *
 * @remarks
 * Used in iterative angle operations (like constraint solving) where
 * a looser tolerance than EPSILON is acceptable for convergence.
 * Value of 1e-6 provides good balance between precision and performance.
 *
 * @constant {number}
 * @category Tolerance
 * @since 0.7.0
 */
export const ITERATIVE_TOLERANCE = 1e-6;

/* ========================================================================== */
/* Numeric Limits                                                            */
/* ========================================================================== */

/**
 * Maximum safe integer in float64 (2^53 - 1).
 *
 * @remarks
 * Beyond this value, integer arithmetic becomes imprecise due to
 * IEEE 754 double precision limitations.
 *
 * @constant {number}
 * @category Numeric Limits
 * @since 0.7.0
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
 * @since 0.7.0
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
 * @since 0.7.0
 */
export const TAU = 2 * Math.PI;

/**
 * Half of π ≈ 1.5707963267949 (90 degrees).
 *
 * @constant {number}
 * @category Angular
 * @since 0.7.0
 */
export const HALF_PI = Math.PI / 2;

/**
 * Quarter of π ≈ 0.785398163397448 (45 degrees).
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
 * Conversion factor from degrees to radians.
 *
 * @example
 * ```typescript
 * const radians = degrees * DEG_TO_RAD;
 * ```
 *
 * @constant {number}
 * @category Conversion
 * @since 0.7.0
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
 * @since 0.7.0
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
 * @since 0.7.0
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
 * @since 0.7.0
 */
export const TURN_TO_RAD = TAU;

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
 * @since 0.7.0
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
 * @since 0.7.0
 */
export const SQRT_HALF = Math.SQRT1_2;

/**
 * Natural logarithm of 2 ≈ 0.693147180559945.
 *
 * @constant {number}
 * @category Mathematical
 * @since 0.7.0
 */
export const LN_2 = Math.LN2;

/**
 * Euler's number e ≈ 2.718281828459045.
 *
 * @remarks
 * Base of natural logarithms. Fundamental in calculus and exponential growth.
 *
 * @constant {number}
 * @category Mathematical
 * @since 0.7.0
 */
export const E = Math.E;

/**
 * Golden Ratio φ ≈ 1.618033988749895.
 *
 * @remarks
 * The unique positive solution to φ² = φ + 1.
 * Satisfies φ = (1 + √5) / 2 and φ * GOLDEN_RATIO_CONJUGATE = 1.
 *
 * @constant {number}
 * @category Mathematical
 * @since 0.7.0
 */
const SQRT5 = Math.sqrt(5);

export const GOLDEN_RATIO = (1 + SQRT5) / 2;

/**
 * Golden Ratio Conjugate Φ ≈ 0.618033988749895.
 *
 * @remarks
 * Equals 1 / φ or φ - 1.
 *
 * @constant {number}
 * @category Mathematical
 * @since 0.7.0
 */
export const GOLDEN_RATIO_CONJUGATE = (SQRT5 - 1) / 2;

/**
 * Smallest positive normal number in IEEE 754 double precision.
 * Numbers smaller than this (but not zero) are denormal/subnormal.
 *
 * @constant {number}
 * @category Numeric Limits
 * @since 0.7.0
 */
export const SMALLEST_NORMAL = 2.2250738585072014e-308; // 2^-1022

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
 * @since 0.7.0
 */
export const Constants = {
 EPSILON,
 EPSILON_SQUARED,
 ITERATIVE_TOLERANCE,
 MAX_SAFE_INTEGER_F64,
 PI,
 TAU,
 HALF_PI,
 QUARTER_PI,
 DEG_TO_RAD,
 RAD_TO_DEG,
 RAD_TO_TURN,
 TURN_TO_RAD,

 SQRT_2,
 SQRT_HALF,
 LN_2,

 E,
 GOLDEN_RATIO,
 GOLDEN_RATIO_CONJUGATE,

 SMALLEST_NORMAL,
} as const;

Object.freeze(Constants);
