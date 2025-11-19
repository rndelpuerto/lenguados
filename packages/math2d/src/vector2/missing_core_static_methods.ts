/**
 * @file src/vector2/missing_core_static_methods.ts
 * @module math2d/core/vector2/missing-core-static
 * @description Core static methods that were missing from the refactor
 */

import { Vector2Base } from './base';
import type { ReadonlyVector2 } from './factories';
import { TOLERANCE } from '../constants/tolerance-types';
import { areNearEqual, isNearZero } from '../core-utils/tolerance';
import { validateNonNegativeLength, validateNonZeroLength, ErrorMessages, createRangeError } from '../core-utils';

// Module augmentation to add missing core static methods
declare module './base' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Vector2Base {
    // Missing arithmetic
    function negate(v: ReadonlyVector2): Vector2Base;
    function negate(v: ReadonlyVector2, outVector: Vector2Base): Vector2Base;
    
    function divideScalarSafe(v: ReadonlyVector2, s: number): Vector2Base;
    function divideScalarSafe(v: ReadonlyVector2, s: number, outVector: Vector2Base): Vector2Base;
    
    // Missing transforms
    function normalize(v: ReadonlyVector2): Vector2Base;
    function normalize(v: ReadonlyVector2, outVector: Vector2Base): Vector2Base;
    
    function normalizeSafe(v: ReadonlyVector2, tolerance?: number): Vector2Base;
    function normalizeSafe(v: ReadonlyVector2, tolerance: number, outVector: Vector2Base): Vector2Base;
    
    function setLength(v: ReadonlyVector2, newLength: number): Vector2Base;
    function setLength(v: ReadonlyVector2, newLength: number, outVector: Vector2Base): Vector2Base;
    
    function setLengthSafe(v: ReadonlyVector2, newLength: number, tolerance?: number): Vector2Base;
    function setLengthSafe(v: ReadonlyVector2, newLength: number, tolerance: number, outVector: Vector2Base): Vector2Base;
    
    function reflect(v: ReadonlyVector2, unitNormal: ReadonlyVector2): Vector2Base;
    function reflect(v: ReadonlyVector2, unitNormal: ReadonlyVector2, outVector: Vector2Base): Vector2Base;
    
    function reflectSafe(v: ReadonlyVector2, normal: ReadonlyVector2, tolerance?: number): Vector2Base;
    function reflectSafe(v: ReadonlyVector2, normal: ReadonlyVector2, tolerance: number, outVector: Vector2Base): Vector2Base;
    
    function rotate(v: ReadonlyVector2, angle: number): Vector2Base;
    function rotate(v: ReadonlyVector2, angle: number, outVector: Vector2Base): Vector2Base;
    
    // Missing comparison methods
    function isZero(v: ReadonlyVector2): boolean;
    function nearZero(v: ReadonlyVector2, tolerance?: number): boolean;
    function equals(a: ReadonlyVector2, b: ReadonlyVector2): boolean;
    function nearEquals(a: ReadonlyVector2, b: ReadonlyVector2, tolerance?: number): boolean;
  }
}

// Implementation of missing core static methods

/**
 * Unary negation `(-x, -y)`.
 * 
 * @param v - Source vector.
 * @returns A new negated {@link Vector2Base}.
 */
Vector2Base.negate = function (v: ReadonlyVector2, outVector?: Vector2Base): Vector2Base {
  const out = outVector ?? new Vector2Base();
  return out.set(-v.x, -v.y);
};

/**
 * Safe scalar division. If |`s`| ≤ {@link TOLERANCE.LINEAR}, returns `(0,0)`.
 * 
 * @param v - Vector to divide.
 * @param s - Scalar divisor.
 * @returns A new {@link Vector2Base} containing the safe division.
 */
Vector2Base.divideScalarSafe = function (
  v: ReadonlyVector2,
  s: number,
  outVector?: Vector2Base
): Vector2Base {
  const out = outVector ?? new Vector2Base();
  if (Math.abs(s) <= TOLERANCE.LINEAR) return out.set(0, 0);
  return out.set(v.x / s, v.y / s);
};

/**
 * Normalizes `v` to unit length.
 * 
 * @param v - Vector to normalize.
 * @returns A new unit {@link Vector2Base}.
 * @throws {RangeError} If `v` has zero length.
 */
Vector2Base.normalize = function (v: ReadonlyVector2, outVector?: Vector2Base): Vector2Base {
  const length = Math.hypot(v.x, v.y);
  validateNonZeroLength(length * length, 'Vector2.normalize');
  const out = outVector ?? new Vector2Base();
  return out.set(v.x / length, v.y / length);
};

/**
 * Safe normalization. If `v` has zero length, returns `(0,0)`.
 * 
 * @param v - Vector to normalize.
 * @param tolerance - Zero-length tolerance. @defaultValue {@link TOLERANCE.LINEAR}
 * @returns A new {@link Vector2Base} containing the safe normalization.
 */
Vector2Base.normalizeSafe = function (
  v: ReadonlyVector2,
  toleranceOrOut?: number | Vector2Base,
  outVector?: Vector2Base
): Vector2Base {
  // Handle overloads
  let tolerance: number;
  let out: Vector2Base;
  
  if (toleranceOrOut instanceof Vector2Base) {
    tolerance = TOLERANCE.LINEAR;
    out = toleranceOrOut;
  } else {
    tolerance = toleranceOrOut ?? TOLERANCE.LINEAR;
    out = outVector ?? new Vector2Base();
  }
  
  const length = Math.hypot(v.x, v.y);
  if (length <= tolerance) {
    return out.set(0, 0);
  }
  return out.set(v.x / length, v.y / length);
};

/**
 * Returns a copy of `v` with the requested length.
 * 
 * @param v - Source vector.
 * @param newLength - Desired magnitude (≥ 0).
 * @returns A new {@link Vector2Base} with magnitude `newLength`.
 * @throws {RangeError} If `newLength < 0` or `v` has zero length.
 */
Vector2Base.setLength = function (
  v: ReadonlyVector2,
  newLength: number,
  outVector?: Vector2Base
): Vector2Base {
  validateNonNegativeLength(newLength, 'Vector2.setLength');
  
  const length = Math.hypot(v.x, v.y);
  validateNonZeroLength(length * length, 'Vector2.setLength', 'set length');
  
  const out = outVector ?? new Vector2Base();
  const s = newLength / length;
  return out.set(v.x * s, v.y * s);
};

/**
 * Safe copy with requested length. Negative `newLength` is clamped to `0`.
 * If `v` is zero, returns `(newLength, 0)`.
 * 
 * @param v - Source vector.
 * @param newLength - Desired magnitude (non-negative).
 * @param tolerance - Zero-length tolerance. @defaultValue {@link TOLERANCE.LINEAR}
 * @returns A new {@link Vector2Base} with safe length.
 */
Vector2Base.setLengthSafe = function (
  v: ReadonlyVector2,
  newLength: number,
  toleranceOrOut?: number | Vector2Base,
  outVector?: Vector2Base
): Vector2Base {
  // Handle overloads
  let tolerance: number;
  let out: Vector2Base;
  
  if (toleranceOrOut instanceof Vector2Base) {
    tolerance = TOLERANCE.LINEAR;
    out = toleranceOrOut;
  } else {
    tolerance = toleranceOrOut ?? TOLERANCE.LINEAR;
    out = outVector ?? new Vector2Base();
  }
  
  const nn = newLength < 0 ? 0 : newLength;
  const length = Math.hypot(v.x, v.y);
  
  if (length <= tolerance) {
    return out.set(nn, 0);
  }
  
  const s = nn / length;
  return out.set(v.x * s, v.y * s);
};

/**
 * Reflection of `v` about a **unit** normal: `r = v − 2(v·n̂)n̂`.
 * 
 * @param v - Incident vector.
 * @param unitNormal - Unit-length normal to reflect about.
 * @returns A new reflected {@link Vector2Base}.
 */
Vector2Base.reflect = function (
  v: ReadonlyVector2,
  unitNormal: ReadonlyVector2,
  outVector?: Vector2Base
): Vector2Base {
  const out = outVector ?? new Vector2Base();
  const dt2 = 2 * (v.x * unitNormal.x + v.y * unitNormal.y);
  return out.set(v.x - dt2 * unitNormal.x, v.y - dt2 * unitNormal.y);
};

/**
 * Safe reflection. If `normal` is not unitary, it is normalized; if `|normal| ≈ 0`, returns `v`.
 * 
 * @param v - Incident vector.
 * @param normal - Normal (need not be unitary).
 * @param tolerance - Zero-length tolerance. @defaultValue {@link TOLERANCE.LINEAR}
 * @returns A new {@link Vector2Base} equal to the safe reflection.
 */
Vector2Base.reflectSafe = function (
  v: ReadonlyVector2,
  normal: ReadonlyVector2,
  toleranceOrOut?: number | Vector2Base,
  outVector?: Vector2Base
): Vector2Base {
  // Handle overloads
  let tolerance: number;
  let out: Vector2Base;
  
  if (toleranceOrOut instanceof Vector2Base) {
    tolerance = TOLERANCE.LINEAR;
    out = toleranceOrOut;
  } else {
    tolerance = toleranceOrOut ?? TOLERANCE.LINEAR;
    out = outVector ?? new Vector2Base();
  }
  
  const length2 = normal.x * normal.x + normal.y * normal.y;
  if (length2 <= tolerance * tolerance) {
    return out.set(v.x, v.y);
  }
  
  const invLength = 1 / Math.sqrt(length2);
  const nx = normal.x * invLength;
  const ny = normal.y * invLength;
  const dt2 = 2 * (v.x * nx + v.y * ny);
  
  return out.set(v.x - dt2 * nx, v.y - dt2 * ny);
};

/**
 * Rotates `v` by an angle (radians).
 * 
 * @param v - Vector to rotate.
 * @param angle - Rotation angle in radians.
 * @returns A new rotated {@link Vector2Base}.
 */
Vector2Base.rotate = function (
  v: ReadonlyVector2,
  angle: number,
  outVector?: Vector2Base
): Vector2Base {
  const out = outVector ?? new Vector2Base();
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return out.set(v.x * c - v.y * s, v.x * s + v.y * c);
};

/**
 * Tests whether `v` is exactly `(0,0)`.
 * 
 * @param v - Vector to test.
 * @returns `true` if both components are zero; otherwise `false`.
 */
Vector2Base.isZero = function (v: ReadonlyVector2): boolean {
  return v.x === 0 && v.y === 0;
};

/**
 * Tests whether both components are within `tolerance` of `0`.
 * 
 * @param v - Vector to test.
 * @param tolerance - Non-negative tolerance. @defaultValue {@link TOLERANCE.LINEAR}
 * @returns `true` if `|x| ≤ tolerance` and `|y| ≤ tolerance`; otherwise `false`.
 * @throws {RangeError} If `tolerance < 0`.
 */
Vector2Base.nearZero = function (v: ReadonlyVector2, tolerance: number = TOLERANCE.LINEAR): boolean {
  if (tolerance < 0) {
    throw createRangeError('Vector2.nearZero', ErrorMessages.NEGATIVE_TOLERANCE);
  }
  return isNearZero(v.x, tolerance) && isNearZero(v.y, tolerance);
};

/**
 * Strict component-wise equality.
 * 
 * @param a - First vector.
 * @param b - Second vector.
 * @returns `true` if components are identical; otherwise `false`.
 */
Vector2Base.equals = function (a: ReadonlyVector2, b: ReadonlyVector2): boolean {
  return a.x === b.x && a.y === b.y;
};

/**
 * Approximate component-wise equality with tolerance.
 * 
 * @param a - First vector.
 * @param b - Second vector.
 * @param tolerance - Non-negative tolerance. @defaultValue {@link TOLERANCE.LINEAR}
 * @returns `true` if both component differences are within `tolerance`; otherwise `false`.
 * @throws {RangeError} If `tolerance < 0`.
 */
Vector2Base.nearEquals = function (
  a: ReadonlyVector2,
  b: ReadonlyVector2,
  tolerance: number = TOLERANCE.LINEAR
): boolean {
  if (tolerance < 0) {
    throw createRangeError('Vector2.nearEquals', ErrorMessages.NEGATIVE_TOLERANCE);
  }
  return areNearEqual(a.x, b.x, tolerance) && areNearEqual(a.y, b.y, tolerance);
};
