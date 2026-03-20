/**
 * @file auxiliary/angle/operations.ts
 * @module @lenguados/math2d/auxiliary/angle
 * @description Angular operations and comparisons
 */

import { atan2, sinCos as deterministicSinCos } from '../../deterministic/deterministic-kernels';
import type { SinCos } from '../../types';
import { EPSILON } from '../scalar/constants';

import { normalizeRadians, normalizeRadiansPositive } from './normalization';

// Re-export SinCos from its canonical location in types/
export type { SinCos } from '../../types';

/**
 * Computes sine and cosine of an angle simultaneously.
 * Uses deterministic math for cross-platform reproducibility.
 *
 * @remarks
 * When `out` is provided, writes directly to it (zero-allocation for hot paths).
 * Otherwise, creates a new object.
 *
 * @param angle - Angle in radians
 * @param out - Optional output object to write sin/cos into (zero-allocation)
 * @returns Object with sin and cos properties
 *
 * @example
 * ```typescript
 * // Convenience: creates new object
 * const { sin, cos } = sinCos(Math.PI / 4);
 *
 * // Hot path: reuse object
 * const result: SinCos = { sin: 0, cos: 0 };
 * for (let i = 0; i < 1000; i++) {
 *   sinCos(angles[i], result);
 *   // use result.sin, result.cos...
 * }
 * ```
 *
 * @category Arithmetic
 * @since 0.7.0
 */
export function sinCos(angle: number, out?: SinCos): SinCos {
 return deterministicSinCos(angle, out);
}

/**
 * Computes sine and cosine of a normalized angle.
 * Normalizes the angle to [-π, π) before computing.
 *
 * @remarks Uses deterministic math (`sin`, `cos` from deterministic-kernels).
 *
 * @param angle - Angle in radians (will be normalized)
 * @param out - Optional output object to write sin/cos into (zero-allocation)
 * @returns Object with sin and cos properties
 *
 * @example
 * ```typescript
 * const { sin, cos } = sinCosNormalized(5 * Math.PI);
 * // Equivalent to sinCos(Math.PI)
 * ```
 *
 * @category Arithmetic
 * @since 0.7.0
 */
export function sinCosNormalized(angle: number, out?: SinCos): SinCos {
 const normalized = normalizeRadians(angle);
 return deterministicSinCos(normalized, out);
}

/* ========================================================================== */
/* Angle Operations                                                          */
/* ========================================================================== */

/**
 * Signed shortest-arc delta in radians: rotate from `from` to `to`.
 * Result is in [-PI, PI).
 *
 * @remarks
 * Anti-symmetry breaks at the PI boundary due to the half-open [-PI, PI) range:
 * `angleDifference(0, PI)` and `angleDifference(PI, 0)` both return `-PI`
 * (not `+PI` and `-PI` respectively). This is inherent to the convention.
 *
 * @param from - Starting angle in radians
 * @param to - Target angle in radians
 * @returns Signed angle difference in [-PI, PI)
 *
 * @example
 * ```typescript
 * angleDifference(0, Math.PI / 2);        // Math.PI / 2
 * angleDifference(0, 3 * Math.PI / 2);    // -Math.PI / 2 (shorter path)
 * angleDifference(-Math.PI, Math.PI);     // 0 (same angle)
 * ```
 *
 * @category Arithmetic
 * @since 0.7.0
 */
export function angleDifference(from: number, to: number): number {
 return normalizeRadians(to - from);
}

/**
 * Absolute shortest-arc distance in radians.
 * Always positive, in [0, π].
 * @param a - First angle in radians
 * @param b - Second angle in radians
 * @returns Unsigned angle distance in [0, π]
 *
 * @example
 * ```typescript
 * angleDistance(0, Math.PI / 2);        // Math.PI / 2
 * angleDistance(0, 3 * Math.PI / 2);    // Math.PI / 2
 * angleDistance(-Math.PI, Math.PI);     // 0
 * ```
 *
 * @category Arithmetic
 * @since 0.7.0
 */
export function angleDistance(a: number, b: number): number {
 return Math.abs(angleDifference(a, b));
}

/**
 * Tests if angles are approximately equal.
 * @param a - First angle in radians
 * @param b - Second angle in radians
 * @param epsilon - Tolerance (default: EPSILON)
 * @returns True if angles are within epsilon
 *
 * @example
 * ```typescript
 * anglesNearEqual(0, 2 * Math.PI);              // true (same angle)
 * anglesNearEqual(-Math.PI, Math.PI);           // true (same angle)
 * anglesNearEqual(0, 0.0000000001);             // true (within epsilon)
 * anglesNearEqual(0, 0.1);                      // false
 * ```
 *
 * @category Arithmetic
 * @since 0.7.0
 */
export function anglesNearEqual(a: number, b: number, epsilon: number = EPSILON): boolean {
 return angleDistance(a, b) <= epsilon;
}

/**
 * Calculates angle bisector.
 * Returns angle halfway between a and b (shortest path).
 * @param a - First angle in radians
 * @param b - Second angle in radians
 * @returns Bisector angle
 *
 * @example
 * ```typescript
 * angleBisector(0, Math.PI / 2);           // Math.PI / 4
 * angleBisector(0, Math.PI);               // Math.PI / 2
 * angleBisector(-Math.PI / 2, Math.PI / 2); // 0
 * ```
 *
 * @category Arithmetic
 * @since 0.7.0
 */
export function angleBisector(a: number, b: number): number {
 const diff = angleDifference(a, b);
 return normalizeRadians(a + diff * 0.5);
}

/**
 * Tests if angle is between start and end (CCW).
 *
 * @remarks
 * Uses counter-clockwise convention. The arc from start to end
 * is traversed in the positive (CCW) direction.
 *
 * When `start === end`, the arc has zero length (a point), not a full circle.
 * Only the exact boundary angle matches (with `inclusive = true`).
 *
 * @param angle - Angle to test
 * @param start - Start angle
 * @param end - End angle
 * @param inclusive - Whether to include boundaries (default: true)
 * @returns True if angle is in the CCW arc from start to end
 *
 * @example
 * ```typescript
 * isAngleBetween(Math.PI / 4, 0, Math.PI / 2);      // true
 * isAngleBetween(3 * Math.PI / 2, 0, Math.PI);      // false
 * isAngleBetween(0, 0, Math.PI, true);              // true (on boundary)
 * isAngleBetween(0, 0, Math.PI, false);             // false (boundary excluded)
 * ```
 *
 * @category Arithmetic
 * @since 0.7.0
 */
export function isAngleBetween(
 angle: number,
 start: number,
 end: number,
 inclusive: boolean = true,
): boolean {
 const normalizedAngle = normalizeRadiansPositive(angle);
 const normalizedStart = normalizeRadiansPositive(start);
 const normalizedEnd = normalizeRadiansPositive(end);

 if (normalizedStart <= normalizedEnd) {
  // No wrap-around
  return inclusive
   ? normalizedAngle >= normalizedStart && normalizedAngle <= normalizedEnd
   : normalizedAngle > normalizedStart && normalizedAngle < normalizedEnd;
 } else {
  // Wrap-around case
  return inclusive
   ? normalizedAngle >= normalizedStart || normalizedAngle <= normalizedEnd
   : normalizedAngle > normalizedStart || normalizedAngle < normalizedEnd;
 }
}

/**
 * Clamps angle to arc between min and max.
 *
 * @remarks
 * Clamps to the nearest boundary of the shortest arc between min and max.
 *
 * @param angle - Angle to clamp
 * @param min - Minimum angle
 * @param max - Maximum angle
 * @returns Clamped angle in [-PI, PI) range
 *
 * @example
 * ```typescript
 * clampAngle(Math.PI / 4, 0, Math.PI / 2);      // Math.PI / 4 (within range)
 * clampAngle(-Math.PI / 4, 0, Math.PI / 2);     // 0 (clamped to min)
 * clampAngle(Math.PI, 0, Math.PI / 2);          // Math.PI / 2 (clamped to max)
 * ```
 *
 * @category Arithmetic
 * @since 0.7.0
 */
export function clampAngle(angle: number, min: number, max: number): number {
 // Normalize all angles to [-PI, PI)
 const normAngle = normalizeRadians(angle);
 const normMin = normalizeRadians(min);
 const normMax = normalizeRadians(max);

 // Check if angle is already in range
 if (isAngleBetween(normAngle, normMin, normMax)) {
  return normAngle;
 }

 // Find distances to both boundaries
 const distanceToMin = angleDistance(normAngle, normMin);
 const distanceToMax = angleDistance(normAngle, normMax);

 // Return the closer boundary
 return distanceToMin <= distanceToMax ? normMin : normMax;
}

/**
 * Computes the directed angle from vector1 to vector2.
 *
 * @remarks Uses deterministic math (`atan2` from deterministic-kernels).
 *
 * @param x1 - X component of first vector
 * @param y1 - Y component of first vector
 * @param x2 - X component of second vector
 * @param y2 - Y component of second vector
 * @returns Angle from vector1 to vector2
 *
 * @example
 * ```typescript
 * angleFromVectors(1, 0, 0, 1);      // Math.PI / 2 (90 degrees CCW)
 * angleFromVectors(1, 0, 1, 0);      // 0 (same direction)
 * angleFromVectors(1, 0, -1, 0);     // Math.PI (opposite)
 * ```
 *
 * @category Arithmetic
 * @since 0.7.0
 */
export function angleFromVectors(x1: number, y1: number, x2: number, y2: number): number {
 // Single atan2 using cross product (sin) and dot product (cos)
 const cross = x1 * y2 - y1 * x2;
 const dot = x1 * x2 + y1 * y2;
 return atan2(cross, dot);
}
