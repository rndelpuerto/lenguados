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

// Overloaded toArray method
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

Vector2Base.prototype.toObject = function (): Vector2Like {
  return { x: this.x, y: this.y };
};

Vector2Base.prototype.toJSON = function (): { x: number; y: number } {
  return { x: this.x, y: this.y };
};

Vector2Base.prototype.toString = function (precision?: number): string {
  return precision != null
    ? `${this.x.toFixed(precision)},${this.y.toFixed(precision)}`
    : `${this.x},${this.y}`;
};

Vector2Base.prototype.toFixed = function (fractionDigits: number = 2): string {
  return `${this.x.toFixed(fractionDigits)},${this.y.toFixed(fractionDigits)}`;
};

Vector2Base.prototype.toExponential = function (fractionDigits?: number): string {
  return fractionDigits !== undefined
    ? `${this.x.toExponential(fractionDigits)},${this.y.toExponential(fractionDigits)}`
    : `${this.x.toExponential()},${this.y.toExponential()}`;
};

Vector2Base.prototype.toPrecision = function (precision?: number): string {
  return precision !== undefined
    ? `${this.x.toPrecision(precision)},${this.y.toPrecision(precision)}`
    : `${this.x.toPrecision()},${this.y.toPrecision()}`;
};

// Iterator support
Vector2Base.prototype[Symbol.iterator] = function* (): IterableIterator<number> {
  yield this.x;
  yield this.y;
};
