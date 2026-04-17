/**
 * @file harness/comparison-reporter.ts
 * @description Report cross-library comparison results as ASCII tables and JSON
 *
 * Produces ASCII tables and JSON output comparing throughput
 * across libraries with geometric mean aggregate scores.
 */

import type { ComparisonResult, LibraryBenchmarkResult } from './comparison-runner.ts';
import { padLeft, padRight, formatOpsPerSec } from './format-utils.ts';
import type { AggregateScore } from './scoring.ts';

/** Specify an operation in the cross-library comparison vocabulary */
export interface OperationSpec {
 /** Standard operation name (e.g., "vectorAdd") */
 name: string;
 /** Category for grouping in reports (package-defined, e.g., "vector", "dynamics") */
 category: string;
 /** Mathematical specification of inputs and expected output */
 description: string;
 /** Number of input parameters (excluding output parameter) */
 inputCount: number;
}

/**
 * Format cross-library comparison results as an ASCII table
 *
 * @param result - The comparison result containing library stats and scores
 * @returns A formatted ASCII table string, or '(no libraries to compare)' if empty
 */
export function printComparisonAscii(result: ComparisonResult): string {
 const { libraries, scores, referenceLibrary } = result;

 if (libraries.length === 0) return '(no libraries to compare)';

 const opNames = [...new Set(libraries.flatMap((lib) => [...lib.operations.keys()]))].sort();

 const libNames = libraries.map((l) => l.libraryName);
 const colWidth = 14;

 const lines: string[] = [];

 // Header
 const header =
  padRight('Operation', 25) +
  libNames.map((name) => padLeft(name, colWidth)).join('') +
  padLeft('Ratio', 10);
 lines.push(header);
 lines.push('-'.repeat(header.length));

 // Data rows
 for (const opName of opNames) {
  let row = padRight(opName, 25);
  const opsValues: (number | null)[] = [];

  for (const lib of libraries) {
   const stats = lib.operations.get(opName);
   if (stats) {
    row += padLeft(formatOpsPerSec(stats.opsPerSec), colWidth);
    opsValues.push(stats.opsPerSec);
   } else {
    row += padLeft('N/A', colWidth);
    opsValues.push(null);
   }
  }

  // Compute ratio vs reference
  const refIdx = libNames.indexOf(referenceLibrary);
  const refOps = refIdx >= 0 ? opsValues[refIdx] : null;
  const nonRefIdx = libNames.findIndex((n) => n !== referenceLibrary);
  const nonRefOps = nonRefIdx >= 0 ? opsValues[nonRefIdx] : null;

  if (refOps && nonRefOps) {
   const ratio = nonRefOps / refOps;
   row += padLeft(`${ratio.toFixed(2)}x`, 10);
  } else {
   row += padLeft('-', 10);
  }

  lines.push(row);
 }

 // Aggregate score footer
 lines.push('-'.repeat(header.length));
 for (const [libName, score] of scores) {
  lines.push(
   `Geometric Mean: ${libName} vs ${referenceLibrary} = ${score.geometricMean.toFixed(3)}x ` +
    `(${score.geometricMean >= 1 ? 'faster' : 'slower'})`,
  );
 }

 return lines.join('\n');
}

/* ========================================================================== */
/* JSON Comparison Output                                                      */
/* ========================================================================== */

/** Describe the experimental conditions under which the comparison was run */
export interface ComparisonConditions {
 buildMode: string;
 tier: string;
 determinism: string;
 methodStyle: string;
}

/** Represent the full JSON output of a cross-library comparison */
export interface ComparisonJsonOutput {
 conditions?: ComparisonConditions;
 libraries: Array<{ name: string; version: string }>;
 operations: Array<{
  name: string;
  category: string;
  results: Record<string, { opsPerSec: number; meanNs: number; ci95lo: number; ci95hi: number }>;
  ratio?: number | undefined;
 }>;
 scores: Array<{
  target: string;
  reference: string;
  geometricMean: number;
  ratios: Array<{ operation: string; ratio: number }>;
 }>;
}

/**
 * Generate a JSON representation of the cross-library comparison
 *
 * @param result - The comparison result with per-library stats and scores
 * @param vocabulary - The operation vocabulary specifications
 * @param conditions - Optional experimental conditions metadata
 * @returns A ComparisonJsonOutput suitable for serialization
 */
export function generateComparisonJson(
 result: ComparisonResult,
 vocabulary: OperationSpec[],
 conditions?: ComparisonConditions,
): ComparisonJsonOutput {
 const { libraries, scores, referenceLibrary } = result;
 const ops = vocabulary;

 const opNames = [...new Set(libraries.flatMap((lib) => [...lib.operations.keys()]))].sort();

 const operations = opNames.map((opName) => {
  const spec = ops.find((o) => o.name === opName);
  const results: Record<
   string,
   { opsPerSec: number; meanNs: number; ci95lo: number; ci95hi: number }
  > = {};

  for (const lib of libraries) {
   const stats = lib.operations.get(opName);
   if (stats) {
    results[lib.libraryName] = {
     opsPerSec: stats.opsPerSec,
     meanNs: stats.mean,
     ci95lo: stats.ci95.lo,
     ci95hi: stats.ci95.hi,
    };
   }
  }

  // Compute ratio for non-reference libraries
  const refStats = libraries
   .find((l) => l.libraryName === referenceLibrary)
   ?.operations.get(opName);
  const nonRefLib = libraries.find((l) => l.libraryName !== referenceLibrary);
  const nonRefStats = nonRefLib?.operations.get(opName);
  const ratio =
   refStats && nonRefStats && refStats.opsPerSec > 0
    ? nonRefStats.opsPerSec / refStats.opsPerSec
    : undefined;

  return {
   name: opName,
   category: spec?.category ?? 'unknown',
   results,
   ratio,
  };
 });

 const scoreEntries = [...scores.entries()].map(([target, score]) => ({
  target,
  reference: referenceLibrary,
  geometricMean: score.geometricMean,
  ratios: score.ratios.map((r) => ({ operation: r.operation, ratio: r.ratio })),
 }));

 return {
  ...(conditions ? { conditions } : {}),
  libraries: libraries.map((l) => ({ name: l.libraryName, version: l.libraryVersion })),
  operations,
  scores: scoreEntries,
 };
}
