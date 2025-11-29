/**
 * @file auxiliary/scalar/constants.ts
 * @module @lenguados/math2d/auxiliary/scalar
 * @description Mathematical constants for scalar operations
 */

/**
 * Default epsilon for floating-point comparisons
 * @constant {number}
 */
export const EPSILON = 1e-10;

/**
 * Square of epsilon for area/volume comparisons
 * @constant {number}
 */
export const EPSILON_SQUARED = EPSILON * EPSILON;

/**
 * Maximum safe integer in float64 (2^53 - 1)
 * @constant {number}
 */
export const MAX_SAFE_INTEGER_F64 = Number.MAX_SAFE_INTEGER;

/**
 * Mathematical constant π (pi)
 * @constant {number}
 */
export const PI = Math.PI;

/**
 * Mathematical constant τ (tau) = 2π
 * @constant {number}
 */
export const TAU = 2 * Math.PI;

/**
 * Half of π
 * @constant {number}
 */
export const HALF_PI = Math.PI / 2;

/**
 * Quarter of π
 * @constant {number}
 */
export const QUARTER_PI = Math.PI / 4;

/**
 * Conversion factor from degrees to radians
 * @constant {number}
 */
export const DEG_TO_RAD = Math.PI / 180;

/**
 * Conversion factor from radians to degrees
 * @constant {number}
 */
export const RAD_TO_DEG = 180 / Math.PI;

/**
 * Conversion factor from radians to turns (full rotations)
 * @constant {number}
 */
export const RAD_TO_TURN = 1 / TAU;

/**
 * Conversion factor from turns to radians
 * @constant {number}
 */
export const TURN_TO_RAD = TAU;

/**
 * Conversion factor from gradians to radians
 * @constant {number}
 */
export const GRAD_TO_RAD = PI / 200;

/**
 * Conversion factor from radians to gradians
 * @constant {number}
 */
export const RAD_TO_GRAD = 200 / PI;

/**
 * Square root of 2
 * @constant {number}
 */
export const SQRT_2 = Math.SQRT2;

/**
 * Square root of 1/2
 * @constant {number}
 */
export const SQRT_HALF = Math.SQRT1_2;

/**
 * Natural logarithm of 2
 * @constant {number}
 */
export const LN_2 = Math.LN2;

/**
 * Natural logarithm of 10
 * @constant {number}
 */
export const LN_10 = Math.LN10;

/**
 * Golden ratio φ (phi)
 * @constant {number}
 */
export const GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2;

/**
 * Euler's number e
 * @constant {number}
 */
export const E = Math.E;

/**
 * Unified constants object for convenient access
 * @constant
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
