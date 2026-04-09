/**
 * @file core/matrix3.ts
 * @module @lenguados/math2d/core
 * @description Deterministic 3×3 matrix implementation for 2D affine transformations
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
 * - Trigonometric operations use deterministic kernels for cross-platform reproducibility
 *
 * **Matrix Layout (Column-Major)**
 * ```
 * | m00  m10  m20 |   | scaleX*cos  -scaleY*sin  translateX |
 * | m01  m11  m21 | = | scaleX*sin   scaleY*cos  translateY |
 * | m02  m12  m22 |   |     0            0           1      |
 * ```
 */

import { sinCos } from '../auxiliary/angle/operations';
import { divideSafe } from '../auxiliary/numeric/safety';
import {
 clamp,
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
import { atan2, hypot } from '../deterministic/deterministic-kernels';
import type {
 Matrix3Like,
 ReadonlyMatrix2Like,
 ReadonlyMatrix3Like,
 ReadonlyRotation2Like,
 ReadonlyTransform2Like,
 ReadonlyVector2Like,
} from '../types';
import { assertSafeInteger } from '../validation/assert';

import { Matrix2 } from './matrix2';
import { Vector2 } from './vector2';

/* ========================================================================== */
/* Type Exports                                                               */
/* ========================================================================== */

/**
 * Readonly view of a {@link Matrix3} instance.
 *
 * @category Types
 * @since 0.7.0
 * @public
 */
export type ReadonlyMatrix3 = Readonly<Matrix3>;

/* ========================================================================== */
/* Helper Functions                                                           */
/* ========================================================================== */

/**
 * Permanently freezes a {@link Matrix3} instance so it can no longer be mutated.
 *
 * @remarks
 * - The returned object keeps its original reference; no new memory is allocated.
 * - In strict mode any subsequent attempt to modify properties throws a TypeError.
 *
 * @param matrix - The Matrix3 object to freeze
 * @returns The same instance, now typed as ReadonlyMatrix3
 *
 * @example
 * ```typescript
 * const IDENTITY = freezeMatrix3(new Matrix3());
 * IDENTITY.m00 = 5; // Throws in strict mode
 * ```
 *
 * @category Helpers
 * @since 0.7.0
 */
export function freezeMatrix3(matrix: Matrix3): ReadonlyMatrix3 {
 return Object.freeze(matrix);
}

export { isMatrix3Like } from '../types';

/* ========================================================================== */
/* Class: Matrix3                                                              */
/* ========================================================================== */

/**
 * Column-major 3×3 matrix for 2D affine transformations in homogeneous coordinates.
 *
 * @remarks
 * - **Design:** 3×3 column-major matrix stored as 9 elements. Instance methods are
 *   mutable and chainable; static methods are pure with alloc-free overloads via `out`.
 *   Supports 2D affine transforms (translation, rotation, scale, shear).
 * - **Numerics:** Deterministic for cross-platform reproducibility. Uses cofactor
 *   expansion for inverse computation.
 * - **Safety:** "Safe" variants return identity matrix instead of throwing on
 *   singular matrices.
 *
 * @example
 * ```typescript
 * // Static (pure, allocation-controlled)
 * const product = Matrix3.multiply(a, b);
 * const inv = Matrix3.inverse(m);
 *
 * // Instance (mutable, chainable)
 * matrix.multiply(other).transpose();
 * ```
 *
 * @category Core
 * @since 0.7.0
 */
export class Matrix3 implements Matrix3Like {
 /* ======================================================================== */
 /* Private Helpers                                                          */
 /* ======================================================================== */

 private static ensureOut(out?: Matrix3): Matrix3 {
  return out ?? new Matrix3();
 }

 /* ======================================================================== */
 /* Static Constants (Immutable)                                             */
 /* ======================================================================== */

 /**
  * Identity matrix (no transformation).
  * @category Constant
  * @since 0.7.0
  */
 public static readonly IDENTITY = freezeMatrix3(new Matrix3(1, 0, 0, 0, 1, 0, 0, 0, 1));

 /**
  * Number of elements when serialized to an array.
  * @category Constant
  * @since 0.7.0
  */
 public static readonly ELEMENT_COUNT = 9;

 /**
  * Zero matrix.
  * @category Constant
  * @since 0.7.0
  */
 public static readonly ZERO = freezeMatrix3(new Matrix3(0, 0, 0, 0, 0, 0, 0, 0, 0));

 /**
  * Flip horizontally (mirror across Y axis).
  * @category Constant
  * @since 0.7.0
  */
 public static readonly FLIP_X = freezeMatrix3(new Matrix3(-1, 0, 0, 0, 1, 0, 0, 0, 1));

 /**
  * Flip vertically (mirror across X axis).
  * @category Constant
  * @since 0.7.0
  */
 public static readonly FLIP_Y = freezeMatrix3(new Matrix3(1, 0, 0, 0, -1, 0, 0, 0, 1));

 /**
  * Flip both axes (equivalent to ROTATE_180).
  * @category Constant
  * @since 0.7.0
  */
 public static readonly FLIP_XY = freezeMatrix3(new Matrix3(-1, 0, 0, 0, -1, 0, 0, 0, 1));

 /**
  * 90° counter-clockwise rotation.
  * @category Constant
  * @since 0.7.0
  */
 public static readonly ROTATE_90 = freezeMatrix3(new Matrix3(0, 1, 0, -1, 0, 0, 0, 0, 1));

 /**
  * 180° rotation.
  * @category Constant
  * @since 0.7.0
  */
 public static readonly ROTATE_180 = freezeMatrix3(new Matrix3(-1, 0, 0, 0, -1, 0, 0, 0, 1));

 /**
  * 270° counter-clockwise rotation (90° clockwise).
  * @category Constant
  * @since 0.7.0
  */
 public static readonly ROTATE_270 = freezeMatrix3(new Matrix3(0, -1, 0, 1, 0, 0, 0, 0, 1));

 /* ======================================================================== */
 /* Static Factories                                                         */
 /* ======================================================================== */

 /**
  * Creates a matrix from explicit components.
  *
  * @param m00 - Element at row 0, column 0
  * @param m01 - Element at row 1, column 0
  * @param m02 - Element at row 2, column 0
  * @param m10 - Element at row 0, column 1
  * @param m11 - Element at row 1, column 1
  * @param m12 - Element at row 2, column 1
  * @param m20 - Element at row 0, column 2
  * @param m21 - Element at row 1, column 2
  * @param m22 - Element at row 2, column 2
  * @param out - Optional output matrix
  * @returns A Matrix3 with the specified components
  *
  * @example
  * ```typescript
  * const m = Matrix3.fromValues(1, 0, 0, 0, 1, 0, 5, 10, 1);
  * Matrix3.fromValues(1, 0, 0, 0, 1, 0, 5, 10, 1, existing); // reuse allocation
  * ```
  *
  * @category Factory
  * @since 0.7.0
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
  * @param source - Matrix to clone
  * @param out - Optional output matrix
  * @returns A Matrix3 with identical components
  *
  * @example
  * ```typescript
  * const copy = Matrix3.clone(original);
  * Matrix3.clone(original, existing); // reuse allocation
  * ```
  *
  * @category Factory
  * @since 0.7.0
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
  * @param source - Source matrix
  * @param destination - Target matrix to receive the copy
  * @returns The destination matrix
  *
  * @example
  * ```typescript
  * const dest = new Matrix3();
  * Matrix3.copy(source, dest); // dest now has source's components
  * ```
  *
  * @category Factory
  * @since 0.7.0
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
  * @param object - Plain object with m00-m22 properties
  * @param out - Optional output matrix
  * @returns A Matrix3 with the object's components
  * @throws {Error} If any component is not finite
  *
  * @example
  * ```typescript
  * const m = Matrix3.fromObject({ m00: 1, m01: 0, m02: 0, m10: 0, m11: 1, m12: 0, m20: 5, m21: 10, m22: 1 });
  * Matrix3.fromObject(obj, existing); // reuse allocation
  * ```
  *
  * @category Factory
  * @since 0.7.0
  */
 public static fromObject(object: ReadonlyMatrix3Like, out?: Matrix3): Matrix3 {
  return Matrix3.ensureOut(out).set(
   object.m00,
   object.m01,
   object.m02,
   object.m10,
   object.m11,
   object.m12,
   object.m20,
   object.m21,
   object.m22,
  );
 }

 /**
  * Creates a translation matrix.
  *
  * @param translation - Translation vector
  * @param out - Optional output matrix
  * @returns A Matrix3 representing the translation
  *
  * @example
  * ```typescript
  * const m = Matrix3.fromTranslation({ x: 5, y: 10 });
  * Matrix3.fromTranslation({ x: 5, y: 10 }, existing); // reuse allocation
  * ```
  *
  * @category Factory
  * @since 0.7.0
  */
 public static fromTranslation(translation: ReadonlyVector2Like, out?: Matrix3): Matrix3 {
  return Matrix3.ensureOut(out).set(1, 0, 0, 0, 1, 0, translation.x, translation.y, 1);
 }

 /**
  * Creates a rotation matrix from an angle or Rotation2.
  *
  * @param rotation - Angle in radians or a Rotation2Like object
  * @param out - Optional output matrix
  * @returns A Matrix3 representing the rotation
  *
  * @example
  * ```typescript
  * const m = Matrix3.fromRotation(Math.PI / 4);
  * Matrix3.fromRotation(Math.PI / 2, existing); // reuse allocation
  * ```
  *
  * @category Factory
  * @since 0.7.0
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
  * @param scale - Scale factor (uniform) or Vector2 (non-uniform)
  * @param out - Optional output matrix
  * @returns A Matrix3 representing the scale
  *
  * @example
  * ```typescript
  * const m = Matrix3.fromScale(2);                    // uniform scale
  * const n = Matrix3.fromScale({ x: 2, y: 3 });      // non-uniform scale
  * Matrix3.fromScale({ x: 2, y: 3 }, existing);      // reuse allocation
  * ```
  *
  * @category Factory
  * @since 0.7.0
  */
 public static fromScale(scale: ReadonlyVector2Like | number, out?: Matrix3): Matrix3 {
  const target = Matrix3.ensureOut(out);
  if (typeof scale === 'number') {
   return target.set(scale, 0, 0, 0, scale, 0, 0, 0, 1);
  }
  return target.set(scale.x, 0, 0, 0, scale.y, 0, 0, 0, 1);
 }

 /**
  * Creates a shear transformation matrix.
  *
  * @remarks
  * A shear matrix distorts shapes along one axis:
  * - shear.x skews horizontally (x += shear.x * y)
  * - shear.y skews vertically (y += shear.y * x)
  *
  * @param shear - Shear factors (x: horizontal, y: vertical)
  * @param out - Optional output matrix
  * @returns Shear matrix
  *
  * @example
  * ```typescript
  * const shear = Matrix3.fromShear({ x: 0.5, y: 0 }); // Horizontal shear
  * const point = Matrix3.apply(shear, { x: 0, y: 1 }); // (0.5, 1)
  * ```
  *
  * @category Factory
  * @since 0.7.0
  */
 public static fromShear(shear: ReadonlyVector2Like, out?: Matrix3): Matrix3 {
  return Matrix3.ensureOut(out).set(1, shear.y, 0, shear.x, 1, 0, 0, 0, 1);
 }

 /**
  * Creates a reflection matrix about a line passing through the origin with the given normal.
  *
  * @remarks
  * Implements the Householder reflector `I - 2nn^T`:
  * ```
  * | 1 - 2*nx*nx   -2*nx*ny      0 |
  * | -2*nx*ny       1 - 2*ny*ny   0 |
  * | 0              0              1 |
  * ```
  * The normal is assumed to be unit length (no normalization is performed).
  *
  * @param normal - Unit normal vector of the reflection line
  * @param out - Optional output matrix
  * @returns Reflection matrix
  *
  * @example
  * ```typescript
  * // Reflect about Y-axis (normal = (1, 0)) — negates x-coordinates
  * const reflectY = Matrix3.fromReflection({ x: 1, y: 0 });
  *
  * // Reflect about X-axis (normal = (0, 1)) — negates y-coordinates
  * const reflectX = Matrix3.fromReflection({ x: 0, y: 1 });
  * ```
  *
  * @category Factory
  * @since 0.7.0
  */
 public static fromReflection(normal: ReadonlyVector2Like, out?: Matrix3): Matrix3 {
  const nx = normal.x;
  const ny = normal.y;
  return Matrix3.ensureOut(out).set(
   1 - 2 * nx * nx,
   -2 * nx * ny,
   0,
   -2 * nx * ny,
   1 - 2 * ny * ny,
   0,
   0,
   0,
   1,
  );
 }

 /**
  * Creates a Matrix3 from a Matrix2 (embeds 2×2 in homogeneous coordinates).
  *
  * @param matrix - Source 2×2 matrix
  * @param out - Optional output matrix
  * @returns A Matrix3 with the 2×2 matrix in the upper-left
  *
  * @example
  * ```typescript
  * const m3 = Matrix3.fromMatrix2(mat2);
  * Matrix3.fromMatrix2(mat2, existing); // reuse allocation
  * ```
  *
  * @category Factory
  * @since 0.7.0
  */
 public static fromMatrix2(matrix: ReadonlyMatrix2Like, out?: Matrix3): Matrix3 {
  return Matrix3.ensureOut(out).set(matrix.m00, matrix.m01, 0, matrix.m10, matrix.m11, 0, 0, 0, 1);
 }

 /**
  * Creates a transform matrix from translation, rotation, and scale.
  *
  * @param translation - Translation vector
  * @param rotation - Rotation angle in radians
  * @param scale - Scale factor (uniform) or Vector2 (non-uniform)
  * @param out - Optional output matrix
  * @returns A Matrix3 representing the combined transform (T × R × S)
  *
  * @example
  * ```typescript
  * const m = Matrix3.fromTransform2({ x: 10, y: 20 }, Math.PI / 4, 2);
  * Matrix3.fromTransform2({ x: 10, y: 20 }, 0, { x: 1, y: 2 }, existing); // reuse allocation
  * ```
  *
  * @category Factory
  * @since 0.7.0
  */
 public static fromTransform2(
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
  * Creates a matrix from a {@link ReadonlyTransform2Like} directly.
  *
  * @remarks
  * Unlike {@link fromTransform2}, this accepts a single transform object with
  * position, rotation, and scale properties. The rotation is read as pre-computed
  * cos/sin values from the transform's rotation component.
  *
  * @param transform - Transform with position, rotation, and scale
  * @param out - Optional output matrix
  * @returns A Matrix3 encoding Scale -> Rotate -> Translate
  *
  * @example
  * ```typescript
  * const t = { position: { x: 10, y: 20 }, rotation: { cos: 1, sin: 0 }, scale: { x: 2, y: 2 } };
  * const m = Matrix3.fromTransform2Like(t);
  * ```
  *
  * @category Factory
  * @since 0.7.0
  */
 public static fromTransform2Like(transform: ReadonlyTransform2Like, out?: Matrix3): Matrix3 {
  const { cos, sin } = transform.rotation;
  const sx = transform.scale.x;
  const sy = transform.scale.y;
  const tx = transform.position.x;
  const ty = transform.position.y;
  return Matrix3.ensureOut(out).set(sx * cos, sx * sin, 0, -sy * sin, sy * cos, 0, tx, ty, 1);
 }

 /**
  * Creates a matrix from column vectors.
  *
  * @param col0 - First column [m00, m01, m02]
  * @param col1 - Second column [m10, m11, m12]
  * @param col2 - Third column [m20, m21, m22]
  * @param out - Optional output matrix
  * @returns A Matrix3 with the specified columns
  *
  * @example
  * ```typescript
  * const m = Matrix3.fromColumns([1, 0, 0], [0, 1, 0], [5, 10, 1]);
  * Matrix3.fromColumns([1, 0, 0], [0, 1, 0], [5, 10, 1], existing); // reuse allocation
  * ```
  *
  * @category Factory
  * @since 0.7.0
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
  * @param row0 - First row [m00, m10, m20]
  * @param row1 - Second row [m01, m11, m21]
  * @param row2 - Third row [m02, m12, m22]
  * @param out - Optional output matrix
  * @returns A Matrix3 with the specified rows
  *
  * @example
  * ```typescript
  * const m = Matrix3.fromRows([1, 0, 5], [0, 1, 10], [0, 0, 1]);
  * Matrix3.fromRows([1, 0, 5], [0, 1, 10], [0, 0, 1], existing); // reuse allocation
  * ```
  *
  * @category Factory
  * @since 0.7.0
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
  * @param left - Left boundary
  * @param right - Right boundary
  * @param bottom - Bottom boundary
  * @param top - Top boundary
  * @param out - Optional output matrix
  * @returns A Matrix3 representing the orthographic projection
  * @throws {RangeError} If width (right - left) or height (top - bottom) is near zero (degenerate bounds)
  *
  * @example
  * ```typescript
  * const proj = Matrix3.ortho(0, 800, 0, 600);
  * Matrix3.ortho(0, 800, 0, 600, existing);   // reuse allocation
  * Matrix3.ortho(5, 5, 0, 600);               // throws RangeError (zero width)
  * ```
  *
  * @see {@link orthoSafe} - Returns fallback for degenerate bounds
  *
  * @category Factory
  * @since 0.7.0
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
  if (isNearZero(width) || isNearZero(height)) {
   throw new RangeError('Matrix3.ortho: degenerate bounds (zero width or height)');
  }
  const tx = -(right + left) / width;
  const ty = -(top + bottom) / height;
  return Matrix3.ensureOut(out).set(2 / width, 0, 0, 0, 2 / height, 0, tx, ty, 1);
 }

 /**
  * Creates an orthographic projection matrix (safe version).
  * Returns identity for degenerate bounds.
  *
  * @param left - Left boundary
  * @param right - Right boundary
  * @param bottom - Bottom boundary
  * @param top - Top boundary
  * @param out - Optional output matrix
  * @returns A Matrix3 representing the orthographic projection, or identity for degenerate bounds
  *
  * @example
  * ```typescript
  * const proj = Matrix3.orthoSafe(0, 800, 0, 600);   // normal projection
  * Matrix3.orthoSafe(5, 5, 0, 600);                   // identity (zero width)
  * ```
  *
  * @see {@link ortho} - Throws for degenerate bounds
  *
  * @category Factory
  * @since 0.7.0
  */
 public static orthoSafe(
  left: number,
  right: number,
  bottom: number,
  top: number,
  out?: Matrix3,
 ): Matrix3 {
  const width = right - left;
  const height = top - bottom;
  if (isNearZero(width) || isNearZero(height)) {
   return Matrix3.ensureOut(out).set(1, 0, 0, 0, 1, 0, 0, 0, 1);
  }
  const tx = -(right + left) / width;
  const ty = -(top + bottom) / height;
  return Matrix3.ensureOut(out).set(2 / width, 0, 0, 0, 2 / height, 0, tx, ty, 1);
 }

 /**
  * Creates a matrix from a flat numeric array.
  *
  * @param array - Numeric array with at least 9 elements
  * @param offset - Index of the first element. @defaultValue `0`
  * @param columnMajor - If true, reads column-major; if false, row-major. @defaultValue `true`
  * @param out - Optional output matrix
  * @returns A Matrix3 initialized from the array
  * @throws {RangeError} If offset is out of bounds
  *
  * @example
  * ```typescript
  * const m = Matrix3.fromArray([1, 0, 0, 0, 1, 0, 5, 10, 1]);
  * Matrix3.fromArray([1, 0, 0, 0, 1, 0, 5, 10, 1], 0, true, existing); // reuse allocation
  * ```
  *
  * @category Factory
  * @since 0.7.0
  */
 public static fromArray(
  array: ArrayLike<number>,
  offset = 0,
  columnMajor = true,
  out?: Matrix3,
 ): Matrix3 {
  if (offset < 0 || offset + Matrix3.ELEMENT_COUNT > array.length) {
   throw new RangeError(
    `Matrix3.fromArray: offset ${offset} out of bounds for array length ${array.length}`,
   );
  }

  const a0 = array[offset]!;
  const a1 = array[offset + 1]!;
  const a2 = array[offset + 2]!;
  const a3 = array[offset + 3]!;
  const a4 = array[offset + 4]!;
  const a5 = array[offset + 5]!;
  const a6 = array[offset + 6]!;
  const a7 = array[offset + 7]!;
  const a8 = array[offset + 8]!;

  if (columnMajor) {
   return Matrix3.ensureOut(out).set(a0, a1, a2, a3, a4, a5, a6, a7, a8);
  }

  return Matrix3.ensureOut(out).set(a0, a3, a6, a1, a4, a7, a2, a5, a8);
 }

 /* ======================================================================== */
 /* Static Arithmetic                                                        */
 /* ======================================================================== */

 /**
  * Component-wise addition `a + b`.
  *
  * @param a - First addend
  * @param b - Second addend
  * @param out - Optional output matrix
  * @returns Matrix with component-wise sums
  *
  * @category Arithmetic
  * @since 0.7.0
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
  * @param matrix - Source matrix
  * @param scalar - Scalar to add
  * @param out - Optional output matrix
  * @returns Matrix with scalar added to each element
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 public static addScalar(matrix: ReadonlyMatrix3Like, scalar: number, out?: Matrix3): Matrix3 {
  return Matrix3.ensureOut(out).set(
   matrix.m00 + scalar,
   matrix.m01 + scalar,
   matrix.m02 + scalar,
   matrix.m10 + scalar,
   matrix.m11 + scalar,
   matrix.m12 + scalar,
   matrix.m20 + scalar,
   matrix.m21 + scalar,
   matrix.m22 + scalar,
  );
 }

 /**
  * Component-wise subtraction `a - b`.
  *
  * @param a - Minuend
  * @param b - Subtrahend
  * @param out - Optional output matrix
  * @returns Matrix with component-wise differences
  *
  * @category Arithmetic
  * @since 0.7.0
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
  * @param matrix - Source matrix
  * @param scalar - Scalar to subtract
  * @param out - Optional output matrix
  * @returns Matrix with scalar subtracted from each element
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 public static subtractScalar(matrix: ReadonlyMatrix3Like, scalar: number, out?: Matrix3): Matrix3 {
  return Matrix3.ensureOut(out).set(
   matrix.m00 - scalar,
   matrix.m01 - scalar,
   matrix.m02 - scalar,
   matrix.m10 - scalar,
   matrix.m11 - scalar,
   matrix.m12 - scalar,
   matrix.m20 - scalar,
   matrix.m21 - scalar,
   matrix.m22 - scalar,
  );
 }

 /**
  * Fused multiply-add: `a * scalar + b`.
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
  a: ReadonlyMatrix3Like,
  scalar: number,
  b: ReadonlyMatrix3Like,
  out?: Matrix3,
 ): Matrix3 {
  return Matrix3.ensureOut(out).set(
   a.m00 * scalar + b.m00,
   a.m01 * scalar + b.m01,
   a.m02 * scalar + b.m02,
   a.m10 * scalar + b.m10,
   a.m11 * scalar + b.m11,
   a.m12 * scalar + b.m12,
   a.m20 * scalar + b.m20,
   a.m21 * scalar + b.m21,
   a.m22 * scalar + b.m22,
  );
 }

 /**
  * Matrix multiplication `a × b`.
  *
  * @param a - Left operand
  * @param b - Right operand
  * @param out - Optional output matrix
  * @returns Matrix product
  *
  * @example
  * ```typescript
  * const translate = Matrix3.fromTranslation({ x: 10, y: 20 });
  * const rotate = Matrix3.fromRotation(Math.PI / 4);
  * const combined = Matrix3.multiply(translate, rotate); // rotate then translate
  * ```
  *
  * @category Arithmetic
  * @since 0.7.0
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
  * Multiplies two matrices in reverse order: `left * right`.
  *
  * @remarks
  * Semantically identical to {@link multiply}(left, right). The value
  * of `premultiply` is in the instance method where it reverses the
  * multiplication order: `this.premultiply(other)` computes `other * this`.
  *
  * @param left - Left matrix (applied second)
  * @param right - Right matrix (applied first)
  * @param out - Optional output matrix
  * @returns `left * right`
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 public static premultiply(
  left: ReadonlyMatrix3Like,
  right: ReadonlyMatrix3Like,
  out?: Matrix3,
 ): Matrix3 {
  return Matrix3.multiply(left, right, out);
 }

 /**
  * Multiplies all matrix elements by a scalar.
  *
  * @param matrix - Source matrix
  * @param scalar - Scalar multiplier
  * @param out - Optional output matrix
  * @returns Matrix with all elements multiplied by scalar
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 public static multiplyScalar(matrix: ReadonlyMatrix3Like, scalar: number, out?: Matrix3): Matrix3 {
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
  * Divides all elements by a scalar (strict).
  *
  * @remarks
  * For safe division that returns zeros, use {@link divideScalarSafe}.
  * For hot paths, use {@link divideScalarUnchecked}.
  *
  * @param matrix - Source matrix
  * @param scalar - Divisor
  * @param out - Optional output matrix
  * @returns Matrix with each element divided by scalar
  * @throws {RangeError} If scalar is near zero
  *
  * @example
  * ```typescript
  * Matrix3.divideScalar(Matrix3.fromValues(4, 8, 12, 2, 6, 10, 14, 16, 18), 2); // each element halved
  * Matrix3.divideScalar(Matrix3.IDENTITY, 0); // throws RangeError
  * ```
  *
  * @see {@link divideScalarSafe} - Returns fallback for zero divisor
  * @see {@link divideScalarUnchecked} - No validation
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 public static divideScalar(matrix: ReadonlyMatrix3Like, scalar: number, out?: Matrix3): Matrix3 {
  if (isNearZero(scalar)) {
   throw new RangeError('Matrix3.divideScalar: cannot divide by zero or near-zero scalar');
  }
  const inv = 1 / scalar;
  return Matrix3.multiplyScalar(matrix, inv, out);
 }

 /**
  * Divides all elements by a scalar (safe).
  *
  * @param matrix - Source matrix
  * @param scalar - Divisor
  * @param out - Optional output matrix
  * @returns Matrix with each element divided by scalar, or zero matrix if scalar is near zero
  *
  * @example
  * ```typescript
  * Matrix3.divideScalarSafe(Matrix3.fromValues(4, 8, 12, 2, 6, 10, 14, 16, 18), 2); // each element halved
  * Matrix3.divideScalarSafe(Matrix3.IDENTITY, 0); // zero matrix (fallback)
  * ```
  *
  * @see {@link divideScalar} - Throws for zero divisor
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 public static divideScalarSafe(
  matrix: ReadonlyMatrix3Like,
  scalar: number,
  out?: Matrix3,
 ): Matrix3 {
  if (isNearZero(scalar)) {
   return Matrix3.ensureOut(out).set(0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
  const inv = 1 / scalar;
  return Matrix3.multiplyScalar(matrix, inv, out);
 }

 /**
  * Divides all elements by a scalar (unchecked for hot paths).
  *
  * @remarks
  * **Precondition:** Scalar must be non-zero.
  *
  * @param matrix - Source matrix
  * @param scalar - Divisor (must be non-zero)
  * @param out - Optional output matrix
  * @returns Matrix with each element divided by scalar
  *
  * @see {@link divideScalar} - Throws on zero divisor
  * @see {@link divideScalarSafe} - Returns fallback on zero divisor
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 public static divideScalarUnchecked(
  matrix: ReadonlyMatrix3Like,
  scalar: number,
  out?: Matrix3,
 ): Matrix3 {
  const inv = 1 / scalar;
  return Matrix3.multiplyScalar(matrix, inv, out);
 }

 /**
  * Computes element-wise modulo of two matrices.
  *
  * @param a - Dividend matrix
  * @param b - Divisor matrix
  * @param out - Optional output matrix
  * @returns Result matrix with element-wise modulo
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 public static mod(a: ReadonlyMatrix3Like, b: ReadonlyMatrix3Like, out?: Matrix3): Matrix3 {
  return Matrix3.ensureOut(out).set(
   scalarModule(a.m00, b.m00),
   scalarModule(a.m01, b.m01),
   scalarModule(a.m02, b.m02),
   scalarModule(a.m10, b.m10),
   scalarModule(a.m11, b.m11),
   scalarModule(a.m12, b.m12),
   scalarModule(a.m20, b.m20),
   scalarModule(a.m21, b.m21),
   scalarModule(a.m22, b.m22),
  );
 }

 /**
  * Computes scalar modulo on all matrix components.
  *
  * @param matrix - Dividend matrix
  * @param scalar - Scalar divisor
  * @param out - Optional output matrix
  * @returns Result matrix with each element modulo scalar
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 public static modScalar(matrix: ReadonlyMatrix3Like, scalar: number, out?: Matrix3): Matrix3 {
  return Matrix3.ensureOut(out).set(
   scalarModule(matrix.m00, scalar),
   scalarModule(matrix.m01, scalar),
   scalarModule(matrix.m02, scalar),
   scalarModule(matrix.m10, scalar),
   scalarModule(matrix.m11, scalar),
   scalarModule(matrix.m12, scalar),
   scalarModule(matrix.m20, scalar),
   scalarModule(matrix.m21, scalar),
   scalarModule(matrix.m22, scalar),
  );
 }

 /**
  * Negates all elements.
  *
  * @param matrix - Source matrix
  * @param out - Optional output matrix
  * @returns Negated matrix
  *
  * @category Arithmetic
  * @since 0.7.0
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
 /* Static Transforms                                                        */
 /* ======================================================================== */

 /**
  * Applies Math.floor to all elements.
  *
  * @param matrix - Source matrix
  * @param out - Optional output matrix
  * @returns Floored matrix
  *
  * @category Transform
  * @since 0.7.0
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
  * @param matrix - Source matrix
  * @param out - Optional output matrix
  * @returns Ceiled matrix
  *
  * @category Transform
  * @since 0.7.0
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
  * @param matrix - Source matrix
  * @param out - Optional output matrix
  * @returns Rounded matrix
  *
  * @category Transform
  * @since 0.7.0
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
  * Applies Math.trunc to all elements (rounds towards zero).
  *
  * @param matrix - Source matrix
  * @param out - Optional output matrix
  * @returns Truncated matrix
  *
  * @category Transform
  * @since 0.7.0
  */
 public static trunc(matrix: ReadonlyMatrix3Like, out?: Matrix3): Matrix3 {
  return Matrix3.ensureOut(out).set(
   Math.trunc(matrix.m00),
   Math.trunc(matrix.m01),
   Math.trunc(matrix.m02),
   Math.trunc(matrix.m10),
   Math.trunc(matrix.m11),
   Math.trunc(matrix.m12),
   Math.trunc(matrix.m20),
   Math.trunc(matrix.m21),
   Math.trunc(matrix.m22),
  );
 }

 /**
  * Applies absolute value to all elements.
  *
  * @param matrix - Source matrix
  * @param out - Optional output matrix
  * @returns Absolute-valued matrix
  *
  * @category Transform
  * @since 0.7.0
  */
 public static abs(matrix: ReadonlyMatrix3Like, out?: Matrix3): Matrix3 {
  return Matrix3.ensureOut(out).set(
   Math.abs(matrix.m00),
   Math.abs(matrix.m01),
   Math.abs(matrix.m02),
   Math.abs(matrix.m10),
   Math.abs(matrix.m11),
   Math.abs(matrix.m12),
   Math.abs(matrix.m20),
   Math.abs(matrix.m21),
   Math.abs(matrix.m22),
  );
 }

 /**
  * Applies sign function to all elements.
  *
  * @param matrix - Source matrix
  * @param out - Optional output matrix
  * @returns Matrix with signs (-1, 0, or 1)
  *
  * @category Transform
  * @since 0.7.0
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
  * @param a - First matrix
  * @param b - Second matrix
  * @param out - Optional output matrix
  * @returns Matrix with component-wise minima
  *
  * @category Transform
  * @since 0.7.0
  */
 public static min(a: ReadonlyMatrix3Like, b: ReadonlyMatrix3Like, out?: Matrix3): Matrix3 {
  return Matrix3.ensureOut(out).set(
   Math.min(a.m00, b.m00),
   Math.min(a.m01, b.m01),
   Math.min(a.m02, b.m02),
   Math.min(a.m10, b.m10),
   Math.min(a.m11, b.m11),
   Math.min(a.m12, b.m12),
   Math.min(a.m20, b.m20),
   Math.min(a.m21, b.m21),
   Math.min(a.m22, b.m22),
  );
 }

 /**
  * Component-wise maximum of two matrices.
  *
  * @param a - First matrix
  * @param b - Second matrix
  * @param out - Optional output matrix
  * @returns Matrix with component-wise maxima
  *
  * @category Transform
  * @since 0.7.0
  */
 public static max(a: ReadonlyMatrix3Like, b: ReadonlyMatrix3Like, out?: Matrix3): Matrix3 {
  return Matrix3.ensureOut(out).set(
   Math.max(a.m00, b.m00),
   Math.max(a.m01, b.m01),
   Math.max(a.m02, b.m02),
   Math.max(a.m10, b.m10),
   Math.max(a.m11, b.m11),
   Math.max(a.m12, b.m12),
   Math.max(a.m20, b.m20),
   Math.max(a.m21, b.m21),
   Math.max(a.m22, b.m22),
  );
 }

 /**
  * Component-wise clamp between two matrices.
  *
  * @param m - Matrix to clamp
  * @param minM - Per-component minima
  * @param maxM - Per-component maxima
  * @param out - Optional output matrix
  * @returns Clamped matrix
  *
  * @category Transform
  * @since 0.7.0
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
  * @param m - Matrix to clamp
  * @param min - Minimum scalar
  * @param max - Maximum scalar
  * @param out - Optional output matrix
  * @returns Clamped matrix
  *
  * @category Transform
  * @since 0.7.0
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
  * Linear interpolation between two matrices (unclamped).
  *
  * @remarks
  * The interpolation factor `t` is NOT clamped — values outside [0, 1] will
  * extrapolate beyond the input matrices. Use {@link lerpClamped} to clamp.
  * Component-wise lerp between rotation matrices does not produce a valid
  * rotation matrix. For affine transforms, consider decomposing into
  * translation/rotation/scale and interpolating each independently.
  *
  * @param a - Start matrix
  * @param b - End matrix
  * @param t - Interpolation factor (unclamped, allows extrapolation)
  * @param out - Optional output matrix
  * @returns Interpolated matrix
  *
  * @category Interpolation
  * @since 0.7.0
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
  * Clamped linear interpolation.
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
  * @param a - Start matrix
  * @param b - End matrix
  * @param t - Interpolation factor
  * @param out - Optional output matrix
  * @returns Smoothly interpolated matrix
  *
  * @category Interpolation
  * @since 0.7.0
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
 /* Static Comparison                                                        */
 /* ======================================================================== */

 /**
  * Tests for exact equality with the zero matrix.
  *
  * @param matrix - Matrix to test
  * @returns True if all elements are exactly zero
  *
  * @category Comparison
  * @since 0.7.0
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
  * @param matrix - Matrix to test
  * @param epsilon - Tolerance. @defaultValue `EPSILON`
  * @returns True if all elements are within epsilon of zero
  *
  * @category Comparison
  * @since 0.7.0
  */
 public static isNearZero(matrix: ReadonlyMatrix3Like, epsilon: number = EPSILON): boolean {
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
  * Exact component-wise equality (bit-identical).
  *
  * @remarks
  * Use {@link nearEquals} for comparing results of floating-point operations.
  *
  * @param a - First matrix
  * @param b - Second matrix
  * @returns True if all components are exactly identical
  *
  * @category Comparison
  * @since 0.7.0
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
  * @since 0.7.0
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
  * @param matrix - Matrix to test
  * @returns True if all elements are finite
  *
  * @category Comparison
  * @since 0.7.0
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
  * @param matrix - Matrix to test
  * @returns True if any element is NaN
  *
  * @category Comparison
  * @since 0.7.0
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
  * Tests if any element is infinite (±Infinity).
  *
  * @remarks
  * Distinguishes infinity from NaN. Use {@link isFinite} to check for both.
  *
  * @param matrix - Matrix to test
  * @returns True if any element is ±Infinity
  *
  * @category Comparison
  * @since 0.7.0
  */
 public static hasInfinity(matrix: ReadonlyMatrix3Like): boolean {
  const isInf = (v: number) => !Number.isFinite(v) && !Number.isNaN(v);
  return (
   isInf(matrix.m00) ||
   isInf(matrix.m01) ||
   isInf(matrix.m02) ||
   isInf(matrix.m10) ||
   isInf(matrix.m11) ||
   isInf(matrix.m12) ||
   isInf(matrix.m20) ||
   isInf(matrix.m21) ||
   isInf(matrix.m22)
  );
 }

 /**
  * Tests if matrix is identity.
  *
  * @param matrix - Matrix to test
  * @param epsilon - Tolerance. @defaultValue `EPSILON`
  * @returns True if matrix is identity
  *
  * @category Comparison
  * @since 0.7.0
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
  * Tests if matrix is invertible (determinant ≠ 0).
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
  * @since 0.7.0
  */
 public static isInvertible(matrix: ReadonlyMatrix3Like, epsilon: number = EPSILON): boolean {
  return !isNearZero(Matrix3.determinant(matrix), epsilon);
 }

 /**
  * Tests if matrix is symmetric (M = M^T).
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
  * @param matrix - Matrix to test
  * @param epsilon - Tolerance. @defaultValue `EPSILON`
  * @returns True if off-diagonal elements are near zero
  *
  * @category Comparison
  * @since 0.7.0
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
  * @remarks
  * Checks full 3×3 orthogonality: all three columns must be unit length and
  * mutually perpendicular (dot products near zero). Affine matrices with
  * non-zero translation in the third column will fail this check. For affine
  * use cases, check the upper-left 2×2 linear part directly via
  * {@link Matrix2.isOrthogonal}.
  *
  * Uses {@link EPSILON} (1e-10) as default tolerance.
  *
  * @param matrix - Matrix to test
  * @param epsilon - Tolerance. @defaultValue `EPSILON`
  * @returns True if matrix is orthogonal
  *
  * @category Comparison
  * @since 0.7.0
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
  * @param matrix - Source matrix
  * @param out - Optional output matrix
  * @returns Transposed matrix
  *
  * @category Matrix Operations
  * @since 0.7.0
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
  * @param matrix - Matrix to calculate determinant of
  * @returns Determinant value
  *
  * @category Computed
  * @since 0.7.0
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
  * @param matrix - Matrix to calculate trace of
  * @returns Trace value
  *
  * @category Computed
  * @since 0.7.0
  */
 public static trace(matrix: ReadonlyMatrix3Like): number {
  return matrix.m00 + matrix.m11 + matrix.m22;
 }

 /**
  * Calculates the Frobenius norm.
  *
  * @param matrix - Matrix to calculate norm of
  * @returns Frobenius norm √(Σ|mᵢⱼ|²)
  *
  * @category Computed
  * @since 0.7.0
  */
 public static frobeniusNorm(matrix: ReadonlyMatrix3Like): number {
  return Math.sqrt(
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
  * Extracts translation from a matrix.
  * @param matrix - Source matrix
  * @param out - Optional output vector
  * @returns Translation vector (m20, m21)
  *
  * @example
  * ```typescript
  * const m = Matrix3.fromTranslation(new Vector2(10, 20));
  * Matrix3.getTranslation(m);      // Vector2(10, 20)
  * Matrix3.getTranslation(m, out); // writes to out
  * ```
  *
  * @category Computed
  * @since 0.7.0
  */
 public static getTranslation(matrix: ReadonlyMatrix3Like, out?: Vector2): Vector2 {
  return Vector2.fromValues(matrix.m20, matrix.m21, out);
 }

 /**
  * Extracts scale factors from a matrix (always positive).
  *
  * @remarks
  * Returns the length of each column vector. Values are always non-negative
  * since `hypot` computes magnitudes. This does NOT account for determinant
  * sign (reflection). Use {@link Matrix3.decompose} for signed scale.
  *
  * @param matrix - Source matrix
  * @param out - Optional output vector
  * @returns Scale factors for each axis (always ≥ 0)
  *
  * @example
  * ```typescript
  * const m = Matrix3.fromScaling(new Vector2(2, 3));
  * Matrix3.getScale(m);      // Vector2(2, 3)
  * Matrix3.getScale(m, out); // writes to out
  * ```
  *
  * @category Computed
  * @since 0.7.0
  */
 public static getScale(matrix: ReadonlyMatrix3Like, out?: Vector2): Vector2 {
  const sx = hypot(matrix.m00, matrix.m01);
  const sy = hypot(matrix.m10, matrix.m11);
  return Vector2.fromValues(sx, sy, out);
 }

 /**
  * Extracts rotation angle from a matrix.
  *
  * @remarks
  * Computes the angle from the first column vector after normalization.
  * Returns 0 for matrices with near-zero scale (degenerate rotation).
  *
  * @param matrix - Source matrix
  * @returns Rotation angle in radians
  *
  * @example
  * ```typescript
  * const m = Matrix3.fromRotation(Math.PI / 4);
  * Matrix3.getRotation(m); // ≈ PI/4
  * ```
  *
  * @category Computed
  * @since 0.7.0
  */
 public static getRotation(matrix: ReadonlyMatrix3Like): number {
  const scaleX = hypot(matrix.m00, matrix.m01);
  if (isNearZero(scaleX)) {
   return 0;
  }
  return atan2(matrix.m01 / scaleX, matrix.m00 / scaleX);
 }

 /**
  * Calculates the adjugate (adjoint) matrix.
  *
  * @param matrix - Source matrix
  * @param out - Optional output matrix
  * @returns Adjugate matrix (transpose of cofactor matrix)
  *
  * @category Matrix Operations
  * @since 0.7.0
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
  * @param matrix - Matrix to invert
  * @param out - Optional output matrix
  * @returns Inverted matrix
  * @throws {Error} If matrix is singular
  *
  * @example
  * ```typescript
  * Matrix3.inverse(Matrix3.fromRotation(Math.PI / 4)); // rotated back by -PI/4
  * Matrix3.inverse(Matrix3.fromValues(0, 0, 0, 0, 0, 0, 0, 0, 0)); // throws RangeError (singular)
  * ```
  *
  * @see {@link inverseSafe} - Returns fallback for singular matrix
  * @see {@link inverseUnchecked} - No validation
  *
  * @category Matrix Operations
  * @since 0.7.0
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
  * @param matrix - Matrix to invert
  * @param out - Optional output matrix
  * @returns Inverted matrix or identity if singular
  *
  * @example
  * ```typescript
  * Matrix3.inverseSafe(Matrix3.fromRotation(Math.PI / 4)); // rotated back by -PI/4
  * Matrix3.inverseSafe(Matrix3.fromValues(0, 0, 0, 0, 0, 0, 0, 0, 0)); // identity (fallback)
  * ```
  *
  * @see {@link inverse} - Throws for singular matrix
  *
  * @category Matrix Operations
  * @since 0.7.0
  */
 public static inverseSafe(matrix: ReadonlyMatrix3Like, out?: Matrix3): Matrix3 {
  const c00 = matrix.m11 * matrix.m22 - matrix.m12 * matrix.m21;
  const c01 = -(matrix.m01 * matrix.m22 - matrix.m02 * matrix.m21);
  const c02 = matrix.m01 * matrix.m12 - matrix.m02 * matrix.m11;

  const det = matrix.m00 * c00 + matrix.m10 * c01 + matrix.m20 * c02;
  if (isNearZero(det)) {
   return Matrix3.ensureOut(out).identity();
  }

  const c10 = -(matrix.m10 * matrix.m22 - matrix.m12 * matrix.m20);
  const c11 = matrix.m00 * matrix.m22 - matrix.m02 * matrix.m20;
  const c12 = -(matrix.m00 * matrix.m12 - matrix.m02 * matrix.m10);

  const c20 = matrix.m10 * matrix.m21 - matrix.m11 * matrix.m20;
  const c21 = -(matrix.m00 * matrix.m21 - matrix.m01 * matrix.m20);
  const c22 = matrix.m00 * matrix.m11 - matrix.m01 * matrix.m10;

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
  * Unchecked inverse for hot paths. Assumes matrix is invertible.
  *
  * @remarks
  * **Precondition:** Matrix must be invertible (non-singular).
  * Calling with singular matrix produces Infinity/NaN elements.
  *
  * @param matrix - Matrix to invert
  * @param out - Optional output matrix
  * @returns Inverted matrix
  *
  * @see {@link inverse} - Throws on singular matrix
  * @see {@link inverseSafe} - Returns fallback on singular matrix
  *
  * @category Matrix Operations
  * @since 0.7.0
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
  * Optimized inverse for affine matrices (bottom row is [0, 0, 1]).
  *
  * @remarks
  * Exploits the affine structure to compute the inverse using only the upper-left
  * 2x2 block and translation, avoiding the full 3x3 cofactor expansion.
  * Throws if the matrix is not affine or if the 2x2 determinant is near zero.
  *
  * @param matrix - Affine matrix to invert
  * @param out - Optional output matrix
  * @returns Inverted affine matrix
  * @throws {RangeError} If matrix is not affine or is singular
  *
  * @example
  * ```typescript
  * const m = Matrix3.fromTransform2({ x: 10, y: 20 }, Math.PI / 4, 2);
  * const inv = Matrix3.inverseAffine(m); // efficient affine inverse
  * ```
  *
  * @see {@link inverseAffineSafe} - Returns identity if not affine or singular
  * @see {@link inverseAffineUnchecked} - No validation
  *
  * @category Matrix Operations
  * @since 0.7.0
  */
 public static inverseAffine(matrix: ReadonlyMatrix3Like, out?: Matrix3): Matrix3 {
  if (!Matrix3.isAffine(matrix)) {
   throw new RangeError('Matrix3.inverseAffine: matrix is not affine');
  }

  const a = matrix.m00;
  const b = matrix.m10;
  const c = matrix.m01;
  const d = matrix.m11;
  const tx = matrix.m20;
  const ty = matrix.m21;

  const det = a * d - b * c;
  if (isNearZero(det)) {
   throw new RangeError('Matrix3.inverseAffine: matrix is singular');
  }

  const invDet = 1 / det;
  return Matrix3.ensureOut(out).set(
   d * invDet,
   -c * invDet,
   0,
   -b * invDet,
   a * invDet,
   0,
   (b * ty - d * tx) * invDet,
   (c * tx - a * ty) * invDet,
   1,
  );
 }

 /**
  * Safe optimized inverse for affine matrices.
  *
  * @remarks
  * Returns identity if the matrix is not affine or if the 2x2 determinant is
  * near zero (singular).
  *
  * @param matrix - Affine matrix to invert
  * @param out - Optional output matrix
  * @returns Inverted affine matrix or identity if not affine/singular
  *
  * @example
  * ```typescript
  * Matrix3.inverseAffineSafe(affineMatrix);  // efficient affine inverse
  * Matrix3.inverseAffineSafe(singularMatrix); // identity (fallback)
  * ```
  *
  * @see {@link inverseAffine} - Throws on non-affine or singular
  *
  * @category Matrix Operations
  * @since 0.7.0
  */
 public static inverseAffineSafe(matrix: ReadonlyMatrix3Like, out?: Matrix3): Matrix3 {
  if (!Matrix3.isAffine(matrix)) {
   return Matrix3.ensureOut(out).identity();
  }

  const a = matrix.m00;
  const b = matrix.m10;
  const c = matrix.m01;
  const d = matrix.m11;
  const tx = matrix.m20;
  const ty = matrix.m21;

  const det = a * d - b * c;
  if (isNearZero(det)) {
   return Matrix3.ensureOut(out).identity();
  }

  const invDet = 1 / det;
  return Matrix3.ensureOut(out).set(
   d * invDet,
   -c * invDet,
   0,
   -b * invDet,
   a * invDet,
   0,
   (b * ty - d * tx) * invDet,
   (c * tx - a * ty) * invDet,
   1,
  );
 }

 /**
  * Unchecked optimized inverse for affine matrices.
  *
  * @remarks
  * **Precondition:** Matrix must be affine and invertible. No validation is performed.
  * Calling with a non-affine or singular matrix produces incorrect results.
  *
  * @param matrix - Affine matrix to invert
  * @param out - Optional output matrix
  * @returns Inverted affine matrix
  *
  * @see {@link inverseAffine} - Throws on non-affine or singular
  * @see {@link inverseAffineSafe} - Returns fallback on non-affine or singular
  *
  * @category Matrix Operations
  * @since 0.7.0
  */
 public static inverseAffineUnchecked(matrix: ReadonlyMatrix3Like, out?: Matrix3): Matrix3 {
  const a = matrix.m00;
  const b = matrix.m10;
  const c = matrix.m01;
  const d = matrix.m11;
  const tx = matrix.m20;
  const ty = matrix.m21;

  const det = a * d - b * c;
  const invDet = 1 / det;
  return Matrix3.ensureOut(out).set(
   d * invDet,
   -c * invDet,
   0,
   -b * invDet,
   a * invDet,
   0,
   (b * ty - d * tx) * invDet,
   (c * tx - a * ty) * invDet,
   1,
  );
 }

 /**
  * Solve the linear system Ax = b using Cramer's rule
  *
  * @remarks
  * Uses {@link isNearZero} with default {@link EPSILON} (1e-10) to test the
  * determinant. Throws when |det| ≤ EPSILON.
  *
  * @param matrix - Coefficient matrix A
  * @param b - Right-hand side vector as [b0, b1, b2]
  * @returns Solution tuple [x0, x1, x2]
  * @throws {RangeError} If matrix is singular (determinant near zero)
  *
  * @example
  * ```typescript
  * // Solve [2 0 0; 0 3 0; 0 0 4] * x = [6, 9, 8]
  * const A = new Matrix3(2, 0, 0, 0, 3, 0, 0, 0, 4);
  * const x = Matrix3.solveLinearSystem(A, [6, 9, 8]); // → [3, 3, 2]
  * ```
  *
  * @see {@link solveLinearSystemSafe} - Returns [0, 0, 0] instead of throwing
  * @see {@link solveLinearSystemUnchecked} - No validation, for hot paths
  *
  * @category Matrix Operations
  * @since 0.7.0
  */
 public static solveLinearSystem(
  matrix: ReadonlyMatrix3Like,
  b: readonly [number, number, number],
 ): [number, number, number] {
  const det =
   matrix.m00 * (matrix.m11 * matrix.m22 - matrix.m12 * matrix.m21) -
   matrix.m10 * (matrix.m01 * matrix.m22 - matrix.m02 * matrix.m21) +
   matrix.m20 * (matrix.m01 * matrix.m12 - matrix.m02 * matrix.m11);
  if (isNearZero(det)) {
   throw new RangeError('Matrix3.solveLinearSystem: singular matrix (determinant near zero)');
  }
  const invDet = 1 / det;
  return [
   (b[0] * (matrix.m11 * matrix.m22 - matrix.m12 * matrix.m21) -
    matrix.m10 * (b[1] * matrix.m22 - b[2] * matrix.m21) +
    matrix.m20 * (b[1] * matrix.m12 - b[2] * matrix.m11)) *
    invDet,
   (matrix.m00 * (b[1] * matrix.m22 - b[2] * matrix.m21) -
    b[0] * (matrix.m01 * matrix.m22 - matrix.m02 * matrix.m21) +
    matrix.m20 * (matrix.m01 * b[2] - matrix.m02 * b[1])) *
    invDet,
   (matrix.m00 * (matrix.m11 * b[2] - matrix.m12 * b[1]) -
    matrix.m10 * (matrix.m01 * b[2] - matrix.m02 * b[1]) +
    b[0] * (matrix.m01 * matrix.m12 - matrix.m02 * matrix.m11)) *
    invDet,
  ];
 }

 /**
  * Safe linear system solve. Returns [0, 0, 0] if matrix is singular
  *
  * @remarks
  * Uses {@link isNearZero} with default {@link EPSILON} (1e-10) to test the
  * determinant. Returns the zero tuple when |det| ≤ EPSILON.
  *
  * @param matrix - Coefficient matrix A
  * @param b - Right-hand side vector as [b0, b1, b2]
  * @returns Solution tuple, or [0, 0, 0] if singular
  *
  * @see {@link solveLinearSystem} - Throws for singular matrices
  * @see {@link solveLinearSystemUnchecked} - No validation, for hot paths
  *
  * @category Matrix Operations
  * @since 0.7.0
  */
 public static solveLinearSystemSafe(
  matrix: ReadonlyMatrix3Like,
  b: readonly [number, number, number],
 ): [number, number, number] {
  const det =
   matrix.m00 * (matrix.m11 * matrix.m22 - matrix.m12 * matrix.m21) -
   matrix.m10 * (matrix.m01 * matrix.m22 - matrix.m02 * matrix.m21) +
   matrix.m20 * (matrix.m01 * matrix.m12 - matrix.m02 * matrix.m11);
  if (isNearZero(det)) {
   return [0, 0, 0];
  }
  const invDet = 1 / det;
  return [
   (b[0] * (matrix.m11 * matrix.m22 - matrix.m12 * matrix.m21) -
    matrix.m10 * (b[1] * matrix.m22 - b[2] * matrix.m21) +
    matrix.m20 * (b[1] * matrix.m12 - b[2] * matrix.m11)) *
    invDet,
   (matrix.m00 * (b[1] * matrix.m22 - b[2] * matrix.m21) -
    b[0] * (matrix.m01 * matrix.m22 - matrix.m02 * matrix.m21) +
    matrix.m20 * (matrix.m01 * b[2] - matrix.m02 * b[1])) *
    invDet,
   (matrix.m00 * (matrix.m11 * b[2] - matrix.m12 * b[1]) -
    matrix.m10 * (matrix.m01 * b[2] - matrix.m02 * b[1]) +
    b[0] * (matrix.m01 * matrix.m12 - matrix.m02 * matrix.m11)) *
    invDet,
  ];
 }

 /**
  * Unchecked linear system solve for hot paths
  *
  * @remarks
  * **Precondition:** Matrix must be non-singular (det ≠ 0).
  * Calling with a singular matrix produces NaN/Infinity components.
  *
  * @param matrix - Coefficient matrix A (must be non-singular)
  * @param b - Right-hand side vector as [b0, b1, b2]
  * @returns Solution tuple [x0, x1, x2]
  *
  * @see {@link solveLinearSystem} - Throws on singular matrices
  * @see {@link solveLinearSystemSafe} - Returns fallback on singular matrices
  *
  * @category Matrix Operations
  * @since 0.7.0
  */
 public static solveLinearSystemUnchecked(
  matrix: ReadonlyMatrix3Like,
  b: readonly [number, number, number],
 ): [number, number, number] {
  const invDet =
   1 /
   (matrix.m00 * (matrix.m11 * matrix.m22 - matrix.m12 * matrix.m21) -
    matrix.m10 * (matrix.m01 * matrix.m22 - matrix.m02 * matrix.m21) +
    matrix.m20 * (matrix.m01 * matrix.m12 - matrix.m02 * matrix.m11));
  return [
   (b[0] * (matrix.m11 * matrix.m22 - matrix.m12 * matrix.m21) -
    matrix.m10 * (b[1] * matrix.m22 - b[2] * matrix.m21) +
    matrix.m20 * (b[1] * matrix.m12 - b[2] * matrix.m11)) *
    invDet,
   (matrix.m00 * (b[1] * matrix.m22 - b[2] * matrix.m21) -
    b[0] * (matrix.m01 * matrix.m22 - matrix.m02 * matrix.m21) +
    matrix.m20 * (matrix.m01 * b[2] - matrix.m02 * b[1])) *
    invDet,
   (matrix.m00 * (matrix.m11 * b[2] - matrix.m12 * b[1]) -
    matrix.m10 * (matrix.m01 * b[2] - matrix.m02 * b[1]) +
    b[0] * (matrix.m01 * matrix.m12 - matrix.m02 * matrix.m11)) *
    invDet,
  ];
 }

 /**
  * Transforms a point by the matrix (applies translation).
  *
  * @param matrix - Transform matrix
  * @param point - Point to transform
  * @param out - Optional output vector
  * @returns Transformed point
  *
  * @category Transform
  * @since 0.7.0
  */
 public static transformPoint(
  matrix: ReadonlyMatrix3Like,
  point: ReadonlyVector2Like,
  out?: Vector2,
 ): Vector2 {
  const { x, y } = point;
  const w = matrix.m02 * x + matrix.m12 * y + matrix.m22;
  if (scalarNearEquals(w, 1)) {
   return Vector2.fromValues(
    matrix.m00 * x + matrix.m10 * y + matrix.m20,
    matrix.m01 * x + matrix.m11 * y + matrix.m21,
    out,
   );
  }
  const invW = divideSafe(1, w);
  return Vector2.fromValues(
   (matrix.m00 * x + matrix.m10 * y + matrix.m20) * invW,
   (matrix.m01 * x + matrix.m11 * y + matrix.m21) * invW,
   out,
  );
 }

 /**
  * Transforms a vector by the matrix (ignores translation).
  *
  * @param matrix - Transform matrix
  * @param vector - Vector to transform
  * @param out - Optional output vector
  * @returns Transformed vector
  *
  * @category Transform
  * @since 0.7.0
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
  * @remarks
  * **Numerical Stability:** For matrices with extremely small scale components
  * (magnitude < 1e-10), the rotation extraction may be imprecise. If scale
  * approaches zero, rotation defaults to 0 radians. For matrices with scale
  * components smaller than ~1e-154, underflow may occur in intermediate
  * calculations due to IEEE 754 double precision limits.
  *
  * @param matrix - Matrix to decompose
  * @returns Object with translation, rotation (radians), and scale
  *
  * @category Matrix Operations
  * @since 0.7.0
  */
 public static decompose(matrix: ReadonlyMatrix3Like): {
  translation: Vector2;
  rotation: number;
  scale: Vector2;
 } {
  const translation = new Vector2(matrix.m20, matrix.m21);

  const sx = hypot(matrix.m00, matrix.m01);
  const sy = hypot(matrix.m10, matrix.m11);

  const det = matrix.m00 * matrix.m11 - matrix.m01 * matrix.m10;
  const signY = det < 0 ? -1 : 1;

  const rotation = isNearZero(sx) ? 0 : atan2(matrix.m01, matrix.m00);

  return {
   translation,
   rotation,
   scale: new Vector2(sx, sy * signY),
  };
 }

 /**
  * Transforms multiple points by a matrix (batch operation).
  *
  * @param matrix - Transformation matrix
  * @param points - Array of points to transform
  * @param out - Optional output array (will be filled/extended as needed)
  * @returns Array of transformed points
  *
  * @category Matrix Operations
  * @since 0.7.0
  */
 public static transformPoints(
  matrix: ReadonlyMatrix3Like,
  points: readonly ReadonlyVector2Like[],
  out: Vector2[] = [],
 ): Vector2[] {
  for (let index = 0; index < points.length; index++) {
   out[index] = Matrix3.transformPoint(matrix, points[index]!, out[index]);
  }
  return out;
 }

 /**
  * Transforms multiple vectors by a matrix (batch operation).
  *
  * @remarks
  * Unlike points, vectors are not affected by translation.
  *
  * @param matrix - Transformation matrix
  * @param vectors - Array of vectors to transform
  * @param out - Optional output array (will be filled/extended as needed)
  * @returns Array of transformed vectors
  *
  * @category Matrix Operations
  * @since 0.7.0
  */
 public static transformVectors(
  matrix: ReadonlyMatrix3Like,
  vectors: readonly ReadonlyVector2Like[],
  out: Vector2[] = [],
 ): Vector2[] {
  for (let index = 0; index < vectors.length; index++) {
   out[index] = Matrix3.transformVector(matrix, vectors[index]!, out[index]);
  }
  return out;
 }

 /**
  * Tests if a matrix is affine (bottom row is [0, 0, 1]).
  *
  * @param matrix - Matrix to test
  * @param epsilon - Tolerance. @defaultValue `EPSILON`
  * @returns True if matrix is affine
  *
  * @category Comparison
  * @since 0.7.0
  */
 public static isAffine(matrix: ReadonlyMatrix3Like, epsilon: number = EPSILON): boolean {
  return (
   isNearZero(matrix.m02, epsilon) &&
   isNearZero(matrix.m12, epsilon) &&
   scalarNearEquals(matrix.m22, 1, epsilon)
  );
 }

 /**
  * Applies a translation to a matrix.
  *
  * @remarks
  * Equivalent to `Matrix3.multiply(matrix, Matrix3.fromTranslation(translation), out)`
  * but more efficient as it avoids creating an intermediate matrix.
  *
  * @param matrix - Matrix to translate
  * @param translation - Translation vector
  * @param out - Optional output matrix
  * @returns Translated matrix
  *
  * @example
  * ```typescript
  * const m = Matrix3.fromRotation(Math.PI / 4);
  * const translated = Matrix3.translate(m, { x: 100, y: 50 });
  * ```
  *
  * @category Transform
  * @since 0.7.0
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
  * @remarks
  * Equivalent to `Matrix3.multiply(matrix, Matrix3.fromRotation(angle), out)`
  * but more efficient as it avoids creating an intermediate matrix.
  *
  * @param matrix - Matrix to rotate
  * @param angle - Rotation angle in radians
  * @param out - Optional output matrix
  * @returns Rotated matrix
  *
  * @example
  * ```typescript
  * const m = Matrix3.fromTranslation({ x: 100, y: 50 });
  * const rotated = Matrix3.rotate(m, Math.PI / 4);
  * ```
  *
  * @category Transform
  * @since 0.7.0
  */
 public static rotate(matrix: ReadonlyMatrix3Like, angle: number, out?: Matrix3): Matrix3 {
  const { cos, sin } = sinCos(angle);
  return Matrix3.rotateCS(matrix, cos, sin, out);
 }

 /**
  * Rotates a matrix using precomputed cosine and sine values.
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
  * const m1 = Matrix3.fromTranslation({ x: 100, y: 50 });
  * const m2 = Matrix3.fromTranslation({ x: 200, y: 100 });
  * // Apply same rotation to both matrices efficiently
  * const r1 = Matrix3.rotateCS(m1, rotation.cos, rotation.sin);
  * const r2 = Matrix3.rotateCS(m2, rotation.cos, rotation.sin);
  * ```
  *
  * @category Transform
  * @since 0.7.0
  */
 public static rotateCS(
  matrix: ReadonlyMatrix3Like,
  cos: number,
  sin: number,
  out?: Matrix3,
 ): Matrix3 {
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
  * @remarks
  * Equivalent to `Matrix3.multiply(matrix, Matrix3.fromScale(scaleValue), out)`
  * but more efficient as it avoids creating an intermediate matrix.
  *
  * @param matrix - Matrix to scale
  * @param scaleValue - Scale factor (scalar or per-axis vector)
  * @param out - Optional output matrix
  * @returns Scaled matrix
  *
  * @example
  * ```typescript
  * const m = Matrix3.fromTranslation({ x: 100, y: 50 });
  * const scaled = Matrix3.scaleBy(m, { x: 2, y: 0.5 });
  * ```
  *
  * @category Transform
  * @since 0.7.0
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
  * @param m00OrSource - First element, array, or object
  * @param m01 - Element at row 1, column 0 (when first arg is number)
  * @param m02 - Element at row 2, column 0 (when first arg is number)
  * @param m10 - Element at row 0, column 1 (when first arg is number)
  * @param m11 - Element at row 1, column 1 (when first arg is number)
  * @param m12 - Element at row 2, column 1 (when first arg is number)
  * @param m20 - Element at row 0, column 2 (when first arg is number)
  * @param m21 - Element at row 1, column 2 (when first arg is number)
  * @param m22 - Element at row 2, column 2 (when first arg is number)
  * @throws {RangeError} If array has less than 9 elements
  * @throws {TypeError} If arguments are invalid
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
  // Pure math: no assertions - Infinity/NaN are valid IEEE 754 values
 }

 /* ======================================================================== */
 /* Instance Mutators                                                        */
 /* ======================================================================== */

 /**
  * Sets all matrix elements.
  *
  * @param m00 - Element at row 0, column 0
  * @param m01 - Element at row 1, column 0
  * @param m02 - Element at row 2, column 0
  * @param m10 - Element at row 0, column 1
  * @param m11 - Element at row 1, column 1
  * @param m12 - Element at row 2, column 1
  * @param m20 - Element at row 0, column 2
  * @param m21 - Element at row 1, column 2
  * @param m22 - Element at row 2, column 2
  * @returns This for chaining
  *
  * @category Mutator
  * @since 0.7.0
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
  * @param matrix - Source matrix
  * @returns This for chaining
  *
  * @category Mutator
  * @since 0.7.0
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
  * Sets this matrix from array values (column-major order).
  * @param array - Source array with 9 elements
  * @param offset - Starting index (default 0)
  * @returns This for chaining
  *
  * @category Mutator
  * @since 0.7.0
  */
 public setFromArray(array: ArrayLike<number>, offset = 0): this {
  if (offset < 0 || offset + 9 > array.length) {
   throw new RangeError(
    `Matrix3.setFromArray: offset ${offset} out of bounds for array length ${array.length}`,
   );
  }
  return this.set(
   array[offset]!,
   array[offset + 1]!,
   array[offset + 2]!,
   array[offset + 3]!,
   array[offset + 4]!,
   array[offset + 5]!,
   array[offset + 6]!,
   array[offset + 7]!,
   array[offset + 8]!,
  );
 }

 /**
  * Resets to identity matrix.
  *
  * @returns This for chaining
  *
  * @category Mutator
  * @since 0.7.0
  */
 public identity(): this {
  return this.set(1, 0, 0, 0, 1, 0, 0, 0, 1);
 }

 /**
  * Sets all elements to zero.
  *
  * @returns This for chaining
  *
  * @category Mutator
  * @since 0.7.0
  */
 public zero(): this {
  return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0);
 }

 /**
  * Sets the translation components of this matrix.
  *
  * @remarks
  * Only modifies m20 and m21 (the translation column), leaving all other
  * elements unchanged.
  *
  * @param translation - Translation vector
  * @returns This for chaining
  *
  * @example
  * ```typescript
  * const m = Matrix3.fromRotation(Math.PI / 4);
  * m.setTranslation({ x: 100, y: 50 });
  * ```
  *
  * @category Mutator
  * @since 0.7.0
  */
 public setTranslation(translation: ReadonlyVector2Like): this {
  this.m20 = translation.x;
  this.m21 = translation.y;
  return this;
 }

 /* ======================================================================== */
 /* Instance Computed                                                        */
 /* ======================================================================== */

 /**
  * Extracts translation vector from the matrix.
  *
  * @param out - Optional output vector
  * @returns Translation as Vector2
  *
  * @category Computed
  * @since 0.7.0
  */
 public getTranslation(out?: Vector2): Vector2 {
  return Vector2.fromValues(this.m20, this.m21, out);
 }

 /**
  * Extracts scale factors from the matrix (always positive).
  *
  * @remarks
  * Returns the length of each column vector. Values are always non-negative
  * since `hypot` computes magnitudes. This does NOT account for determinant
  * sign (reflection). Use {@link Matrix3.decompose} for signed scale that
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

 /**
  * Extracts rotation angle from the matrix.
  *
  * @returns Rotation angle in radians
  *
  * @category Computed
  * @since 0.7.0
  */
 public getRotation(): number {
  const scaleX = hypot(this.m00, this.m01);
  if (isNearZero(scaleX)) {
   return 0;
  }
  return atan2(this.m01 / scaleX, this.m00 / scaleX);
 }

 /**
  * Calculates the determinant.
  *
  * @returns Determinant value
  *
  * @category Computed
  * @since 0.7.0
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
  * @returns Trace value
  *
  * @category Computed
  * @since 0.7.0
  */
 public trace(): number {
  return this.m00 + this.m11 + this.m22;
 }

 /**
  * Calculates the Frobenius norm.
  *
  * @returns Frobenius norm √(Σ|mᵢⱼ|²)
  *
  * @category Computed
  * @since 0.7.0
  */
 public frobeniusNorm(): number {
  return Math.sqrt(
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
  * @returns True if determinant is not near zero
  *
  * @category Comparison
  * @since 0.7.0
  */
 public isInvertible(epsilon: number = EPSILON): boolean {
  return !isNearZero(this.determinant(), epsilon);
 }

 /**
  * Tests if matrix is affine (bottom row is [0, 0, 1]).
  *
  * @param epsilon - Tolerance. @defaultValue `EPSILON`
  * @returns True if matrix is affine
  *
  * @category Comparison
  * @since 0.7.0
  */
 public isAffine(epsilon: number = EPSILON): boolean {
  return (
   isNearZero(this.m02, epsilon) &&
   isNearZero(this.m12, epsilon) &&
   scalarNearEquals(this.m22, 1, epsilon)
  );
 }

 /* ======================================================================== */
 /* Instance Accessors                                                       */
 /* ======================================================================== */

 /**
  * Returns a new transposed matrix without modifying this one.
  * @returns Transposed matrix
  *
  * @category Accessor
  * @since 0.7.0
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
  * @returns Inverted matrix
  *
  * @category Accessor
  * @since 0.7.0
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
  * @returns Negated matrix
  *
  * @category Accessor
  * @since 0.7.0
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
  * @returns Upper-left 2x2 matrix
  *
  * @category Accessor
  * @since 0.7.0
  */
 public get upperLeft2x2(): Matrix2 {
  return new Matrix2(this.m00, this.m01, this.m10, this.m11);
 }

 /**
  * Returns the translation component as a Vector2.
  * @returns Translation vector
  *
  * @category Accessor
  * @since 0.7.0
  */
 public get translation(): Vector2 {
  return new Vector2(this.m20, this.m21);
 }

 /**
  * Returns the diagonal elements as a 3-element array.
  * @returns Diagonal array [m00, m11, m22]
  *
  * @category Accessor
  * @since 0.7.0
  */
 public get diagonal(): [number, number, number] {
  return [this.m00, this.m11, this.m22];
 }

 /**
  * Returns the first column as a tuple.
  * @returns Column 0 as [m00, m01, m02]
  *
  * @category Accessor
  * @since 0.7.0
  */
 public get column0(): [number, number, number] {
  return [this.m00, this.m01, this.m02];
 }

 /**
  * Returns the second column as a tuple.
  * @returns Column 1 as [m10, m11, m12]
  *
  * @category Accessor
  * @since 0.7.0
  */
 public get column1(): [number, number, number] {
  return [this.m10, this.m11, this.m12];
 }

 /**
  * Returns the third column as a tuple.
  * @returns Column 2 as [m20, m21, m22]
  *
  * @category Accessor
  * @since 0.7.0
  */
 public get column2(): [number, number, number] {
  return [this.m20, this.m21, this.m22];
 }

 /**
  * Returns the first row as a tuple.
  * @returns Row 0 as [m00, m10, m20]
  *
  * @category Accessor
  * @since 0.7.0
  */
 public get row0(): [number, number, number] {
  return [this.m00, this.m10, this.m20];
 }

 /**
  * Returns the second row as a tuple.
  * @returns Row 1 as [m01, m11, m21]
  *
  * @category Accessor
  * @since 0.7.0
  */
 public get row1(): [number, number, number] {
  return [this.m01, this.m11, this.m21];
 }

 /**
  * Returns the third row as a tuple.
  * @returns Row 2 as [m02, m12, m22]
  *
  * @category Accessor
  * @since 0.7.0
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
  * @param other - Matrix to multiply by
  * @returns This for chaining
  *
  * @category Arithmetic
  * @since 0.7.0
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
  * @param other - Matrix to add
  * @returns This for chaining
  *
  * @category Arithmetic
  * @since 0.7.0
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
  * @param other - Matrix to subtract
  * @returns This for chaining
  *
  * @category Arithmetic
  * @since 0.7.0
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
  * Multiplies all elements by a scalar.
  *
  * @param scalar - Scalar multiplier
  * @returns This for chaining
  *
  * @category Arithmetic
  * @since 0.7.0
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
  * Adds a scalar to all elements.
  *
  * @param scalar - Value to add
  * @returns This for chaining
  *
  * @category Arithmetic
  * @since 0.7.0
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
  * @param scalar - Value to subtract
  * @returns This for chaining
  *
  * @category Arithmetic
  * @since 0.7.0
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
  * Fused multiply-add: `this = this * scalar + m`.
  *
  * @param scalar - Scalar multiplier
  * @param m - Matrix to add
  * @returns This for chaining
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 public fma(scalar: number, m: ReadonlyMatrix3Like): this {
  this.m00 = this.m00 * scalar + m.m00;
  this.m01 = this.m01 * scalar + m.m01;
  this.m02 = this.m02 * scalar + m.m02;
  this.m10 = this.m10 * scalar + m.m10;
  this.m11 = this.m11 * scalar + m.m11;
  this.m12 = this.m12 * scalar + m.m12;
  this.m20 = this.m20 * scalar + m.m20;
  this.m21 = this.m21 * scalar + m.m21;
  this.m22 = this.m22 * scalar + m.m22;
  return this;
 }

 /**
  * Divides all elements by a scalar (strict).
  *
  * @remarks
  * For safe division that returns zeros, use {@link divideScalarSafe}.
  * For hot paths, use {@link divideScalarUnchecked}.
  *
  * @param scalar - Divisor
  * @returns This for chaining
  * @throws {RangeError} If scalar is near zero
  *
  * @example
  * ```typescript
  * new Matrix3(4, 8, 12, 2, 6, 10, 14, 16, 18).divideScalar(2); // each element halved
  * new Matrix3().divideScalar(0); // throws RangeError
  * ```
  *
  * @see {@link divideScalarSafe} - Returns fallback for zero divisor
  * @see {@link divideScalarUnchecked} - No validation
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 public divideScalar(scalar: number): this {
  if (isNearZero(scalar)) {
   throw new RangeError('Matrix3.divideScalar: cannot divide by zero or near-zero scalar');
  }
  const invScalar = 1 / scalar;
  return this.multiplyScalar(invScalar);
 }

 /**
  * Divides all elements by a scalar (safe).
  *
  * @param scalar - Divisor
  * @returns This for chaining (sets to zero matrix if scalar is near zero)
  *
  * @example
  * ```typescript
  * new Matrix3(4, 8, 12, 2, 6, 10, 14, 16, 18).divideScalarSafe(2); // each element halved
  * new Matrix3().divideScalarSafe(0); // zero matrix (fallback)
  * ```
  *
  * @see {@link divideScalar} - Throws for zero divisor
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 public divideScalarSafe(scalar: number): this {
  if (isNearZero(scalar)) {
   return this.zero();
  }
  const invScalar = 1 / scalar;
  return this.multiplyScalar(invScalar);
 }

 /**
  * Unchecked scalar division for hot paths.
  *
  * @remarks
  * **Precondition:** Scalar must be non-zero.
  *
  * @param scalar - Divisor (must be non-zero)
  * @returns This for chaining
  *
  * @see {@link divideScalar} - Throws on zero divisor
  * @see {@link divideScalarSafe} - Returns fallback on zero divisor
  *
  * @category Arithmetic
  * @since 0.7.0
  */
 public divideScalarUnchecked(scalar: number): this {
  const invScalar = 1 / scalar;
  return this.multiplyScalar(invScalar);
 }

 /* ======================================================================== */
 /* Instance Matrix Operations                                               */
 /* ======================================================================== */

 /**
  * Transposes this matrix in place.
  *
  * @returns This for chaining
  *
  * @category Matrix Operations
  * @since 0.7.0
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
  * @returns This for chaining
  * @throws Error if singular
  *
  * @example
  * ```typescript
  * Matrix3.fromRotation(Math.PI / 4).inverse(); // rotated back by -PI/4
  * new Matrix3(0, 0, 0, 0, 0, 0, 0, 0, 0).inverse(); // throws RangeError (singular)
  * ```
  *
  * @see {@link inverseSafe} - Returns fallback for singular matrix
  * @see {@link inverseUnchecked} - No validation
  *
  * @category Matrix Operations
  * @since 0.7.0
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
  * @returns This for chaining (returns identity if singular)
  *
  * @example
  * ```typescript
  * Matrix3.fromRotation(Math.PI / 4).inverseSafe(); // rotated back by -PI/4
  * new Matrix3(0, 0, 0, 0, 0, 0, 0, 0, 0).inverseSafe(); // identity (fallback)
  * ```
  *
  * @see {@link inverse} - Throws for singular matrix
  *
  * @category Matrix Operations
  * @since 0.7.0
  */
 public inverseSafe(): this {
  const c00 = this.m11 * this.m22 - this.m12 * this.m21;
  const c01 = -(this.m01 * this.m22 - this.m02 * this.m21);
  const c02 = this.m01 * this.m12 - this.m02 * this.m11;

  const det = this.m00 * c00 + this.m10 * c01 + this.m20 * c02;
  if (isNearZero(det)) {
   return this.identity();
  }

  const c10 = -(this.m10 * this.m22 - this.m12 * this.m20);
  const c11 = this.m00 * this.m22 - this.m02 * this.m20;
  const c12 = -(this.m00 * this.m12 - this.m02 * this.m10);

  const c20 = this.m10 * this.m21 - this.m11 * this.m20;
  const c21 = -(this.m00 * this.m21 - this.m01 * this.m20);
  const c22 = this.m00 * this.m11 - this.m01 * this.m10;

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
  * Inverts this matrix in place (unchecked version).
  *
  * @remarks
  * Assumes matrix is invertible. Use for hot paths when you've already validated.
  *
  * @returns This for chaining
  *
  * @see {@link inverse} - Throws on singular matrix
  * @see {@link inverseSafe} - Returns fallback on singular matrix
  *
  * @category Matrix Operations
  * @since 0.7.0
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
  * Inverts this affine matrix in place using an optimized path.
  *
  * @returns This for chaining
  * @throws {RangeError} If matrix is not affine or is singular
  *
  * @example
  * ```typescript
  * Matrix3.fromTransform2({ x: 10, y: 20 }, Math.PI / 4, 2).inverseAffine();
  * ```
  *
  * @see {@link inverseAffineSafe} - Returns identity if not affine or singular
  * @see {@link inverseAffineUnchecked} - No validation
  *
  * @category Matrix Operations
  * @since 0.7.0
  */
 public inverseAffine(): this {
  if (!this.isAffine()) {
   throw new RangeError('Matrix3.inverseAffine: matrix is not affine');
  }

  const a = this.m00;
  const b = this.m10;
  const c = this.m01;
  const d = this.m11;
  const tx = this.m20;
  const ty = this.m21;

  const det = a * d - b * c;
  if (isNearZero(det)) {
   throw new RangeError('Matrix3.inverseAffine: matrix is singular');
  }

  const invDet = 1 / det;
  return this.set(
   d * invDet,
   -c * invDet,
   0,
   -b * invDet,
   a * invDet,
   0,
   (b * ty - d * tx) * invDet,
   (c * tx - a * ty) * invDet,
   1,
  );
 }

 /**
  * Inverts this affine matrix in place (safe version).
  *
  * @returns This for chaining (returns identity if not affine or singular)
  *
  * @example
  * ```typescript
  * Matrix3.fromTransform2({ x: 10, y: 20 }, Math.PI / 4, 2).inverseAffineSafe();
  * ```
  *
  * @see {@link inverseAffine} - Throws on non-affine or singular
  *
  * @category Matrix Operations
  * @since 0.7.0
  */
 public inverseAffineSafe(): this {
  if (!this.isAffine()) {
   return this.identity();
  }

  const a = this.m00;
  const b = this.m10;
  const c = this.m01;
  const d = this.m11;
  const tx = this.m20;
  const ty = this.m21;

  const det = a * d - b * c;
  if (isNearZero(det)) {
   return this.identity();
  }

  const invDet = 1 / det;
  return this.set(
   d * invDet,
   -c * invDet,
   0,
   -b * invDet,
   a * invDet,
   0,
   (b * ty - d * tx) * invDet,
   (c * tx - a * ty) * invDet,
   1,
  );
 }

 /**
  * Inverts this affine matrix in place (unchecked version).
  *
  * @remarks
  * **Precondition:** Matrix must be affine and invertible. No validation is performed.
  *
  * @returns This for chaining
  *
  * @see {@link inverseAffine} - Throws on non-affine or singular
  * @see {@link inverseAffineSafe} - Returns identity on non-affine or singular
  *
  * @category Matrix Operations
  * @since 0.7.0
  */
 public inverseAffineUnchecked(): this {
  const a = this.m00;
  const b = this.m10;
  const c = this.m01;
  const d = this.m11;
  const tx = this.m20;
  const ty = this.m21;

  const det = a * d - b * c;
  const invDet = 1 / det;
  return this.set(
   d * invDet,
   -c * invDet,
   0,
   -b * invDet,
   a * invDet,
   0,
   (b * ty - d * tx) * invDet,
   (c * tx - a * ty) * invDet,
   1,
  );
 }

 /**
  * Negates all elements in place.
  *
  * @returns This for chaining
  *
  * @category Arithmetic
  * @since 0.7.0
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
  * @remarks
  * The adjugate is the transpose of the cofactor matrix.
  * For a 3×3 matrix, each element is the determinant of the 2×2
  * minor matrix, with alternating signs.
  *
  * @returns This for chaining
  *
  * @category Matrix Operations
  * @since 0.7.0
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
  * @param other - Matrix to multiply by
  * @returns This for chaining
  *
  * @category Arithmetic
  * @since 0.7.0
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

 /**
  * Decomposes this matrix into translation, rotation, and scale components.
  * @returns Object with translation (Vector2), rotation (radians), and scale (Vector2)
  *
  * @category Matrix Operations
  * @since 0.7.0
  */
 public decompose(): { translation: Vector2; rotation: number; scale: Vector2 } {
  return Matrix3.decompose(this);
 }

 /* ======================================================================== */
 /* Instance Transforms                                                      */
 /* ======================================================================== */

 /**
  * Floors all elements in place.
  *
  * @returns This for chaining
  *
  * @category Transform
  * @since 0.7.0
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
  * @returns This for chaining
  *
  * @category Transform
  * @since 0.7.0
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
  * @returns This for chaining
  *
  * @category Transform
  * @since 0.7.0
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
  * Applies Math.trunc to all elements in place (rounds towards zero).
  *
  * @returns This for chaining
  *
  * @category Transform
  * @since 0.7.0
  */
 public trunc(): this {
  this.m00 = Math.trunc(this.m00);
  this.m01 = Math.trunc(this.m01);
  this.m02 = Math.trunc(this.m02);
  this.m10 = Math.trunc(this.m10);
  this.m11 = Math.trunc(this.m11);
  this.m12 = Math.trunc(this.m12);
  this.m20 = Math.trunc(this.m20);
  this.m21 = Math.trunc(this.m21);
  this.m22 = Math.trunc(this.m22);
  return this;
 }

 /**
  * Takes the absolute value of all elements in place.
  *
  * @returns This for chaining
  *
  * @category Transform
  * @since 0.7.0
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

 /**
  * Takes the sign of all elements in place.
  *
  * @returns This for chaining
  *
  * @category Transform
  * @since 0.7.0
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
  * @param minMatrix - Minimum values per element
  * @param maxMatrix - Maximum values per element
  * @returns This for chaining
  *
  * @category Transform
  * @since 0.7.0
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
  * @param minValue - Minimum value
  * @param maxValue - Maximum value
  * @returns This for chaining
  *
  * @category Transform
  * @since 0.7.0
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
  * @param other - Matrix to compare
  * @returns This for chaining
  *
  * @category Transform
  * @since 0.7.0
  */
 public min(other: ReadonlyMatrix3Like): this {
  this.m00 = Math.min(this.m00, other.m00);
  this.m01 = Math.min(this.m01, other.m01);
  this.m02 = Math.min(this.m02, other.m02);
  this.m10 = Math.min(this.m10, other.m10);
  this.m11 = Math.min(this.m11, other.m11);
  this.m12 = Math.min(this.m12, other.m12);
  this.m20 = Math.min(this.m20, other.m20);
  this.m21 = Math.min(this.m21, other.m21);
  this.m22 = Math.min(this.m22, other.m22);
  return this;
 }

 /**
  * Takes element-wise maximum with another matrix in place.
  *
  * @param other - Matrix to compare
  * @returns This for chaining
  *
  * @category Transform
  * @since 0.7.0
  */
 public max(other: ReadonlyMatrix3Like): this {
  this.m00 = Math.max(this.m00, other.m00);
  this.m01 = Math.max(this.m01, other.m01);
  this.m02 = Math.max(this.m02, other.m02);
  this.m10 = Math.max(this.m10, other.m10);
  this.m11 = Math.max(this.m11, other.m11);
  this.m12 = Math.max(this.m12, other.m12);
  this.m20 = Math.max(this.m20, other.m20);
  this.m21 = Math.max(this.m21, other.m21);
  this.m22 = Math.max(this.m22, other.m22);
  return this;
 }

 /**
  * Computes element-wise modulo in place.
  *
  * @param other - Divisor matrix
  * @returns This for chaining
  *
  * @category Arithmetic
  * @since 0.7.0
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
  * @param scalar - Divisor
  * @returns This for chaining
  *
  * @category Arithmetic
  * @since 0.7.0
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
  * @param index - Column index (0, 1, or 2)
  * @returns Column as [row0, row1, row2]
  * @throws RangeError if index is out of bounds
  *
  * @category Column/Row
  * @since 0.7.0
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
  * @param index - Column index (0, 1, or 2)
  * @param values - Column values [row0, row1, row2]
  * @returns This for chaining
  * @throws RangeError if index is out of bounds
  *
  * @category Column/Row
  * @since 0.7.0
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
  * @param index - Row index (0, 1, or 2)
  * @returns Row as [col0, col1, col2]
  * @throws RangeError if index is out of bounds
  *
  * @category Column/Row
  * @since 0.7.0
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
  * @param index - Row index (0, 1, or 2)
  * @param values - Row values [col0, col1, col2]
  * @returns This for chaining
  * @throws RangeError if index is out of bounds
  *
  * @category Column/Row
  * @since 0.7.0
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
 /* Instance Transforms (Geometric)                                          */
 /* ======================================================================== */

 /**
  * Applies a translation to this matrix in place.
  *
  * @param translation - Translation vector
  * @returns This for chaining
  *
  * @category Transform
  * @since 0.7.0
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
  * @param angle - Rotation angle in radians
  * @returns This for chaining
  *
  * @category Transform
  * @since 0.7.0
  */
 public rotate(angle: number): this {
  const { cos, sin } = sinCos(angle);
  return this.rotateCS(cos, sin);
 }

 /**
  * Applies a rotation to this matrix using precomputed cosine and sine values in place.
  *
  * @remarks
  * Use this method in hot paths where the same rotation is applied to multiple
  * matrices. Precompute `cos` and `sin` once and reuse them.
  *
  * @param cos - Cosine of the rotation angle
  * @param sin - Sine of the rotation angle
  * @returns This for chaining
  *
  * @example
  * ```typescript
  * const rotation = Rotation2.fromAngle(Math.PI / 4);
  * const m = new Matrix3();
  * m.rotateCS(rotation.cos, rotation.sin);
  * ```
  *
  * @category Transform
  * @since 0.7.0
  */
 public rotateCS(cos: number, sin: number): this {
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
  * @param scaleValue - Scale factor (scalar or per-axis vector)
  * @returns This for chaining
  *
  * @category Transform
  * @since 0.7.0
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
 /* Instance Transforms (Application)                                        */
 /* ======================================================================== */

 /**
  * Transforms a point by this matrix.
  *
  * @remarks
  * Points are affected by translation (uses homogeneous coordinate w=1).
  *
  * @param point - Point to transform
  * @param out - Optional output vector
  * @returns Transformed point
  *
  * @category Transform
  * @since 0.7.0
  */
 public transformPoint(point: ReadonlyVector2Like, out?: Vector2): Vector2 {
  return Matrix3.transformPoint(this, point, out);
 }

 /**
  * Transforms a vector by this matrix.
  *
  * @remarks
  * Vectors are NOT affected by translation (uses homogeneous coordinate w=0).
  *
  * @param vector - Vector to transform
  * @param out - Optional output vector
  * @returns Transformed vector
  *
  * @category Transform
  * @since 0.7.0
  */
 public transformVector(vector: ReadonlyVector2Like, out?: Vector2): Vector2 {
  return Matrix3.transformVector(this, vector, out);
 }

 /**
  * Transforms multiple points efficiently (batch operation).
  *
  * @remarks
  * More efficient than calling transformPoint multiple times for large arrays
  * because it avoids repeated function call overhead.
  *
  * @param points - Array of points to transform
  * @param out - Optional output array (will be filled/extended as needed)
  * @returns Array of transformed points
  *
  * @example
  * ```typescript
  * const vertices = [new Vector2(0, 0), new Vector2(1, 0), new Vector2(1, 1)];
  * const worldVertices = matrix.transformPoints(vertices);
  * ```
  *
  * @category Matrix Operations
  * @since 0.7.0
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
  * @remarks
  * Unlike points, vectors are not affected by translation.
  *
  * @param vectors - Array of vectors to transform
  * @param out - Optional output array (will be filled/extended as needed)
  * @returns Array of transformed vectors
  *
  * @category Matrix Operations
  * @since 0.7.0
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
  * Exact equality with other matrix (bit-identical).
  *
  * @remarks
  * Use {@link nearEquals} for comparing results of floating-point operations.
  *
  * @param other - Matrix to compare
  * @returns True if all components are exactly identical
  *
  * @category Comparison
  * @since 0.7.0
  */
 public exactEquals(other: ReadonlyMatrix3Like): boolean {
  return Matrix3.exactEquals(this, other);
 }

 /**
  * Approximate equality with other matrix using relative tolerance.
  *
  * @remarks
  * Uses relative tolerance: `|a - b| <= epsilon * max(1, |a|, |b|)` per component.
  *
  * @param other - Matrix to compare
  * @param epsilon - Relative tolerance. @defaultValue `EPSILON`
  * @returns True if all component differences are within scaled epsilon
  *
  * @category Comparison
  * @since 0.7.0
  */
 public nearEquals(other: ReadonlyMatrix3Like, epsilon: number = EPSILON): boolean {
  return Matrix3.nearEquals(this, other, epsilon);
 }

 /**
  * Tests if this matrix is an identity matrix.
  *
  * @param epsilon - Tolerance. @defaultValue `EPSILON`
  * @returns True if this is an identity matrix
  *
  * @category Comparison
  * @since 0.7.0
  */
 public isIdentity(epsilon: number = EPSILON): boolean {
  return Matrix3.isIdentity(this, epsilon);
 }

 /**
  * Tests if all elements are exactly zero.
  *
  * @returns True if all elements are zero
  *
  * @category Comparison
  * @since 0.7.0
  */
 public isZero(): boolean {
  return Matrix3.isZero(this);
 }

 /**
  * Tests if all elements are near zero.
  *
  * @param epsilon - Tolerance. @defaultValue `EPSILON`
  * @returns True if all elements are within epsilon of zero
  *
  * @category Comparison
  * @since 0.7.0
  */
 public isNearZero(epsilon: number = EPSILON): boolean {
  return Matrix3.isNearZero(this, epsilon);
 }

 /**
  * Tests if all elements are finite.
  *
  * @returns True if all elements are finite
  *
  * @category Comparison
  * @since 0.7.0
  */
 public isFinite(): boolean {
  return Matrix3.isFinite(this);
 }

 /**
  * Tests if any element is NaN.
  *
  * @returns True if any element is NaN
  *
  * @category Comparison
  * @since 0.7.0
  */
 public hasNaN(): boolean {
  return Matrix3.hasNaN(this);
 }

 /**
  * Tests if any element is infinite (±Infinity).
  *
  * @returns True if any element is ±Infinity
  *
  * @category Comparison
  * @since 0.7.0
  */
 public hasInfinity(): boolean {
  return Matrix3.hasInfinity(this);
 }

 /**
  * Tests if this matrix is symmetric (M = M^T).
  *
  * @remarks
  * Uses relative tolerance for comparing off-diagonal elements.
  *
  * @param epsilon - Relative tolerance. @defaultValue `EPSILON`
  * @returns True if matrix is symmetric
  *
  * @category Comparison
  * @since 0.7.0
  */
 public isSymmetric(epsilon: number = EPSILON): boolean {
  return Matrix3.isSymmetric(this, epsilon);
 }

 /**
  * Tests if this matrix is skew-symmetric (M = -M^T).
  *
  * @remarks
  * Uses relative tolerance for comparing off-diagonal elements.
  *
  * @param epsilon - Tolerance. @defaultValue `EPSILON`
  * @returns True if matrix is skew-symmetric
  *
  * @category Comparison
  * @since 0.7.0
  */
 public isSkewSymmetric(epsilon: number = EPSILON): boolean {
  return Matrix3.isSkewSymmetric(this, epsilon);
 }

 /**
  * Tests if this matrix is diagonal (off-diagonal elements ≈ 0).
  *
  * @param epsilon - Tolerance. @defaultValue `EPSILON`
  * @returns True if matrix is diagonal
  *
  * @category Comparison
  * @since 0.7.0
  */
 public isDiagonal(epsilon: number = EPSILON): boolean {
  return Matrix3.isDiagonal(this, epsilon);
 }

 /**
  * Tests if this matrix is orthogonal (M * M^T = I).
  *
  * @param epsilon - Tolerance. @defaultValue `EPSILON`
  * @returns True if matrix is orthogonal
  *
  * @category Comparison
  * @since 0.7.0
  */
 public isOrthogonal(epsilon: number = EPSILON): boolean {
  return Matrix3.isOrthogonal(this, epsilon);
 }

 /* ======================================================================== */
 /* Instance Interpolation                                                   */
 /* ======================================================================== */

 /**
  * Linear interpolation with another matrix in place (unclamped).
  *
  * @param other - Target matrix
  * @param t - Interpolation factor (unclamped, allows extrapolation)
  * @returns This for chaining
  *
  * @category Interpolation
  * @since 0.7.0
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
  * Clamped linear interpolation.
  *
  * @remarks
  * Clamps `t` to [0, 1] before delegating to {@link lerp}.
  *
  * @param other - Target matrix
  * @param t - Interpolation factor (clamped to [0, 1] before interpolation)
  * @returns This for chaining
  *
  * @category Interpolation
  * @since 0.7.0
  */
 public lerpClamped(other: ReadonlyMatrix3Like, t: number): this {
  return this.lerp(other, saturate(t));
 }

 /**
  * Smooth step interpolation in place.
  *
  * @param other - Target matrix
  * @param t - Interpolation factor
  * @returns This for chaining
  *
  * @category Interpolation
  * @since 0.7.0
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
  * Writes the matrix to an array or typed array.
  *
  * @remarks
  * Follows the same pattern as {@link Vector2.toArray} for API consistency.
  * Accepts any array-like type that supports indexed assignment.
  *
  * @template T - Array type (number[], Float32Array, Float64Array, etc.)
  * @param out - Optional output array. If not provided, returns a new number[]
  * @param offset - Write offset. @defaultValue `0`
  * @param columnMajor - Use column-major order. @defaultValue `true`
  * @returns The output array, or a new tuple if no output was provided
  *
  * @category Conversion
  * @since 0.7.0
  */
 public toArray<T extends ArrayLike<number> & { [index: number]: number }>(
  out?: T,
  offset = 0,
  columnMajor = true,
 ): T | [number, number, number, number, number, number, number, number, number] {
  if (!out) {
   if (columnMajor) {
    return [
     this.m00,
     this.m01,
     this.m02,
     this.m10,
     this.m11,
     this.m12,
     this.m20,
     this.m21,
     this.m22,
    ];
   }
   return [
    this.m00,
    this.m10,
    this.m20,
    this.m01,
    this.m11,
    this.m21,
    this.m02,
    this.m12,
    this.m22,
   ];
  }
  if (columnMajor) {
   out[offset] = this.m00;
   out[offset + 1] = this.m01;
   out[offset + 2] = this.m02;
   out[offset + 3] = this.m10;
   out[offset + 4] = this.m11;
   out[offset + 5] = this.m12;
   out[offset + 6] = this.m20;
   out[offset + 7] = this.m21;
   out[offset + 8] = this.m22;
  } else {
   out[offset] = this.m00;
   out[offset + 1] = this.m10;
   out[offset + 2] = this.m20;
   out[offset + 3] = this.m01;
   out[offset + 4] = this.m11;
   out[offset + 5] = this.m21;
   out[offset + 6] = this.m02;
   out[offset + 7] = this.m12;
   out[offset + 8] = this.m22;
  }
  return out;
 }

 /**
  * Extracts the upper-left 2×2 portion as a Matrix2.
  *
  * @param out - Optional output matrix
  * @returns Matrix2 containing upper-left 2×2 portion
  *
  * @category Conversion
  * @since 0.7.0
  */
 public toMatrix2(out?: Matrix2): Matrix2 {
  return Matrix2.fromValues(this.m00, this.m01, this.m10, this.m11, out);
 }

 /**
  * Converts the matrix to a plain object.
  *
  * @returns Object with m00-m22 properties
  *
  * @example
  * ```typescript
  * const m = Matrix3.fromRotation(Math.PI / 2);
  * const obj = m.toObject();
  * ```
  *
  * @category Conversion
  * @since 0.7.0
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
  * @returns Object suitable for JSON serialization
  *
  * @category Conversion
  * @since 0.7.0
  */
 public toJSON(): Matrix3Like {
  return this.toObject();
 }

 /**
  * Creates a human-readable string representation.
  *
  * @param precision - Decimal places. @defaultValue `4`
  * @returns Formatted string
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
  * @since 0.7.0
  */
 public toString(precision = 4): string {
  const p = (value: number): string => value.toFixed(precision);
  return `Matrix3(\n  ${p(this.m00)}, ${p(this.m10)}, ${p(this.m20)}\n  ${p(this.m01)}, ${p(this.m11)}, ${p(this.m21)}\n  ${p(this.m02)}, ${p(this.m12)}, ${p(this.m22)}\n)`;
 }

 /**
  * Creates a deep copy of this matrix.
  *
  * @returns New Matrix3 with identical values
  *
  * @example
  * ```typescript
  * const m = Matrix3.fromRotation(Math.PI / 4);
  * const copy = m.clone();
  * copy.identity(); // Original unchanged
  * ```
  *
  * @category Conversion
  * @since 0.7.0
  */
 public clone(): Matrix3 {
  return Matrix3.clone(this);
 }

 /**
  * Iterator for array destructuring (column-major order).
  * @returns Iterator yielding all 9 elements
  *
  * @example
  * ```typescript
  * const [m00, m01, m02, m10, m11, m12, m20, m21, m22] = matrix;
  * ```
  *
  * @category Conversion
  * @since 0.7.0
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
