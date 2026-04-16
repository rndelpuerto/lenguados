/**
 * Shared benchmark builder for suite definitions.
 *
 * Eliminates the duplicated `add()` helper pattern across 12 suite files.
 */

import type { BenchmarkEntry, SuiteDefinition } from './suite.ts';
import type { ValidationTier, DeterminismMode, DimensionSpec } from './dimensions.ts';
import type { GcMode } from './runner.ts';

export interface BenchmarkBuilder {
 /** Add a benchmark. Optional tier/determinism tags for cell filtering. */
 add(name: string, fn: () => unknown, tier?: ValidationTier, determinism?: DeterminismMode): void;
 /** The accumulated benchmark entries. */
 readonly entries: BenchmarkEntry[];
}

/**
 * Create a benchmark builder that accumulates entries.
 *
 * Usage:
 * ```typescript
 * const { add, entries } = createBenchmarkBuilder();
 * add('Vector2.add (out)', () => V2.add(a, b, out));
 * add('Vector2.normalize', () => V2.normalize(a, out), 'default');
 * return { name: 'Vector2', benchmarks: entries, ... };
 * ```
 */
export function createBenchmarkBuilder(): BenchmarkBuilder {
 const entries: BenchmarkEntry[] = [];

 return {
  add(name, fn, tier, determinism) {
   entries.push({ name, fn, tier, determinism });
  },
  get entries() {
   return entries;
  },
 };
}

/* ========================================================================== */
/* Dimension Defaults                                                          */
/* ========================================================================== */

interface DimensionOverrides {
 entity: string;
 environment?: DimensionSpec['environment'];
 buildMode?: DimensionSpec['buildMode'];
 determinism?: DimensionSpec['determinism'];
 tier?: DimensionSpec['tier'];
}

/**
 * Build a DimensionSpec by merging caller overrides with sensible defaults.
 *
 * Only `entity` is required. The `tier` and `determinism` axes are included
 * only when explicitly provided — omitting them skips those axes in the
 * cartesian product (no defaulting).
 */
export function defaultDimensions(overrides: DimensionOverrides): DimensionSpec {
 return {
  environment: overrides.environment ?? ['node'],
  buildMode: overrides.buildMode ?? ['development', 'production'],
  ...(overrides.determinism !== undefined ? { determinism: overrides.determinism } : {}),
  ...(overrides.tier !== undefined ? { tier: overrides.tier } : {}),
  entity: [overrides.entity],
 };
}

/* ========================================================================== */
/* Triality Helper                                                             */
/* ========================================================================== */

type TrialityEntry = [name: string, fn: () => unknown];

export interface TrialityConfig {
 default?: TrialityEntry;
 safe?: TrialityEntry;
 unchecked?: TrialityEntry;
}

/**
 * Register a triality operation group (default/safe/unchecked).
 *
 * Each entry is a tuple of [name, fn]. Missing entries are skipped.
 * Names are passed through exactly as provided — no suffix manipulation.
 */
export function addTriality(builder: BenchmarkBuilder, config: TrialityConfig): void {
 if (config.default) builder.add(config.default[0], config.default[1], 'default');
 if (config.safe) builder.add(config.safe[0], config.safe[1], 'safe');
 if (config.unchecked) builder.add(config.unchecked[0], config.unchecked[1], 'unchecked');
}

/* ========================================================================== */
/* Package Suite Factory                                                       */
/* ========================================================================== */

/* eslint-disable @typescript-eslint/no-explicit-any */

export interface PackageSuiteConfig {
 /** Suite name (e.g., 'vector2', 'matrix3') */
 name: string;
 /** Primary entity for the dimension spec */
 entity: string;
 /** Module export names to extract (e.g., ['Vector2', 'Rotation2']) */
 extract: string[];
 /** Partial dimension overrides (entity is set automatically) */
 dimensions?: Omit<DimensionOverrides, 'entity'>;
 /** GC mode override */
 gcMode?: GcMode;
 /** Register benchmarks using the extracted modules */
 register: (
  add: BenchmarkBuilder['add'],
  triality: (config: TrialityConfig) => void,
  modules: Record<string, any>,
  rawModule: Record<string, any>,
 ) => void;
}

/**
 * Create a suite definition from a declarative config.
 *
 * Encapsulates builder creation, dimension defaults, module extraction
 * with validation, and eslint-disable containment. Suite files using this
 * helper do not need `eslint-disable` or manual `createBenchmarkBuilder()`.
 */
export function definePackageSuite(config: PackageSuiteConfig): () => SuiteDefinition {
 return () => {
  const builder = createBenchmarkBuilder();
  const triality = (tc: TrialityConfig) => addTriality(builder, tc);

  return {
   name: config.name,
   dimensions: defaultDimensions({
    entity: config.entity,
    ...config.dimensions,
   }),
   gcMode: config.gcMode,
   setup(mod: Record<string, unknown>) {
    const extracted: Record<string, any> = {};
    for (const name of config.extract) {
     const exported = mod[name];
     if (exported === undefined) {
      throw new Error(`${config.name} suite: module does not export '${name}'`);
     }
     extracted[name] = exported;
    }
    config.register(builder.add.bind(builder), triality, extracted, mod as Record<string, any>);
   },
   get benchmarks() {
    return builder.entries;
   },
  };
 };
}

/* eslint-enable @typescript-eslint/no-explicit-any */
