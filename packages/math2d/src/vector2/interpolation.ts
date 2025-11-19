/**
 * @file src/vector2/interpolation.ts
 * @module math2d/core/vector2/interpolation
 * @description Interpolation methods for Vector2.
 * @internal
 */

import { Vector2Base } from './base';
import type { ReadonlyVector2 } from './factories';
import { clamp as clampNumber, EPSILON } from '../scalar';

declare module './base' {
 // eslint-disable-next-line @typescript-eslint/no-namespace
 namespace Vector2Base {
  /**
   * Linear interpolation: `a + t (b − a)`. The factor `t` is **not** clamped.
   * @param a - Start vector.
   * @param b - End vector.
   * @param t - Interpolation factor.
   * @returns A new Vector2 equal to the linear interpolation.
   */
  function lerp(a: ReadonlyVector2, b: ReadonlyVector2, t: number): Vector2Base;

  /**
   * Alloc‑free variant writing into `outVector`.
   * @param a - Start vector.
   * @param b - End vector.
   * @param t - Interpolation factor.
   * @param outVector - Destination vector to receive the result.
   * @returns `outVector`.
   */
  function lerp(a: ReadonlyVector2, b: ReadonlyVector2, t: number, outVector: Vector2Base): Vector2Base;

  /**
   * Linear interpolation with `t` clamped to `[0, 1]`.
   * @param a - Start vector.
   * @param b - End vector.
   * @param t - Interpolation factor.
   * @returns A new Vector2 equal to the clamped interpolation.
   */
  function lerpClamped(a: ReadonlyVector2, b: ReadonlyVector2, t: number): Vector2Base;

  /**
   * Alloc‑free variant writing into `outVector`.
   * @param a - Start vector.
   * @param b - End vector.
   * @param t - Interpolation factor.
   * @param outVector - Destination vector to receive the result.
   * @returns `outVector`.
   */
  function lerpClamped(
   a: ReadonlyVector2,
   b: ReadonlyVector2,
   t: number,
   outVector: Vector2Base,
  ): Vector2Base;

  /**
   * Spherical linear interpolation between two vectors.
   *
   * This interpolates the angle while maintaining constant magnitude,
   * useful for directions. If vectors have different magnitudes, the
   * result magnitude is linearly interpolated.
   *
   * @param a - Start vector.
   * @param b - End vector.
   * @param t - Interpolation factor (0 to 1).
   * @returns A new Vector2 equal to the spherical interpolation.
   *
   * @remarks
   * - For nearly parallel vectors, falls back to linear interpolation.
   * - Handles opposite vectors gracefully.
   * - If either vector is zero, performs linear interpolation.
   *
   * @example
   * ```typescript
   * const a = new Vector2(1, 0);  // Right
   * const b = new Vector2(0, 1);  // Up
   * const mid = Vector2.slerp(a, b, 0.5);
   * console.log(mid); // ≈ (0.707, 0.707) - 45° direction
   * ```
   */
  function slerp(a: ReadonlyVector2, b: ReadonlyVector2, t: number): Vector2Base;

  /**
   * Alloc-free variant writing into `outVector`.
   * @param a - Start vector.
   * @param b - End vector.
   * @param t - Interpolation factor.
   * @param outVector - Destination vector to receive the result.
   * @returns `outVector`.
   */
  function slerp(
   a: ReadonlyVector2,
   b: ReadonlyVector2,
   t: number,
   outVector: Vector2Base,
  ): Vector2Base;
 }
}

// Implementations
Vector2Base.lerp = function (
 a: ReadonlyVector2,
 b: ReadonlyVector2,
 t: number,
 outVector?: Vector2Base,
): Vector2Base {
 const out = outVector ?? new Vector2Base();
 out.x = a.x + (b.x - a.x) * t;
 out.y = a.y + (b.y - a.y) * t;
 return out;
};

Vector2Base.lerpClamped = function (
 a: ReadonlyVector2,
 b: ReadonlyVector2,
 t: number,
 outVector?: Vector2Base,
): Vector2Base {
 const tt = t <= 0 ? 0 : t >= 1 ? 1 : t;
 return Vector2Base.lerp(a, b, tt, outVector ?? new Vector2Base());
};

Vector2Base.slerp = function (
 a: ReadonlyVector2,
 b: ReadonlyVector2,
 t: number,
 outVector?: Vector2Base,
): Vector2Base {
 const out = outVector ?? new Vector2Base();

 // Get magnitudes
 const lengthA = Math.hypot(a.x, a.y);
 const lengthB = Math.hypot(b.x, b.y);

 // Handle zero vectors
 if (lengthA === 0 || lengthB === 0) {
  return Vector2Base.lerp(a, b, t, out);
 }

 // Normalize vectors
 const ax = a.x / lengthA;
 const ay = a.y / lengthA;
 const bx = b.x / lengthB;
 const by = b.y / lengthB;

 // Calculate angle between normalized vectors
 const dot = ax * bx + ay * by;
 const clampedDot = clampNumber(dot, -1, 1);
 const theta = Math.acos(clampedDot);

 // For very small angles, use linear interpolation
 if (Math.abs(theta) < EPSILON) {
  return Vector2Base.lerp(a, b, t, out);
 }

 const sinTheta = Math.sin(theta);

 // Calculate interpolation weights
 const wa = Math.sin((1 - t) * theta) / sinTheta;
 const wb = Math.sin(t * theta) / sinTheta;

 // Interpolate magnitude
 const lengthInterp = lengthA + (lengthB - lengthA) * t;

 // Compute result
 out.x = (wa * ax + wb * bx) * lengthInterp;
 out.y = (wa * ay + wb * by) * lengthInterp;
 return out;
};
