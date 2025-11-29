/**
 * @file src/batch/matrix2-batch.ts
 * @module @lenguados/math2d/batch
 * @description Deterministic batch helpers for packed 2×2 matrices.
 */

import { normalizeRadians } from '../auxiliary/angle/normalization';
import { EPSILON } from '../auxiliary/scalar/constants';
import { Matrix2, type ReadonlyMatrix2 } from '../core/matrix2';
import { DeterministicMath } from '../deterministic/deterministic-math';

export class Matrix2Batch {
 static readonly ELEMENTS_PER_MATRIX = 4;

 private static clampCount(requested: number | undefined, ...caps: number[]): number {
  if (caps.length === 0) {
   return requested ?? 0;
  }
  const available = Math.min(...caps);
  if (available <= 0) {
   return 0;
  }
  if (requested === undefined) {
   return available;
  }
  return Math.min(requested, available);
 }

 /* ========================================================================== */
 /* Core operations */
 /* ========================================================================== */

 static multiplyInPlace(matrices: Float32Array, multiplier: ReadonlyMatrix2, count?: number): void {
  const available = Math.floor(matrices.length / this.ELEMENTS_PER_MATRIX);
  const n = this.clampCount(count, available);
  if (n === 0) return;

  const { m00: b00, m01: b01, m10: b10, m11: b11 } = multiplier;

  for (let index = 0; index < n; index++) {
   const offset = index * this.ELEMENTS_PER_MATRIX;

   const a00 = matrices[offset]!;
   const a01 = matrices[offset + 1]!;
   const a10 = matrices[offset + 2]!;
   const a11 = matrices[offset + 3]!;

   matrices[offset] = a00 * b00 + a01 * b10;
   matrices[offset + 1] = a00 * b01 + a01 * b11;
   matrices[offset + 2] = a10 * b00 + a11 * b10;
   matrices[offset + 3] = a10 * b01 + a11 * b11;
  }
 }

 static transposeInPlace(matrices: Float32Array, count?: number): void {
  const available = Math.floor(matrices.length / this.ELEMENTS_PER_MATRIX);
  const n = this.clampCount(count, available);
  for (let index = 0; index < n; index++) {
   const offset = index * this.ELEMENTS_PER_MATRIX;
   const temporary = matrices[offset + 1]!;
   matrices[offset + 1] = matrices[offset + 2]!;
   matrices[offset + 2] = temporary;
  }
 }

 static invertInPlace(matrices: Float32Array, count?: number): number {
  const available = Math.floor(matrices.length / this.ELEMENTS_PER_MATRIX);
  const n = this.clampCount(count, available);
  let inverted = 0;

  for (let index = 0; index < n; index++) {
   const offset = index * this.ELEMENTS_PER_MATRIX;
   const m00 = matrices[offset]!;
   const m01 = matrices[offset + 1]!;
   const m10 = matrices[offset + 2]!;
   const m11 = matrices[offset + 3]!;

   const det = m00 * m11 - m01 * m10;
   if (Math.abs(det) <= EPSILON) {
    continue;
   }

   const invDet = 1 / det;
   matrices[offset] = m11 * invDet;
   matrices[offset + 1] = -m01 * invDet;
   matrices[offset + 2] = -m10 * invDet;
   matrices[offset + 3] = m00 * invDet;
   inverted++;
  }

  return inverted;
 }

 /* ========================================================================== */
 /* Angle utilities */
 /* ========================================================================== */

 static extractAngles(matrices: Float32Array, angles: Float32Array, count?: number): void {
  const available = Math.floor(matrices.length / this.ELEMENTS_PER_MATRIX);
  const outAvailable = angles.length;
  const n = this.clampCount(count, available, outAvailable);
  for (let index = 0; index < n; index++) {
   const offset = index * this.ELEMENTS_PER_MATRIX;
   angles[index] = DeterministicMath.atan2(matrices[offset + 1]!, matrices[offset]!);
  }
 }

 static setRotations(matrices: Float32Array, angles: Float32Array, count: number): void {
  const available = Math.floor(matrices.length / this.ELEMENTS_PER_MATRIX);
  const n = this.clampCount(count, available, angles.length);
  for (let index = 0; index < n; index++) {
   const offset = index * this.ELEMENTS_PER_MATRIX;
   const normalized = normalizeRadians(angles[index]!);
   const cos = DeterministicMath.cos(normalized);
   const sin = DeterministicMath.sin(normalized);
   matrices[offset] = cos;
   matrices[offset + 1] = -sin;
   matrices[offset + 2] = sin;
   matrices[offset + 3] = cos;
  }
 }

 /* ========================================================================== */
 /* Initialization */
 /* ========================================================================== */

 static setIdentities(matrices: Float32Array, count: number): void {
  const available = Math.floor(matrices.length / this.ELEMENTS_PER_MATRIX);
  const n = this.clampCount(count, available);
  for (let index = 0; index < n; index++) {
   const offset = index * this.ELEMENTS_PER_MATRIX;
   matrices[offset] = 1;
   matrices[offset + 1] = 0;
   matrices[offset + 2] = 0;
   matrices[offset + 3] = 1;
  }
 }

 /* ========================================================================== */
 /* Conversion helpers */
 /* ========================================================================== */

 static toFloat32Array(matrices: ReadonlyMatrix2[], out?: Float32Array): Float32Array {
  const required = matrices.length * this.ELEMENTS_PER_MATRIX;
  const result = out ?? new Float32Array(required);
  if (result.length < required) {
   throw new RangeError(
    `Matrix2Batch.toFloat32Array: output length ${result.length} is smaller than required ${required}`,
   );
  }

  for (let index = 0; index < matrices.length; index++) {
   const m = matrices[index]!;
   const offset = index * this.ELEMENTS_PER_MATRIX;
   result[offset] = m.m00;
   result[offset + 1] = m.m01;
   result[offset + 2] = m.m10;
   result[offset + 3] = m.m11;
  }

  return result;
 }

 static fromFloat32Array(data: Float32Array, count?: number): Matrix2[] {
  const available = Math.floor(data.length / this.ELEMENTS_PER_MATRIX);
  const n = this.clampCount(count, available);
  const result: Matrix2[] = [];
  for (let index = 0; index < n; index++) {
   const offset = index * this.ELEMENTS_PER_MATRIX;
   result.push(new Matrix2(data[offset]!, data[offset + 1]!, data[offset + 2]!, data[offset + 3]!));
  }
  return result;
 }
}
