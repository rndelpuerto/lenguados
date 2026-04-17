/**
 * @file packages/math2d/stress/cancellation.stress-def.ts
 * @description Stress test definition wrapper for catastrophic cancellation
 *
 * Delegates to {@link testCrossProductCancellation} and
 * {@link testDeterminantCancellation} from the stress test library.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import type { StressTestDefinition, StressTestOutput } from '../../../harness/stress-types.ts';
import type { DiagnosticReport } from '../../../harness/diagnostics.ts';
import {
 testCrossProductCancellation,
 testDeterminantCancellation,
} from '../../../stress/cancellation.stress.ts';

/**
 * Measure catastrophic cancellation in cross product and determinant computations
 *
 * @remarks
 * Tests how many significant bits are lost when nearly-parallel vectors or
 * near-singular matrices trigger floating-point subtraction cancellation.
 */
export const stressTest: StressTestDefinition = {
 name: 'cancellation',
 run(module: Record<string, unknown>, _options, diagnostics: DiagnosticReport): StressTestOutput {
  const V2 = module['Vector2'] as any;
  const M2 = module['Matrix2'] as any;

  const crossResults = testCrossProductCancellation(
   (ax, ay, bx, by) => V2.cross({ x: ax, y: ay }, { x: bx, y: by }),
   diagnostics,
  );

  const detResults = testDeterminantCancellation(
   (m00, m01, m10, m11) => M2.determinant(M2.fromValues(m00, m01, m10, m11)),
   diagnostics,
  );

  const results = [...crossResults, ...detResults];

  return {
   results,
   log() {
    for (const r of crossResults) {
     const label = r.isCatastrophic ? 'CATASTROPHIC' : 'ok';
     console.log(
      `    cross (mag=${Object.values(r.inputs)[0]!.toExponential(0)}): ${r.bitsLost.toFixed(0)} bits lost — ${label}`,
     );
    }
    for (const r of detResults) {
     const label = r.isCatastrophic ? 'CATASTROPHIC' : 'ok';
     console.log(
      `    det (mag=${Object.values(r.inputs)[0]!.toExponential(0)}): ${r.bitsLost.toFixed(0)} bits lost — ${label}`,
     );
    }
   },
  };
 },
};
