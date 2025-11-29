/**
 * @file utils/performance.ts
 * @module @lenguados/math2d/utils
 * @description Lightweight utilities for profiling and measuring execution time.
 */

const hasPerformanceNow =
 typeof globalThis !== 'undefined' &&
 !!globalThis.performance &&
 typeof globalThis.performance.now === 'function';

/**
 * Returns a high-resolution timestamp when available, falling back to `Date.now()`.
 * @returns Timestamp in milliseconds.
 */
export function timestamp(): number {
 return hasPerformanceNow ? globalThis.performance.now() : Date.now();
}

/**
 * Result of a synchronous performance measurement.
 */
export interface Measurement<T> {
 /** Identifier for the measurement. */
 label: string;
 /** Duration in milliseconds. */
 duration: number;
 /** Value returned by the measured function. */
 value: T;
}

/**
 * Measures a synchronous function, returning its result and duration.
 * @param label - Identifier for the measurement
 * @param fn - Function to execute
 * @returns Measurement metadata
 */
export function measure<T>(label: string, function_: () => T): Measurement<T> {
 const start = timestamp();
 const value = function_();
 const duration = timestamp() - start;
 return { label, duration, value };
}

/**
 * Measures an asynchronous function, returning its result and duration.
 * @param label - Identifier for the measurement
 * @param fn - Async function to execute
 * @returns Measurement metadata
 */
export async function measureAsync<T>(
 label: string,
 function_: () => Promise<T>,
): Promise<Measurement<T>> {
 const start = timestamp();
 const value = await function_();
 const duration = timestamp() - start;
 return { label, duration, value };
}

/**
 * Accumulates measurements into a target collector.
 * @param collector - Map to accumulate measurements into
 * @param measurement - Measurement to record
 */
export function recordMeasurement<T>(
 collector: Map<string, Measurement<T>[]>,
 measurement: Measurement<T>,
): void {
 const list = collector.get(measurement.label);
 if (list) {
  list.push(measurement);
 } else {
  collector.set(measurement.label, [measurement]);
 }
}

/**
 * Summary statistics for a collection of measurements.
 */
export interface MeasurementSummary {
 /** Identifier for the measurement set. */
 label: string;
 /** Number of samples recorded. */
 count: number;
 /** Sum of all recorded durations. */
 totalDuration: number;
 /** Minimum duration observed. */
 minDuration: number;
 /** Maximum duration observed. */
 maxDuration: number;
 /** Arithmetic mean of the recorded durations. */
 meanDuration: number;
}

/**
 * Computes summary statistics for every label within a measurement collector.
 * @param collector - Map produced via {@link recordMeasurement}
 * @returns Map of label to summary statistics
 */
export function summarizeMeasurements<T>(
 collector: Map<string, Measurement<T>[]>,
): Map<string, MeasurementSummary> {
 const summaries = new Map<string, MeasurementSummary>();

 for (const [label, entries] of collector) {
  if (!entries || entries.length === 0) {
   continue;
  }

  let count = 0;
  let totalDuration = 0;
  let minDuration = Number.POSITIVE_INFINITY;
  let maxDuration = Number.NEGATIVE_INFINITY;

  for (const entry of entries) {
   const duration = entry.duration;
   totalDuration += duration;
   count += 1;
   if (duration < minDuration) {
    minDuration = duration;
   }
   if (duration > maxDuration) {
    maxDuration = duration;
   }
  }

  if (count === 0) {
   continue;
  }

  summaries.set(label, {
   label,
   count,
   totalDuration,
   minDuration,
   maxDuration,
   meanDuration: totalDuration / count,
  });
 }

 return summaries;
}

/**
 * Formats a measurement summary into a human-friendly string. Values are shown
 * with three decimal places by default.
 * @param summary - Summary statistics to format
 * @returns Human-readable string
 */
export function formatSummary(summary: MeasurementSummary): string {
 const format = (value: number): string => value.toFixed(3);
 return `${summary.label}: count=${summary.count}, total=${format(
  summary.totalDuration,
 )}ms, mean=${format(summary.meanDuration)}ms, min=${format(
  summary.minDuration,
 )}ms, max=${format(summary.maxDuration)}ms`;
}

/**
 * Convenience wrapper around {@link recordMeasurement} and {@link summarizeMeasurements}.
 */
export class MeasurementCollector<T> {
 private readonly measurements = new Map<string, Measurement<T>[]>();

 /**
  * Records a measurement in the collector.
  * @param measurement - Measurement to record
  */
 record(measurement: Measurement<T>): void {
  recordMeasurement(this.measurements, measurement);
 }

 /**
  * Records multiple measurements in sequence.
  * @param measurements - Iterable of measurements to record
  */
 recordMany(measurements: Iterable<Measurement<T>>): void {
  for (const measurement of measurements) {
   this.record(measurement);
  }
 }

 /**
  * Clears all recorded measurements.
  */
 clear(): void {
  this.measurements.clear();
 }

 /**
  * Returns a snapshot of the underlying measurements map.
  * @returns Read-only view of recorded measurements
  */
 get entries(): ReadonlyMap<string, readonly Measurement<T>[]> {
  return this.measurements;
 }

 /**
  * Computes summary statistics for the recorded measurements.
  * @returns Map of label to summary statistics
  */
 summarize(): Map<string, MeasurementSummary> {
  return summarizeMeasurements(this.measurements);
 }

 /**
  * Convenience helper returning all summaries as an array.
  * @returns Array of summary statistics
  */
 summarizeArray(): MeasurementSummary[] {
  return Array.from(this.summarize().values());
 }

 /**
  * Formats summaries using {@link formatSummary}.
  * @returns Array of formatted summary strings
  */
 formatSummaries(): string[] {
  return this.summarizeArray().map(formatSummary);
 }
}
