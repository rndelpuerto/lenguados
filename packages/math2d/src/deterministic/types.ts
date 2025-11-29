/**
 * @file deterministic/types.ts
 * @module @lenguados/math2d/deterministic
 * @description Type definitions for deterministic math operations
 */

/**
 * Options for deterministic math operations
 */
export interface DeterministicOptions {
 /**
  * Number of entries in lookup tables (must be power of 2)
  * @default 4096
  */
 tableSize?: number;

 /**
  * Number of Newton-Raphson iterations for sqrt
  * @default 3
  */
 sqrtIterations?: number;

 /**
  * Use fixed-point arithmetic for intermediate calculations
  * @default false
  */
 useFixedPoint?: boolean;

 /**
  * Fixed-point scale factor (number of fractional bits)
  * @default 16
  */
 fixedPointScale?: number;
}

/**
 * Rounding modes for deterministic operations
 */
export enum RoundingMode {
 /** Round towards zero (truncate) */
 TRUNCATE = 'truncate',
 /** Round to nearest, ties to even (banker's rounding) */
 NEAREST_EVEN = 'nearestEven',
 /** Round to nearest, ties away from zero */
 NEAREST_AWAY = 'nearestAway',
 /** Round towards positive infinity (ceil) */
 CEIL = 'ceil',
 /** Round towards negative infinity (floor) */
 FLOOR = 'floor',
}

/**
 * Result of a compensated arithmetic operation
 */
export interface CompensatedResult {
 /** The primary result */
 value: number;
 /** The error/compensation term */
 error: number;
}

/**
 * Two-sum result for exact floating-point addition
 */
export interface TwoSumResult {
 /** The rounded sum */
 sum: number;
 /** The exact error */
 error: number;
}

/**
 * Two-product result for exact floating-point multiplication
 */
export interface TwoProductResult {
 /** The rounded product */
 product: number;
 /** The exact error */
 error: number;
}
