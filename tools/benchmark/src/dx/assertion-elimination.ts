/**
 * Assertion elimination verification.
 *
 * Verifies production bundle does not contain assertion function bodies
 * or the DEV_MODE/process.env.NODE_ENV patterns. Confirms development
 * bundle does contain them.
 */

import { readFileSync } from 'node:fs';

import type { DxConfig } from '../harness/dx-types.ts';

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
 * Verify that assertion code is eliminated from the production bundle.
 */
export function verifyAssertionElimination(config: DxConfig): AssertionEliminationResult {
 const prodPath = config.prodBundle;
 const devPath = config.devBundle;

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

 // Check production bundle for assertion patterns from config
 const foundInProd: string[] = [];
 for (const fn of config.assertionPatterns) {
  if (prodContent.includes(fn)) {
   foundInProd.push(fn);
  }
 }

 const containsDevMode = prodContent.includes('DEV_MODE');
 const containsNodeEnv = prodContent.includes('process.env.NODE_ENV');
 const containsLenguadosDev = prodContent.includes('__LENGUADOS_DEV__');

 // Check development bundle has assertions (sanity check)
 const devHasAssertions = config.assertionPatterns.some((fn) => devContent.includes(fn));

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
