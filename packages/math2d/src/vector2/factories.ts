/**
 * @file src/vector2/factories.ts
 * @module math2d/core/vector2/factories
 * @description Static factory methods for creating Vector2 instances.
 * @internal
 */

import { Vector2Base } from './base';
import type { ReadonlyVector2Like, Vector2Like } from './helpers';

/**
 * Readonly view of a Vector2 instance.
 * @public
 */
export type ReadonlyVector2 = Readonly<Vector2Base>;

declare module './base' {
 // eslint-disable-next-line @typescript-eslint/no-namespace
 namespace Vector2Base {
  /**
   * Creates a deep copy of `source`.
   *
   * @param source - Vector to clone.
   * @returns A new Vector2 instance with identical components.
   */
  function clone(source: ReadonlyVector2): Vector2Base;

  /**
   * Copies component values from `source` into `destination` (alloc‑free).
   *
   * @param source - Source vector.
   * @param destination - Target vector to receive the copy.
   * @returns The `destination` vector (for chaining).
   */
  function copy(source: ReadonlyVector2, destination: Vector2Base): Vector2Base;

  /**
   * Constructs a vector from explicit components.
   *
   * @param x - X component.
   * @param y - Y component.
   * @returns A new Vector2 with components `(x, y)`.
   */
  function fromValues(x: number, y: number): Vector2Base;

  /**
   * Creates a vector from a flat numeric array.
   * @param sourceArray - Numeric array with at least two elements.
   * @param offset - Index of the **x** component. @defaultValue `0`
   * @returns A new Vector2 initialized from the array.
   * @throws {RangeError} If `offset` is out of bounds for `sourceArray`.
   */
  function fromArray(sourceArray: ArrayLike<number>, offset?: number): Vector2Base;
  
  /**
   * Reads components from `sourceArray` into `outVector` (alloc‑free).
   * @param sourceArray - Numeric array.
   * @param offset - Index of the **x** component. @defaultValue `0`
   * @param outVector - Target vector to populate.
   * @returns The `outVector`.
   * @throws {RangeError} If `offset` is out of bounds for `sourceArray`.
   */
  function fromArray(
   sourceArray: ArrayLike<number>,
   offset: number,
   outVector: Vector2Base,
  ): Vector2Base;

  /**
   * Creates a vector from a plain object.
   * @param object - Plain object with numeric `x` and `y` properties.
   * @returns A new Vector2 with components from `object`.
   */
  function fromObject(object: Vector2Like): Vector2Base;

  /**
   * Extracts components from `object` into `outVector` (alloc‑free).
   * @param object - Plain object with numeric `x` and `y` properties.
   * @param outVector - Target vector to populate.
   * @returns The `outVector`.
   */
  function fromObject(object: Vector2Like, outVector: Vector2Base): Vector2Base;

  /**
   * Creates a unit vector from an angle.
   * @param angle - Angle in radians (CCW from +X axis).
   * @param length - Optional length multiplier. @defaultValue `1`
   * @returns A new Vector2 with components `(length * cos(angle), length * sin(angle))`.
   */
  function fromAngle(angle: number, length?: number): Vector2Base;

  /**
   * Creates a vector from angle into `outVector` (alloc‑free).
   * @param angle - Angle in radians (CCW from +X axis).
   * @param length - Length multiplier.
   * @param outVector - Target vector to populate.
   * @returns The `outVector`.
   */
  function fromAngle(angle: number, length: number, outVector: Vector2Base): Vector2Base;
 }
}

// Implementation
Vector2Base.clone = function (source: ReadonlyVector2): Vector2Base {
 return new Vector2Base(source.x, source.y);
};

Vector2Base.copy = function (source: ReadonlyVector2, destination: Vector2Base): Vector2Base {
 destination.x = source.x;
 destination.y = source.y;
 return destination;
};

Vector2Base.fromValues = function (x: number, y: number): Vector2Base {
 return new Vector2Base(x, y);
};

Vector2Base.fromArray = function (
 sourceArray: ArrayLike<number>,
 offsetOrOutVector?: number | Vector2Base,
 outVector?: Vector2Base,
): Vector2Base {
 if (typeof offsetOrOutVector === 'object') {
  // Overload: fromArray(array, outVector)
  outVector = offsetOrOutVector;
  offsetOrOutVector = 0;
 }
 const offset = offsetOrOutVector ?? 0;
 const out = outVector ?? new Vector2Base();

 if (offset < 0 || offset + 1 >= sourceArray.length) {
  throw new RangeError(
   `Vector2.fromArray: offset ${offset} is out of bounds for array of length ${sourceArray.length}`,
  );
 }

 out.x = sourceArray[offset];
 out.y = sourceArray[offset + 1];
 return out;
};

Vector2Base.fromObject = function (
 object: Vector2Like,
 outVector?: Vector2Base,
): Vector2Base {
 const out = outVector ?? new Vector2Base();
 out.x = object.x;
 out.y = object.y;
 return out;
};

Vector2Base.fromAngle = function (
 angle: number,
 lengthOrOutVector?: number | Vector2Base,
 outVector?: Vector2Base,
): Vector2Base {
 if (typeof lengthOrOutVector === 'object') {
  // Overload: fromAngle(angle, outVector)
  outVector = lengthOrOutVector;
  lengthOrOutVector = 1;
 }
 const length = lengthOrOutVector ?? 1;
 const out = outVector ?? new Vector2Base();

 out.x = length * Math.cos(angle);
 out.y = length * Math.sin(angle);
 return out;
};
