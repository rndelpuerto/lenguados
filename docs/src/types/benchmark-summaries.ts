/**
 * Shared types for the benchmark summary JSON consumed by the docs site.
 *
 * Single source of truth for the plugin (build-time loader) and the
 * `useBenchmarkData` hook (render-time consumer). The shapes mirror the
 * output of the benchmark tool's summarize step
 * (tools/benchmark/scripts/summarize.ts), which owns the schema.
 */

/**
 * Fields common to all four summary files
 *
 * @remarks
 * `partial` is stamped by the summarize tool into every output when the
 * summary was generated from a filtered (forced) benchmark run, so pages can
 * label deliberately partial data.
 * @category Types
 * @since 0.7.0
 */
export interface BenchmarkSummaryBase {
 metadata?: unknown;
 partial?: boolean;
}

/**
 * Shape of `performance-summary.json`
 *
 * @category Types
 * @since 0.7.0
 */
export interface PerformanceSummary extends BenchmarkSummaryBase {
 entities?: unknown;
}

/**
 * Shape of `comparison-summary.json`
 *
 * @category Types
 * @since 0.7.0
 */
export interface ComparisonSummary extends BenchmarkSummaryBase {
 conditions?: unknown;
 libraries?: unknown;
 categories?: unknown;
 aggregate?: unknown;
}

/**
 * Shape of `stress-summary.json`
 *
 * @category Types
 * @since 0.7.0
 */
export interface StressSummary extends BenchmarkSummaryBase {
 ulpAccuracy?: unknown;
 edgeCases?: unknown;
 identities?: unknown;
 cancellation?: unknown;
 allocation?: unknown;
 overflow?: unknown;
 nearSingular?: unknown;
}

/**
 * Shape of `dx-summary.json`
 *
 * @category Types
 * @since 0.7.0
 */
export interface DxSummary extends BenchmarkSummaryBase {
 bundleSize?: unknown;
 treeShaking?: unknown;
 buildComparison?: unknown;
 buildCorrectness?: unknown;
 assertionElimination?: unknown;
}

/**
 * The four summaries loaded for a single package (null = file missing)
 *
 * @category Types
 * @since 0.7.0
 */
export interface PackageBenchmarkData {
 performance: PerformanceSummary | null;
 comparison: ComparisonSummary | null;
 stress: StressSummary | null;
 dx: DxSummary | null;
}

/**
 * All packages' benchmark data, keyed by package name
 *
 * @category Types
 * @since 0.7.0
 */
export type AllBenchmarkData = Record<string, PackageBenchmarkData>;
