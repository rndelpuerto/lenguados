import { describe, expect, it } from '@jest/globals';

import { discoverSuites } from '../../src/harness/suite.ts';

describe('discoverSuites', () => {
 it('discovers math2d suites', async () => {
  const suites = await discoverSuites('math2d');
  expect(suites.length).toBeGreaterThanOrEqual(1);
 });

 it('filters by regex', async () => {
  const suites = await discoverSuites('math2d', /vector2/);
  expect(suites).toHaveLength(1);
  expect(suites[0]!.name).toBe('Vector2');
 });

 it('returns empty for nonexistent package', async () => {
  const suites = await discoverSuites('nonexistent-pkg');
  expect(suites).toHaveLength(0);
 });
});
