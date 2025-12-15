/**
 * @file test/utils/performance.node.spec.ts
 * @module @lenguados/math2d/utils
 * @description Tests for performance measurement utilities.
 */

import { describe, expect, it } from '@jest/globals';

import {
 MeasurementCollector,
 formatSummary,
 measure,
 measureAsync,
 recordMeasurement,
 summarizeMeasurements,
 timestamp,
} from '../../src/utils/performance';
import type { Measurement, MeasurementSummary } from '../../src/utils/performance';

describe('utils/performance', () => {
 it('timestamp returns a finite number', () => {
  expect(Number.isFinite(timestamp())).toBe(true);
 });

 it('measure captures duration and value', () => {
  const result = measure('sync', () => 42);
  expect(result.label).toBe('sync');
  expect(result.value).toBe(42);
  expect(result.duration).toBeGreaterThanOrEqual(0);
 });

 it('measureAsync resolves with metadata', async () => {
  const result = await measureAsync('async', async () => 'done');
  expect(result.label).toBe('async');
  expect(result.value).toBe('done');
  expect(result.duration).toBeGreaterThanOrEqual(0);
 });

 it('recordMeasurement accumulates values per label', () => {
  const collector = new Map<string, Measurement<number>[]>();
  const first = measure('op', () => 1);
  recordMeasurement(collector, first);
  const second = measure('op', () => 2);
  recordMeasurement(collector, second);

  const entries = collector.get('op');
  expect(entries).toBeDefined();
  expect(entries).toHaveLength(2);
  expect(entries?.[0]?.value).toBe(1);
  expect(entries?.[1]?.value).toBe(2);
 });

 it('summarizeMeasurements aggregates statistics per label', () => {
  const collector = new Map<string, Measurement<number>[]>();
  collector.set('op', [
   { label: 'op', duration: 2, value: 10 },
   { label: 'op', duration: 4, value: 20 },
  ]);
  collector.set('empty', []);

  const summaries = summarizeMeasurements(collector);
  const summary = summaries.get('op') as MeasurementSummary | undefined;

  expect(summary).toBeDefined();
  const summaryDetails = summary!;
  expect(summaryDetails.count).toBe(2);
  expect(summaryDetails.totalDuration).toBe(6);
  expect(summaryDetails.minDuration).toBe(2);
  expect(summaryDetails.maxDuration).toBe(4);
  expect(summaryDetails.meanDuration).toBeCloseTo(3);
  expect(summaries.has('empty')).toBe(false);

  const formatted = formatSummary(summaryDetails);
  expect(formatted).toContain('count=2');
  expect(formatted).toContain('total=6.000ms');
  expect(formatted).toContain('mean=3.000ms');
 });

 it('MeasurementCollector records and formats summaries', () => {
  const collector = new MeasurementCollector<number>();
  collector.record({ label: 'step', duration: 5.5, value: 1 });
  collector.record({ label: 'step', duration: 4.5, value: 2 });
  collector.record({ label: 'render', duration: 2, value: 3 });

  const summaries = collector.summarize();
  expect(summaries.get('step')?.count).toBe(2);
  expect(summaries.get('step')?.meanDuration).toBeCloseTo(5);
  expect(summaries.get('render')?.count).toBe(1);

  const formatted = collector.formatSummaries();
  expect(formatted).toHaveLength(2);
  expect(formatted.some((entry) => entry.includes('step'))).toBe(true);

  collector.clear();
  expect(collector.entries.size).toBe(0);
 });
});
