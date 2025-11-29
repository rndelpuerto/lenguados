import { describe, expect, it } from '@jest/globals';

import { ObjectPool, type Poolable } from '../../src/pool/object-pool';

class Dummy implements Poolable {
 value = 0;
 reset(): void {
  this.value = 0;
 }
}

describe('ObjectPool', () => {
 it('reuses instances and resets state', () => {
  const pool = new ObjectPool(() => new Dummy(), { initialSize: 1, maxSize: 2 });
  const first = pool.acquire();
  first.value = 42;
  pool.release(first);

  const second = pool.acquire();
  expect(second).toBe(first);
  expect(second.value).toBe(0);
 });

 it('throws when autoGrow is disabled and pool is empty', () => {
  const pool = new ObjectPool(() => new Dummy(), { initialSize: 1, maxSize: 1, autoGrow: false });
  pool.acquire();
  expect(() => pool.acquire()).toThrow();
 });

 it('scope automatically releases acquired objects', () => {
  const pool = new ObjectPool(() => new Dummy(), { initialSize: 0, maxSize: 4 });
  pool.scope((context) => {
   const a = context.acquire();
   const b = context.acquire();
   expect(pool.inUseCount).toBe(2);
   a.value = 1;
   b.value = 2;
  });
  expect(pool.inUseCount).toBe(0);
 });

 it('preallocate respects max size', () => {
  const pool = new ObjectPool(() => new Dummy(), { initialSize: 0, maxSize: 5 });
  pool.preallocate(10);
  expect(pool.availableCount).toBeLessThanOrEqual(5);
 });

 it('tryAcquire returns undefined when pool cannot grow', () => {
  const pool = new ObjectPool(() => new Dummy(), { initialSize: 1, maxSize: 1, autoGrow: false });
  const first = pool.acquire();
  expect(first).toBeDefined();
  expect(pool.tryAcquire()).toBeUndefined();
  pool.release(first);
  expect(pool.tryAcquire()).toBeDefined();
 });

 it('trim reduces available objects', () => {
  const pool = new ObjectPool(() => new Dummy(), { initialSize: 4, maxSize: 8 });
  expect(pool.availableCount).toBe(4);
  pool.trim(2);
  expect(pool.availableCount).toBe(2);
 });
});
