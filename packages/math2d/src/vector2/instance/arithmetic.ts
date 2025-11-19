/**
 * @file src/vector2/instance/arithmetic.ts
 * @module math2d/core/vector2/instance/arithmetic
 * @description Instance arithmetic methods for Vector2
 */

import { Vector2Base } from '../base';
import type { ReadonlyVector2 } from '../factories';
import { EPSILON } from '../../scalar';
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

Vector2Base.prototype.sumComponents = function (): number {
  return this.x + this.y;
};

Vector2Base.prototype.add = function (v: ReadonlyVector2): any {
  this.x += v.x;
  this.y += v.y;
  return this;
};

Vector2Base.prototype.addScalar = function (s: number): any {
  this.x += s;
  this.y += s;
  return this;
};

Vector2Base.prototype.sub = function (v: ReadonlyVector2): any {
  this.x -= v.x;
  this.y -= v.y;
  return this;
};

Vector2Base.prototype.subScalar = function (s: number): any {
  this.x -= s;
  this.y -= s;
  return this;
};

Vector2Base.prototype.multiply = function (v: ReadonlyVector2): any {
  this.x *= v.x;
  this.y *= v.y;
  return this;
};

Vector2Base.prototype.multiplyScalar = function (s: number): any {
  this.x *= s;
  this.y *= s;
  return this;
};

Vector2Base.prototype.scale = function (s: number): any {
  return this.multiplyScalar(s);
};

Vector2Base.prototype.divide = function (v: ReadonlyVector2): any {
  if (v.x === 0 || v.y === 0) {
    throw new RangeError('Vector2.divide: divisor components must be non-zero');
  }
  this.x /= v.x;
  this.y /= v.y;
  return this;
};

Vector2Base.prototype.divideScalar = function (s: number): any {
  if (s === 0) {
    throw new RangeError('Vector2.divideScalar: divisor must be non-zero');
  }
  this.x /= s;
  this.y /= s;
  return this;
};

Vector2Base.prototype.divideSafe = function (v: ReadonlyVector2): any {
  this.x = Math.abs(v.x) <= EPSILON ? 0 : this.x / v.x;
  this.y = Math.abs(v.y) <= EPSILON ? 0 : this.y / v.y;
  return this;
};

Vector2Base.prototype.divideScalarSafe = function (s: number): any {
  if (Math.abs(s) <= EPSILON) return this.zero();
  this.x /= s;
  this.y /= s;
  return this;
};

Vector2Base.prototype.mod = function (v: ReadonlyVector2): any {
  if (v.x === 0 || v.y === 0) {
    throw new RangeError('Vector2.mod: divisor components must be non-zero');
  }
  this.x %= v.x;
  this.y %= v.y;
  return this;
};

Vector2Base.prototype.modScalar = function (s: number): any {
  if (s === 0) {
    throw new RangeError('Vector2.modScalar: divisor must be non-zero');
  }
  this.x %= s;
  this.y %= s;
  return this;
};

Vector2Base.prototype.negate = function (): any {
  this.x = -this.x;
  this.y = -this.y;
  return this;
};

Vector2Base.prototype.addScaledVector = function (v: ReadonlyVector2, scale: number): any {
  this.x += v.x * scale;
  this.y += v.y * scale;
  return this;
};

// Getter for negated copy
Object.defineProperty(Vector2Base.prototype, 'negated', {
  get: function (this: Vector2Base): Vector2Base {
    return new Vector2Base(-this.x, -this.y);
  },
  enumerable: false,
  configurable: true
});
