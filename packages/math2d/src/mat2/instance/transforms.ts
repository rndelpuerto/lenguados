/**
 * @file src/mat2/instance/transforms.ts
 * @module math2d/mat2/instance/transforms
 * @description Transformation operations for Mat2.
 */

import { TOLERANCE } from '../../constants/tolerance-types';
import { createRangeError, ErrorMessages } from '../../core-utils';
import { Mat2Base } from '../base';

declare module '../base' {
  interface Mat2Base {
    /**
     * Floor all components.
     * 
     * @returns This matrix after flooring.
     */
    floor(): this;

    /**
     * Ceiling all components.
     * 
     * @returns This matrix after ceiling.
     */
    ceil(): this;

    /**
     * Round all components.
     * 
     * @returns This matrix after rounding.
     */
    round(): this;

    /**
     * Absolute value of all components.
     * 
     * @returns This matrix after {@link Math.abs} per component.
     */
    abs(): this;

    /**
     * Transpose the matrix (swap rows and columns).
     * 
     * @returns This matrix after transposition.
     * 
     * @example
     * ```ts
     * const m = Mat2.fromValues(1, 2, 3, 4);
     * m.transpose(); // [[1, 3], [2, 4]]
     * ```
     */
    transpose(): this;

    /**
     * Invert the matrix.
     * 
     * @returns This matrix after inversion.
     * @throws {RangeError} If the matrix is singular.
     * 
     * @remarks
     * The inverse satisfies: `M × M⁻¹ = I`.
     * Throws if determinant is zero (singular matrix).
     */
    inverse(): this;

    /**
     * Safe inversion with tolerance.
     * 
     * @param tolerance - Determinant tolerance. @defaultValue {@link TOLERANCE.DETERMINANT}
     * @returns This matrix after "safe" inversion (or zero).
     * 
     * @remarks
     * If the determinant is below tolerance, returns zero matrix
     * instead of throwing.
     */
    inverseSafe(tolerance?: number): this;

    /**
     * Set this matrix to a pure rotation.
     * 
     * @param angle - Rotation angle in radians.
     * @returns This matrix, now a rotation.
     */
    setRotation(angle: number): this;

    /**
     * Apply a rotation to this matrix.
     * 
     * @param angle - Rotation angle in radians.
     * @returns This matrix after rotation.
     * 
     * @remarks
     * Equivalent to: `this = this × Rot(angle)`.
     */
    rotate(angle: number): this;

    /**
     * Apply a scale to this matrix.
     * 
     * @param sx - X scale factor.
     * @param sy - Y scale factor.
     * @returns This matrix after scaling.
     * 
     * @remarks
     * Equivalent to: `this = this × Scale(sx, sy)`.
     */
    scale(sx: number, sy: number): this;

    /**
     * Apply a shear to this matrix.
     * 
     * @param shx - Horizontal shear.
     * @param shy - Vertical shear.
     * @returns This matrix after shearing.
     * 
     * @remarks
     * Equivalent to: `this = this × Shear(shx, shy)`.
     */
    shear(shx: number, shy: number): this;
  }
}

/**
 * Floor all components.
 */
Mat2Base.prototype.floor = function (): any {
  this.m00 = Math.floor(this.m00);
  this.m01 = Math.floor(this.m01);
  this.m10 = Math.floor(this.m10);
  this.m11 = Math.floor(this.m11);
  return this;
};

/**
 * Ceiling all components.
 */
Mat2Base.prototype.ceil = function (): any {
  this.m00 = Math.ceil(this.m00);
  this.m01 = Math.ceil(this.m01);
  this.m10 = Math.ceil(this.m10);
  this.m11 = Math.ceil(this.m11);
  return this;
};

/**
 * Round all components.
 */
Mat2Base.prototype.round = function (): any {
  this.m00 = Math.round(this.m00);
  this.m01 = Math.round(this.m01);
  this.m10 = Math.round(this.m10);
  this.m11 = Math.round(this.m11);
  return this;
};

/**
 * Absolute value of all components.
 */
Mat2Base.prototype.abs = function (): any {
  this.m00 = Math.abs(this.m00);
  this.m01 = Math.abs(this.m01);
  this.m10 = Math.abs(this.m10);
  this.m11 = Math.abs(this.m11);
  return this;
};

/**
 * Transpose the matrix.
 */
Mat2Base.prototype.transpose = function (): any {
  const temp = this.m01;
  this.m01 = this.m10;
  this.m10 = temp;
  return this;
};

/**
 * Invert the matrix.
 */
Mat2Base.prototype.inverse = function (): any {
  const det = this.m00 * this.m11 - this.m01 * this.m10;

  if (det === 0) {
    throw createRangeError('Mat2.inverse', ErrorMessages.SINGULAR_MATRIX);
  }

  const invDet = 1 / det;
  const a00 = this.m00;
  const a01 = this.m01;
  const a10 = this.m10;
  const a11 = this.m11;

  this.m00 = a11 * invDet;
  this.m01 = -a01 * invDet;
  this.m10 = -a10 * invDet;
  this.m11 = a00 * invDet;

  return this;
};

/**
 * Safe inversion with tolerance.
 */
Mat2Base.prototype.inverseSafe = function (tolerance: number = TOLERANCE.DETERMINANT): any {
  const det = this.m00 * this.m11 - this.m01 * this.m10;

  if (Math.abs(det) <= tolerance) {
    this.m00 = 0;
    this.m01 = 0;
    this.m10 = 0;
    this.m11 = 0;
    return this;
  }

  const invDet = 1 / det;
  const a00 = this.m00;
  const a01 = this.m01;
  const a10 = this.m10;
  const a11 = this.m11;

  this.m00 = a11 * invDet;
  this.m01 = -a01 * invDet;
  this.m10 = -a10 * invDet;
  this.m11 = a00 * invDet;

  return this;
};

/**
 * Set this matrix to a pure rotation.
 */
Mat2Base.prototype.setRotation = function (angle: number): any {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  this.m00 = c;
  this.m01 = -s;
  this.m10 = s;
  this.m11 = c;
  return this;
};

/**
 * Apply a rotation to this matrix.
 */
Mat2Base.prototype.rotate = function (angle: number): any {
  const c = Math.cos(angle);
  const s = Math.sin(angle);

  const a00 = this.m00;
  const a01 = this.m01;
  const a10 = this.m10;
  const a11 = this.m11;

  // this = this × Rot(angle)
  this.m00 = a00 * c + a01 * s;
  this.m01 = a00 * -s + a01 * c;
  this.m10 = a10 * c + a11 * s;
  this.m11 = a10 * -s + a11 * c;

  return this;
};

/**
 * Apply a scale to this matrix.
 */
Mat2Base.prototype.scale = function (sx: number, sy: number): any {
  this.m00 *= sx;
  this.m01 *= sy;
  this.m10 *= sx;
  this.m11 *= sy;
  return this;
};

/**
 * Apply a shear to this matrix.
 */
Mat2Base.prototype.shear = function (shx: number, shy: number): any {
  const a00 = this.m00;
  const a01 = this.m01;
  const a10 = this.m10;
  const a11 = this.m11;

  // this = this × Shear(shx, shy)
  // Shear matrix: [1 shx; shy 1]
  this.m00 = a00 + a01 * shy;
  this.m01 = a00 * shx + a01;
  this.m10 = a10 + a11 * shy;
  this.m11 = a10 * shx + a11;

  return this;
};
