import { describe, expect, it, beforeEach } from '@jest/globals';

import { TypePools } from '../../src/pool/pooled-types';

describe('TypePools', () => {
 beforeEach(() => {
  TypePools.clearAll();
 });

 it('tryVector2 returns undefined when no instances available', () => {
  const maybeVector = TypePools.tryVector2();
  expect(maybeVector).toBeUndefined();
 });

 it('trimAll reduces availability', () => {
  TypePools.vector2.preallocate(10);
  expect(TypePools.vector2.availableCount).toBeGreaterThanOrEqual(10);

  TypePools.trimAll(2);
  expect(TypePools.vector2.availableCount).toBeLessThanOrEqual(2);
 });
});
