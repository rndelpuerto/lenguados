/**
 * Cross-library comparison runner.
 *
 * Executes identical benchmarks across all registered library adapters
 * using the same mitata runner and statistics engine. Produces
 * comparison results with per-operation throughput ratios and
 * aggregate geometric mean scores.
 */

import { bench, do_not_optimize, group, run } from 'mitata';

import { benchmarkStats } from './statistics.ts';
import type { BenchmarkStats } from './statistics.ts';
import type { LibraryAdapter } from './library-adapter.ts';
import { aggregateScore } from './scoring.ts';
import type { AggregateScore, OperationResult } from './scoring.ts';

/* ========================================================================== */
/* Types                                                                       */
/* ========================================================================== */

export interface LibraryBenchmarkResult {
 libraryName: string;
 libraryVersion: string;
 operations: Map<string, BenchmarkStats>;
}

export interface ComparisonResult {
 libraries: LibraryBenchmarkResult[];
 scores: Map<string, AggregateScore>;
 referenceLibrary: string;
}

/* ========================================================================== */
/* Runner                                                                      */
/* ========================================================================== */

/**
 * Run standard vocabulary benchmarks across all provided adapters.
 *
 * Uses the same mitata runner for all libraries, ensuring identical
 * measurement methodology. Results are keyed by operation name,
 * enabling direct cross-library comparison.
 */
export async function runComparison(
 adapters: LibraryAdapter[],
 referenceLibrary: string,
 vocabularyNames: Set<string>,
 operationFilter?: Set<string>,
): Promise<ComparisonResult> {
 const filter = operationFilter ?? vocabularyNames;

 // Register all benchmarks across all libraries
 let totalOps = 0;
 for (const adapter of adapters) {
  const ops = adapter.getOperations();
  let adapterOps = 0;
  group(adapter.name, () => {
   for (const [opName, opFn] of ops) {
    if (!filter.has(opName)) continue;
    bench(`${adapter.name}::${opName}`, () => {
     do_not_optimize(opFn());
    }).gc('once');
    adapterOps++;
   }
  });
  totalOps += adapterOps;
  console.log(`  Registered ${adapterOps} operations for ${adapter.name}`);
 }

 // Execute all benchmarks with identical measurement
 process.stdout.write(`  Running ${totalOps} benchmarks across ${adapters.length} libraries...`);
 const comparisonStart = Date.now();

 let headerDone = false;
 const runResult = await run({
  colors: false,
  print: (line: unknown) => {
   const s = String(line);
   if (!headerDone) {
    if (s.startsWith('---')) headerDone = true;
    return;
   }
   if (s.trim() === '') process.stdout.write('.');
  },
 });

 const comparisonElapsed = ((Date.now() - comparisonStart) / 1000).toFixed(1);
 console.log(` done (${comparisonElapsed}s)\n`);

 // Parse results into per-library operation maps
 const libraryResults: LibraryBenchmarkResult[] = [];
 for (const adapter of adapters) {
  const operations = new Map<string, BenchmarkStats>();

  for (const trial of runResult.benchmarks) {
   if (!trial.alias.startsWith(`${adapter.name}::`)) continue;
   const opName = trial.alias.slice(adapter.name.length + 2);

   for (const trialRun of trial.runs) {
    if (trialRun.error || !trialRun.stats) continue;
    const rawSamples = trialRun.stats.samples ?? [];
    operations.set(opName, benchmarkStats(rawSamples));
   }
  }

  libraryResults.push({
   libraryName: adapter.name,
   libraryVersion: adapter.version,
   operations,
  });
 }

 // Compute pairwise scores against reference
 const scores = new Map<string, AggregateScore>();
 const refResult = libraryResults.find((r) => r.libraryName === referenceLibrary);

 if (refResult) {
  const refOps: OperationResult[] = [];
  for (const [op, stats] of refResult.operations) {
   refOps.push({ operation: op, meanNs: stats.mean, opsPerSec: stats.opsPerSec });
  }

  for (const libResult of libraryResults) {
   if (libResult.libraryName === referenceLibrary) continue;
   const targetOps: OperationResult[] = [];
   for (const [op, stats] of libResult.operations) {
    targetOps.push({ operation: op, meanNs: stats.mean, opsPerSec: stats.opsPerSec });
   }

   const score = aggregateScore(targetOps, refOps, libResult.libraryName, referenceLibrary);
   scores.set(libResult.libraryName, score);
  }
 }

 return { libraries: libraryResults, scores, referenceLibrary };
}
