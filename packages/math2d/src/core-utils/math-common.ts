/**
 * @file src/core-utils/math-common.ts
 * @module math2d/core-utils/math-common
 * @description Common mathematical operations used across the math2d library.
 * 
 * @remarks
 * This module extracts frequently used mathematical patterns to promote
 * code reuse and ensure consistent behavior across all components.
 */

/**
 * Clamps a value between min and max bounds.
 * 
 * @param value - The value to clamp.
 * @param min - The minimum bound.
 * @param max - The maximum bound.
 * @returns The clamped value.
 * 
 * @remarks
 * If min > max, the behavior follows Math.min(Math.max(value, min), max),
 * which effectively returns max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Component-wise minimum of two values.
 * 
 * @param a - First value.
 * @param b - Second value.
 * @returns The minimum of a and b.
 */
export function min(a: number, b: number): number {
  return Math.min(a, b);
}

/**
 * Component-wise maximum of two values.
 * 
 * @param a - First value.
 * @param b - Second value.
 * @returns The maximum of a and b.
 */
export function max(a: number, b: number): number {
  return Math.max(a, b);
}

/**
 * Computes a fast 32-bit hash from two numeric components.
 * 
 * @param x - First component.
 * @param y - Second component.
 * @param scale - Scale factor for precision. @defaultValue 1e6
 * @returns A 32-bit unsigned integer hash.
 * 
 * @remarks
 * This is not cryptographically secure but provides good distribution
 * for typical floating-point values in graphics/physics applications.
 */
export function hashComponents2D(x: number, y: number, scale: number = 1e6): number {
  const xInt = Math.round(x * scale) & 0xffff;
  const yInt = Math.round(y * scale) & 0xffff;
  return ((xInt << 16) | yInt) >>> 0;
}

/**
 * Computes a fast 32-bit hash from three numeric components.
 * 
 * @param x - First component.
 * @param y - Second component.
 * @param z - Third component.
 * @param scale - Scale factor for precision. @defaultValue 1e6
 * @returns A 32-bit unsigned integer hash.
 */
export function hashComponents3D(x: number, y: number, z: number, scale: number = 1e6): number {
  // Simple hash combining for 3 components
  const xInt = Math.round(x * scale);
  const yInt = Math.round(y * scale);
  const zInt = Math.round(z * scale);
  
  // Mix the components using prime multipliers
  let hash = xInt * 73856093;
  hash ^= yInt * 19349663;
  hash ^= zInt * 83492791;
  
  return hash >>> 0;
}

/**
 * Linear interpolation between two values.
 * 
 * @param a - Start value.
 * @param b - End value.
 * @param t - Interpolation factor (not clamped).
 * @returns The interpolated value.
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Linear interpolation with t clamped to [0, 1].
 * 
 * @param a - Start value.
 * @param b - End value.
 * @param t - Interpolation factor.
 * @returns The interpolated value with t clamped.
 */
export function lerpClamped(a: number, b: number, t: number): number {
  const tt = t <= 0 ? 0 : t >= 1 ? 1 : t;
  return a + (b - a) * tt;
}

/**
 * Robust vector length calculation using hypot.
 * 
 * @param x - X component.
 * @param y - Y component.
 * @returns The Euclidean length.
 * 
 * @remarks
 * Uses Math.hypot for numerical stability with large/small values.
 */
export function length2D(x: number, y: number): number {
  return Math.hypot(x, y);
}

/**
 * Squared length calculation (avoids square root).
 * 
 * @param x - X component.
 * @param y - Y component.
 * @returns The squared length.
 */
export function lengthSquared2D(x: number, y: number): number {
  return x * x + y * y;
}

/**
 * Manhattan (L1) length calculation.
 * 
 * @param x - X component.
 * @param y - Y component.
 * @returns The Manhattan length |x| + |y|.
 */
export function manhattanLength2D(x: number, y: number): number {
  return Math.abs(x) + Math.abs(y);
}

/**
 * 2D cross product (returns scalar z-component).
 * 
 * @param ax - First vector x.
 * @param ay - First vector y.
 * @param bx - Second vector x.
 * @param by - Second vector y.
 * @returns The z-component of the 3D cross product.
 */
export function cross2D(ax: number, ay: number, bx: number, by: number): number {
  return ax * by - ay * bx;
}

/**
 * 2D dot product.
 * 
 * @param ax - First vector x.
 * @param ay - First vector y.
 * @param bx - Second vector x.
 * @param by - Second vector y.
 * @returns The dot product.
 */
export function dot2D(ax: number, ay: number, bx: number, by: number): number {
  return ax * bx + ay * by;
}
