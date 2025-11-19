/**
 * @file src/vector2/instance/geometry.ts
 * @module math2d/core/vector2/instance/geometry
 * @description Instance geometry methods for Vector2
 */

import { Vector2Base } from '../base';
import type { ReadonlyVector2 } from '../factories';
import { clamp as clampNumber } from '../../scalar';

// Module augmentation to add instance geometry methods
declare module '../base' {
  interface Vector2Base {
    // Measures & geometry
    dot(v: ReadonlyVector2): number;
    cross(v: ReadonlyVector2): number;
    cross3(b: ReadonlyVector2, c: ReadonlyVector2): number;
    length(): number;
    lengthSq(): number;
    manhattanLength(): number;
    distanceTo(v: ReadonlyVector2): number;
    distanceSqTo(v: ReadonlyVector2): number;
    distanceToSq(v: ReadonlyVector2): number; // Alias for backward compatibility
    manhattanDistanceTo(v: ReadonlyVector2): number;
    
    // Direction & angles
    directionTo(target: ReadonlyVector2): Vector2Base;
    angle(): number;
    angleTo(v: ReadonlyVector2): number;
    angleBetween(v: ReadonlyVector2): number;
  }
}

// Implementation

/**
 * Dot product with `v`.
 * 
 * @param v - Second operand.
 * @returns The scalar dot product.
 */
Vector2Base.prototype.dot = function (v: ReadonlyVector2): number {
  return this.x * v.x + this.y * v.y;
};

/**
 * 2-D scalar cross product with `v`.
 * 
 * @param v - Second operand.
 * @returns The scalar cross product.
 */
Vector2Base.prototype.cross = function (v: ReadonlyVector2): number {
  return this.x * v.y - this.y * v.x;
};

/**
 * Twice the signed area of triangle `(this, b, c)`.
 * 
 * @param b - Second vertex.
 * @param c - Third vertex.
 * @returns Twice the signed area.
 */
Vector2Base.prototype.cross3 = function (b: ReadonlyVector2, c: ReadonlyVector2): number {
  return (b.x - this.x) * (c.y - this.y) - (b.y - this.y) * (c.x - this.x);
};

/**
 * Euclidean length `||this||`.
 * 
 * @returns The Euclidean norm of this vector.
 */
Vector2Base.prototype.length = function (): number {
  return Math.hypot(this.x, this.y);
};

/**
 * Squared length `||this||²`.
 * 
 * @returns The squared length of this vector.
 */
Vector2Base.prototype.lengthSq = function (): number {
  return this.x * this.x + this.y * this.y;
};

/**
 * Manhattan length.
 * 
 * @returns `|x| + |y|`.
 */
Vector2Base.prototype.manhattanLength = function (): number {
  return Math.abs(this.x) + Math.abs(this.y);
};

/**
 * Euclidean distance to `v`.
 * 
 * @param v - Target vector.
 * @returns The Euclidean distance.
 */
Vector2Base.prototype.distanceTo = function (v: ReadonlyVector2): number {
  return Math.hypot(this.x - v.x, this.y - v.y);
};

/**
 * Squared Euclidean distance to `v`.
 * 
 * @param v - Target vector.
 * @returns The squared distance.
 */
Vector2Base.prototype.distanceSqTo = function (v: ReadonlyVector2): number {
  const dx = this.x - v.x;
  const dy = this.y - v.y;
  return dx * dx + dy * dy;
};

// Alias for backward compatibility
/**
 * @deprecated Use {@link distanceSqTo} instead.
 */
Vector2Base.prototype.distanceToSq = function (v: ReadonlyVector2): number {
  return this.distanceSqTo(v);
};

/**
 * Manhattan distance to `v`.
 * 
 * @param v - Target vector.
 * @returns The Manhattan distance.
 */
Vector2Base.prototype.manhattanDistanceTo = function (v: ReadonlyVector2): number {
  return Math.abs(this.x - v.x) + Math.abs(this.y - v.y);
};

/**
 * Unit direction from `this` to `target`. Returns `(0,0)` if coincident.
 * 
 * @param target - Vector to point toward.
 * @returns A new {@link Vector2Base} representing the unit direction.
 */
Vector2Base.prototype.directionTo = function (target: ReadonlyVector2): Vector2Base {
  const dx = target.x - this.x;
  const dy = target.y - this.y;
  const length = Math.hypot(dx, dy);
  
  return length === 0 
    ? new Vector2Base(0, 0) 
    : new Vector2Base(dx / length, dy / length);
};

/**
 * Heading (angle) in radians ∈ `[-π, π]`.
 * 
 * @returns Angle in radians from the +X axis.
 */
Vector2Base.prototype.angle = function (): number {
  return Math.atan2(this.y, this.x);
};

/**
 * Signed angle to `v` (positive if `v` is CCW).
 * 
 * @param v - Target vector.
 * @returns The signed angle in radians.
 */
Vector2Base.prototype.angleTo = function (v: ReadonlyVector2): number {
  return Math.atan2(this.cross(v), this.dot(v));
};

/**
 * Smallest unsigned angle to `v` with numerical clamping.
 * 
 * @param v - Target vector.
 * @returns The unsigned angle in radians.
 */
Vector2Base.prototype.angleBetween = function (v: ReadonlyVector2): number {
  const product = this.length() * v.length();
  if (product === 0) return 0;
  
  const cosA = clampNumber(this.dot(v) / product, -1, 1);
  return Math.acos(cosA);
};
