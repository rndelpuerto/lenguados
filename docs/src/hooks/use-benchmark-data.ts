/**
 * Hooks to access benchmark summary data loaded by the benchmark data plugin.
 *
 * Data is keyed by package name. `useBenchmarkData(packageName)` returns one
 * package's four summaries; `useAllBenchmarkData()` returns everything.
 */

import { usePluginData } from '@docusaurus/useGlobalData';

import type { AllBenchmarkData, PackageBenchmarkData } from '../types/benchmark-summaries';

const EMPTY_PACKAGE_DATA: PackageBenchmarkData = {
 performance: null,
 comparison: null,
 stress: null,
 dx: null,
};

/**
 * Benchmark data accessor for a single package
 *
 * @param packageName - package to get data for
 * @returns the package's four summaries (each null when unavailable)
 * @example useBenchmarkData('math2d')
 * @category Helpers
 * @since 0.6.0
 */
export function useBenchmarkData(packageName: string): PackageBenchmarkData {
 const data = usePluginData('docusaurus-plugin-benchmark-data') as AllBenchmarkData;
 return data[packageName] ?? EMPTY_PACKAGE_DATA;
}

/**
 * Benchmark data accessor for all packages
 *
 * @returns all packages' benchmark data keyed by package name
 * @example useAllBenchmarkData()
 * @category Helpers
 * @since 0.7.0
 */
export function useAllBenchmarkData(): AllBenchmarkData {
 return usePluginData('docusaurus-plugin-benchmark-data') as AllBenchmarkData;
}
