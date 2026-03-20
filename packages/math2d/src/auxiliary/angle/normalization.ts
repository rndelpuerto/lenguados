/**
 * @file auxiliary/angle/normalization.ts
 * @module @lenguados/math2d/auxiliary/angle
 * @description Angle normalization operations
 */

import { loop } from '../scalar/arithmetic';
import { PI, TAU } from '../scalar/constants';

/**
 * Normalizes an angle to [-PI, PI) range.
 * Standard signed angle representation.
 *
 * @remarks
 * For very large angles (>1e6 radians), floating-point precision loss in
 * the modulo operation may produce results that deviate from the
 * mathematically correct normalized value.
 *
 * @param radians - Angle in radians
 * @returns Normalized angle in [-PI, PI)
 *
 * @example
 * ```typescript
 * normalizeRadians(0);              // 0
 * normalizeRadians(Math.PI);        // -Math.PI (range is [-PI, PI))
 * normalizeRadians(-Math.PI);       // -Math.PI
 * normalizeRadians(3 * Math.PI);    // -Math.PI
 * normalizeRadians(2 * Math.PI);    // 0
 * ```
 *
 * @category Normalization
 * @since 0.7.0
 */
export function normalizeRadians(radians: number): number {
 return loop(radians, -PI, PI);
}

/**
 * Normalizes an angle to [0, TAU) range.
 * Useful for progress, winding calculations.
 * @param radians - Angle in radians
 * @returns Normalized angle in [0, TAU)
 *
 * @example
 * ```typescript
 * normalizeRadiansPositive(0);              // 0
 * normalizeRadiansPositive(Math.PI);        // Math.PI
 * normalizeRadiansPositive(-Math.PI);       // Math.PI
 * normalizeRadiansPositive(3 * Math.PI);    // Math.PI
 * normalizeRadiansPositive(2 * Math.PI);    // 0
 * ```
 *
 * @category Normalization
 * @since 0.7.0
 */
export function normalizeRadiansPositive(radians: number): number {
 return loop(radians, 0, TAU);
}

/**
 * Normalizes degrees to [-180, 180).
 * @param degrees - Angle in degrees
 * @returns Normalized angle in [-180, 180)
 *
 * @example
 * ```typescript
 * normalizeDegrees(0);      // 0
 * normalizeDegrees(180);    // -180 (range is [-180, 180))
 * normalizeDegrees(-180);   // -180
 * normalizeDegrees(360);    // 0
 * normalizeDegrees(540);    // -180
 * ```
 *
 * @category Normalization
 * @since 0.7.0
 */
export function normalizeDegrees(degrees: number): number {
 return loop(degrees, -180, 180);
}

/**
 * Normalizes degrees to [0, 360).
 * @param degrees - Angle in degrees
 * @returns Normalized angle in [0, 360)
 *
 * @example
 * ```typescript
 * normalizeDegreesPositive(0);      // 0
 * normalizeDegreesPositive(180);    // 180
 * normalizeDegreesPositive(-180);   // 180
 * normalizeDegreesPositive(360);    // 0
 * normalizeDegreesPositive(540);    // 180
 * ```
 *
 * @category Normalization
 * @since 0.7.0
 */
export function normalizeDegreesPositive(degrees: number): number {
 return loop(degrees, 0, 360);
}
