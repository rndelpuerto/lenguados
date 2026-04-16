/**
 * Stress test definition wrapper for zero-allocation verification.
 *
 * Delegates to {@link runAllocationStress} from the stress test library.
 */

import type { StressTestDefinition, StressTestOutput } from '../../../harness/stress-types.ts';
import type { DiagnosticReport } from '../../../harness/diagnostics.ts';
import { runAllocationStress } from '../../../stress/allocation.stress.ts';

export const stressTest: StressTestDefinition = {
 name: 'allocation',
 run(module: Record<string, unknown>, _options, diagnostics: DiagnosticReport): StressTestOutput {
  const results = runAllocationStress(module, diagnostics);

  return {
   results,
   log() {
    for (const r of results) {
     const status = r.isZeroAlloc ? 'ZERO-ALLOC' : `LEAK: ${r.bytesPerOp.toFixed(1)} B/op`;
     console.log(`    ${r.entity}.${r.operation} [${r.variant}]: ${status}`);
    }
   },
  };
 },
};
