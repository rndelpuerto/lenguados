/**
 * @file test/dx/budget-gate.test.ts
 * @description Test the bundle-size budget gate semantics
 *
 * Covers the pure gate core with an injected measurer (pass, breach,
 * unmeasurable-is-a-breach, sweep participation), zlib determinism, and
 * the CLI loud-failure paths (budget-less package, unknown package) —
 * without invoking esbuild in unit tests.
 */

import { describe, expect, it } from '@jest/globals';
import { execSync } from 'node:child_process';
import { resolve } from 'node:path';
import { gzipSync } from 'node:zlib';

import { gateBudgetedEntries, hasDeclaredBudgets } from '../../src/dx/budget-gate.ts';

import type { BundleSizeResult } from '../../src/dx/bundle-size.ts';

const TOOL_ROOT = resolve(import.meta.dirname, '../..');

function stubMeasure(gzipBytes: number | null) {
 return (statement: string, label: string): BundleSizeResult | null =>
  gzipBytes === null
   ? null
   : { importPath: label, importStatement: statement, rawBytes: gzipBytes * 4, gzipBytes };
}

describe('gateBudgetedEntries (pure core)', () => {
 const imports = [
  { label: 'gated', statement: 'export {};', budgetGzipBytes: 1000 },
  { label: 'ungated', statement: 'export {};' },
 ];

 it('passes entries within budget and skips unbudgeted entries', () => {
  const { rows, breaches } = gateBudgetedEntries(imports, stubMeasure(900));
  expect(breaches).toBe(0);
  expect(rows).toHaveLength(1); // ungated entry not evaluated
  expect(rows[0]).toMatchObject({ label: 'gated', withinBudget: true, measuredGzipBytes: 900 });
 });

 it('exactly-at-budget passes (budget is a maximum, inclusive)', () => {
  const { breaches } = gateBudgetedEntries(imports, stubMeasure(1000));
  expect(breaches).toBe(0);
 });

 it('breaches an entry over budget', () => {
  const { rows, breaches } = gateBudgetedEntries(imports, stubMeasure(1001));
  expect(breaches).toBe(1);
  expect(rows[0]!.withinBudget).toBe(false);
 });

 it('an unmeasurable budgeted entry is a breach, never a silent skip', () => {
  const { rows, breaches } = gateBudgetedEntries(imports, stubMeasure(null));
  expect(breaches).toBe(1);
  expect(rows[0]).toMatchObject({ measuredGzipBytes: null, withinBudget: false });
 });
});

describe('hasDeclaredBudgets (sweep participation)', () => {
 it('true when any entry declares a budget', () => {
  expect(hasDeclaredBudgets({ imports: [{ label: 'a', statement: '', budgetGzipBytes: 1 }] })).toBe(
   true,
  );
 });

 it('false for budget-less configs and for missing configs', () => {
  expect(hasDeclaredBudgets({ imports: [{ label: 'a', statement: '' }] })).toBe(false);
  expect(hasDeclaredBudgets(null)).toBe(false);
 });
});

describe('zlib gzip determinism (the gated metric)', () => {
 it('same input produces identical gzip byte counts', () => {
  const input = Buffer.from('export const x = 42;\n'.repeat(500));
  const sizes = new Set([1, 2, 3].map(() => gzipSync(input).byteLength));
  expect(sizes.size).toBe(1);
 });
});

describe('size.ts CLI loud-failure paths (no bundling involved)', () => {
 function runSize(flags: string): { output: string; code: number } {
  try {
   const output = execSync(`npx tsx scripts/size.ts ${flags} 2>&1`, {
    encoding: 'utf-8',
    cwd: TOOL_ROOT,
    stdio: ['pipe', 'pipe', 'pipe'],
   });
   return { output, code: 0 };
  } catch (err: unknown) {
   const e = err as { status?: number; stdout?: string; stderr?: string };
   return { output: `${e.stdout ?? ''}${e.stderr ?? ''}`, code: e.status ?? 1 };
  }
 }

 it('budget-less package fails loudly naming the capability', () => {
  const { output, code } = runSize('--package=common');
  expect(code).not.toBe(0);
  expect(output).toContain('declares no bundle-size budgets');
 });

 it('unknown package fails loudly', () => {
  const { output, code } = runSize('--package=nonexistent');
  expect(code).not.toBe(0);
  expect(output).toContain('declares no bundle-size budgets');
 });
});
