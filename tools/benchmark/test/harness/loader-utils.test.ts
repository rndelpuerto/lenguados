import { describe, expect, it } from '@jest/globals';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

import {
 MONOREPO_ROOT,
 createModuleCache,
 resolvePackageRoot,
 verifyArtifacts,
} from '../../src/harness/loader-utils.ts';

describe('MONOREPO_ROOT', () => {
 it('points to a directory containing package.json', () => {
  expect(existsSync(resolve(MONOREPO_ROOT, 'package.json'))).toBe(true);
 });

 it('points to a directory containing packages/', () => {
  expect(existsSync(resolve(MONOREPO_ROOT, 'packages'))).toBe(true);
 });
});

describe('resolvePackageRoot', () => {
 it('returns absolute path ending in packages/{name}', () => {
  const root = resolvePackageRoot('math2d');
  expect(root).toMatch(/packages\/math2d$/);
  expect(root.startsWith('/')).toBe(true);
 });

 it('resolves to an existing directory for math2d', () => {
  const root = resolvePackageRoot('math2d');
  expect(existsSync(root)).toBe(true);
 });

 it('resolves to nonexistent directory for unknown package', () => {
  const root = resolvePackageRoot('nonexistent-pkg');
  expect(existsSync(root)).toBe(false);
 });
});

describe('createModuleCache', () => {
 it('returns cache map and getOrLoad function', () => {
  const { cache, getOrLoad } = createModuleCache();
  expect(cache).toBeInstanceOf(Map);
  expect(typeof getOrLoad).toBe('function');
 });

 it('caches loaded modules', async () => {
  const { cache, getOrLoad } = createModuleCache();
  // Load a built-in module as stand-in
  const mod1 = await getOrLoad('development', 'node:path');
  const mod2 = await getOrLoad('development', 'node:path');
  expect(mod1).toBe(mod2);
  expect(cache.size).toBe(1);
 });
});

describe('verifyArtifacts', () => {
 it('returns null for existing files', async () => {
  // Use the loader-utils file itself as a stand-in for an existing artifact
  const selfPath = resolve(MONOREPO_ROOT, 'tools/benchmark/src/harness/loader-utils.ts');
  const result = await verifyArtifacts({ development: selfPath, production: selfPath }, 'test-pkg');
  expect(result).toBeNull();
 });

 it('returns error string for missing files', async () => {
  const result = await verifyArtifacts(
   { development: '/nonexistent/dev.js', production: '/nonexistent/prod.js' },
   'test-pkg',
  );
  expect(result).not.toBeNull();
  expect(result).toContain('test-pkg');
  expect(result).toContain('development');
  expect(result).toContain('/nonexistent/dev.js');
 });
});
