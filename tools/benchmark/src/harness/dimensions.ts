/**
 * Dimension matrix for parameterized benchmark execution.
 *
 * The 5-axis model enables benchmarks to run across every combination
 * of environment, build mode, determinism mode, validation tier, and
 * mathematical entity. Each suite declares which dimensions it varies
 * over; the runner computes the cartesian product and executes each cell.
 */

/* ========================================================================== */
/* Dimension Axis Types                                                        */
/* ========================================================================== */

export type Environment = 'node' | 'chromium' | 'firefox' | 'webkit';

export type BuildMode = 'development' | 'production';

export type DeterminismMode = 'fdlibm' | 'native';

export type ValidationTier = 'default' | 'safe' | 'unchecked';

export type MathEntity =
 | 'Vector2'
 | 'Rotation2'
 | 'Complex'
 | 'Interval'
 | 'Matrix2'
 | 'Matrix3'
 | 'Transform2'
 | 'scalar'
 | 'angle'
 | 'numeric'
 | 'deterministic';

/* ========================================================================== */
/* Dimension Cell (single point in the matrix)                                 */
/* ========================================================================== */

export interface DimensionCell {
 environment: Environment;
 buildMode: BuildMode;
 determinism: DeterminismMode;
 tier: ValidationTier;
 entity: MathEntity;
}

/* ========================================================================== */
/* Dimension Specification (which values each axis can take)                    */
/* ========================================================================== */

export interface DimensionSpec {
 environment?: Environment[];
 buildMode?: BuildMode[];
 determinism?: DeterminismMode[];
 tier?: ValidationTier[];
 entity?: MathEntity[];
}

const DEFAULTS: Required<DimensionSpec> = {
 environment: ['node'],
 buildMode: ['development', 'production'],
 determinism: ['fdlibm', 'native'],
 tier: ['default'],
 entity: ['Vector2'],
};

/* ========================================================================== */
/* Cartesian Product                                                           */
/* ========================================================================== */

/**
 * Compute the cartesian product of a dimension spec.
 *
 * Returns one DimensionCell per unique combination of axis values.
 * Missing axes use their default values.
 */
export function cartesianProduct(spec: DimensionSpec): DimensionCell[] {
 const environments = spec.environment ?? DEFAULTS.environment;
 const buildModes = spec.buildMode ?? DEFAULTS.buildMode;
 const determinisms = spec.determinism ?? DEFAULTS.determinism;
 const tiers = spec.tier ?? DEFAULTS.tier;
 const entities = spec.entity ?? DEFAULTS.entity;

 const cells: DimensionCell[] = [];

 for (const environment of environments) {
  for (const buildMode of buildModes) {
   for (const determinism of determinisms) {
    for (const tier of tiers) {
     for (const entity of entities) {
      cells.push({ environment, buildMode, determinism, tier, entity });
     }
    }
   }
  }
 }

 return cells;
}

/* ========================================================================== */
/* Dimension Filtering                                                         */
/* ========================================================================== */

export type DimensionFilter = Partial<Record<keyof DimensionCell, string>>;

/**
 * Filter dimension cells to match a set of CLI-style constraints.
 *
 * Each filter key restricts the corresponding axis to the given value.
 * Multiple filters are AND-combined (all must match).
 *
 * Example: `{ tier: 'unchecked', determinism: 'fdlibm' }` keeps only
 * cells where tier=unchecked AND determinism=fdlibm.
 */
export function filterCells(cells: DimensionCell[], filter: DimensionFilter): DimensionCell[] {
 return cells.filter((cell) => {
  for (const [key, value] of Object.entries(filter)) {
   if (value !== undefined && cell[key as keyof DimensionCell] !== value) {
    return false;
   }
  }
  return true;
 });
}

/**
 * Parse CLI arguments into a dimension filter.
 *
 * Accepts `--axis=value` format (e.g., `--tier=unchecked`).
 */
/**
 * CLI flag aliases for dimension axes.
 *
 * Allows short/intuitive flags (e.g., `--build=production`) to map
 * to the canonical axis name (`buildMode`).
 */
const FLAG_ALIASES: Record<string, keyof DimensionCell> = {
 build: 'buildMode',
};

export function parseDimensionFilter(args: string[]): DimensionFilter {
 const filter: DimensionFilter = {};
 const validAxes = new Set<string>([
  'environment', 'buildMode', 'determinism', 'tier', 'entity',
 ]);

 for (const arg of args) {
  const match = arg.match(/^--(\w+)=(.+)$/);
  if (match) {
   let [, key, value] = match;
   if (!key || !value) continue;
   // Resolve aliases (e.g., --build → buildMode)
   key = FLAG_ALIASES[key] ?? key;
   if (validAxes.has(key)) {
    filter[key as keyof DimensionCell] = value;
   }
  }
 }

 return filter;
}

/* ========================================================================== */
/* Cell Serialization                                                          */
/* ========================================================================== */

/**
 * Serialize a dimension cell to a stable string key.
 *
 * Used for keying results in the JSON report and for
 * human-readable identification of benchmark results.
 */
export function cellToKey(cell: DimensionCell): string {
 return `${cell.environment}:${cell.buildMode}:${cell.determinism}:${cell.tier}:${cell.entity}`;
}

/**
 * Human-readable label for a dimension cell.
 */
export function cellToLabel(cell: DimensionCell): string {
 return `[${cell.environment}] ${cell.entity} (${cell.buildMode}, ${cell.determinism}, ${cell.tier})`;
}
