/**
 * @file src/utils/performance.ts
 * @module @lenguados/math2d/utils
 * @description Lightweight utilities for profiling and measuring execution time.
 *
 * @remarks
 * This module provides development-time utilities for measuring performance.
 * It is not intended for production use.
 *
 * @migration
 * **Planned Migration**: This module will be moved to `@lenguados/devtools`
 * in version 2.0. Performance profiling is a development concern, not a
 * core mathematical operation.
 *
 * **What will change in v2.0:**
 * - Import path: `@lenguados/devtools` instead of `@lenguados/math2d`
 * - Additional features: Flame graphs, memory tracking, comparison reports
 * - Integration with common profiling tools
 *
 * **Migration path:**
 * ```typescript
 * // Before (v1.x)
 * import { measure, MeasurementCollector } from '@lenguados/math2d';
 *
 * // After (v2.0)
 * import { measure, MeasurementCollector } from '@lenguados/devtools';
 * ```
 */

/* ========================================================================== */
/* Internal State                                                             */
/* ========================================================================== */

const hasPerformanceNow =
 typeof globalThis !== 'undefined' &&
 !!globalThis.performance &&
 typeof globalThis.performance.now === 'function';

/* ========================================================================== */
/* Timestamp Utilities                                                        */
/* ========================================================================== */

/**
 * Returns a high-resolution timestamp when available, falling back to `Date.now()`.
 *
 * @returns Timestamp in milliseconds.
 *
 * @example
 * ```typescript
 * const start = timestamp();
 * ```
 *
 * @category Utility
 * @since 0.7.0
 */
export function timestamp(): number {
 return hasPerformanceNow ? globalThis.performance.now() : Date.now();
}

/* ========================================================================== */
/* Measurement Types                                                          */
/* ========================================================================== */

/**
 * Result of a synchronous performance measurement.
 *
 * @category Types
 * @since 0.7.0
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
 *
 * @param label - Identifier for the measurement.
 * @param function_ - Function to execute.
 * @returns Measurement metadata.
 *
 * @example
 * ```typescript
 * const result = measure('tick', () => 42);
 * console.log(result.duration);
 * ```
 *
 * @category Utility
 * @since 0.7.0
 */
export function measure<T>(label: string, function_: () => T): Measurement<T> {
 const start = timestamp();
 const value = function_();
 const duration = timestamp() - start;
 return { label, duration, value };
}

/**
 * Measures an asynchronous function, returning its result and duration.
 *
 * @param label - Identifier for the measurement.
 * @param function_ - Async function to execute.
 * @returns Measurement metadata.
 *
 * @example
 * ```typescript
 * const result = await measureAsync('load', async () => 42);
 * console.log(result.duration);
 * ```
 *
 * @category Utility
 * @since 0.7.0
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
 *
 * @param collector - Map to accumulate measurements into.
 * @param measurement - Measurement to record.
 *
 * @example
 * ```typescript
 * const collector = new Map<string, Measurement<number>[]>();
 * recordMeasurement(collector, measure('tick', () => 1));
 * ```
 *
 * @category Utility
 * @since 0.7.0
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
 *
 * @category Types
 * @since 0.7.0
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
 *
 * @param collector - Map produced via {@link recordMeasurement}.
 * @returns Map of label to summary statistics.
 *
 * @example
 * ```typescript
 * const summaries = summarizeMeasurements(new Map());
 * ```
 *
 * @category Utility
 * @since 0.7.0
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
 *
 * @param summary - Summary statistics to format.
 * @returns Human-readable string.
 *
 * @example
 * ```typescript
 * const text = formatSummary({
 *  label: 'tick',
 *  count: 1,
 *  totalDuration: 2,
 *  minDuration: 2,
 *  maxDuration: 2,
 *  meanDuration: 2,
 * });
 * ```
 *
 * @category Utility
 * @since 0.7.0
 */
export function formatSummary(summary: MeasurementSummary): string {
 const format = (value: number): string => value.toFixed(3);
 return `${summary.label}: count=${summary.count}, total=${format(
  summary.totalDuration,
 )}ms, mean=${format(summary.meanDuration)}ms, min=${format(
  summary.minDuration,
 )}ms, max=${format(summary.maxDuration)}ms`;
}

/* ========================================================================== */
/* Measurement Collectors                                                     */
/* ========================================================================== */

/**
 * Convenience wrapper around {@link recordMeasurement} and {@link summarizeMeasurements}.
 *
 * @example
 * ```typescript
 * const collector = new MeasurementCollector<number>();
 * collector.record(measure('tick', () => 1));
 * ```
 *
 * @category Utility
 * @since 0.7.0
 */
export class MeasurementCollector<T> {
 private readonly measurements = new Map<string, Measurement<T>[]>();

 /**
  * Records a measurement in the collector.
  *
  * @param measurement - Measurement to record.
  *
  * @category Utility
  * @since 0.7.0
  */
 record(measurement: Measurement<T>): void {
  recordMeasurement(this.measurements, measurement);
 }

 /**
  * Records multiple measurements in sequence.
  *
  * @param measurements - Iterable of measurements to record.
  *
  * @category Utility
  * @since 0.7.0
  */
 recordMany(measurements: Iterable<Measurement<T>>): void {
  for (const measurement of measurements) {
   this.record(measurement);
  }
 }

 /**
  * Clears all recorded measurements.
  *
  * @category Utility
  * @since 0.7.0
  */
 clear(): void {
  this.measurements.clear();
 }

 /**
  * Returns a snapshot of the underlying measurements map.
  *
  * @returns Read-only view of recorded measurements.
  *
  * @category Utility
  * @since 0.7.0
  */
 get entries(): ReadonlyMap<string, readonly Measurement<T>[]> {
  return this.measurements;
 }

 /**
  * Computes summary statistics for the recorded measurements.
  *
  * @returns Map of label to summary statistics.
  *
  * @category Utility
  * @since 0.7.0
  */
 summarize(): Map<string, MeasurementSummary> {
  return summarizeMeasurements(this.measurements);
 }

 /**
  * Convenience helper returning all summaries as an array.
  *
  * @returns Array of summary statistics.
  *
  * @category Utility
  * @since 0.7.0
  */
 summarizeArray(): MeasurementSummary[] {
  return Array.from(this.summarize().values());
 }

 /**
  * Formats summaries using {@link formatSummary}.
  *
  * @returns Array of formatted summary strings.
  *
  * @category Utility
  * @since 0.7.0
  */
 formatSummaries(): string[] {
  return this.summarizeArray().map(formatSummary);
 }
}
