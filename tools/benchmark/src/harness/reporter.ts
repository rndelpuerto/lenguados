/**
 * @file harness/reporter.ts
 * @description Report benchmark results in JSON and ASCII table formats
 *
 * Produces machine-readable JSON with full metadata and statistics,
 * and human-readable ASCII tables for console output. Supports
 * result persistence, comparison mode, and unified diagnostic reports.
 */

import { execSync } from 'node:child_process';
import {
 copyFileSync,
 existsSync,
 mkdirSync,
 symlinkSync,
 unlinkSync,
 writeFileSync,
} from 'node:fs';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { arch, cpus, platform, release } from 'node:os';

import type { DiagnosticReport } from './diagnostics.ts';
import { padLeft, padRight, formatNs, formatOpsPerSec } from './format-utils.ts';
import { detectRegression } from './statistics.ts';
import type { RegressionResult } from './statistics.ts';
import type { BenchmarkResult, GroupResult, ResourceMetrics } from './runner.ts';

/* ========================================================================== */
/* Types                                                                       */
/* ========================================================================== */

/** Contain system metadata captured at benchmark execution time */
export interface ReportMetadata {
 timestamp: string;
 nodeVersion: string;
 os: string;
 cpu: string;
 commitHash: string;
 arch: string;
}

/** Represent a single benchmark result entry in the JSON report */
export interface ReportEntry {
 dimensions?: Record<string, string> | undefined;
 operation: string;
 stats: {
  mean: number;
  median: number;
  stddev: number;
  ci95lo: number;
  ci95hi: number;
  outliersMild: number;
  outliersSevere: number;
  samples: number;
  opsPerSec: number;
  p50: number;
  p95: number;
  p99: number;
 };
 cpuTime?: { user: number; system: number } | undefined;
 memory?: ResourceMetrics | undefined;
 cpuWallClockDivergence?: number | null | undefined;
 raw?: number[] | undefined;
}

/** Represent a complete benchmark report with metadata, results, and diagnostics */
export interface BenchmarkReport {
 metadata: ReportMetadata;
 results: ReportEntry[];
 diagnostics?: DiagnosticReport | undefined;
}

/* ========================================================================== */
/* Metadata                                                                    */
/* ========================================================================== */

/**
 * Retrieve the current git commit hash (short form)
 *
 * @returns The short commit hash, or 'unknown' if git is unavailable
 */
function getCommitHash(): string {
 try {
  return execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim();
 } catch {
  return 'unknown';
 }
}

/**
 * Collect system metadata for the benchmark report
 *
 * @returns A ReportMetadata object with timestamp, Node version, OS, CPU, commit hash, and arch
 */
export function collectMetadata(): ReportMetadata {
 const cpuInfo = cpus();
 return {
  timestamp: new Date().toISOString(),
  nodeVersion: process.version,
  os: `${platform()} ${release()}`,
  cpu: cpuInfo.length > 0 ? `${cpuInfo[0]!.model} (${cpuInfo.length} cores)` : 'unknown',
  commitHash: getCommitHash(),
  arch: arch(),
 };
}

/* ========================================================================== */
/* JSON Report                                                                 */
/* ========================================================================== */

/**
 * Convert a BenchmarkResult into a serializable ReportEntry
 *
 * @param result - The benchmark result to convert
 * @param dimensions - Optional dimension labels for this result
 * @param includeRaw - Whether to include raw sample data (default: false)
 * @returns A ReportEntry suitable for JSON serialization
 */
export function benchmarkResultToEntry(
 result: BenchmarkResult,
 dimensions?: Record<string, string>,
 includeRaw = false,
): ReportEntry {
 return {
  dimensions,
  operation: result.name,
  stats: {
   mean: result.stats.mean,
   median: result.stats.median,
   stddev: result.stats.stddev,
   ci95lo: result.stats.ci95.lo,
   ci95hi: result.stats.ci95.hi,
   outliersMild: result.stats.outliers.totalMild,
   outliersSevere: result.stats.outliers.totalSevere,
   samples: result.stats.count,
   opsPerSec: result.stats.opsPerSec,
   p50: result.stats.p50,
   p95: result.stats.p95,
   p99: result.stats.p99,
  },
  cpuTime: {
   user: result.resources.cpuUser,
   system: result.resources.cpuSystem,
  },
  memory: result.resources,
  cpuWallClockDivergence: result.cpuWallClockDivergence,
  raw: includeRaw ? result.rawSamples : undefined,
 };
}

/**
 * Generate a complete JSON benchmark report from group results
 *
 * @param groups - Array of benchmark group results
 * @param dimensions - Optional dimension labels to attach to each entry
 * @param includeRaw - Whether to include raw sample arrays (default: false)
 * @returns A BenchmarkReport with metadata and all result entries
 */
export function generateJsonReport(
 groups: GroupResult[],
 dimensions?: Record<string, string>,
 includeRaw = false,
): BenchmarkReport {
 const entries: ReportEntry[] = [];
 for (const group of groups) {
  for (const bm of group.benchmarks) {
   entries.push(benchmarkResultToEntry(bm, dimensions, includeRaw));
  }
 }

 return {
  metadata: collectMetadata(),
  results: entries,
 };
}

/* ========================================================================== */
/* ASCII Table Reporter                                                        */
/* ========================================================================== */

/**
 * Format benchmark entries as an ASCII table for console output
 *
 * @param entries - The report entries to format
 * @returns A formatted ASCII table string, or '(no results)' if empty
 */
export function printAsciiTable(entries: ReportEntry[]): string {
 if (entries.length === 0) return '(no results)';

 const COL_OP = 'Operation';
 const COL_MEAN = 'Mean';
 const COL_CI = 'CI 95%';
 const COL_OPS = 'ops/sec';
 const COL_OUTLIERS = 'Outliers';

 const rows = entries.map((e) => ({
  op: e.operation,
  mean: formatNs(e.stats.mean),
  ci: `[${formatNs(e.stats.ci95lo)}-${formatNs(e.stats.ci95hi)}]`,
  ops: formatOpsPerSec(e.stats.opsPerSec),
  outliers: `${e.stats.outliersMild}m/${e.stats.outliersSevere}s`,
 }));

 const widths = {
  op: Math.max(COL_OP.length, ...rows.map((r) => r.op.length)),
  mean: Math.max(COL_MEAN.length, ...rows.map((r) => r.mean.length)),
  ci: Math.max(COL_CI.length, ...rows.map((r) => r.ci.length)),
  ops: Math.max(COL_OPS.length, ...rows.map((r) => r.ops.length)),
  outliers: Math.max(COL_OUTLIERS.length, ...rows.map((r) => r.outliers.length)),
 };

 const lines: string[] = [];
 const header =
  `${padRight(COL_OP, widths.op)}  ${padLeft(COL_MEAN, widths.mean)}  ` +
  `${padLeft(COL_CI, widths.ci)}  ${padLeft(COL_OPS, widths.ops)}  ` +
  `${padLeft(COL_OUTLIERS, widths.outliers)}`;
 lines.push(header);
 lines.push('-'.repeat(header.length));

 for (const r of rows) {
  lines.push(
   `${padRight(r.op, widths.op)}  ${padLeft(r.mean, widths.mean)}  ` +
    `${padLeft(r.ci, widths.ci)}  ${padLeft(r.ops, widths.ops)}  ` +
    `${padLeft(r.outliers, widths.outliers)}`,
  );
 }

 return lines.join('\n');
}

/* ========================================================================== */
/* Result Persistence                                                          */
/* ========================================================================== */

const RESULTS_DIR = new URL('../../results/', import.meta.url).pathname;

/**
 * Persist a benchmark report to disk as timestamped JSON
 *
 * @param report - The benchmark report to persist
 * @returns The absolute path of the written file
 */
export function persistReport(report: BenchmarkReport): string {
 mkdirSync(RESULTS_DIR, { recursive: true });

 const ts = report.metadata.timestamp.replace(/[:.]/g, '-');
 const hash = report.metadata.commitHash;
 const filename = `${ts}-${hash}.json`;
 const filepath = join(RESULTS_DIR, filename);
 const latestPath = join(RESULTS_DIR, 'latest.json');

 writeFileSync(filepath, JSON.stringify(report, null, 2));
 createLatestPointer(filepath, latestPath, filename);

 return filepath;
}

/**
 * Create a "latest" pointer via symlink, falling back to copy on Windows
 *
 * @param filepath - Absolute path to the source file
 * @param latestPath - Absolute path for the "latest" pointer
 * @param filename - Relative filename for the symlink target
 */
export function createLatestPointer(filepath: string, latestPath: string, filename: string): void {
 try {
  if (existsSync(latestPath)) unlinkSync(latestPath);
  symlinkSync(filename, latestPath);
 } catch {
  copyFileSync(filepath, latestPath);
 }
}

/* ========================================================================== */
/* Comparison Mode                                                             */
/* ========================================================================== */

/** Represent a comparison between baseline and current results for one operation */
export interface ComparisonEntry {
 operation: string;
 baselineMean: number;
 currentMean: number;
 regression: RegressionResult;
}

/**
 * Load a benchmark report from a JSON file
 *
 * @param path - Absolute path to the JSON report file
 * @returns The parsed BenchmarkReport
 */
export async function loadReport(path: string): Promise<BenchmarkReport> {
 const content = await readFile(path, 'utf-8');
 return JSON.parse(content) as BenchmarkReport;
}

/**
 * Generate synthetic samples from mean/stddev when raw data is unavailable
 *
 * @remarks
 * Uses a Box-Muller transform for normal distribution approximation
 * to enable statistical comparison when raw samples are not stored.
 *
 * @param mean - The mean of the distribution to sample from
 * @param stddev - The standard deviation of the distribution
 * @param count - Minimum number of samples to generate (at least 30)
 * @returns An array of synthetic normal samples
 */
function generateSyntheticSamples(mean: number, stddev: number, count: number): number[] {
 const n = Math.max(count, 30);
 const samples: number[] = [];
 for (let i = 0; i < n; i++) {
  // Box-Muller transform for normal distribution
  const u1 = Math.random();
  const u2 = Math.random();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  samples.push(mean + z * stddev);
 }
 return samples;
}

/**
 * Compare two benchmark reports and detect regressions per operation
 *
 * @param baseline - The baseline report to compare against
 * @param current - The current report to evaluate
 * @param noiseThreshold - Minimum effect size percentage to flag as regression (default: 2)
 * @returns An array of comparison entries for matched operations
 */
export function compareReports(
 baseline: BenchmarkReport,
 current: BenchmarkReport,
 noiseThreshold = 2,
): ComparisonEntry[] {
 const baselineMap = new Map<string, ReportEntry>();
 for (const entry of baseline.results) {
  baselineMap.set(entry.operation, entry);
 }

 const comparisons: ComparisonEntry[] = [];
 for (const entry of current.results) {
  const base = baselineMap.get(entry.operation);
  if (!base) continue;

  // Use raw samples when available for proper statistical testing.
  // Single-element arrays cause detectRegression to skip the t-test entirely.
  const baselineSamples =
   base.raw && base.raw.length >= 2
    ? base.raw
    : generateSyntheticSamples(base.stats.mean, base.stats.stddev, base.stats.samples);
  const currentSamples =
   entry.raw && entry.raw.length >= 2
    ? entry.raw
    : generateSyntheticSamples(entry.stats.mean, entry.stats.stddev, entry.stats.samples);

  const regression = detectRegression(baselineSamples, currentSamples, noiseThreshold);

  comparisons.push({
   operation: entry.operation,
   baselineMean: base.stats.mean,
   currentMean: entry.stats.mean,
   regression,
  });
 }

 return comparisons;
}

/**
 * Format a comparison table as an ASCII string for console output
 *
 * @param comparisons - The comparison entries to format
 * @returns A formatted ASCII table string, or '(no comparable operations)' if empty
 */
export function printComparisonTable(comparisons: ComparisonEntry[]): string {
 if (comparisons.length === 0) return '(no comparable operations)';

 const lines: string[] = [];
 lines.push(
  `${padRight('Operation', 30)}  ${padLeft('Baseline', 12)}  ` +
   `${padLeft('Current', 12)}  ${padLeft('Change', 10)}  Status`,
 );
 lines.push('-'.repeat(80));

 for (const c of comparisons) {
  const change = c.regression.effectSize;
  const changeStr = `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
  const status = c.regression.significant ? 'REGRESSION' : 'ok';

  lines.push(
   `${padRight(c.operation, 30)}  ${padLeft(formatNs(c.baselineMean), 12)}  ` +
    `${padLeft(formatNs(c.currentMean), 12)}  ${padLeft(changeStr, 10)}  ${status}`,
  );
 }

 return lines.join('\n');
}

/* ========================================================================== */
/* Re-exports from focused modules (backward compatibility)                    */
/* ========================================================================== */

export type {
 FindingSeverity,
 FindingType,
 DiagnosticFinding,
 DiagnosticReport,
} from './diagnostics.ts';

export { createDiagnosticReport, addFinding, formatDiagnosticSummary } from './diagnostics.ts';

export { withTimeout, runWithRecovery } from './timeout.ts';
