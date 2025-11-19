/**
 * @file src/rot2/factories.ts
 * @module math2d/rot2/factories
 * @description Factory methods for creating Rot2 instances.
 */

import { Rot2Base } from './base';
import type { ReadonlyRot2, Rot2Like } from './helpers';

declare module './base' {
  interface Rot2Base {
    /** @internal */
    constructor(c?: number, s?: number): Rot2Base;
  }
}

/**
 * Creates a rotation from explicit cosine/sine.
 * 
 * @param c - Cosine of the angle.
 * @param s - Sine of the angle.
 * @returns A new Rot2.
 * 
 * @remarks
 * This does **not** enforce unit length. If values are noisy, call
 * normalize() or normalizeSafe().
 */
Rot2Base.fromValues = function (c: number, s: number): Rot2Base {
  return new Rot2Base(c, s);
};

/**
 * Clones a rotation.
 * 
 * @param source - Rotation to clone.
 * @returns A new Rot2 with identical components.
 */
Rot2Base.clone = function (source: ReadonlyRot2): Rot2Base {
  return new Rot2Base(source.c, source.s);
};

/**
 * Copies components from one rotation into another (alloc-free).
 * 
 * @param source - Source rotation.
 * @param destination - Destination rotation.
 * @returns `destination`, now matching `source`.
 */
Rot2Base.copy = function (source: ReadonlyRot2, destination: Rot2Base): Rot2Base {
  destination.c = source.c;
  destination.s = source.s;
  return destination;
};

/**
 * Creates a rotation from an angle in radians.
 * 
 * @param angle - Angle in radians (CCW positive).
 * @param out - Optional output rotation.
 * @returns A new Rot2 or `out`.
 * 
 * @example
 * ```ts
 * const rot45 = Rot2.fromAngle(Math.PI / 4);
 * // rot45.c ≈ 0.707, rot45.s ≈ 0.707
 * ```
 */
Rot2Base.fromAngle = function (angle: number, out?: Rot2Base): Rot2Base {
  const result = out ?? new Rot2Base();
  result.c = Math.cos(angle);
  result.s = Math.sin(angle);
  return result;
};

/**
 * Creates a rotation from the angle of a direction vector.
 * 
 * @param v - Direction vector (need not be unit).
 * @param out - Optional output rotation.
 * @returns A new Rot2 or `out` representing the angle of `v`.
 * 
 * @remarks
 * - Uses `atan2(y, x)` to determine angle.
 * - Returns identity rotation for zero vector.
 * 
 * @example
 * ```ts
 * const dir = new Vector2(3, 4);
 * const rot = Rot2.fromVector(dir);
 * // rot represents angle ≈ 53.13°
 * ```
 */
Rot2Base.fromVector = function (v: { x: number; y: number }, out?: Rot2Base): Rot2Base {
  const result = out ?? new Rot2Base();
  const length = Math.hypot(v.x, v.y);
  
  if (length === 0) {
    // Zero vector: return identity
    result.c = 1;
    result.s = 0;
  } else {
    result.c = v.x / length;
    result.s = v.y / length;
  }
  
  return result;
};

/**
 * Creates a rotation from a plain object.
 * 
 * @param object - Object with `c` and `s` properties.
 * @param out - Optional output rotation.
 * @returns A new Rot2 or `out`.
 * @throws {TypeError} If `c` or `s` is not a number.
 */
Rot2Base.fromObject = function (object: Rot2Like, out?: Rot2Base): Rot2Base {
  if (typeof object.c !== 'number' || typeof object.s !== 'number') {
    throw new TypeError('Rot2.fromObject: requires numeric c and s properties');
  }
  
  const result = out ?? new Rot2Base();
  result.c = object.c;
  result.s = object.s;
  return result;
};

/**
 * Creates a rotation from an array.
 * 
 * @param array - Array with at least 2 elements `[c, s]`.
 * @param offset - Starting index. @defaultValue 0
 * @param out - Optional output rotation.
 * @returns A new Rot2 or `out`.
 * @throws {RangeError} If array is too small.
 */
Rot2Base.fromArray = function (
  array: ArrayLike<number>,
  offset: number = 0,
  out?: Rot2Base
): Rot2Base {
  if (offset < 0 || offset + 1 >= array.length) {
    throw new RangeError(
      `Rot2.fromArray: invalid offset ${offset} for array length ${array.length}`
    );
  }
  
  const result = out ?? new Rot2Base();
  result.c = array[offset]!;
  result.s = array[offset + 1]!;
  return result;
};

/**
 * Creates a random rotation uniformly distributed on the unit circle.
 * 
 * @param out - Optional output rotation.
 * @returns A new Rot2 or `out` with random angle.
 * 
 * @example
 * ```ts
 * const randomRot = Rot2.random();
 * // Random rotation between [0, 2π)
 * ```
 */
Rot2Base.random = function (out?: Rot2Base): Rot2Base {
  const angle = Math.random() * Math.PI * 2;
  return Rot2Base.fromAngle(angle, out);
};

// Export the Rot2 type as alias for the Rot2Base with all methods
export type Rot2 = Rot2Base;
