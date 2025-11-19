/**
 * @file src/vector2/instance/comparison.ts
 * @module math2d/core/vector2/instance/comparison
 * @description Instance comparison methods for Vector2
 */

import { Vector2Base } from '../base';
import type { ReadonlyVector2 } from '../factories';
import { EPSILON } from '../../scalar';
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

Vector2Base.prototype.equals = function (v: ReadonlyVector2): boolean {
  return this.x === v.x && this.y === v.y;
};

Vector2Base.prototype.nearEquals = function (v: ReadonlyVector2, tolerance: number = EPSILON): boolean {
  validateTolerance(tolerance);
  return areNearEqual(this.x, v.x, tolerance) && areNearEqual(this.y, v.y, tolerance);
};

// @deprecated - Use nearEquals instead
Vector2Base.prototype.fuzzyEquals = function (v: ReadonlyVector2, tolerance: number = EPSILON): boolean {
  return this.nearEquals(v, tolerance);
};

Vector2Base.prototype.isZero = function (): boolean {
  return this.x === 0 && this.y === 0;
};

Vector2Base.prototype.nearZero = function (tolerance: number = EPSILON): boolean {
  validateTolerance(tolerance);
  return isNearZero(this.x, tolerance) && isNearZero(this.y, tolerance);
};

// @deprecated - Use nearZero instead
Vector2Base.prototype.fuzzyZero = function (tolerance: number = EPSILON): boolean {
  return this.nearZero(tolerance);
};

Vector2Base.prototype.isUnit = function (): boolean {
  return Math.abs(this.length() - 1) <= EPSILON;
};

Vector2Base.prototype.isFinite = function (): boolean {
  return Number.isFinite(this.x) && Number.isFinite(this.y);
};

Vector2Base.prototype.isParallelTo = function (v: ReadonlyVector2, epsilon: number = EPSILON): boolean {
  return Math.abs(this.cross(v)) <= Math.max(epsilon, EPSILON);
};

Vector2Base.prototype.isPerpendicularTo = function (v: ReadonlyVector2, epsilon: number = EPSILON): boolean {
  return Math.abs(this.dot(v)) <= Math.max(epsilon, EPSILON);
};

Vector2Base.prototype.hashCode = function (): number {
  const xInt = Math.round(this.x * 1e6) & 0xffff;
  const yInt = Math.round(this.y * 1e6) & 0xffff;
  return ((xInt << 16) | yInt) >>> 0;
};
