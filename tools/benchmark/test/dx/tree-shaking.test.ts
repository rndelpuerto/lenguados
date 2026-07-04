/**
 * @file test/dx/tree-shaking.test.ts
 * @description Test the tree-shaking dx-gate decision semantics
 *
 * Covers the 40% effectiveness threshold with stubbed bundle sizes (no
 * bundler invocation): `effectiveTreeShaking` flips exactly at the boundary
 * (>= 40% passes, anything below fails), and unmeasurable bundles are never
 * green. The size measurer is replaced via module mocking so the exported
 * `verifyTreeShaking` decision logic is exercised as-is, unmodified.
 */

import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import type { BundleSizeResult } from '../../src/dx/bundle-size.ts';
import type { DxConfig } from '../../src/harness/dx-types.ts';

// Stubbed raw sizes per measurement label ('full-library', 'minimal-import',
// 'bare-import'); a missing label simulates a failed (null) measurement.
const stubbedSizes = new Map<string, number>();

jest.unstable_mockModule('../../src/dx/bundle-size.ts', () => ({
 measureBundleSize: (importStatement: string, label: string): BundleSizeResult | null => {
  const rawBytes = stubbedSizes.get(label);
  return rawBytes === undefined
   ? null
   : { importPath: label, importStatement, rawBytes, gzipBytes: rawBytes };
 },
}));

const { verifyTreeShaking } = await import('../../src/dx/tree-shaking.ts');

const config: DxConfig = {
 root: '/stubbed/root',
 mainEntry: '/stubbed/root/main.mjs',
 devBundle: '/stubbed/root/dev.js',
 prodBundle: '/stubbed/root/prod.js',
 imports: [],
 assertionPatterns: ['assertFinite'],
 treeshakingMinimalImport: "export { X } from '/stubbed/root/main.mjs';",
 correctnessOperations: [],
 assertionProbe: { name: 'noop', run: () => undefined },
};

function stubSizes(full: number, minimal: number, bare: number): void {
 stubbedSizes.set('full-library', full);
 stubbedSizes.set('minimal-import', minimal);
 stubbedSizes.set('bare-import', bare);
}

beforeEach(() => {
 stubbedSizes.clear();
});

describe('verifyTreeShaking — 40% threshold boundary', () => {
 it('passes at exactly 40% reduction (threshold is inclusive)', () => {
  stubSizes(1000, 600, 0);

  const result = verifyTreeShaking(config);

  expect(result.reductionPercent).toBe(40);
  expect(result.effectiveTreeShaking).toBe(true);
 });

 it('fails just below the threshold (39.9%)', () => {
  stubSizes(1000, 601, 0);

  const result = verifyTreeShaking(config);

  expect(result.reductionPercent).toBeCloseTo(39.9, 10);
  expect(result.effectiveTreeShaking).toBe(false);
 });

 it('passes just above the threshold (40.1%)', () => {
  stubSizes(1000, 599, 0);

  const result = verifyTreeShaking(config);

  expect(result.reduction).toBe(401);
  expect(result.effectiveTreeShaking).toBe(true);
 });
});

describe('verifyTreeShaking — degenerate measurements are never green', () => {
 it('unmeasurable bundles yield 0% reduction, gate fails, sideEffects not empty', () => {
  // No labels stubbed: every measurement returns null.
  const result = verifyTreeShaking(config);

  expect(result.fullSize).toBe(0);
  expect(result.minimalSize).toBe(0);
  expect(result.reductionPercent).toBe(0);
  expect(result.effectiveTreeShaking).toBe(false);
  expect(result.sideEffectsEmpty).toBe(false);
 });

 it('sideEffectsEmpty requires a near-empty bare-import bundle (< 100 bytes)', () => {
  stubSizes(1000, 500, 99);
  expect(verifyTreeShaking(config).sideEffectsEmpty).toBe(true);

  stubSizes(1000, 500, 100);
  expect(verifyTreeShaking(config).sideEffectsEmpty).toBe(false);
 });
});
