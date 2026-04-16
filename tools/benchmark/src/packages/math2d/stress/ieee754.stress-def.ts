/**
 * Stress test definition wrapper for IEEE 754 edge cases.
 *
 * Delegates to {@link testUnaryEdgeCases}, {@link testBinaryEdgeCases},
 * and {@link verifyNanPropagation} from the stress test library.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import type { StressTestDefinition, StressTestOutput } from '../../../harness/stress-types.ts';
import type { DiagnosticReport } from '../../../harness/diagnostics.ts';
import {
 testUnaryEdgeCases,
 testBinaryEdgeCases,
 verifyNanPropagation,
} from '../../../stress/ieee754-edge.stress.ts';

export const stressTest: StressTestDefinition = {
 name: 'ieee754',
 run(module: Record<string, unknown>, _options, diagnostics: DiagnosticReport): StressTestOutput {
  const V2 = module['Vector2'] as any;

  // Test unary operations with all 10 special values
  const magResults = testUnaryEdgeCases(
   'Vector2',
   'magnitude',
   (x: number) => V2.magnitude({ x, y: x }),
   diagnostics,
  );

  // Test binary operations with cartesian product of special values
  const dotResults = testBinaryEdgeCases(
   'Vector2',
   'dot',
   (a: number, b: number) => V2.dot({ x: a, y: 0 }, { x: b, y: 0 }),
   diagnostics,
  );

  // Verify NaN propagation on unchecked operations
  const normResults = testUnaryEdgeCases(
   'Vector2',
   'normalizeUnchecked',
   (x: number) => {
    const r = V2.normalizeUnchecked({ x, y: 1 });
    return r.x;
   },
   diagnostics,
  );
  verifyNanPropagation(normResults, diagnostics);

  const results = [...magResults, ...dotResults, ...normResults];

  return {
   results,
   log() {
    console.log(
     `    Vector2.magnitude: ${magResults.length} tests (${magResults.filter((r: any) => r.classification === 'throw').length} throws)`,
    );
    console.log(
     `    Vector2.dot: ${dotResults.length} tests (${dotResults.filter((r: any) => r.classification === 'NaN').length} NaN results)`,
    );
    console.log(`    NaN propagation verified across ${normResults.length} inputs`);
   },
  };
 },
};
