/**
 * @file auxiliary/angle/unwrapping.ts
 * @module @lenguados/math2d/auxiliary/angle
 * @description Angle unwrapping for continuous sequences.
 */

import { normalizeRadians } from './normalization';
import { angleDifference } from './operations';

/**
 * Unwraps a sequence of angles into a continuous series by
 * taking shortest-arc steps between consecutive elements.
 *
 * @param angles - Array of angles in radians.
 * @param reference - Optional continuity reference for the first element.
 * @returns New array of unwrapped angles (real-valued).
 *
 * @remarks
 * If `reference` is provided, the first element is chosen equivalent to `angles[0]`
 * but closest to `reference`.
 *
 * Note: large real jumps (> PI) will still choose the shortest path and may not
 * reflect true multi-turn motion—this is by design for continuity.
 *
 * @example
 * ```typescript
 * unwrapAngles([0, 3, -3, 0]);           // [0, 3, 3.28..., 6.28...]
 * unwrapAngles([0, Math.PI, 0]);         // [0, Math.PI, 0] (shortest arc back)
 * unwrapAngles([0, 3, 6], -Math.PI);     // [-6.28..., -3.28..., -0.28...]
 * ```
 *
 * @throws {TypeError} If input array contains holes (undefined values).
 *
 * @category Normalization
 * @since 0.7.0
 */
export function unwrapAngles(angles: number[], reference?: number): number[] {
 const n = angles.length;
 if (n === 0) return [];

 const result = new Array<number>(n).fill(0);
 const first = angles[0];

 if (first === undefined) {
  throw new TypeError('unwrapAngles: input array contains holes');
 }

 // Initialize first element
 let previous = reference !== undefined ? normalizeRadians(first - reference) + reference : first;

 result[0] = previous;

 // Unwrap subsequent elements
 for (let index = 1; index < n; index++) {
  const current = angles[index];

  if (current === undefined) {
   throw new TypeError('unwrapAngles: input array contains holes');
  }

  // Step along shortest arc
  previous = previous + angleDifference(previous, current);
  result[index] = previous;
 }

 return result;
}

/**
 * Unwraps angles in-place.
 * @param angles - Array of angles to unwrap (modified in-place).
 * @param reference - Optional continuity reference for the first element.
 * @returns The modified angles array.
 *
 * @remarks
 * More memory efficient than unwrapAngles for large arrays.
 *
 * @example
 * ```typescript
 * const angles = [0, 3, -3, 0];
 * unwrapAnglesInPlace(angles);
 * console.log(angles);  // [0, 3, 3.28..., 6.28...]
 * ```
 *
 * @throws {TypeError} If input array contains holes (undefined values).
 *
 * @category Normalization
 * @since 0.7.0
 */
export function unwrapAnglesInPlace(angles: number[], reference?: number): number[] {
 const n = angles.length;
 if (n === 0) return angles;

 const first = angles[0];

 if (first === undefined) {
  throw new TypeError('unwrapAnglesInPlace: input array contains holes');
 }

 // Initialize first element
 let previous = reference !== undefined ? normalizeRadians(first - reference) + reference : first;

 angles[0] = previous;

 // Unwrap subsequent elements
 for (let index = 1; index < n; index++) {
  const current = angles[index];

  if (current === undefined) {
   throw new TypeError('unwrapAnglesInPlace: input array contains holes');
  }

  // Step along shortest arc
  previous = previous + angleDifference(previous, current);
  angles[index] = previous;
 }

 return angles;
}

/**
 * Streaming unwrapper for angles in radians.
 * Maintains continuity across calls by accumulating shortest-arc deltas.
 *
 * @example
 * ```typescript
 * const unwrapper = new AngleUnwrapper();
 *
 * console.log(unwrapper.next(0));           // 0
 * console.log(unwrapper.next(Math.PI));     // Math.PI
 * console.log(unwrapper.next(0));           // 2 * Math.PI
 * console.log(unwrapper.value);             // 2 * Math.PI
 *
 * unwrapper.reset(0);
 * console.log(unwrapper.next(Math.PI));     // Math.PI
 * ```
 *
 * @remarks
 * For very long sequences (>100K samples), accumulated floating-point error
 * in the unwrapped value may cause precision degradation. Consider periodic
 * re-anchoring via `reset()` for such use cases.
 *
 * @category Normalization
 * @since 0.7.0
 */
export class AngleUnwrapper {
 private _initialized = false;
 private _value = 0;

 /**
  * Creates a new angle unwrapper.
  * @param initialAngle - Optional initial angle.
  */
 constructor(initialAngle?: number) {
  if (initialAngle !== undefined) {
   this._value = initialAngle;
   this._initialized = true;
  }
 }

 /**
  * Whether the unwrapper has received at least one angle.
  * Distinguishes uninitialized state from "initialized at 0".
  */
 get initialized(): boolean {
  return this._initialized;
 }

 /**
  * Feeds a new wrapped angle and returns the continuous (unwrapped) value.
  * On first call, it initializes to the provided angle.
  * @param theta - Wrapped angle in radians.
  * @returns Unwrapped angle in radians.
  *
  * @category Normalization
  * @since 0.7.0
  */
 next(theta: number): number {
  if (!this._initialized) {
   this._value = theta;
   this._initialized = true;
   return this._value;
  }

  this._value = this._value + angleDifference(this._value, theta);
  return this._value;
 }

 /**
  * Returns the last unwrapped value.
  * @returns The last unwrapped value.
  *
  * @category Normalization
  * @since 0.7.0
  */
 get value(): number {
  return this._value;
 }

 /**
  * Resets the internal state. If `theta` is provided, sets it as the starting value.
  * @param theta - Optional new starting angle.
  *
  * @category Normalization
  * @since 0.7.0
  */
 reset(theta?: number): void {
  this._initialized = theta !== undefined;
  if (theta !== undefined) {
   this._value = theta;
  } else {
   this._value = 0;
  }
 }
}
