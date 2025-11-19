/**
 * @file src/vector2/instance/mutators.ts
 * @module math2d/core/vector2/instance/mutators
 * @description Basic instance mutator methods for Vector2
 */

import { validateArrayBounds, validateVector2Like } from '../../core-utils/validation';
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

/**
 * Returns a component by index.
 *
 * @param index - `0` for `x`, `1` for `y`.
 * @returns The selected component value.
 */
Vector2Base.prototype.getComponent = function (index: 0 | 1): number {
 return index === 1 ? this.y : this.x;
};

/**
 * Creates a shallow clone of this vector.
 *
 * @returns A new {@link Vector2Base} with the same components.
 */
Vector2Base.prototype.clone = function (): Vector2Base {
 return new Vector2Base(this.x, this.y);
};

// Swizzle getters
/**
 * Swizzle `[x, y]` into a fresh {@link Vector2Base}.
 *
 * @returns A new {@link Vector2Base} equal to `(x, y)`.
 */
Object.defineProperty(Vector2Base.prototype, 'xy', {
 get: function (this: Vector2Base): Vector2Base {
  return new Vector2Base(this.x, this.y);
 },
 enumerable: false,
 configurable: true,
});

/**
 * Swizzle `[y, x]` into a fresh {@link Vector2Base}.
 *
 * @returns A new {@link Vector2Base} equal to `(y, x)`.
 */
Object.defineProperty(Vector2Base.prototype, 'yx', {
 get: function (this: Vector2Base): Vector2Base {
  return new Vector2Base(this.y, this.x);
 },
 enumerable: false,
 configurable: true,
});

/**
 * Swizzle `[x, x]` into a fresh {@link Vector2Base}.
 *
 * @returns A new {@link Vector2Base} equal to `(x, x)`.
 */
Object.defineProperty(Vector2Base.prototype, 'xx', {
 get: function (this: Vector2Base): Vector2Base {
  return new Vector2Base(this.x, this.x);
 },
 enumerable: false,
 configurable: true,
});

/**
 * Swizzle `[y, y]` into a fresh {@link Vector2Base}.
 *
 * @returns A new {@link Vector2Base} equal to `(y, y)`.
 */
Object.defineProperty(Vector2Base.prototype, 'yy', {
 get: function (this: Vector2Base): Vector2Base {
  return new Vector2Base(this.y, this.y);
 },
 enumerable: false,
 configurable: true,
});

// Basic mutators
/**
 * Assigns both components.
 *
 * @param x - New `x` component.
 * @param y - New `y` component.
 * @returns `this` for chaining.
 */
Vector2Base.prototype.set = function (x: number, y: number): any {
 this.x = x;
 this.y = y;
 return this;
};

/**
 * Assigns a component by index.
 *
 * @param index - `0` for X, `1` for Y.
 * @param value - New value.
 * @returns `this` for chaining.
 */
Vector2Base.prototype.setComponent = function (index: 0 | 1, value: number): any {
 if (index === 1) this.y = value;
 else this.x = value;
 return this;
};

/**
 * Sets `x`.
 *
 * @param x - New `x` value.
 * @returns `this` for chaining.
 */
Vector2Base.prototype.setX = function (x: number): any {
 this.x = x;
 return this;
};

/**
 * Sets `y`.
 *
 * @param y - New `y` value.
 * @returns `this` for chaining.
 */
Vector2Base.prototype.setY = function (y: number): any {
 this.y = y;
 return this;
};

/**
 * Sets both components to the same scalar.
 *
 * @param s - Scalar value assigned to both `x` and `y`.
 * @returns `this` for chaining.
 */
Vector2Base.prototype.setScalar = function (s: number): any {
 this.x = s;
 this.y = s;
 return this;
};

/**
 * Sets components from an array.
 *
 * @param array - Source array.
 * @param offset - Starting index in the array. @defaultValue `0`
 * @returns `this` for chaining.
 * @throws {RangeError} If array doesn't have enough elements.
 */
Vector2Base.prototype.setFromArray = function (array: ArrayLike<number>, offset: number = 0): any {
 validateArrayBounds(array, offset, 2, 'Vector2.setFromArray');
 this.x = array[offset]!;
 this.y = array[offset + 1]!;
 return this;
};

/**
 * Sets components from a plain object.
 *
 * @param object - Object with `x` and `y` properties.
 * @returns `this` for chaining.
 * @throws {TypeError} If `x` or `y` is not a number.
 */
Vector2Base.prototype.setFromObject = function (object: Vector2Like): any {
 validateVector2Like(object, 'Vector2.setFromObject');
 this.x = object.x;
 this.y = object.y;
 return this;
};

/**
 * Copies from another vector.
 *
 * @param source - Source vector.
 * @returns `this` for chaining.
 */
Vector2Base.prototype.copy = function (source: ReadonlyVector2): any {
 this.x = source.x;
 this.y = source.y;
 return this;
};

/**
 * Resets both components to zero.
 *
 * @returns `this` for chaining.
 */
Vector2Base.prototype.zero = function (): any {
 this.x = 0;
 this.y = 0;
 return this;
};

/**
 * Sets both components to one.
 *
 * @returns `this` for chaining.
 */
Vector2Base.prototype.one = function (): any {
 this.x = 1;
 this.y = 1;
 return this;
};
