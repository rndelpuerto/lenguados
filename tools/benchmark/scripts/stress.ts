/**
 * CLI entry point for stress tests.
 *
 * Usage: npm run stress -- [--suite=ulp|ieee754|cancellation|singular|overflow|identity|allocation]
 *        [--samples=N]
 *
 * Requires --expose-gc for allocation tests (auto-invoked via npm script).
 */

import { ensureBuildArtifacts } from './run.ts';
import { loadMath2d, getConfig } from '../src/harness/math2d-loader.ts';
import {
 createDiagnosticReport,
 formatDiagnosticSummary,
} from '../src/harness/reporter.ts';

const args = process.argv.slice(2);
const suiteArg = args.find((a) => a.startsWith('--suite='))?.split('=')[1];
const samplesArg = args.find((a) => a.startsWith('--samples='))?.split('=')[1];
const samples = samplesArg ? parseInt(samplesArg, 10) : 1000;

await ensureBuildArtifacts(['development']);

const math2d = await loadMath2d('development');
const config = getConfig(math2d);
config.useNativeMath = false;

const diagnostics = createDiagnosticReport();
const suites = suiteArg?.split(',') ?? ['ulp', 'ieee754', 'cancellation', 'singular', 'overflow', 'identity', 'allocation'];

console.log(`\n  Running stress tests: ${suites.join(', ')} (${samples} samples)\n`);

let suiteIndex = 0;
for (const suite of suites) {
 suiteIndex++;
 switch (suite) {
  case 'ulp': {
   const { runUlpAccuracyStress } = await import('../src/stress/ulp-accuracy.stress.ts');
   console.log(`  [${suiteIndex}/${suites.length}] ULP Accuracy...`);
   const results = runUlpAccuracyStress(math2d as Record<string, (...args: number[]) => number>, samples, diagnostics);
   for (const r of results) {
    console.log(`    ${r.fn}: max=${r.maxUlp} ULP, mean=${r.meanUlp.toFixed(3)} ULP (${r.sampleCount} samples)`);
   }
   break;
  }
  case 'ieee754': {
   const { testUnaryEdgeCases, testBinaryEdgeCases, verifyNanPropagation } = await import('../src/stress/ieee754-edge.stress.ts');
   console.log(`  [${suiteIndex}/${suites.length}] IEEE 754 Edge Cases...`);
   const V2 = math2d['Vector2'] as any;
   // Test unary operations with all 10 special values
   const magResults = testUnaryEdgeCases('Vector2', 'magnitude', (x: number) => V2.magnitude({ x, y: x }), diagnostics);
   console.log(`    Vector2.magnitude: ${magResults.length} tests (${magResults.filter((r: any) => r.classification === 'throw').length} throws)`);
   // Test binary operations with cartesian product of special values
   const dotResults = testBinaryEdgeCases('Vector2', 'dot', (a: number, b: number) => V2.dot({ x: a, y: 0 }, { x: b, y: 0 }), diagnostics);
   console.log(`    Vector2.dot: ${dotResults.length} tests (${dotResults.filter((r: any) => r.classification === 'NaN').length} NaN results)`);
   // Verify NaN propagation on unchecked operations
   const normResults = testUnaryEdgeCases('Vector2', 'normalizeUnchecked', (x: number) => {
    const r = V2.normalizeUnchecked({ x, y: 1 });
    return r.x;
   }, diagnostics);
   verifyNanPropagation(normResults, diagnostics);
   console.log(`    NaN propagation verified across ${normResults.length} inputs`);
   break;
  }
  case 'cancellation': {
   const { testCrossProductCancellation, testDeterminantCancellation } = await import('../src/stress/cancellation.stress.ts');
   console.log(`  [${suiteIndex}/${suites.length}] Catastrophic Cancellation...`);
   const V2 = math2d['Vector2'] as any;
   const M2 = math2d['Matrix2'] as any;
   const crossResults = testCrossProductCancellation(
    (ax, ay, bx, by) => V2.cross({ x: ax, y: ay }, { x: bx, y: by }),
    diagnostics,
   );
   for (const r of crossResults) {
    const label = r.isCatastrophic ? 'CATASTROPHIC' : 'ok';
    console.log(`    cross (mag=${Object.values(r.inputs)[0]!.toExponential(0)}): ${r.bitsLost.toFixed(0)} bits lost — ${label}`);
   }
   const detResults = testDeterminantCancellation(
    (m00, m01, m10, m11) => M2.determinant(M2.fromValues(m00, m01, m10, m11)),
    diagnostics,
   );
   for (const r of detResults) {
    const label = r.isCatastrophic ? 'CATASTROPHIC' : 'ok';
    console.log(`    det (mag=${Object.values(r.inputs)[0]!.toExponential(0)}): ${r.bitsLost.toFixed(0)} bits lost — ${label}`);
   }
   break;
  }
  case 'singular': {
   const { runNearSingularStress } = await import('../src/stress/near-singular.stress.ts');
   console.log(`  [${suiteIndex}/${suites.length}] Near-Singular Matrices...`);
   const results = runNearSingularStress(math2d, diagnostics);
   for (const r of results) {
    console.log(`    det=${r.determinant.toExponential(1)} tier=${r.tier}: ${r.behavior}${r.roundtripError !== undefined ? ` (error=${r.roundtripError.toExponential(2)})` : ''}`);
   }
   break;
  }
  case 'overflow': {
   const { runOverflowStress } = await import('../src/stress/overflow.stress.ts');
   console.log(`  [${suiteIndex}/${suites.length}] Overflow/Underflow...`);
   const results = runOverflowStress(math2d, diagnostics);
   for (const r of results) {
    console.log(`    ${r.test} [${r.tier}]: ${r.isFinite ? 'finite' : r.output} (expected: ${r.expected})`);
   }
   break;
  }
  case 'identity': {
   const { runIdentityStress } = await import('../src/stress/identity.stress.ts');
   console.log(`  [${suiteIndex}/${suites.length}] Mathematical Identities (10K inputs each)...`);
   const results = runIdentityStress(math2d, diagnostics);
   for (const r of results) {
    console.log(`    ${r.property}: ${r.passed ? 'PASS' : 'FAIL'}${r.failureExample ? ` — ${r.failureExample}` : ''}`);
   }
   break;
  }
  case 'allocation': {
   const { runAllocationStress } = await import('../src/stress/allocation.stress.ts');
   console.log(`  [${suiteIndex}/${suites.length}] Zero-Allocation Verification...`);
   const results = runAllocationStress(math2d, diagnostics);
   for (const r of results) {
    const status = r.isZeroAlloc ? 'ZERO-ALLOC' : `LEAK: ${r.bytesPerOp.toFixed(1)} B/op`;
    console.log(`    ${r.entity}.${r.operation} [${r.variant}]: ${status}`);
   }
   break;
  }
  default:
   console.warn(`  Unknown stress suite: ${suite}`);
 }
}

console.log(`\n  Diagnostics: ${formatDiagnosticSummary(diagnostics)}\n`);
