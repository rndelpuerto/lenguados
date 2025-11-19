/**
 * @file src/core/typed-arrays/float32-vector2-array.ts
 * @module math2d/core/typed-arrays/float32-vector2-array
 * @description
 * Struct-of-arrays representation for dense collections of {@link Vector2} values.
 * Provides SIMD-friendly accessors and batch operations tailored to typed arrays.
 */

import { Vector2, type ReadonlyVector2 } from '../vector2';

const COMPONENTS_PER_VECTOR = 2;
const BYTES_PER_VECTOR = COMPONENTS_PER_VECTOR * Float32Array.BYTES_PER_ELEMENT;

/**
 * SIMD-friendly storage for an array of {@link Vector2} instances.
 *
 * @remarks
 * - Uses struct-of-arrays (SoA) layout: `[x0..xN, y0..yN]`.
 * - Exposes zero-copy views for bulk operations and interop with graphics APIs.
 * - Batch helpers avoid temporary allocations and are amenable to SIMD.
 */
export class Float32Vector2Array {
 /** Underlying ArrayBuffer shared by all views. */
 private readonly buffer: ArrayBuffer;
 /** Contiguous buffer view. Layout: [x0..xN, y0..yN]. */
 private readonly soaStorage: Float32Array;
 /** SoA view containing all `x` components. */
 private readonly xView: Float32Array;
 /** SoA view containing all `y` components. */
 private readonly yView: Float32Array;
 /** Number of vectors. */
 private readonly vectorCount: number;

 /**
  * Create a typed array for `capacity` vectors.
  * All components are initialised to `0`.
  *
  * @param capacity - Number of {@link Vector2} slots to allocate (must be positive).
  */
 public constructor(capacity: number) {
  if (!Number.isInteger(capacity) || capacity <= 0) {
   throw new RangeError('Float32Vector2Array: capacity must be a positive integer');
  }

  this.vectorCount = capacity;
  this.buffer = new ArrayBuffer(capacity * BYTES_PER_VECTOR);
  this.soaStorage = new Float32Array(this.buffer);
  this.xView = new Float32Array(this.buffer, 0, capacity);
  this.yView = new Float32Array(this.buffer, capacity * Float32Array.BYTES_PER_ELEMENT, capacity);
 }

 /** Number of vectors stored in the buffer.
  * @returns Vector count.
  */
 public get length(): number {
  return this.vectorCount;
 }

 /** SoA storage `[x0..xN, y0..yN]`.
  * @returns Mutable Float32Array view of the underlying buffer.
  */
 public get data(): Float32Array {
  return this.soaStorage;
 }

 /** Read-only view containing all `x` components.
  * @returns Float32Array view of the X components.
  */
 public get x(): Float32Array {
  return this.xView;
 }

 /** Read-only view containing all `y` components.
  * @returns Float32Array view of the Y components.
  */
 public get y(): Float32Array {
  return this.yView;
 }

 /** Backing buffer for zero-copy interop (WebGL/WebGPU).
  * @returns Shared ArrayBuffer storing all vectors.
  */
 public get arrayBuffer(): ArrayBuffer {
  return this.buffer;
 }

 /**
  * Read vector at `index` into `outVector`.
  * @param index - Vector slot (0 ≤ index < length).
  * @param outVector - Destination (defaults to new {@link Vector2}).
  * @returns `outVector`.
  */
 public getVector(index: number, outVector: Vector2 = new Vector2()): Vector2 {
  this.assertIndex(index);
  return outVector.set(this.xView[index], this.yView[index]);
 }

 /**
  * Write vector `value` into slot `index`.
  * @returns `this`.
  */
 public setVector(index: number, value: ReadonlyVector2): this {
  this.assertIndex(index);
  this.xView[index] = value.x;
  this.yView[index] = value.y;
  return this;
 }

 /**
  * Write raw components into slot `index`.
  * @returns `this`.
  */
 public setComponents(index: number, x: number, y: number): this {
  this.assertIndex(index);
  this.xView[index] = x;
  this.yView[index] = y;
  return this;
 }

 /** Fill all slots with `value`.
  * @returns `this`.
  */
 public fill(value: ReadonlyVector2): this {
  for (let index = 0; index < this.vectorCount; index += 1) {
   this.xView[index] = value.x;
   this.yView[index] = value.y;
  }
  return this;
 }

 /** Copy data from another {@link Float32Vector2Array}.
  * @returns `this`.
  */
 public copyFrom(source: Float32Vector2Array): this {
  if (source.length !== this.length) {
   throw new RangeError('Float32Vector2Array.copyFrom: source length mismatch');
  }
  this.soaStorage.set(source.data);
  return this;
 }

 /**
  * Component-wise addition with `other` (`this[i] += other[i]`).
  * @returns `this`.
  */
 public addBatch(other: Float32Vector2Array): this {
  this.assertSameLength(other);
  for (let index = 0; index < this.vectorCount; index += 1) {
   this.xView[index] += other.x[index];
   this.yView[index] += other.y[index];
  }
  return this;
 }

 /** Scale all vectors by `scalar`.
  * @returns `this`.
  */
 public scaleBatch(scalar: number): this {
  for (let index = 0; index < this.vectorCount; index += 1) {
   this.xView[index] *= scalar;
   this.yView[index] *= scalar;
  }
  return this;
 }

 /** Convert into an array of {@link Vector2} instances (allocates).
  * @returns `out`.
  */
 public toVectorArray(out: Vector2[] = []): Vector2[] {
  out.length = this.vectorCount;
  for (let index = 0; index < this.vectorCount; index += 1) {
   const vector = out[index] ?? new Vector2();
   out[index] = vector.set(this.xView[index], this.yView[index]);
  }
  return out;
 }

 /** Validate index bounds.
  * @returns void
  */
 private assertIndex(index: number): void {
  if (!Number.isInteger(index) || index < 0 || index >= this.vectorCount) {
   throw new RangeError('Float32Vector2Array: index out of bounds');
  }
 }

 private assertSameLength(other: Float32Vector2Array): void {
  if (other.length !== this.length) {
   throw new RangeError('Float32Vector2Array: length mismatch');
  }
 }
}
