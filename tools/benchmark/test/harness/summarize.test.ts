/**
 * @file test/harness/summarize.test.ts
 * @description Test the benchmark summary generator (scripts/summarize.ts)
 *
 * Runs the live generator against FIXTURE inputs in a temp directory
 * (`--input-dir`/`--output-dir` overrides) — never against the real
 * gitignored results tree. Validates output structure, the publication
 * guard (filtered/legacy/wrong-Node/missing inputs refused before any
 * write), `--force` partial stamping, idempotency, and the size budget.
 */

import { describe, expect, it, beforeAll, afterAll } from '@jest/globals';
import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const TOOL_ROOT = resolve(import.meta.dirname, '../..');

let workDir: string;
let inputDir: string;
let outputDir: string;

/** Build a realistic performance latest.json fixture */
function performanceFixture(overrides: {
 scope?: { full: boolean; filters?: Record<string, string> } | undefined;
 nodeVersion?: string;
 packageName?: string;
 omitScope?: boolean;
}): Record<string, unknown> {
 const metadata: Record<string, unknown> = {
  timestamp: new Date().toISOString(),
  nodeVersion: overrides.nodeVersion ?? 'v24.14.1',
  os: 'darwin test',
  cpu: 'fixture-cpu (8 cores)',
  commitHash: 'fixture0',
  arch: 'arm64',
  packageName: overrides.packageName ?? 'testpkg',
 };
 if (!overrides.omitScope) {
  metadata['scope'] = overrides.scope ?? { full: true };
 }
 const stats = {
  mean: 12.34,
  median: 11.5,
  stddev: 1.2,
  ci95lo: 11.0,
  ci95hi: 13.0,
  opsPerSec: 81000000,
  samples: 1000,
  outliersMild: 10,
  outliersSevere: 2,
 };
 return {
  metadata,
  results: [
   { operation: 'Vector2.add (out)', stats, dimensions: { tier: 'default' } },
   { operation: 'Vector2.dot', stats, dimensions: { tier: 'default' } },
  ],
 };
}

/**
 * Run the summarizer against the temp dirs
 *
 * @param extraArgs - Additional CLI flags
 * @returns stdout+stderr and the exit code
 */
function runSummarizer(extraArgs = ''): { output: string; code: number } {
 try {
  const output = execSync(
   `npx tsx scripts/summarize.ts --package=testpkg --input-dir=${inputDir} --output-dir=${outputDir} ${extraArgs} 2>&1`,
   { encoding: 'utf-8', cwd: TOOL_ROOT, stdio: ['pipe', 'pipe', 'pipe'] },
  );
  return { output, code: 0 };
 } catch (err: unknown) {
  const e = err as { status?: number; stdout?: string; stderr?: string };
  return { output: `${e.stdout ?? ''}${e.stderr ?? ''}`, code: e.status ?? 1 };
 }
}

function seedInput(fixture: Record<string, unknown> | null): void {
 rmSync(inputDir, { recursive: true, force: true });
 rmSync(outputDir, { recursive: true, force: true });
 mkdirSync(inputDir, { recursive: true });
 if (fixture) {
  writeFileSync(join(inputDir, 'latest.json'), JSON.stringify(fixture, null, 2));
 }
}

function readOutput(filename: string): unknown {
 const filepath = join(outputDir, filename);
 if (!existsSync(filepath)) return null;
 return JSON.parse(readFileSync(filepath, 'utf-8'));
}

const SUMMARY_FILES = [
 'performance-summary.json',
 'comparison-summary.json',
 'stress-summary.json',
 'dx-summary.json',
];

beforeAll(() => {
 workDir = mkdtempSync(join(tmpdir(), 'summarize-test-'));
 inputDir = join(workDir, 'input');
 outputDir = join(workDir, 'output');
});

afterAll(() => {
 rmSync(workDir, { recursive: true, force: true });
});

describe('summarize.ts — happy path (full publishable run)', () => {
 let stdout: string;
 const outputs: Record<string, unknown> = {};

 it('runs without errors on a full run fixture', () => {
  seedInput(performanceFixture({}));
  const { output, code } = runSummarizer();
  stdout = output;
  expect(code).toBe(0);
  expect(stdout).toContain('Done.');

  outputs.performance = readOutput('performance-summary.json');
  outputs.comparison = readOutput('comparison-summary.json');
  outputs.stress = readOutput('stress-summary.json');
  outputs.dx = readOutput('dx-summary.json');
 });

 it('creates all 4 output files', () => {
  for (const filename of SUMMARY_FILES) {
   expect(existsSync(join(outputDir, filename))).toBe(true);
  }
 });

 it('performance summary has correct top-level structure and metadata', () => {
  const perf = outputs.performance as Record<string, unknown>;
  expect(perf).toHaveProperty('metadata');
  expect(perf).toHaveProperty('entities');
  const meta = perf.metadata as Record<string, unknown>;
  expect(meta.timestamp).toBeDefined();
  expect(meta.commitHash).toBe('fixture0');
  expect(meta.nodeVersion).toBe('v24.14.1');
 });

 it('performance summary entities contain operations arrays', () => {
  const perf = outputs.performance as Record<string, Record<string, unknown>>;
  const entities = perf.entities as Record<string, { operations: unknown[] }>;
  expect(Object.keys(entities).length).toBeGreaterThan(0);
  for (const entity of Object.values(entities)) {
   expect(Array.isArray(entity.operations)).toBe(true);
   expect(entity.operations.length).toBeGreaterThan(0);
   const op = entity.operations[0] as Record<string, unknown>;
   expect(op.name).toBeDefined();
   expect(typeof op.median).toBe('number');
   expect(Array.isArray(op.ci95)).toBe(true);
   expect(typeof op.opsPerSec).toBe('number');
   expect(typeof op.outlierPercent).toBe('number');
   expect(typeof op.samples).toBe('number');
  }
 });

 it('performance summary strips raw sample arrays', () => {
  const perfJson = readFileSync(join(outputDir, 'performance-summary.json'), 'utf-8');
  expect(perfJson).not.toContain('"raw"');
 });

 it('missing secondary inputs produce placeholder summaries (warn, not refuse)', () => {
  const comp = outputs.comparison as Record<string, unknown>;
  expect(comp.metadata).toBeNull();
  expect(comp.libraries).toEqual([]);
  const dx = outputs.dx as Record<string, unknown>;
  expect(dx).toHaveProperty('metadata');
 });

 it('a full unforced summary is not stamped partial', () => {
  for (const filename of SUMMARY_FILES) {
   const data = readOutput(filename) as Record<string, unknown>;
   expect(data['partial']).toBeUndefined();
  }
 });

 it('total output is under 150 KB', () => {
  let totalBytes = 0;
  for (const filename of SUMMARY_FILES) {
   totalBytes += readFileSync(join(outputDir, filename)).byteLength;
  }
  expect(totalBytes).toBeLessThan(150 * 1024);
 });

 it('output is idempotent (byte-identical on re-run)', () => {
  const before: Record<string, string> = {};
  for (const filename of SUMMARY_FILES) {
   before[filename] = readFileSync(join(outputDir, filename), 'utf-8');
  }
  const { code } = runSummarizer();
  expect(code).toBe(0);
  for (const filename of SUMMARY_FILES) {
   expect(readFileSync(join(outputDir, filename), 'utf-8')).toBe(before[filename]);
  }
 });
});

describe('summarize.ts — publication guard', () => {
 it('refuses a suite-filtered run, naming the filter, writing nothing', () => {
  seedInput(performanceFixture({ scope: { full: false, filters: { suite: 'scalar' } } }));
  const { output, code } = runSummarizer();
  expect(code).not.toBe(0);
  expect(output).toContain('refusing to summarize');
  expect(output).toContain('scalar');
  expect(existsSync(join(outputDir, 'performance-summary.json'))).toBe(false);
 });

 it('refuses legacy metadata without scope provenance, naming the timestamp', () => {
  const fixture = performanceFixture({ omitScope: true });
  seedInput(fixture);
  const { output, code } = runSummarizer();
  expect(code).not.toBe(0);
  expect(output).toContain('legacy metadata');
  expect(output).toContain(
   (fixture['metadata'] as Record<string, string>)['timestamp']!.slice(0, 10),
  );
 });

 it('refuses a run from a different Node major, naming both versions', () => {
  seedInput(performanceFixture({ nodeVersion: 'v22.14.0' }));
  const { output, code } = runSummarizer();
  expect(code).not.toBe(0);
  expect(output).toContain('v22.14.0');
  expect(output).toContain('pins Node');
 });

 it('refuses a missing latest.json before writing anything', () => {
  seedInput(null);
  const { output, code } = runSummarizer();
  expect(code).not.toBe(0);
  expect(output).toContain('missing input');
  expect(existsSync(outputDir)).toBe(false);
 });

 it('refuses a package-name mismatch even with --force', () => {
  seedInput(performanceFixture({ packageName: 'othername' }));
  const { output, code } = runSummarizer('--force');
  expect(code).not.toBe(0);
  expect(output).toContain('othername');
  expect(output).toContain('mismatch');
 });

 it('--force permits a filtered run and stamps partial: true into all 4 summaries', () => {
  seedInput(performanceFixture({ scope: { full: false, filters: { suite: 'scalar' } } }));
  const { output, code } = runSummarizer('--force');
  expect(code).toBe(0);
  expect(output).toContain('[forced]');
  for (const filename of SUMMARY_FILES) {
   const data = readOutput(filename) as Record<string, unknown>;
   expect(data['partial']).toBe(true);
  }
 });

 it('refuses a PRESENT secondary older than the primary beyond the grace window', () => {
  seedInput(performanceFixture({}));
  const staleTs = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
  writeFileSync(
   join(inputDir, 'dx-latest.json'),
   JSON.stringify({ metadata: { timestamp: staleTs, packageName: 'testpkg' }, bundleSize: [] }),
  );
  const { output, code } = runSummarizer();
  expect(code).not.toBe(0);
  expect(output).toContain('dx-latest.json');
  expect(output).toContain('predates the primary run');
  expect(output).toContain(staleTs.slice(0, 10));
  expect(existsSync(join(outputDir, 'performance-summary.json'))).toBe(false);
 });

 it('warns but passes when a secondary is older within the grace window', () => {
  seedInput(performanceFixture({}));
  const slightlyOld = new Date(Date.now() - 10 * 60 * 1000).toISOString();
  writeFileSync(
   join(inputDir, 'dx-latest.json'),
   JSON.stringify({ metadata: { timestamp: slightlyOld, packageName: 'testpkg' }, bundleSize: [] }),
  );
  const { output, code } = runSummarizer();
  expect(code).toBe(0);
  expect(output).toContain('within the grace window');
 });

 it('--force permits a stale secondary and stamps partial: true', () => {
  seedInput(performanceFixture({}));
  const staleTs = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
  writeFileSync(
   join(inputDir, 'dx-latest.json'),
   JSON.stringify({ metadata: { timestamp: staleTs, packageName: 'testpkg' }, bundleSize: [] }),
  );
  const { code } = runSummarizer('--force');
  expect(code).toBe(0);
  const perf = readOutput('performance-summary.json') as Record<string, unknown>;
  expect(perf['partial']).toBe(true);
 });
});
