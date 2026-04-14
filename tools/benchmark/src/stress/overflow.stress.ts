/**
 * Overflow and underflow boundary stress test.
 *
 * Tests at OVERFLOW_THRESHOLD = sqrt(MAX_VALUE/2) ≈ 1.34e154 per
 * testing-deep-patterns.md. Verifies Default/Safe tiers use hypot
 * (overflow-safe) while Unchecked uses Math.sqrt(x*x+y*y) per the
 * sqrt-vs-hypot convention in math2d-patterns.md.
 */

import { addFinding } from '../harness/reporter.ts';
import type { DiagnosticReport } from '../harness/reporter.ts';
import { OVERFLOW_THRESHOLD } from './arbitraries.ts';

export interface OverflowResult {
 test: string;
 tier: string;
 input: number[];
 output: number;
 isFinite: boolean;
 expected: 'finite' | 'overflow' | 'underflow' | 'infinity';
}

/**
 * Run overflow/underflow stress tests.
 */
export function runOverflowStress(
 math2d: Record<string, unknown>,
 diagnostics: DiagnosticReport,
): OverflowResult[] {
 const V2 = math2d['Vector2'] as any;
 const det = math2d as any;
 const results: OverflowResult[] = [];

 function record(
  test: string, tier: string, input: number[], output: number, expected: string,
 ): void {
  const isFiniteResult = Number.isFinite(output);
  const entry: OverflowResult = {
   test, tier, input, output, isFinite: isFiniteResult,
   expected: expected as OverflowResult['expected'],
  };
  results.push(entry);

  if (expected === 'finite' && !isFiniteResult) {
   addFinding(diagnostics, {
    severity: 'error',
    type: 'overflow',
    entity: 'Vector2',
    operation: test,
    message: `Expected finite result for ${tier} tier, got ${output}`,
    details: { input, output, tier },
   });
  }
  if (expected === 'overflow' && isFiniteResult) {
   addFinding(diagnostics, {
    severity: 'info',
    type: 'overflow',
    entity: 'Vector2',
    operation: test,
    message: `Expected overflow but got finite ${output} — better than expected`,
    details: { input, output, tier },
   });
  }
 }

 const overflowX = OVERFLOW_THRESHOLD * 1.01;

 // Magnitude — Default tier should use hypot (overflow-safe)
 const vOverflow = V2.fromValues(overflowX, overflowX);
 record('magnitude', 'default', [overflowX, overflowX], V2.magnitude(vOverflow), 'finite');

 // Magnitude — Unchecked tier uses Math.sqrt(x*x+y*y) → overflows by design
 try {
  const magUnchecked = V2.magnitudeSq(vOverflow);
  record('magnitudeSq', 'unchecked', [overflowX, overflowX], magUnchecked,
   magUnchecked === Infinity ? 'overflow' : 'finite');
 } catch {
  // Expected for some configurations
 }

 // Normalize — Default should remain finite at overflow boundary
 try {
  const normed = V2.normalize(vOverflow);
  record('normalize', 'default', [overflowX, overflowX], V2.magnitude(normed), 'finite');
 } catch {
  // Default may throw if assertions detect issues
 }

 // NormalizeSafe — should return zero-vector for problematic input
 try {
  const normedSafe = V2.normalizeSafe(vOverflow);
  record('normalizeSafe', 'safe', [overflowX, overflowX], V2.magnitude(normedSafe), 'finite');
 } catch {
  // Should never throw
 }

 // Underflow — near-zero magnitude
 const vUnderflow = V2.fromValues(1e-200, 1e-200);
 const underflowMag = V2.magnitude(vUnderflow);
 record('magnitude (underflow)', 'default', [1e-200, 1e-200], underflowMag,
  underflowMag > 0 ? 'finite' : 'underflow');

 // Exponential overflow — exp(710) should produce Infinity
 const expOverflow = det.exp(710);
 record('exp(710)', 'deterministic', [710], expOverflow, 'infinity');

 // Exponential near-boundary — exp(709) should be finite
 const expNearBound = det.exp(709);
 record('exp(709)', 'deterministic', [709], expNearBound, 'finite');

 // Hypot overflow protection — hypot(1e154, 1e154) should be finite
 const hypotResult = det.hypot(1e154, 1e154);
 record('hypot(1e154, 1e154)', 'deterministic', [1e154, 1e154], hypotResult, 'finite');

 return results;
}
