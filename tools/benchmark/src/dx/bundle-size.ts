/**
 * Bundle size measurement per import path using esbuild.
 *
 * Measures raw and gzip bytes for each configured import statement.
 * Receives a DxConfig — no hardcoded package paths.
 */

import { execSync } from 'node:child_process';
import { writeFileSync, unlinkSync, mkdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

import type { DxConfig } from '../harness/dx-types.ts';

export interface BundleSizeResult {
 importPath: string;
 importStatement: string;
 rawBytes: number;
 gzipBytes: number;
}

const TEMP_DIR = new URL('../../.tmp/', import.meta.url).pathname;

/**
 * Measure bundle size for a specific import statement.
 *
 * Creates a temporary entry file with the import, runs esbuild to
 * bundle it (tree-shaking enabled), and measures the output size.
 */
export function measureBundleSize(
 importStatement: string,
 label: string,
 cwd: string,
): BundleSizeResult | null {
 mkdirSync(TEMP_DIR, { recursive: true });
 const entryFile = join(TEMP_DIR, `entry-${Date.now()}.mjs`);
 const outFile = join(TEMP_DIR, `out-${Date.now()}.mjs`);

 try {
  writeFileSync(entryFile, importStatement);

  // Bundle with esbuild (tree-shaking enabled by default for ESM)
  execSync(
   `npx esbuild "${entryFile}" --bundle --format=esm --outfile="${outFile}" ` +
    `--resolve-extensions=.js,.mjs --platform=browser --minify 2>&1`,
   { cwd, encoding: 'utf-8' },
  );

  const rawBytes = statSync(outFile).size;

  // Measure gzip size
  let gzipBytes = rawBytes;
  try {
   const gzipOutput = execSync(`gzip -c "${outFile}" | wc -c`, { encoding: 'utf-8' });
   gzipBytes = parseInt(gzipOutput.trim(), 10);
  } catch {
   // gzip not available, use raw as fallback
  }

  return { importPath: label, importStatement, rawBytes, gzipBytes };
 } catch (err: unknown) {
  console.warn(
   `  Could not measure bundle for "${label}": ${err instanceof Error ? err.message : String(err)}`,
  );
  return null;
 } finally {
  try {
   unlinkSync(entryFile);
  } catch {
   /* ignore */
  }
  try {
   unlinkSync(outFile);
  } catch {
   /* ignore */
  }
 }
}

/**
 * Run full bundle size analysis using the provided DxConfig.
 */
export function runBundleSizeAnalysis(config: DxConfig): BundleSizeResult[] {
 const results: BundleSizeResult[] = [];

 for (const { label, statement } of config.imports) {
  const result = measureBundleSize(statement, label, config.root);
  if (result) results.push(result);
 }

 return results;
}
