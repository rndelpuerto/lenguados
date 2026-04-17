/**
 * @file harness/stress-types.ts
 * @description Define interfaces for self-registering stress test definitions
 *
 * Each stress test exports a StressTestDefinition that encapsulates
 * its own module extraction, execution, and logging. The orchestrator
 * discovers definitions via glob and calls run() uniformly.
 */

import type { DiagnosticReport } from './diagnostics.ts';

/** Configure stress test execution parameters */
export interface StressOptions {
 /** Number of samples per test function (default: 1000) */
 samples: number;
}

/** Represent the output of a stress test run */
export interface StressTestOutput {
 /** Raw results to collect into the report */
 results: unknown[];
 /** Log results to console */
 log(): void;
}

/**
 * Encapsulate a self-registering stress test with its extraction, execution, and logging
 *
 * @remarks
 * The orchestrator discovers definitions by scanning `*.stress-def.ts` files
 * via glob and calls `run()` uniformly on each.
 *
 * @example
 * ```typescript
 * export const stressTest: StressTestDefinition = {
 *  name: 'ulp',
 *  run(module, options, diagnostics) {
 *   const results = [];
 *   // ... run stress test ...
 *   return {
 *    results,
 *    log() { console.log('ULP results:', results.length); },
 *   };
 *  },
 * };
 * ```
 */
export interface StressTestDefinition {
 /** Suite name matching --suite= filter (e.g., 'ulp', 'allocation') */
 name: string;

 /**
  * Execute the stress test
  *
  * @param module - The loaded package module namespace
  * @param options - Stress test configuration (sample count, etc.)
  * @param diagnostics - Diagnostic report for recording findings
  * @returns The stress test output containing results and a log function
  */
 run(
  module: Record<string, unknown>,
  options: StressOptions,
  diagnostics: DiagnosticReport,
 ): StressTestOutput | Promise<StressTestOutput>;
}
