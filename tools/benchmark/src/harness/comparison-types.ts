/**
 * @file harness/comparison-types.ts
 * @description Define the configuration interface for cross-library comparison
 *
 * Each package that supports cross-library comparison provides a
 * ComparisonConfig (by convention at `src/packages/{name}/comparison-config.ts`)
 * declaring its adapters, reference library, operation vocabulary, and test
 * conditions. The comparison script resolves it dynamically — shared code
 * never names a specific package.
 */

import type { LibraryAdapter } from './library-adapter.ts';
import type { ComparisonConditions } from './comparison-reporter.ts';
import type { OperationSpec } from './comparison-reporter.ts';

/** Declare a package's cross-library comparison setup */
export interface ComparisonConfig {
 /** Build the adapters to benchmark (target package first, reference last) */
 buildAdapters: () => Promise<LibraryAdapter[]>;
 /** Name of the reference library for scoring */
 referenceLibrary: string;
 /** Standard vocabulary operation names */
 operationNames: Set<string>;
 /** Full operation specifications for reporting */
 allOperations: OperationSpec[];
 /** Test conditions banner persisted with the results */
 conditions: ComparisonConditions;
 /** Console banner lines describing the conditions */
 bannerLines: (adapters: LibraryAdapter[]) => string[];
}
