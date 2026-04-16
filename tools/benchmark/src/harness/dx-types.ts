/**
 * Configuration interface for DX (Developer Experience) analysis.
 *
 * Each benchmarked package provides a DxConfig that specifies paths
 * and patterns for bundle size, tree-shaking, assertion elimination,
 * and build comparison analysis. DX functions receive this config
 * instead of hardcoding package-specific paths.
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
  * Import statements to measure for bundle size analysis.
  * Each entry is a label (for display) and a full import statement
  * (passed to esbuild as virtual module content).
  */
 imports: Array<{ label: string; statement: string }>;

 /**
  * Assertion function names to check in the production bundle.
  * If any of these appear in the production bundle, assertion
  * elimination is considered failed.
  */
 assertionPatterns: string[];

 /**
  * Import statement for the smallest useful single-type import.
  * Used as the "minimal" case for tree-shaking measurement
  * (e.g., `export { Vector2 } from '...'`).
  */
 treeshakingMinimalImport: string;
}
