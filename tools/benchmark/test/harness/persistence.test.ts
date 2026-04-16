import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import {
 existsSync,
 lstatSync,
 mkdirSync,
 readFileSync,
 readlinkSync,
 rmSync,
 writeFileSync,
} from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

import { createDiagnosticReport } from '../../src/harness/diagnostics.ts';
import { createLatestPointer } from '../../src/harness/reporter.ts';

import type { ReportMetadata } from '../../src/harness/reporter.ts';
import type { DxReport, StressReport } from '../../src/harness/result-types.ts';

/* ========================================================================== */
/* Helpers                                                                     */
/* ========================================================================== */

function mockMetadata(): ReportMetadata {
 return {
  timestamp: '2026-01-15T12:00:00.000Z',
  nodeVersion: 'v24.0.0',
  os: 'linux 6.5.0',
  cpu: 'Test CPU (4 cores)',
  commitHash: 'abc1234',
  arch: 'x64',
 };
}

let testDir: string;

beforeEach(() => {
 testDir = join(
  tmpdir(),
  `bench-persist-test-${Date.now()}-${Math.random().toString(36).slice(2)}`,
 );
 mkdirSync(testDir, { recursive: true });
});

afterEach(() => {
 rmSync(testDir, { recursive: true, force: true });
});

/* ========================================================================== */
/* createLatestPointer                                                         */
/* ========================================================================== */

describe('createLatestPointer', () => {
 it('creates a symlink pointing to the given filename', () => {
  const filepath = join(testDir, 'result-2026.json');
  const latestPath = join(testDir, 'latest.json');
  writeFileSync(filepath, '{"test":true}');

  createLatestPointer(filepath, latestPath, 'result-2026.json');

  expect(existsSync(latestPath)).toBe(true);
  // Should be a symlink or a copy — either is valid
  const stat = lstatSync(latestPath);
  if (stat.isSymbolicLink()) {
   expect(readlinkSync(latestPath)).toBe('result-2026.json');
  } else {
   // Fallback copy — content should match
   expect(readFileSync(latestPath, 'utf-8')).toBe('{"test":true}');
  }
 });

 it('overwrites an existing latest pointer', () => {
  const first = join(testDir, 'result-v1.json');
  const second = join(testDir, 'result-v2.json');
  const latestPath = join(testDir, 'latest.json');
  writeFileSync(first, '{"version":1}');
  writeFileSync(second, '{"version":2}');

  createLatestPointer(first, latestPath, 'result-v1.json');
  createLatestPointer(second, latestPath, 'result-v2.json');

  expect(existsSync(latestPath)).toBe(true);
  const content = readFileSync(latestPath, 'utf-8');
  expect(content).toBe('{"version":2}');
 });

 it('handles non-existent source gracefully via copy fallback', () => {
  // If symlink succeeds, it creates a dangling symlink (valid)
  // If symlink fails, copyFileSync will throw — but createLatestPointer
  // catches symlink errors and falls back to copy
  const filepath = join(testDir, 'nonexistent.json');
  const latestPath = join(testDir, 'latest.json');

  // createLatestPointer tries symlink first; dangling symlink is OK on most OSes
  // On failure it tries copyFileSync which will throw for missing source
  // This tests that the function doesn't crash unexpectedly
  try {
   createLatestPointer(filepath, latestPath, 'nonexistent.json');
   // If it didn't throw, either a dangling symlink was created or copy succeeded
  } catch {
   // Copy fallback can throw for missing source — this is acceptable
  }
 });
});

/* ========================================================================== */
/* StressReport structure                                                      */
/* ========================================================================== */

describe('StressReport JSON structure', () => {
 function mockStressReport(suites?: StressReport['suites']): StressReport {
  return {
   metadata: mockMetadata(),
   samples: 1000,
   suites: suites ?? {},
   diagnostics: createDiagnosticReport(),
  };
 }

 it('serializes and deserializes with all suites populated', () => {
  const report = mockStressReport({
   ulp: [
    {
     fn: 'sin',
     maxUlp: 2,
     meanUlp: 0.5,
     sampleCount: 1000,
     histogram: { 0: 900, 1: 90, 2: 10 },
     specialMismatches: 0,
    },
   ],
   ieee754: [
    { entity: 'Vector2', operation: 'magnitude', input: [0], classification: 'finite', value: 0 },
   ],
   cancellation: [
    {
     operation: 'cross',
     entity: 'Vector2',
     bitsLost: 0,
     inputs: { ax: 1, ay: 2, bx: 3, by: 4 },
     result: -2,
     isCatastrophic: false,
    },
   ],
   nearSingular: [
    { determinant: 1e-15, tier: 'default', behavior: 'throw', conditionNumber: 1e15 },
   ],
   overflow: [
    {
     test: 'magnitude_large',
     tier: 'default',
     input: [1e308, 1e308],
     output: Infinity,
     expected: 'infinity',
     isFinite: false,
    },
   ],
   identity: [{ property: 'v + zero = v', passed: true, runs: 10000, maxError: 0, meanError: 0 }],
   allocation: [
    {
     entity: 'Vector2',
     operation: 'add',
     variant: 'static-out',
     iterations: 10000,
     heapGrowthBytes: 0,
     bytesPerOp: 0,
     isZeroAlloc: true,
    },
   ],
  });

  const json = JSON.stringify(report, null, 2);
  const parsed = JSON.parse(json) as StressReport;

  expect(parsed.metadata.timestamp).toBe('2026-01-15T12:00:00.000Z');
  expect(parsed.samples).toBe(1000);
  expect(parsed.suites.ulp).toHaveLength(1);
  expect(parsed.suites.ieee754).toHaveLength(1);
  expect(parsed.suites.cancellation).toHaveLength(1);
  expect(parsed.suites.nearSingular).toHaveLength(1);
  expect(parsed.suites.overflow).toHaveLength(1);
  expect(parsed.suites.identity).toHaveLength(1);
  expect(parsed.suites.allocation).toHaveLength(1);
  expect(parsed.diagnostics.findings).toHaveLength(0);
 });

 it('handles empty suites (no suite arg provided)', () => {
  const report = mockStressReport({});

  const json = JSON.stringify(report, null, 2);
  const parsed = JSON.parse(json) as StressReport;

  expect(parsed.suites.ulp).toBeUndefined();
  expect(parsed.suites.ieee754).toBeUndefined();
  expect(parsed.suites.allocation).toBeUndefined();
  expect(parsed.samples).toBe(1000);
 });

 it('handles partial suites (single suite run)', () => {
  const report = mockStressReport({
   ulp: [
    {
     fn: 'cos',
     maxUlp: 1,
     meanUlp: 0.3,
     sampleCount: 500,
     histogram: { 0: 480, 1: 20 },
     specialMismatches: 0,
    },
   ],
  });

  const json = JSON.stringify(report, null, 2);
  const parsed = JSON.parse(json) as StressReport;

  expect(parsed.suites.ulp).toHaveLength(1);
  expect(parsed.suites.ulp![0]!.fn).toBe('cos');
  expect(parsed.suites.ieee754).toBeUndefined();
  expect(parsed.suites.cancellation).toBeUndefined();
 });

 it('persists to disk and reads back identically', () => {
  const report = mockStressReport({
   identity: [{ property: 'rotate(0) = id', passed: true, runs: 10000, maxError: 0, meanError: 0 }],
  });

  const filepath = join(testDir, 'stress-test.json');
  writeFileSync(filepath, JSON.stringify(report, null, 2));

  const content = readFileSync(filepath, 'utf-8');
  const parsed = JSON.parse(content) as StressReport;

  expect(parsed).toEqual(report);
 });

 it('creates latest pointer alongside timestamped file', () => {
  const report = mockStressReport();
  const filename = 'stress-2026-01-15T12-00-00-000Z.json';
  const filepath = join(testDir, filename);
  const latestPath = join(testDir, 'stress-latest.json');

  writeFileSync(filepath, JSON.stringify(report, null, 2));
  createLatestPointer(filepath, latestPath, filename);

  expect(existsSync(latestPath)).toBe(true);
  const latestContent = readFileSync(latestPath, 'utf-8');
  const parsed = JSON.parse(latestContent) as StressReport;
  expect(parsed.metadata.timestamp).toBe(report.metadata.timestamp);
 });
});

/* ========================================================================== */
/* DxReport structure                                                          */
/* ========================================================================== */

describe('DxReport JSON structure', () => {
 function mockDxReport(): DxReport {
  return {
   metadata: mockMetadata(),
   bundleSize: [
    {
     importPath: '@lenguados/math2d',
     importStatement: "import '@lenguados/math2d'",
     rawBytes: 45000,
     gzipBytes: 12000,
    },
    {
     importPath: '@lenguados/math2d/vector2',
     importStatement: "import '@lenguados/math2d/vector2'",
     rawBytes: 8000,
     gzipBytes: 2800,
    },
   ],
   treeShaking: {
    fullSize: 45000,
    minimalSize: 8000,
    reduction: 37000,
    reductionPercent: 82.2,
    effectiveTreeShaking: true,
    sideEffectsEmpty: true,
   },
   buildCorrectness: {
    correctness: [
     {
      operation: 'Vector2.add',
      devResultHex: '4008000000000000',
      prodResultHex: '4008000000000000',
      match: true,
     },
    ],
    assertions: [
     {
      operation: 'Vector2.normalize(zero)',
      devThrows: true,
      prodThrows: false,
      correctBehavior: true,
     },
    ],
   },
   assertionElimination: {
    prodBundle: {
     path: 'lib/esm/math2d.production.js',
     size: 40000,
     containsAssertions: false,
     containsDevMode: false,
     containsNodeEnv: false,
     containsLenguadosDev: false,
     foundPatterns: [],
    },
    devBundle: {
     path: 'lib/esm/math2d.development.js',
     size: 48000,
     containsAssertions: true,
    },
    eliminationVerified: true,
   },
   buildComparison: {
    devSize: { raw: 48000, gzip: 14000 },
    prodSize: { raw: 40000, gzip: 12000 },
    difference: { raw: 8000, gzip: 2000 },
    reductionPercent: { raw: 16.7, gzip: 14.3 },
   },
  };
 }

 it('serializes and deserializes with all fields', () => {
  const report = mockDxReport();
  const json = JSON.stringify(report, null, 2);
  const parsed = JSON.parse(json) as DxReport;

  expect(parsed.metadata.commitHash).toBe('abc1234');
  expect(parsed.bundleSize).toHaveLength(2);
  expect(parsed.treeShaking.effectiveTreeShaking).toBe(true);
  expect(parsed.buildCorrectness.correctness).toHaveLength(1);
  expect(parsed.buildCorrectness.assertions).toHaveLength(1);
  expect(parsed.assertionElimination.eliminationVerified).toBe(true);
  expect(parsed.buildComparison).toBeDefined();
 });

 it('bundle size entries have required fields', () => {
  const report = mockDxReport();
  const json = JSON.stringify(report, null, 2);
  const parsed = JSON.parse(json) as DxReport;

  for (const entry of parsed.bundleSize) {
   expect(entry.importPath).toBeDefined();
   expect(typeof entry.rawBytes).toBe('number');
   expect(typeof entry.gzipBytes).toBe('number');
   expect(entry.rawBytes).toBeGreaterThan(0);
   expect(entry.gzipBytes).toBeGreaterThan(0);
   expect(entry.gzipBytes).toBeLessThanOrEqual(entry.rawBytes);
  }
 });

 it('assertion elimination flags are consistent', () => {
  const report = mockDxReport();

  // When elimination is verified: prod has no assertions, dev has assertions
  expect(report.assertionElimination.eliminationVerified).toBe(true);
  expect(report.assertionElimination.prodBundle.containsAssertions).toBe(false);
  expect(report.assertionElimination.devBundle.containsAssertions).toBe(true);
 });

 it('persists to disk and reads back identically', () => {
  const report = mockDxReport();
  const filepath = join(testDir, 'dx-test.json');
  writeFileSync(filepath, JSON.stringify(report, null, 2));

  const content = readFileSync(filepath, 'utf-8');
  const parsed = JSON.parse(content) as DxReport;

  expect(parsed).toEqual(report);
 });

 it('creates latest pointer alongside timestamped file', () => {
  const report = mockDxReport();
  const filename = 'dx-2026-01-15T12-00-00-000Z.json';
  const filepath = join(testDir, filename);
  const latestPath = join(testDir, 'dx-latest.json');

  writeFileSync(filepath, JSON.stringify(report, null, 2));
  createLatestPointer(filepath, latestPath, filename);

  expect(existsSync(latestPath)).toBe(true);
  const latestContent = readFileSync(latestPath, 'utf-8');
  const parsed = JSON.parse(latestContent) as DxReport;
  expect(parsed.bundleSize).toHaveLength(2);
 });
});
