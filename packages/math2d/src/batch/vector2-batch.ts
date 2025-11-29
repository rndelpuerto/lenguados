/**
 * @file batch/vector2-batch.ts
 * @module @lenguados/math2d/batch
 * @description Batch operations for Vector2 using TypedArrays for performance
 */

import { safeDivide, safeSqrt } from '../auxiliary/numeric/safety';
import { saturate } from '../auxiliary/scalar/arithmetic';
import { nearEquals, isNearZero } from '../auxiliary/scalar/comparison';
import { EPSILON } from '../auxiliary/scalar/constants';
import { lerp } from '../auxiliary/scalar/interpolation';
import type { ReadonlyMatrix2 } from '../core/matrix2';
import type { ReadonlyTransform2 } from '../core/transform2';
import { Vector2, type ReadonlyVector2 } from '../core/vector2';
import { DeterministicMath } from '../deterministic/deterministic-math';

import { Vector2BatchSimd } from './simd/vector2-simd';
import { Transform2Batch } from './transform2-batch';

/**
 * Batch operations for Vector2 arrays.
 *
 * @remarks
 * This class provides optimized batch operations on arrays of Vector2 data
 * using TypedArrays for better performance and cache locality. Data is stored
 * in Structure of Arrays (SoA) format for SIMD-friendly access patterns.
 *
 * @example
 * ```typescript
 * const batch = new Vector2Batch(1000);
 *
 * // Fill with initial values
 * batch.fill(new Vector2(1, 0));
 *
 * // Rotate all vectors by 45 degrees
 * const rotation = Rotation2.fromAngle(Math.PI / 4);
 * batch.transformAll(rotation);
 *
 * // Add a constant vector to all
 * batch.addScalar(new Vector2(10, 5));
 * ```
 */
export class Vector2Batch {
 /**
  * X components array.
  */
 public readonly x: Float32Array;

 /**
  * Y components array.
  */
 public readonly y: Float32Array;

 /**
  * Number of vectors in the batch.
  */
 public readonly count: number;

 /**
  * Creates a new Vector2 batch.
  * @param count - Number of vectors to allocate (must be > 0)
  * @param buffer - Optional SharedArrayBuffer for worker-friendly storage
  */
 public constructor(count: number, buffer?: SharedArrayBuffer) {
  if (!Number.isFinite(count) || count <= 0) {
   throw new RangeError(`Vector2Batch: count must be positive (received ${count})`);
  }

  this.count = count;

  if (buffer) {
   const bytesPerArray = count * Float32Array.BYTES_PER_ELEMENT;
   const requiredBytes = bytesPerArray * 2;
   if (buffer.byteLength < requiredBytes) {
    throw new RangeError(
     `Vector2Batch: buffer byteLength ${buffer.byteLength} is smaller than required ${requiredBytes}`,
    );
   }
   this.x = new Float32Array(buffer, 0, count);
   this.y = new Float32Array(buffer, bytesPerArray, count);
  } else {
   this.x = new Float32Array(count);
   this.y = new Float32Array(count);
  }
 }

 private ensureIndex(index: number, method: string): void {
  if (index < 0 || index >= this.count) {
   throw new RangeError(`${method}: index ${index} out of range [0, ${this.count})`);
  }
 }

 private ensureSameCount(other: Vector2Batch, method: string): void {
  if (other.count !== this.count) {
   throw new RangeError(`${method}: batch size mismatch (${this.count} vs ${other.count})`);
  }
 }

 // ============ Static Factory Methods ============

 /**
  * Creates a batch from an array of Vector2 objects.
  * @param vectors - Array of vectors
  * @returns New batch containing the vectors
  */
 static fromVectors(vectors: ReadonlyArray<ReadonlyVector2>): Vector2Batch {
  const batch = new Vector2Batch(vectors.length);

  for (let index = 0; index < vectors.length; index++) {
   const v = vectors[index]!;
   batch.x[index] = v.x;
   batch.y[index] = v.y;
  }

  return batch;
 }

 /**
  * Creates a batch from interleaved array data.
  * @param data - Array with format [x0, y0, x1, y1, ...]
  * @returns New batch
  */
 static fromArray(data: ArrayLike<number>): Vector2Batch {
  const count = Math.floor(data.length / 2);
  const batch = new Vector2Batch(count);

  for (let index = 0; index < count; index++) {
   batch.x[index] = data[index * 2]!;
   batch.y[index] = data[index * 2 + 1]!;
  }

  return batch;
 }

 // ============ Instance Methods - Getters/Setters ============

 /**
  * Gets a vector at the specified index.
  * @param index - Index of the vector
  * @param out - Optional output vector
  * @returns The vector at the index
  */
 get(index: number, out?: Vector2): Vector2 {
  this.ensureIndex(index, 'Vector2Batch.get');
  return (out || new Vector2()).set(this.x[index]!, this.y[index]!);
 }

 /**
  * Sets a vector at the specified index.
  * @param index - Index to set
  * @param vector - Vector to copy from
  */
 set(index: number, vector: ReadonlyVector2): void {
  this.ensureIndex(index, 'Vector2Batch.set');
  this.x[index] = vector.x;
  this.y[index] = vector.y;
 }

 /**
  * Fills all vectors with the same value.
  * @param vector - Vector to fill with
  */
 fill(vector: ReadonlyVector2): void {
  const { x, y } = vector;
  this.x.fill(x);
  this.y.fill(y);
 }

 /**
  * Copies data from another batch.
  * @param source - Source batch
  * @param sourceOffset - Start index in source (default: 0)
  * @param targetOffset - Start index in this batch (default: 0)
  * @param length - Number of vectors to copy (default: all)
  */
 copyFrom(source: Vector2Batch, sourceOffset = 0, targetOffset = 0, length?: number): void {
  if (sourceOffset < 0 || sourceOffset > source.count) {
   throw new RangeError(`Vector2Batch.copyFrom: sourceOffset ${sourceOffset} out of range`);
  }
  if (targetOffset < 0 || targetOffset > this.count) {
   throw new RangeError(`Vector2Batch.copyFrom: targetOffset ${targetOffset} out of range`);
  }

  const available = Math.min(source.count - sourceOffset, this.count - targetOffset);
  const copyCount = Math.min(length ?? available, available);
  if (copyCount <= 0) {
   return;
  }

  this.x.set(source.x.subarray(sourceOffset, sourceOffset + copyCount), targetOffset);
  this.y.set(source.y.subarray(sourceOffset, sourceOffset + copyCount), targetOffset);
 }

 // ============ Instance Methods - Arithmetic Operations ============

 /**
  * Adds another batch to this one element-wise.
  * @param other - Batch to add
  * @param out - Optional output batch
  * @returns Result batch
  */
 add(other: Vector2Batch, out?: Vector2Batch): Vector2Batch {
  this.ensureSameCount(other, 'Vector2Batch.add');
  const result = out || new Vector2Batch(this.count);

  for (let index = 0; index < this.count; index++) {
   result.x[index] = this.x[index]! + other.x[index]!;
   result.y[index] = this.y[index]! + other.y[index]!;
  }

  return result;
 }

 /**
  * Adds a constant vector to all vectors.
  * @param vector - Vector to add
  * @param out - Optional output batch
  * @returns Result batch
  */
 addScalar(vector: ReadonlyVector2, out?: Vector2Batch): Vector2Batch {
  const result = out || new Vector2Batch(this.count);
  const { x, y } = vector;

  for (let index = 0; index < this.count; index++) {
   result.x[index] = this.x[index]! + x;
   result.y[index] = this.y[index]! + y;
  }

  return result;
 }

 /**
  * Subtracts another batch from this one element-wise.
  * @param other - Batch to subtract
  * @param out - Optional output batch
  * @returns Result batch
  */
 sub(other: Vector2Batch, out?: Vector2Batch): Vector2Batch {
  this.ensureSameCount(other, 'Vector2Batch.sub');
  const result = out || new Vector2Batch(this.count);

  for (let index = 0; index < this.count; index++) {
   result.x[index] = this.x[index]! - other.x[index]!;
   result.y[index] = this.y[index]! - other.y[index]!;
  }

  return result;
 }

 /**
  * Multiplies all vectors by a scalar.
  * @param scalar - Scale factor
  * @param out - Optional output batch
  * @returns Result batch
  */
 scale(scalar: number, out?: Vector2Batch): Vector2Batch {
  const result = out || new Vector2Batch(this.count);

  for (let index = 0; index < this.count; index++) {
   result.x[index] = this.x[index]! * scalar;
   result.y[index] = this.y[index]! * scalar;
  }

  return result;
 }

 // ============ Instance Methods - Geometric Operations ============

 /**
  * Computes dot products with another batch.
  * @param other - Other batch
  * @param out - Optional output array
  * @returns Array of dot products
  */
 dot(other: Vector2Batch, out?: Float32Array): Float32Array {
  this.ensureSameCount(other, 'Vector2Batch.dot');
  const result = out || new Float32Array(this.count);

  for (let index = 0; index < this.count; index++) {
   result[index] = this.x[index]! * other.x[index]! + this.y[index]! * other.y[index]!;
  }

  return result;
 }

 /**
  * Computes lengths of all vectors.
  * @param out - Optional output array
  * @returns Array of lengths
  */
 length(out?: Float32Array): Float32Array {
  const result = out || new Float32Array(this.count);

  for (let index = 0; index < this.count; index++) {
   const x = this.x[index]!;
   const y = this.y[index]!;
   result[index] = safeSqrt(x * x + y * y);
  }

  return result;
 }

 /**
  * Computes squared lengths of all vectors.
  * @param out - Optional output array
  * @returns Array of squared lengths
  */
 lengthSq(out?: Float32Array): Float32Array {
  const result = out || new Float32Array(this.count);

  for (let index = 0; index < this.count; index++) {
   const x = this.x[index]!;
   const y = this.y[index]!;
   result[index] = x * x + y * y;
  }

  return result;
 }

 /**
  * Normalizes all vectors to unit length.
  * @param out - Optional output batch
  * @returns Normalized batch
  */
 normalize(out?: Vector2Batch): Vector2Batch {
  const result = out || new Vector2Batch(this.count);

  for (let index = 0; index < this.count; index++) {
   const x = this.x[index]!;
   const y = this.y[index]!;
   const lengthSq = x * x + y * y;

   if (isNearZero(lengthSq)) {
    result.x[index] = 0;
    result.y[index] = 0;
   } else {
    const invLength = 1 / safeSqrt(lengthSq);
    result.x[index] = x * invLength;
    result.y[index] = y * invLength;
   }
  }

  return result;
 }

 // ============ Instance Methods - Transformations ============

 /**
  * Rotates all vectors by an angle.
  * @param angle - Rotation angle in radians
  * @param out - Optional output batch
  * @returns Rotated batch
  */
 rotate(angle: number, out?: Vector2Batch): Vector2Batch {
  const result = out || new Vector2Batch(this.count);
  if (out && out.count !== this.count) {
   throw new RangeError(`Vector2Batch.rotate: output batch must have count ${this.count}`);
  }

  if (Vector2BatchSimd.tryRotate(this, angle, result)) {
   return result;
  }

  Vector2Batch.rotateScalar(this, angle, result);
  return result;
 }

 /**
  * Transforms all vectors by a 2x2 matrix.
  * @param m00 - Matrix element [0,0]
  * @param m01 - Matrix element [0,1]
  * @param m10 - Matrix element [1,0]
  * @param m11 - Matrix element [1,1]
  * @param out - Optional output batch
  * @returns Transformed batch
  */
 transform2x2(
  m00: number,
  m01: number,
  m10: number,
  m11: number,
  out?: Vector2Batch,
 ): Vector2Batch {
  const result = out || new Vector2Batch(this.count);
  if (out && out.count !== this.count) {
   throw new RangeError(`Vector2Batch.transform2x2: output batch must have count ${this.count}`);
  }

  if (Vector2BatchSimd.tryTransform2x2(this, m00, m01, m10, m11, result)) {
   return result;
  }

  Vector2Batch.transform2x2Scalar(this, m00, m01, m10, m11, result);
  return result;
 }

 /**
  * Transforms all vectors by a 2×2 matrix.
  * @param matrix - Matrix to apply
  * @param out - Optional output batch
  * @returns Transformed batch
  */
 transformMatrix(matrix: ReadonlyMatrix2, out?: Vector2Batch): Vector2Batch {
  return this.transform2x2(matrix.m00, matrix.m01, matrix.m10, matrix.m11, out);
 }

 /**
  * Applies a full {@link Transform2} (scale → rotate → translate) to each vector.
  * @param transform - Transform to apply
  * @param out - Optional output batch
  * @returns Transformed batch
  */
 transformTransform(transform: ReadonlyTransform2, out?: Vector2Batch): Vector2Batch {
  const result = out || new Vector2Batch(this.count);

  if (out && out.count !== this.count) {
   throw new RangeError(
    `Vector2Batch.transformTransform: output batch must have count ${this.count}`,
   );
  }

  if (Vector2BatchSimd.tryTransformTransform(this, transform, result)) {
   return result;
  }

  Vector2Batch.transformTransformScalar(this, transform, result);
  return result;
 }

 /**
  * Transforms vectors using packed transform data in the layout defined by {@link Transform2Batch}.
  * When `out` is omitted, a new batch is returned; otherwise results are written into `out`
  * (which may be the same instance for in-place updates).
  *
  * @param transforms - Packed transform buffer
  * @param count - Optional number of vectors to transform (default: batch size)
  * @param out - Optional output batch
  * @returns Transformed batch
  */
 transformByPackedTransforms(
  transforms: Float32Array,
  count?: number,
  out?: Vector2Batch,
 ): Vector2Batch {
  const transformCount = Math.floor(transforms.length / Transform2Batch.ELEMENTS_PER_TRANSFORM);
  const limit = Math.min(count ?? this.count, this.count, transformCount);

  const result = out || new Vector2Batch(this.count);
  if (out && out.count !== this.count) {
   throw new RangeError(
    `Vector2Batch.transformByPackedTransforms: output batch must have count ${this.count}`,
   );
  }

  if (result !== this) {
   result.x.set(this.x);
   result.y.set(this.y);
  }

  if (limit === 0) {
   return result;
  }

  if (Vector2BatchSimd.tryTransformByPackedTransforms(this, transforms, limit, result)) {
   return result;
  }

  Vector2Batch.transformByPackedTransformsScalar(this, transforms, limit, result);
  return result;
 }

 private static rotateScalar(source: Vector2Batch, angle: number, target: Vector2Batch): void {
  const cos = DeterministicMath.cos(angle);
  const sin = DeterministicMath.sin(angle);

  for (let index = 0; index < source.count; index++) {
   const x = source.x[index]!;
   const y = source.y[index]!;
   target.x[index] = x * cos - y * sin;
   target.y[index] = x * sin + y * cos;
  }
 }

 private static transform2x2Scalar(
  source: Vector2Batch,
  m00: number,
  m01: number,
  m10: number,
  m11: number,
  target: Vector2Batch,
 ): void {
  for (let index = 0; index < source.count; index++) {
   const x = source.x[index]!;
   const y = source.y[index]!;
   target.x[index] = m00 * x + m10 * y;
   target.y[index] = m01 * x + m11 * y;
  }
 }

 private static transformTransformScalar(
  source: Vector2Batch,
  transform: ReadonlyTransform2,
  target: Vector2Batch,
 ): void {
  const rotation = transform.rotation;
  const cos = DeterministicMath.cos(rotation);
  const sin = DeterministicMath.sin(rotation);
  const scaleX = transform.scale.x;
  const scaleY = transform.scale.y;
  const posX = transform.position.x;
  const posY = transform.position.y;

  for (let index = 0; index < source.count; index++) {
   const x = source.x[index]!;
   const y = source.y[index]!;
   const scaledX = x * scaleX;
   const scaledY = y * scaleY;
   target.x[index] = cos * scaledX - sin * scaledY + posX;
   target.y[index] = sin * scaledX + cos * scaledY + posY;
  }
 }

 private static transformByPackedTransformsScalar(
  source: Vector2Batch,
  transforms: Float32Array,
  limit: number,
  target: Vector2Batch,
 ): void {
  for (let index = 0; index < limit; index++) {
   const offset = index * Transform2Batch.ELEMENTS_PER_TRANSFORM;
   const posX = transforms[offset + Transform2Batch.POS_X]!;
   const posY = transforms[offset + Transform2Batch.POS_Y]!;
   let cos = transforms[offset + Transform2Batch.ROT_C]!;
   let sin = transforms[offset + Transform2Batch.ROT_S]!;
   const scaleX = transforms[offset + Transform2Batch.SCALE_X]!;
   const scaleY = transforms[offset + Transform2Batch.SCALE_Y]!;

   const normSq = cos * cos + sin * sin;
   if (normSq === 0) {
    cos = 1;
    sin = 0;
   } else if (Math.abs(1 - normSq) > 1e-6) {
    const invLength = 1 / DeterministicMath.sqrt(normSq);
    cos *= invLength;
    sin *= invLength;
   }

   const x = source.x[index]!;
   const y = source.y[index]!;
   const scaledX = x * scaleX;
   const scaledY = y * scaleY;
   target.x[index] = cos * scaledX - sin * scaledY + posX;
   target.y[index] = sin * scaledX + cos * scaledY + posY;
  }
 }

 // ============ Instance Methods - Interpolation ============

 /**
  * Linear interpolation between this batch and another.
  * @param other - Target batch
  * @param t - Interpolation factor [0, 1]
  * @param out - Optional output batch
  * @returns Interpolated batch
  */
 lerp(other: Vector2Batch, t: number, out?: Vector2Batch): Vector2Batch {
  this.ensureSameCount(other, 'Vector2Batch.lerp');
  const result = out || new Vector2Batch(this.count);
  const clamped = saturate(t);

  for (let index = 0; index < this.count; index++) {
   result.x[index] = lerp(this.x[index]!, other.x[index]!, clamped);
   result.y[index] = lerp(this.y[index]!, other.y[index]!, clamped);
  }

  return result;
 }

 // ============ Instance Methods - Comparison ============

 /**
  * Tests element-wise equality with another batch.
  * @param other - Batch to compare
  * @param epsilon - Tolerance (default: EPSILON)
  * @param out - Optional output array
  * @returns Boolean array of comparison results
  */
 equals(other: Vector2Batch, epsilon: number = EPSILON, out?: Uint8Array): Uint8Array {
  this.ensureSameCount(other, 'Vector2Batch.equals');
  const result = out || new Uint8Array(this.count);

  for (let index = 0; index < this.count; index++) {
   result[index] =
    nearEquals(this.x[index]!, other.x[index]!, epsilon) &&
    nearEquals(this.y[index]!, other.y[index]!, epsilon)
     ? 1
     : 0;
  }

  return result;
 }

 /**
  * Tests if all vectors equal a given vector.
  * @param vector - Vector to compare against
  * @param epsilon - Tolerance (default: EPSILON)
  * @returns True if all vectors match
  */
 allEqual(vector: ReadonlyVector2, epsilon: number = EPSILON): boolean {
  const { x, y } = vector;

  for (let index = 0; index < this.count; index++) {
   if (!nearEquals(this.x[index]!, x, epsilon) || !nearEquals(this.y[index]!, y, epsilon)) {
    return false;
   }
  }

  return true;
 }

 // ============ Instance Methods - Statistics ============

 /**
  * Computes the minimum values across all vectors.
  * @param out - Optional output vector
  * @returns Vector with minimum x and y values
  */
 min(out?: Vector2): Vector2 {
  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;

  for (let index = 0; index < this.count; index++) {
   minX = Math.min(minX, this.x[index]!);
   minY = Math.min(minY, this.y[index]!);
  }

  return (out || new Vector2()).set(minX, minY);
 }

 /**
  * Computes the maximum values across all vectors.
  * @param out - Optional output vector
  * @returns Vector with maximum x and y values
  */
 max(out?: Vector2): Vector2 {
  let maxX = Number.NEGATIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;

  for (let index = 0; index < this.count; index++) {
   maxX = Math.max(maxX, this.x[index]!);
   maxY = Math.max(maxY, this.y[index]!);
  }

  return (out || new Vector2()).set(maxX, maxY);
 }

 /**
  * Computes the mean (average) vector.
  * @param out - Optional output vector
  * @returns Mean vector
  */
 mean(out?: Vector2): Vector2 {
  let sumX = 0;
  let sumY = 0;

  for (let index = 0; index < this.count; index++) {
   sumX += this.x[index]!;
   sumY += this.y[index]!;
  }

  const invCount = safeDivide(1, this.count);
  return (out || new Vector2()).set(sumX * invCount, sumY * invCount);
 }

 // ============ Instance Methods - Conversion ============

 /**
  * Converts to array of Vector2 objects.
  * @returns Array of vectors
  */
 toVectors(): Vector2[] {
  const vectors: Vector2[] = new Array(this.count);

  for (let index = 0; index < this.count; index++) {
   vectors[index] = new Vector2(this.x[index]!, this.y[index]!);
  }

  return vectors;
 }

 /**
  * Converts to interleaved array format.
  * @param out - Optional output array
  * @returns Array with format [x0, y0, x1, y1, ...]
  */
 toArray(out?: Float32Array): Float32Array {
  const result = out || new Float32Array(this.count * 2);

  for (let index = 0; index < this.count; index++) {
   result[index * 2] = this.x[index]!;
   result[index * 2 + 1] = this.y[index]!;
  }

  return result;
 }

 /**
  * Creates a view into a subset of the batch.
  * @param start - Start index
  * @param count - Number of vectors
  * @returns New batch viewing the subset
  *
  * @remarks
  * The returned batch shares the underlying memory.
  */
 subarray(start: number, count: number): Vector2Batch {
  if (start < 0 || start + count > this.count) {
   throw new RangeError(
    `Vector2Batch.subarray: range [${start}, ${start + count}) out of bounds [0, ${this.count})`,
   );
  }

  const batch = Object.create(Vector2Batch.prototype) as Vector2Batch;
  Object.defineProperty(batch, 'count', { value: count, writable: false });
  Object.defineProperty(batch, 'x', {
   value: this.x.subarray(start, start + count),
   writable: false,
  });
  Object.defineProperty(batch, 'y', {
   value: this.y.subarray(start, start + count),
   writable: false,
  });

  return batch;
 }
}
