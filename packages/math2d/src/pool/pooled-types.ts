/**
 * @file pool/pooled-types.ts
 * @module @lenguados/math2d/pool
 * @description Pooled versions of core types with automatic memory management
 */

import { Complex } from '../core/complex';
import { Interval } from '../core/interval';
import { Matrix2 } from '../core/matrix2';
import { Matrix3 } from '../core/matrix3';
import { Quaternion2 } from '../core/quaternion2';
import { Rotation2 } from '../core/rotation2';
import { Transform2 } from '../core/transform2';
import { Vector2 } from '../core/vector2';

import { ObjectPool, PoolManager, type Poolable } from './object-pool';

// Extend core types to add reset methods for pooling

declare module '../core/vector2' {
 interface Vector2 extends Poolable {
  reset(): void;
 }
}

declare module '../core/complex' {
 interface Complex extends Poolable {
  reset(): void;
 }
}

declare module '../core/matrix2' {
 interface Matrix2 extends Poolable {
  reset(): void;
 }
}

declare module '../core/matrix3' {
 interface Matrix3 extends Poolable {
  reset(): void;
 }
}

declare module '../core/transform2' {
 interface Transform2 extends Poolable {
  reset(): void;
 }
}

declare module '../core/rotation2' {
 interface Rotation2 extends Poolable {
  reset(): void;
 }
}

declare module '../core/quaternion2' {
 interface Quaternion2 extends Poolable {
  reset(): void;
 }
}

declare module '../core/interval' {
 interface Interval extends Poolable {
  reset(): void;
 }
}

// Add reset methods to prototypes
Vector2.prototype.reset = function () {
 this.x = 0;
 this.y = 0;
};

Complex.prototype.reset = function () {
 this.real = 0;
 this.imag = 0;
};

Matrix2.prototype.reset = function () {
 this.m00 = 1;
 this.m01 = 0;
 this.m10 = 0;
 this.m11 = 1;
};

Matrix3.prototype.reset = function () {
 this.m00 = 1;
 this.m01 = 0;
 this.m02 = 0;
 this.m10 = 0;
 this.m11 = 1;
 this.m12 = 0;
 this.m20 = 0;
 this.m21 = 0;
 this.m22 = 1;
};

Transform2.prototype.reset = function () {
 this.position.reset();
 this.rotation = 0;
 this.scale.set(1, 1);
};

Rotation2.prototype.reset = function () {
 this.c = 1;
 this.s = 0;
};

Quaternion2.prototype.reset = function () {
 this.w = 1;
 this.z = 0;
};

Interval.prototype.reset = function () {
 this.min = 0;
 this.max = 0;
};

/**
 * Default pool configurations for different types.
 */
export const DEFAULT_POOL_CONFIGS = {
 vector2: {
  initialSize: 100,
  maxSize: 1000,
  autoGrow: true,
  growthFactor: 1.5,
 },
 complex: {
  initialSize: 50,
  maxSize: 500,
  autoGrow: true,
  growthFactor: 1.5,
 },
 matrix2: {
  initialSize: 50,
  maxSize: 500,
  autoGrow: true,
  growthFactor: 1.5,
 },
 matrix3: {
  initialSize: 50,
  maxSize: 500,
  autoGrow: true,
  growthFactor: 1.5,
 },
 transform2: {
  initialSize: 50,
  maxSize: 500,
  autoGrow: true,
  growthFactor: 1.5,
 },
 rotation2: {
  initialSize: 50,
  maxSize: 500,
  autoGrow: true,
  growthFactor: 1.5,
 },
 quaternion2: {
  initialSize: 25,
  maxSize: 250,
  autoGrow: true,
  growthFactor: 1.5,
 },
 interval: {
  initialSize: 50,
  maxSize: 500,
  autoGrow: true,
  growthFactor: 1.5,
 },
};

/**
 * Singleton pools for core types.
 */
export class TypePools {
 private static _vector2Pool?: ObjectPool<Vector2>;
 private static _complexPool?: ObjectPool<Complex>;
 private static _matrix2Pool?: ObjectPool<Matrix2>;
 private static _matrix3Pool?: ObjectPool<Matrix3>;
 private static _transform2Pool?: ObjectPool<Transform2>;
 private static _rotation2Pool?: ObjectPool<Rotation2>;
 private static _quaternion2Pool?: ObjectPool<Quaternion2>;
 private static _intervalPool?: ObjectPool<Interval>;

 /**
  * Gets the Vector2 pool.
  * @returns The Vector2 object pool
  */
 static get vector2(): ObjectPool<Vector2> {
  if (!this._vector2Pool) {
   this._vector2Pool = new ObjectPool(() => new Vector2(), DEFAULT_POOL_CONFIGS.vector2);
  }
  return this._vector2Pool;
 }

 /**
  * Attempts to acquire a Vector2 without throwing when the pool is exhausted.
  * @returns A Vector2 instance or undefined if unavailable
  */
 static tryVector2(): Vector2 | undefined {
  return this._vector2Pool?.tryAcquire();
 }

 /**
  * Gets the Complex pool.
  * @returns The Complex object pool
  */
 static get complex(): ObjectPool<Complex> {
  if (!this._complexPool) {
   this._complexPool = new ObjectPool(() => new Complex(), DEFAULT_POOL_CONFIGS.complex);
  }
  return this._complexPool;
 }

 /**
  * Gets the Matrix2 pool.
  * @returns The Matrix2 object pool
  */
 static get matrix2(): ObjectPool<Matrix2> {
  if (!this._matrix2Pool) {
   this._matrix2Pool = new ObjectPool(() => new Matrix2(), DEFAULT_POOL_CONFIGS.matrix2);
  }
  return this._matrix2Pool;
 }

 /**
  * Gets the Matrix3 pool.
  * @returns The Matrix3 object pool
  */
 static get matrix3(): ObjectPool<Matrix3> {
  if (!this._matrix3Pool) {
   this._matrix3Pool = new ObjectPool(() => new Matrix3(), DEFAULT_POOL_CONFIGS.matrix3);
  }
  return this._matrix3Pool;
 }

 /**
  * Gets the Transform2 pool.
  * @returns The Transform2 object pool
  */
 static get transform2(): ObjectPool<Transform2> {
  if (!this._transform2Pool) {
   this._transform2Pool = new ObjectPool(() => new Transform2(), DEFAULT_POOL_CONFIGS.transform2);
  }
  return this._transform2Pool;
 }

 /**
  * Gets the Rotation2 pool.
  * @returns The Rotation2 object pool
  */
 static get rotation2(): ObjectPool<Rotation2> {
  if (!this._rotation2Pool) {
   this._rotation2Pool = new ObjectPool(() => new Rotation2(), DEFAULT_POOL_CONFIGS.rotation2);
  }
  return this._rotation2Pool;
 }

 /**
  * Gets the Quaternion2 pool.
  * @returns The Quaternion2 object pool
  */
 static get quaternion2(): ObjectPool<Quaternion2> {
  if (!this._quaternion2Pool) {
   this._quaternion2Pool = new ObjectPool(
    () => new Quaternion2(),
    DEFAULT_POOL_CONFIGS.quaternion2,
   );
  }
  return this._quaternion2Pool;
 }

 /**
  * Gets the Interval pool.
  * @returns The Interval object pool
  */
 static get interval(): ObjectPool<Interval> {
  if (!this._intervalPool) {
   this._intervalPool = new ObjectPool(() => new Interval(), DEFAULT_POOL_CONFIGS.interval);
  }
  return this._intervalPool;
 }

 /**
  * Preallocates objects in all pools.
  * @param sizes - Optional custom sizes for each pool
  */
 static preallocateAll(sizes?: Partial<Record<string, number>>): void {
  const defaultSize = 50;

  this.vector2.preallocate(sizes?.vector2 ?? defaultSize);
  this.complex.preallocate(sizes?.complex ?? defaultSize);
  this.matrix2.preallocate(sizes?.matrix2 ?? defaultSize);
  this.matrix3.preallocate(sizes?.matrix3 ?? defaultSize);
  this.transform2.preallocate(sizes?.transform2 ?? defaultSize);
  this.rotation2.preallocate(sizes?.rotation2 ?? defaultSize);
  this.quaternion2.preallocate(sizes?.quaternion2 ?? 25);
  this.interval.preallocate(sizes?.interval ?? defaultSize);
 }

 /**
  * Limits the number of available objects kept in each pool.
  * @param maxAvailable - Maximum number of available instances per pool
  */
 static trimAll(maxAvailable: number = 0): void {
  this._vector2Pool?.trim(maxAvailable);
  this._complexPool?.trim(maxAvailable);
  this._matrix2Pool?.trim(maxAvailable);
  this._matrix3Pool?.trim(maxAvailable);
  this._transform2Pool?.trim(maxAvailable);
  this._rotation2Pool?.trim(maxAvailable);
  this._quaternion2Pool?.trim(maxAvailable);
  this._intervalPool?.trim(maxAvailable);
 }

 /**
  * Clears all pools.
  */
 static clearAll(): void {
  this._vector2Pool?.clear();
  this._complexPool?.clear();
  this._matrix2Pool?.clear();
  this._matrix3Pool?.clear();
  this._transform2Pool?.clear();
  this._rotation2Pool?.clear();
  this._quaternion2Pool?.clear();
  this._intervalPool?.clear();
 }

 /**
  * Gets statistics for all pools.
  * @returns Object with statistics for each pool type
  */
 static getAllStats() {
  return {
   vector2: this._vector2Pool?.getStats(),
   complex: this._complexPool?.getStats(),
   matrix2: this._matrix2Pool?.getStats(),
   matrix3: this._matrix3Pool?.getStats(),
   transform2: this._transform2Pool?.getStats(),
   rotation2: this._rotation2Pool?.getStats(),
   quaternion2: this._quaternion2Pool?.getStats(),
   interval: this._intervalPool?.getStats(),
  };
 }
}

// Register pools with the global manager
PoolManager.register('vector2', () => new Vector2(), DEFAULT_POOL_CONFIGS.vector2);
PoolManager.register('complex', () => new Complex(), DEFAULT_POOL_CONFIGS.complex);
PoolManager.register('matrix2', () => new Matrix2(), DEFAULT_POOL_CONFIGS.matrix2);
PoolManager.register('matrix3', () => new Matrix3(), DEFAULT_POOL_CONFIGS.matrix3);
PoolManager.register('transform2', () => new Transform2(), DEFAULT_POOL_CONFIGS.transform2);
PoolManager.register('rotation2', () => new Rotation2(), DEFAULT_POOL_CONFIGS.rotation2);
PoolManager.register('quaternion2', () => new Quaternion2(), DEFAULT_POOL_CONFIGS.quaternion2);
PoolManager.register('interval', () => new Interval(), DEFAULT_POOL_CONFIGS.interval);

/**
 * Convenience functions for working with pooled objects.
 */

/**
 * Executes a function with a temporary Vector2 from the pool.
 * @param fn - Function to execute
 * @returns Result of the function
 *
 * @example
 * ```typescript
 * const length = withVector2(v => {
 *   v.set(3, 4);
 *   return v.length();
 * });
 * ```
 */
export function withVector2<R>(function_: (v: Vector2) => R): R {
 return TypePools.vector2.withTemporary(function_);
}

/**
 * Executes a function with multiple temporary Vector2s from the pool.
 * @param count - Number of vectors needed
 * @param fn - Function to execute
 * @returns Result of the function
 *
 * @example
 * ```typescript
 * const sum = withVector2s(3, (v1, v2, v3) => {
 *   v1.set(1, 0);
 *   v2.set(0, 1);
 *   return v1.add(v2, v3);
 * });
 * ```
 */
// eslint-disable-next-line no-redeclare
export function withVector2s<R>(count: 1, function_: (v1: Vector2) => R): R;
// eslint-disable-next-line no-redeclare
export function withVector2s<R>(count: 2, function_: (v1: Vector2, v2: Vector2) => R): R;
// eslint-disable-next-line no-redeclare
export function withVector2s<R>(
 count: 3,
 function_: (v1: Vector2, v2: Vector2, v3: Vector2) => R,
): R;
// eslint-disable-next-line no-redeclare
export function withVector2s<R>(
 count: 4,
 function_: (v1: Vector2, v2: Vector2, v3: Vector2, v4: Vector2) => R,
): R;
// eslint-disable-next-line no-redeclare
export function withVector2s<R>(count: number, function_: (...vectors: Vector2[]) => R): R {
 return TypePools.vector2.scope((context) => {
  const vectors: Vector2[] = [];
  for (let index = 0; index < count; index++) {
   vectors.push(context.acquire());
  }
  return function_(...vectors);
 });
}

/**
 * Executes a function with a temporary Matrix2 from the pool.
 * @param fn - Function to execute
 * @returns Result of the function
 */
export function withMatrix2<R>(function_: (m: Matrix2) => R): R {
 return TypePools.matrix2.withTemporary(function_);
}

/**
 * Executes a function with a temporary Matrix3 from the pool.
 * @param fn - Function to execute
 * @returns Result of the function
 */
export function withMatrix3<R>(function_: (m: Matrix3) => R): R {
 return TypePools.matrix3.withTemporary(function_);
}

/**
 * Executes a function with a temporary Transform2 from the pool.
 * @param fn - Function to execute
 * @returns Result of the function
 */
export function withTransform2<R>(function_: (t: Transform2) => R): R {
 return TypePools.transform2.withTemporary(function_);
}

/**
 * Executes a function with a temporary Complex from the pool.
 * @param fn - Function to execute
 * @returns Result of the function
 */
export function withComplex<R>(function_: (c: Complex) => R): R {
 return TypePools.complex.withTemporary(function_);
}

/**
 * Executes a function with a temporary Rotation2 from the pool.
 * @param fn - Function to execute
 * @returns Result of the function
 */
export function withRotation2<R>(function_: (r: Rotation2) => R): R {
 return TypePools.rotation2.withTemporary(function_);
}

/**
 * Executes a function with a temporary Quaternion2 from the pool.
 * @param fn - Function to execute
 * @returns Result of the function
 */
export function withQuaternion2<R>(function_: (q: Quaternion2) => R): R {
 return TypePools.quaternion2.withTemporary(function_);
}

/**
 * Executes a function with a temporary Interval from the pool.
 * @param fn - Function to execute
 * @returns Result of the function
 */
export function withInterval<R>(function_: (interval: Interval) => R): R {
 return TypePools.interval.withTemporary(function_);
}
