/**
 * Library adapter interface for cross-library comparison.
 *
 * Normalizes any 2D math library's API into a standard operation
 * vocabulary, enabling side-by-side benchmarking with identical
 * measurement methodology.
 */

/* ========================================================================== */
/* Types                                                                       */
/* ========================================================================== */

/**
 * A benchmark-ready closure for a single standard operation.
 *
 * MUST return a value (for DCE protection via do_not_optimize).
 * The closure should use the library's idiomatic patterns
 * (e.g., pre-allocated output arrays for gl-matrix).
 */
export type OperationFn = () => unknown;

/**
 * Interface that every library adapter must implement.
 *
 * Each adapter wraps a third-party library's API into the standard
 * operation vocabulary, enabling the same mitata runner and statistics
 * engine to measure all libraries identically.
 */
export interface LibraryAdapter {
 /** Library name (e.g., "gl-matrix", "math2d") */
 readonly name: string;
 /** Library version (e.g., "3.4.3") */
 readonly version: string;
 /**
  * Returns a map of standard vocabulary operation names to
  * benchmark-ready closures.
  *
  * Operations not supported by this library should be omitted
  * from the map (reported as "N/A" in comparison tables).
  */
 getOperations(): Map<string, OperationFn>;
}

/* ========================================================================== */
/* Adapter Registry                                                            */
/* ========================================================================== */

const adapterRegistry = new Map<string, LibraryAdapter>();

/**
 * Register a library adapter for cross-library comparison.
 */
export function registerAdapter(adapter: LibraryAdapter): void {
 adapterRegistry.set(adapter.name, adapter);
}

/**
 * Get all registered adapters.
 */
export function getRegisteredAdapters(): Map<string, LibraryAdapter> {
 return new Map(adapterRegistry);
}

/**
 * Get a specific adapter by name.
 */
export function getAdapter(name: string): LibraryAdapter | undefined {
 return adapterRegistry.get(name);
}

/**
 * Clear all registered adapters (for testing).
 */
export function clearAdapters(): void {
 adapterRegistry.clear();
}
