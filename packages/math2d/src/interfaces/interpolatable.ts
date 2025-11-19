/**
 * @file src/interfaces/interpolatable.ts
 * @module math2d/interfaces/interpolatable
 * @description Interface for objects that support interpolation operations.
 * 
 * @remarks
 * This interface defines the contract for types that support various
 * forms of interpolation between values.
 */

/**
 * Interface for objects that can be interpolated.
 * 
 * @typeParam T - The type of object to interpolate with (often same as implementing type).
 */
export interface Interpolatable<T> {
  /**
   * Linear interpolation towards another object.
   * 
   * @param target - Target object to interpolate towards.
   * @param t - Interpolation factor (0 = this, 1 = target).
   * @returns `this` for method chaining.
   * @remarks
   * The factor `t` is not clamped, allowing extrapolation.
   */
  lerp(target: T, t: number): this;

  /**
   * Linear interpolation with clamped factor.
   * 
   * @param target - Target object to interpolate towards.
   * @param t - Interpolation factor, clamped to [0, 1].
   * @returns `this` for method chaining.
   */
  lerpClamped?(target: T, t: number): this;

  /**
   * Spherical linear interpolation.
   * 
   * @param target - Target object to interpolate towards.
   * @param t - Interpolation factor (0 = this, 1 = target).
   * @returns `this` for method chaining.
   * @remarks
   * Useful for interpolating directions while maintaining magnitude.
   */
  slerp?(target: T, t: number): this;
}

/**
 * Static interface for interpolation operations.
 * 
 * @typeParam T - The type of objects being interpolated.
 */
export interface InterpolatableStatic<T> {
  /**
   * Linear interpolation between two objects.
   * 
   * @param a - Start object (at t=0).
   * @param b - End object (at t=1).
   * @param t - Interpolation factor.
   * @returns A new interpolated object.
   */
  lerp(a: T, b: T, t: number): T;

  /**
   * Linear interpolation, writing to output.
   * 
   * @param a - Start object (at t=0).
   * @param b - End object (at t=1).
   * @param t - Interpolation factor.
   * @param out - Object to write the result to.
   * @returns The `out` object with interpolated values.
   */
  lerp(a: T, b: T, t: number, out: T): T;

  /**
   * Linear interpolation with clamped factor.
   * 
   * @param a - Start object (at t=0).
   * @param b - End object (at t=1).
   * @param t - Interpolation factor, clamped to [0, 1].
   * @returns A new interpolated object.
   */
  lerpClamped?(a: T, b: T, t: number): T;

  /**
   * Linear interpolation with clamped factor, writing to output.
   * 
   * @param a - Start object (at t=0).
   * @param b - End object (at t=1).
   * @param t - Interpolation factor, clamped to [0, 1].
   * @param out - Object to write the result to.
   * @returns The `out` object with interpolated values.
   */
  lerpClamped?(a: T, b: T, t: number, out: T): T;

  /**
   * Spherical linear interpolation.
   * 
   * @param a - Start object (at t=0).
   * @param b - End object (at t=1).
   * @param t - Interpolation factor.
   * @returns A new interpolated object.
   */
  slerp?(a: T, b: T, t: number): T;

  /**
   * Spherical linear interpolation, writing to output.
   * 
   * @param a - Start object (at t=0).
   * @param b - End object (at t=1).
   * @param t - Interpolation factor.
   * @param out - Object to write the result to.
   * @returns The `out` object with interpolated values.
   */
  slerp?(a: T, b: T, t: number, out: T): T;
}

/**
 * Interface for objects that support weighted combinations.
 * 
 * @typeParam T - The type of objects to combine.
 */
export interface WeightedCombinable<T> {
  /**
   * Adds a scaled object to this one: this += scale * other.
   * 
   * @param other - Object to scale and add.
   * @param scale - Scale factor.
   * @returns `this` for method chaining.
   */
  addScaledVector?(other: T, scale: number): this;
}

/**
 * Static interface for weighted combination operations.
 * 
 * @typeParam T - The type of objects being combined.
 */
export interface WeightedCombinableStatic<T> {
  /**
   * Computes base + scale * scaled.
   * 
   * @param base - Base object.
   * @param scaled - Object to scale and add.
   * @param scale - Scale factor.
   * @returns A new object with the weighted sum.
   */
  addScaledVector?(base: T, scaled: T, scale: number): T;

  /**
   * Computes base + scale * scaled, writing to output.
   * 
   * @param base - Base object.
   * @param scaled - Object to scale and add.
   * @param scale - Scale factor.
   * @param out - Object to write the result to.
   * @returns The `out` object with the weighted sum.
   */
  addScaledVector?(base: T, scaled: T, scale: number, out: T): T;
}
