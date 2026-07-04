/**
 * @file stress/near-singular.stress.ts
 * @description Near-singular matrix stress test
 *
 * Tests matrix inversion at determinants from 1e-15 to 1e-5, crossing
 * the MIN_SAFE_DIVISOR = 1e-10 boundary. Includes Hilbert 2x2 as
 * a canonical stress case. Tests all three tiers.
 */

import { addFinding } from '../../../harness/reporter.ts';
import type { DiagnosticReport } from '../../../harness/reporter.ts';

/** Result of a near-singular matrix inversion test for a single determinant and tier */
export interface SingularityResult {
 determinant: number;
 tier: string;
 behavior: 'success' | 'throw' | 'identity-fallback' | 'infinite-result';
 roundtripError?: number;
 conditionNumber?: number;
}

/**
 * Compute the Frobenius-norm condition number of a 2x2 matrix
 *
 * cond(A) ≈ frobeniusNorm(A) × frobeniusNorm(A^-1)
 *
 * @param m00 - Element at row 0, column 0
 * @param m01 - Element at row 0, column 1
 * @param m10 - Element at row 1, column 0
 * @param m11 - Element at row 1, column 1
 * @returns Condition number, or Infinity if the matrix is singular
 */
function conditionNumber2x2(m00: number, m01: number, m10: number, m11: number): number {
 const normA = Math.sqrt(m00 * m00 + m01 * m01 + m10 * m10 + m11 * m11);
 const det = m00 * m11 - m01 * m10;
 if (Math.abs(det) < 1e-300) return Infinity;
 const i00 = m11 / det;
 const i01 = -m01 / det;
 const i10 = -m10 / det;
 const i11 = m00 / det;
 const normInvA = Math.sqrt(i00 * i00 + i01 * i01 + i10 * i10 + i11 * i11);
 return normA * normInvA;
}

/**
 * Run near-singular stress test across determinant range
 *
 * @param math2d - Loaded math2d module with Matrix2 constructor
 * @param diagnostics - Diagnostic report to record findings
 * @returns Array of singularity test results per determinant and tier
 */
export function runNearSingularStress(
 math2d: Record<string, unknown>,
 diagnostics: DiagnosticReport,
): SingularityResult[] {
 const M2 = math2d['Matrix2'] as any;
 const results: SingularityResult[] = [];

 // Determinant range crossing MIN_SAFE_DIVISOR = 1e-10
 const determinants = [1e-15, 1e-13, 1e-11, 5e-11, 1e-10, 5e-10, 1e-9, 1e-7, 1e-5];

 for (const targetDet of determinants) {
  // Construct matrix with known determinant: [[1, 1], [1, 1+targetDet]]
  const m = M2.fromValues(1, 1, 1, 1 + targetDet);
  const cond = conditionNumber2x2(1, 1, 1, 1 + targetDet);

  // Default tier (strict — throws below MIN_SAFE_DIVISOR)
  try {
   const inv = M2.inverse(m);
   const product = M2.multiply(m, inv);
   const errorM00 = Math.abs(product.m00 - 1);
   const errorM11 = Math.abs(product.m11 - 1);
   const errorM01 = Math.abs(product.m01);
   const errorM10 = Math.abs(product.m10);
   const maxError = Math.max(errorM00, errorM11, errorM01, errorM10);

   results.push({
    determinant: targetDet,
    tier: 'default',
    behavior: 'success',
    roundtripError: maxError,
    conditionNumber: cond,
   });
  } catch {
   results.push({
    determinant: targetDet,
    tier: 'default',
    behavior: 'throw',
    conditionNumber: cond,
   });
  }

  // Safe tier (returns identity for singular)
  try {
   const inv = M2.inverseSafe(m);
   const isIdentity = M2.isIdentity(inv);
   results.push({
    determinant: targetDet,
    tier: 'safe',
    behavior: isIdentity ? 'identity-fallback' : 'success',
    conditionNumber: cond,
   });
  } catch {
   results.push({ determinant: targetDet, tier: 'safe', behavior: 'throw', conditionNumber: cond });
  }

  // Unchecked tier (no validation — may produce large/infinite values)
  try {
   const inv = M2.inverseUnchecked(m);
   const hasInf = !Number.isFinite(inv.m00) || !Number.isFinite(inv.m11);
   results.push({
    determinant: targetDet,
    tier: 'unchecked',
    behavior: hasInf ? 'infinite-result' : 'success',
    conditionNumber: cond,
   });
  } catch {
   results.push({
    determinant: targetDet,
    tier: 'unchecked',
    behavior: 'throw',
    conditionNumber: cond,
   });
  }
 }

 // Hilbert 2x2 canonical stress case: [[1, 0.5], [0.5, 1/3]]
 const hilbert = M2.fromValues(1, 0.5, 0.5, 1 / 3);
 const hilbertCond = conditionNumber2x2(1, 0.5, 0.5, 1 / 3);
 try {
  const inv = M2.inverse(hilbert);
  const product = M2.multiply(hilbert, inv);
  const err = Math.max(
   Math.abs(product.m00 - 1),
   Math.abs(product.m11 - 1),
   Math.abs(product.m01),
   Math.abs(product.m10),
  );

  results.push({
   determinant: 1 * (1 / 3) - 0.5 * 0.5,
   tier: 'hilbert-2x2',
   behavior: 'success',
   roundtripError: err,
   conditionNumber: hilbertCond,
  });

  if (err > 1e-12) {
   addFinding(diagnostics, {
    severity: 'warning',
    type: 'cancellation',
    entity: 'Matrix2',
    operation: 'inverse (Hilbert 2x2)',
    message: `Roundtrip error ${err.toExponential(3)} exceeds 1e-12`,
    details: { conditionNumber: hilbertCond, roundtripError: err },
   });
  }
 } catch {
  results.push({
   determinant: 1 / 12,
   tier: 'hilbert-2x2',
   behavior: 'throw',
   conditionNumber: hilbertCond,
  });
 }

 return results;
}
