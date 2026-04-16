/**
 * Production build correctness verification.
 *
 * Runs representative operations against both development and production
 * builds and compares results bit-for-bit. Verifies that production build
 * (assertions stripped) maintains mathematical correctness.
 */

import { math2dLoader } from '../packages/math2d/loader.ts';
import { float64ToHex } from '../harness/ulp.ts';

export interface BuildCorrectnessResult {
 operation: string;
 devResultHex: string;
 prodResultHex: string;
 match: boolean;
}

export interface AssertionBehaviorResult {
 operation: string;
 devThrows: boolean;
 prodThrows: boolean;
 correctBehavior: boolean;
}

/**
 * Compare dev vs prod build outputs for representative operations.
 * All results must be bit-for-bit identical.
 */
export async function verifyBuildCorrectness(): Promise<{
 correctness: BuildCorrectnessResult[];
 assertions: AssertionBehaviorResult[];
}> {
 const devMod = await math2dLoader.load('development');
 const prodMod = await math2dLoader.load('production');

 const correctness: BuildCorrectnessResult[] = [];
 const assertions: AssertionBehaviorResult[] = [];

 function compareOperation(name: string, devFn: () => number, prodFn: () => number): void {
  const devResult = devFn();
  const prodResult = prodFn();
  correctness.push({
   operation: name,
   devResultHex: float64ToHex(devResult),
   prodResultHex: float64ToHex(prodResult),
   match: float64ToHex(devResult) === float64ToHex(prodResult),
  });
 }

 function testAssertionStripping(name: string, devFn: () => void, prodFn: () => void): void {
  let devThrows = false;
  let prodThrows = false;

  try {
   devFn();
  } catch {
   devThrows = true;
  }
  try {
   prodFn();
  } catch {
   prodThrows = true;
  }

  assertions.push({
   operation: name,
   devThrows,
   prodThrows,
   // Dev SHOULD throw (assertions active), prod should NOT throw (stripped)
   correctBehavior: devThrows && !prodThrows,
  });
 }

 // Access types from each build
 const dV2 = devMod['Vector2'] as any;
 const pV2 = prodMod['Vector2'] as any;
 const dM3 = devMod['Matrix3'] as any;
 const pM3 = prodMod['Matrix3'] as any;
 const dR2 = devMod['Rotation2'] as any;
 const pR2 = prodMod['Rotation2'] as any;
 const dC = devMod['Complex'] as any;
 const pC = prodMod['Complex'] as any;

 // Correctness — same inputs, same outputs
 const v = { x: 3.5, y: 7.2 };
 const v2 = { x: 1.1, y: 4.8 };

 compareOperation(
  'Vector2.dot',
  () => dV2.dot(v, v2),
  () => pV2.dot(v, v2),
 );
 compareOperation(
  'Vector2.cross',
  () => dV2.cross(v, v2),
  () => pV2.cross(v, v2),
 );
 compareOperation(
  'Vector2.magnitude',
  () => dV2.magnitude(v),
  () => pV2.magnitude(v),
 );
 compareOperation(
  'Vector2.distance',
  () => dV2.distance(v, v2),
  () => pV2.distance(v, v2),
 );

 const m = dM3.fromRotation(0.7);
 const pm = pM3.fromRotation(0.7);
 compareOperation(
  'Matrix3.determinant',
  () => dM3.determinant(m),
  () => pM3.determinant(pm),
 );

 const r = dR2.fromAngle(0.7);
 const pr = pR2.fromAngle(0.7);
 compareOperation(
  'Rotation2.angle',
  () => dR2.angle(r),
  () => pR2.angle(pr),
 );

 const c = dC.fromValues(3.5, 7.2);
 const pc = pC.fromValues(3.5, 7.2);
 compareOperation(
  'Complex.magnitude',
  () => dC.magnitude(c),
  () => pC.magnitude(pc),
 );

 // Assertion stripping — dev throws, prod doesn't
 const zeroVec = { x: 0, y: 0 };
 testAssertionStripping(
  'Vector2.normalize(zero)',
  () => dV2.normalize(zeroVec),
  () => pV2.normalize(zeroVec),
 );

 return { correctness, assertions };
}
