/**
 * @file src/vector2/instance/arithmetic.ts
 * @module math2d/core/vector2/instance/arithmetic
 * @description Instance arithmetic methods for Vector2
 */

import { Vector2Base } from '../base';
import type { ReadonlyVector2 } from '../factories';
import { TOLERANCE } from '../../constants/tolerance-types';
import { safeDiv } from '../../numeric';

// Module augmentation to add instance arithmetic methods
declare module '../base' {
  interface Vector2Base {
    // Basic arithmetic
    sumComponents(): number;
    add(v: ReadonlyVector2): this;
    addScalar(s: number): this;
    sub(v: ReadonlyVector2): this;
    subScalar(s: number): this;
    multiply(v: ReadonlyVector2): this;
    multiplyScalar(s: number): this;
    scale(s: number): this;
    divide(v: ReadonlyVector2): this;
    divideScalar(s: number): this;
    divideSafe(v: ReadonlyVector2): this;
    divideScalarSafe(s: number): this;
    mod(v: ReadonlyVector2): this;
    modScalar(s: number): this;
    negate(): this;
    addScaledVector(v: ReadonlyVector2, scale: number): this;
    
    // Getters for immutable operations
    get negated(): Vector2Base;
  }
}

// Implementation

/**
 * Returns the sum of components `x + y`.
 * 
 * @returns The scalar sum of components.
 */
Vector2Base.prototype.sumComponents = function (): number {
  return this.x + this.y;
};

/**
 * Adds `v` component-wise to `this`.
 * 
 * @param v - Vector to add.
 * @returns `this` for chaining.
 */
Vector2Base.prototype.add = function (v: ReadonlyVector2): any {
  this.x += v.x;
  this.y += v.y;
  return this;
};

/**
 * Adds scalar `s` to both components.
 * 
 * @param s - Scalar to add.
 * @returns `this` for chaining.
 */
Vector2Base.prototype.addScalar = function (s: number): any {
  this.x += s;
  this.y += s;
  return this;
};

/**
 * Subtracts `v` component-wise from `this`.
 * 
 * @param v - Vector to subtract.
 * @returns `this` for chaining.
 */
Vector2Base.prototype.sub = function (v: ReadonlyVector2): any {
  this.x -= v.x;
  this.y -= v.y;
  return this;
};

/**
 * Subtracts scalar `s` from both components.
 * 
 * @param s - Scalar to subtract.
 * @returns `this` for chaining.
 */
Vector2Base.prototype.subScalar = function (s: number): any {
  this.x -= s;
  this.y -= s;
  return this;
};

/**
 * Multiplies `this` by `v` component-wise.
 * 
 * @param v - Vector multiplier.
 * @returns `this` for chaining.
 */
Vector2Base.prototype.multiply = function (v: ReadonlyVector2): any {
  this.x *= v.x;
  this.y *= v.y;
  return this;
};

/**
 * Scales `this` by scalar `s`.
 * 
 * @param s - Scale factor.
 * @returns `this` for chaining.
 */
Vector2Base.prototype.multiplyScalar = function (s: number): any {
  this.x *= s;
  this.y *= s;
  return this;
};

/**
 * Alias for {@link multiplyScalar}.
 * 
 * @param s - Scale factor.
 * @returns `this` for chaining.
 */
Vector2Base.prototype.scale = function (s: number): any {
  return this.multiplyScalar(s);
};

/**
 * Component-wise division by `v`.
 * 
 * @param v - Divisor vector.
 * @returns `this` for chaining.
 * @throws {RangeError} If any component of `v` is zero.
 */
Vector2Base.prototype.divide = function (v: ReadonlyVector2): any {
  if (v.x === 0 || v.y === 0) {
    throw new RangeError('Vector2.divide: divisor components must be non-zero');
  }
  this.x /= v.x;
  this.y /= v.y;
  return this;
};

/**
 * Scalar division `this /= s`.
 * 
 * @param s - Non-zero scalar divisor.
 * @returns `this` for chaining.
 * @throws {RangeError} If `s === 0`.
 */
Vector2Base.prototype.divideScalar = function (s: number): any {
  if (s === 0) {
    throw new RangeError('Vector2.divideScalar: divisor must be non-zero');
  }
  this.x /= s;
  this.y /= s;
  return this;
};

/**
 * Safe component-wise division (|divisor| ≤ LINEAR_EPSILON → component becomes `0`).
 * 
 * @param v - Divisor vector.
 * @returns `this` for chaining.
 */
Vector2Base.prototype.divideSafe = function (v: ReadonlyVector2): any {
  this.x = Math.abs(v.x) <= TOLERANCE.LINEAR ? 0 : this.x / v.x;
  this.y = Math.abs(v.y) <= TOLERANCE.LINEAR ? 0 : this.y / v.y;
  return this;
};

/**
 * Safe scalar division (|`s`| ≤ LINEAR_EPSILON → `(0,0)`).
 * 
 * @param s - Scalar divisor.
 * @returns `this` for chaining.
 */
Vector2Base.prototype.divideScalarSafe = function (s: number): any {
  if (Math.abs(s) <= TOLERANCE.LINEAR) return this.zero();
  this.x /= s;
  this.y /= s;
  return this;
};

/**
 * Component-wise remainder.
 * 
 * @param v - Divisor vector (non-zero components).
 * @returns `this` for chaining.
 * @throws {RangeError} If any component of `v` is zero.
 */
Vector2Base.prototype.mod = function (v: ReadonlyVector2): any {
  if (v.x === 0 || v.y === 0) {
    throw new RangeError('Vector2.mod: divisor components must be non-zero');
  }
  this.x %= v.x;
  this.y %= v.y;
  return this;
};

/**
 * Scalar remainder.
 * 
 * @param s - Non-zero scalar divisor.
 * @returns `this` for chaining.
 * @throws {RangeError} If `s === 0`.
 */
Vector2Base.prototype.modScalar = function (s: number): any {
  if (s === 0) {
    throw new RangeError('Vector2.modScalar: divisor must be non-zero');
  }
  this.x %= s;
  this.y %= s;
  return this;
};

/**
 * Negates both components in place.
 * 
 * @returns `this` for chaining.
 */
Vector2Base.prototype.negate = function (): any {
  this.x = -this.x;
  this.y = -this.y;
  return this;
};

/**
 * Adds a scaled vector: `this += scale * v`.
 * 
 * @param v - Vector to scale and add.
 * @param scale - Scale factor.
 * @returns `this` for chaining.
 */
Vector2Base.prototype.addScaledVector = function (v: ReadonlyVector2, scale: number): any {
  this.x += v.x * scale;
  this.y += v.y * scale;
  return this;
};

// Getter for negated copy
/**
 * Negated copy of this vector.
 * 
 * @returns A new {@link Vector2Base} equal to `(-x, -y)`.
 */
Object.defineProperty(Vector2Base.prototype, 'negated', {
  get: function (this: Vector2Base): Vector2Base {
    return new Vector2Base(-this.x, -this.y);
  },
  enumerable: false,
  configurable: true
});
