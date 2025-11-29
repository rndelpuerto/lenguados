/**
 * @file src/batch/transform2-batch.ts
 * @module @lenguados/math2d/batch
 * @description Deterministic batch utilities for Transform2 data stored in Float32Arrays.
 */

import { normalizeRadians } from '../auxiliary/angle/normalization';
import { Transform2, type ReadonlyTransform2 } from '../core/transform2';
import { DeterministicMath } from '../deterministic/deterministic-math';

/**
 * Batch helpers operating on packed transforms in the layout:
 * `[posX, posY, rotCos, rotSin, scaleX, scaleY]`.
 */
export class Transform2Batch {
 static readonly ELEMENTS_PER_TRANSFORM = 6;
 static readonly POS_X = 0;
 static readonly POS_Y = 1;
 static readonly ROT_C = 2;
 static readonly ROT_S = 3;
 static readonly SCALE_X = 4;
 static readonly SCALE_Y = 5;

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
 /* Composition */
 /* ========================================================================== */

 static applyParentInPlace(
  transforms: Float32Array,
  parent: ReadonlyTransform2,
  count?: number,
 ): void {
  const available = Math.floor(transforms.length / this.ELEMENTS_PER_TRANSFORM);
  const n = this.clampCount(count, available);
  if (n === 0) return;

  const parentCos = DeterministicMath.cos(parent.rotation);
  const parentSin = DeterministicMath.sin(parent.rotation);
  const parentScaleX = parent.scale.x;
  const parentScaleY = parent.scale.y;
  const parentPosX = parent.position.x;
  const parentPosY = parent.position.y;

  for (let index = 0; index < n; index++) {
   const offset = index * this.ELEMENTS_PER_TRANSFORM;
   const childPosX = transforms[offset + this.POS_X]!;
   const childPosY = transforms[offset + this.POS_Y]!;
   const childCos = transforms[offset + this.ROT_C]!;
   const childSin = transforms[offset + this.ROT_S]!;
   const childScaleX = transforms[offset + this.SCALE_X]!;
   const childScaleY = transforms[offset + this.SCALE_Y]!;

   transforms[offset + this.SCALE_X] = childScaleX * parentScaleX;
   transforms[offset + this.SCALE_Y] = childScaleY * parentScaleY;

   const combinedCos = childCos * parentCos - childSin * parentSin;
   const combinedSin = childCos * parentSin + childSin * parentCos;
   transforms[offset + this.ROT_C] = combinedCos;
   transforms[offset + this.ROT_S] = combinedSin;

   const scaledX = childPosX * parentScaleX;
   const scaledY = childPosY * parentScaleY;
   transforms[offset + this.POS_X] = parentCos * scaledX - parentSin * scaledY + parentPosX;
   transforms[offset + this.POS_Y] = parentSin * scaledX + parentCos * scaledY + parentPosY;
  }
 }

 static transformPoints(
  points: Float32Array,
  transforms: Float32Array,
  out: Float32Array,
  count: number,
 ): Float32Array {
  const transformCount = Math.floor(transforms.length / this.ELEMENTS_PER_TRANSFORM);
  const pointCount = Math.floor(points.length / 2);
  const outCount = Math.floor(out.length / 2);
  const n = this.clampCount(count, transformCount, pointCount, outCount);
  if (n === 0) return out;

  for (let index = 0; index < n; index++) {
   const tOffset = index * this.ELEMENTS_PER_TRANSFORM;
   const pOffset = index * 2;

   const posX = transforms[tOffset + this.POS_X]!;
   const posY = transforms[tOffset + this.POS_Y]!;
   const rotC = transforms[tOffset + this.ROT_C]!;
   const rotS = transforms[tOffset + this.ROT_S]!;
   const scaleX = transforms[tOffset + this.SCALE_X]!;
   const scaleY = transforms[tOffset + this.SCALE_Y]!;

   const x = points[pOffset]!;
   const y = points[pOffset + 1]!;
   const scaledX = x * scaleX;
   const scaledY = y * scaleY;
   out[pOffset] = rotC * scaledX - rotS * scaledY + posX;
   out[pOffset + 1] = rotS * scaledX + rotC * scaledY + posY;
  }

  return out;
 }

 /* ========================================================================== */
 /* Bulk writers */
 /* ========================================================================== */

 static setIdentities(transforms: Float32Array, count: number): void {
  const available = Math.floor(transforms.length / this.ELEMENTS_PER_TRANSFORM);
  const n = this.clampCount(count, available);
  for (let index = 0; index < n; index++) {
   const offset = index * this.ELEMENTS_PER_TRANSFORM;
   transforms[offset + this.POS_X] = 0;
   transforms[offset + this.POS_Y] = 0;
   transforms[offset + this.ROT_C] = 1;
   transforms[offset + this.ROT_S] = 0;
   transforms[offset + this.SCALE_X] = 1;
   transforms[offset + this.SCALE_Y] = 1;
  }
 }

 static setPositions(transforms: Float32Array, positions: Float32Array, count: number): void {
  const transformCount = Math.floor(transforms.length / this.ELEMENTS_PER_TRANSFORM);
  const positionsCount = Math.floor(positions.length / 2);
  const n = this.clampCount(count, transformCount, positionsCount);
  for (let index = 0; index < n; index++) {
   const tOffset = index * this.ELEMENTS_PER_TRANSFORM;
   const pOffset = index * 2;
   transforms[tOffset + this.POS_X] = positions[pOffset]!;
   transforms[tOffset + this.POS_Y] = positions[pOffset + 1]!;
  }
 }

 static setRotations(transforms: Float32Array, angles: Float32Array, count: number): void {
  const transformCount = Math.floor(transforms.length / this.ELEMENTS_PER_TRANSFORM);
  const n = this.clampCount(count, transformCount, angles.length);
  for (let index = 0; index < n; index++) {
   const offset = index * this.ELEMENTS_PER_TRANSFORM;
   const normalized = normalizeRadians(angles[index]!);
   transforms[offset + this.ROT_C] = DeterministicMath.cos(normalized);
   transforms[offset + this.ROT_S] = DeterministicMath.sin(normalized);
  }
 }

 static setScales(transforms: Float32Array, scales: Float32Array, count: number): void {
  const transformCount = Math.floor(transforms.length / this.ELEMENTS_PER_TRANSFORM);
  const scalesCount = Math.floor(scales.length / 2);
  const n = this.clampCount(count, transformCount, scalesCount);
  for (let index = 0; index < n; index++) {
   const tOffset = index * this.ELEMENTS_PER_TRANSFORM;
   const sOffset = index * 2;
   transforms[tOffset + this.SCALE_X] = scales[sOffset]!;
   transforms[tOffset + this.SCALE_Y] = scales[sOffset + 1]!;
  }
 }

 /* ========================================================================== */
 /* Conversion helpers */
 /* ========================================================================== */

 static toMatrices(transforms: Float32Array, matrices: Float32Array, count: number): void {
  const transformCount = Math.floor(transforms.length / this.ELEMENTS_PER_TRANSFORM);
  const matrixCount = Math.floor(matrices.length / 9);
  const n = this.clampCount(count, transformCount, matrixCount);
  for (let index = 0; index < n; index++) {
   const tOffset = index * this.ELEMENTS_PER_TRANSFORM;
   const mOffset = index * 9;

   const posX = transforms[tOffset + this.POS_X]!;
   const posY = transforms[tOffset + this.POS_Y]!;
   const rotC = transforms[tOffset + this.ROT_C]!;
   const rotS = transforms[tOffset + this.ROT_S]!;
   const scaleX = transforms[tOffset + this.SCALE_X]!;
   const scaleY = transforms[tOffset + this.SCALE_Y]!;

   matrices[mOffset] = rotC * scaleX;
   matrices[mOffset + 1] = -rotS * scaleX;
   matrices[mOffset + 2] = posX;
   matrices[mOffset + 3] = rotS * scaleY;
   matrices[mOffset + 4] = rotC * scaleY;
   matrices[mOffset + 5] = posY;
   matrices[mOffset + 6] = 0;
   matrices[mOffset + 7] = 0;
   matrices[mOffset + 8] = 1;
  }
 }

 static toFloat32Array(transforms: ReadonlyTransform2[], out?: Float32Array): Float32Array {
  const requiredLength = transforms.length * this.ELEMENTS_PER_TRANSFORM;
  const result = out ?? new Float32Array(requiredLength);
  if (result.length < requiredLength) {
   throw new RangeError(
    `Transform2Batch.toFloat32Array: output length ${result.length} is smaller than required ${requiredLength}`,
   );
  }

  for (let index = 0; index < transforms.length; index++) {
   const transform = transforms[index]!;
   const offset = index * this.ELEMENTS_PER_TRANSFORM;
   const normalized = normalizeRadians(transform.rotation);
   result[offset + this.POS_X] = transform.position.x;
   result[offset + this.POS_Y] = transform.position.y;
   result[offset + this.ROT_C] = DeterministicMath.cos(normalized);
   result[offset + this.ROT_S] = DeterministicMath.sin(normalized);
   result[offset + this.SCALE_X] = transform.scale.x;
   result[offset + this.SCALE_Y] = transform.scale.y;
  }

  return result;
 }

 static fromFloat32Array(data: Float32Array, count?: number): Transform2[] {
  const available = Math.floor(data.length / this.ELEMENTS_PER_TRANSFORM);
  const n = this.clampCount(count, available);
  const transforms: Transform2[] = [];
  for (let index = 0; index < n; index++) {
   const offset = index * this.ELEMENTS_PER_TRANSFORM;
   const transform = new Transform2();
   transform.position.set(data[offset + this.POS_X]!, data[offset + this.POS_Y]!);
   const rotC = data[offset + this.ROT_C]!;
   const rotS = data[offset + this.ROT_S]!;
   transform.rotation = normalizeRadians(DeterministicMath.atan2(rotS, rotC));
   transform.scale.set(data[offset + this.SCALE_X]!, data[offset + this.SCALE_Y]!);
   transforms.push(transform);
  }
  return transforms;
 }
}
