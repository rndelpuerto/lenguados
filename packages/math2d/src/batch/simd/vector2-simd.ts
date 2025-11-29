/**
 * @file batch/simd/vector2-simd.ts
 * @module @lenguados/math2d/batch/simd
 * @description Registration hooks for SIMD-accelerated {@link Vector2Batch} operations.
 */

import type { ReadonlyTransform2 } from '../../core/transform2';
import type { Vector2Batch } from '../vector2-batch';

import { SimdDetector } from './detector';

/**
 * Contract for SIMD implementations that operate on {@link Vector2Batch}.
 *
 * Implementations should return `true` when they successfully handle the request.
 * Returning `false` indicates the scalar fallback should be used instead.
 */
export interface Vector2BatchSimdImplementation {
 /**
  * SIMD-accelerated rotation.
  */
 rotate?(source: Vector2Batch, angle: number, out: Vector2Batch): boolean;

 /**
  * SIMD-accelerated 2×2 matrix transform.
  */
 transform2x2?(
  source: Vector2Batch,
  m00: number,
  m01: number,
  m10: number,
  m11: number,
  out: Vector2Batch,
 ): boolean;

 /**
  * SIMD-accelerated {@link ReadonlyTransform2} application.
  */
 transformTransform?(
  source: Vector2Batch,
  transform: ReadonlyTransform2,
  out: Vector2Batch,
 ): boolean;

 /**
  * SIMD-accelerated packed transform application.
  */
 transformByPackedTransforms?(
  source: Vector2Batch,
  transforms: Float32Array,
  limit: number,
  out: Vector2Batch,
 ): boolean;
}

/**
 * Dispatcher for SIMD-enabled Vector2 batch operations.
 *
 * @remarks
 * The dispatcher keeps the API surface minimal: registering an implementation
 * flips SIMD acceleration on (provided the runtime supports it) while consumers
 * can query availability through {@link Vector2BatchSimd.isEnabled}.
 */
export class Vector2BatchSimd {
 private static implementation: Vector2BatchSimdImplementation | undefined;

 /**
  * Registers a SIMD implementation.
  * @param implementation - Implementation to use for SIMD paths.
  */
 static register(implementation: Vector2BatchSimdImplementation): void {
  this.implementation = implementation;
 }

 /**
  * Removes the currently registered implementation.
  */
 static unregister(): void {
  this.implementation = undefined;
 }

 /**
  * Returns whether SIMD is effectively enabled (runtime support + registered implementation).
  * @returns True when runtime support and an implementation are both present.
  */
 static isEnabled(): boolean {
  return SimdDetector.detect() && this.implementation !== undefined;
 }

 /**
  * Attempts to run the SIMD rotation path.
  * @returns True when the SIMD implementation handled the request.
  */
 static tryRotate(source: Vector2Batch, angle: number, out: Vector2Batch): boolean {
  if (!SimdDetector.detect()) return false;
  const implementation = this.implementation;
  if (!implementation?.rotate) return false;
  return implementation.rotate(source, angle, out);
 }

 /**
  * Attempts to run the SIMD 2×2 transform path.
  * @returns True when the SIMD implementation handled the request.
  */
 static tryTransform2x2(
  source: Vector2Batch,
  m00: number,
  m01: number,
  m10: number,
  m11: number,
  out: Vector2Batch,
 ): boolean {
  if (!SimdDetector.detect()) return false;
  const implementation = this.implementation;
  if (!implementation?.transform2x2) return false;
  return implementation.transform2x2(source, m00, m01, m10, m11, out);
 }

 /**
  * Attempts to run the SIMD {@link ReadonlyTransform2} application path.
  * @returns True when the SIMD implementation handled the request.
  */
 static tryTransformTransform(
  source: Vector2Batch,
  transform: ReadonlyTransform2,
  out: Vector2Batch,
 ): boolean {
  if (!SimdDetector.detect()) return false;
  const implementation = this.implementation;
  if (!implementation?.transformTransform) return false;
  return implementation.transformTransform(source, transform, out);
 }

 /**
  * Attempts to run the SIMD packed transform path.
  * @returns True when the SIMD implementation handled the request.
  */
 static tryTransformByPackedTransforms(
  source: Vector2Batch,
  transforms: Float32Array,
  limit: number,
  out: Vector2Batch,
 ): boolean {
  if (!SimdDetector.detect()) return false;
  const implementation = this.implementation;
  if (!implementation?.transformByPackedTransforms) return false;
  return implementation.transformByPackedTransforms(source, transforms, limit, out);
 }
}
