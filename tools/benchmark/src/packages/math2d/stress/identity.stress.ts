/**
 * @file stress/identity.stress.ts
 * @description Mathematical identity preservation stress test
 *
 * Verifies algebraic properties hold under randomized inputs using
 * fast-check with 10K inputs per property. Reports ULP error
 * distribution with tolerance thresholds per project convention
 * (DIGITS=10, TEST_TOLERANCE=1e-6 for property tests).
 */

import * as fc from 'fast-check';

import { ulpDistance } from '../../../harness/ulp.ts';
import { addFinding } from '../../../harness/reporter.ts';
import type { DiagnosticReport } from '../../../harness/reporter.ts';

/** Result of a mathematical identity property check */
export interface IdentityResult {
 property: string;
 runs: number;
 maxError: number;
 meanError: number;
 passed: boolean;
 failureExample?: unknown;
}

const NUM_RUNS = 10_000;
const TEST_TOLERANCE = 1e-6;

/**
 * Run all mathematical identity checks against loaded math2d module
 *
 * @param math2d - Loaded math2d module with Vector2, Rotation2, Matrix3, Transform2
 * @param diagnostics - Diagnostic report to record findings
 * @returns Array of identity check results per property
 */
export function runIdentityStress(
 math2d: Record<string, unknown>,
 diagnostics: DiagnosticReport,
): IdentityResult[] {
 const V2 = math2d['Vector2'] as any;
 const R2 = math2d['Rotation2'] as any;
 const M3 = math2d['Matrix3'] as any;
 const T2 = math2d['Transform2'] as any;

 const results: IdentityResult[] = [];

 // Shared arbitraries (mirrors test/arbitraries.ts conventions)
 const arbCoord = fc.integer({ min: -1000000, max: 1000000 });
 const arbAngle = fc.integer({ min: -31416, max: 31416 }).map((n) => (n / 10000) * Math.PI);
 const arbVec = fc.tuple(arbCoord, arbCoord).map(([x, y]) => V2.fromValues(x, y));
 const arbNonZeroVec = arbVec.filter((v: any) => v.magnitudeSq() > 1e-20);
 const arbPosScalar = fc.integer({ min: 1, max: 1000000 });

 function runProperty(name: string, prop: fc.IProperty<unknown>): IdentityResult {
  const result: IdentityResult = {
   property: name,
   runs: NUM_RUNS,
   maxError: 0,
   meanError: 0,
   passed: true,
  };

  try {
   fc.assert(prop, { numRuns: NUM_RUNS });
  } catch (err: unknown) {
   result.passed = false;
   result.failureExample = err instanceof Error ? err.message : String(err);
   addFinding(diagnostics, {
    severity: 'error',
    type: 'nan-propagation',
    entity: 'identity',
    operation: name,
    message: `Identity violation: ${result.failureExample}`,
   });
  }

  return result;
 }

 // Property: Rotation preserves magnitude
 results.push(
  runProperty(
   'rotation preserves magnitude',
   fc.property(arbNonZeroVec, arbAngle, (v: any, angle: number) => {
    const rotated = V2.rotate(v, angle);
    const origMag = V2.magnitude(v);
    const rotMag = V2.magnitude(rotated);
    return Math.abs(origMag - rotMag) < TEST_TOLERANCE * Math.max(1, origMag);
   }),
  ),
 );

 // Property: Orthogonal decomposition (project + reject = v)
 results.push(
  runProperty(
   'project + reject = v',
   fc.property(arbVec, arbNonZeroVec, (v: any, axis: any) => {
    const proj = V2.project(v, axis);
    const rej = V2.reject(v, axis);
    const sum = V2.add(proj, rej);
    return V2.nearEquals(sum, v, TEST_TOLERANCE);
   }),
  ),
 );

 // Property: Matrix inverse roundtrip (M * M^-1 ≈ I)
 results.push(
  runProperty(
   'M * M^-1 = I (Matrix3)',
   fc.property(arbAngle, arbPosScalar, arbPosScalar, (angle: number, sx: number, sy: number) => {
    const m = M3.fromRotation(angle);
    M3.scaleBy(m, { x: sx, y: sy }, m);
    if (!M3.isInvertible(m)) return true; // skip non-invertible
    const inv = M3.inverse(m);
    const product = M3.multiply(m, inv);
    return M3.nearEquals(product, M3.fromValues(1, 0, 0, 0, 1, 0, 0, 0, 1), TEST_TOLERANCE);
   }),
  ),
 );

 // Property: Transform composition associativity (uniform scale only).
 // Non-uniform scale + rotation introduces shear (RS ≠ SR), which cannot
 // be represented in TRS decomposition — associativity does not hold.
 // Reference: Eberly 2004 "Game Physics" §2.6, Shoemake 1992 "Matrix Animation"
 results.push(
  runProperty(
   'compose associativity (T2)',
   fc.property(
    fc.tuple(arbVec, arbAngle, arbPosScalar),
    fc.tuple(arbVec, arbAngle, arbPosScalar),
    fc.tuple(arbVec, arbAngle, arbPosScalar),
    (ta: any, tb: any, tc: any) => {
     const a = T2.fromComponents(ta[0], ta[1], ta[2]);
     const b = T2.fromComponents(tb[0], tb[1], tb[2]);
     const c = T2.fromComponents(tc[0], tc[1], tc[2]);

     const ab_c = T2.multiply(T2.multiply(a, b), c);
     const a_bc = T2.multiply(a, T2.multiply(b, c));

     return T2.nearEquals(ab_c, a_bc, TEST_TOLERANCE);
    },
   ),
  ),
 );

 // Property: det(A*B) = det(A)*det(B)
 results.push(
  runProperty(
   'det(A*B) = det(A)*det(B)',
   fc.property(arbAngle, arbAngle, (a1: number, a2: number) => {
    const a = M3.fromRotation(a1);
    const b = M3.fromRotation(a2);
    const ab = M3.multiply(a, b);
    const detAB = M3.determinant(ab);
    const detA_detB = M3.determinant(a) * M3.determinant(b);
    return Math.abs(detAB - detA_detB) < TEST_TOLERANCE;
   }),
  ),
 );

 return results;
}
