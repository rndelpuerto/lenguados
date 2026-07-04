/**
 * @file test/dx/build-comparison.test.ts
 * @description Test tree-aware dev vs prod build size comparison
 *
 * Covers: a module-tree fixture (entry importing two modules, separate dev
 * and prod entries) is measured as the SUM of raw and gzip bytes over the
 * reachable set — not just the entry file; and a flat single-file fixture
 * degenerates to exactly that single file's raw and gzip size.
 */

import { afterAll, describe, expect, it } from '@jest/globals';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { gzipSync } from 'node:zlib';

import { compareBuildSizes } from '../../src/dx/build-comparison.ts';

import type { DxConfig } from '../../src/harness/dx-types.ts';

const FIXTURE_ROOT = mkdtempSync(join(tmpdir(), 'build-comparison-'));

afterAll(() => {
 rmSync(FIXTURE_ROOT, { recursive: true, force: true });
});

function write(relativePath: string, content: string): string {
 const absolutePath = join(FIXTURE_ROOT, relativePath);
 mkdirSync(dirname(absolutePath), { recursive: true });
 writeFileSync(absolutePath, content);
 return absolutePath;
}

/** Expected totals mirror the implementation's contract: per-module raw + gzip sums. */
function expectedTotals(paths: string[]): { raw: number; gzip: number } {
 let raw = 0;
 let gzip = 0;
 for (const path of paths) {
  const bytes = readFileSync(path);
  raw += bytes.length;
  gzip += gzipSync(bytes).length;
 }
 return { raw, gzip };
}

function makeConfig(devBundle: string, prodBundle: string): DxConfig {
 return {
  root: FIXTURE_ROOT,
  mainEntry: join(FIXTURE_ROOT, 'main.mjs'),
  devBundle,
  prodBundle,
  imports: [],
  assertionPatterns: ['assertFinite'],
  treeshakingMinimalImport: "export { X } from './main.mjs';",
  correctnessOperations: [],
  assertionProbe: { name: 'noop', run: () => undefined },
 };
}

describe('compareBuildSizes — module tree (entry + two imported modules)', () => {
 // Dev tree is deliberately larger than prod (padding comment stands in for
 // the validation code that library-side DCE strips from production).
 const devEntry = write(
  'tree/dev/entry.js',
  "import { a } from './a.js';\nexport * from './b.js';\nexport const entry = a;\n",
 );
 const devA = write(
  'tree/dev/a.js',
  'export const a = 1;\n// development-only padding: assertion scaffolding lives here\n',
 );
 const devB = write('tree/dev/b.js', 'export const b = 2;\n// more development-only padding\n');

 const prodEntry = write(
  'tree/prod/entry.js',
  'import{a}from"./a.js";export*from"./b.js";export const entry=a;\n',
 );
 const prodA = write('tree/prod/a.js', 'export const a=1;\n');
 const prodB = write('tree/prod/b.js', 'export const b=2;\n');

 it('sums raw and gzip totals over the reachable set of each build', () => {
  const dev = expectedTotals([devEntry, devA, devB]);
  const prod = expectedTotals([prodEntry, prodA, prodB]);

  const result = compareBuildSizes(makeConfig(devEntry, prodEntry));

  expect(result.devSize).toEqual({ raw: dev.raw, gzip: dev.gzip });
  expect(result.prodSize).toEqual({ raw: prod.raw, gzip: prod.gzip });
  expect(result.difference).toEqual({ raw: dev.raw - prod.raw, gzip: dev.gzip - prod.gzip });
  expect(result.reductionPercent.raw).toBeCloseTo(((dev.raw - prod.raw) / dev.raw) * 100, 10);
  expect(result.reductionPercent.gzip).toBeCloseTo(((dev.gzip - prod.gzip) / dev.gzip) * 100, 10);
 });

 it('measures MORE than the entry alone (an entry-only read would undercount)', () => {
  const entryOnly = expectedTotals([devEntry]);

  const result = compareBuildSizes(makeConfig(devEntry, prodEntry));

  expect(result.devSize.raw).toBeGreaterThan(entryOnly.raw);
  expect(result.devSize.gzip).toBeGreaterThan(entryOnly.gzip);
 });
});

describe('compareBuildSizes — flat single-file build', () => {
 it('degenerates to exactly the single file size (tree of one node)', () => {
  const devContent = 'export const dev = true; // padded with a development-mode comment\n';
  const prodContent = 'export const dev=!1;\n';
  const flatDev = write('flat/dev.js', devContent);
  const flatProd = write('flat/prod.js', prodContent);

  const result = compareBuildSizes(makeConfig(flatDev, flatProd));

  expect(result.devSize.raw).toBe(Buffer.byteLength(devContent));
  expect(result.devSize.gzip).toBe(gzipSync(Buffer.from(devContent)).length);
  expect(result.prodSize.raw).toBe(Buffer.byteLength(prodContent));
  expect(result.prodSize.gzip).toBe(gzipSync(Buffer.from(prodContent)).length);
 });
});
