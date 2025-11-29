/**
 * @file core/matrix2.ts
 * @module @lenguados/math2d/core
 * @description Deterministic, allocation-aware 2×2 matrix implementation.
 */

import { sinCos } from '../auxiliary/angle/operations';
import { safeDivide, safeSqrt } from '../auxiliary/numeric/safety';
import { saturate } from '../auxiliary/scalar/arithmetic';
import { isNearZero, nearEquals } from '../auxiliary/scalar/comparison';
import { EPSILON } from '../auxiliary/scalar/constants';
import { lerp } from '../auxiliary/scalar/interpolation';
import { DeterministicMath } from '../deterministic/deterministic-math';
import type { Matrix2Like, ReadonlyMatrix2Like, ReadonlyVector2Like } from '../types';
import { NumericalValidator } from '../validation/numerical-validator';

import type { ReadonlyRotation2 } from './rotation2';
import { Vector2, type ReadonlyVector2 } from './vector2';

export type ReadonlyMatrix2 = Readonly<Matrix2>;

/**
 * Column-major 2×2 matrix suitable for WebGL and physics calculations.
 *
 * @remarks
 * - Instance methods mutate `this` for fluent chaining.
 * - Static helpers are pure and provide optional `out` parameters to eliminate allocations.
 * - Trigonometric operations rely on {@link DeterministicMath}.
 */
export class Matrix2 implements Matrix2Like {
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

 /**
  * Creates a new 2x2 matrix.
  * @param m00 - Column 0, Row 0 (default: 1)
  * @param m01 - Column 0, Row 1 (default: 0)
  * @param m10 - Column 1, Row 0 (default: 0)
  * @param m11 - Column 1, Row 1 (default: 1)
  */
 public constructor(m00 = 1, m01 = 0, m10 = 0, m11 = 1) {
  this.m00 = m00;
  this.m01 = m01;
  this.m10 = m10;
  this.m11 = m11;
 }

 /* ========================================================================== *
  * Helpers
  * ========================================================================== */

 private static ensureOut(out?: Matrix2): Matrix2 {
  return out ?? new Matrix2();
 }

 private static sanitize(value: number, name: string): number {
  return NumericalValidator.validateFinite(value, name);
 }

 /* ========================================================================== *
  * Constants
  * ========================================================================== */

 /** Identity matrix (no transformation). */
 static readonly IDENTITY = Object.freeze(new Matrix2(1, 0, 0, 1)) as ReadonlyMatrix2;

 /** Zero matrix. */
 static readonly ZERO = Object.freeze(new Matrix2(0, 0, 0, 0)) as ReadonlyMatrix2;

 /** 90° counter-clockwise rotation. */
 static readonly ROTATE_90 = Object.freeze(new Matrix2(0, 1, -1, 0)) as ReadonlyMatrix2;

 /** 180° rotation (same as FLIP_XY). */
 static readonly ROTATE_180 = Object.freeze(new Matrix2(-1, 0, 0, -1)) as ReadonlyMatrix2;

 /** 270° counter-clockwise rotation (same as 90° clockwise). */
 static readonly ROTATE_270 = Object.freeze(new Matrix2(0, -1, 1, 0)) as ReadonlyMatrix2;

 /** Flip horizontally (mirror across Y axis). */
 static readonly FLIP_X = Object.freeze(new Matrix2(-1, 0, 0, 1)) as ReadonlyMatrix2;

 /** Flip vertically (mirror across X axis). */
 static readonly FLIP_Y = Object.freeze(new Matrix2(1, 0, 0, -1)) as ReadonlyMatrix2;

 /** Flip both axes (same as ROTATE_180). */
 static readonly FLIP_XY = Object.freeze(new Matrix2(-1, 0, 0, -1)) as ReadonlyMatrix2;

 /** Uniform scale by 2. */
 static readonly SCALE_2 = Object.freeze(new Matrix2(2, 0, 0, 2)) as ReadonlyMatrix2;

 /** Uniform scale by 0.5. */
 static readonly SCALE_HALF = Object.freeze(new Matrix2(0.5, 0, 0, 0.5)) as ReadonlyMatrix2;

 /* ========================================================================== *
  * Static factories
  * ========================================================================== */

 static fromValues(m00: number, m01: number, m10: number, m11: number, out?: Matrix2): Matrix2 {
  return Matrix2.ensureOut(out).set(m00, m01, m10, m11);
 }

 static clone(source: ReadonlyMatrix2Like, out?: Matrix2): Matrix2 {
  return Matrix2.ensureOut(out).set(source.m00, source.m01, source.m10, source.m11);
 }

 /**
  * Creates a matrix from a rotation.
  * @param rotation - Rotation object or angle in radians
  * @param out - Optional output object
  * @returns Rotation matrix
  *
  * @example
  * ```typescript
  * const mat = Matrix2.fromRotation(Math.PI / 3);
  * ```
  */
 static fromRotation(rotation: ReadonlyRotation2 | number, out?: Matrix2): Matrix2 {
  if (typeof rotation === 'number') {
   const { cos, sin } = sinCos(rotation);
   return Matrix2.ensureOut(out).set(cos, sin, -sin, cos);
  }

  return Matrix2.ensureOut(out).set(rotation.c, rotation.s, -rotation.s, rotation.c);
 }

 /**
  * Creates a scaling matrix.
  * @param scale - Scale factors as Vector2 or uniform scale
  * @param out - Optional output object
  * @returns Scale matrix
  *
  * @example
  * ```typescript
  * const mat1 = Matrix2.fromScale(new Vector2(2, 3));
  * const mat2 = Matrix2.fromScale(2); // Uniform scale
  * ```
  */
 static fromScale(scale: ReadonlyVector2Like | number, out?: Matrix2): Matrix2 {
  if (typeof scale === 'number') {
   return Matrix2.ensureOut(out).set(scale, 0, 0, scale);
  }

  return Matrix2.ensureOut(out).set(scale.x, 0, 0, scale.y);
 }

 /**
  * Creates a shearing matrix.
  * @param shear - Shear factors as Vector2 (x=horizontal, y=vertical)
  * @param out - Optional output object
  * @returns Shear matrix
  *
  * @example
  * ```typescript
  * const mat = Matrix2.fromShear(new Vector2(0.5, 0));
  * ```
  */
 static fromShear(shear: ReadonlyVector2Like, out?: Matrix2): Matrix2 {
  return Matrix2.ensureOut(out).set(1, shear.y, shear.x, 1);
 }

 /**
  * Creates a matrix from column vectors.
  * @param col0 - First column
  * @param col1 - Second column
  * @param out - Optional output object
  * @returns Matrix with specified columns
  */
 static fromColumns(col0: ReadonlyVector2Like, col1: ReadonlyVector2Like, out?: Matrix2): Matrix2 {
  return Matrix2.ensureOut(out).set(col0.x, col0.y, col1.x, col1.y);
 }

 /**
  * Creates a matrix from row vectors.
  * @param row0 - First row
  * @param row1 - Second row
  * @param out - Optional output object
  * @returns Matrix with specified rows
  */
 static fromRows(row0: ReadonlyVector2Like, row1: ReadonlyVector2Like, out?: Matrix2): Matrix2 {
  return Matrix2.ensureOut(out).set(row0.x, row1.x, row0.y, row1.y);
 }

 /**
  * Creates a matrix from an array.
  * @param array - Array with matrix elements
  * @param offset - Starting index (default: 0)
  * @param columnMajor - If true, array is column-major (default: true)
  * @param out - Optional output object
  * @returns Matrix
  */
 static fromArray(
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

 static fromMatrix(matrix: ReadonlyMatrix2Like, out?: Matrix2): Matrix2 {
  return Matrix2.ensureOut(out).set(matrix.m00, matrix.m01, matrix.m10, matrix.m11);
 }

 /* ========================================================================== *
  * Static arithmetic / operations
  * ========================================================================== */

 static add(a: ReadonlyMatrix2Like, b: ReadonlyMatrix2Like, out?: Matrix2): Matrix2 {
  return Matrix2.ensureOut(out).set(a.m00 + b.m00, a.m01 + b.m01, a.m10 + b.m10, a.m11 + b.m11);
 }

 static subtract(a: ReadonlyMatrix2Like, b: ReadonlyMatrix2Like, out?: Matrix2): Matrix2 {
  return Matrix2.ensureOut(out).set(a.m00 - b.m00, a.m01 - b.m01, a.m10 - b.m10, a.m11 - b.m11);
 }

 /**
  * Multiplies two matrices.
  * @param a - First matrix
  * @param b - Second matrix
  * @param out - Optional output matrix
  * @returns Product matrix a × b
  */
 static multiply(a: ReadonlyMatrix2Like, b: ReadonlyMatrix2Like, out?: Matrix2): Matrix2 {
  return Matrix2.ensureOut(out).set(
   a.m00 * b.m00 + a.m10 * b.m01,
   a.m01 * b.m00 + a.m11 * b.m01,
   a.m00 * b.m10 + a.m10 * b.m11,
   a.m01 * b.m10 + a.m11 * b.m11,
  );
 }

 static scale(matrix: ReadonlyMatrix2Like, scalar: number, out?: Matrix2): Matrix2 {
  return Matrix2.ensureOut(out).set(
   matrix.m00 * scalar,
   matrix.m01 * scalar,
   matrix.m10 * scalar,
   matrix.m11 * scalar,
  );
 }

 static transpose(matrix: ReadonlyMatrix2Like, out?: Matrix2): Matrix2 {
  return Matrix2.ensureOut(out).set(matrix.m00, matrix.m10, matrix.m01, matrix.m11);
 }

 static inverse(matrix: ReadonlyMatrix2Like, out?: Matrix2): Matrix2 {
  const det = matrix.m00 * matrix.m11 - matrix.m01 * matrix.m10;
  if (isNearZero(det)) {
   throw new Error('Matrix2.inverse: matrix is singular');
  }

  const invDet = safeDivide(1, det);
  return Matrix2.ensureOut(out).set(
   matrix.m11 * invDet,
   -matrix.m01 * invDet,
   -matrix.m10 * invDet,
   matrix.m00 * invDet,
  );
 }

 static adjugate(matrix: ReadonlyMatrix2Like, out?: Matrix2): Matrix2 {
  return Matrix2.ensureOut(out).set(matrix.m11, -matrix.m01, -matrix.m10, matrix.m00);
 }

 /**
  * Negates all elements of a matrix.
  * @param matrix - Matrix to negate
  * @param out - Optional output object
  * @returns Negated matrix
  *
  * @example
  * ```typescript
  * const m = new Matrix2(1, 2, 3, 4);
  * const neg = Matrix2.negate(m);
  * // neg = Matrix2(-1, -2, -3, -4)
  * ```
  */
 static negate(matrix: ReadonlyMatrix2Like, out?: Matrix2): Matrix2 {
  return Matrix2.ensureOut(out).set(-matrix.m00, -matrix.m01, -matrix.m10, -matrix.m11);
 }

 /**
  * Linear interpolation between two matrices.
  * @param a - Start matrix
  * @param b - End matrix
  * @param t - Interpolation factor [0, 1]
  * @param out - Optional output object
  * @returns Interpolated matrix
  *
  * @example
  * ```typescript
  * const a = Matrix2.IDENTITY;
  * const b = Matrix2.fromRotation(Math.PI / 2);
  * const mid = Matrix2.lerp(a, b, 0.5);
  * ```
  */
 static lerp(a: ReadonlyMatrix2Like, b: ReadonlyMatrix2Like, t: number, out?: Matrix2): Matrix2 {
  const clamped = saturate(t);
  return Matrix2.ensureOut(out).set(
   lerp(a.m00, b.m00, clamped),
   lerp(a.m01, b.m01, clamped),
   lerp(a.m10, b.m10, clamped),
   lerp(a.m11, b.m11, clamped),
  );
 }

 /**
  * Tests if two matrices are approximately equal.
  * @param a - First matrix
  * @param b - Second matrix
  * @param epsilon - Tolerance (default: EPSILON)
  * @returns True if all components are within tolerance
  */
 static equals(a: ReadonlyMatrix2Like, b: ReadonlyMatrix2Like, epsilon: number = EPSILON): boolean {
  return (
   nearEquals(a.m00, b.m00, epsilon) &&
   nearEquals(a.m01, b.m01, epsilon) &&
   nearEquals(a.m10, b.m10, epsilon) &&
   nearEquals(a.m11, b.m11, epsilon)
  );
 }

 /**
  * Tests if a matrix is the identity matrix.
  * @param matrix - Matrix to test
  * @param epsilon - Tolerance (default: EPSILON)
  * @returns True if matrix is identity
  */
 static isIdentity(matrix: ReadonlyMatrix2Like, epsilon: number = EPSILON): boolean {
  return (
   nearEquals(matrix.m00, 1, epsilon) &&
   isNearZero(matrix.m01, epsilon) &&
   isNearZero(matrix.m10, epsilon) &&
   nearEquals(matrix.m11, 1, epsilon)
  );
 }

 /**
  * Calculates the determinant of a matrix.
  * @param matrix - Matrix to calculate determinant of
  * @returns Determinant value
  */
 static determinant(matrix: ReadonlyMatrix2Like): number {
  return matrix.m00 * matrix.m11 - matrix.m01 * matrix.m10;
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
 static compose(rotation: number, scale: ReadonlyVector2Like | number, out?: Matrix2): Matrix2 {
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
 static decompose(matrix: ReadonlyMatrix2Like): { rotation: number; scale: Vector2 } {
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

 static transformVector(
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

 /* ========================================================================== *
  * Instance setters & derived properties
  * ========================================================================== */

 // ============ Instance Methods - Setters ============

 /**
  * Sets the matrix components.
  * @param m00 - Column 0, Row 0
  * @param m01 - Column 0, Row 1
  * @param m10 - Column 1, Row 0
  * @param m11 - Column 1, Row 1
  * @returns This matrix for chaining
  */
 set(m00: number, m01: number, m10: number, m11: number): this {
  this.m00 = m00;
  this.m01 = m01;
  this.m10 = m10;
  this.m11 = m11;
  return this;
 }

 /**
  * Copies components from another matrix.
  * @param other - Matrix to copy from
  * @returns This matrix for chaining
  */
 copy(other: ReadonlyMatrix2): this {
  this.m00 = other.m00;
  this.m01 = other.m01;
  this.m10 = other.m10;
  this.m11 = other.m11;
  return this;
 }

 /**
  * Sets this matrix to identity.
  * @returns This matrix for chaining
  */
 identity(): this {
  this.m00 = 1;
  this.m01 = 0;
  this.m10 = 0;
  this.m11 = 1;
  return this;
 }

 // ============ Instance Methods - Properties ============

 /**
  * Calculates the determinant of the matrix.
  * @returns Determinant value
  *
  * @remarks
  * A determinant of 0 indicates the matrix is singular (non-invertible).
  * The absolute value represents the area scaling factor.
  */
 determinant(): number {
  return this.m00 * this.m11 - this.m01 * this.m10;
 }

 /**
  * Calculates the trace of the matrix.
  * @returns Sum of diagonal elements
  */
 trace(): number {
  return this.m00 + this.m11;
 }

 /**
  * Calculates the Frobenius norm.
  * Uses deterministic sqrt for cross-platform reproducibility.
  * @returns Square root of sum of squared elements
  */
 frobeniusNorm(): number {
  return safeSqrt(
   this.m00 * this.m00 + this.m01 * this.m01 + this.m10 * this.m10 + this.m11 * this.m11,
  );
 }

 /**
  * Tests if this matrix is invertible.
  * @param epsilon - Tolerance for determinant (default: EPSILON)
  * @returns True if determinant is non-zero
  */
 isInvertible(epsilon: number = EPSILON): boolean {
  return !isNearZero(this.determinant(), epsilon);
 }

 /**
  * Tests if this matrix is orthogonal.
  * @param epsilon - Tolerance (default: EPSILON)
  * @returns True if M * M^T = I
  */
 isOrthogonal(epsilon: number = EPSILON): boolean {
  // Check if columns are unit length and orthogonal
  const col0LengthSq = this.m00 * this.m00 + this.m01 * this.m01;
  const col1LengthSq = this.m10 * this.m10 + this.m11 * this.m11;
  const dot = this.m00 * this.m10 + this.m01 * this.m11;

  return (
   nearEquals(col0LengthSq, 1, epsilon) &&
   nearEquals(col1LengthSq, 1, epsilon) &&
   isNearZero(dot, epsilon)
  );
 }

 /**
  * Extracts rotation angle from the matrix.
  * @returns Rotation angle in radians
  *
  * @remarks
  * Assumes the matrix represents a pure rotation or rotation with uniform scale.
  */
 getRotation(): number {
  return DeterministicMath.atan2(this.m01, this.m00);
 }

 /**
  * Extracts scale factors from the matrix.
  * Uses deterministic sqrt for cross-platform reproducibility.
  * @param out - Optional output vector
  * @returns Scale factors for each axis
  *
  * @remarks
  * Returns the length of each column vector.
  */
 getScale(out?: Vector2): Vector2 {
  const sx = safeSqrt(this.m00 * this.m00 + this.m01 * this.m01);
  const sy = safeSqrt(this.m10 * this.m10 + this.m11 * this.m11);
  return Vector2.fromValues(sx, sy, out);
 }

 // ============ Readonly Getters ============

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

 // ============ Instance Methods - Arithmetic ============

 /**
  * Adds another matrix to this one.
  * @param other - Matrix to add
  * @param out - Optional output object
  * @returns Sum matrix
  */
 add(other: ReadonlyMatrix2, out?: Matrix2): Matrix2 {
  this.m00 += other.m00;
  this.m01 += other.m01;
  this.m10 += other.m10;
  this.m11 += other.m11;
  return out ? out.copy(this) : this;
 }

 /**
  * Subtracts another matrix from this one.
  * @param other - Matrix to subtract
  * @param out - Optional output object
  * @returns Difference matrix
  */
 subtract(other: ReadonlyMatrix2, out?: Matrix2): Matrix2 {
  this.m00 -= other.m00;
  this.m01 -= other.m01;
  this.m10 -= other.m10;
  this.m11 -= other.m11;
  return out ? out.copy(this) : this;
 }

 /**
  * Multiplies this matrix by another (this × other).
  * @param other - Matrix to multiply by
  * @param out - Optional output object
  * @returns Product matrix
  *
  * @example
  * ```typescript
  * const rot = Matrix2.fromRotation(Math.PI / 4);
  * const scale = Matrix2.fromScale(2);
  * const combined = rot.multiply(scale); // Rotate then scale
  * ```
  */
 multiply(other: ReadonlyMatrix2, out?: Matrix2): Matrix2 {
  const { m00: a00, m01: a01, m10: a10, m11: a11 } = this;
  const { m00: b00, m01: b01, m10: b10, m11: b11 } = other;

  const r00 = a00 * b00 + a10 * b01;
  const r01 = a01 * b00 + a11 * b01;
  const r10 = a00 * b10 + a10 * b11;
  const r11 = a01 * b10 + a11 * b11;
  return out ? out.set(r00, r01, r10, r11) : this.set(r00, r01, r10, r11);
 }

 /**
  * Scales all matrix components by a scalar.
  * @param scalar - Scale factor
  * @param out - Optional output object
  * @returns Scaled matrix
  */
 scale(scalar: number, out?: Matrix2): Matrix2 {
  const r00 = this.m00 * scalar;
  const r01 = this.m01 * scalar;
  const r10 = this.m10 * scalar;
  const r11 = this.m11 * scalar;
  return out ? out.set(r00, r01, r10, r11) : this.set(r00, r01, r10, r11);
 }

 // ============ Instance Methods - Matrix Operations ============

 /**
  * Transposes the matrix.
  * @param out - Optional output object
  * @returns Transposed matrix
  */
 transpose(out?: Matrix2): Matrix2 {
  const r00 = this.m00;
  const r01 = this.m10;
  const r10 = this.m01;
  const r11 = this.m11;
  return out ? out.set(r00, r01, r10, r11) : this.set(r00, r01, r10, r11);
 }

 /**
  * Inverts the matrix.
  * @param out - Optional output object
  * @returns Inverted matrix
  *
  * @throws {Error} If matrix is singular
  */
 inverse(out?: Matrix2): Matrix2 {
  const det = this.determinant();
  if (isNearZero(det)) {
   throw new Error('Matrix2.inverse: matrix is singular');
  }

  const invDet = safeDivide(1, det);
  const r00 = this.m11 * invDet;
  const r01 = -this.m01 * invDet;
  const r10 = -this.m10 * invDet;
  const r11 = this.m00 * invDet;
  return out ? out.set(r00, r01, r10, r11) : this.set(r00, r01, r10, r11);
 }

 /**
  * Calculates the adjugate (adjoint) matrix.
  * @param out - Optional output object
  * @returns Adjugate matrix
  */
 adjugate(out?: Matrix2): Matrix2 {
  const r00 = this.m11;
  const r01 = -this.m01;
  const r10 = -this.m10;
  const r11 = this.m00;
  return out ? out.set(r00, r01, r10, r11) : this.set(r00, r01, r10, r11);
 }

 /**
  * Negates all elements of this matrix.
  * @param out - Optional output object
  * @returns Negated matrix
  *
  * @example
  * ```typescript
  * const m = new Matrix2(1, 2, 3, 4);
  * m.negate();
  * // m = Matrix2(-1, -2, -3, -4)
  * ```
  */
 negate(out?: Matrix2): Matrix2 {
  const r00 = -this.m00;
  const r01 = -this.m01;
  const r10 = -this.m10;
  const r11 = -this.m11;
  return out ? out.set(r00, r01, r10, r11) : this.set(r00, r01, r10, r11);
 }

 /**
  * Pre-multiplies this matrix by another (other × this).
  * @param other - Matrix to multiply by
  * @param out - Optional output object
  * @returns Product matrix
  *
  * @remarks
  * Unlike `mul`, this applies the other transformation first.
  * Useful when building transformation chains in specific order.
  *
  * @example
  * ```typescript
  * const scale = Matrix2.fromScale(2);
  * const rot = Matrix2.fromRotation(Math.PI / 4);
  * const combined = scale.premultiply(rot); // rot × scale
  * ```
  */
 premultiply(other: ReadonlyMatrix2, out?: Matrix2): Matrix2 {
  const { m00: a00, m01: a01, m10: a10, m11: a11 } = other;
  const { m00: b00, m01: b01, m10: b10, m11: b11 } = this;

  const r00 = a00 * b00 + a10 * b01;
  const r01 = a01 * b00 + a11 * b01;
  const r10 = a00 * b10 + a10 * b11;
  const r11 = a01 * b10 + a11 * b11;
  return out ? out.set(r00, r01, r10, r11) : this.set(r00, r01, r10, r11);
 }

 // ============ Instance Methods - Transformations ============

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
 transformVector(vector: ReadonlyVector2, out?: Vector2): Vector2 {
  const { x, y } = vector;
  return Vector2.fromValues(this.m00 * x + this.m10 * y, this.m01 * x + this.m11 * y, out);
 }

 /**
  * Rotates this matrix by an angle.
  * @param angle - Angle in radians
  * @param out - Optional output object
  * @returns Rotated matrix
  */
 rotate(angle: number, out?: Matrix2): Matrix2 {
  const { cos, sin } = sinCos(angle);
  const { m00, m01, m10, m11 } = this;

  const r00 = m00 * cos + m10 * sin;
  const r01 = m01 * cos + m11 * sin;
  const r10 = m00 * -sin + m10 * cos;
  const r11 = m01 * -sin + m11 * cos;
  return out ? out.set(r00, r01, r10, r11) : this.set(r00, r01, r10, r11);
 }

 /**
  * Scales this matrix.
  * @param scale - Scale factors
  * @param out - Optional output object
  * @returns Scaled matrix
  */
 scaleBy(scale: ReadonlyVector2 | number, out?: Matrix2): Matrix2 {
  if (typeof scale === 'number') {
   return this.scale(scale, out);
  }

  const r00 = this.m00 * scale.x;
  const r01 = this.m01 * scale.x;
  const r10 = this.m10 * scale.y;
  const r11 = this.m11 * scale.y;
  return out ? out.set(r00, r01, r10, r11) : this.set(r00, r01, r10, r11);
 }

 // ============ Instance Methods - Column/Row Access ============

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
 getColumn(index: number, out?: Vector2): Vector2 {
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
 setColumn(index: number, column: ReadonlyVector2Like): this {
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
 getRow(index: number, out?: Vector2): Vector2 {
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
 setRow(index: number, row: ReadonlyVector2Like): this {
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

 // ============ Instance Methods - Comparison ============

 /**
  * Tests if this matrix equals another within tolerance.
  * @param other - Matrix to compare
  * @param epsilon - Tolerance (default: EPSILON)
  * @returns True if all components are within tolerance
  */
 equals(other: ReadonlyMatrix2, epsilon: number = EPSILON): boolean {
  return (
   nearEquals(this.m00, other.m00, epsilon) &&
   nearEquals(this.m01, other.m01, epsilon) &&
   nearEquals(this.m10, other.m10, epsilon) &&
   nearEquals(this.m11, other.m11, epsilon)
  );
 }

 /**
  * Tests if this is the identity matrix.
  * @param epsilon - Tolerance (default: EPSILON)
  * @returns True if matrix is identity
  */
 isIdentity(epsilon: number = EPSILON): boolean {
  return (
   nearEquals(this.m00, 1, epsilon) &&
   isNearZero(this.m01, epsilon) &&
   isNearZero(this.m10, epsilon) &&
   nearEquals(this.m11, 1, epsilon)
  );
 }

 // ============ Instance Methods - Interpolation ============

 /**
  * Linear interpolation with another matrix.
  * @param other - Target matrix
  * @param t - Interpolation factor [0, 1], clamped
  * @param out - Optional output object
  * @returns Interpolated matrix
  *
  * @example
  * ```typescript
  * const a = Matrix2.IDENTITY;
  * const b = Matrix2.fromRotation(Math.PI / 2);
  * a.lerp(b, 0.5); // Halfway interpolation
  * ```
  */
 lerp(other: ReadonlyMatrix2, t: number, out?: Matrix2): Matrix2 {
  const clamped = saturate(t);
  const r00 = lerp(this.m00, other.m00, clamped);
  const r01 = lerp(this.m01, other.m01, clamped);
  const r10 = lerp(this.m10, other.m10, clamped);
  const r11 = lerp(this.m11, other.m11, clamped);
  return out ? out.set(r00, r01, r10, r11) : this.set(r00, r01, r10, r11);
 }

 /**
  * Alias for {@link scale}. Multiplies all components by a scalar.
  * @param scalar - Scale factor
  * @param out - Optional output object
  * @returns Scaled matrix
  */
 multiplyScalar(scalar: number, out?: Matrix2): Matrix2 {
  return this.scale(scalar, out);
 }

 // ============ Instance Methods - Conversion ============

 /**
  * Converts to array form.
  * @param out - Optional array to fill
  * @param offset - Starting index (default: 0)
  * @param columnMajor - If true, use column-major order (default: true)
  * @returns Array with matrix elements
  */
 toArray(out?: number[], offset = 0, columnMajor = true): number[] {
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
 toObject(): Matrix2Like {
  return { m00: this.m00, m01: this.m01, m10: this.m10, m11: this.m11 };
 }

 /**
  * Alias for toObject (JSON serialization).
  * @returns Object with matrix components.
  */
 toJSON(): Matrix2Like {
  return this.toObject();
 }

 /**
  * Converts to string representation.
  * @param precision - Number of decimal places (default: 4)
  * @returns String representation
  */
 toString(precision = 4): string {
  const p = (n: number) => n.toFixed(precision);
  return `Matrix2(\n  ${p(this.m00)}, ${p(this.m10)}\n  ${p(this.m01)}, ${p(this.m11)}\n)`;
 }

 /**
  * Creates a clone of this matrix.
  * @returns New matrix with same components
  */
 clone(): Matrix2 {
  return new Matrix2(this.m00, this.m01, this.m10, this.m11);
 }
}
