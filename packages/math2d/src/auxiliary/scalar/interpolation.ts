/**
 * @file auxiliary/scalar/interpolation.ts
 * @module @lenguados/math2d/auxiliary/scalar
 * @description Scalar interpolation operations.
 */

import { saturate } from './arithmetic';
import { isNearZero } from './comparison';

/**
 * Linear interpolation between two values.
 * @param a - Start value.
 * @param b - End value.
 * @param t - Interpolation factor (usually 0-1).
 * @returns Interpolated value.
 *
 * @remarks
 * The interpolation factor t is not clamped, allowing extrapolation
 * for t values outside [0, 1]. Use {@link lerpClamped} when you need
 * to ensure the result stays within [a, b].
 *
 * @example
 * ```typescript
 * lerp(0, 10, 0.5);    // 5
 * lerp(0, 10, 0);      // 0
 * lerp(0, 10, 1);      // 10
 * lerp(0, 10, 2);      // 20 (extrapolation)
 * lerp(0, 10, -0.5);   // -5 (extrapolation)
 * ```
 *
 * @see {@link lerpClamped} for clamped interpolation
 * @category Interpolation
 * @since 0.7.0
 */
export function lerp(a: number, b: number, t: number): number {
 return a + (b - a) * t;
}

/**
 * Clamped linear interpolation.
 * Clamps t to [0, 1] before interpolating.
 * @param a - Start value.
 * @param b - End value.
 * @param t - Interpolation factor (will be clamped to [0, 1]).
 * @returns Interpolated value guaranteed to be in [a, b] (or [b, a] if b < a).
 *
 * @remarks
 * Use this when t may be outside [0, 1] and extrapolation is not desired.
 * For unclamped interpolation (allowing extrapolation), use {@link lerp}.
 *
 * @example
 * ```typescript
 * lerpClamped(0, 10, 0.5);   // 5
 * lerpClamped(0, 10, 1.5);   // 10 (clamped, not 15)
 * lerpClamped(0, 10, -0.5);  // 0 (clamped, not -5)
 * ```
 *
 * @see {@link lerp} for unclamped interpolation
 * @category Interpolation
 * @since 0.7.0
 */
export function lerpClamped(a: number, b: number, t: number): number {
 const clampedT = t < 0 ? 0 : t > 1 ? 1 : t;
 return a + (b - a) * clampedT;
}

/**
 * Inverse linear interpolation (strict).
 * Returns t such that lerp(a, b, t) = value.
 * @param a - Start value.
 * @param b - End value.
 * @param value - Value to find t for.
 * @returns Interpolation factor t.
 * @throws {RangeError} If a === b (degenerate range).
 *
 * @see {@link inverseLerpSafe} - Returns 0 if range is degenerate
 * @see {@link inverseLerpUnchecked} - No validation
 *
 * @example
 * ```typescript
 * inverseLerp(0, 10, 5);     // 0.5
 * inverseLerp(0, 10, 0);     // 0
 * inverseLerp(0, 10, 10);    // 1
 * ```
 *
 * @category Interpolation
 * @since 0.7.0
 */
export function inverseLerp(a: number, b: number, value: number): number {
 const denominator = b - a;
 if (isNearZero(denominator)) {
  throw new RangeError('inverseLerp: degenerate range (a === b)');
 }
 return (value - a) / denominator;
}

/**
 * Inverse linear interpolation (safe).
 * @param a - Start value.
 * @param b - End value.
 * @param value - Value to find t for.
 * @returns Interpolation factor t, or 0 if range is degenerate.
 *
 * @category Interpolation
 * @since 0.7.0
 */
export function inverseLerpSafe(a: number, b: number, value: number): number {
 const denominator = b - a;
 if (isNearZero(denominator)) return 0;
 return (value - a) / denominator;
}

/**
 * Inverse linear interpolation (unchecked).
 * @param a - Start value.
 * @param b - End value (must != a).
 * @param value - Value to find t for.
 * @returns Interpolation factor t.
 *
 * @remarks
 * **⚠️ Precondition:** a !== b.
 *
 * @category Interpolation
 * @since 0.7.0
 */
export function inverseLerpUnchecked(a: number, b: number, value: number): number {
 return (value - a) / (b - a);
}

/**
 * Cubic Hermite interpolation (smooth step).
 * Maps [edge0, edge1] to [0, 1] with smooth curve.
 * @param edge0 - Lower edge.
 * @param edge1 - Upper edge.
 * @param x - Input value.
 * @returns Result in [0, 1].
 *
 * @remarks
 * Produces a smooth transition with zero derivatives at the boundaries.
 * Typically used for eased interpolation between 0 and 1.
 *
 * @example
 * ```typescript
 * smoothStep(0, 1, 0.5);     // 0.5
 * smoothStep(0, 10, 5);      // 0.5
 * smoothStep(0, 10, -5);     // 0 (clamped)
 * smoothStep(0, 10, 15);     // 1 (clamped)
 * ```
 *
 * @category Interpolation
 * @since 0.7.0
 */
export function smoothStep(edge0: number, edge1: number, x: number): number {
 const range = edge1 - edge0;
 if (range === 0) {
  // When edges are equal, use step function behavior
  return x < edge0 ? 0 : 1;
 }
 const t = saturate((x - edge0) / range);
 return t * t * (3 - 2 * t);
}

/**
 * Quintic Hermite interpolation (smoother step).
 * Even smoother than smoothStep.
 * @param edge0 - Lower edge.
 * @param edge1 - Upper edge.
 * @param x - Input value.
 * @returns Result in [0, 1].
 *
 * @remarks
 * Produces an even smoother transition than smoothStep with zero
 * first and second derivatives at the boundaries.
 *
 * @example
 * ```typescript
 * smootherStep(0, 1, 0.5);   // 0.5
 * smootherStep(0, 10, 5);    // 0.5
 * ```
 *
 * @category Interpolation
 * @since 0.7.0
 */
export function smootherStep(edge0: number, edge1: number, x: number): number {
 const range = edge1 - edge0;
 if (range === 0) {
  // When edges are equal, use step function behavior
  return x < edge0 ? 0 : 1;
 }
 const t = saturate((x - edge0) / range);
 return t * t * t * (t * (t * 6 - 15) + 10);
}

/**
 * Bezier interpolation using control points.
 * @param t - Parameter [0, 1].
 * @param p0 - Start point.
 * @param p1 - Control point 1.
 * @param p2 - Control point 2.
 * @param p3 - End point.
 * @returns Interpolated value.
 *
 * @remarks
 * Uses the cubic Bezier formula for smooth curves.
 *
 * @example
 * ```typescript
 * // Ease-out curve
 * bezierInterp(0.5, 0, 0.58, 1, 1);
 * ```
 *
 * @category Interpolation
 * @since 0.7.0
 */
export function bezierInterp(t: number, p0: number, p1: number, p2: number, p3: number): number {
 const t2 = t * t;
 const t3 = t2 * t;
 const mt = 1 - t;
 const mt2 = mt * mt;
 const mt3 = mt2 * mt;

 return mt3 * p0 + 3 * mt2 * t * p1 + 3 * mt * t2 * p2 + t3 * p3;
}

/**
 * Catmull-Rom spline interpolation.
 * @param t - Parameter [0, 1].
 * @param p0 - Point before start.
 * @param p1 - Start point.
 * @param p2 - End point.
 * @param p3 - Point after end.
 * @returns Interpolated value.
 *
 * @remarks
 * Passes through p1 and p2, using p0 and p3 for tangent calculation.
 *
 * @example
 * ```typescript
 * // Smooth interpolation through points
 * catmullRomInterp(0.5, 0, 1, 2, 3);  // 1.5
 * ```
 *
 * @category Interpolation
 * @since 0.7.0
 */
export function catmullRomInterp(
 t: number,
 p0: number,
 p1: number,
 p2: number,
 p3: number,
): number {
 const t2 = t * t;
 const t3 = t2 * t;

 const v0 = (p2 - p0) * 0.5;
 const v1 = (p3 - p1) * 0.5;

 return p1 + v0 * t + (3 * (p2 - p1) - 2 * v0 - v1) * t2 + (2 * (p1 - p2) + v0 + v1) * t3;
}
