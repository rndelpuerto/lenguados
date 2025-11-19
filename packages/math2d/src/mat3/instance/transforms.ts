/**
 * @file src/mat3/instance/transforms.ts
 * @module math2d/mat3/instance/transforms
 * @description Transformation operations for Mat3.
 */

import { TOLERANCE } from '../../constants/tolerance-types';
import { createRangeError, ErrorMessages } from '../../core-utils';
import { Mat3Base } from '../base';
import type { ReadonlyMat3 } from '../helpers';

declare module '../base' {
  interface Mat3Base {
    /**
     * Apply {@link Math.floor} to every component.
     * 
     * @returns This matrix after flooring.
     */
    floor(): this;

    /**
     * Apply {@link Math.ceil} to every component.
     * 
     * @returns This matrix after ceiling.
     */
    ceil(): this;

    /**
     * Apply {@link Math.round} to every component.
     * 
     * @returns This matrix after rounding.
     */
    round(): this;

    /**
     * Apply {@link Math.abs} to every component.
     * 
     * @returns This matrix after absolute-value transform.
     */
    abs(): this;

    /**
     * In-place transposition.
     * 
     * @returns This matrix after transposition.
     * 
     * @example
     * ```ts
     * const m = Mat3.fromValues(1,2,3,4,5,6,7,8,9);
     * m.transpose(); // [[1,4,7], [2,5,8], [3,6,9]]
     * ```
     */
    transpose(): this;

    /**
     * Replace this matrix with its adjugate `adj(this)`.
     * 
     * @returns This matrix after being replaced by its adjugate.
     * 
     * @remarks
     * The adjugate (or classical adjoint) is the transpose of the cofactor matrix.
     * For invertible matrices: `adj(M) = det(M) × M⁻¹`.
     */
    adjugate(): this;

    /**
     * Invert this matrix (throws on singular).
     * 
     * @returns This matrix after inversion.
     * @throws {RangeError} If the matrix is singular.
     */
    inverse(): this;

    /**
     * Invert this matrix **without throwing**; becomes **zero** if singular.
     * 
     * @returns This matrix after "safe" inversion (or zero).
     */
    inverseSafe(): this;

    /**
     * Invert this matrix with **tolerance** (throws if `|det| ≤ epsilon`).
     * 
     * @param epsilon - Non-negative tolerance. @defaultValue {@link TOLERANCE.LINEAR}
     * @returns This matrix after inversion.
     * @throws {RangeError} If the matrix is singular or nearly singular.
     */
    inverseTol(epsilon?: number): this;

    /**
     * Invert this matrix assuming it is **affine** (specialized).
     * Falls back to safe inversion (zero) if the 2×2 block is not invertible.
     * 
     * @returns This matrix after affine inversion.
     * 
     * @remarks
     * Optimized for affine matrices where last row is [0, 0, 1].
     * Faster than general inverse but assumes affine structure.
     */
    inverseAffine(): this;
  }
}

/**
 * Apply Math.floor to every component.
 */
Mat3Base.prototype.floor = function (): any {
  this.m00 = Math.floor(this.m00);
  this.m01 = Math.floor(this.m01);
  this.m02 = Math.floor(this.m02);
  this.m10 = Math.floor(this.m10);
  this.m11 = Math.floor(this.m11);
  this.m12 = Math.floor(this.m12);
  this.m20 = Math.floor(this.m20);
  this.m21 = Math.floor(this.m21);
  this.m22 = Math.floor(this.m22);
  return this;
};

/**
 * Apply Math.ceil to every component.
 */
Mat3Base.prototype.ceil = function (): any {
  this.m00 = Math.ceil(this.m00);
  this.m01 = Math.ceil(this.m01);
  this.m02 = Math.ceil(this.m02);
  this.m10 = Math.ceil(this.m10);
  this.m11 = Math.ceil(this.m11);
  this.m12 = Math.ceil(this.m12);
  this.m20 = Math.ceil(this.m20);
  this.m21 = Math.ceil(this.m21);
  this.m22 = Math.ceil(this.m22);
  return this;
};

/**
 * Apply Math.round to every component.
 */
Mat3Base.prototype.round = function (): any {
  this.m00 = Math.round(this.m00);
  this.m01 = Math.round(this.m01);
  this.m02 = Math.round(this.m02);
  this.m10 = Math.round(this.m10);
  this.m11 = Math.round(this.m11);
  this.m12 = Math.round(this.m12);
  this.m20 = Math.round(this.m20);
  this.m21 = Math.round(this.m21);
  this.m22 = Math.round(this.m22);
  return this;
};

/**
 * Apply Math.abs to every component.
 */
Mat3Base.prototype.abs = function (): any {
  this.m00 = Math.abs(this.m00);
  this.m01 = Math.abs(this.m01);
  this.m02 = Math.abs(this.m02);
  this.m10 = Math.abs(this.m10);
  this.m11 = Math.abs(this.m11);
  this.m12 = Math.abs(this.m12);
  this.m20 = Math.abs(this.m20);
  this.m21 = Math.abs(this.m21);
  this.m22 = Math.abs(this.m22);
  return this;
};

/**
 * In-place transposition.
 */
Mat3Base.prototype.transpose = function (): any {
  let t = this.m01;
  this.m01 = this.m10;
  this.m10 = t;

  t = this.m02;
  this.m02 = this.m20;
  this.m20 = t;

  t = this.m12;
  this.m12 = this.m21;
  this.m21 = t;

  return this;
};

/**
 * Replace this matrix with its adjugate.
 */
Mat3Base.prototype.adjugate = function (): any {
  const m00 = this.m00, m01 = this.m01, m02 = this.m02;
  const m10 = this.m10, m11 = this.m11, m12 = this.m12;
  const m20 = this.m20, m21 = this.m21, m22 = this.m22;

  // Cofactor matrix (transposed for adjugate)
  const a00 = m11 * m22 - m12 * m21;
  const a01 = -(m01 * m22 - m02 * m21);
  const a02 = m01 * m12 - m02 * m11;

  const a10 = -(m10 * m22 - m12 * m20);
  const a11 = m00 * m22 - m02 * m20;
  const a12 = -(m00 * m12 - m02 * m10);

  const a20 = m10 * m21 - m11 * m20;
  const a21 = -(m00 * m21 - m01 * m20);
  const a22 = m00 * m11 - m01 * m10;

  this.m00 = a00;
  this.m01 = a01;
  this.m02 = a02;
  this.m10 = a10;
  this.m11 = a11;
  this.m12 = a12;
  this.m20 = a20;
  this.m21 = a21;
  this.m22 = a22;

  return this;
};

/**
 * Invert this matrix (throws on singular).
 */
Mat3Base.prototype.inverse = function (): any {
  const m00 = this.m00, m01 = this.m01, m02 = this.m02;
  const m10 = this.m10, m11 = this.m11, m12 = this.m12;
  const m20 = this.m20, m21 = this.m21, m22 = this.m22;

  // Compute cofactors
  const c00 = m11 * m22 - m12 * m21;
  const c01 = m10 * m22 - m12 * m20;
  const c02 = m10 * m21 - m11 * m20;

  // Compute determinant
  const det = m00 * c00 - m01 * c01 + m02 * c02;

  if (det === 0) {
    throw createRangeError('Mat3.inverse', ErrorMessages.SINGULAR_MATRIX);
  }

  const invDet = 1 / det;

  // Compute inverse (adjugate / determinant)
  this.m00 = c00 * invDet;
  this.m01 = -(m01 * m22 - m02 * m21) * invDet;
  this.m02 = (m01 * m12 - m02 * m11) * invDet;

  this.m10 = -c01 * invDet;
  this.m11 = (m00 * m22 - m02 * m20) * invDet;
  this.m12 = -(m00 * m12 - m02 * m10) * invDet;

  this.m20 = c02 * invDet;
  this.m21 = -(m00 * m21 - m01 * m20) * invDet;
  this.m22 = (m00 * m11 - m01 * m10) * invDet;

  return this;
};

/**
 * Invert this matrix without throwing; becomes zero if singular.
 */
Mat3Base.prototype.inverseSafe = function (): any {
  const m00 = this.m00, m01 = this.m01, m02 = this.m02;
  const m10 = this.m10, m11 = this.m11, m12 = this.m12;
  const m20 = this.m20, m21 = this.m21, m22 = this.m22;

  // Compute cofactors
  const c00 = m11 * m22 - m12 * m21;
  const c01 = m10 * m22 - m12 * m20;
  const c02 = m10 * m21 - m11 * m20;

  // Compute determinant
  const det = m00 * c00 - m01 * c01 + m02 * c02;

  if (det === 0) {
    return this.zero();
  }

  const invDet = 1 / det;

  // Compute inverse (adjugate / determinant)
  this.m00 = c00 * invDet;
  this.m01 = -(m01 * m22 - m02 * m21) * invDet;
  this.m02 = (m01 * m12 - m02 * m11) * invDet;

  this.m10 = -c01 * invDet;
  this.m11 = (m00 * m22 - m02 * m20) * invDet;
  this.m12 = -(m00 * m12 - m02 * m10) * invDet;

  this.m20 = c02 * invDet;
  this.m21 = -(m00 * m21 - m01 * m20) * invDet;
  this.m22 = (m00 * m11 - m01 * m10) * invDet;

  return this;
};

/**
 * Invert this matrix with tolerance.
 */
Mat3Base.prototype.inverseTol = function (epsilon: number = TOLERANCE.LINEAR): any {
  const m00 = this.m00, m01 = this.m01, m02 = this.m02;
  const m10 = this.m10, m11 = this.m11, m12 = this.m12;
  const m20 = this.m20, m21 = this.m21, m22 = this.m22;

  // Compute cofactors
  const c00 = m11 * m22 - m12 * m21;
  const c01 = m10 * m22 - m12 * m20;
  const c02 = m10 * m21 - m11 * m20;

  // Compute determinant
  const det = m00 * c00 - m01 * c01 + m02 * c02;

  if (Math.abs(det) <= epsilon) {
    throw createRangeError('Mat3.inverseTol', ErrorMessages.SINGULAR_MATRIX);
  }

  const invDet = 1 / det;

  // Compute inverse (adjugate / determinant)
  this.m00 = c00 * invDet;
  this.m01 = -(m01 * m22 - m02 * m21) * invDet;
  this.m02 = (m01 * m12 - m02 * m11) * invDet;

  this.m10 = -c01 * invDet;
  this.m11 = (m00 * m22 - m02 * m20) * invDet;
  this.m12 = -(m00 * m12 - m02 * m10) * invDet;

  this.m20 = c02 * invDet;
  this.m21 = -(m00 * m21 - m01 * m20) * invDet;
  this.m22 = (m00 * m11 - m01 * m10) * invDet;

  return this;
};

/**
 * Invert this matrix assuming it is affine.
 */
Mat3Base.prototype.inverseAffine = function (): any {
  const a00 = this.m00, a01 = this.m01, a02 = this.m02;
  const a10 = this.m10, a11 = this.m11, a12 = this.m12;

  // Determinant of 2×2 block
  const det2x2 = a00 * a11 - a01 * a10;

  if (det2x2 === 0) {
    return this.zero();
  }

  const invDet = 1 / det2x2;

  // Invert 2×2 block
  const i00 = a11 * invDet;
  const i01 = -a01 * invDet;
  const i10 = -a10 * invDet;
  const i11 = a00 * invDet;

  // New translation = -inverse(2x2) * translation
  const tx = -(i00 * a02 + i01 * a12);
  const ty = -(i10 * a02 + i11 * a12);

  this.m00 = i00;
  this.m01 = i01;
  this.m02 = tx;
  this.m10 = i10;
  this.m11 = i11;
  this.m12 = ty;
  this.m20 = 0;
  this.m21 = 0;
  this.m22 = 1;

  return this;
};
