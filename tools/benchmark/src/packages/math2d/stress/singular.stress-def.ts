/**
 * @file packages/math2d/stress/singular.stress-def.ts
 * @description Stress test definition wrapper for near-singular matrices
 *
 * Delegates to {@link runNearSingularStress} from the stress test library.
 */

import type { StressTestDefinition, StressTestOutput } from '../../../harness/stress-types.ts';
import type { DiagnosticReport } from '../../../harness/diagnostics.ts';
import { runNearSingularStress } from '../../../stress/near-singular.stress.ts';

/**
 * Test matrix inversion and solve behavior near the singularity boundary
 *
 * @remarks
 * Sweeps determinant values from near-zero to well-conditioned and
 * records the tier-dependent behavior (throw, fallback, or computed result)
 * and round-trip error.
 */
export const stressTest: StressTestDefinition = {
 name: 'nearSingular',
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
