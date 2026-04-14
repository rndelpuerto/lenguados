/**
 * Orchestrator that runs all test categories and produces a combined report.
 *
 * Executes: benchmarks → stress tests → DX analysis → cross-library comparison
 * in sequence, producing a combined summary.
 */

import { execSync } from 'node:child_process';
import { ensureBuildArtifacts } from './run.ts';

await ensureBuildArtifacts(['development', 'production']);

const tsx = './node_modules/.bin/tsx';
const nodeGc = `node --expose-gc ${tsx}`;

console.log('\n  ================================================================');
console.log('  Benchmark Laboratory — Full Run');
console.log('  ================================================================\n');

const startTime = Date.now();

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
run('Performance Benchmarks', `${tsx} scripts/bench.ts --build=production --determinism=fdlibm`);

// 2. Stress Tests
run('Stress Tests', `${nodeGc} scripts/stress.ts --samples=500`);

// 3. DX Analysis
run('DX Analysis', `${tsx} scripts/dx.ts`);

// 4. Cross-Library Comparison
run('Cross-Library Comparison', `${tsx} scripts/compare.ts`);

const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
console.log(`\n  ================================================================`);
console.log(`  Full run completed in ${elapsed}s`);
console.log(`  ================================================================\n`);
