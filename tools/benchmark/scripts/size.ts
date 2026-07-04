/**
 * @file scripts/size.ts
 * @description Enforce per-entry bundle-size budgets from the CLI
 *
 * Bundles ONLY the budgeted import entries of the resolved package (same
 * esbuild + node:zlib instrument as the dx analysis and the published docs
 * numbers — one source of truth), compares gzip bytes against each entry's
 * `budgetGzipBytes`, and exits non-zero on any breach. An unmeasurable
 * budgeted entry (bundling failure) is a HARD failure, never a silent skip.
 *
 * Usage: tsx scripts/size.ts [--package=name] [--all]
 *   --package=name  Gate one package (default math2d); a package without
 *                   declared budgets fails loudly naming the capability.
 *   --all           Sweep every registered package; packages without
 *                   declared budgets are skipped with a notice.
 */

import { existsSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { ensureBuildArtifacts, loadPackageLoader, parseCommonFlags } from './run.ts';
import { measureBundleSize } from '../src/dx/bundle-size.ts';
import { gateBudgetedEntries, hasDeclaredBudgets } from '../src/dx/budget-gate.ts';

import type { DxConfig } from '../src/harness/dx-types.ts';

const args = process.argv.slice(2);
const { packageName } = parseCommonFlags(args);
const sweepAll = args.includes('--all');

const packagesDir = fileURLToPath(new URL('../src/packages/', import.meta.url));

/**
 * Resolve a package's DxConfig by convention, or null when it declares none
 *
 * @param name - Package name under src/packages/
 * @returns The duck-typed DxConfig, or null when no dx-config.ts exists
 */
async function resolveDxConfig(name: string): Promise<DxConfig | null> {
 const configPath = `${packagesDir}${name}/dx-config.ts`;
 if (!existsSync(configPath)) return null;
 const mod = await import(`../src/packages/${name}/dx-config.ts`);
 const config = Object.values(mod).find(
  (v): v is DxConfig =>
   typeof v === 'object' && v !== null && 'root' in v && 'imports' in v && 'assertionProbe' in v,
 );
 return config ?? null;
}

/**
 * Gate one package's budgeted entries and print the per-entry table
 *
 * @param name - Package name
 * @param config - The package's DxConfig
 * @returns Number of breaches (0 = all budgets honored)
 */
async function gatePackage(name: string, config: DxConfig): Promise<number> {
 const loader = await loadPackageLoader(name);
 await ensureBuildArtifacts(['production'], loader);

 console.log(`\n  Bundle-size budgets — ${name}\n`);
 console.log(
  `  ${'Entry'.padEnd(26)}${'Measured'.padStart(10)}${'Budget'.padStart(10)}${'Headroom'.padStart(10)}`,
 );

 const { rows, breaches } = gateBudgetedEntries(config.imports, (statement, label) =>
  measureBundleSize(statement, label, config.root),
 );

 for (const row of rows) {
  if (row.measuredGzipBytes === null) {
   console.error(`  ${row.label.padEnd(26)}${'UNMEASURABLE'.padStart(10)} — bundling failed`);
   continue;
  }
  const headroomPct = (
   ((row.budgetGzipBytes - row.measuredGzipBytes) / row.budgetGzipBytes) *
   100
  ).toFixed(1);
  const line = `  ${row.label.padEnd(26)}${`${row.measuredGzipBytes} B`.padStart(10)}${`${row.budgetGzipBytes} B`.padStart(10)}${`${headroomPct}%`.padStart(10)}`;
  if (row.withinBudget) {
   console.log(line);
  } else {
   console.error(`${line}  ← OVER BUDGET`);
  }
 }

 return breaches;
}

let totalBreaches = 0;

if (sweepAll) {
 const names = readdirSync(packagesDir).filter((entry) =>
  existsSync(`${packagesDir}${entry}/loader.ts`),
 );
 for (const name of names) {
  const config = await resolveDxConfig(name);
  if (!hasDeclaredBudgets(config)) {
   console.log(`  [${name}] no declared budgets — skipped`);
   continue;
  }
  totalBreaches += await gatePackage(name, config!);
 }
} else {
 const config = await resolveDxConfig(packageName);
 if (!hasDeclaredBudgets(config)) {
  console.error(
   `\n  ERROR: package '${packageName}' declares no bundle-size budgets (no budgetGzipBytes entries in src/packages/${packageName}/dx-config.ts).\n`,
  );
  process.exit(1);
 }
 totalBreaches = await gatePackage(packageName, config!);
}

console.log('');
if (totalBreaches > 0) {
 console.error(
  `  FAILED: ${totalBreaches} entr${totalBreaches === 1 ? 'y' : 'ies'} over budget (or unmeasurable).`,
 );
 console.error(
  '  If the size increase is INTENTIONAL, rebaseline deliberately: update budgetGzipBytes in the package dx-config within this same change, justifying the delta.',
 );
 process.exit(1);
}
console.log('  All bundle-size budgets honored.\n');
