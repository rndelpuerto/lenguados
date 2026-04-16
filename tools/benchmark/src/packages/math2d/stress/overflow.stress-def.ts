/**
 * Stress test definition wrapper for overflow/underflow.
 *
 * Delegates to {@link runOverflowStress} from the stress test library.
 */

import type { StressTestDefinition, StressTestOutput } from '../../../harness/stress-types.ts';
import type { DiagnosticReport } from '../../../harness/diagnostics.ts';
import { runOverflowStress } from '../../../stress/overflow.stress.ts';

export const stressTest: StressTestDefinition = {
 name: 'overflow',
 run(module: Record<string, unknown>, _options, diagnostics: DiagnosticReport): StressTestOutput {
  const results = runOverflowStress(module, diagnostics);

  return {
   results,
   log() {
    for (const r of results) {
     console.log(
      `    ${r.test} [${r.tier}]: ${r.isFinite ? 'finite' : r.output} (expected: ${r.expected})`,
     );
    }
   },
  };
 },
};
