/**
 * @file scripts/compare.ts
 * @description Run cross-library performance comparison from the CLI
 *
 * Resolves the target package's comparison configuration by convention
 * (`src/packages/{name}/comparison-config.ts`); a package without one fails
 * loudly naming the missing capability. For math2d the configuration compares
 * against gl-matrix under the most representative production scenario — see
 * `src/packages/math2d/comparison-config.ts` for the conditions rationale.
 *
 * Usage: npm run compare -- [--operations=vectorAdd,vectorNormalize] [--package=math2d]
 */

import { existsSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { ensureBuildArtifacts, loadPackageLoader, parseCommonFlags } from './run.ts';
import { runComparison } from '../src/harness/comparison-runner.ts';
import {
 printComparisonAscii,
 generateComparisonJson,
} from '../src/harness/comparison-reporter.ts';
import { createLatestPointer } from '../src/harness/reporter.ts';

import type { ComparisonConfig } from '../src/harness/comparison-types.ts';

const args = process.argv.slice(2);
const { packageName } = parseCommonFlags(args);
const opsArg = args.find((a) => a.startsWith('--operations='))?.split('=')[1];
const operationFilter = opsArg ? new Set(opsArg.split(',')) : undefined;

const loader = await loadPackageLoader(packageName);

// Resolve the package's comparison config by convention. The existsSync
// precheck makes "package lacks the comparison capability" unambiguous; an
// import error from an EXISTING config is re-thrown verbatim.
const comparisonConfigPath = fileURLToPath(
 new URL(`../src/packages/${packageName}/comparison-config.ts`, import.meta.url),
);
if (!existsSync(comparisonConfigPath)) {
 console.error(
  `\n  ERROR: package '${packageName}' lacks the cross-library comparison capability (no src/packages/${packageName}/comparison-config.ts).\n`,
 );
 process.exit(1);
}
const comparisonModule = await import(`../src/packages/${packageName}/comparison-config.ts`);
const comparisonConfig = Object.values(comparisonModule).find(
 (v): v is ComparisonConfig =>
  typeof v === 'object' && v !== null && 'buildAdapters' in v && 'referenceLibrary' in v,
);
if (!comparisonConfig) {
 console.error(
  `\n  ERROR: src/packages/${packageName}/comparison-config.ts exports no ComparisonConfig-shaped object.\n`,
 );
 process.exit(1);
}

await ensureBuildArtifacts(['production'], loader);

console.log('\n  Cross-Library Comparison\n  =======================\n');

const adapters = await comparisonConfig.buildAdapters();
for (const line of comparisonConfig.bannerLines(adapters)) console.log(line);
console.log(
 `  Operations: ${operationFilter ? [...operationFilter].join(', ') : 'all standard vocabulary'}\n`,
);

const result = await runComparison(
 adapters,
 comparisonConfig.referenceLibrary,
 comparisonConfig.operationNames,
 operationFilter,
);

console.log(printComparisonAscii(result));

// Persist JSON report (package-namespaced, tool-root-anchored)
const RESULTS_DIR = fileURLToPath(new URL(`../results/${packageName}/`, import.meta.url));
mkdirSync(RESULTS_DIR, { recursive: true });
const json = generateComparisonJson(
 result,
 comparisonConfig.allOperations,
 comparisonConfig.conditions,
);
const filename = `comparison-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
const filepath = join(RESULTS_DIR, filename);
const latestPath = join(RESULTS_DIR, 'comparison-latest.json');
writeFileSync(filepath, JSON.stringify(json, null, 2));
createLatestPointer(filepath, latestPath, filename);
console.log(`\n  Results saved to: ${filepath}\n`);
