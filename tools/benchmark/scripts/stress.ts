/**
 * @file scripts/stress.ts
 * @description Run numerical stress tests from the CLI
 *
 * Usage: npm run stress -- [--suite=ulp|ieee754|cancellation|singular|overflow|identity|allocation]
 *        [--samples=N] [--package=math2d]
 *
 * Requires --expose-gc for allocation tests (auto-invoked via npm script).
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { ensureBuildArtifacts, loadPackageLoader } from './run.ts';
import {
 collectMetadata,
 createDiagnosticReport,
 createLatestPointer,
 formatDiagnosticSummary,
} from '../src/harness/reporter.ts';
import { discoverStressTests } from '../src/harness/stress-discovery.ts';

import type { StressReport } from '../src/harness/result-types.ts';

const args = process.argv.slice(2);
const suiteArg = args.find((a) => a.startsWith('--suite='))?.split('=')[1];
const samplesArg = args.find((a) => a.startsWith('--samples='))?.split('=')[1];
const samples = samplesArg ? parseInt(samplesArg, 10) : 1000;
const packageName = args.find((a) => a.startsWith('--package='))?.split('=')[1] ?? 'math2d';

const loader = await loadPackageLoader(packageName);
await ensureBuildArtifacts(['development'], loader);

const math2d = await loader.load('development');
const config = loader.getConfig?.(math2d);
if (config && 'useNativeMath' in config) {
 config['useNativeMath'] = false;
}

const diagnostics = createDiagnosticReport();
const suiteFilter = suiteArg ? new Set(suiteArg.split(',')) : undefined;

// Discover stress tests via glob
const allTests = await discoverStressTests(packageName);
const tests = suiteFilter ? allTests.filter((t) => suiteFilter.has(t.name)) : allTests;

console.log(
 `\n  Running stress tests: ${tests.map((t) => t.name).join(', ')} (${samples} samples)\n`,
);

/* eslint-disable @typescript-eslint/no-explicit-any */
const collected: Record<string, any[]> = {};

let testIndex = 0;
for (const test of tests) {
 testIndex++;
 console.log(`  [${testIndex}/${tests.length}] ${test.name}...`);

 const output = await test.run(math2d, { samples }, diagnostics);
 collected[test.name] = output.results as any[];
 output.log();
}

console.log(`\n  Diagnostics: ${formatDiagnosticSummary(diagnostics)}\n`);

// Persist JSON report
const RESULTS_DIR = new URL('../results/', import.meta.url).pathname;
mkdirSync(RESULTS_DIR, { recursive: true });

const report: StressReport = {
 metadata: collectMetadata(),
 samples,
 suites: collected,
 diagnostics,
};

const filename = `stress-${report.metadata.timestamp.replace(/[:.]/g, '-')}.json`;
const filepath = join(RESULTS_DIR, filename);
const latestPath = join(RESULTS_DIR, 'stress-latest.json');
writeFileSync(filepath, JSON.stringify(report, null, 2));
createLatestPointer(filepath, latestPath, filename);
console.log(`  Results saved to: ${filepath}\n`);
