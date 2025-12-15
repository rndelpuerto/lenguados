/**
 * @file core/matrix2.ts
 * @module @lenguados/math2d/core
 * @description Deterministic, allocation-aware 2×2 matrix implementation.
 */

import { sinCos } from '../auxiliary/angle/operations';
import { safeDivide, safeSqrt } from '../auxiliary/numeric/safety';
import {
 abs as scalarAbs,
 clamp,
 max as scalarMax,
 min as scalarMin,
 mod as scalarModule,
 saturate,
 sign as scalarSign,
} from '../auxiliary/scalar/arithmetic';
import {
 isNearZero,
 nearEquals as scalarNearEquals,
 relativeEquals,
} from '../auxiliary/scalar/comparison';
import { EPSILON } from '../auxiliary/scalar/constants';
import { lerp } from '../auxiliary/scalar/interpolation';
import { DeterministicMath } from '../deterministic/deterministic-math';
import type { Matrix2Like, ReadonlyMatrix2Like, ReadonlyVector2Like } from '../types';
import { assertFinite, assertSafeInteger } from '../validation/assert';

import type { ReadonlyRotation2 } from './rotation2';
import { Vector2, type ReadonlyVector2 } from './vector2';

/* ========================================================================== */
/* Type Exports                                                               */
/* ========================================================================== */

/**
 * Readonly view of a {@link Matrix2} instance.
 * @public
 */
export type ReadonlyMatrix2 = Readonly<Matrix2>;

/* ========================================================================== */
/* Helper Functions                                                           */
/* ========================================================================== */

/**
 * Permanently freezes a {@link Matrix2} instance so it can no longer be mutated.
 *
 * @param matrix - The Matrix2 object to freeze.
 * @returns The same instance, now typed as ReadonlyMatrix2.
 *
 * @remarks
 * - The returned object keeps its original reference; no new memory is allocated.
 * - In strict mode any subsequent attempt to modify components throws a TypeError.
 *
 * @example
 * ```typescript
 * const IDENTITY = freezeMatrix2(new Matrix2(1, 0, 0, 1));
 * IDENTITY.m00 = 5; // Throws in strict mode
 * ```
 *
 * @category Helpers
 * @since 0.9.0
 */
export function freezeMatrix2(matrix: Matrix2): ReadonlyMatrix2 {
 return Object.freeze(matrix);
}

/**
 * Re-export type guard for a plain object that looks like a 2x2 matrix.
 * @category Helpers
 * @since 0.9.0
 */
export { isMatrix2Like } from '../types';

/* ========================================================================== */
/* Class: Matrix2                                                             */
/* ========================================================================== */

/**
 * Column-major 2×2 matrix suitable for WebGL and physics calculations.
 *
 * @remarks
 * - Instance methods mutate `this` for fluent chaining.
 * - Static helpers are pure and provide optional `out` parameters to eliminate allocations.
 * - Trigonometric operations rely on {@link DeterministicMath}.
 */
export class Matrix2 implements Matrix2Like {
 /* ======================================================================== */
 /* Private Helpers                                                          */
 /* ======================================================================== */

 private static ensureOut(out?: Matrix2): Matrix2 {
  return out ?? new Matrix2();
 }

 private static sanitize(value: number, name: string): number {
  assertFinite(value, name);
  return value;
 }

 /* ======================================================================== */
 /* Static Constants (Immutable)                                             */
 /* ======================================================================== */

 /** Identity matrix (no transformation). */
 public static readonly IDENTITY = freezeMatrix2(new Matrix2(1, 0, 0, 1));

 /** Zero matrix. */
 public static readonly ZERO = freezeMatrix2(new Matrix2(0, 0, 0, 0));

 /** All-ones matrix. */
 public static readonly ONE = freezeMatrix2(new Matrix2(1, 1, 1, 1));

 /** Matrix with all elements set to EPSILON (useful for tolerance comparisons). */
 public static readonly EPSILON_MATRIX = freezeMatrix2(
  new Matrix2(EPSILON, EPSILON, EPSILON, EPSILON),
 );

 /** 90° counter-clockwise rotation. */
 public static readonly ROTATE_90 = freezeMatrix2(new Matrix2(0, 1, -1, 0));

 /** 180° rotation (same as FLIP_XY). */
 public static readonly ROTATE_180 = freezeMatrix2(new Matrix2(-1, 0, 0, -1));

 /** 270° counter-clockwise rotation (same as 90° clockwise). */
 public static readonly ROTATE_270 = freezeMatrix2(new Matrix2(0, -1, 1, 0));

 /** Flip horizontally (mirror across Y axis). */
 public static readonly FLIP_X = freezeMatrix2(new Matrix2(-1, 0, 0, 1));

 /** Flip vertically (mirror across X axis). */
 public static readonly FLIP_Y = freezeMatrix2(new Matrix2(1, 0, 0, -1));

 /** Flip both axes (same as ROTATE_180). */
 public static readonly FLIP_XY = freezeMatrix2(new Matrix2(-1, 0, 0, -1));

 /** Uniform scale by 2. */
 public static readonly SCALE_2 = freezeMatrix2(new Matrix2(2, 0, 0, 2));

 /** Uniform scale by 0.5. */
 public static readonly SCALE_HALF = freezeMatrix2(new Matrix2(0.5, 0, 0, 0.5));

 /* ======================================================================== */
 /* Static Factories                                                         */
 /* ======================================================================== */

 /**
  * Creates a matrix from explicit components.
  *
  * @param m00 - Component at row 0, column 0.
  * @param m01 - Component at row 1, column 0.
  * @param m10 - Component at row 0, column 1.
  * @param m11 - Component at row 1, column 1.
  * @param out - Optional output matrix.
  * @returns A Matrix2 with the specified components.
  *
  * @category Factory
  * @since 0.1.0
  */
 public static fromValues(
  m00: number,
  m01: number,
  m10: number,
  m11: number,
  out?: Matrix2,
 ): Matrix2 {
  return Matrix2.ensureOut(out).set(m00, m01, m10, m11);
 }

 /**
  * Creates a deep copy of a matrix.
  *
  * @param source - Matrix to clone.
  * @param out - Optional output matrix.
  * @returns A Matrix2 with identical components.
  *
  * @category Factory
  * @since 0.1.0
  */
 public static clone(source: ReadonlyMatrix2Like, out?: Matrix2): Matrix2 {
  return Matrix2.ensureOut(out).set(source.m00, source.m01, source.m10, source.m11);
 }

 /**
  * Copies component values from source into destination (alloc-free).
  *
  * @param source - Source matrix.
  * @param destination - Target matrix to receive the copy.
  * @returns The destination matrix.
  *
  * @category Factory
  * @since 0.9.0
  */
 public static copy(source: ReadonlyMatrix2Like, destination: Matrix2): Matrix2 {
  return destination.set(source.m00, source.m01, source.m10, source.m11);
 }

 /**
  * Creates a matrix from a plain object `{ m00, m01, m10, m11 }`.
  *
  * @param object - Plain object with matrix components.
  * @param out - Optional output matrix.
  * @returns A Matrix2 with the object's components.
  * @throws {Error} If any component is not finite.
  *
  * @category Factory
  * @since 0.9.0
  */
 public static fromObject(object: ReadonlyMatrix2Like, out?: Matrix2): Matrix2 {
  const m00 = this.sanitize(object.m00, 'Matrix2.fromObject:m00');
  const m01 = this.sanitize(object.m01, 'Matrix2.fromObject:m01');
  const m10 = this.sanitize(object.m10, 'Matrix2.fromObject:m10');
  const m11 = this.sanitize(object.m11, 'Matrix2.fromObject:m11');
  return Matrix2.ensureOut(out).set(m00, m01, m10, m11);
 }

 /**
  * Creates a matrix from a rotation.
  *
  * @param rotation - Rotation object or angle in radians.
  * @param out - Optional output matrix.
  * @returns Rotation matrix.
  *
  * @example
  * ```typescript
  * const mat = Matrix2.fromRotation(Math.PI / 3);
  * ```
  *
  * @category Factory
  * @since 0.1.0
  */
 public static fromRotation(rotation: ReadonlyRotation2 | number, out?: Matrix2): Matrix2 {
  if (typeof rotation === 'number') {
   const { cos, sin } = sinCos(rotation);
   return Matrix2.ensureOut(out).set(cos, sin, -sin, cos);
  }

  return Matrix2.ensureOut(out).set(rotation.cos, rotation.sin, -rotation.sin, rotation.cos);
 }

 /**
  * Creates a scaling matrix.
  *
  * @param scale - Scale factors as Vector2 or uniform scale.
  * @param out - Optional output matrix.
  * @returns Scale matrix.
  *
  * @example
  * ```typescript
  * const mat1 = Matrix2.fromScale(new Vector2(2, 3));
  * const mat2 = Matrix2.fromScale(2); // Uniform scale
  * ```
  *
  * @category Factory
  * @since 0.1.0
  */
 public static fromScale(scale: ReadonlyVector2Like | number, out?: Matrix2): Matrix2 {
  if (typeof scale === 'number') {
   return Matrix2.ensureOut(out).set(scale, 0, 0, scale);
  }

  return Matrix2.ensureOut(out).set(scale.x, 0, 0, scale.y);
 }

 /**
  * Creates a shearing matrix.
  *
  * @param shear - Shear factors as Vector2 (x=horizontal, y=vertical).
  * @param out - Optional output matrix.
  * @returns Shear matrix.
  *
  * @example
  * ```typescript
  * const mat = Matrix2.fromShear(new Vector2(0.5, 0));
  * ```
  *
  * @category Factory
  * @since 0.1.0
  */
 public static fromShear(shear: ReadonlyVector2Like, out?: Matrix2): Matrix2 {
  return Matrix2.ensureOut(out).set(1, shear.y, shear.x, 1);
 }

 /**
  * Creates a matrix from column vectors.
  *
  * @param col0 - First column.
  * @param col1 - Second column.
  * @param out - Optional output matrix.
  * @returns Matrix with specified columns.
  *
  * @category Factory
  * @since 0.1.0
  */
 public static fromColumns(
  col0: ReadonlyVector2Like,
  col1: ReadonlyVector2Like,
  out?: Matrix2,
 ): Matrix2 {
  return Matrix2.ensureOut(out).set(col0.x, col0.y, col1.x, col1.y);
 }

 /**
  * Creates a matrix from row vectors.
  *
  * @param row0 - First row.
  * @param row1 - Second row.
  * @param out - Optional output matrix.
  * @returns Matrix with specified rows.
  *
  * @category Factory
  * @since 0.1.0
  */
 public static fromRows(
  row0: ReadonlyVector2Like,
  row1: ReadonlyVector2Like,
  out?: Matrix2,
 ): Matrix2 {
  return Matrix2.ensureOut(out).set(row0.x, row1.x, row0.y, row1.y);
 }

 /**
  * Creates a matrix from an array.
  *
  * @param array - Array with matrix elements.
  * @param offset - Starting index. @defaultValue `0`
  * @param columnMajor - If true, array is column-major. @defaultValue `true`
  * @param out - Optional output matrix.
  * @returns Matrix with components from the array.
  * @throws {RangeError} If offset is out of bounds.
  *
  * @category Factory
  * @since 0.1.0
  */
 public static fromArray(
  array: ArrayLike<number>,
  offset = 0,
  columnMajor = true,
  out?: Matrix2,
 ): Matrix2 {
  if (offset < 0 || offset + 4 > array.length) {
   throw new RangeError(
    `Matrix2.fromArray: offset ${offset} is out of bounds for array of length ${array.length}`,
   );
  }

  const m00 = this.sanitize(array[offset]!, 'Matrix2.fromArray:m00');
  const m01 = this.sanitize(array[offset + 1]!, 'Matrix2.fromArray:m01');
  const m10 = this.sanitize(array[offset + 2]!, 'Matrix2.fromArray:m10');
  const m11 = this.sanitize(array[offset + 3]!, 'Matrix2.fromArray:m11');

  if (columnMajor) {
   return Matrix2.ensureOut(out).set(m00, m01, m10, m11);
  }

  return Matrix2.ensureOut(out).set(m00, m10, m01, m11);
 }

 /**
  * Creates a matrix from another matrix-like object.
  *
  * @param matrix - Source matrix.
  * @param out - Optional output matrix.
  * @returns Matrix with copied components.
  *
  * @category Factory
  * @since 0.1.0
  */
 public static fromMatrix(matrix: ReadonlyMatrix2Like, out?: Matrix2): Matrix2 {
  return Matrix2.ensureOut(out).set(matrix.m00, matrix.m01, matrix.m10, matrix.m11);
 }

 /* ======================================================================== */
 /* Static Arithmetic                                                        */
 /* ======================================================================== */

 /**
  * Component-wise addition of two matrices.
  *
  * @param a - First addend.
  * @param b - Second addend.
  * @param out - Optional output matrix.
  * @returns Matrix with components `(a.mXX + b.mXX)`.
  *
  * @category Arithmetic
  * @since 0.1.0
  */
 public static add(a: ReadonlyMatrix2Like, b: ReadonlyMatrix2Like, out?: Matrix2): Matrix2 {
  return Matrix2.ensureOut(out).set(a.m00 + b.m00, a.m01 + b.m01, a.m10 + b.m10, a.m11 + b.m11);
 }

 /**
  * Component-wise subtraction of two matrices.
  *
  * @param a - Minuend.
  * @param b - Subtrahend.
  * @param out - Optional output matrix.
  * @returns Matrix with components `(a.mXX - b.mXX)`.
  *
  * @category Arithmetic
  * @since 0.1.0
  */
 public static subtract(a: ReadonlyMatrix2Like, b: ReadonlyMatrix2Like, out?: Matrix2): Matrix2 {
  return Matrix2.ensureOut(out).set(a.m00 - b.m00, a.m01 - b.m01, a.m10 - b.m10, a.m11 - b.m11);
 }

 /**
  * Multiplies two matrices.
  *
  * @param a - First matrix.
  * @param b - Second matrix.
  * @param out - Optional output matrix.
  * @returns Product matrix a × b.
  *
  * @category Arithmetic
  * @since 0.1.0
  */
 public static multiply(a: ReadonlyMatrix2Like, b: ReadonlyMatrix2Like, out?: Matrix2): Matrix2 {
  return Matrix2.ensureOut(out).set(
   a.m00 * b.m00 + a.m10 * b.m01,
   a.m01 * b.m00 + a.m11 * b.m01,
   a.m00 * b.m10 + a.m10 * b.m11,
   a.m01 * b.m10 + a.m11 * b.m11,
  );
 }

 /**
  * Scales a matrix by a scalar.
  *
  * @param matrix - Matrix to scale.
  * @param scalar - Scale factor.
  * @param out - Optional output matrix.
  * @returns Scaled matrix.
  *
  * @category Arithmetic
  * @since 0.1.0
  */
 public static scale(matrix: ReadonlyMatrix2Like, scalar: number, out?: Matrix2): Matrix2 {
  return Matrix2.ensureOut(out).set(
   matrix.m00 * scalar,
   matrix.m01 * scalar,
   matrix.m10 * scalar,
   matrix.m11 * scalar,
  );
 }

 /**
  * Alias for {@link scale}. Multiplies all components by a scalar.
  *
  * @param matrix - Matrix to scale.
  * @param scalar - Scale factor.
  * @param out - Optional output matrix.
  * @returns Scaled matrix.
  *
  * @category Arithmetic
  * @since 0.1.0
  */
 public static multiplyScalar(matrix: ReadonlyMatrix2Like, scalar: number, out?: Matrix2): Matrix2 {
  return Matrix2.scale(matrix, scalar, out);
 }

 /**
  * Adds a scalar to all matrix components.
  *
  * @param matrix - Input matrix.
  * @param scalar - Scalar to add.
  * @param out - Optional output matrix.
  * @returns Matrix with scalar added to all components.
  *
  * @category Arithmetic
  * @since 0.9.0
  */
 public static addScalar(matrix: ReadonlyMatrix2Like, scalar: number, out?: Matrix2): Matrix2 {
  return Matrix2.ensureOut(out).set(
   matrix.m00 + scalar,
   matrix.m01 + scalar,
   matrix.m10 + scalar,
   matrix.m11 + scalar,
  );
 }

 /**
  * Subtracts a scalar from all matrix components.
  *
  * @param matrix - Input matrix.
  * @param scalar - Scalar to subtract.
  * @param out - Optional output matrix.
  * @returns Matrix with scalar subtracted from all components.
  *
  * @category Arithmetic
  * @since 0.9.0
  */
 public static subtractScalar(matrix: ReadonlyMatrix2Like, scalar: number, out?: Matrix2): Matrix2 {
  return Matrix2.ensureOut(out).set(
   matrix.m00 - scalar,
   matrix.m01 - scalar,
   matrix.m10 - scalar,
   matrix.m11 - scalar,
  );
 }

 /**
  * Fused multiply-add: `a * scale + b`.
  *
  * @param a - Matrix to scale.
  * @param scale - Scale factor.
  * @param b - Matrix to add.
  * @param out - Optional output matrix.
  * @returns Matrix equal to `a * scale + b`.
  *
  * @remarks
  * More efficient than separate scale and add operations.
  *
  * @category Arithmetic
  * @since 0.9.0
  */
 public static fma(
  a: ReadonlyMatrix2Like,
  scale: number,
  b: ReadonlyMatrix2Like,
  out?: Matrix2,
 ): Matrix2 {
  return Matrix2.ensureOut(out).set(
   a.m00 * scale + b.m00,
   a.m01 * scale + b.m01,
   a.m10 * scale + b.m10,
   a.m11 * scale + b.m11,
  );
 }

 /**
  * Divides all matrix components by a scalar.
  *
  * @param matrix - Input matrix.
  * @param scalar - Scalar divisor.
  * @param out - Optional output matrix.
  * @returns Matrix with all components divided by scalar.
  *
  * @remarks
  * Uses safe division; if |scalar| ≤ EPSILON, components become 0.
  *
  * @category Arithmetic
  * @since 0.9.0
  */
 public static divideScalar(matrix: ReadonlyMatrix2Like, scalar: number, out?: Matrix2): Matrix2 {
  const inv = safeDivide(1, scalar);
  return Matrix2.ensureOut(out).set(
   matrix.m00 * inv,
   matrix.m01 * inv,
   matrix.m10 * inv,
   matrix.m11 * inv,
  );
 }

 /**
  * Transposes a matrix (swaps rows and columns).
  *
  * @param matrix - Matrix to transpose.
  * @param out - Optional output matrix.
  * @returns Transposed matrix.
  *
  * @category Matrix Operations
  * @since 0.1.0
  */
 public static transpose(matrix: ReadonlyMatrix2Like, out?: Matrix2): Matrix2 {
  return Matrix2.ensureOut(out).set(matrix.m00, matrix.m10, matrix.m01, matrix.m11);
 }

 /**
  * Inverts a matrix.
  *
  * @param matrix - Matrix to invert.
  * @param out - Optional output matrix.
  * @returns Inverted matrix.
  * @throws {RangeError} If matrix is singular (determinant ≈ 0).
  *
  * @category Matrix Operations
  * @since 0.1.0
  */
 public static inverse(matrix: ReadonlyMatrix2Like, out?: Matrix2): Matrix2 {
  const det = matrix.m00 * matrix.m11 - matrix.m01 * matrix.m10;
  if (isNearZero(det)) {
   throw new RangeError('Matrix2.inverse: matrix is singular (determinant ≈ 0)');
  }

  const invDet = 1 / det;
  return Matrix2.ensureOut(out).set(
   matrix.m11 * invDet,
   -matrix.m01 * invDet,
   -matrix.m10 * invDet,
   matrix.m00 * invDet,
  );
 }

 /**
  * Safe inversion. Returns identity if matrix is singular.
  *
  * @param matrix - Matrix to invert.
  * @param out - Optional output matrix.
  * @returns Inverted matrix, or identity if singular.
  *
  * @example
  * ```typescript
  * const singular = new Matrix2(1, 1, 1, 1); // det = 0
  * const inv = Matrix2.inverseSafe(singular); // Returns IDENTITY
  * ```
  *
  * @category Matrix Operations
  * @since 0.9.0
  */
 public static inverseSafe(matrix: ReadonlyMatrix2Like, out?: Matrix2): Matrix2 {
  const det = matrix.m00 * matrix.m11 - matrix.m01 * matrix.m10;
  if (isNearZero(det)) {
   return Matrix2.ensureOut(out).set(1, 0, 0, 1); // Return identity
  }

  const invDet = 1 / det;
  return Matrix2.ensureOut(out).set(
   matrix.m11 * invDet,
   -matrix.m01 * invDet,
   -matrix.m10 * invDet,
   matrix.m00 * invDet,
  );
 }

 /**
  * Unchecked inversion for hot paths.
  *
  * ⚠️ **Precondition:** Matrix must be invertible (det ≠ 0).
  * Calling with a singular matrix produces NaN/Infinity components.
  *
  * @param matrix - Matrix to invert (must be non-singular).
  * @param out - Optional output matrix.
  * @returns Inverted matrix.
  *
  * @example
  * ```typescript
  * // Only use when you're certain the matrix is invertible
  * if (matrix.isInvertible()) {
  *   const inv = Matrix2.inverseUnchecked(matrix);
  * }
  * ```
  *
  * @category Matrix Operations
  * @since 0.9.0
  */
 public static inverseUnchecked(matrix: ReadonlyMatrix2Like, out?: Matrix2): Matrix2 {
  const invDet = 1 / (matrix.m00 * matrix.m11 - matrix.m01 * matrix.m10);
  return Matrix2.ensureOut(out).set(
   matrix.m11 * invDet,
   -matrix.m01 * invDet,
   -matrix.m10 * invDet,
   matrix.m00 * invDet,
  );
 }

 /**
  * Calculates the adjugate (adjoint) matrix.
  *
  * @param matrix - Matrix to calculate adjugate of.
  * @param out - Optional output matrix.
  * @returns Adjugate matrix.
  *
  * @remarks
  * The adjugate is the transpose of the cofactor matrix.
  * For a 2x2 matrix [a b; c d], the adjugate is [d -b; -c a].
  *
  * @category Matrix Operations
  * @since 0.1.0
  */
 public static adjugate(matrix: ReadonlyMatrix2Like, out?: Matrix2): Matrix2 {
  return Matrix2.ensureOut(out).set(matrix.m11, -matrix.m01, -matrix.m10, matrix.m00);
 }

 /**
  * Negates all elements of a matrix.
  *
  * @param matrix - Matrix to negate.
  * @param out - Optional output matrix.
  * @returns Negated matrix.
  *
  * @example
  * ```typescript
  * const m = new Matrix2(1, 2, 3, 4);
  * const neg = Matrix2.negate(m);
  * // neg = Matrix2(-1, -2, -3, -4)
  * ```
  *
  * @category Matrix Operations
  * @since 0.1.0
  */
 public static negate(matrix: ReadonlyMatrix2Like, out?: Matrix2): Matrix2 {
  return Matrix2.ensureOut(out).set(-matrix.m00, -matrix.m01, -matrix.m10, -matrix.m11);
 }

 /* ======================================================================== */
 /* Static Numeric Transforms                                                */
 /* ======================================================================== */

 /**
  * Applies Math.floor to all matrix elements.
  *
  * @param matrix - Input matrix.
  * @param out - Optional output matrix.
  * @returns Matrix with floored elements.
  *
  * @category Numeric Transform
  * @since 0.9.0
  */
 public static floor(matrix: ReadonlyMatrix2Like, out?: Matrix2): Matrix2 {
  return Matrix2.ensureOut(out).set(
   Math.floor(matrix.m00),
   Math.floor(matrix.m01),
   Math.floor(matrix.m10),
   Math.floor(matrix.m11),
  );
 }

 /**
  * Applies Math.ceil to all matrix elements.
  *
  * @param matrix - Input matrix.
  * @param out - Optional output matrix.
  * @returns Matrix with ceiled elements.
  *
  * @category Numeric Transform
  * @since 0.9.0
  */
 public static ceil(matrix: ReadonlyMatrix2Like, out?: Matrix2): Matrix2 {
  return Matrix2.ensureOut(out).set(
   Math.ceil(matrix.m00),
   Math.ceil(matrix.m01),
   Math.ceil(matrix.m10),
   Math.ceil(matrix.m11),
  );
 }

 /**
  * Applies Math.round to all matrix elements.
  *
  * @param matrix - Input matrix.
  * @param out - Optional output matrix.
  * @returns Matrix with rounded elements.
  *
  * @category Numeric Transform
  * @since 0.9.0
  */
 public static round(matrix: ReadonlyMatrix2Like, out?: Matrix2): Matrix2 {
  return Matrix2.ensureOut(out).set(
   Math.round(matrix.m00),
   Math.round(matrix.m01),
   Math.round(matrix.m10),
   Math.round(matrix.m11),
  );
 }

 /**
  * Applies absolute value to all matrix elements.
  *
  * @param matrix - Input matrix.
  * @param out - Optional output matrix.
  * @returns Matrix with absolute values.
  *
  * @category Numeric Transform
  * @since 0.9.0
  */
 public static abs(matrix: ReadonlyMatrix2Like, out?: Matrix2): Matrix2 {
  return Matrix2.ensureOut(out).set(
   scalarAbs(matrix.m00),
   scalarAbs(matrix.m01),
   scalarAbs(matrix.m10),
   scalarAbs(matrix.m11),
  );
 }

 /**
  * Applies sign function to all matrix elements.
  *
  * @param matrix - Input matrix.
  * @param out - Optional output matrix.
  * @returns Matrix with signs (-1, 0, or 1).
  *
  * @category Numeric Transform
  * @since 0.9.0
  */
 public static sign(matrix: ReadonlyMatrix2Like, out?: Matrix2): Matrix2 {
  return Matrix2.ensureOut(out).set(
   scalarSign(matrix.m00),
   scalarSign(matrix.m01),
   scalarSign(matrix.m10),
   scalarSign(matrix.m11),
  );
 }

 /**
  * Component-wise minimum of two matrices.
  *
  * @param a - First matrix.
  * @param b - Second matrix.
  * @param out - Optional output matrix.
  * @returns Matrix with per-component minima.
  *
  * @category Numeric Transform
  * @since 0.9.0
  */
 public static min(a: ReadonlyMatrix2Like, b: ReadonlyMatrix2Like, out?: Matrix2): Matrix2 {
  return Matrix2.ensureOut(out).set(
   scalarMin(a.m00, b.m00),
   scalarMin(a.m01, b.m01),
   scalarMin(a.m10, b.m10),
   scalarMin(a.m11, b.m11),
  );
 }

 /**
  * Component-wise maximum of two matrices.
  *
  * @param a - First matrix.
  * @param b - Second matrix.
  * @param out - Optional output matrix.
  * @returns Matrix with per-component maxima.
  *
  * @category Numeric Transform
  * @since 0.9.0
  */
 public static max(a: ReadonlyMatrix2Like, b: ReadonlyMatrix2Like, out?: Matrix2): Matrix2 {
  return Matrix2.ensureOut(out).set(
   scalarMax(a.m00, b.m00),
   scalarMax(a.m01, b.m01),
   scalarMax(a.m10, b.m10),
   scalarMax(a.m11, b.m11),
  );
 }

 /**
  * Clamps all matrix components between min and max matrices.
  *
  * @param matrix - Matrix to clamp.
  * @param minM - Per-component minima.
  * @param maxM - Per-component maxima.
  * @param out - Optional output matrix.
  * @returns Clamped matrix.
  *
  * @category Numeric Transform
  * @since 0.9.0
  */
 public static clamp(
  matrix: ReadonlyMatrix2Like,
  minM: ReadonlyMatrix2Like,
  maxM: ReadonlyMatrix2Like,
  out?: Matrix2,
 ): Matrix2 {
  return Matrix2.ensureOut(out).set(
   clamp(matrix.m00, minM.m00, maxM.m00),
   clamp(matrix.m01, minM.m01, maxM.m01),
   clamp(matrix.m10, minM.m10, maxM.m10),
   clamp(matrix.m11, minM.m11, maxM.m11),
  );
 }

 /**
  * Clamps all matrix components between scalar min and max.
  *
  * @param matrix - Matrix to clamp.
  * @param min - Minimum scalar.
  * @param max - Maximum scalar.
  * @param out - Optional output matrix.
  * @returns Clamped matrix.
  *
  * @category Numeric Transform
  * @since 0.9.0
  */
 public static clampScalar(
  matrix: ReadonlyMatrix2Like,
  min: number,
  max: number,
  out?: Matrix2,
 ): Matrix2 {
  return Matrix2.ensureOut(out).set(
   clamp(matrix.m00, min, max),
   clamp(matrix.m01, min, max),
   clamp(matrix.m10, min, max),
   clamp(matrix.m11, min, max),
  );
 }

 /* ======================================================================== */
 /* Static Interpolation                                                     */
 /* ======================================================================== */

 /**
  * Linear interpolation between two matrices with t clamped to [0, 1].
  *
  * @param a - Start matrix.
  * @param b - End matrix.
  * @param t - Interpolation factor [0, 1], clamped.
  * @param out - Optional output matrix.
  * @returns Interpolated matrix.
  *
  * @example
  * ```typescript
  * const a = Matrix2.IDENTITY;
  * const b = Matrix2.fromRotation(Math.PI / 2);
  * const mid = Matrix2.lerp(a, b, 0.5);
  * ```
  *
  * @category Interpolation
  * @since 0.1.0
  */
 public static lerp(
  a: ReadonlyMatrix2Like,
  b: ReadonlyMatrix2Like,
  t: number,
  out?: Matrix2,
 ): Matrix2 {
  return Matrix2.ensureOut(out).set(
   lerp(a.m00, b.m00, t),
   lerp(a.m01, b.m01, t),
   lerp(a.m10, b.m10, t),
   lerp(a.m11, b.m11, t),
  );
 }

 /**
  * Linear interpolation without clamping t.
  *
  * @param a - Start matrix.
  * @param b - End matrix.
  * @param t - Interpolation factor (not clamped).
  * @param out - Optional output matrix.
  * @returns Interpolated matrix.
  *
  * @category Interpolation
  * @since 0.9.0
  */
 public static lerpUnclamped(
  a: ReadonlyMatrix2Like,
  b: ReadonlyMatrix2Like,
  t: number,
  out?: Matrix2,
 ): Matrix2 {
  return Matrix2.ensureOut(out).set(
   lerp(a.m00, b.m00, t),
   lerp(a.m01, b.m01, t),
   lerp(a.m10, b.m10, t),
   lerp(a.m11, b.m11, t),
  );
 }

 /**
  * Clamped linear interpolation (alias for lerp).
  *
  * @param a - Start matrix.
  * @param b - End matrix.
  * @param t - Interpolation factor (clamped to [0, 1]).
  * @param out - Optional output matrix.
  * @returns Interpolated matrix.
  *
  * @remarks
  * This is an alias for `lerp` which already clamps t.
  * Provided for API symmetry with Vector2.
  *
  * @category Interpolation
  * @since 0.9.0
  */
 public static lerpClamped(
  a: ReadonlyMatrix2Like,
  b: ReadonlyMatrix2Like,
  t: number,
  out?: Matrix2,
 ): Matrix2 {
  return Matrix2.lerp(a, b, saturate(t), out);
 }

 /**
  * Smooth step interpolation between two matrices.
  *
  * @param a - Start matrix.
  * @param b - End matrix.
  * @param t - Interpolation factor [0, 1].
  * @param out - Optional output matrix.
  * @returns Smoothly interpolated matrix.
  *
  * @remarks
  * Uses the smoothstep formula: 3t² - 2t³
  *
  * @category Interpolation
  * @since 0.9.0
  */
 public static smoothStep(
  a: ReadonlyMatrix2Like,
  b: ReadonlyMatrix2Like,
  t: number,
  out?: Matrix2,
 ): Matrix2 {
  const tt = saturate(t);
  const factor = tt * tt * (3 - 2 * tt);
  return Matrix2.ensureOut(out).set(
   lerp(a.m00, b.m00, factor),
   lerp(a.m01, b.m01, factor),
   lerp(a.m10, b.m10, factor),
   lerp(a.m11, b.m11, factor),
  );
 }

 /* ======================================================================== */
 /* Static Comparison & Validation                                          */
 /* ======================================================================== */

 /**
  * Tests if two matrices are approximately equal.
  *
  * @param a - First matrix.
  * @param b - Second matrix.
  * @param epsilon - Tolerance. @defaultValue `EPSILON`
  * @returns True if all components are within tolerance.
  *
  * @category Comparison
  * @since 0.1.0
  */
 /**
  * Exact component-wise equality (bit-identical).
  *
  * @param a - First matrix.
  * @param b - Second matrix.
  * @returns True if all components are exactly identical.
  *
  * @remarks
  * Use {@link nearEquals} for comparing results of floating-point operations.
  *
  * @category Comparison
  * @since 0.1.0
  */
 public static exactEquals(a: ReadonlyMatrix2Like, b: ReadonlyMatrix2Like): boolean {
  return a.m00 === b.m00 && a.m01 === b.m01 && a.m10 === b.m10 && a.m11 === b.m11;
 }

 /**
  * Approximate component-wise equality using relative tolerance.
  *
  * @param a - First matrix.
  * @param b - Second matrix.
  * @param epsilon - Relative tolerance. @defaultValue `EPSILON`
  * @returns True if all component differences are within scaled epsilon.
  *
  * @remarks
  * Uses relative tolerance: `|a - b| <= epsilon * max(1, |a|, |b|)` per component.
  * This scales with value magnitude, making it robust for both small and large values.
  *
  * @category Comparison
  * @since 0.9.0
  */
 public static nearEquals(
  a: ReadonlyMatrix2Like,
  b: ReadonlyMatrix2Like,
  epsilon: number = EPSILON,
 ): boolean {
  return (
   relativeEquals(a.m00, b.m00, epsilon) &&
   relativeEquals(a.m01, b.m01, epsilon) &&
   relativeEquals(a.m10, b.m10, epsilon) &&
   relativeEquals(a.m11, b.m11, epsilon)
  );
 }

 /**
  * Tests if a matrix is the identity matrix.
  *
  * @param matrix - Matrix to test.
  * @param epsilon - Tolerance. @defaultValue `EPSILON`
  * @returns True if matrix is identity.
  *
  * @category Comparison
  * @since 0.1.0
  */
 public static isIdentity(matrix: ReadonlyMatrix2Like, epsilon: number = EPSILON): boolean {
  return (
   scalarNearEquals(matrix.m00, 1, epsilon) &&
   isNearZero(matrix.m01, epsilon) &&
   isNearZero(matrix.m10, epsilon) &&
   scalarNearEquals(matrix.m11, 1, epsilon)
  );
 }

 /**
  * Tests if a matrix is exactly zero.
  *
  * @param matrix - Matrix to test.
  * @returns True if all components are zero.
  *
  * @category Comparison
  * @since 0.9.0
  */
 public static isZero(matrix: ReadonlyMatrix2Like): boolean {
  return matrix.m00 === 0 && matrix.m01 === 0 && matrix.m10 === 0 && matrix.m11 === 0;
 }

 /**
  * Tests if a matrix is approximately zero.
  *
  * @param matrix - Matrix to test.
  * @param epsilon - Tolerance. @defaultValue `EPSILON`
  * @returns True if all components are within epsilon of zero.
  *
  * @category Comparison
  * @since 0.9.0
  */
 public static nearZero(matrix: ReadonlyMatrix2Like, epsilon: number = EPSILON): boolean {
  return (
   isNearZero(matrix.m00, epsilon) &&
   isNearZero(matrix.m01, epsilon) &&
   isNearZero(matrix.m10, epsilon) &&
   isNearZero(matrix.m11, epsilon)
  );
 }

 /**
  * Tests if all components are finite numbers.
  *
  * @param matrix - Matrix to test.
  * @returns True if all components are finite.
  *
  * @category Comparison
  * @since 0.9.0
  */
 public static isFinite(matrix: ReadonlyMatrix2Like): boolean {
  return (
   Number.isFinite(matrix.m00) &&
   Number.isFinite(matrix.m01) &&
   Number.isFinite(matrix.m10) &&
   Number.isFinite(matrix.m11)
  );
 }

 /**
  * Tests if any component is NaN.
  *
  * @param matrix - Matrix to test.
  * @returns True if any component is NaN.
  *
  * @category Comparison
  * @since 0.9.0
  */
 public static hasNaN(matrix: ReadonlyMatrix2Like): boolean {
  return (
   Number.isNaN(matrix.m00) ||
   Number.isNaN(matrix.m01) ||
   Number.isNaN(matrix.m10) ||
   Number.isNaN(matrix.m11)
  );
 }

 /**
  * Tests if a matrix is symmetric (m01 ≈ m10).
  *
  * @param matrix - Matrix to test.
  * @param epsilon - Relative tolerance. @defaultValue `EPSILON`
  * @returns True if matrix is symmetric.
  *
  * @remarks
  * Uses relative tolerance for comparing off-diagonal elements.
  *
  * @category Comparison
  * @since 0.9.0
  */
 public static isSymmetric(matrix: ReadonlyMatrix2Like, epsilon: number = EPSILON): boolean {
  return relativeEquals(matrix.m01, matrix.m10, epsilon);
 }

 /**
  * Tests if a matrix is skew-symmetric (m00 ≈ 0, m11 ≈ 0, m01 ≈ -m10).
  *
  * @param matrix - Matrix to test.
  * @param epsilon - Tolerance. @defaultValue `EPSILON`
  * @returns True if matrix is skew-symmetric.
  *
  * @remarks
  * Uses relative tolerance for comparing off-diagonal elements.
  *
  * @category Comparison
  * @since 0.9.0
  */
 public static isSkewSymmetric(matrix: ReadonlyMatrix2Like, epsilon: number = EPSILON): boolean {
  return (
   isNearZero(matrix.m00, epsilon) &&
   isNearZero(matrix.m11, epsilon) &&
   relativeEquals(matrix.m01, -matrix.m10, epsilon)
  );
 }

 /**
  * Tests if a matrix is diagonal (off-diagonal elements ≈ 0).
  *
  * @param matrix - Matrix to test.
  * @param epsilon - Tolerance. @defaultValue `EPSILON`
  * @returns True if matrix is diagonal.
  *
  * @category Comparison
  * @since 0.9.0
  */
 public static isDiagonal(matrix: ReadonlyMatrix2Like, epsilon: number = EPSILON): boolean {
  return isNearZero(matrix.m01, epsilon) && isNearZero(matrix.m10, epsilon);
 }

 /**
  * Tests if a matrix is singular (determinant ≈ 0).
  *
  * @param matrix - Matrix to test.
  * @param epsilon - Tolerance. @defaultValue `EPSILON`
  * @returns True if matrix is singular (non-invertible).
  *
  * @category Comparison
  * @since 0.9.0
  */
 public static isSingular(matrix: ReadonlyMatrix2Like, epsilon: number = EPSILON): boolean {
  return isNearZero(matrix.m00 * matrix.m11 - matrix.m01 * matrix.m10, epsilon);
 }

 /* ======================================================================== */
 /* Static Matrix Operations                                                 */
 /* ======================================================================== */

 /**
  * Calculates the determinant of a matrix.
  *
  * @param matrix - Matrix to calculate determinant of.
  * @returns Determinant value.
  *
  * @category Matrix Operations
  * @since 0.1.0
  */
 public static determinant(matrix: ReadonlyMatrix2Like): number {
  return matrix.m00 * matrix.m11 - matrix.m01 * matrix.m10;
 }

 /**
  * Calculates the trace (sum of diagonal elements) of a matrix.
  *
  * @param matrix - Matrix to calculate trace of.
  * @returns Sum of diagonal elements (m00 + m11).
  *
  * @category Matrix Operations
  * @since 0.9.0
  */
 public static trace(matrix: ReadonlyMatrix2Like): number {
  return matrix.m00 + matrix.m11;
 }

 /**
  * Calculates the Frobenius norm of a matrix.
  *
  * @param matrix - Matrix to calculate norm of.
  * @returns Square root of sum of squared elements.
  *
  * @remarks
  * Uses deterministic sqrt for cross-platform reproducibility.
  *
  * @category Matrix Operations
  * @since 0.9.0
  */
 public static frobeniusNorm(matrix: ReadonlyMatrix2Like): number {
  return safeSqrt(
   matrix.m00 * matrix.m00 +
    matrix.m01 * matrix.m01 +
    matrix.m10 * matrix.m10 +
    matrix.m11 * matrix.m11,
  );
 }

 /**
  * Composes a matrix from rotation angle and scale.
  * @param rotation - Rotation angle in radians
  * @param scale - Scale factors (Vector2 or uniform number)
  * @param out - Optional output object
  * @returns Composed transformation matrix
  *
  * @example
  * ```typescript
  * const m = Matrix2.compose(Math.PI / 4, new Vector2(2, 1));
  * ```
  */
 public static compose(
  rotation: number,
  scale: ReadonlyVector2Like | number,
  out?: Matrix2,
 ): Matrix2 {
  const { cos, sin } = sinCos(rotation);
  const target = Matrix2.ensureOut(out);

  if (typeof scale === 'number') {
   return target.set(cos * scale, sin * scale, -sin * scale, cos * scale);
  }

  return target.set(cos * scale.x, sin * scale.x, -sin * scale.y, cos * scale.y);
 }

 /**
  * Decomposes a matrix into rotation and scale components.
  * @param matrix - Matrix to decompose
  * @returns Object with rotation (radians) and scale (Vector2)
  *
  * @example
  * ```typescript
  * const m = Matrix2.fromRotation(Math.PI / 4).scaleBy(new Vector2(2, 1));
  * const { rotation, scale } = Matrix2.decompose(m);
  * ```
  */
 public static decompose(matrix: ReadonlyMatrix2Like): { rotation: number; scale: Vector2 } {
  const sx = safeSqrt(matrix.m00 * matrix.m00 + matrix.m01 * matrix.m01);
  const sy = safeSqrt(matrix.m10 * matrix.m10 + matrix.m11 * matrix.m11);

  // Determine sign of scale based on determinant
  const det = matrix.m00 * matrix.m11 - matrix.m01 * matrix.m10;
  const signY = det < 0 ? -1 : 1;

  const rotation = DeterministicMath.atan2(matrix.m01, matrix.m00);

  return {
   rotation,
   scale: new Vector2(sx, sy * signY),
  };
 }

 public static transformVector(
  matrix: ReadonlyMatrix2Like,
  vector: ReadonlyVector2Like,
  out?: Vector2,
 ): Vector2 {
  return Vector2.fromValues(
   matrix.m00 * vector.x + matrix.m10 * vector.y,
   matrix.m01 * vector.x + matrix.m11 * vector.y,
   out,
  );
 }

 /**
  * Rotates a matrix by an angle.
  *
  * @param matrix - Matrix to rotate.
  * @param angle - Angle in radians.
  * @param out - Optional output matrix.
  * @returns Rotated matrix.
  *
  * @remarks
  * Equivalent to `Matrix2.multiply(matrix, Matrix2.fromRotation(angle), out)`
  * but more efficient as it avoids creating an intermediate matrix.
  *
  * @example
  * ```typescript
  * const m = Matrix2.fromScale(2, 1);
  * const rotated = Matrix2.rotate(m, Math.PI / 4);
  * ```
  *
  * @category Matrix Operations
  * @since 0.11.0
  */
 public static rotate(matrix: ReadonlyMatrix2Like, angle: number, out?: Matrix2): Matrix2 {
  const { cos, sin } = sinCos(angle);
  const { m00, m01, m10, m11 } = matrix;

  return Matrix2.ensureOut(out).set(
   m00 * cos + m10 * sin,
   m01 * cos + m11 * sin,
   m00 * -sin + m10 * cos,
   m01 * -sin + m11 * cos,
  );
 }

 /**
  * Scales a matrix by per-axis factors.
  *
  * @param matrix - Matrix to scale.
  * @param scale - Scale factors (Vector2 or uniform number).
  * @param out - Optional output matrix.
  * @returns Scaled matrix.
  *
  * @remarks
  * Unlike {@link scale} which multiplies all elements by a scalar,
  * this method applies non-uniform scaling using a Vector2.
  *
  * @example
  * ```typescript
  * const m = Matrix2.fromRotation(Math.PI / 4);
  * const scaled = Matrix2.scaleBy(m, { x: 2, y: 0.5 });
  * ```
  *
  * @category Matrix Operations
  * @since 0.11.0
  */
 public static scaleBy(
  matrix: ReadonlyMatrix2Like,
  scale: ReadonlyVector2Like | number,
  out?: Matrix2,
 ): Matrix2 {
  if (typeof scale === 'number') {
   return Matrix2.scale(matrix, scale, out);
  }

  return Matrix2.ensureOut(out).set(
   matrix.m00 * scale.x,
   matrix.m01 * scale.x,
   matrix.m10 * scale.y,
   matrix.m11 * scale.y,
  );
 }

 /* ======================================================================== */
 /* Instance Properties                                                      */
 /* ======================================================================== */

 /**
  * Column 0, Row 0 (typically cosine for rotation, x-scale for scale).
  */
 public m00: number;

 /**
  * Column 0, Row 1 (typically sine for rotation, y-shear for shear).
  */
 public m01: number;

 /**
  * Column 1, Row 0 (typically -sine for rotation, x-shear for shear).
  */
 public m10: number;

 /**
  * Column 1, Row 1 (typically cosine for rotation, y-scale for scale).
  */
 public m11: number;

 /* ======================================================================== */
 /* Constructor                                                              */
 /* ======================================================================== */

 /**
  * Creates a new 2x2 matrix.
  *
  * @remarks
  * Supports multiple construction forms:
  * - No arguments: creates identity matrix
  * - Four numbers: explicit components (m00, m01, m10, m11)
  * - Array of 4 numbers: [m00, m01, m10, m11]
  * - Object with m00, m01, m10, m11 properties
  *
  * @param m00OrSource - First component, array, or object source
  * @param m01 - Column 0, Row 1 (when first arg is a number)
  * @param m10 - Column 1, Row 0 (when first arg is a number)
  * @param m11 - Column 1, Row 1 (when first arg is a number)
  *
  * @example
  * ```typescript
  * new Matrix2();                    // Identity: [1,0,0,1]
  * new Matrix2(1, 2, 3, 4);          // Explicit: m00=1, m01=2, m10=3, m11=4
  * new Matrix2([1, 2, 3, 4]);        // From array
  * new Matrix2({ m00: 1, m01: 2, m10: 3, m11: 4 }); // From object
  * ```
  */
 public constructor(
  m00OrSource?: number | [number, number, number, number] | ReadonlyMatrix2Like,
  m01?: number,
  m10?: number,
  m11?: number,
 ) {
  if (m00OrSource === undefined) {
   // Identity matrix
   this.m00 = 1;
   this.m01 = 0;
   this.m10 = 0;
   this.m11 = 1;
  } else if (typeof m00OrSource === 'number') {
   // Explicit components
   this.m00 = m00OrSource;
   this.m01 = m01 ?? 0;
   this.m10 = m10 ?? 0;
   this.m11 = m11 ?? 1;
  } else if (Array.isArray(m00OrSource)) {
   // From array
   if (m00OrSource.length < 4) {
    throw new RangeError('Matrix2: array must have at least 4 elements');
   }
   this.m00 = m00OrSource[0];
   this.m01 = m00OrSource[1];
   this.m10 = m00OrSource[2];
   this.m11 = m00OrSource[3];
  } else if (
   typeof m00OrSource === 'object' &&
   'm00' in m00OrSource &&
   'm01' in m00OrSource &&
   'm10' in m00OrSource &&
   'm11' in m00OrSource
  ) {
   // From object
   this.m00 = m00OrSource.m00;
   this.m01 = m00OrSource.m01;
   this.m10 = m00OrSource.m10;
   this.m11 = m00OrSource.m11;
  } else {
   throw new TypeError('Matrix2: invalid constructor arguments');
  }
 }

 /* ======================================================================== */
 /* Instance Basic Mutators                                                  */
 /* ======================================================================== */

 /**
  * Sets the matrix components.
  *
  * @param m00 - Column 0, Row 0
  * @param m01 - Column 0, Row 1
  * @param m10 - Column 1, Row 0
  * @param m11 - Column 1, Row 1
  * @returns This matrix for chaining.
  *
  * @category Mutator
  * @since 0.1.0
  */
 public set(m00: number, m01: number, m10: number, m11: number): this {
  this.m00 = m00;
  this.m01 = m01;
  this.m10 = m10;
  this.m11 = m11;
  return this;
 }

 /**
  * Copies components from another matrix.
  *
  * @param other - Matrix to copy from.
  * @returns This matrix for chaining.
  *
  * @category Mutator
  * @since 0.1.0
  */
 public copy(other: ReadonlyMatrix2): this {
  this.m00 = other.m00;
  this.m01 = other.m01;
  this.m10 = other.m10;
  this.m11 = other.m11;
  return this;
 }

 /**
  * Sets this matrix to identity.
  *
  * @returns This matrix for chaining.
  *
  * @category Mutator
  * @since 0.1.0
  */
 public identity(): this {
  this.m00 = 1;
  this.m01 = 0;
  this.m10 = 0;
  this.m11 = 1;
  return this;
 }

 /**
  * Resets all components to zero.
  *
  * @returns This matrix for chaining.
  *
  * @category Mutator
  * @since 0.9.0
  */
 public zero(): this {
  this.m00 = 0;
  this.m01 = 0;
  this.m10 = 0;
  this.m11 = 0;
  return this;
 }

 /* ======================================================================== */
 /* Instance Computed Values                                                 */
 /* ======================================================================== */

 /**
  * Calculates the determinant of the matrix.
  *
  * @returns Determinant value.
  *
  * @remarks
  * A determinant of 0 indicates the matrix is singular (non-invertible).
  * The absolute value represents the area scaling factor.
  *
  * @category Computed
  * @since 0.1.0
  */
 public determinant(): number {
  return this.m00 * this.m11 - this.m01 * this.m10;
 }

 /**
  * Calculates the trace of the matrix.
  *
  * @returns Sum of diagonal elements.
  *
  * @category Computed
  * @since 0.9.0
  */
 public trace(): number {
  return this.m00 + this.m11;
 }

 /**
  * Calculates the Frobenius norm.
  *
  * @returns Square root of sum of squared elements.
  *
  * @remarks
  * Uses deterministic sqrt for cross-platform reproducibility.
  *
  * @category Computed
  * @since 0.9.0
  */
 public frobeniusNorm(): number {
  return safeSqrt(
   this.m00 * this.m00 + this.m01 * this.m01 + this.m10 * this.m10 + this.m11 * this.m11,
  );
 }

 /**
  * Tests if this matrix is invertible.
  *
  * @param epsilon - Tolerance for determinant. @defaultValue `EPSILON`
  * @returns True if determinant is non-zero.
  *
  * @category Comparison
  * @since 0.1.0
  */
 public isInvertible(epsilon: number = EPSILON): boolean {
  return !isNearZero(this.determinant(), epsilon);
 }

 /**
  * Tests if this matrix is orthogonal.
  *
  * @param epsilon - Tolerance. @defaultValue `EPSILON`
  * @returns True if M * M^T = I.
  *
  * @category Comparison
  * @since 0.9.0
  */
 public isOrthogonal(epsilon: number = EPSILON): boolean {
  // Check if columns are unit length and orthogonal
  const col0LengthSq = this.m00 * this.m00 + this.m01 * this.m01;
  const col1LengthSq = this.m10 * this.m10 + this.m11 * this.m11;
  const dot = this.m00 * this.m10 + this.m01 * this.m11;

  return (
   scalarNearEquals(col0LengthSq, 1, epsilon) &&
   scalarNearEquals(col1LengthSq, 1, epsilon) &&
   isNearZero(dot, epsilon)
  );
 }

 /**
  * Extracts rotation angle from the matrix.
  *
  * @returns Rotation angle in radians.
  *
  * @remarks
  * Assumes the matrix represents a pure rotation or rotation with uniform scale.
  *
  * @category Computed
  * @since 0.1.0
  */
 public getRotation(): number {
  return DeterministicMath.atan2(this.m01, this.m00);
 }

 /**
  * Extracts scale factors from the matrix.
  *
  * @param out - Optional output vector.
  * @returns Scale factors for each axis.
  *
  * @remarks
  * Returns the length of each column vector.
  * Uses deterministic sqrt for cross-platform reproducibility.
  *
  * @category Computed
  * @since 0.1.0
  */
 public getScale(out?: Vector2): Vector2 {
  const sx = safeSqrt(this.m00 * this.m00 + this.m01 * this.m01);
  const sy = safeSqrt(this.m10 * this.m10 + this.m11 * this.m11);
  return Vector2.fromValues(sx, sy, out);
 }

 /* ======================================================================== */
 /* Instance Getters (Derived)                                               */
 /* ======================================================================== */

 /**
  * Returns a new transposed matrix without modifying this one.
  * @returns New transposed matrix
  *
  * @example
  * ```typescript
  * const m = new Matrix2(1, 2, 3, 4);
  * const t = m.transposed;
  * // t = Matrix2(1, 3, 2, 4), m unchanged
  * ```
  */
 public get transposed(): Matrix2 {
  return new Matrix2(this.m00, this.m10, this.m01, this.m11);
 }

 /**
  * Returns a new inverted matrix without modifying this one.
  * Returns identity if matrix is singular.
  * @returns New inverted matrix
  *
  * @example
  * ```typescript
  * const m = Matrix2.fromRotation(Math.PI / 4);
  * const inv = m.inverted;
  * // m × inv ≈ identity
  * ```
  */
 public get inverted(): Matrix2 {
  const det = this.determinant();
  if (isNearZero(det)) {
   return new Matrix2(); // Return identity for singular matrix
  }
  const invDet = safeDivide(1, det);
  return new Matrix2(this.m11 * invDet, -this.m01 * invDet, -this.m10 * invDet, this.m00 * invDet);
 }

 /**
  * Returns a new negated matrix without modifying this one.
  * @returns New negated matrix
  *
  * @example
  * ```typescript
  * const m = new Matrix2(1, 2, 3, 4);
  * const neg = m.negated;
  * // neg = Matrix2(-1, -2, -3, -4), m unchanged
  * ```
  */
 public get negated(): Matrix2 {
  return new Matrix2(-this.m00, -this.m01, -this.m10, -this.m11);
 }

 /**
  * Returns the first column as a new vector.
  * @returns First column vector
  */
 public get column0(): Vector2 {
  return new Vector2(this.m00, this.m01);
 }

 /**
  * Returns the second column as a new vector.
  * @returns Second column vector
  */
 public get column1(): Vector2 {
  return new Vector2(this.m10, this.m11);
 }

 /**
  * Returns the first row as a new vector.
  * @returns First row vector
  */
 public get row0(): Vector2 {
  return new Vector2(this.m00, this.m10);
 }

 /**
  * Returns the second row as a new vector.
  * @returns Second row vector
  */
 public get row1(): Vector2 {
  return new Vector2(this.m01, this.m11);
 }

 /**
  * Returns the diagonal elements as a new vector.
  * @returns Diagonal vector (m00, m11)
  */
 public get diagonal(): Vector2 {
  return new Vector2(this.m00, this.m11);
 }

 /* ======================================================================== */
 /* Instance Arithmetic                                                      */
 /* ======================================================================== */

 /**
  * Adds another matrix to this one.
  *
  * @param other - Matrix to add.
  * @returns This matrix for chaining.
  *
  * @category Arithmetic
  * @since 0.1.0
  */
 public add(other: ReadonlyMatrix2Like): this {
  this.m00 += other.m00;
  this.m01 += other.m01;
  this.m10 += other.m10;
  this.m11 += other.m11;
  return this;
 }

 /**
  * Subtracts another matrix from this one.
  *
  * @param other - Matrix to subtract.
  * @returns This matrix for chaining.
  *
  * @category Arithmetic
  * @since 0.1.0
  */
 public subtract(other: ReadonlyMatrix2Like): this {
  this.m00 -= other.m00;
  this.m01 -= other.m01;
  this.m10 -= other.m10;
  this.m11 -= other.m11;
  return this;
 }

 /**
  * Multiplies this matrix by another (this × other).
  *
  * @param other - Matrix to multiply by.
  * @returns This matrix for chaining.
  *
  * @example
  * ```typescript
  * const rot = Matrix2.fromRotation(Math.PI / 4);
  * const scale = Matrix2.fromScale(2);
  * rot.multiply(scale); // rot is now rotated then scaled
  * ```
  *
  * @category Arithmetic
  * @since 0.1.0
  */
 public multiply(other: ReadonlyMatrix2Like): this {
  const { m00: a00, m01: a01, m10: a10, m11: a11 } = this;
  const { m00: b00, m01: b01, m10: b10, m11: b11 } = other;

  this.m00 = a00 * b00 + a10 * b01;
  this.m01 = a01 * b00 + a11 * b01;
  this.m10 = a00 * b10 + a10 * b11;
  this.m11 = a01 * b10 + a11 * b11;
  return this;
 }

 /**
  * Scales all matrix components by a scalar.
  *
  * @param scalar - Scale factor.
  * @returns This matrix for chaining.
  *
  * @category Arithmetic
  * @since 0.1.0
  */
 public scale(scalar: number): this {
  this.m00 *= scalar;
  this.m01 *= scalar;
  this.m10 *= scalar;
  this.m11 *= scalar;
  return this;
 }

 /**
  * Adds a scalar to all components.
  *
  * @param scalar - Scalar to add.
  * @returns This matrix for chaining.
  *
  * @category Arithmetic
  * @since 0.9.0
  */
 public addScalar(scalar: number): this {
  this.m00 += scalar;
  this.m01 += scalar;
  this.m10 += scalar;
  this.m11 += scalar;
  return this;
 }

 /**
  * Subtracts a scalar from all components.
  *
  * @param scalar - Scalar to subtract.
  * @returns This matrix for chaining.
  *
  * @category Arithmetic
  * @since 0.9.0
  */
 public subtractScalar(scalar: number): this {
  this.m00 -= scalar;
  this.m01 -= scalar;
  this.m10 -= scalar;
  this.m11 -= scalar;
  return this;
 }

 /**
  * Fused multiply-add: `this = this * scale + m`.
  *
  * @param scale - Scale factor.
  * @param m - Matrix to add.
  * @returns This matrix for chaining.
  *
  * @category Arithmetic
  * @since 0.9.0
  */
 public fma(scale: number, m: ReadonlyMatrix2Like): this {
  this.m00 = this.m00 * scale + m.m00;
  this.m01 = this.m01 * scale + m.m01;
  this.m10 = this.m10 * scale + m.m10;
  this.m11 = this.m11 * scale + m.m11;
  return this;
 }

 /**
  * Divides all components by a scalar.
  *
  * @param scalar - Scalar divisor.
  * @returns This matrix for chaining.
  *
  * @remarks
  * Uses safe division; if |scalar| ≤ EPSILON, components become 0.
  *
  * @category Arithmetic
  * @since 0.9.0
  */
 public divideScalar(scalar: number): this {
  const inv = safeDivide(1, scalar);
  this.m00 *= inv;
  this.m01 *= inv;
  this.m10 *= inv;
  this.m11 *= inv;
  return this;
 }

 /**
  * Safe scalar division. If |scalar| ≤ EPSILON, sets all components to zero.
  *
  * @param scalar - Scalar divisor.
  * @returns This matrix for chaining.
  *
  * @category Arithmetic
  * @since 0.9.0
  */
 public divideScalarSafe(scalar: number): this {
  if (isNearZero(scalar)) {
   return this.zero();
  }
  const inv = 1 / scalar;
  this.m00 *= inv;
  this.m01 *= inv;
  this.m10 *= inv;
  this.m11 *= inv;
  return this;
 }

 /**
  * Component-wise modulo with another matrix.
  *
  * @param other - Divisor matrix.
  * @returns This matrix for chaining.
  *
  * @remarks
  * Uses the positive modulo operation (always returns positive results).
  *
  * @category Arithmetic
  * @since 0.9.0
  */
 public mod(other: ReadonlyMatrix2Like): this {
  this.m00 = scalarModule(this.m00, other.m00);
  this.m01 = scalarModule(this.m01, other.m01);
  this.m10 = scalarModule(this.m10, other.m10);
  this.m11 = scalarModule(this.m11, other.m11);
  return this;
 }

 /**
  * Scalar modulo on all components.
  *
  * @param scalar - Scalar divisor.
  * @returns This matrix for chaining.
  *
  * @category Arithmetic
  * @since 0.9.0
  */
 public modScalar(scalar: number): this {
  this.m00 = scalarModule(this.m00, scalar);
  this.m01 = scalarModule(this.m01, scalar);
  this.m10 = scalarModule(this.m10, scalar);
  this.m11 = scalarModule(this.m11, scalar);
  return this;
 }

 /* ======================================================================== */
 /* Instance Matrix Operations                                               */
 /* ======================================================================== */

 /**
  * Transposes the matrix in place.
  * @returns This matrix for chaining
  */
 public transpose(): this {
  const temporary = this.m01;
  this.m01 = this.m10;
  this.m10 = temporary;
  return this;
 }

 /**
  * Inverts the matrix in place.
  * @returns This matrix for chaining
  * @throws {RangeError} If matrix is singular (determinant ≈ 0)
  */
 public inverse(): this {
  const det = this.determinant();
  if (isNearZero(det)) {
   throw new RangeError('Matrix2.inverse: matrix is singular (determinant ≈ 0)');
  }

  const invDet = 1 / det;
  const r00 = this.m11 * invDet;
  const r01 = -this.m01 * invDet;
  const r10 = -this.m10 * invDet;
  const r11 = this.m00 * invDet;
  return this.set(r00, r01, r10, r11);
 }

 /**
  * Safe inversion in place. Sets to identity if singular.
  * @returns This matrix for chaining
  */
 public inverseSafe(): this {
  const det = this.determinant();
  if (isNearZero(det)) {
   return this.identity(); // Fallback to identity
  }

  const invDet = 1 / det;
  const r00 = this.m11 * invDet;
  const r01 = -this.m01 * invDet;
  const r10 = -this.m10 * invDet;
  const r11 = this.m00 * invDet;
  return this.set(r00, r01, r10, r11);
 }

 /**
  * Unchecked inversion for hot paths.
  *
  * ⚠️ **Precondition:** Matrix must be invertible (det ≠ 0).
  * Calling with a singular matrix produces NaN/Infinity components.
  *
  * @returns This matrix for chaining
  *
  * @example
  * ```typescript
  * if (matrix.isInvertible()) {
  *   matrix.inverseUnchecked();
  * }
  * ```
  */
 public inverseUnchecked(): this {
  const invDet = 1 / (this.m00 * this.m11 - this.m01 * this.m10);
  const r00 = this.m11 * invDet;
  const r01 = -this.m01 * invDet;
  const r10 = -this.m10 * invDet;
  const r11 = this.m00 * invDet;
  return this.set(r00, r01, r10, r11);
 }

 /**
  * Calculates the adjugate (adjoint) matrix in place.
  * @returns This matrix for chaining
  */
 public adjugate(): this {
  const r00 = this.m11;
  const r01 = -this.m01;
  const r10 = -this.m10;
  const r11 = this.m00;
  return this.set(r00, r01, r10, r11);
 }

 /**
  * Negates all elements of this matrix in place.
  * @returns This matrix for chaining
  *
  * @example
  * ```typescript
  * const m = new Matrix2(1, 2, 3, 4);
  * m.negate();
  * // m = Matrix2(-1, -2, -3, -4)
  * ```
  */
 public negate(): this {
  this.m00 = -this.m00;
  this.m01 = -this.m01;
  this.m10 = -this.m10;
  this.m11 = -this.m11;
  return this;
 }

 /* ======================================================================== */
 /* Instance Numeric Transforms                                              */
 /* ======================================================================== */

 /**
  * Applies Math.floor to all elements.
  * @returns This matrix for chaining
  */
 public floor(): this {
  this.m00 = Math.floor(this.m00);
  this.m01 = Math.floor(this.m01);
  this.m10 = Math.floor(this.m10);
  this.m11 = Math.floor(this.m11);
  return this;
 }

 /**
  * Applies Math.ceil to all elements.
  * @returns This matrix for chaining
  */
 public ceil(): this {
  this.m00 = Math.ceil(this.m00);
  this.m01 = Math.ceil(this.m01);
  this.m10 = Math.ceil(this.m10);
  this.m11 = Math.ceil(this.m11);
  return this;
 }

 /**
  * Applies Math.round to all elements.
  * @returns This matrix for chaining
  */
 public round(): this {
  this.m00 = Math.round(this.m00);
  this.m01 = Math.round(this.m01);
  this.m10 = Math.round(this.m10);
  this.m11 = Math.round(this.m11);
  return this;
 }

 /**
  * Applies absolute value to all elements.
  * @returns This matrix for chaining
  */
 public abs(): this {
  this.m00 = scalarAbs(this.m00);
  this.m01 = scalarAbs(this.m01);
  this.m10 = scalarAbs(this.m10);
  this.m11 = scalarAbs(this.m11);
  return this;
 }

 /**
  * Applies sign function to all elements.
  * @returns This matrix for chaining
  */
 public sign(): this {
  this.m00 = scalarSign(this.m00);
  this.m01 = scalarSign(this.m01);
  this.m10 = scalarSign(this.m10);
  this.m11 = scalarSign(this.m11);
  return this;
 }

 /**
  * Component-wise minimum with another matrix.
  * @param other - Other matrix
  * @returns This matrix for chaining
  */
 public min(other: ReadonlyMatrix2Like): this {
  this.m00 = scalarMin(this.m00, other.m00);
  this.m01 = scalarMin(this.m01, other.m01);
  this.m10 = scalarMin(this.m10, other.m10);
  this.m11 = scalarMin(this.m11, other.m11);
  return this;
 }

 /**
  * Component-wise maximum with another matrix.
  * @param other - Other matrix
  * @returns This matrix for chaining
  */
 public max(other: ReadonlyMatrix2Like): this {
  this.m00 = scalarMax(this.m00, other.m00);
  this.m01 = scalarMax(this.m01, other.m01);
  this.m10 = scalarMax(this.m10, other.m10);
  this.m11 = scalarMax(this.m11, other.m11);
  return this;
 }

 /**
  * Clamps all components between min and max matrices.
  * @param minM - Per-component minima
  * @param maxM - Per-component maxima
  * @returns This matrix for chaining
  */
 public clamp(minM: ReadonlyMatrix2Like, maxM: ReadonlyMatrix2Like): this {
  this.m00 = clamp(this.m00, minM.m00, maxM.m00);
  this.m01 = clamp(this.m01, minM.m01, maxM.m01);
  this.m10 = clamp(this.m10, minM.m10, maxM.m10);
  this.m11 = clamp(this.m11, minM.m11, maxM.m11);
  return this;
 }

 /**
  * Clamps all components between scalar bounds.
  * @param min - Minimum scalar
  * @param max - Maximum scalar
  * @returns This matrix for chaining
  */
 public clampScalar(min: number, max: number): this {
  this.m00 = clamp(this.m00, min, max);
  this.m01 = clamp(this.m01, min, max);
  this.m10 = clamp(this.m10, min, max);
  this.m11 = clamp(this.m11, min, max);
  return this;
 }

 /**
  * Pre-multiplies this matrix by another (other × this).
  * @param other - Matrix to multiply by
  * @returns This matrix for chaining
  *
  * @remarks
  * Unlike `multiply`, this applies the other transformation first.
  * Useful when building transformation chains in specific order.
  *
  * @example
  * ```typescript
  * const scale = Matrix2.fromScale(2);
  * const rot = Matrix2.fromRotation(Math.PI / 4);
  * scale.premultiply(rot); // scale is now rot × scale
  * ```
  */
 public premultiply(other: ReadonlyMatrix2Like): this {
  const { m00: a00, m01: a01, m10: a10, m11: a11 } = other;
  const { m00: b00, m01: b01, m10: b10, m11: b11 } = this;

  this.m00 = a00 * b00 + a10 * b01;
  this.m01 = a01 * b00 + a11 * b01;
  this.m10 = a00 * b10 + a10 * b11;
  this.m11 = a01 * b10 + a11 * b11;
  return this;
 }

 /* ======================================================================== */
 /* Instance Transformations                                                 */
 /* ======================================================================== */

 /**
  * Transforms a vector by this matrix.
  * @param vector - Vector to transform
  * @param out - Optional output object
  * @returns Transformed vector
  *
  * @example
  * ```typescript
  * const mat = Matrix2.fromRotation(Math.PI / 2);
  * const v = new Vector2(1, 0);
  * const rotated = mat.transformVector(v); // Vector2(0, 1)
  * ```
  */
 public transformVector(vector: ReadonlyVector2, out?: Vector2): Vector2 {
  const { x, y } = vector;
  return Vector2.fromValues(this.m00 * x + this.m10 * y, this.m01 * x + this.m11 * y, out);
 }

 /**
  * Rotates this matrix by an angle in place.
  * @param angle - Angle in radians
  * @returns This matrix for chaining
  */
 public rotate(angle: number): this {
  const { cos, sin } = sinCos(angle);
  const { m00, m01, m10, m11 } = this;

  this.m00 = m00 * cos + m10 * sin;
  this.m01 = m01 * cos + m11 * sin;
  this.m10 = m00 * -sin + m10 * cos;
  this.m11 = m01 * -sin + m11 * cos;
  return this;
 }

 /**
  * Scales this matrix by per-axis factors.
  * @param scale - Scale factors (Vector2 or uniform number)
  * @returns This matrix for chaining
  */
 public scaleBy(scale: ReadonlyVector2Like | number): this {
  if (typeof scale === 'number') {
   return this.scale(scale);
  }

  this.m00 *= scale.x;
  this.m01 *= scale.x;
  this.m10 *= scale.y;
  this.m11 *= scale.y;
  return this;
 }

 /* ======================================================================== */
 /* Instance Column/Row Access                                               */
 /* ======================================================================== */

 /**
  * Gets a column of the matrix as a vector.
  * @param index - Column index (0 or 1)
  * @param out - Optional output vector
  * @returns Column vector
  *
  * @throws {RangeError} If index is not 0 or 1
  *
  * @example
  * ```typescript
  * const m = Matrix2.fromRotation(Math.PI / 4);
  * const col0 = m.getColumn(0); // First column
  * const col1 = m.getColumn(1); // Second column
  * ```
  */
 public getColumn(index: number, out?: Vector2): Vector2 {
  // Development assertion (Box2D pattern)
  assertSafeInteger(index, 'Matrix2.getColumn:index');
  if (index === 0) {
   return Vector2.fromValues(this.m00, this.m01, out);
  }
  if (index === 1) {
   return Vector2.fromValues(this.m10, this.m11, out);
  }
  throw new RangeError(`Matrix2.getColumn: index must be 0 or 1, got ${index}`);
 }

 /**
  * Sets a column of the matrix from a vector.
  * @param index - Column index (0 or 1)
  * @param column - Vector to set as column
  * @returns This matrix for chaining
  *
  * @throws {RangeError} If index is not 0 or 1
  *
  * @example
  * ```typescript
  * const m = new Matrix2();
  * m.setColumn(0, new Vector2(2, 0)); // Set first column
  * ```
  */
 public setColumn(index: number, column: ReadonlyVector2Like): this {
  // Development assertion
  assertSafeInteger(index, 'Matrix2.setColumn:index');
  if (index === 0) {
   this.m00 = column.x;
   this.m01 = column.y;
   return this;
  }
  if (index === 1) {
   this.m10 = column.x;
   this.m11 = column.y;
   return this;
  }
  throw new RangeError(`Matrix2.setColumn: index must be 0 or 1, got ${index}`);
 }

 /**
  * Gets a row of the matrix as a vector.
  * @param index - Row index (0 or 1)
  * @param out - Optional output vector
  * @returns Row vector
  *
  * @throws {RangeError} If index is not 0 or 1
  *
  * @example
  * ```typescript
  * const m = Matrix2.fromRotation(Math.PI / 4);
  * const row0 = m.getRow(0); // First row
  * const row1 = m.getRow(1); // Second row
  * ```
  */
 public getRow(index: number, out?: Vector2): Vector2 {
  // Development assertion
  assertSafeInteger(index, 'Matrix2.getRow:index');
  if (index === 0) {
   return Vector2.fromValues(this.m00, this.m10, out);
  }
  if (index === 1) {
   return Vector2.fromValues(this.m01, this.m11, out);
  }
  throw new RangeError(`Matrix2.getRow: index must be 0 or 1, got ${index}`);
 }

 /**
  * Sets a row of the matrix from a vector.
  * @param index - Row index (0 or 1)
  * @param row - Vector to set as row
  * @returns This matrix for chaining
  *
  * @throws {RangeError} If index is not 0 or 1
  *
  * @example
  * ```typescript
  * const m = new Matrix2();
  * m.setRow(0, new Vector2(2, 0)); // Set first row
  * ```
  */
 public setRow(index: number, row: ReadonlyVector2Like): this {
  // Development assertion
  assertSafeInteger(index, 'Matrix2.setRow:index');
  if (index === 0) {
   this.m00 = row.x;
   this.m10 = row.y;
   return this;
  }
  if (index === 1) {
   this.m01 = row.x;
   this.m11 = row.y;
   return this;
  }
  throw new RangeError(`Matrix2.setRow: index must be 0 or 1, got ${index}`);
 }

 /* ======================================================================== */
 /* Instance Comparison                                                      */
 /* ======================================================================== */

 /**
  * Tests if this matrix equals another within tolerance.
  * @param other - Matrix to compare
  * @param epsilon - Tolerance (default: EPSILON)
  * @returns True if all components are within tolerance
  */
 /**
  * Exact equality with other matrix (bit-identical).
  * @param other - Matrix to compare.
  * @returns True if all components are exactly identical.
  *
  * @remarks
  * Use {@link nearEquals} for comparing results of floating-point operations.
  *
  * @category Comparison
  * @since 0.1.0
  */
 public exactEquals(other: ReadonlyMatrix2Like): boolean {
  return Matrix2.exactEquals(this, other);
 }

 /**
  * Approximate equality with other matrix using relative tolerance.
  *
  * @param other - Matrix to compare.
  * @param epsilon - Relative tolerance. @defaultValue `EPSILON`
  * @returns True if all component differences are within scaled epsilon.
  *
  * @remarks
  * Uses relative tolerance: `|a - b| <= epsilon * max(1, |a|, |b|)` per component.
  *
  * @category Comparison
  * @since 0.9.0
  */
 public nearEquals(other: ReadonlyMatrix2Like, epsilon: number = EPSILON): boolean {
  return Matrix2.nearEquals(this, other, epsilon);
 }

 /**
  * Tests if this is the identity matrix.
  * @param epsilon - Tolerance (default: EPSILON)
  * @returns True if matrix is identity
  */
 public isIdentity(epsilon: number = EPSILON): boolean {
  return (
   scalarNearEquals(this.m00, 1, epsilon) &&
   isNearZero(this.m01, epsilon) &&
   isNearZero(this.m10, epsilon) &&
   scalarNearEquals(this.m11, 1, epsilon)
  );
 }

 /**
  * Tests if this matrix is exactly zero.
  * @returns True if all components are zero
  */
 public isZero(): boolean {
  return this.m00 === 0 && this.m01 === 0 && this.m10 === 0 && this.m11 === 0;
 }

 /**
  * Tests if this matrix is approximately zero.
  * @param epsilon - Tolerance (default: EPSILON)
  * @returns True if all components are within epsilon of zero
  */
 public nearZero(epsilon: number = EPSILON): boolean {
  return (
   isNearZero(this.m00, epsilon) &&
   isNearZero(this.m01, epsilon) &&
   isNearZero(this.m10, epsilon) &&
   isNearZero(this.m11, epsilon)
  );
 }

 /**
  * Tests if all components are finite numbers.
  * @returns True if all components are finite
  */
 public isFinite(): boolean {
  return (
   Number.isFinite(this.m00) &&
   Number.isFinite(this.m01) &&
   Number.isFinite(this.m10) &&
   Number.isFinite(this.m11)
  );
 }

 /**
  * Tests if any component is NaN.
  * @returns True if any component is NaN
  */
 public hasNaN(): boolean {
  return (
   Number.isNaN(this.m00) ||
   Number.isNaN(this.m01) ||
   Number.isNaN(this.m10) ||
   Number.isNaN(this.m11)
  );
 }

 /**
  * Tests if this matrix is symmetric (m01 ≈ m10).
  * @param epsilon - Relative tolerance (default: EPSILON)
  * @returns True if matrix is symmetric
  *
  * @remarks Uses relative tolerance for comparing off-diagonal elements.
  */
 public isSymmetric(epsilon: number = EPSILON): boolean {
  return relativeEquals(this.m01, this.m10, epsilon);
 }

 /**
  * Tests if this matrix is skew-symmetric.
  * @param epsilon - Tolerance (default: EPSILON)
  * @returns True if matrix is skew-symmetric
  *
  * @remarks Uses relative tolerance for comparing off-diagonal elements.
  */
 public isSkewSymmetric(epsilon: number = EPSILON): boolean {
  return (
   isNearZero(this.m00, epsilon) &&
   isNearZero(this.m11, epsilon) &&
   relativeEquals(this.m01, -this.m10, epsilon)
  );
 }

 /**
  * Tests if this matrix is diagonal.
  * @param epsilon - Tolerance (default: EPSILON)
  * @returns True if matrix is diagonal
  */
 public isDiagonal(epsilon: number = EPSILON): boolean {
  return isNearZero(this.m01, epsilon) && isNearZero(this.m10, epsilon);
 }

 /**
  * Tests if this matrix is singular (determinant ≈ 0).
  * @param epsilon - Tolerance (default: EPSILON)
  * @returns True if matrix is singular
  */
 public isSingular(epsilon: number = EPSILON): boolean {
  return isNearZero(this.determinant(), epsilon);
 }

 /* ======================================================================== */
 /* Instance Interpolation                                                   */
 /* ======================================================================== */

 /**
  * Linear interpolation with another matrix in place.
  * @param other - Target matrix
  * @param t - Interpolation factor [0, 1], clamped
  * @returns This matrix for chaining
  *
  * @example
  * ```typescript
  * const a = Matrix2.IDENTITY.clone();
  * const b = Matrix2.fromRotation(Math.PI / 2);
  * a.lerp(b, 0.5); // a is now halfway between identity and b
  * ```
  */
 public lerp(other: ReadonlyMatrix2Like, t: number): this {
  this.m00 = lerp(this.m00, other.m00, t);
  this.m01 = lerp(this.m01, other.m01, t);
  this.m10 = lerp(this.m10, other.m10, t);
  this.m11 = lerp(this.m11, other.m11, t);
  return this;
 }

 /**
  * Linear interpolation without clamping t.
  * @param other - Target matrix
  * @param t - Interpolation factor (not clamped)
  * @returns This matrix for chaining
  */
 public lerpUnclamped(other: ReadonlyMatrix2Like, t: number): this {
  this.m00 = lerp(this.m00, other.m00, t);
  this.m01 = lerp(this.m01, other.m01, t);
  this.m10 = lerp(this.m10, other.m10, t);
  this.m11 = lerp(this.m11, other.m11, t);
  return this;
 }

 /**
  * Clamped linear interpolation (alias for lerp).
  *
  * @param other - Target matrix.
  * @param t - Interpolation factor (clamped to [0, 1]).
  * @returns This matrix for chaining.
  *
  * @category Interpolation
  * @since 0.9.0
  */
 public lerpClamped(other: ReadonlyMatrix2Like, t: number): this {
  return this.lerp(other, saturate(t));
 }

 /**
  * Smooth step interpolation with another matrix.
  *
  * @param other - Target matrix.
  * @param t - Interpolation factor [0, 1].
  * @returns This matrix for chaining.
  *
  * @category Interpolation
  * @since 0.9.0
  */
 public smoothStep(other: ReadonlyMatrix2Like, t: number): this {
  const tt = saturate(t);
  const factor = tt * tt * (3 - 2 * tt);
  this.m00 = lerp(this.m00, other.m00, factor);
  this.m01 = lerp(this.m01, other.m01, factor);
  this.m10 = lerp(this.m10, other.m10, factor);
  this.m11 = lerp(this.m11, other.m11, factor);
  return this;
 }

 /**
  * Alias for {@link scale}. Multiplies all components by a scalar.
  * @param scalar - Scale factor
  * @returns This matrix for chaining
  */
 public multiplyScalar(scalar: number): this {
  return this.scale(scalar);
 }

 /* ======================================================================== */
 /* Instance Conversion                                                      */
 /* ======================================================================== */

 /**
  * Converts to array form.
  * @param out - Optional array to fill
  * @param offset - Starting index (default: 0)
  * @param columnMajor - If true, use column-major order (default: true)
  * @returns Array with matrix elements
  */
 public toArray(out?: number[], offset = 0, columnMajor = true): number[] {
  const array = out ?? new Array(4);

  if (columnMajor) {
   array[offset] = this.m00;
   array[offset + 1] = this.m01;
   array[offset + 2] = this.m10;
   array[offset + 3] = this.m11;
  } else {
   array[offset] = this.m00;
   array[offset + 1] = this.m10;
   array[offset + 2] = this.m01;
   array[offset + 3] = this.m11;
  }

  return array;
 }

 /**
  * Converts to Float32Array.
  * @param out - Optional array to fill
  * @param offset - Starting index (default: 0)
  * @param columnMajor - If true, use column-major order (default: true)
  * @returns Float32Array with matrix elements
  */
 toFloat32Array(out?: Float32Array, offset = 0, columnMajor = true): Float32Array {
  const array = out ?? new Float32Array(4);
  this.toArray(array as unknown as number[], offset, columnMajor);
  return array;
 }

 /**
  * Converts to a plain object.
  * @returns Object with m00, m01, m10, m11 properties.
  */
 public toObject(): Matrix2Like {
  return { m00: this.m00, m01: this.m01, m10: this.m10, m11: this.m11 };
 }

 /**
  * Alias for toObject (JSON serialization).
  * @returns Object with matrix components.
  */
 public toJSON(): Matrix2Like {
  return this.toObject();
 }

 /**
  * Converts to string representation.
  * @param precision - Number of decimal places (default: 4)
  * @returns String representation
  */
 public toString(precision = 4): string {
  const p = (n: number) => n.toFixed(precision);
  return `Matrix2(\n  ${p(this.m00)}, ${p(this.m10)}\n  ${p(this.m01)}, ${p(this.m11)}\n)`;
 }

 /**
  * Creates a clone of this matrix.
  * @returns New matrix with same components
  */
 public clone(): Matrix2 {
  return new Matrix2(this.m00, this.m01, this.m10, this.m11);
 }

 /**
  * Iterator for array destructuring (column-major order).
  * @returns Iterator yielding m00, m01, m10, m11.
  *
  * @example
  * ```typescript
  * const [m00, m01, m10, m11] = Matrix2.IDENTITY;
  * ```
  *
  * @category Conversion
  * @since 0.9.0
  */
 public *[Symbol.iterator](): IterableIterator<number> {
  yield this.m00;
  yield this.m01;
  yield this.m10;
  yield this.m11;
 }
}
