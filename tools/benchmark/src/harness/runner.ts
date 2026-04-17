/**
 * @file harness/runner.ts
 * @description Wrap mitata's API behind a stable adapter interface
 *
 * If mitata introduces breaking changes, only this module needs updating.
 * All suites interact with mitata exclusively through this adapter.
 *
 * Key responsibilities:
 * - Wraps bench()/group()/run() behind a stable interface
 * - Enforces do_not_optimize() on every benchmark result (DCE protection)
 * - Collects raw iteration timings for post-processing by statistics engine
 * - Captures process.cpuUsage() and process.memoryUsage() per benchmark
 * - Configures GC mode per suite
 */

import { bench, do_not_optimize, group, run } from 'mitata';

import { benchmarkStats } from './statistics.ts';
import type { BenchmarkStats } from './statistics.ts';

/* ========================================================================== */
/* Types                                                                       */
/* ========================================================================== */

/** GC collection strategy: 'once' before group, 'inner' per iteration, or disabled */
export type GcMode = 'once' | 'inner' | false;

/** Define a single benchmark with its function and optional GC override */
export interface BenchmarkDefinition {
 /** Human-readable name for this benchmark */
 name: string;
 /** The function to benchmark. MUST return a value to prevent DCE. */
 fn: () => unknown;
 /** GC mode override for this specific benchmark */
 gcMode?: GcMode;
}

/** Capture CPU and memory resource metrics for a benchmark run */
export interface ResourceMetrics {
 cpuUser: number;
 cpuSystem: number;
 rss: number;
 heapUsed: number;
 heapTotal: number;
 external: number;
 arrayBuffers: number;
}

/** Represent the full result of a single benchmark execution */
export interface BenchmarkResult {
 name: string;
 stats: BenchmarkStats;
 rawSamples: number[];
 resources: ResourceMetrics;
 cpuWallClockDivergence: number | null;
}

/** Represent the results of a benchmark group execution */
export interface GroupResult {
 name: string;
 benchmarks: BenchmarkResult[];
}

/* ========================================================================== */
/* Resource Metrics Collection                                                 */
/* ========================================================================== */

/**
 * Capture current CPU and memory resource metrics
 *
 * @returns A snapshot of CPU and memory usage
 */
function captureResources(): ResourceMetrics {
 const mem = process.memoryUsage();
 const cpu = process.cpuUsage();
 return {
  cpuUser: cpu.user,
  cpuSystem: cpu.system,
  rss: mem.rss,
  heapUsed: mem.heapUsed,
  heapTotal: mem.heapTotal,
  external: mem.external,
  arrayBuffers: mem.arrayBuffers,
 };
}

/**
 * Compute the delta between two resource metric snapshots
 *
 * @param before - Resource metrics captured before execution
 * @param after - Resource metrics captured after execution
 * @returns The difference (after - before) for each metric
 */
function resourceDelta(before: ResourceMetrics, after: ResourceMetrics): ResourceMetrics {
 return {
  cpuUser: after.cpuUser - before.cpuUser,
  cpuSystem: after.cpuSystem - before.cpuSystem,
  rss: after.rss - before.rss,
  heapUsed: after.heapUsed - before.heapUsed,
  heapTotal: after.heapTotal - before.heapTotal,
  external: after.external - before.external,
  arrayBuffers: after.arrayBuffers - before.arrayBuffers,
 };
}

/**
 * Detect CPU vs wall-clock time divergence
 *
 * @remarks
 * For CPU-bound math operations, CPU time should be close to wall-clock time.
 * A large divergence indicates GC pauses, OS scheduling, or I/O blocking.
 *
 * @param cpuMicroseconds - Total CPU time in microseconds
 * @param wallClockNs - Mean wall-clock time per sample in nanoseconds
 * @param sampleCount - Number of samples collected
 * @returns The ratio of CPU time to wall-clock time (1.0 = perfect match), or null if too small
 */
function computeCpuDivergence(
 cpuMicroseconds: number,
 wallClockNs: number,
 sampleCount: number,
): number | null {
 const totalWallClockUs = (wallClockNs * sampleCount) / 1000;
 if (totalWallClockUs < 100) return null;
 return cpuMicroseconds / totalWallClockUs;
}

/* ========================================================================== */
/* Runner                                                                      */
/* ========================================================================== */

/**
 * Register and run a group of benchmarks, collecting full results
 *
 * @remarks
 * Each benchmark result is passed through do_not_optimize() to prevent
 * V8 from eliminating pure math operations via dead code elimination.
 *
 * Raw iteration timings are extracted from mitata's stats.samples array
 * and fed into our custom statistics engine (bootstrap CI, Tukey outliers).
 *
 * @param groupName - Human-readable name for the benchmark group
 * @param benchmarks - Array of benchmark definitions to execute
 * @param defaultGcMode - Default GC mode for benchmarks without an override
 * @returns The group result with per-benchmark statistics, samples, and resources
 */
export async function runBenchmarkGroup(
 groupName: string,
 benchmarks: BenchmarkDefinition[],
 defaultGcMode: GcMode = 'once',
): Promise<GroupResult> {
 group(groupName, () => {
  for (const bm of benchmarks) {
   const b = bench(bm.name, () => {
    do_not_optimize(bm.fn());
   });

   const gcMode = bm.gcMode ?? defaultGcMode;
   b.gc(gcMode);
  }
 });

 // Capture resource baseline just before run() — closest to actual execution
 const resourceBefore = captureResources();

 // Use native format so mitata calls print() per benchmark result.
 // This provides real-time progress dots because mitata yields to the
 // print callback between benchmarks (unlike setInterval, which can't
 // fire while mitata blocks the event loop during measurement).
 let headerDone = false;
 const runResult = await run({
  colors: false,
  print: (line: unknown) => {
   const s = String(line);
   if (!headerDone) {
    if (s.startsWith('---')) headerDone = true;
    return;
   }
   // Each benchmark result block is followed by a blank line
   if (s.trim() === '') process.stdout.write('.');
  },
 });

 const resourceAfter = captureResources();

 // Compute total resource delta for the entire group.
 // Per-benchmark resource isolation isn't possible since mitata controls execution.
 const groupResources = resourceDelta(resourceBefore, resourceAfter);
 const benchmarkCount = runResult.benchmarks.length || 1;

 const results: BenchmarkResult[] = [];

 for (const trial of runResult.benchmarks) {
  for (const trialRun of trial.runs) {
   if (trialRun.error || !trialRun.stats) continue;

   const rawSamples = trialRun.stats.samples ?? [];
   const stats = benchmarkStats(rawSamples);

   // Approximate per-benchmark resources by dividing group total
   const resources: ResourceMetrics = {
    cpuUser: Math.round(groupResources.cpuUser / benchmarkCount),
    cpuSystem: Math.round(groupResources.cpuSystem / benchmarkCount),
    rss: groupResources.rss,
    heapUsed: groupResources.heapUsed,
    heapTotal: groupResources.heapTotal,
    external: groupResources.external,
    arrayBuffers: groupResources.arrayBuffers,
   };

   const cpuTotalUs = resources.cpuUser + resources.cpuSystem;
   const cpuDivergence = computeCpuDivergence(cpuTotalUs, stats.mean, rawSamples.length);

   results.push({
    name: trial.alias,
    stats,
    rawSamples,
    resources,
    cpuWallClockDivergence: cpuDivergence,
   });
  }
 }

 return { name: groupName, benchmarks: results };
}

/**
 * Run a single benchmark outside of a group context
 *
 * @param definition - The benchmark definition to execute
 * @param gcMode - GC collection strategy for this benchmark
 * @returns The benchmark result with statistics and resource metrics
 * @throws {Error} If the benchmark produces no results (possibly errored during execution)
 */
export async function runSingleBenchmark(
 definition: BenchmarkDefinition,
 gcMode: GcMode = 'once',
): Promise<BenchmarkResult> {
 const groupResult = await runBenchmarkGroup(definition.name, [definition], gcMode);
 const first = groupResult.benchmarks[0];
 if (!first) {
  throw new Error(
   `Benchmark "${definition.name}" produced no results (possibly errored during execution)`,
  );
 }
 return first;
}
