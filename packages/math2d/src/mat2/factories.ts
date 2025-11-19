/**
 * @file src/mat2/factories.ts
 * @module math2d/mat2/factories
 * @description Factory methods for creating Mat2 instances.
 */

import { TAU } from '../scalar';
import { validateArrayBounds, createRangeError, createTypeError, ErrorMessages } from '../core-utils';
import type { ReadonlyVector2 } from '../vector2';
import { Mat2Base } from './base';
import type { Mat2Like, ReadonlyMat2 } from './helpers';

declare module './base' {
  interface Mat2Base {
    /** 
     * Explicitly re-export the Mat2 type for factory returns.
     * @internal 
     */
    constructor(m00?: number, m01?: number, m10?: number, m11?: number): Mat2Base;
  }
}

/**
 * Clone a matrix.
 * 
 * @param source - Matrix to clone.
 * @returns A new Mat2 with identical components.
 */
Mat2Base.clone = function (source: ReadonlyMat2): Mat2Base {
  return new Mat2Base(source.m00, source.m01, source.m10, source.m11);
};

/**
 * Copy components from one matrix into another (alloc-free).
 * 
 * @param source - The matrix to copy from.
 * @param destination - The matrix to copy into.
 * @returns `destination`, now matching `source`.
 */
Mat2Base.copy = function (source: ReadonlyMat2, destination: Mat2Base): Mat2Base {
  destination.m00 = source.m00;
  destination.m01 = source.m01;
  destination.m10 = source.m10;
  destination.m11 = source.m11;
  return destination;
};

/**
 * Create a matrix from explicit components (row-major).
 * 
 * @param m00 - Row 0, Col 0.
 * @param m01 - Row 0, Col 1.
 * @param m10 - Row 1, Col 0.
 * @param m11 - Row 1, Col 1.
 * @returns A new Mat2.
 */
Mat2Base.fromValues = function (m00: number, m01: number, m10: number, m11: number): Mat2Base {
  return new Mat2Base(m00, m01, m10, m11);
};

/**
 * Create a matrix from two row vectors.
 * 
 * @param row0 - First row `[m00, m01]`.
 * @param row1 - Second row `[m10, m11]`.
 * @param outMatrix - Destination matrix (optional).
 * @returns A new Mat2 or `outMatrix`.
 */
Mat2Base.fromRows = function (
  row0: ReadonlyVector2,
  row1: ReadonlyVector2,
  outMatrix?: Mat2Base
): Mat2Base {
  const out = outMatrix ?? new Mat2Base();
  out.m00 = row0.x;
  out.m01 = row0.y;
  out.m10 = row1.x;
  out.m11 = row1.y;
  return out;
};

/**
 * Create a matrix from two column vectors.
 * 
 * @param col0 - First column.
 * @param col1 - Second column.
 * @param outMatrix - Destination matrix (optional).
 * @returns A new Mat2 or `outMatrix`.
 */
Mat2Base.fromColumns = function (
  col0: ReadonlyVector2,
  col1: ReadonlyVector2,
  outMatrix?: Mat2Base
): Mat2Base {
  const out = outMatrix ?? new Mat2Base();
  // Columns: [m00 m01; m10 m11] = [col0.x col1.x; col0.y col1.y]
  out.m00 = col0.x;
  out.m01 = col1.x;
  out.m10 = col0.y;
  out.m11 = col1.y;
  return out;
};

/**
 * Create a pure rotation matrix from an angle in radians.
 * 
 * @param angle - Rotation angle in radians.
 * @param outMatrix - Destination matrix (optional).
 * @returns A new rotation Mat2 or `outMatrix`.
 */
Mat2Base.fromRotation = function (angle: number, outMatrix?: Mat2Base): Mat2Base {
  const out = outMatrix ?? new Mat2Base();
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  out.m00 = c;
  out.m01 = -s;
  out.m10 = s;
  out.m11 = c;
  return out;
};

/**
 * Create a rotation matrix from precomputed cosine and sine.
 * Useful when applying the same rotation to multiple matrices/vectors.
 * 
 * @param cosAngle - Cosine of the angle.
 * @param sinAngle - Sine of the angle.
 * @param outMatrix - Destination matrix (optional).
 * @returns `outMatrix` containing the rotation.
 */
Mat2Base.fromRotationCS = function (
  cosAngle: number,
  sinAngle: number,
  outMatrix?: Mat2Base
): Mat2Base {
  const out = outMatrix ?? new Mat2Base();
  out.m00 = cosAngle;
  out.m01 = -sinAngle;
  out.m10 = sinAngle;
  out.m11 = cosAngle;
  return out;
};

/**
 * Create a scaling matrix.
 * 
 * @param sx - X scale.
 * @param sy - Y scale.
 * @param outMatrix - Destination matrix (optional).
 * @returns A new scaling Mat2 or `outMatrix`.
 */
Mat2Base.fromScaling = function (sx: number, sy: number, outMatrix?: Mat2Base): Mat2Base {
  const out = outMatrix ?? new Mat2Base();
  out.m00 = sx;
  out.m01 = 0;
  out.m10 = 0;
  out.m11 = sy;
  return out;
};

/**
 * Create a shear matrix (x' = x + shx·y, y' = shy·x + y).
 * 
 * @param shx - Horizontal shear (x with respect to y).
 * @param shy - Vertical shear (y with respect to x).
 * @param outMatrix - Destination matrix (optional).
 * @returns A new shear Mat2 or `outMatrix`.
 */
Mat2Base.fromShear = function (shx: number, shy: number, outMatrix?: Mat2Base): Mat2Base {
  const out = outMatrix ?? new Mat2Base();
  out.m00 = 1;
  out.m01 = shx;
  out.m10 = shy;
  out.m11 = 1;
  return out;
};

/**
 * Create a matrix from a flat array in row-major order.
 * 
 * @param sourceArray - Numeric array containing at least 4 elements.
 * @param offset - Index of `m00` (default = 0).
 * @param outMatrix - Destination matrix (optional).
 * @returns A new Mat2 or `outMatrix`.
 * @throws {RangeError} If `offset` is out of range.
 */
Mat2Base.fromArray = function (
  sourceArray: ArrayLike<number>,
  offset: number = 0,
  outMatrix?: Mat2Base
): Mat2Base {
  validateArrayBounds(sourceArray, offset, 4, 'Mat2.fromArray');
  
  const out = outMatrix ?? new Mat2Base();
  out.m00 = sourceArray[offset]!;
  out.m01 = sourceArray[offset + 1]!;
  out.m10 = sourceArray[offset + 2]!;
  out.m11 = sourceArray[offset + 3]!;
  return out;
};

/**
 * Create or set a matrix from a plain object.
 * 
 * @param object - Object containing numeric `m00, m01, m10, m11` properties.
 * @param outMatrix - Destination matrix (optional).
 * @returns A new Mat2 or `outMatrix`.
 * @throws {TypeError} If any property is not a number.
 */
Mat2Base.fromObject = function (object: Mat2Like, outMatrix?: Mat2Base): Mat2Base {
  const { m00, m01, m10, m11 } = object as unknown as Record<string, unknown>;

  if (
    typeof m00 !== 'number' ||
    typeof m01 !== 'number' ||
    typeof m10 !== 'number' ||
    typeof m11 !== 'number'
  ) {
    throw createTypeError(
      'Mat2.fromObject',
      'requires numeric m00, m01, m10, m11 properties'
    );
  }

  const out = outMatrix ?? new Mat2Base();
  out.m00 = m00 as number;
  out.m01 = m01 as number;
  out.m10 = m10 as number;
  out.m11 = m11 as number;
  return out;
};

/**
 * Parse a `"m00,m01,m10,m11"` string into a matrix.
 * 
 * @param string - String like `"1,0,0,1"`.
 * @param outMatrix - Destination matrix (optional).
 * @returns A new Mat2 or `outMatrix`.
 * @throws {Error} If the string cannot be parsed.
 */
Mat2Base.parse = function (string: string, outMatrix?: Mat2Base): Mat2Base {
  const parts = string.split(',').map((s) => parseFloat(s.trim()));

  if (parts.length !== 4 || parts.some((n) => Number.isNaN(n))) {
    throw new Error(`Mat2.parse: cannot parse Mat2 from "${string}"`);
  }

  const out = outMatrix ?? new Mat2Base();
  out.m00 = parts[0]!;
  out.m01 = parts[1]!;
  out.m10 = parts[2]!;
  out.m11 = parts[3]!;
  return out;
};

/**
 * Generate a random rotation matrix.
 * 
 * @param outMatrix - Destination matrix (optional).
 * @returns A new rotation Mat2 with a random heading or `outMatrix`.
 */
Mat2Base.randomRotation = function (outMatrix?: Mat2Base): Mat2Base {
  return Mat2Base.fromRotation(Math.random() * TAU, outMatrix);
};

// Export the Mat2 type as alias for the Mat2Base with all methods
export type Mat2 = Mat2Base;
