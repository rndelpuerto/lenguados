/**
 * @file src/rot2/instance/mutators.ts
 * @module math2d/rot2/instance/mutators
 * @description Basic mutator methods for Rot2.
 */

import { Rot2Base } from '../base';
import type { ReadonlyRot2 } from '../helpers';

declare module '../base' {
  interface Rot2Base {
    /**
     * Set both components.
     * 
     * @param c - Cosine value.
     * @param s - Sine value.
     * @returns This rotation for chaining.
     * 
     * @remarks
     * Does not enforce unit length. Call normalize() if needed.
     */
    set(c: number, s: number): this;

    /**
     * Reset to identity rotation (angle = 0).
     * 
     * @returns This rotation for chaining.
     */
    identity(): this;

    /**
     * Create a copy of this rotation.
     * 
     * @returns A new Rot2 with the same components.
     */
    clone(): Rot2Base;

    /**
     * Copy values from another rotation.
     * 
     * @param other - Source rotation.
     * @returns This rotation for chaining.
     */
    copy(other: ReadonlyRot2): this;

    /**
     * Set from angle in radians.
     * 
     * @param angle - Angle in radians (CCW positive).
     * @returns This rotation for chaining.
     */
    setFromAngle(angle: number): this;

    /**
     * Set from the angle of a direction vector.
     * 
     * @param v - Direction vector (need not be unit).
     * @returns This rotation for chaining.
     * 
     * @remarks
     * Returns identity for zero vector.
     */
    setFromVector(v: { x: number; y: number }): this;

    /**
     * Set from array.
     * 
     * @param array - Source array with [c, s].
     * @param offset - Starting index. @defaultValue 0
     * @returns This rotation for chaining.
     * @throws {RangeError} If array is too small.
     */
    setFromArray(array: ArrayLike<number>, offset?: number): this;

    /**
     * Set from object.
     * 
     * @param object - Object with c and s properties.
     * @returns This rotation for chaining.
     * @throws {TypeError} If c or s is not a number.
     */
    setFromObject(object: { c: number; s: number }): this;
  }
}

/**
 * Set both components.
 */
Rot2Base.prototype.set = function (c: number, s: number): any {
  this.c = c;
  this.s = s;
  return this;
};

/**
 * Reset to identity rotation.
 */
Rot2Base.prototype.identity = function (): any {
  this.c = 1;
  this.s = 0;
  return this;
};

/**
 * Create a copy of this rotation.
 */
Rot2Base.prototype.clone = function (): Rot2Base {
  return new Rot2Base(this.c, this.s);
};

/**
 * Copy values from another rotation.
 */
Rot2Base.prototype.copy = function (other: ReadonlyRot2): any {
  this.c = other.c;
  this.s = other.s;
  return this;
};

/**
 * Set from angle in radians.
 */
Rot2Base.prototype.setFromAngle = function (angle: number): any {
  this.c = Math.cos(angle);
  this.s = Math.sin(angle);
  return this;
};

/**
 * Set from the angle of a direction vector.
 */
Rot2Base.prototype.setFromVector = function (v: { x: number; y: number }): any {
  const length = Math.hypot(v.x, v.y);
  
  if (length === 0) {
    this.c = 1;
    this.s = 0;
  } else {
    this.c = v.x / length;
    this.s = v.y / length;
  }
  
  return this;
};

/**
 * Set from array.
 */
Rot2Base.prototype.setFromArray = function (
  array: ArrayLike<number>,
  offset: number = 0
): any {
  if (offset < 0 || offset + 1 >= array.length) {
    throw new RangeError(
      `Rot2.setFromArray: invalid offset ${offset} for array length ${array.length}`
    );
  }
  
  this.c = array[offset]!;
  this.s = array[offset + 1]!;
  return this;
};

/**
 * Set from object.
 */
Rot2Base.prototype.setFromObject = function (object: { c: number; s: number }): any {
  if (typeof object.c !== 'number' || typeof object.s !== 'number') {
    throw new TypeError('Rot2.setFromObject: requires numeric c and s properties');
  }
  
  this.c = object.c;
  this.s = object.s;
  return this;
};
