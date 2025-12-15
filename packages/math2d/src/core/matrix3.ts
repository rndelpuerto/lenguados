/**
 * @file core/matrix3.ts
 * @module @lenguados/math2d/core
 * @description Deterministic 3×3 matrix implementation for 2D affine transformations.
 *
 * @remarks
 * **Mathematical Foundation**
 * - Represents linear transformations extended with translation via homogeneous coordinates
 * - Upper-left 2×2 block contains the linear part (rotation, scale, shear)
 * - Third column contains the translation vector
 * - Bottom row is [0, 0, 1] for affine transformations
 *
 * **API Design**
 * - Instance methods mutate `this` for fluent chaining
 * - Static helpers are pure and provide optional `out` parameters for allocation control
 * - Trigonometric operations use {@link DeterministicMath} for cross-platform reproducibility
 *
 * **Matrix Layout (Column-Major)**
 * ```
 * | m00  m10  m20 |   | scaleX*cos  -scaleY*sin  translateX |
 * | m01  m11  m21 | = | scaleX*sin   scaleY*cos  translateY |
 * | m02  m12  m22 |   |     0            0           1      |
 * ```
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
import type {
 Matrix3Like,
 ReadonlyMatrix2Like,
 ReadonlyMatrix3Like,
 ReadonlyRotation2Like,
 ReadonlyVector2Like,
} from '../types';
import { assertFinite, assertSafeInteger } from '../validation/assert';

import { Matrix2 } from './matrix2';
import { Vector2 } from './vector2';

/* ======================================================================== */
/* Type Exports                                                             */
/* ======================================================================== */

/**
 * Readonly view of a {@link Matrix3} instance.
 * @public
 */
export type ReadonlyMatrix3 = Readonly<Matrix3>;

/* ======================================================================== */
/* Helper Functions                                                         */
/* ======================================================================== */

/**
 * Permanently freezes a {@link Matrix3} instance so it can no longer be mutated.
 *
 * @param matrix - The Matrix3 object to freeze.
 * @returns The same instance, now typed as ReadonlyMatrix3.
 *
 * @remarks
 * - The returned object keeps its original reference; no new memory is allocated.
 * - In strict mode any subsequent attempt to modify properties throws a TypeError.
 *
 * @example
 * ```typescript
 * const IDENTITY = freezeMatrix3(new Matrix3());
 * IDENTITY.m00 = 5; // Throws in strict mode
 * ```
 *
 * @category Helpers
 * @since 0.9.0
 */
export function freezeMatrix3(matrix: Matrix3): ReadonlyMatrix3 {
 return Object.freeze(matrix);
}

export { isMatrix3Like } from '../types';

/**
 * Column-major 3×3 matrix for 2D affine transformations in homogeneous coordinates.
 *
 * @remarks
 * **API Design**
 * - Instance methods mutate `this` for fluent chaining
 * - Static helpers are pure and provide optional `out` parameters for allocation control
 * - Trigonometric operations use {@link DeterministicMath} for cross-platform reproducibility
 *
 * @example
 * ```typescript
 * // Compose transformations
 * const transform = Matrix3.fromTranslation({ x: 100, y: 50 })
 *   .rotate(Math.PI / 4)
 *   .scaleBy(2);
 *
 * // Apply to point
 * const worldPoint = transform.transformPoint({ x: 0, y: 0 });
 * ```
 *
 * @category Core
 * @since 0.1.0
 */
export class Matrix3 implements Matrix3Like {
 /* ======================================================================== */
 /* Private Helpers                                                          */
 /* ======================================================================== */

 private static ensureOut(out?: Matrix3): Matrix3 {
  return out ?? new Matrix3();
 }

 private static sanitizeComponent(value: number, label: string): number {
  assertFinite(value, label);
  return value;
 }

 /* ======================================================================== */
 /* Static Constants (Immutable)                                             */
 /* ======================================================================== */

 /** Identity matrix (no transformation). */
 public static readonly IDENTITY = freezeMatrix3(new Matrix3(1, 0, 0, 0, 1, 0, 0, 0, 1));

 /** Zero matrix. */
 public static readonly ZERO = freezeMatrix3(new Matrix3(0, 0, 0, 0, 0, 0, 0, 0, 0));

 /** All-ones matrix. */
 public static readonly ONE = freezeMatrix3(new Matrix3(1, 1, 1, 1, 1, 1, 1, 1, 1));

 /** Epsilon matrix (EPSILON in all elements). */
 public static readonly EPSILON_MATRIX = freezeMatrix3(
  new Matrix3(EPSILON, EPSILON, EPSILON, EPSILON, EPSILON, EPSILON, EPSILON, EPSILON, EPSILON),
 );

 /** Flip horizontally (mirror across Y axis). */
 public static readonly FLIP_X = freezeMatrix3(new Matrix3(-1, 0, 0, 0, 1, 0, 0, 0, 1));

 /** Flip vertically (mirror across X axis). */
 public static readonly FLIP_Y = freezeMatrix3(new Matrix3(1, 0, 0, 0, -1, 0, 0, 0, 1));

 /** Flip both axes (equivalent to ROTATE_180). */
 public static readonly FLIP_XY = freezeMatrix3(new Matrix3(-1, 0, 0, 0, -1, 0, 0, 0, 1));

 /** 90° counter-clockwise rotation. */
 public static readonly ROTATE_90 = freezeMatrix3(new Matrix3(0, 1, 0, -1, 0, 0, 0, 0, 1));

 /** 180° rotation. */
 public static readonly ROTATE_180 = freezeMatrix3(new Matrix3(-1, 0, 0, 0, -1, 0, 0, 0, 1));

 /** 270° counter-clockwise rotation (90° clockwise). */
 public static readonly ROTATE_270 = freezeMatrix3(new Matrix3(0, -1, 0, 1, 0, 0, 0, 0, 1));

 /** Uniform scale by 2. */
 public static readonly SCALE_2 = freezeMatrix3(new Matrix3(2, 0, 0, 0, 2, 0, 0, 0, 1));

 /** Uniform scale by 0.5. */
 public static readonly SCALE_HALF = freezeMatrix3(new Matrix3(0.5, 0, 0, 0, 0.5, 0, 0, 0, 1));

 /* ======================================================================== */
 /* Static Factories                                                         */
 /* ======================================================================== */

 /**
  * Creates a matrix from explicit components.
  *
  * @param m00 - Element at row 0, column 0.
  * @param m01 - Element at row 1, column 0.
  * @param m02 - Element at row 2, column 0.
  * @param m10 - Element at row 0, column 1.
  * @param m11 - Element at row 1, column 1.
  * @param m12 - Element at row 2, column 1.
  * @param m20 - Element at row 0, column 2.
  * @param m21 - Element at row 1, column 2.
  * @param m22 - Element at row 2, column 2.
  * @param out - Optional output matrix.
  * @returns A Matrix3 with the specified components.
  *
  * @category Factory
  * @since 0.1.0
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
  out?: Matrix3,
 ): Matrix3 {
  return Matrix3.ensureOut(out).set(m00, m01, m02, m10, m11, m12, m20, m21, m22);
 }

 /**
  * Creates a deep copy of a matrix.
  *
  * @param source - Matrix to clone.
  * @param out - Optional output matrix.
  * @returns A Matrix3 with identical components.
  *
  * @category Factory
  * @since 0.1.0
  */
 public static clone(source: ReadonlyMatrix3Like, out?: Matrix3): Matrix3 {
  return Matrix3.ensureOut(out).set(
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
  * Copies component values from source into destination (alloc-free).
  *
  * @param source - Source matrix.
  * @param destination - Target matrix to receive the copy.
  * @returns The destination matrix.
  *
  * @category Factory
  * @since 0.9.0
  */
 public static copy(source: ReadonlyMatrix3Like, destination: Matrix3): Matrix3 {
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
  * Creates a matrix from a plain object.
  *
  * @param object - Plain object with m00-m22 properties.
  * @param out - Optional output matrix.
  * @returns A Matrix3 with the object's components.
  * @throws {Error} If any component is not finite.
  *
  * @category Factory
  * @since 0.9.0
  */
 public static fromObject(object: ReadonlyMatrix3Like, out?: Matrix3): Matrix3 {
  const m00 = Matrix3.sanitizeComponent(object.m00, 'Matrix3.fromObject:m00');
  const m01 = Matrix3.sanitizeComponent(object.m01, 'Matrix3.fromObject:m01');
  const m02 = Matrix3.sanitizeComponent(object.m02, 'Matrix3.fromObject:m02');
  const m10 = Matrix3.sanitizeComponent(object.m10, 'Matrix3.fromObject:m10');
  const m11 = Matrix3.sanitizeComponent(object.m11, 'Matrix3.fromObject:m11');
  const m12 = Matrix3.sanitizeComponent(object.m12, 'Matrix3.fromObject:m12');
  const m20 = Matrix3.sanitizeComponent(object.m20, 'Matrix3.fromObject:m20');
  const m21 = Matrix3.sanitizeComponent(object.m21, 'Matrix3.fromObject:m21');
  const m22 = Matrix3.sanitizeComponent(object.m22, 'Matrix3.fromObject:m22');
  return Matrix3.ensureOut(out).set(m00, m01, m02, m10, m11, m12, m20, m21, m22);
 }

 /**
  * Creates a translation matrix.
  *
  * @param translation - Translation vector.
  * @param out - Optional output matrix.
  * @returns A Matrix3 representing the translation.
  *
  * @category Factory
  * @since 0.1.0
  */
 public static fromTranslation(translation: ReadonlyVector2Like, out?: Matrix3): Matrix3 {
  return Matrix3.ensureOut(out).set(1, 0, 0, 0, 1, 0, translation.x, translation.y, 1);
 }

 /**
  * Creates a rotation matrix from an angle or Rotation2.
  *
  * @param rotation - Angle in radians or a Rotation2Like object.
  * @param out - Optional output matrix.
  * @returns A Matrix3 representing the rotation.
  *
  * @category Factory
  * @since 0.1.0
  */
 public static fromRotation(rotation: number | ReadonlyRotation2Like, out?: Matrix3): Matrix3 {
  let c: number;
  let s: number;
  if (typeof rotation === 'number') {
   const result = sinCos(rotation);
   c = result.cos;
   s = result.sin;
  } else {
   c = rotation.cos;
   s = rotation.sin;
  }
  return Matrix3.ensureOut(out).set(c, s, 0, -s, c, 0, 0, 0, 1);
 }

 /**
  * Creates a scale matrix.
  *
  * @param scale - Scale factor (uniform) or Vector2 (non-uniform).
  * @param out - Optional output matrix.
  * @returns A Matrix3 representing the scale.
  *
  * @category Factory
  * @since 0.1.0
  */
 public static fromScale(scale: ReadonlyVector2Like | number, out?: Matrix3): Matrix3 {
  const target = Matrix3.ensureOut(out);
  if (typeof scale === 'number') {
   return target.set(scale, 0, 0, 0, scale, 0, 0, 0, 1);
  }
  return target.set(scale.x, 0, 0, 0, scale.y, 0, 0, 0, 1);
 }

 /**
  * Creates a Matrix3 from a Matrix2 (embeds 2×2 in homogeneous coordinates).
  *
  * @param matrix - Source 2×2 matrix.
  * @param out - Optional output matrix.
  * @returns A Matrix3 with the 2×2 matrix in the upper-left.
  *
  * @category Factory
  * @since 0.1.0
  */
 public static fromMatrix2(matrix: ReadonlyMatrix2Like, out?: Matrix3): Matrix3 {
  return Matrix3.ensureOut(out).set(matrix.m00, matrix.m01, 0, matrix.m10, matrix.m11, 0, 0, 0, 1);
 }

 /**
  * Creates a transform matrix from translation, rotation, and scale.
  *
  * @param translation - Translation vector.
  * @param rotation - Rotation angle in radians.
  * @param scale - Scale factor (uniform) or Vector2 (non-uniform).
  * @param out - Optional output matrix.
  * @returns A Matrix3 representing the combined transform (T × R × S).
  *
  * @category Factory
  * @since 0.1.0
  */
 public static fromTransform(
  translation: ReadonlyVector2Like,
  rotation: number,
  scale: ReadonlyVector2Like | number,
  out?: Matrix3,
 ): Matrix3 {
  const { cos, sin } = sinCos(rotation);
  const target = Matrix3.ensureOut(out);

  if (typeof scale === 'number') {
   const sc = scale * cos;
   const ss = scale * sin;
   return target.set(sc, ss, 0, -ss, sc, 0, translation.x, translation.y, 1);
  }

  return target.set(
   scale.x * cos,
   scale.x * sin,
   0,
   scale.y * -sin,
   scale.y * cos,
   0,
   translation.x,
   translation.y,
   1,
  );
 }

 /**
  * Creates a matrix from column vectors.
  *
  * @param col0 - First column [m00, m01, m02].
  * @param col1 - Second column [m10, m11, m12].
  * @param col2 - Third column [m20, m21, m22].
  * @param out - Optional output matrix.
  * @returns A Matrix3 with the specified columns.
  *
  * @category Factory
  * @since 0.9.0
  */
 public static fromColumns(
  col0: readonly [number, number, number],
  col1: readonly [number, number, number],
  col2: readonly [number, number, number],
  out?: Matrix3,
 ): Matrix3 {
  return Matrix3.ensureOut(out).set(
   col0[0],
   col0[1],
   col0[2],
   col1[0],
   col1[1],
   col1[2],
   col2[0],
   col2[1],
   col2[2],
  );
 }

 /**
  * Creates a matrix from row vectors.
  *
  * @param row0 - First row [m00, m10, m20].
  * @param row1 - Second row [m01, m11, m21].
  * @param row2 - Third row [m02, m12, m22].
  * @param out - Optional output matrix.
  * @returns A Matrix3 with the specified rows.
  *
  * @category Factory
  * @since 0.9.0
  */
 public static fromRows(
  row0: readonly [number, number, number],
  row1: readonly [number, number, number],
  row2: readonly [number, number, number],
  out?: Matrix3,
 ): Matrix3 {
  return Matrix3.ensureOut(out).set(
   row0[0],
   row1[0],
   row2[0],
   row0[1],
   row1[1],
   row2[1],
   row0[2],
   row1[2],
   row2[2],
  );
 }

 /**
  * Creates an orthographic projection matrix for 2D.
  *
  * @param left - Left boundary.
  * @param right - Right boundary.
  * @param bottom - Bottom boundary.
  * @param top - Top boundary.
  * @param out - Optional output matrix.
  * @returns A Matrix3 representing the orthographic projection.
  *
  * @category Factory
  * @since 0.1.0
  */
 public static ortho(
  left: number,
  right: number,
  bottom: number,
  top: number,
  out?: Matrix3,
 ): Matrix3 {
  const width = right - left;
  const height = top - bottom;
  const tx = -(right + left) / width;
  const ty = -(top + bottom) / height;
  return Matrix3.ensureOut(out).set(2 / width, 0, 0, 0, 2 / height, 0, tx, ty, 1);
 }

 /**
  * Creates a matrix from a flat numeric array.
  *
  * @param array - Numeric array with at least 9 elements.
  * @param offset - Index of the first element. @defaultValue `0`
  * @param columnMajor - If true, reads column-major; if false, row-major. @defaultValue `true`
  * @param out - Optional output matrix.
  * @returns A Matrix3 initialized from the array.
  * @throws {RangeError} If offset is out of bounds.
  *
  * @category Factory
  * @since 0.1.0
  */
 public static fromArray(
  array: ArrayLike<number>,
  offset = 0,
  columnMajor = true,
  out?: Matrix3,
 ): Matrix3 {
  const ELEMENT_COUNT = 9;
  if (offset < 0 || offset + ELEMENT_COUNT > array.length) {
   throw new RangeError(
    `Matrix3.fromArray: offset ${offset} out of bounds for array length ${array.length}`,
   );
  }

  const values = new Array<number>(ELEMENT_COUNT);
  for (let index = 0; index < ELEMENT_COUNT; index++) {
   values[index] = Matrix3.sanitizeComponent(
    array[offset + index]!,
    `Matrix3.fromArray:${offset + index}`,
   );
  }

  if (columnMajor) {
   return Matrix3.ensureOut(out).set(
    values[0]!,
    values[1]!,
    values[2]!,
    values[3]!,
    values[4]!,
    values[5]!,
    values[6]!,
    values[7]!,
    values[8]!,
   );
  }

  return Matrix3.ensureOut(out).set(
   values[0]!,
   values[3]!,
   values[6]!,
   values[1]!,
   values[4]!,
   values[7]!,
   values[2]!,
   values[5]!,
   values[8]!,
  );
 }

 /* ======================================================================== */
 /* Static Arithmetic                                                        */
 /* ======================================================================== */

 /**
  * Component-wise addition `a + b`.
  *
  * @param a - First addend.
  * @param b - Second addend.
  * @param out - Optional output matrix.
  * @returns Matrix with component-wise sums.
  *
  * @category Arithmetic
  * @since 0.1.0
  */
 public static add(a: ReadonlyMatrix3Like, b: ReadonlyMatrix3Like, out?: Matrix3): Matrix3 {
  return Matrix3.ensureOut(out).set(
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
  * Adds a scalar to all elements.
  *
  * @param m - Source matrix.
  * @param s - Scalar to add.
  * @param out - Optional output matrix.
  * @returns Matrix with scalar added to each element.
  *
  * @category Arithmetic
  * @since 0.9.0
  */
 public static addScalar(m: ReadonlyMatrix3Like, s: number, out?: Matrix3): Matrix3 {
  return Matrix3.ensureOut(out).set(
   m.m00 + s,
   m.m01 + s,
   m.m02 + s,
   m.m10 + s,
   m.m11 + s,
   m.m12 + s,
   m.m20 + s,
   m.m21 + s,
   m.m22 + s,
  );
 }

 /**
  * Component-wise subtraction `a - b`.
  *
  * @param a - Minuend.
  * @param b - Subtrahend.
  * @param out - Optional output matrix.
  * @returns Matrix with component-wise differences.
  *
  * @category Arithmetic
  * @since 0.1.0
  */
 public static subtract(a: ReadonlyMatrix3Like, b: ReadonlyMatrix3Like, out?: Matrix3): Matrix3 {
  return Matrix3.ensureOut(out).set(
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
  * Subtracts a scalar from all elements.
  *
  * @param m - Source matrix.
  * @param s - Scalar to subtract.
  * @param out - Optional output matrix.
  * @returns Matrix with scalar subtracted from each element.
  *
  * @category Arithmetic
  * @since 0.9.0
  */
 public static subtractScalar(m: ReadonlyMatrix3Like, s: number, out?: Matrix3): Matrix3 {
  return Matrix3.ensureOut(out).set(
   m.m00 - s,
   m.m01 - s,
   m.m02 - s,
   m.m10 - s,
   m.m11 - s,
   m.m12 - s,
   m.m20 - s,
   m.m21 - s,
   m.m22 - s,
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
  a: ReadonlyMatrix3Like,
  scale: number,
  b: ReadonlyMatrix3Like,
  out?: Matrix3,
 ): Matrix3 {
  return Matrix3.ensureOut(out).set(
   a.m00 * scale + b.m00,
   a.m01 * scale + b.m01,
   a.m02 * scale + b.m02,
   a.m10 * scale + b.m10,
   a.m11 * scale + b.m11,
   a.m12 * scale + b.m12,
   a.m20 * scale + b.m20,
   a.m21 * scale + b.m21,
   a.m22 * scale + b.m22,
  );
 }

 /**
  * Matrix multiplication `a × b`.
  *
  * @param a - Left operand.
  * @param b - Right operand.
  * @param out - Optional output matrix.
  * @returns Matrix product.
  *
  * @category Arithmetic
  * @since 0.1.0
  */
 public static multiply(a: ReadonlyMatrix3Like, b: ReadonlyMatrix3Like, out?: Matrix3): Matrix3 {
  const r00 = a.m00 * b.m00 + a.m10 * b.m01 + a.m20 * b.m02;
  const r01 = a.m01 * b.m00 + a.m11 * b.m01 + a.m21 * b.m02;
  const r02 = a.m02 * b.m00 + a.m12 * b.m01 + a.m22 * b.m02;

  const r10 = a.m00 * b.m10 + a.m10 * b.m11 + a.m20 * b.m12;
  const r11 = a.m01 * b.m10 + a.m11 * b.m11 + a.m21 * b.m12;
  const r12 = a.m02 * b.m10 + a.m12 * b.m11 + a.m22 * b.m12;

  const r20 = a.m00 * b.m20 + a.m10 * b.m21 + a.m20 * b.m22;
  const r21 = a.m01 * b.m20 + a.m11 * b.m21 + a.m21 * b.m22;
  const r22 = a.m02 * b.m20 + a.m12 * b.m21 + a.m22 * b.m22;

  return Matrix3.ensureOut(out).set(r00, r01, r02, r10, r11, r12, r20, r21, r22);
 }

 /**
  * Scales all elements by a scalar.
  *
  * @param matrix - Source matrix.
  * @param scalar - Scale factor.
  * @param out - Optional output matrix.
  * @returns Scaled matrix.
  *
  * @category Arithmetic
  * @since 0.1.0
  */
 public static scale(matrix: ReadonlyMatrix3Like, scalar: number, out?: Matrix3): Matrix3 {
  return Matrix3.ensureOut(out).set(
   matrix.m00 * scalar,
   matrix.m01 * scalar,
   matrix.m02 * scalar,
   matrix.m10 * scalar,
   matrix.m11 * scalar,
   matrix.m12 * scalar,
   matrix.m20 * scalar,
   matrix.m21 * scalar,
   matrix.m22 * scalar,
  );
 }

 /**
  * Alias for scale - multiplies all elements by a scalar.
  *
  * @param matrix - Source matrix.
  * @param scalar - Scale factor.
  * @param out - Optional output matrix.
  * @returns Scaled matrix.
  *
  * @category Arithmetic
  * @since 0.9.0
  */
 public static multiplyScalar(matrix: ReadonlyMatrix3Like, scalar: number, out?: Matrix3): Matrix3 {
  return Matrix3.scale(matrix, scalar, out);
 }

 /**
  * Divides all elements by a scalar.
  *
  * @param matrix - Source matrix.
  * @param scalar - Divisor.
  * @param out - Optional output matrix.
  * @returns Matrix with each element divided by scalar.
  *
  * @category Arithmetic
  * @since 0.9.0
  */
 public static divideScalar(matrix: ReadonlyMatrix3Like, scalar: number, out?: Matrix3): Matrix3 {
  if (isNearZero(scalar)) {
   return Matrix3.ensureOut(out).set(0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
  const inv = 1 / scalar;
  return Matrix3.scale(matrix, inv, out);
 }

 /**
  * Negates all elements.
  *
  * @param matrix - Source matrix.
  * @param out - Optional output matrix.
  * @returns Negated matrix.
  *
  * @category Arithmetic
  * @since 0.1.0
  */
 public static negate(matrix: ReadonlyMatrix3Like, out?: Matrix3): Matrix3 {
  return Matrix3.ensureOut(out).set(
   -matrix.m00,
   -matrix.m01,
   -matrix.m02,
   -matrix.m10,
   -matrix.m11,
   -matrix.m12,
   -matrix.m20,
   -matrix.m21,
   -matrix.m22,
  );
 }

 /* ======================================================================== */
 /* Static Numeric Transforms                                                */
 /* ======================================================================== */

 /**
  * Applies Math.floor to all elements.
  *
  * @param matrix - Source matrix.
  * @param out - Optional output matrix.
  * @returns Floored matrix.
  *
  * @category Transform
  * @since 0.9.0
  */
 public static floor(matrix: ReadonlyMatrix3Like, out?: Matrix3): Matrix3 {
  return Matrix3.ensureOut(out).set(
   Math.floor(matrix.m00),
   Math.floor(matrix.m01),
   Math.floor(matrix.m02),
   Math.floor(matrix.m10),
   Math.floor(matrix.m11),
   Math.floor(matrix.m12),
   Math.floor(matrix.m20),
   Math.floor(matrix.m21),
   Math.floor(matrix.m22),
  );
 }

 /**
  * Applies Math.ceil to all elements.
  *
  * @param matrix - Source matrix.
  * @param out - Optional output matrix.
  * @returns Ceiled matrix.
  *
  * @category Transform
  * @since 0.9.0
  */
 public static ceil(matrix: ReadonlyMatrix3Like, out?: Matrix3): Matrix3 {
  return Matrix3.ensureOut(out).set(
   Math.ceil(matrix.m00),
   Math.ceil(matrix.m01),
   Math.ceil(matrix.m02),
   Math.ceil(matrix.m10),
   Math.ceil(matrix.m11),
   Math.ceil(matrix.m12),
   Math.ceil(matrix.m20),
   Math.ceil(matrix.m21),
   Math.ceil(matrix.m22),
  );
 }

 /**
  * Applies Math.round to all elements.
  *
  * @param matrix - Source matrix.
  * @param out - Optional output matrix.
  * @returns Rounded matrix.
  *
  * @category Transform
  * @since 0.9.0
  */
 public static round(matrix: ReadonlyMatrix3Like, out?: Matrix3): Matrix3 {
  return Matrix3.ensureOut(out).set(
   Math.round(matrix.m00),
   Math.round(matrix.m01),
   Math.round(matrix.m02),
   Math.round(matrix.m10),
   Math.round(matrix.m11),
   Math.round(matrix.m12),
   Math.round(matrix.m20),
   Math.round(matrix.m21),
   Math.round(matrix.m22),
  );
 }

 /**
  * Applies absolute value to all elements.
  *
  * @param matrix - Source matrix.
  * @param out - Optional output matrix.
  * @returns Absolute-valued matrix.
  *
  * @category Transform
  * @since 0.9.0
  */
 public static abs(matrix: ReadonlyMatrix3Like, out?: Matrix3): Matrix3 {
  return Matrix3.ensureOut(out).set(
   scalarAbs(matrix.m00),
   scalarAbs(matrix.m01),
   scalarAbs(matrix.m02),
   scalarAbs(matrix.m10),
   scalarAbs(matrix.m11),
   scalarAbs(matrix.m12),
   scalarAbs(matrix.m20),
   scalarAbs(matrix.m21),
   scalarAbs(matrix.m22),
  );
 }

 /**
  * Applies sign function to all elements.
  *
  * @param matrix - Source matrix.
  * @param out - Optional output matrix.
  * @returns Matrix with signs (-1, 0, or 1).
  *
  * @category Transform
  * @since 0.9.0
  */
 public static sign(matrix: ReadonlyMatrix3Like, out?: Matrix3): Matrix3 {
  return Matrix3.ensureOut(out).set(
   scalarSign(matrix.m00),
   scalarSign(matrix.m01),
   scalarSign(matrix.m02),
   scalarSign(matrix.m10),
   scalarSign(matrix.m11),
   scalarSign(matrix.m12),
   scalarSign(matrix.m20),
   scalarSign(matrix.m21),
   scalarSign(matrix.m22),
  );
 }

 /**
  * Component-wise minimum of two matrices.
  *
  * @param a - First matrix.
  * @param b - Second matrix.
  * @param out - Optional output matrix.
  * @returns Matrix with component-wise minima.
  *
  * @category Transform
  * @since 0.9.0
  */
 public static min(a: ReadonlyMatrix3Like, b: ReadonlyMatrix3Like, out?: Matrix3): Matrix3 {
  return Matrix3.ensureOut(out).set(
   scalarMin(a.m00, b.m00),
   scalarMin(a.m01, b.m01),
   scalarMin(a.m02, b.m02),
   scalarMin(a.m10, b.m10),
   scalarMin(a.m11, b.m11),
   scalarMin(a.m12, b.m12),
   scalarMin(a.m20, b.m20),
   scalarMin(a.m21, b.m21),
   scalarMin(a.m22, b.m22),
  );
 }

 /**
  * Component-wise maximum of two matrices.
  *
  * @param a - First matrix.
  * @param b - Second matrix.
  * @param out - Optional output matrix.
  * @returns Matrix with component-wise maxima.
  *
  * @category Transform
  * @since 0.9.0
  */
 public static max(a: ReadonlyMatrix3Like, b: ReadonlyMatrix3Like, out?: Matrix3): Matrix3 {
  return Matrix3.ensureOut(out).set(
   scalarMax(a.m00, b.m00),
   scalarMax(a.m01, b.m01),
   scalarMax(a.m02, b.m02),
   scalarMax(a.m10, b.m10),
   scalarMax(a.m11, b.m11),
   scalarMax(a.m12, b.m12),
   scalarMax(a.m20, b.m20),
   scalarMax(a.m21, b.m21),
   scalarMax(a.m22, b.m22),
  );
 }

 /**
  * Component-wise clamp between two matrices.
  *
  * @param m - Matrix to clamp.
  * @param minM - Per-component minima.
  * @param maxM - Per-component maxima.
  * @param out - Optional output matrix.
  * @returns Clamped matrix.
  *
  * @category Transform
  * @since 0.9.0
  */
 public static clamp(
  m: ReadonlyMatrix3Like,
  minM: ReadonlyMatrix3Like,
  maxM: ReadonlyMatrix3Like,
  out?: Matrix3,
 ): Matrix3 {
  return Matrix3.ensureOut(out).set(
   clamp(m.m00, minM.m00, maxM.m00),
   clamp(m.m01, minM.m01, maxM.m01),
   clamp(m.m02, minM.m02, maxM.m02),
   clamp(m.m10, minM.m10, maxM.m10),
   clamp(m.m11, minM.m11, maxM.m11),
   clamp(m.m12, minM.m12, maxM.m12),
   clamp(m.m20, minM.m20, maxM.m20),
   clamp(m.m21, minM.m21, maxM.m21),
   clamp(m.m22, minM.m22, maxM.m22),
  );
 }

 /**
  * Clamps all elements between scalar bounds.
  *
  * @param m - Matrix to clamp.
  * @param min - Minimum scalar.
  * @param max - Maximum scalar.
  * @param out - Optional output matrix.
  * @returns Clamped matrix.
  *
  * @category Transform
  * @since 0.9.0
  */
 public static clampScalar(
  m: ReadonlyMatrix3Like,
  min: number,
  max: number,
  out?: Matrix3,
 ): Matrix3 {
  return Matrix3.ensureOut(out).set(
   clamp(m.m00, min, max),
   clamp(m.m01, min, max),
   clamp(m.m02, min, max),
   clamp(m.m10, min, max),
   clamp(m.m11, min, max),
   clamp(m.m12, min, max),
   clamp(m.m20, min, max),
   clamp(m.m21, min, max),
   clamp(m.m22, min, max),
  );
 }

 /* ======================================================================== */
 /* Static Interpolation                                                     */
 /* ======================================================================== */

 /**
  * Linear interpolation with t clamped to [0, 1].
  *
  * @param a - Start matrix.
  * @param b - End matrix.
  * @param t - Interpolation factor (clamped).
  * @param out - Optional output matrix.
  * @returns Interpolated matrix.
  *
  * @category Interpolation
  * @since 0.1.0
  */
 public static lerp(
  a: ReadonlyMatrix3Like,
  b: ReadonlyMatrix3Like,
  t: number,
  out?: Matrix3,
 ): Matrix3 {
  return Matrix3.ensureOut(out).set(
   lerp(a.m00, b.m00, t),
   lerp(a.m01, b.m01, t),
   lerp(a.m02, b.m02, t),
   lerp(a.m10, b.m10, t),
   lerp(a.m11, b.m11, t),
   lerp(a.m12, b.m12, t),
   lerp(a.m20, b.m20, t),
   lerp(a.m21, b.m21, t),
   lerp(a.m22, b.m22, t),
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
  a: ReadonlyMatrix3Like,
  b: ReadonlyMatrix3Like,
  t: number,
  out?: Matrix3,
 ): Matrix3 {
  return Matrix3.ensureOut(out).set(
   lerp(a.m00, b.m00, t),
   lerp(a.m01, b.m01, t),
   lerp(a.m02, b.m02, t),
   lerp(a.m10, b.m10, t),
   lerp(a.m11, b.m11, t),
   lerp(a.m12, b.m12, t),
   lerp(a.m20, b.m20, t),
   lerp(a.m21, b.m21, t),
   lerp(a.m22, b.m22, t),
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
  a: ReadonlyMatrix3Like,
  b: ReadonlyMatrix3Like,
  t: number,
  out?: Matrix3,
 ): Matrix3 {
  return Matrix3.lerp(a, b, saturate(t), out);
 }

 /**
  * Smooth step interpolation between matrices.
  *
  * @param a - Start matrix.
  * @param b - End matrix.
  * @param t - Interpolation factor.
  * @param out - Optional output matrix.
  * @returns Smoothly interpolated matrix.
  *
  * @category Interpolation
  * @since 0.9.0
  */
 public static smoothStep(
  a: ReadonlyMatrix3Like,
  b: ReadonlyMatrix3Like,
  t: number,
  out?: Matrix3,
 ): Matrix3 {
  const tt = saturate(t);
  const factor = tt * tt * (3 - 2 * tt);
  return Matrix3.ensureOut(out).set(
   lerp(a.m00, b.m00, factor),
   lerp(a.m01, b.m01, factor),
   lerp(a.m02, b.m02, factor),
   lerp(a.m10, b.m10, factor),
   lerp(a.m11, b.m11, factor),
   lerp(a.m12, b.m12, factor),
   lerp(a.m20, b.m20, factor),
   lerp(a.m21, b.m21, factor),
   lerp(a.m22, b.m22, factor),
  );
 }

 /* ======================================================================== */
 /* Static Comparison & Validation                                           */
 /* ======================================================================== */

 /**
  * Tests for exact equality with the zero matrix.
  *
  * @param matrix - Matrix to test.
  * @returns True if all elements are exactly zero.
  *
  * @category Comparison
  * @since 0.9.0
  */
 public static isZero(matrix: ReadonlyMatrix3Like): boolean {
  return (
   matrix.m00 === 0 &&
   matrix.m01 === 0 &&
   matrix.m02 === 0 &&
   matrix.m10 === 0 &&
   matrix.m11 === 0 &&
   matrix.m12 === 0 &&
   matrix.m20 === 0 &&
   matrix.m21 === 0 &&
   matrix.m22 === 0
  );
 }

 /**
  * Tests if all elements are near zero.
  *
  * @param matrix - Matrix to test.
  * @param epsilon - Tolerance. @defaultValue `EPSILON`
  * @returns True if all elements are within epsilon of zero.
  *
  * @category Comparison
  * @since 0.9.0
  */
 public static nearZero(matrix: ReadonlyMatrix3Like, epsilon: number = EPSILON): boolean {
  return (
   isNearZero(matrix.m00, epsilon) &&
   isNearZero(matrix.m01, epsilon) &&
   isNearZero(matrix.m02, epsilon) &&
   isNearZero(matrix.m10, epsilon) &&
   isNearZero(matrix.m11, epsilon) &&
   isNearZero(matrix.m12, epsilon) &&
   isNearZero(matrix.m20, epsilon) &&
   isNearZero(matrix.m21, epsilon) &&
   isNearZero(matrix.m22, epsilon)
  );
 }

 /**
  * Tests approximate equality between matrices.
  *
  * @param a - First matrix.
  * @param b - Second matrix.
  * @param epsilon - Tolerance. @defaultValue `EPSILON`
  * @returns True if all component differences are within epsilon.
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
 public static exactEquals(a: ReadonlyMatrix3Like, b: ReadonlyMatrix3Like): boolean {
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
  a: ReadonlyMatrix3Like,
  b: ReadonlyMatrix3Like,
  epsilon: number = EPSILON,
 ): boolean {
  return (
   relativeEquals(a.m00, b.m00, epsilon) &&
   relativeEquals(a.m01, b.m01, epsilon) &&
   relativeEquals(a.m02, b.m02, epsilon) &&
   relativeEquals(a.m10, b.m10, epsilon) &&
   relativeEquals(a.m11, b.m11, epsilon) &&
   relativeEquals(a.m12, b.m12, epsilon) &&
   relativeEquals(a.m20, b.m20, epsilon) &&
   relativeEquals(a.m21, b.m21, epsilon) &&
   relativeEquals(a.m22, b.m22, epsilon)
  );
 }

 /**
  * Tests if all elements are finite numbers.
  *
  * @param matrix - Matrix to test.
  * @returns True if all elements are finite.
  *
  * @category Comparison
  * @since 0.9.0
  */
 public static isFinite(matrix: ReadonlyMatrix3Like): boolean {
  return (
   Number.isFinite(matrix.m00) &&
   Number.isFinite(matrix.m01) &&
   Number.isFinite(matrix.m02) &&
   Number.isFinite(matrix.m10) &&
   Number.isFinite(matrix.m11) &&
   Number.isFinite(matrix.m12) &&
   Number.isFinite(matrix.m20) &&
   Number.isFinite(matrix.m21) &&
   Number.isFinite(matrix.m22)
  );
 }

 /**
  * Tests if any element is NaN.
  *
  * @param matrix - Matrix to test.
  * @returns True if any element is NaN.
  *
  * @category Comparison
  * @since 0.9.0
  */
 public static hasNaN(matrix: ReadonlyMatrix3Like): boolean {
  return (
   Number.isNaN(matrix.m00) ||
   Number.isNaN(matrix.m01) ||
   Number.isNaN(matrix.m02) ||
   Number.isNaN(matrix.m10) ||
   Number.isNaN(matrix.m11) ||
   Number.isNaN(matrix.m12) ||
   Number.isNaN(matrix.m20) ||
   Number.isNaN(matrix.m21) ||
   Number.isNaN(matrix.m22)
  );
 }

 /**
  * Tests if matrix is identity.
  *
  * @param matrix - Matrix to test.
  * @param epsilon - Tolerance. @defaultValue `EPSILON`
  * @returns True if matrix is identity.
  *
  * @category Comparison
  * @since 0.1.0
  */
 public static isIdentity(matrix: ReadonlyMatrix3Like, epsilon: number = EPSILON): boolean {
  return (
   scalarNearEquals(matrix.m00, 1, epsilon) &&
   isNearZero(matrix.m01, epsilon) &&
   isNearZero(matrix.m02, epsilon) &&
   isNearZero(matrix.m10, epsilon) &&
   scalarNearEquals(matrix.m11, 1, epsilon) &&
   isNearZero(matrix.m12, epsilon) &&
   isNearZero(matrix.m20, epsilon) &&
   isNearZero(matrix.m21, epsilon) &&
   scalarNearEquals(matrix.m22, 1, epsilon)
  );
 }

 /**
  * Tests if matrix is singular (non-invertible).
  *
  * @param matrix - Matrix to test.
  * @param epsilon - Tolerance. @defaultValue `EPSILON`
  * @returns True if determinant is near zero.
  *
  * @category Comparison
  * @since 0.9.0
  */
 public static isSingular(matrix: ReadonlyMatrix3Like, epsilon: number = EPSILON): boolean {
  return isNearZero(Matrix3.determinant(matrix), epsilon);
 }

 /**
  * Tests if matrix is symmetric (M = M^T).
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
 public static isSymmetric(matrix: ReadonlyMatrix3Like, epsilon: number = EPSILON): boolean {
  return (
   relativeEquals(matrix.m01, matrix.m10, epsilon) &&
   relativeEquals(matrix.m02, matrix.m20, epsilon) &&
   relativeEquals(matrix.m12, matrix.m21, epsilon)
  );
 }

 /**
  * Tests if matrix is skew-symmetric (M = -M^T).
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
 public static isSkewSymmetric(matrix: ReadonlyMatrix3Like, epsilon: number = EPSILON): boolean {
  return (
   isNearZero(matrix.m00, epsilon) &&
   isNearZero(matrix.m11, epsilon) &&
   isNearZero(matrix.m22, epsilon) &&
   relativeEquals(matrix.m01, -matrix.m10, epsilon) &&
   relativeEquals(matrix.m02, -matrix.m20, epsilon) &&
   relativeEquals(matrix.m12, -matrix.m21, epsilon)
  );
 }

 /**
  * Tests if matrix is diagonal.
  *
  * @param matrix - Matrix to test.
  * @param epsilon - Tolerance. @defaultValue `EPSILON`
  * @returns True if off-diagonal elements are near zero.
  *
  * @category Comparison
  * @since 0.9.0
  */
 public static isDiagonal(matrix: ReadonlyMatrix3Like, epsilon: number = EPSILON): boolean {
  return (
   isNearZero(matrix.m01, epsilon) &&
   isNearZero(matrix.m02, epsilon) &&
   isNearZero(matrix.m10, epsilon) &&
   isNearZero(matrix.m12, epsilon) &&
   isNearZero(matrix.m20, epsilon) &&
   isNearZero(matrix.m21, epsilon)
  );
 }

 /**
  * Tests if a matrix is orthogonal (M * M^T = I).
  *
  * @param matrix - Matrix to test.
  * @param epsilon - Tolerance. @defaultValue `EPSILON`
  * @returns True if matrix is orthogonal.
  *
  * @category Comparison
  * @since 0.9.0
  */
 public static isOrthogonal(matrix: ReadonlyMatrix3Like, epsilon: number = EPSILON): boolean {
  // Check if columns are unit length and mutually orthogonal
  const col0LengthSq = matrix.m00 * matrix.m00 + matrix.m01 * matrix.m01 + matrix.m02 * matrix.m02;
  const col1LengthSq = matrix.m10 * matrix.m10 + matrix.m11 * matrix.m11 + matrix.m12 * matrix.m12;
  const col2LengthSq = matrix.m20 * matrix.m20 + matrix.m21 * matrix.m21 + matrix.m22 * matrix.m22;

  const dot01 = matrix.m00 * matrix.m10 + matrix.m01 * matrix.m11 + matrix.m02 * matrix.m12;
  const dot02 = matrix.m00 * matrix.m20 + matrix.m01 * matrix.m21 + matrix.m02 * matrix.m22;
  const dot12 = matrix.m10 * matrix.m20 + matrix.m11 * matrix.m21 + matrix.m12 * matrix.m22;

  return (
   scalarNearEquals(col0LengthSq, 1, epsilon) &&
   scalarNearEquals(col1LengthSq, 1, epsilon) &&
   scalarNearEquals(col2LengthSq, 1, epsilon) &&
   isNearZero(dot01, epsilon) &&
   isNearZero(dot02, epsilon) &&
   isNearZero(dot12, epsilon)
  );
 }

 /* ======================================================================== */
 /* Static Matrix Operations                                                 */
 /* ======================================================================== */

 /**
  * Transposes a matrix.
  *
  * @param matrix - Source matrix.
  * @param out - Optional output matrix.
  * @returns Transposed matrix.
  *
  * @category Matrix Operations
  * @since 0.1.0
  */
 public static transpose(matrix: ReadonlyMatrix3Like, out?: Matrix3): Matrix3 {
  return Matrix3.ensureOut(out).set(
   matrix.m00,
   matrix.m10,
   matrix.m20,
   matrix.m01,
   matrix.m11,
   matrix.m21,
   matrix.m02,
   matrix.m12,
   matrix.m22,
  );
 }

 /**
  * Calculates the determinant.
  *
  * @param matrix - Matrix to calculate determinant of.
  * @returns Determinant value.
  *
  * @category Matrix Operations
  * @since 0.1.0
  */
 public static determinant(matrix: ReadonlyMatrix3Like): number {
  return (
   matrix.m00 * (matrix.m11 * matrix.m22 - matrix.m12 * matrix.m21) -
   matrix.m10 * (matrix.m01 * matrix.m22 - matrix.m02 * matrix.m21) +
   matrix.m20 * (matrix.m01 * matrix.m12 - matrix.m02 * matrix.m11)
  );
 }

 /**
  * Calculates the trace (sum of diagonal).
  *
  * @param matrix - Matrix to calculate trace of.
  * @returns Trace value.
  *
  * @category Matrix Operations
  * @since 0.9.0
  */
 public static trace(matrix: ReadonlyMatrix3Like): number {
  return matrix.m00 + matrix.m11 + matrix.m22;
 }

 /**
  * Calculates the Frobenius norm.
  *
  * @param matrix - Matrix to calculate norm of.
  * @returns Frobenius norm √(Σ|mᵢⱼ|²).
  *
  * @category Matrix Operations
  * @since 0.9.0
  */
 public static frobeniusNorm(matrix: ReadonlyMatrix3Like): number {
  return safeSqrt(
   matrix.m00 * matrix.m00 +
    matrix.m01 * matrix.m01 +
    matrix.m02 * matrix.m02 +
    matrix.m10 * matrix.m10 +
    matrix.m11 * matrix.m11 +
    matrix.m12 * matrix.m12 +
    matrix.m20 * matrix.m20 +
    matrix.m21 * matrix.m21 +
    matrix.m22 * matrix.m22,
  );
 }

 /**
  * Calculates the adjugate (adjoint) matrix.
  *
  * @param matrix - Source matrix.
  * @param out - Optional output matrix.
  * @returns Adjugate matrix (transpose of cofactor matrix).
  *
  * @category Matrix Operations
  * @since 0.9.0
  */
 public static adjugate(matrix: ReadonlyMatrix3Like, out?: Matrix3): Matrix3 {
  const c00 = matrix.m11 * matrix.m22 - matrix.m12 * matrix.m21;
  const c01 = -(matrix.m01 * matrix.m22 - matrix.m02 * matrix.m21);
  const c02 = matrix.m01 * matrix.m12 - matrix.m02 * matrix.m11;

  const c10 = -(matrix.m10 * matrix.m22 - matrix.m12 * matrix.m20);
  const c11 = matrix.m00 * matrix.m22 - matrix.m02 * matrix.m20;
  const c12 = -(matrix.m00 * matrix.m12 - matrix.m02 * matrix.m10);

  const c20 = matrix.m10 * matrix.m21 - matrix.m11 * matrix.m20;
  const c21 = -(matrix.m00 * matrix.m21 - matrix.m01 * matrix.m20);
  const c22 = matrix.m00 * matrix.m11 - matrix.m01 * matrix.m10;

  return Matrix3.ensureOut(out).set(c00, c01, c02, c10, c11, c12, c20, c21, c22);
 }

 /**
  * Inverts a matrix. Throws if singular.
  *
  * @param matrix - Matrix to invert.
  * @param out - Optional output matrix.
  * @returns Inverted matrix.
  * @throws {Error} If matrix is singular.
  *
  * @category Matrix Operations
  * @since 0.1.0
  */
 public static inverse(matrix: ReadonlyMatrix3Like, out?: Matrix3): Matrix3 {
  const c00 = matrix.m11 * matrix.m22 - matrix.m12 * matrix.m21;
  const c01 = -(matrix.m01 * matrix.m22 - matrix.m02 * matrix.m21);
  const c02 = matrix.m01 * matrix.m12 - matrix.m02 * matrix.m11;

  const c10 = -(matrix.m10 * matrix.m22 - matrix.m12 * matrix.m20);
  const c11 = matrix.m00 * matrix.m22 - matrix.m02 * matrix.m20;
  const c12 = -(matrix.m00 * matrix.m12 - matrix.m02 * matrix.m10);

  const c20 = matrix.m10 * matrix.m21 - matrix.m11 * matrix.m20;
  const c21 = -(matrix.m00 * matrix.m21 - matrix.m01 * matrix.m20);
  const c22 = matrix.m00 * matrix.m11 - matrix.m01 * matrix.m10;

  const det = matrix.m00 * c00 + matrix.m10 * c01 + matrix.m20 * c02;
  if (isNearZero(det)) {
   throw new RangeError('Matrix3.inverse: matrix is singular');
  }

  const invDet = 1 / det;
  return Matrix3.ensureOut(out).set(
   c00 * invDet,
   c01 * invDet,
   c02 * invDet,
   c10 * invDet,
   c11 * invDet,
   c12 * invDet,
   c20 * invDet,
   c21 * invDet,
   c22 * invDet,
  );
 }

 /**
  * Safe inverse. Returns identity if singular.
  *
  * @param matrix - Matrix to invert.
  * @param out - Optional output matrix.
  * @returns Inverted matrix or identity if singular.
  *
  * @category Matrix Operations
  * @since 0.9.0
  */
 public static inverseSafe(matrix: ReadonlyMatrix3Like, out?: Matrix3): Matrix3 {
  const det = Matrix3.determinant(matrix);
  if (isNearZero(det)) {
   return Matrix3.ensureOut(out).identity();
  }
  return Matrix3.inverseUnchecked(matrix, out);
 }

 /**
  * Unchecked inverse for hot paths. Assumes matrix is invertible.
  *
  * @remarks
  * ⚠️ **Precondition:** Matrix must be invertible (non-singular).
  * Calling with singular matrix produces Infinity/NaN elements.
  *
  * @param matrix - Matrix to invert.
  * @param out - Optional output matrix.
  * @returns Inverted matrix.
  *
  * @category Matrix Operations
  * @since 0.9.0
  */
 public static inverseUnchecked(matrix: ReadonlyMatrix3Like, out?: Matrix3): Matrix3 {
  const c00 = matrix.m11 * matrix.m22 - matrix.m12 * matrix.m21;
  const c01 = -(matrix.m01 * matrix.m22 - matrix.m02 * matrix.m21);
  const c02 = matrix.m01 * matrix.m12 - matrix.m02 * matrix.m11;

  const c10 = -(matrix.m10 * matrix.m22 - matrix.m12 * matrix.m20);
  const c11 = matrix.m00 * matrix.m22 - matrix.m02 * matrix.m20;
  const c12 = -(matrix.m00 * matrix.m12 - matrix.m02 * matrix.m10);

  const c20 = matrix.m10 * matrix.m21 - matrix.m11 * matrix.m20;
  const c21 = -(matrix.m00 * matrix.m21 - matrix.m01 * matrix.m20);
  const c22 = matrix.m00 * matrix.m11 - matrix.m01 * matrix.m10;

  const det = matrix.m00 * c00 + matrix.m10 * c01 + matrix.m20 * c02;
  const invDet = 1 / det;

  return Matrix3.ensureOut(out).set(
   c00 * invDet,
   c01 * invDet,
   c02 * invDet,
   c10 * invDet,
   c11 * invDet,
   c12 * invDet,
   c20 * invDet,
   c21 * invDet,
   c22 * invDet,
  );
 }

 /**
  * Transforms a point by the matrix (applies translation).
  *
  * @param matrix - Transform matrix.
  * @param point - Point to transform.
  * @param out - Optional output vector.
  * @returns Transformed point.
  *
  * @category Matrix Operations
  * @since 0.1.0
  */
 public static transformPoint(
  matrix: ReadonlyMatrix3Like,
  point: ReadonlyVector2Like,
  out?: Vector2,
 ): Vector2 {
  const { x, y } = point;
  const w = matrix.m02 * x + matrix.m12 * y + matrix.m22;
  if (isNearZero(w - 1)) {
   return Vector2.fromValues(
    matrix.m00 * x + matrix.m10 * y + matrix.m20,
    matrix.m01 * x + matrix.m11 * y + matrix.m21,
    out,
   );
  }
  const invW = safeDivide(1, w);
  return Vector2.fromValues(
   (matrix.m00 * x + matrix.m10 * y + matrix.m20) * invW,
   (matrix.m01 * x + matrix.m11 * y + matrix.m21) * invW,
   out,
  );
 }

 /**
  * Transforms a vector by the matrix (ignores translation).
  *
  * @param matrix - Transform matrix.
  * @param vector - Vector to transform.
  * @param out - Optional output vector.
  * @returns Transformed vector.
  *
  * @category Matrix Operations
  * @since 0.1.0
  */
 public static transformVector(
  matrix: ReadonlyMatrix3Like,
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
  * Decomposes an affine matrix into translation, rotation, and scale.
  *
  * @param matrix - Matrix to decompose.
  * @returns Object with translation, rotation (radians), and scale.
  *
  * @remarks
  * **Numerical Stability:** For matrices with extremely small scale components
  * (magnitude < 1e-10), the rotation extraction may be imprecise. If scale
  * approaches zero, rotation defaults to 0 radians. For matrices with scale
  * components smaller than ~1e-154, underflow may occur in intermediate
  * calculations due to IEEE 754 double precision limits.
  *
  * @category Matrix Operations
  * @since 0.1.0
  */
 public static decompose(matrix: ReadonlyMatrix3Like): {
  translation: Vector2;
  rotation: number;
  scale: Vector2;
 } {
  const translation = new Vector2(matrix.m20, matrix.m21);

  const sx = safeSqrt(matrix.m00 * matrix.m00 + matrix.m01 * matrix.m01);
  const sy = safeSqrt(matrix.m10 * matrix.m10 + matrix.m11 * matrix.m11);

  const det = matrix.m00 * matrix.m11 - matrix.m01 * matrix.m10;
  const signY = det < 0 ? -1 : 1;

  const rotation = isNearZero(sx) ? 0 : DeterministicMath.atan2(matrix.m01 / sx, matrix.m00 / sx);

  return {
   translation,
   rotation,
   scale: new Vector2(sx, sy * signY),
  };
 }

 /**
  * Applies a translation to a matrix.
  *
  * @param matrix - Matrix to translate.
  * @param translation - Translation vector.
  * @param out - Optional output matrix.
  * @returns Translated matrix.
  *
  * @remarks
  * Equivalent to `Matrix3.multiply(matrix, Matrix3.fromTranslation(translation), out)`
  * but more efficient as it avoids creating an intermediate matrix.
  *
  * @example
  * ```typescript
  * const m = Matrix3.fromRotation(Math.PI / 4);
  * const translated = Matrix3.translate(m, { x: 100, y: 50 });
  * ```
  *
  * @category Matrix Operations
  * @since 0.11.0
  */
 public static translate(
  matrix: ReadonlyMatrix3Like,
  translation: ReadonlyVector2Like,
  out?: Matrix3,
 ): Matrix3 {
  const tx = translation.x;
  const ty = translation.y;

  return Matrix3.ensureOut(out).set(
   matrix.m00,
   matrix.m01,
   matrix.m02,
   matrix.m10,
   matrix.m11,
   matrix.m12,
   matrix.m00 * tx + matrix.m10 * ty + matrix.m20,
   matrix.m01 * tx + matrix.m11 * ty + matrix.m21,
   matrix.m02 * tx + matrix.m12 * ty + matrix.m22,
  );
 }

 /**
  * Applies a rotation to a matrix.
  *
  * @param matrix - Matrix to rotate.
  * @param angle - Rotation angle in radians.
  * @param out - Optional output matrix.
  * @returns Rotated matrix.
  *
  * @remarks
  * Equivalent to `Matrix3.multiply(matrix, Matrix3.fromRotation(angle), out)`
  * but more efficient as it avoids creating an intermediate matrix.
  *
  * @example
  * ```typescript
  * const m = Matrix3.fromTranslation(100, 50);
  * const rotated = Matrix3.rotate(m, Math.PI / 4);
  * ```
  *
  * @category Matrix Operations
  * @since 0.11.0
  */
 public static rotate(matrix: ReadonlyMatrix3Like, angle: number, out?: Matrix3): Matrix3 {
  const { cos, sin } = sinCos(angle);

  const a00 = matrix.m00;
  const a01 = matrix.m01;
  const a02 = matrix.m02;
  const a10 = matrix.m10;
  const a11 = matrix.m11;
  const a12 = matrix.m12;

  return Matrix3.ensureOut(out).set(
   a00 * cos + a10 * sin,
   a01 * cos + a11 * sin,
   a02 * cos + a12 * sin,
   a00 * -sin + a10 * cos,
   a01 * -sin + a11 * cos,
   a02 * -sin + a12 * cos,
   matrix.m20,
   matrix.m21,
   matrix.m22,
  );
 }

 /**
  * Applies a scale transformation to a matrix.
  *
  * @param matrix - Matrix to scale.
  * @param scaleValue - Scale factor (scalar or per-axis vector).
  * @param out - Optional output matrix.
  * @returns Scaled matrix.
  *
  * @remarks
  * Equivalent to `Matrix3.multiply(matrix, Matrix3.fromScale(scaleValue), out)`
  * but more efficient as it avoids creating an intermediate matrix.
  *
  * @example
  * ```typescript
  * const m = Matrix3.fromTranslation(100, 50);
  * const scaled = Matrix3.scaleBy(m, { x: 2, y: 0.5 });
  * ```
  *
  * @category Matrix Operations
  * @since 0.11.0
  */
 public static scaleBy(
  matrix: ReadonlyMatrix3Like,
  scaleValue: ReadonlyVector2Like | number,
  out?: Matrix3,
 ): Matrix3 {
  let sx: number;
  let sy: number;
  if (typeof scaleValue === 'number') {
   sx = sy = scaleValue;
  } else {
   sx = scaleValue.x;
   sy = scaleValue.y;
  }

  return Matrix3.ensureOut(out).set(
   matrix.m00 * sx,
   matrix.m01 * sx,
   matrix.m02 * sx,
   matrix.m10 * sy,
   matrix.m11 * sy,
   matrix.m12 * sy,
   matrix.m20,
   matrix.m21,
   matrix.m22,
  );
 }

 /* ======================================================================== */
 /* Instance Properties                                                      */
 /* ======================================================================== */

 /** Element at row 0, column 0. */
 public m00: number;
 /** Element at row 1, column 0. */
 public m01: number;
 /** Element at row 2, column 0. */
 public m02: number;
 /** Element at row 0, column 1. */
 public m10: number;
 /** Element at row 1, column 1. */
 public m11: number;
 /** Element at row 2, column 1. */
 public m12: number;
 /** Element at row 0, column 2. */
 public m20: number;
 /** Element at row 1, column 2. */
 public m21: number;
 /** Element at row 2, column 2. */
 public m22: number;

 /* ======================================================================== */
 /* Constructor                                                              */
 /* ======================================================================== */

 /** Creates identity matrix. */
 constructor();
 /** Creates from 9 components (column-major). */
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
 /** Creates from 9-element array. */
 constructor(
  array: readonly [number, number, number, number, number, number, number, number, number],
 );
 /** Creates from plain object. */
 constructor(object: ReadonlyMatrix3Like);

 /**
  * Creates a new Matrix3.
  *
  * @param m00OrSource - First element, array, or object.
  * @param m01 - Element at row 1, column 0 (when first arg is number).
  * @param m02 - Element at row 2, column 0 (when first arg is number).
  * @param m10 - Element at row 0, column 1 (when first arg is number).
  * @param m11 - Element at row 1, column 1 (when first arg is number).
  * @param m12 - Element at row 2, column 1 (when first arg is number).
  * @param m20 - Element at row 0, column 2 (when first arg is number).
  * @param m21 - Element at row 1, column 2 (when first arg is number).
  * @param m22 - Element at row 2, column 2 (when first arg is number).
  *
  * @example
  * ```typescript
  * new Matrix3();                           // Identity
  * new Matrix3(1, 0, 0, 0, 1, 0, 0, 0, 1);  // Explicit components
  * new Matrix3([1, 0, 0, 0, 1, 0, 0, 0, 1]); // From array
  * new Matrix3({ m00: 1, m01: 0, ... });    // From object
  * ```
  */
 constructor(
  m00OrSource?:
   | number
   | readonly [number, number, number, number, number, number, number, number, number]
   | ReadonlyMatrix3Like,
  m01?: number,
  m02?: number,
  m10?: number,
  m11?: number,
  m12?: number,
  m20?: number,
  m21?: number,
  m22?: number,
 ) {
  if (m00OrSource === undefined) {
   // Identity matrix
   this.m00 = 1;
   this.m01 = 0;
   this.m02 = 0;
   this.m10 = 0;
   this.m11 = 1;
   this.m12 = 0;
   this.m20 = 0;
   this.m21 = 0;
   this.m22 = 1;
  } else if (typeof m00OrSource === 'number') {
   this.m00 = m00OrSource;
   this.m01 = m01 ?? 0;
   this.m02 = m02 ?? 0;
   this.m10 = m10 ?? 0;
   this.m11 = m11 ?? 1;
   this.m12 = m12 ?? 0;
   this.m20 = m20 ?? 0;
   this.m21 = m21 ?? 0;
   this.m22 = m22 ?? 1;
  } else if (Array.isArray(m00OrSource)) {
   if (m00OrSource.length < 9) {
    throw new RangeError('Matrix3: array must have at least 9 elements');
   }
   this.m00 = m00OrSource[0];
   this.m01 = m00OrSource[1];
   this.m02 = m00OrSource[2];
   this.m10 = m00OrSource[3];
   this.m11 = m00OrSource[4];
   this.m12 = m00OrSource[5];
   this.m20 = m00OrSource[6];
   this.m21 = m00OrSource[7];
   this.m22 = m00OrSource[8];
  } else if (
   typeof m00OrSource === 'object' &&
   'm00' in m00OrSource &&
   'm01' in m00OrSource &&
   'm02' in m00OrSource &&
   'm10' in m00OrSource &&
   'm11' in m00OrSource &&
   'm12' in m00OrSource &&
   'm20' in m00OrSource &&
   'm21' in m00OrSource &&
   'm22' in m00OrSource
  ) {
   this.m00 = m00OrSource.m00;
   this.m01 = m00OrSource.m01;
   this.m02 = m00OrSource.m02;
   this.m10 = m00OrSource.m10;
   this.m11 = m00OrSource.m11;
   this.m12 = m00OrSource.m12;
   this.m20 = m00OrSource.m20;
   this.m21 = m00OrSource.m21;
   this.m22 = m00OrSource.m22;
  } else {
   throw new TypeError('Matrix3: invalid constructor arguments');
  }
 }

 /* ======================================================================== */
 /* Instance Basic Mutators                                                  */
 /* ======================================================================== */

 /**
  * Sets all matrix elements.
  *
  * @param m00 - Element at row 0, column 0.
  * @param m01 - Element at row 1, column 0.
  * @param m02 - Element at row 2, column 0.
  * @param m10 - Element at row 0, column 1.
  * @param m11 - Element at row 1, column 1.
  * @param m12 - Element at row 2, column 1.
  * @param m20 - Element at row 0, column 2.
  * @param m21 - Element at row 1, column 2.
  * @param m22 - Element at row 2, column 2.
  * @returns This for chaining.
  *
  * @category Mutator
  * @since 0.1.0
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
  * Copies from another matrix.
  *
  * @param matrix - Source matrix.
  * @returns This for chaining.
  *
  * @category Mutator
  * @since 0.1.0
  */
 public copy(matrix: ReadonlyMatrix3Like): this {
  return this.set(
   matrix.m00,
   matrix.m01,
   matrix.m02,
   matrix.m10,
   matrix.m11,
   matrix.m12,
   matrix.m20,
   matrix.m21,
   matrix.m22,
  );
 }

 /**
  * Resets to identity matrix.
  *
  * @returns This for chaining.
  *
  * @category Mutator
  * @since 0.1.0
  */
 public identity(): this {
  return this.set(1, 0, 0, 0, 1, 0, 0, 0, 1);
 }

 /**
  * Sets all elements to zero.
  *
  * @returns This for chaining.
  *
  * @category Mutator
  * @since 0.9.0
  */
 public zero(): this {
  return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0);
 }

 /* ======================================================================== */
 /* Instance Computed Values                                                 */
 /* ======================================================================== */

 /**
  * Extracts translation vector from the matrix.
  *
  * @param out - Optional output vector.
  * @returns Translation as Vector2.
  *
  * @category Computed
  * @since 0.1.0
  */
 public getTranslation(out?: Vector2): Vector2 {
  return Vector2.fromValues(this.m20, this.m21, out);
 }

 /**
  * Extracts scale factors from the matrix.
  *
  * @param out - Optional output vector.
  * @returns Scale factors for each axis.
  *
  * @remarks Uses deterministic sqrt for cross-platform reproducibility.
  *
  * @category Computed
  * @since 0.1.0
  */
 public getScale(out?: Vector2): Vector2 {
  const sx = safeSqrt(this.m00 * this.m00 + this.m01 * this.m01);
  const sy = safeSqrt(this.m10 * this.m10 + this.m11 * this.m11);
  return Vector2.fromValues(sx, sy, out);
 }

 /**
  * Extracts rotation angle from the matrix.
  *
  * @returns Rotation angle in radians.
  *
  * @category Computed
  * @since 0.1.0
  */
 public getRotation(): number {
  const scaleX = safeSqrt(this.m00 * this.m00 + this.m01 * this.m01);
  if (isNearZero(scaleX)) {
   return 0;
  }
  return DeterministicMath.atan2(this.m01 / scaleX, this.m00 / scaleX);
 }

 /**
  * Calculates the determinant.
  *
  * @returns Determinant value.
  *
  * @category Computed
  * @since 0.1.0
  */
 public determinant(): number {
  return (
   this.m00 * (this.m11 * this.m22 - this.m12 * this.m21) -
   this.m10 * (this.m01 * this.m22 - this.m02 * this.m21) +
   this.m20 * (this.m01 * this.m12 - this.m02 * this.m11)
  );
 }

 /**
  * Calculates the trace (sum of diagonal).
  *
  * @returns Trace value.
  *
  * @category Computed
  * @since 0.9.0
  */
 public trace(): number {
  return this.m00 + this.m11 + this.m22;
 }

 /**
  * Calculates the Frobenius norm.
  *
  * @returns Frobenius norm √(Σ|mᵢⱼ|²).
  *
  * @category Computed
  * @since 0.9.0
  */
 public frobeniusNorm(): number {
  return safeSqrt(
   this.m00 * this.m00 +
    this.m01 * this.m01 +
    this.m02 * this.m02 +
    this.m10 * this.m10 +
    this.m11 * this.m11 +
    this.m12 * this.m12 +
    this.m20 * this.m20 +
    this.m21 * this.m21 +
    this.m22 * this.m22,
  );
 }

 /**
  * Tests if matrix is invertible.
  *
  * @param epsilon - Tolerance. @defaultValue `EPSILON`
  * @returns True if determinant is not near zero.
  *
  * @category Computed
  * @since 0.1.0
  */
 public isInvertible(epsilon: number = EPSILON): boolean {
  return !isNearZero(this.determinant(), epsilon);
 }

 /**
  * Tests if matrix is affine (bottom row is [0, 0, 1]).
  *
  * @param epsilon - Tolerance. @defaultValue `EPSILON`
  * @returns True if matrix is affine.
  *
  * @category Computed
  * @since 0.1.0
  */
 public isAffine(epsilon: number = EPSILON): boolean {
  return (
   isNearZero(this.m02, epsilon) &&
   isNearZero(this.m12, epsilon) &&
   scalarNearEquals(this.m22, 1, epsilon)
  );
 }

 /* ======================================================================== */
 /* Instance Getters (Derived)                                               */
 /* ======================================================================== */

 /**
  * Returns a new transposed matrix without modifying this one.
  * @returns Transposed matrix.
  */
 public get transposed(): Matrix3 {
  return new Matrix3(
   this.m00,
   this.m10,
   this.m20,
   this.m01,
   this.m11,
   this.m21,
   this.m02,
   this.m12,
   this.m22,
  );
 }

 /**
  * Returns a new inverted matrix without modifying this one.
  * Returns identity if singular.
  * @returns Inverted matrix.
  */
 public get inverted(): Matrix3 {
  const c00 = this.m11 * this.m22 - this.m12 * this.m21;
  const c01 = -(this.m01 * this.m22 - this.m02 * this.m21);
  const c02 = this.m01 * this.m12 - this.m02 * this.m11;
  const c10 = -(this.m10 * this.m22 - this.m12 * this.m20);
  const c11 = this.m00 * this.m22 - this.m02 * this.m20;
  const c12 = -(this.m00 * this.m12 - this.m02 * this.m10);
  const c20 = this.m10 * this.m21 - this.m11 * this.m20;
  const c21 = -(this.m00 * this.m21 - this.m01 * this.m20);
  const c22 = this.m00 * this.m11 - this.m01 * this.m10;

  const det = this.m00 * c00 + this.m10 * c01 + this.m20 * c02;
  if (isNearZero(det)) {
   return new Matrix3();
  }

  const invDet = 1 / det;
  return new Matrix3(
   c00 * invDet,
   c01 * invDet,
   c02 * invDet,
   c10 * invDet,
   c11 * invDet,
   c12 * invDet,
   c20 * invDet,
   c21 * invDet,
   c22 * invDet,
  );
 }

 /**
  * Returns a new negated matrix without modifying this one.
  * @returns Negated matrix.
  */
 public get negated(): Matrix3 {
  return new Matrix3(
   -this.m00,
   -this.m01,
   -this.m02,
   -this.m10,
   -this.m11,
   -this.m12,
   -this.m20,
   -this.m21,
   -this.m22,
  );
 }

 /**
  * Returns the upper-left 2×2 portion as a Matrix2.
  * @returns Upper-left 2x2 matrix.
  */
 public get upperLeft2x2(): Matrix2 {
  return new Matrix2(this.m00, this.m01, this.m10, this.m11);
 }

 /**
  * Returns the translation component as a Vector2.
  * @returns Translation vector.
  */
 public get translation(): Vector2 {
  return new Vector2(this.m20, this.m21);
 }

 /**
  * Returns the diagonal elements as a 3-element array.
  * @returns Diagonal array [m00, m11, m22].
  */
 public get diagonal(): [number, number, number] {
  return [this.m00, this.m11, this.m22];
 }

 /**
  * Returns the first column as a tuple.
  * @returns Column 0 as [m00, m01, m02].
  */
 public get column0(): [number, number, number] {
  return [this.m00, this.m01, this.m02];
 }

 /**
  * Returns the second column as a tuple.
  * @returns Column 1 as [m10, m11, m12].
  */
 public get column1(): [number, number, number] {
  return [this.m10, this.m11, this.m12];
 }

 /**
  * Returns the third column as a tuple.
  * @returns Column 2 as [m20, m21, m22].
  */
 public get column2(): [number, number, number] {
  return [this.m20, this.m21, this.m22];
 }

 /**
  * Returns the first row as a tuple.
  * @returns Row 0 as [m00, m10, m20].
  */
 public get row0(): [number, number, number] {
  return [this.m00, this.m10, this.m20];
 }

 /**
  * Returns the second row as a tuple.
  * @returns Row 1 as [m01, m11, m21].
  */
 public get row1(): [number, number, number] {
  return [this.m01, this.m11, this.m21];
 }

 /**
  * Returns the third row as a tuple.
  * @returns Row 2 as [m02, m12, m22].
  */
 public get row2(): [number, number, number] {
  return [this.m02, this.m12, this.m22];
 }

 /* ======================================================================== */
 /* Instance Arithmetic                                                      */
 /* ======================================================================== */

 /**
  * Multiplies this matrix by another (this × other).
  *
  * @param other - Matrix to multiply by.
  * @returns This for chaining.
  *
  * @category Arithmetic
  * @since 0.1.0
  */
 public multiply(other: ReadonlyMatrix3Like): this {
  const a00 = this.m00,
   a01 = this.m01,
   a02 = this.m02;
  const a10 = this.m10,
   a11 = this.m11,
   a12 = this.m12;
  const a20 = this.m20,
   a21 = this.m21,
   a22 = this.m22;

  return this.set(
   a00 * other.m00 + a10 * other.m01 + a20 * other.m02,
   a01 * other.m00 + a11 * other.m01 + a21 * other.m02,
   a02 * other.m00 + a12 * other.m01 + a22 * other.m02,
   a00 * other.m10 + a10 * other.m11 + a20 * other.m12,
   a01 * other.m10 + a11 * other.m11 + a21 * other.m12,
   a02 * other.m10 + a12 * other.m11 + a22 * other.m12,
   a00 * other.m20 + a10 * other.m21 + a20 * other.m22,
   a01 * other.m20 + a11 * other.m21 + a21 * other.m22,
   a02 * other.m20 + a12 * other.m21 + a22 * other.m22,
  );
 }

 /**
  * Adds another matrix to this one element-wise.
  *
  * @param other - Matrix to add.
  * @returns This for chaining.
  *
  * @category Arithmetic
  * @since 0.1.0
  */
 public add(other: ReadonlyMatrix3Like): this {
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
  * Subtracts another matrix from this one element-wise.
  *
  * @param other - Matrix to subtract.
  * @returns This for chaining.
  *
  * @category Arithmetic
  * @since 0.1.0
  */
 public subtract(other: ReadonlyMatrix3Like): this {
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
  * Scales all elements by a scalar.
  *
  * @param scalar - Scale factor.
  * @returns This for chaining.
  *
  * @category Arithmetic
  * @since 0.1.0
  */
 public scale(scalar: number): this {
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
  * Alias for scale.
  *
  * @param scalar - Scale factor.
  * @returns This for chaining.
  *
  * @category Arithmetic
  * @since 0.9.0
  */
 public multiplyScalar(scalar: number): this {
  return this.scale(scalar);
 }

 /**
  * Adds a scalar to all elements.
  *
  * @param scalar - Value to add.
  * @returns This for chaining.
  *
  * @category Arithmetic
  * @since 0.9.0
  */
 public addScalar(scalar: number): this {
  this.m00 += scalar;
  this.m01 += scalar;
  this.m02 += scalar;
  this.m10 += scalar;
  this.m11 += scalar;
  this.m12 += scalar;
  this.m20 += scalar;
  this.m21 += scalar;
  this.m22 += scalar;
  return this;
 }

 /**
  * Subtracts a scalar from all elements.
  *
  * @param scalar - Value to subtract.
  * @returns This for chaining.
  *
  * @category Arithmetic
  * @since 0.9.0
  */
 public subtractScalar(scalar: number): this {
  this.m00 -= scalar;
  this.m01 -= scalar;
  this.m02 -= scalar;
  this.m10 -= scalar;
  this.m11 -= scalar;
  this.m12 -= scalar;
  this.m20 -= scalar;
  this.m21 -= scalar;
  this.m22 -= scalar;
  return this;
 }

 /**
  * Fused multiply-add: `this = this * scale + m`.
  *
  * @param scale - Scale factor.
  * @param m - Matrix to add.
  * @returns This for chaining.
  *
  * @category Arithmetic
  * @since 0.9.0
  */
 public fma(scale: number, m: ReadonlyMatrix3Like): this {
  this.m00 = this.m00 * scale + m.m00;
  this.m01 = this.m01 * scale + m.m01;
  this.m02 = this.m02 * scale + m.m02;
  this.m10 = this.m10 * scale + m.m10;
  this.m11 = this.m11 * scale + m.m11;
  this.m12 = this.m12 * scale + m.m12;
  this.m20 = this.m20 * scale + m.m20;
  this.m21 = this.m21 * scale + m.m21;
  this.m22 = this.m22 * scale + m.m22;
  return this;
 }

 /**
  * Divides all elements by a scalar.
  *
  * @param scalar - Divisor.
  * @returns This for chaining.
  * @throws Error if scalar is near zero.
  *
  * @category Arithmetic
  * @since 0.9.0
  */
 public divideScalar(scalar: number): this {
  if (isNearZero(scalar)) {
   throw new RangeError('Matrix3.divideScalar: division by zero');
  }
  const invScalar = 1 / scalar;
  return this.scale(invScalar);
 }

 /**
  * Divides all elements by a scalar (safe version).
  *
  * @param scalar - Divisor.
  * @returns This for chaining (returns zero matrix if scalar is near zero).
  *
  * @category Arithmetic
  * @since 0.9.0
  */
 public divideScalarSafe(scalar: number): this {
  if (isNearZero(scalar)) {
   return this.zero();
  }
  const invScalar = 1 / scalar;
  return this.scale(invScalar);
 }

 /* ======================================================================== */
 /* Instance Matrix Operations                                               */
 /* ======================================================================== */

 /**
  * Transposes this matrix in place.
  *
  * @returns This for chaining.
  *
  * @category Matrix Operations
  * @since 0.1.0
  */
 public transpose(): this {
  let temporary: number;
  temporary = this.m01;
  this.m01 = this.m10;
  this.m10 = temporary;
  temporary = this.m02;
  this.m02 = this.m20;
  this.m20 = temporary;
  temporary = this.m12;
  this.m12 = this.m21;
  this.m21 = temporary;
  return this;
 }

 /**
  * Inverts this matrix in place.
  *
  * @returns This for chaining.
  * @throws Error if singular.
  *
  * @category Matrix Operations
  * @since 0.1.0
  */
 public inverse(): this {
  const c00 = this.m11 * this.m22 - this.m12 * this.m21;
  const c01 = -(this.m01 * this.m22 - this.m02 * this.m21);
  const c02 = this.m01 * this.m12 - this.m02 * this.m11;
  const c10 = -(this.m10 * this.m22 - this.m12 * this.m20);
  const c11 = this.m00 * this.m22 - this.m02 * this.m20;
  const c12 = -(this.m00 * this.m12 - this.m02 * this.m10);
  const c20 = this.m10 * this.m21 - this.m11 * this.m20;
  const c21 = -(this.m00 * this.m21 - this.m01 * this.m20);
  const c22 = this.m00 * this.m11 - this.m01 * this.m10;

  const det = this.m00 * c00 + this.m10 * c01 + this.m20 * c02;
  if (isNearZero(det)) {
   throw new RangeError('Matrix3.inverse: matrix is singular');
  }

  const invDet = 1 / det;
  return this.set(
   c00 * invDet,
   c01 * invDet,
   c02 * invDet,
   c10 * invDet,
   c11 * invDet,
   c12 * invDet,
   c20 * invDet,
   c21 * invDet,
   c22 * invDet,
  );
 }

 /**
  * Inverts this matrix in place (safe version).
  *
  * @returns This for chaining (returns identity if singular).
  *
  * @category Matrix Operations
  * @since 0.9.0
  */
 public inverseSafe(): this {
  const det = this.determinant();
  if (isNearZero(det)) {
   return this.identity();
  }
  return this.inverseUnchecked();
 }

 /**
  * Inverts this matrix in place (unchecked version).
  *
  * @returns This for chaining.
  *
  * @remarks
  * Assumes matrix is invertible. Use for hot paths when you've already validated.
  *
  * @category Matrix Operations
  * @since 0.9.0
  */
 public inverseUnchecked(): this {
  const c00 = this.m11 * this.m22 - this.m12 * this.m21;
  const c01 = -(this.m01 * this.m22 - this.m02 * this.m21);
  const c02 = this.m01 * this.m12 - this.m02 * this.m11;
  const c10 = -(this.m10 * this.m22 - this.m12 * this.m20);
  const c11 = this.m00 * this.m22 - this.m02 * this.m20;
  const c12 = -(this.m00 * this.m12 - this.m02 * this.m10);
  const c20 = this.m10 * this.m21 - this.m11 * this.m20;
  const c21 = -(this.m00 * this.m21 - this.m01 * this.m20);
  const c22 = this.m00 * this.m11 - this.m01 * this.m10;

  const det = this.m00 * c00 + this.m10 * c01 + this.m20 * c02;
  const invDet = 1 / det;

  return this.set(
   c00 * invDet,
   c01 * invDet,
   c02 * invDet,
   c10 * invDet,
   c11 * invDet,
   c12 * invDet,
   c20 * invDet,
   c21 * invDet,
   c22 * invDet,
  );
 }

 /**
  * Negates all elements in place.
  *
  * @returns This for chaining.
  *
  * @category Matrix Operations
  * @since 0.1.0
  */
 public negate(): this {
  this.m00 = -this.m00;
  this.m01 = -this.m01;
  this.m02 = -this.m02;
  this.m10 = -this.m10;
  this.m11 = -this.m11;
  this.m12 = -this.m12;
  this.m20 = -this.m20;
  this.m21 = -this.m21;
  this.m22 = -this.m22;
  return this;
 }

 /**
  * Calculates the adjugate (adjoint) matrix in place.
  *
  * @returns This for chaining.
  *
  * @remarks
  * The adjugate is the transpose of the cofactor matrix.
  * For a 3×3 matrix, each element is the determinant of the 2×2
  * minor matrix, with alternating signs.
  *
  * @category Matrix Operations
  * @since 0.9.0
  */
 public adjugate(): this {
  const a00 = this.m00,
   a01 = this.m01,
   a02 = this.m02;
  const a10 = this.m10,
   a11 = this.m11,
   a12 = this.m12;
  const a20 = this.m20,
   a21 = this.m21,
   a22 = this.m22;

  // Cofactor matrix, then transpose
  this.m00 = a11 * a22 - a12 * a21;
  this.m01 = a02 * a21 - a01 * a22;
  this.m02 = a01 * a12 - a02 * a11;
  this.m10 = a12 * a20 - a10 * a22;
  this.m11 = a00 * a22 - a02 * a20;
  this.m12 = a02 * a10 - a00 * a12;
  this.m20 = a10 * a21 - a11 * a20;
  this.m21 = a01 * a20 - a00 * a21;
  this.m22 = a00 * a11 - a01 * a10;

  return this;
 }

 /**
  * Pre-multiplies this matrix by another (other × this).
  *
  * @param other - Matrix to multiply by.
  * @returns This for chaining.
  *
  * @category Matrix Operations
  * @since 0.1.0
  */
 public premultiply(other: ReadonlyMatrix3Like): this {
  const a00 = this.m00,
   a01 = this.m01,
   a02 = this.m02;
  const a10 = this.m10,
   a11 = this.m11,
   a12 = this.m12;
  const a20 = this.m20,
   a21 = this.m21,
   a22 = this.m22;

  return this.set(
   other.m00 * a00 + other.m10 * a01 + other.m20 * a02,
   other.m01 * a00 + other.m11 * a01 + other.m21 * a02,
   other.m02 * a00 + other.m12 * a01 + other.m22 * a02,
   other.m00 * a10 + other.m10 * a11 + other.m20 * a12,
   other.m01 * a10 + other.m11 * a11 + other.m21 * a12,
   other.m02 * a10 + other.m12 * a11 + other.m22 * a12,
   other.m00 * a20 + other.m10 * a21 + other.m20 * a22,
   other.m01 * a20 + other.m11 * a21 + other.m21 * a22,
   other.m02 * a20 + other.m12 * a21 + other.m22 * a22,
  );
 }

 /* ======================================================================== */
 /* Instance Numeric Transforms                                              */
 /* ======================================================================== */

 /**
  * Floors all elements in place.
  *
  * @returns This for chaining.
  *
  * @category Numeric Transform
  * @since 0.9.0
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
  * Ceils all elements in place.
  *
  * @returns This for chaining.
  *
  * @category Numeric Transform
  * @since 0.9.0
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
  * Rounds all elements in place.
  *
  * @returns This for chaining.
  *
  * @category Numeric Transform
  * @since 0.9.0
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
  * Takes the absolute value of all elements in place.
  *
  * @returns This for chaining.
  *
  * @category Numeric Transform
  * @since 0.9.0
  */
 public abs(): this {
  this.m00 = scalarAbs(this.m00);
  this.m01 = scalarAbs(this.m01);
  this.m02 = scalarAbs(this.m02);
  this.m10 = scalarAbs(this.m10);
  this.m11 = scalarAbs(this.m11);
  this.m12 = scalarAbs(this.m12);
  this.m20 = scalarAbs(this.m20);
  this.m21 = scalarAbs(this.m21);
  this.m22 = scalarAbs(this.m22);
  return this;
 }

 /**
  * Takes the sign of all elements in place.
  *
  * @returns This for chaining.
  *
  * @category Numeric Transform
  * @since 0.9.0
  */
 public sign(): this {
  this.m00 = scalarSign(this.m00);
  this.m01 = scalarSign(this.m01);
  this.m02 = scalarSign(this.m02);
  this.m10 = scalarSign(this.m10);
  this.m11 = scalarSign(this.m11);
  this.m12 = scalarSign(this.m12);
  this.m20 = scalarSign(this.m20);
  this.m21 = scalarSign(this.m21);
  this.m22 = scalarSign(this.m22);
  return this;
 }

 /**
  * Clamps all elements to a range in place.
  *
  * @param minMatrix - Minimum values per element.
  * @param maxMatrix - Maximum values per element.
  * @returns This for chaining.
  *
  * @category Numeric Transform
  * @since 0.9.0
  */
 public clamp(minMatrix: ReadonlyMatrix3Like, maxMatrix: ReadonlyMatrix3Like): this {
  this.m00 = clamp(this.m00, minMatrix.m00, maxMatrix.m00);
  this.m01 = clamp(this.m01, minMatrix.m01, maxMatrix.m01);
  this.m02 = clamp(this.m02, minMatrix.m02, maxMatrix.m02);
  this.m10 = clamp(this.m10, minMatrix.m10, maxMatrix.m10);
  this.m11 = clamp(this.m11, minMatrix.m11, maxMatrix.m11);
  this.m12 = clamp(this.m12, minMatrix.m12, maxMatrix.m12);
  this.m20 = clamp(this.m20, minMatrix.m20, maxMatrix.m20);
  this.m21 = clamp(this.m21, minMatrix.m21, maxMatrix.m21);
  this.m22 = clamp(this.m22, minMatrix.m22, maxMatrix.m22);
  return this;
 }

 /**
  * Clamps all elements to a scalar range in place.
  *
  * @param minValue - Minimum value.
  * @param maxValue - Maximum value.
  * @returns This for chaining.
  *
  * @category Numeric Transform
  * @since 0.9.0
  */
 public clampScalar(minValue: number, maxValue: number): this {
  this.m00 = clamp(this.m00, minValue, maxValue);
  this.m01 = clamp(this.m01, minValue, maxValue);
  this.m02 = clamp(this.m02, minValue, maxValue);
  this.m10 = clamp(this.m10, minValue, maxValue);
  this.m11 = clamp(this.m11, minValue, maxValue);
  this.m12 = clamp(this.m12, minValue, maxValue);
  this.m20 = clamp(this.m20, minValue, maxValue);
  this.m21 = clamp(this.m21, minValue, maxValue);
  this.m22 = clamp(this.m22, minValue, maxValue);
  return this;
 }

 /**
  * Takes element-wise minimum with another matrix in place.
  *
  * @param other - Matrix to compare.
  * @returns This for chaining.
  *
  * @category Numeric Transform
  * @since 0.9.0
  */
 public min(other: ReadonlyMatrix3Like): this {
  this.m00 = scalarMin(this.m00, other.m00);
  this.m01 = scalarMin(this.m01, other.m01);
  this.m02 = scalarMin(this.m02, other.m02);
  this.m10 = scalarMin(this.m10, other.m10);
  this.m11 = scalarMin(this.m11, other.m11);
  this.m12 = scalarMin(this.m12, other.m12);
  this.m20 = scalarMin(this.m20, other.m20);
  this.m21 = scalarMin(this.m21, other.m21);
  this.m22 = scalarMin(this.m22, other.m22);
  return this;
 }

 /**
  * Takes element-wise maximum with another matrix in place.
  *
  * @param other - Matrix to compare.
  * @returns This for chaining.
  *
  * @category Numeric Transform
  * @since 0.9.0
  */
 public max(other: ReadonlyMatrix3Like): this {
  this.m00 = scalarMax(this.m00, other.m00);
  this.m01 = scalarMax(this.m01, other.m01);
  this.m02 = scalarMax(this.m02, other.m02);
  this.m10 = scalarMax(this.m10, other.m10);
  this.m11 = scalarMax(this.m11, other.m11);
  this.m12 = scalarMax(this.m12, other.m12);
  this.m20 = scalarMax(this.m20, other.m20);
  this.m21 = scalarMax(this.m21, other.m21);
  this.m22 = scalarMax(this.m22, other.m22);
  return this;
 }

 /**
  * Computes element-wise modulo in place.
  *
  * @param other - Divisor matrix.
  * @returns This for chaining.
  *
  * @category Numeric Transform
  * @since 0.9.0
  */
 public mod(other: ReadonlyMatrix3Like): this {
  this.m00 = scalarModule(this.m00, other.m00);
  this.m01 = scalarModule(this.m01, other.m01);
  this.m02 = scalarModule(this.m02, other.m02);
  this.m10 = scalarModule(this.m10, other.m10);
  this.m11 = scalarModule(this.m11, other.m11);
  this.m12 = scalarModule(this.m12, other.m12);
  this.m20 = scalarModule(this.m20, other.m20);
  this.m21 = scalarModule(this.m21, other.m21);
  this.m22 = scalarModule(this.m22, other.m22);
  return this;
 }

 /**
  * Computes scalar modulo in place.
  *
  * @param scalar - Divisor.
  * @returns This for chaining.
  *
  * @category Numeric Transform
  * @since 0.9.0
  */
 public modScalar(scalar: number): this {
  this.m00 = scalarModule(this.m00, scalar);
  this.m01 = scalarModule(this.m01, scalar);
  this.m02 = scalarModule(this.m02, scalar);
  this.m10 = scalarModule(this.m10, scalar);
  this.m11 = scalarModule(this.m11, scalar);
  this.m12 = scalarModule(this.m12, scalar);
  this.m20 = scalarModule(this.m20, scalar);
  this.m21 = scalarModule(this.m21, scalar);
  this.m22 = scalarModule(this.m22, scalar);
  return this;
 }

 /* ======================================================================== */
 /* Instance Column/Row Access                                               */
 /* ======================================================================== */

 /**
  * Gets a column of the matrix as a 3-element array.
  *
  * @param index - Column index (0, 1, or 2).
  * @returns Column as [row0, row1, row2].
  * @throws RangeError if index is out of bounds.
  *
  * @category Column/Row
  * @since 0.1.0
  */
 public getColumn(index: number): [number, number, number] {
  assertSafeInteger(index, 'Matrix3.getColumn:index');
  if (index === 0) return [this.m00, this.m01, this.m02];
  if (index === 1) return [this.m10, this.m11, this.m12];
  if (index === 2) return [this.m20, this.m21, this.m22];
  throw new RangeError(`Matrix3.getColumn: index must be 0, 1, or 2, got ${index}`);
 }

 /**
  * Sets a column of the matrix.
  *
  * @param index - Column index (0, 1, or 2).
  * @param values - Column values [row0, row1, row2].
  * @returns This for chaining.
  * @throws RangeError if index is out of bounds.
  *
  * @category Column/Row
  * @since 0.1.0
  */
 public setColumn(index: number, values: [number, number, number]): this {
  assertSafeInteger(index, 'Matrix3.setColumn:index');
  if (index === 0) {
   this.m00 = values[0];
   this.m01 = values[1];
   this.m02 = values[2];
   return this;
  }
  if (index === 1) {
   this.m10 = values[0];
   this.m11 = values[1];
   this.m12 = values[2];
   return this;
  }
  if (index === 2) {
   this.m20 = values[0];
   this.m21 = values[1];
   this.m22 = values[2];
   return this;
  }
  throw new RangeError(`Matrix3.setColumn: index must be 0, 1, or 2, got ${index}`);
 }

 /**
  * Gets a row of the matrix as a 3-element array.
  *
  * @param index - Row index (0, 1, or 2).
  * @returns Row as [col0, col1, col2].
  * @throws RangeError if index is out of bounds.
  *
  * @category Column/Row
  * @since 0.1.0
  */
 public getRow(index: number): [number, number, number] {
  assertSafeInteger(index, 'Matrix3.getRow:index');
  if (index === 0) return [this.m00, this.m10, this.m20];
  if (index === 1) return [this.m01, this.m11, this.m21];
  if (index === 2) return [this.m02, this.m12, this.m22];
  throw new RangeError(`Matrix3.getRow: index must be 0, 1, or 2, got ${index}`);
 }

 /**
  * Sets a row of the matrix.
  *
  * @param index - Row index (0, 1, or 2).
  * @param values - Row values [col0, col1, col2].
  * @returns This for chaining.
  * @throws RangeError if index is out of bounds.
  *
  * @category Column/Row
  * @since 0.1.0
  */
 public setRow(index: number, values: [number, number, number]): this {
  assertSafeInteger(index, 'Matrix3.setRow:index');
  if (index === 0) {
   this.m00 = values[0];
   this.m10 = values[1];
   this.m20 = values[2];
   return this;
  }
  if (index === 1) {
   this.m01 = values[0];
   this.m11 = values[1];
   this.m21 = values[2];
   return this;
  }
  if (index === 2) {
   this.m02 = values[0];
   this.m12 = values[1];
   this.m22 = values[2];
   return this;
  }
  throw new RangeError(`Matrix3.setRow: index must be 0, 1, or 2, got ${index}`);
 }

 /* ======================================================================== */
 /* Instance Transformations                                                 */
 /* ======================================================================== */

 /**
  * Applies a translation to this matrix in place.
  *
  * @param translation - Translation vector.
  * @returns This for chaining.
  *
  * @category Transform
  * @since 0.1.0
  */
 public translate(translation: ReadonlyVector2Like): this {
  const tx = translation.x;
  const ty = translation.y;
  this.m20 = this.m00 * tx + this.m10 * ty + this.m20;
  this.m21 = this.m01 * tx + this.m11 * ty + this.m21;
  this.m22 = this.m02 * tx + this.m12 * ty + this.m22;
  return this;
 }

 /**
  * Applies a rotation to this matrix in place.
  *
  * @param angle - Rotation angle in radians.
  * @returns This for chaining.
  *
  * @category Transform
  * @since 0.1.0
  */
 public rotate(angle: number): this {
  const { cos, sin } = sinCos(angle);
  const a00 = this.m00,
   a01 = this.m01,
   a02 = this.m02;
  const a10 = this.m10,
   a11 = this.m11,
   a12 = this.m12;

  this.m00 = a00 * cos + a10 * sin;
  this.m01 = a01 * cos + a11 * sin;
  this.m02 = a02 * cos + a12 * sin;
  this.m10 = a00 * -sin + a10 * cos;
  this.m11 = a01 * -sin + a11 * cos;
  this.m12 = a02 * -sin + a12 * cos;
  return this;
 }

 /**
  * Applies a scale transformation to this matrix in place.
  *
  * @param scaleValue - Scale factor (scalar or per-axis vector).
  * @returns This for chaining.
  *
  * @category Transform
  * @since 0.1.0
  */
 public scaleBy(scaleValue: ReadonlyVector2Like | number): this {
  let sx: number;
  let sy: number;
  if (typeof scaleValue === 'number') {
   sx = sy = scaleValue;
  } else {
   sx = scaleValue.x;
   sy = scaleValue.y;
  }
  this.m00 *= sx;
  this.m01 *= sx;
  this.m02 *= sx;
  this.m10 *= sy;
  this.m11 *= sy;
  this.m12 *= sy;
  return this;
 }

 /* ======================================================================== */
 /* Instance Transform Application                                           */
 /* ======================================================================== */

 /**
  * Transforms a point by this matrix.
  *
  * @param point - Point to transform.
  * @param out - Optional output vector.
  * @returns Transformed point.
  *
  * @remarks
  * Points are affected by translation (uses homogeneous coordinate w=1).
  *
  * @category Transform
  * @since 0.1.0
  */
 public transformPoint(point: ReadonlyVector2Like, out?: Vector2): Vector2 {
  return Matrix3.transformPoint(this, point, out);
 }

 /**
  * Transforms a vector by this matrix.
  *
  * @param vector - Vector to transform.
  * @param out - Optional output vector.
  * @returns Transformed vector.
  *
  * @remarks
  * Vectors are NOT affected by translation (uses homogeneous coordinate w=0).
  *
  * @category Transform
  * @since 0.1.0
  */
 public transformVector(vector: ReadonlyVector2Like, out?: Vector2): Vector2 {
  return Matrix3.transformVector(this, vector, out);
 }

 /**
  * Transforms multiple points efficiently (batch operation).
  *
  * @param points - Array of points to transform.
  * @param out - Optional output array (will be filled/extended as needed).
  * @returns Array of transformed points.
  *
  * @remarks
  * More efficient than calling transformPoint multiple times for large arrays
  * because it avoids repeated function call overhead.
  *
  * @example
  * ```typescript
  * const vertices = [new Vector2(0, 0), new Vector2(1, 0), new Vector2(1, 1)];
  * const worldVertices = matrix.transformPoints(vertices);
  * ```
  *
  * @category Batch Operations
  * @since 0.9.0
  */
 public transformPoints(points: readonly ReadonlyVector2Like[], out: Vector2[] = []): Vector2[] {
  for (let index = 0; index < points.length; index++) {
   out[index] = this.transformPoint(points[index]!, out[index]);
  }
  return out;
 }

 /**
  * Transforms multiple vectors efficiently (batch operation).
  *
  * @param vectors - Array of vectors to transform.
  * @param out - Optional output array (will be filled/extended as needed).
  * @returns Array of transformed vectors.
  *
  * @remarks
  * Unlike points, vectors are not affected by translation.
  *
  * @category Batch Operations
  * @since 0.9.0
  */
 public transformVectors(vectors: readonly ReadonlyVector2Like[], out: Vector2[] = []): Vector2[] {
  for (let index = 0; index < vectors.length; index++) {
   out[index] = this.transformVector(vectors[index]!, out[index]);
  }
  return out;
 }

 /* ======================================================================== */
 /* Instance Comparison                                                      */
 /* ======================================================================== */

 /**
  * Tests approximate equality with another matrix.
  *
  * @param other - Matrix to compare.
  * @param epsilon - Tolerance. @defaultValue `EPSILON`
  * @returns True if all component differences are within epsilon.
  *
  * @category Comparison
  * @since 0.1.0
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
 public exactEquals(other: ReadonlyMatrix3Like): boolean {
  return Matrix3.exactEquals(this, other);
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
 public nearEquals(other: ReadonlyMatrix3Like, epsilon: number = EPSILON): boolean {
  return Matrix3.nearEquals(this, other, epsilon);
 }

 /**
  * Tests if this matrix is an identity matrix.
  *
  * @param epsilon - Tolerance. @defaultValue `EPSILON`
  * @returns True if this is an identity matrix.
  *
  * @category Comparison
  * @since 0.1.0
  */
 public isIdentity(epsilon: number = EPSILON): boolean {
  return (
   scalarNearEquals(this.m00, 1, epsilon) &&
   isNearZero(this.m01, epsilon) &&
   isNearZero(this.m02, epsilon) &&
   isNearZero(this.m10, epsilon) &&
   scalarNearEquals(this.m11, 1, epsilon) &&
   isNearZero(this.m12, epsilon) &&
   isNearZero(this.m20, epsilon) &&
   isNearZero(this.m21, epsilon) &&
   scalarNearEquals(this.m22, 1, epsilon)
  );
 }

 /**
  * Tests if all elements are exactly zero.
  *
  * @returns True if all elements are zero.
  *
  * @category Comparison
  * @since 0.9.0
  */
 public isZero(): boolean {
  return (
   this.m00 === 0 &&
   this.m01 === 0 &&
   this.m02 === 0 &&
   this.m10 === 0 &&
   this.m11 === 0 &&
   this.m12 === 0 &&
   this.m20 === 0 &&
   this.m21 === 0 &&
   this.m22 === 0
  );
 }

 /**
  * Tests if all elements are near zero.
  *
  * @param epsilon - Tolerance. @defaultValue `EPSILON`
  * @returns True if all elements are within epsilon of zero.
  *
  * @category Comparison
  * @since 0.9.0
  */
 public nearZero(epsilon: number = EPSILON): boolean {
  return (
   isNearZero(this.m00, epsilon) &&
   isNearZero(this.m01, epsilon) &&
   isNearZero(this.m02, epsilon) &&
   isNearZero(this.m10, epsilon) &&
   isNearZero(this.m11, epsilon) &&
   isNearZero(this.m12, epsilon) &&
   isNearZero(this.m20, epsilon) &&
   isNearZero(this.m21, epsilon) &&
   isNearZero(this.m22, epsilon)
  );
 }

 /**
  * Tests if all elements are finite.
  *
  * @returns True if all elements are finite.
  *
  * @category Comparison
  * @since 0.9.0
  */
 public isFinite(): boolean {
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
 }

 /**
  * Tests if any element is NaN.
  *
  * @returns True if any element is NaN.
  *
  * @category Comparison
  * @since 0.9.0
  */
 public hasNaN(): boolean {
  return (
   Number.isNaN(this.m00) ||
   Number.isNaN(this.m01) ||
   Number.isNaN(this.m02) ||
   Number.isNaN(this.m10) ||
   Number.isNaN(this.m11) ||
   Number.isNaN(this.m12) ||
   Number.isNaN(this.m20) ||
   Number.isNaN(this.m21) ||
   Number.isNaN(this.m22)
  );
 }

 /**
  * Tests if this matrix is symmetric (M = M^T).
  *
  * @param epsilon - Relative tolerance. @defaultValue `EPSILON`
  * @returns True if matrix is symmetric.
  *
  * @remarks
  * Uses relative tolerance for comparing off-diagonal elements.
  *
  * @category Comparison
  * @since 0.9.0
  */
 public isSymmetric(epsilon: number = EPSILON): boolean {
  return (
   relativeEquals(this.m01, this.m10, epsilon) &&
   relativeEquals(this.m02, this.m20, epsilon) &&
   relativeEquals(this.m12, this.m21, epsilon)
  );
 }

 /**
  * Tests if this matrix is skew-symmetric (M = -M^T).
  *
  * @param epsilon - Tolerance. @defaultValue `EPSILON`
  * @returns True if matrix is skew-symmetric.
  *
  * @remarks
  * Uses relative tolerance for comparing off-diagonal elements.
  *
  * @category Comparison
  * @since 0.9.0
  */
 public isSkewSymmetric(epsilon: number = EPSILON): boolean {
  return (
   isNearZero(this.m00, epsilon) &&
   isNearZero(this.m11, epsilon) &&
   isNearZero(this.m22, epsilon) &&
   relativeEquals(this.m01, -this.m10, epsilon) &&
   relativeEquals(this.m02, -this.m20, epsilon) &&
   relativeEquals(this.m12, -this.m21, epsilon)
  );
 }

 /**
  * Tests if this matrix is diagonal (off-diagonal elements ≈ 0).
  *
  * @param epsilon - Tolerance. @defaultValue `EPSILON`
  * @returns True if matrix is diagonal.
  *
  * @category Comparison
  * @since 0.9.0
  */
 public isDiagonal(epsilon: number = EPSILON): boolean {
  return (
   isNearZero(this.m01, epsilon) &&
   isNearZero(this.m02, epsilon) &&
   isNearZero(this.m10, epsilon) &&
   isNearZero(this.m12, epsilon) &&
   isNearZero(this.m20, epsilon) &&
   isNearZero(this.m21, epsilon)
  );
 }

 /**
  * Tests if this matrix is singular (determinant ≈ 0).
  *
  * @param epsilon - Tolerance. @defaultValue `EPSILON`
  * @returns True if matrix is singular (non-invertible).
  *
  * @category Comparison
  * @since 0.9.0
  */
 public isSingular(epsilon: number = EPSILON): boolean {
  return isNearZero(this.determinant(), epsilon);
 }

 /**
  * Tests if this matrix is orthogonal (M * M^T = I).
  *
  * @param epsilon - Tolerance. @defaultValue `EPSILON`
  * @returns True if matrix is orthogonal.
  *
  * @category Comparison
  * @since 0.9.0
  */
 public isOrthogonal(epsilon: number = EPSILON): boolean {
  // Check if columns are unit length and mutually orthogonal
  const col0LengthSq = this.m00 * this.m00 + this.m01 * this.m01 + this.m02 * this.m02;
  const col1LengthSq = this.m10 * this.m10 + this.m11 * this.m11 + this.m12 * this.m12;
  const col2LengthSq = this.m20 * this.m20 + this.m21 * this.m21 + this.m22 * this.m22;

  const dot01 = this.m00 * this.m10 + this.m01 * this.m11 + this.m02 * this.m12;
  const dot02 = this.m00 * this.m20 + this.m01 * this.m21 + this.m02 * this.m22;
  const dot12 = this.m10 * this.m20 + this.m11 * this.m21 + this.m12 * this.m22;

  return (
   scalarNearEquals(col0LengthSq, 1, epsilon) &&
   scalarNearEquals(col1LengthSq, 1, epsilon) &&
   scalarNearEquals(col2LengthSq, 1, epsilon) &&
   isNearZero(dot01, epsilon) &&
   isNearZero(dot02, epsilon) &&
   isNearZero(dot12, epsilon)
  );
 }

 /* ======================================================================== */
 /* Instance Interpolation                                                   */
 /* ======================================================================== */

 /**
  * Linear interpolation with another matrix in place.
  *
  * @param other - Target matrix.
  * @param t - Interpolation factor [0, 1], clamped.
  * @returns This for chaining.
  *
  * @category Interpolation
  * @since 0.1.0
  */
 public lerp(other: ReadonlyMatrix3Like, t: number): this {
  return this.set(
   lerp(this.m00, other.m00, t),
   lerp(this.m01, other.m01, t),
   lerp(this.m02, other.m02, t),
   lerp(this.m10, other.m10, t),
   lerp(this.m11, other.m11, t),
   lerp(this.m12, other.m12, t),
   lerp(this.m20, other.m20, t),
   lerp(this.m21, other.m21, t),
   lerp(this.m22, other.m22, t),
  );
 }

 /**
  * Linear interpolation without clamping t.
  *
  * @param other - Target matrix.
  * @param t - Interpolation factor (not clamped).
  * @returns This for chaining.
  *
  * @category Interpolation
  * @since 0.9.0
  */
 public lerpUnclamped(other: ReadonlyMatrix3Like, t: number): this {
  return this.set(
   lerp(this.m00, other.m00, t),
   lerp(this.m01, other.m01, t),
   lerp(this.m02, other.m02, t),
   lerp(this.m10, other.m10, t),
   lerp(this.m11, other.m11, t),
   lerp(this.m12, other.m12, t),
   lerp(this.m20, other.m20, t),
   lerp(this.m21, other.m21, t),
   lerp(this.m22, other.m22, t),
  );
 }

 /**
  * Clamped linear interpolation (alias for lerp).
  *
  * @param other - Target matrix.
  * @param t - Interpolation factor (clamped to [0, 1]).
  * @returns This for chaining.
  *
  * @category Interpolation
  * @since 0.9.0
  */
 public lerpClamped(other: ReadonlyMatrix3Like, t: number): this {
  return this.lerp(other, saturate(t));
 }

 /**
  * Smooth step interpolation in place.
  *
  * @param other - Target matrix.
  * @param t - Interpolation factor.
  * @returns This for chaining.
  *
  * @category Interpolation
  * @since 0.9.0
  */
 public smoothStep(other: ReadonlyMatrix3Like, t: number): this {
  const tt = saturate(t);
  const factor = tt * tt * (3 - 2 * tt);
  return this.set(
   lerp(this.m00, other.m00, factor),
   lerp(this.m01, other.m01, factor),
   lerp(this.m02, other.m02, factor),
   lerp(this.m10, other.m10, factor),
   lerp(this.m11, other.m11, factor),
   lerp(this.m12, other.m12, factor),
   lerp(this.m20, other.m20, factor),
   lerp(this.m21, other.m21, factor),
   lerp(this.m22, other.m22, factor),
  );
 }

 /* ======================================================================== */
 /* Instance Conversion                                                      */
 /* ======================================================================== */

 /**
  * Converts the matrix to an array.
  *
  * @param out - Optional output array.
  * @param offset - Array offset. @defaultValue `0`
  * @param columnMajor - Use column-major order. @defaultValue `true`
  * @returns Array with matrix elements.
  *
  * @category Conversion
  * @since 0.1.0
  */
 public toArray(out?: number[], offset = 0, columnMajor = true): number[] {
  const array = out ?? new Array(9);
  if (columnMajor) {
   array[offset] = this.m00;
   array[offset + 1] = this.m01;
   array[offset + 2] = this.m02;
   array[offset + 3] = this.m10;
   array[offset + 4] = this.m11;
   array[offset + 5] = this.m12;
   array[offset + 6] = this.m20;
   array[offset + 7] = this.m21;
   array[offset + 8] = this.m22;
  } else {
   array[offset] = this.m00;
   array[offset + 1] = this.m10;
   array[offset + 2] = this.m20;
   array[offset + 3] = this.m01;
   array[offset + 4] = this.m11;
   array[offset + 5] = this.m21;
   array[offset + 6] = this.m02;
   array[offset + 7] = this.m12;
   array[offset + 8] = this.m22;
  }
  return array;
 }

 /**
  * Converts the matrix to a Float32Array.
  *
  * @param out - Optional output array.
  * @param offset - Array offset. @defaultValue `0`
  * @param columnMajor - Use column-major order. @defaultValue `true`
  * @returns Float32Array with matrix elements.
  *
  * @category Conversion
  * @since 0.1.0
  */
 public toFloat32Array(out?: Float32Array, offset = 0, columnMajor = true): Float32Array {
  const array = out ?? new Float32Array(9);
  this.toArray(array as unknown as number[], offset, columnMajor);
  return array;
 }

 /**
  * Extracts the upper-left 2×2 portion as a Matrix2.
  *
  * @param out - Optional output matrix.
  * @returns Matrix2 containing upper-left 2×2 portion.
  *
  * @category Conversion
  * @since 0.1.0
  */
 public toMatrix2(out?: Matrix2): Matrix2 {
  return Matrix2.fromValues(this.m00, this.m01, this.m10, this.m11, out);
 }

 /**
  * Converts the matrix to a plain object.
  *
  * @returns Object with m00-m22 properties.
  *
  * @example
  * ```typescript
  * const m = Matrix3.fromRotation(Math.PI / 2);
  * const obj = m.toObject();
  * ```
  *
  * @category Conversion
  * @since 0.1.0
  */
 public toObject(): Matrix3Like {
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
  * Converts the matrix to a JSON-serializable object.
  * Called automatically by JSON.stringify().
  *
  * @returns Object suitable for JSON serialization.
  *
  * @category Conversion
  * @since 0.1.0
  */
 public toJSON(): Matrix3Like {
  return this.toObject();
 }

 /**
  * Creates a human-readable string representation.
  *
  * @param precision - Decimal places. @defaultValue `4`
  * @returns Formatted string.
  *
  * @example
  * ```typescript
  * const m = Matrix3.IDENTITY;
  * console.log(m.toString());
  * // Matrix3(
  * //   1.0000, 0.0000, 0.0000
  * //   0.0000, 1.0000, 0.0000
  * //   0.0000, 0.0000, 1.0000
  * // )
  * ```
  *
  * @category Conversion
  * @since 0.1.0
  */
 public toString(precision = 4): string {
  const p = (value: number): string => value.toFixed(precision);
  return `Matrix3(\n  ${p(this.m00)}, ${p(this.m10)}, ${p(this.m20)}\n  ${p(this.m01)}, ${p(this.m11)}, ${p(this.m21)}\n  ${p(this.m02)}, ${p(this.m12)}, ${p(this.m22)}\n)`;
 }

 /**
  * Creates a deep copy of this matrix.
  *
  * @returns New Matrix3 with identical values.
  *
  * @example
  * ```typescript
  * const m = Matrix3.fromRotation(Math.PI / 4);
  * const copy = m.clone();
  * copy.identity(); // Original unchanged
  * ```
  *
  * @category Conversion
  * @since 0.1.0
  */
 public clone(): Matrix3 {
  return Matrix3.clone(this);
 }

 /**
  * Iterator for array destructuring (column-major order).
  * @returns Iterator yielding all 9 elements.
  *
  * @example
  * ```typescript
  * const [m00, m01, m02, m10, m11, m12, m20, m21, m22] = matrix;
  * ```
  *
  * @category Conversion
  * @since 0.9.0
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
}
