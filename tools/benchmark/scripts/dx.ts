/**
 * @file scripts/dx.ts
 * @description Run DX (Developer Experience) analysis from the CLI
 *
 * Measure bundle size, tree-shaking, build correctness,
 * assertion elimination, and dev vs prod size comparison.
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { ensureBuildArtifacts, loadPackageLoader } from './run.ts';
import { collectMetadata, createLatestPointer } from '../src/harness/reporter.ts';
import { runBundleSizeAnalysis } from '../src/dx/bundle-size.ts';
import { verifyTreeShaking } from '../src/dx/tree-shaking.ts';
import { verifyBuildCorrectness } from '../src/dx/build-correctness.ts';
import { verifyAssertionElimination } from '../src/dx/assertion-elimination.ts';
import { compareBuildSizes, formatBuildComparison } from '../src/dx/build-comparison.ts';
import { math2dDxConfig as dxConfig } from '../src/packages/math2d/dx-config.ts';

import type { DxReport } from '../src/harness/result-types.ts';

const loader = await loadPackageLoader('math2d');
await ensureBuildArtifacts(['development', 'production'], loader);

console.log('\n  DX Analysis\n  ===========\n');

// 1. Bundle Size
console.log('  1. Bundle Size per Import Path');
const sizeResults = runBundleSizeAnalysis(dxConfig);
for (const r of sizeResults) {
 console.log(
  `    ${r.importPath}: ${(r.rawBytes / 1024).toFixed(1)} KB raw, ${(r.gzipBytes / 1024).toFixed(1)} KB gzip`,
 );
}

// 2. Tree-Shaking
console.log('\n  2. Tree-Shaking Effectiveness');
const treeShaking = verifyTreeShaking(dxConfig);
console.log(`    Full library: ${(treeShaking.fullSize / 1024).toFixed(1)} KB`);
console.log(`    Vector2 only: ${(treeShaking.minimalSize / 1024).toFixed(1)} KB`);
console.log(`    Reduction: ${treeShaking.reductionPercent.toFixed(1)}% (threshold: 40%)`);
console.log(`    Effective: ${treeShaking.effectiveTreeShaking ? 'YES' : 'NO'}`);
console.log(`    sideEffects:false honored: ${treeShaking.sideEffectsEmpty ? 'YES' : 'NO'}`);

// 3. Build Correctness
console.log('\n  3. Production Build Correctness');
const { correctness, assertions } = await verifyBuildCorrectness();
const allMatch = correctness.every((r) => r.match);
console.log(`    Results match dev/prod: ${allMatch ? 'ALL MATCH' : 'MISMATCH DETECTED'}`);
for (const r of correctness) {
 if (!r.match) console.log(`      MISMATCH: ${r.operation}`);
}
for (const a of assertions) {
 console.log(
  `    ${a.operation}: dev throws=${a.devThrows}, prod throws=${a.prodThrows} — ${a.correctBehavior ? 'OK' : 'ISSUE'}`,
 );
}

// 4. Assertion Elimination
console.log('\n  4. Assertion Elimination');
const elimination = verifyAssertionElimination(dxConfig);
console.log(`    Production bundle: ${(elimination.prodBundle.size / 1024).toFixed(1)} KB`);
console.log(
 `    Assertions in prod: ${elimination.prodBundle.containsAssertions ? 'FOUND (BAD)' : 'NONE (OK)'}`,
);
console.log(
 `    DEV_MODE in prod: ${elimination.prodBundle.containsDevMode ? 'FOUND (BAD)' : 'NONE (OK)'}`,
);
console.log(
 `    Assertions in dev: ${elimination.devBundle.containsAssertions ? 'PRESENT (OK)' : 'MISSING (BAD)'}`,
);
console.log(`    Elimination verified: ${elimination.eliminationVerified ? 'YES' : 'NO'}`);
if (elimination.prodBundle.foundPatterns.length > 0) {
 console.log(`    Found patterns in prod: ${elimination.prodBundle.foundPatterns.join(', ')}`);
}

// 5. Build Size Comparison
console.log('\n  5. Build Size Comparison');
const comparison = compareBuildSizes(dxConfig);
console.log('  ' + formatBuildComparison(comparison).replace(/\n/g, '\n  '));

console.log('');

// Persist JSON report
const RESULTS_DIR = new URL('../results/', import.meta.url).pathname;
mkdirSync(RESULTS_DIR, { recursive: true });

const report: DxReport = {
 metadata: collectMetadata(),
 bundleSize: sizeResults,
 treeShaking,
 buildCorrectness: { correctness, assertions },
 assertionElimination: elimination,
 buildComparison: comparison,
};

const filename = `dx-${report.metadata.timestamp.replace(/[:.]/g, '-')}.json`;
const filepath = join(RESULTS_DIR, filename);
const latestPath = join(RESULTS_DIR, 'dx-latest.json');
writeFileSync(filepath, JSON.stringify(report, null, 2));
createLatestPointer(filepath, latestPath, filename);
console.log(`  Results saved to: ${filepath}\n`);
