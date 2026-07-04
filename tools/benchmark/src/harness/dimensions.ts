/**
 * @file harness/dimensions.ts
 * @description Define the dimension matrix for parameterized benchmark execution
 *
 * The 5-axis model enables benchmarks to run across every combination
 * of environment, build mode, determinism mode, validation tier, and
 * mathematical entity. Each suite declares which dimensions it varies
 * over; the runner computes the cartesian product and executes each cell.
 */

/* ========================================================================== */
/* Dimension Axis Types                                                        */
/* ========================================================================== */

/** Execution environment for benchmarks */
export type Environment = 'node' | 'chromium' | 'firefox' | 'webkit';

/** Build mode axis (development includes validation, production is minified) */
export type BuildMode = 'development' | 'production';

/** Determinism mode axis (fdlibm = cross-platform deterministic, native = platform Math) */
export type DeterminismMode = 'fdlibm' | 'native';

/** Validation tier axis (default = strict, safe = fallback, unchecked = no validation) */
export type ValidationTier = 'default' | 'safe' | 'unchecked';

/** Mathematical entity name (e.g., 'Vector2', 'Matrix3') */
export type MathEntity = string;

/* ========================================================================== */
/* Dimension Cell (single point in the matrix)                                 */
/* ========================================================================== */

/** Represent a single point in the dimension matrix */
export interface DimensionCell {
 environment: Environment;
 buildMode: BuildMode;
 determinism?: DeterminismMode;
 tier?: ValidationTier;
 entity: MathEntity;
}

/* ========================================================================== */
/* Dimension Specification (which values each axis can take)                    */
/* ========================================================================== */

/** Specify which values each dimension axis can take */
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
 * Compute the cartesian product of a dimension spec
 *
 * @remarks
 * Returns one DimensionCell per unique combination of axis values.
 * Missing axes use their default values.
 *
 * @param spec - The dimension specification with axis value arrays
 * @returns One DimensionCell per unique combination of axis values
 */
export function cartesianProduct(spec: DimensionSpec): DimensionCell[] {
 const environments = spec.environment ?? DEFAULTS.environment;
 const buildModes = spec.buildMode ?? DEFAULTS.buildMode;
 const determinisms = spec.determinism; // undefined = skip axis
 const tiers = spec.tier; // undefined = skip axis
 const entities = spec.entity ?? DEFAULTS.entity;

 const cells: DimensionCell[] = [];

 for (const environment of environments) {
  for (const buildMode of buildModes) {
   for (const determinism of determinisms ?? [undefined]) {
    for (const tier of tiers ?? [undefined]) {
     for (const entity of entities) {
      cells.push({
       environment,
       buildMode,
       ...(determinism !== undefined ? { determinism } : {}),
       ...(tier !== undefined ? { tier } : {}),
       entity,
      });
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

/** Partial filter constraints for dimension axes */
export type DimensionFilter = Partial<Record<keyof DimensionCell, string>>;

/**
 * Filter dimension cells to match a set of CLI-style constraints
 *
 * @remarks
 * Each filter key restricts the corresponding axis to the given value.
 * Multiple filters are AND-combined (all must match).
 *
 * A filter axis only constrains cells that DECLARE that axis: packages that
 * do not participate in a dimension (for example, determinism outside the
 * deterministic-math package) match any constraint on it, so heterogeneous
 * multi-package runs keep their cells. Cells that declare the axis must
 * still match exactly.
 *
 * Example: `{ tier: 'unchecked', determinism: 'fdlibm' }` keeps cells where
 * tier=unchecked AND determinism=fdlibm, plus cells that declare neither
 * axis.
 *
 * @param cells - The dimension cells to filter
 * @param filter - Partial constraints to match against
 * @returns Cells matching all filter constraints
 */
export function filterCells(cells: DimensionCell[], filter: DimensionFilter): DimensionCell[] {
 return cells.filter((cell) => {
  for (const [key, value] of Object.entries(filter)) {
   const cellValue = cell[key as keyof DimensionCell];
   if (value !== undefined && cellValue !== undefined && cellValue !== value) {
    return false;
   }
  }
  return true;
 });
}

/**
 * CLI flag aliases for dimension axes
 *
 * @remarks
 * Allows short/intuitive flags (e.g., `--build=production`) to map
 * to the canonical axis name (`buildMode`).
 */
const FLAG_ALIASES: Record<string, keyof DimensionCell> = {
 build: 'buildMode',
};

/**
 * Parse CLI arguments into a dimension filter
 *
 * @remarks
 * Accepts `--axis=value` format (e.g., `--tier=unchecked`).
 * Supports aliases defined in FLAG_ALIASES (e.g., `--build=production`).
 *
 * @param args - The CLI argument strings to parse
 * @returns A dimension filter with matched axis constraints
 */
export function parseDimensionFilter(args: string[]): DimensionFilter {
 const filter: DimensionFilter = {};
 const validAxes = new Set<string>(['environment', 'buildMode', 'determinism', 'tier', 'entity']);

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
 * Serialize a dimension cell to a stable string key
 *
 * @remarks
 * Used for keying results in the JSON report and for
 * human-readable identification of benchmark results.
 *
 * @param cell - The dimension cell to serialize
 * @returns A colon-separated string key (e.g., 'node:development:fdlibm:Vector2')
 */
export function cellToKey(cell: DimensionCell): string {
 const parts: string[] = [cell.environment, cell.buildMode];
 if (cell.determinism !== undefined) parts.push(cell.determinism);
 if (cell.tier !== undefined) parts.push(cell.tier);
 parts.push(cell.entity);
 return parts.join(':');
}

/**
 * Format a human-readable label for a dimension cell
 *
 * @param cell - The dimension cell to format
 * @returns A label like '[node] Vector2 (development, fdlibm)'
 */
export function cellToLabel(cell: DimensionCell): string {
 const details: string[] = [cell.buildMode];
 if (cell.determinism !== undefined) details.push(cell.determinism);
 if (cell.tier !== undefined) details.push(cell.tier);
 return `[${cell.environment}] ${cell.entity} (${details.join(', ')})`;
}
