/**
 * @file packages/math2d/stress/ulp.stress-def.ts
 * @description Stress test definition wrapper for ULP accuracy
 *
 * Delegates to {@link runUlpAccuracyStress} from the stress test library.
 */

import type { StressTestDefinition, StressTestOutput } from '../../../harness/stress-types.ts';
import type { DiagnosticReport } from '../../../harness/diagnostics.ts';
import { runUlpAccuracyStress } from './ulp-accuracy.stress.ts';

/**
 * Measure ULP (unit in the last place) accuracy of deterministic kernel functions
 *
 * @remarks
 * Compares fdlibm kernel outputs against high-precision reference values,
 * reporting maximum and mean ULP error across the configured sample count.
 */
export const stressTest: StressTestDefinition = {
 name: 'ulp',
 run(module: Record<string, unknown>, options, diagnostics: DiagnosticReport): StressTestOutput {
  const kernelModule = module as Record<string, (...args: number[]) => number>;
  const results = runUlpAccuracyStress(kernelModule, options.samples, diagnostics);

  return {
   results,
   log() {
    for (const r of results) {
     console.log(
      `    ${r.fn}: max=${r.maxUlp} ULP, mean=${r.meanUlp.toFixed(3)} ULP (${r.sampleCount} samples)`,
     );
    }
   },
  };
 },
};
