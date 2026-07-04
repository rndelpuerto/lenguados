/**
 * @file core/matrix2.ts
 * @module @lenguados/math2d/core
 * @description Deterministic, allocation-aware 2×2 matrix implementation
 *
 * @remarks
 * Provides the {@link Matrix2} class for column-major 2×2 matrix operations including
 * multiplication, inversion, decomposition, and vector transformation. All operations
 * are deterministic for cross-platform reproducibility.
 */

import { sinCos } from '../auxiliary/angle/operations';
import {
 clamp,
 // eslint-disable-next-line unicorn/prevent-abbreviations -- `Mod` is the canonical mathematical term (modulo), not an abbreviation of `Module`.
 mod as scalarMod,
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
import { atan2, hypot } from '../deterministic/deterministic-kernels';
import type {
 EigendecomposeResult,
 EigenvalueResult,
 Matrix2Like,
 Matrix3Like,
 PolarDecomposeResult,
 ReadonlyMatrix2Like,
 ReadonlyRotation2Like,
 ReadonlyVector2Like,
 SvdResult,
} from '../types';
import { assertRotation2Normalized, assertSafeInteger } from '../validation/assert';

import { Vector2 } from './vector2';

/* ========================================================================== */
/* Type Exports                                                               */
/* ========================================================================== */

/**
 * Readonly view of a {@link Matrix2} instance
 *
 * @category Types
 * @since 0.6.0
 * @public
 */
export type ReadonlyMatrix2 = Readonly<Matrix2>;

/* ========================================================================== */
/* Helper Functions                                                           */
/* ========================================================================== */

/**
 * Permanently freezes a {@link Matrix2} instance so it can no longer be mutated
 *
 * @remarks
 * - The returned object keeps its original reference; no new memory is allocated.
 * - In strict mode any subsequent attempt to modify components throws a TypeError.
 *
 * @param matrix - The Matrix2 object to freeze
 * @returns The same instance, now typed as ReadonlyMatrix2
 *
 * @example
 * ```typescript
 * const IDENTITY = freezeMatrix2(new Matrix2(1, 0, 0, 1));
 * IDENTITY.m00 = 5; // Throws in strict mode
 * ```
 *
 * @category Helpers
 * @since 0.6.0
 */
export function freezeMatrix2(matrix: Matrix2): ReadonlyMatrix2 {
 return Object.freeze(matrix);
}

/**
 * Re-export type guard for a plain object that looks like a 2x2 matrix
 * @category Helpers
 * @since 0.6.0
 */
export { isMatrix2Like } from '../types';

/* ========================================================================== */
/* Class: Matrix2                                                             */
/* ========================================================================== */

/**
 * Column-major 2×2 matrix suitable for WebGL and physics calculations
 *
 * @remarks
 * - **Design:** 2×2 column-major matrix stored as `(m00, m01, m10, m11)`. Instance methods
 *   are mutable and chainable; static methods are pure with alloc-free overloads via `out`.
 * - **Numerics:** Deterministic for cross-platform reproducibility. Determinant uses
 *   exact floating-point arithmetic.
 * - **Safety:** "Safe" variants return identity/zero matrix instead of throwing on
 *   singular matrices.
 *
 * @example
 * ```typescript
 * // Static (pure, allocation-controlled)
 * const product = Matrix2.multiply(a, b);
 * const inv = Matrix2.inverse(m);
 *
 * // Instance (mutable, chainable)
 * matrix.multiply(other).transpose();
 * ```
 *
 * @category Core
 * @since 0.6.0
 */
export class Matrix2 implements Matrix2Like {
 /* ======================================================================== */
 /* Private Helpers                                                          */
 /* ======================================================================== */

 private static ensureOut(out?: Matrix2): Matrix2 {
  return out ?? new Matrix2();
 }

 /* ======================================================================== */
 /* Static Constants (Immutable)                                             */
 /* ======================================================================== */

 /**
  * Identity matrix (no transformation)
  * @category Constant
  * @since 0.6.0
  */
 public static readonly IDENTITY = /* @__PURE__ */ freezeMatrix2(
  /* @__PURE__ */ new Matrix2(1, 0, 0, 1),
 );

 /**
  * Number of elements when serialized to an array
  * @category Constant
  * @since 0.7.0
  */
 public static readonly ELEMENT_COUNT = 4;

 /**
  * Zero matrix
  * @category Constant
  * @since 0.6.0
  */
 public static readonly ZERO = /* @__PURE__ */ freezeMatrix2(
  /* @__PURE__ */ new Matrix2(0, 0, 0, 0),
 );

 /**
  * 90° counter-clockwise rotation.
  * @category Constant
  * @since 0.6.0
  */
 public static readonly ROTATE_90 = /* @__PURE__ */ freezeMatrix2(
  /* @__PURE__ */ new Matrix2(0, 1, -1, 0),
 );

 /**
  * 180° rotation (same as FLIP_XY).
  * @category Constant
  * @since 0.6.0
  */
 public static readonly ROTATE_180 = /* @__PURE__ */ freezeMatrix2(
  /* @__PURE__ */ new Matrix2(-1, 0, 0, -1),
 );

 /**
  * 270° counter-clockwise rotation (same as 90° clockwise).
  * @category Constant
  * @since 0.6.0
  */
 public static readonly ROTATE_270 = /* @__PURE__ */ freezeMatrix2(
  /* @__PURE__ */ new Matrix2(0, -1, 1, 0),
 );

 /**
  * Flip horizontally (mirror across Y axis)
  * @category Constant
  * @since 0.7.0
  */
 public static readonly FLIP_X = /* @__PURE__ */ freezeMatrix2(
  /* @__PURE__ */ new Matrix2(-1, 0, 0, 1),
 );

 /**
  * Flip vertically (mirror across X axis)
  * @category Constant
  * @since 0.7.0
  */
 public static readonly FLIP_Y = /* @__PURE__ */ freezeMatrix2(
  /* @__PURE__ */ new Matrix2(1, 0, 0, -1),
 );

 /**
  * Flip both axes (same as ROTATE_180)
  * @category Constant
  * @since 0.7.0
  */
 public static readonly FLIP_XY = /* @__PURE__ */ freezeMatrix2(
  /* @__PURE__ */ new Matrix2(-1, 0, 0, -1),
 );

 /* ======================================================================== */
 /* Static Factories                                                         */
 /* ======================================================================== */

 /**
  * Creates a matrix from explicit components
  *
  * @param m00 - Component at row 0, column 0
  * @param m01 - Component at row 1, column 0
  * @param m10 - Component at row 0, column 1
  * @param m11 - Component at row 1, column 1
  * @param out - Optional output matrix
  * @returns A Matrix2 with the specified components
  *
  * @example
  * ```typescript
  * // Column-major: (m00, m01, m10, m11)
  * const m = Matrix2.fromValues(1, 0, 0, 1); // identity matrix
  *
  * // Reuse an existing matrix to avoid allocation
  * const out = new Matrix2();
  * Matrix2.fromValues(2, 0, 0, 3, out);
  * ```
  *
  * @category Factory
  * @since 0.6.0
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
  * Creates a deep copy of a matrix
  *
  * @param source - Matrix to clone
  * @param out - Optional output matrix
  * @returns A Matrix2 with identical components
  *
  * @example
  * ```typescript
  * const original = Matrix2.fromValues(1, 2, 3, 4);
  * const cloned = Matrix2.clone(original);
  *
  * // Reuse an existing matrix
  * const out = new Matrix2();
  * Matrix2.clone(original, out);
  * ```
  *
  * @category Factory
  * @since 0.6.0
  */
 public static clone(source: ReadonlyMatrix2Like, out?: Matrix2): Matrix2 {
  return Matrix2.ensureOut(out).set(source.m00, source.m01, source.m10, source.m11);
 }

 /**
  * Copies component values from source into destination (alloc-free)
  *
  * @param source - Source matrix
  * @param destination - Target matrix to receive the copy
  * @returns The destination matrix
  *
  * @example
  * ```typescript
  * const source = Matrix2.fromValues(1, 2, 3, 4);
  * const destination = new Matrix2();
  * Matrix2.copy(source, destination); // destination now holds (1, 2, 3, 4)
  * ```
  *
  * @category Factory
  * @since 0.6.0
  */
 public static copy(source: ReadonlyMatrix2Like, destination: Matrix2): Matrix2 {
  return destination.set(source.m00, source.m01, source.m10, source.m11);
 }

 /**
  * Creates a matrix from a plain object `{ m00, m01, m10, m11 }`
  *
  * @param object - Plain object with matrix components
  * @param out - Optional output matrix
  * @returns A Matrix2 with the object's components
  *
  * @example
  * ```typescript
  * const m = Matrix2.fromObject({ m00: 1, m01: 0, m10: 0, m11: 1 }); // identity matrix
  *
  * // Reuse an existing matrix
  * const out = new Matrix2();
  * Matrix2.fromObject({ m00: 2, m01: 0, m10: 0, m11: 3 }, out);
  * ```
  *
  * @category Factory
  * @since 0.6.0
  */
 public static fromObject(object: ReadonlyMatrix2Like, out?: Matrix2): Matrix2 {
  return Matrix2.ensureOut(out).set(object.m00, object.m01, object.m10, object.m11);
 }

 /**
  * Creates a matrix from a rotation
  *
  * @remarks
  * Accepts any object with `cos` and `sin` properties, including:
  * - {@link Rotation2} instances
  * - Plain objects `{ cos, sin }`
  * - Results from `sinCos(angle)`
  *
  * @param rotation - Rotation object (with cos/sin properties) or angle in radians
  * @param out - Optional output matrix
  * @returns Rotation matrix
  *
  * @example
  * ```typescript
  * // From angle
  * const mat1 = Matrix2.fromRotation(Math.PI / 3);
  *
  * // From Rotation2Like
  * const mat2 = Matrix2.fromRotation({ cos: 0.5, sin: 0.866 });
  *
  * // From sinCos result
  * const mat3 = Matrix2.fromRotation(sinCos(Math.PI / 4));
  * ```
  *
  * @category Factory
  * @since 0.6.0
  */
 public static fromRotation(rotation: ReadonlyRotation2Like | number, out?: Matrix2): Matrix2 {
  if (typeof rotation === 'number') {
   const { cos, sin } = sinCos(rotation);
   return Matrix2.ensureOut(out).set(cos, sin, -sin, cos);
  }

  return Matrix2.ensureOut(out).set(rotation.cos, rotation.sin, -rotation.sin, rotation.cos);
 }

 /**
  * Creates a scaling matrix
  *
  * @param scale - Scale factors as Vector2 or uniform scale
  * @param out - Optional output matrix
  * @returns Scale matrix
  *
  * @example
  * ```typescript
  * const mat1 = Matrix2.fromScale(new Vector2(2, 3));
  * const mat2 = Matrix2.fromScale(2); // Uniform scale
  * ```
  *
  * @category Factory
  * @since 0.6.0
  */
 public static fromScale(scale: ReadonlyVector2Like | number, out?: Matrix2): Matrix2 {
  if (typeof scale === 'number') {
   return Matrix2.ensureOut(out).set(scale, 0, 0, scale);
  }

  return Matrix2.ensureOut(out).set(scale.x, 0, 0, scale.y);
 }

 /**
  * Creates a combined rotation + scale matrix in a single pass
  *
  * @remarks
  * Equivalent to `Matrix2.multiply(Matrix2.fromRotation(angle), Matrix2.fromScale({x: scaleX, y: scaleY}))`
  * but avoids intermediate allocation and is more precise.
  * Result: `[cos*sx, -sin*sy; sin*sx, cos*sy]`
  *
  * @param angle - Rotation angle in radians
  * @param scaleX - Horizontal scale factor
  * @param scaleY - Vertical scale factor
  * @param out - Optional output matrix
  * @returns Combined rotation and scale matrix
  *
  * @example
  * ```typescript
  * const mat = Matrix2.fromAngleScale(Math.PI / 4, 2, 3);
  * ```
  *
  * @category Factory
  * @since 0.7.0
  */
 public static fromAngleScale(
  angle: number,
  scaleX: number,
  scaleY: number,
  out?: Matrix2,
 ): Matrix2 {
  const sc = sinCos(angle);

  return Matrix2.ensureOut(out).set(
   sc.cos * scaleX,
   sc.sin * scaleX,
   -sc.sin * scaleY,
   sc.cos * scaleY,
  );
 }

 /**
  * Creates a shearing matrix
  *
  * @param shear - Shear factors as Vector2 (x=horizontal, y=vertical)
  * @param out - Optional output matrix
  * @returns Shear matrix
  *
  * @example
  * ```typescript
  * const mat = Matrix2.fromShear(new Vector2(0.5, 0));
  * ```
  *
  * @category Factory
  * @since 0.6.0
  */
 public static fromShear(shear: ReadonlyVector2Like, out?: Matrix2): Matrix2 {
  return Matrix2.ensureOut(out).set(1, shear.y, shear.x, 1);
 }

 /**
  * Creates a matrix from column vectors
  *
  * @param col0 - First column
  * @param col1 - Second column
  * @param out - Optional output matrix
  * @returns Matrix with specified columns
  *
  * @example
  * ```typescript
  * const col0 = { x: 1, y: 0 };
  * const col1 = { x: 0, y: 1 };
  * const m = Matrix2.fromColumns(col0, col1); // identity matrix
  *
  * // Reuse an existing matrix
  * const out = new Matrix2();
  * Matrix2.fromColumns(col0, col1, out);
  * ```
  *
  * @category Factory
  * @since 0.6.0
  */
 public static fromColumns(
  col0: ReadonlyVector2Like,
  col1: ReadonlyVector2Like,
  out?: Matrix2,
 ): Matrix2 {
  return Matrix2.ensureOut(out).set(col0.x, col0.y, col1.x, col1.y);
 }

 /**
  * Creates a matrix from row vectors
  *
  * @param row0 - First row
  * @param row1 - Second row
  * @param out - Optional output matrix
  * @returns Matrix with specified rows
  *
  * @example
  * ```typescript
  * const row0 = { x: 1, y: 0 };
  * const row1 = { x: 0, y: 1 };
  * const m = Matrix2.fromRows(row0, row1); // identity matrix
  *
  * // Reuse an existing matrix
  * const out = new Matrix2();
  * Matrix2.fromRows(row0, row1, out);
  * ```
  *
  * @category Factory
  * @since 0.6.0
  */
 public static fromRows(
  row0: ReadonlyVector2Like,
  row1: ReadonlyVector2Like,
  out?: Matrix2,
 ): Matrix2 {
  return Matrix2.ensureOut(out).set(row0.x, row1.x, row0.y, row1.y);
 }

 /**
  * Creates a matrix from an array
  *
  * @param array - Array with matrix elements
  * @param offset - Starting index. @defaultValue `0`
  * @param columnMajor - If true, array is column-major. @defaultValue `true`
  * @param out - Optional output matrix
  * @returns Matrix with components from the array
  * @throws {RangeError} If offset is out of bounds
  *
  * @example
  * ```typescript
  * // Column-major array (default)
  * const m = Matrix2.fromArray([1, 0, 0, 1]); // identity matrix
  *
  * // Row-major array with offset
  * const out = new Matrix2();
  * Matrix2.fromArray([0, 0, 2, 0, 0, 3], 2, false, out);
  * ```
  *
  * @category Factory
  * @since 0.6.0
  */
 public static fromArray(
  array: ArrayLike<number>,
  offset = 0,
  columnMajor = true,
  out?: Matrix2,
 ): Matrix2 {
  if (offset < 0 || offset + Matrix2.ELEMENT_COUNT > array.length) {
   throw new RangeError(
    `Matrix2.fromArray: offset ${offset} out of bounds for array length ${array.length}`,
   );
  }

  // Neutral indices: the logical position depends on `columnMajor` — avoid
  // misleading `m00`/`m01` locals that would imply a specific storage layout
  // before the flag branches below.
  const a0 = array[offset]!;
  const a1 = array[offset + 1]!;
  const a2 = array[offset + 2]!;
  const a3 = array[offset + 3]!;

  if (columnMajor) {
   // Column-major input: [m00, m01, m10, m11] — direct mapping.
   return Matrix2.ensureOut(out).set(a0, a1, a2, a3);
  }

  // Row-major input: [m00, m10, m01, m11] — swap the middle pair on assignment.
  return Matrix2.ensureOut(out).set(a0, a2, a1, a3);
 }

 /**
  * Creates a matrix from another matrix-like object
  *
  * @param matrix - Source matrix
  * @param out - Optional output matrix
  * @returns Matrix with copied components
  *
  * @example
  * ```typescript
  * const source: Matrix2Like = { m00: 1, m01: 2, m10: 3, m11: 4 };
  * const m = Matrix2.fromMatrix2(source);
  *
  * // Reuse an existing matrix
  * const out = new Matrix2();
  * Matrix2.fromMatrix2(source, out);
  * ```
  *
  * @category Factory
  * @since 0.6.0
  */
 public static fromMatrix2(matrix: ReadonlyMatrix2Like, out?: Matrix2): Matrix2 {
  return Matrix2.ensureOut(out).set(matrix.m00, matrix.m01, matrix.m10, matrix.m11);
 }

 /**
  * Creates a diagonal matrix from a vector
  *
  * @remarks
  * Produces the matrix `[diagonal.x, 0; 0, diagonal.y]`.
  * This is equivalent to {@link fromScale} with a vector argument but
  * provides a more explicit name for linear-algebra contexts.
  *
  * @param diagonal - Diagonal elements as a vector
  * @param out - Optional output matrix
  * @returns Diagonal matrix
  *
  * @example
  * ```typescript
  * const m = Matrix2.fromDiagonal({ x: 2, y: 3 });
  * // → [2, 0; 0, 3]
  * ```
  *
  * @category Factory
  * @since 0.7.0
  */
 public static fromDiagonal(diagonal: ReadonlyVector2Like, out?: Matrix2): Matrix2 {
  return Matrix2.ensureOut(out).set(diagonal.x, 0, 0, diagonal.y);
 }

 /**
  * Creates a reflection (Householder) matrix about a line through the origin
  *
  * @remarks
  * Uses the Householder formula `I - 2nnᵀ` where `n` is the unit normal of
  * the reflection line. The caller must ensure `unitNormal` is normalized;
  * no internal normalization is performed.
  *
  * @param unitNormal - Unit normal of the reflection line (must be normalized)
  * @param out - Optional output matrix
  * @returns Reflection matrix
  *
  * @example
  * ```typescript
  * // Reflect about Y-axis (normal = (1, 0)) — negates x-coordinates
  * const reflectY = Matrix2.fromReflection({ x: 1, y: 0 });
  *
  * // Reflect about X-axis (normal = (0, 1)) — negates y-coordinates
  * const reflectX = Matrix2.fromReflection({ x: 0, y: 1 });
  * ```
  *
  * @category Factory
  * @since 0.7.0
  */
 public static fromReflection(unitNormal: ReadonlyVector2Like, out?: Matrix2): Matrix2 {
  const nx = unitNormal.x;
  const ny = unitNormal.y;
  // DEV-mode guard: Householder reflection requires |n| = 1; non-unit normal
  // silently produces a non-orthogonal matrix. Stripped in production via DCE.
  if (__LENGUADOS_DEV__) {
   assertRotation2Normalized(nx, ny, EPSILON, 'Matrix2.fromReflection:unitNormal');
  }
  return Matrix2.ensureOut(out).set(1 - 2 * nx * nx, -2 * nx * ny, -2 * nx * ny, 1 - 2 * ny * ny);
 }

 /**
  * Builds the outer product matrix `u ⊗ v` where `M[i, j] = u[i] · v[j]`
  *
  * @remarks
  * Standard linear-algebra rank-1 update (BLAS `ger`). Column-major entries:
  * `(u.x·v.x, u.y·v.x, u.x·v.y, u.y·v.y)`. Composes with {@link fromReflection}:
  * `fromReflection(n) = I − 2 · (n ⊗ n)` when `|n| = 1`.
  *
  * @param u - Left operand vector
  * @param v - Right operand vector
  * @param out - Optional output matrix
  * @returns Outer product matrix
  *
  * @category Factory
  * @since 0.7.0
  */
 public static fromOuterProduct(
  u: ReadonlyVector2Like,
  v: ReadonlyVector2Like,
  out?: Matrix2,
 ): Matrix2 {
  return Matrix2.ensureOut(out).set(u.x * v.x, u.y * v.x, u.x * v.y, u.y * v.y);
 }

 /* ======================================================================== */
 /* Static Arithmetic                                                        */
 /* ======================================================================== */

 /**
  * Component-wise addition of two matrices
  *
  * @param a - First addend
  * @param b - Second addend
  * @param out - Optional output matrix
  * @returns Matrix with components `(a.mXX + b.mXX)`
  *
  * @category Arithmetic
  * @since 0.6.0
  */
 public static add(a: ReadonlyMatrix2Like, b: ReadonlyMatrix2Like, out?: Matrix2): Matrix2 {
  return Matrix2.ensureOut(out).set(a.m00 + b.m00, a.m01 + b.m01, a.m10 + b.m10, a.m11 + b.m11);
 }

 /**
  * Component-wise subtraction of two matrices
  *
  * @param a - Minuend
  * @param b - Subtrahend
  * @param out - Optional output matrix
  * @returns Matrix with components `(a.mXX - b.mXX)`
  *
  * @category Arithmetic
  * @since 0.6.0
  */
 public static subtract(a: ReadonlyMatrix2Like, b: ReadonlyMatrix2Like, out?: Matrix2): Matrix2 {
  return Matrix2.ensureOut(out).set(a.m00 - b.m00, a.m01 - b.m01, a.m10 - b.m10, a.m11 - b.m11);
 }

 /**
  * Multiplies two matrices
  *
  * @param a - First matrix
  * @param b - Second matrix
  * @param out - Optional output matrix
  * @returns Product matrix a × b
  *
  * @example
  * ```typescript
  * const rot = Matrix2.fromRotation(Math.PI / 2); // 90° rotation
  * const scl = Matrix2.fromScale(2);               // uniform scale
  * const combined = Matrix2.multiply(rot, scl);   // scale then rotate
  * ```
  *
  * @category Arithmetic
  * @since 0.6.0
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
  * Multiplies all matrix components by a scalar
  *
  * @param matrix - Input matrix
  * @param scalar - Scalar multiplier
  * @param out - Optional output matrix
  * @returns Matrix with all components multiplied by scalar
  *
  * @category Arithmetic
  * @since 0.6.0
  */
 public static multiplyScalar(matrix: ReadonlyMatrix2Like, scalar: number, out?: Matrix2): Matrix2 {
  return Matrix2.ensureOut(out).set(
   matrix.m00 * scalar,
   matrix.m01 * scalar,
   matrix.m10 * scalar,
   matrix.m11 * scalar,
  );
 }

 /**
  * Adds a scalar to all matrix components
  *
  * @param matrix - Input matrix
  * @param scalar - Scalar to add
  * @param out - Optional output matrix
  * @returns Matrix with scalar added to all components
  *
  * @category Arithmetic
  * @since 0.7.0
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
  * Subtracts a scalar from all matrix components
  *
  * @param matrix - Input matrix
  * @param scalar - Scalar to subtract
  * @param out - Optional output matrix
  * @returns Matrix with scalar subtracted from all components
  *
  * @category Arithmetic
  * @since 0.7.0
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
  * Fused multiply-add: `a * scalar + b`
  *
  * @remarks
  * More efficient than separate multiplyScalar and add operations.
  *
  * @param a - Input matrix
  * @param scalar - Scalar multiplier
  * @param b - Matrix to add
  * @param out - Optional output matrix
  * @returns Matrix equal to `a * scalar + b`
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 public static fma(
  a: ReadonlyMatrix2Like,
  scalar: number,
  b: ReadonlyMatrix2Like,
  out?: Matrix2,
 ): Matrix2 {
  return Matrix2.ensureOut(out).set(
   a.m00 * scalar + b.m00,
   a.m01 * scalar + b.m01,
   a.m10 * scalar + b.m10,
   a.m11 * scalar + b.m11,
  );
 }

 /**
  * Divides all matrix components by a scalar (strict)
  *
  * @remarks
  * For safe division that returns zeros, use {@link divideScalarSafe}.
  * For hot paths, use {@link divideScalarUnchecked}.
  *
  * @param matrix - Input matrix
  * @param scalar - Scalar divisor
  * @param out - Optional output matrix
  * @returns Matrix with all components divided by scalar
  * @throws {RangeError} If scalar is near zero
  *
  * @example
  * ```typescript
  * Matrix2.divideScalar(new Matrix2(4, 6, 8, 10), 2); // Matrix2(2, 3, 4, 5)
  * Matrix2.divideScalar(new Matrix2(1, 2, 3, 4), 0);  // throws RangeError
  * ```
  *
  * @see {@link divideScalarSafe} - Returns fallback zero matrix for near-zero divisor
  * @see {@link divideScalarUnchecked} - No validation
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 public static divideScalar(matrix: ReadonlyMatrix2Like, scalar: number, out?: Matrix2): Matrix2 {
  if (isNearZero(scalar)) {
   throw new RangeError('Matrix2.divideScalar: cannot divide by zero or near-zero scalar');
  }
  const inv = 1 / scalar;
  return Matrix2.ensureOut(out).set(
   matrix.m00 * inv,
   matrix.m01 * inv,
   matrix.m10 * inv,
   matrix.m11 * inv,
  );
 }

 /**
  * Divides all matrix components by a scalar (safe)
  *
  * @param matrix - Input matrix
  * @param scalar - Scalar divisor
  * @param out - Optional output matrix
  * @returns Matrix with components divided by scalar, or zero matrix if scalar is near zero
  *
  * @example
  * ```typescript
  * Matrix2.divideScalarSafe(new Matrix2(4, 6, 8, 10), 2); // Matrix2(2, 3, 4, 5)
  * Matrix2.divideScalarSafe(new Matrix2(1, 2, 3, 4), 0);  // Matrix2(0, 0, 0, 0)
  * ```
  *
  * @see {@link divideScalar} - Throws for near-zero divisor
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 public static divideScalarSafe(
  matrix: ReadonlyMatrix2Like,
  scalar: number,
  out?: Matrix2,
 ): Matrix2 {
  if (isNearZero(scalar)) {
   return Matrix2.ensureOut(out).zero();
  }
  const inv = 1 / scalar;
  return Matrix2.ensureOut(out).set(
   matrix.m00 * inv,
   matrix.m01 * inv,
   matrix.m10 * inv,
   matrix.m11 * inv,
  );
 }

 /**
  * Divides all matrix components by a scalar (unchecked for hot paths)
  *
  * @remarks
  * **Precondition:** Scalar must be non-zero.
  *
  * @param matrix - Input matrix
  * @param scalar - Scalar divisor (must be non-zero)
  * @param out - Optional output matrix
  * @returns Matrix with components divided by scalar
  *
  * @see {@link divideScalar} - Throws on near-zero divisor
  * @see {@link divideScalarSafe} - Returns fallback on near-zero divisor
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 public static divideScalarUnchecked(
  matrix: ReadonlyMatrix2Like,
  scalar: number,
  out?: Matrix2,
 ): Matrix2 {
  const inv = 1 / scalar;
  return Matrix2.ensureOut(out).set(
   matrix.m00 * inv,
   matrix.m01 * inv,
   matrix.m10 * inv,
   matrix.m11 * inv,
  );
 }

 /**
  * Computes element-wise modulo of two matrices
  *
  * @remarks
  * Uses the positive modulo operation (always returns positive results).
  * Component-wise; delegates each cell to scalar {@link mod} in
  * `auxiliary/scalar/arithmetic`.
  *
  * @param a - Dividend matrix
  * @param b - Divisor matrix
  * @param out - Optional output matrix
  * @returns Result matrix with element-wise modulo
  *
  * @see {@link modScalar} - Divide every cell by the same scalar divisor
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 public static mod(a: ReadonlyMatrix2Like, b: ReadonlyMatrix2Like, out?: Matrix2): Matrix2 {
  return Matrix2.ensureOut(out).set(
   scalarMod(a.m00, b.m00),
   scalarMod(a.m01, b.m01),
   scalarMod(a.m10, b.m10),
   scalarMod(a.m11, b.m11),
  );
 }

 /**
  * Computes scalar modulo on all matrix components
  *
  * @param matrix - Dividend matrix
  * @param scalar - Scalar divisor
  * @param out - Optional output matrix
  * @returns Result matrix with each element modulo scalar
  *
  * @see {@link mod} - Component-wise mod against a divisor matrix
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 public static modScalar(matrix: ReadonlyMatrix2Like, scalar: number, out?: Matrix2): Matrix2 {
  return Matrix2.ensureOut(out).set(
   scalarMod(matrix.m00, scalar),
   scalarMod(matrix.m01, scalar),
   scalarMod(matrix.m10, scalar),
   scalarMod(matrix.m11, scalar),
  );
 }

 /* ------ Static Matrix Operations ------ */

 /**
  * Transposes a matrix (swaps rows and columns)
  *
  * @param matrix - Matrix to transpose
  * @param out - Optional output matrix
  * @returns Transposed matrix
  *
  * @category Matrix Operations
  * @since 0.6.0
  */
 public static transpose(matrix: ReadonlyMatrix2Like, out?: Matrix2): Matrix2 {
  return Matrix2.ensureOut(out).set(matrix.m00, matrix.m10, matrix.m01, matrix.m11);
 }

 /**
  * Inverts a matrix
  *
  * @param matrix - Matrix to invert
  * @param out - Optional output matrix
  * @returns Inverted matrix
  * @throws {RangeError} If matrix is singular (determinant ≈ 0)
  *
  * @example
  * ```typescript
  * Matrix2.inverse(new Matrix2(1, 0, 0, 1)); // Matrix2(1, 0, 0, 1) (identity)
  * Matrix2.inverse(new Matrix2(1, 1, 1, 1)); // throws RangeError (singular)
  * ```
  *
  * @see {@link inverseSafe} - Returns fallback identity for singular matrices
  * @see {@link inverseUnchecked} - No validation
  *
  * @category Matrix Operations
  * @since 0.6.0
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
  * Safe inversion. Returns identity if matrix is singular
  *
  * @remarks
  * Uses {@link isNearZero} with default {@link EPSILON} (1e-10) to test the
  * determinant. Returns identity when |det| ≤ EPSILON.
  *
  * @param matrix - Matrix to invert
  * @param out - Optional output matrix
  * @returns Inverted matrix, or identity if singular
  *
  * @example
  * ```typescript
  * const singular = new Matrix2(1, 1, 1, 1); // det = 0
  * const inv = Matrix2.inverseSafe(singular); // Returns IDENTITY
  * ```
  *
  * @see {@link inverse} - Throws for singular matrices
  *
  * @category Matrix Operations
  * @since 0.6.0
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
  * Unchecked inversion for hot paths
  *
  * **Precondition:** Matrix must be invertible (det ≠ 0).
  * Calling with a singular matrix produces NaN/Infinity components.
  *
  * @param matrix - Matrix to invert (must be non-singular)
  * @param out - Optional output matrix
  * @returns Inverted matrix
  *
  * @see {@link inverse} - Throws on singular matrices
  * @see {@link inverseSafe} - Returns fallback on singular matrices
  *
  * @category Matrix Operations
  * @since 0.7.0
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
  * Calculates the adjugate (adjoint) matrix
  *
  * @remarks
  * The adjugate is the transpose of the cofactor matrix.
  * For a 2x2 matrix [a b; c d], the adjugate is [d -b; -c a].
  *
  * @param matrix - Matrix to calculate adjugate of
  * @param out - Optional output matrix
  * @returns Adjugate matrix
  *
  * @category Matrix Operations
  * @since 0.6.0
  */
 public static adjugate(matrix: ReadonlyMatrix2Like, out?: Matrix2): Matrix2 {
  return Matrix2.ensureOut(out).set(matrix.m11, -matrix.m01, -matrix.m10, matrix.m00);
 }

 /**
  * Solves the 2×2 linear system `Ax = b` using Cramer's rule
  *
  * @remarks
  * Computes `x = (1/det(A)) * [A₁₁·bx − A₁₀·by, A₀₀·by − A₀₁·bx]`.
  *
  * @param matrix - Coefficient matrix A
  * @param b - Right-hand side vector
  * @param out - Optional output vector
  * @returns Solution vector x
  * @throws {RangeError} If matrix is singular (determinant near zero)
  *
  * @example
  * ```typescript
  * // Solve [2 1; 1 3] * x = [5, 7]
  * const A = new Matrix2(2, 1, 1, 3);
  * const b = new Vector2(5, 7);
  * const x = Matrix2.solveLinearSystem(A, b); // → (1.6, 1.8)
  * ```
  *
  * @see {@link solveLinearSystemSafe} - Returns (0,0) instead of throwing
  * @see {@link solveLinearSystemUnchecked} - No validation, for hot paths
  *
  * @category Matrix Operations
  * @since 0.6.0
  */
 public static solveLinearSystem(
  matrix: ReadonlyMatrix2Like,
  b: ReadonlyVector2Like,
  out?: Vector2,
 ): Vector2 {
  const det = matrix.m00 * matrix.m11 - matrix.m01 * matrix.m10;
  if (isNearZero(det)) {
   throw new RangeError('Matrix2.solveLinearSystem: singular matrix (determinant near zero)');
  }
  const invDet = 1 / det;
  return Vector2.fromValues(
   (matrix.m11 * b.x - matrix.m10 * b.y) * invDet,
   (matrix.m00 * b.y - matrix.m01 * b.x) * invDet,
   out,
  );
 }

 /**
  * Safe linear system solve. Returns (0,0) if matrix is singular
  *
  * @remarks
  * Uses {@link isNearZero} with default {@link EPSILON} (1e-10) to test the
  * determinant. Returns the zero vector when |det| ≤ EPSILON.
  *
  * @param matrix - Coefficient matrix A
  * @param b - Right-hand side vector
  * @param out - Optional output vector
  * @returns Solution vector, or (0,0) if singular
  *
  * @see {@link solveLinearSystem} - Throws for singular matrices
  *
  * @category Matrix Operations
  * @since 0.6.0
  */
 public static solveLinearSystemSafe(
  matrix: ReadonlyMatrix2Like,
  b: ReadonlyVector2Like,
  out?: Vector2,
 ): Vector2 {
  const det = matrix.m00 * matrix.m11 - matrix.m01 * matrix.m10;
  if (isNearZero(det)) {
   return Vector2.fromValues(0, 0, out);
  }
  const invDet = 1 / det;
  return Vector2.fromValues(
   (matrix.m11 * b.x - matrix.m10 * b.y) * invDet,
   (matrix.m00 * b.y - matrix.m01 * b.x) * invDet,
   out,
  );
 }

 /**
  * Unchecked linear system solve for hot paths
  *
  * @remarks
  * **Precondition:** Matrix must be non-singular (det ≠ 0).
  * Calling with a singular matrix produces NaN/Infinity components.
  *
  * @param matrix - Coefficient matrix A (must be non-singular)
  * @param b - Right-hand side vector
  * @param out - Optional output vector
  * @returns Solution vector
  *
  * @see {@link solveLinearSystem} - Throws on singular matrices
  * @see {@link solveLinearSystemSafe} - Returns fallback on singular matrices
  *
  * @category Matrix Operations
  * @since 0.7.0
  */
 public static solveLinearSystemUnchecked(
  matrix: ReadonlyMatrix2Like,
  b: ReadonlyVector2Like,
  out?: Vector2,
 ): Vector2 {
  const invDet = 1 / (matrix.m00 * matrix.m11 - matrix.m01 * matrix.m10);
  return Vector2.fromValues(
   (matrix.m11 * b.x - matrix.m10 * b.y) * invDet,
   (matrix.m00 * b.y - matrix.m01 * b.x) * invDet,
   out,
  );
 }

 /**
  * Negates all elements of a matrix
  *
  * @param matrix - Matrix to negate
  * @param out - Optional output matrix
  * @returns Negated matrix
  *
  * @example
  * ```typescript
  * const m = new Matrix2(1, 2, 3, 4);
  * const neg = Matrix2.negate(m);
  * // neg = Matrix2(-1, -2, -3, -4)
  * ```
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 public static negate(matrix: ReadonlyMatrix2Like, out?: Matrix2): Matrix2 {
  return Matrix2.ensureOut(out).set(-matrix.m00, -matrix.m01, -matrix.m10, -matrix.m11);
 }

 /* ======================================================================== */
 /* Static Transforms                                                        */
 /* ======================================================================== */

 /**
  * Applies Math.floor to all matrix elements
  *
  * @param matrix - Input matrix
  * @param out - Optional output matrix
  * @returns Matrix with floored elements
  *
  * @category Transform
  * @since 0.6.0
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
  * Applies Math.ceil to all matrix elements
  *
  * @param matrix - Input matrix
  * @param out - Optional output matrix
  * @returns Matrix with ceiled elements
  *
  * @category Transform
  * @since 0.6.0
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
  * Applies Math.round to all matrix elements
  *
  * @param matrix - Input matrix
  * @param out - Optional output matrix
  * @returns Matrix with rounded elements
  *
  * @category Transform
  * @since 0.6.0
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
  * Applies Math.trunc to all matrix elements (rounds towards zero)
  *
  * @param matrix - Input matrix
  * @param out - Optional output matrix
  * @returns Truncated matrix
  *
  * @category Transform
  * @since 0.7.0
  */
 public static trunc(matrix: ReadonlyMatrix2Like, out?: Matrix2): Matrix2 {
  return Matrix2.ensureOut(out).set(
   Math.trunc(matrix.m00),
   Math.trunc(matrix.m01),
   Math.trunc(matrix.m10),
   Math.trunc(matrix.m11),
  );
 }

 /**
  * Applies absolute value to all matrix elements
  *
  * @param matrix - Input matrix
  * @param out - Optional output matrix
  * @returns Matrix with absolute values
  *
  * @category Transform
  * @since 0.6.0
  */
 public static abs(matrix: ReadonlyMatrix2Like, out?: Matrix2): Matrix2 {
  return Matrix2.ensureOut(out).set(
   Math.abs(matrix.m00),
   Math.abs(matrix.m01),
   Math.abs(matrix.m10),
   Math.abs(matrix.m11),
  );
 }

 /**
  * Applies sign function to all matrix elements
  *
  * @param matrix - Input matrix
  * @param out - Optional output matrix
  * @returns Matrix with signs (-1, 0, or 1)
  *
  * @category Transform
  * @since 0.7.0
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
  * Component-wise minimum of two matrices
  *
  * @param a - First matrix
  * @param b - Second matrix
  * @param out - Optional output matrix
  * @returns Matrix with per-component minima
  *
  * @category Transform
  * @since 0.7.0
  */
 public static min(a: ReadonlyMatrix2Like, b: ReadonlyMatrix2Like, out?: Matrix2): Matrix2 {
  return Matrix2.ensureOut(out).set(
   Math.min(a.m00, b.m00),
   Math.min(a.m01, b.m01),
   Math.min(a.m10, b.m10),
   Math.min(a.m11, b.m11),
  );
 }

 /**
  * Component-wise maximum of two matrices
  *
  * @param a - First matrix
  * @param b - Second matrix
  * @param out - Optional output matrix
  * @returns Matrix with per-component maxima
  *
  * @category Transform
  * @since 0.7.0
  */
 public static max(a: ReadonlyMatrix2Like, b: ReadonlyMatrix2Like, out?: Matrix2): Matrix2 {
  return Matrix2.ensureOut(out).set(
   Math.max(a.m00, b.m00),
   Math.max(a.m01, b.m01),
   Math.max(a.m10, b.m10),
   Math.max(a.m11, b.m11),
  );
 }

 /**
  * Clamps all matrix components between min and max matrices
  *
  * @param matrix - Matrix to clamp
  * @param minM - Per-component minima
  * @param maxM - Per-component maxima
  * @param out - Optional output matrix
  * @returns Clamped matrix
  *
  * @category Transform
  * @since 0.7.0
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
  * Clamps all matrix components between scalar min and max
  *
  * @param matrix - Matrix to clamp
  * @param min - Minimum scalar
  * @param max - Maximum scalar
  * @param out - Optional output matrix
  * @returns Clamped matrix
  *
  * @category Transform
  * @since 0.7.0
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
  * Linear interpolation between two matrices (unclamped)
  *
  * @remarks
  * The interpolation factor `t` is NOT clamped — values outside [0, 1] will
  * extrapolate beyond the input matrices. Use {@link lerpClamped} to clamp.
  * Component-wise lerp between rotation matrices does not produce a valid
  * rotation matrix. Use {@link Rotation2.lerp} for interpolating rotations.
  *
  * @param a - Start matrix
  * @param b - End matrix
  * @param t - Interpolation factor (unclamped, allows extrapolation)
  * @param out - Optional output matrix
  * @returns Interpolated matrix
  *
  * @example
  * ```typescript
  * const a = Matrix2.IDENTITY;
  * const b = Matrix2.fromRotation(Math.PI / 2);
  * const mid = Matrix2.lerp(a, b, 0.5);
  * ```
  *
  * @category Interpolation
  * @since 0.7.0
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
  * Clamped linear interpolation
  *
  * @remarks
  * Clamps `t` to [0, 1] before delegating to {@link lerp}.
  *
  * @param a - Start matrix
  * @param b - End matrix
  * @param t - Interpolation factor (clamped to [0, 1] before interpolation)
  * @param out - Optional output matrix
  * @returns Interpolated matrix
  *
  * @category Interpolation
  * @since 0.7.0
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
  * Smooth step interpolation between two matrices
  *
  * @remarks
  * Uses the smoothstep formula: 3t² - 2t³
  *
  * @param a - Start matrix
  * @param b - End matrix
  * @param t - Interpolation factor [0, 1]
  * @param out - Optional output matrix
  * @returns Smoothly interpolated matrix
  *
  * @category Interpolation
  * @since 0.7.0
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
 /* Static Comparison                                                        */
 /* ======================================================================== */

 /**
  * Exact component-wise equality (bit-identical)
  *
  * @remarks
  * Use {@link nearEquals} for comparing results of floating-point operations.
  *
  * @param a - First matrix
  * @param b - Second matrix
  * @returns True if all components are exactly identical
  *
  * @category Comparison
  * @since 0.6.0
  */
 public static exactEquals(a: ReadonlyMatrix2Like, b: ReadonlyMatrix2Like): boolean {
  return a.m00 === b.m00 && a.m01 === b.m01 && a.m10 === b.m10 && a.m11 === b.m11;
 }

 /**
  * Approximate component-wise equality using relative tolerance
  *
  * @remarks
  * Uses relative tolerance: `|a - b| <= epsilon * max(1, |a|, |b|)` per component.
  * This scales with value magnitude, making it robust for both small and large values.
  *
  * @param a - First matrix
  * @param b - Second matrix
  * @param epsilon - Relative tolerance. @defaultValue `EPSILON`
  * @returns True if all component differences are within scaled epsilon
  *
  * @category Comparison
  * @since 0.6.0
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
  * Tests if a matrix is the identity matrix
  *
  * @remarks
  * Uses {@link EPSILON} (1e-10) as default tolerance. Diagonal elements are
  * compared to 1 via absolute tolerance; off-diagonal elements are compared to 0.
  *
  * @param matrix - Matrix to test
  * @param epsilon - Tolerance. @defaultValue `EPSILON`
  * @returns True if matrix is identity
  *
  * @category Comparison
  * @since 0.6.0
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
  * Tests if a matrix is exactly zero
  *
  * @param matrix - Matrix to test
  * @returns True if all components are zero
  *
  * @category Comparison
  * @since 0.7.0
  */
 public static isZero(matrix: ReadonlyMatrix2Like): boolean {
  return matrix.m00 === 0 && matrix.m01 === 0 && matrix.m10 === 0 && matrix.m11 === 0;
 }

 /**
  * Tests if a matrix is approximately zero
  *
  * @param matrix - Matrix to test
  * @param epsilon - Tolerance. @defaultValue `EPSILON`
  * @returns True if all components are within epsilon of zero
  *
  * @category Comparison
  * @since 0.7.0
  */
 public static isNearZero(matrix: ReadonlyMatrix2Like, epsilon: number = EPSILON): boolean {
  return (
   isNearZero(matrix.m00, epsilon) &&
   isNearZero(matrix.m01, epsilon) &&
   isNearZero(matrix.m10, epsilon) &&
   isNearZero(matrix.m11, epsilon)
  );
 }

 /**
  * Tests if all components are finite numbers
  *
  * @param matrix - Matrix to test
  * @returns True if all components are finite
  *
  * @category Comparison
  * @since 0.6.0
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
  * Tests if any component is NaN
  *
  * @param matrix - Matrix to test
  * @returns True if any component is NaN
  *
  * @category Comparison
  * @since 0.7.0
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
  * Tests if any component is infinite (±Infinity)
  *
  * @remarks
  * Distinguishes infinity from NaN. Use {@link isFinite} to check for both.
  *
  * @param matrix - Matrix to test
  * @returns True if any component is ±Infinity
  *
  * @category Comparison
  * @since 0.7.0
  */
 public static hasInfinity(matrix: ReadonlyMatrix2Like): boolean {
  const isInf = (v: number) => !Number.isFinite(v) && !Number.isNaN(v);
  return isInf(matrix.m00) || isInf(matrix.m01) || isInf(matrix.m10) || isInf(matrix.m11);
 }

 /**
  * Tests if a matrix is symmetric (m01 ≈ m10)
  *
  * @remarks
  * Uses relative tolerance for comparing off-diagonal elements.
  *
  * @param matrix - Matrix to test
  * @param epsilon - Relative tolerance. @defaultValue `EPSILON`
  * @returns True if matrix is symmetric
  *
  * @category Comparison
  * @since 0.7.0
  */
 public static isSymmetric(matrix: ReadonlyMatrix2Like, epsilon: number = EPSILON): boolean {
  return relativeEquals(matrix.m01, matrix.m10, epsilon);
 }

 /**
  * Tests if a matrix is skew-symmetric (m00 ≈ 0, m11 ≈ 0, m01 ≈ -m10)
  *
  * @remarks
  * Uses relative tolerance for comparing off-diagonal elements.
  *
  * @param matrix - Matrix to test
  * @param epsilon - Tolerance. @defaultValue `EPSILON`
  * @returns True if matrix is skew-symmetric
  *
  * @category Comparison
  * @since 0.7.0
  */
 public static isSkewSymmetric(matrix: ReadonlyMatrix2Like, epsilon: number = EPSILON): boolean {
  return (
   isNearZero(matrix.m00, epsilon) &&
   isNearZero(matrix.m11, epsilon) &&
   relativeEquals(matrix.m01, -matrix.m10, epsilon)
  );
 }

 /**
  * Tests if a matrix is diagonal (off-diagonal elements ≈ 0)
  *
  * @param matrix - Matrix to test
  * @param epsilon - Tolerance. @defaultValue `EPSILON`
  * @returns True if matrix is diagonal
  *
  * @category Comparison
  * @since 0.7.0
  */
 public static isDiagonal(matrix: ReadonlyMatrix2Like, epsilon: number = EPSILON): boolean {
  return isNearZero(matrix.m01, epsilon) && isNearZero(matrix.m10, epsilon);
 }

 /**
  * Tests if a matrix is invertible (determinant ≠ 0)
  *
  * @remarks
  * A matrix is invertible when its determinant is non-zero.
  * Uses {@link EPSILON} tolerance for the near-zero check.
  *
  * @param matrix - Matrix to test
  * @param epsilon - Tolerance. @defaultValue `EPSILON`
  * @returns True if matrix is invertible (non-singular)
  *
  * @category Comparison
  * @since 0.6.0
  */
 public static isInvertible(matrix: ReadonlyMatrix2Like, epsilon: number = EPSILON): boolean {
  return !isNearZero(matrix.m00 * matrix.m11 - matrix.m01 * matrix.m10, epsilon);
 }

 /**
  * Tests if a matrix is orthogonal (M * M^T = I)
  *
  * @remarks
  * An orthogonal matrix has columns that are orthonormal (unit length and perpendicular).
  * Orthogonal matrices represent pure rotations/reflections and preserve distances/angles.
  *
  * @param matrix - Matrix to test
  * @param epsilon - Tolerance. @defaultValue `EPSILON`
  * @returns True if matrix is orthogonal
  *
  * @category Comparison
  * @since 0.6.0
  */
 public static isOrthogonal(matrix: ReadonlyMatrix2Like, epsilon: number = EPSILON): boolean {
  // Check if columns are unit length and orthogonal
  const col0LengthSq = matrix.m00 * matrix.m00 + matrix.m01 * matrix.m01;
  const col1LengthSq = matrix.m10 * matrix.m10 + matrix.m11 * matrix.m11;
  const dot = matrix.m00 * matrix.m10 + matrix.m01 * matrix.m11;

  return (
   scalarNearEquals(col0LengthSq, 1, epsilon) &&
   scalarNearEquals(col1LengthSq, 1, epsilon) &&
   isNearZero(dot, epsilon)
  );
 }

 /**
  * Tests if a matrix is special orthogonal (SO(2): orthogonal and `det > 0`)
  *
  * @remarks
  * Elements of SO(2) represent pure rotations (no reflections). Adds the
  * positive-determinant constraint to {@link isOrthogonal}: an orthogonal
  * matrix with `det = −1` is a reflection, an orthogonal matrix with `det = 1`
  * is a proper rotation.
  *
  * @param matrix - Matrix to test
  * @param epsilon - Tolerance. @defaultValue `EPSILON`
  * @returns True if matrix is in SO(2)
  *
  * @see {@link isOrthogonal} - Combined rotations and reflections
  *
  * @category Comparison
  * @since 0.7.0
  */
 public static isSpecialOrthogonal(
  matrix: ReadonlyMatrix2Like,
  epsilon: number = EPSILON,
 ): boolean {
  return Matrix2.isOrthogonal(matrix, epsilon) && Matrix2.determinant(matrix) > 0;
 }

 /* ======================================================================== */
 /* Static Matrix Operations                                                 */
 /* ======================================================================== */

 /**
  * Calculates the determinant of a matrix
  *
  * @param matrix - Matrix to calculate determinant of
  * @returns Determinant value
  *
  * @category Computed
  * @since 0.6.0
  */
 public static determinant(matrix: ReadonlyMatrix2Like): number {
  return matrix.m00 * matrix.m11 - matrix.m01 * matrix.m10;
 }

 /**
  * Calculates the trace (sum of diagonal elements) of a matrix
  *
  * @param matrix - Matrix to calculate trace of
  * @returns Sum of diagonal elements (m00 + m11)
  *
  * @category Computed
  * @since 0.6.0
  */
 public static trace(matrix: ReadonlyMatrix2Like): number {
  return matrix.m00 + matrix.m11;
 }

 /**
  * Calculates the Frobenius norm of a matrix
  *
  * @remarks
  * Uses overflow-safe `hypot` composition, deterministic per IEEE 754.
  *
  * @param matrix - Matrix to calculate norm of
  * @returns Square root of sum of squared elements
  *
  * @category Computed
  * @since 0.6.0
  */
 public static frobeniusNorm(matrix: ReadonlyMatrix2Like): number {
  // Overflow-safe composition: `hypot(hypot(m00, m01), hypot(m10, m11))` remains
  // finite for components up to `Number.MAX_VALUE / √2`, whereas raw `sqrt(Σm²)`
  // overflows at `~1.34e154`. References: Kahan 1987 "Further remarks on reducing
  // truncation errors", Higham 2002 §27.3, Moler-Morrison 1983.
  return hypot(hypot(matrix.m00, matrix.m01), hypot(matrix.m10, matrix.m11));
 }

 /**
  * Extracts rotation angle from a matrix
  *
  * @remarks
  * Computes the angle from the first column vector. For matrices with
  * non-uniform scale, the result reflects the rotation of the X axis.
  *
  * @param matrix - Source matrix
  * @returns Rotation angle in radians
  *
  * @example
  * ```typescript
  * const m = Matrix2.fromRotation(Math.PI / 4);
  * Matrix2.getRotation(m); // ≈ PI/4
  * ```
  *
  * @category Computed
  * @since 0.6.0
  */
 public static getRotation(matrix: ReadonlyMatrix2Like): number {
  return atan2(matrix.m01, matrix.m00);
 }

 /**
  * Extracts scale factors from a matrix (always positive)
  *
  * @remarks
  * Returns the length of each column vector. Values are always non-negative
  * since `hypot` computes magnitudes. This does NOT account for determinant
  * sign (reflection). Use {@link Matrix2.decompose} for signed scale.
  *
  * @param matrix - Source matrix
  * @param out - Optional output vector
  * @returns Scale factors for each axis (always ≥ 0)
  *
  * @example
  * ```typescript
  * const m = Matrix2.fromScale(new Vector2(2, 3));
  * Matrix2.getScale(m); // Vector2(2, 3)
  * ```
  *
  * @category Computed
  * @since 0.7.0
  */
 public static getScale(matrix: ReadonlyMatrix2Like, out?: Vector2): Vector2 {
  const sx = hypot(matrix.m00, matrix.m01);
  const sy = hypot(matrix.m10, matrix.m11);
  return Vector2.fromValues(sx, sy, out);
 }

 /**
  * Composes a matrix from rotation angle and scale
  * @param rotation - Rotation angle in radians
  * @param scale - Scale factors (Vector2 or uniform number)
  * @param out - Optional output object
  * @returns Composed transformation matrix
  *
  * @example
  * ```typescript
  * const m = Matrix2.compose(Math.PI / 4, new Vector2(2, 1));
  * ```
  * @category Matrix Operations
  * @since 0.7.0
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
  * Decomposes a matrix into rotation and scale components
  *
  * @remarks
  * Fast path for matrices known to be rotation × non-uniform scale (no shear).
  * For matrices that may contain shear, use {@link Matrix2.polarDecompose} or
  * {@link Matrix2.svd} instead — both handle the general case.
  *
  * @param matrix - Matrix to decompose
  * @returns Object with rotation (radians) and scale (Vector2)
  *
  * @example
  * ```typescript
  * const m = Matrix2.fromRotation(Math.PI / 4).scaleBy(new Vector2(2, 1));
  * const { rotation, scale } = Matrix2.decompose(m);
  * ```
  *
  * @see {@link Matrix2.polarDecompose} - General rotation + symmetric stretch decomposition
  * @see {@link Matrix2.svd} - Full singular-value decomposition
  *
  * @category Matrix Operations
  * @since 0.7.0
  */
 public static decompose(matrix: ReadonlyMatrix2Like): { rotation: number; scale: Vector2 } {
  const sx = hypot(matrix.m00, matrix.m01);
  const sy = hypot(matrix.m10, matrix.m11);

  // Determine sign of scale based on determinant
  const det = matrix.m00 * matrix.m11 - matrix.m01 * matrix.m10;
  const signY = det < 0 ? -1 : 1;

  const rotation = atan2(matrix.m01, matrix.m00);

  return {
   rotation,
   scale: new Vector2(sx, sy * signY),
  };
 }

 /**
  * Computes the eigenvalues of a 2x2 matrix via the closed-form characteristic polynomial
  *
  * @remarks
  * For `[[a, b], [c, d]]` the characteristic polynomial is
  * `lambda^2 - (a+d)*lambda + (ad - bc) = 0`.
  *
  * - discriminant >= 0: two real eigenvalues `(trace +/- sqrt(discriminant)) / 2`
  * - discriminant < 0: complex conjugate pair with `realPart = trace / 2`,
  *   `imaginaryPart = sqrt(-discriminant) / 2`
  *
  * Uses `Math.sqrt` which is deterministic per IEEE 754.
  *
  * @param matrix - Source matrix
  * @returns Discriminated union of real or complex eigenvalue results
  *
  * @example
  * ```typescript
  * const m = new Matrix2(3, 0, 0, 5);
  * const result = Matrix2.eigenvalues(m);
  * if (result.type === 'real') {
  *   console.log(result.lambda1, result.lambda2); // 5, 3
  * }
  * ```
  *
  * @category Computed
  * @since 0.7.0
  */
 public static eigenvalues(matrix: ReadonlyMatrix2Like): EigenvalueResult {
  // Column-major: row 0 = (m00, m10), row 1 = (m01, m11)
  const a = matrix.m00;
  const b = matrix.m10;
  const c = matrix.m01;
  const d = matrix.m11;

  const trace = a + d;
  const det = a * d - b * c;
  const discriminant = trace * trace - 4 * det;

  if (discriminant >= 0) {
   const sqrtDisc = Math.sqrt(discriminant);
   return {
    type: 'real',
    lambda1: (trace + sqrtDisc) / 2,
    lambda2: (trace - sqrtDisc) / 2,
   };
  }

  return {
   type: 'complex',
   realPart: trace / 2,
   imaginaryPart: Math.sqrt(-discriminant) / 2,
  };
 }

 /**
  * Computes the eigendecomposition of a 2x2 matrix (eigenvalues + eigenvectors)
  *
  * @remarks
  * For real eigenvalues, returns normalized eigenvectors computed from the
  * null space of `(A - lambda * I)`:
  * - If `b != 0`: eigenvector is `[b, lambda - a]` (normalized)
  * - If `c != 0`: eigenvector is `[lambda - d, c]` (normalized)
  * - If both `b` and `c` are 0: diagonal matrix with eigenvectors `[1,0]`, `[0,1]`
  *
  * For complex eigenvalues, no real eigenvectors exist; only the eigenvalues
  * are returned.
  *
  * Uses `Math.sqrt` which is deterministic per IEEE 754.
  *
  * @param matrix - Source matrix
  * @returns Discriminated union of real eigendecomposition or complex eigenvalues
  *
  * @example
  * ```typescript
  * const m = new Matrix2(2, 1, 1, 2);
  * const result = Matrix2.eigendecompose(m);
  * if (result.type === 'real') {
  *   console.log(result.lambda1, result.v1); // 3, normalized eigenvector
  * }
  * ```
  *
  * @see {@link Matrix2.eigenvalues} - Eigenvalues only (lighter computation)
  * @see {@link Matrix2.svd} - Singular value decomposition (always real, generalises to asymmetric matrices)
  * @see {@link Matrix2.polarDecompose} - Rotation + symmetric stretch decomposition
  *
  * @category Computed
  * @since 0.7.0
  */
 public static eigendecompose(matrix: ReadonlyMatrix2Like): EigendecomposeResult {
  const eigenvalueResult = Matrix2.eigenvalues(matrix);

  if (eigenvalueResult.type === 'complex') {
   return {
    type: 'complex',
    realPart: eigenvalueResult.realPart,
    imaginaryPart: eigenvalueResult.imaginaryPart,
   };
  }

  // Column-major: row 0 = (m00, m10), row 1 = (m01, m11)
  const a = matrix.m00;
  const b = matrix.m10;
  const c = matrix.m01;
  const d = matrix.m11;

  // For repeated eigenvalues on a diagonal matrix (scalar multiple of I),
  // every vector is an eigenvector; return the standard basis.
  if (b === 0 && c === 0 && eigenvalueResult.lambda1 === eigenvalueResult.lambda2) {
   return {
    type: 'real',
    lambda1: eigenvalueResult.lambda1,
    v1: new Vector2(1, 0),
    lambda2: eigenvalueResult.lambda2,
    v2: new Vector2(0, 1),
   };
  }

  const v1 = Matrix2.eigenvectorForValue(a, b, c, d, eigenvalueResult.lambda1);
  const v2 = Matrix2.eigenvectorForValue(a, b, c, d, eigenvalueResult.lambda2);

  return {
   type: 'real',
   lambda1: eigenvalueResult.lambda1,
   v1,
   lambda2: eigenvalueResult.lambda2,
   v2,
  };
 }

 /**
  * Computes a normalized eigenvector for a given eigenvalue of [[a,b],[c,d]]
  *
  * @param a - Row 0, Col 0
  * @param b - Row 0, Col 1
  * @param c - Row 1, Col 0
  * @param d - Row 1, Col 1
  * @param lambda - The eigenvalue
  * @returns Normalized eigenvector as a Vector2
  *
  * @internal
  */
 private static eigenvectorForValue(
  a: number,
  b: number,
  c: number,
  d: number,
  lambda: number,
 ): Vector2 {
  if (b !== 0) {
   const vx = b;
   const vy = lambda - a;
   // Overflow-safe via hypot (Matrix Frobenius convention).
   const length = hypot(vx, vy);
   return new Vector2(vx / length, vy / length);
  }

  if (c !== 0) {
   const vx = lambda - d;
   const vy = c;
   // Overflow-safe via hypot (Matrix Frobenius convention).
   const length = hypot(vx, vy);
   return new Vector2(vx / length, vy / length);
  }

  // Diagonal matrix: eigenvectors are the standard basis
  if (lambda === a) {
   return new Vector2(1, 0);
  }
  return new Vector2(0, 1);
 }

 /**
  * Transforms a vector by a matrix
  *
  * @param matrix - Matrix to transform by
  * @param vector - Vector to transform
  * @param out - Optional output vector
  * @returns Transformed vector
  *
  * @category Transform
  * @since 0.6.0
  */
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
  * Rotates a matrix by an angle
  *
  * @remarks
  * Equivalent to `Matrix2.multiply(matrix, Matrix2.fromRotation(angle), out)`
  * but more efficient as it avoids creating an intermediate matrix.
  *
  * @param matrix - Matrix to rotate
  * @param angle - Angle in radians
  * @param out - Optional output matrix
  * @returns Rotated matrix
  *
  * @example
  * ```typescript
  * const m = Matrix2.fromScale({ x: 2, y: 1 });
  * const rotated = Matrix2.rotate(m, Math.PI / 4);
  * ```
  *
  * @category Transform
  * @since 0.6.0
  */
 public static rotate(matrix: ReadonlyMatrix2Like, angle: number, out?: Matrix2): Matrix2 {
  const { cos, sin } = sinCos(angle);
  return Matrix2.rotateCS(matrix, cos, sin, out);
 }

 /**
  * Rotates a matrix using precomputed cosine and sine values
  *
  * @remarks
  * Use this method in hot paths where the same rotation is applied to multiple
  * matrices. Precompute `cos` and `sin` once and reuse them.
  *
  * @param matrix - Matrix to rotate
  * @param cos - Cosine of the rotation angle
  * @param sin - Sine of the rotation angle
  * @param out - Optional output matrix
  * @returns Rotated matrix
  *
  * @example
  * ```typescript
  * const rotation = Rotation2.fromAngle(Math.PI / 4);
  * const m1 = Matrix2.fromScale({ x: 2, y: 1 });
  * const m2 = Matrix2.fromScale({ x: 1, y: 2 });
  * // Apply same rotation to both matrices efficiently
  * const r1 = Matrix2.rotateCS(m1, rotation.cos, rotation.sin);
  * const r2 = Matrix2.rotateCS(m2, rotation.cos, rotation.sin);
  * ```
  *
  * @category Transform
  * @since 0.6.0
  */
 public static rotateCS(
  matrix: ReadonlyMatrix2Like,
  cos: number,
  sin: number,
  out?: Matrix2,
 ): Matrix2 {
  const { m00, m01, m10, m11 } = matrix;

  return Matrix2.ensureOut(out).set(
   m00 * cos + m10 * sin,
   m01 * cos + m11 * sin,
   m00 * -sin + m10 * cos,
   m01 * -sin + m11 * cos,
  );
 }

 /**
  * Scales a matrix by per-axis factors
  *
  * @remarks
  * Unlike {@link scale} which multiplies all elements by a scalar,
  * this method applies non-uniform scaling using a Vector2.
  *
  * @param matrix - Matrix to scale
  * @param scale - Scale factors (Vector2 or uniform number)
  * @param out - Optional output matrix
  * @returns Scaled matrix
  *
  * @example
  * ```typescript
  * const m = Matrix2.fromRotation(Math.PI / 4);
  * const scaled = Matrix2.scaleBy(m, { x: 2, y: 0.5 });
  * ```
  *
  * @category Transform
  * @since 0.6.0
  */
 public static scaleBy(
  matrix: ReadonlyMatrix2Like,
  scale: ReadonlyVector2Like | number,
  out?: Matrix2,
 ): Matrix2 {
  if (typeof scale === 'number') {
   return Matrix2.multiplyScalar(matrix, scale, out);
  }

  return Matrix2.ensureOut(out).set(
   matrix.m00 * scale.x,
   matrix.m01 * scale.x,
   matrix.m10 * scale.y,
   matrix.m11 * scale.y,
  );
 }

 /* ======================================================================== */
 /* Static Matrix Decompositions — Internal Helpers                          */
 /* ======================================================================== */

 /**
  * Givens triangularisation: Qᵀ · M = [[F, G], [0, H]] for an arbitrary 2×2
  *
  * @remarks
  * Computes one Givens rotation Q such that the lower-left entry of Qᵀ · M is
  * zero. The rotation cosine and sine are returned alongside the upper-triangular
  * factors F, G, H. Aliasing-safe: reads all matrix components into locals before
  * writing to the scratch object.
  *
  * Output formulas:
  * - r = √(m00² + m10²) (Givens denominator; r ≥ 0)
  * - cos = m00/r, sin = m10/r (Givens rotation in (cos, sin) form)
  * - F = r
  * - G = (m00·m01 + m10·m11)/r
  * - H = (m00·m11 − m01·m10)/r = det(matrix)/r
  *
  * For r = 0 (m00 = m10 = 0): cos = 1, sin = 0, F = 0, G = m01, H = m11.
  *
  * @param matrix - Source 2×2 matrix
  * @param scratch - Scratch object mutated with the rotation cosine/sine and triangular factors
  * @param scratch.c - Givens rotation cosine
  * @param scratch.s - Givens rotation sine
  * @param scratch.F - Upper-triangular (1,1) element after rotation
  * @param scratch.G - Upper-triangular (1,2) element after rotation
  * @param scratch.H - Upper-triangular (2,2) element after rotation (= det(matrix)/r)
  *
  * @internal
  */
 private static givensTriangularise(
  matrix: ReadonlyMatrix2Like,
  scratch: { c: number; s: number; F: number; G: number; H: number },
 ): void {
  const m00 = matrix.m00;
  const m01 = matrix.m01;
  const m10 = matrix.m10;
  const m11 = matrix.m11;

  // NaN propagation per IEEE 754 §6.2: if any input is NaN the entire
  // triangular form is NaN-tainted. Without this guard the m01 === 0 fast
  // path would silently produce clean (c, s) = (1, 0) when m00 is NaN, which
  // breaks downstream NaN propagation through U and V (the SVD diagonal-case
  // shortcut would also produce clean U, V because the kernel sees NaN only
  // in the F slot). The check uses `x !== x` (the canonical NaN test —
  // NaN is the only IEEE 754 value not equal to itself).
  if (m00 !== m00 || m01 !== m01 || m10 !== m10 || m11 !== m11) {
   scratch.c = NaN;
   scratch.s = NaN;
   scratch.F = NaN;
   scratch.G = NaN;
   scratch.H = NaN;
   return;
  }

  // Triangularisation zeroes out the (row 1, col 0) entry of M, which in
  // column-major Matrix2 is `m01`. The first column being triangularised is
  // therefore (m00, m01)ᵀ. Fast paths: when m01 = 0 the first column is
  // already aligned (no rotation needed); when m00 = 0 (and m01 ≠ 0) a 90°
  // rotation swaps the rows. These paths also bypass the Inf/0 = NaN trap
  // that the general (a · b + c · d) / r form would otherwise produce for
  // pathological inputs like M = [[Inf, 0], [0, 1]].
  if (m01 === 0) {
   const signM00 = m00 < 0 ? -1 : 1;
   scratch.c = signM00;
   scratch.s = 0;
   scratch.F = signM00 * m00;
   scratch.G = signM00 * m10;
   scratch.H = signM00 * m11;
   return;
  }
  if (m00 === 0) {
   const signM01 = m01 < 0 ? -1 : 1;
   scratch.c = 0;
   scratch.s = signM01;
   scratch.F = signM01 * m01;
   scratch.G = signM01 * m11;
   scratch.H = -signM01 * m10;
   return;
  }

  // General case: both m00 and m01 are non-zero. For finite input, hypot
  // produces a positive finite r. For Inf in exactly one of them, hypot
  // returns Inf and the multiplied-then-divided form below produces NaN —
  // acceptable per IEEE 754 §6.2 (NaN propagation; pathological input).
  // Output formulas (after Q ᵀ · M = [[F, G], [0, H]]):
  //   r = √(m00² + m01²)
  //   F = r
  //   G = (m00·m10 + m01·m11) / r
  //   H = (m00·m11 − m10·m01) / r = det(matrix) / r
  const r = hypot(m00, m01);
  const invR = 1 / r;
  scratch.c = m00 * invR;
  scratch.s = m01 * invR;
  scratch.F = r;
  scratch.G = (m00 * m10 + m01 * m11) * invR;
  scratch.H = (m00 * m11 - m10 * m01) * invR;
 }

 /**
  * Closed-form 2×2 SVD of an upper-triangular matrix
  *
  * @remarks
  * Implements the closed-form algorithm of Demmel-Kahan 1990 (*Accurate
  * singular values of bidiagonal matrices*, SIAM J. Sci. Stat. Comput.
  * 11(5):873-912). Computes the SVD
  * `[[F, G], [0, H]] = U · diag(ssmax, ssmin) · Vᵀ` where U and V are
  * 2×2 rotations expressed as (cos, sin) pairs (csl, snl) and (csr, snr).
  *
  * Sign canonicalisation produces signed `ssmax`, `ssmin` such that
  * `ssmax · ssmin = F · H = det(input)` — the reflection-absorbing convention
  * needed by Convention A in `SvdResult`.
  *
  * Robustness: handles `±Infinity` via the infinity-tolerance idiom
  * (`d === fa` after triangularisation); handles m² underflow via a guard on
  * `(G/F)² < MIN_VALUE`; handles diagonal input via the `G === 0` shortcut.
  * Documented accuracy: ≤ 47 ULP worst-case (Qiao-Wang 2002).
  *
  * Uses `hypot` and `Math.sqrt` only; no `atan2` — the rotations are returned
  * directly as (cos, sin) pairs.
  *
  * @param F - Upper-triangular (1,1) element
  * @param G - Upper-triangular (1,2) element
  * @param H - Upper-triangular (2,2) element
  * @param result - Scratch object mutated with the SVD factors
  * @param result.ssmax - Larger singular value (signed per Convention A)
  * @param result.ssmin - Smaller singular value (signed per Convention A)
  * @param result.csl - Left rotation cosine
  * @param result.snl - Left rotation sine
  * @param result.csr - Right rotation cosine
  * @param result.snr - Right rotation sine
  *
  * @internal
  */
 private static dlasv2Kernel(
  F: number,
  G: number,
  H: number,
  result: {
   ssmax: number;
   ssmin: number;
   csl: number;
   snl: number;
   csr: number;
   snr: number;
  },
 ): void {
  let ft = F;
  let fa = Math.abs(ft);
  let ht = H;
  let ha = Math.abs(ht);

  // PMAX selects which sign correction case applies later.
  // 1 = larger entry on diagonal; 2 = larger entry off-diagonal; 3 = larger entry on H after swap.
  let pmax = 1;
  const swap = ha > fa;
  if (swap) {
   pmax = 3;
   [ft, ht] = [ht, ft];
   [fa, ha] = [ha, fa];
  }

  const gt = G;
  const ga = Math.abs(gt);

  // All six unknowns initialised at declaration; subsequent branches override
  // them. The three branch families are: (1) diagonal `ga === 0`, (2) very
  // large `ga` (gasmal=false), (3) normal case (gasmal=true).
  let clt = 0;
  let slt = 0;
  let crt = 0;
  let srt = 0;
  let ssmin = 0;
  let ssmax = 0;

  if (ga === 0) {
   // Diagonal case (matches dlasv2.f line 132)
   ssmin = ha;
   ssmax = fa;
   clt = 1;
   crt = 1;
   // slt, srt stay 0
  } else {
   let gasmal = true;
   if (ga > fa) {
    pmax = 2;
    if (fa / ga < Number.EPSILON) {
     // Very large GA case (matches dlasv2.f line 154)
     gasmal = false;
     ssmax = ga;
     if (ha > 1) {
      ssmin = fa / (ga / ha);
     } else {
      ssmin = (fa / ga) * ha;
     }
     clt = 1;
     slt = ht / gt;
     srt = 1;
     crt = ft / gt;
    }
   }

   if (gasmal) {
    // Normal case (matches dlasv2.f line 165 onward)
    const d = fa - ha;
    let l: number;
    if (d === fa) {
     // Avoid loss of precision when ha is negligible compared to fa
     l = 1;
    } else {
     l = d / fa;
    }
    const m = gt / ft;
    let t = 2 - l;
    const mm = m * m;
    const tt = t * t;
    const s = Math.sqrt(tt + mm);
    let r: number;
    if (l === 0) {
     r = Math.abs(m);
    } else {
     r = Math.sqrt(l * l + mm);
    }
    const a = 0.5 * (s + r);
    ssmin = ha / a;
    ssmax = fa * a;
    if (mm === 0) {
     // m² underflowed
     if (l === 0) {
      // sign(2, ft) * sign(1, gt)
      t = (ft >= 0 ? 2 : -2) * (gt >= 0 ? 1 : -1);
     } else {
      // gt / sign(d, ft) + m / t
      const signedD = ft >= 0 ? Math.abs(d) : -Math.abs(d);
      t = gt / signedD + m / t;
     }
    } else {
     t = (m / (s + t) + m / (r + l)) * (1 + a);
    }
    const lFinal = Math.sqrt(t * t + 4);
    crt = 2 / lFinal;
    srt = t / lFinal;
    clt = (crt + srt * m) / a;
    slt = ((ht / ft) * srt) / a;
   }
  }

  // Undo swap and assign
  if (swap) {
   result.csl = srt;
   result.snl = crt;
   result.csr = slt;
   result.snr = clt;
  } else {
   result.csl = clt;
   result.snl = slt;
   result.csr = crt;
   result.snr = srt;
  }

  // Sign correction (matches dlasv2.f lines 230-236)
  // Fortran SIGN(1, x) is +1 if x ≥ 0, -1 if x < 0
  const signF = F >= 0 ? 1 : -1;
  const signH = H >= 0 ? 1 : -1;
  let tsign: number;
  if (pmax === 1) {
   const signCsr = result.csr >= 0 ? 1 : -1;
   const signCsl = result.csl >= 0 ? 1 : -1;
   tsign = signCsr * signCsl * signF;
  } else if (pmax === 2) {
   const signSnr = result.snr >= 0 ? 1 : -1;
   const signCsl = result.csl >= 0 ? 1 : -1;
   const signG = G >= 0 ? 1 : -1;
   tsign = signSnr * signCsl * signG;
  } else {
   const signSnr = result.snr >= 0 ? 1 : -1;
   const signSnl = result.snl >= 0 ? 1 : -1;
   tsign = signSnr * signSnl * signH;
  }
  // SSMAX = |SSMAX| · sign(TSIGN); SSMIN = |SSMIN| · sign(TSIGN · sign(F) · sign(H))
  result.ssmax = Math.abs(ssmax) * tsign;
  result.ssmin = Math.abs(ssmin) * tsign * signF * signH;
 }

 /**
  * Composes two rotations expressed as (cos, sin) pairs
  *
  * @remarks
  * Computes R(α) · R(β) = R(α+β) without going through atan2/sin/cos.
  * Identity: cos(α+β) = cos·cos − sin·sin, sin(α+β) = sin·cos + cos·sin.
  *
  * @param c1 - cos(α)
  * @param s1 - sin(α)
  * @param c2 - cos(β)
  * @param s2 - sin(β)
  * @param scratch - Scratch object mutated with the composed rotation
  * @param scratch.cos - cos(α + β)
  * @param scratch.sin - sin(α + β)
  *
  * @internal
  */
 private static composeRotations(
  c1: number,
  s1: number,
  c2: number,
  s2: number,
  scratch: { cos: number; sin: number },
 ): void {
  scratch.cos = c1 * c2 - s1 * s2;
  scratch.sin = s1 * c2 + c1 * s2;
 }

 /* ======================================================================== */
 /* Static Matrix Decompositions                                             */
 /* ======================================================================== */

 /**
  * Computes the closed-form 2×2 Singular Value Decomposition `M = U · Σ · Vᵀ`
  *
  * @remarks
  * Uses the closed-form algorithm of Demmel-Kahan 1990 preceded by a single
  * Givens rotation that triangularises an arbitrary 2×2 input. Documented
  * accuracy: ≤ 47 ULP worst-case (Qiao-Wang 2002), robust across the full
  * IEEE 754 finite range and the ±Infinity boundary. NaN propagates per
  * IEEE 754 §6.2.
  *
  * **Sign convention (Convention A)**: both `U` and `V` are proper rotations
  * (`det = +1`); reflection inputs are encoded in the sign of `sigma.y`. The
  * algebraic identity `det(matrix) = sigma.x · sigma.y` holds exactly. For
  * `det(matrix) ≥ 0`: `sigma.y ≥ 0`. For `det(matrix) < 0`: `sigma.y ≤ 0`.
  *
  * **Cross-convention note**: consumers cross-referencing software that uses
  * the unsigned-σ convention (`σ_y ≥ 0` always, reflection absorbed into the
  * right-hand factor) should compare `(sigma.x, |sigma.y|)` and reconcile sign
  * against `Matrix2.determinant(matrix)`.
  *
  * Algorithm references: Blinn 1996 *Consider the Lowly 2×2 Matrix*
  * (IEEE Computer Graphics and Applications 16(2):82-88) for the expository
  * derivation; Demmel-Kahan 1990 *Accurate singular values of bidiagonal
  * matrices* (SIAM J. Sci. Stat. Comput. 11(5):873-912) for the closed-form
  * implementation; Higham 2002 *Accuracy and Stability of Numerical Algorithms*
  * (2nd ed.) §5 for the numerical-stability discussion.
  *
  * @param matrix - Source 2×2 matrix
  * @returns SVD result `{ U, sigma, V }` with `U`, `V` as proper rotations and signed `sigma`
  *
  * @example
  * ```typescript
  * const m = new Matrix2(2, 1, 1, 2);
  * const { U, sigma, V } = Matrix2.svd(m);
  * // Reconstruction: M ≈ U · diag(sigma) · Vᵀ
  * ```
  *
  * @see {@link Matrix2.eigendecompose} - Symmetric-matrix variant
  * @see {@link Matrix2.pseudoInverse} - SVD-based regularised inverse
  * @see {@link Matrix2.polarDecompose} - SVD-based polar factorisation
  * @see {@link Rotation2.fromMatrix2Closest} - Closest proper rotation via SVD
  *
  * @category Matrix Operations
  * @since 0.7.0
  */
 public static svd(matrix: ReadonlyMatrix2Like): SvdResult {
  // Step 1: Givens triangularise to upper-triangular form.
  const givens = { c: 0, s: 0, F: 0, G: 0, H: 0 };
  Matrix2.givensTriangularise(matrix, givens);
  // Step 2: Closed-form 2×2 SVD kernel on the upper-triangular factor.
  const dlasv2 = { ssmax: 0, ssmin: 0, csl: 0, snl: 0, csr: 0, snr: 0 };
  Matrix2.dlasv2Kernel(givens.F, givens.G, givens.H, dlasv2);
  // Step 3: Compose final U = Q · L_kernel (rotation composition).
  const uCs = { cos: 0, sin: 0 };
  Matrix2.composeRotations(givens.c, givens.s, dlasv2.csl, dlasv2.snl, uCs);
  // Step 4: Convention A normalisation. The kernel returns signed
  // (ssmax, ssmin) such that ssmax · ssmin = det(matrix). Convention A
  // requires σ_x ≥ 0 with the sign carried by σ_y. If ssmax < 0, flip the
  // signs of (ssmax, ssmin) and U together — this preserves the algebraic
  // identity M = U · diag(σ) · Vᵀ.
  let sigmaX = dlasv2.ssmax;
  let sigmaY = dlasv2.ssmin;
  let uCos = uCs.cos;
  let uSin = uCs.sin;
  if (sigmaX < 0) {
   sigmaX = -sigmaX;
   sigmaY = -sigmaY;
   uCos = -uCos;
   uSin = -uSin;
  }
  return {
   U: { cos: uCos, sin: uSin },
   sigma: { x: sigmaX, y: sigmaY },
   V: { cos: dlasv2.csr, sin: dlasv2.snr },
  };
 }

 /**
  * Computes the Moore-Penrose pseudo-inverse via SVD
  *
  * @remarks
  * Returns `M⁺ = V · diag(σ⁺) · Uᵀ` where `σᵢ⁺ = 1/σᵢ` if `|σᵢ| > tol` and
  * `0` otherwise. The default tolerance follows Higham 2002 §5.5.5:
  * `tol = 2 · |σ_max| · ε ≈ 4.44e-16` for 2×2 matrices.
  *
  * For non-singular `matrix`, `M⁺ = M⁻¹` exactly within `EPSILON`. For
  * rank-deficient `matrix`, `M⁺` is the unique matrix satisfying the four
  * Penrose 1955 axioms — silent regularisation matching the standard
  * Moore-Penrose definition (no throw on singular).
  *
  * Aliasing-safe: `Matrix2.pseudoInverse(M, M)` is supported (the SVD
  * decomposition fully decouples the input read from the output write).
  *
  * @param matrix - Source 2×2 matrix
  * @param out - Optional matrix to store the result (avoids allocation)
  * @returns Pseudo-inverse matrix (= `out` if provided, else a new Matrix2)
  *
  * @example
  * ```typescript
  * const singular = new Matrix2(1, 2, 2, 4);
  * const pinv = Matrix2.pseudoInverse(singular);
  * // Verifies Penrose axiom 1: singular · pinv · singular ≈ singular
  * ```
  *
  * @see {@link Matrix2.inverse} - Strict inverse, throws on singular input
  * @see {@link Matrix2.svd} - Underlying decomposition
  *
  * @category Matrix Operations
  * @since 0.7.0
  */
 public static pseudoInverse(matrix: ReadonlyMatrix2Like, out?: Matrix2): Matrix2 {
  const { U, sigma, V } = Matrix2.svd(matrix);
  // Higham 2002 §5.5.5 default tolerance: tol = 2 · σ_max · ε. The factor 2
  // matches the max(rows, cols) constant for a 2×2 matrix. The relative
  // tolerance gate only applies when σ_max is finite — for non-finite
  // σ_max (Infinity or NaN), tol becomes non-finite and would zero ALL
  // singular values via the > tol comparison, incorrectly suppressing
  // partial-inverse contributions and breaking IEEE 754 NaN propagation.
  // Bypass the gate when tol is non-finite, falling back to direct
  // reciprocal: 1/Infinity = 0 (per IEEE 754 §7.2 limit) and 1/NaN = NaN
  // (per IEEE 754 §6.2 propagation).
  const sigmaXAbs = Math.abs(sigma.x);
  const sigmaYAbs = Math.abs(sigma.y);
  const tol = 2 * sigmaXAbs * Number.EPSILON;
  const tolFinite = Number.isFinite(tol);
  const invSx = tolFinite ? (sigmaXAbs > tol ? 1 / sigma.x : 0) : 1 / sigma.x;
  const invSy = tolFinite ? (sigmaYAbs > tol ? 1 / sigma.y : 0) : 1 / sigma.y;
  // Build M⁺ = V · diag(invSx, invSy) · Uᵀ in column-major. The signed σ_y
  // under Convention A flows through 1/σ_y naturally (1/(−|σ_y|) = −1/|σ_y|).
  const uc = U.cos;
  const us = U.sin;
  const vc = V.cos;
  const vs = V.sin;
  return Matrix2.ensureOut(out).set(
   vc * uc * invSx + vs * us * invSy,
   vs * uc * invSx - vc * us * invSy,
   vc * us * invSx - vs * uc * invSy,
   vs * us * invSx + vc * uc * invSy,
  );
 }

 /**
  * Computes the polar decomposition `M = R · S` via SVD (Convention A)
  *
  * @remarks
  * Returns `R = U · Vᵀ` (proper-rotation factor) and `S = V · diag(σ) · Vᵀ`
  * (symmetric stretch factor) under Convention A. Both `U` and `V` from the
  * underlying SVD are proper rotations, so `R` is **always** a proper
  * rotation (`det(R) = +1`). The reflection sign of the input flows into
  * the symmetric factor instead. Algorithm from Higham 1986 *Computing the
  * Polar Decomposition — with Applications* and Higham-Schreiber 1990.
  *
  * **Convention A versus the textbook polar decomposition**: the textbook
  * polar decomposes `M` into an orthogonal `R` (possibly a reflection) and
  * an SPD `S`. Convention A pushes the reflection sign into the singular
  * value `sigma.y` and keeps both `U`, `V`, and therefore `R = U · Vᵀ`, as
  * proper rotations. In exchange, `S` carries the reflection sign through
  * `det(S) = sigma.x · sigma.y = det(matrix)`, so `S` is positive-semi-
  * definite when `det(matrix) ≥ 0` and indefinite when `det(matrix) < 0`.
  *
  * **Picking textbook polar instead**: consumers requiring an SPD `S` (with
  * `R` allowed to be a reflection) MUST reconstruct from
  * {@link Matrix2.svd}: with `signY = sigma.y < 0 ? -1 : 1`, build
  * `R_textbook = U · diag(1, signY) · Vᵀ` (an orthogonal matrix that may be
  * a reflection) and `S_textbook = V · diag(sigma.x, |sigma.y|) · Vᵀ` (always
  * SPD). Note that `R_textbook` is a generic 2×2 orthogonal matrix, not a
  * `Rotation2`-shaped value.
  *
  * Result invariants under Convention A:
  * - `R · S = matrix` exactly within Frobenius tolerance `EPSILON`.
  * - `R` is a proper rotation: `R · Rᵀ = I` and `det(R) = +1` always.
  * - `S` is symmetric: `S.m01 === S.m10` exactly.
  * - `S` is positive-semi-definite when `det(matrix) ≥ 0`; indefinite when
  *   `det(matrix) < 0` (with `det(S) = det(matrix)`).
  *
  * @param matrix - Source 2×2 matrix
  * @returns Polar decomposition `{ R, S }`
  *
  * @example
  * ```typescript
  * const m = Matrix2.multiply(Matrix2.fromRotation(0.5), Matrix2.fromScale(new Vector2(2, 3)));
  * const { R, S } = Matrix2.polarDecompose(m);
  * // R is the proper-rotation factor; S is the symmetric stretch
  * ```
  *
  * @see {@link Matrix2.svd} - Underlying decomposition
  * @see {@link Rotation2.fromMatrix2Closest} - Closest proper rotation (always det = +1)
  * @see {@link Matrix2.decompose} - Sign-aware rotation+scale (no shear)
  *
  * @category Matrix Operations
  * @since 0.7.0
  */
 public static polarDecompose(matrix: ReadonlyMatrix2Like): PolarDecomposeResult {
  const { U, sigma, V } = Matrix2.svd(matrix);
  const uc = U.cos;
  const us = U.sin;
  const vc = V.cos;
  const vs = V.sin;
  // R = U · Vᵀ (rotation composition: cos(θ_U − θ_V), sin(θ_U − θ_V))
  const rCos = uc * vc + us * vs;
  const rSin = us * vc - uc * vs;
  // S = V · diag(σ_x, σ_y) · Vᵀ (symmetric matrix; m01 = m10 by construction)
  const sx = sigma.x;
  const sy = sigma.y;
  const vcvs = vc * vs;
  const sm01 = vcvs * (sx - sy);
  return {
   R: { cos: rCos, sin: rSin },
   S: {
    m00: vc * vc * sx + vs * vs * sy,
    m01: sm01,
    m10: sm01,
    m11: vs * vs * sx + vc * vc * sy,
   },
  };
 }

 /**
  * Computes the 2-norm condition number `κ₂(M) = σ_max / σ_min`
  *
  * @remarks
  * Measures sensitivity of the linear system `M · x = b` to perturbations
  * (Turing 1948 *Rounding-off errors in matrix processes*; Wilkinson 1965
  * *The Algebraic Eigenvalue Problem*). For singular matrices, returns
  * `+Infinity` per IEEE 754 §7.2 (`x / 0 = +Infinity` for positive `x`).
  * NaN propagates per IEEE 754 §6.2.
  *
  * Under Convention A (see {@link Matrix2.svd}), `σ_y` may be negative for
  * reflection inputs; the condition number uses `|σ_y|` so it remains a
  * non-negative ratio with `κ₂(M) ≥ 1` for non-singular `matrix`.
  *
  * Identities:
  * - `κ₂(I) = 1` for the identity matrix.
  * - `κ₂(R) = 1` for any proper rotation `R`.
  * - `κ₂(αM) = κ₂(M)` for any non-zero scalar α (scale invariance).
  *
  * @param matrix - Source 2×2 matrix
  * @returns Condition number in `[1, +∞]`, or `+Infinity` when singular
  *
  * @example
  * ```typescript
  * Matrix2.conditionNumber(Matrix2.IDENTITY); // 1
  * Matrix2.conditionNumber(new Matrix2(1, 0, 0, 1e-10)); // ≈ 1e10 (ill-conditioned)
  * ```
  *
  * @see {@link Matrix2.svd} - Underlying decomposition
  * @see {@link Matrix2.frobeniusNorm} - Alternative norm
  *
  * @category Computed
  * @since 0.7.0
  */
 public static conditionNumber(matrix: ReadonlyMatrix2Like): number {
  const { sigma } = Matrix2.svd(matrix);
  return sigma.x / Math.abs(sigma.y);
 }

 /* ======================================================================== */
 /* Instance Properties                                                      */
 /* ======================================================================== */

 /**
  * Column 0, Row 0 (typically cosine for rotation, x-scale for scale)
  */
 public m00: number;

 /**
  * Column 0, Row 1 (typically sine for rotation, y-shear for shear)
  */
 public m01: number;

 /**
  * Column 1, Row 0 (typically -sine for rotation, x-shear for shear)
  */
 public m10: number;

 /**
  * Column 1, Row 1 (typically cosine for rotation, y-scale for scale)
  */
 public m11: number;

 /* ======================================================================== */
 /* Constructor                                                              */
 /* ======================================================================== */

 /**
  * Creates a 2x2 matrix from explicit components, defaulting to identity
  *
  * @remarks
  * The constructor is total: pure scalar assignment with no validation, no
  * shape dispatch, and no throw path. Array and object construction is the
  * exclusive domain of the `from*` factories (`fromArray` validates bounds
  * and throws `RangeError` in every build; `fromObject` trusts the
  * TypeScript type).
  *
  * @param m00 - Column 0, Row 0
  * @param m01 - Column 0, Row 1
  * @param m10 - Column 1, Row 0
  * @param m11 - Column 1, Row 1
  *
  * @example
  * ```typescript
  * new Matrix2();           // Identity: [1,0,0,1]
  * new Matrix2(1, 2, 3, 4); // Explicit: m00=1, m01=2, m10=3, m11=4
  * ```
  */
 public constructor(m00 = 1, m01 = 0, m10 = 0, m11 = 1) {
  this.m00 = m00;
  this.m01 = m01;
  this.m10 = m10;
  this.m11 = m11;
  // Pure math: no assertions - Infinity/NaN are valid IEEE 754 values
 }

 /* ======================================================================== */
 /* Instance Mutators                                                        */
 /* ======================================================================== */

 /**
  * Sets the matrix components
  *
  * @param m00 - Column 0, Row 0
  * @param m01 - Column 0, Row 1
  * @param m10 - Column 1, Row 0
  * @param m11 - Column 1, Row 1
  * @returns This matrix for chaining
  *
  * @category Mutator
  * @since 0.6.0
  */
 public set(m00: number, m01: number, m10: number, m11: number): this {
  this.m00 = m00;
  this.m01 = m01;
  this.m10 = m10;
  this.m11 = m11;
  return this;
 }

 /**
  * Copies components from another matrix
  *
  * @param other - Matrix to copy from
  * @returns This matrix for chaining
  *
  * @category Mutator
  * @since 0.6.0
  */
 public copy(other: ReadonlyMatrix2): this {
  this.m00 = other.m00;
  this.m01 = other.m01;
  this.m10 = other.m10;
  this.m11 = other.m11;
  return this;
 }

 /**
  * Sets this matrix from array values (column-major order)
  * @param array - Source array [m00, m01, m10, m11]
  * @param offset - Starting index (default 0)
  * @returns This for chaining
  * @throws {RangeError} If array has insufficient length
  *
  * @category Mutator
  * @since 0.7.0
  */
 public setFromArray(array: ArrayLike<number>, offset = 0): this {
  if (offset < 0 || offset + 4 > array.length) {
   throw new RangeError(
    `Matrix2.setFromArray: offset ${offset} out of bounds for array length ${array.length}`,
   );
  }
  return this.set(array[offset]!, array[offset + 1]!, array[offset + 2]!, array[offset + 3]!);
 }

 /**
  * Sets this matrix to identity
  *
  * @returns This matrix for chaining
  *
  * @category Mutator
  * @since 0.6.0
  */
 public identity(): this {
  this.m00 = 1;
  this.m01 = 0;
  this.m10 = 0;
  this.m11 = 1;
  return this;
 }

 /**
  * Resets all components to zero
  *
  * @returns This matrix for chaining
  *
  * @category Mutator
  * @since 0.6.0
  */
 public zero(): this {
  this.m00 = 0;
  this.m01 = 0;
  this.m10 = 0;
  this.m11 = 0;
  return this;
 }

 /* ======================================================================== */
 /* Instance Computed                                                        */
 /* ======================================================================== */

 /**
  * Calculates the determinant of the matrix
  *
  * @remarks
  * A determinant of 0 indicates the matrix is singular (non-invertible).
  * The absolute value represents the area scaling factor.
  *
  * @returns Determinant value
  *
  * @category Computed
  * @since 0.6.0
  */
 public determinant(): number {
  return this.m00 * this.m11 - this.m01 * this.m10;
 }

 /**
  * Calculates the trace of the matrix
  *
  * @returns Sum of diagonal elements
  *
  * @category Computed
  * @since 0.6.0
  */
 public trace(): number {
  return this.m00 + this.m11;
 }

 /**
  * Calculates the Frobenius norm
  *
  * @remarks
  * Uses overflow-safe `hypot` composition, deterministic per IEEE 754.
  *
  * @returns Square root of sum of squared elements
  *
  * @category Computed
  * @since 0.6.0
  */
 public frobeniusNorm(): number {
  // Overflow-safe via hypot composition (Matrix Frobenius convention).
  return hypot(hypot(this.m00, this.m01), hypot(this.m10, this.m11));
 }

 /**
  * Tests if this matrix is invertible
  *
  * @param epsilon - Tolerance for determinant. @defaultValue `EPSILON`
  * @returns True if determinant is non-zero
  *
  * @category Comparison
  * @since 0.6.0
  */
 public isInvertible(epsilon: number = EPSILON): boolean {
  return !isNearZero(this.determinant(), epsilon);
 }

 /**
  * Tests if this matrix is orthogonal
  *
  * @param epsilon - Tolerance. @defaultValue `EPSILON`
  * @returns True if M * M^T = I
  *
  * @category Comparison
  * @since 0.6.0
  */
 public isOrthogonal(epsilon: number = EPSILON): boolean {
  return Matrix2.isOrthogonal(this, epsilon);
 }

 /**
  * Tests if this matrix is special orthogonal (SO(2): orthogonal and `det > 0`)
  *
  * @param epsilon - Tolerance. @defaultValue `EPSILON`
  * @returns True if matrix is in SO(2)
  *
  * @see {@link isOrthogonal} - Combined rotations and reflections
  *
  * @category Comparison
  * @since 0.7.0
  */
 public isSpecialOrthogonal(epsilon: number = EPSILON): boolean {
  return Matrix2.isSpecialOrthogonal(this, epsilon);
 }

 /**
  * Extracts rotation angle from the matrix
  *
  * @remarks
  * Assumes the matrix represents a pure rotation or rotation with uniform scale.
  *
  * @returns Rotation angle in radians
  *
  * @category Computed
  * @since 0.6.0
  */
 public getRotation(): number {
  return atan2(this.m01, this.m00);
 }

 /**
  * Extracts scale factors from the matrix (always positive)
  *
  * @remarks
  * Returns the length of each column vector. Values are always non-negative
  * since `hypot` computes magnitudes. This does NOT account for determinant
  * sign (reflection). Use {@link Matrix2.decompose} for signed scale that
  * matches the rotation convention.
  *
  * @param out - Optional output vector
  * @returns Scale factors for each axis (always ≥ 0)
  *
  * @category Computed
  * @since 0.7.0
  */
 public getScale(out?: Vector2): Vector2 {
  const sx = hypot(this.m00, this.m01);
  const sy = hypot(this.m10, this.m11);
  return Vector2.fromValues(sx, sy, out);
 }

 /* ======================================================================== */
 /* Instance Accessors                                                       */
 /* ======================================================================== */

 /**
  * Returns a new transposed matrix without modifying this one
  * @returns New transposed matrix
  *
  * @example
  * ```typescript
  * const m = new Matrix2(1, 2, 3, 4);
  * const t = m.transposed;
  * // t = Matrix2(1, 3, 2, 4), m unchanged
  * ```
  *
  * @category Accessor
  * @since 0.6.0
  */
 public get transposed(): Matrix2 {
  return new Matrix2(this.m00, this.m10, this.m01, this.m11);
 }

 /**
  * Returns a new inverted matrix without modifying this one
  *
  * @remarks
  * Safe-tier accessor. Returns the identity matrix when `this` is singular
  * (determinant near zero), paralleling `Vector2.normalized` (returns the
  * zero vector on zero-length input). Use {@link inverse} for the strict
  * mutating variant that throws on singular matrices, or
  * {@link inverseUnchecked} for the no-guard form.
  *
  * @returns New inverted matrix, or identity if singular
  *
  * @example
  * ```typescript
  * const m = Matrix2.fromRotation(Math.PI / 4);
  * const inv = m.inverted;
  * // m × inv ≈ identity
  * ```
  *
  * @see {@link inverse} - Strict mutating variant that throws on singular
  * @see {@link inverseUnchecked} - No-guard mutating variant
  *
  * @category Accessor
  * @since 0.6.0
  */
 public get inverted(): Matrix2 {
  const det = this.determinant();
  if (isNearZero(det)) {
   return new Matrix2(); // Return identity for singular matrix
  }
  const invDet = 1 / det; // Guard above already caught near-zero; no need for divideSafe
  return new Matrix2(this.m11 * invDet, -this.m01 * invDet, -this.m10 * invDet, this.m00 * invDet);
 }

 /**
  * Returns a new negated matrix without modifying this one
  * @returns New negated matrix
  *
  * @example
  * ```typescript
  * const m = new Matrix2(1, 2, 3, 4);
  * const neg = m.negated;
  * // neg = Matrix2(-1, -2, -3, -4), m unchanged
  * ```
  *
  * @category Accessor
  * @since 0.6.0
  */
 public get negated(): Matrix2 {
  return new Matrix2(-this.m00, -this.m01, -this.m10, -this.m11);
 }

 /**
  * Returns the first column as a new vector
  * @returns First column vector
  *
  * @category Accessor
  * @since 0.6.0
  */
 public get column0(): Vector2 {
  return new Vector2(this.m00, this.m01);
 }

 /**
  * Returns the second column as a new vector
  * @returns Second column vector
  *
  * @category Accessor
  * @since 0.6.0
  */
 public get column1(): Vector2 {
  return new Vector2(this.m10, this.m11);
 }

 /**
  * Returns the first row as a new vector
  * @returns First row vector
  *
  * @category Accessor
  * @since 0.6.0
  */
 public get row0(): Vector2 {
  return new Vector2(this.m00, this.m10);
 }

 /**
  * Returns the second row as a new vector
  * @returns Second row vector
  *
  * @category Accessor
  * @since 0.6.0
  */
 public get row1(): Vector2 {
  return new Vector2(this.m01, this.m11);
 }

 /**
  * Returns the diagonal elements as a new vector
  * @returns Diagonal vector (m00, m11)
  *
  * @category Accessor
  * @since 0.6.0
  */
 public get diagonal(): Vector2 {
  return new Vector2(this.m00, this.m11);
 }

 /* ======================================================================== */
 /* Instance Arithmetic                                                      */
 /* ======================================================================== */

 /**
  * Adds another matrix to this one
  *
  * @param other - Matrix to add
  * @returns This matrix for chaining
  *
  * @category Arithmetic
  * @since 0.6.0
  */
 public add(other: ReadonlyMatrix2Like): this {
  this.m00 += other.m00;
  this.m01 += other.m01;
  this.m10 += other.m10;
  this.m11 += other.m11;
  return this;
 }

 /**
  * Subtracts another matrix from this one
  *
  * @param other - Matrix to subtract
  * @returns This matrix for chaining
  *
  * @category Arithmetic
  * @since 0.6.0
  */
 public subtract(other: ReadonlyMatrix2Like): this {
  this.m00 -= other.m00;
  this.m01 -= other.m01;
  this.m10 -= other.m10;
  this.m11 -= other.m11;
  return this;
 }

 /**
  * Multiplies this matrix by another (this × other)
  *
  * @param other - Matrix to multiply by
  * @returns This matrix for chaining
  *
  * @example
  * ```typescript
  * const rot = Matrix2.fromRotation(Math.PI / 4);
  * const scale = Matrix2.fromScale(2);
  * rot.multiply(scale); // rot is now rotated then scaled
  * ```
  *
  * @category Arithmetic
  * @since 0.6.0
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
  * Multiplies all components by a scalar
  *
  * @param scalar - Scalar multiplier
  * @returns This matrix for chaining
  *
  * @category Arithmetic
  * @since 0.6.0
  */
 public multiplyScalar(scalar: number): this {
  this.m00 *= scalar;
  this.m01 *= scalar;
  this.m10 *= scalar;
  this.m11 *= scalar;
  return this;
 }

 /**
  * Adds a scalar to all components
  *
  * @param scalar - Scalar to add
  * @returns This matrix for chaining
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 public addScalar(scalar: number): this {
  this.m00 += scalar;
  this.m01 += scalar;
  this.m10 += scalar;
  this.m11 += scalar;
  return this;
 }

 /**
  * Subtracts a scalar from all components
  *
  * @param scalar - Scalar to subtract
  * @returns This matrix for chaining
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 public subtractScalar(scalar: number): this {
  this.m00 -= scalar;
  this.m01 -= scalar;
  this.m10 -= scalar;
  this.m11 -= scalar;
  return this;
 }

 /**
  * Fused multiply-add: `this = this * scalar + m`
  *
  * @param scalar - Scalar multiplier
  * @param m - Matrix to add
  * @returns This matrix for chaining
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 public fma(scalar: number, m: ReadonlyMatrix2Like): this {
  this.m00 = this.m00 * scalar + m.m00;
  this.m01 = this.m01 * scalar + m.m01;
  this.m10 = this.m10 * scalar + m.m10;
  this.m11 = this.m11 * scalar + m.m11;
  return this;
 }

 /**
  * Divides all components by a scalar (strict)
  *
  * @remarks
  * For safe division that returns zeros, use {@link divideScalarSafe}.
  * For hot paths, use {@link divideScalarUnchecked}.
  *
  * @param scalar - Scalar divisor
  * @returns This matrix for chaining
  * @throws {RangeError} If scalar is near zero
  *
  * @example
  * ```typescript
  * new Matrix2(4, 6, 8, 10).divideScalar(2); // Matrix2(2, 3, 4, 5)
  * new Matrix2(1, 2, 3, 4).divideScalar(0);  // throws RangeError
  * ```
  *
  * @see {@link divideScalarSafe} - Returns fallback zero matrix for near-zero divisor
  * @see {@link divideScalarUnchecked} - No validation
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 public divideScalar(scalar: number): this {
  if (isNearZero(scalar)) {
   throw new RangeError('Matrix2.divideScalar: cannot divide by zero or near-zero scalar');
  }
  const inv = 1 / scalar;
  this.m00 *= inv;
  this.m01 *= inv;
  this.m10 *= inv;
  this.m11 *= inv;
  return this;
 }

 /**
  * Safe scalar division. If |scalar| ≤ EPSILON, sets all components to zero
  *
  * @param scalar - Scalar divisor
  * @returns This matrix for chaining
  *
  * @example
  * ```typescript
  * new Matrix2(4, 6, 8, 10).divideScalarSafe(2); // Matrix2(2, 3, 4, 5)
  * new Matrix2(1, 2, 3, 4).divideScalarSafe(0);  // Matrix2(0, 0, 0, 0)
  * ```
  *
  * @see {@link divideScalar} - Throws for near-zero divisor
  *
  * @category Arithmetic
  * @since 0.7.0
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
  * Unchecked scalar division for hot paths
  *
  * @remarks
  * **Precondition:** Scalar must be non-zero.
  *
  * @param scalar - Scalar divisor (must be non-zero)
  * @returns This matrix for chaining
  *
  * @see {@link divideScalar} - Throws on near-zero divisor
  * @see {@link divideScalarSafe} - Returns fallback on near-zero divisor
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 public divideScalarUnchecked(scalar: number): this {
  const inv = 1 / scalar;
  this.m00 *= inv;
  this.m01 *= inv;
  this.m10 *= inv;
  this.m11 *= inv;
  return this;
 }

 /**
  * Component-wise modulo with another matrix
  *
  * @remarks
  * Uses the positive modulo operation (always returns positive results).
  *
  * @param other - Divisor matrix
  * @returns This matrix for chaining
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 public mod(other: ReadonlyMatrix2Like): this {
  this.m00 = scalarMod(this.m00, other.m00);
  this.m01 = scalarMod(this.m01, other.m01);
  this.m10 = scalarMod(this.m10, other.m10);
  this.m11 = scalarMod(this.m11, other.m11);
  return this;
 }

 /**
  * Scalar modulo on all components
  *
  * @param scalar - Scalar divisor
  * @returns This matrix for chaining
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 public modScalar(scalar: number): this {
  this.m00 = scalarMod(this.m00, scalar);
  this.m01 = scalarMod(this.m01, scalar);
  this.m10 = scalarMod(this.m10, scalar);
  this.m11 = scalarMod(this.m11, scalar);
  return this;
 }

 /* ======================================================================== */
 /* Instance Matrix Operations                                               */
 /* ======================================================================== */

 /**
  * Transposes the matrix in place
  * @returns This matrix for chaining
  * @category Matrix Operations
  * @since 0.6.0
  */
 public transpose(): this {
  const temporary = this.m01;
  this.m01 = this.m10;
  this.m10 = temporary;
  return this;
 }

 /**
  * Inverts the matrix in place
  * @returns This matrix for chaining
  * @throws {RangeError} If matrix is singular (determinant ≈ 0)
  *
  * @example
  * ```typescript
  * new Matrix2(1, 0, 0, 1).inverse(); // Matrix2(1, 0, 0, 1) (identity)
  * new Matrix2(1, 1, 1, 1).inverse(); // throws RangeError (singular)
  * ```
  *
  * @see {@link inverseSafe} - Returns fallback identity for singular matrices
  * @see {@link inverseUnchecked} - No validation
  *
  * @category Matrix Operations
  * @since 0.6.0
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
  * Safe inversion in place. Sets to identity if singular
  * @returns This matrix for chaining
  *
  * @example
  * ```typescript
  * new Matrix2(1, 0, 0, 1).inverseSafe(); // Matrix2(1, 0, 0, 1) (identity)
  * new Matrix2(1, 1, 1, 1).inverseSafe(); // Matrix2(1, 0, 0, 1) (fallback)
  * ```
  *
  * @see {@link inverse} - Throws for singular matrices
  *
  * @category Matrix Operations
  * @since 0.6.0
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
  * Unchecked inversion for hot paths
  *
  * **Precondition:** Matrix must be invertible (det ≠ 0).
  * Calling with a singular matrix produces NaN/Infinity components.
  *
  * @returns This matrix for chaining
  *
  * @see {@link inverse} - Throws on singular matrices
  * @see {@link inverseSafe} - Returns fallback on singular matrices
  *
  * @category Matrix Operations
  * @since 0.7.0
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
  * Calculates the adjugate (adjoint) matrix in place
  * @returns This matrix for chaining
  * @category Matrix Operations
  * @since 0.6.0
  */
 public adjugate(): this {
  const r00 = this.m11;
  const r01 = -this.m01;
  const r10 = -this.m10;
  const r11 = this.m00;
  return this.set(r00, r01, r10, r11);
 }

 /**
  * Negates all elements of this matrix in place
  * @returns This matrix for chaining
  *
  * @example
  * ```typescript
  * const m = new Matrix2(1, 2, 3, 4);
  * m.negate();
  * // m = Matrix2(-1, -2, -3, -4)
  * ```
  * @category Arithmetic
  * @since 0.7.0
  */
 public negate(): this {
  this.m00 = -this.m00;
  this.m01 = -this.m01;
  this.m10 = -this.m10;
  this.m11 = -this.m11;
  return this;
 }

 /**
  * Returns the real eigenvalues of this matrix
  *
  * @returns Eigenvalue result object
  *
  * @see {@link Matrix2.eigenvalues} - Static variant
  *
  * @category Computed
  * @since 0.7.0
  */
 public eigenvalues(): EigenvalueResult {
  return Matrix2.eigenvalues(this);
 }

 /**
  * Returns the eigendecomposition of this matrix
  *
  * @returns Eigendecomposition result object
  *
  * @see {@link Matrix2.eigendecompose} - Static variant
  *
  * @category Computed
  * @since 0.7.0
  */
 public eigendecompose(): EigendecomposeResult {
  return Matrix2.eigendecompose(this);
 }

 /**
  * Computes the Singular Value Decomposition of this matrix
  *
  * @remarks
  * Delegates to {@link Matrix2.svd}. Convention A signed sigma applies; both
  * `U` and `V` are proper rotations.
  *
  * @returns SVD result `{ U, sigma, V }`
  *
  * @see {@link Matrix2.svd} - Static variant
  *
  * @category Matrix Operations
  * @since 0.7.0
  */
 public svd(): SvdResult {
  return Matrix2.svd(this);
 }

 /**
  * Replaces this matrix with its Moore-Penrose pseudo-inverse
  *
  * @remarks
  * Mutates this matrix in-place via `Matrix2.pseudoInverse(this, this)`.
  * For non-singular input, the result equals the regular inverse exactly
  * within `EPSILON`. For rank-deficient input, regularises per Higham 2002
  * §5.5.5 default tolerance (Penrose 1955 axioms hold).
  *
  * @returns This matrix (mutated for fluent chaining)
  *
  * @see {@link Matrix2.pseudoInverse} - Static counterpart with `out` parameter
  * @see {@link Matrix2.prototype.inverse} - Strict inverse, throws on singular
  *
  * @category Matrix Operations
  * @since 0.7.0
  */
 public pseudoInverse(): Matrix2 {
  return Matrix2.pseudoInverse(this, this);
 }

 /**
  * Computes the polar decomposition of this matrix
  *
  * @remarks
  * Delegates to {@link Matrix2.polarDecompose}. Note that `R` may be a
  * reflection for `det(this) < 0` inputs. Consumers requiring a proper
  * rotation MUST use {@link Rotation2.fromMatrix2Closest} instead.
  *
  * @returns Polar decomposition result `{ R, S }`
  *
  * @see {@link Matrix2.polarDecompose} - Static variant
  * @see {@link Rotation2.fromMatrix2Closest} - Closest proper rotation
  *
  * @category Matrix Operations
  * @since 0.7.0
  */
 public polarDecompose(): PolarDecomposeResult {
  return Matrix2.polarDecompose(this);
 }

 /**
  * Computes the 2-norm condition number of this matrix
  *
  * @remarks
  * Returns `κ₂(this) = σ_max / |σ_min|` via SVD. Returns `+Infinity` for
  * singular matrices per IEEE 754 §7.2.
  *
  * @returns Condition number in `[1, +∞]`, or `+Infinity` when singular
  *
  * @see {@link Matrix2.conditionNumber} - Static variant
  * @see {@link Matrix2.frobeniusNorm} - Alternative norm
  *
  * @category Computed
  * @since 0.7.0
  */
 public conditionNumber(): number {
  return Matrix2.conditionNumber(this);
 }

 /**
  * Solves the linear system `A · x = b` where `A` is this matrix
  *
  * @param b - Right-hand side vector
  * @param out - Optional output vector
  * @returns Solution vector `x`
  * @throws {RangeError} If this matrix is singular
  *
  * @see {@link solveLinearSystemSafe} - Returns fallback on singular matrix
  * @see {@link solveLinearSystemUnchecked} - No validation, for hot paths
  * @see {@link Matrix2.solveLinearSystem} - Static variant
  *
  * @category Matrix Operations
  * @since 0.7.0
  */
 public solveLinearSystem(b: ReadonlyVector2Like, out?: Vector2): Vector2 {
  return Matrix2.solveLinearSystem(this, b, out);
 }

 /**
  * Solves the linear system `A · x = b`, returning `(0, 0)` on singular `A`
  *
  * @param b - Right-hand side vector
  * @param out - Optional output vector
  * @returns Solution vector, or `(0, 0)` for singular matrix
  *
  * @see {@link solveLinearSystem} - Strict variant that throws
  * @see {@link solveLinearSystemUnchecked} - No validation, for hot paths
  *
  * @category Matrix Operations
  * @since 0.7.0
  */
 public solveLinearSystemSafe(b: ReadonlyVector2Like, out?: Vector2): Vector2 {
  return Matrix2.solveLinearSystemSafe(this, b, out);
 }

 /**
  * Solves the linear system `A · x = b` without validation
  *
  * @param b - Right-hand side vector
  * @param out - Optional output vector
  * @returns Solution vector (or NaN for singular matrix)
  *
  * @see {@link solveLinearSystem} - Strict variant that throws
  * @see {@link solveLinearSystemSafe} - Returns fallback on singular matrix
  *
  * @category Matrix Operations
  * @since 0.7.0
  */
 public solveLinearSystemUnchecked(b: ReadonlyVector2Like, out?: Vector2): Vector2 {
  return Matrix2.solveLinearSystemUnchecked(this, b, out);
 }

 /* ======================================================================== */
 /* Instance Transforms                                                      */
 /* ======================================================================== */

 /**
  * Applies Math.floor to all elements
  * @returns This matrix for chaining
  * @category Transform
  * @since 0.6.0
  */
 public floor(): this {
  this.m00 = Math.floor(this.m00);
  this.m01 = Math.floor(this.m01);
  this.m10 = Math.floor(this.m10);
  this.m11 = Math.floor(this.m11);
  return this;
 }

 /**
  * Applies Math.ceil to all elements
  * @returns This matrix for chaining
  * @category Transform
  * @since 0.6.0
  */
 public ceil(): this {
  this.m00 = Math.ceil(this.m00);
  this.m01 = Math.ceil(this.m01);
  this.m10 = Math.ceil(this.m10);
  this.m11 = Math.ceil(this.m11);
  return this;
 }

 /**
  * Applies Math.round to all elements
  * @returns This matrix for chaining
  * @category Transform
  * @since 0.6.0
  */
 public round(): this {
  this.m00 = Math.round(this.m00);
  this.m01 = Math.round(this.m01);
  this.m10 = Math.round(this.m10);
  this.m11 = Math.round(this.m11);
  return this;
 }

 /**
  * Applies Math.trunc to all elements (rounds towards zero)
  * @returns This for chaining
  * @category Transform
  * @since 0.7.0
  */
 public trunc(): this {
  this.m00 = Math.trunc(this.m00);
  this.m01 = Math.trunc(this.m01);
  this.m10 = Math.trunc(this.m10);
  this.m11 = Math.trunc(this.m11);
  return this;
 }

 /**
  * Applies absolute value to all elements
  * @returns This matrix for chaining
  * @category Transform
  * @since 0.6.0
  */
 public abs(): this {
  this.m00 = Math.abs(this.m00);
  this.m01 = Math.abs(this.m01);
  this.m10 = Math.abs(this.m10);
  this.m11 = Math.abs(this.m11);
  return this;
 }

 /**
  * Applies sign function to all elements
  * @returns This matrix for chaining
  * @category Transform
  * @since 0.7.0
  */
 public sign(): this {
  this.m00 = scalarSign(this.m00);
  this.m01 = scalarSign(this.m01);
  this.m10 = scalarSign(this.m10);
  this.m11 = scalarSign(this.m11);
  return this;
 }

 /**
  * Component-wise minimum with another matrix
  * @param other - Other matrix
  * @returns This matrix for chaining
  * @category Transform
  * @since 0.7.0
  */
 public min(other: ReadonlyMatrix2Like): this {
  this.m00 = Math.min(this.m00, other.m00);
  this.m01 = Math.min(this.m01, other.m01);
  this.m10 = Math.min(this.m10, other.m10);
  this.m11 = Math.min(this.m11, other.m11);
  return this;
 }

 /**
  * Component-wise maximum with another matrix
  * @param other - Other matrix
  * @returns This matrix for chaining
  * @category Transform
  * @since 0.7.0
  */
 public max(other: ReadonlyMatrix2Like): this {
  this.m00 = Math.max(this.m00, other.m00);
  this.m01 = Math.max(this.m01, other.m01);
  this.m10 = Math.max(this.m10, other.m10);
  this.m11 = Math.max(this.m11, other.m11);
  return this;
 }

 /**
  * Clamps all components between min and max matrices
  * @param minM - Per-component minima
  * @param maxM - Per-component maxima
  * @returns This matrix for chaining
  * @category Transform
  * @since 0.7.0
  */
 public clamp(minM: ReadonlyMatrix2Like, maxM: ReadonlyMatrix2Like): this {
  this.m00 = clamp(this.m00, minM.m00, maxM.m00);
  this.m01 = clamp(this.m01, minM.m01, maxM.m01);
  this.m10 = clamp(this.m10, minM.m10, maxM.m10);
  this.m11 = clamp(this.m11, minM.m11, maxM.m11);
  return this;
 }

 /**
  * Clamps all components between scalar bounds
  * @param min - Minimum scalar
  * @param max - Maximum scalar
  * @returns This matrix for chaining
  * @category Transform
  * @since 0.7.0
  */
 public clampScalar(min: number, max: number): this {
  this.m00 = clamp(this.m00, min, max);
  this.m01 = clamp(this.m01, min, max);
  this.m10 = clamp(this.m10, min, max);
  this.m11 = clamp(this.m11, min, max);
  return this;
 }

 /**
  * Pre-multiplies this matrix by another (other × this)
  *
  * @remarks
  * Unlike `multiply`, this applies the other transformation first.
  * Useful when building transformation chains in specific order.
  *
  * @param other - Matrix to multiply by
  * @returns This matrix for chaining
  *
  * @example
  * ```typescript
  * const scale = Matrix2.fromScale(2);
  * const rot = Matrix2.fromRotation(Math.PI / 4);
  * scale.premultiply(rot); // scale is now rot × scale
  * ```
  * @category Arithmetic
  * @since 0.6.0
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

 /**
  * Sets this matrix to a rotation-scale composition in place
  * @param rotation - Rotation angle in radians
  * @param scale - Uniform scale factor or per-axis scale
  * @returns This matrix for chaining
  *
  * @category Matrix Operations
  * @since 0.7.0
  */
 public compose(rotation: number, scale: ReadonlyVector2Like | number): this {
  const { cos, sin } = sinCos(rotation);
  if (typeof scale === 'number') {
   this.m00 = cos * scale;
   this.m01 = sin * scale;
   this.m10 = -sin * scale;
   this.m11 = cos * scale;
  } else {
   this.m00 = cos * scale.x;
   this.m01 = sin * scale.x;
   this.m10 = -sin * scale.y;
   this.m11 = cos * scale.y;
  }
  return this;
 }

 /**
  * Decomposes this matrix into rotation and scale components
  * @returns Object with rotation (radians) and scale (Vector2)
  *
  * @category Matrix Operations
  * @since 0.7.0
  */
 public decompose(): { rotation: number; scale: Vector2 } {
  return Matrix2.decompose(this);
 }

 /* ======================================================================== */
 /* Instance Transforms (Geometric)                                          */
 /* ======================================================================== */

 /**
  * Transforms a vector by this matrix
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
  * @category Transform
  * @since 0.6.0
  */
 public transformVector(vector: ReadonlyVector2Like, out?: Vector2): Vector2 {
  const { x, y } = vector;
  return Vector2.fromValues(this.m00 * x + this.m10 * y, this.m01 * x + this.m11 * y, out);
 }

 /**
  * Rotates this matrix by an angle in place
  * @param angle - Angle in radians
  * @returns This matrix for chaining
  * @category Transform
  * @since 0.6.0
  */
 public rotate(angle: number): this {
  const { cos, sin } = sinCos(angle);
  return this.rotateCS(cos, sin);
 }

 /**
  * Rotates this matrix using precomputed cosine and sine values in place
  *
  * @remarks
  * Use this method in hot paths where the same rotation is applied to multiple
  * matrices. Precompute `cos` and `sin` once and reuse them.
  *
  * @param cos - Cosine of the rotation angle
  * @param sin - Sine of the rotation angle
  * @returns This matrix for chaining
  *
  * @example
  * ```typescript
  * const rotation = Rotation2.fromAngle(Math.PI / 4);
  * const m = new Matrix2();
  * m.rotateCS(rotation.cos, rotation.sin);
  * ```
  *
  * @category Transform
  * @since 0.6.0
  */
 public rotateCS(cos: number, sin: number): this {
  const { m00, m01, m10, m11 } = this;

  this.m00 = m00 * cos + m10 * sin;
  this.m01 = m01 * cos + m11 * sin;
  this.m10 = m00 * -sin + m10 * cos;
  this.m11 = m01 * -sin + m11 * cos;
  return this;
 }

 /**
  * Scales this matrix by per-axis factors
  * @param scale - Scale factors (Vector2 or uniform number)
  * @returns This matrix for chaining
  * @category Transform
  * @since 0.6.0
  */
 public scaleBy(scale: ReadonlyVector2Like | number): this {
  if (typeof scale === 'number') {
   return this.multiplyScalar(scale);
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
  * Gets a column of the matrix as a vector
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
  * @category Column/Row
  * @since 0.6.0
  */
 public getColumn(index: number, out?: Vector2): Vector2 {
  // Development assertion (catch errors early)
  if (__LENGUADOS_DEV__) {
   assertSafeInteger(index, 'Matrix2.getColumn:index');
  }
  if (index === 0) {
   return Vector2.fromValues(this.m00, this.m01, out);
  }
  if (index === 1) {
   return Vector2.fromValues(this.m10, this.m11, out);
  }
  throw new RangeError(`Matrix2.getColumn: index must be 0 or 1, got ${index}`);
 }

 /**
  * Sets a column of the matrix from a vector
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
  * @category Column/Row
  * @since 0.6.0
  */
 public setColumn(index: number, column: ReadonlyVector2Like): this {
  // Development assertion
  if (__LENGUADOS_DEV__) {
   assertSafeInteger(index, 'Matrix2.setColumn:index');
  }
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
  * Gets a row of the matrix as a vector
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
  * @category Column/Row
  * @since 0.6.0
  */
 public getRow(index: number, out?: Vector2): Vector2 {
  // Development assertion
  if (__LENGUADOS_DEV__) {
   assertSafeInteger(index, 'Matrix2.getRow:index');
  }
  if (index === 0) {
   return Vector2.fromValues(this.m00, this.m10, out);
  }
  if (index === 1) {
   return Vector2.fromValues(this.m01, this.m11, out);
  }
  throw new RangeError(`Matrix2.getRow: index must be 0 or 1, got ${index}`);
 }

 /**
  * Sets a row of the matrix from a vector
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
  * @category Column/Row
  * @since 0.6.0
  */
 public setRow(index: number, row: ReadonlyVector2Like): this {
  // Development assertion
  if (__LENGUADOS_DEV__) {
   assertSafeInteger(index, 'Matrix2.setRow:index');
  }
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
  * Exact equality with other matrix (bit-identical)
  *
  * @remarks
  * Use {@link nearEquals} for comparing results of floating-point operations.
  *
  * @param other - Matrix to compare
  * @returns True if all components are exactly identical
  *
  * @category Comparison
  * @since 0.6.0
  */
 public exactEquals(other: ReadonlyMatrix2Like): boolean {
  return Matrix2.exactEquals(this, other);
 }

 /**
  * Approximate equality with other matrix using relative tolerance
  *
  * @remarks
  * Uses relative tolerance: `|a - b| <= epsilon * max(1, |a|, |b|)` per component.
  *
  * @param other - Matrix to compare
  * @param epsilon - Relative tolerance. @defaultValue `EPSILON`
  * @returns True if all component differences are within scaled epsilon
  *
  * @category Comparison
  * @since 0.6.0
  */
 public nearEquals(other: ReadonlyMatrix2Like, epsilon: number = EPSILON): boolean {
  return Matrix2.nearEquals(this, other, epsilon);
 }

 /**
  * Tests if this is the identity matrix
  * @param epsilon - Tolerance (default: EPSILON)
  * @returns True if matrix is identity
  * @category Comparison
  * @since 0.6.0
  */
 public isIdentity(epsilon: number = EPSILON): boolean {
  return Matrix2.isIdentity(this, epsilon);
 }

 /**
  * Tests if this matrix is exactly zero
  * @returns True if all components are zero
  * @category Comparison
  * @since 0.7.0
  */
 public isZero(): boolean {
  return Matrix2.isZero(this);
 }

 /**
  * Tests if this matrix is approximately zero
  * @param epsilon - Tolerance (default: EPSILON)
  * @returns True if all components are within epsilon of zero
  * @category Comparison
  * @since 0.7.0
  */
 public isNearZero(epsilon: number = EPSILON): boolean {
  return Matrix2.isNearZero(this, epsilon);
 }

 /**
  * Tests if all components are finite numbers
  * @returns True if all components are finite
  * @category Comparison
  * @since 0.6.0
  */
 public isFinite(): boolean {
  return Matrix2.isFinite(this);
 }

 /**
  * Tests if any component is NaN
  * @returns True if any component is NaN
  * @category Comparison
  * @since 0.7.0
  */
 public hasNaN(): boolean {
  return Matrix2.hasNaN(this);
 }

 /**
  * Tests if any component is infinite (±Infinity)
  * @returns True if any component is ±Infinity
  * @category Comparison
  * @since 0.7.0
  */
 public hasInfinity(): boolean {
  return Matrix2.hasInfinity(this);
 }

 /**
  * Tests if this matrix is symmetric (m01 ≈ m10)
  *
  * @remarks Uses relative tolerance for comparing off-diagonal elements.
  *
  * @param epsilon - Relative tolerance (default: EPSILON)
  * @returns True if matrix is symmetric
  * @category Comparison
  * @since 0.7.0
  */
 public isSymmetric(epsilon: number = EPSILON): boolean {
  return Matrix2.isSymmetric(this, epsilon);
 }

 /**
  * Tests if this matrix is skew-symmetric
  *
  * @remarks Uses relative tolerance for comparing off-diagonal elements.
  *
  * @param epsilon - Tolerance (default: EPSILON)
  * @returns True if matrix is skew-symmetric
  * @category Comparison
  * @since 0.7.0
  */
 public isSkewSymmetric(epsilon: number = EPSILON): boolean {
  return Matrix2.isSkewSymmetric(this, epsilon);
 }

 /**
  * Tests if this matrix is diagonal
  * @param epsilon - Tolerance (default: EPSILON)
  * @returns True if matrix is diagonal
  * @category Comparison
  * @since 0.7.0
  */
 public isDiagonal(epsilon: number = EPSILON): boolean {
  return Matrix2.isDiagonal(this, epsilon);
 }

 /* ======================================================================== */
 /* Instance Interpolation                                                   */
 /* ======================================================================== */

 /**
  * Linear interpolation with another matrix in place (unclamped)
  * @param other - Target matrix
  * @param t - Interpolation factor (unclamped, allows extrapolation)
  * @returns This matrix for chaining
  *
  * @example
  * ```typescript
  * const a = Matrix2.IDENTITY.clone();
  * const b = Matrix2.fromRotation(Math.PI / 2);
  * a.lerp(b, 0.5); // a is now halfway between identity and b
  * ```
  * @category Interpolation
  * @since 0.7.0
  */
 public lerp(other: ReadonlyMatrix2Like, t: number): this {
  this.m00 = lerp(this.m00, other.m00, t);
  this.m01 = lerp(this.m01, other.m01, t);
  this.m10 = lerp(this.m10, other.m10, t);
  this.m11 = lerp(this.m11, other.m11, t);
  return this;
 }

 /**
  * Clamped linear interpolation (alias for lerp)
  *
  * @param other - Target matrix
  * @param t - Interpolation factor (clamped to [0, 1])
  * @returns This matrix for chaining
  *
  * @category Interpolation
  * @since 0.7.0
  */
 public lerpClamped(other: ReadonlyMatrix2Like, t: number): this {
  return this.lerp(other, saturate(t));
 }

 /**
  * Smooth step interpolation with another matrix
  *
  * @param other - Target matrix
  * @param t - Interpolation factor [0, 1]
  * @returns This matrix for chaining
  *
  * @category Interpolation
  * @since 0.7.0
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

 /* ======================================================================== */
 /* Instance Conversion                                                      */
 /* ======================================================================== */

 /**
  * Writes the matrix to an array or typed array
  *
  * @remarks
  * Follows the same pattern as {@link Vector2.toArray} for API consistency.
  * Accepts any array-like type that supports indexed assignment.
  *
  * @template T - Array type (number[], Float32Array, Float64Array, etc.)
  * @param out - Optional output array. If not provided, returns a new tuple
  * @param offset - Write offset. @defaultValue `0`
  * @param columnMajor - Use column-major order. @defaultValue `true`
  * @returns The output array, or a new tuple if no output was provided
  * @throws {RangeError} If offset is out of bounds
  *
  * @category Conversion
  * @since 0.6.0
  */
 public toArray<T extends ArrayLike<number> & { [index: number]: number }>(
  out?: T,
  offset = 0,
  columnMajor = true,
 ): T | [number, number, number, number] {
  if (!out) {
   if (columnMajor) {
    return [this.m00, this.m01, this.m10, this.m11];
   }
   return [this.m00, this.m10, this.m01, this.m11];
  }

  if (offset < 0 || offset + 4 > out.length) {
   throw new RangeError(
    `Matrix2.toArray: offset ${offset} out of bounds for array length ${out.length}`,
   );
  }

  if (columnMajor) {
   out[offset] = this.m00;
   out[offset + 1] = this.m01;
   out[offset + 2] = this.m10;
   out[offset + 3] = this.m11;
  } else {
   out[offset] = this.m00;
   out[offset + 1] = this.m10;
   out[offset + 2] = this.m01;
   out[offset + 3] = this.m11;
  }

  return out;
 }

 /**
  * Converts to a plain object
  * @returns Object with m00, m01, m10, m11 properties
  * @category Conversion
  * @since 0.6.0
  */
 public toObject(): Matrix2Like {
  return { m00: this.m00, m01: this.m01, m10: this.m10, m11: this.m11 };
 }

 /**
  * Alias for toObject (JSON serialization)
  * @returns Object with matrix components
  * @category Conversion
  * @since 0.6.0
  */
 public toJSON(): Matrix2Like {
  return this.toObject();
 }

 /**
  * Converts this matrix to a Matrix3Like (embeds in homogeneous coordinates)
  *
  * @remarks
  * Returns a `Matrix3Like` object, not a `Matrix3` instance, to avoid
  * circular dependencies. If you need a full `Matrix3` instance, use:
  * ```typescript
  * const mat3 = Matrix3.fromMatrix2(this);
  * ```
  *
  * The 2×2 matrix is embedded in the upper-left corner:
  * ```
  * [ m00  m10  0 ]
  * [ m01  m11  0 ]
  * [  0    0   1 ]
  * ```
  *
  * @param out - Optional output object to populate
  * @returns Matrix3Like representation (plain object or provided out)
  *
  * @example
  * ```typescript
  * const m2 = Matrix2.fromRotation(Math.PI / 4);
  * const m3Like = m2.toMatrix3Like();
  * // m3Like represents the same rotation in homogeneous coordinates
  * ```
  *
  * @see {@link Matrix3.fromMatrix2} - Construct a full `Matrix3` class from a `ReadonlyMatrix2Like`
  *
  * @category Conversion
  * @since 0.6.0
  */
 public toMatrix3Like(out?: Matrix3Like): Matrix3Like {
  const result = out ?? {
   m00: 0,
   m01: 0,
   m02: 0,
   m10: 0,
   m11: 0,
   m12: 0,
   m20: 0,
   m21: 0,
   m22: 0,
  };
  result.m00 = this.m00;
  result.m01 = this.m01;
  result.m02 = 0;
  result.m10 = this.m10;
  result.m11 = this.m11;
  result.m12 = 0;
  result.m20 = 0;
  result.m21 = 0;
  result.m22 = 1;
  return result;
 }

 /**
  * Converts to string representation
  * @param precision - Number of decimal places (default: 4)
  * @returns String representation
  * @category Conversion
  * @since 0.6.0
  */
 public toString(precision = 4): string {
  const p = (n: number) => n.toFixed(precision);
  return `Matrix2(\n  ${p(this.m00)}, ${p(this.m10)}\n  ${p(this.m01)}, ${p(this.m11)}\n)`;
 }

 /**
  * Creates a clone of this matrix
  * @returns New matrix with same components
  * @category Conversion
  * @since 0.6.0
  */
 public clone(): Matrix2 {
  return new Matrix2(this.m00, this.m01, this.m10, this.m11);
 }

 /**
  * Iterator for array destructuring (column-major order)
  * @returns Iterator yielding m00, m01, m10, m11
  *
  * @example
  * ```typescript
  * const [m00, m01, m10, m11] = Matrix2.IDENTITY;
  * ```
  *
  * @category Conversion
  * @since 0.6.0
  */
 public *[Symbol.iterator](): IterableIterator<number> {
  yield this.m00;
  yield this.m01;
  yield this.m10;
  yield this.m11;
 }
}
