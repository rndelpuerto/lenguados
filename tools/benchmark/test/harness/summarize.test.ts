/**
 * @file test/harness/summarize.test.ts
 * @description Test the benchmark summary generator (scripts/summarize.ts)
 *
 * Validates output structure, placeholder generation, idempotency,
 * and size constraint using the live generator script.
 */

import { describe, expect, it } from '@jest/globals';
import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const TOOL_ROOT = resolve(import.meta.dirname, '../..');
const OUTPUT_DIR = resolve(TOOL_ROOT, 'results/summaries/math2d');

function runSummarizer(): string {
 return execSync('npx tsx scripts/summarize.ts', {
  encoding: 'utf-8',
  cwd: TOOL_ROOT,
  stdio: ['pipe', 'pipe', 'pipe'],
 });
}

function readOutput(filename: string): unknown {
 const filepath = resolve(OUTPUT_DIR, filename);
 if (!existsSync(filepath)) return null;
 return JSON.parse(readFileSync(filepath, 'utf-8'));
}

describe('summarize.ts', () => {
 // Run the summarizer once for all tests.
 // Always produces output — overwrites any existing summaries
 // with fresh transforms from results/*.json.
 let stdout: string;
 const outputs: Record<string, unknown> = {};

 it('runs without errors', () => {
  stdout = runSummarizer();
  expect(stdout).toContain('Done.');

  outputs.performance = readOutput('performance-summary.json');
  outputs.comparison = readOutput('comparison-summary.json');
  outputs.stress = readOutput('stress-summary.json');
  outputs.dx = readOutput('dx-summary.json');
 });

 it('creates all 4 output files', () => {
  expect(existsSync(resolve(OUTPUT_DIR, 'performance-summary.json'))).toBe(true);
  expect(existsSync(resolve(OUTPUT_DIR, 'comparison-summary.json'))).toBe(true);
  expect(existsSync(resolve(OUTPUT_DIR, 'stress-summary.json'))).toBe(true);
  expect(existsSync(resolve(OUTPUT_DIR, 'dx-summary.json'))).toBe(true);
 });

 it('performance summary has correct top-level structure', () => {
  const perf = outputs.performance as Record<string, unknown>;
  expect(perf).toBeDefined();
  expect(perf).toHaveProperty('metadata');
  expect(perf).toHaveProperty('entities');
 });

 it('performance summary metadata has required fields when data exists', () => {
  const perf = outputs.performance as Record<string, unknown>;
  if (perf.metadata !== null) {
   const meta = perf.metadata as Record<string, unknown>;
   expect(meta.timestamp).toBeDefined();
   expect(meta.commitHash).toBeDefined();
   expect(meta.nodeVersion).toBeDefined();
   expect(meta.cpu).toBeDefined();
   expect(meta.os).toBeDefined();
  }
 });

 it('performance summary entities contain operations arrays', () => {
  const perf = outputs.performance as Record<string, Record<string, unknown>>;
  if (perf.metadata !== null) {
   const entities = perf.entities as Record<string, { operations: unknown[] }>;
   for (const [, entity] of Object.entries(entities)) {
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
  }
 });

 it('performance summary strips raw sample arrays', () => {
  const perfJson = readFileSync(resolve(OUTPUT_DIR, 'performance-summary.json'), 'utf-8');
  expect(perfJson).not.toContain('"raw"');
 });

 it('performance summary computes outlierPercent correctly', () => {
  const perf = outputs.performance as Record<string, Record<string, unknown>>;
  if (perf.metadata !== null) {
   const entities = perf.entities as Record<
    string,
    { operations: Array<{ outlierPercent: number; samples: number }> }
   >;
   for (const entity of Object.values(entities)) {
    for (const op of entity.operations) {
     expect(op.outlierPercent).toBeGreaterThanOrEqual(0);
     expect(op.outlierPercent).toBeLessThanOrEqual(100);
    }
   }
  }
 });

 it('comparison summary has correct structure', () => {
  const comp = outputs.comparison as Record<string, unknown>;
  expect(comp).toBeDefined();
  expect(comp).toHaveProperty('metadata');
  expect(comp).toHaveProperty('libraries');
  expect(comp).toHaveProperty('categories');
  expect(comp).toHaveProperty('aggregate');
  if (comp.metadata === null) {
   expect(comp.libraries).toEqual([]);
   expect(comp.categories).toEqual({});
   expect(comp.aggregate).toBeNull();
  }
 });

 it('stress summary has correct structure', () => {
  const stress = outputs.stress as Record<string, unknown>;
  expect(stress).toBeDefined();
  expect(stress).toHaveProperty('metadata');
  expect(stress).toHaveProperty('ulpAccuracy');
  expect(stress).toHaveProperty('edgeCases');
  expect(stress).toHaveProperty('identities');
  expect(stress).toHaveProperty('cancellation');
  expect(stress).toHaveProperty('allocation');
  expect(stress).toHaveProperty('overflow');
  expect(stress).toHaveProperty('nearSingular');
 });

 it('dx summary has correct structure', () => {
  const dx = outputs.dx as Record<string, unknown>;
  expect(dx).toBeDefined();
  expect(dx).toHaveProperty('metadata');
  expect(dx).toHaveProperty('bundleSize');
  expect(dx).toHaveProperty('treeShaking');
  expect(dx).toHaveProperty('buildComparison');
  expect(dx).toHaveProperty('buildCorrectness');
  expect(dx).toHaveProperty('assertionElimination');
 });

 it('total output is under 150 KB', () => {
  let totalBytes = 0;
  for (const filename of [
   'performance-summary.json',
   'comparison-summary.json',
   'stress-summary.json',
   'dx-summary.json',
  ]) {
   const filepath = resolve(OUTPUT_DIR, filename);
   if (existsSync(filepath)) {
    totalBytes += readFileSync(filepath).byteLength;
   }
  }
  expect(totalBytes).toBeLessThan(150 * 1024);
 });

 it('output is idempotent (byte-identical on re-run)', () => {
  const before: Record<string, string> = {};
  for (const filename of [
   'performance-summary.json',
   'comparison-summary.json',
   'stress-summary.json',
   'dx-summary.json',
  ]) {
   const filepath = resolve(OUTPUT_DIR, filename);
   before[filename] = readFileSync(filepath, 'utf-8');
  }

  runSummarizer();

  for (const filename of Object.keys(before)) {
   const after = readFileSync(resolve(OUTPUT_DIR, filename), 'utf-8');
   expect(after).toBe(before[filename]);
  }
 });
});
