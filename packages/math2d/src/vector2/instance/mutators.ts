/**
 * @file src/vector2/instance/mutators.ts
 * @module math2d/core/vector2/instance/mutators
 * @description Basic instance mutator methods for Vector2
 */

import { Vector2Base } from '../base';
import type { ReadonlyVector2 } from '../factories';
import type { Vector2Like } from '../helpers';

// Module augmentation to add instance mutator methods
declare module '../base' {
  interface Vector2Base {
    // Component access
    getComponent(index: 0 | 1): number;
    clone(): Vector2Base;
    
    // Swizzle getters
    get xy(): Vector2Base;
    get yx(): Vector2Base;
    get xx(): Vector2Base;
    get yy(): Vector2Base;
    
    // Basic mutators
    set(x: number, y: number): this;
    setComponent(index: 0 | 1, value: number): this;
    setX(x: number): this;
    setY(y: number): this;
    setScalar(s: number): this;
    setFromArray(array: ArrayLike<number>, offset?: number): this;
    setFromObject(object: Vector2Like): this;
    copy(source: ReadonlyVector2): this;
    zero(): this;
    one(): this;
  }
}

// Implementation

Vector2Base.prototype.getComponent = function (index: 0 | 1): number {
  return index === 1 ? this.y : this.x;
};

Vector2Base.prototype.clone = function (): Vector2Base {
  return new Vector2Base(this.x, this.y);
};

// Swizzle getters
Object.defineProperty(Vector2Base.prototype, 'xy', {
  get: function (this: Vector2Base): Vector2Base {
    return new Vector2Base(this.x, this.y);
  },
  enumerable: false,
  configurable: true
});

Object.defineProperty(Vector2Base.prototype, 'yx', {
  get: function (this: Vector2Base): Vector2Base {
    return new Vector2Base(this.y, this.x);
  },
  enumerable: false,
  configurable: true
});

Object.defineProperty(Vector2Base.prototype, 'xx', {
  get: function (this: Vector2Base): Vector2Base {
    return new Vector2Base(this.x, this.x);
  },
  enumerable: false,
  configurable: true
});

Object.defineProperty(Vector2Base.prototype, 'yy', {
  get: function (this: Vector2Base): Vector2Base {
    return new Vector2Base(this.y, this.y);
  },
  enumerable: false,
  configurable: true
});

// Basic mutators
Vector2Base.prototype.set = function (x: number, y: number): any {
  this.x = x;
  this.y = y;
  return this;
};

Vector2Base.prototype.setComponent = function (index: 0 | 1, value: number): any {
  if (index === 1) this.y = value;
  else this.x = value;
  return this;
};

Vector2Base.prototype.setX = function (x: number): any {
  this.x = x;
  return this;
};

Vector2Base.prototype.setY = function (y: number): any {
  this.y = y;
  return this;
};

Vector2Base.prototype.setScalar = function (s: number): any {
  this.x = s;
  this.y = s;
  return this;
};

Vector2Base.prototype.setFromArray = function (array: ArrayLike<number>, offset: number = 0): any {
  if (offset < 0 || offset + 1 >= array.length) {
    throw new RangeError(
      `Vector2.setFromArray: invalid offset ${offset} for array length ${array.length}`
    );
  }
  this.x = array[offset]!;
  this.y = array[offset + 1]!;
  return this;
};

Vector2Base.prototype.setFromObject = function (object: Vector2Like): any {
  if (typeof object.x !== 'number' || typeof object.y !== 'number') {
    throw new TypeError('Vector2.setFromObject: requires object with numeric x and y properties');
  }
  this.x = object.x;
  this.y = object.y;
  return this;
};

Vector2Base.prototype.copy = function (source: ReadonlyVector2): any {
  this.x = source.x;
  this.y = source.y;
  return this;
};

Vector2Base.prototype.zero = function (): any {
  this.x = 0;
  this.y = 0;
  return this;
};

Vector2Base.prototype.one = function (): any {
  this.x = 1;
  this.y = 1;
  return this;
};
