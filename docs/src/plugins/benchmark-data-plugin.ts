/**
 * Docusaurus plugin that loads per-package benchmark summary JSON
 * at build time and exposes it via global data for React components.
 *
 * Reads summaries from the benchmark tool's output directory
 * (tools/benchmark/results/summaries/). Each subdirectory is a
 * package name (e.g., math2d/) containing 4 summary JSON files.
 *
 * The benchmark tool owns summary generation (via `npm run tools:bench:summarize`).
 * This plugin is a read-only consumer — it never generates or transforms data.
 */

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

import type { LoadContext, Plugin } from '@docusaurus/types';

import type { AllBenchmarkData } from '../types/benchmark-summaries';

function loadJsonFile<T>(filepath: string): T | null {
 if (!existsSync(filepath)) return null;
 try {
  return JSON.parse(readFileSync(filepath, 'utf-8')) as T;
 } catch {
  return null;
 }
}

export default function benchmarkDataPlugin(context: LoadContext): Plugin<AllBenchmarkData> {
 return {
  name: 'docusaurus-plugin-benchmark-data',

  async loadContent(): Promise<AllBenchmarkData> {
   // Read from the benchmark tool's summary output directory.
   // Path: monorepo-root/tools/benchmark/results/summaries/
   const summariesDirectory = join(
    context.siteDir,
    '..',
    'tools',
    'benchmark',
    'results',
    'summaries',
   );
   const result: AllBenchmarkData = {};

   if (!existsSync(summariesDirectory)) return result;

   const entries = readdirSync(summariesDirectory);
   for (const entry of entries) {
    const entryPath = join(summariesDirectory, entry);
    if (!statSync(entryPath).isDirectory()) continue;

    result[entry] = {
     performance: loadJsonFile(join(entryPath, 'performance-summary.json')),
     comparison: loadJsonFile(join(entryPath, 'comparison-summary.json')),
     stress: loadJsonFile(join(entryPath, 'stress-summary.json')),
     dx: loadJsonFile(join(entryPath, 'dx-summary.json')),
    };
   }

   return result;
  },

  async contentLoaded({ content, actions }): Promise<void> {
   const { setGlobalData } = actions;
   setGlobalData(content);
  },
 };
}
