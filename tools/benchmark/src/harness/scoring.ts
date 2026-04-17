/**
 * @file harness/scoring.ts
 * @description Implement a scoring system using geometric mean of normalized ratios
 *
 * Follows the ACM 1986 standard ("How not to lie with statistics")
 * for aggregating normalized benchmark results. Supports both
 * self-comparison (regression detection) and cross-library comparison.
 */

/* ========================================================================== */
/* Types                                                                       */
/* ========================================================================== */

/** Represent the throughput result of a single operation */
export interface OperationResult {
 operation: string;
 meanNs: number;
 opsPerSec: number;
}

/** Represent the throughput ratio of an operation between two libraries */
export interface ComparisonRatio {
 operation: string;
 ratio: number;
 targetOpsPerSec: number;
 referenceOpsPerSec: number;
}

/** Represent the aggregate score comparing a target library against a reference */
export interface AggregateScore {
 geometricMean: number;
 ratios: ComparisonRatio[];
 targetName: string;
 referenceName: string;
}

/* ========================================================================== */
/* Normalization                                                               */
/* ========================================================================== */

/**
 * Convert nanoseconds per iteration to operations per second
 *
 * @param meanNs - Mean time per operation in nanoseconds
 * @returns Operations per second, or 0 if meanNs is non-positive
 */
export function nsToOpsPerSec(meanNs: number): number {
 if (meanNs <= 0) return 0;
 return 1e9 / meanNs;
}

/**
 * Normalize a set of operation results against a baseline
 *
 * @remarks
 * Returns per-operation speedup/slowdown ratios.
 * Ratio > 1 means target is faster than reference.
 * Ratio < 1 means target is slower than reference.
 *
 * @param target - The target library's operation results
 * @param reference - The reference/baseline library's operation results
 * @param targetName - Display name of the target library
 * @param referenceName - Display name of the reference library
 * @returns Per-operation comparison ratios for matched operations
 */
export function computeRatios(
 target: OperationResult[],
 reference: OperationResult[],
 targetName: string,
 referenceName: string,
): ComparisonRatio[] {
 const refMap = new Map<string, OperationResult>();
 for (const r of reference) {
  refMap.set(r.operation, r);
 }

 const ratios: ComparisonRatio[] = [];
 for (const t of target) {
  const ref = refMap.get(t.operation);
  if (!ref || ref.opsPerSec === 0) continue;

  ratios.push({
   operation: t.operation,
   ratio: t.opsPerSec / ref.opsPerSec,
   targetOpsPerSec: t.opsPerSec,
   referenceOpsPerSec: ref.opsPerSec,
  });
 }

 return ratios;
}

/* ========================================================================== */
/* Geometric Mean                                                              */
/* ========================================================================== */

/**
 * Compute the geometric mean of an array of positive numbers
 *
 * @remarks
 * Uses log-space computation to avoid overflow/underflow:
 * geometricMean = exp(mean(ln(values)))
 *
 * @param values - Array of positive numbers
 * @returns The geometric mean, or 0 if any value is non-positive or the array is empty
 */
export function geometricMean(values: number[]): number {
 if (values.length === 0) return 0;

 let logSum = 0;
 for (let i = 0; i < values.length; i++) {
  const v = values[i]!;
  if (v <= 0) return 0;
  logSum += Math.log(v);
 }

 return Math.exp(logSum / values.length);
}

/* ========================================================================== */
/* Aggregate Scoring                                                           */
/* ========================================================================== */

/**
 * Compute an aggregate score comparing target against reference
 *
 * @remarks
 * The score is the geometric mean of per-operation throughput ratios.
 * Score > 1 means target is faster overall.
 * Score = 1.0 means neutral (perfectly balanced).
 * Score < 1 means target is slower overall.
 *
 * @param target - The target library's operation results
 * @param reference - The reference/baseline library's operation results
 * @param targetName - Display name of the target library
 * @param referenceName - Display name of the reference library
 * @returns The aggregate score with geometric mean and per-operation ratios
 */
export function aggregateScore(
 target: OperationResult[],
 reference: OperationResult[],
 targetName: string,
 referenceName: string,
): AggregateScore {
 const ratios = computeRatios(target, reference, targetName, referenceName);
 const ratioValues = ratios.map((r) => r.ratio);
 const gm = geometricMean(ratioValues);

 return {
  geometricMean: gm,
  ratios,
  targetName,
  referenceName,
 };
}
