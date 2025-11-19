/**
 * @file src/mat2/instance/comparison.ts
 * @module math2d/mat2/instance/comparison
 * @description Comparison operations for Mat2.
 */

import { TOLERANCE } from '../../constants/tolerance-types';
import { areNearEqual } from '../../core-utils/tolerance';
import { createRangeError, ErrorMessages } from '../../core-utils';
import { Mat2Base } from '../base';
import type { ReadonlyMat2 } from '../helpers';

declare module '../base' {
  interface Mat2Base {
    /**
     * Check exact equality with another matrix.
     * 
     * @param other - Matrix to compare with.
     * @returns `true` if all components match exactly.
     */
    equals(other: ReadonlyMat2): boolean;

    /**
     * Check approximate equality with another matrix.
     * 
     * @param other - Matrix to compare with.
     * @param tolerance - Maximum difference per component. @defaultValue {@link TOLERANCE.LINEAR}
     * @returns `true` if all components are within tolerance.
     * @throws {RangeError} If tolerance is negative.
     */
    nearEquals(other: ReadonlyMat2, tolerance?: number): boolean;

    /**
     * Check if this is the identity matrix.
     * 
     * @returns `true` if this is exactly the identity.
     */
    isIdentity(): boolean;

    /**
     * Check if this is approximately the identity matrix.
     * 
     * @param tolerance - Maximum difference from identity. @defaultValue {@link TOLERANCE.LINEAR}
     * @returns `true` if close to identity.
     * @throws {RangeError} If tolerance is negative.
     */
    nearIdentity(tolerance?: number): boolean;

    /**
     * Check if this is the zero matrix.
     * 
     * @returns `true` if all components are exactly zero.
     */
    isZero(): boolean;

    /**
     * Check if this is approximately the zero matrix.
     * 
     * @param tolerance - Maximum absolute value per component. @defaultValue {@link TOLERANCE.LINEAR}
     * @returns `true` if close to zero.
     * @throws {RangeError} If tolerance is negative.
     */
    nearZero(tolerance?: number): boolean;

    /**
     * Check if all components are finite.
     * 
     * @returns `true` if all components are finite numbers.
     */
    isFinite(): boolean;

    /**
     * Check if the matrix is singular (non-invertible).
     * 
     * @param tolerance - Determinant tolerance. @defaultValue {@link TOLERANCE.DETERMINANT}
     * @returns `true` if determinant is near zero.
     */
    isSingular(tolerance?: number): boolean;

    /**
     * Check if the matrix is orthogonal.
     * 
     * @param tolerance - Tolerance for orthogonality check. @defaultValue {@link TOLERANCE.LINEAR}
     * @returns `true` if columns are orthonormal.
     * 
     * @remarks
     * An orthogonal matrix satisfies: `M × Mᵀ = I`.
     * This includes rotation and reflection matrices.
     */
    isOrthogonal(tolerance?: number): boolean;

    /**
     * Compute a hash code for the matrix.
     * 
     * @returns A 32-bit integer hash.
     * 
     * @remarks
     * Not cryptographically secure, but provides good distribution
     * for typical use in hash tables.
     */
    hashCode(): number;
  }
}

/**
 * Check exact equality with another matrix.
 */
Mat2Base.prototype.equals = function (other: ReadonlyMat2): boolean {
  return (
    this.m00 === other.m00 &&
    this.m01 === other.m01 &&
    this.m10 === other.m10 &&
    this.m11 === other.m11
  );
};

/**
 * Check approximate equality with another matrix.
 */
Mat2Base.prototype.nearEquals = function (
  other: ReadonlyMat2,
  tolerance: number = TOLERANCE.LINEAR
): boolean {
  if (tolerance < 0) {
    throw createRangeError('Mat2.nearEquals', ErrorMessages.NEGATIVE_TOLERANCE);
  }

  return (
    areNearEqual(this.m00, other.m00, tolerance) &&
    areNearEqual(this.m01, other.m01, tolerance) &&
    areNearEqual(this.m10, other.m10, tolerance) &&
    areNearEqual(this.m11, other.m11, tolerance)
  );
};

/**
 * Check if this is the identity matrix.
 */
Mat2Base.prototype.isIdentity = function (): boolean {
  return (
    this.m00 === 1 &&
    this.m01 === 0 &&
    this.m10 === 0 &&
    this.m11 === 1
  );
};

/**
 * Check if this is approximately the identity matrix.
 */
Mat2Base.prototype.nearIdentity = function (tolerance: number = TOLERANCE.LINEAR): boolean {
  if (tolerance < 0) {
    throw createRangeError('Mat2.nearIdentity', ErrorMessages.NEGATIVE_TOLERANCE);
  }

  return (
    areNearEqual(this.m00, 1, tolerance) &&
    areNearEqual(this.m01, 0, tolerance) &&
    areNearEqual(this.m10, 0, tolerance) &&
    areNearEqual(this.m11, 1, tolerance)
  );
};

/**
 * Check if this is the zero matrix.
 */
Mat2Base.prototype.isZero = function (): boolean {
  return (
    this.m00 === 0 &&
    this.m01 === 0 &&
    this.m10 === 0 &&
    this.m11 === 0
  );
};

/**
 * Check if this is approximately the zero matrix.
 */
Mat2Base.prototype.nearZero = function (tolerance: number = TOLERANCE.LINEAR): boolean {
  if (tolerance < 0) {
    throw createRangeError('Mat2.nearZero', ErrorMessages.NEGATIVE_TOLERANCE);
  }

  return (
    Math.abs(this.m00) <= tolerance &&
    Math.abs(this.m01) <= tolerance &&
    Math.abs(this.m10) <= tolerance &&
    Math.abs(this.m11) <= tolerance
  );
};

/**
 * Check if all components are finite.
 */
Mat2Base.prototype.isFinite = function (): boolean {
  return (
    Number.isFinite(this.m00) &&
    Number.isFinite(this.m01) &&
    Number.isFinite(this.m10) &&
    Number.isFinite(this.m11)
  );
};

/**
 * Check if the matrix is singular (non-invertible).
 */
Mat2Base.prototype.isSingular = function (tolerance: number = TOLERANCE.DETERMINANT): boolean {
  const det = this.m00 * this.m11 - this.m01 * this.m10;
  return Math.abs(det) <= tolerance;
};

/**
 * Check if the matrix is orthogonal.
 */
Mat2Base.prototype.isOrthogonal = function (tolerance: number = TOLERANCE.LINEAR): boolean {
  // Check if columns are orthonormal
  // Column 0: (m00, m10)
  // Column 1: (m01, m11)
  
  // Check column lengths (should be 1)
  const col0LengthSq = this.m00 * this.m00 + this.m10 * this.m10;
  const col1LengthSq = this.m01 * this.m01 + this.m11 * this.m11;
  
  if (!areNearEqual(col0LengthSq, 1, tolerance) || !areNearEqual(col1LengthSq, 1, tolerance)) {
    return false;
  }
  
  // Check columns are orthogonal (dot product should be 0)
  const dot = this.m00 * this.m01 + this.m10 * this.m11;
  return Math.abs(dot) <= tolerance;
};

/**
 * Compute a hash code for the matrix.
 */
Mat2Base.prototype.hashCode = function (): number {
  const scale = 1e6;
  const m00Int = Math.round(this.m00 * scale);
  const m01Int = Math.round(this.m01 * scale);
  const m10Int = Math.round(this.m10 * scale);
  const m11Int = Math.round(this.m11 * scale);
  
  // Simple hash combining for 4 components
  let hash = m00Int * 73856093;
  hash ^= m01Int * 19349663;
  hash ^= m10Int * 83492791;
  hash ^= m11Int * 51885459;
  
  return hash >>> 0;
};
