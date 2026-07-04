/**
 * @file packages/math2d/dx-config.ts
 * @description DX analysis configuration for @lenguados/math2d
 *
 * Defines import paths, bundle locations, and assertion patterns
 * used by the DX analysis functions (bundle-size, tree-shaking,
 * assertion-elimination, build-comparison).
 */

import { join } from 'node:path';

import type { DxConfig } from '../../harness/dx-types.ts';

import { math2dLoader } from './loader.ts';

const root = math2dLoader.root;
const mainEntry = math2dLoader.mainEntry;

/**
 * DX analysis configuration for @lenguados/math2d
 *
 * @remarks
 * Provides import paths for bundle-size measurement, assertion function
 * names for DCE verification, and the minimal single-type import for
 * tree-shaking analysis.
 */
export const math2dDxConfig: DxConfig = {
 root,
 mainEntry,
 devBundle: math2dLoader.entryPoints.development,
 prodBundle: math2dLoader.entryPoints.production,
 // budgetGzipBytes = zlib-gzip measurement (2026-07-04, esbuild-bundled
 // against the preserved-modules distribution) + ~10% headroom, rounded up
 // to 256 B. Tightened as the tree-shake distribution change's acceptance
 // artifact: single-type imports now shake to their true dependency graphs
 // ({ Vector2 } measured 6_572 vs 27_399 pre-rework). The utils/* budgets
 // are UNCHANGED (their full-surface closures legitimately span all core
 // types; fresh measurements still fit — budgets never loosen).
 imports: [
  {
   label: 'Full library',
   statement: `export * from '${mainEntry}';`,
   budgetGzipBytes: 32_768, // measured 29_589
  },
  {
   label: '{ Vector2 }',
   statement: `export { Vector2 } from '${mainEntry}';`,
   budgetGzipBytes: 7_424, // measured 6_572
  },
  {
   label: '{ Matrix3 }',
   statement: `export { Matrix3 } from '${mainEntry}';`,
   budgetGzipBytes: 18_176, // measured 16_297
  },
  {
   label: '{ Vector2, Rotation2 }',
   statement: `export { Vector2, Rotation2 } from '${mainEntry}';`,
   budgetGzipBytes: 18_432, // measured 16_698
  },
  {
   label: '{ Transform2 }',
   statement: `export { Transform2 } from '${mainEntry}';`,
   budgetGzipBytes: 26_880, // measured 24_271
  },
  {
   label: 'utils/parse',
   statement: `export * from '${join(root, 'lib/esm/utils/parse.production.js')}';`,
   budgetGzipBytes: 31_744, // measured 28_810
  },
  {
   label: 'utils/random',
   statement: `export * from '${join(root, 'lib/esm/utils/random.production.js')}';`,
   budgetGzipBytes: 31_232, // measured 28_411
  },
 ],
 assertionPatterns: [
  'assertFinite',
  'assertNonZero',
  'assertRange',
  'assertPositive',
  'assertNonNegative',
  'assertSafeInteger',
  'assertVector2',
  'assertMatrix2',
  'assertMatrix3',
  'assertRotation2',
  'assertRotation2Normalized',
  'assertComplex',
  'assertInterval',
  'assertTransform2',
  'assertVector2Like',
  'assertRotation2Like',
  'assertMatrix2Like',
  'assertMatrix3Like',
  'assertComplexLike',
  'assertIntervalLike',
  'assertTransform2Like',
 ],
 treeshakingMinimalImport: `export { Vector2 } from '${mainEntry}';`,
 correctnessOperations: [
  {
   name: 'Vector2.dot',
   run: (mod) => (mod['Vector2'] as any).dot({ x: 3.5, y: 7.2 }, { x: 1.1, y: 4.8 }),
  },
  {
   name: 'Vector2.cross',
   run: (mod) => (mod['Vector2'] as any).cross({ x: 3.5, y: 7.2 }, { x: 1.1, y: 4.8 }),
  },
  {
   name: 'Vector2.magnitude',
   run: (mod) => (mod['Vector2'] as any).magnitude({ x: 3.5, y: 7.2 }),
  },
  {
   name: 'Vector2.distance',
   run: (mod) => (mod['Vector2'] as any).distance({ x: 3.5, y: 7.2 }, { x: 1.1, y: 4.8 }),
  },
  {
   name: 'Matrix3.determinant',
   run: (mod) => {
    const M3 = mod['Matrix3'] as any;
    return M3.determinant(M3.fromRotation(0.7));
   },
  },
  {
   name: 'Rotation2.angle',
   run: (mod) => {
    const R2 = mod['Rotation2'] as any;
    return R2.angle(R2.fromAngle(0.7));
   },
  },
  {
   name: 'Complex.magnitude',
   run: (mod) => {
    const C = mod['Complex'] as any;
    return C.magnitude(C.fromValues(3.5, 7.2));
   },
  },
 ],
 // Vector2.fromAngle uses `if (__LENGUADOS_DEV__) assertFinite(...)`, eliminated by
 // library-side DCE in production. Vector2.normalize is NOT a valid probe: its
 // zero-length throw is a strict-tier runtime contract (throws in both builds).
 assertionProbe: {
  name: 'Vector2.fromAngle(NaN)',
  run: (mod) => (mod['Vector2'] as any).fromAngle(Number.NaN),
 },
};
