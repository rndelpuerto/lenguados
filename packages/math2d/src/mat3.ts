/* eslint-disable unicorn/prevent-abbreviations */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-dupe-class-members */
/**
 * @file src/mat3.ts
 * @module math2d/mat3
 * @description 3×3 matrix implementation (row‑major storage, column‑vector semantics) for the Lenguado 2‑D physics‑engine family.
 *
 * @remarks
 * - Storage is **row‑major** using fields:
 *   `m00, m01, m02, m10, m11, m12, m20, m21, m22`.
 * - Vectors are treated as **column vectors** when applying transforms: `p' = M · p`.
 * - Affine 2‑D transforms are represented as:
 *   ```
 *   [ a  c  tx ]
 *   [ b  d  ty ]
 *   [ 0  0   1 ]
 *   ```
 *   where the upper‑left 2×2 block encodes rotation/scale/shear and the last column is translation.
 * - Instance methods are **mutable** and chainable for ergonomics.
 * - Static helpers are **pure** and include optional `out` parameters for **alloc‑free** workflows.
 * - Console I/O is avoided in hot paths; “safe/tolerant” variants are provided for numerical robustness.
 */

import type { Mat2Like } from './mat2';
import { LINEAR_EPSILON } from './constants/precision';
import { validateTolerance, areNearEqual } from './core-utils/tolerance';
import { Vector2, ReadonlyVector2 } from './vector2';

/**
 * Minimal structural type for a 3×3 matrix in row‑major form.
 */
export interface Mat3Like {
 m00: number;
 m01: number;
 m02: number;
 m10: number;
 m11: number;
 m12: number;
 m20: number;
 m21: number;
 m22: number;
}

/** Readonly view of {@link Mat3}. */
export type ReadonlyMat3 = Readonly<Mat3>;

// --------------------------------------------------------------------------
// Helpers
// --------------------------------------------------------------------------

/**
 * Permanently freezes a {@link Mat3} instance so it can no longer be mutated.
 *
 * @param matrix - The {@link Mat3} object to freeze.
 * @returns The *same* instance, now typed as {@link ReadonlyMat3}, after being frozen with {@link Object.freeze}.
 *
 * @remarks
 * - The returned object keeps its original reference; no new memory is allocated.
 * - In *strict mode* any subsequent attempt to modify fields throws a `TypeError`;
 *   in non‑strict mode the write is silently ignored.
 * - Use this helper to create **truly immutable static constants** such as
 *   {@link Mat3.IDENTITY_MATRIX}, ensuring they cannot be altered at runtime.
 *
 * @example
 * ```ts
 * const I = freezeMat3(new Mat3()); // identity by default
 * // Will throw in strict mode:
 * (I as unknown as Mat3).m00 = 2;
 * ```
 */
export function freezeMat3(matrix: Mat3): ReadonlyMat3 {
 return Object.freeze(matrix);
}

/**
 * **Type guard** for a plain object that *looks* like a 3×3 matrix.
 *
 * @param subject - Unknown value.
 * @returns `true` if *subject* exposes numeric `m00..m22` members.
 */
export function isMat3Like(subject: unknown): subject is Readonly<Mat3Like> {
 return (
  typeof subject === 'object' &&
  subject !== null &&
  typeof (subject as { m00?: unknown }).m00 === 'number' &&
  typeof (subject as { m01?: unknown }).m01 === 'number' &&
  typeof (subject as { m02?: unknown }).m02 === 'number' &&
  typeof (subject as { m10?: unknown }).m10 === 'number' &&
  typeof (subject as { m11?: unknown }).m11 === 'number' &&
  typeof (subject as { m12?: unknown }).m12 === 'number' &&
  typeof (subject as { m20?: unknown }).m20 === 'number' &&
  typeof (subject as { m21?: unknown }).m21 === 'number' &&
  typeof (subject as { m22?: unknown }).m22 === 'number'
 );
}

// --------------------------------------------------------------------------
// Mat3 class
// --------------------------------------------------------------------------

/**
 * 3×3 matrix class with mutable, chainable instance methods and pure static helpers.
 *
 * @remarks
 * - Stored in **row‑major** order.
 * - Intended for **2‑D affine transforms** in homogeneous coordinates, while also representing general 3×3 transforms (projective).
 * - Default constructor builds the **identity** matrix.
 * - Computational methods avoid allocations unless they explicitly return new objects.
 */
export class Mat3 {
 // ------------------------------------------------------------------------
 // Static: Constants (immutable)
 // ------------------------------------------------------------------------

 /** Identity matrix. */
 public static readonly IDENTITY_MATRIX = freezeMat3(new Mat3(1, 0, 0, 0, 1, 0, 0, 0, 1));

 /** All‑zero matrix. */
 public static readonly ZERO_MATRIX = freezeMat3(new Mat3(0, 0, 0, 0, 0, 0, 0, 0, 0));

 // ------------------------------------------------------------------------
 // Static: Factories
 // ------------------------------------------------------------------------

 /**
  * Clone a matrix.
  *
  * @param source - Matrix to clone.
  * @returns A new {@link Mat3} with identical components.
  */
 public static clone(source: ReadonlyMat3): Mat3 {
  return new Mat3(
   source.m00,
   source.m01,
   source.m02,
   source.m10,
   source.m11,
   source.m12,
   source.m20,
   source.m21,
   source.m22,
  );
 }

 /**
  * Copy components from one matrix into another (alloc‑free).
  *
  * @param source - The matrix to copy from.
  * @param destination - The matrix to copy into.
  * @returns `destination`, now matching `source`.
  */
 public static copy(source: ReadonlyMat3, destination: Mat3): Mat3 {
  return destination.set(
   source.m00,
   source.m01,
   source.m02,
   source.m10,
   source.m11,
   source.m12,
   source.m20,
   source.m21,
   source.m22,
  );
 }

 /**
  * Create a matrix from explicit components (row‑major).
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
  * @returns A new {@link Mat3}.
  */
 public static fromValues(
  m00: number,
  m01: number,
  m02: number,
  m10: number,
  m11: number,
  m12: number,
  m20: number,
  m21: number,
  m22: number,
 ): Mat3 {
  return new Mat3(m00, m01, m02, m10, m11, m12, m20, m21, m22);
 }

 /**
  * Create a matrix from three **row** vectors.
  *
  * @overload
  * @param row0 - First row `{x,y,z?}`; `z` defaults to 0.
  * @param row1 - Second row `{x,y,z?}`; `z` defaults to 0.
  * @param row2 - Third row `{x,y,z?}`; `z` defaults to 0.
  * @returns A new {@link Mat3}.
  */
 public static fromRows(
  row0: { x: number; y: number; z?: number },
  row1: { x: number; y: number; z?: number },
  row2: { x: number; y: number; z?: number },
 ): Mat3;
 /**
  * Alloc‑free overload for rows.
  *
  * @overload
  * @param row0 - First row.
  * @param row1 - Second row.
  * @param row2 - Third row.
  * @param outMatrix - Destination matrix.
  * @returns `outMatrix`.
  */
 public static fromRows(
  row0: { x: number; y: number; z?: number },
  row1: { x: number; y: number; z?: number },
  row2: { x: number; y: number; z?: number },
  outMatrix: Mat3,
 ): Mat3;
 public static fromRows(
  row0: { x: number; y: number; z?: number },
  row1: { x: number; y: number; z?: number },
  row2: { x: number; y: number; z?: number },
  outMatrix: Mat3 = new Mat3(),
 ): Mat3 {
  const r0z = row0.z ?? 0;
  const r1z = row1.z ?? 0;
  const r2z = row2.z ?? 0;

  return outMatrix.set(row0.x, row0.y, r0z, row1.x, row1.y, r1z, row2.x, row2.y, r2z);
 }

 /**
  * Create a matrix from three **column** vectors.
  *
  * @overload
  * @param col0 - First column `{x,y,z?}`; `z` defaults to 0.
  * @param col1 - Second column `{x,y,z?}`; `z` defaults to 0.
  * @param col2 - Third column `{x,y,z?}`; `z` defaults to 1 (affine row).
  * @returns A new {@link Mat3}.
  *
  * @remarks
  * Defaults make this overload **affine by default** (last row `[0,0,1]`).
  */
 public static fromColumns(
  col0: { x: number; y: number; z?: number },
  col1: { x: number; y: number; z?: number },
  col2: { x: number; y: number; z?: number },
 ): Mat3;
 /**
  * Alloc‑free overload for columns.
  *
  * @overload
  * @param col0 - First column.
  * @param col1 - Second column.
  * @param col2 - Third column.
  * @param outMatrix - Destination matrix.
  * @returns `outMatrix`.
  */
 public static fromColumns(
  col0: { x: number; y: number; z?: number },
  col1: { x: number; y: number; z?: number },
  col2: { x: number; y: number; z?: number },
  outMatrix: Mat3,
 ): Mat3;
 public static fromColumns(
  col0: { x: number; y: number; z?: number },
  col1: { x: number; y: number; z?: number },
  col2: { x: number; y: number; z?: number },
  outMatrix: Mat3 = new Mat3(),
 ): Mat3 {
  const c0z = col0.z ?? 0;
  const c1z = col1.z ?? 0;
  const c2z = col2.z ?? 1; // affine by default for last row

  return outMatrix.set(col0.x, col1.x, col2.x, col0.y, col1.y, col2.y, c0z, c1z, c2z);
 }

 /**
  * Create a **2‑D rotation** matrix (affine) from an angle in radians.
  *
  * @overload
  * @param angle - Rotation angle in radians.
  * @returns A new rotation {@link Mat3}.
  */
 public static fromRotation(angle: number): Mat3;
 /**
  * Alloc‑free overload.
  *
  * @overload
  * @param angle - Rotation angle in radians.
  * @param outMatrix - Destination matrix.
  * @returns `outMatrix`.
  */
 public static fromRotation(angle: number, outMatrix: Mat3): Mat3;
 public static fromRotation(angle: number, outMatrix: Mat3 = new Mat3()): Mat3 {
  const c = Math.cos(angle);
  const s = Math.sin(angle);

  return outMatrix.set(c, -s, 0, s, c, 0, 0, 0, 1);
 }

 /**
  * Create a rotation matrix from **precomputed** cosine and sine.
  *
  * @param cosAngle - Cosine of the angle.
  * @param sinAngle - Sine of the angle.
  * @param outMatrix - Destination matrix (default new).
  * @returns `outMatrix` containing the rotation.
  */
 public static fromRotationCS(
  cosAngle: number,
  sinAngle: number,
  outMatrix: Mat3 = new Mat3(),
 ): Mat3 {
  return outMatrix.set(cosAngle, -sinAngle, 0, sinAngle, cosAngle, 0, 0, 0, 1);
 }

 /**
  * Create a **translation** matrix (affine).
  *
  * @overload
  * @param translateX - Translation along X.
  * @param translateY - Translation along Y.
  * @returns A new translation {@link Mat3}.
  */
 public static fromTranslation(translateX: number, translateY: number): Mat3;
 /**
  * Alloc‑free overload.
  *
  * @overload
  * @param translateX - Translation along X.
  * @param translateY - Translation along Y.
  * @param outMatrix - Destination matrix.
  * @returns `outMatrix`.
  */
 public static fromTranslation(translateX: number, translateY: number, outMatrix: Mat3): Mat3;
 public static fromTranslation(
  translateX: number,
  translateY: number,
  outMatrix: Mat3 = new Mat3(),
 ): Mat3 {
  return outMatrix.set(1, 0, translateX, 0, 1, translateY, 0, 0, 1);
 }

 /**
  * Create a **scaling** matrix (affine).
  *
  * @overload
  * @param scaleX - Scale along X.
  * @param scaleY - Scale along Y.
  * @returns A new scaling {@link Mat3}.
  */
 public static fromScaling(scaleX: number, scaleY: number): Mat3;
 /**
  * Alloc‑free overload.
  *
  * @overload
  * @param scaleX - Scale along X.
  * @param scaleY - Scale along Y.
  * @param outMatrix - Destination matrix.
  * @returns `outMatrix`.
  */
 public static fromScaling(scaleX: number, scaleY: number, outMatrix: Mat3): Mat3;
 public static fromScaling(scaleX: number, scaleY: number, outMatrix: Mat3 = new Mat3()): Mat3 {
  return outMatrix.set(scaleX, 0, 0, 0, scaleY, 0, 0, 0, 1);
 }

 /**
  * Create a **shear** matrix (affine): x' = x + shearX·y, y' = shearY·x + y.
  *
  * @overload
  * @param shearX - Horizontal shear (x w.r.t y).
  * @param shearY - Vertical shear (y w.r.t x).
  * @returns A new shear {@link Mat3}.
  */
 public static fromShear(shearX: number, shearY: number): Mat3;
 /**
  * Alloc‑free overload.
  *
  * @overload
  * @param shearX - Horizontal shear.
  * @param shearY - Vertical shear.
  * @param outMatrix - Destination matrix.
  * @returns `outMatrix`.
  */
 public static fromShear(shearX: number, shearY: number, outMatrix: Mat3): Mat3;
 public static fromShear(shearX: number, shearY: number, outMatrix: Mat3 = new Mat3()): Mat3 {
  return outMatrix.set(1, shearX, 0, shearY, 1, 0, 0, 0, 1);
 }

 /**
  * Create an affine matrix from translation–rotation–scale (TRS).
  *
  * @overload
  * @param translateX - Translation X.
  * @param translateY - Translation Y.
  * @param angle - Rotation angle (radians).
  * @param scaleX - Scale X (default = 1).
  * @param scaleY - Scale Y (default = 1).
  * @returns A new {@link Mat3}.
  */
 public static fromTRS(
  translateX: number,
  translateY: number,
  angle: number,
  scaleX?: number,
  scaleY?: number,
 ): Mat3;
 /**
  * Alloc‑free overload.
  *
  * @overload
  * @param translateX - Translation X.
  * @param translateY - Translation Y.
  * @param angle - Rotation angle (radians).
  * @param scaleX - Scale X (default = 1).
  * @param scaleY - Scale Y (default = 1).
  * @param outMatrix - Destination matrix.
  * @returns `outMatrix`.
  */
 public static fromTRS(
  translateX: number,
  translateY: number,
  angle: number,
  scaleX: number,
  scaleY: number,
  outMatrix: Mat3,
 ): Mat3;
 public static fromTRS(
  translateX: number,
  translateY: number,
  angle: number,
  scaleX: number = 1,
  scaleY: number = 1,
  outMatrix: Mat3 = new Mat3(),
 ): Mat3 {
  const c = Math.cos(angle),
   s = Math.sin(angle);

  return outMatrix.set(
   c * scaleX,
   -s * scaleY,
   translateX,
   s * scaleX,
   c * scaleY,
   translateY,
   0,
   0,
   1,
  );
 }

 /**
  * Create from a flat array in row‑major order.
  *
  * @overload
  * @param sourceArray - Numeric array containing at least 9 elements.
  * @param offset - Index of `m00` (default = 0).
  * @returns A new {@link Mat3}.
  * @throws {RangeError} If `offset` is out of range.
  */
 public static fromArray(sourceArray: ArrayLike<number>, offset?: number): Mat3;
 /**
  * Alloc‑free overload.
  *
  * @overload
  * @param sourceArray - Numeric array containing at least 9 elements.
  * @param offset - Index of `m00` (default = 0).
  * @param outMatrix - Destination matrix.
  * @returns `outMatrix`.
  * @throws {RangeError} If `offset` is out of range.
  */
 public static fromArray(sourceArray: ArrayLike<number>, offset: number, outMatrix: Mat3): Mat3;
 public static fromArray(
  sourceArray: ArrayLike<number>,
  offset = 0,
  outMatrix: Mat3 = new Mat3(),
 ): Mat3 {
  if (offset < 0 || offset + 8 >= sourceArray.length) {
   throw new RangeError(
    `Mat3.fromArray: invalid offset ${offset} for array length ${sourceArray.length}`,
   );
  }

  return outMatrix.set(
   sourceArray[offset + 0]!,
   sourceArray[offset + 1]!,
   sourceArray[offset + 2]!,
   sourceArray[offset + 3]!,
   sourceArray[offset + 4]!,
   sourceArray[offset + 5]!,
   sourceArray[offset + 6]!,
   sourceArray[offset + 7]!,
   sourceArray[offset + 8]!,
  );
 }

 /**
  * Create or set a matrix from a plain object.
  *
  * @overload
  * @param object - Object containing numeric `m00..m22` properties.
  * @returns A new {@link Mat3}.
  * @throws {TypeError} If any property is not a number.
  */
 public static fromObject(object: Mat3Like): Mat3;
 /**
  * Alloc‑free overload.
  *
  * @overload
  * @param object - Object containing numeric `m00..m22` properties.
  * @param outMatrix - Destination matrix.
  * @returns `outMatrix`.
  * @throws {TypeError} If any property is not a number.
  */
 public static fromObject(object: Mat3Like, outMatrix: Mat3): Mat3;
 public static fromObject(object: Mat3Like, outMatrix: Mat3 = new Mat3()): Mat3 {
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
   throw new TypeError('Mat3.fromObject: requires numeric m00..m22 properties');
  }

  return outMatrix.set(
   m00 as number,
   m01 as number,
   m02 as number,
   m10 as number,
   m11 as number,
   m12 as number,
   m20 as number,
   m21 as number,
   m22 as number,
  );
 }

 /**
  * Build an affine matrix from a 2×2 block and a translation vector.
  *
  * @param a00 - 2×2 element (row0,col0).
  * @param a01 - 2×2 element (row0,col1).
  * @param a10 - 2×2 element (row1,col0).
  * @param a11 - 2×2 element (row1,col1).
  * @param tx - Translation X.
  * @param ty - Translation Y.
  * @param outMatrix - Destination matrix (default new).
  * @returns `outMatrix` with the affine transform.
  */
 public static fromMat2AndTranslation(
  a00: number,
  a01: number,
  a10: number,
  a11: number,
  tx: number,
  ty: number,
  outMatrix: Mat3 = new Mat3(),
 ): Mat3 {
  return outMatrix.set(a00, a01, tx, a10, a11, ty, 0, 0, 1);
 }

 /**
  * Build an affine matrix from a {@link Mat2Like} 2×2 block and translation.
  *
  * @param m2 - 2×2 matrix block.
  * @param tx - Translation X (default 0).
  * @param ty - Translation Y (default 0).
  * @param outMatrix - Destination matrix (default new).
  * @returns `outMatrix` with the affine transform.
  */
 public static fromMat2(
  m2: Mat2Like,
  tx: number = 0,
  ty: number = 0,
  outMatrix: Mat3 = new Mat3(),
 ): Mat3 {
  return outMatrix.set(m2.m00, m2.m01, tx, m2.m10, m2.m11, ty, 0, 0, 1);
 }

 // ------------------------------------------------------------------------
 // Static: Algebra (matrix–matrix / matrix–scalar)
 // ------------------------------------------------------------------------

 /**
  * Matrix addition: `C = A + B`.
  *
  * @overload
  * @param a - First addend.
  * @param b - Second addend.
  * @returns A new {@link Mat3}.
  */
 public static add(a: ReadonlyMat3, b: ReadonlyMat3): Mat3;
 /**
  * Alloc‑free overload.
  *
  * @overload
  * @param a - First addend.
  * @param b - Second addend.
  * @param outMatrix - Destination matrix.
  * @returns `outMatrix`.
  */
 public static add(a: ReadonlyMat3, b: ReadonlyMat3, outMatrix: Mat3): Mat3;
 public static add(a: ReadonlyMat3, b: ReadonlyMat3, outMatrix: Mat3 = new Mat3()): Mat3 {
  return outMatrix.set(
   a.m00 + b.m00,
   a.m01 + b.m01,
   a.m02 + b.m02,
   a.m10 + b.m10,
   a.m11 + b.m11,
   a.m12 + b.m12,
   a.m20 + b.m20,
   a.m21 + b.m21,
   a.m22 + b.m22,
  );
 }

 /**
  * Matrix subtraction: `C = A − B`.
  *
  * @overload
  * @param a - Minuend.
  * @param b - Subtrahend.
  * @returns A new {@link Mat3}.
  */
 public static sub(a: ReadonlyMat3, b: ReadonlyMat3): Mat3;
 /**
  * Alloc‑free overload.
  *
  * @overload
  * @param a - Minuend.
  * @param b - Subtrahend.
  * @param outMatrix - Destination matrix.
  * @returns `outMatrix`.
  */
 public static sub(a: ReadonlyMat3, b: ReadonlyMat3, outMatrix: Mat3): Mat3;
 public static sub(a: ReadonlyMat3, b: ReadonlyMat3, outMatrix: Mat3 = new Mat3()): Mat3 {
  return outMatrix.set(
   a.m00 - b.m00,
   a.m01 - b.m01,
   a.m02 - b.m02,
   a.m10 - b.m10,
   a.m11 - b.m11,
   a.m12 - b.m12,
   a.m20 - b.m20,
   a.m21 - b.m21,
   a.m22 - b.m22,
  );
 }

 /**
  * **Hadamard (component‑wise)** product: `C = A ⊙ B`.
  *
  * @overload
  * @param a - First factor.
  * @param b - Second factor.
  * @returns A new {@link Mat3}.
  */
 public static multiplyComponents(a: ReadonlyMat3, b: ReadonlyMat3): Mat3;
 /**
  * Alloc‑free overload.
  *
  * @overload
  * @param a - First factor.
  * @param b - Second factor.
  * @param outMatrix - Destination matrix.
  * @returns `outMatrix`.
  */
 public static multiplyComponents(a: ReadonlyMat3, b: ReadonlyMat3, outMatrix: Mat3): Mat3;
 public static multiplyComponents(
  a: ReadonlyMat3,
  b: ReadonlyMat3,
  outMatrix: Mat3 = new Mat3(),
 ): Mat3 {
  return outMatrix.set(
   a.m00 * b.m00,
   a.m01 * b.m01,
   a.m02 * b.m02,
   a.m10 * b.m10,
   a.m11 * b.m11,
   a.m12 * b.m12,
   a.m20 * b.m20,
   a.m21 * b.m21,
   a.m22 * b.m22,
  );
 }

 /**
  * Matrix–matrix product: `C = A × B`.
  *
  * @overload
  * @param a - Left operand.
  * @param b - Right operand.
  * @returns A new {@link Mat3}.
  */
 public static multiply(a: ReadonlyMat3, b: ReadonlyMat3): Mat3;
 /**
  * Alloc‑free overload.
  *
  * @overload
  * @param a - Left operand.
  * @param b - Right operand.
  * @param outMatrix - Destination matrix.
  * @returns `outMatrix`.
  */
 public static multiply(a: ReadonlyMat3, b: ReadonlyMat3, outMatrix: Mat3): Mat3;
 public static multiply(a: ReadonlyMat3, b: ReadonlyMat3, outMatrix: Mat3 = new Mat3()): Mat3 {
  const m00 = a.m00 * b.m00 + a.m01 * b.m10 + a.m02 * b.m20;
  const m01 = a.m00 * b.m01 + a.m01 * b.m11 + a.m02 * b.m21;
  const m02 = a.m00 * b.m02 + a.m01 * b.m12 + a.m02 * b.m22;

  const m10 = a.m10 * b.m00 + a.m11 * b.m10 + a.m12 * b.m20;
  const m11 = a.m10 * b.m01 + a.m11 * b.m11 + a.m12 * b.m21;
  const m12 = a.m10 * b.m02 + a.m11 * b.m12 + a.m12 * b.m22;

  const m20 = a.m20 * b.m00 + a.m21 * b.m10 + a.m22 * b.m20;
  const m21 = a.m20 * b.m01 + a.m21 * b.m11 + a.m22 * b.m21;
  const m22 = a.m20 * b.m02 + a.m21 * b.m12 + a.m22 * b.m22;

  return outMatrix.set(m00, m01, m02, m10, m11, m12, m20, m21, m22);
 }

 /**
  * Multiply all components by a scalar.
  *
  * @overload
  * @param a - Source matrix.
  * @param scalar - Scale factor.
  * @returns A new scaled {@link Mat3}.
  */
 public static multiplyScalar(a: ReadonlyMat3, scalar: number): Mat3;
 /**
  * Alloc‑free overload.
  *
  * @overload
  * @param a - Source matrix.
  * @param scalar - Scale factor.
  * @param outMatrix - Destination matrix.
  * @returns `outMatrix`.
  */
 public static multiplyScalar(a: ReadonlyMat3, scalar: number, outMatrix: Mat3): Mat3;
 public static multiplyScalar(a: ReadonlyMat3, scalar: number, outMatrix: Mat3 = new Mat3()): Mat3 {
  return outMatrix.set(
   a.m00 * scalar,
   a.m01 * scalar,
   a.m02 * scalar,
   a.m10 * scalar,
   a.m11 * scalar,
   a.m12 * scalar,
   a.m20 * scalar,
   a.m21 * scalar,
   a.m22 * scalar,
  );
 }

 /**
  * Transpose: `C = Aᵀ`.
  *
  * @overload
  * @param a - Source matrix.
  * @returns A new transposed {@link Mat3}.
  */
 public static transpose(a: ReadonlyMat3): Mat3;
 /**
  * Alloc‑free overload.
  *
  * @overload
  * @param a - Source matrix.
  * @param outMatrix - Destination matrix.
  * @returns `outMatrix`.
  */
 public static transpose(a: ReadonlyMat3, outMatrix: Mat3): Mat3;
 public static transpose(a: ReadonlyMat3, outMatrix: Mat3 = new Mat3()): Mat3 {
  return outMatrix.set(a.m00, a.m10, a.m20, a.m01, a.m11, a.m21, a.m02, a.m12, a.m22);
 }

 /**
  * Adjugate (classical adjoint) of a 3×3 matrix.
  *
  * @overload
  * @param a - Source matrix.
  * @returns A new {@link Mat3} equal to `adj(A)`.
  */
 public static adjugate(a: ReadonlyMat3): Mat3;
 /**
  * Alloc‑free overload.
  *
  * @overload
  * @param a - Source matrix.
  * @param outMatrix - Destination matrix.
  * @returns `outMatrix`.
  */
 public static adjugate(a: ReadonlyMat3, outMatrix: Mat3): Mat3;
 public static adjugate(a: ReadonlyMat3, outMatrix: Mat3 = new Mat3()): Mat3 {
  // Cofactors (expand minors)
  const c00 = a.m11 * a.m22 - a.m12 * a.m21;
  const c01 = -(a.m10 * a.m22 - a.m12 * a.m20);
  const c02 = a.m10 * a.m21 - a.m11 * a.m20;

  const c10 = -(a.m01 * a.m22 - a.m02 * a.m21);
  const c11 = a.m00 * a.m22 - a.m02 * a.m20;
  const c12 = -(a.m00 * a.m21 - a.m01 * a.m20);

  const c20 = a.m01 * a.m12 - a.m02 * a.m11;
  const c21 = -(a.m00 * a.m12 - a.m02 * a.m10);
  const c22 = a.m00 * a.m11 - a.m01 * a.m10;

  // adj(A) = cof(A)ᵀ
  return outMatrix.set(c00, c10, c20, c01, c11, c21, c02, c12, c22);
 }

 /**
  * Determinant of a 3×3 matrix.
  *
  * @param a - Matrix.
  * @returns `det(A) = m00(m11m22 − m12m21) − m01(m10m22 − m12m20) + m02(m10m21 − m11m20)`.
  */
 public static determinant(a: ReadonlyMat3): number {
  return (
   a.m00 * (a.m11 * a.m22 - a.m12 * a.m21) -
   a.m01 * (a.m10 * a.m22 - a.m12 * a.m20) +
   a.m02 * (a.m10 * a.m21 - a.m11 * a.m20)
  );
 }

 /**
  * Trace of a 3×3 matrix.
  *
  * @param a - Matrix.
  * @returns `tr(A) = m00 + m11 + m22`.
  */
 public static trace(a: ReadonlyMat3): number {
  return a.m00 + a.m11 + a.m22;
 }

 /**
  * Inverse matrix `A⁻¹` (throws on singular).
  *
  * @overload
  * @param a - Matrix to invert.
  * @returns A new inverted {@link Mat3}.
  * @throws {RangeError} If the matrix is singular.
  */
 public static inverse(a: ReadonlyMat3): Mat3;
 /**
  * Alloc‑free overload.
  *
  * @overload
  * @param a - Matrix to invert.
  * @param outMatrix - Destination matrix.
  * @returns `outMatrix`.
  * @throws {RangeError} If the matrix is singular.
  */
 public static inverse(a: ReadonlyMat3, outMatrix: Mat3): Mat3;
 public static inverse(a: ReadonlyMat3, outMatrix: Mat3 = new Mat3()): Mat3 {
  const det = Mat3.determinant(a);

  if (det === 0) {
   throw new RangeError('Mat3.inverse: singular matrix');
  }

  const invDet = 1 / det;

  Mat3.adjugate(a, outMatrix);

  return outMatrix.multiplyScalar(invDet);
 }

 /**
  * Inverse matrix **without throwing**: returns the **zero** matrix when `det(A) == 0`.
  *
  * @overload
  * @param a - Matrix to invert.
  * @returns A new {@link Mat3} with `A⁻¹` or the **zero** matrix if singular.
  */
 public static inverseSafe(a: ReadonlyMat3): Mat3;
 /**
  * Alloc‑free overload.
  *
  * @overload
  * @param a - Matrix to invert.
  * @param outMatrix - Destination matrix.
  * @returns `outMatrix`.
  */
 public static inverseSafe(a: ReadonlyMat3, outMatrix: Mat3): Mat3;
 public static inverseSafe(a: ReadonlyMat3, outMatrix: Mat3 = new Mat3()): Mat3 {
  const det = Mat3.determinant(a);

  if (det === 0) {
   return outMatrix.zero();
  }

  const invDet = 1 / det;

  Mat3.adjugate(a, outMatrix);

  return outMatrix.multiplyScalar(invDet);
 }

 /**
  * Inverse matrix with **tolerance**: throws if `|det(A)| ≤ epsilon`.
  *
  * @param a - Matrix to invert.
  * @param epsilon - Non‑negative tolerance (default = {@link LINEAR_EPSILON}).
  * @param outMatrix - Destination matrix (default new).
  * @returns `outMatrix` containing the inverse.
  * @throws {RangeError} If the matrix is singular or nearly singular.
  */
 public static inverseTol(
  a: ReadonlyMat3,
  epsilon: number = LINEAR_EPSILON,
  outMatrix: Mat3 = new Mat3(),
 ): Mat3 {
  const det = Mat3.determinant(a);

  if (Math.abs(det) <= epsilon) {
   throw new RangeError('Mat3.inverseTol: near-singular matrix');
  }

  const invDet = 1 / det;

  Mat3.adjugate(a, outMatrix);

  return outMatrix.multiplyScalar(invDet);
 }

 /**
  * Inverse specialized for **affine** matrices:
  * for `A = [ R  t; 0 0 1 ]`, `A⁻¹ = [ R⁻¹   −R⁻¹·t; 0 0 1 ]`.
  *
  * @overload
  * @param a - Affine matrix.
  * @returns A new {@link Mat3} with the affine inverse.
  */
 public static inverseAffine(a: ReadonlyMat3): Mat3;
 /**
  * Alloc‑free overload.
  *
  * @overload
  * @param a - Affine matrix.
  * @param outMatrix - Destination matrix.
  * @returns `outMatrix`.
  */
 public static inverseAffine(a: ReadonlyMat3, outMatrix: Mat3): Mat3;
 public static inverseAffine(a: ReadonlyMat3, outMatrix: Mat3 = new Mat3()): Mat3 {
  // Upper-left 2x2:
  const r00 = a.m00,
   r01 = a.m01;

  const r10 = a.m10,
   r11 = a.m11;

  const det = r00 * r11 - r01 * r10;

  if (det === 0) {
   return Mat3.inverseSafe(a, outMatrix);
  }

  const invDet = 1 / det;
  const index00 = r11 * invDet;
  const index01 = -r01 * invDet;
  const index10 = -r10 * invDet;
  const index11 = r00 * invDet;

  const tx = a.m02,
   ty = a.m12;

  // out = [R^-1  -R^-1 t; 0 0 1]
  return outMatrix.set(
   index00,
   index01,
   -(index00 * tx + index01 * ty),
   index10,
   index11,
   -(index10 * tx + index11 * ty),
   0,
   0,
   1,
  );
 }

 // ------------------------------------------------------------------------
 // Static: Vector / point transforms & outer product (2‑D)
 // ------------------------------------------------------------------------

 /**
  * Transform a **direction** (ignores translation): `v' = A · v` using the 2×2 block.
  *
  * @overload
  * @param a - Matrix.
  * @param v - Direction vector.
  * @returns A new transformed {@link Vector2}.
  */
 public static transformDirection(a: ReadonlyMat3, v: ReadonlyVector2): Vector2;
 /**
  * Alloc‑free overload.
  *
  * @overload
  * @param a - Matrix.
  * @param v - Direction vector.
  * @param outVector - Destination vector.
  * @returns `outVector`.
  */
 public static transformDirection(a: ReadonlyMat3, v: ReadonlyVector2, outVector: Vector2): Vector2;
 public static transformDirection(
  a: ReadonlyMat3,
  v: ReadonlyVector2,
  outVector: Vector2 = new Vector2(),
 ): Vector2 {
  return outVector.set(a.m00 * v.x + a.m01 * v.y, a.m10 * v.x + a.m11 * v.y);
 }

 /**
  * Transform a **point** (includes translation): `p' = A · [x,y,1]`.
  *
  * @overload
  * @param a - Matrix.
  * @param p - Point.
  * @returns A new transformed {@link Vector2}.
  */
 public static transformPoint(a: ReadonlyMat3, p: ReadonlyVector2): Vector2;
 /**
  * Alloc‑free overload.
  *
  * @overload
  * @param a - Matrix.
  * @param p - Point.
  * @param outVector - Destination vector.
  * @returns `outVector`.
  */
 public static transformPoint(a: ReadonlyMat3, p: ReadonlyVector2, outVector: Vector2): Vector2;
 public static transformPoint(
  a: ReadonlyMat3,
  p: ReadonlyVector2,
  outVector: Vector2 = new Vector2(),
 ): Vector2 {
  return outVector.set(a.m00 * p.x + a.m01 * p.y + a.m02, a.m10 * p.x + a.m11 * p.y + a.m12);
 }

 /**
  * Transform a **point** in general 3×3 (projective): divides by `w` if needed.
  *
  * @param a - Matrix (affine or projective).
  * @param p - Point `[x,y]` (implicitly `w=1`).
  * @param outVector - Destination vector (default new).
  * @returns `outVector` with `(x'/w', y'/w')`. If `|w'| ≤ LINEAR_EPSILON`, returns `(0,0)`.
  */
 public static transformPointProjective(
  a: ReadonlyMat3,
  p: ReadonlyVector2,
  outVector: Vector2 = new Vector2(),
 ): Vector2 {
  const x = a.m00 * p.x + a.m01 * p.y + a.m02;
  const y = a.m10 * p.x + a.m11 * p.y + a.m12;
  const w = a.m20 * p.x + a.m21 * p.y + a.m22;

  if (Math.abs(w) <= LINEAR_EPSILON) {
   return outVector.zero();
  }

  const invW = 1 / w;

  return outVector.set(x * invW, y * invW);
 }

 /**
  * Outer product of two **2‑D** vectors embedded in 3×3 (upper‑left 2×2).
  * Sets last row to `[0,0,1]` and last column translation to zero.
  *
  * @overload
  * @param u - Left vector.
  * @param v - Right vector.
  * @returns A new {@link Mat3}.
  */
 public static outerProduct2(u: ReadonlyVector2, v: ReadonlyVector2): Mat3;
 /**
  * Alloc‑free overload.
  *
  * @overload
  * @param u - Left vector.
  * @param v - Right vector.
  * @param outMatrix - Destination matrix.
  * @returns `outMatrix`.
  */
 public static outerProduct2(u: ReadonlyVector2, v: ReadonlyVector2, outMatrix: Mat3): Mat3;
 public static outerProduct2(
  u: ReadonlyVector2,
  v: ReadonlyVector2,
  outMatrix: Mat3 = new Mat3(),
 ): Mat3 {
  return outMatrix.set(u.x * v.x, u.x * v.y, 0, u.y * v.x, u.y * v.y, 0, 0, 0, 1);
 }

 // ------------------------------------------------------------------------
 // Static: Comparison, validation & orientation
 // ------------------------------------------------------------------------

 /**
  * Strict component‑wise equality.
  *
  * @param a - First matrix.
  * @param b - Second matrix.
  * @returns `true` if all components are identical.
  */
 public static equals(a: ReadonlyMat3, b: ReadonlyMat3): boolean {
  return (
   a.m00 === b.m00 &&
   a.m01 === b.m01 &&
   a.m02 === b.m02 &&
   a.m10 === b.m10 &&
   a.m11 === b.m11 &&
   a.m12 === b.m12 &&
   a.m20 === b.m20 &&
   a.m21 === b.m21 &&
   a.m22 === b.m22
  );
 }

 /**
  * Approximate component‑wise equality within tolerance.
  *
  * @param a - First matrix.
  * @param b - Second matrix.
  * @param epsilon - Non‑negative tolerance (default = {@link LINEAR_EPSILON}).
  * @returns `true` if `|aᵢⱼ − bᵢⱼ| ≤ epsilon` for all components.
  * @throws {RangeError} If `epsilon < 0`.
  */
 public static nearEquals(a: ReadonlyMat3, b: ReadonlyMat3, epsilon: number = LINEAR_EPSILON): boolean {
  validateTolerance(epsilon, 'Mat3.nearEquals');
  
  return (
   areNearEqual(a.m00, b.m00, epsilon) &&
   areNearEqual(a.m01, b.m01, epsilon) &&
   areNearEqual(a.m02, b.m02, epsilon) &&
   areNearEqual(a.m10, b.m10, epsilon) &&
   areNearEqual(a.m11, b.m11, epsilon) &&
   areNearEqual(a.m12, b.m12, epsilon) &&
   areNearEqual(a.m20, b.m20, epsilon) &&
   areNearEqual(a.m21, b.m21, epsilon) &&
   areNearEqual(a.m22, b.m22, epsilon)
  );
 }

 /**
  * Test if all nine components are finite numbers.
  *
  * @param a - Matrix.
  * @returns `true` if all entries are finite.
  */
 public static isFinite(a: ReadonlyMat3): boolean {
  return (
   Number.isFinite(a.m00) &&
   Number.isFinite(a.m01) &&
   Number.isFinite(a.m02) &&
   Number.isFinite(a.m10) &&
   Number.isFinite(a.m11) &&
   Number.isFinite(a.m12) &&
   Number.isFinite(a.m20) &&
   Number.isFinite(a.m21) &&
   Number.isFinite(a.m22)
  );
 }

 /**
  * Test if a matrix is (approximately) the identity within tolerance.
  *
  * @param a - Matrix to test.
  * @param epsilon - Non‑negative tolerance (default = {@link LINEAR_EPSILON}).
  * @returns `true` if `a ≈ I`.
  */
 public static isIdentity(a: ReadonlyMat3, epsilon: number = LINEAR_EPSILON): boolean {
  return (
   Math.abs(a.m00 - 1) <= epsilon &&
   Math.abs(a.m11 - 1) <= epsilon &&
   Math.abs(a.m22 - 1) <= epsilon &&
   Math.abs(a.m01) <= epsilon &&
   Math.abs(a.m02) <= epsilon &&
   Math.abs(a.m10) <= epsilon &&
   Math.abs(a.m12) <= epsilon &&
   Math.abs(a.m20) <= epsilon &&
   Math.abs(a.m21) <= epsilon
  );
 }

 /**
  * Test if a matrix is **affine** (last row ≈ `[0,0,1]`).
  *
  * @param a - Matrix to test.
  * @param epsilon - Non‑negative tolerance (default = {@link LINEAR_EPSILON}).
  * @returns `true` if last row is `[0,0,1]` within `epsilon`.
  */
 public static isAffine(a: ReadonlyMat3, epsilon: number = LINEAR_EPSILON): boolean {
  return Math.abs(a.m20) <= epsilon && Math.abs(a.m21) <= epsilon && Math.abs(a.m22 - 1) <= epsilon;
 }

 /**
  * Test if a matrix is **rigid** (rotation + translation): upper‑left 2×2 is a rotation and last row ≈ `[0,0,1]`.
  *
  * @param a - Matrix to test.
  * @param epsilon - Non‑negative tolerance (default = {@link LINEAR_EPSILON}).
  * @returns `true` if `a` is a rigid (proper orthogonal, det ≈ +1) transform.
  */
 public static isRigid(a: ReadonlyMat3, epsilon: number = LINEAR_EPSILON): boolean {
  if (!Mat3.isAffine(a, epsilon)) return false;

  const c0x = a.m00,
   c0y = a.m10;

  const c1x = a.m01,
   c1y = a.m11;

  const dot01 = c0x * c1x + c0y * c1y;
  const length0 = Math.hypot(c0x, c0y);
  const length1 = Math.hypot(c1x, c1y);
  const det2 = a.m00 * a.m11 - a.m01 * a.m10;

  return (
   Math.abs(dot01) <= epsilon &&
   Math.abs(length0 - 1) <= epsilon &&
   Math.abs(length1 - 1) <= epsilon &&
   Math.abs(det2 - 1) <= epsilon
  );
 }

 /**
  * Test if `A` is singular (or nearly singular) with tolerance.
  *
  * @param a - Matrix to test.
  * @param epsilon - Non‑negative tolerance (default = {@link LINEAR_EPSILON}).
  * @returns `true` if `|det(A)| ≤ epsilon`.
  */
 public static isSingular(a: ReadonlyMat3, epsilon: number = LINEAR_EPSILON): boolean {
  return Math.abs(Mat3.determinant(a)) <= epsilon;
 }

 /**
  * Returns `true` if the upper‑left 2×2 basis contains a **reflection** (orientation flip).
  *
  * @param a - Matrix to test.
  * @returns `true` if `det([a00 a01; a10 a11]) < 0`.
  */
 public static hasReflection2D(a: ReadonlyMat3): boolean {
  return a.m00 * a.m11 - a.m01 * a.m10 < 0;
 }

 // ------------------------------------------------------------------------
 // Static: Utilities
 // ------------------------------------------------------------------------

 /**
  * Frobenius norm ‖A‖_F = sqrt(Σ aᵢⱼ²).
  *
  * @param a - Matrix.
  * @returns Frobenius norm (non‑negative).
  */
 public static frobeniusNorm(a: ReadonlyMat3): number {
  return Math.hypot(a.m00, a.m01, a.m02, a.m10, a.m11, a.m12, a.m20, a.m21, a.m22);
 }

 /**
  * Extract the 2‑D rotation angle (in radians, range (−π, π]) from the
  * upper-left 2×2 block. For **affine matrices without shear** and **positive
  * scales** it returns exactly the orientation of the transformed X‑basis:
  * `atan2(m10, m00)`. If the first column is degenerate, it uses the Y‑basis
  * (`atan2(-m01, m11)`). For general cases (including shear or near‑degenerate
  * matrices) it falls back to a Gram–Schmidt orthonormalization.
  *
  * @param matrix - The source matrix.
  * @returns The rotation angle in radians (principal value in (−π, π]).
  */
 public static angle2D(matrix: ReadonlyMat3): number {
  // 1) Prefer the orientation of the X-basis (first column): robust and
  //    matches the usual contract in engines for affine/no-shear, sx>0.
  const c0x = matrix.m00;
  const c0y = matrix.m10;

  const len0 = Math.hypot(c0x, c0y);

  if (len0 > LINEAR_EPSILON * 10) {
   return Math.atan2(c0y, c0x);
  }

  // 2) If X-basis is (near) degenerate, use the Y-basis (second column).
  //    For M = R(θ)·diag(sx,sy): col1 = (-sinθ·sy, cosθ·sy)
  //    → θ = atan2(-m01, m11).
  const c1x = matrix.m01;
  const c1y = matrix.m11;

  const len1 = Math.hypot(c1x, c1y);

  if (len1 > LINEAR_EPSILON * 10) {
   return Math.atan2(-c1x, c1y);
  }

  // 3) Fallback: remove scale/shear by orthonormalizing the 2×2 block
  //    and enforce right-handed orientation, then read θ from the first unit column.
  let ax = matrix.m00,
   ay = matrix.m10; // column 0

  let bx = matrix.m01,
   by = matrix.m11; // column 1

  const lenA = Math.hypot(ax, ay);
  if (lenA === 0) return 0; // fully degenerate → define θ = 0

  ax /= lenA;
  ay /= lenA;

  const dotAB = ax * bx + ay * by;

  bx -= dotAB * ax;
  by -= dotAB * ay;

  const lenB = Math.hypot(bx, by);

  if (lenB === 0) {
   bx = -ay;
   by = ax;
  } else {
   bx /= lenB;
   by /= lenB;
  }

  // Enforce right-handed basis
  if (ax * by - ay * bx < 0) {
   bx = -bx;
   by = -by;
  }

  return Math.atan2(ay, ax);
 }

 /**
  * Extract the **translation** from an affine matrix.
  *
  * @param a - Affine matrix.
  * @param outVector - Destination vector (default new).
  * @returns `outVector = (m02, m12)`.
  */
 public static getTranslation(a: ReadonlyMat3, outVector: Vector2 = new Vector2()): Vector2 {
  return outVector.set(a.m02, a.m12);
 }

 /**
  * Decompose an **affine** matrix into translation–rotation–scale (TRS) and shear.
  * Propagates **reflection** sign into `scale.y` when det(2×2) < 0.
  *
  * @param a - Affine matrix.
  * @returns An object `{ translation, rotation, scale, shear }`.
  *
  * @remarks
  * The algorithm extracts:
  * - `translation = (m02, m12)`.
  * - `rotation = atan2(b, a)` with `a=m00, b=m10` (angle of X basis).
  * - `scaleX = sqrt(a² + b²)`.
  * - `shear = (a*c + b*d)/scaleX²` with `c=m01, d=m11`, then
  * - `c' = c − shear·a`, `d' = d − shear·b`, `scaleY = sqrt(c'² + d'²)`.
  * - If `det([a c; b d]) < 0`, the sign is applied to `scaleY`.
  */
 public static decomposeAffine(a: ReadonlyMat3): {
  translation: Vector2;
  rotation: number;
  scale: Vector2;
  shear: number;
 } {
  const translation = new Vector2(a.m02, a.m12);

  const a00 = a.m00,
   a10 = a.m10,
   a01 = a.m01,
   a11 = a.m11;

  const rotation = Math.atan2(a10, a00);
  const scaleX = Math.hypot(a00, a10) || 0;

  let shear = 0;
  let scaleY = 0;

  if (scaleX !== 0) {
   shear = (a00 * a01 + a10 * a11) / (scaleX * scaleX);

   const cPrime = a01 - shear * a00;
   const dPrime = a11 - shear * a10;

   scaleY = Math.hypot(cPrime, dPrime);

   const det2 = a00 * a11 - a01 * a10;

   if (det2 < 0) scaleY = -scaleY; // reflect on Y
  }

  return {
   translation,
   rotation,
   scale: new Vector2(scaleX, scaleY),
   shear,
  };
 }

 // ------------------------------------------------------------------------
 // Instance: Storage
 // ------------------------------------------------------------------------

 public m00: number;
 public m01: number;
 public m02: number;
 public m10: number;
 public m11: number;
 public m12: number;
 public m20: number;
 public m21: number;
 public m22: number;

 // ------------------------------------------------------------------------
 // Instance: Constructor overloads
 // ------------------------------------------------------------------------

 /**
  * Construct an **identity** matrix.
  * @overload
  */
 constructor();

 /**
  * Construct from explicit values (row‑major).
  * @overload
  */
 constructor(
  m00: number,
  m01: number,
  m02: number,
  m10: number,
  m11: number,
  m12: number,
  m20: number,
  m21: number,
  m22: number,
 );

 /**
  * Construct from a nine‑element array.
  * @overload
  * @param array - `[m00, m01, m02, m10, m11, m12, m20, m21, m22]`.
  */
 constructor(array: [number, number, number, number, number, number, number, number, number]);

 /**
  * Construct from a plain object `{ m00..m22 }`.
  * @overload
  */
 constructor(object: Mat3Like);

 /**
  * Copy constructor.
  * @overload
  */
 constructor(matrix: Mat3);

 // ------------------------------------------------------------------------
 // Instance: Constructor
 // ------------------------------------------------------------------------

 /**
  * General constructor.
  *
  * @param a - Either numbers, tuple, plain object, another matrix, or undefined.
  * @param b..i - Remaining numeric parameters when using number overloads.
  * @throws {RangeError} If array/object form is invalid or non‑numeric.
  */
 constructor(
  a?:
   | number
   | [number, number, number, number, number, number, number, number, number]
   | Mat3Like
   | Mat3,
  b?: number,
  c?: number,
  d?: number,
  e?: number,
  f?: number,
  g?: number,
  h?: number,
  index?: number,
 ) {
  if (
   typeof a === 'number' &&
   typeof b === 'number' &&
   typeof c === 'number' &&
   typeof d === 'number' &&
   typeof e === 'number' &&
   typeof f === 'number' &&
   typeof g === 'number' &&
   typeof h === 'number' &&
   typeof index === 'number'
  ) {
   this.m00 = a;
   this.m01 = b;
   this.m02 = c;
   this.m10 = d;
   this.m11 = e;
   this.m12 = f;
   this.m20 = g;
   this.m21 = h;
   this.m22 = index;
  } else if (Array.isArray(a)) {
   if (a.length < 9) {
    throw new RangeError('Mat3.constructor: array must have nine elements');
   }

   this.m00 = a[0];
   this.m01 = a[1];
   this.m02 = a[2];
   this.m10 = a[3];
   this.m11 = a[4];
   this.m12 = a[5];
   this.m20 = a[6];
   this.m21 = a[7];
   this.m22 = a[8];
  } else if (a instanceof Mat3) {
   this.m00 = a.m00;
   this.m01 = a.m01;
   this.m02 = a.m02;
   this.m10 = a.m10;
   this.m11 = a.m11;
   this.m12 = a.m12;
   this.m20 = a.m20;
   this.m21 = a.m21;
   this.m22 = a.m22;
  } else if (a && typeof a === 'object' && 'm00' in a && 'm22' in a) {
   const o = a as Mat3Like;

   if (
    typeof o.m00 !== 'number' ||
    typeof o.m01 !== 'number' ||
    typeof o.m02 !== 'number' ||
    typeof o.m10 !== 'number' ||
    typeof o.m11 !== 'number' ||
    typeof o.m12 !== 'number' ||
    typeof o.m20 !== 'number' ||
    typeof o.m21 !== 'number' ||
    typeof o.m22 !== 'number'
   ) {
    throw new RangeError('Mat3.constructor: m00..m22 must be numbers');
   }

   this.m00 = o.m00;
   this.m01 = o.m01;
   this.m02 = o.m02;
   this.m10 = o.m10;
   this.m11 = o.m11;
   this.m12 = o.m12;
   this.m20 = o.m20;
   this.m21 = o.m21;
   this.m22 = o.m22;
  } else if (a === undefined) {
   // Identity
   this.m00 = 1;
   this.m01 = 0;
   this.m02 = 0;
   this.m10 = 0;
   this.m11 = 1;
   this.m12 = 0;
   this.m20 = 0;
   this.m21 = 0;
   this.m22 = 1;
  } else {
   throw new RangeError('Mat3.constructor: invalid constructor arguments for Mat3');
  }
 }

 // ------------------------------------------------------------------------
 // Instance: Basic mutators & queries
 // ------------------------------------------------------------------------

 /**
  * Set all components.
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
 public set(
  m00: number,
  m01: number,
  m02: number,
  m10: number,
  m11: number,
  m12: number,
  m20: number,
  m21: number,
  m22: number,
 ): this {
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
 }

 /**
  * Reset to the identity matrix.
  *
  * @returns This matrix for chaining.
  */
 public identity(): this {
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
 }

 /**
  * Reset all components to zero.
  *
  * @returns This matrix for chaining.
  */
 public zero(): this {
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
 }

 /**
  * Clone this matrix.
  *
  * @returns A new {@link Mat3} with the same components.
  */
 public clone(): Mat3 {
  return Mat3.clone(this);
 }

 /**
  * Copy from another matrix.
  *
  * @param other - Source matrix.
  * @returns This matrix for chaining.
  */
 public copy(other: ReadonlyMat3): this {
  return this.set(
   other.m00,
   other.m01,
   other.m02,
   other.m10,
   other.m11,
   other.m12,
   other.m20,
   other.m21,
   other.m22,
  );
 }

 // ------------------------------------------------------------------------
 // Instance: Row/column accessors
 // ------------------------------------------------------------------------

 /**
  * Get a **row** as `{x,y,z}`.
  *
  * @param index - 0, 1, or 2.
  * @returns A new object `{x, y, z}` containing the requested row.
  * @throws {RangeError} If `index` is not 0, 1 or 2.
  */
 public getRow(index: 0 | 1 | 2): { x: number; y: number; z: number } {
  if (index === 0) return { x: this.m00, y: this.m01, z: this.m02 };
  if (index === 1) return { x: this.m10, y: this.m11, z: this.m12 };
  if (index === 2) return { x: this.m20, y: this.m21, z: this.m22 };

  throw new RangeError('Mat3.getRow: index must be 0, 1 or 2');
 }

 /**
  * Set a **row** from `{x,y,z}`.
  *
  * @param index - 0, 1, or 2.
  * @param row - Source row with `{x,y,z}`.
  * @returns This matrix for chaining.
  * @throws {RangeError} If `index` is not 0, 1 or 2.
  */
 public setRow(index: 0 | 1 | 2, row: { x: number; y: number; z: number }): this {
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
 }

 /**
  * Get a **column** as `{x,y,z}`.
  *
  * @param index - 0, 1, or 2.
  * @returns The requested column components.
  * @throws {RangeError} If `index` is not 0, 1 or 2.
  */
 public getColumn(index: 0 | 1 | 2): { x: number; y: number; z: number } {
  if (index === 0) return { x: this.m00, y: this.m10, z: this.m20 };
  if (index === 1) return { x: this.m01, y: this.m11, z: this.m21 };
  if (index === 2) return { x: this.m02, y: this.m12, z: this.m22 };

  throw new RangeError('Mat3.getColumn: index must be 0, 1 or 2');
 }

 /**
  * Set a **column** from `{x,y,z}`.
  *
  * @param index - 0, 1, or 2.
  * @param column - Source column with `{x,y,z}`.
  * @returns This matrix for chaining.
  * @throws {RangeError} If `index` is not 0, 1 or 2.
  */
 public setColumn(index: 0 | 1 | 2, column: { x: number; y: number; z: number }): this {
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
 }

 // ------------------------------------------------------------------------
 // Instance: Numeric transforms (component‑wise)
 // ------------------------------------------------------------------------

 /**
  * Apply {@link Math.floor} to every component.
  *
  * @returns This matrix after flooring.
  */
 public floor(): this {
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
 }

 /**
  * Apply {@link Math.ceil} to every component.
  *
  * @returns This matrix after ceiling.
  */
 public ceil(): this {
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
 }

 /**
  * Apply {@link Math.round} to every component.
  *
  * @returns This matrix after rounding.
  */
 public round(): this {
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
 }

 /**
  * Apply {@link Math.abs} to every component.
  *
  * @returns This matrix after absolute‑value transform.
  */
 public abs(): this {
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
 }

 // ------------------------------------------------------------------------
 // Instance: Algebra (matrix–matrix / matrix–scalar)
 // ------------------------------------------------------------------------

 /**
  * Component‑wise addition with another matrix.
  *
  * @param other - Matrix to add.
  * @returns This matrix after addition.
  */
 public add(other: ReadonlyMat3): this {
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
 }

 /**
  * Component‑wise subtraction of another matrix.
  *
  * @param other - Matrix to subtract.
  * @returns This matrix after subtraction.
  */
 public sub(other: ReadonlyMat3): this {
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
 }

 /**
  * Component‑wise (Hadamard) product with another matrix.
  *
  * @param other - Matrix to multiply component‑wise.
  * @returns This matrix after Hadamard product.
  */
 public multiplyComponents(other: ReadonlyMat3): this {
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
 }

 /**
  * Multiply this matrix on the **right**: `this = this × m`.
  *
  * @param m - Right operand.
  * @returns This matrix after multiplication.
  */
 public multiply(m: ReadonlyMat3): this {
  const a00 = this.m00,
   a01 = this.m01,
   a02 = this.m02;

  const a10 = this.m10,
   a11 = this.m11,
   a12 = this.m12;

  const a20 = this.m20,
   a21 = this.m21,
   a22 = this.m22;

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
 }

 /**
  * Multiply this matrix on the **left**: `this = m × this`.
  *
  * @param m - Left operand.
  * @returns This matrix after pre‑multiplication.
  */
 public premultiply(m: ReadonlyMat3): this {
  const b00 = this.m00,
   b01 = this.m01,
   b02 = this.m02;

  const b10 = this.m10,
   b11 = this.m11,
   b12 = this.m12;

  const b20 = this.m20,
   b21 = this.m21,
   b22 = this.m22;

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
 }

 /**
  * Multiply every component by a scalar.
  *
  * @param scalar - Scale factor.
  * @returns This matrix after scaling.
  */
 public multiplyScalar(scalar: number): this {
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
 }

 /**
  * In‑place transposition.
  *
  * @returns This matrix after transposition.
  */
 public transpose(): this {
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
 }

 /**
  * Determinant of this matrix.
  *
  * @returns `det(this)`.
  */
 public determinant(): number {
  return Mat3.determinant(this);
 }

 /**
  * Trace of this matrix.
  *
  * @returns `tr(this) = m00 + m11 + m22`.
  */
 public trace(): number {
  return Mat3.trace(this);
 }

 /**
  * Frobenius norm of this matrix.
  *
  * @returns Non‑negative Frobenius norm.
  */
 public frobeniusNorm(): number {
  return Mat3.frobeniusNorm(this);
 }

 /**
  * Replace this matrix with its adjugate `adj(this)`.
  *
  * @returns This matrix after being replaced by its adjugate.
  */
 public adjugate(): this {
  const adj = Mat3.adjugate(this);
  return this.copy(adj);
 }

 /**
  * Invert this matrix (throws on singular).
  *
  * @returns This matrix after inversion.
  * @throws {RangeError} If the matrix is singular.
  */
 public inverse(): this {
  const inv = Mat3.inverse(this);

  return this.copy(inv);
 }

 /**
  * Invert this matrix **without throwing**; becomes **zero** if singular.
  *
  * @returns This matrix after "safe" inversion (or zero).
  */
 public inverseSafe(): this {
  const inv = Mat3.inverseSafe(this);

  return this.copy(inv);
 }

 /**
  * Invert this matrix with **tolerance** (throws if `|det| ≤ epsilon`).
  *
  * @param epsilon - Non‑negative tolerance (default = {@link LINEAR_EPSILON}).
  * @returns This matrix after inversion.
  * @throws {RangeError} If the matrix is singular or nearly singular.
  */
 public inverseTol(epsilon: number = LINEAR_EPSILON): this {
  const inv = Mat3.inverseTol(this, epsilon);
  return this.copy(inv);
 }

 /**
  * Invert this matrix assuming it is **affine** (specialized).
  * Falls back to safe inversion (zero) if the 2×2 block is not invertible.
  *
  * @returns This matrix after affine inversion.
  */
 public inverseAffine(): this {
  const inv = Mat3.inverseAffine(this);
  return this.copy(inv);
 }

 // ------------------------------------------------------------------------
 // Instance: Building & composing affine transforms (in‑place, no alloc)
 // ------------------------------------------------------------------------

 /**
  * Set upper‑left 2×2 block while preserving translation and enforcing affine last row.
  *
  * @param a00 - Row0,Col0.
  * @param a01 - Row0,Col1.
  * @param a10 - Row1,Col0.
  * @param a11 - Row1,Col1.
  * @returns This matrix for chaining.
  */
 public set2x2(a00: number, a01: number, a10: number, a11: number): this {
  this.m00 = a00;
  this.m01 = a01;
  this.m10 = a10;
  this.m11 = a11;
  this.m20 = 0;
  this.m21 = 0;
  this.m22 = 1;

  return this;
 }

 /**
  * Set this matrix to an **affine** rotation by angle (radians).
  *
  * @param angle - Rotation angle (radians).
  * @returns This matrix, now a rotation (with `m02=m12=0`, last row affine).
  */
 public setRotation(angle: number): this {
  return this.copy(Mat3.fromRotation(angle));
 }

 /**
  * Set this matrix to an affine rotation using **precomputed** cosine/sine.
  *
  * @param cosAngle - Cosine.
  * @param sinAngle - Sine.
  * @returns This matrix for chaining.
  */
 public setRotationCS(cosAngle: number, sinAngle: number): this {
  return this.copy(Mat3.fromRotationCS(cosAngle, sinAngle));
 }

 /**
  * Set this matrix to an **affine** scaling.
  *
  * @param scaleX - Scale X.
  * @param scaleY - Scale Y.
  * @returns This matrix for chaining.
  */
 public setScaling(scaleX: number, scaleY: number): this {
  return this.copy(Mat3.fromScaling(scaleX, scaleY));
 }

 /**
  * Set this matrix to an **affine** shear.
  *
  * @param shearX - Horizontal shear.
  * @param shearY - Vertical shear.
  * @returns This matrix for chaining.
  */
 public setShear(shearX: number, shearY: number): this {
  return this.copy(Mat3.fromShear(shearX, shearY));
 }

 /**
  * Set this matrix to **TRS** (translation–rotation–scale).
  *
  * @param translateX - Translation X.
  * @param translateY - Translation Y.
  * @param angle - Rotation angle (radians).
  * @param scaleX - Scale X (default = 1).
  * @param scaleY - Scale Y (default = 1).
  * @returns This matrix for chaining.
  */
 public setTRS(
  translateX: number,
  translateY: number,
  angle: number,
  scaleX: number = 1,
  scaleY: number = 1,
 ): this {
  return this.copy(Mat3.fromTRS(translateX, translateY, angle, scaleX, scaleY));
 }

 /**
  * Replace translation (m02, m12), enforcing affine last row.
  *
  * @param translateX - Translation X.
  * @param translateY - Translation Y.
  * @returns This matrix for chaining.
  */
 public setTranslation(translateX: number, translateY: number): this {
  this.m02 = translateX;
  this.m12 = translateY;
  this.m22 = 1;

  return this;
 }

 /**
  * Post‑multiply by a **translation** in place: `this = this × T(tx,ty)`.
  *
  * @param translateX - Translation along X.
  * @param translateY - Translation along Y.
  * @returns This matrix after composition.
  *
  * @remarks
  * Only the translation column is modified; basis columns remain unchanged.
  */
 public translate(translateX: number, translateY: number): this {
  // col2' = this * [tx, ty, 1] = tx*col0 + ty*col1 + col2
  this.m02 = this.m00 * translateX + this.m01 * translateY + this.m02;
  this.m12 = this.m10 * translateX + this.m11 * translateY + this.m12;
  this.m22 = this.m20 * translateX + this.m21 * translateY + this.m22;

  return this;
 }

 /**
  * Post‑multiply by a **rotation** (affine) in place: `this = this × R(θ)`.
  *
  * @param angle - Angle in radians.
  * @returns This matrix after composition.
  *
  * @remarks
  * Only the first two columns (basis) are rotated; translation is preserved.
  */
 public rotate(angle: number): this {
  const c = Math.cos(angle),
   s = Math.sin(angle);

  const c00 = this.m00,
   c10 = this.m10,
   c20 = this.m20;

  const c01 = this.m01,
   c11 = this.m11,
   c21 = this.m21;

  this.m00 = c * c00 + s * c01;
  this.m10 = c * c10 + s * c11;
  this.m20 = c * c20 + s * c21;

  this.m01 = -s * c00 + c * c01;
  this.m11 = -s * c10 + c * c11;
  this.m21 = -s * c20 + c * c21;

  return this;
 }

 /**
  * Post‑multiply by a rotation using **cos/sin**, in place: `this = this × R(c,s)`.
  *
  * @param cosAngle - `cos(θ)`.
  * @param sinAngle - `sin(θ)`.
  * @returns This matrix after composition.
  */
 public rotateCS(cosAngle: number, sinAngle: number): this {
  const c = cosAngle,
   s = sinAngle;

  const c00 = this.m00,
   c10 = this.m10,
   c20 = this.m20;

  const c01 = this.m01,
   c11 = this.m11,
   c21 = this.m21;

  this.m00 = c * c00 + s * c01;
  this.m10 = c * c10 + s * c11;
  this.m20 = c * c20 + s * c21;

  this.m01 = -s * c00 + c * c01;
  this.m11 = -s * c10 + c * c11;
  this.m21 = -s * c20 + c * c21;

  return this;
 }

 /**
  * Post‑multiply by a **scaling** (affine) in place: `this = this × S(sx,sy)`.
  *
  * @param scaleX - Scale X.
  * @param scaleY - Scale Y.
  * @returns This matrix after composition.
  */
 public scale(scaleX: number, scaleY: number): this {
  this.m00 *= scaleX;
  this.m10 *= scaleX;
  this.m20 *= scaleX; // col0 *= sx
  this.m01 *= scaleY;
  this.m11 *= scaleY;
  this.m21 *= scaleY; // col1 *= sy

  return this;
 }

 /**
  * Post‑multiply by a **shear** (affine) in place: `this = this × H(sx,sy)`.
  *
  * @param shearX - Horizontal shear.
  * @param shearY - Vertical shear.
  * @returns This matrix after composition.
  */
 public shear(shearX: number, shearY: number): this {
  const c00 = this.m00,
   c10 = this.m10,
   c20 = this.m20;

  const c01 = this.m01,
   c11 = this.m11,
   c21 = this.m21;

  // H = [1 sx 0; sy 1 0; 0 0 1]
  // col0' = col0 + sy * col1
  // col1' = sx * col0 + col1
  this.m00 = c00 + shearY * c01;
  this.m10 = c10 + shearY * c11;
  this.m20 = c20 + shearY * c21;

  this.m01 = shearX * c00 + c01;
  this.m11 = shearX * c10 + c11;
  this.m21 = shearX * c20 + c21;

  return this;
 }

 /**
  * Orthonormalizes the 2×2 linear part of this affine matrix using
  * Gram–Schmidt, preserves translation, fixes the last affine row to [0,0,1],
  * and enforces **right-handed** orientation (determinant +1).
  *
  * @param tolerance - Non-negative threshold to consider a vector degenerate.
  * @returns This matrix.
  */
 public orthonormalizeAffine(tolerance: number = LINEAR_EPSILON): this {
  // Preserve translation first
  const tx = this.m02;
  const ty = this.m12;

  // Extract 2×2 columns (basis vectors)
  let ax = this.m00,
   ay = this.m10; // column 0

  let bx = this.m01,
   by = this.m11; // column 1

  // Normalize first column (fallback to +X if degenerate)
  let lengthA = Math.hypot(ax, ay);

  if (lengthA <= tolerance) {
   ax = 1;
   ay = 0;
   lengthA = 1;
  } else {
   ax /= lengthA;
   ay /= lengthA;
  }

  // Make second column orthogonal to first
  const dotAB = ax * bx + ay * by;

  bx -= dotAB * ax;
  by -= dotAB * ay;

  // Normalize second column (fallback to perpendicular to first if degenerate)
  let lengthB = Math.hypot(bx, by);

  if (lengthB <= tolerance) {
   bx = -ay;
   by = ax; // guaranteed perpendicular and unit (since ax,ay is unit)
  } else {
   bx /= lengthB;
   by /= lengthB;
  }

  // Enforce right-handed orientation: det([a b]) must be +1
  const det2 = ax * by - ay * bx;

  if (det2 < 0) {
   bx = -bx;
   by = -by;
  }

  // Write back; keep translation, force affine tail [0,0,1]
  this.m00 = ax;
  this.m01 = bx;
  this.m02 = tx;
  this.m10 = ay;
  this.m11 = by;
  this.m12 = ty;
  this.m20 = 0;
  this.m21 = 0;
  this.m22 = 1;

  return this;
 }

 // ------------------------------------------------------------------------
 // Instance: Pre‑composition helpers (alloc‑free, specialized)
 // ------------------------------------------------------------------------

 /**
  * Pre‑multiply by translation: `this = T(tx,ty) × this` (no allocation).
  *
  * @param tx - Translation X.
  * @param ty - Translation Y.
  * @returns This matrix after pre‑composition.
  */
 public preTranslate(tx: number, ty: number): this {
  // row0' = row0 + tx*row2 ; row1' = row1 + ty*row2
  this.m00 += tx * this.m20;
  this.m01 += tx * this.m21;
  this.m02 += tx * this.m22;
  this.m10 += ty * this.m20;
  this.m11 += ty * this.m21;
  this.m12 += ty * this.m22;

  return this;
 }

 /**
  * Pre‑multiply by rotation: `this = R(θ) × this` (no allocation).
  *
  * @param angle - Angle in radians.
  * @returns This matrix after pre‑composition.
  */
 public preRotate(angle: number): this {
  const c = Math.cos(angle),
   s = Math.sin(angle);

  const r00 = this.m00,
   r01 = this.m01,
   r02 = this.m02;

  const r10 = this.m10,
   r11 = this.m11,
   r12 = this.m12;

  this.m00 = c * r00 - s * r10;
  this.m01 = c * r01 - s * r11;
  this.m02 = c * r02 - s * r12;
  this.m10 = s * r00 + c * r10;
  this.m11 = s * r01 + c * r11;
  this.m12 = s * r02 + c * r12;

  // row2 unchanged
  return this;
 }

 /**
  * Pre‑multiply by rotation using **cos/sin**: `this = R(c,s) × this` (no allocation).
  *
  * @param cosAngle - Cosine.
  * @param sinAngle - Sine.
  * @returns This matrix after pre‑composition.
  */
 public preRotateCS(cosAngle: number, sinAngle: number): this {
  const c = cosAngle,
   s = sinAngle;

  const r00 = this.m00,
   r01 = this.m01,
   r02 = this.m02;

  const r10 = this.m10,
   r11 = this.m11,
   r12 = this.m12;

  this.m00 = c * r00 - s * r10;
  this.m01 = c * r01 - s * r11;
  this.m02 = c * r02 - s * r12;
  this.m10 = s * r00 + c * r10;
  this.m11 = s * r01 + c * r11;
  this.m12 = s * r02 + c * r12;

  return this;
 }

 /**
  * Pre‑multiply by scaling: `this = S(sx,sy) × this` (no allocation).
  *
  * @param sx - Scale X.
  * @param sy - Scale Y.
  * @returns This matrix after pre‑composition.
  */
 public preScale(sx: number, sy: number): this {
  this.m00 *= sx;
  this.m01 *= sx;
  this.m02 *= sx;
  this.m10 *= sy;
  this.m11 *= sy;
  this.m12 *= sy;

  return this;
 }

 /**
  * Pre‑multiply by shear: `this = H(sx,sy) × this` (no allocation).
  *
  * @param shearX - Horizontal shear.
  * @param shearY - Vertical shear.
  * @returns This matrix after pre‑composition.
  */
 public preShear(shearX: number, shearY: number): this {
  // H = [1 sx 0; sy 1 0; 0 0 1]
  const r00 = this.m00,
   r01 = this.m01,
   r02 = this.m02;

  const r10 = this.m10,
   r11 = this.m11,
   r12 = this.m12;

  this.m00 = r00 + shearX * r10;
  this.m01 = r01 + shearX * r11;
  this.m02 = r02 + shearX * r12;
  this.m10 = shearY * r00 + r10;
  this.m11 = shearY * r01 + r11;
  this.m12 = shearY * r02 + r12;

  // row2 unchanged
  return this;
 }

 // ------------------------------------------------------------------------
 // Instance: Direction & points (2‑D)
 // ------------------------------------------------------------------------

 /**
  * Transform a direction vector by this matrix (ignoring translation).
  *
  * @param v - Direction vector.
  * @returns A **new** transformed {@link Vector2}.
  */
 public transformDirection(v: ReadonlyVector2): Vector2 {
  return Mat3.transformDirection(this, v);
 }

 /**
  * Transform a direction vector into `outVector` (alloc‑free).
  *
  * @param v - Direction vector.
  * @param outVector - Destination vector.
  * @returns `outVector` after transformation.
  */
 public transformDirectionInto(v: ReadonlyVector2, outVector: Vector2): Vector2 {
  return Mat3.transformDirection(this, v, outVector);
 }

 /**
  * Transform a point by this matrix (affine).
  *
  * @param p - Point.
  * @returns A **new** transformed {@link Vector2}.
  */
 public transformPoint(p: ReadonlyVector2): Vector2 {
  return Mat3.transformPoint(this, p);
 }

 /**
  * Transform a point into `outVector` (alloc‑free).
  *
  * @param p - Point.
  * @param outVector - Destination vector.
  * @returns `outVector` after transformation.
  */
 public transformPointInto(p: ReadonlyVector2, outVector: Vector2): Vector2 {
  return Mat3.transformPoint(this, p, outVector);
 }

 /**
  * Transform a point projectively (divides by `w` if needed).
  *
  * @param p - Point.
  * @returns A **new** transformed {@link Vector2}; `(0,0)` if `|w'| ≤ LINEAR_EPSILON`.
  */
 public transformPointProjective(p: ReadonlyVector2): Vector2 {
  return Mat3.transformPointProjective(this, p);
 }

 /**
  * Transform a point projectively into `outVector` (alloc‑free).
  *
  * @param p - Input point.
  * @param outVector - Destination vector.
  * @returns `outVector` with the result (or `(0,0)` if `|w'| ≤ LINEAR_EPSILON`).
  */
 public transformPointProjectiveInto(p: ReadonlyVector2, outVector: Vector2): Vector2 {
  return Mat3.transformPointProjective(this, p, outVector);
 }

 // ------------------------------------------------------------------------
 // Instance: Comparison, validation & orientation
 // ------------------------------------------------------------------------

 /**
  * Component‑wise equality with another matrix.
  *
  * @param other - Matrix to compare.
  * @returns `true` if all components are identical.
  */
 public equals(other: ReadonlyMat3): boolean {
  return Mat3.equals(this, other);
 }

 /**
  * Approximate equality within tolerance.
  *
  * @param other - Matrix to compare.
  * @param epsilon - Non‑negative tolerance (default = {@link LINEAR_EPSILON}).
  * @returns `true` if `this ≈ other` within `epsilon`.
  */
 public nearEquals(other: ReadonlyMat3, epsilon: number = LINEAR_EPSILON): boolean {
  validateTolerance(epsilon, 'Mat3.nearEquals');
  return Mat3.nearEquals(this, other, epsilon);
 }

 /**
  * Test if this matrix is approximately the identity.
  *
  * @param epsilon - Tolerance (default = {@link LINEAR_EPSILON}).
  * @returns `true` if `this ≈ I`.
  */
 public isIdentity(epsilon: number = LINEAR_EPSILON): boolean {
  return Mat3.isIdentity(this, epsilon);
 }

 /**
  * Test if last row is `[0,0,1]` within tolerance (affine).
  *
  * @param epsilon - Tolerance (default = {@link LINEAR_EPSILON}).
  * @returns `true` if affine.
  */
 public isAffine(epsilon: number = LINEAR_EPSILON): boolean {
  return Mat3.isAffine(this, epsilon);
 }

 /**
  * Test if this is a rigid transform (proper rotation + translation).
  *
  * @param epsilon - Tolerance (default = {@link LINEAR_EPSILON}).
  * @returns `true` if rigid (det 2×2 ≈ +1).
  */
 public isRigid(epsilon: number = LINEAR_EPSILON): boolean {
  return Mat3.isRigid(this, epsilon);
 }

 /**
  * Test if all components are finite.
  *
  * @returns `true` if finite.
  */
 public isFinite(): boolean {
  return Mat3.isFinite(this);
 }

 /**
  * Test if this matrix is singular within tolerance.
  *
  * @param epsilon - Tolerance (default = {@link LINEAR_EPSILON}).
  * @returns `true` if `|det(this)| ≤ epsilon`.
  */
 public isSingular(epsilon: number = LINEAR_EPSILON): boolean {
  return Mat3.isSingular(this, epsilon);
 }

 /**
  * Extract the rotation angle (radians) from the 2×2 basis.
  *
  * @returns Angle (radians).
  */
 public angle2D(): number {
  return Mat3.angle2D(this);
 }

 /**
  * Extract translation `(m02, m12)` into a new vector.
  *
  * @param outVector - Destination vector (default new).
  * @returns `outVector` with translation.
  */
 public getTranslation(outVector: Vector2 = new Vector2()): Vector2 {
  return Mat3.getTranslation(this, outVector);
 }

 /**
  * Returns `true` if the upper‑left 2×2 contains a reflection (orientation flip).
  *
  * @returns `true` if `det(2×2) < 0`.
  */
 public hasReflection2D(): boolean {
  return Mat3.hasReflection2D(this);
 }

 /**
  * Decompose this **affine** matrix into TRS and shear.
  * Propagates reflection into `scale.y` when det(2×2) < 0.
  *
  * @returns An object `{ translation, rotation, scale, shear }`.
  */
 public decomposeAffine(): {
  translation: Vector2;
  rotation: number;
  scale: Vector2;
  shear: number;
 } {
  return Mat3.decomposeAffine(this);
 }

 // ------------------------------------------------------------------------
 // Instance: Mat2 interop helpers (no hard dependency)
 // ------------------------------------------------------------------------

 /**
  * Write this matrix's upper‑left 2×2 block into a {@link Mat2Like}.
  *
  * @param out - Object with `m00,m01,m10,m11` fields to receive the block.
  * @returns The same `out` reference after writing.
  */
 public extract2x2<T extends Mat2Like>(out: T): T {
  out.m00 = this.m00;
  out.m01 = this.m01;
  out.m10 = this.m10;
  out.m11 = this.m11;

  return out;
 }

 // ------------------------------------------------------------------------
 // Instance: Conversion & representation
 // ------------------------------------------------------------------------

 /**
  * Return a plain object for JSON serialization.
  *
  * @returns An object `{ m00..m22 }`.
  */
 public toJSON(): Mat3Like {
  return {
   m00: this.m00,
   m01: this.m01,
   m02: this.m02,
   m10: this.m10,
   m11: this.m11,
   m12: this.m12,
   m20: this.m20,
   m21: this.m21,
   m22: this.m22,
  };
 }

 /**
  * Alias for {@link Mat3.toJSON}, for explicit “get me a plain object” semantics.
  *
  * @returns An object `{ m00..m22 }`.
  */
 public toObject(): Mat3Like {
  return this.toJSON();
 }

 /**
  * Write this matrix into an array (row‑major).
  *
  * @param outArray - Destination array (defaults to a new `number[]`). You may pass a `Float32Array` or any `ArrayLike<number>`.
  * @param offset - Index at which to write (default `0`).
  * @returns The same `outArray` reference.
  */
 public toArray<T extends number[] | Float32Array>(
  outArray: T = [] as unknown as T,
  offset = 0,
 ): T {
  (outArray as any)[offset + 0] = this.m00;
  (outArray as any)[offset + 1] = this.m01;
  (outArray as any)[offset + 2] = this.m02;
  (outArray as any)[offset + 3] = this.m10;
  (outArray as any)[offset + 4] = this.m11;
  (outArray as any)[offset + 5] = this.m12;
  (outArray as any)[offset + 6] = this.m20;
  (outArray as any)[offset + 7] = this.m21;
  (outArray as any)[offset + 8] = this.m22;

  return outArray;
 }

 /**
  * Enable array destructuring: `[...m] → [m00, m01, m02, m10, m11, m12, m20, m21, m22]`.
  *
  * @returns An iterator over the 9 components in row‑major order.
  */
 public *[Symbol.iterator](): IterableIterator<number> {
  yield this.m00;
  yield this.m01;
  yield this.m02;
  yield this.m10;
  yield this.m11;
  yield this.m12;
  yield this.m20;
  yield this.m21;
  yield this.m22;
 }

 /**
  * Return a string representation `"m00,m01,m02,m10,m11,m12,m20,m21,m22"`.
  *
  * @param precision - Optional number of decimal places.
  * @returns The formatted string.
  */
 public toString(precision?: number): string {
  if (precision != null) {
   return (
    `${this.m00.toFixed(precision)},${this.m01.toFixed(precision)},${this.m02.toFixed(precision)},` +
    `${this.m10.toFixed(precision)},${this.m11.toFixed(precision)},${this.m12.toFixed(precision)},` +
    `${this.m20.toFixed(precision)},${this.m21.toFixed(precision)},${this.m22.toFixed(precision)}`
   );
  }

  return `${this.m00},${this.m01},${this.m02},${this.m10},${this.m11},${this.m12},${this.m20},${this.m21},${this.m22}`;
 }
}
