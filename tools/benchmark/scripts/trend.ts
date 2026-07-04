/**
 * @file scripts/trend.ts
 * @description Record benchmark trend history and emit a warn-only delta report
 *
 * Reads the current run's summaries (produced by summarize.ts), appends one
 * compact record per run to a rolling JSONL history, and writes a markdown
 * delta report comparing the current run against the previous record and the
 * rolling median of up to the last 30 records.
 *
 * SURVEILLANCE, NOT A GATE — warn-only by construction. Wall-clock numbers
 * on shared runners carry a measured noise floor (~2.7% CoV on hosted CI
 * runners; per-benchmark variance far higher) that makes single-run pass/fail
 * thresholds below ~2x statistically dishonest. This script therefore NEVER
 * exits non-zero because of a performance delta: deltas beyond the
 * catastrophic bands are annotated "investigate" in the report, nothing
 * more. Data-integrity failures on CURRENT inputs (missing/partial/malformed
 * summaries, invalid committed baseline) DO exit non-zero, mirroring
 * summarize.ts refusal semantics — bad data must never be recorded silently.
 * An invalid HISTORY file is the one deliberate exception: it QUARANTINES
 * (moved to `<history>.corrupt`, window restarts, prominent report warning,
 * exit 0), because a hard refusal would self-perpetuate in CI — the failed
 * run never uploads a fresh artifact, so every later run re-downloads the
 * same corrupt history and the pipeline wedges permanently.
 *
 * Bands (annotation only):
 * - Entity geomean of per-operation median ns: |delta| > 25% vs rolling median.
 * - Cross-library comparison geometric mean: outside the committed band in
 *   baselines/comparison-ratio.json (regeneration is manual and reviewed,
 *   same discipline as the determinism golden file).
 *
 * Usage: tsx scripts/trend.ts [--package=name]
 *        [--history=path] [--baseline=path] [--summaries-dir=path]
 *        [--report=path]                        (test overrides)
 *
 * Input:  results/summaries/{package}/{performance,comparison}-summary.json
 * Output: results/trend/{package}-history.jsonl (appended)
 *         results/trend/{package}-report.md
 */

import {
 existsSync,
 mkdirSync,
 readFileSync,
 renameSync,
 writeFileSync,
 appendFileSync,
} from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const TOOL_ROOT = resolve(import.meta.dirname, '..');

/* ========================================================================== */
/* CLI                                                                         */
/* ========================================================================== */

const argv = process.argv.slice(2);
const pkgArg = argv.find((a) => a.startsWith('--package='));
const packageName = pkgArg ? pkgArg.split('=')[1]! : 'math2d';

// --package=all: fan out over every registered package loader (generic).
// The path-override flags are per-package by construction (one history and
// one report per package), so combining them with the fan-out would make
// every child write to the SAME file — refuse the ambiguity outright.
if (packageName === 'all') {
 const overrideFlag = argv.find(
  (a) =>
   a.startsWith('--history=') ||
   a.startsWith('--baseline=') ||
   a.startsWith('--summaries-dir=') ||
   a.startsWith('--report='),
 );
 if (overrideFlag) {
  console.error(
   `\n  REFUSED: ${overrideFlag.split('=')[0]} cannot be combined with --package=all (path overrides are per-package).\n`,
  );
  process.exit(1);
 }
 const { readdirSync } = await import('node:fs');
 const { execSync } = await import('node:child_process');
 const packagesDir = join(TOOL_ROOT, 'src', 'packages');
 const registered = readdirSync(packagesDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();
 for (const pkg of registered) {
  execSync(`./node_modules/.bin/tsx scripts/trend.ts --package=${pkg}`, {
   stdio: 'inherit',
   cwd: TOOL_ROOT,
  });
 }
 process.exit(0);
}

const summariesDirArg = argv.find((a) => a.startsWith('--summaries-dir='))?.split('=')[1];
const historyArg = argv.find((a) => a.startsWith('--history='))?.split('=')[1];
const baselineArg = argv.find((a) => a.startsWith('--baseline='))?.split('=')[1];
const reportArg = argv.find((a) => a.startsWith('--report='))?.split('=')[1];

const SUMMARIES_DIR = summariesDirArg
 ? resolve(summariesDirArg)
 : join(TOOL_ROOT, 'results', 'summaries', packageName);
const HISTORY_PATH = historyArg
 ? resolve(historyArg)
 : join(TOOL_ROOT, 'results', 'trend', `${packageName}-history.jsonl`);
const BASELINE_PATH = baselineArg
 ? resolve(baselineArg)
 : join(TOOL_ROOT, 'baselines', 'comparison-ratio.json');
const REPORT_PATH = reportArg
 ? resolve(reportArg)
 : join(TOOL_ROOT, 'results', 'trend', `${packageName}-report.md`);

/** Rolling window size for the median comparison */
const ROLLING_WINDOW = 30;

/** Entity geomean annotation band (fraction) — beyond this, "investigate" */
const ENTITY_BAND = 0.25;

/* ========================================================================== */
/* Types                                                                       */
/* ========================================================================== */

/** One compact history record — one line of the JSONL history file */
interface TrendRecord {
 schema: 1;
 timestamp: string;
 commit: string;
 node: string;
 package: string;
 /** Per-entity geometric mean of per-operation median ns */
 entities: Record<string, number>;
 /** Same-run cross-library aggregate, when the package has the capability */
 comparison: {
  geometricMean: number;
  reference: string;
  referenceVersion: string;
 } | null;
}

/** Committed comparison-ratio anchor (baselines/comparison-ratio.json) */
interface RatioBaseline {
 geometricMean: number;
 band: number;
 reference: string;
 referenceVersion: string;
}

/* ========================================================================== */
/* Helpers                                                                     */
/* ========================================================================== */

/**
 * Fail loudly with a data-integrity message
 *
 * @param message - Human-readable refusal cause
 */
function refuse(message: string): never {
 console.error(`\n  REFUSED: ${message}\n`);
 process.exit(1);
}

/**
 * Read and parse a required JSON file, refusing on absence or corruption
 *
 * @param filepath - Absolute path to the JSON file
 * @param label - Human-readable name for refusal messages
 * @returns Parsed JSON object
 */
function readRequiredJson(filepath: string, label: string): Record<string, unknown> {
 if (!existsSync(filepath)) {
  refuse(`${label} not found at ${filepath}. Run the benchmark pipeline first.`);
 }
 try {
  return JSON.parse(readFileSync(filepath, 'utf-8')) as Record<string, unknown>;
 } catch (err: unknown) {
  const msg = err instanceof Error ? err.message : String(err);
  refuse(`${label} at ${filepath} is not valid JSON: ${msg}`);
 }
}

/**
 * Compute the geometric mean of strictly positive values
 *
 * @param values - Input values; non-positive entries are excluded
 * @returns Geometric mean, or NaN when no positive values exist
 */
function geometricMean(values: number[]): number {
 const positive = values.filter((v) => Number.isFinite(v) && v > 0);
 if (positive.length === 0) return Number.NaN;
 const logSum = positive.reduce((acc, v) => acc + Math.log(v), 0);
 return Math.exp(logSum / positive.length);
}

/**
 * Compute the median of a numeric array
 *
 * @param values - Input values (not mutated)
 * @returns Median, or NaN for an empty array
 */
function median(values: number[]): number {
 if (values.length === 0) return Number.NaN;
 const sorted = [...values].sort((a, b) => a - b);
 const mid = Math.floor(sorted.length / 2);
 return sorted.length % 2 === 0 ? (sorted[mid - 1]! + sorted[mid]!) / 2 : sorted[mid]!;
}

/**
 * Format a signed percentage delta for the report
 *
 * @param current - Current value
 * @param reference - Reference value
 * @returns Signed percentage string, or em-dash when the reference is unusable
 */
function formatDelta(current: number, reference: number): string {
 if (!Number.isFinite(reference) || reference <= 0 || !Number.isFinite(current)) return '—';
 const pct = ((current - reference) / reference) * 100;
 const sign = pct >= 0 ? '+' : '';
 return `${sign}${pct.toFixed(1)}%`;
}

/**
 * Round to three decimals for compact JSONL records
 *
 * @param value - The number to round
 * @returns Rounded number
 */
function round3(value: number): number {
 return Math.round(value * 1000) / 1000;
}

/* ========================================================================== */
/* Build the current record                                                    */
/* ========================================================================== */

const perfSummary = readRequiredJson(
 join(SUMMARIES_DIR, 'performance-summary.json'),
 'performance summary',
);

// Partial summaries (summarize --force) are non-publishable by contract and
// must never enter the trend history.
if (perfSummary['partial'] === true) {
 refuse('performance summary is stamped partial: true — refusing to record a partial run.');
}

const perfMeta = perfSummary['metadata'] as Record<string, unknown> | undefined;
const perfEntities = perfSummary['entities'] as
 Record<string, { operations?: Array<Record<string, unknown>> }> | undefined;
if (!perfMeta || !perfEntities || Object.keys(perfEntities).length === 0) {
 refuse('performance summary has no metadata/entities — regenerate with summarize.ts.');
}

const entities: Record<string, number> = {};
for (const [entity, data] of Object.entries(perfEntities)) {
 const operations = data.operations ?? [];
 // Defense in depth: measured medians are strictly positive numbers by
 // construction (nanoseconds from real samples), so a missing, non-numeric,
 // non-finite, or non-positive median is malformed input — silently
 // excluding it would record a geomean derived from partially-corrupt
 // data, which the doctrine forbids.
 const invalid = operations.find((op) => {
  const m = op['median'];
  return typeof m !== 'number' || !Number.isFinite(m) || m <= 0;
 });
 if (invalid) {
  refuse(
   `entity '${entity}' operation '${String(invalid['name'] ?? 'unknown')}' has a non-positive or non-finite median (${String(invalid['median'])}) — regenerate with summarize.ts.`,
  );
 }
 const medians = operations.map((op) => op['median'] as number);
 const gm = geometricMean(medians);
 if (Number.isFinite(gm)) entities[entity] = round3(gm);
}
if (Object.keys(entities).length === 0) {
 refuse('performance summary contains no usable per-operation medians.');
}

// Comparison is capability-gated: summarize.ts writes a stub summary with
// `aggregate: null` for packages without a cross-library comparison config,
// so a null aggregate means "no capability" (record null), while a present
// but malformed aggregate is a data-integrity refusal.
const comparisonPath = join(SUMMARIES_DIR, 'comparison-summary.json');
let comparison: TrendRecord['comparison'] = null;
if (existsSync(comparisonPath)) {
 const compSummary = readRequiredJson(comparisonPath, 'comparison summary');
 if (compSummary['partial'] === true) {
  refuse('comparison summary is stamped partial: true — refusing to record a partial run.');
 }
 const aggregate = compSummary['aggregate'] as Record<string, unknown> | null | undefined;
 const libraries = compSummary['libraries'] as
  Array<{ name?: string; version?: string }> | undefined;
 if (aggregate !== null && aggregate !== undefined) {
  if (typeof aggregate['geometricMean'] !== 'number') {
   refuse(
    'comparison summary aggregate has no numeric geometricMean — regenerate with summarize.ts.',
   );
  }
  const referenceName = String(aggregate['reference'] ?? '');
  const referenceVersion = libraries?.find((l) => l.name === referenceName)?.version ?? 'unknown';
  comparison = {
   geometricMean: round3(aggregate['geometricMean']),
   reference: referenceName,
   referenceVersion,
  };
 }
}

const record: TrendRecord = {
 schema: 1,
 timestamp: String(perfMeta['timestamp'] ?? ''),
 commit: String(perfMeta['commitHash'] ?? 'unknown'),
 node: String(perfMeta['nodeVersion'] ?? 'unknown'),
 package: packageName,
 entities,
 comparison,
};

/* ========================================================================== */
/* Load history + committed ratio baseline                                     */
/* ========================================================================== */

// Invalid history QUARANTINES instead of refusing. A hard refusal would
// self-perpetuate in CI: the failed run never uploads a fresh artifact, so
// every subsequent run re-downloads the same corrupt history and fails
// identically — wedging the bench→docs pipeline permanently for a warn-only
// surface. Instead the corrupt file moves aside to `<history>.corrupt`
// (outside the artifact upload glob, so it cannot propagate), the rolling
// window restarts, and the report opens with a prominent warning — loud AND
// self-healing. Validation covers JSON syntax plus record identity (schema
// version and package name), so a mismatched artifact cannot silently feed
// the window either.
let history: TrendRecord[] = [];
let quarantineNote: string | null = null;
if (existsSync(HISTORY_PATH)) {
 const lines = readFileSync(HISTORY_PATH, 'utf-8')
  .split('\n')
  .filter((line) => line.trim() !== '');
 const parsed: TrendRecord[] = [];
 let corruptReason: string | null = null;
 for (const [i, line] of lines.entries()) {
  let record: TrendRecord;
  try {
   record = JSON.parse(line) as TrendRecord;
  } catch {
   corruptReason = `invalid JSON on line ${i + 1}`;
   break;
  }
  if (record.schema !== 1 || record.package !== packageName) {
   corruptReason = `line ${i + 1} carries schema '${String(record.schema)}' / package '${String(record.package)}' (expected 1 / '${packageName}')`;
   break;
  }
  parsed.push(record);
 }
 if (corruptReason === null) {
  history = parsed;
 } else {
  // Newest-wins: a pre-existing .corrupt file is overwritten. In the CI
  // flow a second quarantine cannot stem from the artifact (the .corrupt
  // name sits outside the upload glob), so recurrence means a NEW local
  // corruption — the latest evidence is the relevant one.
  const quarantinePath = `${HISTORY_PATH}.corrupt`;
  renameSync(HISTORY_PATH, quarantinePath);
  quarantineNote =
   `history file was invalid (${corruptReason}) — quarantined to ${quarantinePath}; ` +
   'the rolling window restarts from this run';
  console.warn(`\n  WARNING: ${quarantineNote}\n`);
 }
}

// The committed ratio anchor is mandatory when (and only when) the package
// records a comparison — an unreadable committed baseline is a repo defect.
let baseline: RatioBaseline | null = null;
if (comparison !== null) {
 const raw = readRequiredJson(BASELINE_PATH, 'comparison-ratio baseline');
 if (
  typeof raw['geometricMean'] !== 'number' ||
  typeof raw['band'] !== 'number' ||
  raw['band'] <= 0 ||
  raw['band'] >= 1
 ) {
  refuse(
   `comparison-ratio baseline at ${BASELINE_PATH} needs numeric geometricMean and band in (0, 1).`,
  );
 }
 baseline = {
  geometricMean: raw['geometricMean'],
  band: raw['band'],
  reference: String(raw['reference'] ?? ''),
  referenceVersion: String(raw['referenceVersion'] ?? ''),
 };
}

/* ========================================================================== */
/* Delta report                                                                */
/* ========================================================================== */

const previous = history.at(-1) ?? null;
const window = history.slice(-ROLLING_WINDOW);

const lines: string[] = [];
lines.push(`### Benchmark trend — ${packageName}`);
lines.push('');
lines.push(
 `Run \`${record.commit}\` (${record.timestamp}, ${record.node}). ` +
  `History: ${history.length} previous record${history.length === 1 ? '' : 's'}` +
  (window.length > 0 ? ` (rolling window: ${window.length}).` : '.'),
);
lines.push('');
lines.push(
 '_Warn-only surveillance: wall-clock CI numbers carry a measured noise floor, so deltas ' +
  'below the bands are expected scatter. Annotations mark magnitudes worth a human look; ' +
  'nothing here fails the build._',
);
lines.push('');

if (quarantineNote !== null) {
 lines.push(`> **⚠ ${quarantineNote}.**`);
 lines.push('');
}

if (history.length === 0) {
 lines.push('No history available — recording the first data point.');
 lines.push('');
} else {
 lines.push('| Series | Current | vs previous | vs rolling median | Note |');
 lines.push('| --- | ---: | ---: | ---: | --- |');
 for (const [entity, current] of Object.entries(entities)) {
  const prevValue = previous?.entities[entity];
  const windowValues = window
   .map((r) => r.entities[entity])
   .filter((v): v is number => typeof v === 'number');
  const rollingMedian = median(windowValues);
  const deltaVsMedian =
   Number.isFinite(rollingMedian) && rollingMedian > 0
    ? Math.abs(current - rollingMedian) / rollingMedian
    : 0;
  const note = deltaVsMedian > ENTITY_BAND ? '⚠ investigate' : '';
  lines.push(
   `| ${entity} (median ns, geomean) | ${current.toFixed(2)} | ${formatDelta(current, prevValue ?? Number.NaN)} | ${formatDelta(current, rollingMedian)} | ${note} |`,
  );
 }
 lines.push('');
}

if (comparison !== null && baseline !== null) {
 const low = baseline.geometricMean * (1 - baseline.band);
 const high = baseline.geometricMean * (1 + baseline.band);
 const inBand = comparison.geometricMean >= low && comparison.geometricMean <= high;
 lines.push(
  `**Cross-library ratio** vs ${comparison.reference}@${comparison.referenceVersion}: ` +
   `geometric mean **${comparison.geometricMean.toFixed(3)}x** — committed anchor ` +
   `${baseline.geometricMean.toFixed(3)}x ±${(baseline.band * 100).toFixed(0)}% ` +
   `[${low.toFixed(3)}, ${high.toFixed(3)}]: ${inBand ? 'within band' : '⚠ OUTSIDE BAND — investigate'}.`,
 );
 lines.push('');
 if (!inBand) {
  lines.push(
   '_If this shift is deliberate (optimization, dependency upgrade, accepted drift), ' +
    'regenerate `baselines/comparison-ratio.json` in a reviewed PR stating the trigger — ' +
    'the same discipline as the determinism golden file._',
  );
  lines.push('');
 }
}

const report = lines.join('\n');

/* ========================================================================== */
/* Persist                                                                     */
/* ========================================================================== */

mkdirSync(dirname(HISTORY_PATH), { recursive: true });
appendFileSync(HISTORY_PATH, `${JSON.stringify(record)}\n`);

mkdirSync(dirname(REPORT_PATH), { recursive: true });
writeFileSync(REPORT_PATH, `${report}\n`);

console.log(report);
console.log(`  History: ${HISTORY_PATH} (${history.length + 1} records)`);
console.log(`  Report:  ${REPORT_PATH}`);
