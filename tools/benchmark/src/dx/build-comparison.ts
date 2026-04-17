/**
 * @file dx/build-comparison.ts
 * @description Development vs production build size comparison
 *
 * Reports absolute and percentage size difference,
 * estimating the validation code eliminated by DCE.
 */

import { readFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';

import type { DxConfig } from '../harness/dx-types.ts';

/** Comparison of development and production build sizes (raw and gzip) */
export interface BuildComparisonResult {
 devSize: { raw: number; gzip: number };
 prodSize: { raw: number; gzip: number };
 difference: { raw: number; gzip: number };
 reductionPercent: { raw: number; gzip: number };
}

/**
 * Compare development and production build sizes
 *
 * @param config - DX configuration with dev and prod bundle paths
 * @returns Build size comparison with raw and gzip measurements
 */
export function compareBuildSizes(config: DxConfig): BuildComparisonResult {
 const devContent = readFileSync(config.devBundle);
 const prodContent = readFileSync(config.prodBundle);

 const devRaw = devContent.length;
 const prodRaw = prodContent.length;
 const devGzip = gzipSync(devContent).length;
 const prodGzip = gzipSync(prodContent).length;

 return {
  devSize: { raw: devRaw, gzip: devGzip },
  prodSize: { raw: prodRaw, gzip: prodGzip },
  difference: { raw: devRaw - prodRaw, gzip: devGzip - prodGzip },
  reductionPercent: {
   raw: devRaw > 0 ? ((devRaw - prodRaw) / devRaw) * 100 : 0,
   gzip: devGzip > 0 ? ((devGzip - prodGzip) / devGzip) * 100 : 0,
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
