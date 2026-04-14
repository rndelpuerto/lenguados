/**
 * Catastrophic cancellation stress test.
 *
 * Detects significant bit loss in subtraction-heavy operations
 * (cross product, determinant) with near-equal inputs.
 * Flags when >40 bits are lost out of 52 mantissa bits.
 */

import { cancellationBits } from '../harness/ulp.ts';
import { addFinding } from '../harness/reporter.ts';
import type { DiagnosticReport } from '../harness/reporter.ts';

export interface CancellationResult {
 operation: string;
 entity: string;
 bitsLost: number;
 inputs: Record<string, number>;
 result: number;
 isCatastrophic: boolean;
}

const CATASTROPHIC_THRESHOLD = 40;

/**
 * Test cross product cancellation with near-parallel vectors.
 */
export function testCrossProductCancellation(
 crossFn: (ax: number, ay: number, bx: number, by: number) => number,
 diagnostics: DiagnosticReport,
): CancellationResult[] {
 const results: CancellationResult[] = [];

 // Generate near-parallel vector pairs with increasing similarity
 const magnitudes = [1e5, 1e8, 1e10, 1e12, 1e15];

 for (const mag of magnitudes) {
  const ax = mag;
  const ay = mag + 1;
  const bx = mag;
  const by = mag + 2;

  // cross = ax*by - ay*bx = mag*(mag+2) - (mag+1)*mag = mag
  // But the intermediate products are ~mag^2, so cancellation occurs
  const result = crossFn(ax, ay, bx, by);
  const bits = cancellationBits(ax * by, ay * bx, result);

  const entry: CancellationResult = {
   operation: 'cross',
   entity: 'Vector2',
   bitsLost: bits,
   inputs: { ax, ay, bx, by },
   result,
   isCatastrophic: bits > CATASTROPHIC_THRESHOLD,
  };
  results.push(entry);

  if (entry.isCatastrophic) {
   addFinding(diagnostics, {
    severity: 'warning',
    type: 'cancellation',
    entity: 'Vector2',
    operation: 'cross',
    message: `${bits.toFixed(0)} bits lost (of 52) with magnitude ${mag.toExponential(0)}`,
    details: { inputs: entry.inputs, result, bitsLost: bits },
   });
  }
 }

 return results;
}

/**
 * Test determinant cancellation with near-singular matrices.
 */
export function testDeterminantCancellation(
 detFn: (m00: number, m01: number, m10: number, m11: number) => number,
 diagnostics: DiagnosticReport,
): CancellationResult[] {
 const results: CancellationResult[] = [];

 const magnitudes = [1e5, 1e8, 1e10, 1e12, 1e15];

 for (const mag of magnitudes) {
  const m00 = mag;
  const m01 = mag + 0.5;
  const m10 = mag + 0.5;
  const m11 = mag + 1;

  // det = m00*m11 - m01*m10 ≈ 0.75 (exact), but intermediates are ~mag^2
  const result = detFn(m00, m01, m10, m11);
  const bits = cancellationBits(m00 * m11, m01 * m10, result);

  const entry: CancellationResult = {
   operation: 'determinant',
   entity: 'Matrix2',
   bitsLost: bits,
   inputs: { m00, m01, m10, m11 },
   result,
   isCatastrophic: bits > CATASTROPHIC_THRESHOLD,
  };
  results.push(entry);

  if (entry.isCatastrophic) {
   addFinding(diagnostics, {
    severity: 'warning',
    type: 'cancellation',
    entity: 'Matrix2',
    operation: 'determinant',
    message: `${bits.toFixed(0)} bits lost (of 52) with magnitude ${mag.toExponential(0)}`,
    details: { inputs: entry.inputs, result, bitsLost: bits },
   });
  }
 }

 return results;
}
