/**
 * @file auxiliary/angle/operations.ts
 * @module @lenguados/math2d/auxiliary/angle
 * @description Angular operations and comparisons.
 */

import { atan2, cos, sin } from '../../deterministic/deterministic-kernels';
import { EPSILON, HALF_PI, ITERATIVE_TOLERANCE } from '../scalar/constants';

import { normalizeRadians, normalizeRadiansPositive } from './normalization';

/**
 * Smoothing factor for inverse-distance weighting in angle averaging.
 * Prevents division by zero when angles are very close.
 * @internal
 */
const INVERSE_WEIGHT_SMOOTHING = 0.001;

/* ========================================================================== */
/* SinCos Type and Utility                                                    */
/* ========================================================================== */

/**
 * Represents sine and cosine of an angle.
 *
 * @remarks
 * Used to avoid computing both separately when both are needed.
 *
 * @category Types
 * @since 0.7.0
 */
export interface SinCos {
 /** Sine of the angle. */
 sin: number;
 /** Cosine of the angle. */
 cos: number;
}

/**
 * Computes sine and cosine of an angle simultaneously.
 * Uses deterministic math for cross-platform reproducibility.
 *
 * @param angle - Angle in radians.
 * @returns Object with sin and cos properties.
 *
 * @remarks
 * Creates a new object on each call. For hot paths where allocation
 * must be avoided, use {@link sinCosInto} with a reusable object.
 *
 * @example
 * ```typescript
 * const { sin, cos } = sinCos(Math.PI / 4);
 * // sin ≈ 0.7071, cos ≈ 0.7071
 * ```
 *
 * @see {@link sinCosInto} for zero-allocation variant.
 * @category Operations
 * @since 0.7.0
 */
export function sinCos(angle: number): SinCos {
 return {
  sin: sin(angle),
  cos: cos(angle),
 };
}

/**
 * Computes sine and cosine into an existing output object.
 * Zero-allocation version of {@link sinCos} for hot paths.
 *
 * @param angle - Angle in radians.
 * @param out - Output object to write sin/cos into.
 * @returns The same `out` object with updated sin/cos.
 *
 * @remarks
 * **Hot path optimization:** Use this in tight loops to avoid
 * creating new objects on each call, reducing GC pressure.
 *
 * @example
 * ```typescript
 * const result: SinCos = { sin: 0, cos: 0 };
 *
 * // Reuse object in hot loop
 * for (let i = 0; i < 1000; i++) {
 *   sinCosInto(angles[i], result);
 *   // use result.sin, result.cos...
 * }
 * ```
 *
 * @see {@link sinCos} for convenience variant that creates new object.
 * @category Operations
 * @since 0.7.0
 */
export function sinCosInto(angle: number, out: SinCos): SinCos {
 out.sin = sin(angle);
 out.cos = cos(angle);
 return out;
}

/**
 * Computes sine and cosine of a normalized angle.
 * Normalizes the angle to [-π, π) before computing.
 *
 * @param angle - Angle in radians (will be normalized).
 * @returns Object with sin and cos properties.
 *
 * @example
 * ```typescript
 * const { sin, cos } = sinCosNormalized(5 * Math.PI);
 * // Equivalent to sinCos(Math.PI)
 * ```
 *
 * @category Operations
 * @since 0.7.0
 */
export function sinCosNormalized(angle: number): SinCos {
 const normalized = normalizeRadians(angle);
 return {
  sin: sin(normalized),
  cos: cos(normalized),
 };
}

/* ========================================================================== */
/* Angle Operations                                                          */
/* ========================================================================== */

/**
 * Signed shortest-arc delta in radians: rotate from `from` to `to`.
 * Result is in [-PI, PI).
 * @param from - Starting angle in radians.
 * @param to - Target angle in radians.
 * @returns Signed angle difference in [-PI, PI).
 *
 * @example
 * ```typescript
 * angleDifference(0, Math.PI / 2);        // Math.PI / 2
 * angleDifference(0, 3 * Math.PI / 2);    // -Math.PI / 2 (shorter path)
 * angleDifference(-Math.PI, Math.PI);     // 0 (same angle)
 * ```
 *
 * @category Operations
 * @since 0.7.0
 */
export function angleDifference(from: number, to: number): number {
 return normalizeRadians(to - from);
}

/**
 * Absolute shortest-arc distance in radians.
 * Always positive, in [0, π].
 * @param a - First angle in radians.
 * @param b - Second angle in radians.
 * @returns Unsigned angle distance in [0, π].
 *
 * @example
 * ```typescript
 * angleDistance(0, Math.PI / 2);        // Math.PI / 2
 * angleDistance(0, 3 * Math.PI / 2);    // Math.PI / 2
 * angleDistance(-Math.PI, Math.PI);     // 0
 * ```
 *
 * @category Operations
 * @since 0.7.0
 */
export function angleDistance(a: number, b: number): number {
 return Math.abs(angleDifference(a, b));
}

/**
 * Tests if angles are approximately equal.
 * @param a - First angle in radians.
 * @param b - Second angle in radians.
 * @param epsilon - Tolerance (default: EPSILON).
 * @returns True if angles are within epsilon.
 *
 * @example
 * ```typescript
 * anglesNearEqual(0, 2 * Math.PI);              // true (same angle)
 * anglesNearEqual(-Math.PI, Math.PI);           // true (same angle)
 * anglesNearEqual(0, 0.0000000001);             // true (within epsilon)
 * anglesNearEqual(0, 0.1);                      // false
 * ```
 *
 * @category Operations
 * @since 0.7.0
 */
export function anglesNearEqual(a: number, b: number, epsilon: number = EPSILON): boolean {
 return angleDistance(a, b) <= epsilon;
}

/**
 * Calculates angle bisector.
 * Returns angle halfway between a and b (shortest path).
 * @param a - First angle in radians.
 * @param b - Second angle in radians.
 * @returns Bisector angle.
 *
 * @example
 * ```typescript
 * angleBisector(0, Math.PI / 2);           // Math.PI / 4
 * angleBisector(0, Math.PI);               // Math.PI / 2
 * angleBisector(-Math.PI / 2, Math.PI / 2); // 0
 * ```
 *
 * @category Operations
 * @since 0.7.0
 */
export function angleBisector(a: number, b: number): number {
 const diff = angleDifference(a, b);
 return normalizeRadians(a + diff * 0.5);
}

/**
 * Tests if angle is between start and end (CCW).
 * @param angle - Angle to test.
 * @param start - Start angle.
 * @param end - End angle.
 * @param inclusive - Whether to include boundaries (default: true).
 * @returns True if angle is in the CCW arc from start to end.
 *
 * @remarks
 * Uses counter-clockwise convention. The arc from start to end
 * is traversed in the positive (CCW) direction.
 *
 * @example
 * ```typescript
 * isAngleBetween(Math.PI / 4, 0, Math.PI / 2);      // true
 * isAngleBetween(3 * Math.PI / 2, 0, Math.PI);      // false
 * isAngleBetween(0, 0, Math.PI, true);              // true (on boundary)
 * isAngleBetween(0, 0, Math.PI, false);             // false (boundary excluded)
 * ```
 *
 * @category Operations
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
 * @param angle - Angle to clamp.
 * @param min - Minimum angle.
 * @param max - Maximum angle.
 * @returns Clamped angle.
 *
 * @remarks
 * Clamps to the nearest boundary of the shortest arc between min and max.
 *
 * @example
 * ```typescript
 * clampAngle(Math.PI / 4, 0, Math.PI / 2);      // Math.PI / 4 (within range)
 * clampAngle(-Math.PI / 4, 0, Math.PI / 2);     // 0 (clamped to min)
 * clampAngle(Math.PI, 0, Math.PI / 2);          // Math.PI / 2 (clamped to max)
 * ```
 *
 * @category Operations
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
 const distributionToMin = angleDistance(normAngle, normMin);
 const distributionToMax = angleDistance(normAngle, normMax);

 // Return the closer boundary
 return distributionToMin <= distributionToMax ? normMin : normMax;
}

/**
 * Reflects angle across axis.
 * @param angle - Angle to reflect.
 * @param axis - Axis of reflection.
 * @returns Reflected angle.
 *
 * @example
 * ```typescript
 * reflectAngle(Math.PI / 4, 0);           // -Math.PI / 4 (reflect across x-axis)
 * reflectAngle(Math.PI / 4, Math.PI / 2); // 3 * Math.PI / 4 (reflect across y-axis)
 * reflectAngle(0, Math.PI / 4);           // Math.PI / 2
 * ```
 *
 * @category Operations
 * @since 0.7.0
 */
export function reflectAngle(angle: number, axis: number): number {
 // Reflection formula: reflected = 2 * axis - angle
 return normalizeRadians(2 * axis - angle);
}

/**
 * Calculates average of multiple angles.
 * Handles wrap-around correctly using vector addition.
 * @param angles - Array of angles in radians.
 * @returns Average angle.
 *
 * @example
 * ```typescript
 * angleAverage([0, Math.PI / 2]);                    // Math.PI / 4
 * angleAverage([0, Math.PI]);                        // Math.PI / 2
 * angleAverage([-Math.PI * 0.9, Math.PI * 0.9]);    // Math.PI (handles wrap)
 * angleAverage([]);                                  // 0 (empty input)
 * ```
 *
 * @category Operations
 * @since 0.7.0
 */
export function angleAverage(angles: number[]): number {
 if (angles.length === 0) return 0;

 // Use unit vector addition for correct averaging
 let sumX = 0;
 let sumY = 0;

 for (const angle of angles) {
  sumX += cos(angle);
  sumY += sin(angle);
 }

 // Return angle of average vector
 return atan2(sumY, sumX);
}

/**
 * Calculates weighted average of angles.
 * @param angles - Array of angles in radians.
 * @param weights - Array of weights (same length as angles).
 * @returns Weighted average angle.
 *
 * @example
 * ```typescript
 * angleWeightedAverage([0, Math.PI / 2], [1, 1]);      // Math.PI / 4
 * angleWeightedAverage([0, Math.PI / 2], [3, 1]);      // ~0.32 (weighted towards 0)
 * angleWeightedAverage([0, Math.PI], [1, 0]);          // 0 (second angle ignored)
 * ```
 *
 * @category Operations
 * @since 0.7.0
 */
export function angleWeightedAverage(angles: number[], weights: number[]): number {
 if (angles.length === 0 || angles.length !== weights.length) return 0;

 let sumX = 0;
 let sumY = 0;

 for (let index = 0; index < angles.length; index++) {
  const angle = angles[index]!;
  const weight = weights[index]!;
  sumX += cos(angle) * weight;
  sumY += sin(angle) * weight;
 }

 return atan2(sumY, sumX);
}

/**
 * Finds the principal angle from a set of angles.
 * The angle that minimizes total angular distance to all others.
 * @param angles - Array of angles in radians.
 * @returns Principal angle.
 *
 * @example
 * ```typescript
 * principalAngle([0, Math.PI / 4, Math.PI / 2]);       // Math.PI / 4 (middle)
 * principalAngle([-Math.PI, Math.PI]);                  // Math.PI (same angle)
 * ```
 *
 * @category Operations
 * @since 0.7.0
 */
export function principalAngle(angles: number[]): number {
 if (angles.length === 0) return 0;
 if (angles.length === 1) return angles[0]!;

 // Start with average as initial guess
 let principal = angleAverage(angles);
 const maxIterations = 10;

 // Iterative refinement
 for (let iter = 0; iter < maxIterations; iter++) {
  let sumX = 0;
  let sumY = 0;

  for (const angle of angles) {
   const diff = angleDifference(principal, angle);
   const weight = 1 / (Math.abs(diff) + INVERSE_WEIGHT_SMOOTHING);
   sumX += cos(angle) * weight;
   sumY += sin(angle) * weight;
  }

  const newPrincipal = atan2(sumY, sumX);
  if (Math.abs(angleDifference(principal, newPrincipal)) < ITERATIVE_TOLERANCE) {
   break;
  }
  principal = newPrincipal;
 }

 return principal;
}

/**
 * Computes the directed angle from vector1 to vector2.
 * @param x1 - X component of first vector.
 * @param y1 - Y component of first vector.
 * @param x2 - X component of second vector.
 * @param y2 - Y component of second vector.
 * @returns Angle from vector1 to vector2.
 *
 * @example
 * ```typescript
 * angleFromVectors(1, 0, 0, 1);      // Math.PI / 2 (90 degrees CCW)
 * angleFromVectors(1, 0, 1, 0);      // 0 (same direction)
 * angleFromVectors(1, 0, -1, 0);     // Math.PI (opposite)
 * ```
 *
 * @category Operations
 * @since 0.7.0
 */
export function angleFromVectors(x1: number, y1: number, x2: number, y2: number): number {
 const angle1 = atan2(y1, x1);
 const angle2 = atan2(y2, x2);
 return angleDifference(angle1, angle2);
}

/**
 * Tests if an angle represents a quadrant boundary (0, 90, 180, or 270 degrees).
 * @param radians - Angle in radians.
 * @param epsilon - Tolerance (default: EPSILON).
 * @returns True if angle is near a quadrant boundary.
 *
 * @example
 * ```typescript
 * isQuadrantAngle(0);                   // true
 * isQuadrantAngle(Math.PI / 2);         // true
 * isQuadrantAngle(Math.PI);             // true
 * isQuadrantAngle(Math.PI / 4);         // false
 * ```
 *
 * @category Operations
 * @since 0.7.0
 */
export function isQuadrantAngle(radians: number, epsilon: number = EPSILON): boolean {
 const normalized = normalizeRadiansPositive(radians);
 const quarterTurns = normalized / HALF_PI;
 const nearest = Math.round(quarterTurns);
 return Math.abs(quarterTurns - nearest) * HALF_PI <= epsilon;
}
