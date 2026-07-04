/**
 * @file scripts/bench.ts
 * @description Run performance benchmarks from the CLI
 *
 * Usage: npm run bench -- [--suite=name] [--tier=default|safe|unchecked]
 *        [--determinism=fdlibm|native] [--build=development|production]
 *        [--compare=path/to/baseline.json] [--package=math2d]
 */

import { ensureBuildArtifacts, parseCommonFlags, loadPackageLoader } from './run.ts';
import { discoverSuites, filterBenchmarksForCell } from '../src/harness/suite.ts';
import {
 cartesianProduct,
 filterCells,
 parseDimensionFilter,
 cellToLabel,
} from '../src/harness/dimensions.ts';
import { setupCell } from '../src/harness/cell-setup.ts';
import { runBenchmarkGroup } from '../src/harness/runner.ts';
import {
 generateJsonReport,
 printAsciiTable,
 persistReport,
 loadReport,
 compareReports,
 printComparisonTable,
 benchmarkResultToEntry,
} from '../src/harness/reporter.ts';
import type { GroupResult } from '../src/harness/runner.ts';
import type { ReportEntry } from '../src/harness/reporter.ts';

const args = process.argv.slice(2);
const { buildModes, packageName, help } = parseCommonFlags(args);

if (help) {
 console.log(`
  Usage: npm run bench -- [options]

  Options:
    --suite=<name>        Filter by suite name (regex)
    --tier=<tier>         Filter: default, safe, unchecked
    --determinism=<mode>  Filter: fdlibm, native
    --build=<mode>        Build modes: development, production (default: both)
    --compare=<path>      Compare against baseline JSON result file
    --package=<name>      Package to benchmark (default: math2d)
    -h, --help            Show this help
 `);
 process.exit(0);
}

const loader = await loadPackageLoader(packageName);
await ensureBuildArtifacts(buildModes, loader);

const suiteFilter = args.find((a) => a.startsWith('--suite='))?.split('=')[1];
const compareFile = args.find((a) => a.startsWith('--compare='))?.split('=')[1];
const dimFilter = parseDimensionFilter(args);

// Run-scope provenance: publishable ("full") ⇔ suite/tier/entity-unfiltered AND
// covering the canonical publication cell (production build, fdlibm determinism,
// node environment). A --build=production --determinism=fdlibm run therefore
// still classifies as full (it IS the canonical cell).
const scopeFilters: Record<string, string> = {};
if (suiteFilter) scopeFilters['suite'] = suiteFilter;
for (const [axis, value] of Object.entries(dimFilter)) {
 if (value !== undefined) scopeFilters[axis] = String(value);
}
const coversCanonicalCell =
 (dimFilter.buildMode === undefined || dimFilter.buildMode === 'production') &&
 (dimFilter.determinism === undefined || dimFilter.determinism === 'fdlibm') &&
 (dimFilter.environment === undefined || dimFilter.environment === 'node');
const runScope =
 !suiteFilter &&
 dimFilter.tier === undefined &&
 dimFilter.entity === undefined &&
 coversCanonicalCell
  ? { full: true as const }
  : { full: false as const, filters: scopeFilters };

console.log('\n  Discovering benchmark suites...');
const suites = await discoverSuites(packageName, suiteFilter ? new RegExp(suiteFilter) : undefined);
console.log(`  Found ${suites.length} suites.\n`);

const allEntries: ReportEntry[] = [];
const allGroups: GroupResult[] = [];

let totalCells = 0;
let completedCells = 0;

for (const suite of suites) {
 const cells = filterCells(cartesianProduct(suite.dimensions), dimFilter);
 totalCells += cells.length;
}

for (const suite of suites) {
 const cells = filterCells(cartesianProduct(suite.dimensions), dimFilter);
 console.log(`\n  Suite: ${suite.name} (${cells.length} cells)`);

 for (const cell of cells) {
  const ctx = await setupCell(cell, loader);
  try {
   // Clear accumulated benchmarks from previous cell to prevent
   // duplication — setup() pushes to the shared entries array.
   suite.benchmarks.length = 0;
   if (suite.setup) await suite.setup(ctx.module);

   // Filter benchmarks to only those relevant to this cell's tier/determinism.
   // Tier-tagged benchmarks only run in their matching tier cell.
   // Tier-agnostic benchmarks (no tag) run in every cell.
   const cellBenchmarks = filterBenchmarksForCell(suite.benchmarks, cell);

   if (cellBenchmarks.length === 0) {
    completedCells++;
    continue;
   }

   const cellLabel = cellToLabel(cell);
   process.stdout.write(
    `    [${completedCells + 1}/${totalCells}] ${cellLabel} (${cellBenchmarks.length} benchmarks)...`,
   );
   const cellStart = Date.now();

   const result = await runBenchmarkGroup(
    `${suite.name} ${cellLabel}`,
    cellBenchmarks.map((b) => ({
     name: b.name,
     fn: b.fn,
     ...(suite.gcMode !== undefined ? { gcMode: suite.gcMode } : {}),
    })),
    suite.gcMode ?? 'once',
   );

   const cellElapsed = ((Date.now() - cellStart) / 1000).toFixed(1);
   console.log(` done (${cellElapsed}s)`);

   allGroups.push(result);

   for (const bm of result.benchmarks) {
    allEntries.push(benchmarkResultToEntry(bm, cell as unknown as Record<string, string>, false));
   }

   if (suite.teardown) await suite.teardown();
  } catch (err: unknown) {
   const msg = err instanceof Error ? err.message : String(err);
   console.log(` FAILED`);
   console.error(`    Error: ${msg}`);
  } finally {
   completedCells++;
   ctx.teardown();
  }
 }
}

// Print ASCII table
console.log('\n' + printAsciiTable(allEntries) + '\n');

// Generate and persist report (package-namespaced, with run-scope provenance)
const report = generateJsonReport(allGroups, undefined, false, packageName, runScope);
const filepath = persistReport(report);
console.log(`  Results saved to: ${filepath}`);

// Compare against baseline if requested
if (compareFile) {
 console.log(`\n  Comparing against baseline: ${compareFile}`);
 const baseline = await loadReport(compareFile);
 const comparisons = compareReports(baseline, report);
 console.log('\n' + printComparisonTable(comparisons) + '\n');
}
