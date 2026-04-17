/**
 * @file scripts/summarize.ts
 * @description Generate lightweight summary JSON from raw benchmark results
 *
 * Reads raw benchmark result files (performance, comparison, stress, DX)
 * and produces condensed summary JSON files. These summaries are consumed
 * by the Docusaurus benchmark-data plugin at docs build time.
 *
 * Usage: tsx scripts/summarize.ts [--package=name]
 *
 * Input:  results/{latest,comparison-latest,stress-latest,dx-latest}.json
 * Output: results/summaries/{package}/{performance,comparison,stress,dx}-summary.json
 */

import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const TOOL_ROOT = resolve(import.meta.dirname, '..');
const RESULTS_DIR = join(TOOL_ROOT, 'results');

// Parse --package flag (default: math2d)
const pkgArg = process.argv.find((a) => a.startsWith('--package='));
const packageName = pkgArg ? pkgArg.split('=')[1]! : 'math2d';

const OUTPUT_DIR = join(RESULTS_DIR, 'summaries', packageName);

/* ========================================================================== */
/* Helpers                                                                     */
/* ========================================================================== */

/**
 * Safely read and parse a JSON file
 *
 * @param filepath - Absolute path to the JSON file
 * @returns Parsed JSON or null if missing/invalid
 */
function readJsonFile(filepath: string): Record<string, unknown> | null {
 if (!existsSync(filepath)) {
  console.warn(`  [warn] Missing input: ${filepath}`);
  return null;
 }
 try {
  return JSON.parse(readFileSync(filepath, 'utf-8')) as Record<string, unknown>;
 } catch (err: unknown) {
  const msg = err instanceof Error ? err.message : String(err);
  console.warn(`  [warn] Invalid JSON in ${filepath}: ${msg}`);
  return null;
 }
}

/**
 * Round a number to N decimal places to reduce JSON size
 *
 * @param value - The number to round
 * @param decimals - Number of decimal places
 * @returns Rounded number
 */
function round(value: number, decimals: number): number {
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
 * Extract entity name from an operation string via PascalCase heuristic
 *
 * @param operation - Full operation name (e.g., "Vector2.add (out)")
 * @returns Entity name (e.g., "Vector2") or "Scalar" for non-entity operations
 */
function extractEntity(operation: string): string {
 const dotIdx = operation.indexOf('.');
 if (dotIdx > 0) {
  const candidate = operation.substring(0, dotIdx);
  if (PASCAL_CASE.test(candidate)) return candidate;
 }
 return 'Scalar';
}

/**
 * Extract the base operation name without entity prefix
 *
 * @param operation - Full operation name (e.g., "Vector2.add (out)")
 * @returns Base name (e.g., "add (out)")
 */
function extractOpName(operation: string): string {
 const dotIdx = operation.indexOf('.');
 if (dotIdx > 0) {
  const candidate = operation.substring(0, dotIdx);
  if (PASCAL_CASE.test(candidate)) return operation.substring(dotIdx + 1);
 }
 return operation;
}

/**
 * Detect the validation tier from an operation name
 *
 * @param opName - Operation name (e.g., "inverseSafe")
 * @returns Tier string: "safe", "unchecked", or "default"
 */
function detectTier(opName: string): string {
 const methodPart = opName.split(' ')[0]!;
 if (methodPart.endsWith('Safe')) return 'safe';
 if (methodPart.endsWith('Unchecked')) return 'unchecked';
 return 'default';
}

/**
 * Get the base method name for triality grouping
 *
 * @param opName - Operation name (e.g., "inverseSafe")
 * @returns Base name without tier suffix (e.g., "inverse")
 */
function getTrialityBase(opName: string): string {
 const methodPart = opName.split(' ')[0]!;
 const suffix = opName.substring(methodPart.length);
 if (methodPart.endsWith('Safe')) return methodPart.slice(0, -4) + suffix;
 if (methodPart.endsWith('Unchecked')) return methodPart.slice(0, -9) + suffix;
 return opName;
}

interface BenchEntry {
 operation: string;
 stats: {
  median: number;
  mean: number;
  ci95lo: number;
  ci95hi: number;
  opsPerSec: number;
  outliersMild: number;
  outliersSevere: number;
  samples: number;
 };
}

/**
 * Aggregate multiple runs of the same operation by taking the median entry
 *
 * @param entries - Array of benchmark entries, possibly with duplicates
 * @returns Deduplicated array with one entry per operation
 */
function aggregateDuplicates(entries: BenchEntry[]): BenchEntry[] {
 const groups = new Map<string, BenchEntry[]>();
 for (const entry of entries) {
  const key = entry.operation;
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key)!.push(entry);
 }

 const result: BenchEntry[] = [];
 for (const [, group] of groups) {
  if (group.length === 1) {
   result.push(group[0]!);
  } else {
   const sorted = [...group].sort((a, b) => a.stats.opsPerSec - b.stats.opsPerSec);
   result.push(sorted[Math.floor(sorted.length / 2)]!);
  }
 }
 return result;
}

/* ========================================================================== */
/* Performance Summary                                                         */
/* ========================================================================== */

function transformPerformance(raw: Record<string, unknown> | null): unknown {
 if (!raw) {
  return { metadata: null, entities: {} };
 }

 const meta = raw.metadata as Record<string, unknown>;
 const metadata = {
  timestamp: meta.timestamp,
  commitHash: meta.commitHash,
  nodeVersion: meta.nodeVersion,
  cpu: meta.cpu,
  os: meta.os,
 };

 const deduped = aggregateDuplicates(raw.results as BenchEntry[]);

 const entityMap = new Map<string, BenchEntry[]>();
 for (const entry of deduped) {
  const entity = extractEntity(entry.operation);
  if (!entityMap.has(entity)) entityMap.set(entity, []);
  entityMap.get(entity)!.push(entry);
 }

 const entities: Record<string, unknown> = {};
 for (const [entityName, entries] of entityMap) {
  const operations = entries.map((entry) => {
   const s = entry.stats;
   return {
    name: extractOpName(entry.operation),
    median: round(s.median, 2),
    ci95: [round(s.ci95lo, 2), round(s.ci95hi, 2)],
    opsPerSec: Math.round(s.opsPerSec),
    mean: round(s.mean, 2),
    outlierPercent:
     s.samples > 0 ? round(((s.outliersMild + s.outliersSevere) / s.samples) * 100, 1) : 0,
    samples: s.samples,
   };
  });

  const tierComparison = buildTierComparison(entries);

  entities[entityName] = {
   operations,
   ...(tierComparison ? { tierComparison } : {}),
  };
 }

 return { metadata, entities };
}

function buildTierComparison(entries: BenchEntry[]): unknown {
 const trialityGroups = new Map<string, Record<string, BenchEntry>>();
 for (const entry of entries) {
  const opName = extractOpName(entry.operation);
  const tier = detectTier(opName);
  const base = getTrialityBase(opName);
  if (!trialityGroups.has(base)) trialityGroups.set(base, {});
  trialityGroups.get(base)![tier] = entry;
 }

 const comparisons: unknown[] = [];
 for (const [baseName, tiers] of trialityGroups) {
  if (!tiers['default']) continue;
  if (!tiers['safe'] && !tiers['unchecked']) continue;

  const defaultOps = Math.round(tiers['default']!.stats.opsPerSec);
  const comparison: Record<string, unknown> = {
   name: baseName,
   default: { median: round(tiers['default']!.stats.median, 2), opsPerSec: defaultOps },
  };

  const speedup: Record<string, number> = {};
  if (tiers['safe']) {
   const safeOps = Math.round(tiers['safe']!.stats.opsPerSec);
   comparison['safe'] = { median: round(tiers['safe']!.stats.median, 2), opsPerSec: safeOps };
   speedup['safeVsDefault'] = defaultOps > 0 ? round(safeOps / defaultOps, 3) : 0;
  }
  if (tiers['unchecked']) {
   const uncheckedOps = Math.round(tiers['unchecked']!.stats.opsPerSec);
   comparison['unchecked'] = {
    median: round(tiers['unchecked']!.stats.median, 2),
    opsPerSec: uncheckedOps,
   };
   speedup['uncheckedVsDefault'] = defaultOps > 0 ? round(uncheckedOps / defaultOps, 3) : 0;
  }

  comparison['speedup'] = speedup;
  comparisons.push(comparison);
 }

 return comparisons.length > 0 ? { operations: comparisons } : null;
}

/* ========================================================================== */
/* Comparison Summary                                                          */
/* ========================================================================== */

function transformComparison(raw: Record<string, unknown> | null, timestamp: string): unknown {
 if (!raw) {
  return { metadata: null, conditions: null, libraries: [], categories: {}, aggregate: null };
 }

 const metadata = { timestamp };

 const categories: Record<string, unknown> = {};
 for (const op of raw.operations as Array<Record<string, unknown>>) {
  const cat = (op.category as string) || 'unknown';
  if (!categories[cat]) categories[cat] = { operations: [] as unknown[] };

  const ratio = (op.ratio as number) ?? null;
  const withinEquivalence = ratio !== null ? ratio >= 0.975 && ratio <= 1.025 : null;

  ((categories[cat] as Record<string, unknown>).operations as unknown[]).push({
   name: op.name,
   results: op.results,
   ratio,
   withinEquivalence,
  });
 }

 let aggregate: unknown = null;
 const scores = raw.scores as Array<Record<string, unknown>> | undefined;
 if (scores && scores.length > 0) {
  const score = scores[0]!;
  const ratios = score.ratios as Array<{ ratio: number }>;
  const wins = ratios.filter((r) => r.ratio > 1.025).length;
  const losses = ratios.filter((r) => r.ratio < 0.975).length;
  const ties = ratios.length - wins - losses;

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
  conditions: (raw.conditions as unknown) ?? null,
  libraries: raw.libraries,
  categories,
  aggregate,
 };
}

/* ========================================================================== */
/* Stress Summary                                                              */
/* ========================================================================== */

function transformStress(raw: Record<string, unknown> | null): unknown {
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

 const suites = (raw.suites as Record<string, unknown[]>) || {};
 const meta = raw.metadata as Record<string, unknown>;
 return {
  metadata: {
   timestamp: meta.timestamp,
   commitHash: meta.commitHash,
   samples: raw.samples,
  },
  ulpAccuracy: suites['ulp'] || [],
  edgeCases: suites['ieee754'] || [],
  identities: suites['identity'] || [],
  cancellation: suites['cancellation'] || [],
  allocation: suites['allocation'] || [],
  overflow: suites['overflow'] || [],
  nearSingular: suites['nearSingular'] || [],
 };
}

/* ========================================================================== */
/* DX Summary                                                                  */
/* ========================================================================== */

/**
 * Strip absolute filesystem paths to avoid leaking local directory structure
 *
 * @param obj - Object tree to sanitize
 * @returns Sanitized copy with absolute paths replaced by relative ones
 */
function stripAbsolutePaths(obj: unknown): unknown {
 if (obj === null || obj === undefined) return obj;
 if (typeof obj === 'string') {
  return obj.replace(/(?<=^|[\s'"])(?:\/[^\s/'"]+)+\/lenguados\//g, './');
 }
 if (Array.isArray(obj)) return obj.map(stripAbsolutePaths);
 if (typeof obj === 'object') {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
   result[key] = stripAbsolutePaths(value);
  }
  return result;
 }
 return obj;
}

function transformDx(raw: Record<string, unknown> | null): unknown {
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

 const meta = raw.metadata as Record<string, unknown>;
 return stripAbsolutePaths({
  metadata: {
   timestamp: meta.timestamp,
   commitHash: meta.commitHash,
  },
  bundleSize: raw.bundleSize,
  treeShaking: raw.treeShaking,
  buildComparison: raw.buildComparison,
  buildCorrectness: raw.buildCorrectness,
  assertionElimination: raw.assertionElimination,
 });
}

/* ========================================================================== */
/* Main                                                                        */
/* ========================================================================== */

console.log(`  Generating benchmark summaries for ${packageName}...\n`);

// Read input files
const performance = readJsonFile(join(RESULTS_DIR, 'latest.json'));
const comparison = readJsonFile(join(RESULTS_DIR, 'comparison-latest.json'));
const stress = readJsonFile(join(RESULTS_DIR, 'stress-latest.json'));
const dx = readJsonFile(join(RESULTS_DIR, 'dx-latest.json'));

// Derive comparison timestamp from the raw file mtime (deterministic, idempotent)
const compFilePath = join(RESULTS_DIR, 'comparison-latest.json');
const compTimestamp = existsSync(compFilePath)
 ? statSync(compFilePath).mtime.toISOString()
 : new Date().toISOString();

// Transform
const perfSummary = transformPerformance(performance);
const compSummary = transformComparison(comparison, compTimestamp);
const stressSummary = transformStress(stress);
const dxSummary = transformDx(dx);

// Write output
mkdirSync(OUTPUT_DIR, { recursive: true });

const outputs: [string, unknown][] = [
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
