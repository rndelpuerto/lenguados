/**
 * @file src/mat2/instance/arithmetic.ts
 * @module math2d/mat2/instance/arithmetic
 * @description Arithmetic operations for Mat2.
 */

import { Mat2Base } from '../base';
import type { ReadonlyMat2 } from '../helpers';

declare module '../base' {
  interface Mat2Base {
    /**
     * Component-wise addition.
     * 
     * @param other - Matrix to add.
     * @returns This matrix after addition.
     * 
     * @example
     * ```ts
     * const m1 = Mat2.fromValues(1, 2, 3, 4);
     * const m2 = Mat2.fromValues(5, 6, 7, 8);
     * m1.add(m2); // [[6, 8], [10, 12]]
     * ```
     */
    add(other: ReadonlyMat2): this;

    /**
     * Component-wise subtraction.
     * 
     * @param other - Matrix to subtract.
     * @returns This matrix after subtraction.
     */
    sub(other: ReadonlyMat2): this;

    /**
     * Component-wise (Hadamard) multiplication.
     * 
     * @param other - Matrix to multiply with.
     * @returns This matrix after Hadamard multiplication.
     * 
     * @remarks
     * This is element-wise multiplication, not matrix multiplication.
     * For matrix multiplication, use {@link multiply}.
     */
    multiplyComponents(other: ReadonlyMat2): this;

    /**
     * Matrix multiplication: `this = this × m`.
     * 
     * @param m - Right-hand matrix.
     * @returns This matrix after multiplication.
     * 
     * @remarks
     * This performs right-multiplication (post-multiply).
     * For left-multiplication, use {@link premultiply}.
     * 
     * @example
     * ```ts
     * const m1 = Mat2.fromRotation(Math.PI / 4);
     * const m2 = Mat2.fromScaling(2, 2);
     * m1.multiply(m2); // First rotate, then scale
     * ```
     */
    multiply(m: ReadonlyMat2): this;

    /**
     * Matrix pre-multiplication: `this = m × this`.
     * 
     * @param m - Left-hand matrix.
     * @returns This matrix after pre-multiplication.
     * 
     * @remarks
     * This performs left-multiplication (pre-multiply).
     * Useful for building compound transforms in reverse order.
     */
    premultiply(m: ReadonlyMat2): this;

    /**
     * Scale all components by a scalar.
     * 
     * @param scalar - Scaling factor.
     * @returns This matrix for chaining.
     */
    multiplyScalar(scalar: number): this;

    /**
     * Get the determinant of the matrix.
     * 
     * @returns `det(this)`.
     * 
     * @remarks
     * The determinant represents the signed area scaling factor.
     * - `det = 0`: Matrix is singular (non-invertible)
     * - `det < 0`: Matrix includes reflection
     * - `|det|`: Area scaling factor
     */
    determinant(): number;

    /**
     * Get the trace (sum of diagonal elements).
     * 
     * @returns `tr(this) = m00 + m11`.
     */
    trace(): number;
  }
}

/**
 * Component-wise addition.
 */
Mat2Base.prototype.add = function (other: ReadonlyMat2): any {
  this.m00 += other.m00;
  this.m01 += other.m01;
  this.m10 += other.m10;
  this.m11 += other.m11;
  return this;
};

/**
 * Component-wise subtraction.
 */
Mat2Base.prototype.sub = function (other: ReadonlyMat2): any {
  this.m00 -= other.m00;
  this.m01 -= other.m01;
  this.m10 -= other.m10;
  this.m11 -= other.m11;
  return this;
};

/**
 * Component-wise (Hadamard) multiplication.
 */
Mat2Base.prototype.multiplyComponents = function (other: ReadonlyMat2): any {
  this.m00 *= other.m00;
  this.m01 *= other.m01;
  this.m10 *= other.m10;
  this.m11 *= other.m11;
  return this;
};

/**
 * Matrix multiplication: `this = this × m`.
 */
Mat2Base.prototype.multiply = function (m: ReadonlyMat2): any {
  const a00 = this.m00;
  const a01 = this.m01;
  const a10 = this.m10;
  const a11 = this.m11;

  const b00 = m.m00;
  const b01 = m.m01;
  const b10 = m.m10;
  const b11 = m.m11;

  this.m00 = a00 * b00 + a01 * b10;
  this.m01 = a00 * b01 + a01 * b11;
  this.m10 = a10 * b00 + a11 * b10;
  this.m11 = a10 * b01 + a11 * b11;

  return this;
};

/**
 * Matrix pre-multiplication: `this = m × this`.
 */
Mat2Base.prototype.premultiply = function (m: ReadonlyMat2): any {
  const a00 = m.m00;
  const a01 = m.m01;
  const a10 = m.m10;
  const a11 = m.m11;

  const b00 = this.m00;
  const b01 = this.m01;
  const b10 = this.m10;
  const b11 = this.m11;

  this.m00 = a00 * b00 + a01 * b10;
  this.m01 = a00 * b01 + a01 * b11;
  this.m10 = a10 * b00 + a11 * b10;
  this.m11 = a10 * b01 + a11 * b11;

  return this;
};

/**
 * Scale all components by a scalar.
 */
Mat2Base.prototype.multiplyScalar = function (scalar: number): any {
  this.m00 *= scalar;
  this.m01 *= scalar;
  this.m10 *= scalar;
  this.m11 *= scalar;
  return this;
};

/**
 * Get the determinant of the matrix.
 */
Mat2Base.prototype.determinant = function (): number {
  return this.m00 * this.m11 - this.m01 * this.m10;
};

/**
 * Get the trace (sum of diagonal elements).
 */
Mat2Base.prototype.trace = function (): number {
  return this.m00 + this.m11;
};
