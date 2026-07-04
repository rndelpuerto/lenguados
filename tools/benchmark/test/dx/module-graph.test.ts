/**
 * @file test/dx/module-graph.test.ts
 * @description Test the reachable-module walker used by tree-aware dx checks
 *
 * Covers: a flat file (no imports) is a single-node graph; a small module
 * tree with a shared dependency imported twice is walked completely and
 * deduplicated; missing entry and missing import targets THROW (never a
 * silent skip); cycles terminate; dynamic imports, type-only imports, and
 * bare specifiers are ignored.
 */

import { afterAll, describe, expect, it } from '@jest/globals';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

import { collectReachableModules } from '../../src/dx/module-graph.ts';

const FIXTURE_ROOT = mkdtempSync(join(tmpdir(), 'module-graph-'));

afterAll(() => {
 rmSync(FIXTURE_ROOT, { recursive: true, force: true });
});

function write(relativePath: string, content: string): string {
 const absolutePath = join(FIXTURE_ROOT, relativePath);
 mkdirSync(dirname(absolutePath), { recursive: true });
 writeFileSync(absolutePath, content);
 return absolutePath;
}

describe('collectReachableModules — flat file', () => {
 it('a file with no relative imports yields a single node (the entry itself)', () => {
  const content = 'export const answer = 42;\n';
  const entry = write('flat/entry.js', content);

  const nodes = collectReachableModules(entry);

  expect(nodes).toHaveLength(1);
  expect(nodes[0]!.path).toBe(entry);
  expect(nodes[0]!.code).toBe(content);
  expect(nodes[0]!.bytes.equals(Buffer.from(content, 'utf-8'))).toBe(true);
 });
});

describe('collectReachableModules — module tree', () => {
 it('walks a tree with a shared dep imported twice: 4 nodes total, deduped, entry first', () => {
  // entry uses minified spacing to prove the specifier scan tolerates it.
  const entry = write(
   'tree/entry.js',
   'import{helperA}from"./a.js";export*from"./b.js";export const entry=helperA;\n',
  );
  const a = write(
   'tree/a.js',
   "import { shared } from '../shared/dep.js';\nexport const helperA = shared + 1;\n",
  );
  const b = write('tree/b.js', "export { shared as helperB } from '../shared/dep.js';\n");
  const dep = write('shared/dep.js', 'export const shared = 42;\n');

  const nodes = collectReachableModules(entry);

  // Shared dep is reached from BOTH a.js and b.js but appears exactly once.
  expect(nodes).toHaveLength(4);
  expect(nodes.map((n) => n.path)).toEqual([entry, a, dep, b]);
 });

 it('is cycle-safe: mutually importing modules terminate with each node once', () => {
  const first = write('cycle/first.js', "import './second.js';\nexport const one = 1;\n");
  const second = write('cycle/second.js', "import './first.js';\nexport const two = 2;\n");

  const nodes = collectReachableModules(first);

  expect(nodes.map((n) => n.path)).toEqual([first, second]);
 });

 it('ignores dynamic imports, type-only imports, and bare specifiers', () => {
  // None of the ignored targets exist on disk — following any of them would throw.
  const entry = write(
   'ignored/entry.js',
   [
    "import type { Phantom } from './type-only.js';",
    "export type { Shape } from './type-reexport.js';",
    "const lazy = () => import('./dynamic.js');",
    "import { readFileSync } from 'node:fs';",
    "import 'some-package';",
    "import './real.js';",
    'export const keep = lazy && readFileSync;',
   ].join('\n'),
  );
  const real = write('ignored/real.js', 'export const real = true;\n');

  const nodes = collectReachableModules(entry);

  expect(nodes.map((n) => n.path)).toEqual([entry, real]);
 });
});

describe('collectReachableModules — missing files THROW', () => {
 it('throws when a transitively imported module does not exist', () => {
  const entry = write('broken/entry.js', "export { gone } from './missing.js';\n");

  expect(() => collectReachableModules(entry)).toThrow(/missing\.js/);
  expect(() => collectReachableModules(entry)).toThrow(/imported from .*entry\.js/);
 });

 it('throws when the entry itself does not exist', () => {
  expect(() => collectReachableModules(join(FIXTURE_ROOT, 'nope.js'))).toThrow(/entry not found/i);
 });
});
