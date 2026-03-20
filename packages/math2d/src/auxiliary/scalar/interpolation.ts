/**
 * @file auxiliary/scalar/interpolation.ts
 * @module @lenguados/math2d/auxiliary/scalar
 * @description Scalar interpolation operations
 */

import { saturate } from './arithmetic';

/**
 * Linear interpolation between two values.
 *
 * @remarks
 * The interpolation factor t is not clamped, allowing extrapolation
 * for t values outside [0, 1]. Use {@link lerpClamped} when you need
 * to ensure the result stays within [a, b].
 *
 * @param a - Start value
 * @param b - End value
 * @param t - Interpolation factor (usually 0-1)
 * @returns Interpolated value
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
 * @see {@link lerpClamped} — clamped interpolation
 * @category Interpolation
 * @since 0.7.0
 */
export function lerp(a: number, b: number, t: number): number {
 if (t === 1) return b;
 return a + (b - a) * t;
}

/**
 * Clamped linear interpolation.
 * Clamps t to [0, 1] before interpolating.
 *
 * @remarks
 * Use this when t may be outside [0, 1] and extrapolation is not desired.
 * For unclamped interpolation (allowing extrapolation), use {@link lerp}.
 *
 * @param a - Start value
 * @param b - End value
 * @param t - Interpolation factor (will be clamped to [0, 1])
 * @returns Interpolated value guaranteed to be in [a, b] (or [b, a] if b < a)
 *
 * @example
 * ```typescript
 * lerpClamped(0, 10, 0.5);   // 5
 * lerpClamped(0, 10, 1.5);   // 10 (clamped, not 15)
 * lerpClamped(0, 10, -0.5);  // 0 (clamped, not -5)
 * ```
 *
 * @see {@link lerp} — unclamped interpolation
 * @category Interpolation
 * @since 0.7.0
 */
export function lerpClamped(a: number, b: number, t: number): number {
 if (t >= 1) return b;
 if (t <= 0) return a;
 return a + (b - a) * t;
}

/**
 * Inverse linear interpolation (strict).
 * Returns t such that lerp(a, b, t) = value.
 * @param a - Start value
 * @param b - End value
 * @param value - Value to find t for
 * @returns Interpolation factor t
 * @throws {RangeError} If a === b (degenerate range)
 *
 * @example
 * ```typescript
 * inverseLerp(0, 10, 5);     // 0.5
 * inverseLerp(0, 10, 0);     // 0
 * inverseLerp(0, 10, 10);    // 1
 * ```
 *
 * @see {@link inverseLerpSafe} — Returns 0 if range is degenerate
 * @see {@link inverseLerpUnchecked} — No validation
 *
 * @category Interpolation
 * @since 0.7.0
 */
export function inverseLerp(a: number, b: number, value: number): number {
 const denominator = b - a;
 if (denominator === 0) {
  throw new RangeError('inverseLerp: degenerate range (a === b)');
 }
 return (value - a) / denominator;
}

/**
 * Inverse linear interpolation (safe).
 * @param a - Start value
 * @param b - End value
 * @param value - Value to find t for
 * @returns Interpolation factor t, or 0 if range is degenerate
 *
 * @example
 * ```typescript
 * inverseLerpSafe(0, 10, 5);     // 0.5
 * inverseLerpSafe(5, 5, 3);      // 0 (degenerate range)
 * ```
 *
 * @see {@link inverseLerp} — Throws for degenerate range
 *
 * @category Interpolation
 * @since 0.7.0
 */
export function inverseLerpSafe(a: number, b: number, value: number): number {
 const denominator = b - a;
 if (denominator === 0) return 0;
 return (value - a) / denominator;
}

/**
 * Inverse linear interpolation (unchecked).
 *
 * @remarks
 * **Precondition:** a !== b.
 *
 * @param a - Start value
 * @param b - End value (must != a)
 * @param value - Value to find t for
 * @returns Interpolation factor t
 *
 * @see {@link inverseLerp} — Throws for degenerate range
 * @see {@link inverseLerpSafe} — Returns 0 if range is degenerate
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
 *
 * @remarks
 * Produces a smooth transition with zero derivatives at the boundaries.
 * Typically used for eased interpolation between 0 and 1.
 *
 * @param edge0 - Lower edge
 * @param edge1 - Upper edge
 * @param x - Input value
 * @returns Result in [0, 1]
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
 *
 * @remarks
 * Produces an even smoother transition than smoothStep with zero
 * first and second derivatives at the boundaries.
 *
 * @param edge0 - Lower edge
 * @param edge1 - Upper edge
 * @param x - Input value
 * @returns Result in [0, 1]
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
