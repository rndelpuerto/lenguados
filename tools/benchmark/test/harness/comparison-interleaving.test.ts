/**
 * @file test/harness/comparison-interleaving.test.ts
 * @description Pin the operation-major registration plan of the comparison runner
 *
 * The published cross-library ratio is only machine-noise-resistant when the
 * compared libraries execute each operation ADJACENTLY (paired execution
 * cancels shared-machine interference). These tests pin the plan invariants:
 * operation-major ordering, adapter order within an operation, per-adapter
 * operation support filtering, and the alias contract the result parser
 * depends on.
 */

import { describe, expect, it } from '@jest/globals';

import { planOperationMajorRegistration } from '../../src/harness/comparison-runner.ts';
import type { LibraryAdapter } from '../../src/harness/library-adapter.ts';

function adapterFixture(name: string, operations: string[]): LibraryAdapter {
 return {
  name,
  version: '0.0.0',
  getOperations: () => new Map(operations.map((op) => [op, () => 42])),
 };
}

describe('planOperationMajorRegistration', () => {
 const alpha = adapterFixture('alpha', ['vectorAdd', 'vectorDot', 'matrixMultiply']);
 const beta = adapterFixture('beta', ['vectorAdd', 'vectorDot', 'matrixMultiply']);
 const filter = new Set(['vectorAdd', 'vectorDot', 'matrixMultiply']);

 it('is operation-major: every registration of operation N precedes operation N+1', () => {
  const plan = planOperationMajorRegistration([alpha, beta], filter);
  const operationSequence = plan.map((p) => p.operation);
  // Once an operation block ends, that operation must never reappear.
  const seen = new Set<string>();
  let current = '';
  for (const op of operationSequence) {
   if (op !== current) {
    expect(seen.has(op)).toBe(false);
    seen.add(op);
    current = op;
   }
  }
  expect(seen.size).toBe(3);
 });

 it('places every adapter adjacent within each operation, preserving adapter order', () => {
  const plan = planOperationMajorRegistration([alpha, beta], filter);
  expect(plan.map((p) => `${p.operation}/${p.adapterName}`)).toEqual([
   'vectorAdd/alpha',
   'vectorAdd/beta',
   'vectorDot/alpha',
   'vectorDot/beta',
   'matrixMultiply/alpha',
   'matrixMultiply/beta',
  ]);
 });

 it('pins the alias contract the result parser depends on', () => {
  const plan = planOperationMajorRegistration([alpha, beta], filter);
  for (const entry of plan) {
   expect(entry.alias).toBe(`${entry.adapterName}::${entry.operation}`);
  }
 });

 it('omits an operation only for adapters that do not support it', () => {
  const partial = adapterFixture('partial', ['vectorAdd']);
  const plan = planOperationMajorRegistration([alpha, partial], filter);
  const vectorDotEntries = plan.filter((p) => p.operation === 'vectorDot');
  expect(vectorDotEntries.map((p) => p.adapterName)).toEqual(['alpha']);
  const vectorAddEntries = plan.filter((p) => p.operation === 'vectorAdd');
  expect(vectorAddEntries.map((p) => p.adapterName)).toEqual(['alpha', 'partial']);
 });

 it('excludes operations outside the filter', () => {
  const plan = planOperationMajorRegistration([alpha, beta], new Set(['vectorAdd']));
  expect(plan.every((p) => p.operation === 'vectorAdd')).toBe(true);
  expect(plan).toHaveLength(2);
 });
});
