/**
 * @file dx/tree-shaking.ts
 * @description Tree-shaking effectiveness verification
 *
 * Verifies that unused exports are eliminated by bundlers.
 * Tests sideEffects: false is honored.
 */

import { measureBundleSize } from './bundle-size.ts';

import type { DxConfig } from '../harness/dx-types.ts';

/** Result of tree-shaking effectiveness verification */
export interface TreeShakingResult {
 fullSize: number;
 minimalSize: number;
 reduction: number;
 reductionPercent: number;
 effectiveTreeShaking: boolean;
 sideEffectsEmpty: boolean;
}

export const MIN_REDUCTION_PERCENT = 40;

/**
 * Verify tree-shaking by comparing full import vs single-type import
 *
 * @param config - DX configuration with main entry and minimal import statement
 * @returns Tree-shaking verification result with size reduction metrics
 */
export function verifyTreeShaking(config: DxConfig): TreeShakingResult {
 const fullResult = measureBundleSize(
  `export * from '${config.mainEntry}';`,
  'full-library',
  config.root,
 );
 const minResult = measureBundleSize(
  config.treeshakingMinimalImport,
  'minimal-import',
  config.root,
 );

 const fullSize = fullResult?.rawBytes ?? 0;
 const minimalSize = minResult?.rawBytes ?? 0;
 const reduction = fullSize - minimalSize;
 const reductionPercent = fullSize > 0 ? (reduction / fullSize) * 100 : 0;

 // Test sideEffects: false — bare import should produce empty bundle
 const bareResult = measureBundleSize(`import '${config.mainEntry}';`, 'bare-import', config.root);
 const sideEffectsEmpty = (bareResult?.rawBytes ?? Infinity) < 100;

 return {
  fullSize,
  minimalSize,
  reduction,
  reductionPercent,
  effectiveTreeShaking: reductionPercent >= MIN_REDUCTION_PERCENT,
  sideEffectsEmpty,
 };
}
