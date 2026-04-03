/**
 * @file auxiliary/angle/unwrapping.ts
 * @module @lenguados/math2d/auxiliary/angle
 * @description Angle unwrapping for continuous sequences
 */

import { normalizeRadians } from './normalization';
import { angleDifference } from './operations';

/**
 * Shared iteration logic for angle unwrapping.
 * Writes unwrapped values into `output` starting from index 0.
 *
 * @param input - Source angles to read from
 * @param output - Destination array to write unwrapped values into
 * @param callerName - Name of the calling function (for error messages)
 * @param reference - Optional continuity reference for the first element
 * @returns The last unwrapped value (previous)
 */
function unwrapIteration(
 input: number[],
 output: number[],
 callerName: string,
 reference?: number,
): void {
 const n = input.length;
 const first = input[0];

 if (first === undefined) {
  throw new TypeError(`${callerName}: input array contains holes`);
 }

 // Initialize first element
 let previous = reference !== undefined ? normalizeRadians(first - reference) + reference : first;

 output[0] = previous;

 // Unwrap subsequent elements
 for (let index = 1; index < n; index++) {
  const current = input[index];

  if (current === undefined) {
   throw new TypeError(`${callerName}: input array contains holes`);
  }

  // Step along shortest arc
  previous = previous + angleDifference(previous, current);
  output[index] = previous;
 }
}

/**
 * Unwraps a sequence of angles into a continuous series by
 * taking shortest-arc steps between consecutive elements.
 *
 * @remarks
 * If `reference` is provided, the first element is chosen equivalent to `angles[0]`
 * but closest to `reference`.
 *
 * Note: large real jumps (> PI) will still choose the shortest path and may not
 * reflect true multi-turn motion—this is by design for continuity.
 *
 * @param angles - Array of angles in radians
 * @param reference - Optional continuity reference for the first element
 * @returns New array of unwrapped angles (real-valued)
 *
 * @throws {TypeError} If input array contains holes (undefined values)
 *
 * @example
 * ```typescript
 * unwrapAngles([0, 3, -3, 0]);           // [0, 3, 3.28..., 6.28...]
 * unwrapAngles([0, Math.PI, 0]);         // [0, Math.PI, 2 * Math.PI] (continuous CCW)
 * unwrapAngles([0, 3, 6], -2 * Math.PI);  // [-6.28..., -3.28..., -0.28...]
 * ```
 *
 * @category Normalization
 * @since 0.7.0
 */
export function unwrapAngles(angles: number[], reference?: number): number[] {
 const n = angles.length;
 if (n === 0) return [];

 const result = new Array<number>(n).fill(0);
 unwrapIteration(angles, result, 'unwrapAngles', reference);
 return result;
}

/**
 * Unwraps angles in-place.
 *
 * @remarks
 * More memory efficient than unwrapAngles for large arrays.
 *
 * @param angles - Array of angles to unwrap (modified in-place)
 * @param reference - Optional continuity reference for the first element
 * @returns The modified angles array
 *
 * @throws {TypeError} If input array contains holes (undefined values)
 *
 * @example
 * ```typescript
 * const angles = [0, 3, -3, 0];
 * unwrapAnglesInPlace(angles);
 * console.log(angles);  // [0, 3, 3.28..., 6.28...]
 * ```
 *
 * @category Normalization
 * @since 0.7.0
 */
export function unwrapAnglesInPlace(angles: number[], reference?: number): number[] {
 const n = angles.length;
 if (n === 0) return angles;

 unwrapIteration(angles, angles, 'unwrapAnglesInPlace', reference);
 return angles;
}

/**
 * Streaming unwrapper for angles in radians.
 * Maintains continuity across calls by accumulating shortest-arc deltas.
 *
 * @remarks
 * For very long sequences (>100K samples), accumulated floating-point error
 * in the unwrapped value may cause precision degradation. Consider periodic
 * re-anchoring via `reset()` for such use cases.
 *
 * @example
 * ```typescript
 * const unwrapper = new AngleUnwrapper();
 *
 * console.log(unwrapper.next(0));           // 0
 * console.log(unwrapper.next(3));           // 3
 * console.log(unwrapper.next(-3));          // 3.28... (continuous, not jumping to -3)
 * console.log(unwrapper.value);             // 3.28...
 *
 * unwrapper.reset(0);
 * console.log(unwrapper.next(1));           // 1
 * ```
 *
 * @category Normalization
 * @since 0.7.0
 */
export class AngleUnwrapper {
 private _initialized = false;
 private _value = 0;

 /**
  * Creates a new angle unwrapper.
  * @param initialAngle - Optional initial angle
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
  * @returns True if the unwrapper has been initialized
  * @category Accessor
  * @since 0.7.0
  */
 get initialized(): boolean {
  return this._initialized;
 }

 /**
  * Feeds a new wrapped angle and returns the continuous (unwrapped) value.
  * On first call, it initializes to the provided angle.
  * @param theta - Wrapped angle in radians
  * @returns Unwrapped angle in radians
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
  * @returns The last unwrapped value
  *
  * @category Normalization
  * @since 0.7.0
  */
 get value(): number {
  return this._value;
 }

 /**
  * Resets the internal state. If `theta` is provided, sets it as the starting value.
  * @param theta - Optional new starting angle
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
