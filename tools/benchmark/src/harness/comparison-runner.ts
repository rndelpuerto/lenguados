/**
 * @file harness/comparison-runner.ts
 * @description Execute cross-library comparison benchmarks
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

/** Contain per-operation benchmark statistics for a single library */
export interface LibraryBenchmarkResult {
 libraryName: string;
 libraryVersion: string;
 operations: Map<string, BenchmarkStats>;
}

/** Contain the full cross-library comparison with scores and reference library */
export interface ComparisonResult {
 libraries: LibraryBenchmarkResult[];
 scores: Map<string, AggregateScore>;
 referenceLibrary: string;
}

/** One planned bench registration: operation group + adapter + mitata alias */
export interface PlannedRegistration {
 operation: string;
 adapterName: string;
 alias: string;
 opFn: () => unknown;
}

/* ========================================================================== */
/* Registration Planning                                                       */
/* ========================================================================== */

/**
 * Plan bench registrations OPERATION-MAJOR
 *
 * @remarks
 * One contiguous block per operation containing every library's bench for
 * that operation, adjacent in execution order. Library-major registration
 * executed each library as a disjoint temporal block minutes apart, so
 * time-varying machine state (thermal, tenancy, GC pressure) hit the
 * libraries differentially and the published ratio absorbed that drift
 * (measured: same-commit geometric-mean ratio swings up to ±27.5% between
 * back-to-back runs). Adjacent paired execution cancels shared-machine
 * interference to first order.
 *
 * @param adapters - Library adapters to benchmark, in registration order
 * @param filter - Operation names to include
 * @returns Ordered registrations: all adapters of operation N precede operation N+1
 */
export function planOperationMajorRegistration(
 adapters: LibraryAdapter[],
 filter: Set<string>,
): PlannedRegistration[] {
 const operationMaps = new Map(adapters.map((a) => [a.name, a.getOperations()]));
 const plan: PlannedRegistration[] = [];
 for (const operation of filter) {
  for (const adapter of adapters) {
   const opFn = operationMaps.get(adapter.name)!.get(operation);
   if (!opFn) continue;
   plan.push({
    operation,
    adapterName: adapter.name,
    alias: `${adapter.name}::${operation}`,
    opFn,
   });
  }
 }
 return plan;
}

/* ========================================================================== */
/* Runner                                                                      */
/* ========================================================================== */

/**
 * Run standard vocabulary benchmarks across all provided adapters
 *
 * @remarks
 * Uses the same mitata runner for all libraries, ensuring identical
 * measurement methodology. Results are keyed by operation name,
 * enabling direct cross-library comparison.
 *
 * @param adapters - Library adapters to benchmark
 * @param referenceLibrary - Name of the reference library for scoring
 * @param vocabularyNames - Set of standard vocabulary operation names
 * @param operationFilter - Optional subset of operations to benchmark
 * @returns A ComparisonResult with per-library stats and aggregate scores
 */
export async function runComparison(
 adapters: LibraryAdapter[],
 referenceLibrary: string,
 vocabularyNames: Set<string>,
 operationFilter?: Set<string>,
): Promise<ComparisonResult> {
 const filter = operationFilter ?? vocabularyNames;

 // Register benchmarks from the operation-major plan (see
 // planOperationMajorRegistration for the pairing rationale): one mitata
 // group per operation, every library's bench for it adjacent.
 const plan = planOperationMajorRegistration(adapters, filter);
 const registered = new Map(adapters.map((a) => [a.name, 0]));

 const byOperation = new Map<string, PlannedRegistration[]>();
 for (const entry of plan) {
  const list = byOperation.get(entry.operation) ?? [];
  list.push(entry);
  byOperation.set(entry.operation, list);
 }

 let totalOps = 0;
 for (const [operation, entries] of byOperation) {
  group(operation, () => {
   for (const entry of entries) {
    bench(entry.alias, () => {
     do_not_optimize(entry.opFn());
    }).gc('once');
    registered.set(entry.adapterName, registered.get(entry.adapterName)! + 1);
    totalOps++;
   }
  });
 }
 for (const adapter of adapters) {
  console.log(`  Registered ${registered.get(adapter.name)} operations for ${adapter.name}`);
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
