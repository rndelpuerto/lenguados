/**
 * @file src/constants/tolerance-types.ts
 * @module math2d/constants/tolerance-types
 * @description Standardized tolerance constants for different contexts in the math2d library.
 * 
 * @remarks
 * This module provides a centralized way to access different tolerance values
 * based on the context of the comparison. This ensures consistency across
 * the library and makes it clear which tolerance to use for each operation.
 */

import {
  LINEAR_EPSILON,
  ANGULAR_EPSILON,
  UNIT_EPSILON,
  DETERMINANT_EPSILON
} from './precision';

/**
 * Standardized tolerance values for different mathematical contexts.
 * 
 * @remarks
 * Use these constants instead of importing individual epsilon values
 * to ensure consistent tolerance behavior across the library.
 * 
 * @example
 * ```ts
 * import { TOLERANCE } from '@lenguados/math2d/constants/tolerance-types';
 * 
 * // For position/distance comparisons
 * if (areNearEqual(a.x, b.x, TOLERANCE.LINEAR)) { ... }
 * 
 * // For angle comparisons
 * if (Math.abs(angle1 - angle2) < TOLERANCE.ANGULAR) { ... }
 * 
 * // For normalized vector checks
 * if (Math.abs(vector.length() - 1) < TOLERANCE.UNIT) { ... }
 * ```
 * 
 * @public
 */
export const TOLERANCE = {
  /**
   * Tolerance for linear measurements (positions, distances).
   * Based on float32 epsilon scaled for practical use.
   * Value: ~9.5e-7
   */
  LINEAR: LINEAR_EPSILON,

  /**
   * Tolerance for angular measurements (angles, rotations).
   * Approximately 0.00057 degrees.
   * Value: 1e-5 radians
   */
  ANGULAR: ANGULAR_EPSILON,

  /**
   * Tolerance for unit/normalized checks.
   * More permissive than LINEAR for practical use.
   * Value: 1e-4
   */
  UNIT: UNIT_EPSILON,

  /**
   * Tolerance for matrix determinant checks.
   * Matrices with determinants below this are considered singular.
   * Same as LINEAR tolerance.
   */
  DETERMINANT: DETERMINANT_EPSILON
} as const;

/**
 * Type representing valid tolerance contexts.
 * @public
 */
export type ToleranceType = keyof typeof TOLERANCE;
