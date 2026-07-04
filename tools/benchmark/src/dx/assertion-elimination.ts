/**
 * @file dx/assertion-elimination.ts
 * @description Library-side DCE assertion elimination verification
 *
 * Verifies that the production library bundle has its assertion **call sites**
 * (e.g., `assertFinite(angle, 'Vector2.fromAngle:angle')` invocations from
 * default-tier methods) eliminated by SWC + minify after the SWC plugin
 * replaces `__LENGUADOS_DEV__` with the literal `false` at library build time.
 *
 * The assertion **function definitions** (e.g., `function assertFinite(t,e){}`)
 * may remain as empty no-op exports in the production bundle — they are still
 * exported from the package barrel so consumer code that imports an assertion
 * directly continues to work, paying only an empty-call overhead until the
 * consumer's own bundler tree-shakes them. The assertion **logic** (Number.isFinite
 * checks, throw RangeError, etc.) is gone in production regardless.
 *
 * Strict pattern: this module's `eliminationVerified` flag is true only when
 * (a) call-site labels from the package's own code are gone from the
 * production tree, and (b) the development tree still contains assertion
 * call sites (proving the scan itself works). `DEV_MODE`/`NODE_ENV`
 * occurrences are reported informationally in the result but do not gate
 * the flag — consumers of the report decide their severity.
 *
 * Tree-aware: each build is scanned as the CONCATENATION of its entry file
 * plus every transitively reachable relative static import (preserveModules
 * layout) — scanning only a thin entry facade would be trivially clean and
 * vacuously green. A flat single-file bundle is a tree of one node, so
 * flat-layout scans are identical to a direct single-file read.
 */

import { existsSync } from 'node:fs';

import type { DxConfig } from '../harness/dx-types.ts';

import { collectReachableModules } from './module-graph.ts';

/** Result of assertion elimination verification across dev and prod bundles */
export interface AssertionEliminationResult {
 prodBundle: {
  path: string;
  size: number;
  containsAssertions: boolean;
  containsDevMode: boolean;
  containsNodeEnv: boolean;
  containsLenguadosDev: boolean;
  /** Assertion-failure label strings (`"<Type>.<method>:<param>"`) found in prod bundle */
  callSiteLabels: string[];
  /** Patterns from `assertionPatterns` that appear in prod bundle (informational — empty function defs may remain) */
  foundPatterns: string[];
 };
 devBundle: {
  path: string;
  size: number;
  containsAssertions: boolean;
 };
 /** True when no assertion-failure label strings appear in prod AND dev bundle still has assertions */
 eliminationVerified: boolean;
}

/**
 * Verify that assertion code is eliminated from the production bundle
 *
 * @param config - DX configuration with bundle paths and assertion patterns
 * @returns Assertion elimination verification result
 */
export function verifyAssertionElimination(config: DxConfig): AssertionEliminationResult {
 const prodPath = config.prodBundle;
 const devPath = config.devBundle;

 if (!existsSync(prodPath)) {
  throw new Error(`Production bundle not found at ${prodPath}. Run \`npm run dist\` first.`);
 }
 if (!existsSync(devPath)) {
  throw new Error(`Development bundle not found at ${devPath}. Run \`npm run build\` first.`);
 }

 // Concatenate the entry plus every transitively reachable relative module
 // per build. A missing TRANSITIVE module propagates the walker's own error
 // (build corruption must be loud, never a silently smaller scan).
 const prodContent = collectReachableModules(prodPath)
  .map((m) => m.code)
  .join('\n');
 const devContent = collectReachableModules(devPath)
  .map((m) => m.code)
  .join('\n');

 // Check production bundle for any leftover assertion-call-site labels of the
 // form `"<Type>.<method>:<param>"`. These are arguments passed to assertion
 // calls from default-tier methods. Under library-side DCE (Model B), these
 // call sites are wrapped in `if (__LENGUADOS_DEV__) { ... }` blocks and
 // eliminated by SWC + minify. The presence of any such label in the prod
 // bundle indicates a call site that escaped DCE and warrants investigation.
 const callSiteLabelRegex = /"[A-Z][a-zA-Z0-9]+\.[a-zA-Z][a-zA-Z0-9]*(?::[a-zA-Z][a-zA-Z0-9]*)?"/g;
 const callSiteLabels: string[] = Array.from(
  new Set(
   (prodContent.match(callSiteLabelRegex) ?? []).filter((label) =>
    /^"[A-Z][a-zA-Z0-9]+\.[a-z][a-zA-Z0-9]*:[a-z]/.test(label),
   ),
  ),
 );

 // Informational: which assertion patterns from config appear (typically as
 // empty function definitions and barrel re-exports) — not a failure mode.
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
   callSiteLabels,
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
  // Library-side DCE verified when zero call-site labels escape into prod
  // AND the development bundle still contains assertion identifiers.
  eliminationVerified: callSiteLabels.length === 0 && devHasAssertions,
 };
}
