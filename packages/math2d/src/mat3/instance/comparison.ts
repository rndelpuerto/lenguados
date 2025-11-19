/**
 * @file src/mat3/instance/comparison.ts
 * @module math2d/mat3/instance/comparison
 * @description Comparison operations for Mat3.
 */

import { TOLERANCE } from '../../constants/tolerance-types';
import { createRangeError, ErrorMessages } from '../../core-utils';
import { Mat3Base } from '../base';
import type { ReadonlyMat3 } from '../helpers';
import type { ReadonlyVector2 } from '../../vector2';

declare module '../base' {
  interface Mat3Base {
    /**
     * Check exact equality with another matrix.
     * 
     * @param other - Matrix to compare with.
     * @returns `true` if all components match exactly.
     */
    equals(other: ReadonlyMat3): boolean;

    /**
     * Check approximate equality within tolerance.
     * 
     * @param other - Matrix to compare with.
     * @param epsilon - Tolerance. @defaultValue {@link TOLERANCE.LINEAR}
     * @returns `true` if matrices are approximately equal.
     * @throws {RangeError} If epsilon is negative.
     */
    nearEquals(other: ReadonlyMat3, epsilon?: number): boolean;

    /**
     * Test if this matrix is approximately the identity.
     * 
     * @param epsilon - Tolerance. @defaultValue {@link TOLERANCE.LINEAR}
     * @returns `true` if `this ≈ I`.
     */
    isIdentity(epsilon?: number): boolean;

    /**
     * Test if all components are approximately zero.
     * 
     * @param epsilon - Tolerance. @defaultValue {@link TOLERANCE.LINEAR}
     * @returns `true` if all components are near zero.
     */
    isZero(epsilon?: number): boolean;

    /**
     * Test if last row is `[0,0,1]` within tolerance (affine).
     * 
     * @param epsilon - Tolerance. @defaultValue {@link TOLERANCE.LINEAR}
     * @returns `true` if affine.
     * 
     * @remarks
     * Affine matrices have the form:
     * ```
     * [ a  b  tx ]
     * [ c  d  ty ]
     * [ 0  0   1 ]
     * ```
     */
    isAffine(epsilon?: number): boolean;

    /**
     * Test if this is a rigid transform (proper rotation + translation).
     * 
     * @param epsilon - Tolerance. @defaultValue {@link TOLERANCE.LINEAR}
     * @returns `true` if rigid (det 2×2 ≈ +1).
     * 
     * @remarks
     * A rigid transform preserves distances and orientations.
     * The 2×2 linear part must have determinant ≈ +1.
     */
    isRigid(epsilon?: number): boolean;

    /**
     * Test if all components are finite.
     * 
     * @returns `true` if finite.
     */
    isFinite(): boolean;

    /**
     * Test if this matrix is singular within tolerance.
     * 
     * @param epsilon - Tolerance. @defaultValue {@link TOLERANCE.LINEAR}
     * @returns `true` if `|det(this)| ≤ epsilon`.
     */
    isSingular(epsilon?: number): boolean;

    /**
     * Generate a hash code for this matrix.
     * 
     * @returns A 32-bit integer hash.
     * 
     * @remarks
     * The hash is computed from all 9 components using
     * a standard polynomial rolling hash.
     */
    hashCode(): number;

    /**
     * Returns `true` if the upper-left 2×2 contains a reflection (orientation flip).
     * 
     * @returns `true` if `det(2×2) < 0`.
     */
    hasReflection2D(): boolean;

    /**
     * Extract the rotation angle (radians) from the 2×2 basis.
     * 
     * @returns Angle (radians).
     * 
     * @remarks
     * Uses `atan2` on the first column of the linear part.
     */
    angle2D(): number;
  }
}

/**
 * Check exact equality with another matrix.
 */
Mat3Base.prototype.equals = function (other: ReadonlyMat3): boolean {
  return (
    this.m00 === other.m00 &&
    this.m01 === other.m01 &&
    this.m02 === other.m02 &&
    this.m10 === other.m10 &&
    this.m11 === other.m11 &&
    this.m12 === other.m12 &&
    this.m20 === other.m20 &&
    this.m21 === other.m21 &&
    this.m22 === other.m22
  );
};

/**
 * Check approximate equality within tolerance.
 */
Mat3Base.prototype.nearEquals = function (
  other: ReadonlyMat3,
  epsilon: number = TOLERANCE.LINEAR
): boolean {
  if (epsilon < 0) {
    throw createRangeError('Mat3.nearEquals', ErrorMessages.NEGATIVE_TOLERANCE);
  }
  
  return (
    Math.abs(this.m00 - other.m00) <= epsilon &&
    Math.abs(this.m01 - other.m01) <= epsilon &&
    Math.abs(this.m02 - other.m02) <= epsilon &&
    Math.abs(this.m10 - other.m10) <= epsilon &&
    Math.abs(this.m11 - other.m11) <= epsilon &&
    Math.abs(this.m12 - other.m12) <= epsilon &&
    Math.abs(this.m20 - other.m20) <= epsilon &&
    Math.abs(this.m21 - other.m21) <= epsilon &&
    Math.abs(this.m22 - other.m22) <= epsilon
  );
};

/**
 * Test if this matrix is approximately the identity.
 */
Mat3Base.prototype.isIdentity = function (epsilon: number = TOLERANCE.LINEAR): boolean {
  return (
    Math.abs(this.m00 - 1) <= epsilon &&
    Math.abs(this.m01) <= epsilon &&
    Math.abs(this.m02) <= epsilon &&
    Math.abs(this.m10) <= epsilon &&
    Math.abs(this.m11 - 1) <= epsilon &&
    Math.abs(this.m12) <= epsilon &&
    Math.abs(this.m20) <= epsilon &&
    Math.abs(this.m21) <= epsilon &&
    Math.abs(this.m22 - 1) <= epsilon
  );
};

/**
 * Test if all components are approximately zero.
 */
Mat3Base.prototype.isZero = function (epsilon: number = TOLERANCE.LINEAR): boolean {
  return (
    Math.abs(this.m00) <= epsilon &&
    Math.abs(this.m01) <= epsilon &&
    Math.abs(this.m02) <= epsilon &&
    Math.abs(this.m10) <= epsilon &&
    Math.abs(this.m11) <= epsilon &&
    Math.abs(this.m12) <= epsilon &&
    Math.abs(this.m20) <= epsilon &&
    Math.abs(this.m21) <= epsilon &&
    Math.abs(this.m22) <= epsilon
  );
};

/**
 * Test if last row is [0,0,1] within tolerance (affine).
 */
Mat3Base.prototype.isAffine = function (epsilon: number = TOLERANCE.LINEAR): boolean {
  return (
    Math.abs(this.m20) <= epsilon &&
    Math.abs(this.m21) <= epsilon &&
    Math.abs(this.m22 - 1) <= epsilon
  );
};

/**
 * Test if this is a rigid transform (proper rotation + translation).
 */
Mat3Base.prototype.isRigid = function (epsilon: number = TOLERANCE.LINEAR): boolean {
  // Must be affine first
  if (!this.isAffine(epsilon)) {
    return false;
  }
  
  // Check if 2×2 linear part has determinant ≈ +1
  const det2x2 = this.m00 * this.m11 - this.m01 * this.m10;
  return Math.abs(det2x2 - 1) <= epsilon;
};

/**
 * Test if all components are finite.
 */
Mat3Base.prototype.isFinite = function (): boolean {
  return (
    Number.isFinite(this.m00) &&
    Number.isFinite(this.m01) &&
    Number.isFinite(this.m02) &&
    Number.isFinite(this.m10) &&
    Number.isFinite(this.m11) &&
    Number.isFinite(this.m12) &&
    Number.isFinite(this.m20) &&
    Number.isFinite(this.m21) &&
    Number.isFinite(this.m22)
  );
};

/**
 * Test if this matrix is singular within tolerance.
 */
Mat3Base.prototype.isSingular = function (epsilon: number = TOLERANCE.LINEAR): boolean {
  const det = this.determinant();
  return Math.abs(det) <= epsilon;
};

/**
 * Generate a hash code for this matrix.
 */
Mat3Base.prototype.hashCode = function (): number {
  const h0 = ((this.m00 * 0x1f1f) | 0) ^ ((this.m01 * 0x3f3f) | 0) ^ ((this.m02 * 0x5f5f) | 0);
  const h1 = ((this.m10 * 0x7f7f) | 0) ^ ((this.m11 * 0x9f9f) | 0) ^ ((this.m12 * 0xbfbf) | 0);
  const h2 = ((this.m20 * 0xdfdf) | 0) ^ ((this.m21 * 0xffff) | 0) ^ ((this.m22 * 0x1fff) | 0);
  return (h0 * 31 + h1) * 31 + h2;
};

/**
 * Returns true if the upper-left 2×2 contains a reflection.
 */
Mat3Base.prototype.hasReflection2D = function (): boolean {
  const det2x2 = this.m00 * this.m11 - this.m01 * this.m10;
  return det2x2 < 0;
};

/**
 * Extract the rotation angle (radians) from the 2×2 basis.
 */
Mat3Base.prototype.angle2D = function (): number {
  return Math.atan2(this.m10, this.m00);
};
