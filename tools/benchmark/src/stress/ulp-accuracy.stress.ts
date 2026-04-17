/**
 * @file stress/ulp-accuracy.stress.ts
 * @description ULP accuracy stress test for deterministic kernel functions
 *
 * Measures the accuracy of all 11 scalar fdlibm kernel functions by comparing
 * against the decimal.js reference oracle at 50-digit precision.
 * Reports max/mean ULP error and distribution histogram.
 * fdlibm guarantees ≤1 ULP for transcendental functions.
 */

import { ulpDistance } from '../harness/ulp.ts';
import type { UlpResult } from '../harness/ulp.ts';
import { addFinding } from '../harness/reporter.ts';
import type { DiagnosticReport } from '../harness/reporter.ts';
import { ALL_KERNEL_FUNCTIONS, computeReferenceSet, clearOracleCache } from './reference-oracle.ts';
import type { KernelFunction } from './reference-oracle.ts';

/** Aggregated ULP accuracy measurement for a single kernel function */
export interface UlpAccuracyResult {
 fn: string;
 sampleCount: number;
 maxUlp: number;
 meanUlp: number;
 histogram: Record<string, number>;
 specialMismatches: number;
}

/**
 * Run ULP accuracy measurement for a single kernel function
 *
 * @param fn - Kernel function name to measure
 * @param kernelImpl - Actual kernel implementation to test
 * @param sampleCount - Number of domain-sampled inputs to test
 * @param diagnostics - Diagnostic report to record findings
 * @returns Aggregated ULP accuracy result with histogram
 */
export function measureUlpAccuracy(
 fn: KernelFunction,
 kernelImpl: (...args: number[]) => number,
 sampleCount: number,
 diagnostics: DiagnosticReport,
): UlpAccuracyResult {
 const references = computeReferenceSet(fn, sampleCount);
 const histogram: Record<string, number> = { '0': 0, '1': 0, '2+': 0 };
 let maxUlp = 0;
 let totalUlp = 0;
 let specialMismatches = 0;
 let measured = 0;

 for (const ref of references) {
  const actual = kernelImpl(...ref.args);
  const result: UlpResult = ulpDistance(ref.reference, actual);

  if (result.kind === 'special') {
   specialMismatches++;
   addFinding(diagnostics, {
    severity: 'warning',
    type: 'nan-propagation',
    entity: 'deterministic',
    operation: fn,
    message: `Special value mismatch: ${result.description}`,
    details: { args: ref.args, expected: ref.reference, actual },
   });
   continue;
  }

  measured++;
  const ulp = result.distance;
  totalUlp += ulp;
  if (ulp > maxUlp) maxUlp = ulp;

  if (ulp === 0) histogram['0']!++;
  else if (ulp === 1) histogram['1']!++;
  else histogram['2+']!++;

  if (ulp > 1) {
   addFinding(diagnostics, {
    severity: 'warning',
    type: 'overflow',
    entity: 'deterministic',
    operation: fn,
    message: `ULP error ${ulp} exceeds fdlibm guarantee (≤1 ULP)`,
    details: { args: ref.args, expected: ref.reference, actual, ulpDistance: ulp },
   });
  }
 }

 clearOracleCache();

 return {
  fn,
  sampleCount: measured,
  maxUlp,
  meanUlp: measured > 0 ? totalUlp / measured : 0,
  histogram,
  specialMismatches,
 };
}

/**
 * Run ULP accuracy for all 11 scalar deterministic kernel functions
 *
 * sinCos is excluded because it returns {sin, cos}, not a scalar.
 *
 * @param kernelModule - Module containing all kernel function implementations
 * @param samplesPerFunction - Number of domain-sampled inputs per function
 * @param diagnostics - Diagnostic report to record findings
 * @returns Array of ULP accuracy results, one per kernel function
 */
export function runUlpAccuracyStress(
 kernelModule: Record<string, (...args: number[]) => number>,
 samplesPerFunction: number,
 diagnostics: DiagnosticReport,
): UlpAccuracyResult[] {
 const results: UlpAccuracyResult[] = [];

 for (const fn of ALL_KERNEL_FUNCTIONS) {
  const impl = kernelModule[fn];
  if (typeof impl !== 'function') continue;
  results.push(measureUlpAccuracy(fn, impl, samplesPerFunction, diagnostics));
 }

 return results;
}
