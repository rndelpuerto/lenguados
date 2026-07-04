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
 *  root: '/path/to/packages/mypkg',
 *  mainEntry: '/path/to/packages/mypkg/main.mjs',
 *  devBundle: '/path/to/packages/mypkg/lib/esm/mypkg.development.js',
 *  prodBundle: '/path/to/packages/mypkg/lib/esm/mypkg.production.js',
 *  imports: [
 *   { label: 'Full library', statement: "export * from './main.mjs'" },
 *  ],
 *  assertionPatterns: ['assertFinite', 'assertNormalized'],
 *  treeshakingMinimalImport: "export { MyType } from './main.mjs'",
 *  correctnessOperations: [
 *   { name: 'MyType.dot', run: (mod) => (mod['MyType'] as any).dot({ x: 1, y: 2 }, { x: 3, y: 4 }) },
 *  ],
 *  assertionProbe: {
 *   name: 'MyType.fromAngle(NaN)',
 *   run: (mod) => (mod['MyType'] as any).fromAngle(Number.NaN),
 *  },
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
  * (passed to esbuild as virtual module content). An entry MAY declare
  * `budgetGzipBytes`: the maximum allowed gzip size of its bundled output,
  * enforced by the size gate (`scripts/size.ts`). Budgets are ABSOLUTE
  * bytes set from measured reality plus ~10% headroom — they freeze the
  * accepted current state so regressions fail; ratcheting a budget down
  * (or up) is a deliberate act done in the same change as an intentional
  * size impact, with the delta justified. Entries without a budget are
  * measured but not gated.
  */
 imports: Array<{ label: string; statement: string; budgetGzipBytes?: number }>;

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

 /**
  * Representative operations compared bit-for-bit across dev and prod builds
  *
  * @remarks
  * Each `run` receives the loaded module namespace (called once with the
  * development build and once with the production build) and returns a
  * number; results must match bit-for-bit. The operation list is package
  * knowledge — shared dx code never names package types.
  */
 correctnessOperations: Array<{
  name: string;
  run: (mod: Record<string, unknown>) => number;
 }>;

 /**
  * Assertion-guarded operation expected to throw in dev and pass in prod
  *
  * @remarks
  * The probe MUST target a dev-only assertion (library-side DCE): the
  * development build throws, the production build silently propagates per
  * IEEE 754. An operation that throws in both modes by design (a strict-tier
  * runtime contract) is not a valid probe.
  */
 assertionProbe: {
  name: string;
  run: (mod: Record<string, unknown>) => void;
 };
}
