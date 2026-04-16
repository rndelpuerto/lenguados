/**
 * DX analysis configuration for @lenguados/math2d.
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

export const math2dDxConfig: DxConfig = {
 root,
 mainEntry,
 devBundle: math2dLoader.entryPoints.development,
 prodBundle: math2dLoader.entryPoints.production,
 imports: [
  { label: 'Full library', statement: `export * from '${mainEntry}';` },
  { label: '{ Vector2 }', statement: `export { Vector2 } from '${mainEntry}';` },
  { label: '{ Matrix3 }', statement: `export { Matrix3 } from '${mainEntry}';` },
  {
   label: '{ Vector2, Rotation2 }',
   statement: `export { Vector2, Rotation2 } from '${mainEntry}';`,
  },
  { label: '{ Transform2 }', statement: `export { Transform2 } from '${mainEntry}';` },
  {
   label: 'utils/parse',
   statement: `export * from '${join(root, 'lib/esm/utils/parse.production.js')}';`,
  },
  {
   label: 'utils/random',
   statement: `export * from '${join(root, 'lib/esm/utils/random.production.js')}';`,
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
};
