/**
 * Stress test definition wrapper for mathematical identities.
 *
 * Delegates to {@link runIdentityStress} from the stress test library.
 */

import type { StressTestDefinition, StressTestOutput } from '../../../harness/stress-types.ts';
import type { DiagnosticReport } from '../../../harness/diagnostics.ts';
import { runIdentityStress } from '../../../stress/identity.stress.ts';

export const stressTest: StressTestDefinition = {
 name: 'identity',
 run(module: Record<string, unknown>, _options, diagnostics: DiagnosticReport): StressTestOutput {
  const results = runIdentityStress(module, diagnostics);

  return {
   results,
   log() {
    for (const r of results) {
     console.log(
      `    ${r.property}: ${r.passed ? 'PASS' : 'FAIL'}${r.failureExample ? ` — ${r.failureExample}` : ''}`,
     );
    }
   },
  };
 },
};
