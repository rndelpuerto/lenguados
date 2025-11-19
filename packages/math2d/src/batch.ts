/**
 * @file src/core/batch.ts
 * @module math2d/core/batch
 * @description
 * Batch operations for efficient processing of multiple mathematical objects.
 *
 * These functions are optimized for processing arrays of vectors, matrices,
 * and transforms, minimizing allocations and improving cache efficiency.
 *
 * @remarks
 * - All batch operations support in-place updates when `out` array is provided
 * - Pre-allocate output arrays for maximum performance in hot loops
 * - Functions validate array lengths to prevent silent errors
 */

import { Mat2, ReadonlyMat2 } from './mat2';
import { Rot2, ReadonlyRot2 } from './rot2';
import { Transform2, ReadonlyTransform2 } from './transform2';
import { Vector2, ReadonlyVector2 } from './vector2';

/* =============================================================================
 * Vector2 Batch Operations
 * =============================================================================
 */

/**
 * Namespace for batch vector operations.
 */
/**
 * Note: This module has been refactored from TypeScript namespaces to ES6 exports.
 * Functions are now exported with descriptive prefixes:
 * - VectorBatch.addScalar -> vectorAddScalar
 * - TransformBatch.apply -> transformApply
 * - MatrixBatch.multiply -> matrixMultiply
 * - RotationBatch.rotate -> rotationRotate
 */
// VectorBatch functions - converted to ES6 exports

 /**
* Adds a scalar to multiple vectors.
*
* @param vectors - Input vectors.
* @param scalar - Scalar to add.
* @param out - Optional output array. If not provided, creates new vectors.
* @returns Array of vectors with scalar added.
* @throws {RangeError} If out is provided but has different length than input.
*/
 export function vectorAddScalar(vectors: ReadonlyVector2[], scalar: number, out?: Vector2[]): Vector2[] {
const count = vectors.length;
const result = out || new Array<Vector2>(count);

if (out && out.length !== count) {
 throw new RangeError(`Output array length (${out.length}) must match input length (${count})`);
}

for (let index = 0; index < count; index++) {
 const v = vectors[index]!;
 const target = result[index] || new Vector2();
 target.set(v.x + scalar, v.y + scalar);
 if (!out) result[index] = target;
}

return result;
 }

 /**
* Adds two arrays of vectors element-wise.
*
* @param a - First array of vectors.
* @param b - Second array of vectors.
* @param out - Optional output array.
* @returns Array of summed vectors.
* @throws {RangeError} If arrays have different lengths.
*/
 export function vectorAdd(a: ReadonlyVector2[], b: ReadonlyVector2[], out?: Vector2[]): Vector2[] {
if (a.length !== b.length) {
 throw new RangeError(`Array lengths must match: ${a.length} vs ${b.length}`);
}

const count = a.length;
const result = out || new Array<Vector2>(count);

if (out && out.length !== count) {
 throw new RangeError(`Output array length (${out.length}) must match input length (${count})`);
}

for (let index = 0; index < count; index++) {
 const target = result[index] || new Vector2();
 Vector2.add(a[index]!, b[index]!, target);
 if (!out) result[index] = target;
}

return result;
 }

 /**
* Scales multiple vectors by a scalar.
*
* @param vectors - Input vectors.
* @param scale - Scale factor.
* @param out - Optional output array.
* @returns Array of scaled vectors.
*/
 export function vectorScale(vectors: ReadonlyVector2[], scale: number, out?: Vector2[]): Vector2[] {
const count = vectors.length;
const result = out || new Array<Vector2>(count);

if (out && out.length !== count) {
 throw new RangeError(`Output array length (${out.length}) must match input length (${count})`);
}

for (let index = 0; index < count; index++) {
 const target = result[index] || new Vector2();
 Vector2.multiplyScalar(vectors[index]!, scale, target);
 if (!out) result[index] = target;
}

return result;
 }

 /**
* Normalizes multiple vectors.
*
* @param vectors - Input vectors.
* @param out - Optional output array.
* @returns Array of normalized vectors.
*/
 export function vectorNormalize(vectors: ReadonlyVector2[], out?: Vector2[]): Vector2[] {
const count = vectors.length;
const result = out || new Array<Vector2>(count);

if (out && out.length !== count) {
 throw new RangeError(`Output array length (${out.length}) must match input length (${count})`);
}

for (let index = 0; index < count; index++) {
 const target = result[index] || new Vector2();
 Vector2.normalize(vectors[index]!, target);
 if (!out) result[index] = target;
}

return result;
 }

 /**
* Computes dot products between corresponding vectors in two arrays.
*
* @param a - First array of vectors.
* @param b - Second array of vectors.
* @returns Array of dot products.
* @throws {RangeError} If arrays have different lengths.
*/
 export function vectorDot(a: ReadonlyVector2[], b: ReadonlyVector2[]): number[] {
if (a.length !== b.length) {
 throw new RangeError(`Array lengths must match: ${a.length} vs ${b.length}`);
}

const count = a.length;
const result = new Array<number>(count);

for (let index = 0; index < count; index++) {
 result[index] = Vector2.dot(a[index]!, b[index]!);
}

return result;
 }

 /**
* Computes lengths of multiple vectors.
*
* @param vectors - Input vectors.
* @returns Array of lengths.
*/
 export function vectorLengths(vectors: ReadonlyVector2[]): number[] {
const count = vectors.length;
const result = new Array<number>(count);

for (let index = 0; index < count; index++) {
 result[index] = Vector2.length(vectors[index]!);
}

return result;
 }

 /**
* Projects multiple vectors onto an axis.
*
* @param vectors - Vectors to project.
* @param axis - Projection axis.
* @param out - Optional output array.
* @returns Array of projected vectors.
*/
 export function vectorProjectOntoAxis(
vectors: ReadonlyVector2[],
axis: ReadonlyVector2,
out?: Vector2[],
 ): Vector2[] {
const count = vectors.length;
const result = out || new Array<Vector2>(count);

if (out && out.length !== count) {
 throw new RangeError(`Output array length (${out.length}) must match input length (${count})`);
}

for (let index = 0; index < count; index++) {
 const target = result[index] || new Vector2();
 Vector2.project(vectors[index]!, axis, target);
 if (!out) result[index] = target;
}

return result;
 }

/* =============================================================================
 * Transform2 Batch Operations
 * =============================================================================
 */

/**
 * Namespace for batch transform operations.
 */
// TransformBatch functions - converted to ES6 exports

 /**
* Transforms multiple points by a single transform.
*
* @param transform - Transform to apply.
* @param points - Points to transform.
* @param out - Optional output array.
* @returns Array of transformed points.
*/
 export function transformTransformPoints(
transform: ReadonlyTransform2,
points: ReadonlyVector2[],
out?: Vector2[],
 ): Vector2[] {
const count = points.length;
const result = out || new Array<Vector2>(count);

if (out && out.length !== count) {
 throw new RangeError(`Output array length (${out.length}) must match input length (${count})`);
}

for (let index = 0; index < count; index++) {
 const target = result[index] || new Vector2();
 Transform2.transformPoint(transform, points[index]!, target);
 if (!out) result[index] = target;
}

return result;
 }

 /**
* Transforms multiple vectors (directions) by a single transform.
*
* @param transform - Transform to apply (only rotation is used).
* @param vectors - Vectors to transform.
* @param out - Optional output array.
* @returns Array of transformed vectors.
*/
 export function transformTransformVectors(
transform: ReadonlyTransform2,
vectors: ReadonlyVector2[],
out?: Vector2[],
 ): Vector2[] {
const count = vectors.length;
const result = out || new Array<Vector2>(count);

if (out && out.length !== count) {
 throw new RangeError(`Output array length (${out.length}) must match input length (${count})`);
}

for (let index = 0; index < count; index++) {
 const target = result[index] || new Vector2();
 Transform2.transformVector(transform, vectors[index]!, target);
 if (!out) result[index] = target;
}

return result;
 }

 /**
* Composes multiple transforms in sequence.
*
* @param transforms - Transforms to compose (applied left to right).
* @returns The composed transform.
* @throws {Error} If array is empty.
*/
 export function transformCompose(transforms: ReadonlyTransform2[]): Transform2 {
if (transforms.length === 0) {
 throw new Error('Cannot compose empty transform array');
}

const result = transforms[0]!.clone();

for (let index = 1; index < transforms.length; index++) {
 result.multiply(transforms[index]!);
}

return result;
 }

/* =============================================================================
 * Mat2 Batch Operations
 * =============================================================================
 */

/**
 * Namespace for batch matrix operations.
 */
// MatrixBatch functions - converted to ES6 exports

 /**
* Multiplies a matrix by multiple vectors.
*
* @param matrix - Matrix to multiply by.
* @param vectors - Vectors to transform.
* @param out - Optional output array.
* @returns Array of transformed vectors.
*/
 export function matrixMultiplyVectors(
matrix: ReadonlyMat2,
vectors: ReadonlyVector2[],
out?: Vector2[],
 ): Vector2[] {
const count = vectors.length;
const result = out || new Array<Vector2>(count);

if (out && out.length !== count) {
 throw new RangeError(`Output array length (${out.length}) must match input length (${count})`);
}

for (let index = 0; index < count; index++) {
 const target = result[index] || new Vector2();
 Mat2.transformVector(matrix, vectors[index]!, target);
 if (!out) result[index] = target;
}

return result;
 }

 /**
* Multiplies multiple matrices in sequence.
*
* @param matrices - Matrices to multiply (applied left to right).
* @returns The product matrix.
* @throws {Error} If array is empty.
*/
 export function matrixMultiplySequence(matrices: ReadonlyMat2[]): Mat2 {
if (matrices.length === 0) {
 throw new Error('Cannot multiply empty matrix array');
}

const result = matrices[0]!.clone();

for (let index = 1; index < matrices.length; index++) {
 result.multiply(matrices[index]!);
}

return result;
 }

/* =============================================================================
 * Rotation Batch Operations
 * =============================================================================
 */

/**
 * Namespace for batch rotation operations.
 */
// RotationBatch functions - converted to ES6 exports

 /**
* Rotates multiple vectors by a single rotation.
*
* @param rotation - Rotation to apply.
* @param vectors - Vectors to rotate.
* @param out - Optional output array.
* @returns Array of rotated vectors.
*/
 export function rotationRotateVectors(
rotation: ReadonlyRot2,
vectors: ReadonlyVector2[],
out?: Vector2[],
 ): Vector2[] {
const count = vectors.length;
const result = out || new Array<Vector2>(count);

if (out && out.length !== count) {
 throw new RangeError(`Output array length (${out.length}) must match input length (${count})`);
}

for (let index = 0; index < count; index++) {
 const target = result[index] || new Vector2();
 Rot2.apply(rotation, vectors[index]!, target);
 if (!out) result[index] = target;
}

return result;
 }

 /**
* Composes multiple rotations in sequence.
*
* @param rotations - Rotations to compose (applied left to right).
* @returns The composed rotation.
* @throws {Error} If array is empty.
*/
 export function rotationCompose(rotations: ReadonlyRot2[]): Rot2 {
if (rotations.length === 0) {
 throw new Error('Cannot compose empty rotation array');
}

const result = rotations[0]!.clone();

for (let index = 1; index < rotations.length; index++) {
 result.multiply(rotations[index]!);
}

return result;
 }

/* =============================================================================
 * Utility Functions
 * =============================================================================
 */

/**
 * Finds the bounding box of multiple points.
 *
 * @param points - Points to bound.
 * @returns Object with min and max corners of the bounding box.
 * @throws {Error} If array is empty.
 */
export function boundingBox(points: ReadonlyVector2[]): { min: Vector2; max: Vector2 } {
 if (points.length === 0) {
  throw new Error('Cannot compute bounding box of empty point array');
 }

 const min = points[0]!.clone();
 const max = points[0]!.clone();

 for (let index = 1; index < points.length; index++) {
  const p = points[index]!;
  min.x = Math.min(min.x, p.x);
  min.y = Math.min(min.y, p.y);
  max.x = Math.max(max.x, p.x);
  max.y = Math.max(max.y, p.y);
 }

 return { min, max };
}

/**
 * Computes the centroid (average position) of multiple points.
 *
 * @param points - Points to average.
 * @param out - Optional output vector.
 * @returns The centroid.
 * @throws {Error} If array is empty.
 */
export function centroid(points: ReadonlyVector2[], out = new Vector2()): Vector2 {
 if (points.length === 0) {
  throw new Error('Cannot compute centroid of empty point array');
 }

 out.zero();

 for (const p of points) {
  out.add(p);
 }

 return out.divideScalar(points.length);
}

/**
 * Filters vectors based on length criteria.
 *
 * @param vectors - Vectors to filter.
 * @param minLength - Minimum length (inclusive).
 * @param maxLength - Maximum length (inclusive).
 * @returns Filtered array of vectors.
 */
export function filterByLength(
 vectors: ReadonlyVector2[],
 minLength: number,
 maxLength: number,
): ReadonlyVector2[] {
 return vectors.filter((v) => {
  const length = v.length();
  return length >= minLength && length <= maxLength;
 });
}
