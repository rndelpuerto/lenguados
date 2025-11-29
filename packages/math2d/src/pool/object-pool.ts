/**
 * @file pool/object-pool.ts
 * @module @lenguados/math2d/pool
 * @description Generic object pooling system for reducing allocations
 */

import { NumericalValidator } from '../validation/numerical-validator';

/**
 * Interface for objects that can be pooled.
 */
export interface Poolable {
 /**
  * Resets the object to its initial state.
  * Called when the object is returned to the pool.
  */
 reset?(): void;
}

/**
 * Factory function for creating poolable objects.
 */
export type PoolFactory<T> = () => T;

/**
 * Configuration options for object pools.
 */
export interface PoolConfig {
 /**
  * Initial number of objects to pre-allocate.
  * @default 10
  */
 initialSize?: number;

 /**
  * Maximum number of objects to keep in the pool.
  * @default 100
  */
 maxSize?: number;

 /**
  * Whether to automatically grow the pool when empty.
  * @default true
  */
 autoGrow?: boolean;

 /**
  * Growth factor when auto-growing (multiplied by current size).
  * @default 1.5
  */
 growthFactor?: number;
}

/**
 * Generic object pool for reusing objects and reducing GC pressure.
 *
 * @typeParam T - Type of objects in the pool
 *
 * @remarks
 * Object pools help reduce garbage collection pressure by reusing objects
 * instead of creating new ones. This is especially beneficial for frequently
 * created short-lived objects like vectors in physics simulations.
 *
 * @example
 * ```typescript
 * // Create a pool for Vector2 objects
 * const pool = new ObjectPool(() => new Vector2(), {
 *   initialSize: 100,
 *   maxSize: 1000
 * });
 *
 * // Get an object from the pool
 * const v = pool.acquire();
 * v.set(10, 20);
 *
 * // Use the vector...
 *
 * // Return it to the pool when done
 * pool.release(v);
 * ```
 */
export class ObjectPool<T extends Poolable> {
 private readonly factory: PoolFactory<T>;
 private readonly available: T[] = [];
 private readonly config: Required<PoolConfig>;
 private totalCreated = 0;
 private inUse = 0;

 /**
  * Creates a new object pool.
  * @param factory - Function to create new objects
  * @param config - Pool configuration options
  */
 public constructor(factory: PoolFactory<T>, config: PoolConfig = {}) {
  this.factory = factory;
  this.config = ObjectPool.sanitizeConfig(config);

  // Pre-allocate initial objects
  this.grow(this.config.initialSize);
 }

 /**
  * Gets the number of objects currently available in the pool.
  * @returns Number of available objects
  */
 get availableCount(): number {
  return this.available.length;
 }

 /**
  * Gets the number of objects currently in use.
  * @returns Number of objects in use
  */
 get inUseCount(): number {
  return this.inUse;
 }

 /**
  * Gets the total number of objects created by the pool.
  * @returns Total number of objects created
  */
 get totalCount(): number {
  return this.totalCreated;
 }

 /**
  * Acquires an object from the pool.
  * @returns An object from the pool
  *
  * @throws {Error} If pool is empty and autoGrow is disabled
  */
 acquire(): T {
  const object = this.acquireInternal();
  if (!object) {
   throw new Error('ObjectPool: Pool is empty and autoGrow is disabled');
  }
  return object;
 }

 /**
  * Attempts to acquire an object without throwing when unavailable.
  * @returns An object if available; otherwise `undefined`
  */
 tryAcquire(): T | undefined {
  return this.acquireInternal();
 }

 /**
  * Returns an object to the pool.
  * @param obj - Object to return
  *
  * @remarks
  * The object's reset() method is called if it exists.
  * Objects are only kept if the pool is below maxSize.
  */
 release(object: T): void {
  if (!object) return;

  // Reset the object if it has a reset method
  if (object.reset) {
   object.reset();
  }

  this.inUse = Math.max(0, this.inUse - 1);

  // Only keep the object if we're below max size
  if (this.available.length < this.config.maxSize) {
   this.available.push(object);
  }
  // Otherwise, let it be garbage collected
 }

 /**
  * Trims the number of available objects to a maximum threshold.
  * @param maxAvailable - Maximum number of objects to keep available (default: 0)
  */
 trim(maxAvailable: number = 0): void {
  const sanitized = NumericalValidator.validateFinite(maxAvailable, 'ObjectPool.trim:maxAvailable');
  if (sanitized < 0) {
   throw new RangeError('ObjectPool.trim: maxAvailable must be non-negative');
  }
  const target = Math.min(Math.floor(sanitized), this.available.length);
  if (target < this.available.length) {
   this.available.length = target;
  }
 }

 /**
  * Releases multiple objects at once.
  * @param objects - Array of objects to release
  */
 releaseMany(objects: T[]): void {
  for (const object of objects) {
   this.release(object);
  }
 }

 /**
  * Pre-allocates objects to fill the pool.
  * @param count - Number of objects to create
  */
 preallocate(count: number): void {
  const toCreate = Math.min(count, this.config.maxSize - this.available.length - this.inUse);

  this.grow(toCreate);
 }

 /**
  * Clears all available objects from the pool.
  *
  * @remarks
  * This doesn't affect objects currently in use.
  */
 clear(): void {
  this.available.length = 0;
 }

 /**
  * Executes a function with a temporary object from the pool.
  * @param fn - Function to execute with the pooled object
  * @returns Result of the function
  *
  * @example
  * ```typescript
  * const result = pool.withTemporary(v => {
  *   v.set(10, 20);
  *   return v.length();
  * });
  * ```
  */
 withTemporary<R>(function_: (object: T) => R): R {
  const object = this.acquire();
  try {
   return function_(object);
  } finally {
   this.release(object);
  }
 }

 /**
  * Executes an async function with a temporary object from the pool.
  * @param fn - Async function to execute with the pooled object
  * @returns Promise with the result
  */
 async withTemporaryAsync<R>(function_: (object: T) => Promise<R>): Promise<R> {
  const object = this.acquire();
  try {
   return await function_(object);
  } finally {
   this.release(object);
  }
 }

 /**
  * Creates a scoped context for working with multiple pooled objects.
  * @returns Pool context for acquiring and auto-releasing objects
  *
  * @example
  * ```typescript
  * pool.scope(ctx => {
  *   const v1 = ctx.acquire();
  *   const v2 = ctx.acquire();
  *   // Use vectors...
  * }); // Both vectors are automatically released
  * ```
  */
 scope<R>(function_: (context: PoolContext<T>) => R): R {
  const context = new PoolContext(this);
  try {
   return function_(context);
  } finally {
   context.releaseAll();
  }
 }

 /**
  * Gets statistics about pool usage.
  * @returns Pool statistics
  */
 getStats(): PoolStats {
  return {
   available: this.available.length,
   inUse: this.inUse,
   total: this.totalCreated,
   maxSize: this.config.maxSize,
   utilizationRate: this.inUse / Math.max(1, this.totalCreated),
  };
 }

 private static sanitizeConfig(config: PoolConfig): Required<PoolConfig> {
  const initialSizeRaw = NumericalValidator.validateFinite(
   config.initialSize ?? 10,
   'ObjectPool.config.initialSize',
  );
  const maxSizeRaw = NumericalValidator.validateFinite(
   config.maxSize ?? 100,
   'ObjectPool.config.maxSize',
  );
  const growthFactorRaw = NumericalValidator.validateFinite(
   config.growthFactor ?? 1.5,
   'ObjectPool.config.growthFactor',
  );

  const initialSize = Math.max(0, Math.floor(initialSizeRaw));
  const maxSize = Math.max(initialSize || 1, Math.floor(maxSizeRaw));
  const growthFactor = Math.max(1, growthFactorRaw);

  return {
   initialSize,
   maxSize,
   autoGrow: config.autoGrow ?? true,
   growthFactor,
  };
 }

 private grow(count: number): void {
  if (count <= 0) return;
  for (let index = 0; index < count; index++) {
   if (this.totalCreated >= this.config.maxSize) break;
   this.available.push(this.createObject());
  }
 }

 private createObject(): T {
  this.totalCreated++;
  return this.factory();
 }

 private acquireInternal(): T | undefined {
  if (this.available.length === 0) {
   if (!this.config.autoGrow) {
    return undefined;
   }

   const growthSize = Math.ceil(
    Math.min(this.totalCreated * this.config.growthFactor, this.config.maxSize) - this.totalCreated,
   );

   if (growthSize > 0) {
    this.grow(growthSize);
   } else {
    this.inUse++;
    return this.createObject();
   }
  }

  const object = this.available.pop();
  if (!object) {
   return undefined;
  }
  this.inUse++;
  return object;
 }
}

/**
 * Context for managing multiple pooled objects with automatic cleanup.
 */
export class PoolContext<T extends Poolable> {
 private readonly pool: ObjectPool<T>;
 private readonly acquired: T[] = [];

 constructor(pool: ObjectPool<T>) {
  this.pool = pool;
 }

 /**
  * Acquires an object from the pool.
  * @returns Object from the pool
  */
 acquire(): T {
  const object = this.pool.acquire();
  this.acquired.push(object);
  return object;
 }

 /**
  * Releases all acquired objects back to the pool.
  */
 releaseAll(): void {
  for (const object of this.acquired) {
   this.pool.release(object);
  }
  this.acquired.length = 0;
 }
}

/**
 * Statistics about pool usage.
 */
export interface PoolStats {
 /** Number of objects available in the pool */
 available: number;
 /** Number of objects currently in use */
 inUse: number;
 /** Total number of objects created */
 total: number;
 /** Maximum pool size */
 maxSize: number;
 /** Percentage of created objects currently in use */
 utilizationRate: number;
}

/**
 * Global pool manager for managing multiple pools.
 *
 * @example
 * ```typescript
 * // Register pools
 * PoolManager.register('vector2', () => new Vector2());
 * PoolManager.register('matrix2', () => new Matrix2());
 *
 * // Use pools
 * const v = PoolManager.acquire('vector2');
 * // ... use vector ...
 * PoolManager.release('vector2', v);
 * ```
 */
export class PoolManager {
 // eslint-disable-next-line @typescript-eslint/no-explicit-any
 private static pools = new Map<string, ObjectPool<any>>();

 /**
  * Registers a new pool.
  * @param name - Pool identifier
  * @param factory - Factory function for creating objects
  * @param config - Pool configuration
  */
 static register<T extends Poolable>(
  name: string,
  factory: PoolFactory<T>,
  config?: PoolConfig,
 ): void {
  this.pools.set(name, new ObjectPool(factory, config));
 }

 /**
  * Gets a pool by name.
  * @param name - Pool identifier
  * @returns The pool, or undefined if not found
  */
 static getPool<T extends Poolable>(name: string): ObjectPool<T> | undefined {
  return this.pools.get(name);
 }

 /**
  * Acquires an object from a named pool.
  * @param name - Pool identifier
  * @returns Object from the pool
  *
  * @throws {Error} If pool doesn't exist
  */
 static acquire<T extends Poolable>(name: string): T {
  const pool = this.pools.get(name);
  if (!pool) {
   throw new Error(`PoolManager: Pool '${name}' not found`);
  }
  return pool.acquire();
 }

 /**
  * Attempts to acquire an object from a named pool without throwing.
  * @param name - Pool identifier
  * @returns Object from the pool or `undefined` if none are available
  */
 static tryAcquire<T extends Poolable>(name: string): T | undefined {
  const pool = this.pools.get(name);
  return pool?.tryAcquire();
 }

 /**
  * Releases an object to a named pool.
  * @param name - Pool identifier
  * @param obj - Object to release
  */
 // eslint-disable-next-line @typescript-eslint/no-explicit-any
 static release(name: string, object: any): void {
  const pool = this.pools.get(name);
  if (pool) {
   pool.release(object);
  }
 }

 /**
  * Trims available instances of a named pool.
  * @param name - Pool identifier
  * @param maxAvailable - Maximum number of available instances to keep
  */
 static trim(name: string, maxAvailable: number = 0): void {
  const pool = this.pools.get(name);
  pool?.trim(maxAvailable);
 }

 /**
  * Clears all pools.
  */
 static clearAll(): void {
  for (const pool of this.pools.values()) {
   pool.clear();
  }
 }

 /**
  * Trims all registered pools to the provided availability threshold.
  * @param maxAvailable - Maximum number of available instances to keep per pool
  */
 static trimAll(maxAvailable: number = 0): void {
  for (const pool of this.pools.values()) {
   pool.trim(maxAvailable);
  }
 }

 /**
  * Gets statistics for all pools.
  * @returns Map of pool names to statistics
  */
 static getAllStats(): Map<string, PoolStats> {
  const stats = new Map<string, PoolStats>();
  for (const [name, pool] of this.pools) {
   stats.set(name, pool.getStats());
  }
  return stats;
 }
}
