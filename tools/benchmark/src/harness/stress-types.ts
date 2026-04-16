/**
 * Interface for self-registering stress test definitions.
 *
 * Each stress test exports a StressTestDefinition that encapsulates
 * its own module extraction, execution, and logging. The orchestrator
 * discovers definitions via glob and calls run() uniformly.
 */

import type { DiagnosticReport } from './diagnostics.ts';

export interface StressOptions {
 /** Number of samples per test function (default: 1000) */
 samples: number;
}

export interface StressTestOutput {
 /** Raw results to collect into the report */
 results: unknown[];
 /** Log results to console */
 log(): void;
}

export interface StressTestDefinition {
 /** Suite name matching --suite= filter (e.g., 'ulp', 'allocation') */
 name: string;
 /** Execute the stress test */
 run(
  module: Record<string, unknown>,
  options: StressOptions,
  diagnostics: DiagnosticReport,
 ): StressTestOutput | Promise<StressTestOutput>;
}
