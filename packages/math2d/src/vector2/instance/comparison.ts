/**
 * @file src/vector2/instance/comparison.ts
 * @module math2d/core/vector2/instance/comparison
 * @description Instance comparison methods for Vector2
 */

import { Vector2Base } from '../base';
import type { ReadonlyVector2 } from '../factories';
import { TOLERANCE } from '../../constants/tolerance-types';
import { areNearEqual, isNearZero, validateTolerance } from '../../core-utils/tolerance';

// Module augmentation to add instance comparison methods
declare module '../base' {
  interface Vector2Base {
    // Comparison methods
    equals(v: ReadonlyVector2): boolean;
    nearEquals(v: ReadonlyVector2, tolerance?: number): boolean;
    fuzzyEquals(v: ReadonlyVector2, tolerance?: number): boolean; // @deprecated
    isZero(): boolean;
    nearZero(tolerance?: number): boolean;
    fuzzyZero(tolerance?: number): boolean; // @deprecated
    isUnit(): boolean;
    isFinite(): boolean;
    isParallelTo(v: ReadonlyVector2, epsilon?: number): boolean;
    isPerpendicularTo(v: ReadonlyVector2, epsilon?: number): boolean;
    
    // Utility
    hashCode(): number;
  }
}

// Implementation

/**
 * Strict component-wise equality with `v`.
 * 
 * @param v - Vector to compare.
 * @returns `true` if components are identical; otherwise `false`.
 */
Vector2Base.prototype.equals = function (v: ReadonlyVector2): boolean {
  return this.x === v.x && this.y === v.y;
};

/**
 * Approximate component-wise equality with tolerance.
 * 
 * @param v - Vector to compare.
 * @param tolerance - Non-negative tolerance. @defaultValue {@link TOLERANCE.LINEAR}
 * @returns `true` if both component differences are within `tolerance`; otherwise `false`.
 * @throws {RangeError} If `tolerance < 0`.
 */
Vector2Base.prototype.nearEquals = function (v: ReadonlyVector2, tolerance: number = TOLERANCE.LINEAR): boolean {
  validateTolerance(tolerance);
  return areNearEqual(this.x, v.x, tolerance) && areNearEqual(this.y, v.y, tolerance);
};

/**
 * @deprecated Use {@link nearEquals} instead.
 */
Vector2Base.prototype.fuzzyEquals = function (v: ReadonlyVector2, tolerance: number = TOLERANCE.LINEAR): boolean {
  return this.nearEquals(v, tolerance);
};

/**
 * Tests whether this vector is exactly `(0,0)`.
 * 
 * @returns `true` if `x === 0` and `y === 0`; otherwise `false`.
 */
Vector2Base.prototype.isZero = function (): boolean {
  return this.x === 0 && this.y === 0;
};

/**
 * Tests whether both components are within `tolerance` of `0`.
 * 
 * @param tolerance - Non-negative tolerance. @defaultValue {@link TOLERANCE.LINEAR}
 * @returns `true` if both components are within tolerance; otherwise `false`.
 * @throws {RangeError} If `tolerance < 0`.
 */
Vector2Base.prototype.nearZero = function (tolerance: number = TOLERANCE.LINEAR): boolean {
  validateTolerance(tolerance);
  return isNearZero(this.x, tolerance) && isNearZero(this.y, tolerance);
};

/**
 * @deprecated Use {@link nearZero} instead.
 */
Vector2Base.prototype.fuzzyZero = function (tolerance: number = TOLERANCE.LINEAR): boolean {
  return this.nearZero(tolerance);
};

/**
 * Tests whether this vector has unit length within `UNIT_EPSILON`.
 * 
 * @returns `true` if `|length() - 1| ≤ UNIT_EPSILON`; otherwise `false`.
 */
Vector2Base.prototype.isUnit = function (): boolean {
  return Math.abs(this.length() - 1) <= TOLERANCE.UNIT;
};

/**
 * Tests whether both components are finite numbers.
 * 
 * @returns `true` if both components are finite; otherwise `false`.
 */
Vector2Base.prototype.isFinite = function (): boolean {
  return Number.isFinite(this.x) && Number.isFinite(this.y);
};

/**
 * Parallelism test against `v` using `epsilon` tolerance.
 * 
 * @param v - Vector to compare.
 * @param epsilon - Tolerance. @defaultValue {@link TOLERANCE.ANGULAR}
 * @returns `true` if vectors are parallel within tolerance; otherwise `false`.
 */
Vector2Base.prototype.isParallelTo = function (v: ReadonlyVector2, epsilon: number = TOLERANCE.ANGULAR): boolean {
  return Math.abs(this.cross(v)) <= epsilon;
};

/**
 * Perpendicularity test against `v` using `epsilon` tolerance.
 * 
 * @param v - Vector to compare.
 * @param epsilon - Tolerance. @defaultValue {@link TOLERANCE.ANGULAR}
 * @returns `true` if vectors are perpendicular within tolerance; otherwise `false`.
 */
Vector2Base.prototype.isPerpendicularTo = function (v: ReadonlyVector2, epsilon: number = TOLERANCE.ANGULAR): boolean {
  return Math.abs(this.dot(v)) <= epsilon;
};

/**
 * Computes a fast 32-bit unsigned hash of this vector's components.
 * 
 * @returns A 32-bit unsigned integer hash (not cryptographically secure).
 */
Vector2Base.prototype.hashCode = function (): number {
  const xInt = Math.round(this.x * 1e6) & 0xffff;
  const yInt = Math.round(this.y * 1e6) & 0xffff;
  return ((xInt << 16) | yInt) >>> 0;
};
