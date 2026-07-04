/**
 * @file test/dx/assertion-elimination.test.ts
 * @description Test tree-aware assertion call-site elimination verification
 *
 * Covers: a dev tree with assertion call-site labels + DEV_MODE marker spread
 * across TWO modules (entry + imported module) against a clean prod tree
 * verifies elimination; a prod tree whose IMPORTED module (not the entry)
 * still carries a call-site label FAILS verification — proving the scan walks
 * the module tree instead of vacuously passing on a thin, clean entry facade.
 */

import { afterAll, describe, expect, it } from '@jest/globals';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

import { verifyAssertionElimination } from '../../src/dx/assertion-elimination.ts';

import type { DxConfig } from '../../src/harness/dx-types.ts';

const FIXTURE_ROOT = mkdtempSync(join(tmpdir(), 'assertion-elimination-'));

afterAll(() => {
 rmSync(FIXTURE_ROOT, { recursive: true, force: true });
});

function write(relativePath: string, content: string): string {
 const absolutePath = join(FIXTURE_ROOT, relativePath);
 mkdirSync(dirname(absolutePath), { recursive: true });
 writeFileSync(absolutePath, content);
 return absolutePath;
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

// Development tree: call-site labels and the DEV_MODE marker are spread
// across BOTH modules (entry has one label, imported module has another).
const devEntry = write(
 'dev/entry.js',
 [
  "import { assertFinite, fromAngle } from './core.js';",
  'const DEV_MODE = true;',
  'export function scale(factor) {',
  ' if (DEV_MODE) assertFinite(factor, "Vector2.scale:factor");',
  ' return fromAngle(factor);',
  '}',
  '',
 ].join('\n'),
);
write(
 'dev/core.js',
 [
  'const DEV_MODE = true;',
  'export function assertFinite(value, label) {',
  ' if (!Number.isFinite(value)) throw new RangeError(label);',
  '}',
  'export function fromAngle(angle) {',
  ' if (DEV_MODE) assertFinite(angle, "Vector2.fromAngle:angle");',
  ' return angle;',
  '}',
  '',
 ].join('\n'),
);

describe('verifyAssertionElimination — clean prod tree', () => {
 // Production tree: call sites gone; an empty no-op assertion definition
 // legitimately remains (barrel export), which must NOT fail verification.
 const prodEntry = write(
  'prod-clean/entry.js',
  'import{fromAngle}from"./core.js";export const angle=fromAngle(.5);\n',
 );
 write(
  'prod-clean/core.js',
  'export function assertFinite(t,e){}export function fromAngle(n){return n}\n',
 );

 it('verifies elimination: no call-site labels in prod, dev still asserts', () => {
  const result = verifyAssertionElimination(makeConfig(devEntry, prodEntry));

  expect(result.eliminationVerified).toBe(true);
  expect(result.prodBundle.callSiteLabels).toEqual([]);
  expect(result.prodBundle.containsDevMode).toBe(false);
  expect(result.prodBundle.containsNodeEnv).toBe(false);
  expect(result.prodBundle.containsLenguadosDev).toBe(false);
  // Empty no-op definitions remaining in prod are informational, not a failure.
  expect(result.prodBundle.containsAssertions).toBe(true);
  expect(result.prodBundle.foundPatterns).toEqual(['assertFinite']);
  // Dev sanity leg: the development tree still contains assertion identifiers.
  expect(result.devBundle.containsAssertions).toBe(true);
 });
});

describe('verifyAssertionElimination — tainted IMPORTED module (tree-awareness)', () => {
 // The entry is byte-identical to the clean case; ONLY the imported module
 // carries a leftover call-site label. An entry-only scan would be trivially
 // clean and vacuously green — the tree walk must catch this.
 const prodEntry = write(
  'prod-tainted/entry.js',
  'import{fromAngle}from"./core.js";export const angle=fromAngle(.5);\n',
 );
 write(
  'prod-tainted/core.js',
  'export function fromAngle(n){if(!Number.isFinite(n))throw new RangeError("Vector2.fromAngle:angle");return n}\n',
 );

 it('fails verification when a call site escapes DCE in a transitive module', () => {
  const result = verifyAssertionElimination(makeConfig(devEntry, prodEntry));

  expect(result.eliminationVerified).toBe(false);
  expect(result.prodBundle.callSiteLabels).toEqual(['"Vector2.fromAngle:angle"']);
 });
});
