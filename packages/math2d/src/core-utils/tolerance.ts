/**
 * @file src/core-utils/tolerance.ts
 * @module math2d/core-utils/tolerance
 * @description
 * Common tolerance utilities for consistent numerical comparisons across math2d.
 * Promotes DRY principle by centralizing tolerance-related operations.
 */

import { LINEAR_EPSILON, ANGULAR_EPSILON, UNIT_EPSILON } from '../constants/precision';

/**
 * Tolerance options for operations that may use different epsilons for different aspects.
 * @public
 */
export interface ToleranceOptions {
  /** Tolerance for linear measurements (positions, distances) */
  linear?: number;
  /** Tolerance for angular measurements (rotations, angles) */
  angular?: number;
  /** Tolerance for unit length checks (normalization) */
  unit?: number;
}

/**
 * Default tolerance values following math2d conventions.
 * @public
 */
export const DEFAULT_TOLERANCES = {
  linear: LINEAR_EPSILON,
  angular: ANGULAR_EPSILON,
  unit: UNIT_EPSILON,
} as const;

/**
 * Checks if a value is near zero within tolerance.
 * @param value - The value to check
 * @param tolerance - Absolute tolerance (must be non-negative)
 * @returns True if |value| < tolerance
 * @public
 * @inline
 * @hot-path
 */
export function isNearZero(value: number, tolerance: number = LINEAR_EPSILON): boolean {
  return Math.abs(value) < tolerance;
}

/**
 * Checks if two values are approximately equal within tolerance.
 * @param a - First value
 * @param b - Second value  
 * @param tolerance - Absolute tolerance (must be non-negative)
 * @returns True if |a - b| <= tolerance
 * @public
 * @inline
 * @hot-path
 */
export function areNearEqual(a: number, b: number, tolerance: number = LINEAR_EPSILON): boolean {
  return Math.abs(a - b) <= tolerance;
}

/**
 * Checks if a value is approximately 1 within tolerance.
 * Useful for unit length validation.
 * @param value - The value to check
 * @param tolerance - Absolute tolerance (must be non-negative)
 * @returns True if |value - 1| <= tolerance
 * @public
 * @inline
 */
export function isNearOne(value: number, tolerance: number = UNIT_EPSILON): boolean {
  return Math.abs(value - 1) <= tolerance;
}

/**
 * Validates that a tolerance value is non-negative.
 * @param tolerance - The tolerance to validate
 * @param methodName - Name of the calling method for error messages
 * @throws {RangeError} If tolerance is negative
 * @public
 */
export function validateTolerance(tolerance: number, methodName: string): void {
  if (tolerance < 0) {
    throw new RangeError(`${methodName}: tolerance must be non-negative`);
  }
}

/**
 * Clamps a value to ensure it's not below a minimum threshold.
 * Useful for avoiding division by zero or degenerate cases.
 * @param value - The value to clamp
 * @param minValue - Minimum allowed value
 * @returns The clamped value
 * @public
 * @inline
 */
export function clampAbove(value: number, minValue: number): number {
  return value < minValue ? minValue : value;
}

/**
 * Checks if a squared length is near zero.
 * More efficient than checking length when you already have squared length.
 * @param lengthSquared - The squared length to check
 * @param tolerance - Linear tolerance (will be squared internally)
 * @returns True if lengthSquared < tolerance²
 * @public
 * @inline
 * @hot-path
 */
export function isLengthSquaredNearZero(
  lengthSquared: number,
  tolerance: number = LINEAR_EPSILON,
): boolean {
  return lengthSquared < tolerance * tolerance;
}

/**
 * Relative equality comparison that scales tolerance by the magnitude of values.
 * Useful for comparing large values where absolute tolerance is insufficient.
 * @param a - First value
 * @param b - Second value
 * @param relativeTolerance - Relative tolerance factor
 * @returns True if |a - b| <= relativeTolerance * max(|a|, |b|, 1)
 * @public
 */
export function areNearEqualRelative(
  a: number,
  b: number,
  relativeTolerance: number = LINEAR_EPSILON,
): boolean {
  const scale = Math.max(Math.abs(a), Math.abs(b), 1);
  return Math.abs(a - b) <= relativeTolerance * scale;
}

/**
 * Combined absolute and relative equality test.
 * Passes if either absolute or relative test passes.
 * @param a - First value
 * @param b - Second value
 * @param absoluteTolerance - Absolute tolerance
 * @param relativeTolerance - Relative tolerance factor
 * @returns True if values are equal within either tolerance
 * @public
 */
export function areNearEqualAbsoluteOrRelative(
  a: number,
  b: number,
  absoluteTolerance: number = LINEAR_EPSILON,
  relativeTolerance: number = LINEAR_EPSILON,
): boolean {
  const diff = Math.abs(a - b);
  if (diff <= absoluteTolerance) return true;
  
  const scale = Math.max(Math.abs(a), Math.abs(b));
  return diff <= relativeTolerance * scale;
}
