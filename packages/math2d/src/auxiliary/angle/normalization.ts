/**
 * @file auxiliary/angle/normalization.ts
 * @module @lenguados/math2d/auxiliary/angle
 * @description Angle normalization operations.
 */

import { loop } from '../scalar/arithmetic';
import { PI, TAU } from '../scalar/constants';

/**
 * Normalizes an angle to [-PI, PI) range.
 * Standard signed angle representation.
 * @param radians - Angle in radians.
 * @returns Normalized angle in [-PI, PI).
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
 * @param radians - Angle in radians.
 * @returns Normalized angle in [0, TAU).
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
 * Normalizes to arbitrary center ± π.
 * Useful for continuous rotation.
 * @param radians - Angle in radians.
 * @param center - Center angle.
 * @returns Angle equivalent to radians and closest to center.
 *
 * @example
 * ```typescript
 * normalizeRadiansAround(3 * Math.PI, 0);        // -Math.PI
 * normalizeRadiansAround(Math.PI / 2, Math.PI);  // Math.PI / 2
 * normalizeRadiansAround(0, Math.PI);            // 2 * Math.PI
 * ```
 *
 * @category Normalization
 * @since 0.7.0
 */
export function normalizeRadiansAround(radians: number, center: number): number {
 return loop(radians, center - PI, center + PI);
}

/**
 * Normalizes degrees to [-180, 180).
 * @param degrees - Angle in degrees.
 * @returns Normalized angle in [-180, 180).
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
 * @param degrees - Angle in degrees.
 * @returns Normalized angle in [0, 360).
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

/**
 * Wraps angle to specific period.
 * @param angle - Angle to wrap.
 * @param period - Period (default: 2π).
 * @returns Wrapped angle in [0, period).
 *
 * @example
 * ```typescript
 * wrapAngle(Math.PI, Math.PI);          // 0
 * wrapAngle(3 * Math.PI, 2 * Math.PI);  // Math.PI
 * wrapAngle(370, 360);                  // 10 (degrees example)
 * ```
 *
 * @category Normalization
 * @since 0.7.0
 */
export function wrapAngle(angle: number, period: number = TAU): number {
 if (period <= 0) {
  return 0;
 }
 return loop(angle, 0, period);
}
