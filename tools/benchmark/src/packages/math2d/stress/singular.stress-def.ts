/**
 * Stress test definition wrapper for near-singular matrices.
 *
 * Delegates to {@link runNearSingularStress} from the stress test library.
 */

import type { StressTestDefinition, StressTestOutput } from '../../../harness/stress-types.ts';
import type { DiagnosticReport } from '../../../harness/diagnostics.ts';
import { runNearSingularStress } from '../../../stress/near-singular.stress.ts';

export const stressTest: StressTestDefinition = {
 name: 'singular',
 run(module: Record<string, unknown>, _options, diagnostics: DiagnosticReport): StressTestOutput {
  const results = runNearSingularStress(module, diagnostics);

  return {
   results,
   log() {
    for (const r of results) {
     console.log(
      `    det=${r.determinant.toExponential(1)} tier=${r.tier}: ${r.behavior}${r.roundtripError !== undefined ? ` (error=${r.roundtripError.toExponential(2)})` : ''}`,
     );
    }
   },
  };
 },
};
