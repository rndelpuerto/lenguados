/**
 * @file src/core/constants/precision.ts
 * @module math2d/core/constants/precision
 * @description Centralized numerical precision constants for @lenguados/math2d.
 *
 * @remarks
 * These constants define the precision guarantees for the entire library.
 * They are based on IEEE-754 floating-point properties and industry best practices
 * from libraries like Box2D, glMatrix, and Unity.Mathematics.
 */

/**
 * Machine epsilon for single-precision floating-point (float32).
 * This is the smallest value e such that 1 + e != 1 in float32 arithmetic.
 * @public
 */
export const FLOAT32_EPSILON = 1.192092896e-7; // 2^-23

/**
 * Machine epsilon for double-precision floating-point (float64).
 * This is the smallest value e such that 1 + e != 1 in float64 arithmetic.
 * @public
 */
export const FLOAT64_EPSILON = 2.220446049250313e-16; // 2^-52

/**
 * Default linear tolerance for comparisons and numerical operations.
 * Based on float32 epsilon scaled up for practical use.
 * @public
 */
export const LINEAR_EPSILON = FLOAT32_EPSILON * 8; // ~9.5e-7

/**
 * Squared linear tolerance, useful for avoiding square roots in distance comparisons.
 * @public
 */
export const LINEAR_EPSILON_SQUARED = LINEAR_EPSILON * LINEAR_EPSILON;

/**
 * Angular tolerance in radians for rotation and angle comparisons.
 * Approximately 0.0005 degrees.
 * @public
 */
export const ANGULAR_EPSILON = 0.00001; // ~0.00057 degrees

/**
 * Squared angular tolerance, useful for optimization in some angular comparisons.
 * @public
 */
export const ANGULAR_EPSILON_SQUARED = ANGULAR_EPSILON * ANGULAR_EPSILON;

/**
 * Minimum safe length for normalization operations.
 * Below this threshold, vectors are considered degenerate.
 * @public
 */
export const MIN_SAFE_LENGTH = 1e-10;

/**
 * Maximum safe length for numerical operations.
 * Above this threshold, operations may lose precision or overflow.
 * @public
 */
export const MAX_SAFE_LENGTH = 1e10;

/**
 * Tolerance for determinant checks in matrix operations.
 * Matrices with determinants below this are considered singular.
 * @public
 */
export const DETERMINANT_EPSILON = LINEAR_EPSILON;

/**
 * Tolerance for unit length checks (e.g., in rotation matrices).
 * Used to verify that vectors or matrix columns are normalized.
 * @public
 */
export const UNIT_EPSILON = 0.0001; // More permissive than LINEAR_EPSILON

/**
 * Default precision for string formatting and display.
 * Number of decimal places to show when converting to string.
 * @public
 */
export const DEFAULT_DISPLAY_PRECISION = 6;

/**
 * Physics-specific tolerances matching Box2D conventions.
 * @public
 */
export const PHYSICS = {
 /**
  * Linear slop for constraint stabilization (3mm in Box2D's scale).
  */
 LINEAR_SLOP: 0.003,

 /**
  * Angular slop for constraint stabilization (2 degrees in radians).
  */
 ANGULAR_SLOP: (2.0 * Math.PI) / 180.0,

 /**
  * Maximum linear displacement per solver iteration.
  */
 MAX_LINEAR_CORRECTION: 0.2,

 /**
  * Maximum angular displacement per solver iteration.
  */
 MAX_ANGULAR_CORRECTION: (8.0 * Math.PI) / 180.0,
} as const;

/**
 * Checks if a value is effectively zero within linear tolerance.
 * @param value - The value to check
 * @param epsilon - Custom epsilon (defaults to LINEAR_EPSILON)
 * @returns True if |value| < epsilon
 * @public
 */
export function isZero(value: number, epsilon = LINEAR_EPSILON): boolean {
 return Math.abs(value) < epsilon;
}

/**
 * Checks if two values are approximately equal within tolerance.
 * @param a - First value
 * @param b - Second value
 * @param epsilon - Custom epsilon (defaults to LINEAR_EPSILON)
 * @returns True if |a - b| < epsilon
 * @public
 */
export function isEqual(a: number, b: number, epsilon = LINEAR_EPSILON): boolean {
 return Math.abs(a - b) < epsilon;
}

/**
 * Checks if a value is approximately 1 within tolerance.
 * @param value - The value to check
 * @param epsilon - Custom epsilon (defaults to UNIT_EPSILON)
 * @returns True if |value - 1| < epsilon
 * @public
 */
export function isOne(value: number, epsilon = UNIT_EPSILON): boolean {
 return Math.abs(value - 1) < epsilon;
}
