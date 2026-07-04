/**
 * @file dx/module-graph.ts
 * @description Reachable-module walker for tree-shaped ESM build output
 *
 * The production ESM dist is a multi-module tree (thin entry files importing
 * relative sibling modules, preserveModules layout). Any dx check that reads
 * "the bundle" must therefore measure the entry PLUS every transitively
 * reachable relative static import — a flat single-file bundle is simply a
 * tree of one node, so flat-layout behavior is byte-identical. This walker is
 * the single shared implementation used by build-comparison.ts and
 * assertion-elimination.ts.
 *
 * Contract:
 * - Follows static `import ... from`, side-effect `import '...'`, and
 *   `export ... from` specifiers that are RELATIVE (`./` or `../`).
 * - Ignores type-only imports (`import type`/`export type`), dynamic
 *   `import(...)` expressions, and bare/package specifiers.
 * - A missing module file THROWS — build corruption must be loud, never a
 *   silently smaller measurement.
 * - Cycle-safe and deduplicating: every module appears exactly once, in
 *   deterministic depth-first discovery order (entry first).
 */

import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

/** A module reached from a build entry via relative static imports */
export interface ModuleNode {
 /** Absolute file path of the module */
 path: string;
 /** Raw file bytes (byte-exact for size measurement) */
 bytes: Buffer;
 /** UTF-8 decoded source (for pattern scanning) */
 code: string;
}

// Static import/export clauses with a from-specifier (`import {x} from './a.js'`,
// `export * from "./b.js"`, `export {x as y} from './c.js'`), tolerant of
// minified spacing (`import{x}from"./a.js"`). `[^'";]*?` confines a match to a
// single statement — neither a quote nor a `;` may appear between the keyword
// and its from-clause — so the scan never jumps across statement boundaries.
// The `(?!\s+type\b)` lookahead skips type-only forms, which never contribute
// runtime modules.
const STATIC_FROM_CLAUSE = /\b(?:import|export)\b(?!\s+type\b)[^'";]*?\bfrom\s*['"]([^'"]+)['"]/g;

// Side-effect imports (`import './polyfill.js'`). Dynamic `import(...)`
// cannot match: a `(` follows the keyword instead of a quote.
const SIDE_EFFECT_IMPORT = /\bimport\b\s*['"]([^'"]+)['"]/g;

/**
 * Extract the RELATIVE static import/export-from specifiers of a module
 *
 * @param code - Module source code to scan
 * @returns Relative specifiers (`./` or `../`) in document order
 */
function extractRelativeSpecifiers(code: string): string[] {
 const found: Array<{ index: number; specifier: string }> = [];

 for (const regex of [STATIC_FROM_CLAUSE, SIDE_EFFECT_IMPORT]) {
  regex.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(code)) !== null) {
   found.push({ index: match.index, specifier: match[1]! });
  }
 }

 return found
  .sort((a, b) => a.index - b.index)
  .map((f) => f.specifier)
  .filter((specifier) => specifier.startsWith('./') || specifier.startsWith('../'));
}

/**
 * Collect the entry module plus every transitively reachable relative import
 *
 * @param entryPath - Path of the build entry file (absolute or cwd-relative)
 * @returns Deduplicated modules in depth-first discovery order, entry first
 * @throws Error when the entry or any transitively imported file is missing
 */
export function collectReachableModules(entryPath: string): ModuleNode[] {
 const visited = new Set<string>();
 const nodes: ModuleNode[] = [];

 function visit(absolutePath: string, importedFrom: string | null): void {
  if (visited.has(absolutePath)) return; // dedupe + cycle safety
  visited.add(absolutePath);

  if (!existsSync(absolutePath)) {
   throw new Error(
    importedFrom === null
     ? `Module graph entry not found: ${absolutePath}`
     : `Unresolvable static import: ${absolutePath} (imported from ${importedFrom})`,
   );
  }

  const bytes = readFileSync(absolutePath);
  const code = bytes.toString('utf-8');
  nodes.push({ path: absolutePath, bytes, code });

  for (const specifier of extractRelativeSpecifiers(code)) {
   visit(resolve(dirname(absolutePath), specifier), absolutePath);
  }
 }

 visit(resolve(entryPath), null);
 return nodes;
}
