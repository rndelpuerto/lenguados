/**
 * @file harness/library-adapter.ts
 * @description Define the library adapter interface for cross-library comparison
 *
 * Normalizes any 2D math library's API into a standard operation
 * vocabulary, enabling side-by-side benchmarking with identical
 * measurement methodology.
 */

/* ========================================================================== */
/* Types                                                                       */
/* ========================================================================== */

/**
 * A benchmark-ready closure for a single standard operation
 *
 * @remarks
 * MUST return a value (for DCE protection via do_not_optimize).
 * The closure should use the library's idiomatic patterns
 * (e.g., pre-allocated output arrays for gl-matrix).
 */
export type OperationFn = () => unknown;

/**
 * Normalize a third-party library's API into the standard operation vocabulary
 *
 * @remarks
 * Each adapter wraps a third-party library's API into the standard
 * operation vocabulary, enabling the same mitata runner and statistics
 * engine to measure all libraries identically.
 *
 * @example
 * ```typescript
 * const adapter: LibraryAdapter = {
 *  name: 'gl-matrix',
 *  version: '3.4.3',
 *  getOperations() {
 *   const out = vec2.create();
 *   const a = vec2.fromValues(1, 2);
 *   const b = vec2.fromValues(3, 4);
 *   return new Map([
 *    ['vectorAdd', () => vec2.add(out, a, b)],
 *    ['vectorDot', () => vec2.dot(a, b)],
 *   ]);
 *  },
 * };
 * ```
 */
export interface LibraryAdapter {
 /** Library name (e.g., "gl-matrix", "math2d") */
 readonly name: string;
 /** Library version (e.g., "3.4.3") */
 readonly version: string;
 /**
  * Return a map of standard vocabulary operation names to benchmark-ready closures
  *
  * @remarks
  * Operations not supported by this library should be omitted
  * from the map (reported as "N/A" in comparison tables).
  *
  * @returns Map of operation names to benchmark closures
  */
 getOperations(): Map<string, OperationFn>;
}

/* ========================================================================== */
/* Adapter Registry                                                            */
/* ========================================================================== */

const adapterRegistry = new Map<string, LibraryAdapter>();

/**
 * Register a library adapter for cross-library comparison
 *
 * @param adapter - The library adapter to register
 */
export function registerAdapter(adapter: LibraryAdapter): void {
 adapterRegistry.set(adapter.name, adapter);
}

/**
 * Get all registered adapters
 *
 * @returns A new Map containing all registered adapters
 */
export function getRegisteredAdapters(): Map<string, LibraryAdapter> {
 return new Map(adapterRegistry);
}

/**
 * Get a specific adapter by name
 *
 * @param name - The library name to look up
 * @returns The adapter, or undefined if not registered
 */
export function getAdapter(name: string): LibraryAdapter | undefined {
 return adapterRegistry.get(name);
}

/**
 * Clear all registered adapters (for testing)
 */
export function clearAdapters(): void {
 adapterRegistry.clear();
}
