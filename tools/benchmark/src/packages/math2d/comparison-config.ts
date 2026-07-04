/**
 * @file packages/math2d/comparison-config.ts
 * @description Cross-library comparison configuration for @lenguados/math2d
 *
 * Declares the adapters, reference library, operation vocabulary, and test
 * conditions the comparison runner uses. The comparison script resolves this
 * file by convention (`src/packages/{name}/comparison-config.ts`); a package
 * without one does not support cross-library comparison.
 */

import { createMath2dAdapter } from './adapters/math2d-adapter.ts';
import { createGlMatrixAdapter } from './adapters/gl-matrix-adapter.ts';
import { ALL_OPERATIONS, OPERATION_NAMES } from './vocabulary.ts';

import type { ComparisonConfig } from '../../harness/comparison-types.ts';

/**
 * Cross-library comparison configuration for @lenguados/math2d vs gl-matrix
 *
 * @remarks
 * Compares under the most representative production scenario: production
 * build (assertions stripped), unchecked tier (equivalent to default after
 * DCE), native Math.* (apples-to-apples — the reference has no determinism
 * toggle), static methods with out parameter (zero allocation for both).
 */
export const math2dComparisonConfig: ComparisonConfig = {
 buildAdapters: async () => [
  await createMath2dAdapter({ tier: 'unchecked', buildMode: 'production', nativeMath: true }),
  createGlMatrixAdapter(),
 ],
 referenceLibrary: 'gl-matrix',
 operationNames: OPERATION_NAMES,
 allOperations: ALL_OPERATIONS,
 conditions: {
  buildMode: 'production',
  tier: 'unchecked (simulates bundler DCE of assertions)',
  determinism: 'native (apples-to-apples — both libs use platform Math.*)',
  methodStyle: 'static with out parameter (zero allocation)',
 },
 bannerLines: (adapters) => [
  ...adapters.map((a) => `  ${a.name}: v${a.version}`),
  '  Build: production (assertions stripped by bundler DCE)',
  '  Tier: unchecked (equivalent to default after DCE)',
  '  Math: native Math.* (apples-to-apples with gl-matrix)',
  '  Methods: static with out parameter (zero allocation)',
 ],
};
