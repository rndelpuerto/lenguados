/**
 * @file dx/build-correctness.ts
 * @description Production build correctness verification
 *
 * Runs representative operations against both development and production
 * builds and compares results bit-for-bit. Verifies that the production
 * build (assertions stripped) maintains mathematical correctness. The
 * operation list and the assertion probe are package knowledge supplied
 * through DxConfig — this module never names package types.
 */

import { float64ToHex } from '../harness/ulp.ts';

import type { DxConfig } from '../harness/dx-types.ts';
import type { PackageLoader } from '../harness/package-loader.ts';

/** Bit-for-bit comparison result for a single operation across dev and prod builds */
export interface BuildCorrectnessResult {
 operation: string;
 devResultHex: string;
 prodResultHex: string;
 match: boolean;
}

/** Result of assertion stripping verification for a single invalid-input operation */
export interface AssertionBehaviorResult {
 operation: string;
 devThrows: boolean;
 prodThrows: boolean;
 correctBehavior: boolean;
}

/**
 * Compare dev vs prod build outputs for the package's representative operations
 *
 * All results must be bit-for-bit identical.
 *
 * @param loader - Package loader resolving the dev and prod builds
 * @param config - DX configuration carrying the operations and the assertion probe
 * @returns Correctness comparison results and assertion stripping results
 */
export async function verifyBuildCorrectness(
 loader: PackageLoader,
 config: Pick<DxConfig, 'correctnessOperations' | 'assertionProbe'>,
): Promise<{
 correctness: BuildCorrectnessResult[];
 assertions: AssertionBehaviorResult[];
}> {
 const devMod = (await loader.load('development')) as Record<string, unknown>;
 const prodMod = (await loader.load('production')) as Record<string, unknown>;

 const correctness: BuildCorrectnessResult[] = [];
 const assertions: AssertionBehaviorResult[] = [];

 for (const op of config.correctnessOperations) {
  const devResult = op.run(devMod);
  const prodResult = op.run(prodMod);
  correctness.push({
   operation: op.name,
   devResultHex: float64ToHex(devResult),
   prodResultHex: float64ToHex(prodResult),
   match: float64ToHex(devResult) === float64ToHex(prodResult),
  });
 }

 // Dev SHOULD throw (assertions active), prod should NOT throw (library-side DCE stripped them)
 let devThrows = false;
 let prodThrows = false;
 try {
  config.assertionProbe.run(devMod);
 } catch {
  devThrows = true;
 }
 try {
  config.assertionProbe.run(prodMod);
 } catch {
  prodThrows = true;
 }
 assertions.push({
  operation: config.assertionProbe.name,
  devThrows,
  prodThrows,
  correctBehavior: devThrows && !prodThrows,
 });

 return { correctness, assertions };
}
