/**
 * Tree-shaking effectiveness verification.
 *
 * Verifies that unused exports are eliminated by bundlers.
 * Tests sideEffects: false is honored.
 */

import { MATH2D_ROOT } from '../harness/math2d-loader.ts';
import { measureBundleSize } from './bundle-size.ts';
import type { BundleSizeResult } from './bundle-size.ts';

export interface TreeShakingResult {
 fullSize: number;
 minimalSize: number;
 reduction: number;
 reductionPercent: number;
 effectiveTreeShaking: boolean;
 sideEffectsEmpty: boolean;
}

const MIN_REDUCTION_PERCENT = 40;

/**
 * Verify tree-shaking by comparing full import vs single-type import.
 */
export function verifyTreeShaking(): TreeShakingResult {
 const fullResult = measureBundleSize(
  `export * from '${MATH2D_ROOT}main.mjs';`,
  'full-library',
 );
 const minResult = measureBundleSize(
  `export { Vector2 } from '${MATH2D_ROOT}main.mjs';`,
  'vector2-only',
 );

 const fullSize = fullResult?.rawBytes ?? 0;
 const minimalSize = minResult?.rawBytes ?? 0;
 const reduction = fullSize - minimalSize;
 const reductionPercent = fullSize > 0 ? (reduction / fullSize) * 100 : 0;

 // Test sideEffects: false — bare import should produce empty bundle
 const bareResult = measureBundleSize(
  `import '${MATH2D_ROOT}main.mjs';`,
  'bare-import',
 );
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
