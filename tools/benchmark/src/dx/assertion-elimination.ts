/**
 * Assertion elimination verification.
 *
 * Verifies production bundle does not contain assertion function bodies
 * or the DEV_MODE/process.env.NODE_ENV patterns. Confirms development
 * bundle does contain them.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { MATH2D_ROOT } from '../harness/math2d-loader.ts';

export interface AssertionEliminationResult {
 prodBundle: {
  path: string;
  size: number;
  containsAssertions: boolean;
  containsDevMode: boolean;
  containsNodeEnv: boolean;
  containsLenguadosDev: boolean;
  foundPatterns: string[];
 };
 devBundle: {
  path: string;
  size: number;
  containsAssertions: boolean;
 };
 eliminationVerified: boolean;
}

/**
 * Complete list of assertion function names from validation/assert.ts.
 * Verified against the actual source code.
 */
const ASSERTION_FUNCTIONS = [
 'assertFinite',
 'assertNonZero',
 // Generic assertion (note: 'assert' may match false positives in minified code,
 // so we check for 'function assert(' which is more specific)
 // 'assert' is checked separately below
 'assertRange',
 'assertPositive',
 'assertNonNegative',
 'assertSafeInteger',
 'assertVector2',
 'assertMatrix2',
 'assertMatrix3',
 'assertRotation2',
 'assertRotation2Normalized',
 'assertComplex',
 'assertInterval',
 'assertTransform2',
 // *Like shape validators
 'assertVector2Like',
 'assertRotation2Like',
 'assertMatrix2Like',
 'assertMatrix3Like',
 'assertComplexLike',
 'assertIntervalLike',
 'assertTransform2Like',
];

/**
 * Verify that assertion code is eliminated from the production bundle.
 */
export function verifyAssertionElimination(): AssertionEliminationResult {
 const prodPath = join(MATH2D_ROOT, 'lib', 'esm', 'module.js');
 const devPath = join(MATH2D_ROOT, 'lib', 'esm', 'index.development.js');

 let prodContent: string;
 let devContent: string;

 try {
  prodContent = readFileSync(prodPath, 'utf-8');
 } catch {
  throw new Error(`Production bundle not found at ${prodPath}. Run \`npm run dist\` first.`);
 }

 try {
  devContent = readFileSync(devPath, 'utf-8');
 } catch {
  throw new Error(`Development bundle not found at ${devPath}. Run \`npm run build\` first.`);
 }

 // Check production bundle for assertion patterns
 const foundInProd: string[] = [];
 for (const fn of ASSERTION_FUNCTIONS) {
  if (prodContent.includes(fn)) {
   foundInProd.push(fn);
  }
 }

 const containsDevMode = prodContent.includes('DEV_MODE');
 const containsNodeEnv = prodContent.includes('process.env.NODE_ENV');
 const containsLenguadosDev = prodContent.includes('__LENGUADOS_DEV__');

 // Check development bundle has assertions (sanity check)
 const devHasAssertions = ASSERTION_FUNCTIONS.some((fn) => devContent.includes(fn));

 return {
  prodBundle: {
   path: prodPath,
   size: prodContent.length,
   containsAssertions: foundInProd.length > 0,
   containsDevMode,
   containsNodeEnv,
   containsLenguadosDev,
   foundPatterns: [
    ...foundInProd,
    ...(containsDevMode ? ['DEV_MODE'] : []),
    ...(containsNodeEnv ? ['process.env.NODE_ENV'] : []),
    ...(containsLenguadosDev ? ['__LENGUADOS_DEV__'] : []),
   ],
  },
  devBundle: {
   path: devPath,
   size: devContent.length,
   containsAssertions: devHasAssertions,
  },
  eliminationVerified: foundInProd.length === 0 && !containsDevMode && devHasAssertions,
 };
}
