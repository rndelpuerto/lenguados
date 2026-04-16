/**
 * JSON report shapes for stress test and DX analysis persistence.
 *
 * These interfaces wrap the per-module result types into top-level
 * report structures that include metadata and are written to
 * `results/stress-latest.json` and `results/dx-latest.json`.
 */

import type { ReportMetadata } from './reporter.ts';
import type { DiagnosticReport } from './diagnostics.ts';

import type { UlpAccuracyResult } from '../stress/ulp-accuracy.stress.ts';
import type { EdgeCaseResult } from '../stress/ieee754-edge.stress.ts';
import type { CancellationResult } from '../stress/cancellation.stress.ts';
import type { SingularityResult } from '../stress/near-singular.stress.ts';
import type { OverflowResult } from '../stress/overflow.stress.ts';
import type { IdentityResult } from '../stress/identity.stress.ts';
import type { AllocationResult } from '../stress/allocation.stress.ts';

import type { BundleSizeResult } from '../dx/bundle-size.ts';
import type { TreeShakingResult } from '../dx/tree-shaking.ts';
import type { BuildCorrectnessResult, AssertionBehaviorResult } from '../dx/build-correctness.ts';
import type { AssertionEliminationResult } from '../dx/assertion-elimination.ts';
import type { BuildComparisonResult } from '../dx/build-comparison.ts';

/* ========================================================================== */
/* Stress Report                                                               */
/* ========================================================================== */

export interface StressReport {
 metadata: ReportMetadata;
 samples: number;
 suites: {
  ulp?: UlpAccuracyResult[];
  ieee754?: EdgeCaseResult[];
  cancellation?: CancellationResult[];
  nearSingular?: SingularityResult[];
  overflow?: OverflowResult[];
  identity?: IdentityResult[];
  allocation?: AllocationResult[];
 };
 diagnostics: DiagnosticReport;
}

/* ========================================================================== */
/* DX Report                                                                   */
/* ========================================================================== */

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
 UlpAccuracyResult,
 EdgeCaseResult,
 CancellationResult,
 SingularityResult,
 OverflowResult,
 IdentityResult,
 AllocationResult,
 BundleSizeResult,
 TreeShakingResult,
 BuildCorrectnessResult,
 AssertionBehaviorResult,
 AssertionEliminationResult,
 BuildComparisonResult,
};
