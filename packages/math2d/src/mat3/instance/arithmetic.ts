/**
 * @file src/mat3/instance/arithmetic.ts
 * @module math2d/mat3/instance/arithmetic
 * @description Arithmetic operations for Mat3.
 */

import { Mat3Base } from '../base';
import type { ReadonlyMat3 } from '../helpers';

declare module '../base' {
  interface Mat3Base {
    /**
     * Component-wise addition.
     * 
     * @param other - Matrix to add.
     * @returns This matrix after addition.
     * 
     * @example
     * ```ts
     * const m1 = Mat3.fromValues(1,2,3,4,5,6,7,8,9);
     * const m2 = Mat3.identity();
     * m1.add(m2); // [[2,2,3], [4,6,6], [7,8,10]]
     * ```
     */
    add(other: ReadonlyMat3): this;

    /**
     * Component-wise subtraction.
     * 
     * @param other - Matrix to subtract.
     * @returns This matrix after subtraction.
     */
    sub(other: ReadonlyMat3): this;

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
    multiplyComponents(other: ReadonlyMat3): this;

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
     * const m1 = Mat3.fromRotation(Math.PI / 4);
     * const m2 = Mat3.fromScaling(2, 2);
     * m1.multiply(m2); // First rotate, then scale
     * ```
     */
    multiply(m: ReadonlyMat3): this;

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
    premultiply(m: ReadonlyMat3): this;

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
     * The determinant represents the signed volume scaling factor.
     * - `det = 0`: Matrix is singular (non-invertible)
     * - `det < 0`: Matrix includes reflection
     * - `|det|`: Volume scaling factor
     */
    determinant(): number;

    /**
     * Get the trace (sum of diagonal elements).
     * 
     * @returns `tr(this) = m00 + m11 + m22`.
     */
    trace(): number;

    /**
     * Get the Frobenius norm of the matrix.
     * 
     * @returns Non-negative Frobenius norm.
     * 
     * @remarks
     * The Frobenius norm is the square root of the sum of squared elements.
     * It's equivalent to the Euclidean norm of the matrix as a vector.
     */
    frobeniusNorm(): number;
  }
}

/**
 * Component-wise addition.
 */
Mat3Base.prototype.add = function (other: ReadonlyMat3): any {
  this.m00 += other.m00;
  this.m01 += other.m01;
  this.m02 += other.m02;
  this.m10 += other.m10;
  this.m11 += other.m11;
  this.m12 += other.m12;
  this.m20 += other.m20;
  this.m21 += other.m21;
  this.m22 += other.m22;
  return this;
};

/**
 * Component-wise subtraction.
 */
Mat3Base.prototype.sub = function (other: ReadonlyMat3): any {
  this.m00 -= other.m00;
  this.m01 -= other.m01;
  this.m02 -= other.m02;
  this.m10 -= other.m10;
  this.m11 -= other.m11;
  this.m12 -= other.m12;
  this.m20 -= other.m20;
  this.m21 -= other.m21;
  this.m22 -= other.m22;
  return this;
};

/**
 * Component-wise (Hadamard) multiplication.
 */
Mat3Base.prototype.multiplyComponents = function (other: ReadonlyMat3): any {
  this.m00 *= other.m00;
  this.m01 *= other.m01;
  this.m02 *= other.m02;
  this.m10 *= other.m10;
  this.m11 *= other.m11;
  this.m12 *= other.m12;
  this.m20 *= other.m20;
  this.m21 *= other.m21;
  this.m22 *= other.m22;
  return this;
};

/**
 * Matrix multiplication: `this = this × m`.
 */
Mat3Base.prototype.multiply = function (m: ReadonlyMat3): any {
  const a00 = this.m00, a01 = this.m01, a02 = this.m02;
  const a10 = this.m10, a11 = this.m11, a12 = this.m12;
  const a20 = this.m20, a21 = this.m21, a22 = this.m22;

  this.m00 = a00 * m.m00 + a01 * m.m10 + a02 * m.m20;
  this.m01 = a00 * m.m01 + a01 * m.m11 + a02 * m.m21;
  this.m02 = a00 * m.m02 + a01 * m.m12 + a02 * m.m22;

  this.m10 = a10 * m.m00 + a11 * m.m10 + a12 * m.m20;
  this.m11 = a10 * m.m01 + a11 * m.m11 + a12 * m.m21;
  this.m12 = a10 * m.m02 + a11 * m.m12 + a12 * m.m22;

  this.m20 = a20 * m.m00 + a21 * m.m10 + a22 * m.m20;
  this.m21 = a20 * m.m01 + a21 * m.m11 + a22 * m.m21;
  this.m22 = a20 * m.m02 + a21 * m.m12 + a22 * m.m22;

  return this;
};

/**
 * Matrix pre-multiplication: `this = m × this`.
 */
Mat3Base.prototype.premultiply = function (m: ReadonlyMat3): any {
  const b00 = this.m00, b01 = this.m01, b02 = this.m02;
  const b10 = this.m10, b11 = this.m11, b12 = this.m12;
  const b20 = this.m20, b21 = this.m21, b22 = this.m22;

  this.m00 = m.m00 * b00 + m.m01 * b10 + m.m02 * b20;
  this.m01 = m.m00 * b01 + m.m01 * b11 + m.m02 * b21;
  this.m02 = m.m00 * b02 + m.m01 * b12 + m.m02 * b22;

  this.m10 = m.m10 * b00 + m.m11 * b10 + m.m12 * b20;
  this.m11 = m.m10 * b01 + m.m11 * b11 + m.m12 * b21;
  this.m12 = m.m10 * b02 + m.m11 * b12 + m.m12 * b22;

  this.m20 = m.m20 * b00 + m.m21 * b10 + m.m22 * b20;
  this.m21 = m.m20 * b01 + m.m21 * b11 + m.m22 * b21;
  this.m22 = m.m20 * b02 + m.m21 * b12 + m.m22 * b22;

  return this;
};

/**
 * Scale all components by a scalar.
 */
Mat3Base.prototype.multiplyScalar = function (scalar: number): any {
  this.m00 *= scalar;
  this.m01 *= scalar;
  this.m02 *= scalar;
  this.m10 *= scalar;
  this.m11 *= scalar;
  this.m12 *= scalar;
  this.m20 *= scalar;
  this.m21 *= scalar;
  this.m22 *= scalar;
  return this;
};

/**
 * Get the determinant of the matrix.
 * 
 * Note: This delegates to static method which will be implemented later.
 * For now, we implement it inline.
 */
Mat3Base.prototype.determinant = function (): number {
  const m00 = this.m00, m01 = this.m01, m02 = this.m02;
  const m10 = this.m10, m11 = this.m11, m12 = this.m12;
  const m20 = this.m20, m21 = this.m21, m22 = this.m22;

  const c00 = m11 * m22 - m12 * m21;
  const c01 = m10 * m22 - m12 * m20;
  const c02 = m10 * m21 - m11 * m20;

  return m00 * c00 - m01 * c01 + m02 * c02;
};

/**
 * Get the trace (sum of diagonal elements).
 */
Mat3Base.prototype.trace = function (): number {
  return this.m00 + this.m11 + this.m22;
};

/**
 * Get the Frobenius norm of the matrix.
 */
Mat3Base.prototype.frobeniusNorm = function (): number {
  const m00 = this.m00, m01 = this.m01, m02 = this.m02;
  const m10 = this.m10, m11 = this.m11, m12 = this.m12;
  const m20 = this.m20, m21 = this.m21, m22 = this.m22;

  return Math.sqrt(
    m00 * m00 + m01 * m01 + m02 * m02 +
    m10 * m10 + m11 * m11 + m12 * m12 +
    m20 * m20 + m21 * m21 + m22 * m22
  );
};
