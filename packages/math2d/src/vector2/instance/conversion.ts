/**
 * @file src/vector2/instance/conversion.ts
 * @module math2d/core/vector2/instance/conversion
 * @description Instance conversion methods for Vector2
 */

import { Vector2Base } from '../base';
import type { Vector2Like } from '../helpers';

// Module augmentation to add instance conversion methods
declare module '../base' {
  interface Vector2Base {
    // Conversion methods
    toArray(): [number, number];
    toArray<T extends ArrayLike<number>>(array: T, offset?: number): T;
    toObject(): Vector2Like;
    toJSON(): { x: number; y: number };
    toString(precision?: number): string;
    toFixed(fractionDigits?: number): string;
    toExponential(fractionDigits?: number): string;
    toPrecision(precision?: number): string;
    
    // Iterator support
    [Symbol.iterator](): IterableIterator<number>;
  }
}

// Implementation

/**
 * Writes this vector's components into an array or typed array.
 * 
 * @typeParam T - `number[]` or `Float32Array`.
 * @param array - Destination array. @defaultValue a new `number[]`
 * @param offset - Index at which to write `x` and `y`. @defaultValue `0`
 * @returns The array reference for chaining or a new tuple `[x, y]`.
 * 
 * @example
 * ```ts
 * const v = new Vector2(5, 7);
 * const arr = v.toArray();           // [5, 7]
 * const buf = new Float32Array(4);
 * v.toArray(buf, 2);                 // buf = [0, 0, 5, 7]
 * ```
 */
Vector2Base.prototype.toArray = function <T extends ArrayLike<number>>(
  array?: T, 
  offset: number = 0
): any {
  if (array === undefined) {
    return [this.x, this.y];
  }
  
  (array as any)[offset] = this.x;
  (array as any)[offset + 1] = this.y;
  return array;
};

/**
 * Returns a plain object for serialization.
 * 
 * @returns An object literal `{ x, y }`.
 */
Vector2Base.prototype.toObject = function (): Vector2Like {
  return { x: this.x, y: this.y };
};

/**
 * Returns a plain object for JSON serialization.
 * 
 * @returns An object literal `{ x, y }`.
 */
Vector2Base.prototype.toJSON = function (): { x: number; y: number } {
  return { x: this.x, y: this.y };
};

/**
 * Returns a string representation `"x,y"`.
 * 
 * @param precision - Optional number of decimal places for each component.
 * @returns The formatted string.
 */
Vector2Base.prototype.toString = function (precision?: number): string {
  return precision != null
    ? `${this.x.toFixed(precision)},${this.y.toFixed(precision)}`
    : `${this.x},${this.y}`;
};

/**
 * Returns string with fixed-point notation.
 * 
 * @param fractionDigits - Number of digits after decimal point. @defaultValue `2`
 * @returns String in format "x,y" with specified precision.
 */
Vector2Base.prototype.toFixed = function (fractionDigits: number = 2): string {
  return `${this.x.toFixed(fractionDigits)},${this.y.toFixed(fractionDigits)}`;
};

/**
 * Returns string with exponential notation.
 * 
 * @param fractionDigits - Number of digits after decimal point in exponential notation.
 * @returns String in format "x,y" with exponential notation.
 */
Vector2Base.prototype.toExponential = function (fractionDigits?: number): string {
  return fractionDigits !== undefined
    ? `${this.x.toExponential(fractionDigits)},${this.y.toExponential(fractionDigits)}`
    : `${this.x.toExponential()},${this.y.toExponential()}`;
};

/**
 * Returns string with specified significant digits.
 * 
 * @param precision - Number of significant digits.
 * @returns String in format "x,y" with specified precision.
 */
Vector2Base.prototype.toPrecision = function (precision?: number): string {
  return precision !== undefined
    ? `${this.x.toPrecision(precision)},${this.y.toPrecision(precision)}`
    : `${this.x.toPrecision()},${this.y.toPrecision()}`;
};

// Iterator support
/**
 * Enables array destructuring: `[...vector] → [x, y]`.
 * 
 * @returns An iterator yielding `x` then `y`.
 * 
 * @example
 * ```ts
 * const v = new Vector2(3, 4);
 * const [x, y] = [...v]; // x=3, y=4
 * ```
 */
Vector2Base.prototype[Symbol.iterator] = function* (): IterableIterator<number> {
  yield this.x;
  yield this.y;
};
