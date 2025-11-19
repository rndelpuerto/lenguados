/**
 * @file src/mat2/instance/mutators.ts
 * @module math2d/mat2/instance/mutators
 * @description Basic mutator methods for Mat2.
 */

import type { ReadonlyVector2 } from '../../vector2';
import { Mat2Base } from '../base';
import type { ReadonlyMat2 } from '../helpers';

declare module '../base' {
  interface Mat2Base {
    /**
     * Set all components of the matrix.
     * 
     * @param m00 - Row 0, Col 0.
     * @param m01 - Row 0, Col 1.
     * @param m10 - Row 1, Col 0.
     * @param m11 - Row 1, Col 1.
     * @returns This matrix for chaining.
     */
    set(m00: number, m01: number, m10: number, m11: number): this;

    /**
     * Reset to identity matrix.
     * 
     * @returns This matrix for chaining.
     * 
     * @example
     * ```ts
     * const m = new Mat2().zero();
     * m.identity(); // [[1, 0], [0, 1]]
     * ```
     */
    identity(): this;

    /**
     * Set all components to zero.
     * 
     * @returns This matrix for chaining.
     * 
     * @example
     * ```ts
     * const m = new Mat2();
     * m.zero(); // [[0, 0], [0, 0]]
     * ```
     */
    zero(): this;

    /**
     * Create a copy of this matrix.
     * 
     * @returns A new Mat2 with the same components.
     */
    clone(): Mat2Base;

    /**
     * Copy values from another matrix.
     * 
     * @param other - Source matrix.
     * @returns This matrix for chaining.
     */
    copy(other: ReadonlyMat2): this;

    /**
     * Get a row as a new Vector2.
     * 
     * @param index - Row index (0 or 1).
     * @returns Row vector.
     * @throws {RangeError} If `index` is not 0 or 1.
     */
    getRow(index: 0 | 1): any;

    /**
     * Set a row from a vector.
     * 
     * @param index - Row index (0 or 1).
     * @param row - Row data.
     * @returns This matrix for chaining.
     * @throws {RangeError} If `index` is not 0 or 1.
     */
    setRow(index: 0 | 1, row: ReadonlyVector2): this;

    /**
     * Get a column as a new Vector2.
     * 
     * @param index - Column index (0 or 1).
     * @returns Column vector.
     * @throws {RangeError} If `index` is not 0 or 1.
     */
    getColumn(index: 0 | 1): any;

    /**
     * Set a column from a vector.
     * 
     * @param index - Column index (0 or 1).
     * @param column - Column data.
     * @returns This matrix for chaining.
     * @throws {RangeError} If `index` is not 0 or 1.
     */
    setColumn(index: 0 | 1, column: ReadonlyVector2): this;
  }
}

/**
 * Set all components of the matrix.
 */
Mat2Base.prototype.set = function (m00: number, m01: number, m10: number, m11: number): any {
  this.m00 = m00;
  this.m01 = m01;
  this.m10 = m10;
  this.m11 = m11;
  return this;
};

/**
 * Reset to identity matrix.
 */
Mat2Base.prototype.identity = function (): any {
  this.m00 = 1;
  this.m01 = 0;
  this.m10 = 0;
  this.m11 = 1;
  return this;
};

/**
 * Set all components to zero.
 */
Mat2Base.prototype.zero = function (): any {
  this.m00 = 0;
  this.m01 = 0;
  this.m10 = 0;
  this.m11 = 0;
  return this;
};

/**
 * Create a copy of this matrix.
 */
Mat2Base.prototype.clone = function (): Mat2Base {
  return new Mat2Base(this.m00, this.m01, this.m10, this.m11);
};

/**
 * Copy values from another matrix.
 */
Mat2Base.prototype.copy = function (other: ReadonlyMat2): any {
  this.m00 = other.m00;
  this.m01 = other.m01;
  this.m10 = other.m10;
  this.m11 = other.m11;
  return this;
};

// Note: getRow/setRow and getColumn/setColumn need Vector2 import, 
// which could cause circular dependency. These will be handled 
// through a separate augmentation pattern or lazy loading.
