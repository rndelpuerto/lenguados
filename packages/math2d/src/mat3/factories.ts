/**
 * @file src/mat3/factories.ts
 * @module math2d/mat3/factories
 * @description Factory methods for creating Mat3 instances.
 */

import { validateArrayBounds, createTypeError } from '../core-utils';
import type { ReadonlyVector2 } from '../vector2';
import type { Mat2Like } from '../mat2';
import { Mat3Base } from './base';
import type { Mat3Like, ReadonlyMat3 } from './helpers';

declare module './base' {
  interface Mat3Base {
    /** 
     * Explicitly re-export the Mat3 type for factory returns.
     * @internal 
     */
    constructor(
      m00?: number, m01?: number, m02?: number,
      m10?: number, m11?: number, m12?: number,
      m20?: number, m21?: number, m22?: number
    ): Mat3Base;
  }
}

/**
 * Clone a matrix.
 * 
 * @param source - Matrix to clone.
 * @returns A new Mat3 with identical components.
 */
Mat3Base.clone = function (source: ReadonlyMat3): Mat3Base {
  return new Mat3Base(
    source.m00, source.m01, source.m02,
    source.m10, source.m11, source.m12,
    source.m20, source.m21, source.m22
  );
};

/**
 * Copy components from one matrix into another (alloc-free).
 * 
 * @param source - The matrix to copy from.
 * @param destination - The matrix to copy into.
 * @returns `destination`, now matching `source`.
 */
Mat3Base.copy = function (source: ReadonlyMat3, destination: Mat3Base): Mat3Base {
  destination.m00 = source.m00;
  destination.m01 = source.m01;
  destination.m02 = source.m02;
  destination.m10 = source.m10;
  destination.m11 = source.m11;
  destination.m12 = source.m12;
  destination.m20 = source.m20;
  destination.m21 = source.m21;
  destination.m22 = source.m22;
  return destination;
};

/**
 * Create a matrix from explicit components (row-major).
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
 * @returns A new Mat3.
 */
Mat3Base.fromValues = function (
  m00: number, m01: number, m02: number,
  m10: number, m11: number, m12: number,
  m20: number, m21: number, m22: number
): Mat3Base {
  return new Mat3Base(m00, m01, m02, m10, m11, m12, m20, m21, m22);
};

/**
 * Create a matrix from three row vectors.
 * 
 * @param row0 - First row `{x,y,z?}`; `z` defaults to 0.
 * @param row1 - Second row `{x,y,z?}`; `z` defaults to 0.
 * @param row2 - Third row `{x,y,z?}`; `z` defaults to 0.
 * @param outMatrix - Destination matrix (optional).
 * @returns A new Mat3 or `outMatrix`.
 */
Mat3Base.fromRows = function (
  row0: { x: number; y: number; z?: number },
  row1: { x: number; y: number; z?: number },
  row2: { x: number; y: number; z?: number },
  outMatrix?: Mat3Base
): Mat3Base {
  const out = outMatrix ?? new Mat3Base();
  const r0z = row0.z ?? 0;
  const r1z = row1.z ?? 0;
  const r2z = row2.z ?? 0;
  
  out.m00 = row0.x;
  out.m01 = row0.y;
  out.m02 = r0z;
  out.m10 = row1.x;
  out.m11 = row1.y;
  out.m12 = r1z;
  out.m20 = row2.x;
  out.m21 = row2.y;
  out.m22 = r2z;
  
  return out;
};

/**
 * Create a matrix from three column vectors.
 * 
 * @param col0 - First column `{x,y,z?}`; `z` defaults to 0.
 * @param col1 - Second column `{x,y,z?}`; `z` defaults to 0.
 * @param col2 - Third column `{x,y,z?}`; `z` defaults to 1 (affine row).
 * @param outMatrix - Destination matrix (optional).
 * @returns A new Mat3 or `outMatrix`.
 * 
 * @remarks
 * Defaults make this overload **affine by default** (last row `[0,0,1]`).
 */
Mat3Base.fromColumns = function (
  col0: { x: number; y: number; z?: number },
  col1: { x: number; y: number; z?: number },
  col2: { x: number; y: number; z?: number },
  outMatrix?: Mat3Base
): Mat3Base {
  const out = outMatrix ?? new Mat3Base();
  const c0z = col0.z ?? 0;
  const c1z = col1.z ?? 0;
  const c2z = col2.z ?? 1; // affine by default for last row
  
  out.m00 = col0.x;
  out.m01 = col1.x;
  out.m02 = col2.x;
  out.m10 = col0.y;
  out.m11 = col1.y;
  out.m12 = col2.y;
  out.m20 = c0z;
  out.m21 = c1z;
  out.m22 = c2z;
  
  return out;
};

/**
 * Create a 2D rotation matrix (affine) from an angle in radians.
 * 
 * @param angle - Rotation angle in radians.
 * @param outMatrix - Destination matrix (optional).
 * @returns A new rotation Mat3 or `outMatrix`.
 */
Mat3Base.fromRotation = function (angle: number, outMatrix?: Mat3Base): Mat3Base {
  const out = outMatrix ?? new Mat3Base();
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  
  out.m00 = c;
  out.m01 = -s;
  out.m02 = 0;
  out.m10 = s;
  out.m11 = c;
  out.m12 = 0;
  out.m20 = 0;
  out.m21 = 0;
  out.m22 = 1;
  
  return out;
};

/**
 * Create a rotation matrix from precomputed cosine and sine.
 * 
 * @param cosAngle - Cosine of the angle.
 * @param sinAngle - Sine of the angle.
 * @param outMatrix - Destination matrix (optional).
 * @returns `outMatrix` containing the rotation.
 */
Mat3Base.fromRotationCS = function (
  cosAngle: number,
  sinAngle: number,
  outMatrix?: Mat3Base
): Mat3Base {
  const out = outMatrix ?? new Mat3Base();
  
  out.m00 = cosAngle;
  out.m01 = -sinAngle;
  out.m02 = 0;
  out.m10 = sinAngle;
  out.m11 = cosAngle;
  out.m12 = 0;
  out.m20 = 0;
  out.m21 = 0;
  out.m22 = 1;
  
  return out;
};

/**
 * Create a translation matrix (affine).
 * 
 * @param translateX - Translation along X.
 * @param translateY - Translation along Y.
 * @param outMatrix - Destination matrix (optional).
 * @returns A new translation Mat3 or `outMatrix`.
 */
Mat3Base.fromTranslation = function (
  translateX: number,
  translateY: number,
  outMatrix?: Mat3Base
): Mat3Base {
  const out = outMatrix ?? new Mat3Base();
  
  out.m00 = 1;
  out.m01 = 0;
  out.m02 = translateX;
  out.m10 = 0;
  out.m11 = 1;
  out.m12 = translateY;
  out.m20 = 0;
  out.m21 = 0;
  out.m22 = 1;
  
  return out;
};

/**
 * Create a scaling matrix (affine).
 * 
 * @param scaleX - Scale along X.
 * @param scaleY - Scale along Y.
 * @param outMatrix - Destination matrix (optional).
 * @returns A new scaling Mat3 or `outMatrix`.
 */
Mat3Base.fromScaling = function (
  scaleX: number,
  scaleY: number,
  outMatrix?: Mat3Base
): Mat3Base {
  const out = outMatrix ?? new Mat3Base();
  
  out.m00 = scaleX;
  out.m01 = 0;
  out.m02 = 0;
  out.m10 = 0;
  out.m11 = scaleY;
  out.m12 = 0;
  out.m20 = 0;
  out.m21 = 0;
  out.m22 = 1;
  
  return out;
};

/**
 * Create a shear matrix (affine): x' = x + shearX·y, y' = shearY·x + y.
 * 
 * @param shearX - Horizontal shear (x w.r.t y).
 * @param shearY - Vertical shear (y w.r.t x).
 * @param outMatrix - Destination matrix (optional).
 * @returns A new shear Mat3 or `outMatrix`.
 */
Mat3Base.fromShear = function (
  shearX: number,
  shearY: number,
  outMatrix?: Mat3Base
): Mat3Base {
  const out = outMatrix ?? new Mat3Base();
  
  out.m00 = 1;
  out.m01 = shearX;
  out.m02 = 0;
  out.m10 = shearY;
  out.m11 = 1;
  out.m12 = 0;
  out.m20 = 0;
  out.m21 = 0;
  out.m22 = 1;
  
  return out;
};

/**
 * Create an affine matrix from translation-rotation-scale (TRS).
 * 
 * @param translateX - Translation X.
 * @param translateY - Translation Y.
 * @param angle - Rotation angle (radians).
 * @param scaleX - Scale X (default = 1).
 * @param scaleY - Scale Y (default = 1).
 * @param outMatrix - Destination matrix (optional).
 * @returns A new Mat3 or `outMatrix`.
 */
Mat3Base.fromTRS = function (
  translateX: number,
  translateY: number,
  angle: number,
  scaleX: number = 1,
  scaleY: number = 1,
  outMatrix?: Mat3Base
): Mat3Base {
  const out = outMatrix ?? new Mat3Base();
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  
  out.m00 = c * scaleX;
  out.m01 = -s * scaleY;
  out.m02 = translateX;
  out.m10 = s * scaleX;
  out.m11 = c * scaleY;
  out.m12 = translateY;
  out.m20 = 0;
  out.m21 = 0;
  out.m22 = 1;
  
  return out;
};

/**
 * Create from a flat array in row-major order.
 * 
 * @param sourceArray - Numeric array containing at least 9 elements.
 * @param offset - Index of `m00` (default = 0).
 * @param outMatrix - Destination matrix (optional).
 * @returns A new Mat3 or `outMatrix`.
 * @throws {RangeError} If `offset` is out of range.
 */
Mat3Base.fromArray = function (
  sourceArray: ArrayLike<number>,
  offset: number = 0,
  outMatrix?: Mat3Base
): Mat3Base {
  validateArrayBounds(sourceArray, offset, 9, 'Mat3.fromArray');
  
  const out = outMatrix ?? new Mat3Base();
  out.m00 = sourceArray[offset + 0]!;
  out.m01 = sourceArray[offset + 1]!;
  out.m02 = sourceArray[offset + 2]!;
  out.m10 = sourceArray[offset + 3]!;
  out.m11 = sourceArray[offset + 4]!;
  out.m12 = sourceArray[offset + 5]!;
  out.m20 = sourceArray[offset + 6]!;
  out.m21 = sourceArray[offset + 7]!;
  out.m22 = sourceArray[offset + 8]!;
  
  return out;
};

/**
 * Create or set a matrix from a plain object.
 * 
 * @param object - Object containing numeric `m00..m22` properties.
 * @param outMatrix - Destination matrix (optional).
 * @returns A new Mat3 or `outMatrix`.
 * @throws {TypeError} If any property is not a number.
 */
Mat3Base.fromObject = function (object: Mat3Like, outMatrix?: Mat3Base): Mat3Base {
  const { m00, m01, m02, m10, m11, m12, m20, m21, m22 } = object as unknown as Record<
    string,
    unknown
  >;

  if (
    typeof m00 !== 'number' ||
    typeof m01 !== 'number' ||
    typeof m02 !== 'number' ||
    typeof m10 !== 'number' ||
    typeof m11 !== 'number' ||
    typeof m12 !== 'number' ||
    typeof m20 !== 'number' ||
    typeof m21 !== 'number' ||
    typeof m22 !== 'number'
  ) {
    throw createTypeError(
      'Mat3.fromObject',
      'requires numeric m00..m22 properties'
    );
  }

  const out = outMatrix ?? new Mat3Base();
  out.m00 = m00 as number;
  out.m01 = m01 as number;
  out.m02 = m02 as number;
  out.m10 = m10 as number;
  out.m11 = m11 as number;
  out.m12 = m12 as number;
  out.m20 = m20 as number;
  out.m21 = m21 as number;
  out.m22 = m22 as number;
  
  return out;
};

/**
 * Build an affine matrix from a 2×2 block and a translation vector.
 * 
 * @param a00 - 2×2 element (row0,col0).
 * @param a01 - 2×2 element (row0,col1).
 * @param a10 - 2×2 element (row1,col0).
 * @param a11 - 2×2 element (row1,col1).
 * @param tx - Translation X.
 * @param ty - Translation Y.
 * @param outMatrix - Destination matrix (optional).
 * @returns `outMatrix` with the affine transform.
 */
Mat3Base.fromMat2AndTranslation = function (
  a00: number,
  a01: number,
  a10: number,
  a11: number,
  tx: number,
  ty: number,
  outMatrix?: Mat3Base
): Mat3Base {
  const out = outMatrix ?? new Mat3Base();
  
  out.m00 = a00;
  out.m01 = a01;
  out.m02 = tx;
  out.m10 = a10;
  out.m11 = a11;
  out.m12 = ty;
  out.m20 = 0;
  out.m21 = 0;
  out.m22 = 1;
  
  return out;
};

/**
 * Create an affine matrix from a 2×2 Mat2-like object and translation.
 * 
 * @param mat2 - 2×2 matrix object.
 * @param tx - Translation X.
 * @param ty - Translation Y.
 * @param outMatrix - Destination matrix (optional).
 * @returns `outMatrix` with the affine transform.
 */
Mat3Base.fromMat2LikeAndTranslation = function (
  mat2: Mat2Like,
  tx: number,
  ty: number,
  outMatrix?: Mat3Base
): Mat3Base {
  return Mat3Base.fromMat2AndTranslation(
    mat2.m00, mat2.m01, mat2.m10, mat2.m11, tx, ty, outMatrix
  );
};

// Export the Mat3 type as alias for the Mat3Base with all methods
export type Mat3 = Mat3Base;
