/**
 * CLI entry point for cross-library comparison.
 *
 * Usage: npm run compare -- [--libraries=math2d,gl-matrix]
 *        [--operations=vectorAdd,vectorNormalize]
 *        [--math2d-tier=default|unchecked]
 */

import { ensureBuildArtifacts } from './run.ts';
import { createMath2dAdapter } from '../src/adapters/math2d-adapter.ts';
import { createGlMatrixAdapter } from '../src/adapters/gl-matrix-adapter.ts';
import { runComparison } from '../src/harness/comparison-runner.ts';
import {
 printComparisonAscii,
 generateComparisonJson,
} from '../src/harness/comparison-reporter.ts';
import { OPERATION_NAMES } from '../src/harness/operation-vocabulary.ts';
import { writeFileSync, mkdirSync } from 'node:fs';

const args = process.argv.slice(2);
const tierArg = args.find((a) => a.startsWith('--math2d-tier='))?.split('=')[1] as 'default' | 'unchecked' | undefined;
const opsArg = args.find((a) => a.startsWith('--operations='))?.split('=')[1];
const operationFilter = opsArg ? new Set(opsArg.split(',')) : undefined;

await ensureBuildArtifacts(['production']);

console.log('\n  Cross-Library Comparison\n  =======================\n');

// Create adapters
const math2dAdapter = await createMath2dAdapter({
 tier: tierArg ?? 'default',
 buildMode: 'production',
});
const glMatrixAdapter = createGlMatrixAdapter();

console.log(`  math2d: v${math2dAdapter.version} (tier: ${tierArg ?? 'default'})`);
console.log(`  gl-matrix: v${glMatrixAdapter.version}`);
console.log(`  Operations: ${operationFilter ? [...operationFilter].join(', ') : 'all standard vocabulary'}\n`);

// Run comparison
const result = await runComparison(
 [math2dAdapter, glMatrixAdapter],
 'gl-matrix',
 operationFilter,
);

// Print ASCII table
console.log(printComparisonAscii(result));

// Save JSON
mkdirSync('results', { recursive: true });
const json = generateComparisonJson(result);
const filepath = `results/comparison-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
writeFileSync(filepath, JSON.stringify(json, null, 2));
console.log(`\n  Results saved to: ${filepath}\n`);
