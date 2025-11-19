/**
 * @file src/mat3/instance/mutators.ts
 * @module math2d/mat3/instance/mutators
 * @description Basic mutator methods for Mat3.
 */

import { Mat3Base } from '../base';
import type { ReadonlyMat3 } from '../helpers';

declare module '../base' {
  interface Mat3Base {
    /**
     * Set all components of the matrix.
     * 
     * @param m00 - Row 0, Col 0.
     * @param m01 - Row 0, Col 1.
     * @param m02 - Row 0, Col 2.
     * @param m10 - Row 1, Col 0.
     * @param m11 - Row 1, Col 1.
     * @param m12 - Row 1, Col 2.
     * @param m20 - Row 2, Col 0.
     * @param m21 - Row 2, Col 1.
     * @param m22 - Row 2, Col 2.
     * @returns This matrix for chaining.
     */
    set(
      m00: number, m01: number, m02: number,
      m10: number, m11: number, m12: number,
      m20: number, m21: number, m22: number
    ): this;

    /**
     * Reset to identity matrix.
     * 
     * @returns This matrix for chaining.
     * 
     * @example
     * ```ts
     * const m = new Mat3().zero();
     * m.identity(); // [[1, 0, 0], [0, 1, 0], [0, 0, 1]]
     * ```
     */
    identity(): this;

    /**
     * Set all components to zero.
     * 
     * @returns This matrix for chaining.
     */
    zero(): this;

    /**
     * Create a copy of this matrix.
     * 
     * @returns A new Mat3 with the same components.
     */
    clone(): Mat3Base;

    /**
     * Copy values from another matrix.
     * 
     * @param other - Source matrix.
     * @returns This matrix for chaining.
     */
    copy(other: ReadonlyMat3): this;

    /**
     * Get a row as `{x,y,z}`.
     * 
     * @param index - 0, 1, or 2.
     * @returns A new object `{x, y, z}` containing the requested row.
     * @throws {RangeError} If `index` is not 0, 1 or 2.
     */
    getRow(index: 0 | 1 | 2): { x: number; y: number; z: number };

    /**
     * Set a row from `{x,y,z}`.
     * 
     * @param index - 0, 1, or 2.
     * @param row - Source row with `{x,y,z}`.
     * @returns This matrix for chaining.
     * @throws {RangeError} If `index` is not 0, 1 or 2.
     */
    setRow(index: 0 | 1 | 2, row: { x: number; y: number; z: number }): this;

    /**
     * Get a column as `{x,y,z}`.
     * 
     * @param index - 0, 1, or 2.
     * @returns The requested column components.
     * @throws {RangeError} If `index` is not 0, 1 or 2.
     */
    getColumn(index: 0 | 1 | 2): { x: number; y: number; z: number };

    /**
     * Set a column from `{x,y,z}`.
     * 
     * @param index - 0, 1, or 2.
     * @param column - Source column with `{x,y,z}`.
     * @returns This matrix for chaining.
     * @throws {RangeError} If `index` is not 0, 1 or 2.
     */
    setColumn(index: 0 | 1 | 2, column: { x: number; y: number; z: number }): this;
  }
}

/**
 * Set all components of the matrix.
 */
Mat3Base.prototype.set = function (
  m00: number, m01: number, m02: number,
  m10: number, m11: number, m12: number,
  m20: number, m21: number, m22: number
): any {
  this.m00 = m00;
  this.m01 = m01;
  this.m02 = m02;
  this.m10 = m10;
  this.m11 = m11;
  this.m12 = m12;
  this.m20 = m20;
  this.m21 = m21;
  this.m22 = m22;
  return this;
};

/**
 * Reset to identity matrix.
 */
Mat3Base.prototype.identity = function (): any {
  this.m00 = 1;
  this.m01 = 0;
  this.m02 = 0;
  this.m10 = 0;
  this.m11 = 1;
  this.m12 = 0;
  this.m20 = 0;
  this.m21 = 0;
  this.m22 = 1;
  return this;
};

/**
 * Set all components to zero.
 */
Mat3Base.prototype.zero = function (): any {
  this.m00 = 0;
  this.m01 = 0;
  this.m02 = 0;
  this.m10 = 0;
  this.m11 = 0;
  this.m12 = 0;
  this.m20 = 0;
  this.m21 = 0;
  this.m22 = 0;
  return this;
};

/**
 * Create a copy of this matrix.
 */
Mat3Base.prototype.clone = function (): Mat3Base {
  return new Mat3Base(
    this.m00, this.m01, this.m02,
    this.m10, this.m11, this.m12,
    this.m20, this.m21, this.m22
  );
};

/**
 * Copy values from another matrix.
 */
Mat3Base.prototype.copy = function (other: ReadonlyMat3): any {
  this.m00 = other.m00;
  this.m01 = other.m01;
  this.m02 = other.m02;
  this.m10 = other.m10;
  this.m11 = other.m11;
  this.m12 = other.m12;
  this.m20 = other.m20;
  this.m21 = other.m21;
  this.m22 = other.m22;
  return this;
};

/**
 * Get a row as {x,y,z}.
 */
Mat3Base.prototype.getRow = function (index: 0 | 1 | 2): { x: number; y: number; z: number } {
  if (index === 0) return { x: this.m00, y: this.m01, z: this.m02 };
  if (index === 1) return { x: this.m10, y: this.m11, z: this.m12 };
  if (index === 2) return { x: this.m20, y: this.m21, z: this.m22 };
  
  throw new RangeError('Mat3.getRow: index must be 0, 1 or 2');
};

/**
 * Set a row from {x,y,z}.
 */
Mat3Base.prototype.setRow = function (
  index: 0 | 1 | 2,
  row: { x: number; y: number; z: number }
): any {
  if (index === 0) {
    this.m00 = row.x;
    this.m01 = row.y;
    this.m02 = row.z;
    return this;
  }
  
  if (index === 1) {
    this.m10 = row.x;
    this.m11 = row.y;
    this.m12 = row.z;
    return this;
  }
  
  if (index === 2) {
    this.m20 = row.x;
    this.m21 = row.y;
    this.m22 = row.z;
    return this;
  }
  
  throw new RangeError('Mat3.setRow: index must be 0, 1 or 2');
};

/**
 * Get a column as {x,y,z}.
 */
Mat3Base.prototype.getColumn = function (index: 0 | 1 | 2): { x: number; y: number; z: number } {
  if (index === 0) return { x: this.m00, y: this.m10, z: this.m20 };
  if (index === 1) return { x: this.m01, y: this.m11, z: this.m21 };
  if (index === 2) return { x: this.m02, y: this.m12, z: this.m22 };
  
  throw new RangeError('Mat3.getColumn: index must be 0, 1 or 2');
};

/**
 * Set a column from {x,y,z}.
 */
Mat3Base.prototype.setColumn = function (
  index: 0 | 1 | 2,
  column: { x: number; y: number; z: number }
): any {
  if (index === 0) {
    this.m00 = column.x;
    this.m10 = column.y;
    this.m20 = column.z;
    return this;
  }
  
  if (index === 1) {
    this.m01 = column.x;
    this.m11 = column.y;
    this.m21 = column.z;
    return this;
  }
  
  if (index === 2) {
    this.m02 = column.x;
    this.m12 = column.y;
    this.m22 = column.z;
    return this;
  }
  
  throw new RangeError('Mat3.setColumn: index must be 0, 1 or 2');
};
