/**
 * @file scripts/compare.ts
 * @description Run cross-library performance comparison from the CLI
 *
 * Compare math2d vs gl-matrix under the most representative production scenario:
 * - Production build (assertions stripped by bundler DCE)
 * - Unchecked tier (equivalent to default after DCE)
 * - Native Math.* (same as gl-matrix — apples-to-apples)
 * - Static methods with out parameter (zero allocation for both libs)
 *
 * The cost of fdlibm determinism is measured separately in the internal
 * performance benchmarks (see the performance/auxiliary page), not in
 * cross-library comparison, because gl-matrix has no determinism toggle.
 *
 * Usage: npm run compare -- [--operations=vectorAdd,vectorNormalize]
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

import { ensureBuildArtifacts, loadPackageLoader } from './run.ts';
import { createMath2dAdapter } from '../src/packages/math2d/adapters/math2d-adapter.ts';
import { createGlMatrixAdapter } from '../src/packages/math2d/adapters/gl-matrix-adapter.ts';
import { runComparison } from '../src/harness/comparison-runner.ts';
import {
 printComparisonAscii,
 generateComparisonJson,
} from '../src/harness/comparison-reporter.ts';
import type { ComparisonConditions } from '../src/harness/comparison-reporter.ts';
import { ALL_OPERATIONS, OPERATION_NAMES } from '../src/packages/math2d/vocabulary.ts';
import { createLatestPointer } from '../src/harness/reporter.ts';

const args = process.argv.slice(2);
const opsArg = args.find((a) => a.startsWith('--operations='))?.split('=')[1];
const operationFilter = opsArg ? new Set(opsArg.split(',')) : undefined;

const loader = await loadPackageLoader('math2d');
await ensureBuildArtifacts(['production'], loader);

console.log('\n  Cross-Library Comparison\n  =======================\n');

const math2dAdapter = await createMath2dAdapter({
 tier: 'unchecked',
 buildMode: 'production',
 nativeMath: true,
});
const glMatrixAdapter = createGlMatrixAdapter();

console.log(`  math2d: v${math2dAdapter.version}`);
console.log(`  gl-matrix: v${glMatrixAdapter.version}`);
console.log(`  Build: production (assertions stripped by bundler DCE)`);
console.log(`  Tier: unchecked (equivalent to default after DCE)`);
console.log(`  Math: native Math.* (apples-to-apples with gl-matrix)`);
console.log(`  Methods: static with out parameter (zero allocation)`);
console.log(
 `  Operations: ${operationFilter ? [...operationFilter].join(', ') : 'all standard vocabulary'}\n`,
);

const result = await runComparison(
 [math2dAdapter, glMatrixAdapter],
 'gl-matrix',
 OPERATION_NAMES,
 operationFilter,
);

console.log(printComparisonAscii(result));

const conditions: ComparisonConditions = {
 buildMode: 'production',
 tier: 'unchecked (simulates bundler DCE of assertions)',
 determinism: 'native (apples-to-apples — both libs use platform Math.*)',
 methodStyle: 'static with out parameter (zero allocation)',
};

mkdirSync('results', { recursive: true });
const json = generateComparisonJson(result, ALL_OPERATIONS, conditions);
const filename = `comparison-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
const filepath = join('results', filename);
const latestPath = join('results', 'comparison-latest.json');
writeFileSync(filepath, JSON.stringify(json, null, 2));
createLatestPointer(filepath, latestPath, filename);
console.log(`\n  Results saved to: ${filepath}\n`);
