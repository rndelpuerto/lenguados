/**
 * @file test/harness/trend.test.ts
 * @description Test the trend surveillance script (scripts/trend.ts)
 *
 * Runs the live script against FIXTURE summaries in a temp directory
 * (`--summaries-dir`/`--history`/`--baseline`/`--report` overrides) — never
 * against the real gitignored results tree. Validates the history record
 * schema, delta report content, warn-only exit semantics (band violations
 * exit 0), data-integrity refusals (missing/partial summaries, corrupt
 * history, invalid baseline all exit 1), and capability-gated comparison.
 */

import { describe, expect, it, beforeEach, afterAll } from '@jest/globals';
import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const TOOL_ROOT = resolve(import.meta.dirname, '../..');

const workDir = mkdtempSync(join(tmpdir(), 'trend-test-'));
let caseIndex = 0;
let summariesDir: string;
let historyPath: string;
let baselinePath: string;
let reportPath: string;

beforeEach(() => {
 caseIndex++;
 const caseDir = join(workDir, `case-${caseIndex}`);
 summariesDir = join(caseDir, 'summaries');
 historyPath = join(caseDir, 'history.jsonl');
 baselinePath = join(caseDir, 'comparison-ratio.json');
 reportPath = join(caseDir, 'report.md');
 mkdirSync(summariesDir, { recursive: true });
});

afterAll(() => {
 rmSync(workDir, { recursive: true, force: true });
});

/** Build a realistic performance-summary.json fixture */
function performanceSummaryFixture(
 medians: Record<string, number[]>,
 overrides: { partial?: boolean } = {},
): Record<string, unknown> {
 const entities: Record<string, unknown> = {};
 for (const [entity, values] of Object.entries(medians)) {
  entities[entity] = {
   operations: values.map((median, i) => ({ name: `op${i}`, median, opsPerSec: 1e9 / median })),
  };
 }
 const summary: Record<string, unknown> = {
  metadata: {
   timestamp: '2026-07-08T00:00:00.000Z',
   commitHash: 'fixture0',
   nodeVersion: 'v24.14.1',
   cpu: 'fixture-cpu',
   os: 'fixture-os',
  },
  entities,
 };
 if (overrides.partial) summary['partial'] = true;
 return summary;
}

/** Build a comparison-summary.json fixture (aggregate: null = no capability) */
function comparisonSummaryFixture(geometricMean: number | null): Record<string, unknown> {
 if (geometricMean === null) {
  return { metadata: null, conditions: null, libraries: [], categories: {}, aggregate: null };
 }
 return {
  metadata: { timestamp: '2026-07-08T00:00:00.000Z' },
  libraries: [
   { name: 'testpkg', version: '0.0.0' },
   { name: 'reference-lib', version: '1.2.3' },
  ],
  categories: {},
  aggregate: {
   geometricMean,
   wins: 1,
   losses: 1,
   ties: 0,
   target: 'testpkg',
   reference: 'reference-lib',
  },
 };
}

function writeSummaries(perf: Record<string, unknown>, comp?: Record<string, unknown>): void {
 writeFileSync(join(summariesDir, 'performance-summary.json'), JSON.stringify(perf));
 if (comp) writeFileSync(join(summariesDir, 'comparison-summary.json'), JSON.stringify(comp));
}

function writeBaseline(geometricMean: number, band: number): void {
 writeFileSync(
  baselinePath,
  JSON.stringify({ geometricMean, band, reference: 'reference-lib', referenceVersion: '1.2.3' }),
 );
}

/** Run trend.ts with the case's overrides; returns { status, output } */
function runTrend(): { status: number; output: string } {
 try {
  const output = execSync(
   `./node_modules/.bin/tsx scripts/trend.ts --package=testpkg --summaries-dir=${summariesDir} ` +
    `--history=${historyPath} --baseline=${baselinePath} --report=${reportPath}`,
   { cwd: TOOL_ROOT, encoding: 'utf-8', stdio: ['ignore', 'pipe', 'pipe'] },
  );
  return { status: 0, output };
 } catch (err: unknown) {
  const e = err as { status?: number; stdout?: string; stderr?: string };
  return { status: e.status ?? 1, output: `${e.stdout ?? ''}${e.stderr ?? ''}` };
 }
}

function readHistory(): Array<Record<string, unknown>> {
 return readFileSync(historyPath, 'utf-8')
  .split('\n')
  .filter((line) => line.trim() !== '')
  .map((line) => JSON.parse(line) as Record<string, unknown>);
}

describe('trend record schema', () => {
 it('appends one schema-1 record with per-entity geomeans and comparison aggregate', () => {
  writeSummaries(
   performanceSummaryFixture({ Vector2: [10, 40], Scalar: [2, 8] }),
   comparisonSummaryFixture(0.5),
  );
  writeBaseline(0.5, 0.3);
  const { status } = runTrend();
  expect(status).toBe(0);

  const records = readHistory();
  expect(records).toHaveLength(1);
  const record = records[0]!;
  expect(record['schema']).toBe(1);
  expect(record['commit']).toBe('fixture0');
  expect(record['package']).toBe('testpkg');
  // geomean(10, 40) = 20, geomean(2, 8) = 4
  expect((record['entities'] as Record<string, number>)['Vector2']).toBeCloseTo(20, 3);
  expect((record['entities'] as Record<string, number>)['Scalar']).toBeCloseTo(4, 3);
  const comparison = record['comparison'] as Record<string, unknown>;
  expect(comparison['geometricMean']).toBeCloseTo(0.5, 3);
  expect(comparison['reference']).toBe('reference-lib');
  expect(comparison['referenceVersion']).toBe('1.2.3');
 });

 it('records comparison: null for a package without the comparison capability', () => {
  writeSummaries(performanceSummaryFixture({ Scalar: [3] }), comparisonSummaryFixture(null));
  const { status } = runTrend();
  expect(status).toBe(0);
  expect(readHistory()[0]!['comparison']).toBeNull();
 });
});

describe('delta report', () => {
 it('reports first data point when no history exists', () => {
  writeSummaries(performanceSummaryFixture({ Scalar: [3] }), comparisonSummaryFixture(null));
  const { status } = runTrend();
  expect(status).toBe(0);
  const report = readFileSync(reportPath, 'utf-8');
  expect(report).toContain('No history available');
 });

 it('annotates investigate only beyond the 25% entity band, and stays exit 0', () => {
  writeSummaries(performanceSummaryFixture({ Stable: [10], Regressed: [10] }), undefined);
  // Seed history: both entities at 10 ns
  writeFileSync(
   historyPath,
   `${JSON.stringify({
    schema: 1,
    timestamp: '2026-07-07T00:00:00.000Z',
    commit: 'prev0000',
    node: 'v24.14.1',
    package: 'testpkg',
    entities: { Stable: 10, Regressed: 5 }, // current 10 vs median 5 => +100%
    comparison: null,
   })}\n`,
  );
  const { status } = runTrend();
  expect(status).toBe(0); // warn-only: a 2x regression must NOT fail
  const report = readFileSync(reportPath, 'utf-8');
  const stableLine = report.split('\n').find((l) => l.startsWith('| Stable'));
  const regressedLine = report.split('\n').find((l) => l.startsWith('| Regressed'));
  expect(stableLine).not.toContain('investigate');
  expect(regressedLine).toContain('⚠ investigate');
 });

 it('flags the comparison ratio outside the committed band, and stays exit 0', () => {
  writeSummaries(performanceSummaryFixture({ Scalar: [3] }), comparisonSummaryFixture(0.5));
  writeBaseline(0.9, 0.05); // band [0.855, 0.945] — 0.5 is far outside
  const { status } = runTrend();
  expect(status).toBe(0); // warn-only
  const report = readFileSync(reportPath, 'utf-8');
  expect(report).toContain('OUTSIDE BAND');
 });

 it('reports within band when the ratio is inside', () => {
  writeSummaries(performanceSummaryFixture({ Scalar: [3] }), comparisonSummaryFixture(0.5));
  writeBaseline(0.5, 0.3);
  runTrend();
  expect(readFileSync(reportPath, 'utf-8')).toContain('within band');
 });
});

describe('data-integrity refusals (exit 1, nothing recorded)', () => {
 it('refuses a missing performance summary', () => {
  const { status, output } = runTrend();
  expect(status).toBe(1);
  expect(output).toContain('REFUSED');
  expect(existsSync(historyPath)).toBe(false);
 });

 it('refuses a partial performance summary', () => {
  writeSummaries(performanceSummaryFixture({ Scalar: [3] }, { partial: true }));
  const { status, output } = runTrend();
  expect(status).toBe(1);
  expect(output).toContain('partial');
  expect(existsSync(historyPath)).toBe(false);
 });

 it('refuses a non-positive per-operation median instead of silently excluding it', () => {
  writeSummaries(performanceSummaryFixture({ Vector2: [100, 0, -3] }));
  const { status, output } = runTrend();
  expect(status).toBe(1);
  expect(output).toContain('non-positive or non-finite median');
  expect(existsSync(historyPath)).toBe(false);
 });

 it('refuses a non-numeric per-operation median instead of silently excluding it', () => {
  const perf = performanceSummaryFixture({ Vector2: [20.25] });
  const ops = (perf['entities'] as Record<string, { operations: Array<Record<string, unknown>> }>)[
   'Vector2'
  ]!.operations;
  ops.push({ name: 'nullMedian', median: null });
  writeSummaries(perf);
  const { status, output } = runTrend();
  expect(status).toBe(1);
  expect(output).toContain('non-positive or non-finite median');
  expect(existsSync(historyPath)).toBe(false);
 });

 it('refuses --package=all combined with per-package path overrides', () => {
  const result = (() => {
   try {
    execSync(`./node_modules/.bin/tsx scripts/trend.ts --package=all --history=${historyPath}`, {
     cwd: TOOL_ROOT,
     encoding: 'utf-8',
     stdio: ['ignore', 'pipe', 'pipe'],
    });
    return { status: 0, output: '' };
   } catch (err: unknown) {
    const e = err as { status?: number; stdout?: string; stderr?: string };
    return { status: e.status ?? 1, output: `${e.stdout ?? ''}${e.stderr ?? ''}` };
   }
  })();
  expect(result.status).toBe(1);
  expect(result.output).toContain('cannot be combined with --package=all');
 });
});

describe('history quarantine (loud, self-healing — never wedges CI)', () => {
 it('quarantines corrupt history, restarts the window, and exits 0', () => {
  writeSummaries(performanceSummaryFixture({ Scalar: [3] }), comparisonSummaryFixture(null));
  writeFileSync(historyPath, 'not json\n');
  const { status, output } = runTrend();
  expect(status).toBe(0);
  expect(output).toContain('quarantined');
  // Corrupt file moved aside (outside the CI artifact upload glob)
  expect(readFileSync(`${historyPath}.corrupt`, 'utf-8')).toBe('not json\n');
  // Window restarted: exactly the new record
  expect(readHistory()).toHaveLength(1);
  // Report opens with the prominent warning
  expect(readFileSync(reportPath, 'utf-8')).toContain('⚠ history file was invalid');
 });

 it('quarantines a history whose records carry a foreign package or schema', () => {
  writeSummaries(performanceSummaryFixture({ Scalar: [3] }), comparisonSummaryFixture(null));
  writeFileSync(
   historyPath,
   `${JSON.stringify({
    schema: 1,
    timestamp: '2026-07-07T00:00:00.000Z',
    commit: 'prev0000',
    node: 'v24.14.1',
    package: 'someother',
    entities: { Scalar: 3 },
    comparison: null,
   })}\n`,
  );
  const { status, output } = runTrend();
  expect(status).toBe(0);
  expect(output).toContain("package 'someother'");
  expect(readHistory()).toHaveLength(1);
 });

 it('refuses a comparison run without a readable committed baseline', () => {
  writeSummaries(performanceSummaryFixture({ Scalar: [3] }), comparisonSummaryFixture(0.5));
  // no baseline file written
  const { status, output } = runTrend();
  expect(status).toBe(1);
  expect(output).toContain('comparison-ratio baseline');
 });

 it('refuses a baseline with a band outside (0, 1)', () => {
  writeSummaries(performanceSummaryFixture({ Scalar: [3] }), comparisonSummaryFixture(0.5));
  writeFileSync(baselinePath, JSON.stringify({ geometricMean: 0.5, band: 1.5 }));
  const { status, output } = runTrend();
  expect(status).toBe(1);
  expect(output).toContain('band in (0, 1)');
 });
});
