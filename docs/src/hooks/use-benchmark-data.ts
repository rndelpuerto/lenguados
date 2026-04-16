/**
 * Hook to access benchmark summary data loaded by the benchmark data plugin.
 *
 * Data is keyed by package name. Pass a package name to get that package's
 * data, or call without arguments to get all packages.
 */

import { usePluginData } from '@docusaurus/useGlobalData';

interface PackageBenchmarkData {
 performance: unknown | null;
 comparison: unknown | null;
 stress: unknown | null;
 dx: unknown | null;
}

type AllBenchmarkData = Record<string, PackageBenchmarkData>;

/**
 * Benchmark data accessor for Docusaurus pages
 *
 * @param packageName - package to get data for, omit for all packages
 * @returns package-specific or all benchmark data
 * @example useBenchmarkData('math2d')
 * @category Helpers
 * @since 0.6.0
 */
export function useBenchmarkData(packageName?: string): PackageBenchmarkData | AllBenchmarkData {
 const data = usePluginData('docusaurus-plugin-benchmark-data') as AllBenchmarkData;
 if (packageName) {
  return data[packageName] ?? { performance: null, comparison: null, stress: null, dx: null };
 }
 return data;
}
