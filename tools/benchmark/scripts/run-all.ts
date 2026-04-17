/**
 * @file scripts/run-all.ts
 * @description Orchestrate a full benchmark laboratory run
 *
 * Execute benchmarks → stress tests → DX analysis → cross-library comparison
 * in sequence, producing a combined summary.
 */

import { execSync } from 'node:child_process';
import { ensureBuildArtifacts, loadPackageLoader } from './run.ts';

// Propagate --package flag if provided
const pkgArg = process.argv.find((a) => a.startsWith('--package='));
const pkgFlag = pkgArg ? ` ${pkgArg}` : '';
const packageName = pkgArg?.split('=')[1] ?? 'math2d';

const loader = await loadPackageLoader(packageName);
await ensureBuildArtifacts(['development', 'production'], loader);

const tsx = './node_modules/.bin/tsx';
const nodeGc = `node --expose-gc ${tsx}`;

console.log('\n  ================================================================');
console.log('  Benchmark Laboratory — Full Run');
console.log('  ================================================================\n');

const startTime = Date.now();

/**
 * Execute a labeled subprocess and log its output
 *
 * @param label - Display label for the test category
 * @param command - Shell command to execute
 */
function run(label: string, command: string): void {
 console.log(`\n  --- ${label} ---\n`);
 try {
  execSync(command, { stdio: 'inherit', cwd: process.cwd() });
 } catch (err: unknown) {
  console.error(`  FAILED: ${label}`);
  console.error(err instanceof Error ? err.message : String(err));
 }
}

// 1. Performance Benchmarks (quick: production + fdlibm only)
run(
 'Performance Benchmarks',
 `${tsx} scripts/bench.ts --build=production --determinism=fdlibm${pkgFlag}`,
);

// 2. Stress Tests
run('Stress Tests', `${nodeGc} scripts/stress.ts --samples=500${pkgFlag}`);

// 3. DX Analysis
run('DX Analysis', `${tsx} scripts/dx.ts${pkgFlag}`);

// 4. Cross-Library Comparison
run('Cross-Library Comparison', `${tsx} scripts/compare.ts${pkgFlag}`);

const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
console.log(`\n  ================================================================`);
console.log(`  Full run completed in ${elapsed}s`);
console.log(`  ================================================================\n`);
