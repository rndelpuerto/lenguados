/**
 * IEEE 754 edge case stress test.
 *
 * Systematically tests all core type operations with the cartesian product
 * of 10 IEEE 754 special values. Verifies NaN propagation per IEEE 754-2019
 * §6.2 and the project's NaN Propagation Policy.
 */

import { addFinding } from '../harness/reporter.ts';
import type { DiagnosticReport } from '../harness/reporter.ts';
import { IEEE754_SPECIAL_VALUES, specialValuePairs } from './arbitraries.ts';

export type ResultClassification = 'finite' | 'NaN' | '+Infinity' | '-Infinity' | 'throw';

export interface EdgeCaseResult {
 operation: string;
 entity: string;
 input: number[];
 classification: ResultClassification;
 value?: number;
 error?: string;
}

function classify(value: number): ResultClassification {
 if (Number.isNaN(value)) return 'NaN';
 if (value === Infinity) return '+Infinity';
 if (value === -Infinity) return '-Infinity';
 return 'finite';
}

/**
 * Test a unary operation with all special values.
 */
export function testUnaryEdgeCases(
 entity: string,
 operation: string,
 fn: (x: number) => number,
 diagnostics: DiagnosticReport,
): EdgeCaseResult[] {
 const results: EdgeCaseResult[] = [];

 for (const x of IEEE754_SPECIAL_VALUES) {
  try {
   const value = fn(x);
   results.push({ operation, entity, input: [x], classification: classify(value), value });
  } catch (err: unknown) {
   const message = err instanceof Error ? err.message : String(err);
   results.push({ operation, entity, input: [x], classification: 'throw', error: message });
  }
 }

 return results;
}

/**
 * Test a binary operation with all special value pairs.
 */
export function testBinaryEdgeCases(
 entity: string,
 operation: string,
 fn: (a: number, b: number) => number,
 diagnostics: DiagnosticReport,
): EdgeCaseResult[] {
 const results: EdgeCaseResult[] = [];

 for (const [a, b] of specialValuePairs()) {
  try {
   const value = fn(a, b);
   results.push({ operation, entity, input: [a, b], classification: classify(value), value });
  } catch (err: unknown) {
   const message = err instanceof Error ? err.message : String(err);
   results.push({ operation, entity, input: [a, b], classification: 'throw', error: message });
  }
 }

 return results;
}

/**
 * Verify NaN propagation: NaN input to unchecked operations should produce NaN output.
 * Per architecture-and-layers.md NaN Propagation Policy: "NaN in → NaN out".
 */
export function verifyNanPropagation(
 results: EdgeCaseResult[],
 diagnostics: DiagnosticReport,
): void {
 for (const r of results) {
  const hasNanInput = r.input.some((v) => Number.isNaN(v));
  if (!hasNanInput) continue;

  // Unchecked operations should propagate NaN, not throw or produce finite
  if (r.classification === 'finite') {
   addFinding(diagnostics, {
    severity: 'error',
    type: 'nan-propagation',
    entity: r.entity,
    operation: r.operation,
    message: `NaN input produced finite output (${r.value}) — violates NaN propagation policy`,
    details: { input: r.input, output: r.value },
   });
  }
 }
}
