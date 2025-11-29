/**
 * @file core/matrix3.ts
 * @module @lenguados/math2d/core
 * @description Deterministic 3×3 matrix implementation for 2D affine transformations.
 */

import { sinCos } from '../auxiliary/angle/operations';
import { safeDivide, safeSqrt } from '../auxiliary/numeric/safety';
import { saturate } from '../auxiliary/scalar/arithmetic';
import { isNearZero, nearEquals } from '../auxiliary/scalar/comparison';
import { EPSILON } from '../auxiliary/scalar/constants';
import { lerp } from '../auxiliary/scalar/interpolation';
import { DeterministicMath } from '../deterministic/deterministic-math';
import type { Matrix3Like, ReadonlyMatrix3Like, ReadonlyVector2Like } from '../types';
import { NumericalValidator } from '../validation/numerical-validator';

import { Matrix2, type ReadonlyMatrix2 } from './matrix2';
import { Vector2 } from './vector2';

export type ReadonlyMatrix3 = Readonly<Matrix3>;

/**
 * Column-major 3×3 matrix storing 2D affine transforms. Instance methods mutate `this` to support
 * fluent APIs, while static helpers stay pure and accept optional `out` parameters for reuse.
 */
export class Matrix3 implements Matrix3Like {
 public m00: number;
 public m01: number;
 public m02: number;
 public m10: number;
 public m11: number;
 public m12: number;
 public m20: number;
 public m21: number;
 public m22: number;

 constructor(m00 = 1, m01 = 0, m02 = 0, m10 = 0, m11 = 1, m12 = 0, m20 = 0, m21 = 0, m22 = 1) {
  this.m00 = m00;
  this.m01 = m01;
  this.m02 = m02;
  this.m10 = m10;
  this.m11 = m11;
  this.m12 = m12;
  this.m20 = m20;
  this.m21 = m21;
  this.m22 = m22;
 }

 /* ========================================================================== */
 /* Helpers */
 /* ========================================================================== */

 private static ensureOut(out?: Matrix3): Matrix3 {
  return out ?? new Matrix3();
 }

 private static sanitize(value: number, label: string): number {
  return NumericalValidator.validateFinite(value, label);
 }

 /* ========================================================================== */
 /* Constants */
 /* ========================================================================== */

 /** Identity matrix (no transformation). */
 static readonly IDENTITY = Object.freeze(new Matrix3()) as ReadonlyMatrix3;

 /** Zero matrix. */
 static readonly ZERO = Object.freeze(new Matrix3(0, 0, 0, 0, 0, 0, 0, 0, 0)) as ReadonlyMatrix3;

 /** Flip horizontally (mirror across Y axis). */
 static readonly FLIP_X = Object.freeze(new Matrix3(-1, 0, 0, 0, 1, 0, 0, 0, 1)) as ReadonlyMatrix3;

 /** Flip vertically (mirror across X axis). */
 static readonly FLIP_Y = Object.freeze(new Matrix3(1, 0, 0, 0, -1, 0, 0, 0, 1)) as ReadonlyMatrix3;

 /** 90° counter-clockwise rotation. */
 static readonly ROTATE_90 = Object.freeze(
  new Matrix3(0, 1, 0, -1, 0, 0, 0, 0, 1),
 ) as ReadonlyMatrix3;

 /** 180° rotation. */
 static readonly ROTATE_180 = Object.freeze(
  new Matrix3(-1, 0, 0, 0, -1, 0, 0, 0, 1),
 ) as ReadonlyMatrix3;

 /** 270° counter-clockwise rotation (90° clockwise). */
 static readonly ROTATE_270 = Object.freeze(
  new Matrix3(0, -1, 0, 1, 0, 0, 0, 0, 1),
 ) as ReadonlyMatrix3;

 /* ========================================================================== */
 /* Static factories */
 /* ========================================================================== */

 static fromValues(
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

 static clone(source: ReadonlyMatrix3Like, out?: Matrix3): Matrix3 {
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

 static fromTranslation(translation: ReadonlyVector2Like, out?: Matrix3): Matrix3 {
  return Matrix3.ensureOut(out).set(1, 0, 0, 0, 1, 0, translation.x, translation.y, 1);
 }

 static fromRotation(angle: number, out?: Matrix3): Matrix3 {
  const { cos, sin } = sinCos(angle);
  return Matrix3.ensureOut(out).set(cos, sin, 0, -sin, cos, 0, 0, 0, 1);
 }

 static fromScale(scale: ReadonlyVector2Like | number, out?: Matrix3): Matrix3 {
  const target = Matrix3.ensureOut(out);
  if (typeof scale === 'number') {
   return target.set(scale, 0, 0, 0, scale, 0, 0, 0, 1);
  }
  return target.set(scale.x, 0, 0, 0, scale.y, 0, 0, 0, 1);
 }

 static fromMatrix2(matrix: ReadonlyMatrix2, out?: Matrix3): Matrix3 {
  return Matrix3.ensureOut(out).set(matrix.m00, matrix.m01, 0, matrix.m10, matrix.m11, 0, 0, 0, 1);
 }

 static fromTransform(
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

 static ortho(left: number, right: number, bottom: number, top: number, out?: Matrix3): Matrix3 {
  const width = right - left;
  const height = top - bottom;
  const tx = -(right + left) / width;
  const ty = -(top + bottom) / height;
  return Matrix3.ensureOut(out).set(2 / width, 0, 0, 0, 2 / height, 0, tx, ty, 1);
 }

 static fromArray(
  array: ArrayLike<number>,
  offset = 0,
  columnMajor = true,
  out?: Matrix3,
 ): Matrix3 {
  if (offset < 0 || offset + 8 >= array.length) {
   throw new RangeError(
    `Matrix3.fromArray: offset ${offset} is out of bounds for array of length ${array.length}`,
   );
  }

  const values = new Array<number>(9);
  for (let index = 0; index < 9; index++) {
   values[index] = Matrix3.sanitize(array[offset + index]!, `Matrix3.fromArray:${offset + index}`);
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

 /* ========================================================================== */
 /* Static operations */
 /* ========================================================================== */

 static add(a: ReadonlyMatrix3Like, b: ReadonlyMatrix3Like, out?: Matrix3): Matrix3 {
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

 static subtract(a: ReadonlyMatrix3Like, b: ReadonlyMatrix3Like, out?: Matrix3): Matrix3 {
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

 static multiply(a: ReadonlyMatrix3Like, b: ReadonlyMatrix3Like, out?: Matrix3): Matrix3 {
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

 static scale(matrix: ReadonlyMatrix3Like, scalar: number, out?: Matrix3): Matrix3 {
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

 static transpose(matrix: ReadonlyMatrix3Like, out?: Matrix3): Matrix3 {
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

 static inverse(matrix: ReadonlyMatrix3Like, out?: Matrix3): Matrix3 {
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
   throw new Error('Matrix3.inverse: matrix is singular');
  }

  const invDet = safeDivide(1, det);
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

 static transformPoint(
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

 static transformVector(
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
  * Negates all elements of a matrix.
  * @param matrix - Matrix to negate
  * @param out - Optional output object
  * @returns Negated matrix
  */
 static negate(matrix: ReadonlyMatrix3Like, out?: Matrix3): Matrix3 {
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

 /**
  * Linear interpolation between two matrices.
  * @param a - Start matrix
  * @param b - End matrix
  * @param t - Interpolation factor [0, 1], clamped
  * @param out - Optional output object
  * @returns Interpolated matrix
  */
 static lerp(a: ReadonlyMatrix3Like, b: ReadonlyMatrix3Like, t: number, out?: Matrix3): Matrix3 {
  const clamped = saturate(t);
  return Matrix3.ensureOut(out).set(
   lerp(a.m00, b.m00, clamped),
   lerp(a.m01, b.m01, clamped),
   lerp(a.m02, b.m02, clamped),
   lerp(a.m10, b.m10, clamped),
   lerp(a.m11, b.m11, clamped),
   lerp(a.m12, b.m12, clamped),
   lerp(a.m20, b.m20, clamped),
   lerp(a.m21, b.m21, clamped),
   lerp(a.m22, b.m22, clamped),
  );
 }

 /**
  * Tests if two matrices are approximately equal.
  * @param a - First matrix
  * @param b - Second matrix
  * @param epsilon - Tolerance (default: EPSILON)
  * @returns True if all components are within tolerance
  */
 static equals(a: ReadonlyMatrix3Like, b: ReadonlyMatrix3Like, epsilon: number = EPSILON): boolean {
  return (
   nearEquals(a.m00, b.m00, epsilon) &&
   nearEquals(a.m01, b.m01, epsilon) &&
   nearEquals(a.m02, b.m02, epsilon) &&
   nearEquals(a.m10, b.m10, epsilon) &&
   nearEquals(a.m11, b.m11, epsilon) &&
   nearEquals(a.m12, b.m12, epsilon) &&
   nearEquals(a.m20, b.m20, epsilon) &&
   nearEquals(a.m21, b.m21, epsilon) &&
   nearEquals(a.m22, b.m22, epsilon)
  );
 }

 /**
  * Tests if a matrix is the identity matrix.
  * @param matrix - Matrix to test
  * @param epsilon - Tolerance (default: EPSILON)
  * @returns True if matrix is identity
  */
 static isIdentity(matrix: ReadonlyMatrix3Like, epsilon: number = EPSILON): boolean {
  return (
   nearEquals(matrix.m00, 1, epsilon) &&
   isNearZero(matrix.m01, epsilon) &&
   isNearZero(matrix.m02, epsilon) &&
   isNearZero(matrix.m10, epsilon) &&
   nearEquals(matrix.m11, 1, epsilon) &&
   isNearZero(matrix.m12, epsilon) &&
   isNearZero(matrix.m20, epsilon) &&
   isNearZero(matrix.m21, epsilon) &&
   nearEquals(matrix.m22, 1, epsilon)
  );
 }

 /**
  * Calculates the determinant of a matrix.
  * @param matrix - Matrix to calculate determinant of
  * @returns Determinant value
  */
 static determinant(matrix: ReadonlyMatrix3Like): number {
  return (
   matrix.m00 * (matrix.m11 * matrix.m22 - matrix.m12 * matrix.m21) -
   matrix.m10 * (matrix.m01 * matrix.m22 - matrix.m02 * matrix.m21) +
   matrix.m20 * (matrix.m01 * matrix.m12 - matrix.m02 * matrix.m11)
  );
 }

 /**
  * Decomposes an affine matrix into translation, rotation, and scale.
  * @param matrix - Matrix to decompose
  * @returns Object with translation (Vector2), rotation (radians), and scale (Vector2)
  */
 static decompose(matrix: ReadonlyMatrix3Like): {
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

 /* ========================================================================== */
 /* Instance setters */
 /* ========================================================================== */

 set(
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

 copy(matrix: ReadonlyMatrix3Like): this {
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

 identity(): this {
  return this.set(1, 0, 0, 0, 1, 0, 0, 0, 1);
 }

 /* ========================================================================== */
 /* Queries */
 /* ========================================================================== */

 getTranslation(out?: Vector2): Vector2 {
  return Vector2.fromValues(this.m20, this.m21, out);
 }

 /**
  * Extracts scale factors from the matrix.
  * Uses deterministic sqrt for cross-platform reproducibility.
  * @param out - Optional output vector
  * @returns Scale factors for each axis
  */
 getScale(out?: Vector2): Vector2 {
  const sx = safeSqrt(this.m00 * this.m00 + this.m01 * this.m01);
  const sy = safeSqrt(this.m10 * this.m10 + this.m11 * this.m11);
  return Vector2.fromValues(sx, sy, out);
 }

 getRotation(): number {
  // Extract rotation accounting for scale in the first column
  const scaleX = safeSqrt(this.m00 * this.m00 + this.m01 * this.m01);
  if (isNearZero(scaleX)) {
   return 0;
  }
  return DeterministicMath.atan2(this.m01 / scaleX, this.m00 / scaleX);
 }

 determinant(): number {
  return (
   this.m00 * (this.m11 * this.m22 - this.m12 * this.m21) -
   this.m10 * (this.m01 * this.m22 - this.m02 * this.m21) +
   this.m20 * (this.m01 * this.m12 - this.m02 * this.m11)
  );
 }

 isInvertible(epsilon: number = EPSILON): boolean {
  return !isNearZero(this.determinant(), epsilon);
 }

 isAffine(epsilon: number = EPSILON): boolean {
  return (
   isNearZero(this.m02, epsilon) &&
   isNearZero(this.m12, epsilon) &&
   nearEquals(this.m22, 1, epsilon)
  );
 }

 /* ========================================================================== */
 /* Readonly Getters */
 /* ========================================================================== */

 /**
  * Returns a new transposed matrix without modifying this one.
  * @returns Transposed matrix
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
   return new Matrix3(); // Return identity for singular
  }

  const invDet = safeDivide(1, det);
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
  */
 public get upperLeft2x2(): Matrix2 {
  return new Matrix2(this.m00, this.m01, this.m10, this.m11);
 }

 /**
  * Returns the translation component as a Vector2.
  * @returns Translation vector
  */
 public get translation(): Vector2 {
  return new Vector2(this.m20, this.m21);
 }

 /**
  * Returns the diagonal elements as a 3-element array.
  * @returns Diagonal array [m00, m11, m22]
  */
 public get diagonal(): [number, number, number] {
  return [this.m00, this.m11, this.m22];
 }

 /* ========================================================================== */
 /* Arithmetic */
 /* ========================================================================== */

 /**
  * Multiplies this matrix by another.
  * @param other - Matrix to multiply by
  * @param out - Optional output object
  * @returns Product matrix
  */
 multiply(other: ReadonlyMatrix3Like, out?: Matrix3): Matrix3 {
  const r = Matrix3.multiply(this, other, out ?? this);
  return out ? r : this;
 }

 /**
  * Adds another matrix to this one.
  * @param other - Matrix to add
  * @param out - Optional output object
  * @returns Sum matrix
  */
 add(other: ReadonlyMatrix3Like, out?: Matrix3): Matrix3 {
  const r = Matrix3.add(this, other, out ?? this);
  return out ? r : this;
 }

 /**
  * Subtracts another matrix from this one.
  * @param other - Matrix to subtract
  * @param out - Optional output object
  * @returns Difference matrix
  */
 subtract(other: ReadonlyMatrix3Like, out?: Matrix3): Matrix3 {
  const r = Matrix3.subtract(this, other, out ?? this);
  return out ? r : this;
 }

 scale(scalar: number, out?: Matrix3): Matrix3 {
  const r = Matrix3.scale(this, scalar, out ?? this);
  return out ? r : this;
 }

 transpose(out?: Matrix3): Matrix3 {
  const r = Matrix3.transpose(this, out ?? this);
  return out ? r : this;
 }

 inverse(out?: Matrix3): Matrix3 {
  const r = Matrix3.inverse(this, out ?? this);
  return out ? r : this;
 }

 /**
  * Negates all elements of this matrix.
  * @param out - Optional output object
  * @returns Negated matrix
  */
 negate(out?: Matrix3): Matrix3 {
  const r = Matrix3.negate(this, out ?? this);
  return out ? r : this;
 }

 /**
  * Pre-multiplies this matrix by another (other × this).
  * @param other - Matrix to multiply by
  * @param out - Optional output object
  * @returns Product matrix
  */
 premultiply(other: ReadonlyMatrix3Like, out?: Matrix3): Matrix3 {
  const r = Matrix3.multiply(other, this, out ?? this);
  return out ? r : this;
 }

 /* ========================================================================== */
 /* Column/Row Access */
 /* ========================================================================== */

 /**
  * Gets a column of the matrix as a 3-element array.
  * @param index - Column index (0, 1, or 2)
  * @returns Column as [row0, row1, row2]
  */
 getColumn(index: number): [number, number, number] {
  if (index === 0) return [this.m00, this.m01, this.m02];
  if (index === 1) return [this.m10, this.m11, this.m12];
  if (index === 2) return [this.m20, this.m21, this.m22];
  throw new RangeError(`Matrix3.getColumn: index must be 0, 1, or 2, got ${index}`);
 }

 /**
  * Sets a column of the matrix.
  * @param index - Column index (0, 1, or 2)
  * @param values - Column values [row0, row1, row2]
  * @returns This matrix for chaining
  */
 setColumn(index: number, values: [number, number, number]): this {
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
  * @param index - Row index (0, 1, or 2)
  * @returns Row as [col0, col1, col2]
  */
 getRow(index: number): [number, number, number] {
  if (index === 0) return [this.m00, this.m10, this.m20];
  if (index === 1) return [this.m01, this.m11, this.m21];
  if (index === 2) return [this.m02, this.m12, this.m22];
  throw new RangeError(`Matrix3.getRow: index must be 0, 1, or 2, got ${index}`);
 }

 /**
  * Sets a row of the matrix.
  * @param index - Row index (0, 1, or 2)
  * @param values - Row values [col0, col1, col2]
  * @returns This matrix for chaining
  */
 setRow(index: number, values: [number, number, number]): this {
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

 /* ========================================================================== */
 /* Transform builders */
 /* ========================================================================== */

 translate(translation: ReadonlyVector2Like, out?: Matrix3): Matrix3 {
  const { m00, m01, m02, m10, m11, m12, m20, m21, m22 } = this;
  const tx = translation.x;
  const ty = translation.y;
  const r20 = m00 * tx + m10 * ty + m20;
  const r21 = m01 * tx + m11 * ty + m21;
  const r22 = m02 * tx + m12 * ty + m22;
  const target = out ?? this;
  return target.set(m00, m01, m02, m10, m11, m12, r20, r21, r22);
 }

 rotate(angle: number, out?: Matrix3): Matrix3 {
  const { cos, sin } = sinCos(angle);
  const { m00, m01, m02, m10, m11, m12, m20, m21, m22 } = this;
  const r00 = m00 * cos + m10 * sin;
  const r01 = m01 * cos + m11 * sin;
  const r02 = m02 * cos + m12 * sin;
  const r10 = m00 * -sin + m10 * cos;
  const r11 = m01 * -sin + m11 * cos;
  const r12 = m02 * -sin + m12 * cos;
  const target = out ?? this;
  return target.set(r00, r01, r02, r10, r11, r12, m20, m21, m22);
 }

 scaleBy(scale: ReadonlyVector2Like | number, out?: Matrix3): Matrix3 {
  const { m00, m01, m02, m10, m11, m12, m20, m21, m22 } = this;
  let sx: number;
  let sy: number;
  if (typeof scale === 'number') {
   sx = sy = scale;
  } else {
   sx = scale.x;
   sy = scale.y;
  }
  const target = out ?? this;
  return target.set(m00 * sx, m01 * sx, m02 * sx, m10 * sy, m11 * sy, m12 * sy, m20, m21, m22);
 }

 /* ========================================================================== */
 /* Transform application */
 /* ========================================================================== */

 transformPoint(point: ReadonlyVector2Like, out?: Vector2): Vector2 {
  return Matrix3.transformPoint(this, point, out);
 }

 transformVector(vector: ReadonlyVector2Like, out?: Vector2): Vector2 {
  return Matrix3.transformVector(this, vector, out);
 }

 /**
  * Transforms multiple points efficiently (batch operation).
  *
  * @param points - Array of points to transform
  * @param out - Optional output array (will be filled/extended as needed)
  * @returns Array of transformed points
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
 transformPoints(points: readonly ReadonlyVector2Like[], out: Vector2[] = []): Vector2[] {
  for (let index = 0; index < points.length; index++) {
   out[index] = this.transformPoint(points[index]!, out[index]);
  }
  return out;
 }

 /**
  * Transforms multiple vectors efficiently (batch operation).
  *
  * @param vectors - Array of vectors to transform
  * @param out - Optional output array (will be filled/extended as needed)
  * @returns Array of transformed vectors
  *
  * @remarks
  * Unlike points, vectors are not affected by translation.
  *
  * @category Batch Operations
  * @since 0.9.0
  */
 transformVectors(vectors: readonly ReadonlyVector2Like[], out: Vector2[] = []): Vector2[] {
  for (let index = 0; index < vectors.length; index++) {
   out[index] = this.transformVector(vectors[index]!, out[index]);
  }
  return out;
 }

 /* ========================================================================== */
 /* Comparison & interpolation */
 /* ========================================================================== */

 equals(other: ReadonlyMatrix3Like, epsilon: number = EPSILON): boolean {
  return (
   nearEquals(this.m00, other.m00, epsilon) &&
   nearEquals(this.m01, other.m01, epsilon) &&
   nearEquals(this.m02, other.m02, epsilon) &&
   nearEquals(this.m10, other.m10, epsilon) &&
   nearEquals(this.m11, other.m11, epsilon) &&
   nearEquals(this.m12, other.m12, epsilon) &&
   nearEquals(this.m20, other.m20, epsilon) &&
   nearEquals(this.m21, other.m21, epsilon) &&
   nearEquals(this.m22, other.m22, epsilon)
  );
 }

 isIdentity(epsilon: number = EPSILON): boolean {
  return (
   nearEquals(this.m00, 1, epsilon) &&
   isNearZero(this.m01, epsilon) &&
   isNearZero(this.m02, epsilon) &&
   isNearZero(this.m10, epsilon) &&
   nearEquals(this.m11, 1, epsilon) &&
   isNearZero(this.m12, epsilon) &&
   isNearZero(this.m20, epsilon) &&
   isNearZero(this.m21, epsilon) &&
   nearEquals(this.m22, 1, epsilon)
  );
 }

 /**
  * Linear interpolation with another matrix.
  * @param other - Target matrix
  * @param t - Interpolation factor [0, 1], clamped
  * @param out - Optional output object
  * @returns Interpolated matrix
  */
 lerp(other: ReadonlyMatrix3Like, t: number, out?: Matrix3): Matrix3 {
  const clamped = saturate(t);
  const target = out ?? this;
  return target.set(
   lerp(this.m00, other.m00, clamped),
   lerp(this.m01, other.m01, clamped),
   lerp(this.m02, other.m02, clamped),
   lerp(this.m10, other.m10, clamped),
   lerp(this.m11, other.m11, clamped),
   lerp(this.m12, other.m12, clamped),
   lerp(this.m20, other.m20, clamped),
   lerp(this.m21, other.m21, clamped),
   lerp(this.m22, other.m22, clamped),
  );
 }

 /**
  * Alias for {@link scale}. Multiplies all components by a scalar.
  * @param scalar - Scale factor
  * @param out - Optional output object
  * @returns Scaled matrix
  */
 multiplyScalar(scalar: number, out?: Matrix3): Matrix3 {
  return this.scale(scalar, out);
 }

 /* ========================================================================== */
 /* Conversion */
 /* ========================================================================== */

 toArray(out?: number[], offset = 0, columnMajor = true): number[] {
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

 toFloat32Array(out?: Float32Array, offset = 0, columnMajor = true): Float32Array {
  const array = out ?? new Float32Array(9);
  this.toArray(array as unknown as number[], offset, columnMajor);
  return array;
 }

 toMatrix2(out?: Matrix2): Matrix2 {
  return Matrix2.fromValues(this.m00, this.m01, this.m10, this.m11, out);
 }

 /* ========================================================================== */
 /* Serialization */
 /* ========================================================================== */

 /**
  * Converts the matrix to a plain object.
  * @returns Object with m00, m01, m02, m10, m11, m12, m20, m21, m22 properties
  *
  * @example
  * ```typescript
  * const m = Matrix3.fromRotation(Math.PI / 2);
  * const obj = m.toObject();
  * // { m00: 0, m01: 1, m02: 0, m10: -1, m11: 0, m12: 0, m20: 0, m21: 0, m22: 1 }
  * ```
  */
 toObject(): Matrix3Like {
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
  * @returns Object suitable for JSON serialization
  *
  * @example
  * ```typescript
  * const m = Matrix3.fromRotation(Math.PI / 2);
  * const json = JSON.stringify(m);
  * // '{"m00":0,"m01":1,...}'
  * ```
  */
 toJSON(): Matrix3Like {
  return this.toObject();
 }

 /**
  * Creates a human-readable string representation of the matrix.
  * @param precision - Number of decimal places (default: 4)
  * @returns Formatted string showing matrix layout
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
  */
 toString(precision = 4): string {
  const p = (value: number) => value.toFixed(precision);
  return `Matrix3(\n  ${p(this.m00)}, ${p(this.m10)}, ${p(this.m20)}\n  ${p(this.m01)}, ${p(this.m11)}, ${p(this.m21)}\n  ${p(this.m02)}, ${p(this.m12)}, ${p(this.m22)}\n)`;
 }

 /**
  * Creates a deep copy of this matrix.
  * @returns New Matrix3 with identical values
  *
  * @example
  * ```typescript
  * const m = Matrix3.fromRotation(Math.PI / 4);
  * const copy = m.clone();
  * copy.identity(); // Original unchanged
  * ```
  */
 clone(): Matrix3 {
  return Matrix3.clone(this);
 }
}
