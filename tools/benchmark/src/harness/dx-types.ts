/**
 * @file harness/dx-types.ts
 * @description Define the configuration interface for DX (Developer Experience) analysis
 *
 * Each benchmarked package provides a DxConfig that specifies paths
 * and patterns for bundle size, tree-shaking, assertion elimination,
 * and build comparison analysis. DX functions receive this config
 * instead of hardcoding package-specific paths.
 */

/**
 * Specify paths and patterns for DX (Developer Experience) analysis
 *
 * @remarks
 * Each benchmarked package provides a DxConfig that drives bundle size,
 * tree-shaking, assertion elimination, and build comparison analysis.
 * DX functions receive this config instead of hardcoding package-specific paths.
 *
 * @example
 * ```typescript
 * const config: DxConfig = {
 *  root: '/path/to/packages/math2d',
 *  mainEntry: '/path/to/packages/math2d/main.mjs',
 *  devBundle: '/path/to/packages/math2d/lib/esm/math2d.development.js',
 *  prodBundle: '/path/to/packages/math2d/lib/esm/math2d.production.js',
 *  imports: [
 *   { label: 'Full library', statement: "export * from './main.mjs'" },
 *  ],
 *  assertionPatterns: ['assertFinite', 'assertNormalized'],
 *  treeshakingMinimalImport: "export { Vector2 } from './main.mjs'",
 * };
 * ```
 */
export interface DxConfig {
 /** Absolute path to the package root directory */
 root: string;

 /** Absolute path to the main ESM entry (e.g., `{root}/main.mjs`) */
 mainEntry: string;

 /** Absolute path to the development ESM bundle */
 devBundle: string;

 /** Absolute path to the production ESM bundle */
 prodBundle: string;

 /**
  * Import statements to measure for bundle size analysis
  *
  * @remarks
  * Each entry is a label (for display) and a full import statement
  * (passed to esbuild as virtual module content).
  */
 imports: Array<{ label: string; statement: string }>;

 /**
  * Assertion function names to check in the production bundle
  *
  * @remarks
  * If any of these appear in the production bundle, assertion
  * elimination is considered failed.
  */
 assertionPatterns: string[];

 /**
  * Import statement for the smallest useful single-type import
  *
  * @remarks
  * Used as the "minimal" case for tree-shaking measurement
  * (e.g., `export { Vector2 } from '...'`).
  */
 treeshakingMinimalImport: string;
}
