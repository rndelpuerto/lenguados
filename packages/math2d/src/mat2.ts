/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-dupe-class-members */
/**
 * @file src/mat2.ts
 * @module math2d/mat2
 * @description 2×2 matrix implementation for the Lenguado 2‑D physics‑engine family.
 *
 * @remarks
 * - Storage is **row‑major** using the fields: `m00, m01, m10, m11`.
 * - Vectors are treated as **column vectors** when applying transforms: `v' = M · v`.
 * - Instance methods are **mutable** and chainable for ergonomics.
 * - Static helpers are **pure** and offer optional `out` parameters for **alloc‑free** workflows.
 * - Avoids logs in hot‑paths; offers “safe” and “tolerant” variants for numerical robustness.
 */

import { EPSILON, TAU } from './scalar';
import { Vector2, ReadonlyVector2 } from './vector2';

/**
 * Minimal structural type for a 2×2 matrix in row‑major form.
 * Use this to interoperate with plain objects when needed.
 */
export interface Mat2Like {
 /** Row 0, Col 0. */
 m00: number;
 /** Row 0, Col 1. */
 m01: number;
 /** Row 1, Col 0. */
 m10: number;
 /** Row 1, Col 1. */
 m11: number;
}

/** Readonly view of {@link Mat2}. */
export type ReadonlyMat2 = Readonly<Mat2>;

// --------------------------------------------------------------------------
// Helpers
// --------------------------------------------------------------------------

/**
 * Permanently freezes a {@link Mat2} instance so it can no longer be mutated.
 *
 * @param matrix - The {@link Mat2} object to freeze.
 * @returns The *same* instance, now typed as {@link ReadonlyMat2},
 *          after being frozen with {@link Object.freeze}.
 *
 * @remarks
 * - The returned object keeps its original reference; no new memory is allocated.
 * - In *strict mode* any subsequent attempt to modify fields throws a `TypeError`.
 *   In non‑strict mode the write is silently ignored.
 * - Use this helper to create **truly immutable static constants** such as
 *   {@link Mat2.IDENTITY_MATRIX}, ensuring they cannot be altered at runtime.
 *
 * @example
 * ```ts
 * const I = freezeMat2(new Mat2()); // identity by default
 * // Will throw in strict mode:
 * I.m00 = 2;
 * ```
 */
export function freezeMat2(matrix: Mat2): ReadonlyMat2 {
 return Object.freeze(matrix);
}

/**
 * **Type guard** for a plain object that *looks* like a 2×2 matrix.
 *
 * @param subject - Unknown value.
 * @returns `true` if *subject* exposes numeric `m00, m01, m10, m11` members.
 *
 * @example
 * ```ts
 * const maybe: unknown = { m00: 1, m01: 0, m10: 0, m11: 1 };
 * if (isMat2Like(maybe)) {
 *   // safely use maybe.m00, maybe.m11 ...
 * }
 * ```
 */
export function isMat2Like(subject: unknown): subject is Readonly<Mat2Like> {
 return (
  typeof subject === 'object' &&
  subject !== null &&
  typeof (subject as { m00?: unknown }).m00 === 'number' &&
  typeof (subject as { m01?: unknown }).m01 === 'number' &&
  typeof (subject as { m10?: unknown }).m10 === 'number' &&
  typeof (subject as { m11?: unknown }).m11 === 'number'
 );
}

// --------------------------------------------------------------------------
// Mat2 class
// --------------------------------------------------------------------------

/**
 * 2×2 matrix class with mutable, chainable instance methods and pure static helpers.
 *
 * @remarks
 * - Stored in **row‑major** order fields: `m00, m01, m10, m11`.
 * - Vectors are treated as **column vectors** when applying transforms: `v' = M · v`.
 * - Default constructor builds the **identity** matrix.
 * - Computational methods avoid allocations unless they explicitly return new objects.
 */
export class Mat2 {
 // ------------------------------------------------------------------------
 // Static: Constants (immutable)
 // ------------------------------------------------------------------------

 /** Identity matrix. */
 public static readonly IDENTITY_MATRIX = freezeMat2(new Mat2(1, 0, 0, 1));

 /** All‑zero matrix. */
 public static readonly ZERO_MATRIX = freezeMat2(new Mat2(0, 0, 0, 0));

 /** 90° counter‑clockwise rotation matrix. */
 public static readonly ROT90_CCW_MATRIX = freezeMat2(Mat2.fromRotation(Math.PI / 2));

 /** 90° clockwise rotation matrix. */
 public static readonly ROT90_CW_MATRIX = freezeMat2(Mat2.fromRotation(-Math.PI / 2));

 /** 180° rotation matrix. */
 public static readonly ROT180_MATRIX = freezeMat2(Mat2.fromRotation(Math.PI));

 // ------------------------------------------------------------------------
 // Static: Factories
 // ------------------------------------------------------------------------

 /**
  * Clone a matrix.
  *
  * @param source - Matrix to clone.
  * @returns A new {@link Mat2} with identical components.
  */
 public static clone(source: ReadonlyMat2): Mat2 {
  return new Mat2(source.m00, source.m01, source.m10, source.m11);
 }

 /**
  * Copy components from one matrix into another (alloc‑free).
  *
  * @param source - The matrix to copy from.
  * @param destination - The matrix to copy into.
  * @returns `destination`, now matching `source`.
  */
 public static copy(source: ReadonlyMat2, destination: Mat2): Mat2 {
  return destination.set(source.m00, source.m01, source.m10, source.m11);
 }

 /**
  * Create a matrix from explicit components (row‑major).
  *
  * @param m00 - Row 0, Col 0.
  * @param m01 - Row 0, Col 1.
  * @param m10 - Row 1, Col 0.
  * @param m11 - Row 1, Col 1.
  * @returns A new {@link Mat2}.
  */
 public static fromValues(m00: number, m01: number, m10: number, m11: number): Mat2 {
  return new Mat2(m00, m01, m10, m11);
 }

 /**
  * Create a matrix from two **row** vectors.
  *
  * @overload
  * @param row0 - First row `[m00, m01]`.
  * @param row1 - Second row `[m10, m11]`.
  * @returns A new {@link Mat2}.
  */
 public static fromRows(row0: ReadonlyVector2, row1: ReadonlyVector2): Mat2;
 /**
  * Alloc‑free overload.
  *
  * @overload
  * @param row0 - First row.
  * @param row1 - Second row.
  * @param outMatrix - Destination matrix.
  * @returns `outMatrix`.
  */
 public static fromRows(row0: ReadonlyVector2, row1: ReadonlyVector2, outMatrix: Mat2): Mat2;
 public static fromRows(
  row0: ReadonlyVector2,
  row1: ReadonlyVector2,
  outMatrix: Mat2 = new Mat2(),
 ): Mat2 {
  return outMatrix.set(row0.x, row0.y, row1.x, row1.y);
 }

 /**
  * Create a matrix from two **column** vectors.
  *
  * @overload
  * @param col0 - First column.
  * @param col1 - Second column.
  * @returns A new {@link Mat2}.
  */
 public static fromColumns(col0: ReadonlyVector2, col1: ReadonlyVector2): Mat2;
 /**
  * Alloc‑free overload.
  *
  * @overload
  * @param col0 - First column.
  * @param col1 - Second column.
  * @param outMatrix - Destination matrix.
  * @returns `outMatrix`.
  */
 public static fromColumns(col0: ReadonlyVector2, col1: ReadonlyVector2, outMatrix: Mat2): Mat2;
 public static fromColumns(
  col0: ReadonlyVector2,
  col1: ReadonlyVector2,
  outMatrix: Mat2 = new Mat2(),
 ): Mat2 {
  // Columns: [m00 m01; m10 m11] = [col0.x col1.x; col0.y col1.y]
  return outMatrix.set(col0.x, col1.x, col0.y, col1.y);
 }

 /**
  * Create a **pure rotation** matrix from an angle in radians.
  *
  * @overload
  * @param angle - Rotation angle in radians.
  * @returns A new rotation {@link Mat2}.
  */
 public static fromRotation(angle: number): Mat2;
 /**
  * Alloc‑free overload.
  *
  * @overload
  * @param angle - Rotation angle in radians.
  * @param outMatrix - Destination matrix.
  * @returns `outMatrix`.
  */
 public static fromRotation(angle: number, outMatrix: Mat2): Mat2;
 public static fromRotation(angle: number, outMatrix: Mat2 = new Mat2()): Mat2 {
  const c = Math.cos(angle);
  const s = Math.sin(angle);

  return outMatrix.set(c, -s, s, c);
 }

 /**
  * Create a rotation matrix from **precomputed** cosine and sine.
  * Useful when applying the same rotation to multiple matrices/vectors.
  *
  * @param cosAngle - Cosine of the angle.
  * @param sinAngle - Sine of the angle.
  * @param outMatrix - Destination matrix (default new).
  * @returns `outMatrix` containing the rotation.
  */
 public static fromRotationCS(
  cosAngle: number,
  sinAngle: number,
  outMatrix: Mat2 = new Mat2(),
 ): Mat2 {
  return outMatrix.set(cosAngle, -sinAngle, sinAngle, cosAngle);
 }

 /**
  * Create a **scaling** matrix.
  *
  * @overload
  * @param sx - X scale.
  * @param sy - Y scale.
  * @returns A new scaling {@link Mat2}.
  */
 public static fromScaling(sx: number, sy: number): Mat2;
 /**
  * Alloc‑free overload.
  *
  * @overload
  * @param sx - X scale.
  * @param sy - Y scale.
  * @param outMatrix - Destination matrix.
  * @returns `outMatrix`.
  */
 public static fromScaling(sx: number, sy: number, outMatrix: Mat2): Mat2;
 public static fromScaling(sx: number, sy: number, outMatrix: Mat2 = new Mat2()): Mat2 {
  return outMatrix.set(sx, 0, 0, sy);
 }

 /**
  * Create a **shear** matrix (x' = x + shx·y, y' = shy·x + y).
  *
  * @overload
  * @param shx - Horizontal shear (x with respect to y).
  * @param shy - Vertical shear (y with respect to x).
  * @returns A new shear {@link Mat2}.
  */
 public static fromShear(shx: number, shy: number): Mat2;
 /**
  * Alloc‑free overload.
  *
  * @overload
  * @param shx - Horizontal shear.
  * @param shy - Vertical shear.
  * @param outMatrix - Destination matrix.
  * @returns `outMatrix`.
  */
 public static fromShear(shx: number, shy: number, outMatrix: Mat2): Mat2;
 public static fromShear(shx: number, shy: number, outMatrix: Mat2 = new Mat2()): Mat2 {
  return outMatrix.set(1, shx, shy, 1);
 }

 /**
  * Create a matrix from a flat array in row‑major order.
  *
  * @overload
  * @param sourceArray - Numeric array containing at least 4 elements.
  * @param offset - Index of `m00` (default = 0).
  * @returns A new {@link Mat2}.
  * @throws {RangeError} If `offset` is out of range.
  */
 public static fromArray(sourceArray: ArrayLike<number>, offset?: number): Mat2;
 /**
  * Alloc‑free overload.
  *
  * @overload
  * @param sourceArray - Numeric array containing at least 4 elements.
  * @param offset - Index of `m00` (default = 0).
  * @param outMatrix - Destination matrix.
  * @returns `outMatrix`.
  * @throws {RangeError} If `offset` is out of range.
  */
 public static fromArray(sourceArray: ArrayLike<number>, offset: number, outMatrix: Mat2): Mat2;
 public static fromArray(
  sourceArray: ArrayLike<number>,
  offset = 0,
  outMatrix: Mat2 = new Mat2(),
 ): Mat2 {
  if (offset < 0 || offset + 3 >= sourceArray.length) {
   throw new RangeError(
    `Mat2.fromArray: invalid offset ${offset} for array length ${sourceArray.length}`,
   );
  }

  return outMatrix.set(
   sourceArray[offset]!,
   sourceArray[offset + 1]!,
   sourceArray[offset + 2]!,
   sourceArray[offset + 3]!,
  );
 }

 /**
  * Create or set a matrix from a plain object.
  *
  * @overload
  * @param object - Object containing numeric `m00, m01, m10, m11` properties.
  * @returns A new {@link Mat2}.
  * @throws {TypeError} If any property is not a number.
  */
 public static fromObject(object: Mat2Like): Mat2;
 /**
  * Alloc‑free overload.
  *
  * @overload
  * @param object - Object containing numeric `m00, m01, m10, m11` properties.
  * @param outMatrix - Destination matrix.
  * @returns `outMatrix`.
  * @throws {TypeError} If any property is not a number.
  */
 public static fromObject(object: Mat2Like, outMatrix: Mat2): Mat2;
 public static fromObject(object: Mat2Like, outMatrix: Mat2 = new Mat2()): Mat2 {
  const { m00, m01, m10, m11 } = object as unknown as Record<string, unknown>;

  if (
   typeof m00 !== 'number' ||
   typeof m01 !== 'number' ||
   typeof m10 !== 'number' ||
   typeof m11 !== 'number'
  ) {
   throw new TypeError('Mat2.fromObject: requires numeric m00, m01, m10, m11 properties');
  }

  return outMatrix.set(m00 as number, m01 as number, m10 as number, m11 as number);
 }

 /**
  * Parse a `"m00,m01,m10,m11"` string into a matrix.
  *
  * @overload
  * @param string_ - String like `"1,0,0,1"`.
  * @returns A new {@link Mat2}.
  * @throws {Error} If the string cannot be parsed.
  */
 public static parse(string_: string): Mat2;
 /**
  * Alloc‑free overload.
  *
  * @overload
  * @param string_ - String like `"1,0,0,1"`.
  * @param outMatrix - Destination matrix.
  * @returns `outMatrix`.
  * @throws {Error} If the string cannot be parsed.
  */
 public static parse(string_: string, outMatrix: Mat2): Mat2;
 public static parse(string_: string, outMatrix: Mat2 = new Mat2()): Mat2 {
  const parts = string_.split(',').map((s) => parseFloat(s.trim()));

  if (parts.length !== 4 || parts.some((n) => Number.isNaN(n))) {
   throw new Error(`Mat2.parse: cannot parse Mat2 from "${string_}"`);
  }

  return outMatrix.set(parts[0]!, parts[1]!, parts[2]!, parts[3]!);
 }

 /**
  * Generate a random **rotation** matrix.
  *
  * @overload
  * @returns A new rotation {@link Mat2} with a random heading.
  */
 public static randomRotation(): Mat2;
 /**
  * Alloc‑free overload.
  *
  * @overload
  * @param outMatrix - Destination matrix.
  * @returns `outMatrix`.
  */
 public static randomRotation(outMatrix: Mat2): Mat2;
 public static randomRotation(outMatrix: Mat2 = new Mat2()): Mat2 {
  return Mat2.fromRotation(Math.random() * TAU, outMatrix);
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
  * @returns A new {@link Mat2}.
  */
 public static add(a: ReadonlyMat2, b: ReadonlyMat2): Mat2;
 /**
  * Alloc‑free overload.
  *
  * @overload
  * @param a - First addend.
  * @param b - Second addend.
  * @param outMatrix - Destination matrix.
  * @returns `outMatrix`.
  */
 public static add(a: ReadonlyMat2, b: ReadonlyMat2, outMatrix: Mat2): Mat2;
 public static add(a: ReadonlyMat2, b: ReadonlyMat2, outMatrix: Mat2 = new Mat2()): Mat2 {
  return outMatrix.set(a.m00 + b.m00, a.m01 + b.m01, a.m10 + b.m10, a.m11 + b.m11);
 }

 /**
  * Matrix subtraction: `C = A − B`.
  *
  * @overload
  * @param a - Minuend.
  * @param b - Subtrahend.
  * @returns A new {@link Mat2}.
  */
 public static sub(a: ReadonlyMat2, b: ReadonlyMat2): Mat2;
 /**
  * Alloc‑free overload.
  *
  * @overload
  * @param a - Minuend.
  * @param b - Subtrahend.
  * @param outMatrix - Destination matrix.
  * @returns `outMatrix`.
  */
 public static sub(a: ReadonlyMat2, b: ReadonlyMat2, outMatrix: Mat2): Mat2;
 public static sub(a: ReadonlyMat2, b: ReadonlyMat2, outMatrix: Mat2 = new Mat2()): Mat2 {
  return outMatrix.set(a.m00 - b.m00, a.m01 - b.m01, a.m10 - b.m10, a.m11 - b.m11);
 }

 /**
  * **Hadamard (component‑wise)** product: `C = A ⊙ B`.
  *
  * @overload
  * @param a - First factor.
  * @param b - Second factor.
  * @returns A new {@link Mat2}.
  */
 public static multiplyComponents(a: ReadonlyMat2, b: ReadonlyMat2): Mat2;
 /**
  * Alloc‑free overload.
  *
  * @overload
  * @param a - First factor.
  * @param b - Second factor.
  * @param outMatrix - Destination matrix.
  * @returns `outMatrix`.
  */
 public static multiplyComponents(a: ReadonlyMat2, b: ReadonlyMat2, outMatrix: Mat2): Mat2;
 public static multiplyComponents(
  a: ReadonlyMat2,
  b: ReadonlyMat2,
  outMatrix: Mat2 = new Mat2(),
 ): Mat2 {
  return outMatrix.set(a.m00 * b.m00, a.m01 * b.m01, a.m10 * b.m10, a.m11 * b.m11);
 }

 /**
  * Matrix–matrix product: `C = A × B`.
  *
  * @overload
  * @param a - Left operand.
  * @param b - Right operand.
  * @returns A new {@link Mat2}.
  */
 public static multiply(a: ReadonlyMat2, b: ReadonlyMat2): Mat2;
 /**
  * Alloc‑free overload.
  *
  * @overload
  * @param a - Left operand.
  * @param b - Right operand.
  * @param outMatrix - Destination matrix.
  * @returns `outMatrix`.
  */
 public static multiply(a: ReadonlyMat2, b: ReadonlyMat2, outMatrix: Mat2): Mat2;
 public static multiply(a: ReadonlyMat2, b: ReadonlyMat2, outMatrix: Mat2 = new Mat2()): Mat2 {
  // Row-major product with column-vector semantics.
  const m00 = a.m00 * b.m00 + a.m01 * b.m10;
  const m01 = a.m00 * b.m01 + a.m01 * b.m11;
  const m10 = a.m10 * b.m00 + a.m11 * b.m10;
  const m11 = a.m10 * b.m01 + a.m11 * b.m11;

  return outMatrix.set(m00, m01, m10, m11);
 }

 /**
  * Multiply all components by a scalar.
  *
  * @overload
  * @param a - Source matrix.
  * @param scalar - Scale factor.
  * @returns A new scaled {@link Mat2}.
  */
 public static multiplyScalar(a: ReadonlyMat2, scalar: number): Mat2;
 /**
  * Alloc‑free overload.
  *
  * @overload
  * @param a - Source matrix.
  * @param scalar - Scale factor.
  * @param outMatrix - Destination matrix.
  * @returns `outMatrix`.
  */
 public static multiplyScalar(a: ReadonlyMat2, scalar: number, outMatrix: Mat2): Mat2;
 public static multiplyScalar(a: ReadonlyMat2, scalar: number, outMatrix: Mat2 = new Mat2()): Mat2 {
  return outMatrix.set(a.m00 * scalar, a.m01 * scalar, a.m10 * scalar, a.m11 * scalar);
 }

 /**
  * Transpose: `C = Aᵀ`.
  *
  * @overload
  * @param a - Source matrix.
  * @returns A new transposed {@link Mat2}.
  */
 public static transpose(a: ReadonlyMat2): Mat2;
 /**
  * Alloc‑free overload.
  *
  * @overload
  * @param a - Source matrix.
  * @param outMatrix - Destination matrix.
  * @returns `outMatrix`.
  */
 public static transpose(a: ReadonlyMat2, outMatrix: Mat2): Mat2;
 public static transpose(a: ReadonlyMat2, outMatrix: Mat2 = new Mat2()): Mat2 {
  return outMatrix.set(a.m00, a.m10, a.m01, a.m11);
 }

 /**
  * Adjugate (a.k.a. adjoint, classical adjoint).
  *
  * @overload
  * @param a - Source matrix.
  * @returns A new {@link Mat2} equal to `adj(A) = [[ m11, -m01 ], [ -m10, m00 ]]`.
  */
 public static adjugate(a: ReadonlyMat2): Mat2;
 /**
  * Alloc‑free overload.
  *
  * @overload
  * @param a - Source matrix.
  * @param outMatrix - Destination matrix.
  * @returns `outMatrix`.
  */
 public static adjugate(a: ReadonlyMat2, outMatrix: Mat2): Mat2;
 public static adjugate(a: ReadonlyMat2, outMatrix: Mat2 = new Mat2()): Mat2 {
  return outMatrix.set(a.m11, -a.m01, -a.m10, a.m00);
 }

 /**
  * Determinant of a 2×2 matrix.
  *
  * @param a - Matrix.
  * @returns `det(A) = m00·m11 − m01·m10`.
  */
 public static determinant(a: ReadonlyMat2): number {
  return a.m00 * a.m11 - a.m01 * a.m10;
 }

 /**
  * Trace of a 2×2 matrix.
  *
  * @param a - Matrix.
  * @returns `tr(A) = m00 + m11`.
  */
 public static trace(a: ReadonlyMat2): number {
  return a.m00 + a.m11;
 }

 /**
  * Inverse matrix `A⁻¹` (throws on singular).
  *
  * @overload
  * @param a - Matrix to invert.
  * @returns A new inverted {@link Mat2}.
  * @throws {RangeError} If the matrix is singular.
  */
 public static inverse(a: ReadonlyMat2): Mat2;
 /**
  * Alloc‑free overload.
  *
  * @overload
  * @param a - Matrix to invert.
  * @param outMatrix - Destination matrix.
  * @returns `outMatrix`.
  * @throws {RangeError} If the matrix is singular.
  */
 public static inverse(a: ReadonlyMat2, outMatrix: Mat2): Mat2;
 public static inverse(a: ReadonlyMat2, outMatrix: Mat2 = new Mat2()): Mat2 {
  const det = Mat2.determinant(a);

  if (det === 0) {
   throw new RangeError('Mat2.inverse: singular matrix');
  }

  const invDet = 1 / det;

  return outMatrix.set(a.m11 * invDet, -a.m01 * invDet, -a.m10 * invDet, a.m00 * invDet);
 }

 /**
  * Inverse matrix **without throwing**: returns the **zero** matrix
  * when `det(A) == 0` to avoid NaN propagation.
  *
  * @overload
  * @param a - Matrix to invert.
  * @returns A new {@link Mat2} with `A⁻¹` or the **zero** matrix if singular.
  */
 public static inverseSafe(a: ReadonlyMat2): Mat2;
 /**
  * Alloc‑free overload.
  *
  * @overload
  * @param a - Matrix to invert.
  * @param outMatrix - Destination matrix.
  * @returns `outMatrix`.
  */
 public static inverseSafe(a: ReadonlyMat2, outMatrix: Mat2): Mat2;
 public static inverseSafe(a: ReadonlyMat2, outMatrix: Mat2 = new Mat2()): Mat2 {
  const det = Mat2.determinant(a);

  if (det === 0) {
   return outMatrix.zero();
  }

  const invDet = 1 / det;

  return outMatrix.set(a.m11 * invDet, -a.m01 * invDet, -a.m10 * invDet, a.m00 * invDet);
 }

 /**
  * Inverse matrix with **tolerance**: throws if `|det(A)| ≤ epsilon`.
  *
  * @param a - Matrix to invert.
  * @param epsilon - Non‑negative tolerance (default = {@link EPSILON}).
  * @param outMatrix - Destination matrix (default new).
  * @returns `outMatrix` containing the inverse.
  * @throws {RangeError} If the matrix is singular or nearly singular.
  */
 public static inverseTol(
  a: ReadonlyMat2,
  epsilon: number = EPSILON,
  outMatrix: Mat2 = new Mat2(),
 ): Mat2 {
  const det = Mat2.determinant(a);

  if (Math.abs(det) <= epsilon) {
   throw new RangeError('Mat2.inverseTol: near-singular matrix');
  }

  const invDet = 1 / det;

  return outMatrix.set(a.m11 * invDet, -a.m01 * invDet, -a.m10 * invDet, a.m00 * invDet);
 }

 /**
  * Solve the linear system `A · x = b` (throws on singular).
  *
  * @param a - Coefficient matrix `A`.
  * @param b - Column vector `b`.
  * @returns Solution vector `x`.
  * @throws {RangeError} If `A` is singular.
  */
 public static solve(a: ReadonlyMat2, b: ReadonlyVector2): Vector2 {
  const det = Mat2.determinant(a);

  if (det === 0) {
   throw new RangeError('Mat2.solve: singular matrix');
  }

  const invDet = 1 / det;
  const x = (a.m11 * b.x - a.m01 * b.y) * invDet;
  const y = (-a.m10 * b.x + a.m00 * b.y) * invDet;

  return new Vector2(x, y);
 }

 /**
  * Solve `A · x = b` **without throwing**; returns `(0,0)` if singular.
  *
  * @param a - Coefficient matrix.
  * @param b - Column vector.
  * @param outVector - Destination vector (default new).
  * @returns `outVector` set to the solution or `(0,0)` if singular.
  */
 public static solveSafe(
  a: ReadonlyMat2,
  b: ReadonlyVector2,
  outVector: Vector2 = new Vector2(),
 ): Vector2 {
  const det = Mat2.determinant(a);

  if (det === 0) {
   return outVector.zero();
  }

  const invDet = 1 / det;

  return outVector.set((a.m11 * b.x - a.m01 * b.y) * invDet, (-a.m10 * b.x + a.m00 * b.y) * invDet);
 }

 /**
  * Solve `A · x = b` with **tolerance**; throws if `|det(A)| ≤ epsilon`.
  *
  * @param a - Coefficient matrix.
  * @param b - Column vector.
  * @param epsilon - Non‑negative tolerance (default = {@link EPSILON}).
  * @param outVector - Destination vector (default new).
  * @returns `outVector` set to the solution.
  * @throws {RangeError} If the system is singular or nearly singular.
  */
 public static solveTol(
  a: ReadonlyMat2,
  b: ReadonlyVector2,
  epsilon: number = EPSILON,
  outVector: Vector2 = new Vector2(),
 ): Vector2 {
  const det = Mat2.determinant(a);

  if (Math.abs(det) <= epsilon) {
   throw new RangeError('Mat2.solveTol: near-singular matrix');
  }

  const invDet = 1 / det;

  return outVector.set((a.m11 * b.x - a.m01 * b.y) * invDet, (-a.m10 * b.x + a.m00 * b.y) * invDet);
 }

 // ------------------------------------------------------------------------
 // Static: Vector transforms & outer product
 // ------------------------------------------------------------------------

 /**
  * Transform a vector: `v' = A · v`.
  *
  * @overload
  * @param a - Matrix.
  * @param v - Vector.
  * @returns A new transformed {@link Vector2}.
  */
 public static transformVector(a: ReadonlyMat2, v: ReadonlyVector2): Vector2;
 /**
  * Alloc‑free overload.
  *
  * @overload
  * @param a - Matrix.
  * @param v - Vector.
  * @param outVector - Destination vector.
  * @returns `outVector`.
  */
 public static transformVector(a: ReadonlyMat2, v: ReadonlyVector2, outVector: Vector2): Vector2;
 public static transformVector(
  a: ReadonlyMat2,
  v: ReadonlyVector2,
  outVector: Vector2 = new Vector2(),
 ): Vector2 {
  return outVector.set(a.m00 * v.x + a.m01 * v.y, a.m10 * v.x + a.m11 * v.y);
 }

 /**
  * Outer product of two vectors: `A = u · vᵀ`.
  *
  * @overload
  * @param u - Left vector.
  * @param v - Right vector.
  * @returns A new {@link Mat2}.
  */
 public static outerProduct(u: ReadonlyVector2, v: ReadonlyVector2): Mat2;
 /**
  * Alloc‑free overload.
  *
  * @overload
  * @param u - Left vector.
  * @param v - Right vector.
  * @param outMatrix - Destination matrix.
  * @returns `outMatrix`.
  */
 public static outerProduct(u: ReadonlyVector2, v: ReadonlyVector2, outMatrix: Mat2): Mat2;
 public static outerProduct(
  u: ReadonlyVector2,
  v: ReadonlyVector2,
  outMatrix: Mat2 = new Mat2(),
 ): Mat2 {
  // u vᵀ = [ u.x*v.x  u.x*v.y; u.y*v.x  u.y*v.y ]
  return outMatrix.set(u.x * v.x, u.x * v.y, u.y * v.x, u.y * v.y);
 }

 // ------------------------------------------------------------------------
 // Static: Comparison & validation
 // ------------------------------------------------------------------------

 /**
  * Strict component‑wise equality.
  *
  * @param a - First matrix.
  * @param b - Second matrix.
  * @returns `true` if all components are identical.
  */
 public static equals(a: ReadonlyMat2, b: ReadonlyMat2): boolean {
  return a.m00 === b.m00 && a.m01 === b.m01 && a.m10 === b.m10 && a.m11 === b.m11;
 }

 /**
  * Approximate component‑wise equality within tolerance.
  *
  * @param a - First matrix.
  * @param b - Second matrix.
  * @param epsilon - Non‑negative tolerance (default = {@link EPSILON}).
  * @returns `true` if `|aᵢⱼ − bᵢⱼ| ≤ epsilon` for all components.
  * @throws {RangeError} If `epsilon < 0`.
  */
 public static nearEquals(a: ReadonlyMat2, b: ReadonlyMat2, epsilon: number = EPSILON): boolean {
  if (epsilon < 0) {
   throw new RangeError('Mat2.nearEquals: epsilon must be non-negative');
  }

  return (
   Math.abs(a.m00 - b.m00) <= epsilon &&
   Math.abs(a.m01 - b.m01) <= epsilon &&
   Math.abs(a.m10 - b.m10) <= epsilon &&
   Math.abs(a.m11 - b.m11) <= epsilon
  );
 }

 /**
  * Test if all four components are finite numbers.
  *
  * @param a - Matrix.
  * @returns `true` if all entries are finite.
  */
 public static isFinite(a: ReadonlyMat2): boolean {
  return (
   Number.isFinite(a.m00) &&
   Number.isFinite(a.m01) &&
   Number.isFinite(a.m10) &&
   Number.isFinite(a.m11)
  );
 }

 /**
  * Test if a matrix is (approximately) the identity within tolerance.
  *
  * @param a - Matrix to test.
  * @param epsilon - Non‑negative tolerance (default = {@link EPSILON}).
  * @returns `true` if `a ≈ I`.
  */
 public static isIdentity(a: ReadonlyMat2, epsilon: number = EPSILON): boolean {
  return (
   Math.abs(a.m00 - 1) <= epsilon &&
   Math.abs(a.m11 - 1) <= epsilon &&
   Math.abs(a.m01) <= epsilon &&
   Math.abs(a.m10) <= epsilon
  );
 }

 /**
  * Test if a matrix represents an (approximate) **rotation**:
  * orthonormal columns/rows with determinant ≈ 1.
  *
  * @param a - Matrix to test.
  * @param epsilon - Non‑negative tolerance (default = {@link EPSILON}).
  * @returns `true` if `a` is a rotation matrix.
  */
 public static isRotation(a: ReadonlyMat2, epsilon: number = EPSILON): boolean {
  // Orthonormal columns check
  const c0x = a.m00,
   c0y = a.m10;

  const c1x = a.m01,
   c1y = a.m11;

  const dot01 = c0x * c1x + c0y * c1y;
  const length0 = Math.hypot(c0x, c0y);
  const length1 = Math.hypot(c1x, c1y);
  const det = Mat2.determinant(a);

  return (
   Math.abs(dot01) <= epsilon &&
   Math.abs(length0 - 1) <= epsilon &&
   Math.abs(length1 - 1) <= epsilon &&
   Math.abs(det - 1) <= epsilon
  );
 }

 /**
  * Test if `A` is singular (or nearly singular) with tolerance.
  *
  * @param a - Matrix to test.
  * @param epsilon - Non‑negative tolerance (default = {@link EPSILON}).
  * @returns `true` if `|det(A)| ≤ epsilon`.
  */
 public static isSingular(a: ReadonlyMat2, epsilon: number = EPSILON): boolean {
  return Math.abs(Mat2.determinant(a)) <= epsilon;
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
 public static frobeniusNorm(a: ReadonlyMat2): number {
  return Math.hypot(a.m00, a.m01, a.m10, a.m11);
 }

 /**
  * Compute a 32‑bit unsigned hash code from the matrix components
  * (rounded to 1e‑6 precision to reduce float noise).
  *
  * @param a - Matrix to hash.
  * @returns A 32‑bit unsigned integer hash.
  */
 public static hashCode(a: ReadonlyMat2): number {
  const x0 = (Math.round(a.m00 * 1e6) & 0xffff) >>> 0;
  const x1 = (Math.round(a.m01 * 1e6) & 0xffff) >>> 0;
  const x2 = (Math.round(a.m10 * 1e6) & 0xffff) >>> 0;
  const x3 = (Math.round(a.m11 * 1e6) & 0xffff) >>> 0;

  const a0 = ((x0 << 16) | x1) >>> 0;
  const a1 = ((x2 << 16) | x3) >>> 0;

  return (a0 ^ a1) >>> 0;
 }

 /**
  * Extract the (approximate) rotation angle `θ` from a rotation matrix.
  *
  * @param a - Matrix assumed to be a (near) rotation.
  * @returns Angle in radians such that `a ≈ R(θ)`.
  *
  * @remarks
  * For a pure rotation `R = [ c −s; s c ]`, the angle is `atan2(m10, m00)`.
  * For non‑pure transforms, this returns the angle of the transformed X basis.
  */
 public static angleOfRotation(a: ReadonlyMat2): number {
  return Math.atan2(a.m10, a.m00);
 }

 // ------------------------------------------------------------------------
 // Instance: Storage
 // ------------------------------------------------------------------------

 /** Row 0, Col 0. */
 public m00: number;
 /** Row 0, Col 1. */
 public m01: number;
 /** Row 1, Col 0. */
 public m10: number;
 /** Row 1, Col 1. */
 public m11: number;

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
  * @param m00 - Row 0, Col 0.
  * @param m01 - Row 0, Col 1.
  * @param m10 - Row 1, Col 0.
  * @param m11 - Row 1, Col 1.
  */
 constructor(m00: number, m01: number, m10: number, m11: number);

 /**
  * Construct from a four‑element array/tuple `[m00, m01, m10, m11]`.
  * @overload
  * @param array - `[m00, m01, m10, m11]`.
  */
 constructor(array: [number, number, number, number]);

 /**
  * Construct from a plain object `{ m00, m01, m10, m11 }`.
  * @overload
  * @param object - Plain object with numeric components.
  */
 constructor(object: Mat2Like);

 /**
  * Copy constructor.
  * @overload
  * @param matrix - Another {@link Mat2}.
  */
 constructor(matrix: Mat2);

 // ------------------------------------------------------------------------
 // Instance: Constructor
 // ------------------------------------------------------------------------

 /**
  * General constructor.
  *
  * @param a - Either numbers, tuple, plain object, another matrix, or undefined.
  * @param b - Second numeric parameter when using number overloads.
  * @param c - Third numeric parameter when using number overloads.
  * @param d - Fourth numeric parameter when using number overloads.
  * @throws {RangeError} If array/object form is invalid or non‑numeric.
  */
 constructor(
  a?: number | [number, number, number, number] | Mat2Like | Mat2,
  b?: number,
  c?: number,
  d?: number,
 ) {
  if (
   typeof a === 'number' &&
   typeof b === 'number' &&
   typeof c === 'number' &&
   typeof d === 'number'
  ) {
   // Four-number overload
   this.m00 = a;
   this.m01 = b;
   this.m10 = c;
   this.m11 = d;
  } else if (Array.isArray(a)) {
   // Array overload
   if (a.length < 4) {
    throw new RangeError('Mat2.constructor: array must have at least four elements');
   }

   this.m00 = a[0];
   this.m01 = a[1];
   this.m10 = a[2];
   this.m11 = a[3];
  } else if (a instanceof Mat2) {
   // Copy constructor
   this.m00 = a.m00;
   this.m01 = a.m01;
   this.m10 = a.m10;
   this.m11 = a.m11;
  } else if (a && typeof a === 'object' && 'm00' in a && 'm01' in a && 'm10' in a && 'm11' in a) {
   // Object-with-m00..m11 overload (validate numerics)
   const { m00, m01, m10, m11 } = a as Mat2Like;

   if (
    typeof m00 !== 'number' ||
    typeof m01 !== 'number' ||
    typeof m10 !== 'number' ||
    typeof m11 !== 'number'
   ) {
    throw new RangeError('Mat2.constructor: m00, m01, m10, m11 must be numbers');
   }

   this.m00 = m00;
   this.m01 = m01;
   this.m10 = m10;
   this.m11 = m11;
  } else if (a === undefined) {
   // No-arg overload → identity
   this.m00 = 1;
   this.m01 = 0;
   this.m10 = 0;
   this.m11 = 1;
  } else {
   throw new RangeError('Mat2.constructor: invalid constructor arguments for Mat2');
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
  * @param m10 - Row 1, Col 0.
  * @param m11 - Row 1, Col 1.
  * @returns This matrix for chaining.
  */
 public set(m00: number, m01: number, m10: number, m11: number): this {
  this.m00 = m00;
  this.m01 = m01;
  this.m10 = m10;
  this.m11 = m11;

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
  this.m10 = 0;
  this.m11 = 1;

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
  this.m10 = 0;
  this.m11 = 0;

  return this;
 }

 /**
  * Clone this matrix.
  *
  * @returns A new {@link Mat2} with the same components.
  */
 public clone(): Mat2 {
  return new Mat2(this.m00, this.m01, this.m10, this.m11);
 }

 /**
  * Copy from another matrix.
  *
  * @param other - Source matrix.
  * @returns This matrix for chaining.
  */
 public copy(other: ReadonlyMat2): this {
  return this.set(other.m00, other.m01, other.m10, other.m11);
 }

 // ------------------------------------------------------------------------
 // Instance: Row/column accessors
 // ------------------------------------------------------------------------

 /**
  * Get a **row** as a new {@link Vector2}.
  *
  * @param index - 0 or 1.
  * @returns The requested row as a new vector.
  * @throws {RangeError} If `index` is not 0 or 1.
  */
 public getRow(index: 0 | 1): Vector2 {
  if (index === 0) return new Vector2(this.m00, this.m01);
  if (index === 1) return new Vector2(this.m10, this.m11);

  throw new RangeError('Mat2.getRow: index must be 0 or 1');
 }

 /**
  * Set a **row** from a vector.
  *
  * @param index - 0 or 1.
  * @param row - Source row vector.
  * @returns This matrix for chaining.
  * @throws {RangeError} If `index` is not 0 or 1.
  */
 public setRow(index: 0 | 1, row: ReadonlyVector2): this {
  if (index === 0) {
   this.m00 = row.x;
   this.m01 = row.y;

   return this;
  }

  if (index === 1) {
   this.m10 = row.x;
   this.m11 = row.y;

   return this;
  }

  throw new RangeError('Mat2.setRow: index must be 0 or 1');
 }

 /**
  * Get a **column** as a new {@link Vector2}.
  *
  * @param index - 0 or 1.
  * @returns The requested column as a new vector.
  * @throws {RangeError} If `index` is not 0 or 1.
  */
 public getColumn(index: 0 | 1): Vector2 {
  if (index === 0) return new Vector2(this.m00, this.m10);
  if (index === 1) return new Vector2(this.m01, this.m11);

  throw new RangeError('Mat2.getColumn: index must be 0 or 1');
 }

 /**
  * Set a **column** from a vector.
  *
  * @param index - 0 or 1.
  * @param column - Source column vector.
  * @returns This matrix for chaining.
  * @throws {RangeError} If `index` is not 0 or 1.
  */
 public setColumn(index: 0 | 1, column: ReadonlyVector2): this {
  if (index === 0) {
   this.m00 = column.x;
   this.m10 = column.y;

   return this;
  }

  if (index === 1) {
   this.m01 = column.x;
   this.m11 = column.y;

   return this;
  }

  throw new RangeError('Mat2.setColumn: index must be 0 or 1');
 }

 // ------------------------------------------------------------------------
 // Instance: Numeric transforms (component‑wise)
 // ------------------------------------------------------------------------

 /**
  * Apply {@link Math.floor} to each component.
  *
  * @returns This matrix after flooring.
  */
 public floor(): this {
  this.m00 = Math.floor(this.m00);
  this.m01 = Math.floor(this.m01);
  this.m10 = Math.floor(this.m10);
  this.m11 = Math.floor(this.m11);

  return this;
 }

 /**
  * Apply {@link Math.ceil} to each component.
  *
  * @returns This matrix after ceiling.
  */
 public ceil(): this {
  this.m00 = Math.ceil(this.m00);
  this.m01 = Math.ceil(this.m01);
  this.m10 = Math.ceil(this.m10);
  this.m11 = Math.ceil(this.m11);

  return this;
 }

 /**
  * Apply {@link Math.round} to each component.
  *
  * @returns This matrix after rounding.
  */
 public round(): this {
  this.m00 = Math.round(this.m00);
  this.m01 = Math.round(this.m01);
  this.m10 = Math.round(this.m10);
  this.m11 = Math.round(this.m11);

  return this;
 }

 /**
  * Component‑wise absolute value.
  *
  * @returns This matrix after {@link Math.abs} per component.
  */
 public abs(): this {
  this.m00 = Math.abs(this.m00);
  this.m01 = Math.abs(this.m01);
  this.m10 = Math.abs(this.m10);
  this.m11 = Math.abs(this.m11);

  return this;
 }

 // ------------------------------------------------------------------------
 // Instance: Algebra (matrix–matrix / matrix–scalar)
 // ------------------------------------------------------------------------

 /**
  * Add another matrix component‑wise.
  *
  * @param other - The addend matrix.
  * @returns This matrix after addition.
  */
 public add(other: ReadonlyMat2): this {
  this.m00 += other.m00;
  this.m01 += other.m01;
  this.m10 += other.m10;
  this.m11 += other.m11;

  return this;
 }

 /**
  * Subtract another matrix component‑wise.
  *
  * @param other - The subtrahend matrix.
  * @returns This matrix after subtraction.
  */
 public sub(other: ReadonlyMat2): this {
  this.m00 -= other.m00;
  this.m01 -= other.m01;
  this.m10 -= other.m10;
  this.m11 -= other.m11;

  return this;
 }

 /**
  * Component‑wise (Hadamard) product with another matrix.
  *
  * @param other - The other matrix.
  * @returns This matrix after Hadamard multiplication.
  */
 public multiplyComponents(other: ReadonlyMat2): this {
  this.m00 *= other.m00;
  this.m01 *= other.m01;
  this.m10 *= other.m10;
  this.m11 *= other.m11;

  return this;
 }

 /**
  * Multiply this matrix by another on the **right**: `this = this × m`.
  *
  * @param m - Right operand.
  * @returns This matrix after multiplication.
  *
  * @remarks
  * Mirrors three.js semantics (`multiply` vs `premultiply`).
  */
 public multiply(m: ReadonlyMat2): this {
  const a00 = this.m00,
   a01 = this.m01,
   a10 = this.m10,
   a11 = this.m11;

  this.m00 = a00 * m.m00 + a01 * m.m10;
  this.m01 = a00 * m.m01 + a01 * m.m11;
  this.m10 = a10 * m.m00 + a11 * m.m10;
  this.m11 = a10 * m.m01 + a11 * m.m11;

  return this;
 }

 /**
  * Multiply this matrix by another on the **left**: `this = m × this`.
  *
  * @param m - Left operand.
  * @returns This matrix after pre‑multiplication.
  */
 public premultiply(m: ReadonlyMat2): this {
  const b00 = this.m00,
   b01 = this.m01,
   b10 = this.m10,
   b11 = this.m11;

  this.m00 = m.m00 * b00 + m.m01 * b10;
  this.m01 = m.m00 * b01 + m.m01 * b11;
  this.m10 = m.m10 * b00 + m.m11 * b10;
  this.m11 = m.m10 * b01 + m.m11 * b11;

  return this;
 }

 /**
  * Multiply all components by a scalar.
  *
  * @param scalar - Scale factor.
  * @returns This matrix for chaining.
  */
 public multiplyScalar(scalar: number): this {
  this.m00 *= scalar;
  this.m01 *= scalar;
  this.m10 *= scalar;
  this.m11 *= scalar;

  return this;
 }

 /**
  * Transpose this matrix in place.
  *
  * @returns This matrix after transposition.
  */
 public transpose(): this {
  const t = this.m01;

  this.m01 = this.m10;
  this.m10 = t;

  return this;
 }

 /**
  * Determinant.
  *
  * @returns `det(this)`.
  */
 public determinant(): number {
  return this.m00 * this.m11 - this.m01 * this.m10;
 }

 /**
  * Trace.
  *
  * @returns `tr(this) = m00 + m11`.
  */
 public trace(): number {
  return this.m00 + this.m11;
 }

 /**
  * Invert this matrix (throws on singular).
  *
  * @returns This matrix after inversion.
  * @throws {RangeError} If the matrix is singular.
  */
 public inverse(): this {
  const det = this.determinant();

  if (det === 0) throw new RangeError('Mat2.inverse: singular matrix');

  const m00 = this.m00,
   m01 = this.m01,
   m10 = this.m10,
   m11 = this.m11;

  const invDet = 1 / det;

  this.m00 = m11 * invDet;
  this.m01 = -m01 * invDet;
  this.m10 = -m10 * invDet;
  this.m11 = m00 * invDet;

  return this;
 }

 /**
  * Invert this matrix **without throwing**; becomes **zero** if singular.
  *
  * @returns This matrix after "safe" inversion (or zero).
  */
 public inverseSafe(): this {
  const det = this.determinant();

  if (det === 0) {
   return this.zero();
  }

  const m00 = this.m00,
   m01 = this.m01,
   m10 = this.m10,
   m11 = this.m11;

  const invDet = 1 / det;

  this.m00 = m11 * invDet;
  this.m01 = -m01 * invDet;
  this.m10 = -m10 * invDet;
  this.m11 = m00 * invDet;

  return this;
 }

 // ------------------------------------------------------------------------
 // Instance: Building & composing transforms
 // ------------------------------------------------------------------------

 /**
  * Set this matrix to a **pure rotation** by angle (radians).
  *
  * @param angle - Angle in radians.
  * @returns This matrix, now a rotation.
  */
 public setRotation(angle: number): this {
  const c = Math.cos(angle);
  const s = Math.sin(angle);

  return this.set(c, -s, s, c);
 }

 /**
  * Set this matrix to a rotation using **precomputed** cosine and sine.
  *
  * @param cosAngle - `cos(θ)`.
  * @param sinAngle - `sin(θ)`.
  * @returns This matrix for chaining.
  */
 public setRotationCS(cosAngle: number, sinAngle: number): this {
  return this.set(cosAngle, -sinAngle, sinAngle, cosAngle);
 }

 /**
  * Set this matrix to a **scaling** transform.
  *
  * @param sx - Scale X.
  * @param sy - Scale Y.
  * @returns This matrix for chaining.
  */
 public setScaling(sx: number, sy: number): this {
  return this.set(sx, 0, 0, sy);
 }

 /**
  * Set this matrix to a **shear** transform.
  *
  * @param shx - Horizontal shear.
  * @param shy - Vertical shear.
  * @returns This matrix for chaining.
  */
 public setShear(shx: number, shy: number): this {
  return this.set(1, shx, shy, 1);
 }

 /**
  * Post‑multiply by a rotation **in‑place**: `this = this × R(θ)`.
  *
  * @param angle - Angle in radians.
  * @returns This matrix after composition.
  */
 public rotate(angle: number): this {
  const rc = Math.cos(angle);
  const rs = Math.sin(angle);

  const a00 = this.m00,
   a01 = this.m01,
   a10 = this.m10,
   a11 = this.m11;

  this.m00 = a00 * rc + a01 * rs;
  this.m01 = -a00 * rs + a01 * rc;
  this.m10 = a10 * rc + a11 * rs;
  this.m11 = -a10 * rs + a11 * rc;

  return this;
 }

 /**
  * Post‑multiply by a rotation using **cos/sin**, **in‑place**: `this = this × R(c,s)`.
  *
  * @param cosAngle - `cos(θ)`.
  * @param sinAngle - `sin(θ)`.
  * @returns This matrix after composition.
  */
 public rotateCS(cosAngle: number, sinAngle: number): this {
  const a00 = this.m00,
   a01 = this.m01,
   a10 = this.m10,
   a11 = this.m11;

  this.m00 = a00 * cosAngle + a01 * sinAngle;
  this.m01 = -a00 * sinAngle + a01 * cosAngle;
  this.m10 = a10 * cosAngle + a11 * sinAngle;
  this.m11 = -a10 * sinAngle + a11 * cosAngle;

  return this;
 }

 /**
  * Post‑multiply by a scaling **in‑place**: `this = this × S(sx, sy)`.
  *
  * @param sx - Scale X.
  * @param sy - Scale Y.
  * @returns This matrix after composition.
  */
 public scale(sx: number, sy: number): this {
  this.m00 *= sx;
  this.m01 *= sy;
  this.m10 *= sx;
  this.m11 *= sy;

  return this;
 }

 /**
  * Post‑multiply by a shear **in‑place**: `this = this × H(shx, shy)`.
  *
  * @param shx - Horizontal shear.
  * @param shy - Vertical shear.
  * @returns This matrix after composition.
  */
 public shear(shx: number, shy: number): this {
  const a00 = this.m00,
   a01 = this.m01,
   a10 = this.m10,
   a11 = this.m11;

  // H = [1 shx; shy 1]
  this.m00 = a00 + a01 * shy;
  this.m01 = a00 * shx + a01;
  this.m10 = a10 + a11 * shy;
  this.m11 = a10 * shx + a11;

  return this;
 }

 // ------------------------------------------------------------------------
 // Instance: Vector transforms & stability helpers
 // ------------------------------------------------------------------------

 /**
  * Transform a vector: `v' = this · v`.
  *
  * @param v - Vector to transform.
  * @returns A **new** transformed vector.
  */
 public transformVector(v: ReadonlyVector2): Vector2 {
  return Mat2.transformVector(this, v);
 }

 /**
  * Transform a vector **alloc‑free**.
  *
  * @param v - Vector to transform.
  * @param outVector - Destination vector.
  * @returns `outVector`.
  */
 public transformVectorInto(v: ReadonlyVector2, outVector: Vector2): Vector2 {
  return Mat2.transformVector(this, v, outVector);
 }

 /**
  * Orthonormalize columns (Gram–Schmidt) to correct small numeric drift
  * towards the nearest rotation matrix.
  *
  * @returns This matrix after orthonormalization.
  *
  * @remarks
  * If the first column degenerates, resets to identity. If the second column
  * collapses during orthogonalization, it is rebuilt as the perpendicular.
  */
 public orthonormalize(): this {
  // Column 0
  let x0 = this.m00,
   y0 = this.m10;

  const length0 = Math.hypot(x0, y0);

  if (length0 === 0) {
   return this.identity();
  }

  x0 /= length0;
  y0 /= length0;

  // Column 1 orthogonal to col0
  let x1 = this.m01,
   y1 = this.m11;

  const dot = x0 * x1 + y0 * y1;

  x1 -= dot * x0;
  y1 -= dot * y0;

  const length1 = Math.hypot(x1, y1);

  if (length1 === 0) {
   // fallback: perpendicular to col0
   x1 = -y0;
   y1 = x0;
  } else {
   x1 /= length1;
   y1 /= length1;
  }

  this.m00 = x0;
  this.m10 = y0;
  this.m01 = x1;
  this.m11 = y1;

  return this;
 }

 // ------------------------------------------------------------------------
 // Instance: Comparison & validation
 // ------------------------------------------------------------------------

 /**
  * Strict component‑wise equality with another matrix.
  *
  * @param other - Matrix to compare.
  * @returns `true` if all components are equal.
  */
 public equals(other: ReadonlyMat2): boolean {
  return Mat2.equals(this, other);
 }

 /**
  * Approximate component‑wise equality within tolerance.
  *
  * @param other - Matrix to compare.
  * @param epsilon - Non‑negative tolerance (default = {@link EPSILON}).
  * @returns `true` if `|aᵢⱼ − bᵢⱼ| ≤ epsilon` for all components.
  */
 public nearEquals(other: ReadonlyMat2, epsilon: number = EPSILON): boolean {
  return Mat2.nearEquals(this, other, epsilon);
 }

 /**
  * Test if this matrix is the identity within tolerance.
  *
  * @param epsilon - Non‑negative tolerance (default = {@link EPSILON}).
  * @returns `true` if `this ≈ I`.
  */
 public isIdentity(epsilon: number = EPSILON): boolean {
  return Mat2.isIdentity(this, epsilon);
 }

 /**
  * Test if this matrix represents a rotation (orthonormal with det ≈ 1).
  *
  * @param epsilon - Non‑negative tolerance (default = {@link EPSILON}).
  * @returns `true` if `this` is a rotation.
  */
 public isRotation(epsilon: number = EPSILON): boolean {
  return Mat2.isRotation(this, epsilon);
 }

 /**
  * Test if all components are finite.
  *
  * @returns `true` if finite.
  */
 public isFinite(): boolean {
  return Mat2.isFinite(this);
 }

 /**
  * Test if this matrix is singular (or nearly singular) with tolerance.
  *
  * @param epsilon - Non‑negative tolerance (default = {@link EPSILON}).
  * @returns `true` if `|det(this)| ≤ epsilon`.
  */
 public isSingular(epsilon: number = EPSILON): boolean {
  return Mat2.isSingular(this, epsilon);
 }

 /**
  * Extract the (approximate) rotation angle `θ` from this matrix.
  *
  * @returns Angle in radians.
  */
 public angle(): number {
  return Mat2.angleOfRotation(this);
 }

 // ------------------------------------------------------------------------
 // Instance: Conversion & representation
 // ------------------------------------------------------------------------

 /**
  * Return a plain object for JSON serialization.
  *
  * @returns An object `{ m00, m01, m10, m11 }`.
  */
 public toJSON(): Mat2Like {
  return { m00: this.m00, m01: this.m01, m10: this.m10, m11: this.m11 };
 }

 /**
  * Alias for `toJSON()` to convey explicit "plain object" semantics.
  *
  * @returns An object `{ m00, m01, m10, m11 }`.
  */
 public toObject(): Mat2Like {
  return this.toJSON();
 }

 /**
  * Write this matrix into an array (row‑major).
  *
  * @param outArray - Destination array (defaults to a new `number[]`).
  *                   You may pass a `Float32Array` or any `ArrayLike<number>`.
  * @param offset - Index at which to write `m00..m11` (default `0`).
  * @returns The same `outArray` reference.
  *
  * @example
  * ```ts
  * const buf = new Float32Array(4);
  * m.toArray(buf); // writes [m00,m01,m10,m11]
  * ```
  */
 public toArray<T extends number[] | Float32Array>(
  outArray: T = [] as unknown as T,
  offset = 0,
 ): T {
  (outArray as any)[offset + 0] = this.m00;
  (outArray as any)[offset + 1] = this.m01;
  (outArray as any)[offset + 2] = this.m10;
  (outArray as any)[offset + 3] = this.m11;

  return outArray;
 }

 /**
  * Enable array destructuring: `[...m] → [m00, m01, m10, m11]`.
  *
  * @returns An iterator over the 4 components in row‑major order.
  */
 public *[Symbol.iterator](): IterableIterator<number> {
  yield this.m00;
  yield this.m01;
  yield this.m10;
  yield this.m11;
 }

 /**
  * Return a string representation `"m00,m01,m10,m11"`.
  *
  * @param precision - Optional number of decimal places.
  * @returns The formatted string.
  */
 public toString(precision?: number): string {
  if (precision != null) {
   return `${this.m00.toFixed(precision)},${this.m01.toFixed(precision)},${this.m10.toFixed(
    precision,
   )},${this.m11.toFixed(precision)}`;
  }

  return `${this.m00},${this.m01},${this.m10},${this.m11}`;
 }

 /**
  * Compute a 32‑bit unsigned hash from this matrix’s components.
  *
  * @returns A 32‑bit unsigned integer hash.
  */
 public hashCode(): number {
  return Mat2.hashCode(this);
 }
}
