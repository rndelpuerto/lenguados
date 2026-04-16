/**
 * Summary JSON generator for documentation.
 *
 * Reads raw benchmark result files (performance, comparison, stress, DX)
 * and produces lightweight summary JSON files for the Docusaurus site.
 *
 * Usage: node scripts/generate-docs-data.mjs
 *
 * Input:  tools/benchmark/results/{latest,comparison-latest,stress-latest,dx-latest}.json
 * Output: docs/static/benchmark-data/{performance,comparison,stress,dx}-summary.json
 */

import { Buffer } from 'node:buffer';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// Parse --package flag (default: math2d)
const pkgArg = process.argv.find((a) => a.startsWith('--package='));
const packageName = pkgArg ? pkgArg.split('=')[1] : 'math2d';

const RESULTS_DIR = join(ROOT, 'tools', 'benchmark', 'results');
const OUTPUT_DIR = join(ROOT, 'docs', 'static', 'benchmark-data', packageName);

/* ========================================================================== */
/* Helpers                                                                     */
/* ========================================================================== */

/**
 * Safely read and parse a JSON file. Returns null if missing or invalid.
 */
function readJsonFile(filepath) {
 if (!existsSync(filepath)) {
  console.warn(`  [warn] Missing input: ${filepath}`);
  return null;
 }
 try {
  return JSON.parse(readFileSync(filepath, 'utf-8'));
 } catch (err) {
  console.warn(`  [warn] Invalid JSON in ${filepath}: ${err.message}`);
  return null;
 }
}

/**
 * Round a number to N decimal places to reduce JSON size.
 */
function round(value, decimals) {
 const factor = 10 ** decimals;
 return Math.round(value * factor) / factor;
}

/**
 * PascalCase detection regex.
 * Matches identifiers starting with an uppercase letter followed by
 * at least one lowercase letter (e.g., "Vector2", "Matrix3", "Transform2").
 * Does NOT match all-uppercase or single-char identifiers.
 */
const PASCAL_CASE = /^[A-Z][a-zA-Z0-9]*[a-z][a-zA-Z0-9]*$/;

/**
 * Extract entity name from an operation string via PascalCase heuristic.
 * "Vector2.add (out)" → "Vector2" (PascalCase before dot)
 * "degreesToRadians" → "Scalar" (no dot)
 * "sin(0.5)" → "Scalar" (dot is inside a number, not a method separator)
 */
function extractEntity(operation) {
 const dotIdx = operation.indexOf('.');
 if (dotIdx > 0) {
  const candidate = operation.substring(0, dotIdx);
  if (PASCAL_CASE.test(candidate)) return candidate;
 }
 return 'Scalar';
}

/**
 * Extract the base operation name (without entity prefix).
 * "Vector2.add (out)" → "add (out)"
 * "degreesToRadians" → "degreesToRadians"
 */
function extractOpName(operation) {
 const dotIdx = operation.indexOf('.');
 if (dotIdx > 0) {
  const candidate = operation.substring(0, dotIdx);
  if (PASCAL_CASE.test(candidate)) return operation.substring(dotIdx + 1);
 }
 return operation;
}

/**
 * Detect the validation tier from an operation name.
 * "inverseSafe" → "safe", "inverseUnchecked" → "unchecked", "inverse" → "default"
 */
function detectTier(opName) {
 // Extract the method name part (before any parenthetical)
 const methodPart = opName.split(' ')[0];
 if (methodPart.endsWith('Safe')) return 'safe';
 if (methodPart.endsWith('Unchecked')) return 'unchecked';
 return 'default';
}

/**
 * Get the base method name for triality grouping.
 * "inverseSafe" → "inverse", "inverseUnchecked" → "inverse", "inverse" → "inverse"
 */
function getTrialityBase(opName) {
 const methodPart = opName.split(' ')[0];
 const suffix = opName.substring(methodPart.length); // e.g., " (out)"
 if (methodPart.endsWith('Safe')) return methodPart.slice(0, -4) + suffix;
 if (methodPart.endsWith('Unchecked')) return methodPart.slice(0, -9) + suffix;
 return opName;
}

/**
 * Aggregate multiple runs of the same operation by taking median stats.
 * When the same operation appears N times (from N benchmark iterations),
 * we pick the entry closest to the median opsPerSec.
 */
function aggregateDuplicates(entries) {
 const groups = new Map();
 for (const entry of entries) {
  const key = entry.operation;
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key).push(entry);
 }

 const result = [];
 for (const [, group] of groups) {
  if (group.length === 1) {
   result.push(group[0]);
  } else {
   // Pick the entry whose opsPerSec is closest to the median
   const sorted = [...group].sort((a, b) => a.stats.opsPerSec - b.stats.opsPerSec);
   const medianIdx = Math.floor(sorted.length / 2);
   result.push(sorted[medianIdx]);
  }
 }
 return result;
}

/* ========================================================================== */
/* Performance Summary                                                         */
/* ========================================================================== */

function transformPerformance(raw) {
 if (!raw) {
  return { metadata: null, entities: {} };
 }

 const metadata = {
  timestamp: raw.metadata.timestamp,
  commitHash: raw.metadata.commitHash,
  nodeVersion: raw.metadata.nodeVersion,
  cpu: raw.metadata.cpu,
  os: raw.metadata.os,
 };

 // Aggregate duplicate entries (multiple iterations of same operation)
 const deduped = aggregateDuplicates(raw.results);

 // Group by entity
 const entityMap = new Map();
 for (const entry of deduped) {
  const entity = extractEntity(entry.operation);
  if (!entityMap.has(entity)) entityMap.set(entity, []);
  entityMap.get(entity).push(entry);
 }

 const entities = {};
 for (const [entityName, entries] of entityMap) {
  // Build operations array
  const operations = entries.map((entry) => {
   const s = entry.stats;
   return {
    name: extractOpName(entry.operation),
    median: round(s.median, 2),
    ci95: [round(s.ci95lo, 2), round(s.ci95hi, 2)],
    opsPerSec: Math.round(s.opsPerSec),
    mean: round(s.mean, 2),
    outlierPercent: s.samples > 0
     ? round(((s.outliersMild + s.outliersSevere) / s.samples) * 100, 1)
     : 0,
    samples: s.samples,
   };
  });

  // Compute tier comparisons for triality operations
  const tierComparison = buildTierComparison(entries);

  entities[entityName] = {
   operations,
   ...(tierComparison ? { tierComparison } : {}),
  };
 }

 return { metadata, entities };
}

/**
 * Build tier comparison data for operations that have default/safe/unchecked variants.
 */
function buildTierComparison(entries) {
 // Group operations by triality base name
 const trialityGroups = new Map();
 for (const entry of entries) {
  const opName = extractOpName(entry.operation);
  const tier = detectTier(opName);
  const base = getTrialityBase(opName);
  if (!trialityGroups.has(base)) trialityGroups.set(base, {});
  trialityGroups.get(base)[tier] = entry;
 }

 // Filter to groups that have at least default + one variant
 const comparisons = [];
 for (const [baseName, tiers] of trialityGroups) {
  if (!tiers.default) continue;
  if (!tiers.safe && !tiers.unchecked) continue;

  const defaultOps = Math.round(tiers.default.stats.opsPerSec);
  const comparison = {
   name: baseName,
   default: { median: round(tiers.default.stats.median, 2), opsPerSec: defaultOps },
  };

  const speedup = {};
  if (tiers.safe) {
   const safeOps = Math.round(tiers.safe.stats.opsPerSec);
   comparison.safe = { median: round(tiers.safe.stats.median, 2), opsPerSec: safeOps };
   speedup.safeVsDefault = defaultOps > 0 ? round(safeOps / defaultOps, 3) : 0;
  }
  if (tiers.unchecked) {
   const uncheckedOps = Math.round(tiers.unchecked.stats.opsPerSec);
   comparison.unchecked = {
    median: round(tiers.unchecked.stats.median, 2),
    opsPerSec: uncheckedOps,
   };
   speedup.uncheckedVsDefault = defaultOps > 0
    ? round(uncheckedOps / defaultOps, 3)
    : 0;
  }

  comparison.speedup = speedup;
  comparisons.push(comparison);
 }

 return comparisons.length > 0 ? { operations: comparisons } : null;
}

/* ========================================================================== */
/* Comparison Summary                                                          */
/* ========================================================================== */

function transformComparison(raw) {
 if (!raw) {
  return { metadata: null, conditions: null, libraries: [], categories: {}, aggregate: null };
 }

 const metadata = {
  timestamp: new Date().toISOString(),
 };

 // Group operations by category
 const categories = {};
 for (const op of raw.operations) {
  const cat = op.category || 'unknown';
  if (!categories[cat]) categories[cat] = { operations: [] };

  const ratio = op.ratio ?? null;
  const withinEquivalence = ratio !== null
   ? ratio >= 0.975 && ratio <= 1.025
   : null;

  categories[cat].operations.push({
   name: op.name,
   results: op.results,
   ratio,
   withinEquivalence,
  });
 }

 // Compute aggregate from scores
 let aggregate = null;
 if (raw.scores && raw.scores.length > 0) {
  const score = raw.scores[0];
  const wins = score.ratios.filter((r) => r.ratio > 1.025).length;
  const losses = score.ratios.filter((r) => r.ratio < 0.975).length;
  const ties = score.ratios.length - wins - losses;

  aggregate = {
   geometricMean: score.geometricMean,
   wins,
   losses,
   ties,
   target: score.target,
   reference: score.reference,
  };
 }

 return {
  metadata,
  conditions: raw.conditions ?? null,
  libraries: raw.libraries,
  categories,
  aggregate,
 };
}

/* ========================================================================== */
/* Stress Summary                                                              */
/* ========================================================================== */

function transformStress(raw) {
 if (!raw) {
  return {
   metadata: null,
   ulpAccuracy: [],
   edgeCases: [],
   identities: [],
   cancellation: [],
   allocation: [],
   overflow: [],
   nearSingular: [],
  };
 }

 const suites = raw.suites || {};
 return {
  metadata: {
   timestamp: raw.metadata.timestamp,
   commitHash: raw.metadata.commitHash,
   samples: raw.samples,
  },
  ulpAccuracy: suites.ulp || [],
  edgeCases: suites.ieee754 || [],
  identities: suites.identity || [],
  cancellation: suites.cancellation || [],
  allocation: suites.allocation || [],
  overflow: suites.overflow || [],
  nearSingular: suites.nearSingular || [],
 };
}

/* ========================================================================== */
/* DX Summary                                                                  */
/* ========================================================================== */

function transformDx(raw) {
 if (!raw) {
  return {
   metadata: null,
   bundleSize: [],
   treeShaking: null,
   buildComparison: null,
   buildCorrectness: null,
   assertionElimination: null,
  };
 }

 return {
  metadata: {
   timestamp: raw.metadata.timestamp,
   commitHash: raw.metadata.commitHash,
  },
  bundleSize: raw.bundleSize,
  treeShaking: raw.treeShaking,
  buildComparison: raw.buildComparison,
  buildCorrectness: raw.buildCorrectness,
  assertionElimination: raw.assertionElimination,
 };
}

/* ========================================================================== */
/* Main                                                                        */
/* ========================================================================== */

console.log('  Generating benchmark summary data for docs...\n');

// Skip generation if summaries already exist with real data (e.g., downloaded from CI artifact).
// This prevents overwriting valid pre-generated summaries when the results/ directory is empty.
const existingSummary = readJsonFile(join(OUTPUT_DIR, 'performance-summary.json'));
if (existingSummary && existingSummary.metadata !== null) {
 console.log('  Benchmark summaries already exist with real data. Skipping generation.');
 console.log('  (Delete docs/static/benchmark-data/ to force regeneration.)\n');
 process.exit(0);
}

// Read input files
const performance = readJsonFile(join(RESULTS_DIR, 'latest.json'));
const comparison = readJsonFile(join(RESULTS_DIR, 'comparison-latest.json'));
const stress = readJsonFile(join(RESULTS_DIR, 'stress-latest.json'));
const dx = readJsonFile(join(RESULTS_DIR, 'dx-latest.json'));

// Transform
const perfSummary = transformPerformance(performance);
const compSummary = transformComparison(comparison);
const stressSummary = transformStress(stress);
const dxSummary = transformDx(dx);

// Write output
mkdirSync(OUTPUT_DIR, { recursive: true });

const outputs = [
 ['performance-summary.json', perfSummary],
 ['comparison-summary.json', compSummary],
 ['stress-summary.json', stressSummary],
 ['dx-summary.json', dxSummary],
];

let totalBytes = 0;
for (const [filename, data] of outputs) {
 const json = JSON.stringify(data);
 const filepath = join(OUTPUT_DIR, filename);
 writeFileSync(filepath, json);
 const byteLength = Buffer.byteLength(json);
 const sizeKB = (byteLength / 1024).toFixed(1);
 totalBytes += byteLength;
 console.log(`  ${filename}: ${sizeKB} KB`);
}

const totalKB = (totalBytes / 1024).toFixed(1);
console.log(`\n  Total: ${totalKB} KB`);

if (totalBytes > 150 * 1024) {
 console.warn(`\n  [warn] Total output exceeds 150 KB budget (${totalKB} KB)`);
}

console.log('  Done.\n');
