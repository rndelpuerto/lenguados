/**
 * @file dx/build-comparison.ts
 * @description Development vs production build size comparison
 *
 * Reports absolute and percentage size difference,
 * estimating the validation code eliminated by DCE.
 *
 * Tree-aware: each build is measured as the TOTAL of its entry file plus
 * every transitively reachable relative static import (preserveModules
 * layout). A flat single-file bundle is a tree of one node, so flat-layout
 * measurements are byte-identical to a direct single-file read.
 */

import { gzipSync } from 'node:zlib';

import type { DxConfig } from '../harness/dx-types.ts';

import { collectReachableModules } from './module-graph.ts';

/** Comparison of development and production build sizes (raw and gzip) */
export interface BuildComparisonResult {
 devSize: { raw: number; gzip: number };
 prodSize: { raw: number; gzip: number };
 difference: { raw: number; gzip: number };
 reductionPercent: { raw: number; gzip: number };
}

/**
 * Measure the total raw and gzip size of a build entry's module tree
 *
 * @param entryPath - Absolute path of the build entry file
 * @returns Summed raw and gzip byte totals across all reachable modules
 */
function measureModuleTree(entryPath: string): { raw: number; gzip: number } {
 let raw = 0;
 let gzip = 0;

 // Sum per-module raw and gzip bytes (same in-process zlib approach as the
 // previous single-file read — deterministic and hard-failing). On a flat
 // bundle the graph has exactly one node, so both totals are byte-identical
 // to the former readFileSync measurement.
 for (const { bytes } of collectReachableModules(entryPath)) {
  raw += bytes.length;
  gzip += gzipSync(bytes).length;
 }

 return { raw, gzip };
}

/**
 * Compare development and production build sizes
 *
 * @param config - DX configuration with dev and prod bundle entry paths
 * @returns Build size comparison with raw and gzip measurements
 */
export function compareBuildSizes(config: DxConfig): BuildComparisonResult {
 const dev = measureModuleTree(config.devBundle);
 const prod = measureModuleTree(config.prodBundle);

 return {
  devSize: { raw: dev.raw, gzip: dev.gzip },
  prodSize: { raw: prod.raw, gzip: prod.gzip },
  difference: { raw: dev.raw - prod.raw, gzip: dev.gzip - prod.gzip },
  reductionPercent: {
   raw: dev.raw > 0 ? ((dev.raw - prod.raw) / dev.raw) * 100 : 0,
   gzip: dev.gzip > 0 ? ((dev.gzip - prod.gzip) / dev.gzip) * 100 : 0,
  },
 };
}

/**
 * Format build comparison as human-readable string
 *
 * @param result - Build comparison result to format
 * @returns Multi-line formatted string with size details
 */
export function formatBuildComparison(result: BuildComparisonResult): string {
 const lines: string[] = [];
 lines.push('Build Size Comparison (dev vs prod):');
 lines.push(
  `  Development: ${(result.devSize.raw / 1024).toFixed(1)} KB raw, ${(result.devSize.gzip / 1024).toFixed(1)} KB gzip`,
 );
 lines.push(
  `  Production:  ${(result.prodSize.raw / 1024).toFixed(1)} KB raw, ${(result.prodSize.gzip / 1024).toFixed(1)} KB gzip`,
 );
 lines.push(
  `  Reduction:   ${(result.difference.raw / 1024).toFixed(1)} KB raw (${result.reductionPercent.raw.toFixed(1)}%), ${(result.difference.gzip / 1024).toFixed(1)} KB gzip (${result.reductionPercent.gzip.toFixed(1)}%)`,
 );
 return lines.join('\n');
}
