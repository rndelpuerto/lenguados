/**
 * CLI entry point for DX (Developer Experience) analysis.
 *
 * Measures bundle size, tree-shaking, build correctness,
 * assertion elimination, and dev vs prod size comparison.
 */

import { ensureBuildArtifacts } from './run.ts';
import { runBundleSizeAnalysis } from '../src/dx/bundle-size.ts';
import { verifyTreeShaking } from '../src/dx/tree-shaking.ts';
import { verifyBuildCorrectness } from '../src/dx/build-correctness.ts';
import { verifyAssertionElimination } from '../src/dx/assertion-elimination.ts';
import { compareBuildSizes, formatBuildComparison } from '../src/dx/build-comparison.ts';

await ensureBuildArtifacts(['development', 'production']);

console.log('\n  DX Analysis\n  ===========\n');

// 1. Bundle Size
console.log('  1. Bundle Size per Import Path');
const sizeResults = runBundleSizeAnalysis();
for (const r of sizeResults) {
 console.log(`    ${r.importPath}: ${(r.rawBytes / 1024).toFixed(1)} KB raw, ${(r.gzipBytes / 1024).toFixed(1)} KB gzip`);
}

// 2. Tree-Shaking
console.log('\n  2. Tree-Shaking Effectiveness');
const treeShaking = verifyTreeShaking();
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
 console.log(`    ${a.operation}: dev throws=${a.devThrows}, prod throws=${a.prodThrows} — ${a.correctBehavior ? 'OK' : 'ISSUE'}`);
}

// 4. Assertion Elimination
console.log('\n  4. Assertion Elimination');
const elimination = verifyAssertionElimination();
console.log(`    Production bundle: ${(elimination.prodBundle.size / 1024).toFixed(1)} KB`);
console.log(`    Assertions in prod: ${elimination.prodBundle.containsAssertions ? 'FOUND (BAD)' : 'NONE (OK)'}`);
console.log(`    DEV_MODE in prod: ${elimination.prodBundle.containsDevMode ? 'FOUND (BAD)' : 'NONE (OK)'}`);
console.log(`    Assertions in dev: ${elimination.devBundle.containsAssertions ? 'PRESENT (OK)' : 'MISSING (BAD)'}`);
console.log(`    Elimination verified: ${elimination.eliminationVerified ? 'YES' : 'NO'}`);
if (elimination.prodBundle.foundPatterns.length > 0) {
 console.log(`    Found patterns in prod: ${elimination.prodBundle.foundPatterns.join(', ')}`);
}

// 5. Build Size Comparison
console.log('\n  5. Build Size Comparison');
const comparison = compareBuildSizes();
console.log('  ' + formatBuildComparison(comparison).replace(/\n/g, '\n  '));

console.log('');
