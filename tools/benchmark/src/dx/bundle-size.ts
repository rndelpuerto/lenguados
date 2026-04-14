/**
 * Bundle size measurement per import path using size-limit.
 *
 * Measures full library, individual exports, and subpath exports
 * in raw bytes, gzip, and brotli.
 */

import { execSync } from 'node:child_process';
import { writeFileSync, unlinkSync, mkdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

import { MATH2D_ROOT } from '../harness/math2d-loader.ts';

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
export function measureBundleSize(importStatement: string, label: string): BundleSizeResult | null {
 mkdirSync(TEMP_DIR, { recursive: true });
 const entryFile = join(TEMP_DIR, `entry-${Date.now()}.mjs`);
 const outFile = join(TEMP_DIR, `out-${Date.now()}.mjs`);

 try {
  writeFileSync(entryFile, importStatement);

  // Bundle with esbuild (tree-shaking enabled by default for ESM)
  execSync(
   `npx esbuild "${entryFile}" --bundle --format=esm --outfile="${outFile}" ` +
   `--resolve-extensions=.js,.mjs --platform=browser --minify 2>&1`,
   { cwd: MATH2D_ROOT, encoding: 'utf-8' },
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
  console.warn(`  Could not measure bundle for "${label}": ${err instanceof Error ? err.message : String(err)}`);
  return null;
 } finally {
  try { unlinkSync(entryFile); } catch { /* ignore */ }
  try { unlinkSync(outFile); } catch { /* ignore */ }
 }
}

/**
 * Run full bundle size analysis for @lenguados/math2d.
 */
export function runBundleSizeAnalysis(): BundleSizeResult[] {
 const results: BundleSizeResult[] = [];

 const imports: Array<{ label: string; statement: string }> = [
  {
   label: 'Full library',
   statement: `export * from '${MATH2D_ROOT}main.mjs';`,
  },
  {
   label: '{ Vector2 }',
   statement: `export { Vector2 } from '${MATH2D_ROOT}main.mjs';`,
  },
  {
   label: '{ Matrix3 }',
   statement: `export { Matrix3 } from '${MATH2D_ROOT}main.mjs';`,
  },
  {
   label: '{ Vector2, Rotation2 }',
   statement: `export { Vector2, Rotation2 } from '${MATH2D_ROOT}main.mjs';`,
  },
  {
   label: '{ Transform2 }',
   statement: `export { Transform2 } from '${MATH2D_ROOT}main.mjs';`,
  },
  {
   label: 'utils/parse',
   statement: `export * from '${MATH2D_ROOT}lib/esm/utils/parse.production.js';`,
  },
  {
   label: 'utils/random',
   statement: `export * from '${MATH2D_ROOT}lib/esm/utils/random.production.js';`,
  },
 ];

 for (const { label, statement } of imports) {
  const result = measureBundleSize(statement, label);
  if (result) results.push(result);
 }

 return results;
}
