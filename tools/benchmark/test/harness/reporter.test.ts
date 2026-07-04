import { describe, expect, it } from '@jest/globals';

import {
 addFinding,
 collectMetadata,
 createDiagnosticReport,
 formatDiagnosticSummary,
 printAsciiTable,
 printComparisonTable,
 withTimeout,
} from '../../src/harness/reporter.ts';
import type {
 ComparisonEntry,
 DiagnosticFinding,
 ReportEntry,
} from '../../src/harness/reporter.ts';

describe('collectMetadata', () => {
 it('returns all required fields', () => {
  const meta = collectMetadata();
  expect(meta.timestamp).toBeDefined();
  expect(meta.nodeVersion).toMatch(/^v\d+/);
  expect(meta.os).toBeDefined();
  expect(meta.cpu).toBeDefined();
  expect(meta.arch).toBeDefined();
  expect(meta.commitHash).toBeDefined();
 });
});

describe('printAsciiTable', () => {
 const entries: ReportEntry[] = [
  {
   operation: 'Vector2.add',
   stats: {
    mean: 5.2,
    median: 5.0,
    stddev: 0.5,
    ci95lo: 4.8,
    ci95hi: 5.6,
    outliersMild: 2,
    outliersSevere: 0,
    samples: 1000,
    opsPerSec: 192307692,
    p50: 5.0,
    p95: 6.0,
    p99: 7.0,
   },
  },
  {
   operation: 'Vector2.normalize',
   stats: {
    mean: 12.5,
    median: 12.0,
    stddev: 1.5,
    ci95lo: 11.5,
    ci95hi: 13.5,
    outliersMild: 1,
    outliersSevere: 1,
    samples: 1000,
    opsPerSec: 80000000,
    p50: 12.0,
    p95: 15.0,
    p99: 18.0,
   },
  },
 ];

 it('produces formatted table with correct columns', () => {
  const table = printAsciiTable(entries);
  expect(table).toContain('Operation');
  expect(table).toContain('Mean');
  expect(table).toContain('CI 95%');
  expect(table).toContain('ops/sec');
  expect(table).toContain('Outliers');
 });

 it('includes all operation names', () => {
  const table = printAsciiTable(entries);
  expect(table).toContain('Vector2.add');
  expect(table).toContain('Vector2.normalize');
 });

 it('contains separator line', () => {
  const table = printAsciiTable(entries);
  const lines = table.split('\n');
  expect(lines[1]).toMatch(/^-+$/);
 });

 it('formats ops/sec with M suffix', () => {
  const table = printAsciiTable(entries);
  expect(table).toContain('M');
 });

 it('returns empty message for no results', () => {
  expect(printAsciiTable([])).toBe('(no results)');
 });

 it('aligns columns properly', () => {
  const table = printAsciiTable(entries);
  const lines = table.split('\n');
  // All data lines should have the same length (padded)
  const headerLen = lines[0]!.length;
  for (let i = 2; i < lines.length; i++) {
   expect(lines[i]!.length).toBe(headerLen);
  }
 });
});

describe('printComparisonTable', () => {
 it('shows regression status', () => {
  const comparisons: ComparisonEntry[] = [
   {
    operation: 'Vector2.add',
    baselineMean: 5,
    currentMean: 8,
    regression: {
     significant: true,
     effectSize: 60,
     pValue: 0.001,
     baselineMean: 5,
     currentMean: 8,
     withinThreshold: false,
    },
   },
  ];
  const table = printComparisonTable(comparisons);
  expect(table).toContain('REGRESSION');
  expect(table).toContain('+60.0%');
 });

 it('shows ok for non-significant changes', () => {
  const comparisons: ComparisonEntry[] = [
   {
    operation: 'Vector2.add',
    baselineMean: 5,
    currentMean: 5.1,
    regression: {
     significant: false,
     effectSize: 2,
     pValue: 0.3,
     baselineMean: 5,
     currentMean: 5.1,
     withinThreshold: true,
    },
   },
  ];
  const table = printComparisonTable(comparisons);
  expect(table).toContain('ok');
 });
});

describe('Diagnostic Report', () => {
 it('creates empty report', () => {
  const report = createDiagnosticReport();
  expect(report.findings).toHaveLength(0);
  expect(report.totalErrors).toBe(0);
 });

 it('aggregates findings by type and severity', () => {
  const report = createDiagnosticReport();

  addFinding(report, {
   severity: 'error',
   type: 'overflow',
   entity: 'Vector2',
   operation: 'magnitude',
   message: 'overflow detected',
  });
  addFinding(report, {
   severity: 'warning',
   type: 'cancellation',
   entity: 'Matrix2',
   operation: 'determinant',
   message: '45 bits lost',
  });
  addFinding(report, {
   severity: 'error',
   type: 'overflow',
   entity: 'Vector2',
   operation: 'normalize',
   message: 'overflow in sqrt',
  });

  expect(report.findings).toHaveLength(3);
  expect(report.totalErrors).toBe(2);
  expect(report.totalWarnings).toBe(1);
  expect(report.summary.overflow).toBe(2);
  expect(report.summary.cancellation).toBe(1);
 });

 it('formats summary with entity grouping', () => {
  const report = createDiagnosticReport();
  addFinding(report, {
   severity: 'error',
   type: 'overflow',
   entity: 'Vector2',
   operation: 'magnitude',
   message: 'test',
  });
  addFinding(report, {
   severity: 'warning',
   type: 'cancellation',
   entity: 'Matrix2',
   operation: 'determinant',
   message: 'test',
  });

  const summary = formatDiagnosticSummary(report);
  expect(summary).toContain('2 findings');
  expect(summary).toContain('overflow');
  expect(summary).toContain('Vector2');
  expect(summary).toContain('cancellation');
  expect(summary).toContain('Matrix2');
 });

 it('formats zero findings', () => {
  const report = createDiagnosticReport();
  const summary = formatDiagnosticSummary(report);
  expect(summary).toContain('0 findings');
  expect(summary).toContain('All operations within expected bounds');
 });
});

describe('withTimeout', () => {
 it('returns result for fast operations', async () => {
  const { result, timedOut } = await withTimeout(() => 42, 1000);
  expect(result).toBe(42);
  expect(timedOut).toBe(false);
 });

 it('catches synchronous errors', async () => {
  const { error, timedOut } = await withTimeout(() => {
   throw new Error('sync fail');
  }, 1000);
  expect(timedOut).toBe(false);
  expect(error).toBeInstanceOf(Error);
  expect(error!.message).toBe('sync fail');
 });

 it('catches async errors', async () => {
  const { error, timedOut } = await withTimeout(async () => {
   throw new Error('async fail');
  }, 1000);
  expect(timedOut).toBe(false);
  expect(error).toBeInstanceOf(Error);
 });
});
