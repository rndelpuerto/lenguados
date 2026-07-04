/**
 * @file harness/result-types.ts
 * @description Define JSON report shapes for stress test and DX analysis persistence
 *
 * These interfaces wrap the per-module result types into top-level
 * report structures that include metadata and are written to
 * `results/{package}/stress-latest.json` and `results/{package}/dx-latest.json`.
 */

import type { ReportMetadata } from './reporter.ts';
import type { DiagnosticReport } from './diagnostics.ts';

import type { BundleSizeResult } from '../dx/bundle-size.ts';
import type { TreeShakingResult } from '../dx/tree-shaking.ts';
import type { BuildCorrectnessResult, AssertionBehaviorResult } from '../dx/build-correctness.ts';
import type { AssertionEliminationResult } from '../dx/assertion-elimination.ts';
import type { BuildComparisonResult } from '../dx/build-comparison.ts';

/* ========================================================================== */
/* Stress Report                                                               */
/* ========================================================================== */

/**
 * Represent a complete stress test report with metadata and per-suite results
 *
 * @remarks
 * Suite result shapes are package knowledge (each stress implementation lives
 * under its package's extension directory), so the report carries them as
 * opaque per-suite entry arrays keyed by suite name — consumers that need the
 * concrete shape import it from the owning package extension.
 */
export interface StressReport {
 metadata: ReportMetadata;
 samples: number;
 suites: Record<string, unknown[]>;
 diagnostics: DiagnosticReport;
}

/* ========================================================================== */
/* DX Report                                                                   */
/* ========================================================================== */

/** Represent a complete DX analysis report with bundle size, tree-shaking, and build data */
export interface DxReport {
 metadata: ReportMetadata;
 bundleSize: BundleSizeResult[];
 treeShaking: TreeShakingResult;
 buildCorrectness: {
  correctness: BuildCorrectnessResult[];
  assertions: AssertionBehaviorResult[];
 };
 assertionElimination: AssertionEliminationResult;
 buildComparison: BuildComparisonResult;
}

/* ========================================================================== */
/* Re-exports for convenience                                                  */
/* ========================================================================== */

export type {
 BundleSizeResult,
 TreeShakingResult,
 BuildCorrectnessResult,
 AssertionBehaviorResult,
 AssertionEliminationResult,
 BuildComparisonResult,
};
